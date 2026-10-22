# Country learning cards and single-page activities — visual QA

- Reference: `artwork/references/flag-learning-card-reference.jpg`, 1080 × 1403 pixels.
- Membership reference: `artwork/references/priority-48-list.jpg`, 1078 × 606 pixels.
- Implemented surface: capital/seat header, official SVG flag and continent-coloured bilingual footer in `src/CountryCardFace.jsx`, shared by exploration and the country collection.
- Activity layout: one top row for brand, Explore / Capital quiz / Colour flags / Create flag, search, stamps/card collection and language; paged stories below.
- User baseline evidence: five annotated v15 region crops at 1867×887, preserved in artwork/references/studio-annotation-01.png through -05.png. Updated implementation screenshot, viewport comparison and device density verification: unavailable.

The printed examples establish the card anatomy. Magnification circles and arrows are explanatory annotations and were not added to the app. Story buttons correspond to actual pages; collected and solved indicators use actual stored progress.

## Verification performed

- All 91 automated checks passed, covering learning data, quizzes, map geometry, drawing and erasing, independent Taegeuk parts, named custom countries, persistence, cloth mesh and pole attachment math, saved-country painting completion, the complete 45-item guide bindings and preservation of the earlier Nassau scene.
- Seven official-geometry motifs and six additional geometric motifs, plus three direct basic shapes, provide 16 choices. All new motifs render without source colours. The 13-motif server-rendered fixture parsed as valid XML with 13 unique masks and resolved references. Taegeuk was split into complementary SVG paths: 4,927 pure-colour offline raster samples matched upper/lower hit-region selection. A second raster fixture verified separate pen masks and a white lower-half eraser mark. This validates export geometry and masking with a raster renderer, not browser Path2D, real pointer or screenshot QA.
- Custom countries use the existing device-local gallery and provide named SVG downloads. The card collection exposes My countries, Edit and 3D wave actions. Real map/quiz roster membership is unchanged.
- The WebGL preview uses a subdivided cloth mesh and the saved SVG texture; pause, wind, reduced motion and fallback paths are implemented. A real GPU render, texture orientation, browser SVG masking and fallback interaction have not been exercised here.
- Country and custom flag drafts are kept separately. Undo history survives activity changes during the visit; painting/tool/width/extra palette survive a reload. Historical undo snapshots are not written to storage.
- Tuvalu's pin was corrected using the government-published location code. Its capital remains Funafuti, with context explaining the atoll and government offices at Vaiaku. This is one correction, not a completed 197-country precision audit.
- Flags use direct local SVG images; the global flag-icon stylesheet and duplicate bundled flag variants are no longer imported.

## Postcard verification

- The guide bundle contains 45 separate 1536×1024 WebPs: 41 newly generated scenes and 4 visually approved reuses. All originals were inspected for scene, style and unwanted marks. Tiny facade pseudo-lettering on VA was removed with image editing and the replacement was reviewed.
- All 45 high-quality ZIP images and all 110 selected v14 app postcard files decoded successfully. Fixed filenames and guide/catalogue number separation were checked. The 41 new scenes include a separate Bahamas variant; its old Nassau app asset, metadata and original remain preserved.
- GQ, SS and BS learning stories/keywords were matched to the chosen scene. Capital locations remain separate from postcard landmarks.
- This does not establish browser-card fit, lazy-loading behavior or visual correctness on the target devices. Those checks remain below. v14 publication was confirmed by the native deployment result.

## Backup import and two-size media checks

- The actual split archive passed ZIP CRC verification; all 166 received files decoded. 87 missing-country selections were reviewed in labelled contact sheets with bilingual captions; duplicates and existing scenes were preserved. The original forty supplied files matched existing asset bytes.
- All 197 full-size images and 197 640px previews decoded with expected dimensions. Imported full images retain exact uploaded hashes. Preview bytes total 14,815,914 versus 97,989,718 full-image bytes (84.9% smaller). No upscaling.
- Server-rendered component checks show only a lazy preview in the small card and no full-image markup before opening. An opened viewer includes only the selected country. This is not an actual browser request trace or interaction pass.
- Check clicking/keyboard opening, modal focus and Escape, background inertness, retry, download and image fit on target devices. Verify that the full file is not requested before opening and only the selected full image is requested.

