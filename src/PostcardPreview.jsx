import {useEffect,useId,useRef,useState} from 'react';
import {ArrowClockwise,DownloadSimple,MagnifyingGlassPlus,X} from '@phosphor-icons/react';
import {assetUrl} from './asset-url.js';

export default function PostcardPreview({place,language,onOpen,compact=false}) {
 const [failed,setFailed]=useState(false);
 const caption=language==='ko'?place.landmarkKo:place.landmark;
 const label=compact?(language==='ko'?'여행 엽서 열기':'Open travel postcard'):(language==='ko'?'크게 보기':'View full size');
 return <button type="button" className={compact?'postcard-launcher':'landmark-art postcard-preview'} onClick={onOpen} aria-label={`${caption} · ${label}`} title={`${caption} · ${label}`} aria-haspopup="dialog" onDragStart={event=>event.preventDefault()}>
  {!failed&&<img draggable={false} loading="lazy" decoding="async" src={assetUrl(place.previewImage)} width={place.previewWidth} height={place.previewHeight} alt={caption} onError={()=>setFailed(true)}/>}
  {failed&&(compact?<MagnifyingGlassPlus size={22} aria-hidden="true"/>:<span className="postcard-preview-error">{language==='ko'?'그림을 눌러 다시 열어 주세요.':'Tap to open the picture.'}</span>)}
  {compact?<span className="postcard-launcher-icon" aria-hidden="true"><MagnifyingGlassPlus size={13}/></span>:<><span className="postcard-enlarge"><MagnifyingGlassPlus size={16}/>{label}</span><span className="landmark-name">{caption}</span></>}
 </button>;
}

// A full image element exists only after a postcard is explicitly opened.
export function PostcardViewer({item,language,onClose}) {
 const dialog=useRef(null),titleId=useId(),[status,setStatus]=useState('loading'),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  if(!item)return;
  const element=dialog.current,trigger=item.trigger||document.activeElement;
  element.showModal();
  return ()=>{if(element.open)element.close();if(trigger?.isConnected)trigger.focus({preventScroll:true});};
 },[item]);
 if(!item)return null;
 const tr=(ko,en)=>language==='ko'?ko:en;
 const country=language==='ko'?item.country.nameKo:item.country.name;
 const caption=language==='ko'?item.place.landmarkKo:item.place.landmark;
 const fullUrl=assetUrl(item.place.fullImage);
 const source=fullUrl+(attempt?`?retry=${attempt}`:'');
 return <dialog ref={dialog} className="postcard-viewer" aria-labelledby={titleId} onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
  <div className="postcard-viewer-heading"><div><span className="preview-eyebrow">{tr('여행 엽서','Travel postcard')}</span><h2 id={titleId}>{country}</h2></div><button autoFocus type="button" className="close-collection" aria-label={tr('큰 그림 닫기','Close full size picture')} onClick={onClose}><X size={22}/></button></div>
  <div className="postcard-viewer-stage" aria-busy={status==='loading'}>
   <button type="button" className={`postcard-dismiss-image${status==='error'?' postcard-image-hidden':''}`} onClick={onClose} aria-label={tr('사진을 눌러 닫기','Close picture')} title={tr('사진을 눌러 닫기','Close picture')}><img key={attempt} src={source} width={item.place.width} height={item.place.height} alt={`${country} · ${caption}`} draggable={false} decoding="async" onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/></button>
   {status==='loading'&&<span className="postcard-loading" role="status">{tr('큰 그림을 펼치고 있어요…','Opening your full size picture…')}</span>}
   {status==='error'&&<div className="postcard-image-error" role="alert"><p>{tr('그림을 불러오지 못했어요.','The picture could not be loaded.')}</p><button type="button" onClick={()=>{setStatus('loading');setAttempt(n=>n+1);}}><ArrowClockwise size={18}/>{tr('다시 열기','Try again')}</button></div>}
  </div>
  <div className="postcard-viewer-footer"><p>{caption}<small>{item.place.width} × {item.place.height}</small></p><a href={fullUrl} download={`${item.country.code.toLowerCase()}-postcard.webp`}><DownloadSimple size={18}/>{tr('그림 저장','Save picture')}</a></div>
 </dialog>;
}
