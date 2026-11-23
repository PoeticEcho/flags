import {Check,MapPin,Tag} from '@phosphor-icons/react';
import {capitalName} from './quiz-data.js';

export default function CountrySearchOptions({results,language,onSelect,currentCode,currentTerritoryKey=null,getOptionProps,showCurrentIndicator=false}) {
 const ko=language==='ko';
 return <>{['country','territory','tag'].map(kind=>{
  const matches=results.map((match,index)=>({...match,index})).filter(match=>match.kind===kind);
  if(!matches.length)return null;
  const label=kind==='tag'?(ko?'태그':'Tags'):kind==='territory'?(ko?'지역·영토':'Territories · regions'):(ko?'나라·수도':'Countries · capitals');
  return <div key={kind} className="search-result-group" role="group" aria-label={label}>
   <div className="search-result-heading" aria-hidden="true">{label}</div>
   {matches.map(match=>{
    const {country,territory,keyword,index}=match;
    if(kind==='territory'&&territory){
     const isCurrent=territory.key===currentTerritoryKey;
     return <button type="button" key={`territory:${territory.key}`} aria-selected={isCurrent} {...getOptionProps?.(country,index,match)} role="option" data-match="territory" data-territory={territory.key} onClick={()=>onSelect(country,match)}>
      <img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.svg`} draggable={false} alt="" loading="lazy"/>
      <span>
       <strong>{ko?territory.nameKo:territory.nameEn}</strong>
       <small>{ko?`${country.nameKo} 연결 · ${territory.kindKo}`:`Linked to ${country.name} · ${territory.kindEn}`}</small>
       <small className="search-matched-territory"><MapPin size={13} weight="fill" aria-hidden="true"/>{ko?(territory.capitalKo?`${territory.capitalKo} · 지도 이동`:'지도 위치로 이동'):(territory.capitalEn?`${territory.capitalEn} · Focus on map`:'Focus on map')}</small>
      </span>
      {showCurrentIndicator&&isCurrent&&<Check size={18} aria-label={ko?'현재 지역':'Current territory'}/>}
     </button>;
    }
    return <button type="button" key={country.code} aria-selected={country.code===currentCode&&!currentTerritoryKey} {...getOptionProps?.(country,index,match)} role="option" data-match={kind} onClick={()=>onSelect(country,match)}>
     <img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.svg`} draggable={false} alt="" loading="lazy"/>
     <span><strong>{ko?country.nameKo:country.name}</strong><small>{capitalName(country,language)} · {ko?country.name:country.nameKo}</small>
      {keyword&&<small className="search-matched-tag"><Tag size={14} aria-hidden="true"/>{ko?'태그':'Tag'} · {keyword[language]}</small>}
     </span>
     {showCurrentIndicator&&country.code===currentCode&&!currentTerritoryKey&&<Check size={18} aria-label={ko?'현재 나라':'Current country'}/>}
    </button>;
   })}
  </div>;
 })}</>;
}