## Capture blocker

The supervised preview still has no available mailbox: both the current start and status calls report unavailable infrastructure. No second unchanged start was attempted, and no daemon/mailbox/binary was changed. Previous diagnostics also showed an unavailable browser bridge.

The current Sites troubleshooting contract classifies the missing mailbox/browser bridge as infrastructure and permits finishing implementation and hosting without representing unavailable browser QA as passed. Do not repeat alternative hosts, ports, mailbox changes or daemon launches.

## Remaining visual and interaction checks

- Compare a browser-rendered card and the reference together: typography, spacing, colours, flag fit and bilingual names.
- Capture KR, ZA, GB and CH/NL/BO exceptions in both languages.
- Inspect desktop 1366 × 768, tablet 1024 × 768, mobile 390 × 844 and a short viewport. Check every mode, story, tool, undo and save control.
- Exercise search/repeated focus, country-only highlights and capital pin anchoring while zooming.
- Exercise mouse, touch and keyboard gestures, including cancelled strokes, pan/pinch rejection, draft restoration, gallery reopen, export and printing.
- Inspect browser console and network failures.
- Open the 45 updated/reused guide cards in both languages, check captions and artwork keywords, and verify image fit and loading on the 197 connected cards.
- Verify the compact header at 1366 × 768, 1024 × 768 and 390 × 844, including the horizontally scrollable narrow toolbar and unclipped search overlay.
- Add and recolour all 16 shapes and motifs, including each Taegeuk half; check holes, overlaid shapes, rotation, handles, cancelled gestures, keyboard moves/deletion and moving/resizing existing strokes.
- Save named countries, reopen from My countries, update without duplicate cards, create a separate country, and download/print the exact SVG.
- Exercise WebGL animation, texture orientation, edge anchoring, pause, wind, reduced motion, unsupported/lost context fallback and closing/reopening the preview.

No screenshot comparison, browser interaction pass, overflow pass or console check is claimed. Publication is tracked separately in `TASKS.md`.

final result: blocked

Current publication evidence: v22, source 223216212949b862bb34431dee56241e8e8b8b2b, native deployment appgdep_6abe7f15bb848191b40b5e22184481c7 succeeded at 2026-10-01T15:41:27.960671+00:00 on https://flags.zap15.chatgpt.site. Final build and four Sites server checks passed (included in the 91 tests, not added to the total). Browser QA remains blocked.


## Annotated custom-flag changes

- Required/optional names move beside the studio title. New flag, arrow Undo, Finish & save, custom feedback and gallery are in the sidebar. The custom canvas footer is removed and its container grows at 3:2. Motif label has no count and uses a single line. All 16 shapes remain.
- The sixth tool is an eyedropper reading visible composited pixels; custom SVG sampling is asynchronous, official sampling reads the displayed canvas. No paint action is created by picking.
- Wave/print/download use a successfully saved unchanged snapshot; modifying the draft hides them until saved again. Storage failure does not enable options. Tests cover undo/reopen/reload and whitespace-normalized names.
- 64 automated tests passed. Bilingual server rendering confirmed header names, six tools, left workflow, no canvas footer and completion options only for saved unchanged artwork. These checks are separate from CSS layout, actual pointer gestures, SVG-to-canvas browser decoding and GPU checks.
- Check names on the header, short motif trigger, six slots, left action order, save-completion options and increased paper area at the supplied 1867×887 and the existing target viewports. The supplied crops are before-change evidence only.

## Pole/sky and concise control update

