import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,unlinkSync} from 'node:fs';
import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {explorationRoster} from '../src/data.js';
import {searchCountryMatches} from '../src/country-search.js';

test('both search pickers share ordered bilingual groups, tag reasons and uninterrupted option indices',async()=>{
 const {fileURLToPath}=await import('node:url');
 const temp=new URL(`.tag-search-render-${process.pid}.mjs`,import.meta.url);
 const result=await build({entryPoints:[fileURLToPath(new URL('../src/CountrySearchOptions.jsx',import.meta.url))],bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',write:false,define:{'import.meta.env.BASE_URL':'"/"'}});
 writeFileSync(temp,result.outputFiles[0].text);
 try{
  const {default:Options}=await import(temp.href);
  for(const language of ['ko','en']){
   const results=searchCountryMatches(explorationRoster,'island',{language});
   const html=renderToStaticMarkup(createElement(Options,{results,language,currentCode:'CU',onSelect:()=>{},showCurrentIndicator:true,getOptionProps:(country,index)=>({id:`option-${country.code}`,'data-index':index,tabIndex:-1,'aria-selected':index===2})}));
   const countryGroup=html.indexOf(`role="group" aria-label="${language==='ko'?'나라·수도':'Countries · capitals'}"`),tagGroup=html.indexOf(`role="group" aria-label="${language==='ko'?'태그':'Tags'}"`);
   assert.ok(countryGroup>=0&&tagGroup>countryGroup);assert.ok(html.lastIndexOf('data-match="country"')<tagGroup);
   assert.deepEqual([...html.matchAll(/id="option-([A-Z]{2})"/g)].map(m=>m[1]),results.map(r=>r.country.code));
   assert.deepEqual([...html.matchAll(/data-index="(\d+)"/g)].map(m=>Number(m[1])),results.map((r,i)=>i));
   assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);assert.match(html,/class="search-matched-tag"/);assert.doesNotMatch(html,/disabled=/);
   const cuba=renderToStaticMarkup(createElement(Options,{results:searchCountryMatches(explorationRoster,'석회암').filter(r=>r.country.code==='CU'),language,onSelect:()=>{}}));
   assert.ok(cuba.includes(language==='ko'?'쿠바':'Cuba'));assert.ok(cuba.includes(language==='ko'?'석회암':'limestone'));
   assert.match(cuba,/role="group" aria-label="(?:태그|Tags)"/);assert.doesNotMatch(cuba,/data-match="country"/);
  }
 }finally{unlinkSync(temp);}
});
