import flagSymbols from './flag-symbols.json' with {type:'json'};
import {computePaperRegions} from './planar-regions.js';
export {flagSymbols};
export const symbolById = new Map(flagSymbols.map(s=>[s.id,s]));
export const symbolRegions = shape => shape?.type==='symbol' ? [...new Set(symbolById.get(shape.symbol)?.parts.filter(p=>!p.hole).map(p=>p.region??0))] : [0];
export const regionKey = (region,part) => part===undefined ? String(region) : `${region}:${part}`;
export const regionColour = (art,region,part) => art.colors[regionKey(region,part)]??art.colors[region]??'#ffffff';
export function paintRegion(art,region,part,color) {
 // Older drawings used a whole-shape stroke. Split that stroke when just one
 // half is filled so the other half's drawing is preserved.
 const parts=region>0 ? symbolRegions(art.shapes[region-1]) : computePaperRegions(art.shapes).map(r=>r.part??0);
 const strokes=art.strokes.flatMap(s=>s.region!==region?[s]:part===undefined?[]:s.part===undefined&&parts.length>1?parts.filter(p=>p!==part).map(p=>({...s,part:p})):s.part===part?[]:[s]);
 const baseColors=region===0&&part===undefined?Object.fromEntries(Object.entries(art.colors).filter(([k])=>!k.startsWith('0:'))):art.colors;
 return {...art,colors:{...baseColors,[regionKey(region,part)]:color},strokes};
}
const pathCache = new Map();
let hitContext;
export function shapeBounds(shape) {
 if(shape.type==='circle')return {x:shape.cx-shape.r,y:shape.cy-shape.r,width:shape.r*2,height:shape.r*2};
 if(shape.type==='line')return {x:Math.min(shape.x1,shape.x2)-4,y:Math.min(shape.y1,shape.y2)-4,width:Math.abs(shape.x2-shape.x1)+8,height:Math.abs(shape.y2-shape.y1)+8};
 return {x:shape.x,y:shape.y,width:shape.width,height:shape.height};
}
export function createShape(type,symbol) {
 if(type==='circle')return {type,cx:300,cy:200,r:70};
 if(type==='line')return {type,x1:160,y1:200,x2:440,y2:200};
 if(type==='symbol')return {type,symbol,x:225,y:125,width:150,height:150,rotation:0};
 return {type:'rect',x:200,y:135,width:200,height:130};
}
export function validShape(s) {
 if(!s||!['rect','circle','line','symbol'].includes(s.type))return false;
 const fields=s.type==='circle'?['cx','cy','r']:s.type==='line'?['x1','y1','x2','y2']:['x','y','width','height'];
 if(!fields.every(k=>Number.isFinite(s[k])&&Math.abs(s[k])<=2000))return false;
 if(s.type==='circle'&&s.r<=0)return false;
 if(['rect','symbol'].includes(s.type)&&(s.width<=0||s.height<=0))return false;
 return s.type!=='symbol'||(symbolById.has(s.symbol)&&Number.isFinite(s.rotation??0));
}
export function localSymbolPoint(point,shape) {
 const b=shapeBounds(shape),a=-(shape.rotation||0)*Math.PI/180;
 const dx=point[0]-b.x-b.width/2,dy=point[1]-b.y-b.height/2;
 const u=(dx*Math.cos(a)-dy*Math.sin(a)+b.width/2)/b.width,v=(dx*Math.sin(a)+dy*Math.cos(a)+b.height/2)/b.height;
 const def=symbolById.get(shape.symbol);if(!def)return null;
 const [x,y,w,h]=def.viewBox;let px=x+u*w,py=y+v*h;
 if(def.rotation){const theta=-def.rotation*Math.PI/180,xx=px*Math.cos(theta)-py*Math.sin(theta);py=px*Math.sin(theta)+py*Math.cos(theta);px=xx;}
 return [px,py];
}
export function symbolContains(point,shape,partIndex) {
 const def=symbolById.get(shape.symbol),p=localSymbolPoint(point,shape);if(!def||!p)return false;
 const [x,y,w,h]=def.viewBox;
 if(p[0]<x||p[0]>x+w||p[1]<y||p[1]>y+h)return false;
 if(def.id==='taegeuk'){
  const [px,py]=p;if(px*px+py*py>144)return false;
  const upper=px*px+(py+6)**2<=36 ? true : px*px+(py-6)**2<=36 ? false : px>=0;
  return partIndex===undefined||partIndex===(upper?0:1);
 }
 if(typeof Path2D==='undefined'||typeof document==='undefined')return true;
 hitContext ||= document.createElement('canvas').getContext('2d');
 if(!hitContext)return false;
 const covers=part=>{if(!pathCache.has(part.d))pathCache.set(part.d,new Path2D(part.d));return hitContext.isPointInPath(pathCache.get(part.d),p[0],p[1],'nonzero');};
 return def.parts.some(part=>!part.hole&&(partIndex===undefined||(part.region??0)===partIndex)&&covers(part))&&!def.parts.some(part=>part.hole&&covers(part));
}
export function moveShape(shape,dx,dy) {
 // The selection outline includes stroke padding. Clamp a line's endpoints,
 // rather than that outline, so the line can reach every edge of the paper.
 const b=shape.type==='line'?{x:Math.min(shape.x1,shape.x2),y:Math.min(shape.y1,shape.y2),width:Math.abs(shape.x2-shape.x1),height:Math.abs(shape.y2-shape.y1)}:shapeBounds(shape);
 const tx=Math.max(-b.x,Math.min(600-b.x-b.width,dx)),ty=Math.max(-b.y,Math.min(400-b.y-b.height,dy));
 if(shape.type==='circle')return {...shape,cx:shape.cx+tx,cy:shape.cy+ty};
 if(shape.type==='line')return {...shape,x1:shape.x1+tx,x2:shape.x2+tx,y1:shape.y1+ty,y2:shape.y2+ty};
 return {...shape,x:shape.x+tx,y:shape.y+ty};
}
export function resizeShape(shape,point) {
 if(shape.type==='circle')return {...shape,r:Math.max(12,Math.min(shape.cx,600-shape.cx,shape.cy,400-shape.cy,Math.hypot(point[0]-shape.cx,point[1]-shape.cy)))};
 if(shape.type==='line')return {...shape,x2:Math.max(0,Math.min(600,point[0])),y2:Math.max(0,Math.min(400,point[1]))};
 return {...shape,width:Math.max(20,Math.min(600-shape.x,point[0]-shape.x)),height:Math.max(20,Math.min(400-shape.y,point[1]-shape.y))};
}
export function removeShape(art,index) {
 if(index<0||index>=art.shapes.length)return art;
 const region=index+1,colors=Object.fromEntries(Object.entries(art.colors).filter(([key])=>Number(key.split(':')[0])!==region).map(([key,color])=>{const [base,part]=key.split(':');return [regionKey(Number(base)>region?Number(base)-1:base,part),color];}));
 return {...art,colors,shapes:art.shapes.filter((_,i)=>i!==index),strokes:art.strokes.filter(s=>s.region!==region).map(s=>s.region>region?{...s,region:s.region-1}:s)};
}
