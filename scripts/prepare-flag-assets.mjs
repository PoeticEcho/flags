import {mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {explorationRoster as roster} from '../src/data.js';
mkdirSync('public/flags',{recursive:true});
for(const {code} of roster){const source=`node_modules/flag-icons/flags/4x3/${code.toLowerCase()}.svg`;if(!existsSync(source))throw new Error(`Missing flag SVG: ${code}`);copyFileSync(source,`public/flags/${code.toLowerCase()}.svg`);}
copyFileSync('node_modules/flag-icons/LICENSE','public/flags/LICENSE.txt');
console.log(`Prepared ${roster.length} local flag SVGs from lipis/flag-icons 7.5.0.`);
