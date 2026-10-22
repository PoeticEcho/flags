import test from 'node:test';
import assert from 'node:assert/strict';
import {roster,countryByCode} from '../src/data.js';
import {capitalQuestion,wordQuizOptions,capitalRole} from '../src/quiz-data.js';

test('every country has three distinct bilingual word answers with one correct capital',()=>{
 for(const country of roster){
  const choices=wordQuizOptions(country.code);
  assert.equal(choices.length,3,country.code);
  assert.equal(new Set(choices.map(c=>c.answer)).size,3,country.code);
  assert.equal(choices.filter(c=>c.correct).length,1,country.code);
  assert.equal(choices.find(c=>c.correct).answer,country.capital,country.code);
  assert.ok(choices.every(c=>c.name&&c.nameKo&&countryByCode.has(c.code)),country.code);
 }
});

test('localized questions put the country first in Korean and retain exceptional capital roles',()=>{
 assert.equal(capitalQuestion(countryByCode.get('FR'),'ko'),'프랑스의 수도는 어디일까요?');
 assert.equal(capitalQuestion(countryByCode.get('KR'),'en'),'What is the capital of Republic of Korea?');
 for(const code of ['NR','PS','CH','BO','ZA']){
  const country=countryByCode.get(code);
  assert.ok(capitalQuestion(country,'ko').includes(capitalRole(country,'ko')));
  assert.ok(capitalQuestion(country,'en').includes(capitalRole(country,'en').toLowerCase()));
  assert.ok(capitalQuestion(country,'ko',true).includes(capitalRole(country,'ko')));
  assert.ok(capitalQuestion(country,'en',true).includes(capitalRole(country,'en').toLowerCase()));
 }
});

test('random questions use real capitals from the same continent and have separated map pins for all countries',async()=>{
 const {capitalQuizOptions,quizContinent,quizCitySeparation}=await import('../src/quiz-data.js');
 for(const c of roster)for(let seed=1;seed<=12;seed++){
  let n=seed;const random=()=>((n=n*16807%2147483647)-1)/2147483646;
  const options=capitalQuizOptions(c.code,random);
  assert.equal(options.length,3,c.code);assert.equal(options.filter(o=>o.correct).length,1,c.code);
  assert.equal(new Set(options.map(o=>o.code)).size,3,c.code);
  assert.equal(new Set(options.map(o=>o.answer)).size,3,c.code);
  for(const o of options){const other=countryByCode.get(o.code);assert.equal(quizContinent(other),quizContinent(c),c.code);assert.equal(o.name,other.capital);assert.equal(o.nameKo,other.capitalKo);}
  assert.ok(quizCitySeparation(options)>=48,c.code);
 }
 assert.equal(quizContinent(countryByCode.get('CU')),'NorthAmerica');assert.equal(quizContinent(countryByCode.get('BR')),'SouthAmerica');
 const sets=new Set(Array.from({length:20},()=>capitalQuizOptions('KR').map(o=>o.id).join(',')));assert.ok(sets.size>1);
});
test('city framing uses the shortest Pacific wrap and wrong hints identify the localized country without leaking it in a question',async()=>{
 const {capitalQuizOptions,quizMapFrame,wrongCapitalHint}=await import('../src/quiz-data.js');
 const pacific=[{coordinates:[179,-8]},{coordinates:[-175,-21]},{coordinates:[166,-22]}],frame=quizMapFrame(pacific);
 assert.equal(frame.bounds[1][0]-frame.bounds[0][0],19);assert.ok(frame.wrapped);
 for(const c of roster){const choices=capitalQuizOptions(c.code),f=quizMapFrame(choices);for(const [x,y] of f.coordinates){assert.ok(x>=f.bounds[0][0]&&x<=f.bounds[1][0]);assert.ok(y>=f.bounds[0][1]&&y<=f.bounds[1][1]);}for(const o of choices){assert.equal('countryName' in o,false);assert.ok(wrongCapitalHint(o,'ko').includes(countryByCode.get(o.code).nameKo));assert.ok(wrongCapitalHint(o,'en').includes(countryByCode.get(o.code).name));}}
 assert.equal(wrongCapitalHint(null,'ko'),'');
});
