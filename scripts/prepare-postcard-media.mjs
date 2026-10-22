// Development-time import. Checked-in files need no image processing at app build.
// Usage: node scripts/prepare-postcard-media.mjs <extracted-backup-dir> <generated-export-dir>
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {capitalPoints,roster} from '../src/data.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const [backupDir,exportDir]=process.argv.slice(2);
if(!backupDir||!exportDir)throw Error('Provide backup originals and generated high-quality exports');
const sharpModule=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp/dist/index.mjs')).href:'sharp';
const {default:sharp}=await import(sharpModule);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,value)=>fs.writeFileSync(path.join(root,p),JSON.stringify(value,null,2)+'\n');
const selection=read('artwork/backup-import-selection.json').selected;
const imports={},media={},records=[];
const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const fullDir=path.join(root,'public/assets/postcards/full'),previewDir=path.join(root,'public/assets/postcards/preview');
fs.mkdirSync(fullDir,{recursive:true});fs.mkdirSync(previewDir,{recursive:true});
for(const item of selection){
 const expected=`/assets/postcards/full/${item.code.toLowerCase()}.webp`;
 if(!roster.some(c=>c.code===item.code)||(capitalPoints[item.code].image&&capitalPoints[item.code].image!==expected))throw Error('Cannot replace existing scene '+item.code);
 const source=path.resolve(backupDir,item.filename);
 if(path.dirname(source)!==path.resolve(backupDir))throw Error('Invalid source path');
 imports[item.code]={image:`/assets/postcards/full/${item.code.toLowerCase()}.webp`,landmark:item.landmark,landmarkKo:item.landmarkKo};
 records.push({...item,sha256:digest(source),bytes:fs.statSync(source).size,webImage:imports[item.code].image,origin:'user_uploaded_backup'});
}
const selected={...capitalPoints,...Object.fromEntries(Object.entries(imports).map(([code,item])=>[code,{...capitalPoints[code],...item}]))};
for(const [code,item] of Object.entries(selected)){
 if(!item.image)throw Error('Missing selected scene '+code);
 const imported=selection.find(e=>e.code===code);
 let source=imported?path.resolve(backupDir,imported.filename):path.join(root,'public',item.image);
 let fullImage=item.image;
 if(imported||item.image.startsWith('/assets/postcards/')){
  if(!imported){const meta=read(`artwork/postcards/${code.toLowerCase()}.json`);source=path.resolve(exportDir,meta.exportFile||`${code.toLowerCase()}.webp`);}
  const destination=path.join(fullDir,`${code.toLowerCase()}.webp`);
  if(fs.existsSync(destination)&&digest(destination)!==digest(source))throw Error('Preserve existing large image '+code);
  if(!fs.existsSync(destination))fs.copyFileSync(source,destination);
  fullImage=`/assets/postcards/full/${code.toLowerCase()}.webp`;
 }
 let info;try{info=await sharp(source).metadata();}catch(error){throw Error(`${code}: ${source}: ${error.message}`);}
 if(info.format!=='webp'||info.width*2!==info.height*3)throw Error('Expected landscape 3:2 WebP '+code);
 const previewImage=`/assets/postcards/preview/${code.toLowerCase()}.webp`;
 const output=await sharp(source).resize({width:640,withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(path.join(root,'public',previewImage));
 media[code]={previewImage,fullImage,width:info.width,height:info.height,previewWidth:output.width,previewHeight:output.height};
 records.push({code,kind:'media',fullImage,previewImage,fullBytes:fs.statSync(source).size,previewBytes:output.size,fullSha256:digest(source),width:info.width,height:info.height,previewWidth:output.width,previewHeight:output.height});
}
write('src/postcard-imports.json',imports);write('src/postcard-media.json',media);
write('artwork/postcard-media-index.json',{schemaVersion:1,preparedAt:'2026-10-01',preview:{maxWidth:640,format:'webp',quality:78},full:'Exact uploaded WebP bytes, existing original assets, or full-resolution generated WebP exports; never upscaled.',selectedCountries:Object.keys(media).length,records});
console.log(JSON.stringify({selectedCountries:Object.keys(media).length,importedCountries:selection.length,fullBytes:records.filter(e=>e.kind==='media').reduce((s,e)=>s+e.fullBytes,0),previewBytes:records.filter(e=>e.kind==='media').reduce((s,e)=>s+e.previewBytes,0)}));
