import basicCountryData from './basic-country-data.json' with {type:'json'};

// Scene updates preserve capital facts and locations; postcard scenes are not capitals.
export const postcardSceneData = {
 GQ: {
  facts: [
   basicCountryData.GQ.facts[0],
   {ko:'적도기니의 비오코섬에는 높은 피코바실레 산이 있어요. 그림 속 산은 본토에 있는 수도와 다른 곳이에요.',en:'Pico Basile is a high mountain on Bioko Island in Equatorial Guinea. This postcard scene is separate from the capital on the mainland.'},
   {ko:'비오코섬의 숲은 높이에 따라 모습이 달라져요. 열대 숲과 산지의 자연을 함께 만날 수 있어요.',en:'Bioko has forests that change with elevation, bringing tropical and mountain habitats together.'}
  ],
  keywords: [
   ...basicCountryData.GQ.keywords,
   {ko:'비오코섬',en:'Bioko Island',type:'place',artwork:true},
   {ko:'피코바실레',en:'Pico Basile',type:'landmark',artwork:true},
   {ko:'산지 숲',en:'Montane forest',type:'nature',artwork:true}
  ],
  sources:[...basicCountryData.GQ.sources,'https://minturismo.gob.gq/lugares-turisticos/','https://www.unesco.org/en/mab/isla-de-bioko'],
  reviewedAt:'2026-10-01'
 },
 SS: {
  facts:[
   basicCountryData.SS.facts[0],
   {ko:'남수단의 수드 습지는 백나일강을 따라 펼쳐져 있어요. 강물과 풀밭이 넓게 이어지는 자연 경관이에요.',en:'The Sudd wetlands stretch along the White Nile in South Sudan, with broad landscapes of water and vegetation.'},
   {ko:'수드에는 파피루스와 갈대 같은 습지 식물이 자라요. 물이 퍼지는 곳과 식물이 많은 곳이 어우러져요.',en:'Papyrus and reeds grow in the Sudd. Open water and richly vegetated wetland areas lie together.'}
  ],
  keywords:[
   {ko:'주바',en:'Juba',type:'city'},
   {ko:'아프리카',en:'Africa',type:'place'},
   {ko:'수드 습지',en:'Sudd wetlands',type:'landmark',artwork:true},
   {ko:'백나일강',en:'White Nile',type:'nature',artwork:true},
   {ko:'파피루스',en:'Papyrus',type:'nature',artwork:true},
   {ko:'갈대',en:'Reeds',type:'nature',artwork:true}
  ],
  sources:[...basicCountryData.SS.sources,'https://whc.unesco.org/en/tentativelists/6276/'],
  reviewedAt:'2026-10-01'
 },
 BS:{
  facts:[
   basicCountryData.BS.facts[0],
   {ko:'바하마의 롱아일랜드에는 딘스 블루홀이 있어요. 바닷가의 깊은 물이 짙은 푸른색으로 보여요.',en:"Dean's Blue Hole is on Long Island in the Bahamas. Its deep coastal water appears a rich blue."},
   {ko:'딘스 블루홀 주변에는 낮은 암벽과 모래 해변이 있어요. 가까운 얕은 물은 청록색으로 보여요.',en:"Low rock cliffs and a sandy beach border Dean's Blue Hole, beside turquoise shallow water."}
  ],
  keywords:[
   {ko:'나소',en:'Nassau',type:'city'},
   {ko:'롱아일랜드',en:'Long Island',type:'place',artwork:true},
   {ko:'딘스 블루홀',en:"Dean's Blue Hole",type:'landmark',artwork:true},
   {ko:'석회암 해안',en:'Limestone shore',type:'nature',artwork:true},
   {ko:'모래 해변',en:'Sandy beach',type:'nature',artwork:true},
   {ko:'청록색 바다',en:'Turquoise shallows',type:'nature',artwork:true}
  ],
  sources:[...basicCountryData.BS.sources,'https://www.bahamas.com/natural-wonders/deans-blue-hole'],
  reviewedAt:'2026-10-01'
 }
};