- Current user screenshots are preserved as wave-preview-before.png and studio-compact-actions-reference.png. flag-pole-sky-reference.png is a stock photo composition reference; its watermarked pixels are not used in the deployed scene.
- Generated sky-only artwork was inspected before integration: 1536×1024 original, 1440×960 WebP at 101,570 bytes. Natural blue sky and clouds, no text/flag/pole/watermark. It loads with the opened preview only.
- A 3D metal cylinder, finial and hoist collars share the cloth projection. Added mathematical tests establish fixed hoist attachment over varied time/wind, bounded finite cloth positions and valid pole normals. Shaders use matching varying precision and clean up both programs. No browser shader compile or actual GPU render is claimed.
- Short Undo/Finish labels, persistent save check, transient control feedback and filled sampled-colour eyedropper replace normal workflow paragraphs. Tool→colour→shape order is represented in both DOM and responsive CSS. Essential errors and accessible announcements remain.
- All 66 tests passed. Bilingual offline server rendering verified six tools, short actions, DOM order and absence of custom workflow/palette explanation. This does not establish actual button animation, colour visibility, CSS layout, asynchronous SVG sampling or touch behavior.
- Check white/black sampled icon visibility, repeated picking/undo/saves, completed-state changes, desktop/mobile control order, pole contact throughout waving, context-loss fallback, sky fit and cloth quality. A complete product audit remains unavailable while the supervised preview infrastructure is blocked.

## Shared colouring/creation structure

- Country selection is in the colouring header. Both modes share the same sidebar workflow/tool/colour layout and have no easel footer or external gallery. Original flag reference is in the colouring sidebar; editable shapes remain personal flags only.
- Official colouring retains 4:3 canvas, white-paper grading, tiny emblem preservation, textures and region clipping. Check flag is separate from Finish/save. Saved unchanged country paintings expose left Print/Download; edited or failed-save drafts do not.
- All 67 tests passed, including country-bound completion, update, reload, undo and failed-save cases. Bilingual SSR confirmed header selector with 197 options, six tools, left order/reference/gallery, no canvas footer, and saved-country output options in both modes. This is not real CSS overflow, SVG decoding, gesture or focus verification.
- Inspect both tabs together at existing target viewports, check reference visibility, button order, country selection on narrow screens, successful completion vs grading feedback, cancellation during multi-touch and saved-art reopening. Browser QA is still blocked by the known preview infrastructure failure; no workaround browser/server was used.


## Colouring search and earned flag preview

- The colouring header uses an editable combobox with a selected-country flag. Its viewport-positioned result portal has official SVG thumbnails, localized names, capitals and alternate country names, with a full scrollable roster when empty. Shared normalization searches country/capital aliases independent of the UI language. Exact matches precede partial results.
- Check flag retains exact overall area accuracy; >=90% exposes a Wave flag action using a snapshot of the checked painting. Editing or a country/readiness mismatch blocks that snapshot. New paper and reopening require checking again. Saving/print/download remain separate, and the original per-region completion and white-paper semantics remain.
- The renderer uses the SVG's ratio for cloth width and pole placement. Mathematical checks cover 4:3, 3:2 and square dimensions and fixed hoist contact over varied time/wind. These checks do not establish browser shader compilation or a GPU render.
- All 74 tests passed. Search tests cover all four bilingual fields for every one of the 197 countries, aliases, normalization/ranking/no-match/full roster; reward tests cover 89.9% vs 90%, invalid scores, saving-independent identity, changed paint/country/readiness and legacy area grading. Four offline SSR cases verified selected flag/search only in colouring, personal names only in creation, six tools, reference and no canvas footer/unearned wave button.
- Still inspect the portal under clipping/scrolling, mobile keyboard, IME, arrow/Enter/Escape/Tab and outside focus, result flag loading, graded painting edits/undo/rechecks, correct 4:3 painted texture orientation, pole contact, reduced motion and fallback. Browser evidence remains unavailable; the known preview mailbox failure was not retried unchanged, and no alternate server/browser or production QA was used.


## Collection and long-press shapes

