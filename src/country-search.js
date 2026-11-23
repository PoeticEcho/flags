import {learningData} from './learning-data.js';
import {MAP_TERRITORIES} from './map-territories.js';

export const normalizeCountryQuery=value=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');

const keywordIndex=new Map(Object.entries(learningData).map(([code,data])=>[code,data.keywords.map(keyword=>({keyword,values:[keyword.ko,keyword.en].map(normalizeCountryQuery)}))]));

// Names and capitals always precede tags, even an exact tag match.
// One result per country retains its matching tag for the search UI.
export function searchCountryMatches(countries,query,{language='ko',limit=Infinity,includeAll=false,includeTerritories=false}={}) {
 const needle=normalizeCountryQuery(query);
 if(!needle&&!includeAll)return [];
 const byCode=new Map(countries.map(c=>[c.code,c]));
 const countryMatches=countries.map(country=>{
  const names=[country.name,country.nameKo,...(country.aliases||[])].map(normalizeCountryQuery);
  const capitals=[country.capital,country.capitalKo].map(normalizeCountryQuery);
  const fields=[...names,...capitals];
  const rank=!needle?0:names.includes(needle)?0:capitals.includes(needle)?1:fields.some(v=>v.startsWith(needle))?2:fields.some(v=>v.includes(needle))?3:Infinity;
  if(Number.isFinite(rank))return {country,rank,kind:'country'};
  let match={country,rank:Infinity,kind:'tag'};
  for(const {keyword,values} of keywordIndex.get(country.code)||[]){
   const tagRank=values.includes(needle)?4:values.some(v=>v.startsWith(needle))?5:values.some(v=>v.includes(needle))?6:Infinity;
   if(tagRank<match.rank)match={country,rank:tagRank,kind:'tag',keyword};
  }
  return match;
 }).filter(v=>Number.isFinite(v.rank));

 const territoryMatches=includeTerritories&&needle?MAP_TERRITORIES.map(territory=>{
  const linked=byCode.get(territory.linkedCode);
  if(!linked)return null;
  const names=[territory.nameEn,territory.nameKo,territory.matchName,...(territory.aliases||[])].filter(Boolean).map(normalizeCountryQuery);
  const capitals=[territory.capitalEn,territory.capitalKo].filter(Boolean).map(normalizeCountryQuery);
  const fields=[...names,...capitals];
  const rank=names.includes(needle)?3.1:capitals.includes(needle)?3.2:fields.some(v=>v.startsWith(needle))?3.3:fields.some(v=>v.includes(needle))?3.4:Infinity;
  return Number.isFinite(rank)?{country:linked,territory,rank,kind:'territory'}:null;
 }).filter(Boolean):[];

 const sortName=item=>item.territory?(language==='ko'?item.territory.nameKo:item.territory.nameEn):(language==='ko'?item.country.nameKo:item.country.name);
 return [...countryMatches,...territoryMatches].sort((a,b)=>a.rank-b.rank||sortName(a).localeCompare(sortName(b),language)).slice(0,limit);
}

// Collections keep the country-object API and the same result order.
export function searchCountries(countries,query,options) {
 return searchCountryMatches(countries,query,options).map(match=>match.country);
}
