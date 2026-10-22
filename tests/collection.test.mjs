import test from 'node:test';
import assert from 'node:assert/strict';
import {roster,countryByCode} from '../src/data.js';
import {learningData} from '../src/learning-data.js';
import {filterCollection} from '../src/collection-data.js';
import {deleteCustomCountry,readArtGallery,saveArtGallery,artworkDraft,completedCountry} from '../src/art-gallery.js';
import {blankArtwork} from '../src/studio-drafts.js';
const disk=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};};
const item=(id,custom=true)=>({id,code:'KR',custom,countryName:'구름 나라',englishName:'Cloud Land',...blankArtwork(),svg:'<svg/>'});
test('collection search filters the selected real-country set by names and capitals in both languages',()=>{
 assert.equal(filterCollection(roster,[],'all','','ko').length,197);
 for(const query of ['대한민국','Republic of Korea','Seoul','서울'])assert.equal(filterCollection(roster,[],'all',query)[0].code,'KR');
 assert.deepEqual(filterCollection([countryByCode.get('FR')],[],'visited','서울'),[]);
 assert.deepEqual(filterCollection(roster,[],'all','missing-country-123'),[]);
});
test('My countries search only personal bilingual names and preserves the saved collection',()=>{
 const gallery=[item('cloud'),{...item('heart'),countryName:'하트 나라',englishName:'Heart Land'},item('official',false)];
 assert.deepEqual(filterCollection(roster,gallery,'mine','').map(i=>i.id),['cloud','heart']);
 for(const query of ['구름','CLOUD land','cloud-land'])assert.deepEqual(filterCollection(roster,gallery,'mine',query).map(i=>i.id),['cloud']);
 assert.deepEqual(filterCollection(roster,gallery,'mine','서울'),[]);assert.equal(gallery.length,3);
});
test('deleting a personal card persists across reload, preserves other and official cards, and never discards a draft',()=>{
 const storage=disk();saveArtGallery(storage,item('first'));saveArtGallery(storage,item('second'));saveArtGallery(storage,item('official',false));
 const draft=artworkDraft(item('first')).art,copy=structuredClone(draft);
 const next=deleteCustomCountry(storage,'first');assert.deepEqual(next.map(i=>i.id),['official','second']);
 assert.deepEqual(readArtGallery(storage).map(i=>i.id),['official','second']);assert.equal(completedCountry(draft,next),null);assert.deepEqual(draft,copy);
 assert.deepEqual(deleteCustomCountry(storage,'official').map(i=>i.id),['official','second']);
 assert.deepEqual(deleteCustomCountry(storage,'missing').map(i=>i.id),['official','second']);
 saveArtGallery(storage,{...item('first'),...draft});assert.equal(readArtGallery(storage).length,3);
});
test('failed deletion reports failure without hiding the existing saved card',()=>{
 const storage=disk();saveArtGallery(storage,item('first'));
 assert.throws(()=>deleteCustomCountry({...storage,setItem(){throw Error('quota');}},'first'),/quota/);
 assert.throws(()=>deleteCustomCountry({...storage,getItem(){throw Error('unavailable');}},'first'),/unavailable/);
 assert.throws(()=>deleteCustomCountry(null,'first'),/unavailable/);
 assert.equal(readArtGallery(storage)[0].id,'first');
});
test('North Korea displays 북한 consistently while retaining the former search alias and capital',()=>{
 const north=countryByCode.get('KP');assert.equal(north.nameKo,'북한');assert.equal(north.name,'North Korea');assert.equal(north.capitalKo,'평양');
 assert.equal(filterCollection(roster,[],'all','조선')[0].code,'KP');
 assert.ok(learningData.KP.facts.every(f=>!f.ko.includes('조선')));
});
