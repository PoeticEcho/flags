import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computePaperRegions,
  pointInPolygon,
  extractClosedStrokeLoop,
  hitClosedStrokeLoop
} from '../src/planar-regions.js';
import { getRegions, hitRegion } from '../src/flag-art.js';
import { paintRegion, regionColour } from '../src/custom-shapes.js';

test('single floating line keeps 1 background rect without subdividing paper', () => {
  const shapes = [
    { type: 'line', x1: 120, y1: 120, x2: 480, y2: 280 }
  ];
  const regions = computePaperRegions(shapes);
  assert.equal(regions.length, 1);
  assert.equal(regions[0].type, 'rect');
  assert.equal(regions[0].paintRegion, 0);
  assert.equal(regions[0].part, undefined);
});

test('3 lines from left border meeting at right border subdivide flag into 4 independently paintable wedge sections', () => {
  // Matches the user screenshot: 3 straight lines from left edge meeting at right edge midpoint
  const shapes = [
    { type: 'line', x1: 2, y1: 42, x2: 596, y2: 196 },
    { type: 'line', x1: 2, y1: 196, x2: 596, y2: 196 },
    { type: 'line', x1: 4, y1: 396, x2: 596, y2: 196 }
  ];
  const art = {
    colors: ['#ffffff'],
    strokes: [],
    shapes
  };
  const regions = getRegions(null, true, shapes);
  const paperRegions = regions.filter((r) => r.paintRegion === 0);
  assert.equal(paperRegions.length, 4, 'Expected 4 divided paper regions');
  assert.deepEqual(
    paperRegions.map((r) => r.part),
    [0, 1, 2, 3]
  );

  // Hit test in each of the 4 wedge sections
  const topHit = hitRegion([300, 40], regions);
  const upperLeftHit = hitRegion([100, 140], regions);
  const lowerLeftHit = hitRegion([100, 260], regions);
  const bottomHit = hitRegion([450, 350], regions);

  const hitParts = new Set([
    regions[topHit]?.part,
    regions[upperLeftHit]?.part,
    regions[lowerLeftHit]?.part,
    regions[bottomHit]?.part
  ]);
  assert.equal(hitParts.size, 4, 'All 4 wedge sections should resolve to distinct parts');

  // Paint each of the 4 sections with a different colour using paintRegion
  let nextArt = paintRegion(art, 0, regions[topHit].part, '#ef4444');
  nextArt = paintRegion(nextArt, 0, regions[upperLeftHit].part, '#3b82f6');
  nextArt = paintRegion(nextArt, 0, regions[lowerLeftHit].part, '#22c55e');
  nextArt = paintRegion(nextArt, 0, regions[bottomHit].part, '#eab308');

  assert.equal(regionColour(nextArt, 0, regions[topHit].part), '#ef4444');
  assert.equal(regionColour(nextArt, 0, regions[upperLeftHit].part), '#3b82f6');
  assert.equal(regionColour(nextArt, 0, regions[lowerLeftHit].part), '#22c55e');
  assert.equal(regionColour(nextArt, 0, regions[bottomHit].part), '#eab308');
});

test('3 lines forming a closed triangle inside the flag create an independently paintable closed polygon region', () => {
  const shapes = [
    { type: 'line', x1: 300, y1: 80, x2: 180, y2: 300 },
    { type: 'line', x1: 180, y1: 300, x2: 420, y2: 300 },
    { type: 'line', x1: 420, y1: 300, x2: 300, y2: 80 }
  ];
  const art = {
    colors: ['#ffffff'],
    strokes: [],
    shapes
  };
  const regions = getRegions(null, true, shapes);
  const paperRegions = regions.filter((r) => r.paintRegion === 0);
  assert.equal(paperRegions.length, 2, 'Expected outer background + inner closed triangle');

  // Clicking inside the triangle hits the inner polygon (higher depth / later index)
  const insideIdx = hitRegion([300, 220], regions);
  const outsideIdx = hitRegion([50, 50], regions);
  assert.notEqual(insideIdx, outsideIdx);
  assert.equal(regions[insideIdx].part, 1);
  assert.equal(regions[outsideIdx].part, 0);

  let nextArt = paintRegion(art, 0, regions[outsideIdx].part, '#dbeafe');
  nextArt = paintRegion(nextArt, 0, regions[insideIdx].part, '#f97316');
  assert.equal(regionColour(nextArt, 0, 0), '#dbeafe');
  assert.equal(regionColour(nextArt, 0, 1), '#f97316');
});

test('closed freehand stroke loop is detected and hit-testable for paint bucket fill', () => {
  // Draw a roughly circular closed loop around (300, 200) with radius 70
  const points = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    points.push([
      Math.round(300 + Math.cos(angle) * 70),
      Math.round(200 + Math.sin(angle) * 70)
    ]);
  }
  const stroke = {
    tool: 'marker',
    color: '#17362a',
    size: 10,
    region: 0,
    points
  };

  const loop = extractClosedStrokeLoop(stroke);
  assert.ok(loop && loop.length >= 3, 'Closed freehand stroke should produce a polygon loop');
  assert.equal(pointInPolygon([300, 200], loop), true);
  assert.equal(pointInPolygon([50, 50], loop), false);

  const hit = hitClosedStrokeLoop([300, 200], [stroke]);
  assert.ok(hit, 'Tapping inside closed freehand stroke should hit the loop');
  assert.equal(hit.strokeIndex, 0);
});
