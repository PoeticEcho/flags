// SVG source pixels are used only for region boundaries and expected colours.
// Contiguous areas are separate, even if they share a colour (e.g. US stripes).
export function hexColor(r,g,b){return '#'+[r,g,b].map(c=>c.toString(16).padStart(2,'0')).join('');}
export function rgbColor(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
export function svgPaintColors(text){
 const named={gold:'#ffd700',gray:'#808080',olive:'#808000',purple:'#800080',red:'#ff0000',white:'#ffffff',black:'#000000',blue:'#0000ff',green:'#008000',yellow:'#ffff00'};
 const result=new Set();
 for(const match of text.matchAll(/(?:fill|stroke|stop-color)=["']([^"']+)["']/g)){
  let color=match[1].toLowerCase();if(named[color])color=named[color];if(/^#[a-f0-9]{3}$/.test(color))color='#'+[...color.slice(1)].map(v=>v+v).join('');if(/^#[a-f0-9]{6}$/.test(color))result.add(color);
 }
 result.add('#000000');return [...result].map(rgbColor);
}
export function splitFlagPixels(data,width,height,sourceColors=[]){
 const histogram=new Map();
 for(let i=0;i<data.length;i+=4){if(data[i+3]<128)continue;const v=(data[i]<<16)|(data[i+1]<<8)|data[i+2];histogram.set(v,(histogram.get(v)||0)+1);}
 if(sourceColors.length){
  const actual=new Map();
  for(const [value,count] of histogram){const rgb=[value>>16,(value>>8)&255,value&255];let best=sourceColors[0],distance=Infinity;for(const c of sourceColors){const d=c.reduce((sum,v,k)=>sum+(v-rgb[k])**2,0);if(d<distance){distance=d;best=c;}}const key=(best[0]<<16)|(best[1]<<8)|best[2];actual.set(key,(actual.get(key)||0)+count);}
  histogram.clear();for(const entry of actual)histogram.set(...entry);
 }
 const sorted=[...histogram].sort((a,b)=>b[1]-a[1]);const colors=[];
 for(const [v,count] of sorted){const c=[v>>16,(v>>8)&255,v&255];if(count<Math.max(8,width*height*.0001)&&colors.length>=3)break;if(colors.every(a=>a.reduce((s,x,j)=>s+(x-c[j])**2,0)>32**2))colors.push(c);if(colors.length===10)break;}
 const n=width*height,quantized=new Int16Array(n).fill(-1),labels=new Int32Array(n).fill(-1),queue=new Int32Array(n),cache=new Map();
 for(let p=0;p<n;p++){const i=p*4;if(data[i+3]<128)continue;const key=(data[i]<<16)|(data[i+1]<<8)|data[i+2];let index=cache.get(key);if(index===undefined){let distance=Infinity;colors.forEach((c,j)=>{const d=c.reduce((s,v,k)=>s+(v-data[i+k])**2,0);if(d<distance){distance=d;index=j;}});cache.set(key,index);}quantized[p]=index;}
 const regions=[];
 for(let start=0;start<n;start++){
  if(quantized[start]<0||labels[start]!==-1)continue;
  const id=regions.length,colour=quantized[start];let front=0,back=1,minX=width,minY=height,maxX=0,maxY=0;queue[0]=start;labels[start]=id;
  while(front<back){const p=queue[front++],x=p%width,y=Math.floor(p/width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
   for(const other of [x>0?p-1:-1,x<width-1?p+1:-1,y>0?p-width:-1,y<height-1?p+width:-1])if(other>=0&&labels[other]===-1&&quantized[other]===colour){labels[other]=id;queue[back++]=other;}
  }
  // Preserve tiny heraldic details at source colour; they are too small to tap.
  regions.push({id,color:hexColor(...colors[colour]),rgb:colors[colour],count:back,minX,minY,maxX,maxY,locked:back<24});
 }
 return {width,height,labels,regions,palette:colors.map(c=>hexColor(...c)),sourcePixels:data};
}
export function regionAt(model,x,y){if(x<0||y<0||x>=model.width||y>=model.height)return -1;const id=model.labels[Math.floor(y)*model.width+Math.floor(x)];return id>=0&&!model.regions[id].locked?id:-1;}
export function gradePixels(model,pixels){
 const totals=model.regions.map(()=>0);const hits=model.regions.map(()=>0);
 for(let p=0;p<model.labels.length;p++){const id=model.labels[p];if(id<0||model.regions[id].locked)continue;totals[id]++;const i=p*4,rgb=model.regions[id].rgb;const alpha=pixels[i+3]/255;const actual=[0,1,2].map(j=>Math.round(pixels[i+j]*alpha+255*(1-alpha)));if(rgb.every((c,j)=>Math.abs(c-actual[j])<=5))hits[id]++;}
 const scores=model.regions.filter(r=>!r.locked).map(r=>({id:r.id,ratio:totals[r.id]?hits[r.id]/totals[r.id]:0}));
 const accuracy=hits.reduce((a,b)=>a+b,0)/Math.max(1,totals.reduce((a,b)=>a+b,0));
 return {complete:scores.length>0&&scores.every(s=>s.ratio>=.9),finished:scores.filter(s=>s.ratio>=.9).length,total:scores.length,accuracy,percent:Math.floor(accuracy*100)};
}
export function makePaperPixels(model){
 const out=new Uint8ClampedArray(model.sourcePixels.length),{width,height,labels,regions,sourcePixels}=model;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=y*width+x,i=p*4,id=labels[p];if(id<0)continue;if(regions[id].locked){out.set(sourcePixels.subarray(i,i+4),i);continue;}
  const edge=(x>0&&labels[p-1]!==id)||(x<width-1&&labels[p+1]!==id)||(y>0&&labels[p-width]!==id)||(y<height-1&&labels[p+width]!==id);
  out.set(edge?[174,184,190,255]:[255,255,255,255],i);
 }
 return out;
}
export function seededRandom(seed=41){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
// Deterministic paper-grain patterns: fixed to the paper rather than restarting
// at each stroke. Transparent gaps reveal earlier strokes and coloured paper.
export function makeTexture(canvas,tool,color){
 canvas.width=96;canvas.height=96;const ctx=canvas.getContext('2d'),rand=seededRandom();ctx.fillStyle=color;
 if(tool==='crayon'){
  ctx.globalAlpha=.64;ctx.fillRect(0,0,96,96);ctx.globalCompositeOperation='destination-out';
  for(let i=0;i<1150;i++){ctx.globalAlpha=.15+rand()*.70;ctx.beginPath();ctx.ellipse(rand()*96,rand()*96,.3+rand()*1.1,.3+rand()*.8,rand()*Math.PI,0,Math.PI*2);ctx.fill();}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.24;
  for(let i=0;i<360;i++)ctx.fillRect(rand()*96,rand()*96,.4+rand()*1.6,.5+rand());
 }else if(tool==='pencil'){
  ctx.globalAlpha=.22;ctx.fillRect(0,0,96,96);ctx.strokeStyle=color;
  for(let i=-96;i<192;i+=3){ctx.globalAlpha=.20+rand()*.42;ctx.lineWidth=.35+rand()*.6;ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+96,96);ctx.stroke();}
  ctx.globalAlpha=.13;for(let i=0;i<400;i++)ctx.fillRect(rand()*96,rand()*96,.5,.7);
 }else{ctx.globalAlpha=.76;ctx.fillRect(0,0,96,96);}
 ctx.globalAlpha=1;return canvas;
}
