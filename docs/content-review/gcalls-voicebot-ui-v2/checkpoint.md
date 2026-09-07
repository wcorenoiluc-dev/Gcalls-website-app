# CHECKPOINT — GCALLS Voicebot AI UI V2 (local preview)

Local/private. Parallel track 4. **No push, no deploy, no WordPress port.**
Voicebot remains a **solution** (not one of the 3 products); taxonomy unchanged.

## Environment
| | |
| --- | --- |
| Worktree | `/Users/macos/Desktop/Gcalls/App/gcalls-voicebot-ui-v2` |
| Branch | `feature/gcalls-voicebot-ui-v2` |
| Base SHA (immutable) | `9c562e7` (same base as plus/qaqc/cx workers) |
| Dev server | `http://127.0.0.1:5176/voicebot-ai/` → HTTP 200 (vite, `--strictPort`) |
| Deps | symlinked from main checkout (lockfiles byte-identical) — no network install |

## What changed (exact file list)
Tracked (vs `9c562e7`):
- `src/pages/VoicebotAiPage.tsx` — `vb-page` scope wrapper + import page CSS
- `src/components/voicebot/sections.tsx` — hero 44/56 split; both visuals now use the media slot
- `src/components/voicebot/visuals.tsx` — fabricated mockups → neutral diagrams

New:
- `src/components/voicebot/MediaSlot.tsx` — page-local media slot (stable 16:10, classification label, real-image fallback)
- `src/styles/voicebot.css` — page-scoped 1180 container + 50px seam (mirrors `gcalls-plus.css`; shared primitives untouched)
- `scripts/voicebot-fabricated-scan.mjs` — standing fabricated-data guard
- `scripts/voicebot-qa-capture.mjs` — 6-breakpoint QA + capture (system Chrome via playwright-core)
- `docs/content-review/gcalls-voicebot-ui-v2/` — this bundle

**No file outside Voicebot scope was modified** (regression proof).

## Content contract
Breadcrumb + **12 content components** + exactly **1 H1** (in `VoicebotHero`), in the approved order 1–12. Final CTA appears once. Copy unchanged.

## Measurements (before → after)
| | Before (base) | After |
| --- | --- | --- |
| Desktop container | 1280px | **1180px** (page-scoped) |
| Section seam | section block padding (112–192px between content) | **50px** (25px each side) |
| Hero split (desktop) | 50/50 (`lg:grid-cols-2`) | **44/56** (`lg:grid-cols-[44fr_56fr]`) |
| Fabricated values | 14 (counts, %, lead IDs, times) | **0** |

## Signals
- `VOICEBOT_CONTENT_PASS` — 12 components + 1 H1 + 1 final CTA, order correct, copy untouched.
- `VOICEBOT_FABRICATED_DATA_ZERO` — source scan PASS + rendered-DOM scan `bannedHits:[]` at all 6 breakpoints.
- `VOICEBOT_PII_ZERO` — no real names/phones/emails; diagrams carry no data. (0 images on page.)
- `VOICEBOT_UI_LOCAL_PASS` — at 1440/1280/1024/768/390/320: 0 overflow, 0 broken image, 0 empty section, 0 raw shortcode, 0 `#` href, 0 duplicate CTA, diagrams readable at 320px. (See `qa-report.json`.)
- `VOICEBOT_REGRESSION_PASS` — only Voicebot-scope files changed vs base; live metrics for `/`, `/gcalls-plus-webphone/`, `/qc-bot-ai/`, `/gcalls-cx/`, `/san-pham/`, `/giai-phap/` unchanged, 0 console errors (`regression.json`).
- `VOICEBOT_REAL_MEDIA_SOURCE_REQUIRED` — repo has NO real Voicebot screenshot; both slots render diagram fallbacks and will accept a real, PII-cleared image with no layout shift (`media-slot-manifest.json`). Do not borrow Gcalls Plus/CX/QA-QC imagery.
- `VOICEBOT_UI_REVIEW_PENDING_OWNER` — awaiting owner visual review.

## Tests run
- typecheck (`tsc --build --force`) — PASS
- unit (`npm run test`, loss-estimator) — PASS
- production build (`vite build`) — PASS (10.15s; only the pre-existing chunk-size advisory)
- fabricated-data scan — PASS
- content contract + route regression (browser) — PASS

## Notes / flags
- One **transient** console 404 appeared only on the first batch load at 1440 (favicon race); a clean reload shows **zero** failed requests, and the page references 0 images. Not a defect introduced by this work.
- 1180 container + 50px seam are applied **page-locally** (scope class), matching how `/gcalls-plus-webphone/` already does it — shared primitives (`Container`, `Section`) were not modified.

## Deliverables in this folder
`checkpoint.md` · `fabricated-data-audit.md` · `media-slot-manifest.json` · `qa-report.json` · `regression.json` · `screenshots/` (voicebot-{1440,1280,1024,768,390,320}.png, hero-{1440,390}.png, section-NN.png)

**Stop point:** no push, no WordPress port, no deploy, no fifth product writer. Awaiting owner visual review.
