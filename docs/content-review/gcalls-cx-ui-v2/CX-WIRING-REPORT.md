# Gcalls CX `/gcalls-cx/` — sanitized media wired (local preview)

Per owner direction "Proceed with both: A. wire the four sanitized mockups; B. page-local
hero/omnichannel crops." Local only. **No push, no deploy, no WordPress, no other route.**

## Final signals
- `GCALLS_CX_SANITIZED_MEDIA_WIRED` ✅ — 5 sanitized crops live on the page via `CxScreenshotFrame` / `CxProductStage`.
- `GCALLS_CX_CONTENT_PASS` ✅ — copy/slug/SEO/CTA/taxonomy unchanged; exactly one H1; one final CTA.
- `GCALLS_CX_PII_ZERO` ✅ — every crop is over PII-masked pixels; re-verified visually at full size; 0 names/phones/emails/companies/IDs/KPI values visible.
- `GCALLS_CX_FABRICATED_DATA_ZERO` ✅ — reporting & customer-context are number-free neutral diagrams; the removed figures (`#T-2043`, `47`, `312`, channel %) appear only in code comments.
- `GCALLS_CX_UI_LOCAL_PASS` ✅ (one caveat) — 0 horizontal overflow at 1440/1024/768/390/320, 0 broken images, 0 upscaled images, 1 H1, no header overlap. Caveat: one console 404 = `/favicon.ico` (site-wide, missing in dev; not content-related; identical in the pre-existing build).
- `GCALLS_CX_MEDIA_REVIEW_PENDING_OWNER` — kept (design still pending owner review).
- `GCALLS_CX_BRANDING_DECISION_REQUIRED` — kept (see disclosure).
- `CUSTOMER_360_SOURCE_REQUIRED` — kept.
- `ANALYTICS_SOURCE_REQUIRED` — kept.

## Section → media map
| Section | Visual now | Source |
|---|---|---|
| 01 Hero | `CxProductStage` — 3 real surfaces: **Đa kênh** (channel rail), **Ticket** (SLA+desc), **Cuộc gọi** (call card) | cx-channels-rail / cx-ticket-compact / cx-call-info |
| 04 Overview | omnichannel activity crop (screenshot) | cx-omnichannel-activity |
| 06 Inbox | neutral `InboxDiagram` (distinct; no repeated crop) | — |
| 07 Ticket/workflow | full ticket crop (primary evidence) | cx-ticket-full |
| 08 Customer context | neutral `CustomerContextDiagram` (no names/IDs) | — (CUSTOMER_360_SOURCE_REQUIRED) |
| 10 Reporting | neutral `ReportingDiagram` (`—`/skeleton, no invented bars) | — (ANALYTICS_SOURCE_REQUIRED) |

Crops manifest (dims + sha256): `media/crops-manifest.json`. All 5 are `.webp`, metadata-stripped, no upscale, aspect preserved.

## Branding disclosure
The source UI is the owner's contact-center product, branded **"PitelCX"**. Handling in public output:
- Every crop region **excludes** the top-left PitelCX wordmark (crops are content/side-panel areas).
- Chat/content that carried the "PitelCX" text was masked out during sanitization.
- Application pixels are **NOT** repainted with a Gcalls logo. Instead the **external** browser frame caption reads "Gcalls CX".
- Product equivalence is unconfirmed → `GCALLS_CX_BRANDING_DECISION_REQUIRED` remains open.

## Before / after measurement (from `screenshots/metrics.json`)
| Breakpoint | H-overflow | H1 | broken img | upscaled |
|---|---|---|---|---|
| 1440 / 1280 / 1024 / 768 / 390 / 320 | 0 (all) | 1 (all) | 0 (all) | 0 (all) |
- Before: hero + overview + ticket sections rendered *diagram* placeholders (no real product evidence).
- After: those three carry real sanitized screenshots; customer-360 + reporting stay neutral diagrams by design.

## Regression (6 protected routes, all healthy — CX-scoped, additive changes only)
| Route | sections | H1 | overflow | broken img | console |
|---|---|---|---|---|---|
| `/` | 13 | 1 | 0 | 0 | 0 |
| `/gcalls-plus-webphone/` | 1 | 1 | 0 | 0 (8 imgs) | 0 |
| `/qc-bot-ai/` | 19 | 1 | 0 | 0 | 0 |
| `/voicebot-ai/` | 13 | 1 | 0 | 0 | 0 |
| `/san-pham/` | 7 | 1 | 0 | 0 | 0 |
| `/giai-phap/` | 7 | 1 | 0 | 0 | 0 |
Shared primitives (`Container`, `FeatureSplit`, `Section`) were left unchanged to protect these routes; the owner's 1180/44-56/50px layout intent is applied inside `CxProductStage` and the existing hero's `44fr_56fr` grid rather than by editing the shared components.

## Exact diff
- `src/data/productImages.ts` — +56 (new `GCALLS_CX_IMAGES`, 5 entries).
- `src/components/gcalls-cx/sections.tsx` — 16 lines (imports + hero→stage, overview→screenshot, ticket→screenshot; dropped `TicketDiagram` import).
- new: `src/components/gcalls-cx/CxScreenshotFrame.tsx`, `src/components/gcalls-cx/CxProductStage.tsx`.
- new: `public/images/products/gcalls-cx/*.webp` (5 crops).
- `visuals.tsx` diagrams reused unchanged.

## Artifacts in this folder
- `contact-sheet-SANITIZED.png` (5 crops), `media/sanitized-review/*.webp`, `media/crops-manifest.json`
- `screenshots/cx-{1440,1280,1024,768,390,320}-full.png`, `screenshots/cx-hero-{1440,390}.png`, per-section crops, `metrics.json` (gate + regression)

## ⚠️ Coordination note
A parallel Claude session implemented the *opposite* plan on this same worktree (neutral diagrams only, "do not publish captures") and recorded intent to revert via `git reset --hard 736ef8f && git clean -fd src public`. The owner chose "take over" with the wired-screenshots approach. If that other session resumes and runs the reset, this work (components, `public/` crops, edits) is wiped. Keep it stopped, or preserve this state (branch/commit) before any reset. Not pushed/committed here, per "stop after preview".
