# CHECKPOINT — GCALLS Industries Hub `/nganh/` UI V2 (local preview)

Local/private. Parallel track. **No push, no deploy, no WordPress port.**
A wayfinding hub: recognise your industry context, go to the right industry page.
No benchmark, no result, no "Gcalls fits every business in the industry" claim.

## Environment
| | |
| --- | --- |
| Worktree | `/Users/macos/Desktop/Gcalls/App/Gcalls-industries-hub-ui-v2` |
| Branch | `feature/gcalls-industries-hub-ui-v2` |
| Base SHA (immutable) | `9c562e7` |
| Dev server | `http://127.0.0.1:5213/nganh/` → HTTP 200 (vite `--strictPort`, port 5213) |
| Deps | node_modules symlinked from main checkout (lockfiles byte-identical) |

## Exact changed files
Tracked (vs `9c562e7`): `src/pages/IndustriesHubPage.tsx`
New:
- `src/components/industries-hub/IndustriesHubLayout.tsx` — page-local layout over shared primitives
- `src/components/industries-hub/HeroOrientationDiagram.tsx` — six contexts around Gcalls
- `src/components/industries-hub/icons.ts` — industry → Lucide icon, keyed by route
- `src/styles/industries-hub.css` — page-scoped 1180 container + 50px seam (`.ind-page`)
- `scripts/industries-hub-verify.mjs`, `scripts/industries-hub-qa-capture.mjs`
- `docs/content-review/gcalls-industries-hub-ui-v2/` — this bundle

**Not modified:** `src/data/hubs.ts` (Solutions Hub worker owns it), `HubLayout.tsx`, industry child pages, other hubs, primitives, navigation, blog/form/WordPress.

## Content contract (all rendered)
Breadcrumb · hero · direct answer · six industry cards · qualification note · onward links · final CTA. Exactly one `<h1>`: "Giải pháp giao tiếp theo bối cảnh vận hành của từng ngành". Full field-by-field map in `source-field-reconciliation.md`.

## Layout
- Cards: **3×2 desktop**, **2×3 tablet**, **1 column mobile**; equal height; CTAs on the bottom baseline (`mt-auto`).
- Hero: light, copy 44 / diagram 56 on desktop; one column on mobile.
- Each card: icon + title + context + product/solution tags + specific CTA + accessible link name (`aria-label`).

## Measurements (before → after)
| | Before (shared HubLayout) | After |
| --- | --- | --- |
| Desktop container | 1280px | **1180px** (page-scoped) |
| Section seam | section block padding (112–192px) | **50px** |
| Hero | copy only, no visual | copy + **orientation diagram** (6 contexts) |
| Cards | no icon | **per-industry wayfinding icon** |

## Gates (see `qa-report.json`, `route-verification.json`)
At 1440/1280/1024/768/390/320: **6 industry cards, 6 distinct titles, correct tags per card**, 1 H1, every source field rendered, 0 fabricated KPI/benchmark, 0 PII, 0 customer logo, 0 `href="#"`, 0 broken route, 0 overflow, 0 empty grid track, 0 heading orphan, 0 task-caused console error.
Route contract — all six child routes loaded directly: **HTTP 200, exactly one H1, correct final path, no redirect away, none pointing at `/lien-he/`.**

## Tests
typecheck PASS · unit (`npm run test`) PASS · production build PASS (7.12s; only the pre-existing chunk-size advisory) · `industries-hub-verify.mjs` PASS (claim guard + six-industry/route/tag contract).

## Regression
Only `IndustriesHubPage.tsx` changed vs base → every other route byte-identical by construction. Live sanity metrics for `/`, `/san-pham/`, `/giai-phap/`, `/tich-hop/`, `/tai-nguyen/`, `/cong-ty/` and all six child pages: 1 H1, 0 broken, 0 overflow (`regression.json`).

## Signals
`INDUSTRIES_HUB_CONTENT_PASS` · `INDUSTRIES_HUB_CARD_6_PASS` · `INDUSTRIES_HUB_ROUTES_PASS` · `INDUSTRIES_HUB_CLAIM_GUARD_PASS` · `INDUSTRIES_HUB_PII_ZERO` · `INDUSTRIES_HUB_UI_LOCAL_PASS` · `INDUSTRIES_HUB_REVIEW_PENDING_OWNER`

## Notes
- 1180 container + 50px seam are applied via the `.ind-page` scope class, mirroring `gcalls-plus.css` / `voicebot.css`; shared primitives untouched.
- The only console message anywhere is a transient favicon 404 (environmental; page references 0 raster images).
- A stale shared Vite cache initially served the old layout; resolved with a `--force` restart. All results above are from the correct build.

## Deliverables in this folder
`checkpoint.md` · `source-field-reconciliation.md` · `qa-report.json` · `route-verification.json` · `regression.json` · `screenshots/` (nganh-{1440,1280,1024,768,390,320}.png, hero-{1440,390}.png, grid-{1440,768}.png)

**Stop point:** after gates PASS, local checkpoint commit only — no push, no deploy, no WordPress, no child-page work.
