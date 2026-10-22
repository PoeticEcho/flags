import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {polarDestinations,polarLearningData,polarPostcards,antarcticQuestions,antarcticSymbols} from '../src/polar-data.js';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const original=JSON.parse(read('../public/data/learning-content.json'));
assert.equal(original.countries.length,197);
const additionalDestinations=polarDestinations.map(place=>({...place,...polarLearningData[place.code],postcard:{ko:polarPostcards[place.code].landmarkKo,en:polarPostcards[place.code].landmark},media:polarPostcards[place.code]}));
const destinations=[...original.countries,...additionalDestinations];
assert.equal(new Set(destinations.map(place=>place.code)).size,199);
assert.ok(destinations.every(place=>place.facts.length===5&&place.keywords.length===10));
const pack={...original,edition:'2026-10-02-five-stories-polar-final',countryCount:197,additionalDestinationCount:2,additionalDestinationStoryCount:10,explorationPlaceCount:199,storyCount:995,bilingualKeywordCount:1990,additionalDestinations,polarProvenance:'polar-destinations.json',polarNotice:'polar-learning-notice.txt'};
const source={checkedDate:'2026-10-02',scope:'Two additional learning destinations; original 197-country text and image bytes preserved.',destinations:additionalDestinations,antarcticSymbols,quizzes:{GL:'Capital quiz for Nuuk with real North American capital distractors; built by src/quiz-data.js.',AQ:antarcticQuestions},coordinateNotes:{GL:'GeoNames populated-place point for Nuuk, CC BY 4.0; not Greenland’s centroid.',AQ:'KOPRI King Sejong Station location 62°13′S, 58°47′W, represented at source minute precision. It is not a capital.'},flagNotes:'The Greenland flag is a territory flag. Antarctica has no official national flag; its white silhouette design is an unofficial symbol. The supplied polar-grid design represents the Antarctic Treaty emblem, not a nation or an app endorsement.'};
for(const [path,value] of [['../public/data/learning-content-polar-edition.json',pack],['../public/data/polar-destinations.json',source],['../public/data/antarctica-quiz.json',antarcticQuestions]]){
 const json=JSON.stringify(value,null,2)+'\n';
 if(process.argv.includes('--check'))assert.equal(read(path),json,`${path}: regenerate polar content`);
 else writeFileSync(new URL(path,import.meta.url),json);
}
console.log('197 countries + Greenland + Antarctica: 199 places, 995 bilingual story pairs, 1,990 keyword pairs; five Antarctic knowledge questions.');
