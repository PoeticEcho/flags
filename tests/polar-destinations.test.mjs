import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {roster,explorationRoster,capitalQuizRoster,countryByCode,capitalPoints,explorationPoints,createCountryGeoJson} from '../src/data.js';
import {pointInGeometry,focusMapCountry} from '../src/map-geometry.js';
import {searchCountries} from '../src/country-search.js';
import {quizPool} from '../src/progress.js';
import {readExplorerSettings} from '../src/explorer-settings.js';
import {readArtGallery,saveArtGallery} from '../src/art-gallery.js';
import {blankArtwork} from '../src/studio-drafts.js';
import {priorityCountryCodes} from '../src/priority-countries.js';
import {learningData} from '../src/learning-data.js';
import {capitalQuizOptions,createQuizQuestion,quizQuestionText,quizMapFrame,wrongCapitalHint,quizContinent,capitalName} from '../src/quiz-data.js';
import {antarcticQuestions} from '../src/polar-data.js';
import oldPack from '../public/data/learning-content.json' with {type:'json'};
import finalPack from '../public/data/learning-content-polar-edition.json' with {type:'json'};
import media from '../artwork/polar-postcards.json' with {type:'json'};

test('199 selectable destinations preserve the exact original 197-country education set',()=>{
 assert.equal(roster.length,197);assert.equal(explorationRoster.length,199);assert.equal(countryByCode.size,199);
 assert.equal(capitalQuizRoster.length,198);
 assert.deepEqual(finalPack.countries,oldPack.countries);
 assert.deepEqual(finalPack.additionalDestinations.map(p=>p.code),['GL','AQ']);
 for(const p of oldPack.countries){assert.deepEqual(learningData[p.code].facts,p.facts,p.code);assert.deepEqual(learningData[p.code].keywords,p.keywords,p.code);}
 const places=[...finalPack.countries,...finalPack.additionalDestinations];
 assert.equal(places.reduce((n,p)=>n+p.facts.length,0),995);
 assert.equal(places.reduce((n,p)=>n+p.keywords.length,0),1990);
 for(const code of ['GL','AQ'])for(const lang of ['ko','en']){
  const learning=learningData[code];assert.equal(learning.facts.length,5);assert.equal(learning.keywords.length,10);
  assert.ok(learning.facts.every(f=>f[lang].length>15));assert.equal(new Set(learning.keywords.map(w=>w[lang])).size,10);
 }
});
test('both polar areas are searchable and the preserved study sets can expand to 199',()=>{
 for(const [name,code] of [['그린란드','GL'],['Greenland','GL'],['누크','GL'],['Nuuk','GL'],['Kalaallit Nunaat','GL'],['남극','AQ'],['남극대륙','AQ'],['Antarctica','AQ']])assert.equal(searchCountries(explorationRoster,name)[0].code,code);
 assert.deepEqual(quizPool(explorationRoster,priorityCountryCodes,197).map(p=>p.code),quizPool(roster,priorityCountryCodes,197).map(p=>p.code));
 const pool=quizPool(explorationRoster,priorityCountryCodes,199);assert.equal(pool.length,199);assert.ok(pool.some(p=>p.code==='AQ'));
 for(const code of ['GL','AQ'])assert.equal(readExplorerSettings({getItem:()=>JSON.stringify({selectedCode:code,poolSize:199})},countryByCode).selectedCode,code);
});
test('real map geometry enables Greenland and Antarctica without filling the rest of the world',()=>{
 const atlas=JSON.parse(readFileSync(new URL('../public/data/countries-10m.json',import.meta.url)));
 const geo=createCountryGeoJson(atlas);
 for(const code of ['GL','AQ']){const f=geo.features.find(f=>f.properties.cca2===code);assert.equal(f.properties.eligible,true);assert.equal(f.properties.labelKo,countryByCode.get(code).nameKo);assert.equal(pointInGeometry([0,0],f.geometry),false);}
 const aq=geo.features.find(f=>f.properties.cca2==='AQ');assert.equal(aq.properties.region,'Antarctica');assert.equal(pointInGeometry([100,-80],aq.geometry),true);
 const calls=[];const map={stop(){},setRenderWorldCopies(){},fitBounds(bounds){calls.push(bounds);}};
 assert.equal(focusMapCountry(map,geo,'AQ',countryByCode.get('AQ'),0),true);
 assert.deepEqual(calls[0],[[-180,-84.5],[180,-60]]);
 // The simplified coast may exclude the exact GeoNames waterfront city point;
 // preserve that sourced capital instead of moving it to a country centroid.
 const gl=geo.features.find(f=>f.properties.cca2==='GL');assert.equal(pointInGeometry([-40,72],gl.geometry),true);
});
test('Nuuk is the Greenland capital; the Antarctic pin is a research station, with no invented population',()=>{
 const gl=countryByCode.get('GL'),aq=countryByCode.get('AQ');
 assert.equal(gl.capital,'Nuuk');assert.equal(gl.capitalKo,'누크');assert.deepEqual(capitalPoints.GL.coordinates,[-51.7215728759766,64.1834737080207]);
 assert.equal(gl.populationInfo.value,56831);assert.match(gl.populationInfo.source,/Statistics Greenland/);
 assert.equal(aq.capital,null);assert.equal(aq.capitalKo,null);assert.equal(capitalPoints.AQ,undefined);assert.equal(learningData.AQ.population2025,undefined);
 assert.equal(capitalName(aq,'ko'),'없음');assert.equal(explorationPoints.AQ.name.en,'King Sejong Station');
 assert.deepEqual(explorationPoints.AQ.coordinates,[-58.78333333333333,-62.21666666666667]);
});
test('Greenland capital distractors stay geographic; five Antarctic quizzes never create city pins',()=>{
 for(let i=0;i<12;i++){
  const options=capitalQuizOptions('GL');assert.equal(options.length,3);assert.equal(options.filter(o=>o.correct).length,1);assert.equal(options.find(o=>o.correct).name,'Nuuk');
  for(const option of options)assert.equal(quizContinent(countryByCode.get(option.code)),'NorthAmerica');
 }
 assert.equal(antarcticQuestions.length,5);
 const visited=new Set();
 for(let i=0;i<5;i++){
  const q=createQuizQuestion('AQ','mixed',()=> (i+.1)/5);visited.add(q.id);assert.equal(q.type,'knowledge');assert.equal(q.options.length,3);assert.equal(q.options.filter(o=>o.correct).length,1);assert.equal(quizMapFrame(q.options),null);
  for(const lang of ['ko','en']){assert.equal(quizQuestionText(q,countryByCode.get('AQ'),lang),q.prompt[lang]);assert.ok(wrongCapitalHint(q.options.find(o=>!o.correct),lang));}
  assert.ok(q.options.every(o=>o.coordinates===undefined&&o.code===undefined));
 }
 assert.equal(visited.size,5);
});
test('supplied flag bytes and separate original-size postcard media retain their recorded hashes',()=>{
 for(const row of media.flags){const bytes=readFileSync(new URL('../public'+row.file,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);}
 assert.equal(media.postcards.length,2);
 for(const row of media.postcards){assert.equal(row.width*2,row.height*3);assert.ok(row.previewWidth<=640&&row.previewBytes<row.fullBytes);for(const size of ['full','preview']){const bytes=readFileSync(new URL('../public'+row[size+'Image'],import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),row[size+'Sha256']);}assert.equal(explorationPoints[row.code].fullImage,row.fullImage);}
});
test('new polar colouring saves remain available after a gallery reload alongside existing drawings',()=>{
 let value='[]';const storage={getItem:()=>value,setItem:(key,v)=>{value=v;}};
 for(const code of ['FR','GL','AQ'])saveArtGallery(storage,{...blankArtwork(),id:code,code,custom:false,countryName:code,englishName:code,svg:'<svg xmlns="http://www.w3.org/2000/svg"/>',actions:[]});
 assert.deepEqual(readArtGallery(storage).map(item=>item.code),['AQ','GL','FR']);
});
test('bilingual polar cards and science answer feedback render without false capital or UN labels',async()=>{
 const {fileURLToPath}=await import('node:url');
 const temp=new URL(`.polar-render-${process.pid}.mjs`,import.meta.url);
 const built=await build({stdin:{contents:"export {default as Face} from './src/CountryCardFace.jsx'; export {default as Answers} from './src/CapitalQuizAnswers.jsx'; export {default as Preview,PostcardViewer} from './src/PostcardPreview.jsx';",resolveDir:fileURLToPath(new URL('../',import.meta.url))},bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',write:false});
 writeFileSync(temp,built.outputFiles[0].text);
 try{const {Face,Answers,Preview,PostcardViewer}=await import(temp.href);
  for(const language of ['ko','en'])for(const code of ['GL','AQ']){
   const country=countryByCode.get(code),place=explorationPoints[code];
   const html=renderToStaticMarkup(createElement(Face,{country,language}));
   assert.ok(html.includes(language==='ko'?country.nameKo:country.name));assert.ok(!html.includes('UN 2025')&&!html.includes('(UN)'));
   if(code==='AQ'){assert.ok(html.includes(language==='ko'?'없음':'None'));assert.ok(!html.includes('Nuuk'));}
   else assert.ok(html.includes(language==='ko'?'누크':'Nuuk'));
   const small=renderToStaticMarkup(createElement(Preview,{place,language,compact:true}));assert.ok(small.includes(place.previewImage));assert.ok(!small.includes(place.fullImage));
   const viewer=renderToStaticMarkup(createElement(PostcardViewer,{item:{country,place},language}));assert.ok(viewer.includes(place.fullImage));assert.match(viewer,/postcard-dismiss-image/);
   if(code==='AQ'){const q=createQuizQuestion('AQ');const wrong=q.options.find(o=>!o.correct);const answers=renderToStaticMarkup(createElement(Answers,{options:q.options,status:'wrong',selectedId:wrong.id,language}));assert.ok(answers.includes(wrong.hint[language]));assert.ok(!answers.includes('/flags/undefined'));}
  }
 }finally{unlinkSync(temp);}
});
