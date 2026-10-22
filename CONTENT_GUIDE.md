# World learning content: first forty country cards

## Scope and batch order

The learning roster is 194 independent entries plus Taiwan, Palestine, and Kosovo, for 197 entries. This is a chosen learning list, not a claim that international recognition is universal. The map still depicts other Natural Earth geometries for geographic context. It uses the 1:10m vector country layer (255 geometries) so all 197 entries in this learning list have a mapped shape, including small island states.

Batch 1 covers ten countries across four continents, starting with Korea as requested: South Korea, Japan, China, India, France, Italy, the United Kingdom, the United States, Egypt, and Brazil.

Batch 2 extends the set with Mexico, Indonesia, Germany, Australia, Spain, Canada, Türkiye, Russia, Kenya, and Argentina. These countries complete the second set of ten detailed bilingual cards and map pins.

Batch 3 adds Thailand, Greece, South Africa, Norway, Peru, New Zealand, Morocco, Sweden, Viet Nam, and Saudi Arabia. South Africa's card explains that capital functions are split across Pretoria, Cape Town, and Bloemfontein; its map pin and map-quiz answer use Pretoria, the administrative capital.

Batch 4 adds Bangladesh, Nigeria, Portugal, Poland, Chile, Colombia, Finland, the Philippines, Pakistan, and Tanzania. The batch mixes capital-city landmarks with distinctive places farther away: for example, the Chilean map pin marks Santiago while its postcard shows Rapa Nui.

## Country card fields

Each country card should include:

- Stable ISO code, Korean and English country names, and the endonym when useful.
- Capital, verified longitude/latitude, and a flag SVG.
- Rounded population estimate with the reference year, source, and update date. Population is a changing estimate, so show “about” and a year rather than a precise live count.
- Three short, bilingual child facts spanning geography, people/culture, and a landmark or daily life.
- One postcard illustration with a landmark caption, accessible alt text, and a shared visual style.
- Ten bilingual search/quiz keywords tagged by type. Aim for a mix of places/landmarks, geography/nature, food, language/culture, and one more topic such as wildlife, art, sport, or history. Use the mix that fits the country rather than forcing an item that creates a stereotype.
- Mark two or three keywords that are clearly visible in the postcard. The card shows these with a star so learners can match the picture to its words. A capital pin still marks the capital even when the postcard depicts another place in the country.

The ten keywords are useful for country search, picture matching, “find it on the map” activities, word review, and future voice prompts. Keep them as typed data rather than one flat list so each game can choose the right kind.

## Illustration direction

Use a consistent 3:2 landscape storybook postcard, soft gouache and colored-pencil texture, no text or flags, and a clear landmark in a real geographic setting. When a country has an equally recognizable historic and contemporary visual, show both in one scene when it remains legible. For Korea, the approved direction is Bukchon Hanok Village in the foreground and N Seoul Tower on Namsan behind the rooftops. The user’s photo reference has the right subjects; the app art should omit the promotional “bucket list” lettering and match the illustrated postcard style.

## Population and accuracy

All 197 country cards now use identified UN World Population Prospects 2024 Medium-variant population projections for 1 July 2025, converted from thousands to whole persons. Preserve the year, source, variant and row/location-code metadata. The earlier forty-country UNFPA rounded figures described in the historical batch notes below are superseded by `src/population-data.json`; stories and keywords remain unchanged. The exact source extract and workbook hash are in `sources/un-wpp2024-population-2025-extract.json`, with reproduction and license notes in `sources/README.md`. Re-check capitals and coordinates independently; the map must not use country-centroid coordinates as if they were capital locations. Indonesia's capital transition is ongoing: Jakarta remains the capital until a presidential decree formally transfers status to Nusantara, which is under construction.

## Batch 1 status

- Postcard assets are present for all ten countries.
- Each has three bilingual facts and exactly ten bilingual keywords.
- Five core capital coordinates and quiz distractor sets existed before this batch; the remaining five in this batch add a capital pin and map quiz coordinates.
- Generated landmark illustrations are educational approximations, not documentary photographs. Review visual subject accuracy before adding later batches.

## Batch 2 status

- Postcard assets, detailed bilingual cards, capital pins, and three-choice map quizzes are present for all ten countries.
- Each has a rounded 2025 population estimate, three bilingual facts, and exactly ten bilingual typed keywords.
- The Indonesia card distinguishes Jakarta, the current capital, from planned future capital Nusantara.
- The Sagrada Família card reflects that its central tower was completed in 2026 while other construction work continues.
- Generated landmark illustrations are educational approximations, not documentary photographs.

## Batch 4 status

- Postcard assets, detailed bilingual cards, capital pins, and three-choice map quizzes are present for all ten countries.
- Each has a rounded 2025 population estimate, three bilingual facts, and exactly ten bilingual typed keywords.
- Postcard places and visible elements are linked to two or three starred keywords. When the illustration depicts a place away from the capital, the capital pin remains on the actual capital.
- Landmark art includes Lalbagh Fort, Aso Rock, Belém Tower, Warsaw Old Town, Rapa Nui moai, Cartagena's walled city, Helsinki Cathedral, Banaue Rice Terraces, Faisal Mosque, and Mount Kilimanjaro.
- Generated landmark illustrations are educational approximations, not documentary photographs.

## Batch 3 status

- Postcard assets, detailed bilingual cards, capital pins, and three-choice map quizzes are present for all ten countries.
- Each has a rounded 2025 population estimate, three bilingual facts, and exactly ten bilingual typed keywords.
- South Africa's three capital functions are explained; Pretoria is the administrative capital pin used for the location quiz.
- Landmark art includes the Bangkok Grand Palace, Athens Acropolis, Table Mountain, Geirangerfjord, Machu Picchu, Milford Sound, Marrakech, Stockholm's Gamla Stan, Ha Long Bay, and Hegra.
- Generated landmark illustrations are educational approximations, not documentary photographs.
