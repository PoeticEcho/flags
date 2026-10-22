import test from 'node:test';
import assert from 'node:assert/strict';
import {roster, capitalPoints} from '../src/data.js';
import {learningData} from '../src/learning-data.js';
import baseline from '../src/basic-country-data.json' with {type:'json'};
import provenance from '../sources/learning-enrichment-sources.json' with {type:'json'};
import pack from '../public/data/learning-content.json' with {type:'json'};
import expansion from '../sources/learning-story-expansion-sources.json' with {type:'json'};
import threeStoryEdition from '../sources/learning-three-story-edition.json' with {type:'json'};

const normalized = text=>text.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');

test('all 197 countries have five bilingual stories and ten distinct words in both languages',()=>{
  assert.equal(Object.keys(learningData).length,199);
  for(const country of roster){
    const data=learningData[country.code];
    assert.equal(data.facts.length,5,country.code);
    assert.equal(data.keywords.length,10,country.code);
    for(const lang of ['ko','en']){
      assert.ok(data.facts.every(f=>f[lang].trim().length>15),`${country.code}/${lang}`);
      assert.equal(new Set(data.keywords.map(w=>normalized(w[lang]))).size,10,`${country.code}/${lang}`);
      assert.ok(data.keywords.some(w=>normalized(w[lang])===normalized(lang==='ko'?country.capitalKo:country.capital)),country.code);
    }
  }
});

test('137 newly detailed countries preserve capital roles and replace generic filler with sourced stories',()=>{
  assert.equal(Object.keys(provenance.countries).length,137);
  for(const code of Object.keys(provenance.countries)){
    const data=learningData[code];
    assert.deepEqual(data.facts[0],baseline[code].facts[0],code);
    for(const lang of ['ko','en']){
      assert.notEqual(data.facts[1][lang],baseline[code].facts[1][lang],code);
      assert.notEqual(data.facts[2][lang],baseline[code].facts[2][lang],code);
    }
    assert.doesNotMatch(data.facts.slice(1).map(f=>f.en).join(' '),/this country’s nature or history|Its land neighbours include|Languages used in this country include/);
    assert.ok(data.keywords.some(w=>w.artwork),`${code}: retain postcard connection`);
    assert.ok(provenance.countries[code].sources.every(url=>data.sources.includes(url)),code);
  }
});

test('exceptional capitals, disputed seats and tentative heritage retain careful wording',()=>{
  for(const code of ['BO','ZA','NL','SZ','CH','NR','TV','PS','GQ']){
    const country=roster.find(c=>c.code===code);
    assert.equal(country.capital,baseline[code].capital,code);
    assert.equal(country.capitalRole,baseline[code].capitalRole,code);
    assert.deepEqual(country.capitalNote,baseline[code].capitalNote,code);
  }
  assert.match(learningData.NR.facts[0].en,/no official capital/);
  for(const code of ['SO','MV','SS'])assert.doesNotMatch(learningData[code].facts.map(f=>f.en).join(' '),/inscribed World Heritage|is a UNESCO World Heritage site/i);
  assert.doesNotMatch(learningData.LK.facts.map(f=>f.en).join(' '),/land neighbours.*India/);
  assert.doesNotMatch(learningData.ES.facts.map(f=>f.en).join(' '),/completed in 2026/);
});

test('downloadable edition matches every app record, capital coordinate and population',()=>{
  assert.equal(pack.storyCountPerCountry,5);
  assert.equal(pack.storyCount,985);
  assert.equal(pack.additionalStoryCount,394);
  assert.equal(pack.preservedStoryCount,591);
  assert.equal(pack.countries.length,197);
  assert.equal(new Set(pack.countries.map(c=>c.code)).size,197);
  assert.equal(pack.countries.reduce((n,c)=>n+c.facts.length,0),pack.storyCount);
  assert.equal(pack.countries.reduce((n,c)=>n+c.keywords.length,0),pack.bilingualKeywordCount);
  for(const entry of pack.countries){
    const country=roster.find(c=>c.code===entry.code), data=learningData[entry.code];
    assert.equal(entry.capital,country.capital,entry.code);
    assert.equal(entry.capitalKo,country.capitalKo,entry.code);
    assert.deepEqual(entry.coordinates,capitalPoints[entry.code].coordinates,entry.code);
    assert.deepEqual(entry.facts,data.facts,entry.code);
    assert.deepEqual(entry.keywords,data.keywords,entry.code);
    assert.deepEqual(entry.sources,data.sources,entry.code);
    assert.equal(entry.population2025,data.population2025,entry.code);
    assert.equal(entry.postcard.en,capitalPoints[entry.code].landmark,entry.code);
  }
});

test('five-story expansion preserves all 591 original passages and 1,970 keyword pairs exactly',()=>{
  assert.equal(Object.keys(threeStoryEdition).length,197);
  for(const {code} of roster){
    assert.deepEqual(learningData[code].facts.slice(0,3),threeStoryEdition[code].facts,code);
    assert.deepEqual(learningData[code].keywords,threeStoryEdition[code].keywords,code);
    for(const lang of ['ko','en']){
      assert.equal(new Set(learningData[code].facts.map(f=>normalized(f[lang]))).size,5,`${code}/${lang}`);
    }
  }
});

test('all 394 added story pairs have country-specific primary references and explicit review scope',()=>{
  assert.equal(expansion.additionalStoryCount,394);
  assert.deepEqual(Object.keys(expansion.countries).sort(),roster.map(c=>c.code).sort());
  assert.match(expansion.method,/authored teaching extensions/);
  for(const {code} of roster){
    const entry=expansion.countries[code];
    assert.deepEqual(entry.storyNumbers,[4,5],code);
    assert.equal(entry.sourceKind,'primary',code);
    assert.ok(entry.sources.length>0,code);
    assert.ok(entry.sources.every(url=>url.startsWith('https://')&&learningData[code].sources.includes(url)),code);
    assert.deepEqual(learningData[code].contentReview.addedStoryNumbers,[4,5],code);
  }
});
