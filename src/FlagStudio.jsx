import { useState, useRef, useId, useMemo, useEffect } from 'react';
import { PaintBucket, Pencil, PencilSimple, Highlighter, Eraser, ArrowsOutCardinal, Trash, CaretDown, Flag, Plus, Eyedropper, ArrowUUpLeft, FloppyDisk, Printer, DownloadSimple, FlagBanner, Check }  from '@phosphor-icons/react';
import {templates,getRegions,paletteFor,hitRegion,gradeArtworkAssessment,pathFor} from './flag-art.js';
import {makeTexture} from './official-art.js';
import {sampleSvgColour} from './colour-picker.js';
import OfficialFlagPaper from './OfficialFlagPaper.jsx';
import ColourCountryPicker from './ColourCountryPicker.jsx';
import {createShapeHold} from './shape-hold.js';
import {assessFlag,earnedFlag,earnsFlagWave} from './flag-reward.js';
import {explorationRoster as roster,countryByCode} from './data.js';
import {browserStorage,readStudioDraft,saveStudioDraft,blankArtwork} from './studio-drafts.js';
import {flagSymbols,createShape,shapeBounds,moveShape,resizeShape,removeShape,regionKey,regionColour,paintRegion,symbolRegions} from './custom-shapes.js';
import {hitClosedStrokeLoop,polygonPathD} from './planar-regions.js';
import FlagSymbol from './FlagSymbol.jsx';
import {resolveCountryName} from './country-names.js';
import {readArtGallery,saveArtGallery,artworkDraft,artworkName,svgImageUrl,galleryChangeEvent,downloadArtwork,undoNamedArtwork,completedCountry,completedFlag} from './art-gallery.js';
const countryNames=Object.fromEntries(roster.map(c=>[c.code,c.nameKo]));
const tools=[{id:'paint',label:'페인트통',Icon:PaintBucket,hint:'누른 영역에 색을 부어요.'},{id:'crayon',label:'크레용',Icon:Pencil,hint:'손을 움직여 거친 질감으로 칠해요.'},{id:'pencil',label:'색연필',Icon:PencilSimple,hint:'손을 움직여 연필 결로 칠해요.'},{id:'marker',label:'사인펜',Icon:Highlighter,hint:'손을 움직여 선명하게 칠해요.'},{id:'eraser',label:'지우개',Icon:Eraser,hint:'손을 움직여 칠한 부분을 지워요.'},{id:'eyedropper',label:'스포이드',Icon:Eyedropper,hint:'국기 위의 색을 집어 다시 사용해요.'}];
export default function FlagStudio({initialCode='FR',initialCustom=false,language='ko',onCountryChange,onModeChange,onOpenArtwork,onPreview}){
 const tr=(ko,en)=>language==='ko'?ko:en;
 const [saved]=useState(()=>readStudioDraft(browserStorage(),initialCode,initialCustom));
 const [code,setCode]=useState(initialCode),[custom,setCustom]=useState(initialCustom),[art,setArt]=useState(saved.art),[ink,setInk]=useState(saved.ink),[tool,setTool]=useState(saved.tool),[size,setSize]=useState(saved.size),[history,setHistory]=useState(saved.history),[message,setMessage]=useState(''),[extra,setExtra]=useState(saved.extra),[draft,setDraft]=useState(null),[arrange,setArrange]=useState(false),[selected,setSelected]=useState(-1),[selectedPart,setSelectedPart]=useState(undefined),[trashVisible,setTrashVisible]=useState(false),[draftSaveError,setDraftSaveError]=useState(false),[symbolsOpen,setSymbolsOpen]=useState(false);
 const nameInput=useRef(),pickRequest=useRef(0),previousTool=useRef('paint'),feedbackTimer=useRef();
 const [pickedColour,setPickedColour]=useState(null),[pickBusy,setPickBusy]=useState(false),[lastAction,setLastAction]=useState(''),[announcement,setAnnouncement]=useState('');
 const flashAction=(id,text)=>{clearTimeout(feedbackTimer.current);setLastAction(id);setAnnouncement(text);feedbackTimer.current=setTimeout(()=>setLastAction(''),1400);};
 useEffect(()=>()=>{pickRequest.current++;clearTimeout(feedbackTimer.current);},[]);
 const latestDraft=useRef();latestDraft.current={code,custom,draft:{art,ink,tool,size,history,extra}};
 useEffect(()=>{const value={art,ink,tool,size,history,extra};saveStudioDraft(browserStorage(),code,custom,value,false);const timer=setTimeout(()=>setDraftSaveError(!saveStudioDraft(browserStorage(),code,custom,value)),250);return ()=>clearTimeout(timer);},[code,custom,art,ink,tool,size,history,extra]);
 useEffect(()=>()=>{const value=latestDraft.current;saveStudioDraft(browserStorage(),value.code,value.custom,value.draft);},[]);
 const [gallery,setGallery]=useState(()=>readArtGallery(browserStorage()));
 useEffect(()=>{const refresh=()=>setGallery(readArtGallery(browserStorage()));window.addEventListener(galleryChangeEvent,refresh);window.addEventListener('storage',refresh);return ()=>{window.removeEventListener(galleryChangeEvent,refresh);window.removeEventListener('storage',refresh);};},[]);
 const [flagModel,setFlagModel]=useState(null);
 const [flagAssessment,setFlagAssessment]=useState(null);
 const officialRef=useRef();
 const svg=useRef(),gesture=useRef(null),shapeHold=useRef(),holdActivate=useRef(),trashTimer=useRef(),prefix=useId().replaceAll(':','');
 const showTrash=(index=selected)=>{clearTimeout(trashTimer.current);setTrashVisible(true);trashTimer.current=setTimeout(()=>{if(document.activeElement?.closest('.shape-delete-target'))svg.current?.querySelector(`[data-shape-index="${index}"]`)?.focus({preventScroll:true});setTrashVisible(false);},2000);};
 useEffect(()=>{if(!arrange||selected<0){clearTimeout(trashTimer.current);setTrashVisible(false);}},[arrange,selected]);
 holdActivate.current=press=>{const g=gesture.current;if(!g||g.id!==press.id||g.mode!=='hold')return;gesture.current={...g,mode:'move',changed:false};setSelected(g.index);setSelectedPart(g.part);showTrash(g.index);setArrange(true);setDraft(null);setMessage('');setAnnouncement(tr('도형을 옮기거나 휴지통으로 삭제할 수 있어요.','Move the shape or use the trash button to delete it.'));};
 if(!shapeHold.current)shapeHold.current=createShapeHold({onActivate:press=>holdActivate.current(press)});
 useEffect(()=>()=>{shapeHold.current.cancel();clearTimeout(trashTimer.current);},[]);
 const useOfficial=!custom&&!art.legacy;
 const targets=useOfficial?(flagModel?.palette||[]):(templates[code]||[]),regions=useOfficial?[]:getRegions(code,custom,art.shapes),palette=useMemo(()=>paletteFor(custom?[]:targets,extra),[custom,targets,extra]);
 const readyToSave=!useOfficial||flagModel?.code===code;
 const toolSamples=useMemo(()=>Object.fromEntries(['crayon','pencil','marker'].map(id=>{const c=document.createElement('canvas');return [id,makeTexture(c,id,ink).toDataURL()]})),[ink]);
 const englishTools={paint:['Paint bucket','Tap a region to pour in colour.'],crayon:['Crayon','Move your hand to make grainy strokes.'],pencil:['Colour pencil','Draw with fine pencil hatching.'],marker:['Marker','Draw bright, layered strokes.'],eraser:['Pen eraser','Move your hand to erase your strokes.'],eyedropper:['Eyedropper','Tap a colour on the flag to use it again.']};
 const toolOptions=tools.map(t=>({...t,label:tr(t.label,englishTools[t.id][0]),hint:tr(t.hint,englishTools[t.id][1])}));
 const chosen=toolOptions.find(t=>t.id===tool)||toolOptions[0];
 const remember=()=>setHistory(h=>[...h.slice(-39),art]);
 const commit=next=>{pickRequest.current++;setPickBusy(false);remember();setArt(next);setMessage('');};
 const selectTool=id=>{stopGesture();pickRequest.current++;setPickBusy(false);if(id==='eyedropper'&&['paint','crayon','pencil','marker'].includes(tool))previousTool.current=tool;setTool(id);setArrange(false);};
 const pickColour=color=>{setInk(color);setPickedColour(color);setPickBusy(false);setTool(previousTool.current);setMessage('');flashAction('eyedropper',tr(`색 ${color}을 집었어요.`, `Picked colour ${color}.`));};
 const reset=(nextCode,nextCustom)=>{stopGesture();pickRequest.current++;setPickBusy(false);setPickedColour(null);setLastAction('');clearTimeout(feedbackTimer.current);const next=readStudioDraft(browserStorage(),nextCode,nextCustom);setCode(nextCode);setCustom(nextCustom);setArt(next.art);setHistory(next.history);setInk(next.ink);setTool(next.tool);setSize(next.size);setExtra(next.extra);setDraft(null);setSelected(-1);setArrange(false);setMessage('');gesture.current=null;setFlagModel(null);setFlagAssessment(null);};
 const point=e=>{const p=svg.current.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.current.getScreenCTM().inverse());return [q.x,q.y];};
 const pickAt=p=>{const request=++pickRequest.current;setPickBusy(true);sampleSvgColour(serialize(),...p).then(color=>{if(color&&request===pickRequest.current)pickColour(color);}).catch(()=>{if(request===pickRequest.current)setMessage(tr('색을 읽지 못했어요. 다시 눌러 주세요.','Could not read the colour. Please try again.'));}).finally(()=>{if(request===pickRequest.current)setPickBusy(false);});};
 const begin=e=>{
  if(gesture.current||e.button>0)return;
  const p=point(e);
  const i=hitRegion(p,regions),r=arrange&&e.target.dataset.resize&&selected>=0?{paintRegion:selected+1,shapeIndex:selected,part:selectedPart}:regions[i];if(!r)return;const region=r.paintRegion??i;
  e.preventDefault();svg.current.setPointerCapture(e.pointerId);
  if(arrange&&custom){setSelected(r.shapeIndex);setSelectedPart(r.part);if(region===0)return;showTrash(r.shapeIndex);gesture.current={id:e.pointerId,mode:e.target.dataset.resize?'resize':'move',start:p,shape:art.shapes[r.shapeIndex],index:r.shapeIndex,part:r.part,art,changed:false};return;}
  if(custom&&r.shapeIndex>=0){
   pickRequest.current++;setPickBusy(false);
   gesture.current={id:e.pointerId,mode:'hold',start:p,shape:art.shapes[r.shapeIndex],index:r.shapeIndex,part:r.part,region,art,tool,ink,size};
   shapeHold.current.begin({id:e.pointerId,client:[e.clientX,e.clientY]});return;
  }
  if(tool==='eyedropper'){pickAt(p);return;}
  if(tool==='paint'){
   if(custom&&r.shapeIndex<0){
    const closedHit=hitClosedStrokeLoop(p,art.strokes);
    if(closedHit){commit({...art,strokes:art.strokes.map((st,idx)=>idx===closedHit.strokeIndex?{...st,fill:ink,fillPoints:closedHit.loop}:st)});return;}
   }
   commit(paintRegion(art,region,r.part,ink));return;
  }
  const stroke={region,part:r.part,color:ink,tool,size,points:[p]};gesture.current={id:e.pointerId,mode:'draw',stroke};setDraft({...stroke});setMessage('');
 };
 const move=e=>{
  e.preventDefault();let g=gesture.current;if(!g||g.id!==e.pointerId)return;
  const p=point(e);
  if(g.mode==='hold'){
   const intent=shapeHold.current.move(e.pointerId,[e.clientX,e.clientY]);
   if(intent!=='draw')return;
   if(['paint','eyedropper'].includes(g.tool)){gesture.current={...g,mode:'abandoned'};return;}
   const stroke={region:g.region,part:g.part,color:g.ink,tool:g.tool,size:g.size,points:[g.start,p]};g={id:g.id,mode:'draw',stroke};gesture.current=g;setDraft(stroke);setMessage('');return;
  }
  if(g.mode==='abandoned')return;
  if(g.mode==='draw'){
   const points=g.stroke.points,last=points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])<2)return;
   g.stroke={...g.stroke,points:[...points,p]};setDraft(g.stroke);
  }else{
   const dx=p[0]-g.start[0],dy=p[1]-g.start[1];if(!g.changed&&Math.hypot(dx,dy)<.5)return;
   if(!g.changed){g.changed=true;setHistory(h=>[...h.slice(-39),g.art]);}
   const next=g.mode==='resize'?resizeShape(g.shape,p):moveShape(g.shape,dx,dy),before=shapeBounds(g.shape),after=shapeBounds(next);
   setArt({...g.art,shapes:g.art.shapes.map((r,j)=>j===g.index?next:r),strokes:g.art.strokes.map(st=>st.region===g.index+1?{...st,points:st.points.map(([x,y])=>[after.x+(x-before.x)*after.width/before.width,after.y+(y-before.y)*after.height/before.height]),size:st.size*Math.sqrt((after.width/before.width)*(after.height/before.height))}:st)});
  }
 };
 const finish=e=>{
  const g=gesture.current;if(!g||g.id!==e.pointerId)return;if(g.mode==='hold')shapeHold.current.move(e.pointerId,[e.clientX,e.clientY]);const intent=shapeHold.current.end(e.pointerId);gesture.current=null;
  if(g.mode==='hold'&&intent==='tap'){
   if(g.tool==='eyedropper')pickAt(g.start);
   else if(g.tool==='paint')commit(paintRegion(g.art,g.region,g.part,g.ink));
   else commit({...g.art,strokes:[...g.art.strokes,{region:g.region,part:g.part,color:g.ink,tool:g.tool,size:g.size,points:[g.start]}]});
  }else if(g.mode==='draw'){remember();setArt(a=>({...a,strokes:[...a.strokes,g.stroke]}));setDraft(null);}
  if(svg.current.hasPointerCapture(e.pointerId))svg.current.releasePointerCapture(e.pointerId);
 };
 const cancel=e=>{const g=gesture.current;if(!g||g.id!==e.pointerId)return;shapeHold.current.cancel(e.pointerId);gesture.current=null;setDraft(null);if(g.changed){setArt(g.art);setHistory(h=>h.slice(0,-1));}};
 const serialize=(countryName=art.countryName)=>{if(useOfficial)return officialRef.current.serialize();const copy=svg.current.cloneNode(true);copy.querySelectorAll('[data-editor],[data-draft]').forEach(el=>el.remove());copy.setAttribute('width','600');copy.setAttribute('height','400');copy.removeAttribute('class');if(custom){const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=countryName?.trim()||tr('나만의 국기','My own flag');copy.prepend(title);if(art.englishName?.trim()){const description=document.createElementNS('http://www.w3.org/2000/svg','desc');description.textContent=art.englishName.trim();copy.insertBefore(description,title.nextSibling);}}return new XMLSerializer().serializeToString(copy);};
 const makeItem=()=>{
  const countryName=custom?resolveCountryName(art,readArtGallery(browserStorage())):countryNames[code];
  return {id:(custom?art.savedCountryId:art.savedArtworkId)||crypto.randomUUID(),code,custom,...art,countryName,englishName:custom?(art.englishName?.trim().slice(0,60)||''):countryByCode.get(code).name,tool,svg:serialize(countryName),createdAt:new Date().toISOString()};
 };
 const save=()=>{stopGesture();try{const item=makeItem(),autoNamed=custom&&!art.countryName?.trim();const next=saveArtGallery(browserStorage(),item);setGallery(next);window.dispatchEvent(new Event(galleryChangeEvent));setArt(a=>({...a,...(custom?{countryName:item.countryName}:{}),[custom?'savedCountryId':'savedArtworkId']:item.id}));setMessage('');flashAction('save',autoNamed?tr(`${item.countryName} 나라 카드를 저장했어요.`, `Saved your country as ${item.countryName}.`):custom?tr('나라 카드를 저장했어요.','Country card saved.'):tr('국기 작품을 저장했어요.','Flag artwork saved.'));}catch{setMessage(tr('저장 공간이 부족해 저장하지 못했어요. 그림은 유지돼요.','There is not enough space to save. Your drawing is kept.'));}};
 const stopGesture=()=>{shapeHold.current.cancel();officialRef.current?.cancelGesture();pickRequest.current++;setPickBusy(false);const g=gesture.current;gesture.current=null;setDraft(null);if(g&&svg.current?.hasPointerCapture(g.id))svg.current.releasePointerCapture(g.id);};
 const undo=()=>{stopGesture();setArt(undoNamedArtwork(history.at(-1),art));setHistory(h=>h.slice(0,-1));setMessage('');setSelected(-1);flashAction('undo',tr('되돌렸어요.','Undone.'));};
 const newFlag=()=>{stopGesture();commit(custom?{...blankArtwork(),newCountry:true}:{...blankArtwork(),legacy:art.legacy||false});setFlagAssessment(null);setSelected(-1);setSelectedPart(undefined);setArrange(false);setSymbolsOpen(false);setPickedColour(null);flashAction('new',custom?tr('새 국기를 만들어요.','New flag ready.'):tr('다시 색칠해요.','Fresh paper ready.'));if(custom)nameInput.current?.focus();};
 const print=item=>{const win=window.open('','_blank');if(!win){setMessage(tr('인쇄 창을 허용해 주세요.','Allow the print window to open.'));return;}win.document.write(`<html><head><title>Flag artwork</title><style>svg{width:100%;height:auto;max-height:90vh}@page{size:landscape}</style></head><body>${item?.svg||serialize()}</body></html>`);win.document.close();win.document.title=item?artworkName(item,language):tr('내 국기 작품','My flag artwork');win.focus();win.print();};
 const checkFlag=()=>{
  setFlagAssessment(null);
  try{
   const score=useOfficial?officialRef.current?.grade():gradeArtworkAssessment(regions,targets,art);
   if(!score||!score.total){setMessage(tr('국기가 준비되면 다시 확인해 주세요.','Check again when the flag is ready.'));return;}
   if(earnsFlagWave(score)){
    setFlagAssessment(assessFlag(score,code,art,makeItem()));
    setMessage(score.complete?tr(`정답률 ${score.percent}%! 국기를 완성했어요.`,`Accuracy ${score.percent}%! Your flag is complete.`):tr(`정답률 ${score.percent}%! 국기를 펄럭여 볼까요?`,`Accuracy ${score.percent}%! Ready to wave your flag?`));
   }else setMessage(tr(`정답률 ${score.percent}% · 추천색으로 조금 더 칠해 봐요.`,`Accuracy ${score.percent}% · Keep colouring with the flag colours.`));
  }catch{setMessage(tr('국기를 확인하지 못했어요. 다시 눌러 주세요.','Could not check the flag. Please try again.'));}
 };
 const finished=custom?completedCountry(art,gallery):completedFlag(art,gallery,code);
 const waveFlag=custom?finished:earnedFlag(flagAssessment,code,art,readyToSave);
 const addShape=(type,symbol)=>{stopGesture();if(art.shapes.length>=40){setMessage(tr('도형은 40개까지 추가할 수 있어요.','You can add up to 40 shapes.'));return;}const shape=createShape(type,symbol);commit({...art,shapes:[...art.shapes,shape]});showTrash(art.shapes.length);setSelected(art.shapes.length);setSelectedPart(symbolRegions(shape).length>1?0:undefined);setArrange(true);setSymbolsOpen(false);};
 const chooseInk=color=>{stopGesture();pickRequest.current++;setPickBusy(false);setInk(color);if(custom&&arrange&&selected>=0)commit({...art,colors:{...art.colors,[regionKey(selected+1,selectedPart)]:color}});};
 const shapeNode=(r,props={},maskMode=false)=>{if(r.type==='symbol')return <g {...Object.fromEntries(Object.entries(props).filter(([key])=>!['fill','stroke','strokeWidth'].includes(key)))}><FlagSymbol shape={r} fill={props.fill} stroke={props.stroke} maskMode={maskMode}/></g>;if(r.type==='polygon')return <path d={r.d} {...props}/>;const attrs=r.type==='rect'?{x:r.x,y:r.y,width:r.width,height:r.height}:r.type==='circle'?{cx:r.cx,cy:r.cy,r:r.r}:{x1:r.x1,y1:r.y1,x2:r.x2,y2:r.y2};const Tag=r.type;return <Tag {...attrs} {...props}/>;};
 const maskKey=r=>regionKey(r.paintRegion??regions.indexOf(r),r.part);
 const wholeRegions=custom?getRegions(code,true,art.shapes).filter(r=>r.part===undefined||r.part===0).map(r=>{if(r.paintRegion===0)return {type:'rect',x:0,y:0,width:600,height:400,paintRegion:0,shapeIndex:-1};const {part,...whole}=r;return whole;}):[];
 const maskRegions=[...regions,...wholeRegions.filter(r=>!regions.some(other=>maskKey(other)===maskKey(r)))];
 const strokes=[...art.strokes,...(draft?[draft]:[])];
 const textureStrokes=strokes.filter(s=>s.tool==='crayon'||s.tool==='pencil'||s.tool==='marker');
 const textureCache=useRef({});
 const textureUrls=useMemo(()=>Object.fromEntries(textureStrokes.map(s=>{const key=s.tool+s.color;if(!textureCache.current[key]){const c=document.createElement('canvas');textureCache.current[key]=makeTexture(c,s.tool,s.color).toDataURL();}return [key,textureCache.current[key]];})),[art.strokes,draft]);
 const deleteSelected=()=>{if(gesture.current)return;stopGesture();if(selected<0)return;commit(removeShape(art,selected));setSelected(-1);setSelectedPart(undefined);flashAction('delete-shape',tr('도형을 삭제했어요. 되돌릴 수 있어요.','Shape deleted. You can undo it.'));};
 const handle=selected>=0?art.shapes[selected]:null;
 const handleXY=handle?['rect','symbol'].includes(handle.type)?[handle.x+handle.width,handle.y+handle.height]:handle.type==='circle'?[handle.cx+handle.r,handle.cy]:[handle.x2,handle.y2]:null;
 const galleryDrawer=<details className="gallery-drawer"><summary>{tr(`내 작품 ${gallery.length}개`,`My artwork · ${gallery.length}`)}</summary><div className="collection-grid art-gallery">{gallery.map(item=><button key={item.id} onClick={()=>{const next=artworkDraft(item,{ink,tool,size,extra});saveStudioDraft(browserStorage(),item.code,item.custom,next);reset(item.code,item.custom);onOpenArtwork?.(item.code,item.custom);}}>{item.svg&&<img draggable={false} src={svgImageUrl(item.svg)} alt={tr('저장한 국기 작품','Saved flag artwork')}/>}<span>{item.custom?(artworkName(item,language)||tr('나만의 국기','My own flag')):language==='ko'?countryNames[item.code]:countryByCode.get(item.code).name} · {tr('다시 열기','Reopen')}</span></button>)}</div></details>;
 return <section className={`flag-studio unified-flag-studio ${custom?'custom-flag-studio':'colour-flag-studio'}`} onDragStart={e=>e.preventDefault()}><div className="studio-heading"><h2>{custom?tr('나만의 국기 만들기','Create your own flag'):tr('국기 색칠 공방','Flag colouring studio')}</h2>{custom&&<div className="country-name-fields" role="group" aria-label={tr('내 나라 이름','My country names')}><label>{tr('나라 이름','Country name')}<input ref={nameInput} maxLength={60} placeholder={tr('비워 두면 색상+동물 이름','Blank: colour + animal name')} value={art.countryName||''} onChange={e=>{stopGesture();setArt(a=>({...a,countryName:e.target.value}));setMessage('');}}/></label><label>{tr('영어 이름','English name')}<input maxLength={60} aria-label={tr('영어 이름 · 선택','English name · optional')} value={art.englishName||''} placeholder={tr('선택','Optional')} onChange={e=>{stopGesture();setArt(a=>({...a,englishName:e.target.value}));}}/></label></div>}{!custom&&<ColourCountryPicker code={code} language={language} onSelect={nextCode=>onCountryChange?onCountryChange(nextCode):reset(nextCode,false)}/>}</div>
 <div className="studio-workspace"><aside className="studio-supplies">
 <fieldset className="country-workflow"><legend>{custom?tr('만들기','Create'):tr('색칠하기','Colour')}</legend><div className="workflow-buttons"><button type="button" className={`new-flag ${lastAction==='new'?'action-done':''}`} disabled={!custom&&!readyToSave} onClick={newFlag}><Plus size={18}/>{custom?tr('새 국기 만들기','New flag'):tr('다시 색칠하기','Start again')}</button><button type="button" className={lastAction==='undo'?'action-done':''} disabled={!history.length} onClick={undo}><ArrowUUpLeft size={18}/>{tr('되돌리기','Undo')}</button><button type="button" className={`finish-country ${lastAction==='save'?'action-done':''}`} disabled={!readyToSave} onClick={save}>{finished?<Check size={18}/>:<FloppyDisk size={18}/>} <span>{custom?tr('나라 카드 저장','Save country'):tr('작품 저장','Save artwork')}</span></button></div>{!custom&&<button type="button" className={`check-art ${lastAction==='check'?'action-done':''}`} disabled={!readyToSave} onClick={()=>{stopGesture();checkFlag();flashAction('check','');}}><Check size={18}/>{tr('정답 확인','Check flag')}</button>}{!custom&&waveFlag&&<button type="button" className="earned-wave" onClick={()=>{stopGesture();onPreview?.(waveFlag);}}><FlagBanner size={19}/>{tr('국기 펄럭이기','Wave flag')}</button>}{message&&<p className="art-feedback" role={custom?'alert':'status'}>{message}</p>}</fieldset>
 {finished&&<fieldset className="finished-country"><legend>{tr('완성한 국기','Finished flag')}</legend>{custom&&<button type="button" onClick={()=>onPreview?.(waveFlag)}><FlagBanner size={18}/>{tr('국기 펄럭이기','Wave flag')}</button>}<button type="button" onClick={()=>print(finished)}><Printer size={18}/>{tr('출력하기','Print')}</button><button type="button" onClick={()=>downloadArtwork(finished)}><DownloadSimple size={18}/>{tr('SVG 내려받기','Download SVG')}</button></fieldset>}

 <fieldset className="tool-tray"><legend>{tr('도구 팔레트','Tools')}</legend><div className="tool-buttons">{toolOptions.map(({id,label,hint,Icon})=><button key={id} className={`art-tool ${tool===id&&!arrange?'selected':''} ${id==='eyedropper'&&pickedColour?'has-picked-colour':''} ${lastAction===id?'action-done':''}`} aria-label={id==='eyedropper'&&pickedColour?`${label} · ${pickedColour}`:label} aria-pressed={tool===id&&!arrange} aria-busy={id==='eyedropper'&&pickBusy||undefined} title={hint} onClick={()=>selectTool(id)}><Icon size={34} weight={id==='eyedropper'&&pickedColour?'fill':'duotone'} color={id==='eyedropper'&&pickedColour?pickedColour:undefined} aria-hidden="true"/><span>{label}</span><span className="tool-sample" aria-hidden="true" style={id==='eraser'?{background:'#ffffff'}:id==='eyedropper'?{background:pickedColour||'#ffffff'}:id==='paint'?{background:ink}:{backgroundImage:`url(${toolSamples[id]})`}}/></button>)}</div><p className="tool-hint sr-only">{arrange?tr('도형을 옮기고 크기를 바꿔요. 색을 고르면 선택한 부분이 칠해져요.','Move or resize shapes. Pick a colour to fill the selected part.'):chosen.hint}</p>{!['paint','eyedropper'].includes(tool)&&!arrange&&<label className="brush-width">{tr('굵기','Width')} <b>{size}</b><input aria-label={tr('칠하는 굵기','Stroke width')} type="range" min="6" max="60" step="2" value={size} onChange={e=>setSize(Number(e.target.value))}/></label>}</fieldset>
 <fieldset className="color-tray"><legend>{tr('색상 팔레트 · 10색','Palette · 10 colours')}</legend><div className="color-wells">{palette.map((c,i)=><button key={c} title={`${!custom&&targets.includes(c)?tr('국기 추천색','Flag colour'):tr('추가 색상','Extra colour')} ${c}`} aria-label={`${tr('색상','Colour')} ${i+1} ${c}${!custom&&targets.includes(c)?tr(' 국기 추천색',' Flag colour'):''}`} aria-pressed={ink.toLowerCase()===c} onClick={()=>chooseInk(c)} className={`color-well ${ink.toLowerCase()===c?'selected':''}`} style={{'--ink':c}}><span aria-hidden="true">{ink.toLowerCase()===c?'✓':''}</span>{!custom&&targets.includes(c)&&<i aria-hidden="true"/>}</button>)}</div>{!custom&&<p className="palette-note sr-only">{tr('작은 점이 있는 색은 국기 추천색이에요.','Dots mark the colours used in this flag.')}</p>}<div className="custom-ink"><label>{tr('내 색 만들기','Mix a colour')}<input type="color" aria-label={tr('사용자 지정 색상','Custom colour')} value={ink} onChange={e=>chooseInk(e.target.value)}/></label><button onClick={()=>setExtra(Array.from({length:10},()=>`#${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')}`))}>{tr('새로운 색','New colours')}</button></div></fieldset>
 {custom&&<fieldset className="shape-tray"><legend>{tr('도형 추가','Add shapes')}</legend><div className="shape-buttons">{[['rect','□',tr('사각형','Rectangle')],['circle','○',tr('원','Circle')],['line','│',tr('선','Line')]].map(([type,glyph,label])=><button key={type} onClick={()=>addShape(type)} aria-label={`${label} ${tr('추가','add')}`}><b aria-hidden="true">{glyph}</b><span>{label}</span><Plus size={14}/></button>)}</div>
 <button className="symbol-toggle" aria-expanded={symbolsOpen} aria-controls="flag-symbol-list" onClick={()=>{stopGesture();setSymbolsOpen(open=>!open);}}><Flag size={18}/>{tr('도형·문양 더 보기','Shapes & motifs')}<CaretDown size={16}/></button>
 {symbolsOpen&&<div id="flag-symbol-list" className="flag-symbol-list">{flagSymbols.map(def=><button key={def.id} onClick={()=>addShape('symbol',def.id)}><svg viewBox="0 0 60 60" aria-hidden="true"><FlagSymbol shape={{type:'symbol',symbol:def.id,x:7,y:7,width:46,height:46}}/></svg><span>{language==='ko'?def.labelKo:def.labelEn}</span><small>{countryByCode.get(def.sourceFlag)?.[language==='ko'?'nameKo':'name']}</small></button>)}</div>}
 <button className="arrange-tool" aria-pressed={arrange} onClick={()=>{stopGesture();setArrange(!arrange);if(!arrange&&selected>=0)showTrash();}}><ArrowsOutCardinal size={20}/> {tr('도형 이동·크기 조절','Move and resize shapes')}</button>
 {selected>=0&&arrange&&<div className="selected-shape-controls">{art.shapes[selected]?.type==='symbol'&&<label>{tr('회전','Rotate')}<input type="range" min="-180" max="180" step="15" value={art.shapes[selected].rotation||0} onChange={e=>{stopGesture();const rotation=Number(e.target.value),old=art.shapes[selected],theta=(rotation-(old.rotation||0))*Math.PI/180,cx=old.x+old.width/2,cy=old.y+old.height/2;commit({...art,shapes:art.shapes.map((r,i)=>i===selected?{...r,rotation}:r),strokes:art.strokes.map(st=>st.region===selected+1?{...st,points:st.points.map(([x,y])=>[cx+(x-cx)*Math.cos(theta)-(y-cy)*Math.sin(theta),cy+(x-cx)*Math.sin(theta)+(y-cy)*Math.cos(theta)])}:st)});}}/></label>}<button onClick={deleteSelected}><Trash size={18}/>{tr('선택한 도형 삭제','Delete selected shape')}</button></div>}
 </fieldset>}
 {!custom&&<fieldset className="reference-tray"><legend>{code==='AQ'?tr('남극 상징 · 비공식','Antarctic symbol · Unofficial'):tr('국기 견본','Flag reference')}</legend><img src={`${import.meta.env.BASE_URL}flags/${code.toLowerCase()}.svg`} alt={`${language==='ko'?countryNames[code]:countryByCode.get(code).name} ${code==='AQ'?tr('비공식 상징 견본','unofficial symbol reference'):tr('국기 원본 견본','original flag reference')}`} draggable={false}/></fieldset>}
 {galleryDrawer}
 </aside><div className="studio-easel"><div className="canvas-caption"><strong>{custom?(art.countryName?.trim()||tr('나만의 국기','My own flag')):code==='AQ'?tr('남극 상징 색칠','Colour the Antarctic symbol'):language==='ko'?`${countryNames[code]} 국기`:`${countryByCode.get(code).name} flag`}</strong><span>{arrange?tr('도형 편집','Edit shapes'):tool==='eraser'?tr('지우개','Eraser'):`${chosen.label} · ${tr('선택한 색','Selected colour')}`} <i style={{background:tool==='eraser'?'#ffffff':ink}}/></span></div>
 {useOfficial?<OfficialFlagPaper ref={officialRef} code={code} language={language} tool={tool} ink={ink} size={size} actions={art.actions||[]} onCommit={action=>commit({...art,actions:[...(art.actions||[]),action]})} onModel={setFlagModel} onPickColour={pickColour}/>:<div className="flag-paper-surface"><svg ref={svg} className={`flag-paper ${tool==='paint'?'bucket':'drawing'}`} viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" aria-label={tr('국기 색칠 종이','Flag colouring paper')} onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();const g=gesture.current;if(g){cancel({pointerId:g.id});if(svg.current.hasPointerCapture(g.id))svg.current.releasePointerCapture(g.id);}shapeHold.current.cancel();setArrange(false);setSelected(-1);}}} onDragStart={e=>e.preventDefault()} onContextMenu={e=>e.preventDefault()}>
 <defs>{Object.entries(textureUrls).map(([key,url])=><pattern key={key} id={`${prefix}-texture-${key.replace("#","")}`} width="96" height="96" patternUnits="userSpaceOnUse"><image width="96" height="96" href={url}/></pattern>)}{maskRegions.map((r,i)=><mask key={maskKey(r)} id={`${prefix}-mask-${maskKey(r)}`}  maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="400"><rect width="600" height="400" fill="black"/>{shapeNode(r,{fill:'white',stroke:r.type==='line'?'white':'none',strokeWidth:8},true)}{regions.filter(other=>(other.paintRegion??regions.indexOf(other))>(r.paintRegion??regions.indexOf(r))||((r.paintRegion??0)===0&&(other.paintRegion??0)===0&&r.part!==undefined&&other.part>r.part)).map((other,j)=><g key={j}>{shapeNode(other,{fill:'black',stroke:other.type==='line'?'black':'none',strokeWidth:8},true)}</g>)}</mask>)}
 <pattern id={`${prefix}-crayon`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".8" fill="white"/><path d="M4 5h2M2 6h1" stroke="white" strokeWidth=".8"/></pattern><pattern id={`${prefix}-pencil`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 5L5 0" stroke="white" strokeWidth=".6"/></pattern></defs>
 <rect width="600" height="400" fill="white"/>{regions.map((r,i)=>{const region=r.paintRegion??i,index=r.shapeIndex??i-1,fillCol=regionColour(art,region,r.part);return <g key={maskKey(r)}>{shapeNode(r,{fill:fillCol,stroke:r.type==='line'?(art.colors[region]||'#777'):r.type==='polygon'?fillCol:'#bbc5c3',strokeWidth:r.type==='line'?8:r.type==='polygon'?0.6:1,role:'button',tabIndex:0,'data-shape-index':index,'aria-label':`${tr('영역','Region')} ${region}${r.part===undefined?'':region===0?` · ${tr(`구획 ${r.part+1}`,`Section ${r.part+1}`)}`:` · ${tr(r.part===0?'위쪽':'아래쪽',r.part===0?'Upper half':'Lower half')}`}`,onKeyDown:e=>{if(custom&&arrange&&index>=0&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete','Backspace'].includes(e.key)){e.preventDefault();setSelected(index);setSelectedPart(r.part);if(e.key==='Delete'||e.key==='Backspace'){commit(removeShape(art,index));setSelected(-1);}else{const step=e.shiftKey?20:5,next=moveShape(art.shapes[index],e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0),before=shapeBounds(art.shapes[index]),after=shapeBounds(next);commit({...art,shapes:art.shapes.map((r,j)=>j===index?next:r),strokes:art.strokes.map(st=>st.region===region?{...st,points:st.points.map(([x,y])=>[x+after.x-before.x,y+after.y-before.y])}:st)});}return;}if(e.key==='Enter'||e.key===' '){e.preventDefault();if(custom&&(arrange||e.key==='Enter'&&index>=0)){setArrange(true);setSelected(index);setSelectedPart(r.part);showTrash(index);return;}if(tool==='paint')commit(paintRegion(art,region,r.part,ink));else setMessage(tr('색칠 종이에서 손이나 마우스를 움직여 칠해 주세요.','Move your finger or mouse on the paper to draw.'))}}})}</g>})}
 {strokes.map((s,i)=><g key={i} data-draft={i>=art.strokes.length?true:undefined} mask={`url(#${prefix}-mask-${regionKey(s.region,s.part)})`} pointerEvents="none">{s.fill&&s.fillPoints&&<path d={polygonPathD(s.fillPoints)} fill={s.fill}/>}<path d={pathFor(s.points)} fill="none" stroke={textureUrls[s.tool+s.color]?`url(#${prefix}-texture-${(s.tool+s.color).replace('#','')})`:s.tool==='eraser'?'#ffffff':s.color} strokeWidth={s.size} strokeLinecap="round" strokeLinejoin="round"/></g>)}
 <rect width="600" height="400" fill="none" stroke="#bbc5c3" strokeWidth="1" pointerEvents="none"/>
 {custom&&arrange&&handle&&<g data-editor="true"><rect {...shapeBounds(handle)} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 4" pointerEvents="none"/><circle data-resize="true" cx={handleXY[0]} cy={handleXY[1]} r="12" fill="#2563eb" stroke="white" strokeWidth="3"/>{trashVisible&&<g className="shape-delete-target" transform={`translate(${Math.max(4,Math.min(544,shapeBounds(handle).x+shapeBounds(handle).width-52))} ${Math.max(4,shapeBounds(handle).y-56)})`} role="button" tabIndex={0} aria-label={tr('선택한 도형 삭제','Delete selected shape')} onPointerDown={e=>{e.preventDefault();e.stopPropagation();}} onPointerUp={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();deleteSelected();}} onKeyDown={e=>{if(['Enter',' ','Delete','Backspace'].includes(e.key)){e.preventDefault();e.stopPropagation();deleteSelected();}}}><rect width="52" height="52" rx="11" fill="#fff7f5" stroke="#a73934" strokeWidth="2"/><Trash x={14} y={14} size={24} color="#a73934" pointerEvents="none"/></g>}</g>}
 </svg></div>}</div></div>
 <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
 {draftSaveError&&<p className="draft-save-alert" role="alert">{tr('이 화면에서는 그림이 유지돼요. 새로고침 뒤에도 보관하려면 저장 공간을 확보해 주세요.','Your drawing is kept during this visit. Free up storage to keep it after reloading.')}</p>}
 </section>;
}
