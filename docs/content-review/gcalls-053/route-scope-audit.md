# GCALLS-053 TASK C — 38-route scope audit (verification pass)

Date 2026-09-08. Repository `/Users/macos/Desktop/Gcalls/App/Gcalls-react-ui-v2-integration`,
branch `feature/gcalls-react-ui-v2-integration`, HEAD `351f7cf`.

Read-only. Nothing was modified, started, deployed or committed. This file is the only
thing written.

**Scope note.** This is a *verification* pass over `route-scope-audit-c.md` (453 lines, same
directory, committed in `385afbe`), not a duplicate of it. Every headline claim in that
report was re-derived from source independently; §2 records confirmations and refutations.
The 38-row table in §5 carries my own measurements, not that report's.

**Working-tree caveat.** The tree was **not** clean when this audit ran — 9 tracked files
under `src/components/home/`, `scripts/scan-home-fabricated.mjs` and
`docs/content-review/gcalls-051/home-ui-report.json` were modified by concurrent work, plus
an untracked `.tmp-audit/`. **None of the files this audit depends on is among them**
(verified: `src/config/sitemap.ts`, `src/app/router.tsx`, `wordpress/imports/content-manifest.json`,
`wordpress/wp-content/plugins/gcalls-core/data/{content-pages,content-inventory,product-pages}.json`
and `wordpress/.release-053/**` are all unmodified vs `351f7cf`).

---

## 0. HEADLINE

1. **The canonical route count is 38.** Five independent registries agree, set-diff empty in
   both directions. Derivation in §1.
2. **The 37 → 38 delta is `/voicebot-ai/`** in the *source-history* sense (§3.1) — confirmed
   by git diff, one added line, nothing removed. **But there is a second, different "37"**
   that no prior document reconciles: the live WordPress route baseline of 37 is
   38 − `/blog/`, not 38 − `/voicebot-ai/` (§3.2). Both are real; they are not the same 37.
3. **`contracts.manifestPages: 31` vs 38 is fully explained and is NOT a gap.** Exactly 7
   routes are absent from `content-pages.json` because 7 routes are rendered by a different
   mechanism. Named and traced to source in §4. 31 + 4 + 1 + 1 + 1 = 38.
4. **Routes served by `ShellPage`: ZERO** (`SHELL_ROUTES` is `[]`). One route renders
   *through* `RouteShell` directly: `/referral/`. Three WordPress routes are still bare card
   walls. Full list in §6.
5. **The blog corpus is outside the 38.** 250 articles (18 publish / 230 draft / 2 private)
   live in a separate array and register zero React paths in production (§7).
6. **One release-blocking defect found that no prior document records:**
   `content-inventory.json` locks `cong-ty` at 1 section while `content-pages.json` now
   carries 4. `content-completeness-test.php` compares these with `!==`, so it **fails on the
   current tree** (§8.4).
7. **Three of `route-scope-audit-c.md`'s findings are now stale** — they were true when
   written and were fixed in the same or a later commit in this lineage. Details in §2.

---

## 1. DERIVATION OF THE CANONICAL ROUTE SET

Parsed from source with a throwaway script in the session scratchpad (not written into the
repo). Nothing below is taken from documentation.

### 1.1 `ROUTES` — `src/config/sitemap.ts:33`

Regex `^\s*([A-Za-z0-9_]+)\s*:\s*'([^']+)',` inside
`export const ROUTES = { … } as const`:

```
ROUTES keys: 38
duplicate paths: []   duplicate keys: []
```

### 1.2 `SITEMAP` — same file

Block comments stripped before counting so a `route:` inside a comment cannot inflate the
total:

```
SITEMAP ids: 38   route: ROUTES.* refs: 38   labels: 38   groups: 38   statuses: 38
titles: 38   descriptions: 38   parents: 38
ROUTES keys never referenced by a SITEMAP entry: []
SITEMAP route refs not in ROUTES: []
status summary: { complete: 38, in_progress: 0, shell: 0 }
```

Ids are `WEB-001`…`WEB-037` plus `APP-001` — note `WEB-037` is `/voicebot-ai/`, sitting out
of numeric order between `WEB-005` and `WEB-006`.

### 1.3 Router — `src/app/router.tsx`

```
path: ROUTES.* occurrences: 38   (includes the layout's own `path: ROUTES.home`)
index: true present: true
distinct route keys registered: 38
in ROUTES but not routed: []
routed but not in ROUTES: []
```

Two router paths are correctly **not** sitemap routes: `{ path: '*' }` (404) and the
`...VISIBLE_ARTICLES.map(...)` spread, which contributes zero paths in production (§7).

### 1.4 WordPress import manifest — `wordpress/imports/content-manifest.json`

```
counts: {"pages":38,"articles":18,"media":13,"menuItems":62}
pages array length: 38
```

Route list is byte-identical to `ROUTES` in order and content.

### 1.5 Route verifier — `scripts/verify-integration-routes.mjs`

Its hardcoded `ROUTES` array parses to **38** paths, matching the registry.

### 1.6 The 38, in file order

