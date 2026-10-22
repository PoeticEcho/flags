// Reproducible, offline authoring of the 197-country baseline learning database.
// Source snapshots are checked in; reviewed exceptions take precedence.
import fs from 'node:fs';
import countries from 'world-countries';
const root = new URL('../', import.meta.url);
const wb = JSON.parse(fs.readFileSync(new URL('sources/worldbank-countries.json',root)));
const heritage = JSON.parse(fs.readFileSync(new URL('sources/heritage-references.json',root)));
const capitalKo = Object.fromEntries(`
AF|카불
AL|티라나
DZ|알제
AD|안도라라베야
AO|루안다
AG|세인트존스
AR|부에노스아이레스
AM|예레반
AU|캔버라
AT|빈
AZ|바쿠
BS|나소
BH|마나마
BD|다카
BB|브리지타운
BY|민스크
BE|브뤼셀
BZ|벨모판
BJ|포르토노보
BT|팀푸
BO|수크레
BA|사라예보
BW|가보로네
BR|브라질리아
BN|반다르스리브가완
BG|소피아
BF|와가두구
BI|기테가
KH|프놈펜
CM|야운데
CA|오타와
CV|프라이아
CF|방기
TD|은자메나
CL|산티아고
CN|베이징
CO|보고타
KM|모로니
CR|산호세
HR|자그레브
CU|아바나
CY|니코시아
CZ|프라하
DK|코펜하겐
DJ|지부티
DM|로조
DO|산토도밍고
CD|킨샤사
EC|키토
EG|카이로
SV|산살바도르
GQ|시우다드데라파스
ER|아스마라
EE|탈린
SZ|음바바네
ET|아디스아바바
FJ|수바
FI|헬싱키
FR|파리
GA|리브르빌
GM|반줄
GE|트빌리시
DE|베를린
GH|아크라
GR|아테네
GD|세인트조지스
GT|과테말라시티
GN|코나크리
GW|비사우
GY|조지타운
HT|포르토프랭스
HN|테구시갈파
HU|부다페스트
IS|레이캬비크
IN|뉴델리
ID|자카르타
IR|테헤란
IQ|바그다드
IE|더블린
IL|예루살렘
IT|로마
CI|야무수크로
JM|킹스턴
JP|도쿄
JO|암만
KZ|아스타나
KE|나이로비
KI|남타라와
XK|프리슈티나
KW|쿠웨이트시티
KG|비슈케크
LA|비엔티안
LV|리가
LB|베이루트
LS|마세루
LR|몬로비아
LY|트리폴리
LI|파두츠
LT|빌뉴스
LU|룩셈부르크
MG|안타나나리보
MW|릴롱궤
MY|쿠알라룸푸르
MV|말레
ML|바마코
MT|발레타
MH|마주로
MR|누악쇼트
MU|포트루이스
MX|멕시코시티
FM|팔리키르
MD|키시너우
MC|모나코
MN|울란바토르
ME|포드고리차
MA|라바트
MZ|마푸투
MM|네피도
NA|빈트후크
NR|야렌
NP|카트만두
NL|암스테르담
NZ|웰링턴
NI|마나과
NE|니아메
NG|아부자
KP|평양
MK|스코페
NO|오슬로
OM|무스카트
PK|이슬라마바드
PW|응게룰무드
PS|라말라
PA|파나마시티
PG|포트모르즈비
PY|아순시온
PE|리마
PH|마닐라
PL|바르샤바
PT|리스본
QA|도하
CG|브라자빌
RO|부쿠레슈티
RU|모스크바
RW|키갈리
KN|바스테르
LC|캐스트리스
VC|킹스타운
WS|아피아
SM|산마리노
ST|상투메
SA|리야드
SN|다카르
RS|베오그라드
SC|빅토리아
SL|프리타운
SG|싱가포르
SK|브라티슬라바
SI|류블랴나
SB|호니아라
SO|모가디슈
ZA|프리토리아
KR|서울
SS|주바
ES|마드리드
LK|스리자야와르데네푸라코테
SD|하르툼
SR|파라마리보
SE|스톡홀름
CH|베른
SY|다마스쿠스
TW|타이베이
TJ|두샨베
TZ|도도마
TH|방콕
TL|딜리
TG|로메
TO|누쿠알로파
TT|포트오브스페인
TN|튀니스
TR|앙카라
TM|아시가바트
TV|푸나푸티
UG|캄팔라
UA|키이우
AE|아부다비
GB|런던
US|워싱턴 D.C.
UY|몬테비데오
UZ|타슈켄트
VU|포트빌라
VA|바티칸시국
VE|카라카스
VN|하노이
YE|사나
ZM|루사카
ZW|하라레`.trim().split('\n').map(row=>row.split('|')));
const languageKo=Object.fromEntries(`Arabic|아랍어;English|영어;French|프랑스어;Spanish|스페인어;Portuguese|포르투갈어;German|독일어;Russian|러시아어;Dutch|네덜란드어;Albanian|알바니아어;Amharic|암하라어;Armenian|아르메니아어;Azerbaijani|아제르바이잔어;Belarusian|벨라루스어;Bengali|벵골어;Berber|베르베르어;Bosnian|보스니아어;Bulgarian|불가리아어;Burmese|미얀마어;Catalan|카탈루냐어;Chewa|체와어;Chinese|중국어;Comorian|코모로어;Croatian|크로아티아어;Czech|체코어;Danish|덴마크어;Dari|다리어;Dzongkha|종카어;Estonian|에스토니아어;Fijian|피지어;Fiji Hindi|피지 힌디어;Filipino|필리핀어;Finnish|핀란드어;Georgian|조지아어;Gilbertese|키리바시어;Greek|그리스어;Guaraní|과라니어;Haitian Creole|아이티 크레올어;Hebrew|히브리어;Hindi|힌디어;Hungarian|헝가리어;Icelandic|아이슬란드어;Indonesian|인도네시아어;Irish|아일랜드어;Italian|이탈리아어;Jamaican Patois|자메이카 파투아;Japanese|일본어;Kazakh|카자흐어;Khmer|크메르어;Kinyarwanda|키냐르완다어;Kirundi|키룬디어;Korean|한국어;Kyrgyz|키르기스어;Lao|라오어;Latin|라틴어;Latvian|라트비아어;Lingala|링갈라어;Lithuanian|리투아니아어;Luxembourgish|룩셈부르크어;Macedonian|마케도니아어;Malagasy|말라가시어;Malay|말레이어;Maldivian|디베히어;Maltese|몰타어;Marshallese|마셜어;Mauritian Creole|모리셔스 크레올어;Moldavian|몰도바어;Mongolian|몽골어;Montenegrin|몬테네그로어;Māori|마오리어;Nauru|나우루어;Nepali|네팔어;Norwegian Bokmål|노르웨이어 보크몰;Norwegian Nynorsk|노르웨이어 뉘노르스크;Palauan|팔라우어;Pashto|파슈토어;Persian (Farsi)|페르시아어;Polish|폴란드어;Quechua|케추아어;Romanian|루마니아어;Romansh|로만슈어;Samoan|사모아어;Sango|상고어;Serbian|세르비아어;Seychellois Creole|세이셸 크레올어;Shona|쇼나어;Sinhala|싱할라어;Slovak|슬로바키아어;Slovene|슬로베니아어;Somali|소말리어;Sorani|소라니어;Sotho|소토어;Southern Sotho|남소토어;Spanish|스페인어;Swahili|스와힐리어;Swazi|스와티어;Swedish|스웨덴어;Swiss German|스위스 독일어;Tajik|타지크어;Tamil|타밀어;Tetum|테툼어;Thai|태국어;Tigrinya|티그리냐어;Tok Pisin|톡피신;Tongan|통가어;Turkish|튀르키예어;Turkmen|투르크멘어;Tuvaluan|투발루어;Ukrainian|우크라이나어;Urdu|우르두어;Uzbek|우즈베크어;Vietnamese|베트남어;Afrikaans|아프리칸스어;Aymara|아이마라어;Belizean Creole|벨리즈 크레올어;Bislama|비슬라마어;Kikongo|키콩고어;Upper Guinea Creole|기니비사우 크레올어;Tswana|츠와나어;Hiri Motu|히리모투어;Tonga|통가어;Lozi|로지어;Northern Ndebele|북은데벨레어;Khoekhoe|코에코에어;Sami|사미어;Aramaic|아람어;Austro-Bavarian German|오스트리아 바이에른 독일어`.split(';').map(s=>s.split('|')));
const overrides={
 BI:[29.9246,-3.4264],BO:[-65.2592,-19.0196],CF:[18.5582,4.3947],CR:[-84.0907,9.9281],HN:[-87.1921,14.0723],CI:[-5.2767,6.8276],LA:[102.6331,17.9757],LS:[27.4833,-29.3167],MG:[47.5079,-18.8792],ML:[-8.0029,12.6392],MM:[96.1297,19.7633],PW:[134.6243,7.5004],SZ:[31.1367,-26.3054],LK:[79.9094,6.8941],VE:[-66.9036,10.4806],XK:[21.1655,42.6629],ST:[6.7300,.3365],BT:[89.6390,27.4728],MR:[-15.9784,18.0735],TW:[121.5654,25.0330],VA:[12.4534,41.9029],PS:[35.2034,31.9038],NR:[166.9209,-.5477],IL:[35.2137,31.7683],BH:[50.586,26.2235],BY:[27.5615,53.9045],GQ:[10.8222,1.5956],TV:[179.194547,-8.524263]
};
// TV is the centre of the government contact-page Plus Code F5GV+7RV, Vaiaku.
const coordinateSources={TV:["https://finance.gov.tv/contact-us/","https://finance.gov.tv/wp-content/uploads/2023/11/181024-TvICT-ESMP-Rev-G-2.pdf"]};
const english={GQ:'Ciudad de la Paz',LK:'Sri Jayewardenepura Kotte',SZ:'Mbabane',MN:'Ulaanbaatar'};
const roles={PS:{ko:'행정 중심지',en:'Administrative centre'},NR:{ko:'정부 소재지',en:'Government district'},CH:{ko:'연방도시',en:'Federal city'},SZ:{ko:'행정 수도',en:'Administrative capital'},BO:{ko:'헌법상 수도',en:'Constitutional capital'},ZA:{ko:'행정 수도',en:'Administrative capital'}};
const notes={
 PS:{ko:'팔레스타인은 동예루살렘을 수도로 주장하며, 라말라는 행정 중심지예요.',en:'Palestine claims East Jerusalem as its capital; Ramallah is its administrative centre.'},
 IL:{ko:'이스라엘 정부는 예루살렘을 수도로 두고 있어요. 도시의 국제적 지위는 분쟁 중이에요.',en:'Israel’s government is based in Jerusalem, which it designates as its capital. The city’s international status is disputed.'},
 NR:{ko:'나우루에는 공식 수도가 없어요. 정부 기관이 있는 야렌 지구를 지도에 표시해요.',en:'Nauru has no official capital. The map shows Yaren, the district where government offices are located.'},
 CH:{ko:'베른은 스위스의 연방도시로, 연방 정부가 있는 곳이에요.',en:'Bern is Switzerland’s federal city and the seat of its federal government.'},
 SZ:{ko:'음바바네는 행정 수도이고, 로밤바에는 왕실과 의회가 있어요.',en:'Mbabane is the administrative capital; Lobamba is the royal and legislative centre.'},
 BO:{ko:'헌법상 수도는 수크레이고, 정부와 의회는 라파스에 있어요.',en:'Sucre is the constitutional capital; La Paz is the seat of government and parliament.'},
 LK:{ko:'스리자야와르데네푸라코테에는 의회가 있고, 콜롬보에는 많은 정부 기관이 있어요.',en:'Sri Jayewardenepura Kotte is the legislative capital; many government offices are in Colombo.'},
 TV:{"ko":"수도 푸나푸티는 여러 섬으로 이루어진 환초예요. 핀은 정부 기관이 있는 퐁가팔레섬의 바이아쿠를 표시해요.","en":"The capital Funafuti is an atoll made up of several islands. The pin marks Vaiaku on Fongafale, where government offices are located."},
 GQ:{ko:'2026년 1월에 수도가 말라보에서 시우다드데라파스로 바뀌었어요.',en:'In January 2026, Ciudad de la Paz replaced Malabo as the capital.'},
 BJ:{ko:'포르토노보가 공식 수도이고, 많은 정부 기관은 코토누에 있어요.',en:'Porto-Novo is the official capital; many government offices are in Cotonou.'},
 NL:{ko:'수도는 암스테르담이지만 정부와 의회는 헤이그에 있어요.',en:'Amsterdam is the capital, while the government and parliament are in The Hague.'},
 MY:{ko:'수도는 쿠알라룸푸르이고 행정 중심지는 푸트라자야예요.',en:'Kuala Lumpur is the capital; Putrajaya is the administrative centre.'},
 ZA:{ko:'프리토리아는 행정 수도, 케이프타운은 입법 수도, 블룸폰테인은 사법 수도예요.',en:'Pretoria is the administrative capital, Cape Town the legislative capital, and Bloemfontein the judicial capital.'}
};
const heritageKo={AO:'옛 콩고 왕국의 수도 음반자콩고',AG:'앤티가의 해군 조선소',AM:'에치미아진의 성당과 교회',CV:'시다드벨랴의 옛 도시 중심지',KM:'코모로의 역사적인 술탄 도시',CY:'고대 마을 유적 키로키티아',FJ:'레부카의 역사적인 항구 도시',GM:'쿤타킨테 섬과 관련 유적',GW:'비자고스 제도의 해안과 바다 생태계',IS:'싱벨리르 국립공원',IL:'하이파와 갈릴리 서부의 바하이 성지',MD:'스트루베 측지 아크',NA:'트위펠폰테인의 바위 그림 유적',NI:'레온 대성당',PW:'록아일랜드 남부 석호',PG:'쿠크의 초기 농경 유적',PY:'트리니다드와 헤수스의 예수회 선교 유적',QA:'알주바라 유적',KN:'브림스톤힐 요새 국립공원',SM:'산마리노 구시가지와 티타노산',SC:'알다브라 환초',SL:'골라·티와이 자연 지역',SG:'싱가포르 식물원',SS:'보마·바딩길로의 동물 이동 경관',TJ:'고대 후탈의 문화유산',AE:'알아인의 오아시스와 문화 유적',VU:'로이마타 추장의 유산'};
// These were verified directly in the UNESCO country pages while authoring.
const verifiedHeritage={AL:['부트린트 유적','Butrint'],AD:['마드리우·페라피타·클라로 계곡','Madriu-Perafita-Claror Valley'],BF:['티에벨레 왕실 마을','Royal Court of Tiébélé'],AF:['잠의 미나레트와 고고 유적','Minaret and Archaeological Remains of Jam']};
const familiarHeritage=Object.fromEntries(`DZ|알제의 카스바|Kasbah of Algiers
AT|빈의 역사 지구|Historic Centre of Vienna
AZ|바쿠 성곽 도시|Walled City of Baku
BH|바레인 요새|Qal’at al-Bahrain
BB|브리지타운 역사 지구|Historic Bridgetown and its Garrison
BY|미르성|Mir Castle Complex
BE|브뤼셀의 그랑플라스|La Grand-Place, Brussels
BZ|벨리즈 산호초 보호 구역|Belize Barrier Reef Reserve System
BJ|아보메 왕궁|Royal Palaces of Abomey
BO|포토시 광산 도시|City of Potosí
BA|모스타르의 옛 다리 지역|Old Bridge Area of the Old City of Mostar
BW|오카방고 델타|Okavango Delta
BG|릴라 수도원|Rila Monastery
KH|앙코르 유적|Angkor
CM|자 동물 보호 구역|Dja Faunal Reserve
CF|상가강의 삼국 국립공원 지역|Sangha Trinational
TD|엔네디의 자연과 문화 경관|Ennedi Massif: Natural and Cultural Landscape
CR|코코섬 국립공원|Cocos Island National Park
HR|두브로브니크 구시가지|Old City of Dubrovnik
CU|아바나 구시가지|Old Havana and its Fortification System
CZ|프라하 역사 지구|Historic Centre of Prague
DK|크론보르성|Kronborg Castle
DM|모른트루아피통 국립공원|Morne Trois Pitons National Park
DO|산토도밍고의 옛 도시|Colonial City of Santo Domingo
CD|비룽가 국립공원|Virunga National Park
EC|갈라파고스 제도|Galápagos Islands
SV|호야데세렌의 고고 유적|Joya de Cerén Archaeological Site
ER|아스마라의 근대 도시 경관|Asmara: A Modernist African City
EE|탈린 구시가지|Historic Centre (Old Town) of Tallinn
ET|랄리벨라의 바위 교회|Rock-Hewn Churches, Lalibela
GA|로페·오칸다의 생태와 문화 경관|Ecosystem and Relict Cultural Landscape of Lopé-Okanda
GE|므츠헤타의 역사 유적|Historical Monuments of Mtskheta
GH|해안의 요새와 성들|Forts and Castles, Volta, Greater Accra, Central and Western Regions
GT|티칼 국립공원|Tikal National Park
GN|님바산 자연 보호 구역|Mount Nimba Strict Nature Reserve
HT|시타델·상수시·라미에 국립 역사 공원|National History Park – Citadel, Sans Souci, Ramiers
HN|코판의 마야 유적|Maya Site of Copan
HU|부다페스트의 다뉴브강 경관|Budapest, including the Banks of the Danube, the Buda Castle Quarter and Andrássy Avenue
IR|페르세폴리스 유적|Persepolis
IQ|바빌론 유적|Babylon
IE|브루나보너의 고고 유적|Brú na Bóinne – Archaeological Ensemble of the Bend of the Boyne
CI|그랑바삼의 역사 도시|Historic Town of Grand-Bassam
JM|블루·존크로 산맥|Blue and John Crow Mountains
JO|페트라 유적|Petra
KZ|사르야르카의 초원과 호수|Saryarka – Steppe and Lakes of Northern Kazakhstan
KI|피닉스 제도 보호 구역|Phoenix Islands Protected Area
KG|술라이만 성산|Sulaiman-Too Sacred Mountain
LA|루앙프라방의 옛 도시|Town of Luang Prabang
LV|리가 역사 지구|Historic Centre of Riga
LB|바알베크 유적|Baalbek
LS|말로티·드라켄즈버그 공원|Maloti-Drakensberg Park
LY|렙티스마그나 유적|Archaeological Site of Leptis Magna
LT|빌뉴스 역사 지구|Vilnius Historic Centre
LU|룩셈부르크의 옛 시가지와 요새|City of Luxembourg: its Old Quarters and Fortifications
MG|칭기드베마라하 자연 보호 구역|Tsingy de Bemaraha Strict Nature Reserve
MW|말라위호 국립공원|Lake Malawi National Park
MY|키나발루 공원|Kinabalu Park
ML|젠네의 옛 도시|Old Towns of Djenné
MT|발레타의 옛 도시|City of Valletta
MH|비키니 환초|Bikini Atoll Nuclear Test Site
MR|방다르갱 국립공원|Banc d’Arguin National Park
MU|르몬의 문화 경관|Le Morne Cultural Landscape
FM|난마돌의 옛 의례 중심지|Nan Madol: Ceremonial Centre of Eastern Micronesia
MN|오르혼 계곡의 문화 경관|Orkhon Valley Cultural Landscape
ME|코토르의 자연과 역사 지구|Natural and Culturo-Historical Region of Kotor
MZ|모잠비크섬|Island of Mozambique
MM|바간의 불교 유적|Bagan
NP|카트만두 계곡|Kathmandu Valley
NL|킨더데이크의 풍차들|Mill Network at Kinderdijk-Elshout
NE|아이르·테네레 자연 보호 구역|Air and Ténéré Natural Reserves
KP|고구려 고분군|Complex of Koguryo Tombs
MK|오흐리드 지역의 자연과 문화유산|Natural and Cultural Heritage of the Ohrid Region
OM|바흘라 요새|Bahla Fort
PS|예리코의 텔에술탄 유적|Ancient Jericho/Tell es-Sultan
PA|다리엔 국립공원|Darien National Park
CG|상가강의 삼국 국립공원 지역|Sangha Trinational
RO|다뉴브강 삼각주|Danube Delta
RW|뉴웅궤 국립공원|Nyungwe National Park
LC|피통의 자연 경관|Pitons Management Area
SN|고레섬|Island of Gorée
RS|스투데니차 수도원|Studenica Monastery
SK|스피시성의 역사 유적|Levoča, Spišský Hrad and the Associated Cultural Monuments
SI|슈코치안 동굴|Škocjan Caves
SB|동렌넬의 자연 지역|East Rennell
LK|시기리야 고대 도시|Ancient City of Sigiriya
SD|메로에섬의 고고 유적|Archaeological Sites of the Island of Meroe
SR|파라마리보 역사 지구|Historic Inner City of Paramaribo
CH|융프라우·알레치의 알프스 경관|Swiss Alps Jungfrau-Aletsch
SY|보스라 고대 도시|Ancient City of Bosra
TG|바탐마리바 사람들의 쿠타마쿠 경관|Koutammakou, the Land of the Batammariba
TN|엘젬 원형 경기장|Amphitheatre of El Jem
TM|메르브의 옛 오아시스 도시|State Historical and Cultural Park “Ancient Merv”
UG|브윈디 원시림 국립공원|Bwindi Impenetrable National Park
UA|키이우의 성소피아 대성당|Kyiv: Saint-Sophia Cathedral and Related Monastic Buildings, Kyiv-Pechersk Lavra
UY|콜로니아델사크라멘토 역사 지구|Historic Quarter of the City of Colonia del Sacramento
UZ|사마르칸트의 문화 경관|Samarkand – Crossroad of Cultures
VA|바티칸시국|Vatican City
VE|카나이마 국립공원|Canaima National Park
YE|사나 구시가지|Old City of Sana’a
ZM|빅토리아 폭포|Mosi-oa-Tunya / Victoria Falls
ZW|그레이트짐바브웨 유적|Great Zimbabwe National Monument`.split('\n').map(row=>{const [code,ko,en]=row.split('|');return [code,{ko,en}];}));
const regions={Africa:'아프리카',Americas:'아메리카',Asia:'아시아',Europe:'유럽',Oceania:'오세아니아'};
const by3=new Map(countries.map(c=>[c.cca3,c]));
const wbBy2=new Map(wb.map(c=>[c.iso2Code,c]));
const dataset={};
const topic=name=>name+((name.codePointAt(name.length-1)-0xAC00)%28===0?'는':'은');
for(const c of countries.filter(c=>c.independent===true||['TW','PS','XK'].includes(c.cca2))){
 const code=c.cca2,nameKo=code==='DM'?'도미니카 연방':c.translations.kor.common,capital=english[code]||c.capital[0];
 const w=wbBy2.get(code),coordinates=overrides[code]||[Number(w?.longitude),Number(w?.latitude)];
 if(!capitalKo[code]||!coordinates.every(Number.isFinite)||(!overrides[code]&&(!w?.longitude||!w?.latitude)))throw Error(`Missing capital data: ${code}`);
 const neighbours=(c.borders||[]).map(b=>by3.get(b)).filter(Boolean).slice(0,3);
 const geography=c.landlocked?{ko:`${topic(nameKo)} 바다와 직접 닿지 않는 내륙 나라예요. ${neighbours.map(n=>n.translations.kor.common).join(', ')} 등과 육지로 이어져요.`,en:`${c.name.common} is landlocked. Its land neighbours include ${neighbours.map(n=>n.name.common).join(', ')}.`}:neighbours.length?{ko:`${nameKo}에는 바다와 만나는 해안이 있어요. 육지 이웃에는 ${neighbours.map(n=>n.translations.kor.common).join(', ')} 등이 있어요.`,en:`${c.name.common} has a coast. Its land neighbours include ${neighbours.map(n=>n.name.common).join(', ')}.`}:{ko:`${topic(nameKo)} 바다로 둘러싸인 섬나라예요. 지도에서 해안선과 주변 바다를 살펴보세요.`,en:`${c.name.common} is an island country. Look for its coastline and surrounding sea on the map.`};
 const languages=Object.values(c.languages||{}).slice(0,3),langsKo=languages.map(l=>languageKo[l]||l);
 let story={ko:`이 나라에서 사용하는 언어에는 ${langsKo.join(', ')} 등이 있어요. 인사말을 찾아보며 문화를 알아볼 수 있어요.`,en:`Languages used in this country include ${languages.join(', ')}. Learning a greeting is one way to discover its culture.`};
 let landmark=familiarHeritage[code];
 if(verifiedHeritage[code])landmark={ko:verifiedHeritage[code][0],en:verifiedHeritage[code][1]};
 else if(heritageKo[code]&&heritage[code]?.heritage[0])landmark={ko:heritageKo[code],en:heritage[code].heritage[0]};
 if(landmark)story={ko:`${landmark.ko}은 유네스코 세계유산으로 보호받는 곳이에요. 이 나라의 자연이나 역사 이야기를 만날 수 있어요.`,en:`${landmark.en} is a UNESCO World Heritage site. It is a place to discover this country’s nature or history.`};
 const role=roles[code]||{ko:'수도',en:'Capital'};
 const first=notes[code]||{ko:`${topic(nameKo)} ${regions[c.region]}에 있어요. 수도는 ${capitalKo[code]}예요.`,en:`${c.name.common} is in ${c.region}. Its capital is ${capital}.`};
 dataset[code]={capital,capitalKo:capitalKo[code],capitalRole:role,capitalNote:notes[code]||null,coordinates,facts:[first,geography,story],keywords:[{ko:capitalKo[code],en:capital,type:'city'},{ko:regions[c.region],en:c.region,type:'place'},...(landmark?[{...landmark,type:'landmark'}]:languages.slice(0,2).map(l=>({ko:languageKo[l]||l,en:l,type:'language'})))],sources:[...(coordinateSources[code]||[]),'https://github.com/mledoze/countries','https://api.worldbank.org/v2/country?format=json&per_page=400',...(landmark?[`https://whc.unesco.org/en/statesparties/${code.toLowerCase()}/`]:[])],reviewedAt:'2026-10-01'};
 if(code==='GQ')dataset[code].sources.push('https://www.guineaecuatorialpress.com/noticias/decreto_ley_por_el_que_se_declara_la_ciudad_de_la_paz_djibloho_capital_de_la_republica_de_guinea_ecuatorial');
 if(code==='NR')dataset[code].sources.push('https://thecommonwealth.org/our-member-countries/nauru');
 if(code==='LK')dataset[code].sources.push('https://www.gov.lk/sri-lanka/country-overview');
}
fs.writeFileSync(new URL('src/basic-country-data.json',root),JSON.stringify(dataset,null,2)+'\n');
fs.writeFileSync(new URL('public/data/learning-basics.json',root),JSON.stringify(dataset)+'\n');
console.log(`Wrote ${Object.keys(dataset).length} bilingual country records`);
