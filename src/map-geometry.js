const EPS=1e-9;
export function ringArea(ring){let area=0;for(let i=0;i<ring.length-1;i++)area+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];return area/2;}
function closed(ring){if(!ring.length)return ring;const first=ring[0],last=ring.at(-1);return Math.abs(first[0]-last[0])<EPS&&Math.abs(first[1]-last[1])<EPS?ring:[...ring,[...first]];}
function unwrapRing(ring){
 const out=[];for(const p of ring){let x=p[0];const previous=out.at(-1)?.[0];if(previous!==undefined){while(x-previous>180)x-=360;while(x-previous<-180)x+=360;}out.push([x,Math.max(-85.051129,Math.min(85.051129,p[1]))]);}
 if(out.length&&Math.abs(out.at(-1)[0]-out[0][0])>180){const pole=out.reduce((s,p)=>s+p[1],0)<0?-85.051129:85.051129;out.push([out.at(-1)[0],pole],[out[0][0],pole]);}
 return closed(out);
}
function clipHalfPlane(points,x,greater){
 if(!points.length)return [];const out=[],inside=p=>greater?p[0]>=x-EPS:p[0]<=x+EPS;let previous=points.at(-1),wasInside=inside(previous);
 for(const current of points){const isInside=inside(current);if(isInside!==wasInside){const t=(x-previous[0])/(current[0]-previous[0]);out.push([x,previous[1]+t*(current[1]-previous[1])]);}if(isInside)out.push([...current]);previous=current;wasInside=isInside;}return out;
}
function clipRing(ring,left,right,shift,outer){
 const open=ring.slice(0,-1);const points=clipHalfPlane(clipHalfPlane(open,left,true),right,false);const unique=[];
 for(const p of points){const q=[Math.max(-180,Math.min(180,p[0]-shift)),p[1]];if(!unique.length||Math.abs(q[0]-unique.at(-1)[0])>EPS||Math.abs(q[1]-unique.at(-1)[1])>EPS)unique.push(q);}
 const polygon=closed(unique),result=[];for(let i=0;i<polygon.length;i++){const p=polygon[i],previous=result.at(-1);if(previous&&Math.abs(p[0]-previous[0])>180){const steps=Math.ceil(Math.abs(p[0]-previous[0])/90);for(let j=1;j<steps;j++)result.push([previous[0]+(p[0]-previous[0])*j/steps,previous[1]+(p[1]-previous[1])*j/steps]);}result.push(p);}
 if(result.length<4||Math.abs(ringArea(result))<EPS)return null;
 return (ringArea(result)>0)===outer?result:result.reverse();
}
export function splitAntimeridianGeometry(geometry){
 if(!geometry||!['Polygon','MultiPolygon'].includes(geometry.type))return geometry;
 const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates,output=[];
 for(const polygon of polygons){if(!polygon[0]?.length)continue;const shell=unwrapRing(polygon[0]);const xs=shell.map(p=>p[0]),min=Math.min(...xs),max=Math.max(...xs),middle=(min+max)/2;
  const holes=polygon.slice(1).map(r=>{const hole=unwrapRing(r),hx=hole.map(p=>p[0]),center=(Math.min(...hx)+Math.max(...hx))/2,shift=Math.round((middle-center)/360)*360;return hole.map(([x,y])=>[x+shift,y]);});
  for(let strip=Math.floor((min+180)/360);strip<=Math.floor((max+180-EPS)/360);strip++){
   const shift=strip*360,left=-180+shift,right=180+shift,outer=clipRing(shell,left,right,shift,true);if(!outer)continue;
   output.push([outer,...holes.map(r=>clipRing(r,left,right,shift,false)).filter(Boolean)]);
  }
 }
 return {type:'MultiPolygon',coordinates:output};
}
export function pointInRing(point,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
export function pointInGeometry(point,geometry){const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;return polygons.some(p=>pointInRing(point,p[0])&&!p.slice(1).some(h=>pointInRing(point,h)));}
function boundsOf(ring,anchor){const xs=ring.map(([x])=>{while(x-anchor>180)x-=360;while(x-anchor<-180)x+=360;return x;}),ys=ring.map(p=>p[1]);return [[Math.min(...xs),Math.min(...ys)],[Math.max(...xs),Math.max(...ys)]];}
// Focus the main landmass and nearby islands; remote overseas territories do
// not turn a search for France into a whole-world view. No capital is used
// as a country's centre, and the same code can be focused repeatedly.
export function countryFocusBounds(geoJson,code,anchor=[0,0]){
 const polygons=geoJson.features.filter(f=>f.properties.cca2===code).flatMap(f=>f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates);
 if(!polygons.length)return null;
 const candidates=polygons.map(p=>({area:Math.abs(ringArea(p[0])),bounds:boundsOf(p[0],anchor[0])})).sort((a,b)=>b.area-a.area);
 const main=candidates[0].bounds,bounds=[[...main[0]],[...main[1]]];
 for(const {bounds:b} of candidates.slice(1))if(b[1][0]>=main[0][0]-10&&b[0][0]<=main[1][0]+10&&b[1][1]>=main[0][1]-10&&b[0][1]<=main[1][1]+10){bounds[0][0]=Math.min(bounds[0][0],b[0][0]);bounds[0][1]=Math.min(bounds[0][1],b[0][1]);bounds[1][0]=Math.max(bounds[1][0],b[1][0]);bounds[1][1]=Math.max(bounds[1][1],b[1][1]);}
 return bounds;
}
// Frame the closest repeated world, preserving the current direction of travel.
export function nearestWorldBounds(bounds, longitude=0) {
 const midpoint=(bounds[0][0]+bounds[1][0])/2;
 const shift=Number.isFinite(longitude)?360*Math.round((longitude-midpoint)/360):0;
 return bounds.map(([lng,lat])=>[lng+shift,lat]);
}
export function focusMapCountry(map,geoJson,code,country,duration=900){const canonical=country?.focusBounds||countryFocusBounds(geoJson,code,country?.center);if(!canonical)return false;const bounds=nearestWorldBounds(canonical,map.getCenter?.().lng);map.stop();map.setRenderWorldCopies(true);const span=Math.max(bounds[1][0]-bounds[0][0],bounds[1][1]-bounds[0][1]);map.fitBounds(bounds,{padding:60,maxZoom:span<0.05?18:span<1?9:5.7,duration});return true;}
