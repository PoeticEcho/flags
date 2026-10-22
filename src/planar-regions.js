// Planar subdivision of the 600x400 flag paper by line shapes, plus closed-loop
// detection for freehand strokes.

const WIDTH = 600;
const HEIGHT = 400;
const BORDER_SNAP = 12;
const VERTEX_SNAP = 12;
const SEGMENT_SNAP = 10;
const MIN_FACE_AREA = 25;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function snapToBorder([x, y]) {
  let sx = clamp(x, 0, WIDTH);
  let sy = clamp(y, 0, HEIGHT);
  if (sx <= BORDER_SNAP) sx = 0;
  else if (sx >= WIDTH - BORDER_SNAP) sx = WIDTH;
  if (sy <= BORDER_SNAP) sy = 0;
  else if (sy >= HEIGHT - BORDER_SNAP) sy = HEIGHT;
  return [sx, sy];
}

function isOnBorder([x, y]) {
  return x === 0 || x === WIDTH || y === 0 || y === HEIGHT;
}

function projectPointOnSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return { point: a, dist: Math.hypot(p[0] - a[0], p[1] - a[1]), t: 0 };
  const t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2, 0, 1);
  const proj = [a[0] + t * dx, a[1] + t * dy];
  return { point: proj, dist: Math.hypot(p[0] - proj[0], p[1] - proj[1]), t };
}

function segmentIntersection(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]];
  const s = [d[0] - c[0], d[1] - c[1]];
  const denom = r[0] * s[1] - r[1] * s[0];
  const qp = [c[0] - a[0], c[1] - a[1]];
  if (Math.abs(denom) < 1e-7) return null;
  const t = (qp[0] * s[1] - qp[1] * s[0]) / denom;
  const u = (qp[0] * r[1] - qp[1] * r[0]) / denom;
  const eps = -1e-4;
  if (t >= eps && t <= 1 - eps && u >= eps && u <= 1 - eps) {
    const tc = clamp(t, 0, 1);
    const uc = clamp(u, 0, 1);
    return {
      t: tc,
      u: uc,
      point: [a[0] + tc * r[0], a[1] + tc * r[1]],
    };
  }
  return null;
}

