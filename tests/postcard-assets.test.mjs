import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {explorationPoints as capitalPoints,explorationRoster as roster} from '../src/data.js';
import assets from '../src/postcard-assets.json' with {type:'json'};

test('every postcard binding resolves to an actual asset and bilingual scene caption',()=>{
 for(const [code,place] of Object.entries(capitalPoints)){
  if(!place.image)continue;
  assert.ok(roster.some(c=>c.code===code),code);
  assert.ok(place.landmark && place.landmarkKo,code);
  assert.ok(existsSync(new URL('../public'+place.image,import.meta.url)),code);
 }
});
test('new postcards retain generation prompts, factual sources and review records',()=>{
 for(const [code,asset] of Object.entries(assets)){
  const record=JSON.parse(readFileSync(new URL(`../artwork/postcards/${code.toLowerCase()}.json`,import.meta.url)));
  assert.equal(record.webImage,asset.image);
  assert.ok(record.prompt.length>150,code);
  assert.ok(record.inspection.length>10,code);
  assert.ok(record.sources.length,code);
  assert.ok(record.width>=1000 && record.height>=600,code);
  assert.equal(capitalPoints[code].imageFit,'contain');
 }
});
