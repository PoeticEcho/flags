import test from 'node:test';
import assert from 'node:assert/strict';
import {blankArtwork,createStudioDraftStore} from '../src/studio-drafts.js';
const storage=()=>{const items=new Map();return {getItem:k=>items.get(k)||null,setItem:(k,v)=>items.set(k,v)};};
const painting=()=>({art:{...blankArtwork(),actions:[{kind:'fill',region:0,color:'#ff0000'},{kind:'erase',region:0,tool:'eraser',size:18,points:[[10,20],[30,40]]}]},history:[blankArtwork()],ink:'#ff0000',tool:'eraser',size:18,extra:['#123456']});

test('changing countries and switching custom mode preserve separate paintings and undo history',()=>{
 const store=createStudioDraftStore(),disk=storage(),fr=painting();
 assert.equal(store.saveStudioDraft(disk,'FR',false,fr),true);
 assert.equal(store.readStudioDraft(disk,'FR').history.length,1);
 assert.deepEqual(store.readStudioDraft(disk,'DE').art,blankArtwork());
 store.saveStudioDraft(disk,'FR',true,{...painting(),ink:'#abcdef'});
 assert.equal(store.readStudioDraft(disk,'FR').ink,'#ff0000');
 assert.equal(store.readStudioDraft(disk,'DE',true).ink,'#abcdef');
});

test('reloading restores fills, eraser strokes, tool, width and palette without duplicating undo snapshots',()=>{
 const disk=storage(),first=createStudioDraftStore();first.saveStudioDraft(disk,'KR',false,painting());
 const restored=createStudioDraftStore().readStudioDraft(disk,'KR');
 assert.deepEqual(restored.art,painting().art);
 assert.equal(restored.tool,'eraser');assert.equal(restored.size,18);
 assert.deepEqual(restored.extra,['#123456']);assert.deepEqual(restored.history,[]);
});

test('full or unavailable storage keeps the current visit drawing and reports the save failure',()=>{
 const disk={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}},store=createStudioDraftStore(),draft=painting();
 assert.deepEqual(store.readStudioDraft(disk,'FR').art,blankArtwork());
 assert.equal(store.saveStudioDraft(disk,'FR',false,draft),false);
 assert.deepEqual(store.readStudioDraft(disk,'FR').art,draft.art);
});

test('damaged draft entries cannot crash the painting editor',()=>{
 const store=createStudioDraftStore();
 for(const value of ['{broken',JSON.stringify({version:1,art:{...blankArtwork(),shapes:[null]}}),JSON.stringify({version:1,art:{...blankArtwork(),actions:[{kind:'erase',region:0,points:[null]}]}})]){
  assert.deepEqual(store.readStudioDraft({getItem:()=>value},'FR').art,blankArtwork());
 }
 const saved={version:1,...painting(),ink:'bad',tool:'unknown',size:1000,extra:['bad']};
 const draft=store.readStudioDraft({getItem:()=>JSON.stringify(saved)},'FR');
 assert.equal(draft.ink,'#002395');assert.equal(draft.tool,'paint');assert.equal(draft.size,60);assert.deepEqual(draft.extra,[]);
});
