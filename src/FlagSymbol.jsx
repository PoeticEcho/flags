import {useId} from 'react';
import {symbolById} from './custom-shapes.js';
export default function FlagSymbol({shape,fill='#ffffff',stroke='#899b98',strokeWidth,maskMode=false,className}) {
 const id=`motif-${useId().replaceAll(':','')}`,def=symbolById.get(shape.symbol);
 if(!def)return null;
 const [x,y,w,h]=def.viewBox,rotation=def.rotation?`rotate(${def.rotation})`:undefined;
 const parts=def.parts.filter(p=>p.hole||shape.part===undefined||(p.region??0)===shape.part);
 const outlineWidth=strokeWidth??Math.min(w/shape.width,h/shape.height);
 return <svg className={className} x={shape.x} y={shape.y} width={shape.width} height={shape.height} viewBox={def.viewBox.join(' ')} preserveAspectRatio="none" overflow="visible" transform={shape.rotation?`rotate(${shape.rotation} ${shape.x+shape.width/2} ${shape.y+shape.height/2})`:undefined}>
  <defs><mask id={id} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}><g transform={rotation}>{parts.map((p,i)=><path key={i} d={p.d} fill={p.hole?'black':'white'}/>)}</g></mask></defs>
  <g mask={`url(#${id})`}><rect x={x} y={y} width={w} height={h} fill={fill}/>{!maskMode&&<g transform={rotation}>{parts.map((p,i)=><path key={i} d={p.d} fill="none" stroke={stroke} strokeWidth={outlineWidth}/>)}</g>}</g>
 </svg>;
}
