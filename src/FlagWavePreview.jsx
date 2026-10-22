import {useEffect,useRef,useState} from 'react';
import {X,Play,Pause,DownloadSimple,CloudSun,ImageSquare,ArrowClockwise} from '@phosphor-icons/react';
import {createFlagRenderer,svgFlagAspect} from './flag-wave.js';
import {artworkName,downloadArtwork,svgImageUrl} from './art-gallery.js';
import {countryByCode,explorationPoints} from './data.js';
import {openDialogWithReturnFocus} from './dialog-focus.js';
import {assetUrl} from './asset-url.js';

export function FlagWaveStage({canvasRef,item,name,language,status,background,postcard,backgroundStatus,onBackgroundLoad,onBackgroundError,backgroundAttempt=0}) {
 const tr=(ko,en)=>language==='ko'?ko:en;
 const scene=background==='postcard'&&backgroundStatus==='ready'?tr('엽서 배경','Postcard background'):tr('하늘 배경','Sky background');
 return <div className="flag-wave-stage" style={{backgroundImage:`url(${assetUrl('/assets/scenes/flag-sky.webp')})`}}>
  {background==='postcard'&&postcard?.fullImage&&<img key={backgroundAttempt} className={`wave-scene-image ${backgroundStatus==='ready'?'':'wave-hidden'}`} src={assetUrl(postcard.fullImage)} alt="" draggable={false} onLoad={onBackgroundLoad} onError={onBackgroundError}/>}
  <canvas ref={canvasRef} aria-label={tr(`${name} 국기의 3D 펄럭임 · ${scene}`,`${name} flag waving on a pole · ${scene}`)} className={status==='ready'?'':'wave-hidden'}/>
  {status!=='ready'&&<img className="flat-wave-flag" src={svgImageUrl(item.svg)} alt={tr(`${name} 국기`,`${name} flag`)} draggable={false}/>}</div>;
}

