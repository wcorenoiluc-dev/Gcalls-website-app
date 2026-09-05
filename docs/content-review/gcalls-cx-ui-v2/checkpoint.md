# Gcalls CX UI V2 — Checkpoint

**Branch:** `feature/gcalls-cx-ui-v2` · **Base SHA:** `9c562e7` (Gcalls Plus real-captures PASS)
**Deliverable commit:** `736ef8f` · **Worktree:** `/Users/macos/Desktop/Gcalls/App/gcalls-cx-ui-v2`
**Date:** 2026-09-05

## Outcome in one line
`/gcalls-cx/` ships the locked content contract (breadcrumb + 19 sections, one H1) with **neutral,
clearly-labelled "Giao diện minh họa" layout diagrams** — no fabricated data, no PII, no published
media — per the owner's media-review decision. The owner-supplied capture ZIP stays private.

## Decisions taken (owner-confirmed)
1. **Media policy → neutral diagrams only.** The 58-image ZIP is a *different* product (PitelCX)
   with branding inside content and pervasive PII. Owner chose not to mask/rebrand/publish any of it.
   Signals raised: `GCALLS_CX_BRANDING_DECISION_REQUIRED`, `GCALLS_CX_MEDIA_REVIEW_PENDING_OWNER`.
2. **Collision → enforce neutral track.** A concurrent worker co-edited this worktree with a
   "publish masked crops + external Gcalls-CX frame" approach. Owner chose to enforce the
   neutral-diagram track. See "Concurrency escalation" below.

## What changed (commit 736ef8f — CX-scoped only)
- `src/components/gcalls-cx/visuals.tsx` — the four fabricated mockups
  (`OmnichannelInboxMockup`/`TicketPanelMockup`/`CustomerContextMockup`/`CxReportingMockup`) replaced
  by neutral diagrams (`InboxDiagram`/`TicketDiagram`/`CustomerContextDiagram`/`ReportingDiagram`).
  Every text/figure slot is a skeleton bar; only the five verified channels and generic UI-state
  chips (Chờ xử lý / Đang xử lý / Đã xong) carry real labels.
- `src/components/gcalls-cx/sections.tsx` — wire the diagrams, caption every visual with
  `DIAGRAM_NOTE`, hero copy/visual split set to 44/56.
- `scripts/gcalls-cx-preview.mjs` — 6-breakpoint capture + gate + regression harness.
- **Unchanged:** locked copy in `src/data/gcallsCx.ts`; global primitives; navigation; shared
  product components; all routes outside `/gcalls-cx/`.

## Gate results (measured on 736ef8f — see screenshots/metrics.json)
| Gate | Result |
|---|---|
| breadcrumb + 19 content components (`main` children @1440) | **20** ✓ |
| exactly 1 H1 (all 6 breakpoints) | ✓ |
| 0 horizontal overflow (1440/1280/1024/768/390/320) | ✓ |
| 0 broken image | ✓ |
| 0 upscaled image (page uses 0 raster images — diagrams are DOM) | ✓ |
| 0 fabricated KPI (`#T-2043`, `47`, `312`, %/CSAT/FCR/SLA) | ✓ (grep-verified + visual) |
| 0 PII | ✓ (no data rendered; ZIP kept private) |
| 0 raw shortcode | ✓ (React app) |
| one final CTA, no duplicate | ✓ (FinalCtaBand §19; PricingCtaBand §17 is a distinct pricing band) |
| console errors | only the **pre-existing site-wide `/favicon.ico` 404** on first load (identical on `/`); not introduced here |

## Regression (6 routes must not change) — all healthy, see regression-report.md
`/` · `/gcalls-plus-webphone/` · `/qc-bot-ai/` · `/voicebot-ai/` · `/san-pham/` · `/giai-phap/`
each: H1=1, container=1440, overflow=0, broken=0, console-errors=0. By construction the committed diff
touches only CX files, so these routes are byte-identical to base `9c562e7`.

## Signals
- `GCALLS_CX_CONTENT_PASS` — breadcrumb + 19 sections, 1 H1, locked copy intact.
- `GCALLS_CX_FABRICATED_DATA_ZERO` — no ticket IDs / KPI values / percentages / fake names.
- `GCALLS_CX_PII_ZERO` — nothing personal rendered; source ZIP never published.
- `GCALLS_CX_UI_LOCAL_PASS` — 6-breakpoint gates pass on 736ef8f.
- `GCALLS_CX_MEDIA_REVIEW_PENDING_OWNER` — ZIP media reviewed, not used; owner may still decide otherwise.
- `GCALLS_CX_BRANDING_DECISION_REQUIRED` — the captures are PitelCX; equivalence/rebrand rights unresolved.

## Stop point (respected)
No push, no deploy, no WordPress port, no Voicebot work. Local commit only.

## ⚠ Concurrency escalation (needs owner action)
A second worker is **still active in this same worktree** and repeatedly rewrites
`src/components/gcalls-cx/sections.tsx`, re-creates `CxProductStage.tsx` / `CxScreenshotFrame.tsx`,
re-adds `GCALLS_CX_IMAGES` to `src/data/productImages.ts`, and re-publishes 5 masked `.webp` crops to
`public/images/products/gcalls-cx/`. This violates the brief's worktree-isolation rule.

- The **approved neutral deliverable is safe in commit `736ef8f`** (branch HEAD, 0 foreign refs).
- The **working tree is currently clobbered** by the other worker and will keep reverting until it is
  stopped. I did not enter an edit-war loop.
- **To restore the working tree once the other worker is stopped:**
  ```
  cd /Users/macos/Desktop/Gcalls/App/gcalls-cx-ui-v2
  git reset --hard 736ef8f && git clean -fd src public   # removes foreign crops/components
  ```
  (Do NOT run while the other worker is active — it will just re-clobber.)
