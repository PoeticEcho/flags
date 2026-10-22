import {normalizeCountryQuery,searchCountries} from './country-search.js';
export function filterCollection(countries,gallery,filter,query,language='ko') {
 if(filter!=='mine')return searchCountries(countries,query,{language,includeAll:true});
 const needle=normalizeCountryQuery(query);
 return gallery.filter(item=>item.custom&&(!needle||[item.countryName,item.englishName].some(name=>normalizeCountryQuery(name).includes(needle))));
}
