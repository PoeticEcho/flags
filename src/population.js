import populations from './population-data.json' with {type:'json'};
export const populationData=populations;
export const populationSource='United Nations, World Population Prospects 2024, medium variant: 1 July 2025 population projection';
export const populationSourceUrl='https://population.un.org/wpp/';
export function formatPopulation(value,language){
 if(!Number.isFinite(value)||value<=0)return '';
 const number=(n,d=1)=>new Intl.NumberFormat(language==='ko'?'ko-KR':'en-US',{maximumFractionDigits:d}).format(n);
 if(language==='ko')return `약 ${value>=100_000_000?number(value/100_000_000)+'억':value>=10_000?number(value/10_000)+'만':number(value,0)} 명`;
 return `about ${value>=1_000_000_000?number(value/1_000_000_000)+' billion':value>=1_000_000?number(value/1_000_000)+' million':number(value,0)} people`;
}