- Fixed controls and a dedicated scroll region separate the collection's finite viewport from a natural-height, max-content-row card grid. All 197/priority/visited collections use the shared bilingual country/capital search; personal cards use their own bilingual names. Lazy flag loading, counts, empty results and failed deletion feedback are implemented.
- Personal card trash opens an in-card confirmation, writes only that custom item removal, refreshes the gallery and restores focus to search. Unavailable storage and read/write failures preserve the previous collection. Drafts are retained; this does not claim a server-backed account library or automatic draft deletion.
- Shape holds activate after 480ms and 8px movement tolerance. Pure timer/intent tests establish short tap vs hold, drawing movement, replacement/cancelled presses and other-pointer rejection. Movement/deletion keeps existing undo and part-aware geometry; editor/trash controls and preview strokes are excluded from SVG output. Actual browser pointer capture, long press, SVG hit testing, focus, keyboard and undo interaction remain unverified.
- Four functional neutral motifs bring the choices to 20. Saved/reloaded/painted/moved/resized/deleted geometry checks passed. An offline sheet from FlagSymbol passed 15 interior/exterior raster samples and visual shape inspection using the installed SVG renderer. This is not actual browser Path2D or a touch pass.
- North Korea is displayed as 북한 with retained old search alias; related base facts are updated and unrelated 조선소 text retained. Existing capital name and location remain.
- All 83 tests passed. Four bilingual server renders verified 197 official card images, one personal fixture, a search input, scroll region, lazy images and personal trash action. The supervised preview still fails at the unavailable mailbox on start and status; no unchanged retry or alternate browser/server was used. Q10 tracks desktop/mobile card overlap, scrolling, filter/search focus, deletion confirmation/errors, 200% zoom, long-press vs drawing, pointer cancel, undo and new motifs.


## Population and capital choices

- CountryCardFace displays population directly between the flag and country-name footer, in exploration and collection cards. UN 2025 projection attribution is visible. All 197 entries match source country/year/variant/location-code rows; low counts remain nonzero. 394 bilingual lazy-card SSR cases passed.
- A question uses one random snapshot of three actual same-continent capitals, with sufficiently separated pins. Twelve seeded samples per country passed distinct answer/country/location, exactly one correct target and projected separation checks. Pacific framing uses the shortest longitude interval; all generated coordinates fall inside the frame. The map also refits on resize and the reset button restores all three cities. This is geometry evidence, not a screenshot or actual MapLibre layout pass.
- Six bilingual answer component SSR cases passed: exactly three cities; no country hint before choosing; wrong-capital country flag/tooltip and disabled answers after an outcome; correct star overlay and status feedback. Reduced motion suppresses shake/celebration animations.
- Shape trash prompt is timed for two seconds and renewed on selection, while move/resize controls and sidebar deletion remain. Actual hold/selection/cancellation/focus and timer behavior need browser confirmation.
- Q11 remains open for wide/narrow/short/rotated viewports, three city labels and long names, tooltip clipping, pin/button outcomes, zoom/refit, motion preferences and timed trash interaction. Managed preview infrastructure remains blocked; no alternate server/browser or production QA was used.


## Fair quiz and final source review (2026-10-02)

- New current user evidence: `artwork/references/quiz-answer-highlight-20261002.jpg`, 1080×842, copied without alteration and inspected. It shows the correct UAE territory distinctly orange before answering and a Korean question split leaving ‘요?’ alone. Those two findings are screenshot-grounded. The top toolbar, other modes and result interaction are outside the crop.
- Both highlighted-country layers now have hidden layout in initial quiz styles and are hidden/restored during mode and selection updates before browser paint. Four new tests cover initial and transitioned layer policy, correct-only once-per-question auto advancement after 550ms, cancellation and stale callbacks. This validates policy/timing code rather than an actual browser render.
- Immediate correct feedback fits the advance interval. Explicit actions cancel pending navigation; hidden tabs pause and may resume the current question on visibility return. New quiz headings receive keyboard focus, repeated native/React answers have a lock, IME Enter is protected, and timed trash focus returns to the selected shape. Actual touch, keyboard, screen reader and background-tab behavior remain unverified.
- 91 tests passed, with current bilingual collection SSR (197 flags/populations/search/scroll) and six quiz result SSR states. Favicon SVG and 32/180px PNGs use the existing licensed globe; PNG files decoded and the 180px icon was inspected. Real tab/home-screen presentation is open.
- `UIUX_FINAL_REVIEW.md` records every reviewed surface with its evidence level. The managed preview mailbox remains absent, so a complete screenshot-based flow audit could not be performed. Do not mark Q12 or earlier visual/touch/GPU items passed, and do not use publication success as substitute evidence.
