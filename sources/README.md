# Country learning database (reviewed 2026-10-01)

`src/basic-country-data.json` contains 197 bilingual country records. It is reproducibly authored by `node scripts/build-basic-country-data.mjs`; the pre-existing 40 detailed learning records and postcard assets take precedence in `src/learning-data.js` and `src/data.js`.

- Country names, regions, borders and languages: Mohammed Le Doze, [mledoze/countries](https://github.com/mledoze/countries), world-countries 5.1.0, Open Database License 1.0.
- Capital coordinate baseline: [World Bank country API](https://api.worldbank.org/v2/country?format=json&per_page=400), snapshot `worldbank-countries.json`. Reviewed city-coordinate overrides replace obvious country-centroid errors and outdated seats. City points identify the capital area, not a particular government building.
- Cultural/natural heritage: UNESCO World Heritage Centre country pages, recorded in `heritage-references.json`; per-record source URLs are retained. Places on a tentative list are not labelled inscribed World Heritage sites.
- Equatorial Guinea's 2026 capital change, Sri Lanka's legislative capital, and Nauru's lack of an official capital have additional primary sources in their records. Countries with multiple or disputed seats include explicit bilingual notes/role labels.

The baseline database and its ODbL notice are available as `/data/learning-basics.json` and `/data/country-data-license.txt`. New records do not invent population estimates or postcard assets. Detailed editorial stories retain the existing country-specific enrichment.

## All-country population snapshot

`un-wpp2024-population-2025-extract.json` contains the Country/Area rows for 2025 from the United Nations **World Population Prospects 2024, GEN/01/REV1**, Medium variant workbook. It records the exact source URL, original workbook SHA-256, source column names, UN location codes, retrieval date and CC BY 3.0 IGO license. The extraction retains the 1 July population column in thousands; it is a projection for 2025, rather than a 2026 live count. Source: [UN Population Division](https://population.un.org/wpp/).

`node scripts/build-population-data.mjs` joins all 197 roster entries by ISO2 code, asserts the country/year/variant and positive numeric values, multiplies by 1,000 and rounds to whole persons. Its output is `src/population-data.json`. VA (Holy See), TW and XK have identified source rows, without borrowed regional totals or substituted neighbouring countries. The new authoritative snapshot supersedes the earlier rounded forty-country population values while preserving stories and keywords. Cards display the year and UN attribution in both languages; small populations retain a nonzero whole-person display. Display values are approximate and are not presented as a census.

OG cover: generated specifically for this app, resized/cropped to 1200×630 from the 1730×909 illustration. `public/og.png` is an actual static image available to sharing crawlers; metadata is in `index.html`.

Validation: exhaustive 197-country text/coordinate/flag/quiz integrity checks, white-paper/eraser grading regression tests, antimeridian and map focus tests, Worker tests and production build. Browser preview infrastructure is unavailable in this environment; device interaction and layout were not browser-tested.

## Three-story education edition / v23 (2026-10-02)

`learning-stories-20261002.tsv` contains 137 individually authored country drafts: two new bilingual story pairs and nine bilingual keyword candidates per country. The first story retains the reviewed country/capital or government-seat explanation. `learning-enrichment-sources.json` identifies the primary references for the new stories, including UNESCO, official governments and tourism bodies, the Smithsonian collection and a conservation project organisation. World Heritage nominations and biosphere reserves are not represented as inscribed World Heritage sites.

Run `npm run build:learning` to compile `src/country-learning-enrichment.json` and the complete public `learning-content.json`. All 197 cards have three bilingual stories and ten unique keyword pairs. Existing detailed 60-country stories are retained; GQ/SS/BS gain missing keywords and Spain's construction-status sentence is replaced by stable information about branching columns. The prior detailed cards' retention is distinguished from a new factual review. Country roster, capital identities/notes/coordinates, population rows, quizzes and all postcard files remain intact.

The v23 package `/data/flags-197-learning-content-20261002.zip` contains the full three-story JSON, separate Korean/English Markdown, provenance, README and source notices. Its ZIP CRC and 197-country coverage were checked before publication. This text backup contains no postcard image files or executable app. The current generator creates the five-story package described below and preserves the v23 ZIP.

The new paragraphs use concrete comparisons, natural processes and cultural context rather than repeated generic heritage descriptions. First-person travel recommendations, current event predictions, unsourced superlatives and advertising are outside this edition. Data completeness and offline checks do not replace device/browser or independent all-capital coordinate review.


## Five-story education expansion (2026-10-02)

The current edition preserves all three-story v23 passages and keywords. `learning-three-story-edition.json` is the exact 197-country comparison snapshot. `learning-extra-stories-20261002.tsv` contains two additional bilingual passages per country (394 pairs), giving five per country and 985 total. `learning-story-expansion-sources.json` records primary references for every country and distinguishes factual anchors from original explanatory comparisons and guided activities. Capital/country linkages reuse the existing roster and are not a new independent coordinate audit.

Run `npm run build:learning`, `npm run check:learning` and `python3 scripts/package-learning-content.py`. The current seven-file package is `/data/flags-197-learning-content-5stories-20261002.zip`; the six-file v23 ZIP above remains a historical backup. The package verifies CRC, all 197 country codes, five story pairs each, and every Korean/English paragraph in the Markdown exports.
