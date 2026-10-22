import {capitalQuizRoster as roster,capitalPoints} from './data.js';
import {antarcticQuestions} from './polar-data.js';
export const capitalName=(country,language)=>country?.quizKind==='knowledge'?(language==='ko'?'없음':'None'):country?(language==='ko'?country.capitalKo:country.capital):'';
export const capitalRole=(country,language)=>country?.capitalRole?.[language]||(language==='ko'?'수도':'Capital');
export function capitalQuestion(country, language, onMap = false) {
 if(country.quizKind==='knowledge')return language==='ko'?'남극을 알아볼까요?':'Shall we explore Antarctica?';
 const name=language==='ko'?country.nameKo:country.name,role=capitalRole(country,language);
 if(onMap)return language==='ko'?`${name}의 ${role}를 지도에서 찾아볼까요?`:`Can you find the ${role.toLowerCase()} of ${name} on the map?`;
 return language==='ko'?`${name}의 ${role}는 어디일까요?`:`What is the ${role.toLowerCase()} of ${name}?`;
}
export const quizContinent=country=>country.region==='Americas'?(country.subregion==='South America'?'SouthAmerica':'NorthAmerica'):country.region;
function shuffle(items,random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[result[i],result[j]]=[result[j],result[i]];}return result;}
// One question snapshot supplies both the names and the geographic pins.
export function capitalQuizOptions(code,random=Math.random){
 const country=roster.find(c=>c.code===code);if(!country)return [];
 const candidates=shuffle(roster.filter(c=>c.code!==code&&c.capital!==country.capital&&quizContinent(c)===quizContinent(country)),random);
 let choices;
 for(let i=0;i<candidates.length&&!choices;i++)for(let j=i+1;j<candidates.length;j++){
  const triple=[country,candidates[i],candidates[j]];
  if(new Set(triple.map(c=>c.capital)).size!==3)continue;
  if(quizCitySeparation(triple.map(c=>({coordinates:capitalPoints[c.code].coordinates})))>=48){choices=triple;break;}
 }
 // Every roster continent has well-separated triples; retain a safe fallback.
 choices??=[country,...candidates.slice(0,2)];
 return shuffle(choices,random).map(c=>({id:c.code,code:c.code,answer:c.capital,nameKo:c.capitalKo,name:c.capital,coordinates:capitalPoints[c.code].coordinates,correct:c.code===code}));
}
export function quizCitySeparation(options){
 const points=quizMapFrame(options).coordinates.map(([x,y])=>[x,180/Math.PI*Math.log(Math.tan(Math.PI/4+y*Math.PI/360))]);
 const width=Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),height=Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]));
 const scale=Math.min(width?220/width:Infinity,height?100/height:Infinity);
 return Math.min(...points.flatMap((p,i)=>points.slice(i+1).map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])*scale)));
}
export const wordQuizOptions=capitalQuizOptions;
export const mapQuizOptions=capitalQuizOptions;
export function wrongCapitalHint(option,language){
 if(option?.hint)return option.hint[language];
 const country=roster.find(c=>c.code===option?.code);if(!country)return '';
 return language==='ko'?`${country.nameKo}의 ${capitalRole(country,language)} · ${option.nameKo}`:`${option.name} is the ${capitalRole(country,language).toLowerCase()} of ${country.name}.`;
}
// Unwrap around the largest empty longitude gap, keeping Pacific cities together.
export function quizMapFrame(options){
 if(!options.length||options.some(option=>!option.coordinates?.every(Number.isFinite)))return null;
 const xs=options.map(o=>(o.coordinates[0]+360)%360).sort((a,b)=>a-b);
 let gap=-1,start=xs[0];xs.forEach((x,i)=>{const next=xs[(i+1)%xs.length]+(i===xs.length-1?360:0);if(next-x>gap){gap=next-x;start=next%360;}});
 let coordinates=options.map(o=>{let x=(o.coordinates[0]+360)%360;if(x<start)x+=360;return [x,o.coordinates[1]];});
 const shift=Math.round((Math.min(...coordinates.map(p=>p[0]))+Math.max(...coordinates.map(p=>p[0])))/2/360)*360;
 coordinates=coordinates.map(([x,y])=>[x-shift,y]);
 return {coordinates,bounds:[[Math.min(...coordinates.map(p=>p[0])),Math.min(...coordinates.map(p=>p[1]))],[Math.max(...coordinates.map(p=>p[0])),Math.max(...coordinates.map(p=>p[1]))]],wrapped:coordinates.some(p=>p[0]<-180||p[0]>180)};
}
export const generatedLocationOptions=Object.fromEntries(roster.map(c=>[c.code,mapQuizOptions(c.code)]));
export function createQuizQuestion(code,questionType='mixed',random=Math.random){
 if(code==='AQ'){
  const question=antarcticQuestions[Math.min(antarcticQuestions.length-1,Math.floor(random()*antarcticQuestions.length))];
  return {...question,type:'knowledge',options:shuffle(question.options,random)};
 }
 return {type:questionType==='word'?'word':'map',options:capitalQuizOptions(code,random)};
}
export const quizQuestionText=(question,country,language)=>question?.prompt?.[language]||capitalQuestion(country,language,question?.type==='map');
