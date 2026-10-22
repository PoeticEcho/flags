import basicCountryData from './basic-country-data.json' with {type:'json'};
import countryLearningEnrichment from './country-learning-enrichment.json' with {type:'json'};
import {priorityLearningData} from './priority-learning-data.js';
import {postcardSceneData} from './postcard-scene-data.js';
import {populationData} from './population.js';
import {polarLearningData} from './polar-data.js';
// Detailed bilingual cards for the first forty countries, grouped into four
// ten-country batches. Population is a rounded mid-year estimate; preserve its
// year and source when refreshing it. The optional fourth tag value marks a
// keyword that is visibly represented in that country's postcard illustration.
const tags = (items) => items.map(([ko, en, type, artwork = false]) => ({ ko, en, type, artwork }));

export const firstBatch = {
  KR: {
    population2025: 51_700_000,
    facts: [
      { ko: "대한민국은 동아시아 한반도의 남쪽에 있고, 수도는 서울이에요.", en: "South Korea is in East Asia, on the southern part of the Korean Peninsula. Seoul is its capital." },
      { ko: "한글은 세종대왕과 학자들이 만들고 1446년에 널리 알렸어요.", en: "Hangul was developed under King Sejong and introduced in 1446." },
      { ko: "서울에서는 북촌 한옥마을의 기와지붕과 N서울타워를 함께 볼 수 있어요.", en: "In Seoul, you can see the tiled roofs of Bukchon Hanok Village and N Seoul Tower together." },
    ],
    keywords: tags([["서울", "Seoul", "city"], ["N서울타워", "N Seoul Tower", "landmark"], ["북촌 한옥마을", "Bukchon Hanok Village", "landmark"], ["제주도", "Jeju Island", "nature"], ["한라산", "Hallasan", "nature"], ["김치", "kimchi", "food"], ["비빔밥", "bibimbap", "food"], ["한글", "Hangul", "language"], ["한복", "hanbok", "culture"], ["태권도", "taekwondo", "sport"]]),
  },
  JP: {
    population2025: 123_100_000,
    facts: [
      { ko: "일본은 동아시아의 섬나라이고 수도는 도쿄예요.", en: "Japan is an island country in East Asia, and Tokyo is its capital." },
      { ko: "후지산은 일본에서 가장 높은 산이에요.", en: "Mount Fuji is Japan’s tallest mountain." },
      { ko: "일본에는 빠른 신칸센 열차와 여러 섬이 있어요.", en: "Japan has many islands and a network of fast Shinkansen trains." },
    ],
    keywords: tags([["도쿄", "Tokyo", "city"], ["후지산", "Mount Fuji", "landmark"], ["오중탑", "five-story pagoda", "landmark"], ["벚꽃", "cherry blossom", "nature"], ["홋카이도", "Hokkaido", "place"], ["초밥", "sushi", "food"], ["라멘", "ramen", "food"], ["일본어", "Japanese", "language"], ["신칸센", "Shinkansen", "transport"], ["종이접기", "origami", "culture"]]),
  },
  CN: {
    population2025: 1_416_100_000,
    facts: [
      { ko: "중국의 수도는 베이징이에요. 중국은 여러 기후와 풍경을 가진 아주 큰 나라예요.", en: "Beijing is China’s capital. China is a very large country with many kinds of landscapes and climates." },
      { ko: "만리장성은 산등성이를 따라 길게 이어지는 오래된 성벽이에요.", en: "The Great Wall is a long system of old walls and watchtowers that crosses mountain ridges." },
      { ko: "판다는 중국의 산 대나무 숲에 사는 동물이에요.", en: "Giant pandas live in mountain bamboo forests in China." },
    ],
    keywords: tags([["베이징", "Beijing", "city"], ["만리장성", "Great Wall", "landmark"], ["판다", "giant panda", "animal"], ["양쯔강", "Yangtze River", "nature"], ["황허", "Yellow River", "nature"], ["만두", "dumplings", "food"], ["북경오리", "Peking duck", "food"], ["중국어", "Mandarin Chinese", "language"], ["춘절", "Spring Festival", "culture"], ["종이 자르기", "paper cutting", "art"]]),
  },
  IN: {
    population2025: 1_463_900_000,
    facts: [
      { ko: "인도는 남아시아에 있고 수도는 뉴델리예요.", en: "India is in South Asia, and New Delhi is its capital." },
      { ko: "북쪽에는 히말라야산맥이 있고, 남쪽으로 가면 인도양과 만나요.", en: "The Himalayas rise in the north, and the Indian Ocean borders India to the south." },
      { ko: "타지마할은 아그라에 있는 대리석 기념 건축물이에요.", en: "The Taj Mahal is a marble monument in the city of Agra." },
    ],
    keywords: tags([["뉴델리", "New Delhi", "city"], ["타지마할", "Taj Mahal", "landmark"], ["히말라야", "Himalayas", "nature"], ["갠지스강", "Ganges River", "nature"], ["벵골호랑이", "Bengal tiger", "animal"], ["망고", "mango", "food"], ["사모사", "samosa", "food"], ["힌디어", "Hindi", "language"], ["디왈리", "Diwali", "festival"], ["요가", "yoga", "culture"]]),
  },
  FR: {
    population2025: 66_700_000,
    facts: [
      { ko: "프랑스의 수도는 파리이고, 에펠탑은 1889년 파리 만국박람회를 위해 세워졌어요.", en: "Paris is France’s capital. The Eiffel Tower was built for the 1889 World’s Fair." },
      { ko: "프랑스에는 높은 알프스산맥과 대서양, 지중해 해안이 있어요.", en: "France has the high Alps as well as Atlantic and Mediterranean coasts." },
      { ko: "루브르 박물관에는 세계적으로 유명한 예술 작품들이 전시되어 있어요.", en: "The Louvre in Paris is home to many well-known works of art." },
    ],
    keywords: tags([["파리", "Paris", "city"], ["에펠탑", "Eiffel Tower", "landmark"], ["루브르", "Louvre", "landmark"], ["센강", "Seine River", "nature"], ["알프스", "Alps", "nature"], ["바게트", "baguette", "food"], ["크루아상", "croissant", "food"], ["프랑스어", "French", "language"], ["라벤더", "lavender", "nature"], ["치즈", "cheese", "food"]]),
  },
  IT: {
    population2025: 59_200_000,
    facts: [
      { ko: "이탈리아의 수도는 로마예요. 로마에는 아주 오래된 건축물이 많이 남아 있어요.", en: "Rome is Italy’s capital, with many buildings from ancient times." },
      { ko: "콜로세움은 고대 로마 시대에 사람들이 모여 행사를 보던 큰 경기장이에요.", en: "The Colosseum is a huge arena built in ancient Rome for public events." },
      { ko: "이탈리아는 지중해로 뻗은 장화 모양의 반도와 여러 섬으로 이루어져 있어요.", en: "Italy has a boot-shaped peninsula reaching into the Mediterranean Sea, plus many islands." },
    ],
    keywords: tags([["로마", "Rome", "city"], ["콜로세움", "Colosseum", "landmark"], ["피사의 사탑", "Leaning Tower of Pisa", "landmark"], ["베네치아", "Venice", "place"], ["지중해", "Mediterranean Sea", "nature"], ["피자", "pizza", "food"], ["파스타", "pasta", "food"], ["젤라토", "gelato", "food"], ["이탈리아어", "Italian", "language"], ["알프스", "Alps", "nature"]]),
  },
  GB: {
    population2025: 69_600_000,
    facts: [
      { ko: "영국의 수도는 런던이에요. 런던의 엘리자베스 타워 안에 있는 종을 빅벤이라고 불러요.", en: "London is the UK’s capital. Big Ben is the bell inside the Elizabeth Tower." },
      { ko: "영국은 잉글랜드, 스코틀랜드, 웨일스, 북아일랜드로 이루어져 있어요.", en: "The United Kingdom is made up of England, Scotland, Wales and Northern Ireland." },
      { ko: "템스강이 런던을 지나고, 빨간 2층 버스도 도시의 익숙한 모습이에요.", en: "The River Thames flows through London, where red double-decker buses are a familiar sight." },
    ],
    keywords: tags([["런던", "London", "city"], ["빅벤", "Big Ben", "landmark"], ["템스강", "River Thames", "nature"], ["잉글랜드", "England", "place"], ["스코틀랜드", "Scotland", "place"], ["웨일스", "Wales", "place"], ["북아일랜드", "Northern Ireland", "place"], ["2층 버스", "double-decker bus", "transport"], ["영어", "English", "language"], ["피시 앤드 칩스", "fish and chips", "food"]]),
  },
  US: {
    population2025: 347_300_000,
    facts: [
      { ko: "미국의 수도는 워싱턴 D.C.이고, 미국은 50개 주로 이루어져 있어요.", en: "Washington, D.C. is the U.S. capital, and the country has 50 states." },
      { ko: "큰바위얼굴은 사우스다코타주의 산에 조각된 네 명의 대통령 얼굴이에요.", en: "Mount Rushmore is a mountain carving of four U.S. presidents in South Dakota." },
      { ko: "미국에는 그랜드캐니언, 미시시피강, 하와이섬처럼 다양한 자연 풍경이 있어요.", en: "The U.S. has many landscapes, from the Grand Canyon and Mississippi River to the islands of Hawaii." },
    ],
    keywords: tags([["워싱턴 D.C.", "Washington, D.C.", "city"], ["큰바위얼굴", "Mount Rushmore", "landmark"], ["그랜드캐니언", "Grand Canyon", "landmark"], ["미시시피강", "Mississippi River", "nature"], ["알래스카", "Alaska", "place"], ["하와이", "Hawaii", "place"], ["50개 주", "50 states", "geography"], ["재즈", "jazz", "music"], ["야구", "baseball", "sport"], ["햄버거", "hamburger", "food"]]),
  },
  EG: {
    population2025: 118_400_000,
    facts: [
      { ko: "이집트의 수도는 카이로예요. 나일강은 사막을 지나 지중해로 흘러가요.", en: "Cairo is Egypt’s capital. The Nile flows through the desert toward the Mediterranean Sea." },
      { ko: "기자의 피라미드는 고대 이집트 사람들이 돌을 쌓아 만든 거대한 무덤이에요.", en: "The Pyramids of Giza are enormous stone tombs built in ancient Egypt." },
      { ko: "오늘날에도 많은 사람들이 나일강 주변의 도시와 농장에서 생활해요.", en: "Today, many people live and farm in towns along the Nile." },
    ],
    keywords: tags([["카이로", "Cairo", "city"], ["기자의 피라미드", "Pyramids of Giza", "landmark"], ["나일강", "Nile River", "nature"], ["사하라 사막", "Sahara Desert", "nature"], ["스핑크스", "Great Sphinx", "landmark"], ["상형문자", "hieroglyphs", "writing"], ["아랍어", "Arabic", "language"], ["대추야자", "dates", "food"], ["홍해", "Red Sea", "nature"], ["파라오", "pharaohs", "history"]]),
  },
  BR: {
    population2025: 212_800_000,
    facts: [
      { ko: "브라질은 남아메리카에서 가장 큰 나라이고 수도는 브라질리아예요.", en: "Brazil is the largest country in South America, and Brasília is its capital." },
      { ko: "아마존 열대우림에는 아주 많은 식물과 동물이 살고 있어요.", en: "The Amazon rainforest is home to a huge variety of plants and animals." },
      { ko: "브라질에서는 포르투갈어를 쓰고, 리우데자네이루의 해안과 산도 유명해요.", en: "Portuguese is spoken in Brazil, and Rio de Janeiro is known for its coast and mountains." },
    ],
    keywords: tags([["브라질리아", "Brasília", "city"], ["아마존", "Amazon", "nature"], ["리우데자네이루", "Rio de Janeiro", "city"], ["구세주 그리스도상", "Christ the Redeemer", "landmark"], ["대서양", "Atlantic Ocean", "nature"], ["재규어", "jaguar", "animal"], ["포르투갈어", "Portuguese", "language"], ["삼바", "samba", "music"], ["커피", "coffee", "food"], ["축구", "football", "sport"]]),
  },
};

