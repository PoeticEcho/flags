import {Check,Tag} from '@phosphor-icons/react';
import {capitalName} from './quiz-data.js';

export default function CountrySearchOptions({results,language,onSelect,currentCode,getOptionProps,showCurrentIndicator=false}) {
 const ko=language==='ko';
 return <>{['country','tag'].map(kind=>{
  const matches=results.map((match,index)=>({...match,index})).filter(match=>match.kind===kind);
  if(!matches.length)return null;
  const label=kind==='tag'?(ko?'태그':'Tags'):(ko?'나라·수도':'Countries · capitals');
  return <div key={kind} className="search-result-group" role="group" aria-label={label}>
   <div className="search-result-heading" aria-hidden="true">{label}</div>
   {matches.map(({country,keyword,index})=><button type="button" key={country.code} aria-selected={country.code===currentCode} {...getOptionProps?.(country,index)} role="option" data-match={kind} onClick={()=>onSelect(country)}>
    <img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.svg`} draggable={false} alt="" loading="lazy"/>
    <span><strong>{ko?country.nameKo:country.name}</strong><small>{capitalName(country,language)} · {ko?country.name:country.nameKo}</small>
     {keyword&&<small className="search-matched-tag"><Tag size={14} aria-hidden="true"/>{ko?'태그':'Tag'} · {keyword[language]}</small>}
    </span>
    {showCurrentIndicator&&country.code===currentCode&&<Check size={18} aria-label={ko?'현재 나라':'Current country'}/>}
   </button>)}
  </div>;
 })}</>;
}
