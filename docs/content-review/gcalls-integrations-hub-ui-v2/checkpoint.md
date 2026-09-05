# Integrations Hub UI V2 — Checkpoint

**Branch:** `feature/gcalls-integrations-hub-ui-v2` · **Base SHA:** `9c562e7`
**Worktree:** `/Users/macos/Desktop/Gcalls/App/Gcalls-integrations-hub-ui-v2`
**Dev server:** `npm run dev -- --host 127.0.0.1 --port 5212 --strictPort` (5212 was taken by another
worker, so this run used **port 5213**; PID recorded at run time = 40112, since stopped, port freed)
**Preview:** `http://127.0.0.1:5213/tich-hop/`
**Date:** 2026-09-05

## Outcome
`/tich-hop/` is a dedicated navigation hub (not the shared `HubLayout`) that renders every
`INTEGRATIONS_HUB` field, groups the five platforms as **CRM ×3 (three columns) + Helpdesk ×2 (two
balanced columns)**, adds a neutral **Gcalls → connection layer → CRM / Helpdesk / POS** diagram, and
keeps POS as a decision-guide system type — never a sixth platform card. One H1. No logos, no
partnership/certification claims. `src/data/hubs.ts` was NOT touched.

## Content contract — all 8 blocks rendered
1 breadcrumb · 2 hero (H1 + diagram) · 3 direct answer · 4 five platform cards · 5 disclaimer note
(inside the cards section) · 6 decision guide (4 rows) · 7 onward links · 8 single final CTA.
H1 = "Kết nối Gcalls với hệ thống doanh nghiệp đang sử dụng".

## Gate results (screenshots/metrics.json)
| Gate | Result |
|---|---|
| exactly 5 platform cards (links found) | **5** ✓ |
| CRM exactly 3 / Helpdesk exactly 2 | ✓ / ✓ |
| POS not turned into a fake platform | ✓ (diagram + guide only) |
| 1 H1 (all 6 breakpoints) | ✓ |
| every `INTEGRATIONS_HUB` field rendered | ✓ (see source-field-reconciliation.md) |
| 0 fabricated KPI | ✓ (no numbers on the page) |
| 0 PII | ✓ |
| 0 partnership/certification claim | ✓ (runtime body-text scan of 8 banned phrases) |
| 0 `href="#"` | ✓ |
| 0 broken route | ✓ (6/6 routes render, 1 H1, no redirect, not 404) |
| 0 overflow (1440/1280/1024/768/390/320) | ✓ |
| 0 empty grid track | ✓ (3 CRM in 3-col, 2 Helpdesk in 2-col) |
| 0 heading orphan | ✓ |
| console errors caused by task | **0** (only the pre-existing dev-server `/favicon.ico` 404, present site-wide) |

## Regression — only `/tich-hop/` changed
6 hub routes + 5 platform child pages captured at 1440: all H1=1, container=1440, 0 overflow, 0
broken, 0 console errors. Changed files: `src/pages/IntegrationsHubPage.tsx`,
`src/components/integrations-hub/*` (new), `scripts/integrations-hub-preview.mjs` (new). No `hubs.ts`,
no other hub, no child page, no global primitive edited. See regression-report.md + changed-files.md.

## Signals
`INTEGRATIONS_HUB_CONTENT_PASS` · `INTEGRATIONS_HUB_PLATFORM_5_PASS` · `INTEGRATIONS_HUB_ROUTES_PASS`
· `INTEGRATIONS_HUB_PARTNERSHIP_CLAIM_ZERO` · `INTEGRATIONS_HUB_PII_ZERO` ·
`INTEGRATIONS_HUB_UI_LOCAL_PASS` · `INTEGRATIONS_HUB_REVIEW_PENDING_OWNER`

## Stop point
Local checkpoint commit made after all gates PASS. No push, no deploy, no WordPress, no child-page work.
