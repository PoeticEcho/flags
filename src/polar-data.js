// Additional destinations are not additions to the original 197-country set.
// Place pins below distinguish a real capital from an Antarctic research site.
const greenlandSources = [
  'https://www.norden.org/en/information/facts-about-greenland',
  'https://visitgreenland.com/destinations/nuuk/',
  'https://whc.unesco.org/en/list/1149/',
  'https://erfalasorput.gl/da/erfalasortaarsimanerup-paasissutissartaa/',
  'https://visitgreenland.com/activities/northern-lights/',
  'https://visitgreenland.com/plan-your-trip/best-time-to-visit/',
];
const antarcticSources = [
  'https://www.ats.aq/e/antarctictreaty.html',
  'https://www.ats.aq/devAS/Meetings/Measure?id=289&lang=e',
  'https://legacy.bas.ac.uk/about_antarctica/wildlife/birds/penguins/gentoo.php',
  'https://www.bas.ac.uk/data/our-data/publication/ice-core-records-of-atmospheric-carbon-dioxide/',
  'https://eng.kopri.re.kr/eng/html/infra/03010101.html',
  'https://www.bas.ac.uk/data/our-data/publication/high-resolution-spatial-mapping-of-human-footprint-across-antarctica-and-its-implications-for-the-strategic-conservation-of-avifauna/',
];
export const polarDestinations = [
  {
    code:'GL', numericCode:'304', name:'Greenland', nameKo:'그린란드',
    aliases:['Kalaallit Nunaat','칼랄리트 누나트','Groenland','Greenland','그린란드'],
    kind:'territory', kindLabel:{ko:'자치 지역',en:'Self-governing territory'},
    capital:'Nuuk', capitalKo:'누크', region:'Americas', subregion:'North America',
    center:[-40,72], quizKind:'capital',
    capitalNote:{ko:'그린란드는 덴마크 왕국 안의 자치 지역이에요. 수도는 그린란드의 누크이며, 덴마크의 코펜하겐과 구분해요.',en:'Greenland is a self-governing territory within the Kingdom of Denmark. Its capital is Nuuk, distinct from Copenhagen in Denmark.'},
    coordinates:[-51.7215728759766,64.1834737080207],
    coordinateSource:'https://www.geonames.org/search.html?country=GL&q=Nuuk',
    populationInfo:{value:56831,date:'2025-07-01',label:{ko:'인구 · 2025년 7월 등록 인구',en:'Population · July 2025 register'},source:'Statistics Greenland, Central Population Register, 1 July 2025',sourceUrl:'https://stat.gl/publ/en/BE/202504/contents/Midyear%20Population.htm'},
  },
  {
    code:'AQ', numericCode:'010', name:'Antarctica', nameKo:'남극',
    aliases:['남극 대륙','남극대륙','Antarctic','Antarctica'],
    kind:'continent', kindLabel:{ko:'대륙 · 비공식 상징',en:'Continent · Unofficial symbol'},
    capital:null, capitalKo:null, region:'Antarctica', subregion:'', center:[0,-80],
    focusBounds:[[-180,-84.5],[180,-60]], quizKind:'knowledge',
    capitalNote:{ko:'남극은 나라가 아니라 대륙이므로 수도가 없어요. 지도 핀은 수도가 아닌 세종과학기지의 위치예요.',en:'Antarctica is a continent, not a country, and has no capital. The map pin marks King Sejong research station, not a capital.'},
    populationNote:{ko:'상주 주민 없음 · 연구진이 머물러요',en:'No permanent residents · Researchers stay here'},
    explorationPoint:{coordinates:[-58.78333333333333,-62.21666666666667],role:{ko:'연구기지',en:'Research station'},name:{ko:'세종과학기지',en:'King Sejong Station'},source:'https://eng.kopri.re.kr/eng/html/infra/03010101.html'},
  },
];
const words = items => items.map(([ko,en,type,artwork=false])=>({ko,en,type,artwork}));
export const polarLearningData = {
  GL:{
    population2025:56831,
    facts:[
      {ko:'그린란드의 수도는 서쪽 해안의 누크예요. 그린란드는 덴마크 왕국 안에서 자치 정부를 운영하는 지역이에요. 지도에서 누크와 덴마크의 수도 코펜하겐을 각각 찾아보세요.',en:'Greenland’s capital is Nuuk on the west coast. Greenland has its own self-government within the Kingdom of Denmark. Find Nuuk and Denmark’s capital, Copenhagen, separately on the map.'},
      {ko:'엽서 속 일룰리사트 아이스피오르에는 빙하에서 떨어져 나온 커다란 빙산이 모여요. 빙하는 육지의 얼음이고, 빙산은 그 일부가 떨어져 바다에 떠 있는 얼음이에요. 그림에서 얼음 사이의 물길을 찾아보세요.',en:'At Ilulissat Icefjord, shown in the postcard, large icebergs gather after breaking away from a glacier. A glacier is ice on land; an iceberg is a piece that has broken off and floats in the sea. Trace the channels between the icebergs.'},
      {ko:'그린란드 국기에는 흰색과 빨간색 두 줄, 그리고 색이 서로 뒤바뀐 원이 있어요. 이 국기를 만든 사람은 예술가 투에 크리스티안센이에요. 원의 위아래 색과 바탕의 위아래 색을 비교하며 색칠해 보세요.',en:'Greenland’s flag has white and red bands and a disc whose colours reverse those of the background. Artist Thue Christiansen designed it. Compare the top and bottom colours of the disc with the bands while colouring.'},
      {ko:'그린란드는 북아메리카에 속한 큰 섬이고, 북극 지역에 있어요. 남극 대륙과는 지구의 반대쪽 극지방이에요. 지구본에서 북극과 남극을 짚어 보고, 그린란드가 어느 쪽에 가까운지 이야기해 보세요.',en:'Greenland is a large island in North America’s Arctic region. Antarctica lies near the opposite pole. Point to the Arctic and Antarctic on a globe, then explain which one is closer to Greenland.'},
      {ko:'그린란드의 북부에서는 여름에 밤에도 해가 지지 않는 백야를 만날 수 있어요. 누크에서는 어두운 밤에 오로라가 보이기도 해요. 백야의 밝은 하늘과 오로라가 보이는 밤하늘은 서로 다른 장면이라는 점을 기억해요.',en:'In northern Greenland, the midnight sun can stay above the horizon through summer nights. In Nuuk, northern lights may appear on dark nights. Remember that a bright midnight-sun sky and an aurora in a dark sky are different scenes.'},
    ],
    keywords:words([['누크','Nuuk','city'],['일룰리사트 아이스피오르','Ilulissat Icefjord','landmark',true],['빙산','icebergs','nature',true],['빙하','glacier','nature',true],['피오르','fjord','geography',true],['북극 지역','Arctic region','geography'],['자치 정부','self-government','history'],['그린란드 국기','Erfalasorput','art'],['백야','midnight sun','science'],['오로라','northern lights','science']]),
    sources:greenlandSources,
    contentReview:{kind:'new-territory-learning',checkedDate:'2026-10-02',storyCount:5,scope:'Primary-source factual anchors and original observation activities; stylized postcard, not a surveyed view.'},
  },
  AQ:{
    facts:[
      {ko:'남극은 지구의 남쪽 끝에 있는 대륙이에요. 한 나라가 아니어서 수도도 없고, 상주 주민도 없어요. 여러 나라의 연구진이 과학기지에 머무르며 얼음과 바다, 날씨를 연구해요.',en:'Antarctica is the continent at Earth’s southern end. It is not a country, so it has no capital and no permanent resident population. Researchers from many countries stay at scientific stations to study ice, oceans and weather.'},
      {ko:'남극을 나타내는 파란 깃발은 남극 모양을 흰색으로 그린 상징 디자인이에요. 격자와 남극 지도가 있는 짙은 파란 그림은 남극조약의 표장이에요. 두 그림 모두 한 나라의 공식 국기로 소개하지 않아요.',en:'The blue design with a white Antarctic outline is an unofficial symbol for Antarctica. The dark blue design with a polar grid and Antarctic map is the Antarctic Treaty emblem. Neither is presented as an official national flag.'},
      {ko:'엽서의 젠투펭귄은 남극반도 일대에서 만날 수 있어요. 눈 위의 흰 무늬와 주황색 부리를 살펴보세요. 펭귄은 날지 못하지만 물속에서 헤엄을 잘 쳐요. 빙산과 바위 해안은 서로 다른 쉼터와 풍경을 만들어요.',en:'Gentoo penguins live around the Antarctic Peninsula, as in this postcard. Look for the white patch above their eyes and their orange beaks. Penguins cannot fly, but swim well. Icebergs and rocky shores make different resting places and landscapes.'},
      {ko:'연구진은 남극 얼음을 길쭉한 기둥 모양으로 꺼내어 조사해요. 이런 얼음 코어에 갇힌 옛 공기는 과거의 대기를 알아보는 단서예요. 종이에 얼음 층을 그려 보고, 아래쪽의 오래된 층과 위쪽의 새로운 층을 구분해 보세요.',en:'Scientists drill long cylinders of Antarctic ice called ice cores. Ancient air trapped inside helps them learn about the atmosphere in the past. Draw layers of ice and distinguish older layers below from newer ones above.'},
      {ko:'남극조약은 남극을 평화적인 목적에 이용하고 과학 연구에 협력하도록 해요. 대한민국의 세종과학기지는 킹조지섬에 있어요. 지도 핀은 이 연구기지를 가리키며, 남극의 수도를 뜻하지 않아요.',en:'The Antarctic Treaty supports peaceful use of Antarctica and cooperation in scientific research. Korea’s King Sejong Station is on King George Island. The map pin marks this research station; it does not represent an Antarctic capital.'},
    ],
    keywords:words([['남극 대륙','Antarctic continent','geography'],['남극반도','Antarctic Peninsula','place',true],['젠투펭귄','gentoo penguin','animal',true],['빙산','icebergs','nature',true],['바위 해안','rocky coast','nature',true],['남극조약','Antarctic Treaty','history'],['세종과학기지','King Sejong Station','place'],['킹조지섬','King George Island','place'],['얼음 코어','ice cores','science'],['과학 협력','scientific cooperation','science']]),
    sources:antarcticSources,
    contentReview:{kind:'new-continent-learning',checkedDate:'2026-10-02',storyCount:5,scope:'No invented capital or permanent population; research-site coordinates from KOPRI, symbol classifications from ATS and supplied designs.'},
  },
};
export const polarPostcards = {
  GL:{image:'/assets/postcards/gl.webp',fullImage:'/assets/postcards/gl.webp',previewImage:'/assets/postcards/preview/gl.webp',landmark:'Ilulissat Icefjord',landmarkKo:'일룰리사트 아이스피오르',imageFit:'contain'},
  AQ:{image:'/assets/postcards/aq.webp',fullImage:'/assets/postcards/aq.webp',previewImage:'/assets/postcards/preview/aq.webp',landmark:'Antarctic Peninsula icebergs and gentoo penguins',landmarkKo:'남극반도의 빙산과 젠투펭귄',imageFit:'contain'},
};
export const antarcticSymbols = [
  {image:'/assets/polar-flags/aq-proposal-user.png',label:{ko:'비공식 남극 상징 디자인',en:'Unofficial Antarctic symbol design'}},
  {image:'/assets/polar-flags/aq-treaty-user.png',label:{ko:'남극조약 표장 · 국기가 아니에요',en:'Antarctic Treaty emblem · Not a national flag'}},
];
const question=(id,ko,en,choices,hint)=>({id,prompt:{ko,en},options:choices.map(([key,nameKo,name,correct=false])=>({id:`aq-${id}-${key}`,nameKo,name,correct,hint}))});
export const antarcticQuestions = [
  question('capital','남극의 수도에 대한 설명으로 맞는 것은 무엇일까요?','Which statement about Antarctica’s capital is correct?',[
    ['none','대륙이므로 수도가 없어요','It is a continent with no capital',true],['nuuk','수도는 누크예요','Its capital is Nuuk'],['sejong','세종과학기지가 수도예요','King Sejong Station is its capital'],
  ],{ko:'남극은 대륙으로 수도가 없어요. 누크는 그린란드의 수도이고, 세종과학기지는 연구기지예요.',en:'Antarctica has no capital. Nuuk is Greenland’s capital; King Sejong Station is a research station.'}),
  question('penguin','남극반도의 엽서에서 만날 수 있는 동물은 무엇일까요?','Which animal appears in our Antarctic Peninsula postcard?',[
    ['gentoo','젠투펭귄','Gentoo penguin',true],['bear','북극곰','Polar bear'],['camel','낙타','Camel'],
  ],{ko:'젠투펭귄은 남극반도 일대에 살아요. 북극곰은 북극 지역의 동물이에요.',en:'Gentoo penguins live around the Antarctic Peninsula. Polar bears live in the Arctic.'}),
  question('core','남극 얼음 코어 속 옛 공기는 무엇을 알려 줄까요?','What can ancient air trapped in Antarctic ice cores reveal?',[
    ['air','과거의 대기','The atmosphere in the past',true],['capital','남극 수도의 이름','The name of an Antarctic capital'],['colour','모든 나라의 국기 색','Every country’s flag colours'],
  ],{ko:'얼음 속에 갇힌 옛 공기로 과거 대기의 성분을 연구해요.',en:'Ancient trapped air helps scientists study the composition of the atmosphere in the past.'}),
  question('station','세종과학기지는 어떤 곳일까요?','What is King Sejong Station?',[
    ['research','남극의 연구기지','An Antarctic research station',true],['capital','남극의 수도','Antarctica’s capital'],['palace','그린란드의 왕궁','A Greenlandic royal palace'],
  ],{ko:'세종과학기지는 남극 킹조지섬에 있는 대한민국의 연구기지예요.',en:'King Sejong Station is Korea’s research station on King George Island in Antarctica.'}),
  question('treaty','남극조약이 중요하게 여기는 것은 무엇일까요?','What does the Antarctic Treaty support?',[
    ['peace','평화적인 이용과 과학 협력','Peaceful use and scientific cooperation',true],['war','서로 싸우는 군사 훈련','Military exercises against one another'],['capital','하나의 새 수도 만들기','Creating one new capital'],
  ],{ko:'남극조약은 평화적인 이용과 과학 연구의 협력을 약속해요.',en:'The Antarctic Treaty provides for peaceful use and cooperation in scientific research.'}),
];
