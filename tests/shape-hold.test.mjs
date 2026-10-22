import test from 'node:test';
import assert from 'node:assert/strict';
import {createShapeHold} from '../src/shape-hold.js';
function fixture(){const jobs=new Map(),activated=[];let tick=0;const hold=createShapeHold({onActivate:data=>activated.push(data.id),schedule:(fn,delay)=>{assert.equal(delay,480);jobs.set(++tick,fn);return tick;},unschedule:id=>jobs.delete(id)});return {hold,activated,run:()=>{const pending=[...jobs.values()];jobs.clear();pending.forEach(fn=>fn());}};}
test('a stationary hold activates editing once while a short tap keeps its painting intent',()=>{
 const {hold,activated,run}=fixture();hold.begin({id:1,client:[100,200]});assert.equal(hold.move(1,[105,202]),'wait');run();assert.deepEqual(activated,[1]);assert.equal(hold.move(1,[120,220]),'active');assert.equal(hold.end(1),'active');run();assert.deepEqual(activated,[1]);
 hold.begin({id:2,client:[0,0]});assert.equal(hold.end(2),'tap');run();assert.deepEqual(activated,[1]);
});
test('drawing movement, cancellation and replacement presses cannot trigger a later long-press command',()=>{
 const {hold,activated,run}=fixture();hold.begin({id:1,client:[0,0]});assert.equal(hold.move(1,[9,0]),'draw');run();assert.deepEqual(activated,[]);assert.equal(hold.end(1),'none');
 hold.begin({id:2,client:[0,0]});hold.cancel(2);run();assert.deepEqual(activated,[]);
 hold.begin({id:3,client:[0,0]});hold.begin({id:4,client:[0,0]});run();assert.deepEqual(activated,[4]);hold.cancel();assert.equal(hold.end(4),'none');
});
test('a second pointer cannot move, end or cancel the held shape',()=>{
 const {hold,activated,run}=fixture();hold.begin({id:1,client:[0,0]});assert.equal(hold.move(2,[30,30]),'none');assert.equal(hold.end(2),'none');hold.cancel(2);run();assert.deepEqual(activated,[1]);assert.equal(hold.end(1),'active');
});
