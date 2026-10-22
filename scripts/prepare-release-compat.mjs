import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Previously opened HTML can still request its hashed entries after a release.
// Tiny aliases forward those exact paths to the current build without old code.
export function prepareReleaseCompatibility(root){
 const client=path.join(root,'dist/client'),html=readFileSync(path.join(client,'index.html'),'utf8');
 const entryMatch=html.match(/src="((?:\/[^"]*)?\/assets\/index-[\w-]+\.js)"/)?.[1];
 const styleMatch=html.match(/href="((?:\/[^"]*)?\/assets\/index-[\w-]+\.css)"/)?.[1];
 const entry=entryMatch?`/assets/${path.basename(entryMatch)}`:null;
 const style=styleMatch?`/assets/${path.basename(styleMatch)}`:null;
 if(!entry||!style||![entry,style].every(file=>existsSync(path.join(client,file.slice(1)))))throw Error('Build the current app before preparing compatibility entries.');
 const assets=path.join(client,'assets');mkdirSync(assets,{recursive:true});
 writeFileSync(path.join(assets,'app-entry.js'),`import ${JSON.stringify('./'+path.basename(entry))};\n`);
 writeFileSync(path.join(assets,'app-style.css'),`@import url(${JSON.stringify('./'+path.basename(style))});\n`);
 const legacyScripts=['index-CoO41y-_.js','index-DxOy8iXg.js','index-DqP99QHQ.js'],legacyStyles=['index-DUONtCPl.css','index-ZWuHM3LA.css'];
 for(const file of legacyScripts)if('/assets/'+file!==entry)writeFileSync(path.join(assets,file),'import "./app-entry.js";\n');
 for(const file of legacyStyles)if('/assets/'+file!==style)writeFileSync(path.join(assets,file),'@import url("./app-style.css");\n');
 return {entry,style,legacyEntries:[...legacyScripts,...legacyStyles].map(file=>'/assets/'+file)};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(prepareReleaseCompatibility(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'))));
