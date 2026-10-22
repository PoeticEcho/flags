import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,writeFileSync,unlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {capitalPoints,roster} from '../src/data.js';
import media from '../src/postcard-media.json' with {type:'json'};
import imports from '../src/postcard-imports.json' with {type:'json'};
import index from '../artwork/postcard-media-index.json' with {type:'json'};
const file=url=>new URL('../public'+url,import.meta.url);
const sha=url=>createHash('sha256').update(readFileSync(file(url))).digest('hex');

test('all 197 countries have separate, smaller previews and original-size scenes',()=>{
 assert.deepEqual(Object.keys(media).sort(),roster.map(c=>c.code).sort());
 const rows=index.records.filter(r=>r.kind==='media');
 assert.equal(rows.length,197);
 for(const row of rows){
  assert.ok(existsSync(file(row.previewImage)),row.code);
  assert.ok(existsSync(file(row.fullImage)),row.code);
  assert.equal(sha(row.fullImage),row.fullSha256,row.code);
  assert.ok(row.previewBytes<row.fullBytes,row.code);
  assert.ok(row.previewWidth<=640&&row.previewWidth<row.width,row.code);
  assert.equal(row.width*2,row.height*3,row.code);
  assert.equal(capitalPoints[row.code].previewImage,row.previewImage,row.code);
  assert.equal(capitalPoints[row.code].fullImage,row.fullImage,row.code);
 }
});

test('the 87 imported scenes preserve supplied WebP bytes and bilingual scene names',()=>{
 assert.equal(Object.keys(imports).length,87);
 const imported=index.records.filter(r=>r.origin==='user_uploaded_backup');
 assert.equal(imported.length,87);
 for(const row of imported){
  assert.equal(sha(row.webImage),row.sha256,row.code);
  assert.equal(capitalPoints[row.code].landmark,row.landmark,row.code);
  assert.equal(capitalPoints[row.code].landmarkKo,row.landmarkKo,row.code);
 }
});

test('small card markup never includes a full image; the viewer adds only the opened country',async()=>{
 const {fileURLToPath}=await import('node:url');
 const source=new URL('../src/PostcardPreview.jsx',import.meta.url);
 const temp=new URL(`.postcard-render-${process.pid}.mjs`,import.meta.url);
 const result=await build({entryPoints:[fileURLToPath(source)],bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',write:false});
 writeFileSync(temp,result.outputFiles[0].text);
 try{
  const {default:Preview,PostcardViewer}=await import(temp.href);
  for(const code of ['FR','SG','BS']){
   const place=capitalPoints[code],country=roster.find(c=>c.code===code);
   const preview=renderToStaticMarkup(createElement(Preview,{place,language:'ko',onOpen:()=>{}}));
   assert.ok(preview.includes(place.previewImage));
   assert.ok(!preview.includes(place.fullImage));
   assert.match(preview,/loading="lazy"/);
   assert.match(preview,/button/);
   const compact=renderToStaticMarkup(createElement(Preview,{place,language:'ko',compact:true,onOpen:()=>{}}));
   assert.match(compact,/class="postcard-launcher"/);
   assert.match(compact,/aria-haspopup="dialog"/);
   assert.ok(compact.includes(place.previewImage));
   assert.ok(!compact.includes(place.fullImage));
   assert.equal(renderToStaticMarkup(createElement(PostcardViewer,{item:null,language:'ko',onClose:()=>{}})),'');
   const opened=renderToStaticMarkup(createElement(PostcardViewer,{item:{country,place},language:'ko',onClose:()=>{}}));
   assert.ok(opened.includes(place.fullImage));
   assert.ok(!opened.includes(capitalPoints[code==='SG'?'FR':'SG'].fullImage));
   assert.match(opened,/<dialog/);
   assert.match(opened,/<button[^>]*class="postcard-dismiss-image"[^>]*aria-label="사진을 눌러 닫기"[^>]*><img/);
  }
 }finally{unlinkSync(temp);}
});