| # | id | group | route |
|---|---|---|---|
| 1 | WEB-001 | core | `/` |
| 2 | WEB-002 | products | `/san-pham/` |
| 3 | WEB-003 | products | `/gcalls-plus-webphone/` |
| 4 | WEB-004 | products | `/qc-bot-ai/` |
| 5 | WEB-005 | products | `/gcalls-cx/` |
| 6 | WEB-037 | products | `/voicebot-ai/` |
| 7 | WEB-006 | solutions | `/giai-phap/` |
| 8 | WEB-007 | solutions | `/tong-dai-tich-hop-crm/` |
| 9 | WEB-008 | solutions | `/tong-dai-tich-hop-helpdesk/` |
| 10 | WEB-009 | solutions | `/tong-dai-tich-hop-pos/` |
| 11 | WEB-010 | solutions | `/tong-dai-quoc-te/` |
| 12 | WEB-011 | integrations | `/tich-hop/` |
| 13 | WEB-012 | integrations | `/tich-hop/hubspot/` |
| 14 | WEB-013 | integrations | `/tich-hop/salesforce/` |
| 15 | WEB-014 | integrations | `/tich-hop/zoho-crm/` |
| 16 | WEB-015 | integrations | `/tich-hop/freshdesk/` |
| 17 | WEB-016 | integrations | `/tich-hop/zendesk/` |
| 18 | WEB-017 | industries | `/nganh/` |
| 19 | WEB-018 | industries | `/nganh/giao-duc/` |
| 20 | WEB-019 | industries | `/nganh/tai-chinh/` |
| 21 | WEB-020 | industries | `/nganh/bao-hiem/` |
| 22 | WEB-021 | industries | `/nganh/bat-dong-san/` |
| 23 | WEB-022 | industries | `/nganh/thuong-mai-dien-tu/` |
| 24 | WEB-023 | industries | `/nganh/bpo/` |
| 25 | WEB-024 | pricing | `/bang-gia/` |
| 26 | APP-001 | pricing | `/uoc-tinh-chi-phi/` |
| 27 | WEB-025 | resources | `/tai-nguyen/` |
| 28 | WEB-026 | resources | `/blog/` |
| 29 | WEB-027 | resources | `/tai-nguyen/guides/` |
| 30 | WEB-028 | resources | `/tai-nguyen/case-studies/` |
| 31 | WEB-029 | resources | `/tai-nguyen/ebook/` |
| 32 | WEB-030 | resources | `/tai-nguyen/glossary/` |
| 33 | WEB-031 | resources | `/tai-nguyen/faq/` |
| 34 | WEB-032 | company | `/cong-ty/` |
| 35 | WEB-033 | company | `/cong-ty/khach-hang/` |
| 36 | WEB-034 | company | `/cong-ty/doi-tac/` |
| 37 | WEB-035 | company | `/lien-he/` |
| 38 | WEB-036 | company | `/referral/` |

---

## 2. VERIFICATION OF `route-scope-audit-c.md`

| Claim | Verdict | My evidence |
|---|---|---|
| Route count 38, four registries agree | **CONFIRMED** (and a fifth) | §1 — I found `verify-integration-routes.mjs` agrees too |
| `ROUTES` at `sitemap.ts:33-90` = 38 | **CONFIRMED** | own parse |
| `SITEMAP` `route: ROUTES.*` = 38 | **CONFIRMED** | own parse, comments stripped |
| Router at `router.tsx:183-273` = 38 | **CONFIRMED** | own parse, set-diff empty |
| `content-manifest.json` `counts.pages` = 38 | **CONFIRMED** | `{"pages":38,…}` |
| 37/38 delta is exactly `/voicebot-ai/` | **CONFIRMED for the source-history 37** | `git show 519ab5a:src/config/sitemap.ts` → 37 keys; diff to HEAD is `+voicebotAi`, nothing removed. **INCOMPLETE** — see §3.2 for a second, different 37 |
| `SHELL_ROUTES` is `[]` at `router.tsx:181` | **CONFIRMED** | `const SHELL_ROUTES: RoutePath[] = []` |
| `/referral/` renders through `RouteShell` | **CONFIRMED** | `ReferralPage.tsx:53` `return (<RouteShell>` |
| `/referral/` sectionCount 3 (cards section skipped) | **CONFIRMED** | `RouteShell.tsx:207` gates on `cards.length > 0`; `getChildren(ROUTES.referral)` is empty (no sitemap entry has `parent: ROUTES.referral`) and `ReferralPage` passes no `related` → cards = 0 |
| `content-pages.json` / `product-pages.json` contain zero `"seo"` keys | **CONFIRMED** | `grep -c '"seo"'` → 0 and 0 |
| All 38 manifest pages carry `seo.title` + `seo.description` | **CONFIRMED** | iterated: 0 pages missing either |
| `/gcalls-plus-webphone/` cites 11 media ids, 4 unapproved (GP-03/09/10/12) | **CONFIRMED** | `product-pages.json` `gcalls-plus` cites 11; `approvedMedia.approved` has 7 keys; set-diff = GP-09, GP-10, GP-12, GP-03 |
| Blog corpus 250 = 18 publish / 230 draft / 2 private, 18 protected ids | **CONFIRMED** | `corpus-migration.json`, own tally |
| **`router.tsx:10` still says "37 routes" — residual defect** | **REFUTED / now stale** | At `351f7cf` line 9 reads `Route table for the GCALLS website — 38 routes.` `git log -S"38 routes" -- src/app/router.tsx` → `385afbe`, the *same commit that added `route-scope-audit-c.md`*. The report documented a defect fixed in its own commit |
| **`/cong-ty/` is "the single worst gap", 1 cards section with 2 child links, needs owner** | **REFUTED / now stale** | `content-pages.json` `cong-ty` now has **4** sections — `prose`, `cards(3)`, `steps(4)`, `cards(5)` — `provenance: "PORTED"`, H1 verbatim equal to React's `COMPANY_HUB.h1`, and the 3 cards are the *principles* with the same titles and the same destinations (`/san-pham/`, `/giai-phap/`, `/lien-he/`). Ported in `068c4b0` |
| **`/tai-nguyen/` CONFLICT: `RESOURCES_HUB` tags Blog "Chưa có bài viết"** | **REFUTED / now stale** | `grep "Chưa có bài viết" src/data/hubs.ts` → no matches. The Blog card's `points` now reads `'Theo sáu danh mục biên tập'`. Changed in `068c4b0` ("derive the blog count instead of claiming it") |
| `content-inventory.json.pages["cong-ty"] = 1` | **CONFIRMED as a fact — but it is now a DEFECT, not evidence** | the inventory still says 1 while the manifest carries 4; see §8.4 |
| `/nganh/` still a card wall, H1 diverges from React | **CONFIRMED** | `nganh` has 1 `cards(6)` section; WP H1 `Giải pháp tổng đài theo đặc thù từng ngành` vs React `INDUSTRIES_HUB.h1` `Giải pháp giao tiếp theo bối cảnh vận hành của từng ngành` |

