import countries from "world-countries";

const langDisplayKo = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["ko"], { type: "language" })
  : null;
const currDisplayKo = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["ko"], { type: "currency" })
  : null;

const languageKoOverrides = {
  kor: "한국어",
  eng: "영어",
  fra: "프랑스어",
  deu: "독일어",
  spa: "스페인어",
  jpn: "일본어",
  zho: "중국어",
  rus: "러시아어",
  ara: "아랍어",
  por: "포르투갈어",
  ita: "이탈리아어",
  hin: "힌디어",
  tur: "튀르키예어",
  vie: "베트남어",
  tha: "태국어",
  ind: "인도네시아어",
  msa: "말레이어",
  nld: "네덜란드어",
  pol: "폴란드어",
  ell: "그리스어",
  swe: "스웨덴어",
  nor: "노르웨이어",
  nob: "노르웨이어",
  nno: "노르웨이어",
  fin: "핀란드어",
  dan: "덴마크어",
  kal: "그린란드어",
  heb: "히브리어",
  fas: "페르시아어",
  ukr: "우크라이나어",
  ces: "체코어",
  hun: "헝가리어",
  ron: "루마니아어",
  bul: "불가리아어",
  srp: "세르비아어",
  hrv: "크로아티아어",
  slk: "슬로바키아어",
  slv: "슬로베니아어",
  sqi: "알바니아어",
  kat: "조지아어",
  hye: "아르메니아어",
  aze: "아제르바이잔어",
  kaz: "카자흐어",
  uzb: "우즈베크어",
  mon: "몽골어",
  mya: "미얀마어",
  khm: "크메르어",
  lao: "라오어",
  tgl: "타갈로그어",
  fil: "필리핀어",
  ben: "벵골어",
  urd: "우르두어",
  nep: "네팔어",
  sin: "싱할라어",
  tam: "타밀어",
  swa: "스와힐리어",
  amh: "암하라어",
  lat: "라틴어",
};

function translateLanguageKo(code, englishName) {
  if (languageKoOverrides[code]) return languageKoOverrides[code];
  if (langDisplayKo) {
    try {
      const translated = langDisplayKo.of(code);
      if (translated && translated.toLowerCase() !== code.toLowerCase()) return translated;
    } catch {
      // ignore invalid subtag
    }
  }
  return englishName;
}

function translateCurrencyKo(code, englishName) {
  if (currDisplayKo) {
    try {
      const translated = currDisplayKo.of(code);
      if (translated && translated.toUpperCase() !== code.toUpperCase()) return translated;
    } catch {
      // ignore
    }
  }
  return englishName;
}

function formatLanguageSummary(languagesObj, language = "ko") {
  const entries = Object.entries(languagesObj || {});
  if (!entries.length) return language === "ko" ? "정보 없음" : "Not specified";
  const names = entries.map(([code, enName]) =>
    language === "ko" ? translateLanguageKo(code, enName) : enName
  );
  const unique = [...new Set(names)];
  if (unique.length <= 2) return unique.join(", ");
  const extra = unique.length - 2;
  return language === "ko"
    ? `${unique.slice(0, 2).join(", ")} 외 ${extra}개`
    : `${unique.slice(0, 2).join(", ")} +${extra} more`;
}

function formatCurrencySummary(currenciesObj, language = "ko") {
  const entries = Object.entries(currenciesObj || {});
  if (!entries.length) return language === "ko" ? "공식 화폐 없음" : "No official currency";
  const [code, info] = entries[0];
  const name = language === "ko" ? translateCurrencyKo(code, info.name) : info.name;
  const symbol = info.symbol && info.symbol !== code ? `${info.symbol} · ${code}` : code;
  return `${name} (${symbol})`;
}

const rawByCode = new Map(countries.map((c) => [c.cca2, c]));

const polarProfiles = {
  AQ: {
    languages: {
      ko: "연구기지 파견국 언어",
      en: "Languages of research stations",
    },
    currency: {
      ko: "공식 화폐 없음",
      en: "No official currency",
    },
  },
};

export function getCountryProfile(code, language = "ko") {
  if (polarProfiles[code]) {
    return {
      languages: polarProfiles[code].languages[language],
      currency: polarProfiles[code].currency[language],
    };
  }
  const raw = rawByCode.get(code);
  if (!raw) return null;
  return {
    languages: formatLanguageSummary(raw.languages, language),
    currency: formatCurrencySummary(raw.currencies, language),
  };
}
