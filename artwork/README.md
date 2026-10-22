# Country postcard assets

Existing 40 postcards are retained. The missing 157 countries are generated in 10-country batches from the bilingual learning descriptions; `postcard-plan.json` records the scene brief and source country text. Each new image is an original illustration produced with the built-in image generator, not a photograph or a substitute for a national flag.

- App files: `public/assets/postcards/<iso2>.webp`, 1024px wide, quality 87, no upscaling.
- Per-image exact prompt, factual references, review notes and original dimensions: `artwork/postcards/<iso2>.json`.
- App country/caption bindings: `src/postcard-assets.json`. Missing work is not marked complete or bound to a nonexistent image.
- The root owner reviews outputs before integration. New postcard artwork uses contain sizing so tall buildings and wide archaeology remain visible in the compact cards.
- Originals are retained in the conversation workspace; full-size quality-94 WebP exports are packaged in country bundles of up to 50 assets with an index and generation metadata.
- `postcard-progress.json` records actual completed bindings and any generation block. Pending prompts and source checks are in `next-batch/`; they are preparation, not completed images. If the workspace expires, restore full-size exports from the saved postcard ZIPs before packaging another combined range; never substitute or upscale the app's compressed copies.

Source file integration is an authoring operation using Sharp (installed in the Codex runtime, or available as a local `sharp` package), separate from the app build. To integrate a reviewed batch, run `node scripts/integrate-postcards.mjs /absolute/path/batch/manifest.json`.
