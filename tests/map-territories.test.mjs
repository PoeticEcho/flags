import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createCountryGeoJson, countryByCode, explorationRoster } from "../src/data.js";
import { MAP_TERRITORIES, territoryByKey } from "../src/map-territories.js";
import { territoryHighlightLayers, updateTerritoryHighlight } from "../src/map-highlight.js";
import { searchCountryMatches } from "../src/country-search.js";
import { focusMapTerritory, territoryFocusBounds } from "../src/map-geometry.js";

const atlas = JSON.parse(readFileSync(new URL("../public/data/countries-10m.json", import.meta.url)));
const geo = createCountryGeoJson(atlas);

test("every single drawn landmass in countries-10m.json (all 255 features) is clickable", () => {
  assert.equal(geo.features.length, 255);
  const unclickable = geo.features.filter((f) => !f.properties.clickable);
  assert.deepEqual(
    unclickable.map((f) => f.properties.name),
    [],
    "Expected zero unclickable features on the world map"
  );

  // Preserve the exact 199-place eligible learning set
  const eligibleCodes = new Set(geo.features.filter((f) => f.properties.eligible).map((f) => f.properties.cca2));
  assert.equal(eligibleCodes.size, 199);

  // All 55 non-roster territories resolve to a valid linked roster country
  const nonRoster = geo.features.filter((f) => !f.properties.eligible);
  assert.equal(nonRoster.length, 55);
  for (const feature of nonRoster) {
    const t = territoryByKey.get(feature.properties.territoryKey);
    assert.ok(t, `Missing territory metadata for ${feature.properties.name}`);
    assert.ok(countryByCode.has(t.linkedCode), `Invalid linkedCode ${t.linkedCode} for ${t.key}`);
    assert.equal(feature.properties.linkedCode, t.linkedCode);
    assert.ok(feature.properties.region.length > 0, `Missing continent region for ${t.key}`);
  }
});

test("all 55 territories have complete bilingual names, badges, notes, and valid coordinates", () => {
  assert.equal(MAP_TERRITORIES.length, 55);
  for (const t of MAP_TERRITORIES) {
    assert.ok(t.key && t.nameKo && t.nameEn, `Missing names for ${t.key}`);
    assert.ok(t.kindKo && t.kindEn, `Missing kind badge for ${t.key}`);
    assert.ok(t.noteKo.length > 15 && t.noteEn.length > 15, `Missing description for ${t.key}`);
    assert.ok(Array.isArray(t.coordinates) && t.coordinates.length === 2, `Missing coordinates for ${t.key}`);
    assert.ok(Math.abs(t.coordinates[0]) <= 180 && Math.abs(t.coordinates[1]) <= 90, `Out-of-range coordinates for ${t.key}`);
  }
});

test("Somaliland, Puerto Rico, and New Caledonia (below Vanuatu) connect to SO, US, and FR", () => {
  const somaliland = geo.features.find((f) => f.properties.name === "Somaliland");
  assert.equal(somaliland?.properties.territoryKey, "somaliland");
  assert.equal(somaliland?.properties.linkedCode, "SO");
  assert.equal(somaliland?.properties.region, "Africa");
  assert.equal(somaliland?.properties.labelKo, "소말릴란드");

  const puertoRico = geo.features.find((f) => f.properties.cca2 === "PR");
  assert.equal(puertoRico?.properties.territoryKey, "PR");
  assert.equal(puertoRico?.properties.linkedCode, "US");
  assert.equal(puertoRico?.properties.labelKo, "푸에르토리코");

  const newCaledonia = geo.features.find((f) => f.properties.cca2 === "NC");
  assert.equal(newCaledonia?.properties.territoryKey, "NC");
  assert.equal(newCaledonia?.properties.linkedCode, "FR");
  assert.equal(newCaledonia?.properties.region, "Oceania");
  assert.equal(newCaledonia?.properties.labelKo, "누벨칼레도니");
});

test("territory highlight layers stay hidden in quiz mode and toggle cleanly in explore mode", () => {
  const layers = territoryHighlightLayers("NC", false);
  assert.equal(layers.length, 2);
  assert.ok(layers.every((l) => l.layout.visibility === "visible"));

  const state = new Map(layers.map((l) => [l.id, structuredClone(l)]));
  const map = {
    getLayer: (id) => state.get(id),
    setLayoutProperty(id, key, value) {
      state.get(id).layout[key] = value;
    },
    setFilter(id, filter) {
      state.get(id).filter = filter;
    },
  };

  updateTerritoryHighlight(map, "NC", true);
  assert.ok([...state.values()].every((l) => l.layout.visibility === "none"));

  updateTerritoryHighlight(map, null, false);
  assert.ok([...state.values()].every((l) => l.layout.visibility === "none"));

  updateTerritoryHighlight(map, "somaliland", false);
  assert.ok([...state.values()].every((l) => l.layout.visibility === "visible" && l.filter.at(-1) === "somaliland"));
});

test("all 55 territories are searchable in Korean, English and aliases with linked countries and map focus", () => {
  for (const t of MAP_TERRITORIES) {
    for (const q of [t.nameKo, t.nameEn]) {
      const results = searchCountryMatches(explorationRoster, q, { includeTerritories: true });
      const found = results.find((m) => m.kind === "territory" && m.territory.key === t.key);
      assert.ok(found, `Expected territory ${t.key} to match query "${q}"`);
      assert.equal(found.country.code, t.linkedCode);
    }

    const bounds = territoryFocusBounds(geo, t.key, t.coordinates);
    assert.ok(bounds && bounds.length === 2, `Missing focus bounds for ${t.key}`);
    let framed = null;
    const map = {
      getCenter: () => ({ lng: 0 }),
      stop() {},
      setRenderWorldCopies() {},
      fitBounds(b) {
        framed = b;
      },
    };
    assert.equal(focusMapTerritory(map, geo, t, 0), true, `focusMapTerritory failed for ${t.key}`);
    assert.ok(framed, `fitBounds not called for ${t.key}`);
  }

  for (const [query, expectedKey, expectedCode] of [
    ["홍콩", "HK", "CN"],
    ["Hong Kong", "HK", "CN"],
    ["마카오", "MO", "CN"],
    ["소말릴란드", "somaliland", "SO"],
    ["소말린란드", "somaliland", "SO"],
    ["푸에르토리코", "PR", "US"],
    ["산후안", "PR", "US"],
    ["누벨칼레도니", "NC", "FR"],
    ["뉴칼레도니아", "NC", "FR"],
    ["타히티", "PF", "FR"],
    ["사이판", "MP", "US"],
    ["괌", "GU", "US"],
  ]) {
    const results = searchCountryMatches(explorationRoster, query, { includeTerritories: true });
    assert.equal(results[0]?.kind, "territory", `Query "${query}" should surface territory first`);
    assert.equal(results[0]?.territory?.key, expectedKey, `Query "${query}" key mismatch`);
    assert.equal(results[0]?.country?.code, expectedCode, `Query "${query}" linkedCode mismatch`);
  }

  // Verify Hong Kong focus bounds stay tightly around Hong Kong (~114°E, 22°N), not all of China
  const hkBounds = territoryFocusBounds(geo, "HK", territoryByKey.get("HK").coordinates);
  assert.ok(hkBounds[0][0] > 113 && hkBounds[1][0] < 115, `HK lng bounds: ${JSON.stringify(hkBounds)}`);
  assert.ok(hkBounds[0][1] > 21.5 && hkBounds[1][1] < 23, `HK lat bounds: ${JSON.stringify(hkBounds)}`);
});
