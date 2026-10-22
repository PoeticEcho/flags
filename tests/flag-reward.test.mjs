import test from 'node:test';
import assert from 'node:assert/strict';
import {gradePixels} from '../src/official-art.js';
import {gradeArtworkAssessment} from '../src/flag-art.js';
import {assessFlag,earnedFlag,earnsFlagWave} from '../src/flag-reward.js';
import {blankArtwork} from '../src/studio-drafts.js';

test('the waving reward uses exact area accuracy, including the 89.9/90 percent boundary',()=>{
 const model={labels:new Int32Array(1000),regions:[{id:0,locked:false,rgb:[230,20,40]}]};
 for(const [correct,expected] of [[899,false],[900,true],[1000,true]]){
  const pixels=new Uint8ClampedArray(4000);for(let i=0;i<correct;i++)pixels.set([230,20,40,255],i*4);
  const score=gradePixels(model,pixels);assert.equal(score.accuracy,correct/1000);assert.equal(earnsFlagWave(score),expected);assert.equal(score.percent,Math.floor(correct/10));
 }
 for(const score of [null,{accuracy:NaN,total:1},{accuracy:Infinity,total:1},{accuracy:1,total:0},{accuracy:2,total:1},{percent:90,total:1}])assert.equal(earnsFlagWave(score),false);
});
test('earned waving is bound to the checked country and exact painting, independent of saving',()=>{
 const art={...blankArtwork(),actions:[{kind:'fill',region:0,color:'#ff0000'}]},item={id:'checked',code:'KR',custom:false,...art,svg:'<svg viewBox="0 0 640 480"/>'},score={accuracy:.9,total:3};
 const checked=assessFlag(score,'KR',art,item);
 assert.equal(earnedFlag(checked,'KR',art),item);
 assert.equal(earnedFlag(checked,'KR',{...art,savedArtworkId:'new-id'}),item);
 assert.equal(earnedFlag(checked,'FR',art),null);
 assert.equal(earnedFlag(checked,'KR',art,false),null);
 for(const change of [{actions:[...art.actions,{kind:'erase',region:0,points:[[4,4]],size:10}]},{colors:{0:'#000000'}},{strokes:[{color:'#000000'}]},{shapes:[{type:'circle'}]},{legacy:true}])assert.equal(earnedFlag(checked,'KR',{...art,...change}),null);
 assert.equal(earnedFlag(checked,'KR',blankArtwork()),null);
 assert.equal(earnedFlag(checked,'KR',structuredClone(art)),item);
 assert.equal(assessFlag(score,'FR',art,item),null);
 assert.equal(assessFlag(score,'KR',art,{...item,custom:true}),null);
 assert.equal(assessFlag({...score,accuracy:.899},'KR',art,item),null);
});
test('legacy paintings use overall painted area for the reward while keeping region completion separate',()=>{
 const regions=[{type:'rect',x:0,y:0,width:540,height:400},{type:'rect',x:540,y:0,width:60,height:400}],art={...blankArtwork(),legacy:true,colors:{0:'#ff0000'}};
 const score=gradeArtworkAssessment(regions,['#ff0000','#0000ff'],art);
 assert.equal(score.accuracy,.9);assert.equal(score.complete,false);assert.equal(earnsFlagWave(score),true);
 art.colors[1]='#0000ff';assert.equal(gradeArtworkAssessment(regions,['#ff0000','#0000ff'],art).accuracy,1);
});
