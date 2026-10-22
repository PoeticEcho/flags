import test from 'node:test';
import assert from 'node:assert/strict';
import {getRegions,templates,paletteFor,hitRegion,gradeArtwork,strokeCovers} from '../src/flag-art.js';

test('all practice flags keep exactly ten wells and every recommended colour',()=>{
 for(const targets of Object.values(templates)){
  for(const extra of [[],['#000001','#000002','#000003','#000004','#000005','#000006','#000007','#000008','#000009','#000010']]){
   const palette=paletteFor(targets,extra);
   assert.equal(palette.length,10);assert.equal(new Set(palette).size,10);
   targets.forEach(c=>assert.ok(palette.includes(c)));
  }
 }
});
test('paint bucket completion, blanks, and wrong colours are scored separately',()=>{
 for(const [code,targets] of Object.entries(templates)){
  const regions=getRegions(code,false,[]);
  assert.ok(gradeArtwork(regions,targets,{colors:Object.fromEntries(targets.map((c,i)=>[i,c])),strokes:[]}).every(s=>s===1));
  assert.deepEqual(gradeArtwork(regions,targets,{colors:{},strokes:[]}),targets.map(c=>c.toLowerCase()==='#ffffff'?1:0));
  const wrong=gradeArtwork(regions,targets,{colors:{0:'#abcdef'},strokes:[]});assert.equal(wrong[0],0);
 }
});
test('crayon, pencil, and marker strokes earn credit only for covered paper',()=>{
 const regions=getRegions('FR',false,[]);
 for(const tool of ['crayon','pencil','marker']){
  const art={colors:{},strokes:[{region:0,color:templates.FR[0],tool,size:24,points:[[30,20],[30,380]]}]};
  const scores=gradeArtwork(regions,templates.FR,art);assert.ok(scores[0]>0&&scores[0]<.3);assert.equal(scores[1],1);
 }
});
test('texture grain does not prevent full stroke coverage from completing',()=>{
 const regions=getRegions('FR',false,[]),strokes=[];
 for(let i=0;i<3;i++)for(let x=i*200+10;x<(i+1)*200;x+=20)strokes.push({region:i,color:templates.FR[i],tool:'crayon',size:24,points:[[x,0],[x,400]]});
 assert.ok(gradeArtwork(regions,templates.FR,{colors:{},strokes}).every(s=>s===1));
});
test('topmost circle owns its pixels; background strokes cannot score the circle',()=>{
 const regions=getRegions('JP',false,[]);
 assert.equal(hitRegion([300,200],regions),1);assert.equal(hitRegion([10,10],regions),0);assert.equal(hitRegion([-10,200],regions),-1);
 const scores=gradeArtwork(regions,templates.JP,{colors:{0:templates.JP[0]},strokes:[{region:0,color:templates.JP[1],size:300,points:[[300,200]]}]});assert.equal(scores[1],0);
 assert.ok(strokeCovers([10,10],{size:24,points:[[10,10]]}));
});
test('overpainting a correct flag with the wrong colour lowers the score',()=>{
 const regions=getRegions('FR',false,[]),colors=Object.fromEntries(templates.FR.map((c,i)=>[i,c]));
 const scores=gradeArtwork(regions,templates.FR,{colors,strokes:[{region:0,color:'#123456',size:80,points:[[100,0],[100,400]]}]});assert.ok(scores[0]<.9);assert.equal(scores[1],1);
});

test('eraser removes wrong ink from white paper and removes correct coloured ink',()=>{
 const regions=getRegions('FR',false,[]),targets=templates.FR;
 const strokes=[{region:1,color:'#123456',size:1000,points:[[300,200]]},{region:1,tool:'eraser',size:1000,points:[[300,200]]},{region:0,tool:'eraser',size:1000,points:[[100,200]]}];
 const score=gradeArtwork(regions,targets,{colors:{0:targets[0]},strokes});assert.equal(score[1],1);assert.equal(score[0],0);
});
