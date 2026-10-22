import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlagMesh,flagDisplacement,flagSurface,flagScene,flagSceneFor,svgFlagAspect,createPoleMesh} from '../src/flag-wave.js';
test('the cloth mesh covers the full texture with valid triangles',()=>{
 const mesh=createFlagMesh(60,30);assert.equal(mesh.length,60*30*6*2);assert.ok(mesh.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
 for(let i=0;i<mesh.length;i+=6){const area=(mesh[i+2]-mesh[i])*(mesh[i+5]-mesh[i+1])-(mesh[i+4]-mesh[i])*(mesh[i+3]-mesh[i+1]);assert.ok(area<0);}
 assert.ok(mesh.includes(0)&&mesh.includes(1));
});
test('wind holds the hoist fixed, moves the free edge, and zero wind leaves a flat surface',()=>{
 for(const time of [0,.5,4,100])for(const v of [0,.5,1]){assert.equal(Math.abs(flagDisplacement(0,v,time,2)),0);assert.equal(Math.abs(flagDisplacement(.8,v,time,0)),0);}
 assert.notEqual(flagDisplacement(1,.5,0),flagDisplacement(1,.5,.5));
 assert.equal(flagDisplacement(.8,.3,2,2),2*flagDisplacement(.8,.3,2,1));
});
test('all wind settings keep the whole hoist on the pole, and cloth deformation stays finite',()=>{
 assert.ok(Math.abs(flagScene.poleX+flagScene.poleRadius-flagScene.hoistX)<1e-12);
 for(const time of [0,.5,8,1000])for(const wind of [0,.2,1,2])for(const v of [0,.25,.5,1]){
  const hoist=flagSurface(0,v,time,wind);
  assert.deepEqual(hoist.slice(0,2),[flagScene.hoistX,(.5-v)*1.8]);assert.equal(Math.abs(hoist[2]),0);
  for(const u of [.1,.5,1]){
   const p=flagSurface(u,v,time,wind);assert.ok(p.every(Number.isFinite));
   assert.ok(Math.abs(p[2])<=.457);assert.ok(p[0]>=-1.35&&p[0]<=1.35);assert.ok(Math.abs(p[1])<1.11);
   if(wind===0){assert.deepEqual(p.slice(0,2),[(u-.5)*2.7,(.5-v)*1.8]);assert.equal(Math.abs(p[2]),0);}
  }
 }
});
test('the pole mesh covers the attachment points and has valid unit lighting normals',()=>{
 const mesh=createPoleMesh();assert.equal(mesh.length%18,0);assert.ok(mesh.every(Number.isFinite));
 let minY=Infinity,maxY=-Infinity;
 for(let i=0;i<mesh.length;i+=6){minY=Math.min(minY,mesh[i+1]);maxY=Math.max(maxY,mesh[i+1]);assert.ok(Math.abs(Math.hypot(mesh[i+3],mesh[i+4],mesh[i+5])-1)<1e-6);}
 assert.ok(minY<flagScene.bottom&&maxY>flagScene.top);
});
test('painted 4:3 flags and custom 3:2 flags keep their SVG proportions and share a fixed pole tangent',()=>{
 for(const [svg,aspect] of [['<svg viewBox="0 0 640 480"/>',4/3],["<svg viewBox='0,0,600,400'/>",1.5],['<svg width="300px" height="300px"/>',1],['<svg width="600" height="400"/>',1.5]]){
  assert.equal(svgFlagAspect(svg),aspect);const scene=flagSceneFor(aspect);
  assert.ok(Math.abs(scene.width/scene.height-aspect)<1e-12);
  assert.ok(Math.abs(scene.poleX+scene.poleRadius-scene.hoistX)<1e-12);
  for(const time of [0,10,100])for(const wind of [0,1,2])for(const v of [0,.5,1]){
   const hoist=flagSurface(0,v,time,wind,aspect);assert.equal(hoist[0],scene.hoistX);assert.equal(Math.abs(hoist[2]),0);
  }
  const mesh=createPoleMesh(32,aspect);let maxX=-Infinity;
  for(let i=0;i<mesh.length;i+=6)if(Math.abs(mesh[i+1]-.9)<1e-6)maxX=Math.max(maxX,mesh[i]);
  assert.ok(Math.abs(maxX-(scene.poleX+.067))<1e-6);
 }
 for(const svg of ['<svg/>','<svg viewBox="0 0 0 480"/>','<svg viewBox="0 0 NaN 480"/>','<svg width="100%" height="100%"/>'])assert.equal(svgFlagAspect(svg),1.5);
});
