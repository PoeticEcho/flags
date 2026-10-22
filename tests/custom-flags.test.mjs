import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createShape,validShape,moveShape,resizeShape,shapeBounds,removeShape,localSymbolPoint,flagSymbols,regionColour,regionKey,paintRegion} from '../src/custom-shapes.js';
import {getRegions,hitRegion,inside} from '../src/flag-art.js';
import {blankArtwork,createStudioDraftStore} from '../src/studio-drafts.js';
import {readArtGallery,saveArtGallery,artworkDraft,artworkName,galleryKey,undoNamedArtwork} from '../src/art-gallery.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
const item=(id='one')=>({id,code:'KR',custom:true,countryName:'별빛나라',englishName:'Starlight Land',...blankArtwork(),shapes:[createShape('symbol','taegeuk'),createShape('symbol','star')],colors:{2:'#ffaa00'},svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><title>별빛나라</title></svg>',tool:'pencil'});

test('motifs use existing official flag geometry and round-trip as valid editor shapes',()=>{
 assert.equal(flagSymbols.length+3,20);
 for(const symbol of flagSymbols){assert.equal(validShape(createShape('symbol',symbol.id)),true);if(symbol.sourceFlag)assert.ok(readFileSync(new URL(`../public/flags/${symbol.sourceFlag.toLowerCase()}.svg`,import.meta.url),'utf8').startsWith('<svg'));assert.ok(symbol.parts.every(p=>p.d.length>10));assert.ok(symbol.parts.every(p=>!Object.hasOwn(p,'fill')));assert.equal(regionColour(blankArtwork(),1),'#ffffff');}
 const vn=readFileSync(new URL('../public/flags/vn.svg',import.meta.url),'utf8');assert.ok(vn.includes(flagSymbols.find(s=>s.id==='star').parts[0].d));
 assert.equal(validShape({...createShape('symbol','star'),symbol:'unknown'}),false);
 assert.equal(validShape({...createShape('rect'),width:NaN}),false);
});
test('cloud, heart, multiply and divide stay neutral, paintable and editable through save and reload',()=>{
 const disk=storage();let art={...blankArtwork(),shapes:['cloud','heart','multiply','divide'].map(id=>createShape('symbol',id))};
 for(let i=0;i<art.shapes.length;i++){assert.equal(regionColour(art,i+1),'#ffffff');art=paintRegion(art,i+1,undefined,['#ff0000','#00ff00','#0000ff','#ffff00'][i]);}
 art.shapes=art.shapes.map(shape=>resizeShape(moveShape(shape,30,40),[450,350]));
 saveArtGallery(disk,{...item('four-new'),...art});const reopened=artworkDraft(readArtGallery(disk)[0]);
 const drafts=createStudioDraftStore();drafts.saveStudioDraft(disk,'KR',true,reopened);
 const restored=createStudioDraftStore().readStudioDraft(disk,'FR',true).art;
 assert.deepEqual(restored.shapes,art.shapes);assert.deepEqual(restored.colors,art.colors);
 const removed=removeShape(restored,1);assert.deepEqual(removed.shapes.map(s=>s.symbol),['cloud','multiply','divide']);assert.equal(regionColour(removed,2),'#0000ff');
});

test('Taegeuk upper and lower regions are independently hit, filled and erased after rotation',()=>{
 const shape=createShape('symbol','taegeuk'),regions=getRegions('KR',true,[shape]);
 assert.equal(regions.length,3);assert.equal(regions[hitRegion([300,150],regions)].part,0);assert.equal(regions[hitRegion([300,250],regions)].part,1);assert.equal(hitRegion([225,125],regions),0);
 let art={...blankArtwork(),shapes:[shape]};art=paintRegion(art,1,0,'#e00000');art=paintRegion(art,1,1,'#0000e0');
 assert.equal(regionColour(art,1,0),'#e00000');assert.equal(regionColour(art,1,1),'#0000e0');
 art={...art,strokes:[{region:1,part:0,tool:'pencil',color:'#111111',size:12,points:[[300,150]]},{region:1,part:1,tool:'eraser',size:12,points:[[300,250]]}]};
 const refilled=paintRegion(art,1,0,'#ffee00');assert.equal(refilled.strokes.length,1);assert.equal(refilled.strokes[0].part,1);assert.equal(regionColour(refilled,1,1),'#0000e0');
 for(const rotation of [0,45,90,180,-90]){
  const r=getRegions('KR',true,[{...shape,rotation}]),a=rotation*Math.PI/180;
  for(const [p,part] of [[[300,150],0],[[300,250],1]]){const q=[300+(p[0]-300)*Math.cos(a)-(p[1]-200)*Math.sin(a),200+(p[0]-300)*Math.sin(a)+(p[1]-200)*Math.cos(a)];assert.equal(r[hitRegion(q,r)].part,part);assert.equal(inside(q,r[part===0?2:1]),false);}
 }
});

test('filling half of a legacy whole-shape stroke keeps the other half and deletion reindexes part paint',()=>{
 const art={...blankArtwork(),shapes:[createShape('rect'),createShape('symbol','taegeuk'),createShape('symbol','star')],colors:{0:'#ffffff',1:'#333333','2:0':'#ee0000','2:1':'#0000ee',3:'#ffdd00'},strokes:[{region:2,tool:'marker',size:20,points:[[300,150],[300,250]]},{region:3,points:[[300,150]]}]};
 const filled=paintRegion(art,2,1,'#0088ff');assert.equal(filled.strokes[0].part,0);assert.equal(filled.strokes[0].region,2);
 const shifted=removeShape(filled,0);assert.equal(regionColour(shifted,1,0),'#ee0000');assert.equal(regionColour(shifted,1,1),'#0088ff');assert.deepEqual(shifted.strokes.map(s=>[s.region,s.part]),[[1,0],[2,undefined]]);
 const removed=removeShape(shifted,0);assert.deepEqual(removed.colors,{0:'#ffffff',1:'#ffdd00'});assert.equal(removed.strokes.length,1);assert.equal(removed.strokes[0].region,1);assert.equal(regionKey(1,1),'1:1');
});

test('both Taegeuk paint parts and an eraser survive gallery and fresh draft reload',()=>{
 const disk=storage(),saved={...item(),colors:{'1:0':'#ee0000','1:1':'#0000ee'},strokes:[{region:1,part:1,tool:'eraser',color:'#ffffff',size:20,points:[[300,250]]}]};
 saveArtGallery(disk,saved);const draft=artworkDraft(readArtGallery(disk)[0]);createStudioDraftStore().saveStudioDraft(disk,'KR',true,draft);
 const restored=createStudioDraftStore().readStudioDraft(disk,'FR',true).art;assert.equal(regionColour(restored,1,0),'#ee0000');assert.equal(regionColour(restored,1,1),'#0000ee');assert.equal(restored.strokes[0].part,1);assert.equal(restored.strokes[0].tool,'eraser');
});

test('moving and resizing never lets the unrotated shape leave the flag paper',()=>{
 for(const type of ['rect','circle','line','symbol'])for(const [dx,dy] of [[-1000,-1000],[1000,1000]]){
  const shape=moveShape(createShape(type,'star'),dx,dy),b=shapeBounds(shape);if(type==='line'){assert.ok([shape.x1,shape.x2].every(x=>x>=0&&x<=600));assert.ok([shape.y1,shape.y2].every(y=>y>=0&&y<=400));}else assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=600&&b.y+b.height<=400);assert.ok(validShape(resizeShape(shape,[550,350])));
 }
 const s=resizeShape(createShape('symbol','star'),[900,900]);assert.equal(s.x+s.width,600);assert.equal(s.y+s.height,400);
});

test('rotated symbol hit coordinates use the inverse transform and keep the centre fixed',()=>{
 const s={...createShape('symbol','star'),rotation:90};
 const [x,y,w,h]=flagSymbols[0].viewBox,p=localSymbolPoint([300,200],s);assert.deepEqual(p,[x+w/2,y+h/2]);
 const q=localSymbolPoint([375,200],s);assert.ok(Math.abs(q[0]-(x+w/2))<1e-8);assert.ok(Math.abs(q[1]-y)<1e-8);
});

test('deleting a middle shape removes its strokes and reindexes later paint regions',()=>{
 const art={...blankArtwork(),shapes:[createShape('rect'),createShape('circle'),createShape('symbol','star')],colors:{0:'#fff',1:'#111',2:'#222',3:'#333'},strokes:[{region:1,points:[[1,1]]},{region:2,points:[[2,2]]},{region:3,points:[[3,3]]}]};
 const next=removeShape(art,1);assert.equal(next.shapes.length,2);assert.deepEqual(next.colors,{0:'#fff',1:'#111',2:'#333'});assert.deepEqual(next.strokes.map(s=>s.region),[1,2]);assert.equal(art.shapes.length,3);
});

test('named motif artwork survives a gallery save, reopen, draft save and fresh reload',()=>{
 const disk=storage(),saved=item();saveArtGallery(disk,saved);
 const reopened=readArtGallery(disk)[0],draft=artworkDraft(reopened,{ink:'#002395',size:24,extra:[]});
 createStudioDraftStore().saveStudioDraft(disk,'KR',true,draft);
 const restored=createStudioDraftStore().readStudioDraft(disk,'FR',true);
 assert.equal(restored.art.countryName,'별빛나라');assert.equal(restored.art.englishName,'Starlight Land');assert.equal(restored.art.savedCountryId,'one');assert.equal(restored.art.shapes[0].symbol,'taegeuk');assert.equal(restored.art.shapes[1].symbol,'star');assert.deepEqual(restored.art.colors,{2:'#ffaa00'});assert.equal(artworkName(reopened,'en'),'Starlight Land');
});

test('editing an existing country updates its card and creating another country preserves both',()=>{
 const disk=storage();saveArtGallery(disk,item());saveArtGallery(disk,{...item(),countryName:'달빛나라'});assert.equal(readArtGallery(disk).length,1);assert.equal(readArtGallery(disk)[0].countryName,'달빛나라');saveArtGallery(disk,item('two'));assert.equal(readArtGallery(disk).length,2);
});

test('drawing undo keeps the saved country identity while undoing a new blank country restores the old one',()=>{
 const previous={...blankArtwork(),countryName:'옛 나라',savedCountryId:'old'},current={...blankArtwork(),countryName:'새 이름',englishName:'New name',savedCountryId:'old'};
 const undone=undoNamedArtwork(blankArtwork(),current);assert.equal(undone.savedCountryId,'old');assert.equal(undone.countryName,'새 이름');
 assert.deepEqual(undoNamedArtwork(previous,{...blankArtwork(),newCountry:true}),previous);
});

test('legacy galleries stay readable while invalid country codes and corrupted motifs are excluded',()=>{
 const disk=storage();disk.setItem(galleryKey,JSON.stringify([{id:'legacy',code:'FR',custom:false,colors:{},shapes:[],svg:'<svg/>'},{...item('bad-code'),code:'ZZ'},{...item('bad-shape'),shapes:[{type:'symbol',symbol:'bad'}]}]));assert.deepEqual(readArtGallery(disk).map(i=>i.id),['legacy']);assert.equal(artworkDraft(readArtGallery(disk)[0]).art.legacy,true);
});

test('a full gallery reports failure and leaves the current saved collection intact',()=>{
 const disk=storage();saveArtGallery(disk,item());const before=disk.getItem(galleryKey);assert.throws(()=>saveArtGallery({...disk,setItem(){throw Error('quota');}},item('two')),/quota/);assert.equal(disk.getItem(galleryKey),before);
});
