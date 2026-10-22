import basicCountryData from './basic-country-data.json' with {type:'json'};
import {polarDestinations} from './polar-data.js';
import {validArt,blankArtwork} from './studio-drafts.js';
export const galleryKey='world-flag-gallery-v1';
export const galleryChangeEvent='world-flag-gallery-change';
const cleanName=name=>typeof name==='string'?name.trim().slice(0,60):'';
const knownDestinations=new Set([...Object.keys(basicCountryData),...polarDestinations.map(place=>place.code)]);
export const svgImageUrl=svg=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
export function readArtGallery(storage) {
 try {
  const data=JSON.parse(storage?.getItem(galleryKey)||'[]');
  return Array.isArray(data)?data.filter(item=>item&&typeof item.id==='string'&&knownDestinations.has(item.code)&&typeof item.svg==='string'&&validArt({...item,strokes:item.strokes||[],actions:item.actions||[]})).map(item=>({...item,countryName:cleanName(item.countryName),englishName:cleanName(item.englishName)})):[];
 }catch{return [];}
}
export function saveArtGallery(storage,item) {
 const entries=readArtGallery(storage),next=[item,...entries.filter(old=>old.id!==item.id)];
 storage.setItem(galleryKey,JSON.stringify(next));
 return next;
}
export function deleteCustomCountry(storage,id) {
 if(!storage?.getItem||!storage?.setItem)throw Error('gallery-unavailable');
 const raw=storage.getItem(galleryKey);
 if(raw&&!Array.isArray(JSON.parse(raw)))throw Error('gallery-invalid');
 const entries=readArtGallery({getItem:()=>raw});
 const next=entries.filter(item=>!(item.custom&&item.id===id));
 if(next.length!==entries.length)storage.setItem(galleryKey,JSON.stringify(next));
 return next;
}
export function artworkDraft(item,defaults={}) {
 return {...defaults,art:{...blankArtwork(),colors:item.colors,shapes:item.shapes,strokes:item.strokes||[],actions:item.actions||[],legacy:item.legacy??(!item.custom&&!item.actions),countryName:cleanName(item.countryName),englishName:cleanName(item.englishName),savedCountryId:item.custom?item.id:undefined,savedArtworkId:item.custom?undefined:item.id},history:[],tool:item.tool||'paint'};
}
export function artworkName(item,language='ko') {
 return language==='en'?(cleanName(item.englishName)||cleanName(item.countryName)):(cleanName(item.countryName)||cleanName(item.englishName));
}
export function completedCountry(art,gallery) {
 const saved=gallery.find(item=>item.custom&&item.id===art.savedCountryId);
 if(!saved||!cleanName(art.countryName))return null;
 const content=value=>JSON.stringify({countryName:cleanName(value.countryName),englishName:cleanName(value.englishName),colors:value.colors,shapes:value.shapes,strokes:value.strokes||[],actions:value.actions||[]});
 return content(art)===content(saved)?saved:null;
}
export function completedFlag(art,gallery,code) {
 const content=value=>JSON.stringify({colors:value.colors,shapes:value.shapes,strokes:value.strokes||[],actions:value.actions||[],legacy:value.legacy??(!value.custom&&!value.actions)});
 return gallery.find(item=>!item.custom&&item.id===art.savedArtworkId&&item.code===code&&content(item)===content(art))||null;
}
export function undoNamedArtwork(previous,current) {
 if(current.newCountry&&!current.countryName&&!current.shapes.length&&!current.strokes.length&&!Object.keys(current.colors).length)return previous;
 return {...previous,countryName:current.countryName,englishName:current.englishName,savedCountryId:current.savedCountryId??previous.savedCountryId,savedArtworkId:current.savedArtworkId??previous.savedArtworkId};
}
export function downloadArtwork(item) {
 const url=URL.createObjectURL(new Blob([item.svg],{type:'image/svg+xml'})),a=document.createElement('a');
 a.href=url;a.download=`${(artworkName(item)||'my-flag').replace(/[\\/:*?"<>|]/g,'-')}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
