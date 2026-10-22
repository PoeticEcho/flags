import test from 'node:test';import assert from 'node:assert/strict';
import snapshot from '../sources/un-wpp2024-population-2025-extract.json' with {type:'json'};
import {roster} from '../src/data.js';import {learningData} from '../src/learning-data.js';
import {populationData,formatPopulation,populationSource} from '../src/population.js';
test('all 197 populations exactly match the identified UN 2025 medium-variant country rows',()=>{
 assert.equal(Object.keys(populationData).length,197);assert.match(populationSource,/2025.*projection/);
 const rows=new Map(snapshot.rows.map(r=>[r[6],r]));
 for(const c of roster){const r=rows.get(c.code),p=populationData[c.code];assert.equal(r[8],'Country/Area');assert.equal(r[1],'Medium');assert.equal(r[10],2025);assert.equal(p.locationCode,r[4]);assert.equal(p.value,Math.round(r[12]*1000),c.code);assert.ok(p.value>0);assert.equal(learningData[c.code].population2025,p.value);}
 assert.equal(populationData.VA.value,501);assert.equal(populationData.XK.locationCode,412);
});
test('population labels keep small nations nonzero and large figures readable in both languages',()=>{
 assert.equal(formatPopulation(501,'ko'),'약 501 명');assert.equal(formatPopulation(501,'en'),'about 501 people');
 assert.equal(formatPopulation(1_234_567,'ko'),'약 123.5만 명');assert.equal(formatPopulation(1_234_567,'en'),'about 1.2 million people');
 assert.match(formatPopulation(1_463_865_525,'ko'),/14\.6억/);assert.match(formatPopulation(1_463_865_525,'en'),/1\.5 billion/);
 for(const p of Object.values(populationData))for(const lang of ['ko','en']){assert.ok(formatPopulation(p.value,lang));assert.doesNotMatch(formatPopulation(p.value,lang),/약 0 |about 0 /);}
 for(const invalid of [NaN,undefined,0,-1])assert.equal(formatPopulation(invalid,'ko'),'');
});
