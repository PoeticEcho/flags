export function nextPaintRegion(model,current,step=1){
 const regions=model?.regions.filter(region=>!region.locked)||[];
 if(!regions.length)return null;
 const index=regions.findIndex(region=>region.id===current);
 return regions[(index<0?0:(index+step+regions.length)%regions.length)].id;
}
