// Quiz geography must never reveal which country owns the correct city.
export function countryHighlightLayers(code,quizMode){
 const filter=['==',['get','cca2'],code],layout={visibility:quizMode?'none':'visible'};
 return [
  {id:'selected-country-fill',type:'fill',source:'countries',filter,layout,paint:{'fill-color':'#f5a556','fill-opacity':.96}},
  {id:'selected-country-outline',type:'line',source:'countries',filter,layout,paint:{'line-color':'#d88b3c','line-width':1.7}},
 ];
}
export function updateCountryHighlight(map,code,quizMode){
 for(const layer of countryHighlightLayers(code,quizMode)){
  if(!map.getLayer(layer.id))continue;
  map.setLayoutProperty(layer.id,'visibility',layer.layout.visibility);
  map.setFilter(layer.id,layer.filter);
 }
}
