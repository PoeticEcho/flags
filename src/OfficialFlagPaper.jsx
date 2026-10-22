import {forwardRef,useEffect,useId,useImperativeHandle,useRef,useState} from 'react';
import {splitFlagPixels,svgPaintColors,regionAt,gradePixels,makePaperPixels,makeTexture} from './official-art.js';
import {pixelColour} from './colour-picker.js';
import {nextPaintRegion} from './keyboard-paint.js';
const canvasFor=(w=640,h=480)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const sourceUrl=code=>`${import.meta.env.BASE_URL}flags/${code.toLowerCase()}.svg`;
export default forwardRef(function OfficialFlagPaper({code,language='ko',tool,ink,size,actions,onCommit,onModel,onPickColour},ref){
 const tr=(ko,en)=>language==='ko'?ko:en;
 const canvas=useRef(),modelRef=useRef(),baseRef=useRef(),committedRef=useRef(),gesture=useRef(),frame=useRef(),patterns=useRef(new Map()),masks=useRef(new Map()),actionsRef=useRef(actions);
 const paintedActions=useRef([]);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const wrap=useRef(),keyboardHelp=useId(),[activeRegion,setActiveRegion]=useState(null),[keyboardFocused,setKeyboardFocused]=useState(false),[paperBox,setPaperBox]=useState(null),[keyboardNotice,setKeyboardNotice]=useState('');
 useEffect(()=>{const update=()=>{const paper=canvas.current;if(paper)setPaperBox({left:paper.offsetLeft,top:paper.offsetTop,width:paper.clientWidth,height:paper.clientHeight});};const observer=new ResizeObserver(update);observer.observe(wrap.current);observer.observe(canvas.current);update();return()=>observer.disconnect();},[]);
 actionsRef.current=actions;
 const maskFor=id=>{
  if(masks.current.has(id))return masks.current.get(id);
  const model=modelRef.current,r=model.regions[id],w=r.maxX-r.minX+1,h=r.maxY-r.minY+1,c=canvasFor(w,h),ctx=c.getContext('2d'),pixels=ctx.createImageData(w,h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(model.labels[(y+r.minY)*model.width+x+r.minX]===id)pixels.data.set([255,255,255,255],(y*w+x)*4);
  ctx.putImageData(pixels,0,0);masks.current.set(id,c);return c;
 };
 const drawAction=(ctx,a,semantic=false)=>{
  const model=modelRef.current,r=model?.regions[a.region];if(!r||r.locked)return;
  const layer=canvasFor(model.width,model.height),paint=layer.getContext('2d');paint.fillStyle=a.kind==='erase'?'#ffffff':a.color;
  if(a.kind==='fill')paint.fillRect(r.minX,r.minY,r.maxX-r.minX+1,r.maxY-r.minY+1);
  else if(a.points?.length){
   if(a.kind==='erase'){paint.strokeStyle='#ffffff';}else if(semantic){paint.strokeStyle=a.color;}else{
    const key=a.tool+a.color;if(!patterns.current.has(key))patterns.current.set(key,makeTexture(canvasFor(),a.tool,a.color));
    paint.strokeStyle=paint.createPattern(patterns.current.get(key),'repeat');
   }
   paint.lineWidth=a.size;paint.lineCap='round';paint.lineJoin='round';paint.beginPath();paint.moveTo(...a.points[0]);
   for(let i=1;i<a.points.length;i++)paint.lineTo(...a.points[i]);
   if(a.points.length===1)paint.lineTo(a.points[0][0]+.01,a.points[0][1]);paint.stroke();
  }
  paint.globalCompositeOperation='destination-in';paint.drawImage(maskFor(a.region),r.minX,r.minY);
  ctx.save();if(a.kind==='erase')ctx.globalCompositeOperation='destination-out';ctx.drawImage(layer,0,0);ctx.restore();
 };
 const repaint=(draft=null)=>{if(!canvas.current||!committedRef.current)return;const ctx=canvas.current.getContext('2d');ctx.clearRect(0,0,640,480);ctx.drawImage(baseRef.current,0,0);if(draft){const preview=canvasFor(),paint=preview.getContext('2d');paint.drawImage(committedRef.current,0,0);drawAction(paint,draft);ctx.drawImage(preview,0,0);}else ctx.drawImage(committedRef.current,0,0);};
 useEffect(()=>{
  let disposed=false;setLoading(true);setError('');modelRef.current=null;committedRef.current=null;paintedActions.current=[];onModel(null);gesture.current=null;masks.current.clear();patterns.current.clear();
  const image=new Image();const abort=new AbortController();let sourceColors=[];const timeout=setTimeout(()=>{if(!disposed){setError('load');setLoading(false);}},15000);
  image.onload=()=>{clearTimeout(timeout);if(disposed)return;try{
   const original=canvasFor(),ctx=original.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,640,480);
   const pixels=ctx.getImageData(0,0,640,480).data,model=splitFlagPixels(pixels,640,480,sourceColors);modelRef.current=model;setActiveRegion(nextPaintRegion(model,null));
   const base=canvasFor(),baseCtx=base.getContext('2d');baseCtx.putImageData(new ImageData(makePaperPixels(model),640,480),0,0);baseRef.current=base;
   const committed=canvasFor(),out=committed.getContext('2d');for(const a of actionsRef.current)drawAction(out,a);committedRef.current=committed;paintedActions.current=actionsRef.current;repaint();setLoading(false);setError('');onModel({code,palette:model.palette,regions:model.regions.filter(r=>!r.locked).length});
  }catch{setError('model');setLoading(false);}};
  image.onerror=()=>{clearTimeout(timeout);if(!disposed){setError('load');setLoading(false);}};fetch(sourceUrl(code),{signal:abort.signal}).then(r=>{if(!r.ok)throw Error('Missing SVG');return r.text();}).then(text=>{if(disposed)return;sourceColors=svgPaintColors(text);image.src=sourceUrl(code);}).catch(()=>{if(!disposed)image.onerror();});
  return ()=>{disposed=true;abort.abort();clearTimeout(timeout);cancelAnimationFrame(frame.current);gesture.current=null;};
 },[code,retry,onModel]);
 useEffect(()=>{if(!modelRef.current||!baseRef.current)return;const previous=paintedActions.current;const append=committedRef.current&&previous.length<=actions.length&&previous.every((a,i)=>a===actions[i]);const committed=append?committedRef.current:canvasFor(),ctx=committed.getContext('2d');for(const a of actions.slice(append?previous.length:0))drawAction(ctx,a);committedRef.current=committed;paintedActions.current=actions;repaint();},[actions]);
 useImperativeHandle(ref,()=>({
  cancelGesture(){const g=gesture.current;gesture.current=null;cancelAnimationFrame(frame.current);frame.current=null;if(g&&canvas.current?.hasPointerCapture(g.pointerId))canvas.current.releasePointerCapture(g.pointerId);repaint();},
  serialize(){if(!modelRef.current||loading||error)throw Error(tr('국기가 준비될 때까지 잠시 기다려 주세요.','Please wait for the flag to load.'));const exportCanvas=canvasFor(),exportCtx=exportCanvas.getContext('2d');exportCtx.drawImage(baseRef.current,0,0);exportCtx.drawImage(committedRef.current,0,0);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><title>${code} coloured flag</title><desc>Painted from lipis/flag-icons 7.5.0 SVG; artwork contains a raster painting layer.</desc><image width="640" height="480" href="${exportCanvas.toDataURL('image/png')}"/></svg>`;},
  grade(){const model=modelRef.current;if(!model)return null;const semantic=canvasFor(),ctx=semantic.getContext('2d',{willReadFrequently:true});for(const a of actionsRef.current)drawAction(ctx,a,true);return gradePixels(model,ctx.getImageData(0,0,640,480).data);}
 }),[loading,error,language]);
 const pointer=e=>{const r=canvas.current.getBoundingClientRect();return [(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*480/r.height];};
 const down=e=>{if(loading||error||gesture.current||e.button>0)return;const p=pointer(e);
  if(tool==='eyedropper'){e.preventDefault();const color=pixelColour(canvas.current.getContext('2d').getImageData(0,0,640,480).data,640,480,...p);if(color)onPickColour?.(color);return;}
  const id=regionAt(modelRef.current,...p);if(id<0)return;e.preventDefault();canvas.current.setPointerCapture(e.pointerId);
  if(tool==='paint'){onCommit({kind:'fill',region:id,color:ink});return;}
  gesture.current={pointerId:e.pointerId,action:{kind:tool==='eraser'?'erase':'stroke',region:id,color:ink,tool,size,points:[p]}};repaint(gesture.current.action);
 };
 const move=e=>{e.preventDefault();const g=gesture.current;if(!g||g.pointerId!==e.pointerId)return;
  const events=e.nativeEvent.getCoalescedEvents?.()||[];for(const event of events.length?events:[e]){const p=pointer(event),last=g.action.points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])>=.8)g.action.points.push(p);}
  if(!frame.current)frame.current=requestAnimationFrame(()=>{frame.current=null;if(gesture.current)repaint(gesture.current.action);});
 };
 const up=e=>{const g=gesture.current;if(!g||g.pointerId!==e.pointerId)return;gesture.current=null;cancelAnimationFrame(frame.current);frame.current=null;onCommit(g.action);if(canvas.current.hasPointerCapture(e.pointerId))canvas.current.releasePointerCapture(e.pointerId);};
 const cancel=e=>{if(gesture.current?.pointerId!==e.pointerId)return;gesture.current=null;cancelAnimationFrame(frame.current);frame.current=null;repaint();};
 const keyboard=e=>{
  if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Enter',' '].includes(e.key)||loading||error||gesture.current)return;
  e.preventDefault();if(e.repeat)return;
  if(e.key.startsWith('Arrow')){setActiveRegion(id=>nextPaintRegion(modelRef.current,id,['ArrowRight','ArrowDown'].includes(e.key)?1:-1));setKeyboardNotice('');}
  else if(tool==='paint'&&activeRegion!==null){onCommit({kind:'fill',region:activeRegion,color:ink});setKeyboardNotice(tr('선택한 영역을 칠했어요.','Selected region filled.'));}
  else setKeyboardNotice(tr('페인트통을 선택하면 키보드로 색을 채울 수 있어요.','Choose the paint bucket to fill with the keyboard.'));
 };
 const region=modelRef.current?.regions[activeRegion],regions=modelRef.current?.regions.filter(r=>!r.locked)||[],regionNumber=regions.findIndex(r=>r.id===activeRegion)+1;
 return <div ref={wrap} className="official-paper-wrap"><canvas ref={canvas} width="640" height="480" className={`flag-paper ${tool==='paint'?'bucket':'drawing'}`} role="button" tabIndex={loading||error?-1:0} aria-label={`${code} ${code==='AQ'?tr('남극 상징 색칠 종이','Antarctic symbol colouring paper'):tr('국기 색칠 종이','flag colouring paper')}`} aria-describedby={keyboardHelp} onKeyDown={keyboard} onFocus={()=>setKeyboardFocused(true)} onBlur={()=>setKeyboardFocused(false)} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={cancel} onDragStart={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()}/>{keyboardFocused&&region&&paperBox&&!loading&&!error&&<div className="keyboard-paint-outline" aria-hidden="true" style={{left:paperBox.left+region.minX/640*paperBox.width,top:paperBox.top+region.minY/480*paperBox.height,width:(region.maxX-region.minX+1)/640*paperBox.width,height:(region.maxY-region.minY+1)/480*paperBox.height}}/>}<span id={keyboardHelp} className="sr-only">{tr('화살표로 영역을 고르고 페인트통 도구에서 Enter 또는 스페이스로 색을 채워요.','Use arrow keys to select a region. With the paint bucket, press Enter or Space to fill.')}</span><span className="sr-only" role="status">{keyboardFocused?`${tr(`영역 ${regionNumber} / ${regions.length}`,`Region ${regionNumber} of ${regions.length}`)}. ${keyboardNotice}`:''}</span>{loading&&<div className="flag-load" role="status">{tr('국기 도형을 준비하고 있어요…','Preparing the flag shapes…')}</div>}{error&&<div className="flag-load" role="alert">{error==='model'?tr('국기 도형을 준비하지 못했어요. 다시 시도해 주세요.','Could not prepare the flag shapes. Please try again.'):tr('국기를 불러오지 못했어요. 다시 시도해 주세요.','Could not load the flag. Please try again.')}<button onClick={()=>setRetry(n=>n+1)}>{tr('다시 불러오기','Reload flag')}</button></div>}</div>;
});
