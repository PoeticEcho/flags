// Read the visible composite, including texture and erased white paper.
export function pixelColour(pixels,width,height,x,y) {
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>=width||y>=height)return null;
 const index=(Math.floor(y)*width+Math.floor(x))*4;
 if(index+3>=pixels.length)return null;
 const alpha=pixels[index+3]/255;
 return '#'+Array.from(pixels.slice(index,index+3),value=>Math.round(value*alpha+255*(1-alpha)).toString(16).padStart(2,'0')).join('');
}

export async function sampleSvgColour(source,x,y) {
 const image=new Image(),url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
 try{
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Could not read the flag colour'));image.src=url;});
  const canvas=document.createElement('canvas');canvas.width=600;canvas.height=400;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,600,400);
  return pixelColour(ctx.getImageData(0,0,600,400).data,600,400,x,y);
 }finally{URL.revokeObjectURL(url);}
}
