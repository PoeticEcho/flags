const settingsKey = 'world-explorer-settings-v1';
const defaults = {language:'ko',selectedCode:'FR',mode:'explore',poolSize:48,difficulty:'mixed'};
export function readExplorerSettings(storage, countries) {
  try {
    const saved=JSON.parse(storage.getItem(settingsKey)||'{}');
    return {
      language:['ko','en'].includes(saved.language)?saved.language:defaults.language,
      selectedCode:countries.has(saved.selectedCode)?saved.selectedCode:defaults.selectedCode,
      mode:['explore','colour','custom'].includes(saved.mode)?saved.mode:'explore',
      poolSize:[20,40,48,60,100,120,197,199].includes(saved.poolSize)?saved.poolSize:defaults.poolSize,
      difficulty:['word','mixed','flag'].includes(saved.difficulty)?saved.difficulty:defaults.difficulty,
    };
  } catch {return {...defaults};}
}
export function saveExplorerSettings(storage, settings) {
  try {storage.setItem(settingsKey,JSON.stringify(settings));return true;} catch {return false;}
}
