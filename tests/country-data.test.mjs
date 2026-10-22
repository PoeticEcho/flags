import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {roster,capitalPoints,countryByCode} from '../src/data.js';
import {learningData} from '../src/learning-data.js';
import baseline from '../src/basic-country-data.json' with {type:'json'};
import {generatedLocationOptions,capitalName,capitalRole} from '../src/quiz-data.js';
import {priorityGroups,priorityCountryCodes} from '../src/priority-countries.js';
import {quizPool} from '../src/progress.js';

test('every roster country has five complete bilingual stories, a capital and local flag',()=>{
 assert.equal(roster.length,197);
 assert.equal(Object.keys(learningData).length,199);
 for(const c of roster){
  assert.ok(c.capital && c.capitalKo,c.code);
  assert.equal(learningData[c.code].facts.length,5,c.code);
  for(const f of learningData[c.code].facts){assert.ok(f.ko.length>15,c.code);assert.ok(f.en.length>15,c.code);}
  assert.equal(capitalName(c,'ko'),c.capitalKo);
  assert.equal(capitalName(c,'en'),c.capital);
  const [lon,lat]=capitalPoints[c.code].coordinates;
  assert.ok(Number.isFinite(lon)&&Math.abs(lon)<=180,c.code);
  assert.ok(Number.isFinite(lat)&&Math.abs(lat)<=90,c.code);
  assert.ok(existsSync(new URL(`../public/flags/${c.code.toLowerCase()}.svg`,import.meta.url)),c.code);
 }
});

test('all map quizzes have three distinct locations and exactly one correct capital',()=>{
 for(const c of roster){
  const options=generatedLocationOptions[c.code];
  assert.equal(options.length,3,c.code);
  assert.equal(new Set(options.map(o=>o.coordinates.toString())).size,3,c.code);
  assert.equal(options.filter(o=>o.code===c.code).length,1,c.code);
  assert.deepEqual(options.find(o=>o.code===c.code).coordinates,capitalPoints[c.code].coordinates);
 }
});

test('the reference 48-country set has complete learning cards and remains the quiz priority',()=>{
 assert.equal(priorityCountryCodes.length,48);
 assert.equal(new Set(priorityCountryCodes).size,48);
 assert.equal(quizPool(roster,priorityCountryCodes,48).length,48);
 assert.deepEqual(quizPool(roster,priorityCountryCodes,48).map(c=>c.code),priorityCountryCodes);
 assert.equal(new Set(quizPool(roster,priorityCountryCodes,197).map(c=>c.code)).size,197);
 for(const code of priorityCountryCodes){
  const c=countryByCode.get(code), learning=learningData[code];
  assert.ok(c && capitalPoints[code] && generatedLocationOptions[code],code);
  assert.equal(learning.keywords.length,10,code);
  assert.equal(new Set(learning.keywords.map(k=>k.en)).size,10,code);
  assert.ok(learning.keywords.every(k=>k.ko && k.en && k.type),code);
  assert.equal(learning.facts.length,5,code);
  assert.ok(learning.facts.some(f=>f.ko.includes(c.capitalKo)),code);
 }
 const north=priorityGroups.find(g=>g.id==='NorthAmerica').codes;
 for(const code of ['DO','CR','CU'])assert.ok(north.includes(code),code);
 assert.equal(countryByCode.get('KR').nameKo,'대한민국');
 assert.ok(countryByCode.get('KR').aliases.includes('South Korea'));
 assert.equal(countryByCode.get('TR').nameKo,'튀르키예');
 assert.ok(countryByCode.get('TR').aliases.includes('터키'));
});

test('reviewed capital changes and countries without a single ordinary capital retain context',()=>{
 assert.equal(countryByCode.get('GQ').capital,'Ciudad de la Paz');
 assert.equal(countryByCode.get('LK').capital,'Sri Jayewardenepura Kotte');
 assert.equal(countryByCode.get('SZ').capital,'Mbabane');
 assert.equal(capitalRole(countryByCode.get('NR'),'ko'),'정부 소재지');
 assert.equal(capitalRole(countryByCode.get('PS'),'en'),'Administrative centre');
 for(const code of ['NR','PS','IL','BO','ZA','LK','NL'])assert.ok(baseline[code].capitalNote.ko && baseline[code].capitalNote.en);
 assert.notEqual(countryByCode.get('DM').nameKo,countryByCode.get('DO').nameKo);
 assert.deepEqual(capitalPoints.MM.coordinates,[96.1297,19.7633]);
 assert.deepEqual(capitalPoints.PW.coordinates,[134.6243,7.5004]);
 assert.deepEqual(capitalPoints.TV.coordinates,[179.194547,-8.524263]);
 assert.equal(countryByCode.get('TV').capital,'Funafuti');
 assert.match(countryByCode.get('TV').capitalNote.en,/atoll/);
 assert.ok(baseline.TV.sources.includes('https://finance.gov.tv/contact-us/'));
});

test('sharing metadata is static, absolute and points to an included 1200×630 PNG',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/property="og:image" content="https:\/\/flags\.zap15\.chatgpt\.site\/og\.png"/);
 assert.match(html,/name="twitter:card" content="summary_large_image"/);
 const png=readFileSync(new URL('../public/og.png',import.meta.url));
 assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});
