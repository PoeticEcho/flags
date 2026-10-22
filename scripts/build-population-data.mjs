import fs from 'node:fs';
import {roster} from '../src/data.js';
const snapshot=JSON.parse(fs.readFileSync(new URL('../sources/un-wpp2024-population-2025-extract.json',import.meta.url)));
const byCode=new Map(snapshot.rows.map(row=>[row[6],row]));
const data=Object.fromEntries(roster.map(country=>{
 const row=byCode.get(country.code);
 if(!row||row[8]!=='Country/Area'||row[10]!==2025||row[1]!=='Medium'||!Number.isFinite(row[12])||row[12]<=0)throw new Error(`Missing population: ${country.code}`);
 return [country.code,{value:Math.round(row[12]*1000),year:2025,variant:'Medium',locationCode:row[4]}];
}));
fs.writeFileSync(new URL('../src/population-data.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(`Wrote ${Object.keys(data).length} source-backed populations`);
