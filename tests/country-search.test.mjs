import test from 'node:test';
import assert from 'node:assert/strict';
import {roster,explorationRoster,countryByCode} from '../src/data.js';
import {learningData} from '../src/learning-data.js';
import {normalizeCountryQuery,searchCountries,searchCountryMatches} from '../src/country-search.js';

test('all 197 countries can be found by Korean and English country names and capitals',()=>{
 assert.equal(roster.length,197);
 for(const country of roster)for(const field of ['name','nameKo','capital','capitalKo']){
  assert.ok(country[field],`${country.code} ${field}`);
  assert.ok(searchCountries(roster,country[field]).some(v=>v.code===country.code),`${country.code}: ${country[field]}`);
 }
});

test('every one of the 1,990 bilingual keywords finds its associated destination without a search prefix',()=>{
 let count=0;
 for(const country of explorationRoster)for(const keyword of learningData[country.code].keywords){
  count++;
  for(const language of ['ko','en'])assert.ok(searchCountries(explorationRoster,keyword[language],{language}).some(result=>result.code===country.code),`${country.code} ${keyword[language]}`);
 }
 assert.equal(count,1990);
 for(const query of ['석회암','limestone','LIME-STONE']){
  const match=searchCountryMatches(explorationRoster,query).find(m=>m.country.code==='CU');
  assert.equal(match.kind,'tag');assert.equal(match.keyword.ko,'석회암');assert.equal(match.keyword.en,'limestone');
 }
});
test('partial country and capital names still precede exact tags, with one result per destination',()=>{
 const cuba=countryByCode.get('CU');
 const countries=[cuba,{code:'name',name:'Limestone Republic',nameKo:'이름 일치',capital:'Elsewhere',capitalKo:'기타'},{code:'capital',name:'Other Republic',nameKo:'수도 일치',capital:'Limestone City',capitalKo:'기타'}];
 const matches=searchCountryMatches(countries,'limestone',{language:'en'});
 assert.deepEqual(matches.map(m=>m.kind),['country','country','tag']);assert.equal(matches[2].country,cuba);
 assert.equal(searchCountryMatches(countries,'limestone',{language:'en',limit:1})[0].kind,'country');
 for(const query of ['Havana','서울','Nuuk','island','사막']){
  const results=searchCountryMatches(explorationRoster,query);
  assert.equal(new Set(results.map(m=>m.country.code)).size,results.length);
  const tagStart=results.findIndex(m=>m.kind==='tag');
  if(tagStart!==-1)assert.ok(results.slice(tagStart).every(m=>m.kind==='tag'));
 }
 assert.equal(searchCountryMatches(explorationRoster,'Havana').filter(m=>m.country.code==='CU').length,1);
 assert.equal(searchCountryMatches(explorationRoster,'Havana')[0].kind,'country');
});
test('broad tag results remain complete and collection subsets stay scoped',()=>{
 assert.equal(searchCountryMatches(explorationRoster,'사막').length,9);
 assert.deepEqual(new Set(searchCountries(explorationRoster,'빙산').map(c=>c.code)),new Set(['GL','AQ']));
 assert.deepEqual(searchCountries([countryByCode.get('FR')],'석회암'),[]);
 assert.deepEqual(searchCountries([countryByCode.get('CU')],'석회암').map(c=>c.code),['CU']);
});
test('search accepts case, spacing, accents and country aliases in either UI language',()=>{
 for(const query of ['대한민국','South Korea','SEOUL','서 울'])assert.ok(searchCountries(roster,query,{language:'en'}).some(v=>v.code==='KR'),query);
 assert.equal(searchCountries(roster,'Brasilia')[0].code,'BR');
 for(const alias of countryByCode.get('TR').aliases)assert.ok(searchCountries(roster,alias).some(v=>v.code==='TR'));
 assert.equal(normalizeCountryQuery('  São-Tomé '),normalizeCountryQuery('sao tome'));
});
test('exact country matches precede exact capitals, and empty/no-match queries behave predictably',()=>{
 const countries=[{code:'a',name:'Rome',nameKo:'로마',capital:'Elsewhere',capitalKo:'다른 곳'},{code:'b',name:'Italy',nameKo:'이탈리아',capital:'Rome',capitalKo:'로마'}];
 assert.deepEqual(searchCountries(countries,'Rome').map(v=>v.code),['a','b']);
 assert.deepEqual(searchCountries(roster,'not-a-real-country-123'),[]);
 assert.deepEqual(searchCountries(roster,'  '),[]);
 assert.equal(searchCountries(roster,'',{includeAll:true}).length,197);
 assert.equal(searchCountries(roster,'',{includeAll:true,limit:7}).length,7);
 assert.deepEqual(searchCountries(roster,'',{includeAll:true,language:'en'}).map(v=>v.name),roster.map(v=>v.name).sort((a,b)=>a.localeCompare(b,'en')));
});