### 2.1 Table rows I re-measured against source

I re-derived `sectionCount` for **all 38** rows rather than sampling, using a scoped
depth-1 JSX scan of each exported page function (breadcrumb wrapper and `<JsonLd>`
excluded), cross-checked against the files' own `{/* NN */}` markers where present and
against the layout frames for delegating pages. **Every one of audit-c's 38 sectionCounts
reproduced exactly**, including the four it could most easily have got wrong
(`/tich-hop/salesforce/` 20, `/tich-hop/zendesk/` 20, `/cong-ty/doi-tac/` 12 = 6 frame +
5 children + 1 `afterStatus`, `/referral/` 3). Layout frames verified directly:
`ResourcePageLayout` = 6, `CompanyPageLayout` = 6, `CompanyHubLayout` = 7,
`ProductsHubLayout` = 6, `SolutionsHubLayout` = 6, `IndustriesHubLayout` = 5,
`ResourcesHubLayout` = 5.

---

## 3. THE TWO DIFFERENT "37"s

Prior documents treat "37" as one number. It is two, and conflating them is why the
discrepancy keeps reappearing.

### 3.1 Source-history 37 — the delta is `/voicebot-ai/`

`519ab5a` (`feat(architecture): complete 37-route sitemap, mega menus and page shells`) is
the oldest commit touching `src/config/sitemap.ts`. Parsing its `ROUTES` block and diffing
against HEAD:

```
519ab5a ROUTES count: 37   HEAD: 38
added:   [ 'voicebotAi = /voicebot-ai/' ]
removed: []
```

One added key. Nothing removed, nothing renamed. `WEB-037` is the highest `WEB-` id and sits
out of numeric order, which is the signature of a later insertion. The file's own scope note
(`sitemap.ts:21-25`) records the reversal at Checkpoint WEB-PRO-004.

**This is the 37 that `docs/BOSS_DEMO_V1.md:157,179,180`, `docs/WORDPRESS_HEADLESS_AUDIT.md:340`
and the (now-fixed) `router.tsx` docstring were counting.**

### 3.2 Live-deployment 37 — the delta is `/blog/`

A second 37 exists in the sibling repo's deploy record:
`/Users/macos/Desktop/Gcalls/App/Gcalls-website-app/docs/content-review/gcalls-054/route-baseline-before.json`
— `"count": 37`, `"base": "https://ashernguyenxuanthuy.com"`, one measured row per live URL.
Set-diff against the canonical 38:

```
canonical − live baseline: [ '/blog/' ]
live baseline − canonical: []
```

