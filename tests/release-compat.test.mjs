import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareReleaseCompatibility} from '../scripts/prepare-release-compat.mjs';

test('previously cached HTML entries lead to the current built JavaScript and CSS',()=>{
 const root=mkdtempSync(fileURLToPath(new URL('../.release-compat-',import.meta.url))),client=path.join(root,'dist/client'),assets=path.join(client,'assets');
 try{
  mkdirSync(assets,{recursive:true});writeFileSync(path.join(client,'index.html'),'<script src="/assets/index-new_123.js"></script><link href="/assets/index-new_123.css">');
  writeFileSync(path.join(assets,'index-new_123.js'),'export const release="current";');writeFileSync(path.join(assets,'index-new_123.css'),'body{color:green}');
  const result=prepareReleaseCompatibility(root);assert.equal(result.entry,'/assets/index-new_123.js');
  assert.equal(readFileSync(path.join(assets,'index-CoO41y-_.js'),'utf8'),'import "./app-entry.js";\n');
  assert.equal(readFileSync(path.join(assets,'index-DxOy8iXg.js'),'utf8'),'import "./app-entry.js";\n');
  assert.equal(readFileSync(path.join(assets,'index-DqP99QHQ.js'),'utf8'),'import "./app-entry.js";\n');
  assert.equal(readFileSync(path.join(assets,'app-entry.js'),'utf8'),'import "./index-new_123.js";\n');
  assert.equal(readFileSync(path.join(assets,'index-DUONtCPl.css'),'utf8'),'@import url("./app-style.css");\n');
  assert.equal(readFileSync(path.join(assets,'index-ZWuHM3LA.css'),'utf8'),'@import url("./app-style.css");\n');
  assert.equal(readFileSync(path.join(assets,'app-style.css'),'utf8'),'@import url("./index-new_123.css");\n');
  writeFileSync(path.join(client,'index.html'),'<script src="/assets/index-DxOy8iXg.js"></script><link href="/assets/index-ZWuHM3LA.css">');
  writeFileSync(path.join(assets,'index-DxOy8iXg.js'),'export const release="sameHash";');writeFileSync(path.join(assets,'index-ZWuHM3LA.css'),'body{color:blue}');
  prepareReleaseCompatibility(root);
  assert.equal(readFileSync(path.join(assets,'index-DxOy8iXg.js'),'utf8'),'export const release="sameHash";');
  assert.equal(readFileSync(path.join(assets,'index-ZWuHM3LA.css'),'utf8'),'body{color:blue}');
  writeFileSync(path.join(client,'index.html'),'<script src="/assets/missing.js"></script>');assert.throws(()=>prepareReleaseCompatibility(root),/Build the current app/);
 }finally{rmSync(root,{recursive:true,force:true});}
});
