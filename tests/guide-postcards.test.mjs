import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {capitalPoints,roster} from '../src/data.js';
import {learningData} from '../src/learning-data.js';
import baseline from '../src/basic-country-data.json' with {type:'json'};
import reconciliation from '../artwork/user-backup-reconciliation.json' with {type:'json'};
import progress from '../artwork/postcard-progress.json' with {type:'json'};

test('the 45 guide scenes are connected without counting reused scenes as new countries',()=>{
 const entries=reconciliation.guideEntries;
 assert.equal(entries.length,45);
 assert.equal(new Set(entries.map(e=>e.code)).size,45);
 assert.deepEqual(entries.map(e=>e.guideWorkOrder).sort((a,b)=>a-b),Array.from({length:45},(_,i)=>i+1));
 assert.equal(entries.filter(e=>e.generationComplete).length,41);
 assert.equal(entries.filter(e=>e.status==='reuse_approved').length,4);
 for(const entry of entries){
  assert.equal(entry.appConnectionVerifiedForGuideScene,true,entry.code);
  assert.equal(capitalPoints[entry.code].image,entry.currentAppImage,entry.code);
  assert.deepEqual(capitalPoints[entry.code].coordinates,baseline[entry.code].coordinates,entry.code);
 }
 const connected=roster.filter(country=>capitalPoints[country.code].image).length;
 assert.equal(connected,197);
 assert.equal(progress.completed,connected);
 assert.equal(progress.remaining,197-connected);
 assert.equal(reconciliation.summary.currentAppUnconnectedCountries,progress.remaining);
 assert.equal(reconciliation.summary.remainingNewGuideImages,0);
});

test('the Bahamas alternate scene preserves the original Nassau asset and its metadata',()=>{
 const current=JSON.parse(readFileSync(new URL('../artwork/postcards/bs.json',import.meta.url)));
 const previous=JSON.parse(readFileSync(new URL('../artwork/postcards/'+current.previousSceneMetadata,import.meta.url)));
 assert.equal(previous.landmark,'Nassau coast');
 assert.equal(previous.webImage,'/assets/postcards/bs.webp');
 assert.equal(current.webImage,'/assets/postcards/bs-deans-blue-hole.webp');
 assert.notEqual(current.webImage,previous.webImage);
 for(const scene of [current,previous])assert.ok(existsSync(new URL('../public'+scene.webImage,import.meta.url)));
 assert.match(capitalPoints.BS.landmark,/Dean's Blue Hole/);
});

test('changed postcard subjects have matching bilingual learning content and capital context',()=>{
 for(const [code,keyword] of [['GQ','Pico Basile'],['SS','Sudd wetlands'],['BS',"Dean's Blue Hole"]]){
  assert.ok(learningData[code].keywords.some(k=>k.en===keyword&&k.artwork),code);
  assert.equal(learningData[code].facts.length,5,code);
  assert.deepEqual(learningData[code].facts[0],baseline[code].facts[0],code);
 }
 assert.ok(learningData.SS.sources.includes('https://whc.unesco.org/en/tentativelists/6276/'));
 assert.ok(!learningData.SS.facts.some(f=>/Sudd.*World Heritage site/.test(f.en)));
});
