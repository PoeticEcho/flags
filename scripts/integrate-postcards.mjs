// Integrate one reviewed generation batch. Originals remain outside the Site.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const sharpPath=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp/dist/index.mjs')).href:'sharp';
const {default:sharp}=await import(sharpPath);
const [manifestPath]=process.argv.slice(2);
if(!manifestPath)throw Error('Pass the reviewed batch manifest JSON path');
const root=new URL('../',import.meta.url),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const dbPath=new URL('src/postcard-assets.json',root),db=JSON.parse(fs.readFileSync(dbPath));
const output=new URL('public/assets/postcards/',root),metadata=new URL('artwork/postcards/',root);
const generationRoot=path.resolve(fileURLToPath(root),'../postcard-generation');
const exportsRoot=path.join(generationRoot,'export');
fs.mkdirSync(output,{recursive:true});fs.mkdirSync(metadata,{recursive:true});fs.mkdirSync(exportsRoot,{recursive:true});
for(const entry of manifest){
 if(!/^[A-Z]{2}$/.test(entry.code)||!entry.landmark||!entry.landmarkKo||!entry.prompt||!entry.inspection)throw Error(`Incomplete reviewed entry: ${entry.code}`);
 if(!path.resolve(entry.path).startsWith(generationRoot+path.sep))throw Error('Original must be inside generation workspace');
 const name=entry.code.toLowerCase()+'.webp',destination=new URL(name,output);
 if(db[entry.code]||fs.existsSync(destination))throw Error(`Preserve existing postcard ${entry.code}`);
 const info=await sharp(entry.path).metadata();
 if(info.width<1000||info.height<600)throw Error(`Image too small: ${entry.code}`);
 await sharp(entry.path).resize({width:1024,withoutEnlargement:true}).webp({quality:87,effort:6}).toFile(fileURLToPath(destination));
 await sharp(entry.path).webp({quality:94,effort:6}).toFile(path.join(exportsRoot,name));
 db[entry.code]={image:`/assets/postcards/${name}`,landmark:entry.landmark,landmarkKo:entry.landmarkKo};
 const {path:originalPath,...record}=entry;
 fs.writeFileSync(new URL(`${entry.code.toLowerCase()}.json`,metadata),JSON.stringify({...record,originalFile:path.basename(originalPath),width:info.width,height:info.height,generator:'built-in image_gen',reviewedAt:'2026-10-01',webImage:db[entry.code].image,exportFile:name},null,2)+'\n');
 fs.writeFileSync(dbPath,JSON.stringify(db,null,2)+'\n');
 console.log(`${entry.code}: integrated ${info.width}×${info.height} original and 1024px WebP`);
}
fs.writeFileSync(dbPath,JSON.stringify(db,null,2)+'\n');
const plan=JSON.parse(fs.readFileSync(new URL('artwork/postcard-plan.json',root)));
const progressPath=new URL('artwork/postcard-progress.json',root);
const previous=JSON.parse(fs.readFileSync(progressPath));
const completedNewCodes=plan.filter(entry=>db[entry.code]).map(entry=>entry.code);
const generated=completedNewCodes.length,completed=previous.existing+generated;
fs.writeFileSync(progressPath,JSON.stringify({
 ...previous,generated,completed,remaining:previous.total-completed,completedNewCodes,
 status:completed===previous.total?'completed':'in_progress',resumeAfterUtc:null,blockedBatch:null,
 nextCodes:plan.filter(entry=>!db[entry.code]).slice(0,10).map(entry=>entry.code),
 updatedAt:new Date().toISOString().slice(0,10)
},null,2)+'\n');
