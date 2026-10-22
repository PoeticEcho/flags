import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {MagnifyingGlass,CaretDown} from '@phosphor-icons/react';
import {explorationRoster as roster,countryByCode} from './data.js';
import {searchCountryMatches} from './country-search.js';
import CountrySearchOptions from './CountrySearchOptions.jsx';

export default function ColourCountryPicker({code,language,onSelect}) {
 const ko=language==='ko',host=useRef(),popup=useRef(),input=useRef(),listId=useId();
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[active,setActive]=useState(0),[position,setPosition]=useState({});
 const selected=countryByCode.get(code),selectedName=ko?selected.nameKo:selected.name;
 const results=useMemo(()=>searchCountryMatches(roster,query,{language,includeAll:true}),[query,language]);
 const close=()=>{setOpen(false);setQuery('');};
 const choose=country=>{input.current?.focus();close();onSelect(country.code);};
 const show=()=>{setOpen(true);setActive(0);};
 useEffect(()=>{setActive(0);},[query,language]);
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(!host.current?.contains(e.target)&&!popup.current?.contains(e.target))close();};
  const update=()=>{const r=host.current.getBoundingClientRect(),width=Math.min(430,Math.max(320,r.width),window.innerWidth-20),below=window.innerHeight-r.bottom-18,above=r.top-18,useAbove=below<160&&above>below,maxHeight=Math.max(80,Math.min(360,useAbove?above:below));setPosition({left:Math.max(10,Math.min(r.left,window.innerWidth-width-10)),width,maxHeight,...(useAbove?{bottom:window.innerHeight-r.top+8,top:'auto'}:{top:r.bottom+8,bottom:'auto'})});};
  update();document.addEventListener('pointerdown',outside);window.addEventListener('resize',update);window.addEventListener('scroll',update,true);
  return ()=>{document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true);};
 },[open]);
 useEffect(()=>{if(open)popup.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({block:'nearest'});},[active,open]);
 const keyboard=e=>{
  if(e.nativeEvent.isComposing||e.keyCode===229)return;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!open){show();return;}setActive(v=>Math.max(0,Math.min(results.length-1,v+(e.key==='ArrowDown'?1:-1))));}
  if(e.key==='Enter'&&open&&results[active]){e.preventDefault();choose(results[active].country);}
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}
  if(e.key==='Tab')close();
 };
 return <div className="studio-country studio-country-header colour-country-picker" ref={host} onBlur={e=>{if(!popup.current?.contains(e.relatedTarget)&&!host.current?.contains(e.relatedTarget))close();}}>
  <label htmlFor={`${listId}-input`}>{ko?'색칠할 나라':'Country to colour'}</label>
  <div className="colour-country-field">
   <img src={`${import.meta.env.BASE_URL}flags/${code.toLowerCase()}.svg`} alt="" draggable={false}/>
   <input id={`${listId}-input`} ref={input} type="text" autoComplete="off" spellCheck={false} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open?listId:undefined} aria-activedescendant={open&&results[active]?`${listId}-${results[active].country.code}`:undefined} aria-describedby={`${listId}-hint`} value={open?query:selectedName} placeholder={ko?'나라·수도·태그 검색':'Country · capital · tag'} onFocus={show} onChange={e=>{setQuery(e.target.value);show();}} onKeyDown={keyboard}/>
   <button type="button" aria-label={ko?'색칠할 나라 목록 열기':'Open countries to colour'} aria-expanded={open} onPointerDown={e=>e.preventDefault()} onClick={()=>{if(open)close();else{input.current?.focus();show();}}}><span aria-hidden="true">{open?<MagnifyingGlass size={20}/>:<CaretDown size={18}/>}</span></button>
  </div>
  <span className="sr-only" id={`${listId}-hint`}>{ko?'한글 또는 영어 나라명, 수도와 태그로 검색하세요. 위아래 화살표와 Enter로 선택할 수 있어요.':'Search Korean or English country names, capitals and tags. Choose with arrow keys and Enter.'}</span>
  {open&&createPortal(<div ref={popup} className="search-popover global-search-popover colour-country-results" style={position}>
   <div id={listId} role="listbox" aria-label={ko?'색칠할 나라 검색 결과':'Countries to colour'}>{results.length?<CountrySearchOptions results={results} language={language} currentCode={code} onSelect={choose} showCurrentIndicator getOptionProps={(country,i)=>({tabIndex:-1,id:`${listId}-${country.code}`,'aria-selected':i===active,'data-index':i,onPointerDown:e=>e.preventDefault()})}/>:<div className="no-search-result" role="status">{ko?'검색에 맞는 나라가 없어요. 나라, 수도 또는 태그로 찾아보세요.':'No countries found. Try a country, capital or tag.'}</div>}</div>
  </div>,document.body)}
 </div>;
}