`/voicebot-ai/` **is present** in that baseline. The missing route is `/blog/`. This is
independently corroborated by
`Gcalls-website-app/docs/content-review/gcalls-048/CHECKPOINT_GCALLS-048-BLOG-MIGRATION.md:188`
— *"chưa có trang index blog trong 37 trang"* ("there is no blog index page among the 37
pages").

**Consequence for the release.** If someone runs a 37-route regression against the live
site and compares it to the 38-route registry, the route they will be told is missing is
`/blog/`, not `/voicebot-ai/`. Both statements in this section are true; they answer
different questions. Any document that says "the missing route is X" must say which 37 it
means.

---

## 4. `contracts.manifestPages: 31` vs 38 — RESOLVED

`wordpress/.release-053/release-manifest.json` records:

```json
"contracts": { "homepageTopLevelSections": 13, "homepageWidgets": 77,
               "homepageInventory": 13, "manifestPages": 31 }
```

### 4.1 What the number actually counts

`wordpress/scripts/build-051-release.mjs:413` —
`const cpDoc = JSON.parse(fs.readFileSync(path.join(build, 'data/content-pages.json')))` —
and `:561` writes `manifestPages: cpDoc.pages.length`. The gate at `:414` is
`if (cpDoc.pages.length < 31) die(...)`.

So `manifestPages` is **the length of `content-pages.json`, the PHP `Content_Pages`
renderer's page table** — not the route registry and not the import manifest. It was never
meant to equal 38.

`content-pages.json` holds 31 entries. Their slugs map 1:1 onto canonical routes with **no
orphans** (`content-pages slugs not matched by any route: []`).

### 4.2 The 7 routes absent from `content-pages.json` — named exactly

| # | route | manifest id | renderer instead | source evidence |
|---|---|---|---|---|
| 1 | `/` | `web-001` | **Elementor** — `data/homepage-elementor.json` applied by `includes/class-home-layout.php` (`private const SOURCE = 'data/homepage-elementor.json'`, `apply()`, `render()`) | `content-manifest.json` `elementor: [{"route":"/","file":"wordpress/elementor-templates/gcalls-homepage.json"}]`; `isFrontPage: true`; release contract `homepageInventory: 13` from `data/homepage-inventory.json` |
| 2 | `/gcalls-plus-webphone/` | `web-003` | **`[gcalls_product_page id="gcalls-plus"]`** | `wordpress/scripts/lib/page-bodies.mjs:314` `out[page.route] = { content: shortcode(\`[gcalls_product_page id="${id}"]\`) }`; shortcode registered `class-shortcodes.php:54`; content in `data/product-pages.json` → `gcalls-plus` (14 sections + hero + faq) |
| 3 | `/qc-bot-ai/` | `web-004` | **`[gcalls_product_page id="qa-qc"]`** | same generator; `product-pages.json` → `qa-qc`, route `/qc-bot-ai/`, 15 sections |
| 4 | `/gcalls-cx/` | `web-005` | **`[gcalls_product_page id="cx"]`** | same generator; `product-pages.json` → `cx`, 16 sections |
| 5 | `/voicebot-ai/` | `web-037` | **`[gcalls_product_page id="voicebot"]`** | same generator; `product-pages.json` → `voicebot`, 10 sections |
| 6 | `/uoc-tinh-chi-phi/` | `app-001` | **generated Gutenberg body + `[gcalls_estimator]`** | `page-bodies.mjs` `pageBodies()` returns `'/uoc-tinh-chi-phi/': await costEstimatorBody(repo, routes)`; shortcode registered `class-shortcodes.php:51`; config in `data/estimator-config.json` |
| 7 | `/blog/` | `web-026` | **generated Gutenberg body + theme `home.php`** (the WordPress Posts page) | `page-bodies.mjs` `'/blog/': await blogBody(repo, routes)`; `content-manifest.json` `isPostsPage: true`; `themes/gcalls-theme/home.php` runs a `WP_Query` grouped by the `gcalls_hub` taxonomy |

### 4.3 Reconciliation

```
31  content-pages.json  (Content_Pages renderer)
+ 4  product shortcode pages
+ 1  /uoc-tinh-chi-phi/  (generated body + estimator shortcode)
+ 1  /blog/              (generated body + theme home.php)
+ 1  /                   (Elementor)
= 38
```

**Verdict: INTENTIONAL, not a gap.** `page-bodies.mjs`'s own header states it —
*"WHY THESE TWO AND NOT ALL 38 … The product pages are not here because
`[gcalls_product_page]` already renders theirs."* Every one of the 7 has a named renderer
traceable to a committed file, and all 7 carry a full `seo.title` + `seo.description` in the
import manifest, so none of them is invisible to Rank Math either.

**One caveat worth recording, because it is the shape of a future defect.** `manifestPages`
is a contract on a *subset*. Nothing in `build-051-release.mjs` asserts that
31 + 4 + 1 + 1 + 1 = 38, or that the 7 non-`Content_Pages` routes still have a renderer. If
a product route were dropped from `product-pages.json` the release gate would still print
`manifest pages 31` and pass. The reconciliation above is currently done by reading, not by
a test.

---

## 5. THE 38-ROUTE TABLE

**Column derivation.**

- **component** — resolved from `src/app/router.tsx`; `→` shows the layout it delegates to.
- **sectionCount (React)** — depth-1 JSX children of the exported page function's returned
  root, `<JsonLd>` and the breadcrumb wrapper `<div className="bg-brand-light/60 …">`
  excluded; for a delegating page, the layout's own frame sections plus the page's children.
  Measured by me from source; every value reproduced audit-c's.
- **currentRenderer** — the PHP/JS that emits the body, traced in §4 and from
  `content-pages.json`. `Content_Pages(n)` = `n` declared sections in `content-pages.json`
  (hero, faq and cta are separate blocks on top).
- **ReactStatus / WordPressStatus** — `done` / `partial` / `missing`.
- **mediaStatus** — from `data/section-components.json` (`approvedMedia`, `mediaVerdicts`),
  `data/media-frames.json`, `content-manifest.json` `media`.
- **SEOStatus** — presence of `title` + `description` on the `SITEMAP` entry (React side)
  and `seo.title` + `seo.description` on the import-manifest entry (WordPress side).
- **unknown** is used where source cannot settle the cell; the missing input is named.

**SEOStatus is `has title+description in sitemap.ts` for all 38** — verified by parse: 38
titles, 38 descriptions on the `SitemapEntry` side, and 0 of 38 import-manifest pages
missing `seo.title` or `seo.description`. The column is kept per-row for the brief's shape
but carries no variance; the two exceptions worth knowing are noted in §5.1.

| # | route | group | component | sectionCount | currentRenderer | ReactStatus | WordPressStatus | mediaStatus | SEOStatus | blocker |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | core | `HomePage` | 13 | page-specific: Elementor `homepage-elementor.json` via `class-home-layout.php` | done — 13 sections | done — `homepageInventory: 13`, 1:1 | neutral diagrams only (inline SVG/CSS; fabricated data neutralized in `f0b5489`+`385afbe`) | title+desc in sitemap.ts | `mock_hero` KPI tiles are `NEEDS_OWNER_REVIEW` / `unlabelledOutOfScope` in `mediaVerdicts` — owner sign-off outstanding |
| 2 | `/san-pham/` | products | `ProductsHubPage` → `ProductsHubLayout` | 6 | page-specific: `Content_Pages(4)` slug `san-pham`, H1 matches React verbatim | done | partial — 4 sections vs 6 | neutral diagrams only (React per-card visuals via `productVisuals.tsx`; WP cards carry no media slot) | title+desc in sitemap.ts | per-card media slot has no WordPress representation |
| 3 | `/gcalls-plus-webphone/` | products | `GcallsPlusPage` | 17 | page-specific: `[gcalls_product_page id="gcalls-plus"]`, 14 sections | done | partial — 14 sections vs 17 | **partial approved PII-clean media** — 11 ids cited, 7 on the `approvedMedia.approved` allowlist; **GP-03, GP-09, GP-10, GP-12 blocked for PII** and fall back to a drawn diagram (`class-sections.php:423` fail-closed) | title+desc in sitemap.ts | 4 cited screenshots are PII-blocked; either clear them through the contract or drop the citations |
| 4 | `/qc-bot-ai/` | products | `QaQcCenterPage` | 18 | page-specific: `[gcalls_product_page id="qa-qc"]`, 15 sections | done | partial — 15 vs 18 | neutral diagrams only (`qc_transcript`, `qc_scorecard`, `qc_signals`, `qc_dashboard`, `flow`); `mock_qc_dashboard` is `NEEDS_OWNER_REVIEW` | title+desc in sitemap.ts | F3 "QA/QC neutral diagrams" item not yet run; one mockup awaiting owner review |
| 5 | `/gcalls-cx/` | products | `GcallsCxPage` | 19 | page-specific: `[gcalls_product_page id="cx"]`, 16 sections | done | partial — 16 vs 19 | neutral diagrams only on WP (`cx_context`, `cx_inbox`, `cx_ticket`, `cx_report`, `flow`); `mock_cx_report` is `NEEDS_OWNER_REVIEW`. React ships approved CX captures | title+desc in sitemap.ts | CX real media not ported. **Memory-flagged:** owner's 58 CX screenshots are PitelCX + PII; resolved to neutral diagrams in `736ef8f` — do not publish or rebrand without owner OK |
| 6 | `/voicebot-ai/` | products | `VoicebotAiPage` | 12 | page-specific: `[gcalls_product_page id="voicebot"]`, 10 sections | done | partial — 10 vs 12 | neutral diagrams only (`voicebot_handoff`, `flow`, `handover`); `mock_voicebot_builder` is `NEEDS_OWNER_REVIEW`. **No Voicebot screenshot exists in this repo** (claim guard, `src/data/voicebotAi.ts`) | title+desc in sitemap.ts | no product evidence exists to fill the media slot |
| 7 | `/giai-phap/` | solutions | `SolutionsHubPage` → `SolutionsHubLayout` | 6 | page-specific: `Content_Pages(4)` slug `giai-phap`, H1 matches React verbatim | done | partial — 4 vs 6 | missing on WP (React uses per-card glyphs) | title+desc in sitemap.ts | per-card glyphs + 2 visual groups not ported |
| 8 | `/tong-dai-tich-hop-crm/` | solutions | `CRMIntegrationPage` | 18 | page-specific: `Content_Pages(14)` slug `tong-dai-tich-hop-crm` | done | partial — 14 vs 18 | neutral diagrams only in React (`CRMMockup`, `DialpadMockup`, `CustomerPopupMockup`, `CallTimelineMockup`, `WidgetMockup`); **none on WP** | title+desc in sitemap.ts | React inline mockups have no WordPress counterpart on this route |
| 9 | `/tong-dai-tich-hop-helpdesk/` | solutions | `HelpdeskIntegrationPage` | 16 | page-specific: `Content_Pages(12)` | done | partial — 12 vs 16 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 10 | `/tong-dai-tich-hop-pos/` | solutions | `POSIntegrationPage` | 16 | page-specific: `Content_Pages(13)` | done | partial — 13 vs 16 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 11 | `/tong-dai-quoc-te/` | solutions | `InternationalCallingPage` | 18 | page-specific: `Content_Pages(14)` | done | partial — 14 vs 18 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 12 | `/tich-hop/` | integrations | `IntegrationsHubPage` (bespoke sections) | 6 content (7 incl. breadcrumb component) | page-specific: `Content_Pages(4)` slug `tich-hop`, H1 matches React verbatim | done | partial — 4 vs 6 | neutral diagrams only in React (connection-layer diagram); none on WP | title+desc in sitemap.ts | hub diagram not ported |
| 13 | `/tich-hop/hubspot/` | integrations | `HubspotIntegrationPage` | 17 | page-specific: `Content_Pages(13)` | done | partial — 13 vs 17 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 14 | `/tich-hop/salesforce/` | integrations | `SalesforceIntegrationPage` | 20 | page-specific: `Content_Pages(15)` | done | partial — 15 vs 20 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 15 | `/tich-hop/zoho-crm/` | integrations | `ZohoCrmIntegrationPage` | 19 | page-specific: `Content_Pages(15)` | done | partial — 15 vs 19 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 16 | `/tich-hop/freshdesk/` | integrations | `FreshdeskIntegrationPage` | 20 | page-specific: `Content_Pages(16)` | done | partial — 16 vs 20 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 17 | `/tich-hop/zendesk/` | integrations | `ZendeskIntegrationPage` | 20 | page-specific: `Content_Pages(16)` | done | partial — 16 vs 20 | neutral diagrams only in React; none on WP | title+desc in sitemap.ts | as #8 |
| 18 | `/nganh/` | industries | `IndustriesHubPage` → `IndustriesHubLayout` | 5 | **generic card wall** — `Content_Pages(1)`, a single `cards(6)` section | done | **missing (layout)** — card fields restored, page layout and hero diagram not ported | missing on WP (React has a hero orientation diagram + per-card wayfinding icons) | title+desc in sitemap.ts | **H1 divergence blocks the port.** WP `Giải pháp tổng đài theo đặc thù từng ngành` vs React `Giải pháp giao tiếp theo bối cảnh vận hành của từng ngành`. Porting changes the H1 and the SEO record written at import — owner decision first |
| 19 | `/nganh/giao-duc/` | industries | `IndustryPage industry="education"` | 9 | page-specific: `Content_Pages(6)` + hero + faq + cta = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 20 | `/nganh/tai-chinh/` | industries | `IndustryPage industry="finance"` | 9 | page-specific: `Content_Pages(6)` = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 21 | `/nganh/bao-hiem/` | industries | `IndustryPage industry="insurance"` | 9 | page-specific: `Content_Pages(6)` = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 22 | `/nganh/bat-dong-san/` | industries | `IndustryPage industry="real-estate"` | 9 | page-specific: `Content_Pages(6)` = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 23 | `/nganh/thuong-mai-dien-tu/` | industries | `IndustryPage industry="ecommerce"` | 9 | page-specific: `Content_Pages(6)` = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 24 | `/nganh/bpo/` | industries | `IndustryPage industry="bpo"` | 9 | page-specific: `Content_Pages(6)` = 9 | done | done — 9 ↔ 9 | none needed | title+desc in sitemap.ts | none |
| 25 | `/bang-gia/` | pricing | `PricingPage` | 10 | page-specific: `Content_Pages(6)` | done | partial — 6 vs 10, and static cards vs React's interactive selector/comparison/estimator preview | none needed | title+desc in sitemap.ts | the **only** manifest page carrying `reviewRequired: true` — unresolved |
| 26 | `/uoc-tinh-chi-phi/` | pricing | `CostEstimatorPage` | 7 | page-specific: generated Gutenberg body (`page-bodies.mjs` → `costEstimatorBody`) + `[gcalls_estimator]` | done | partial | none needed | title+desc in sitemap.ts | body section count is produced at build time from `src/data`; **unknown** without running the generator — needs `node wordpress/scripts/…` or a live page to compare against React's 7 |
| 27 | `/tai-nguyen/` | resources | `ResourcesHubPage` → `ResourcesHubLayout` | 5 | **generic card wall** — `Content_Pages(1)`, a single `cards(6)` section | done | **missing (layout)** — card fields restored, 5-section layout not ported | none needed | title+desc in sitemap.ts | **H1 divergence blocks the port.** WP `Tài liệu và công cụ cho đội vận hành tổng đài` vs React `Kiến thức về Call Center, CRM, CX và AI cho đội ngũ vận hành`. (The "Chưa có bài viết" factual conflict is **resolved** — `068c4b0`) |
| 28 | `/blog/` | resources | `BlogPage` → `ResourcePageLayout` | 9 (6 frame + 3) | page-specific: generated Gutenberg body (`page-bodies.mjs` → `blogBody`) + theme `home.php` Posts page grouped by `gcalls_hub` | done | partial | none needed | title+desc in sitemap.ts | **not present in the live 37-route baseline** (§3.2) — this is the route the live deploy is short. React's archive is a static category listing while WordPress lists real published posts |
| 29 | `/tai-nguyen/guides/` | resources | `GuidesPage` → `ResourcePageLayout` | 8 (6 + 2) | page-specific: `Content_Pages(4)` | done | partial — 4 vs 8 | none needed | title+desc in sitemap.ts | **memory-flagged:** guides path *bodies* were dropped in the port; `content-completeness-test.php` cannot see it (the section exists, it is thin) |
| 30 | `/tai-nguyen/case-studies/` | resources | `CaseStudiesPage` → `ResourcePageLayout` | 10 (6 + 4) | page-specific: `Content_Pages(6)` | done | partial — 6 vs 10 | none needed | title+desc in sitemap.ts | `CaseFilterSection` is a client-side filter with no WordPress counterpart |
| 31 | `/tai-nguyen/ebook/` | resources | `EbookPage` → `ResourcePageLayout` | 9 (6 + 3) | page-specific: `Content_Pages(5)` | done | done (near parity) | none needed | title+desc in sitemap.ts | none |
| 32 | `/tai-nguyen/glossary/` | resources | `GlossaryPage` → `ResourcePageLayout` | 8 (6 + 2) | page-specific: `Content_Pages(9)` | done | done | none needed | title+desc in sitemap.ts | none |
| 33 | `/tai-nguyen/faq/` | resources | `FaqPage` → `ResourcePageLayout` | 8 (6 + 2) | page-specific: `Content_Pages(9)`, page-level `faq` array empty (Q&A lives in the sections) | done | done | none needed | title+desc in sitemap.ts | none |
| 34 | `/cong-ty/` | company | `CompanyHubPage` → `CompanyHubLayout` | 7 | page-specific: `Content_Pages(4)` — `prose`, `cards(3)`, `steps(4)`, `cards(5)`; `provenance: "PORTED"`, H1 verbatim | done | partial — 4 vs 7, but the substance is ported (the 3 principle cards with matching titles and destinations) | missing on WP — React renders `/images/brand/gcalls-official-logo-137x40.png` (`company-hub/BrandVisual.tsx`); the port's claim guard **refuses any image reference** because the logo has no media-registry entry | title+desc in sitemap.ts | **`content-inventory.json` still locks this page at 1 section while it now carries 4 — `content-completeness-test.php` fails (§8.4).** Secondary: official logo has no importer entry |
| 35 | `/cong-ty/khach-hang/` | company | `CustomersPage` → `CompanyPageLayout` | 12 (6 frame + 6) | page-specific: `Content_Pages(9)` + hero + faq + cta = 12 | done | done — 12 ↔ 12 | none — no logo wall; the permission gate is a compile-time type error in `src/data/company/types.ts` | title+desc in sitemap.ts | none |
| 36 | `/cong-ty/doi-tac/` | company | `PartnersPage` → `CompanyPageLayout` | 12 (6 frame + 5 children + 1 `afterStatus`) | page-specific: `Content_Pages(9)` = 12 | done | done — 12 ↔ 12 | none needed | title+desc in sitemap.ts | none |
| 37 | `/lien-he/` | company | `ContactPage` | 1 (one `<Section>`: `ContactInfoPanel` + `LeadForm`) | page-specific: `Content_Pages(1)` + hero + `form_slot` state `active` rendering `[gcalls_lead_form]` | done | done | none needed | title+desc in sitemap.ts | **memory-flagged infra:** OneShield edge strips security headers on `/lien-he/`, blocking any nonce form (`INFRA_ONESHIELD_BLOCKED`). Edge-only, not a code defect |
| 38 | `/referral/` | company | `ReferralPage` → **`RouteShell`** | 3 (RouteShell hero + children `<Section>` + cta `<Section>`; the cards `<Section>` is gated off — no `related`, no sitemap children) | page-specific: `Content_Pages(2)` — `steps`, `prose` | **partial** — the only route with no dedicated V2 layout; it renders on the generic `RouteShell` frame with a body injected as children | done | none needed | title+desc in sitemap.ts | still on the generic `RouteShell` frame (§6.2) |

### 5.1 SEO — two facts behind the uniform column

1. **The Rank Math filters in `class-content-pages.php` are dead code today.**
   `grep -c '"seo"'` returns **0** on both `content-pages.json` and `product-pages.json`. The
   two filters registered at `class-content-pages.php:78-79` read `$page['seo']['title']` /
   `['description']` and fall through when empty — so they are unconditional no-ops for all
   31 `Content_Pages` routes. Not broken; dead until a `seo` block is added.
2. **The real WordPress SEO source is `wordpress/imports/content-manifest.json`,
   applied once at import.** All 38 entries carry `seo.title` and `seo.description`;
   `class-importer.php` writes them to `rank_math_title` / `rank_math_description` postmeta.
   **Editing `content-pages.json` copy does not update the meta** — only re-running the
   importer or editing in wp-admin does.

---

## 6. ROUTES ON `ShellPage` OR GENERIC RENDERING — COMPLETE LIST

### 6.1 React — served by `ShellPage`

**ZERO.** `src/app/router.tsx` — `const SHELL_ROUTES: RoutePath[] = []`, so the
`...SHELL_ROUTES.map(...)` spread registers nothing. `src/pages/ShellPage.tsx` likewise has
`const RELATED: Record<string, string[]> = {}`. Both are retained deliberately as the
landing for a route minted ahead of its content.

### 6.2 React — on a generic frame but not `ShellPage`

**One route.**

| route | how | evidence |
|---|---|---|
| `/referral/` | renders `<RouteShell>` directly, body passed as children | `src/pages/ReferralPage.tsx:53` `return (<RouteShell>`; frame at `src/components/layout/RouteShell.tsx:155` (hero), `:183` (children), `:207` (cta) |

Every other route has a bespoke page component or a page-local layout. The six hubs each
have their own layout (`ProductsHubLayout`, `SolutionsHubLayout`, `IndustriesHubLayout`,
`ResourcesHubLayout`, `CompanyHubLayout`, and bespoke sections for `/tich-hop/`);
`components/hub/HubLayout` is referenced only in comments explaining why it is *not* used.
Any document describing the hubs as sharing a generic `HubLayout` is stale.

### 6.3 WordPress — generic (non-page-specific) rendering

**Two routes are bare card walls**, i.e. a `Content_Pages` body consisting of one `cards`
section and nothing else:

| route | manifest slug | body | React equivalent |
|---|---|---|---|
| `/nganh/` | `nganh` | 1 × `cards(6)` | 5-section `IndustriesHubLayout` + hero diagram |
| `/tai-nguyen/` | `tai-nguyen` | 1 × `cards(6)` | 5-section `ResourcesHubLayout` |

`/lien-he/` also has a single `cards(2)` section, but it carries an **active `form_slot`**
rendering `[gcalls_lead_form]`, which is the page's substance and is ported — it is not a
card wall. Listed here only so the count reconciles.

**`/cong-ty/` is no longer on this list.** It was (audit-c §4.3 correctly recorded it as
such), and it was ported in `068c4b0`: 4 sections, `provenance: "PORTED"`, React H1 and the
3 principle cards verbatim.

### 6.4 Count

- React on `ShellPage`: **0**
- React on a generic frame (`RouteShell`): **1** — `/referral/`
- WordPress generic card wall: **2** — `/nganh/`, `/tai-nguyen/`

---

## 7. THE BLOG CORPUS IS NOT IN THE 38

Four independent checks.

**(a) `/blog/` is one registry entry.** `ROUTES.blog = '/blog/'`, sitemap id `WEB-026`, one
router entry. Individual articles have no `ROUTES` key and no `SITEMAP` entry.

**(b) The import manifest keeps them in separate arrays.**
`counts: {"pages":38,"articles":18,"media":13,"menuItems":62}` — `pages` and `articles` are
different arrays. The 38 is the page count.

**(c) The corpus record.**
`wordpress/wp-content/plugins/gcalls-core/data/corpus-migration.json` (`built_from: gc-db.sql`,
plugin 0.9.7) holds **250 articles**, tallied by me:

| status | count |
|---|---|
| `publish` | 18 |
| `draft` | 230 |
| `private` | 2 |
| **total** | **250** |

`policy.protected_ids` has exactly **18** entries — the published articles the migration may
not touch. `class-seo.php:42` independently corroborates 250.

*Correction carried forward from audit-c:* the "163 blog posts already imported as drafts"
figure predates this manifest and is a subset, not the total.

**(d) In React, article routes register zero paths in production.**
`src/data/blog/catalog.ts` holds 18 article entries. `src/data/blog/visibility.ts` gates on
`BLOG_PREVIEW_ENABLED = import.meta.env.DEV || import.meta.env.VITE_BLOG_PREVIEW === 'true'`,
so in a production build `VISIBLE_ARTICLES` is empty and the
`...VISIBLE_ARTICLES.map(...)` spread contributes nothing to the route table.

**Conclusion: the 38 contains `/blog/` once and zero articles. The post counts (18 / 230 / 2
= 250) do not inflate the route count.**

---

## 8. FINDINGS NEW SINCE `route-scope-audit-c.md`

### 8.1 `router.tsx` docstring is already fixed

At `351f7cf`, `src/app/router.tsx:9` reads *"Route table for the GCALLS website — 38
routes."* `git log -S"38 routes" -- src/app/router.tsx` → `385afbe`, the same commit that
added `route-scope-audit-c.md`. The report's "residual defect" line and its §6 closing item
should be treated as closed.

Other "37" occurrences remain and are still stale documentation, not code:
`docs/BOSS_DEMO_V1.md:157,179,180`, `docs/WORDPRESS_HEADLESS_AUDIT.md:340`.

### 8.2 `/cong-ty/` is ported — no longer "the single worst gap"

`068c4b0` generates the page from `COMPANY_HUB` read as data. `content-pages.json` `cong-ty`
now carries `prose` + `cards(3)` + `steps(4)` + `cards(5)`, `provenance: "PORTED"`, H1
identical to React's, and the three principle cards with identical titles and destinations.
The commit message records a claim guard that runs over the *generated output* and fails on
a founding year, customer/country count, awards, revenue, headcount, testimonials,
superlatives or uptime — and that also refuses any image reference, which is why the
official logo is still absent.

**Residual on this route:** the logo has no media-registry entry, so the WordPress page has
no brand visual. That is a real, small, named gap — not the copy conflict audit-c described.

### 8.3 `/tai-nguyen/` factual conflict is resolved

`grep "Chưa có bài viết" src/data/hubs.ts` → no matches. The Blog card's `points` now reads
`'Theo sáu danh mục biên tập'`. The React hub no longer asserts anything about article
counts, so it can no longer contradict WordPress. What remains on this route is the H1
divergence and the unported layout.

### 8.4 **RELEASE BLOCKER: the locked inventory disagrees with the manifest**

`wordpress/tests/content-completeness-test.php:196-214` builds
`$actual[slug] = count($page['sections'])` and compares it to
`content-inventory.json` `pages[slug]` with strict `!==`, failing the run on any
disagreement. I ran that comparison over all 31 slugs:

```
MISMATCH cong-ty  inventory=1  actual=4
total mismatches: 1 of 31
```

The `/cong-ty/` port (`068c4b0`) added 3 sections; `content-inventory.json` was not
regenerated. Both files are byte-identical between the working tree and
`wordpress/.release-053/gcalls-core/data/` (sha256 `7c116b94…` and `cfcdc73b…`), so the
**packaged 0.10.11 artifact carries the same mismatch**.

`release-manifest.json` lists `content-inventory.json` under
`generators.notGenerated` — *"produced by one-off migration/scan scripts; hashed, not
regenerated"* — which is exactly how a hand-maintained contract falls behind the data it
guards. The fix is a one-line deliberate edit (`"cong-ty": 1` → `4`), which is what that
file's own note asks for: *"Regenerate deliberately and review the diff."*

I did not verify whether `content-completeness-test.php` is executed by the release gate —
`build-051-release.mjs:467` prints `content gate: 6/6 audience · 30/30 checkpoints · 12/12
notes · manifest pages 31`, which is a different set of checks. **Unknown:** whether this
test runs in CI. If it does, the current tree fails it; if it does not, the section-deletion
guard is inactive.

### 8.5 The import manifest uploads 2 media the renderer never cites

`content-manifest.json` `media` carries 13 ids (`GP-01, 02, 03, 05, 07, 08, 09, 10, 11, 12,
13, 14, 15`). `product-pages.json` `gcalls-plus` cites 11 of them. **GP-01 and GP-08 are
imported into the media library but referenced by no section.** GP-08 is on the
`approvedMedia.blocked` list (PII); GP-01 appears on neither the `approved` nor the
`blocked` list, so it has no recorded verdict at all. Not a rendering defect — the gate is
fail-closed — but two files reach the media library without a live citation, and one of them
has no approval record.

### 8.6 `manifestPages` is a contract on a subset

See §4.3. Nothing asserts that the 7 non-`Content_Pages` routes still have a renderer, so a
product page dropped from `product-pages.json` would not fail the release gate.

---

## 9. TOP BLOCKERS BY FREQUENCY

| blocker | routes | count |
|---|---|---|
| React inline mockups have no WordPress counterpart | `/tong-dai-tich-hop-crm/`, `-helpdesk/`, `-pos/`, `/tong-dai-quoc-te/`, `/tich-hop/hubspot/`, `/salesforce/`, `/zoho-crm/`, `/freshdesk/`, `/zendesk/` | **9** |
| none | the six `/nganh/*` children, `/tai-nguyen/ebook/`, `/glossary/`, `/faq/`, `/cong-ty/khach-hang/`, `/cong-ty/doi-tac/` | **11** |
| hub visual (diagram / glyphs / per-card media) not ported | `/san-pham/`, `/giai-phap/`, `/tich-hop/`, `/nganh/` | **4** |
| product media awaiting owner review or approval | `/`, `/qc-bot-ai/`, `/gcalls-cx/`, `/voicebot-ai/`, `/gcalls-plus-webphone/` | **5** |
| H1 divergence blocks a layout port (owner decision) | `/nganh/`, `/tai-nguyen/` | **2** |
| memory-flagged / infra | `/lien-he/` (OneShield), `/gcalls-cx/` (PitelCX PII), `/tai-nguyen/guides/` (dropped bodies) | **3** |
| single-route blockers | `/bang-gia/` (`reviewRequired`), `/uoc-tinh-chi-phi/` (build-time body), `/blog/` (absent from live baseline), `/cong-ty/` (inventory mismatch + logo), `/referral/` (`RouteShell`), `/tai-nguyen/case-studies/` (client-side filter) | **6** |

The single highest-priority item is not on this table because it is not per-route: **§8.4,
the `cong-ty` inventory mismatch, fails a packaged test in 0.10.11.**

---

## 10. WHAT THIS AUDIT COULD NOT DETERMINE

- **Live rendered section counts.** No server was started, per the read-only constraint. All
  React counts are static counts of depth-1 JSX children; conditionally-rendered sections
  (`ProductsHubLayout`'s and `SolutionsHubLayout`'s decision guide, `RouteShell`'s cards
  section) are noted inline rather than silently included or excluded.
- **The WordPress section count for `/uoc-tinh-chi-phi/` and `/blog/`.** Their bodies are
  produced at build time by `page-bodies.mjs` from `src/data` modules, not stored in a
  committed JSON. Settling those two cells needs the generator run or a live page.
- **Whether the 13 approved media files are present in the live WordPress media library.**
  `Shortcodes::media()` resolves through `Importer::find_media()`, a database lookup. The
  repo shows intent (13 manifest entries) but cannot show live state.
- **Per-route Rank Math meta as it exists in the database.** The manifest supplies all 38;
  whether the importer has been run against the current manifest is a live-state question.
- **Whether `content-completeness-test.php` runs in the release pipeline** (§8.4). Needs the
  CI config or the test-runner script.
- **`docs/INVENTORY_003B_SECTION_MAPPING.md` is stale** and should not be used as the
  section reference: it reports the six hubs as a generic `HubLayout` at n=1 and
  `/referral/` at n=1, neither of which matches current source.