export function pointInPolygon(point, vs) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [xi, yi] = vs[i];
    const [xj, yj] = vs[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function polygonSignedArea(pts) {
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

function polygonCentroid(pts) {
  let cx = 0;
  let cy = 0;
  let area2 = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const cross = x1 * y2 - x2 * y1;
    area2 += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  if (Math.abs(area2) < 1e-5) {
    const sx = pts.reduce((acc, p) => acc + p[0], 0) / pts.length;
    const sy = pts.reduce((acc, p) => acc + p[1], 0) / pts.length;
    return [sx, sy];
  }
  return [cx / (3 * area2), cy / (3 * area2)];
}

export function polygonPathD(pts) {
  if (!pts || !pts.length) return "";
  return (
    pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${Number(x.toFixed(2))} ${Number(y.toFixed(2))}`)
      .join(" ") + " Z"
  );
}

export function computePaperRegions(shapes = []) {
  const lines = shapes.filter((s) => s && s.type === "line");
  if (!lines.length) {
    return [{ type: "rect", x: 0, y: 0, width: WIDTH, height: HEIGHT, paintRegion: 0, shapeIndex: -1 }];
  }

  // 1. Collect and snap endpoints of user lines
  const endpoints = [];
  const rawSegments = lines.map((line) => {
    const p1 = snapToBorder([line.x1, line.y1]);
    const p2 = snapToBorder([line.x2, line.y2]);
    endpoints.push(p1, p2);
    return [p1, p2];
  });

  // Cluster nearby endpoints so hand-placed lines meeting at a corner share an exact vertex
  const clusters = [];
  for (const pt of endpoints) {
    const found = clusters.find((c) => Math.hypot(c.point[0] - pt[0], c.point[1] - pt[1]) <= VERTEX_SNAP);
    if (!found) {
      clusters.push({ point: [...pt], members: [pt] });
    } else {
      found.members.push(pt);
      // Prefer border coordinates when merging
      const bx = found.members.find((m) => m[0] === 0 || m[0] === WIDTH);
      const by = found.members.find((m) => m[1] === 0 || m[1] === HEIGHT);
      const avgX = found.members.reduce((s, m) => s + m[0], 0) / found.members.length;
      const avgY = found.members.reduce((s, m) => s + m[1], 0) / found.members.length;
      found.point = snapToBorder([bx ? bx[0] : avgX, by ? by[1] : avgY]);
    }
  }

  const snapEndpoint = (pt) => {
    const found = clusters.find((c) => Math.hypot(c.point[0] - pt[0], c.point[1] - pt[1]) <= VERTEX_SNAP);
    return found ? [...found.point] : pt;
  };

  const userSegments = rawSegments
    .map(([a, b]) => [snapEndpoint(a), snapEndpoint(b)])
    .filter(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]) >= 2);

  // Snap endpoints that stop just short of another user segment (T-junction)
  for (let i = 0; i < userSegments.length; i++) {
    for (let endIdx = 0; endIdx < 2; endIdx++) {
      const pt = userSegments[i][endIdx];
      if (isOnBorder(pt)) continue;
      let best = null;
      for (let j = 0; j < userSegments.length; j++) {
        if (i === j) continue;
        const proj = projectPointOnSegment(pt, userSegments[j][0], userSegments[j][1]);
        if (proj.dist <= SEGMENT_SNAP && (!best || proj.dist < best.dist)) {
          best = proj;
        }
      }
      if (best) {
        userSegments[i][endIdx] = snapToBorder(best.point);
      }
    }
  }

  const borderSegments = [
    [
      [0, 0],
      [WIDTH, 0],
    ],
    [
      [WIDTH, 0],
      [WIDTH, HEIGHT],
    ],
    [
      [WIDTH, HEIGHT],
      [0, HEIGHT],
    ],
    [
      [0, HEIGHT],
      [0, 0],
    ],
  ];

  const allSegments = [...borderSegments, ...userSegments];

  // 2. Find all intersection points along each segment
  const splits = allSegments.map(([a, b]) => [
    { t: 0, point: a },
    { t: 1, point: b },
  ]);

  for (let i = 0; i < allSegments.length; i++) {
    const [a, b] = allSegments[i];
    for (let j = i + 1; j < allSegments.length; j++) {
      const [c, d] = allSegments[j];
      const hit = segmentIntersection(a, b, c, d);
      if (hit) {
        splits[i].push({ t: hit.t, point: hit.point });
        splits[j].push({ t: hit.u, point: hit.point });
      }
      // Also check if endpoints of one segment lie on the other segment
      for (const [segIdx, pt, targetIdx, s0, s1] of [
        [i, a, j, c, d],
        [i, b, j, c, d],
        [j, c, i, a, b],
        [j, d, i, a, b],
      ]) {
        const proj = projectPointOnSegment(pt, s0, s1);
        if (proj.dist <= 1.5) {
          splits[targetIdx].push({ t: proj.t, point: proj.point });
        }
      }
    }
  }

  // 3. Build deduplicated vertex list and undirected edge list
  const vertices = [];
  const getVertexId = (pt) => {
    const p = [
      Math.abs(pt[0]) < 0.5 ? 0 : Math.abs(pt[0] - WIDTH) < 0.5 ? WIDTH : pt[0],
      Math.abs(pt[1]) < 0.5 ? 0 : Math.abs(pt[1] - HEIGHT) < 0.5 ? HEIGHT : pt[1],
    ];
    for (let i = 0; i < vertices.length; i++) {
      if (Math.hypot(vertices[i][0] - p[0], vertices[i][1] - p[1]) <= 1.5) {
        return i;
      }
    }
    vertices.push(p);
    return vertices.length - 1;
  };

  const adj = new Map();
  const addEdge = (u, v) => {
    if (u === v) return;
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u).add(v);
    adj.get(v).add(u);
  };

  for (let i = 0; i < allSegments.length; i++) {
    const list = splits[i].sort((x, y) => x.t - y.t);
    let prev = getVertexId(list[0].point);
    for (let k = 1; k < list.length; k++) {
      const curr = getVertexId(list[k].point);
      if (curr !== prev) {
        addEdge(prev, curr);
        prev = curr;
      }
    }
  }

  // 4. Prune degree-1 vertices and bridge edges so every remaining edge bounds distinct faces
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, neighbors] of [...adj.entries()]) {
      if (neighbors.size <= 1) {
        for (const v of neighbors) adj.get(v)?.delete(u);
        adj.delete(u);
        changed = true;
      }
    }
  }

  // Remove bridge edges (an edge u-v is a bridge if v is unreachable from u when u-v is removed)
  const edges = [];
  for (const [u, neighbors] of adj.entries()) {
    for (const v of neighbors) {
      if (u < v) edges.push([u, v]);
    }
  }
  let removedBridge = false;
  for (const [u, v] of edges) {
    if (!adj.get(u)?.has(v)) continue;
    adj.get(u).delete(v);
    adj.get(v).delete(u);
    // BFS from u to v
    const visited = new Set([u]);
    const queue = [u];
    let reachable = false;
    while (queue.length > 0) {
      const cur = queue.shift();
      if (cur === v) {
        reachable = true;
        break;
      }
      for (const nxt of adj.get(cur) || []) {
        if (!visited.has(nxt)) {
          visited.add(nxt);
          queue.push(nxt);
        }
      }
    }
    if (reachable) {
      adj.get(u).add(v);
      adj.get(v).add(u);
    } else {
      removedBridge = true;
    }
  }

  if (removedBridge) {
    let pruneAgain = true;
    while (pruneAgain) {
      pruneAgain = false;
      for (const [u, neighbors] of [...adj.entries()]) {
        if (neighbors.size <= 1) {
          for (const v of neighbors) adj.get(v)?.delete(u);
          adj.delete(u);
          pruneAgain = true;
        }
      }
    }
  }

  // 5. Half-edge face extraction
  const outgoing = new Map();
  for (const [u, neighbors] of adj.entries()) {
    if (neighbors.size < 2) continue;
    const sorted = [...neighbors]
      .map((v) => ({
        v,
        angle: Math.atan2(vertices[v][1] - vertices[u][1], vertices[v][0] - vertices[u][0]),
      }))
      .sort((a, b) => a.angle - b.angle)
      .map((item) => item.v);
    outgoing.set(u, sorted);
  }

  const visitedHalfEdges = new Set();
  const halfEdgeKey = (u, v) => `${u}->${v}`;
  const rawFaces = [];

  for (const [u, list] of outgoing.entries()) {
    for (const v of list) {
      const startKey = halfEdgeKey(u, v);
      if (visitedHalfEdges.has(startKey)) continue;

      const cycle = [];
      let curU = u;
      let curV = v;
      let steps = 0;
      while (!visitedHalfEdges.has(halfEdgeKey(curU, curV)) && steps <= vertices.length * 4) {
        visitedHalfEdges.add(halfEdgeKey(curU, curV));
        cycle.push(curU);
        const vOut = outgoing.get(curV);
        if (!vOut || !vOut.length) break;
        const revIdx = vOut.indexOf(curU);
        if (revIdx < 0) break;
        const nextV = vOut[(revIdx - 1 + vOut.length) % vOut.length];
        curU = curV;
        curV = nextV;
        steps++;
      }

      if (curU === u && curV === v && cycle.length >= 3) {
        const pts = cycle.map((id) => vertices[id]);
        const area = polygonSignedArea(pts);
        if (area >= MIN_FACE_AREA) {
          rawFaces.push({
            points: pts,
            area,
            centroid: polygonCentroid(pts),
          });
        }
      }
    }
  }

  if (rawFaces.length <= 1) {
    return [{ type: "rect", x: 0, y: 0, width: WIDTH, height: HEIGHT, paintRegion: 0, shapeIndex: -1 }];
  }

  // 6. Compute nesting depth (for disconnected inner closed loops) and sort deterministically
  for (let i = 0; i < rawFaces.length; i++) {
    let depth = 0;
    const sample = rawFaces[i].centroid;
    for (let j = 0; j < rawFaces.length; j++) {
      if (i === j) continue;
      if (rawFaces[j].area > rawFaces[i].area * 1.02 && pointInPolygon(sample, rawFaces[j].points)) {
        depth++;
      }
    }
    rawFaces[i].depth = depth;
  }

  rawFaces.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    const ay = Math.round(a.centroid[1] / 8);
    const by = Math.round(b.centroid[1] / 8);
    if (ay !== by) return ay - by;
    return a.centroid[0] - b.centroid[0];
  });

  return rawFaces.map((face, index) => ({
    type: "polygon",
    points: face.points,
    d: polygonPathD(face.points),
    paintRegion: 0,
    part: index,
    shapeIndex: -1,
  }));
}

// Detect if a freehand stroke forms a closed curve (폐곡선) and return its enclosed polygon
export function extractClosedStrokeLoop(stroke) {
  if (!stroke || stroke.tool === "eraser" || !Array.isArray(stroke.points) || stroke.points.length < 4) {
    return null;
  }
  const pts = stroke.points;
  const closeThreshold = Math.max(20, (stroke.size || 12) * 1.25);

  // Check if any non-adjacent segments self-intersect
  for (let i = 0; i < pts.length - 3; i++) {
    for (let j = i + 2; j < pts.length - 1; j++) {
      const hit = segmentIntersection(pts[i], pts[i + 1], pts[j], pts[j + 1]);
      if (hit) {
        const loop = [hit.point, ...pts.slice(i + 1, j + 1), hit.point];
        if (Math.abs(polygonSignedArea(loop)) >= 120) {
          return loop;
        }
      }
    }
  }

  // Or check if start and end points are close enough to form a closed loop
  const first = pts[0];
  const last = pts.at(-1);
  if (Math.hypot(last[0] - first[0], last[1] - first[1]) <= closeThreshold) {
    if (Math.abs(polygonSignedArea(pts)) >= 120) {
      return pts;
    }
  }

  return null;
}

export function hitClosedStrokeLoop(point, strokes = []) {
  for (let i = strokes.length - 1; i >= 0; i--) {
    const loop = extractClosedStrokeLoop(strokes[i]);
    if (loop && pointInPolygon(point, loop)) {
      return { strokeIndex: i, loop };
    }
  }
  return null;
}
