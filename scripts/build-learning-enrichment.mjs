import {readFileSync, writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {roster, capitalPoints} from '../src/data.js';
import {firstBatch, secondBatch, thirdBatch, fourthBatch} from '../src/learning-data.js';
import {priorityLearningData} from '../src/priority-learning-data.js';
import {postcardSceneData} from '../src/postcard-scene-data.js';
import {populationData, populationSource} from '../src/population.js';
import baseline from '../src/basic-country-data.json' with {type:'json'};
import provenance from '../sources/learning-enrichment-sources.json' with {type:'json'};
import expansion from '../sources/learning-story-expansion-sources.json' with {type:'json'};
import threeStoryEdition from '../sources/learning-three-story-edition.json' with {type:'json'};

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const detailed = {...firstBatch, ...secondBatch, ...thirdBatch, ...fourthBatch, ...priorityLearningData, ...postcardSceneData};
const drafts = new Map();
for (const line of read('../sources/learning-stories-20261002.tsv').split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [code, ko2, en2, ko3, en3, words, ...extra] = line.split('\t');
  assert.equal(extra.length, 0, `${code}: unexpected columns`);
  assert.ok(!drafts.has(code), `${code}: duplicate draft`);
  const keywords = words.split(';').map(word => {
    const parts = word.split('|');
    assert.equal(parts.length, 3, `${code}: incomplete keyword`);
    const [ko, en, type] = parts;
    assert.ok(ko && en && type, `${code}: empty keyword`);
    return {ko, en, type};
  });
  assert.equal(keywords.length, 9, `${code}: expected nine draft words`);
  drafts.set(code, {facts:[baseline[code].facts[0], {ko:ko2, en:en2}, {ko:ko3, en:en3}], keywords});
}
assert.equal(roster.length, 197);
assert.equal(drafts.size, 137);
assert.deepEqual([...drafts.keys()].sort(), Object.keys(provenance.countries).sort());
assert.deepEqual([...drafts.keys()].sort(), roster.filter(c=>!detailed[c.code]).map(c=>c.code).sort());

const extraStories = new Map();
for (const line of read('../sources/learning-extra-stories-20261002.tsv').split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [code, ko4, en4, ko5, en5, ...extra] = line.split('\t');
  assert.equal(extra.length, 0, `${code}: unexpected extra-story columns`);
  assert.ok(!extraStories.has(code), `${code}: duplicate extra-story draft`);
  assert.ok([ko4, en4, ko5, en5].every(text=>text?.trim().length>15), `${code}: incomplete extra story`);
  extraStories.set(code, [{ko:ko4, en:en4}, {ko:ko5, en:en5}]);
}
const rosterCodes = roster.map(country=>country.code).sort();
assert.deepEqual([...extraStories.keys()].sort(), rosterCodes);
assert.deepEqual(Object.keys(expansion.countries).sort(), rosterCodes);
assert.deepEqual(Object.keys(threeStoryEdition).sort(), rosterCodes);

const normalize = value => value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
const uniqueWords = words => {
  const ko = new Set(), en = new Set();
  return words.filter(word => {
    const k = normalize(word.ko), e = normalize(word.en);
    if (ko.has(k) || en.has(e)) return false;
    ko.add(k); en.add(e); return true;
  });
};
const sceneMatches = (word, scene) => {
  if (!['landmark', 'place'].includes(word.type)) return false;
  return ['ko', 'en'].some(lang => {
    const label = normalize(lang==='ko' ? scene.landmarkKo : scene.landmark);
    const term = normalize(word[lang]);
    return label === term || (term.length >= (lang==='ko' ? 4 : 7) && (label.includes(term) || term.includes(label)));
  });
};
const sceneWords = {
  GQ:[['스페인어','Spanish','language'],['해발 고도','altitude','science'],['서식 환경','habitats','science']],
  SS:[['습지 생태계','wetland ecosystem','science'],['수생식물','aquatic plants','nature'],['서식지','habitats','science'],['물과 식물','water and plants','science']],
  BS:[['수심','water depth','science'],['블루홀','blue hole','nature'],['색의 차이','colour contrast','art'],['해안 지형','coastal landforms','geography']]
};

const enriched = {};
for (const country of roster) {
  const code = country.code;
  const previous = detailed[code] || baseline[code];
  let facts = drafts.get(code)?.facts || previous.facts;
  let keywords = drafts.get(code)?.keywords || previous.keywords;
  if (drafts.has(code)) {
    const capitalWord = {ko:country.capitalKo, en:country.capital, type:'city'};
    const scene = capitalPoints[code];
    if (normalize(scene.landmark) === normalize(capitalWord.en)) capitalWord.artwork = true;
    keywords = uniqueWords([capitalWord, ...keywords]).slice(1);
    const artworkIndex = keywords.findIndex(word=>sceneMatches(word, scene));
    if (artworkIndex >= 0) keywords = keywords.map((word, i)=>i===artworkIndex ? {...word, artwork:true} : word);
    if ((artworkIndex < 0 && !capitalWord.artwork) || keywords.length < 9) {
      if (keywords.length >= 9) keywords = keywords.slice(0, 8);
      keywords.push({ko:scene.landmarkKo, en:scene.landmark, type:'landmark', artwork:true});
    }
    keywords = uniqueWords([capitalWord, ...keywords]);
  } else if (sceneWords[code]) {
    keywords = [...keywords, ...sceneWords[code].map(([ko,en,type])=>({ko,en,type}))];
  }
  if (code === 'ES') {
    facts = [facts[0], {
      ko:'사그라다 파밀리아 안의 기둥은 나무줄기와 가지처럼 갈라져요. 가우디는 자연의 모양을 살피며 건물의 무게를 받치는 구조를 만들었어요.',
      en:'Columns inside the Sagrada Família branch like tree trunks. Gaudí studied natural forms to design structures that support the building’s weight.'
    }, facts[2]];
  }
  const priorReview = drafts.has(code) ? {kind:'new-country-stories', checkedDate:provenance.checkedDate}
    : code==='ES' ? {kind:'stable-architecture-correction', checkedDate:provenance.checkedDate}
    : sceneWords[code] ? {kind:'retained-scene-stories-expanded-words', storyReviewDate:previous.reviewedAt, keywordDate:provenance.checkedDate}
    : {kind:'retained-detailed-stories'};
  const storySources = provenance.countries[code]?.sources || provenance.corrections[code]?.sources || previous.sources || [];
  assert.deepEqual(facts, threeStoryEdition[code].facts, `${code}: preserve the three-story edition`);
  assert.deepEqual(keywords, threeStoryEdition[code].keywords, `${code}: preserve all keyword pairs`);
  facts = [...facts, ...extraStories.get(code)];
  const review = {
    kind:'five-story-expansion',
    preservedStoryNumbers:[1,2,3],
    addedStoryNumbers:[4,5],
    checkedDate:expansion.checkedDate,
    priorReview
  };
  const sources = [...new Set([...(baseline[code].sources || []), ...(previous.sources || []), ...storySources, ...expansion.countries[code].sources])];
  assert.equal(facts.length, 5, `${code}: story count`);
  for (const lang of ['ko','en']) assert.equal(new Set(facts.map(f=>normalize(f[lang]))).size, 5, `${code}/${lang}: repeated story`);
  assert.equal(keywords.length, 10, `${code}: keyword count`);
  assert.equal(uniqueWords(keywords).length, 10, `${code}: duplicate keyword translation`);
  assert.ok(facts.every(f=>f.ko?.length>15 && f.en?.length>15), `${code}: incomplete story`);
  assert.ok(facts.some(f=>f.ko.includes(country.capitalKo)), `${code}: missing capital explanation`);
  assert.ok(sources.length>0 && sources.every(url=>url.startsWith('https://')), `${code}: sources`);
  enriched[code] = {facts, keywords, sources, contentReview:review};
}

const output = {
  edition:expansion.edition,
  storyCountPerCountry:5,
  storyCount:985,
  additionalStoryCount:394,
  preservedStoryCount:591,
  bilingualKeywordCount:1970,
  newCountryStoryCount:274,
  newDetailedCountryCount:137,
  populationSource,
  provenance:'learning-enrichment-sources.json',
  expansionProvenance:'learning-story-expansion-sources.json',
  notice:'learning-content-notice.txt',
  countries:roster.map(country=>({
    ...country,
    coordinates:capitalPoints[country.code].coordinates,
    postcard:{ko:capitalPoints[country.code].landmarkKo, en:capitalPoints[country.code].landmark},
    ...enriched[country.code],
    population2025:populationData[country.code].value
  }))
};
const targets = [
  ['../src/country-learning-enrichment.json', enriched],
  ['../public/data/learning-content.json', output],
  ['../public/data/learning-enrichment-sources.json', provenance],
  ['../public/data/learning-story-expansion-sources.json', expansion]
];
for (const [path, value] of targets) {
  const json = JSON.stringify(value, null, 2)+'\n';
  if (process.argv.includes('--check')) assert.equal(read(path), json, `${path}: regenerate learning data`);
  else writeFileSync(new URL(path, import.meta.url), json);
}
console.log('197 countries: 985 bilingual stories (591 preserved + 394 added), 1,970 unchanged bilingual keyword pairs.');