// Batch 2 extends the same bilingual card format to countries 11–20.
export const secondBatch = {
  MX: {
    population2025: 132_000_000,
    facts: [
      { ko: "멕시코의 수도 멕시코시티는 산으로 둘러싸인 높은 분지에 있어요.", en: "Mexico City, Mexico’s capital, sits high in a valley surrounded by mountains." },
      { ko: "치첸이트사는 고대 마야 문명의 도시였고, 엘 카스티요라는 큰 석조 피라미드가 있어요.", en: "Chichén Itzá was an ancient Maya city, with a great stone pyramid called El Castillo." },
      { ko: "옥수수는 멕시코 음식에 널리 쓰이고, 여러 원주민 언어와 문화도 이어지고 있어요.", en: "Maize is used in many Mexican foods, and many Indigenous languages and cultures continue today." },
    ],
    keywords: tags([["멕시코시티", "Mexico City", "city"], ["치첸이트사", "Chichén Itzá", "landmark"], ["유카탄반도", "Yucatán Peninsula", "place"], ["구리 협곡", "Copper Canyon", "nature"], ["왕나비", "monarch butterfly", "animal"], ["옥수수", "maize", "food"], ["타코", "tacos", "food"], ["스페인어", "Spanish", "language"], ["나와틀어", "Nahuatl", "language"], ["마리아치", "mariachi", "music"]]),
  },
  ID: {
    population2025: 285_700_000,
    facts: [
      { ko: "자카르타는 인도네시아의 수도예요. 보르네오섬에는 미래 수도로 계획된 누산타라가 건설되고 있어요.", en: "Jakarta is Indonesia’s capital. Nusantara, a planned future capital, is being built on the island of Borneo." },
      { ko: "인도네시아는 인도양과 태평양 사이의 아주 많은 섬들에 걸쳐 있어요.", en: "Indonesia stretches across many islands between the Indian and Pacific Oceans." },
      { ko: "자바섬의 보로부두르에는 돌로 만든 탑과 이야기 조각이 많은 오래된 불교 사원이 있어요.", en: "Borobudur on Java is an ancient Buddhist temple with stone stupas and story carvings." },
    ],
    keywords: tags([["자카르타", "Jakarta", "city"], ["누산타라", "Nusantara", "place"], ["자바섬", "Java", "place"], ["보로부두르", "Borobudur", "landmark"], ["코모도왕도마뱀", "Komodo dragon", "animal"], ["화산", "volcanoes", "nature"], ["나시고렝", "nasi goreng", "food"], ["사테", "satay", "food"], ["인도네시아어", "Bahasa Indonesia", "language"], ["바틱", "batik", "art"]]),
  },
  DE: {
    population2025: 84_100_000,
    facts: [
      { ko: "독일의 수도는 베를린이고, 브란덴부르크문은 베를린의 대표적인 옛 문이에요.", en: "Berlin is Germany’s capital, and the Brandenburg Gate is one of its best-known historic landmarks." },
      { ko: "독일은 북쪽의 북해와 발트해부터 남쪽의 알프스산맥까지 풍경이 달라져요.", en: "Germany’s landscapes range from the North and Baltic seas to the Alps in the south." },
      { ko: "베를린 장벽은 도시를 나누었지만 1989년에 문이 열리며 많은 사람이 다시 오갈 수 있었어요.", en: "The Berlin Wall once divided the city; when it opened in 1989, people could travel between its sides again." },
    ],
    keywords: tags([["베를린", "Berlin", "city"], ["브란덴부르크문", "Brandenburg Gate", "landmark"], ["베를린 장벽", "Berlin Wall", "history"], ["라인강", "Rhine River", "nature"], ["검은숲", "Black Forest", "nature"], ["알프스", "Alps", "nature"], ["프레첼", "pretzel", "food"], ["빵", "bread", "food"], ["독일어", "German", "language"], ["축구", "football", "sport"]]),
  },
  AU: {
    population2025: 27_000_000,
    facts: [
      { ko: "호주의 수도는 캔버라예요. 시드니 오페라하우스의 지붕은 돛이나 조개껍데기를 닮았어요.", en: "Canberra is Australia’s capital. The Sydney Opera House roof looks like sails or shells." },
      { ko: "호주 북동쪽 바다에는 산호와 여러 바다 생물이 사는 거대한 산호초 지대가 있어요.", en: "A huge reef off northeast Australia is home to corals and many sea creatures." },
      { ko: "호주에는 원주민과 토레스 해협 섬 주민들의 오래되고 다양한 문화가 이어져요.", en: "Australia is home to the ancient and diverse cultures of Aboriginal and Torres Strait Islander peoples." },
    ],
    keywords: tags([["캔버라", "Canberra", "city"], ["시드니", "Sydney", "city"], ["오페라하우스", "Opera House", "landmark"], ["대보초", "Great Barrier Reef", "nature"], ["울루루", "Uluru", "landmark"], ["캥거루", "kangaroo", "animal"], ["코알라", "koala", "animal"], ["바비큐 파이", "meat pie", "food"], ["원주민 문화", "First Nations cultures", "culture"], ["크리켓", "cricket", "sport"]]),
  },
  ES: {
    population2025: 47_900_000,
    facts: [
      { ko: "스페인의 수도는 마드리드예요. 사그라다 파밀리아는 바르셀로나에 있는 안토니 가우디의 성당이에요.", en: "Madrid is Spain’s capital. The Sagrada Família is a church in Barcelona designed by Antoni Gaudí." },
      { ko: "사그라다 파밀리아 안의 기둥은 나무줄기와 가지처럼 갈라져요. 가우디는 자연의 모양을 살피며 건물의 무게를 받치는 구조를 만들었어요.", en: "Columns inside the Sagrada Família branch like tree trunks. Gaudí studied natural forms to design structures that support the building’s weight." },
      { ko: "스페인 여러 지역에서는 스페인어와 함께 카탈루냐어, 바스크어, 갈리시아어도 쓰여요.", en: "Along with Spanish, Catalan, Basque and Galician are spoken in different parts of Spain." },
    ],
    keywords: tags([["마드리드", "Madrid", "city"], ["사그라다 파밀리아", "Sagrada Família", "landmark"], ["바르셀로나", "Barcelona", "city"], ["피레네산맥", "Pyrenees", "nature"], ["지중해", "Mediterranean Sea", "nature"], ["플라멩코", "flamenco", "music"], ["파에야", "paella", "food"], ["올리브", "olives", "food"], ["카탈루냐어", "Catalan", "language"], ["갈리시아어", "Galician", "language"]]),
  },
  CA: {
    population2025: 40_100_000,
    facts: [
      { ko: "캐나다의 수도는 오타와예요. 나이아가라 폭포는 캐나다와 미국의 국경에 걸쳐 있어요.", en: "Ottawa is Canada’s capital. Niagara Falls lies on the border between Canada and the United States." },
      { ko: "캐나다는 태평양, 대서양, 북극해와 모두 맞닿아 있어요.", en: "Canada borders the Pacific, Atlantic and Arctic Oceans." },
      { ko: "캐나다에는 퍼스트 네이션스, 이누이트, 메티스 공동체와 여러 문화와 언어가 있어요.", en: "Canada is home to First Nations, Inuit and Métis communities, with many cultures and languages." },
    ],
    keywords: tags([["오타와", "Ottawa", "city"], ["나이아가라 폭포", "Niagara Falls", "landmark"], ["단풍잎", "maple leaf", "nature"], ["로키산맥", "Rocky Mountains", "nature"], ["북극해", "Arctic Ocean", "nature"], ["비버", "beaver", "animal"], ["아이스하키", "ice hockey", "sport"], ["푸틴 감자튀김", "poutine", "food"], ["프랑스어", "French", "language"], ["이누이트", "Inuit", "culture"]]),
  },
  TR: {
    population2025: 87_700_000,
    facts: [
      { ko: "튀르키예의 수도는 앙카라예요. 이스탄불은 보스포루스 해협을 사이에 두고 유럽과 아시아에 걸쳐 있어요.", en: "Ankara is Türkiye’s capital. Istanbul stretches across Europe and Asia on the Bosphorus." },
      { ko: "이스탄불의 아야 소피아는 여러 시대에 걸쳐 쓰인 오래된 건축물이에요.", en: "Istanbul’s Hagia Sophia is an old landmark that has been used in different eras." },
      { ko: "튀르키예에는 바닷가와 높은 산, 카파도키아의 독특한 바위 지형이 있어요.", en: "Türkiye has coastlines, high mountains and the unusual rock landscapes of Cappadocia." },
    ],
    keywords: tags([["앙카라", "Ankara", "city"], ["이스탄불", "Istanbul", "city"], ["아야 소피아", "Hagia Sophia", "landmark"], ["보스포루스 해협", "Bosphorus", "nature"], ["카파도키아", "Cappadocia", "place"], ["튀르키예어", "Turkish", "language"], ["시미트", "simit", "food"], ["바클라바", "baklava", "food"], ["차", "tea", "food"], ["지중해", "Mediterranean Sea", "nature"]]),
  },
  RU: {
    population2025: 144_000_000,
    facts: [
      { ko: "러시아의 수도는 모스크바예요. 러시아는 유럽과 아시아에 걸쳐 있는 넓은 나라예요.", en: "Moscow is Russia’s capital. Russia is a very large country that spans Europe and Asia." },
      { ko: "시베리아의 바이칼호는 세계에서 가장 깊은 호수이며 담수가 아주 많아요.", en: "Lake Baikal in Siberia is the world’s deepest lake and holds a great deal of fresh water." },
      { ko: "시베리아 횡단 철도는 모스크바에서 러시아 동쪽까지 아주 먼 거리를 달려요.", en: "The Trans-Siberian Railway travels a very long distance from Moscow toward eastern Russia." },
    ],
    keywords: tags([["모스크바", "Moscow", "city"], ["성 바실리 대성당", "Saint Basil’s Cathedral", "landmark"], ["붉은 광장", "Red Square", "place"], ["바이칼호", "Lake Baikal", "nature"], ["시베리아", "Siberia", "place"], ["타이가", "taiga", "nature"], ["마트료시카", "matryoshka doll", "art"], ["러시아어", "Russian", "language"], ["발레", "ballet", "art"], ["시베리아 횡단 철도", "Trans-Siberian Railway", "transport"]]),
  },
  KE: {
    population2025: 57_500_000,
    facts: [
      { ko: "케냐의 수도는 나이로비예요. 케냐에는 초원과 산, 큰 호수와 대지구대가 있어요.", en: "Nairobi is Kenya’s capital. Kenya has grasslands, mountains, large lakes and part of the Great Rift Valley." },
      { ko: "마사이 마라 초원에는 얼룩말과 누 같은 동물들이 계절에 따라 이동해요.", en: "Zebras and wildebeest move across the Maasai Mara grasslands during seasonal migrations." },
      { ko: "케냐의 공용어는 스와힐리어와 영어이고, 여러 공동체가 다양한 언어를 써요.", en: "Kiswahili and English are official languages in Kenya, and communities also speak many other languages." },
    ],
    keywords: tags([["나이로비", "Nairobi", "city"], ["마사이 마라", "Maasai Mara", "place"], ["케냐산", "Mount Kenya", "nature"], ["대지구대", "Great Rift Valley", "nature"], ["누", "wildebeest", "animal"], ["기린", "giraffe", "animal"], ["스와힐리어", "Kiswahili", "language"], ["우갈리", "ugali", "food"], ["육상", "track and field", "sport"], ["빅토리아호", "Lake Victoria", "nature"]]),
  },
  AR: {
    population2025: 45_900_000,
    facts: [
      { ko: "아르헨티나의 수도는 부에노스아이레스예요. 도심의 오벨리스크는 넓은 7월 9일 대로에 서 있어요.", en: "Buenos Aires is Argentina’s capital. Its Obelisk stands on the wide Avenida 9 de Julio." },
      { ko: "안데스산맥이 아르헨티나 서쪽을 따라 이어지고, 아콩카과산은 아메리카에서 가장 높아요.", en: "The Andes run along Argentina’s west, and Aconcagua is the highest mountain in the Americas." },
      { ko: "탱고는 부에노스아이레스 주변의 리오데라플라타 지역에서 자라난 춤과 음악이에요.", en: "Tango is a style of dance and music that grew around the Río de la Plata region, including Buenos Aires." },
    ],
    keywords: tags([["부에노스아이레스", "Buenos Aires", "city"], ["오벨리스크", "Obelisk", "landmark"], ["안데스산맥", "Andes", "nature"], ["아콩카과산", "Aconcagua", "nature"], ["파타고니아", "Patagonia", "place"], ["이구아수 폭포", "Iguazú Falls", "landmark"], ["탱고", "tango", "music"], ["마테차", "mate", "food"], ["스페인어", "Spanish", "language"], ["축구", "football", "sport"]]),
  },
};

