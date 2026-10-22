// Curated additions for the 17 priority countries that previously had basic
// geography-only cards. Sources support the new learning content; capital
// coordinates remain separately maintained in basic-country-data.json.
const card = (facts, keywords, sources) => ({
  facts: facts.map(([ko,en])=>({ko,en})),
  keywords: keywords.map(([ko,en,type])=>({ko,en,type,artwork:false})),
  sources,
  contentReviewedOn:'2026-10-01',
});

export const priorityLearningData = {
  MN:card([
    ['몽골의 수도는 울란바토르예요. 오르혼 계곡에는 유목 생활과 오랜 도시·사원의 역사가 함께 남아 있어요.','Ulaanbaatar is Mongolia’s capital. The Orkhon Valley preserves the history of herding communities, old cities and monasteries.'],
    ['나담 축제에서는 말타기 경주, 씨름, 활쏘기 같은 전통 경기를 즐겨요.','Naadam is a Mongolian festival celebrating traditional horse racing, wrestling and archery.'],
    ['모린후르는 머리 부분에 말 모양 장식이 있는 두 줄의 현악기예요. 활로 줄을 문질러 소리를 내요.','The morin khuur is a two-stringed instrument decorated with a horse’s head. A bow makes its strings sound.'],
  ],[
    ['울란바토르','Ulaanbaatar','city'],['오르혼 계곡','Orkhon Valley','place'],['에르데네주 사원','Erdene Zuu Monastery','landmark'],['초원','grasslands','nature'],['유목 생활','nomadic herding','culture'],['나담','Naadam','festival'],['말 경주','horse racing','sport'],['씨름','wrestling','sport'],['활쏘기','archery','sport'],['모린후르','morin khuur','music'],
  ],['https://whc.unesco.org/en/list/1081/','https://ich.unesco.org/en/RL/naadam-mongolian-traditional-festival-00395','https://ich.unesco.org/en/RL/traditional-music-of-the-morin-khuur-00068']),
  SG:card([
    ['싱가포르는 나라 이름과 수도 이름이 같은 도시 국가예요. 머라이언은 사자 머리와 물고기 몸을 가진 상징이에요.','Singapore is a city-state whose capital shares its name. The Merlion combines a lion’s head with a fish’s body.'],
    ['싱가포르 식물원에는 다양한 식물과 난초가 자라요. 이 식물원은 유네스코 세계유산이에요.','Singapore Botanic Gardens is a UNESCO World Heritage site where many plants and orchids grow.'],
    ['호커 센터는 여러 음식 가게가 모여 있는 곳이에요. 치킨라이스처럼 다양한 문화의 음식을 만날 수 있어요.','Hawker centres bring many food stalls together. Dishes such as chicken rice reflect Singapore’s different cultures.'],
  ],[
    ['싱가포르','Singapore','city'],['머라이언','Merlion','landmark'],['마리나 베이','Marina Bay','place'],['싱가포르강','Singapore River','nature'],['싱가포르 식물원','Singapore Botanic Gardens','landmark'],['난초','orchids','nature'],['가든스 바이 더 베이','Gardens by the Bay','place'],['호커 센터','hawker centres','culture'],['치킨라이스','chicken rice','food'],['리틀 인디아','Little India','place'],
  ],['https://www.visitsingapore.com/see-do-singapore/recreation-leisure/viewpoints/merlion-park/','https://www.visitsingapore.com/things-to-do/top-things-to-do/city-in-nature/','https://www.visitsingapore.com/content/visitsingapore/en/travel-tips/travelling-to-singapore/itineraries/singapore-city-tour-guide/']),
  AE:card([
    ['아랍에미리트는 일곱 토후국이 함께 이루는 나라예요. 수도는 아부다비이고, 두바이는 다른 토후국의 도시예요.','The United Arab Emirates is a federation of seven emirates. Abu Dhabi is the capital; Dubai is a city in another emirate.'],
    ['아부다비에는 셰이크 자이드 대모스크가 있고, 두바이에는 높은 부르즈 할리파가 있어요.','Abu Dhabi has the Sheikh Zayed Grand Mosque, while Dubai is home to the tall Burj Khalifa.'],
    ['아랍에미리트에는 사막과 바다에 닿는 해안이 함께 있어요. 알아인에서는 오아시스와 오래된 문화 유적을 볼 수 있어요.','The UAE has both deserts and a coast. Al Ain has oases and historic cultural sites.'],
  ],[
    ['아부다비','Abu Dhabi','city'],['두바이','Dubai','city'],['일곱 토후국','seven emirates','geography'],['셰이크 자이드 대모스크','Sheikh Zayed Grand Mosque','landmark'],['부르즈 할리파','Burj Khalifa','landmark'],['알아인 오아시스','Al Ain Oasis','place'],['아라비아반도','Arabian Peninsula','place'],['사막','desert','nature'],['해안','coast','nature'],['아랍어','Arabic','language'],
  ],['https://u.ae/en/about-the-uae/fact-sheet','https://u.ae/en/about-the-uae/the-seven-emirates','https://whc.unesco.org/en/statesparties/ae/']),
  UZ:card([
    ['우즈베키스탄의 수도는 타슈켄트예요. 사마르칸트와 부하라는 실크로드를 따라 여러 문화가 만났던 도시예요.','Tashkent is Uzbekistan’s capital. Samarkand and Bukhara were meeting places for cultures along the Silk Roads.'],
    ['사마르칸트에는 오래된 모스크와 큰 광장이 있어요. 건물의 푸른 타일 장식을 살펴볼 수 있어요.','Samarkand has historic mosques and great squares, with blue tilework decorating its buildings.'],
    ['팔로브는 쌀을 중심으로 만든 음식이에요. 손님과 이웃이 함께 나누어 먹는 전통도 이어지고 있어요.','Palov is a rice-based dish. Sharing it with guests and neighbours is an important living tradition.'],
  ],[
    ['타슈켄트','Tashkent','city'],['사마르칸트','Samarkand','city'],['부하라','Bukhara','city'],['이찬칼라','Itchan Kala','place'],['실크로드','Silk Roads','history'],['레기스탄 광장','Registan Square','landmark'],['푸른 타일','blue tilework','art'],['팔로브','palov','food'],['오아시스','oasis','nature'],['우즈베크어','Uzbek','language'],
  ],['https://whc.unesco.org/en/list/603/','https://whc.unesco.org/en/statesparties/uz/','https://ich.unesco.org/en/RL/palov-culture-and-tradition-01166']),
  NL:card([
    ['네덜란드의 수도는 암스테르담이에요. 정부와 의회가 있는 도시는 헤이그예요.','Amsterdam is the capital of the Netherlands. The government and parliament are based in The Hague.'],
    ['킨더데이크의 풍차와 수로는 낮은 땅에서 물을 빼내는 데 쓰였어요. 풍차는 물을 관리하는 기술의 일부예요.','Kinderdijk’s windmills and channels helped drain low-lying land. The windmills are part of a water-management system.'],
    ['암스테르담에는 고리처럼 이어지는 운하가 있어요. 운하 옆으로 오래된 집들과 거리가 이어져요.','Amsterdam has a ring of canals lined with historic houses and streets.'],
  ],[
    ['암스테르담','Amsterdam','city'],['헤이그','The Hague','city'],['킨더데이크','Kinderdijk','landmark'],['풍차','windmills','landmark'],['운하','canals','geography'],['제방','dykes','geography'],['간척지','polders','geography'],['물 관리','water management','science'],['자전거','bicycles','transport'],['네덜란드어','Dutch','language'],
  ],['https://whc.unesco.org/en/list/818/','https://whc.unesco.org/en/list/1349/','https://www.holland.com/de/tourist/lass-dich-inspirieren']),
  DK:card([
    ['덴마크의 수도는 코펜하겐이에요. 뉘하운 항구에는 여러 색의 집들과 배가 나란히 있어요.','Copenhagen is Denmark’s capital. Nyhavn harbour is lined with colourful houses and boats.'],
    ['안데르센은 덴마크의 동화 작가예요. 코펜하겐의 인어공주 동상은 그의 동화에서 영감을 받았어요.','Hans Christian Andersen was a Danish storyteller. Copenhagen’s Little Mermaid statue was inspired by his fairy tale.'],
    ['코펜하겐에서는 자전거로 학교나 일터에 가는 사람들이 많아요. 도시에는 자전거를 위한 길이 잘 이어져 있어요.','Many people in Copenhagen cycle to school or work, using the city’s connected cycling routes.'],
  ],[
    ['코펜하겐','Copenhagen','city'],['뉘하운','Nyhavn','landmark'],['인어공주 동상','Little Mermaid statue','landmark'],['안데르센','Hans Christian Andersen','culture'],['동화','fairy tales','culture'],['자전거','bicycles','transport'],['항구','harbour','geography'],['운하','canal','geography'],['배','boats','transport'],['덴마크어','Danish','language'],
  ],['https://www.visitdenmark.com/denmark/plan-your-trip/nyhavn-harbour-gdk426287','https://www.visitdenmark.com/denmark/plan-your-trip/the-little-mermaid-gdk586951','https://www.visitcopenhagen.com/']),
  CH:card([
    ['베른은 스위스 정부가 있는 연방도시예요. 보통 수도처럼 소개하지만, 공식 명칭인 연방도시도 함께 알아두어요.','Bern is Switzerland’s federal city and seat of government. It is commonly described as the capital, while its official title is federal city.'],
    ['스위스에는 알프스산맥, 쥐라산맥, 그 사이의 고원 지대가 있어요. 산악 철도로 높은 곳까지 오를 수도 있어요.','Switzerland has the Alps, the Jura Mountains and a plateau between them. Mountain railways reach high into the Alps.'],
    ['스위스의 국가 언어는 독일어·프랑스어·이탈리아어·로만슈어 네 가지예요. 지역마다 사용하는 언어가 달라요.','Switzerland has four national languages: German, French, Italian and Romansh. Language use varies by region.'],
  ],[
    ['베른','Bern','city'],['연방도시','federal city','geography'],['알프스산맥','Alps','nature'],['쥐라산맥','Jura Mountains','nature'],['스위스 고원','Swiss Plateau','nature'],['산악 철도','mountain railways','transport'],['독일어','German','language'],['프랑스어','French','language'],['이탈리아어','Italian','language'],['로만슈어','Romansh','language'],
  ],['https://www.aboutswitzerland.eda.admin.ch/en/political-system','https://www.aboutswitzerland.eda.admin.ch/en/geography','https://www.aboutswitzerland.eda.admin.ch/en/languages-and-dialects']),
  CZ:card([
    ['체코의 수도는 프라하예요. 블타바강이 도시를 지나고, 강 양쪽에 오래된 건물이 자리해요.','Prague is Czechia’s capital. The Vltava River flows through the city, with historic buildings on both banks.'],
    ['카를교는 블타바강을 건너는 오래된 돌다리예요. 다리에서 프라하성과 도시의 탑들을 바라볼 수 있어요.','Charles Bridge is a historic stone bridge across the Vltava. It offers views of Prague Castle and the city’s towers.'],
    ['프라하 역사 지구에는 고딕·르네상스·바로크 시대의 건물이 함께 남아 있어요. 이곳은 유네스코 세계유산이에요.','Prague’s UNESCO-listed historic centre preserves Gothic, Renaissance and Baroque buildings together.'],
  ],[
    ['프라하','Prague','city'],['카를교','Charles Bridge','landmark'],['블타바강','Vltava River','nature'],['프라하성','Prague Castle','landmark'],['성 비투스 대성당','St Vitus Cathedral','landmark'],['구시가지','Old Town','place'],['고딕 건축','Gothic architecture','art'],['르네상스','Renaissance','history'],['바로크','Baroque','art'],['체코어','Czech','language'],
  ],['https://whc.unesco.org/en/list/616/','https://prague.eu/en/objevujte/charles-bridge-karluv-most/']),
  DO:card([
    ['도미니카공화국의 수도는 산토도밍고예요. 오사마강 하구에 오래된 도시 중심지가 자리해요.','Santo Domingo is the Dominican Republic’s capital. Its historic centre stands near the mouth of the Ozama River.'],
    ['도미니카공화국은 카리브해의 이스파니올라섬을 아이티와 나누고 있어요. 도미니카 연방과는 다른 나라예요.','The Dominican Republic shares the Caribbean island of Hispaniola with Haiti. It is a different country from Dominica.'],
    ['메렝게는 도미니카공화국의 음악과 춤이에요. 축제와 모임에서 함께 즐기며 전통을 이어가요.','Merengue is music and dance from the Dominican Republic, shared at festivals and gatherings.'],
  ],[
    ['산토도밍고','Santo Domingo','city'],['산토도밍고 역사 지구','historic Santo Domingo','landmark'],['이스파니올라섬','Hispaniola','place'],['오사마강','Ozama River','nature'],['카리브해','Caribbean Sea','nature'],['메렝게','merengue','music'],['춤','dance','culture'],['축제','festivals','culture'],['아이티','Haiti','geography'],['스페인어','Spanish','language'],
  ],['https://whc.unesco.org/en/list/526/','https://ich.unesco.org/en/RL/music-and-dance-of-the-merengue-in-the-dominican-republic-01162','https://github.com/mledoze/countries']),
  CR:card([
    ['코스타리카의 수도는 산호세예요. 코스타리카는 중앙아메리카에 있으며 북아메리카에 속해요.','San José is Costa Rica’s capital. Costa Rica is in Central America, which is part of North America.'],
    ['열대 숲과 국립공원에는 나무늘보·원숭이·여러 새처럼 다양한 동물이 살아요. 자연을 지키는 보호 구역도 있어요.','Costa Rica’s tropical forests and national parks shelter sloths, monkeys and many birds. Protected areas help conserve this wildlife.'],
    ['디키스 지역에는 옛사람들이 돌을 깎아 만든 커다란 구체가 있어요. 돌 구체가 있는 유적은 세계유산으로 보호해요.','The Diquís region has large stone spheres made by earlier communities. Archaeological sites with these spheres are protected as World Heritage.'],
  ],[
    ['산호세','San José','city'],['중앙아메리카','Central America','geography'],['열대 숲','tropical forest','nature'],['나무늘보','sloth','animal'],['원숭이','monkey','animal'],['국립공원','national parks','place'],['태평양','Pacific Ocean','nature'],['카리브해','Caribbean Sea','nature'],['디키스','Diquís','place'],['돌 구체','stone spheres','landmark'],
  ],['https://www.visitcostarica.com/where-to-go/central-pacific','https://whc.unesco.org/en/list/1453/','https://github.com/mledoze/countries']),
  CU:card([
    ['쿠바의 수도는 아바나예요. 올드 아바나에는 오래된 광장과 요새, 여러 시대의 건물이 남아 있어요.','Havana is Cuba’s capital. Old Havana preserves historic squares, fortifications and buildings from different periods.'],
    ['비냘레스 계곡에는 모고테라고 부르는 둥근 석회암 봉우리들이 솟아 있어요. 산 사이에는 농촌 마을과 들판이 있어요.','Viñales Valley has rounded limestone hills called mogotes, with farming villages and fields between them.'],
    ['쿠바는 카리브해 지역의 섬나라예요. 아바나 구시가지와 비냘레스 계곡은 유네스코 세계유산이에요.','Cuba is an island country in the Caribbean. Old Havana and Viñales Valley are UNESCO World Heritage sites.'],
  ],[
    ['아바나','Havana','city'],['올드 아바나','Old Havana','landmark'],['비냘레스 계곡','Viñales Valley','place'],['모고테','mogotes','nature'],['석회암','limestone','science'],['카리브해','Caribbean Sea','nature'],['섬나라','island country','geography'],['요새','fortifications','landmark'],['광장','squares','place'],['스페인어','Spanish','language'],
  ],['https://whc.unesco.org/en/list/204/','https://whc.unesco.org/en/list/840/']),
  VE:card([
    ['베네수엘라의 수도는 카라카스예요. 남아메리카 북쪽에 있으며 카리브해와 만나는 해안이 있어요.','Caracas is Venezuela’s capital. Venezuela lies in northern South America and has a Caribbean coast.'],
    ['카나이마 국립공원에는 앙헬폭포가 있어요. 높은 절벽 위에서 물이 길게 떨어지는 폭포예요.','Angel Falls is in Canaima National Park, where water drops a long distance from a high cliff.'],
    ['카나이마에는 꼭대기가 평평한 테푸이 산들이 있어요. 특별한 지형과 다양한 생물을 세계유산으로 보호해요.','Canaima has flat-topped mountains called tepuis. Its distinctive landforms and wildlife are protected as World Heritage.'],
  ],[
    ['카라카스','Caracas','city'],['카나이마 국립공원','Canaima National Park','place'],['앙헬폭포','Angel Falls','landmark'],['테푸이','tepuis','nature'],['아우얀테푸이','Auyán-tepui','nature'],['고원','highlands','nature'],['폭포','waterfalls','nature'],['절벽','cliffs','nature'],['카리브해','Caribbean Sea','nature'],['스페인어','Spanish','language'],
  ],['https://whc.unesco.org/en/list/701/','https://whc.unesco.org/document/218578','https://github.com/mledoze/countries']),
  BO:card([
    ['볼리비아의 헌법상 수도는 수크레예요. 정부와 의회는 라파스에 있어서 두 도시의 역할을 나누어 알아두어요.','Sucre is Bolivia’s constitutional capital. The government and parliament are in La Paz, so the two cities have different roles.'],
    ['수크레 역사 지구에는 흰 벽의 건물과 오래된 광장·교회가 남아 있어요. 이곳은 유네스코 세계유산이에요.','Sucre’s UNESCO-listed historic centre preserves white-walled buildings, squares and churches.'],
    ['티와나쿠 유적은 안데스 지역에서 번성했던 옛 문명의 흔적이에요. 돌로 만든 건축물과 조각을 볼 수 있어요.','Tiwanaku preserves an ancient Andean civilisation, with stone buildings and carvings.'],
  ],[
    ['수크레','Sucre','city'],['라파스','La Paz','city'],['헌법상 수도','constitutional capital','geography'],['수크레 역사 지구','historic Sucre','landmark'],['티와나쿠','Tiwanaku','landmark'],['안데스산맥','Andes','nature'],['티티카카호','Lake Titicaca','nature'],['돌 건축물','stone architecture','art'],['석조 조각','stone carvings','art'],['고대 문명','ancient civilisation','history'],
  ],['https://whc.unesco.org/en/list/566/','https://whc.unesco.org/en/list/567/','https://github.com/mledoze/countries']),
  UY:card([
    ['우루과이의 수도는 몬테비데오예요. 도시는 넓은 강 하구인 라플라타강을 따라 자리해요.','Montevideo is Uruguay’s capital. The city stands beside the wide Río de la Plata estuary.'],
    ['몬테비데오의 람블라는 물가를 따라 이어지는 길이에요. 산책하거나 자전거를 타며 도시의 해안 풍경을 볼 수 있어요.','Montevideo’s Rambla follows the waterfront, offering places to walk, cycle and see the coast.'],
    ['칸돔베는 아프리카계 공동체의 역사와 이어진 북 음악과 춤이에요. 몬테비데오 여러 동네에서 전통을 이어가요.','Candombe is drum music and dance rooted in communities of African descent. Several Montevideo neighbourhoods keep the tradition alive.'],
  ],[
    ['몬테비데오','Montevideo','city'],['라플라타강','Río de la Plata','nature'],['람블라','Rambla','landmark'],['칸돔베','candombe','music'],['북','drums','music'],['수르 지구','Sur district','place'],['팔레르모 지구','Palermo district','place'],['코르돈 지구','Cordón district','place'],['강 하구','estuary','geography'],['스페인어','Spanish','language'],
  ],['https://montevideo.gub.uy/areas-tematicas/amiga-del-futbol/descubri-montevideo','https://www.montevideo.gub.uy/areas-tematicas/cultura-y-tiempo-libre/parques/rambla','https://ich.unesco.org/en/RL/candombe-and-its-socio-cultural-space-a-community-practice-00182']),
  GH:card([
    ['가나의 수도는 아크라예요. 아크라는 대서양과 만나는 해안에 있는 도시예요.','Accra is Ghana’s capital, on the country’s Atlantic coast.'],
    ['켄테는 좁고 긴 천 조각을 짜서 이어 만드는 직물이에요. 색과 무늬에는 공동체의 이야기와 뜻이 담겨 있어요.','Kente is made by joining narrow woven strips. Its colours and patterns carry meanings and community stories.'],
    ['해안의 성과 요새에는 무역과 노예무역의 아픈 역사가 남아 있어요. 그 역사를 기억하며 사람의 권리도 배워요.','Coastal forts and castles preserve the history of trade and the suffering caused by the slave trade. Remembering it helps us learn about human rights.'],
  ],[
    ['아크라','Accra','city'],['켄테','kente','art'],['직조','weaving','art'],['천 조각','woven strips','art'],['베틀','loom','art'],['면','cotton','nature'],['대서양','Atlantic Ocean','nature'],['엘미나성','Elmina Castle','landmark'],['케이프코스트성','Cape Coast Castle','landmark'],['제임스타운','Jamestown','place'],
  ],['https://ich.unesco.org/en/RL/craftsmanship-of-traditional-woven-textile-kente-02130','https://whc.unesco.org/en/list/34/']),
  BW:card([
    ['보츠와나의 수도는 가보로네예요. 바다와 직접 닿지 않는 남부 아프리카의 내륙 나라예요.','Gaborone is Botswana’s capital. Botswana is a landlocked country in southern Africa.'],
    ['오카방고 삼각주는 강물이 바다까지 가지 않고 내륙에 펼쳐지는 습지예요. 건기에도 물이 들어와 많은 동물이 모여요.','The Okavango Delta is an inland wetland whose waters do not reach the sea. Floods arrive during the dry season and support many animals.'],
    ['초딜로 언덕에는 오래된 바위 그림이 남아 있어요. 그림과 유적은 이 지역 사람들의 오랜 역사를 보여줘요.','The Tsodilo Hills preserve ancient rock paintings and archaeological sites that tell the region’s long human history.'],
  ],[
    ['가보로네','Gaborone','city'],['오카방고 삼각주','Okavango Delta','landmark'],['오카방고강','Okavango River','nature'],['습지','wetlands','nature'],['내륙 삼각주','inland delta','geography'],['초딜로','Tsodilo','landmark'],['바위 그림','rock paintings','art'],['칼라하리','Kalahari','place'],['코끼리','elephants','animal'],['사자','lions','animal'],
  ],['https://whc.unesco.org/en/list/1432/','https://whc.unesco.org/en/list/1021/','https://github.com/mledoze/countries']),
  ET:card([
    ['에티오피아의 수도는 아디스아바바예요. 에티오피아에는 높은 고원과 오래된 문화 유적이 있어요.','Addis Ababa is Ethiopia’s capital. Ethiopia has highlands and historic cultural sites.'],
    ['랄리벨라의 교회들은 큰 바위를 깎아 만들었어요. 건물과 통로를 바위 속에서 파낸 독특한 유적이에요.','Lalibela’s churches were carved from solid rock, with buildings and passageways cut into the stone.'],
    ['야유 생물권보전지역에는 야생 아라비카 커피가 자라는 산지 숲이 있어요. 커피와 여러 생물의 터전을 함께 지켜요.','Yayu Biosphere Reserve protects mountain rainforest with wild Arabica coffee and many other living things.'],
  ],[
    ['아디스아바바','Addis Ababa','city'],['랄리벨라','Lalibela','landmark'],['암굴 교회','rock-hewn churches','landmark'],['바위 조각','rock carving','art'],['야유','Yayu','place'],['커피 숲','coffee forest','nature'],['아라비카 커피','Arabica coffee','nature'],['에티오피아 고원','Ethiopian Highlands','nature'],['생물 다양성','biodiversity','science'],['암하라어','Amharic','language'],
  ],['https://whc.unesco.org/en/list/18/','https://www.unesco.org/en/mab/yayu?hub=66369','https://github.com/mledoze/countries']),
};
