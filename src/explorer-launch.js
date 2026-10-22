import {readExplorerSettings} from './explorer-settings.js';

// A new exploration opens somewhere new. Art rooms keep their selected draft.
export function launchExplorerSettings(storage,countries,random=Math.random){
 const settings=readExplorerSettings(storage,countries);
 if(settings.mode!=='explore')return settings;
 let previous;
 try{previous=JSON.parse(storage.getItem('world-explorer-settings-v1')||'{}')?.selectedCode;}catch{}
 const codes=[...countries.keys()],choices=codes.filter(code=>code!==previous);
 const candidates=choices.length?choices:codes;
 if(!candidates.length)return settings;
 const value=Number(random()),index=Number.isFinite(value)?Math.max(0,Math.min(candidates.length-1,Math.floor(value*candidates.length))):0;
 return {...settings,selectedCode:candidates[index]};
}