// Batch 3 extends the same bilingual card format to countries 21–30.
export const thirdBatch = {
  TH: {
    population2025: 71_600_000,
    facts: [
      { ko: "태국의 수도 방콕에는 화려한 왕궁과 차오프라야강이 있어요.", en: "Thailand’s capital, Bangkok, is home to a grand palace and the Chao Phraya River." },
      { ko: "태국은 북쪽의 산과 숲부터 남쪽의 따뜻한 바다까지 풍경이 다양해요.", en: "Thailand’s landscapes range from northern mountains and forests to warm southern seas." },
      { ko: "송크란은 태국의 새해를 맞아 가족과 이웃이 함께 축하하는 축제예요.", en: "Songkran is a festival when families and neighbors celebrate the Thai New Year together." },
    ],
    keywords: tags([["방콕", "Bangkok", "city"], ["왕궁", "Grand Palace", "landmark"], ["차오프라야강", "Chao Phraya River", "nature"], ["치앙마이", "Chiang Mai", "city"], ["아시아코끼리", "Asian elephant", "animal"], ["팟타이", "pad thai", "food"], ["망고 찹쌀밥", "mango sticky rice", "food"], ["툭툭", "tuk-tuk", "transport"], ["태국어", "Thai", "language"], ["송크란", "Songkran", "festival"]]),
  },
  GR: {
    population2025: 9_900_000,
    facts: [
      { ko: "그리스의 수도 아테네에는 언덕 위에 파르테논 신전이 있는 아크로폴리스가 있어요.", en: "Greece’s capital, Athens, has the Acropolis, where the Parthenon stands on a hill." },
      { ko: "그리스에는 산과 바다, 크고 작은 섬들이 있어요.", en: "Greece has mountains, coastlines, and many large and small islands." },
      { ko: "고대 올림픽 경기는 그리스의 올림피아에서 열렸어요.", en: "The ancient Olympic Games were held at Olympia in Greece." },
    ],
    keywords: tags([["아테네", "Athens", "city"], ["파르테논", "Parthenon", "landmark"], ["아크로폴리스", "Acropolis", "place"], ["올림피아", "Olympia", "history"], ["에게해", "Aegean Sea", "nature"], ["올림포스산", "Mount Olympus", "nature"], ["올리브", "olives", "food"], ["페타 치즈", "feta cheese", "food"], ["그리스어", "Greek", "language"], ["그리스 섬", "Greek islands", "place"]]),
  },
  ZA: {
    population2025: 64_800_000,
    facts: [
      { ko: "남아프리카공화국은 수도 기능이 세 도시에 나뉘어요. 프리토리아는 행정, 케이프타운은 의회, 블룸폰테인은 사법 기능을 맡아요.", en: "South Africa shares capital-city roles: Pretoria is administrative, Cape Town is legislative, and Bloemfontein is judicial." },
      { ko: "케이프타운 옆에는 꼭대기가 평평한 테이블산이 솟아 있어요.", en: "Table Mountain, with its flat top, rises beside Cape Town." },
      { ko: "넬슨 만델라는 인종 차별에 맞서 민주주의를 위해 일했고, 1994년에 남아프리카공화국의 첫 흑인 대통령이 되었어요.", en: "Nelson Mandela worked for democracy against racial discrimination and became South Africa’s first Black president in 1994." },
    ],
    keywords: tags([["프리토리아", "Pretoria", "city"], ["케이프타운", "Cape Town", "city"], ["테이블산", "Table Mountain", "landmark"], ["크루거 국립공원", "Kruger National Park", "place"], ["로벤섬", "Robben Island", "history"], ["아프리카펭귄", "African penguin", "animal"], ["스프링복", "springbok", "animal"], ["넬슨 만델라", "Nelson Mandela", "history"], ["루이보스차", "rooibos tea", "food"], ["남아프리카 수어", "South African Sign Language", "language"]]),
  },
  NO: {
    population2025: 5_600_000,
    facts: [
      { ko: "노르웨이의 수도 오슬로는 숲과 피오르가 가까운 바닷가에 있어요.", en: "Norway’s capital, Oslo, sits by the sea near forests and fjords." },
      { ko: "피오르는 빙하가 땅을 깊게 깎고 바닷물이 들어와 만들어진 긴 바다 물길이에요.", en: "A fjord is a long sea inlet formed when glaciers cut deep valleys that later filled with seawater." },
      { ko: "노르웨이 북쪽에서는 밤하늘에 오로라가 춤추는 모습을 볼 수 있어요.", en: "In northern Norway, people can sometimes see the northern lights dancing across the night sky." },
    ],
    keywords: tags([["오슬로", "Oslo", "city"], ["게이랑에르 피오르", "Geirangerfjord", "landmark"], ["북극광", "northern lights", "nature"], ["스발바르", "Svalbard", "place"], ["스칸디나비아산맥", "Scandinavian Mountains", "nature"], ["사미 사람들", "Sámi people", "culture"], ["연어", "salmon", "food"], ["브라운 치즈", "brown cheese", "food"], ["노르웨이어", "Norwegian", "language"], ["순록", "reindeer", "animal"]]),
  },
  PE: {
    population2025: 34_600_000,
    facts: [
      { ko: "페루의 수도 리마는 태평양 해안에 있고, 안데스산맥과 아마존 열대우림도 페루에 걸쳐 있어요.", en: "Peru’s capital, Lima, is on the Pacific coast; the Andes and Amazon rainforest also reach across Peru." },
      { ko: "마추픽추는 잉카 사람들이 안데스산맥 높은 곳에 세운 옛 도시예요.", en: "Machu Picchu is an old city built high in the Andes by the Inca people." },
      { ko: "감자는 안데스 지역에서 오래전부터 길러졌고, 페루에는 여러 종류의 감자가 있어요.", en: "Potatoes were cultivated in the Andes long ago, and Peru grows many different kinds." },
    ],
    keywords: tags([["리마", "Lima", "city"], ["마추픽추", "Machu Picchu", "landmark"], ["안데스산맥", "Andes Mountains", "nature"], ["아마존강", "Amazon River", "nature"], ["알파카", "alpaca", "animal"], ["감자", "potato", "food"], ["세비체", "ceviche", "food"], ["케추아어", "Quechua", "language"], ["나스카 선", "Nazca Lines", "history"], ["퀴노아", "quinoa", "food"]]),
  },
  NZ: {
    population2025: 5_300_000,
    facts: [
      { ko: "뉴질랜드의 수도 웰링턴은 북섬의 남쪽 끝, 바다가 만나는 곳에 있어요.", en: "New Zealand’s capital, Wellington, sits at the southern tip of the North Island by the sea." },
      { ko: "마오리어는 뉴질랜드의 공식 언어 가운데 하나예요.", en: "Māori is one of New Zealand’s official languages." },
      { ko: "키위는 뉴질랜드에 사는 날지 못하는 새로, 밤에 주로 활동해요.", en: "The kiwi is a flightless bird native to New Zealand that is mostly active at night." },
    ],
    keywords: tags([["웰링턴", "Wellington", "city"], ["밀퍼드 사운드", "Milford Sound", "landmark"], ["남알프스산맥", "Southern Alps", "nature"], ["키위새", "kiwi", "animal"], ["마오리", "Māori", "culture"], ["마오리어", "Māori language", "language"], ["항이", "hāngī", "food"], ["은고사리", "silver fern", "nature"], ["피오르드랜드", "Fiordland", "place"], ["웰링턴 케이블카", "Wellington Cable Car", "transport"]]),
  },
  MA: {
    population2025: 38_400_000,
    facts: [
      { ko: "모로코의 수도 라바트는 대서양을 바라보는 해안 도시에요.", en: "Morocco’s capital, Rabat, is a coastal city looking out to the Atlantic Ocean." },
      { ko: "모로코에는 아틀라스산맥과 사하라 사막, 대서양과 지중해 해안이 있어요.", en: "Morocco has the Atlas Mountains, the Sahara, and coasts on the Atlantic and Mediterranean." },
      { ko: "아랍어와 아마지그어는 모로코의 공식 언어예요.", en: "Arabic and Amazigh are official languages of Morocco." },
    ],
    keywords: tags([["라바트", "Rabat", "city"], ["마라케시", "Marrakech", "city"], ["쿠투비아 모스크", "Koutoubia Mosque", "landmark"], ["아틀라스산맥", "Atlas Mountains", "nature"], ["사하라 사막", "Sahara Desert", "nature"], ["아마지그어", "Amazigh", "language"], ["아랍어", "Arabic", "language"], ["쿠스쿠스", "couscous", "food"], ["민트차", "mint tea", "food"], ["모자이크 타일", "zellij tilework", "art"]]),
  },
  SE: {
    population2025: 10_700_000,
    facts: [
      { ko: "스웨덴의 수도 스톡홀름은 여러 섬과 다리 위에 펼쳐진 도시예요.", en: "Sweden’s capital, Stockholm, spreads across many islands connected by bridges." },
      { ko: "스웨덴 북쪽에서는 여름에 해가 아주 늦게 지고, 겨울에는 오로라를 볼 수 있어요.", en: "In northern Sweden, summer nights are very bright, and the northern lights can appear in winter." },
      { ko: "스톡홀름의 바사 박물관에는 1600년대에 만들어진 커다란 배가 전시되어 있어요.", en: "Stockholm’s Vasa Museum displays a huge ship built in the 1600s." },
    ],
    keywords: tags([["스톡홀름", "Stockholm", "city"], ["감라스탄", "Gamla Stan", "place"], ["바사호", "Vasa ship", "history"], ["오로라", "northern lights", "nature"], ["숲", "forests", "nature"], ["무스", "moose", "animal"], ["계피빵", "cinnamon bun", "food"], ["미트볼", "meatballs", "food"], ["스웨덴어", "Swedish", "language"], ["달라 말", "Dala horse", "art"]]),
  },
  VN: {
    population2025: 101_600_000,
    facts: [
      { ko: "베트남의 수도 하노이는 홍강 가까이에 있고, 호찌민시는 남쪽에 있어요.", en: "Vietnam’s capital, Hanoi, is near the Red River, while Ho Chi Minh City is in the south." },
      { ko: "하롱베이에는 바다 위로 솟은 석회암 섬과 바위가 많아요.", en: "Ha Long Bay has many limestone islands and rocks rising out of the sea." },
      { ko: "뗏은 베트남의 설날 축제로 가족들이 함께 모여 새해를 맞아요.", en: "Tết is Vietnam’s Lunar New Year festival, when families gather to welcome the new year." },
    ],
    keywords: tags([["하노이", "Hanoi", "city"], ["하롱베이", "Ha Long Bay", "landmark"], ["홍강", "Red River", "nature"], ["메콩강", "Mekong River", "nature"], ["논", "rice fields", "nature"], ["쌀국수", "phở", "food"], ["반미", "bánh mì", "food"], ["베트남어", "Vietnamese", "language"], ["뗏", "Tết", "festival"], ["물인형극", "water puppetry", "art"]]),
  },
  SA: {
    population2025: 34_600_000,
    facts: [
      { ko: "사우디아라비아의 수도는 리야드예요. 사우디아라비아는 아라비아반도의 넓은 지역을 차지해요.", en: "Riyadh is Saudi Arabia’s capital. Saudi Arabia covers a large part of the Arabian Peninsula." },
      { ko: "헤그라에는 나바테아 사람들이 약 2천 년 전에 바위를 깎아 만든 무덤들이 있어요.", en: "At Hegra, the Nabataeans carved tombs into rock about 2,000 years ago." },
      { ko: "사우디아라비아는 홍해와 페르시아만에 모두 해안이 있어요.", en: "Saudi Arabia has coastlines on both the Red Sea and the Persian Gulf." },
    ],
    keywords: tags([["리야드", "Riyadh", "city"], ["헤그라", "Hegra", "landmark"], ["알울라", "AlUla", "place"], ["아라비아 사막", "Arabian Desert", "nature"], ["홍해", "Red Sea", "nature"], ["낙타", "camel", "animal"], ["대추야자", "dates", "food"], ["카부사", "kabsa", "food"], ["아랍어", "Arabic", "language"], ["나바테아 유적", "Nabataean heritage", "history"]]),
  },
};

