import test from 'node:test';
import assert from 'node:assert/strict';
import {countryHighlightLayers,updateCountryHighlight} from '../src/map-highlight.js';
import {createQuizAdvance} from '../src/quiz-advance.js';

test('neither geographic answer layer is visible when a map first loads in quiz mode',()=>{
 for(const code of ['AE','RU','KR','VA']){
  const layers=countryHighlightLayers(code,true);assert.equal(layers.length,2);
  assert.deepEqual(new Set(layers.map(l=>l.type)),new Set(['fill','line']));
  assert.ok(layers.every(l=>l.layout.visibility==='none'));
  assert.ok(countryHighlightLayers(code,false).every(l=>l.layout.visibility==='visible'));
 }
});
test('switching between exploration and successive questions hides both layers and restores the actual selected territory on exit',()=>{
 const state=new Map(countryHighlightLayers('AE',false).map(l=>[l.id,structuredClone(l)]));
 const map={getLayer:id=>state.get(id),setLayoutProperty(id,key,value){state.get(id).layout[key]=value;},setFilter(id,filter){state.get(id).filter=filter;}};
 for(const [code,quiz] of [['AE',true],['KR',true],['RU',true],['RU',false],['AE',false],['AE',true]]){
  updateCountryHighlight(map,code,quiz);
  for(const layer of state.values()){assert.equal(layer.layout.visibility,quiz?'none':'visible');assert.equal(layer.filter.at(-1),code);}
 }
 assert.doesNotThrow(()=>updateCountryHighlight({getLayer:()=>null},'AE',true));
});
function fixture(){let time=0,id=0;const jobs=new Map(),fired=[];
 const queue=createQuizAdvance({onAdvance:q=>fired.push(q),schedule:(fn,delay)=>{const key=++id;jobs.set(key,{fn,at:time+delay});return key;},unschedule:key=>jobs.delete(key)});
 return {queue,fired,jobs,tick(ms){time+=ms;for(const [key,job] of [...jobs])if(job.at<=time){jobs.delete(key);job.fn();}}};
}
test('a correct answer advances once after its brief success response, while wrong and idle answers stay put',()=>{
 const f=fixture(),question={code:'AE'};
 for(const status of ['idle','wrong']){assert.equal(f.queue.queue({mode:'quiz',status,question}),false);f.tick(1000);assert.equal(f.fired.length,0);}
 assert.equal(f.queue.queue({mode:'quiz',status:'correct',question}),true);f.tick(899);assert.equal(f.fired.length,0);f.tick(1);assert.deepEqual(f.fired,[question]);f.tick(2000);assert.equal(f.fired.length,1);
});
test('mode changes, blocked overlays, cancellation and manual next cannot advance a stale question',()=>{
 const f=fixture(),question={code:'AE'},next={code:'KR'};
 f.queue.queue({mode:'quiz',status:'correct',question});const stale=[...f.jobs.values()][0].fn;
 f.queue.cancel();stale();f.tick(1000);assert.equal(f.fired.length,0);
 for(const args of [{mode:'explore',status:'correct',question},{mode:'quiz',status:'correct',question,blocked:true},{mode:'quiz',status:'correct',question:null}])assert.equal(f.queue.queue(args),false);
 f.queue.queue({mode:'quiz',status:'correct',question});f.tick(300);f.queue.queue({mode:'quiz',status:'correct',question:next});f.tick(250);assert.equal(f.fired.length,0);f.tick(650);assert.deepEqual(f.fired,[next]);
});
