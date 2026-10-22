import test from 'node:test';
import assert from 'node:assert/strict';
import {nameColours,nameAnimals,resolveCountryName} from '../src/country-names.js';
import {createShape,moveShape,resizeShape} from '../src/custom-shapes.js';
import {blankArtwork,createStudioDraftStore} from '../src/studio-drafts.js';
import {saveArtGallery,readArtGallery,artworkDraft,completedCountry} from '../src/art-gallery.js';

test('line endpoints reach all paper edges, including reversed and full-width lines',()=>{
 for(const line of [createShape('line'),{type:'line',x1:440,y1:260,x2:160,y2:140},{type:'line',x1:300,y1:100,x2:300,y2:300}]){
  const left=moveShape(line,-1000,0),right=moveShape(line,1000,0),top=moveShape(line,0,-1000),bottom=moveShape(line,0,1000);
  assert.equal(Math.min(left.x1,left.x2),0);assert.equal(Math.max(right.x1,right.x2),600);
  assert.equal(Math.min(top.y1,top.y2),0);assert.equal(Math.max(bottom.y1,bottom.y2),400);
  assert.equal(left.x2-left.x1,line.x2-line.x1);assert.equal(top.y2-top.y1,line.y2-line.y1);
 }
 const full=resizeShape(moveShape(createShape('line'),-1000,0),[600,200]);
 assert.deepEqual([full.x1,full.x2],[0,600]);assert.deepEqual(moveShape(full,30,0),full);
});

test('all 400 colour-animal names are unique and allocation skips saved names before numbering',()=>{
 assert.equal(nameColours.length,20);assert.equal(nameAnimals.length,20);
 const all=nameColours.flatMap(colour=>nameAnimals.map(animal=>colour+animal));
 assert.equal(new Set(all).size,400);
 const gallery=[];
 for(let i=0;i<400;i++){
  const name=resolveCountryName({countryName:'  '},gallery,()=>0);
  assert.equal(name,all[i]);gallery.push({id:String(i),custom:true,countryName:name});
 }
 gallery.push({id:'numbered',custom:true,countryName:all[0]+'2'});
 assert.equal(resolveCountryName({},gallery,()=>0),all[0]+'3');
 assert.equal(resolveCountryName({countryName:'  내가 지은 이름  '},gallery),'내가 지은 이름');
 assert.equal(resolveCountryName({savedCountryId:'0'},gallery,()=>0),all[0]);
 assert.equal(resolveCountryName({},[],()=>0.999999),all.at(-1));
});

test('generated names keep card identity through save, reopen, draft reload and update',()=>{
 const data=new Map(),disk={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};
 const art={...blankArtwork(),shapes:[createShape('line')]},countryName=resolveCountryName(art,[],()=>0);
 const item={...art,id:'auto',custom:true,code:'KR',countryName,svg:`<svg><title>${countryName}</title></svg>`};
 saveArtGallery(disk,item);
 const draft=artworkDraft(readArtGallery(disk)[0]);
 createStudioDraftStore().saveStudioDraft(disk,'KR',true,draft);
 const restored=createStudioDraftStore().readStudioDraft(disk,'FR',true).art;
 assert.equal(restored.countryName,'파란코뿔소');assert.equal(completedCountry(restored,readArtGallery(disk))?.id,'auto');
 assert.equal(resolveCountryName(restored,readArtGallery(disk),()=>0.9),'파란코뿔소');
 saveArtGallery(disk,{...item,...restored,countryName:'내 이름'});
 assert.equal(readArtGallery(disk).length,1);assert.equal(readArtGallery(disk)[0].countryName,'내 이름');
 assert.notEqual(resolveCountryName({},[{...item,countryName:'파란코뿔소'}],()=>0),'파란코뿔소');
});