export default function FlagWavePreview({item,language,onClose}) {
 const tr=(ko,en)=>language==='ko'?ko:en;
 const dialog=useRef(),canvas=useRef(),controls=useRef(),[status,setStatus]=useState('loading'),[wind,setWind]=useState(1),[playing,setPlaying]=useState(()=>typeof window==='undefined'||!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [background,setBackground]=useState('sky'),[backgroundStatus,setBackgroundStatus]=useState('ready'),[backgroundAttempt,setBackgroundAttempt]=useState(0);
 const postcard=explorationPoints[item.code],origin=countryByCode.get(item.code),originName=language==='ko'?origin?.nameKo:origin?.name;
 const chooseBackground=mode=>{if(mode===background)return;setBackground(mode);setBackgroundStatus(mode==='postcard'?'loading':'ready');};
 controls.current={wind,playing};
 useEffect(()=>{setBackground('sky');setBackgroundStatus('ready');setBackgroundAttempt(0);},[item.id,item.code]);
 useEffect(()=>openDialogWithReturnFocus(dialog.current),[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),change=()=>{if(media.matches)setPlaying(false);};media.addEventListener('change',change);return ()=>media.removeEventListener('change',change);},[]);
 useEffect(()=>{
  setStatus('loading');
  let cancelled=false,renderer,frame=0,elapsed=0,last=0,lastWind=-1,lastWidth=0,lastHeight=0;
  const image=new Image(),url=URL.createObjectURL(new Blob([item.svg],{type:'image/svg+xml'}));
  const lost=event=>{event.preventDefault();cancelAnimationFrame(frame);setStatus('fallback');};
  canvas.current.addEventListener('webglcontextlost',lost);
  image.onload=()=>{if(cancelled)return;try{renderer=createFlagRenderer(canvas.current,image,svgFlagAspect(item.svg));setStatus('ready');const render=now=>{if(cancelled)return;const c=controls.current;if(c.playing&&document.visibilityState!=='hidden')elapsed+=last?Math.min((now-last)/1000,.1):0;last=now;if(c.playing||lastWind!==c.wind||lastWidth!==canvas.current.clientWidth||lastHeight!==canvas.current.clientHeight){renderer.draw(elapsed,c.wind);lastWind=c.wind;lastWidth=canvas.current.clientWidth;lastHeight=canvas.current.clientHeight;}frame=requestAnimationFrame(render);};frame=requestAnimationFrame(render);}catch{setStatus('fallback');}};
  image.onerror=()=>{if(!cancelled)setStatus('fallback');};image.src=url;
  const element=canvas.current;
  return ()=>{cancelled=true;cancelAnimationFrame(frame);element.removeEventListener('webglcontextlost',lost);renderer?.dispose();URL.revokeObjectURL(url);};
 },[item.svg]);
 const name=artworkName(item,language)||tr('나만의 국기','My own flag');
 return <dialog ref={dialog} className="flag-wave-dialog" aria-labelledby="flag-wave-title" onCancel={event=>{event.preventDefault();onClose();}}>
  <div className="collection-heading"><div><span className="preview-eyebrow">{item.custom?tr('내 나라의 국기','My country’s flag'):tr('내가 색칠한 국기','My coloured flag')}</span><h2 id="flag-wave-title">{name}</h2></div><button className="close-collection" aria-label={tr('펄럭임 미리보기 닫기','Close flag preview')} onClick={onClose}><X size={22}/></button></div>
  <div className="flag-wave-backgrounds" role="group" aria-label={tr('국기 배경','Flag background')}>
   <button type="button" aria-pressed={background==='sky'} onClick={()=>chooseBackground('sky')}><CloudSun size={18} aria-hidden="true"/>{tr('하늘','Sky')}</button>
   <button type="button" aria-pressed={background==='postcard'} disabled={!postcard?.fullImage} onClick={()=>chooseBackground('postcard')}><ImageSquare size={18} aria-hidden="true"/>{tr('엽서','Postcard')}{originName&&<span> · {originName}</span>}</button>
  </div>
  <FlagWaveStage canvasRef={canvas} item={item} name={name} language={language} status={status} background={background} postcard={postcard} backgroundStatus={backgroundStatus} backgroundAttempt={backgroundAttempt} onBackgroundLoad={()=>setBackgroundStatus('ready')} onBackgroundError={()=>setBackgroundStatus('error')}/>
  {background==='postcard'&&backgroundStatus!=='ready'&&<p className="wave-background-status" role="status">{backgroundStatus==='loading'?tr('엽서를 불러오고 있어요…','Loading the postcard…'):<>{tr('엽서를 불러오지 못해 하늘 배경으로 표시해요.','The postcard could not load. Showing the sky.')}<button type="button" onClick={()=>{setBackgroundStatus('loading');setBackgroundAttempt(n=>n+1);}}><ArrowClockwise size={16} aria-hidden="true"/>{tr('다시 불러오기','Reload')}</button></>}</p>}
  <div className="flag-wave-controls"><button disabled={status!=='ready'} onClick={()=>setPlaying(p=>!p)}>{playing?<Pause size={18}/>:<Play size={18}/>} {playing?tr('멈추기','Pause'):tr('펄럭이기','Play')}</button><label>{tr('바람','Wind')}<input type="range" min="0" max="2" step=".1" value={wind} onChange={e=>setWind(Number(e.target.value))} disabled={status!=='ready'}/></label><button onClick={()=>downloadArtwork(item)}><DownloadSimple size={18}/>{tr('SVG 저장','Save SVG')}</button></div>
  {status!=='ready'&&<p className="wave-status" role="status">{status==='fallback'?tr('이 기기에서는 평면 국기로 보여드려요.','This device shows your flat flag.'):tr('국기를 펼치고 있어요…','Unfurling your flag…')}</p>}
 </dialog>;
}
