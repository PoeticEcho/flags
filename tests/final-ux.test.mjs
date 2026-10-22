import test from 'node:test';
import assert from 'node:assert/strict';
import {countryByCode} from '../src/data.js';
import {launchExplorerSettings} from '../src/explorer-launch.js';
import {openDialogWithReturnFocus} from '../src/dialog-focus.js';
import {mapFailureKind} from '../src/map-failure.js';
import {createQuizSound,quizRewardText} from '../src/quiz-reward.js';
import {nextPaintRegion} from '../src/keyboard-paint.js';

const storage=value=>({getItem:()=>value});
test('fresh launches can start at every destination including both polar places',()=>{
 const codes=[...countryByCode.keys()];
 for(let i=0;i<codes.length;i++)assert.equal(launchExplorerSettings(storage(null),countryByCode,()=> (i+.5)/codes.length).selectedCode,codes[i]);
 assert.equal(codes.length,199);assert.ok(codes.includes('GL')&&codes.includes('AQ'));
});
test('exploration launches avoid the previous destination while keeping the selected language and study set',()=>{
 for(const previous of countryByCode.keys()){
  const saved={selectedCode:previous,language:'en',poolSize:199,difficulty:'word',mode:'explore'};
  for(const random of [()=>0,()=>.5,()=>.999999]){
   const next=launchExplorerSettings(storage(JSON.stringify(saved)),countryByCode,random);
   assert.notEqual(next.selectedCode,previous);assert.equal(next.language,'en');assert.equal(next.poolSize,199);assert.equal(next.difficulty,'word');
  }
 }
});
test('art room launches preserve each draft country and never consume randomness',()=>{
 for(const mode of ['colour','custom'])for(const selectedCode of ['KR','GL','AQ']){
  const saved={language:'ko',selectedCode,mode,poolSize:48,difficulty:'mixed'};
  assert.deepEqual(launchExplorerSettings(storage(JSON.stringify(saved)),countryByCode,()=>{throw Error('Must keep the artwork');}),saved);
 }
});
test('broken storage and a previous quiz still open a valid random exploration',()=>{
 for(const saved of ['{broken','null',JSON.stringify({mode:'quiz',selectedCode:'FR'})]){
  const next=launchExplorerSettings(storage(saved),countryByCode,()=>.6);assert.equal(next.mode,'explore');assert.ok(countryByCode.has(next.selectedCode));
 }
 for(const random of [()=>1,()=>-1,()=>NaN])assert.ok(countryByCode.has(launchExplorerSettings(storage(null),countryByCode,random).selectedCode));
 const only=new Map([['AQ',{}]]);assert.equal(launchExplorerSettings(storage(JSON.stringify({selectedCode:'AQ'})),only,()=>0).selectedCode,'AQ');
});
test('nested dialogs return focus to a connected caller and skip removed triggers',()=>{
 const calls=[],dialog={open:false,showModal(){this.open=true;calls.push('open');},close(){this.open=false;calls.push('close');}},trigger={isConnected:true,focus:opts=>calls.push(opts)};
 const cleanup=openDialogWithReturnFocus(dialog,trigger);assert.equal(dialog.open,true);cleanup();assert.deepEqual(calls,['open','close',{preventScroll:true}]);
 calls.length=0;trigger.isConnected=false;openDialogWithReturnFocus(dialog,trigger)();assert.deepEqual(calls,['open','close']);
});
test('unsupported graphics is distinguished from recoverable data loading errors',()=>{
 assert.equal(mapFailureKind({name:'GPUInitializationError',message:'WebGL2 is required'}),'unsupported');
 assert.equal(mapFailureKind(Error('Failed to initialize WebGL')),'unsupported');
 assert.equal(mapFailureKind(Error('Failed to fetch country data')),'load');assert.equal(mapFailureKind(),'load');
});
test('quiz feedback celebrates retries, real new stamps and every third discovery in both languages',()=>{
 assert.match(quizRewardText({retried:true,count:1,language:'ko'}),/다시 도전/);
 assert.match(quizRewardText({newStamp:true,count:1,language:'ko'}),/새 탐험 도장/);
 assert.match(quizRewardText({count:3,language:'ko'}),/별 세 개/);
 assert.match(quizRewardText({retried:true,count:6,language:'en'}),/trying again! Three explorer stars/);
 assert.doesNotMatch(quizRewardText({count:0,language:'en'}),/Three explorer stars/);
});
test('quiz audio is opt-in, silent on wrong answers, reuses one context and releases it',()=>{
 let created=0,closed=0,disconnected=0;const frequencies=[];
 const context={state:'running',currentTime:1,destination:{},createOscillator(){const frequency={};frequencies.push(frequency);return {frequency,connect(){},disconnect(){disconnected++;},start(){},stop(){this.onended();}};},createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){disconnected++;}};},close(){closed++;}};
 const sound=createQuizSound(()=>{created++;return context;});sound.play(false,true);sound.play(true,false);assert.equal(created,0);
 sound.play(true,true);sound.play(true,true);assert.equal(created,1);assert.equal(frequencies.length,6);assert.equal(disconnected,12);assert.deepEqual(frequencies.slice(0,3).map(f=>f.value),[523.25,659.25,783.99]);sound.dispose();assert.equal(closed,1);
 assert.doesNotThrow(()=>createQuizSound(()=>{throw Error('Audio unavailable');}).play(true,true));
});
test('keyboard region navigation wraps through paintable parts and skips protected details',()=>{
 const model={regions:[{id:0,locked:true},{id:1},{id:2,locked:true},{id:3}]};
 assert.equal(nextPaintRegion(model,null),1);assert.equal(nextPaintRegion(model,1,1),3);assert.equal(nextPaintRegion(model,3,1),1);assert.equal(nextPaintRegion(model,1,-1),3);assert.equal(nextPaintRegion({regions:[{id:0,locked:true}]},0),null);
});
