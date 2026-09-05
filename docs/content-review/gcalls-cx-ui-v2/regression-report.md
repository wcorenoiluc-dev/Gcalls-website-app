# Gcalls CX UI V2 — Regression Report

Candidate = commit `736ef8f`. Captured at 1440 via `scripts/gcalls-cx-preview.mjs`
(`screenshots/metrics.json` → `regression`, screenshots `regress-*-1440.png`).

**Structural proof:** the committed diff touches only `src/components/gcalls-cx/sections.tsx`,
`src/components/gcalls-cx/visuals.tsx` and `scripts/gcalls-cx-preview.mjs`. No source feeding any
route below changed, so each is byte-identical to base `9c562e7`. The captured metrics confirm health.

| Route | sections (`main>*`) | H1 | page height (px) | images | broken | container | overflow | console errors |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| `/` | 13 | 1 | 18155 | 0 | 0 | 1440 | 0 | 0 |
| `/gcalls-plus-webphone/` | 1* | 1 | 10064 | 8 | 0 | 1440 | 0 | 0 |
| `/qc-bot-ai/` | 19 | 1 | 12270 | 0 | 0 | 1440 | 0 | 0 |
| `/voicebot-ai/` | 13 | 1 | 9710 | 0 | 0 | 1440 | 0 | 0 |
| `/san-pham/` | 7 | 1 | 4402 | 0 | 0 | 1440 | 0 | 0 |
| `/giai-phap/` | 7 | 1 | 4157 | 0 | 0 | 1440 | 0 | 0 |

\* `/gcalls-plus-webphone/` nests its sections under a single `.gp-page` wrapper, so `main`'s direct
child count is 1 by design; its 8 real product images all load (0 broken), consistent with base.

**Verdict:** no route outside `/gcalls-cx/` changed section count, H1 count, container width, image
integrity or console-error state. `GCALLS_CX` route-isolation holds.
