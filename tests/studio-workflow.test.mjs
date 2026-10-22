import test from 'node:test';
import assert from 'node:assert/strict';
import {completedCountry,completedFlag,saveArtGallery,readArtGallery,artworkDraft,undoNamedArtwork} from '../src/art-gallery.js';
import {blankArtwork,createStudioDraftStore} from '../src/studio-drafts.js';
import {pixelColour} from '../src/colour-picker.js';
const disk=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};};
const saved={id:'country',custom:true,code:'KR',countryName:'별빛나라',englishName:'Star Land',...blankArtwork(),colors:{0:'#002395'},svg:'<svg/>'};

test('completion actions use saved artwork, close after edits, and reopen after undo or reload',()=>{
 const storage=disk();saveArtGallery(storage,saved);
 const gallery=readArtGallery(storage),art=artworkDraft(gallery[0]).art;
 assert.equal(completedCountry(art,gallery)?.id,'country');
 for(const change of [{countryName:'달나라'},{englishName:'Moon Land'},{colors:{0:'#ffff00'}},{shapes:[{type:'circle',cx:200,cy:200,r:30}]},{strokes:[{region:0,tool:'eraser',size:12,points:[[100,100]]}]},{actions:[{kind:'fill',region:0,color:'#fff'}]}])assert.equal(completedCountry({...art,...change},gallery),null);
 const changed={...art,colors:{0:'#ffff00'}};
 assert.equal(completedCountry(undoNamedArtwork(art,changed),gallery)?.id,'country');
 assert.equal(completedCountry({...blankArtwork(),newCountry:true},gallery),null);
 createStudioDraftStore().saveStudioDraft(storage,'KR',true,{art,ink:'#002395',tool:'eyedropper',size:24,extra:[]});
 const restored=createStudioDraftStore().readStudioDraft(storage,'FR',true);
 assert.equal(restored.tool,'eyedropper');assert.equal(completedCountry(restored.art,gallery)?.id,'country');
});

test('a failed save cannot enable completion options for modified artwork',()=>{
 const storage=disk();saveArtGallery(storage,saved);const gallery=readArtGallery(storage);
 const changed={...artworkDraft(saved).art,colors:{0:'#ffffff'}};
 assert.throws(()=>saveArtGallery({...storage,setItem(){throw Error('full');}},{...saved,...changed}),/full/);
 assert.equal(completedCountry(changed,readArtGallery(storage)),null);
 assert.equal(readArtGallery(storage)[0].svg,gallery[0].svg);
});

test('eyedropper reads visible RGB and transparent white paper without altering artwork',()=>{
 const pixels=new Uint8ClampedArray([255,0,0,255,0,0,255,255,0,0,0,0,0,0,0,128]);
 assert.equal(pixelColour(pixels,2,2,0.5,0.5),'#ff0000');
 assert.equal(pixelColour(pixels,2,2,1.4,0.5),'#0000ff');
 assert.equal(pixelColour(pixels,2,2,0,1),'#ffffff');
 assert.equal(pixelColour(pixels,2,2,1,1),'#7f7f7f');
 for(const [x,y] of [[-1,0],[2,0],[0,2],[NaN,0]])assert.equal(pixelColour(pixels,2,2,x,y),null);
 assert.deepEqual(Array.from(pixels),[255,0,0,255,0,0,255,255,0,0,0,0,0,0,0,128]);
});

test('country colouring completion is bound to the saved flag, survives reload and undo, and rejects edits or failed saves',()=>{
 const storage=disk(),item={id:'kr-flag',custom:false,code:'KR',...blankArtwork(),actions:[{kind:'fill',region:0,color:'#ff0000'}],svg:'<svg/>'};
 saveArtGallery(storage,item);const gallery=readArtGallery(storage),art=artworkDraft(gallery[0]).art;
 assert.equal(completedFlag(art,gallery,'KR')?.id,item.id);
 assert.equal(completedFlag(art,gallery,'FR'),null);assert.equal(completedFlag(blankArtwork(),gallery,'KR'),null);
 const edited={...art,actions:[...art.actions,{kind:'fill',region:1,color:'#0000ff'}]};
 assert.equal(completedFlag(edited,gallery,'KR'),null);
 assert.throws(()=>saveArtGallery({...storage,setItem(){throw Error('full');}},{...item,...edited}),/full/);
 assert.equal(completedFlag(edited,readArtGallery(storage),'KR'),null);
 assert.equal(completedFlag(undoNamedArtwork(art,edited),gallery,'KR')?.id,item.id);
 assert.equal(completedFlag(undoNamedArtwork(art,blankArtwork()),gallery,'KR')?.id,item.id);
 const drafts=createStudioDraftStore();drafts.saveStudioDraft(storage,'KR',false,{art,tool:'paint',ink:'#ff0000',size:24,extra:[]});
 assert.equal(completedFlag(createStudioDraftStore().readStudioDraft(storage,'KR',false).art,gallery,'KR')?.id,item.id);
 const update={...item,...edited,id:item.id};saveArtGallery(storage,update);
 assert.equal(readArtGallery(storage).length,1);assert.equal(completedFlag(edited,readArtGallery(storage),'KR')?.id,item.id);
});
