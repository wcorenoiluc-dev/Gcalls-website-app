# CHECKPOINT — Resources Hub `/tai-nguyen/` (page-local UI + content audit)

Worktree `Gcalls-resources-hub-ui-v2`, branch `feature/gcalls-resources-hub-ui-v2`, base `9c562e7`, port 5214.
Local only — no push, no deploy, no WordPress. `src/data/hubs.ts` NEVER written (respected the Solutions Hub file lock; read-only audit).

## Signals — audit phase
- `RESOURCES_HUB_CHILD_ROUTES_AUDITED` ✅ — six routes audited live + from source (`six-route-content-audit.md`).
- `RESOURCES_HUB_STALE_COPY_IDENTIFIED` ✅ — stale gate ran; **0 stale strings** found (`stale-copy-report.md`).
- `RESOURCES_HUB_CONTENT_PATCH_PREPARED` ✅ — `resource-hub-content-patch.json`: **0 required corrections**, 2 optional owner-decision items.

## Signals — content + UI (content passed AS-IS; no hubs.ts patch was required)
- `RESOURCES_HUB_CONTENT_PASS` ✅ — every RESOURCES_HUB status/count matches actual child content; nothing to correct.
- `RESOURCES_HUB_ROUTE_6_PASS` ✅ — 6 card CTAs → correct child routes, all HTTP 200, no `#`, no null, no contact-substitution, distinct a11y names.
- `RESOURCES_HUB_FALSE_DOWNLOAD_ZERO` ✅ — hub has no download button; Ebook/Guides children are web-only (verified); no fake file/cover/lead-magnet.
- `RESOURCES_HUB_UI_LOCAL_PASS` ✅ — see UI metrics below.
- `RESOURCES_HUB_REVIEW_PENDING_OWNER` ✅ — visual design + the 2 optional count-softening items await owner review.

## Why the content patch is empty
The `/tai-nguyen/` copy is a guarded editorial foundation (Checkpoint WEB-RES-001). The audit confirms every claim is true today: Blog 0 published / 6 categories, Guides 6 paths·30 checkpoints (web-only), Case Studies 0 approved, Ebook 5 topics·no file, Glossary 24 terms·6 groups, FAQ 21 questions·6 groups. So there is **nothing stale to fix** — I did not invent changes. The two optional proposals only *future-proof* the hardcoded 24/21 counts and require owner decision; if approved they'd be a `hubs.ts` edit applied after the Solutions Hub worker releases the lock.

## UI metrics (measured live @ 1440)
| Metric | Spec | Actual |
|---|---|---|
| Container | 1180px | **1180px** ✓ |
| Section seam | 50px | **50px** ✓ |
| Card grid gap | 32–44px | **32px** ✓ |
| Card grid | 3×2 desktop / 2×3 tablet / 1 col mobile | **3 cols @1440**, 0 overflow at 768/390/320 ✓ |
| Cards equal height | yes | **all 330px** ✓ |
| H1 | exactly 1 | **1** ✓ |
| Final CTA | exactly 1 | **1** ✓ |
| Editorial icons, no dashboards/downloads/KPIs | required | ✓ (Newspaper/Route/ClipboardCheck/BookOpen/Library/HelpCircle) |
| `HubLayout.tsx` edited | no | **not touched** ✓ |

## Responsive (real Chrome)
1440/1280/1024/768/390/320 → all 200, 1 H1, 5 sections, **0 overflow, 0 broken, 0 upscaled**. Only console entry = site-wide `/favicon.ico` 404 (backlog).

## Regression (other routes unchanged — only ResourcesHubPage swapped to the page-local layout)
`/` (13), `/san-pham/` (6), `/giai-phap/` (6), `/tich-hop/` (6), `/nganh/` (5), `/cong-ty/` (7), + 6 child routes — all 200, 1 H1, 0 overflow, 0 broken, 0 errors. The other five hubs still use the untouched shared `HubLayout`.

## Exact diff
- `src/pages/ResourcesHubPage.tsx` — swap `HubLayout` → `ResourcesHubLayout` (2 lines).
- new `src/components/resources-hub/ResourcesHubLayout.tsx` (page-local layout).
- new `scripts/resources-hub-preview.mjs` (audit/preview/regression harness).
- new `docs/content-review/gcalls-resources-hub-ui-v2/*` (audit, patch proposal, screenshots, this checkpoint).
- `src/data/hubs.ts` — **unchanged**.

Preview: `http://127.0.0.1:5214/tai-nguyen/`
