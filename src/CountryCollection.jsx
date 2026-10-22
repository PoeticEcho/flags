import {useEffect,useRef,useState} from 'react';
import {MagnifyingGlass,X} from '@phosphor-icons/react';
import {filterCollection} from './collection-data.js';
import MyCountryCard from './MyCountryCard.jsx';
import CountryCardFace from './CountryCardFace.jsx';
import {explorationRoster} from './data.js';
import {openDialogWithReturnFocus} from './dialog-focus.js';
export default function CountryCollection({language,filter,onFilter,countries,gallery,progress,exploredCount,solvedCount,onClose,onCountry,onEdit,onPreview,onDelete}) {
 const tr=(ko,en)=>language==='ko'?ko:en,mine=filter==='mine',dialog=useRef(),input=useRef();
 const [query,setQuery]=useState(''),[error,setError]=useState(''),[announcement,setAnnouncement]=useState('');
 const results=filterCollection(countries,gallery,filter,query,language),personalCount=gallery.filter(i=>i.custom).length;
 useEffect(()=>openDialogWithReturnFocus(dialog.current),[]);
 const remove=item=>{
  if(!onDelete(item)){setError(tr('삭제하지 못했어요. 저장 공간을 확인하고 다시 눌러 주세요.','Could not delete the card. Check storage and try again.'));return false;}
  setError('');setAnnouncement(tr(`${item.countryName} 나라 카드를 삭제했어요.`,`${item.englishName||item.countryName} country card deleted.`));
  requestAnimationFrame(()=>input.current?.focus());return true;
 };
 return <dialog ref={dialog} className="collection-panel country-collection" aria-labelledby="collection-title" onCancel={event=>{event.preventDefault();onClose();}}>
  <div className="collection-heading"><div><h2 id="collection-title">{mine?tr('나만의 나라 카드','My country cards'):tr('세계 탐험 카드','World explorer cards')}</h2><p>{mine?tr(`내 나라 ${personalCount}개 · 이 기기에 저장`,`${personalCount} personal countries · Saved on this device`):tr(`탐험 ${exploredCount}곳 · 퀴즈 ${solvedCount}곳`,`${exploredCount} explored · ${solvedCount} quizzes solved`)}</p></div><button className="close-collection" aria-label={tr('나라 카드 닫기','Close country cards')} onClick={onClose}><X size={22}/></button></div>
  <div className="collection-filters" role="group" aria-label={tr('카드 묶음','Card set')}>{[['priority',tr('주요 48개국','Priority 48')],['all',tr(`전체 ${explorationRoster.length}곳`,`All ${explorationRoster.length} places`)],['visited',tr('탐험한 곳','Explored')],['mine',tr(`내 나라 ${personalCount}개`,`My countries · ${personalCount}`)]].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>{onFilter(id);setError('');}}>{label}</button>)}</div>
  <div className="collection-search-row"><label className="collection-search"><MagnifyingGlass size={21} aria-hidden="true"/><span className="sr-only">{mine?tr('내 나라 이름 검색','Search my country names'):tr('나라, 수도 또는 태그 검색','Search countries, capitals or tags')}</span><input ref={input} aria-label={mine?tr('내 나라 이름 검색','Search my country names'):tr('나라, 수도 또는 태그 검색','Search countries, capitals or tags')} type="search" autoComplete="off" value={query} placeholder={mine?tr('내 나라 이름 검색','Search my country names'):tr('나라·수도·태그 검색','Country · capital · tag')} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" aria-label={tr('검색 지우기','Clear search')} onClick={()=>{setQuery('');input.current?.focus();}}><X size={19}/></button>}</label><span className="collection-result-count" role="status">{tr(`${results.length}개`,`${results.length} cards`)}</span></div>
  {error&&<p className="collection-error" role="alert">{error}</p>}
  <div className="collection-card-scroll" tabIndex={0} role="region" aria-label={tr('나라 카드 목록','Country cards')}>
   <div className="collection-grid learning-card-grid">{mine?results.map(item=><MyCountryCard key={item.id} item={item} language={language} onPreview={onPreview} onEdit={onEdit} onDelete={remove}/>):results.map(entry=><button key={entry.code} onClick={()=>onCountry(entry.code)} aria-label={`${language==='ko'?entry.nameKo:entry.name} ${tr('탐험하기','explore')}`}><CountryCardFace lazy country={entry} language={language} discovered={progress.discovered.includes(entry.code)} solved={progress.solved.includes(entry.code)}/></button>)}</div>
   {!results.length&&<p className="collection-empty">{query.trim()?tr('검색에 맞는 나라가 없어요. 다른 이름으로 찾아보세요.','No matching countries. Try another name.'):mine?tr('내 국기에 이름을 지어 저장하면 여기 나라 카드가 생겨요.','Name and save your own flag to create a country card here.'):tr('지도를 누르거나 나라 카드를 골라 첫 탐험을 시작해요.','Tap the map or choose a country card to start exploring.')}</p>}
  </div>
  <span className="sr-only" aria-live="polite">{announcement}</span>
 </dialog>;
}
