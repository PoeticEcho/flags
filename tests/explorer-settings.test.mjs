import test from 'node:test';
import assert from 'node:assert/strict';
import {countryByCode} from '../src/data.js';
import {readExplorerSettings,saveExplorerSettings} from '../src/explorer-settings.js';

test('reloading returns to the chosen country and painting activity with the language and quiz set intact',()=>{
 let value='{}';const storage={getItem:()=>value,setItem:(k,v)=>{value=v;}};
 const settings={language:'en',selectedCode:'KR',mode:'colour',poolSize:48,difficulty:'word'};
 assert.equal(saveExplorerSettings(storage,settings),true);
 assert.deepEqual(readExplorerSettings(storage,countryByCode),settings);
});

test('invalid settings recover safely and a previous quiz opens exploration rather than an empty question',()=>{
 const read=value=>readExplorerSettings({getItem:()=>value},countryByCode);
 assert.equal(read(JSON.stringify({selectedCode:'ZZ',language:'unknown',poolSize:999,difficulty:'unknown'})).selectedCode,'FR');
 assert.equal(read(JSON.stringify({mode:'quiz',selectedCode:'CH'})).mode,'explore');
 assert.equal(read('{broken').poolSize,48);
 assert.equal(read('null').language,'ko');
 assert.equal(saveExplorerSettings({setItem(){throw Error('quota');}},{}),false);
});