// Batch 4 adds countries 31–40. A few picture-linked words are marked in the
// tag data so the postcard and its matching places/features are easy to connect.
export const fourthBatch = {
  BD: {
    population2025: 175_700_000,
    facts: [
      { ko: "방글라데시의 수도 다카는 부리강가강 가까이에 있어요.", en: "Bangladesh’s capital, Dhaka, is close to the Buriganga River." },
      { ko: "방글라데시는 갠지스강과 브라마푸트라강 물길이 만드는 넓은 삼각주에 자리해요.", en: "Bangladesh lies in a broad delta shaped by the Ganges and Brahmaputra river systems." },
      { ko: "순다르반스 맹그로브 숲에는 벵골호랑이를 비롯한 많은 동식물이 살아요.", en: "The Sundarbans mangrove forest is home to many plants and animals, including Bengal tigers." },
    ],
    keywords: tags([["다카", "Dhaka", "city", true], ["랄바그 요새", "Lalbagh Fort", "landmark", true], ["부리강가강", "Buriganga River", "nature"], ["순다르반스", "Sundarbans", "nature"], ["벵골호랑이", "Bengal tiger", "animal"], ["릭샤 예술", "rickshaw art", "art", true], ["벵골어", "Bangla", "language"], ["힐사 생선", "hilsa", "food"], ["잠다니 직물", "Jamdani weaving", "craft"], ["파드마 다리", "Padma Bridge", "engineering"]]),
  },
  NG: {
    population2025: 237_500_000,
    facts: [
      { ko: "나이지리아의 수도 아부자는 거대한 화강암 바위 아소 록 가까이에 있어요.", en: "Nigeria’s capital, Abuja, sits near Aso Rock, a huge granite outcrop." },
      { ko: "니제르강과 베누에강은 로코자 근처에서 만난 뒤 남쪽으로 흘러 바다에 닿아요.", en: "The Niger and Benue rivers meet near Lokoja before the Niger flows south to the sea." },
      { ko: "나이지리아에는 여러 언어와 음악, 영화가 있어요. 영어는 공식 언어예요.", en: "Nigeria is home to many languages, kinds of music and films. English is the official language." },
    ],
    keywords: tags([["아부자", "Abuja", "city", true], ["아소 록", "Aso Rock", "landmark", true], ["니제르강", "Niger River", "nature"], ["베누에강", "Benue River", "nature"], ["요루바어", "Yoruba", "language"], ["하우사어", "Hausa", "language"], ["졸로프 라이스", "jollof rice", "food"], ["놀리우드", "Nollywood", "film"], ["말하는 북", "talking drum", "music"], ["카카오", "cocoa", "food"]]),
  },
  PT: {
    population2025: 10_400_000,
    facts: [
      { ko: "포르투갈의 수도 리스본은 타구스강 어귀 가까운 언덕 위에 있어요.", en: "Portugal’s capital, Lisbon, stands on hills near the mouth of the Tagus River." },
      { ko: "벨렝탑은 1500년대 초에 리스본의 강가를 지키도록 세운 요새예요.", en: "Belém Tower was built in the early 1500s to help guard Lisbon’s riverfront." },
      { ko: "포르투갈에서는 코르크참나무 껍질로 병마개에 쓰이는 코르크를 만들어요.", en: "Portugal makes cork, used for bottle stoppers, from the bark of cork oak trees." },
    ],
    keywords: tags([["리스본", "Lisbon", "city", true], ["벨렝탑", "Belém Tower", "landmark", true], ["타구스강", "Tagus River", "nature", true], ["아줄레주 타일", "azulejo tiles", "art"], ["노란 트램", "yellow tram", "transport"], ["코르크참나무", "cork oak", "nature"], ["나타", "pastel de nata", "food"], ["대서양", "Atlantic Ocean", "nature"], ["포르투갈어", "Portuguese", "language"], ["마데이라섬", "Madeira", "place"]]),
  },
  PL: {
    population2025: 38_100_000,
    facts: [
      { ko: "폴란드의 수도 바르샤바는 비스와강 양쪽으로 펼쳐져 있어요.", en: "Poland’s capital, Warsaw, stretches along both sides of the Vistula River." },
      { ko: "바르샤바 구시가지는 제2차 세계대전 뒤 많은 건물을 다시 세워 되살렸어요.", en: "Much of Warsaw’s Old Town was rebuilt after World War II." },
      { ko: "폴란드의 비아워비에자 숲에는 유럽들소가 살아요.", en: "European bison live in Poland’s Białowieża Forest." },
    ],
    keywords: tags([["바르샤바", "Warsaw", "city", true], ["바르샤바 구시가지", "Warsaw Old Town", "landmark", true], ["왕궁", "Royal Castle", "landmark", true], ["비스와강", "Vistula River", "nature"], ["비아워비에자 숲", "Białowieża Forest", "nature"], ["유럽들소", "European bison", "animal"], ["피에로기", "pierogi", "food"], ["쇼팽", "Chopin", "music"], ["폴란드어", "Polish", "language"], ["발트해", "Baltic Sea", "nature"]]),
  },
  CL: {
    population2025: 19_900_000,
    facts: [
      { ko: "칠레의 수도 산티아고는 안데스산맥을 바라보는 넓은 계곡에 있어요.", en: "Chile’s capital, Santiago, sits in a broad valley facing the Andes Mountains." },
      { ko: "태평양의 라파누이섬에는 라파누이 사람들이 만든 모아이 석상이 서 있어요.", en: "Moai statues made by the Rapa Nui people stand on Rapa Nui Island in the Pacific." },
      { ko: "칠레는 태평양 해안을 따라 남북으로 길게 이어지는 나라예요.", en: "Chile is a long country stretching north to south along the Pacific coast." },
    ],
    keywords: tags([["산티아고", "Santiago", "city"], ["라파누이섬", "Rapa Nui", "place", true], ["모아이", "moai", "landmark", true], ["태평양", "Pacific Ocean", "nature", true], ["안데스산맥", "Andes Mountains", "nature"], ["아타카마 사막", "Atacama Desert", "nature"], ["구리", "copper", "industry"], ["엠파나다", "empanada", "food"], ["스페인어", "Spanish", "language"], ["안데스콘도르", "Andean condor", "animal"]]),
  },
  CO: {
    population2025: 53_400_000,
    facts: [
      { ko: "콜롬비아의 수도 보고타는 안데스산맥의 높은 고원에 있어요.", en: "Colombia’s capital, Bogotá, sits on a high plateau in the Andes." },
      { ko: "카르타헤나의 성벽으로 둘러싸인 구시가지는 카리브해 연안에 있어요.", en: "Cartagena’s walled Old Town lies on Colombia’s Caribbean coast." },
      { ko: "콜롬비아에서는 산에서 자라는 향기로운 커피가 많이 나요.", en: "Colombia grows much of its fragrant coffee in mountain regions." },
    ],
    keywords: tags([["보고타", "Bogotá", "city"], ["카르타헤나", "Cartagena", "city", true], ["성벽 도시", "walled city", "landmark", true], ["카리브해", "Caribbean Sea", "nature", true], ["안데스산맥", "Andes Mountains", "nature"], ["커피", "coffee", "food"], ["아레파", "arepa", "food"], ["스페인어", "Spanish", "language"], ["에메랄드", "emerald", "gem"], ["안데스콘도르", "Andean condor", "animal"]]),
  },
  FI: {
    population2025: 5_600_000,
    facts: [
      { ko: "핀란드의 수도 헬싱키에는 하얀 돔의 헬싱키 대성당이 있어요.", en: "Finland’s capital, Helsinki, is home to the white-domed Helsinki Cathedral." },
      { ko: "핀란드에는 숲과 호수가 많아 사람들이 자연에서 시간을 보내곤 해요.", en: "Finland has many forests and lakes where people spend time outdoors." },
      { ko: "핀란드어와 스웨덴어는 핀란드의 공용어예요.", en: "Finnish and Swedish are the official languages of Finland." },
    ],
    keywords: tags([["헬싱키", "Helsinki", "city", true], ["헬싱키 대성당", "Helsinki Cathedral", "landmark", true], ["원로원 광장", "Senate Square", "place", true], ["발트해", "Baltic Sea", "nature"], ["핀란드어", "Finnish", "language"], ["사우나", "sauna", "culture"], ["순록", "reindeer", "animal"], ["블루베리", "blueberries", "food"], ["호밀빵", "rye bread", "food"], ["북극광", "northern lights", "nature"]]),
  },
  PH: {
    population2025: 116_800_000,
    facts: [
      { ko: "필리핀의 수도 마닐라는 루손섬의 마닐라만을 따라 자리해요.", en: "The Philippines’ capital, Manila, sits beside Manila Bay on the island of Luzon." },
      { ko: "바나우에 계단식 논은 산비탈을 따라 이어지며 이푸가오 사람들의 오랜 농사 지식을 보여줘요.", en: "The Banaue Rice Terraces follow mountain slopes and show generations of Ifugao farming knowledge." },
      { ko: "필리핀은 태평양 서쪽에 있는 수천 개의 섬으로 이루어진 나라예요.", en: "The Philippines is a country of thousands of islands in the western Pacific." },
    ],
    keywords: tags([["마닐라", "Manila", "city"], ["바나우에 계단식 논", "Banaue Rice Terraces", "landmark", true], ["이푸가오 사람들", "Ifugao people", "culture", true], ["루손섬", "Luzon", "place", true], ["지프니", "jeepney", "transport"], ["망고", "mango", "food"], ["아도보", "adobo", "food"], ["안경원숭이", "tarsier", "animal"], ["필리핀어", "Filipino", "language"], ["태평양", "Pacific Ocean", "nature"]]),
  },
  PK: {
    population2025: 255_200_000,
    facts: [
      { ko: "파키스탄의 수도 이슬라마바드는 마르갈라 언덕 아래에 계획해 세운 도시예요.", en: "Pakistan’s capital, Islamabad, is a planned city below the Margalla Hills." },
      { ko: "파이살 모스크는 산을 배경으로 솟은 네 개의 높은 첨탑이 눈에 띄어요.", en: "Faisal Mosque is known for its four tall minarets set against the hills." },
      { ko: "인더스강은 파키스탄을 지나 아라비아해로 흘러가요.", en: "The Indus River flows through Pakistan toward the Arabian Sea." },
    ],
    keywords: tags([["이슬라마바드", "Islamabad", "city", true], ["파이살 모스크", "Faisal Mosque", "landmark", true], ["마르갈라 언덕", "Margalla Hills", "nature", true], ["인더스강", "Indus River", "nature"], ["K2", "K2", "landmark"], ["트럭 예술", "truck art", "art"], ["우르두어", "Urdu", "language"], ["망고", "mango", "food"], ["비리야니", "biryani", "food"], ["마르코르", "markhor", "animal"]]),
  },
  TZ: {
    population2025: 70_600_000,
    facts: [
      { ko: "탄자니아의 수도 도도마는 나라의 가운데쯤에 있어요.", en: "Tanzania’s capital, Dodoma, is near the center of the country." },
      { ko: "킬리만자로산은 아프리카에서 가장 높은 산이에요.", en: "Mount Kilimanjaro is the highest mountain in Africa." },
      { ko: "탄자니아 북부 세렝게티에서는 많은 동물들이 초원을 오가며 살아가요.", en: "Many animals travel across the grasslands of northern Tanzania’s Serengeti." },
    ],
    keywords: tags([["도도마", "Dodoma", "city"], ["킬리만자로산", "Mount Kilimanjaro", "landmark", true], ["세렝게티", "Serengeti", "place"], ["사바나", "savanna", "nature", true], ["바오밥나무", "baobab tree", "nature", true], ["코끼리", "elephant", "animal"], ["스와힐리어", "Swahili", "language"], ["잔지바르", "Zanzibar", "place"], ["우갈리", "ugali", "food"], ["커피", "coffee", "food"]]),
  },
};

const baseLearningData = { ...basicCountryData, ...firstBatch, ...secondBatch, ...thirdBatch, ...fourthBatch, ...priorityLearningData };
export const learningData = {
 ...baseLearningData,
 ...Object.fromEntries(Object.entries(postcardSceneData).map(([code,scene])=>[code,{...baseLearningData[code],...scene}]))
};
// Editorial enrichment changes stories and explorer words only. Capital/quiz
// identities and coordinates continue to use the reviewed baseline in data.js.
for(const [code,content] of Object.entries(countryLearningEnrichment))learningData[code]={...learningData[code],...content};
for(const [code,population] of Object.entries(populationData))learningData[code]={...learningData[code],population2025:population.value};
Object.assign(learningData,polarLearningData);

export {populationSource} from './population.js';
