import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,unlinkSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {explorationRoster,explorationPoints} from '../src/data.js';
import {createQuizQuestion} from '../src/quiz-data.js';
import {canAnswerQuiz,quizOptionResult} from '../src/quiz-answer-state.js';

const temp=new URL(`.mobile-render-${process.pid}.mjs`,import.meta.url);
const result=await build({stdin:{contents:"export {App} from './src/App.jsx'; export {default as Answers} from './src/CapitalQuizAnswers.jsx'; export {default as Wave,FlagWaveStage as Stage} from './src/FlagWavePreview.jsx';",resolveDir:fileURLToPath(new URL('..',import.meta.url))},bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',write:false,loader:{'.css':'empty'},define:{'import.meta.env.BASE_URL':'"/"'},plugins:[{name:'ssr-map-boundary',setup(b){
 b.onResolve({filter:/^maplibre-gl$/},()=>({path:'map',namespace:'ssr-map'}));
 b.onResolve({filter:/\.css$/},()=>({path:'style',namespace:'ssr-map'}));
 b.onResolve({filter:/maplibre-gl-worker\.mjs\?worker&url$/},()=>({path:'worker',namespace:'ssr-map'}));
 b.onLoad({filter:/.*/,namespace:'ssr-map'},({path})=>({contents:path==='map'?'export class Map{}; export class Marker{}; export const setWorkerUrl=()=>{};':path==='style'?'':'export default "/map-worker.js";'}));
}}]});
writeFileSync(temp,result.outputFiles[0].text);
after(()=>{unlinkSync(temp);});
const {App,Answers,Wave,Stage}=await import(temp.href);

test('wrong word, map and science choices stay open without colouring the correct option',()=>{
 assert.equal(canAnswerQuiz('idle'),true);assert.equal(canAnswerQuiz('wrong'),true);assert.equal(canAnswerQuiz('correct'),false);
 for(const language of ['ko','en'])for(const [code,type] of [['FR','word'],['GL','map'],['AQ','word']]){
  const question=createQuizQuestion(code,type),wrong=question.options.find(o=>!o.correct),correct=question.options.find(o=>o.correct);
  const initial=renderToStaticMarkup(createElement(Answers,{options:question.options,language}));
  const retry=renderToStaticMarkup(createElement(Answers,{options:question.options,language,status:'wrong',selectedId:wrong.id,wrongText:'Try again'}));
  assert.equal((retry.match(/class="capital-option /g)||[]).length,3);assert.doesNotMatch(retry,/<button[^>]*disabled/);
  assert.doesNotMatch(retry,/class="capital-option correct"/);assert.match(retry,/class="capital-option wrong"/);
  assert.equal(quizOptionResult('wrong',wrong.id,correct),'');assert.equal(quizOptionResult('wrong',wrong.id,wrong),'wrong');
  assert.doesNotMatch(initial,/<button[^>]*disabled/);
  const solved=renderToStaticMarkup(createElement(Answers,{options:question.options,language,status:'correct',selectedId:correct.id}));
  assert.equal((solved.match(/disabled=""/g)||[]).length,3);assert.equal((solved.match(/class="capital-option correct"/g)||[]).length,1);
 }
});

test('all 199 bilingual exploration screens put the whole flag card and quiz action in one stack',()=>{
 const previous=globalThis.window,previousRandom=Math.random;
 try{
  for(const language of ['ko','en'])for(const country of explorationRoster){
   globalThis.window={matchMedia:()=>({matches:true}),localStorage:{getItem:key=>key==='world-explorer-settings-v1'?JSON.stringify({language,mode:'explore'}):null}};
   Math.random=()=> (explorationRoster.indexOf(country)+.5)/explorationRoster.length;
   const html=renderToStaticMarkup(createElement(App));
   const stack=html.match(/class="country-detail-stack">([\s\S]*?)<section class="story-reader"/);
   assert.ok(stack,`${country.code} ${language}`);assert.match(stack[1],/country-card-face/);assert.match(stack[1],/class="primary-action"/);
   assert.ok(stack[1].indexOf('flag-card-names')<stack[1].indexOf('primary-action'));
   if(country.code!=='AQ')assert.ok(stack[1].indexOf('flag-card-population')<stack[1].indexOf('primary-action'));
   assert.match(html,/>1\/5<\/span>/);assert.match(html,/class="postcard-launcher"/);
  }
 }finally{Math.random=previousRandom;if(previous===undefined)delete globalThis.window;else globalThis.window=previous;}
});

test('waving previews start with sky and offer the associated postcard for every real or personal flag',()=>{
 for(const language of ['ko','en'])for(const country of explorationRoster){
  const postcard=explorationPoints[country.code];assert.ok(postcard.fullImage);assert.ok(existsSync(new URL(`../public${postcard.fullImage}`,import.meta.url)));
  const item={id:`test-${country.code}`,code:country.code,custom:country.code==='GL',countryName:'My flag',svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"/>'};
  const html=renderToStaticMarkup(createElement(Wave,{item,language}));
  assert.match(html,/role="group" aria-label="(?:국기 배경|Flag background)"/);
  assert.match(html,/<button type="button" aria-pressed="true"[^>]*>/);assert.match(html,/<button type="button" aria-pressed="false"[^>]*>/);
  assert.ok(!html.includes(postcard.fullImage),country.code);assert.match(html,/flag-sky\.webp/);
 }
});

test('requested postcard backgrounds retain the canvas and loading/error states keep a sky fallback',()=>{
 const item={code:'AQ',svg:'<svg viewBox="0 0 600 400"/>'},postcard=explorationPoints.AQ;
 for(const language of ['ko','en'])for(const backgroundStatus of ['loading','ready','error'])for(const status of ['ready','fallback']){
  const html=renderToStaticMarkup(createElement(Stage,{item,postcard,name:'Antarctica',language,status,background:'postcard',backgroundStatus}));
  assert.ok(html.includes(postcard.fullImage));assert.match(html,/<canvas /);assert.match(html,/flag-sky\.webp/);
  assert.match(html,backgroundStatus==='ready'?/class="wave-scene-image "/:/class="wave-scene-image wave-hidden"/);
  if(status==='fallback')assert.match(html,/class="flat-wave-flag"/);
 }
});
