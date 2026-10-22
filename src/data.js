import countries from "world-countries";
import basicCountryData from './basic-country-data.json' with {type:'json'};
import postcardAssets from './postcard-assets.json' with {type:'json'};
import postcardImports from './postcard-imports.json' with {type:'json'};
import postcardMedia from './postcard-media.json' with {type:'json'};
import vaticanGeometry from "./vatican-geometry.json" with {type:"json"};
import {splitAntimeridianGeometry} from "./map-geometry.js";
import { feature as topoFeature } from "topojson-client";
import {classroomNames} from './priority-countries.js';
import {polarDestinations,polarPostcards} from './polar-data.js';

// 194 independent entries plus Taiwan, Palestine, and Kosovo = the 197-country
// learning set requested for this project. The full vector layer still shows
// the rest of Natural Earth's mapped land areas for geographic context.
const additions = new Set(["TW", "PS", "XK"]);
export const roster = countries
  .filter((country) => country.independent === true || additions.has(country.cca2))
  .map((country) => ({
    code: country.cca2,
    numericCode: country.ccn3,
    name: classroomNames[country.cca2]?.en || country.name.common,
    nameKo: classroomNames[country.cca2]?.ko || (country.cca2 === 'DM' ? '도미니카 연방' : country.translations?.kor?.common || country.name.common),
    aliases: [country.name.common, country.translations?.kor?.common].filter(Boolean),
    capital: basicCountryData[country.cca2].capital,
    capitalKo: basicCountryData[country.cca2].capitalKo,
    capitalRole: basicCountryData[country.cca2].capitalRole,
    capitalNote: basicCountryData[country.cca2].capitalNote,
    region: country.region || "",
    subregion: country.subregion || "",
    center: country.latlng?.length === 2 ? [country.latlng[1], country.latlng[0]] : null,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const explorationRoster = [...roster,...polarDestinations].sort((a,b)=>a.name.localeCompare(b.name));
export const capitalQuizRoster = [...roster,...polarDestinations.filter(place=>place.quizKind==='capital')];
export const countryByCode = new Map(explorationRoster.map((country) => [country.code, country]));
export const countryByNumericCode = new Map(explorationRoster.map((country) => [country.numericCode, country]));

export const capitalPoints = {
  ...Object.fromEntries(Object.entries(basicCountryData).map(([code,entry])=>[code,{coordinates:entry.coordinates}])),
  ...Object.fromEntries(Object.entries(postcardAssets).map(([code,entry])=>[code,{coordinates:basicCountryData[code].coordinates,image:entry.image,landmark:entry.landmark,landmarkKo:entry.landmarkKo,imageFit:'contain'}])),
  FR: { coordinates: [2.3522, 48.8566], landmark: "Eiffel Tower", landmarkKo: "에펠탑", image: "/assets/paris-eiffel.webp" },
  US: { coordinates: [-77.0365, 38.8977], landmark: "Mount Rushmore", landmarkKo: "큰바위얼굴", image: "/assets/mount-rushmore.webp" },
  KR: { coordinates: [126.978, 37.5665], landmark: "N Seoul Tower & Bukchon Hanok Village", landmarkKo: "N서울타워와 북촌 한옥마을", image: "/assets/korea-hanok-tower.webp" },
  JP: { coordinates: [139.6917, 35.6895], landmark: "Mount Fuji & Five-Story Pagoda", landmarkKo: "후지산과 오중탑", image: "/assets/japan-fuji-pagoda.webp" },
  CN: { coordinates: [116.4074, 39.9042], landmark: "Great Wall", landmarkKo: "만리장성", image: "/assets/china-great-wall.webp" },
  IN: { coordinates: [77.209, 28.6139], landmark: "Taj Mahal", landmarkKo: "타지마할", image: "/assets/india-taj-mahal.webp" },
  IT: { coordinates: [12.4964, 41.9028], landmark: "Colosseum", landmarkKo: "콜로세움", image: "/assets/italy-colosseum.webp" },
  GB: { coordinates: [-0.1276, 51.5072], landmark: "Elizabeth Tower & Parliament", landmarkKo: "엘리자베스 타워와 국회의사당", image: "/assets/uk-big-ben.webp" },
  EG: { coordinates: [31.2357, 30.0444], landmark: "Pyramids of Giza", landmarkKo: "기자의 피라미드", image: "/assets/egypt-pyramids.webp" },
  BR: { coordinates: [-47.8825, -15.7942], landmark: "Christ the Redeemer", landmarkKo: "구세주 그리스도상", image: "/assets/brazil-christ.webp" },
  MX: { coordinates: [-99.1332, 19.4326], landmark: "Chichén Itzá", landmarkKo: "치첸이트사", image: "/assets/mexico-chichen-itza.webp" },
  ID: { coordinates: [106.8456, -6.2088], landmark: "Borobudur", landmarkKo: "보로부두르", image: "/assets/indonesia-borobudur.webp" },
  DE: { coordinates: [13.405, 52.52], landmark: "Brandenburg Gate", landmarkKo: "브란덴부르크 문", image: "/assets/germany-brandenburg-gate.webp" },
  AU: { coordinates: [149.13, -35.2809], landmark: "Sydney Opera House & Harbour Bridge", landmarkKo: "시드니 오페라하우스와 하버 브리지", image: "/assets/australia-sydney-opera.webp" },
  ES: { coordinates: [-3.7038, 40.4168], landmark: "Sagrada Família", landmarkKo: "사그라다 파밀리아", image: "/assets/spain-sagrada-familia.webp" },
  CA: { coordinates: [-75.6972, 45.4215], landmark: "Niagara Falls", landmarkKo: "나이아가라 폭포", image: "/assets/canada-niagara-falls.webp" },
  TR: { coordinates: [32.8597, 39.9334], landmark: "Hagia Sophia & Blue Mosque", landmarkKo: "아야 소피아와 블루 모스크", image: "/assets/turkiye-hagia-sophia.webp" },
  RU: { coordinates: [37.6173, 55.7558], landmark: "Saint Basil’s Cathedral", landmarkKo: "성 바실리 대성당", image: "/assets/russia-st-basils.webp" },
  KE: { coordinates: [36.8219, -1.2921], landmark: "Maasai Mara", landmarkKo: "마사이 마라", image: "/assets/kenya-maasai-mara.webp" },
  AR: { coordinates: [-58.3816, -34.6037], landmark: "Buenos Aires Obelisk & La Boca", landmarkKo: "부에노스아이레스 오벨리스크와 라 보카", image: "/assets/argentina-buenos-aires.webp" },
  TH: { coordinates: [100.5018, 13.7563], landmark: "Grand Palace", landmarkKo: "왕궁", image: "/assets/thailand-grand-palace.webp" },
  GR: { coordinates: [23.7275, 37.9838], landmark: "Acropolis & Parthenon", landmarkKo: "아크로폴리스와 파르테논", image: "/assets/greece-acropolis.webp" },
  ZA: { coordinates: [28.2293, -25.7479], landmark: "Table Mountain & Cape Town", landmarkKo: "테이블산과 케이프타운", image: "/assets/south-africa-table-mountain.webp" },
  NO: { coordinates: [10.7522, 59.9139], landmark: "Geirangerfjord", landmarkKo: "게이랑에르 피오르", image: "/assets/norway-geirangerfjord.webp" },
  PE: { coordinates: [-77.0428, -12.0464], landmark: "Machu Picchu", landmarkKo: "마추픽추", image: "/assets/peru-machu-picchu.webp" },
  NZ: { coordinates: [174.7633, -41.2865], landmark: "Milford Sound", landmarkKo: "밀퍼드 사운드", image: "/assets/new-zealand-milford-sound.webp" },
  MA: { coordinates: [-6.8498, 34.0209], landmark: "Marrakech & Koutoubia Mosque", landmarkKo: "마라케시와 쿠투비아 모스크", image: "/assets/morocco-marrakech.webp" },
  SE: { coordinates: [18.0686, 59.3293], landmark: "Gamla Stan, Stockholm", landmarkKo: "스톡홀름 감라스탄", image: "/assets/sweden-stockholm.webp" },
  VN: { coordinates: [105.8342, 21.0278], landmark: "Ha Long Bay", landmarkKo: "하롱베이", image: "/assets/vietnam-ha-long-bay.webp" },
  SA: { coordinates: [46.6753, 24.7136], landmark: "Hegra", landmarkKo: "헤그라", image: "/assets/saudi-arabia-hegra.webp" },
  BD: { coordinates: [90.4125, 23.8103], landmark: "Lalbagh Fort", landmarkKo: "랄바그 요새", image: "/assets/bangladesh-lalbagh-fort.webp" },
  NG: { coordinates: [7.4951, 9.0579], landmark: "Aso Rock", landmarkKo: "아소 록", image: "/assets/nigeria-aso-rock.webp" },
  PT: { coordinates: [-9.1393, 38.7223], landmark: "Belém Tower", landmarkKo: "벨렝탑", image: "/assets/portugal-belem-tower.webp" },
  PL: { coordinates: [21.0122, 52.2297], landmark: "Warsaw Old Town & Royal Castle", landmarkKo: "바르샤바 구시가지와 왕궁", image: "/assets/poland-warsaw-old-town.webp" },
  CL: { coordinates: [-70.6693, -33.4489], landmark: "Moai of Rapa Nui", landmarkKo: "라파누이 모아이", image: "/assets/chile-rapa-nui.webp" },
  CO: { coordinates: [-74.0721, 4.711], landmark: "Cartagena Walled City", landmarkKo: "카르타헤나 성벽 도시", image: "/assets/colombia-cartagena.webp" },
  FI: { coordinates: [24.9384, 60.1699], landmark: "Helsinki Cathedral", landmarkKo: "헬싱키 대성당", image: "/assets/finland-helsinki-cathedral.webp" },
  PH: { coordinates: [120.9842, 14.5995], landmark: "Banaue Rice Terraces", landmarkKo: "바나우에 계단식 논", image: "/assets/philippines-banaue-terraces.webp" },
  PK: { coordinates: [73.0479, 33.6844], landmark: "Faisal Mosque", landmarkKo: "파이살 모스크", image: "/assets/pakistan-faisal-mosque.webp" },
  TZ: { coordinates: [35.7516, -6.163], landmark: "Mount Kilimanjaro", landmarkKo: "킬리만자로산", image: "/assets/tanzania-kilimanjaro.webp" },
  ...Object.fromEntries(Object.entries(postcardImports).map(([code,entry])=>[code,{coordinates:basicCountryData[code].coordinates,...entry,imageFit:'contain'}])),
};
for(const [code,media] of Object.entries(postcardMedia))Object.assign(capitalPoints[code],media);
for(const destination of polarDestinations.filter(place=>place.quizKind==='capital'))capitalPoints[destination.code]={coordinates:destination.coordinates,...polarPostcards[destination.code]};
// Antarctica has a research-site pin, never a fabricated capital point.
export const explorationPoints = {...capitalPoints,...Object.fromEntries(polarDestinations.filter(place=>place.explorationPoint).map(place=>[place.code,{...place.explorationPoint,...polarPostcards[place.code]}]))};

const fullCountryByNumeric = new Map(countries.map((country) => [country.ccn3, country]));
const fullCountryByName = new Map(countries.map((country) => [country.name.common.toLowerCase(), country]));
export function createCountryGeoJson(atlas) {
  const source = topoFeature(atlas, atlas.objects.countries);
  return {
    type: "FeatureCollection",
    features: source.features.map((item) => {
      const numeric = String(item.id ?? "").padStart(3, "0");
      const name = item.properties?.name || "";
      const country = fullCountryByNumeric.get(numeric) || fullCountryByName.get(name.toLowerCase());
      const rosterEntry = countryByCode.get(country?.cca2);
      return {
        ...item,
        geometry: splitAntimeridianGeometry(country?.cca2 === "VA" ? vaticanGeometry.geometry : item.geometry),
        properties: {
          ...item.properties,
          cca2: country?.cca2 || "",
          label: rosterEntry?.name || name,
          labelKo: rosterEntry?.nameKo || name,
          region: rosterEntry?.region || country?.region || "",
          eligible: Boolean(rosterEntry),
        },
      };
    }),
  };
}

export async function loadCountryGeoJson() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/countries-10m.json`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Could not load country map data (${response.status})`);
  return createCountryGeoJson(await response.json());
}

export const capitalQuizOptions = [
  { id: "paris", name: "Paris", coordinates: [2.3522, 48.8566], code: "FR" },
  { id: "rome", name: "Rome", coordinates: [12.4964, 41.9028], code: "IT" },
  { id: "madrid", name: "Madrid", coordinates: [-3.7038, 40.4168], code: "ES" },
];

export const regionBounds = {
  Europe: [[-12, 34], [35, 71]],
  Asia: [[30, -10], [180, 75]],
  Africa: [[-20, -38], [55, 38]],
  Americas: [[-170, -58], [-20, 84]],
  Oceania: [[108, -48], [180, 10]],
  Antarctica: [[-180,-84.5],[180,-60]],
  World: [[-180, -80], [180, 84]],
};
