import {symbolContains,symbolRegions} from './custom-shapes.js';
export const templates = { FR: ['#002395','#ffffff','#ed2939'], IT:['#009246','#ffffff','#ce2b37'], DE:['#000000','#dd0000','#ffce00'], JP:['#ffffff','#bc002d'], BD:['#006a4e','#f42a41'] };
export const names = {FR:'프랑스',IT:'이탈리아',DE:'독일',JP:'일본',BD:'방글라데시'};
export function getRegions(code, custom, shapes) {
 if(custom) return [{type:'rect',x:0,y:0,width:600,height:400,paintRegion:0,shapeIndex:-1},...shapes.flatMap((shape,shapeIndex)=>{const parts=symbolRegions(shape);return parts.map(part=>({...shape,paintRegion:shapeIndex+1,shapeIndex,...(parts.length>1?{part}:{})}));})];
 if(code==='JP'||code==='BD') return [{type:'rect',x:0,y:0,width:600,height:400},{type:'circle',cx:code==='BD'?270:300,cy:200,r:110}];
 return templates[code].map((_,i)=>code==='DE'?{type:'rect',x:0,y:i*400/3,width:600,height:400/3}:{type:'rect',x:i*200,y:0,width:200,height:400});
}
export function paletteFor(targets, extra) {
 const defaults=['#ef4444','#f59e0b','#facc15','#22c55e','#06b6d4','#2563eb','#8b5cf6','#ec4899','#784b32','#000000','#ffffff'];
 return [...new Set([...targets,...extra,...defaults])].slice(0,10);
}
export function segmentDistance(p,a,b) {
 const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
 const t=len?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len)):0;
 return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
}
export function inside(p,r) {
 if(r.type==='symbol')return symbolContains(p,r,r.part);
 if(r.type==='circle')return Math.hypot(p[0]-r.cx,p[1]-r.cy)<=r.r;
 if(r.type==='line')return segmentDistance(p,[r.x1,r.y1],[r.x2,r.y2])<=4;
 return p[0]>=r.x&&p[0]<=r.x+r.width&&p[1]>=r.y&&p[1]<=r.y+r.height;
}
export function hitRegion(p,regions) { for(let i=regions.length-1;i>=0;i--)if(inside(p,regions[i]))return i;return -1; }
export function strokeCovers(p,s) {
 for(let j=0;j<s.points.length;j++)if(segmentDistance(p,s.points[Math.max(0,j-1)],s.points[j])<=s.size/2)return true;
 return false;
}
// Score semantic paint coverage; crayon grain and pencil hatching never count
// as unpainted gaps. Each region must be at least 90% the correct colour.
export function gradeArtwork(regions, targets, art) {
 return gradeArtworkAssessment(regions,targets,art).scores;
}
export function gradeArtworkAssessment(regions, targets, art) {
 const counts=regions.map(()=>({total:0,correct:0}));
 for(let y=5;y<400;y+=10)for(let x=5;x<600;x+=10){
  const p=[x,y],i=hitRegion(p,regions);if(i<0)continue;
  counts[i].total++;let color=art.colors[i]||'#ffffff';
  for(const s of art.strokes)if(s.region===i&&strokeCovers(p,s))color=s.tool==='eraser'?'#ffffff':s.color;
  if(color?.toLowerCase()===targets[i])counts[i].correct++;
 }
 const scores=counts.map(c=>c.total?c.correct/c.total:0),total=counts.filter(c=>c.total>0).length,accuracy=counts.reduce((sum,c)=>sum+c.correct,0)/Math.max(1,counts.reduce((sum,c)=>sum+c.total,0));
 return {scores,total,accuracy,percent:Math.floor(accuracy*100),complete:scores.length>0&&scores.every(s=>s>=.9),finished:scores.filter(s=>s>=.9).length};
}
export function pathFor(points) {return points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + (points.length===1?'l0.01 0':'');}
