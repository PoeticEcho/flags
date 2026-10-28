import test from "node:test";
import assert from "node:assert/strict";
import { roster, explorationRoster, countryByCode } from "../src/data.js";
import { anthemData, getAnthemInfo } from "../src/anthem.js";
import { getCountryProfile } from "../src/country-profile.js";
import { createQuizQuestion, flagQuizOptions, quizContinent, wrongCapitalHint } from "../src/quiz-data.js";
import { readExplorerSettings, saveExplorerSettings } from "../src/explorer-settings.js";

test("all 197 countries and Greenland have bilingual anthem titles, HTTPS audio URLs, and YouTube links", () => {
  for (const country of [...roster, countryByCode.get("GL")]) {
    const entry = anthemData[country.code];
    assert.ok(entry, `Missing anthem entry for ${country.code}`);
    assert.ok(entry.title && entry.titleKo, `Missing anthem title for ${country.code}`);
    assert.match(entry.audio, /^https:\/\/(commons\.wikimedia|en\.wikipedia)\.org\/wiki\/Special:FilePath\//, country.code);
    assert.match(entry.mp3, /^https:\/\/upload\.wikimedia\.org\//, country.code);

    for (const lang of ["ko", "en"]) {
      const info = getAnthemInfo(country, lang);
      assert.equal(info.isPolar, false, country.code);
      assert.ok(info.title.length > 0, country.code);
      assert.ok(info.mp3Url && info.mp3Url.startsWith("https://"), country.code);
      assert.match(info.youtubeUrl, /^https:\/\/www\.youtube\.com\/results\?search_query=/);
    }
  }

  const aq = getAnthemInfo(countryByCode.get("AQ"), "ko");
  assert.equal(aq.isPolar, true);
  assert.equal(aq.audioUrl, "");
  assert.equal(aq.mp3Url, "");
  assert.equal(aq.youtubeUrl, "");
});

test("all 199 exploration places provide bilingual official language and currency summaries", () => {
  for (const place of explorationRoster) {
    for (const lang of ["ko", "en"]) {
      const profile = getCountryProfile(place.code, lang);
      assert.ok(profile, `Missing profile for ${place.code} (${lang})`);
      assert.ok(profile.languages && profile.languages.length > 0, `${place.code} languages`);
      assert.ok(profile.currency && profile.currency.length > 0, `${place.code} currency`);
    }
  }
  assert.equal(getCountryProfile("KR", "ko").languages, "한국어");
  assert.match(getCountryProfile("KR", "ko").currency, /원/);
  assert.equal(getCountryProfile("AQ", "ko").currency, "공식 화폐 없음");
});

test("flag quiz mode generates 4 same-continent country choices and persists difficulty setting", () => {
  for (const country of roster) {
    const q = createQuizQuestion(country.code, "flag");
    assert.equal(q.type, "flag", country.code);
    assert.equal(q.options.length, 4, country.code);
    assert.equal(q.options.filter((o) => o.correct).length, 1, country.code);
    assert.equal(new Set(q.options.map((o) => o.code)).size, 4, country.code);
    const correct = q.options.find((o) => o.correct);
    assert.equal(correct.code, country.code);
    assert.equal(correct.nameKo, country.nameKo);
    for (const opt of q.options) {
      const other = countryByCode.get(opt.code);
      assert.equal(quizContinent(other), quizContinent(country), country.code);
      assert.ok(wrongCapitalHint(opt, "ko").includes(other.capitalKo));
      assert.ok(wrongCapitalHint(opt, "en").includes(other.capital));
    }
  }

  let stored = "{}";
  const storage = {
    getItem: () => stored,
    setItem: (_k, v) => {
      stored = v;
    },
  };
  const settings = { language: "ko", selectedCode: "KR", mode: "explore", poolSize: 48, difficulty: "flag" };
  assert.equal(saveExplorerSettings(storage, settings), true);
  assert.deepEqual(readExplorerSettings(storage, countryByCode), settings);
});
