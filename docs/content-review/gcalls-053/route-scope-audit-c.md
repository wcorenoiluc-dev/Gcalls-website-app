# GCALLS-053 TASK C — 38-route scope audit (read-only)

Date 2026-09-08. Working tree `/Users/macos/Desktop/Gcalls/App/Gcalls-react-ui-v2-integration`,
branch `feature/gcalls-react-ui-v2-integration`. Nothing was modified, started, deployed
or committed. Every number below is derived from source or from a versioned data file in
the repo; nothing is measured from a running server and nothing is estimated.

---

## 0. HEADLINE

**Route count: 38.** Three independent registries agree exactly, with zero drift:

| Registry | File | Count |
| --- | --- | --- |
| `ROUTES` object | `src/config/sitemap.ts:33-90` | **38** paths |
| `SITEMAP` entries | `src/config/sitemap.ts:153-972` (`route: ROUTES.*`) | **38** entries, no duplicates |
| Router | `src/app/router.tsx:183-273` | **38** (`path: ROUTES.home` layout + index + 37 children) |
| WordPress import manifest | `wordpress/imports/content-manifest.json` (`counts.pages`) | **38** |

Set-diff of all four is empty in both directions. All 38 `SITEMAP` entries carry
`status: 'complete'` — none is `shell` or `in_progress`. `src/config/navigation.ts`
imports `ROUTES` from `./sitemap` (`src/config/navigation.ts:12`) and contains **zero**
hardcoded path literals, so navigation cannot reference a route outside the registry.

**The 37/38 discrepancy is exactly ONE route: `/voicebot-ai/` (`ROUTES.voicebotAi`,
sitemap entry `WEB-037`).** It is not two-added-one-removed. Evidence in §2.

**Routes still served by `ShellPage`: ZERO.** `SHELL_ROUTES` is an empty array
(`src/app/router.tsx:181`), so the `ShellPage` branch registers nothing. `ShellPage`
and `RouteShell` are retained deliberately as the landing for a future
minted-ahead-of-content route. One route still renders *through* `RouteShell` directly:
`/referral/` (`src/pages/ReferralPage.tsx`, `return (<RouteShell>`). Full list of
generic/undifferentiated rendering — React and WordPress — in §4.

---

## 1. The 38 routes, verbatim from `src/config/sitemap.ts`

Key → path, in file order. Line numbers are the `ROUTES` block starting at
`src/config/sitemap.ts:33`.

```
// Core
home:                  '/'
// Products
products:              '/san-pham/'
gcallsPlus:            '/gcalls-plus-webphone/'
qcCenter:              '/qc-bot-ai/'
gcallsCx:              '/gcalls-cx/'
voicebotAi:            '/voicebot-ai/'          <-- the 38th (see §2)
// Solutions
solutions:             '/giai-phap/'
crmIntegration:        '/tong-dai-tich-hop-crm/'
helpdeskIntegration:   '/tong-dai-tich-hop-helpdesk/'
posIntegration:        '/tong-dai-tich-hop-pos/'
internationalCalling:  '/tong-dai-quoc-te/'
// Integrations
integrations:          '/tich-hop/'
hubspot:               '/tich-hop/hubspot/'
salesforce:            '/tich-hop/salesforce/'
zohoCrm:               '/tich-hop/zoho-crm/'
freshdesk:             '/tich-hop/freshdesk/'
zendesk:               '/tich-hop/zendesk/'
// Industries
industries:            '/nganh/'
education:             '/nganh/giao-duc/'
finance:               '/nganh/tai-chinh/'
insurance:             '/nganh/bao-hiem/'
realEstate:            '/nganh/bat-dong-san/'
ecommerce:             '/nganh/thuong-mai-dien-tu/'
bpo:                   '/nganh/bpo/'
// Pricing
pricing:               '/bang-gia/'
costEstimator:         '/uoc-tinh-chi-phi/'
// Resources
resources:             '/tai-nguyen/'
blog:                  '/blog/'
guides:                '/tai-nguyen/guides/'
caseStudies:           '/tai-nguyen/case-studies/'
ebook:                 '/tai-nguyen/ebook/'
glossary:              '/tai-nguyen/glossary/'
faq:                   '/tai-nguyen/faq/'
// Company
company:               '/cong-ty/'
customers:             '/cong-ty/khach-hang/'
partners:              '/cong-ty/doi-tac/'
contact:               '/lien-he/'
// Referral
referral:              '/referral/'
```

**Count: 38.** Breakdown by declared comment group: core 1, products 5, solutions 5,
integrations 6, industries 7, pricing 2, resources 7, company 4, referral 1 = 38.

### Cross-check against the router

`src/app/router.tsx` yields 38 distinct `path: ROUTES.*` keys plus the `index: true`
home route. Diffs:

- **In `ROUTES` but not routed: none.**
- **Routed but not in `ROUTES`: none.**
- **In `ROUTES` but missing a `SITEMAP` entry: none.**

Two router paths are NOT sitemap routes and are correctly excluded from the 38:

- `{ path: '*', element: <NotFoundPage /> }` — `src/app/router.tsx:270`, the 404 catch-all.
- `...VISIBLE_ARTICLES.map(...)` — `src/app/router.tsx:265-268`, blog article paths.
  `VISIBLE_ARTICLES` is **empty in a production build** (`src/data/blog/visibility.ts:49`
  filters on `isVisible`, and every Batch-1 article is `status: 'draft'`), so these register
  zero paths in production. See §5.

### Cross-check against navigation

`src/config/navigation.ts:12` — `import { ROUTES, getEntry, type RoutePath } from './sitemap'`,
re-exported at line 14. Every menu item is built with `item(ROUTES.x)`. A grep for
`path: '/…'` / `href: '/…'` literals across `src/config/` returns **zero matches**.
**No route is referenced in navigation but absent from sitemap.**

---

## 2. RESOLUTION OF THE 37 vs 38 DISCREPANCY

**The single route accounting for the difference is `/voicebot-ai/` — key `ROUTES.voicebotAi`,
sitemap id `WEB-037`, component `VoicebotAiPage`.**

It is one route added, not a net of several changes. Four independent lines of evidence:

**(a) Git diff of the ROUTES object.** Commit **`519ab5a`** — `feat(architecture): complete 37-route sitemap, mega menus
and page shells` — is the oldest commit touching this file
(`git log --oneline --all -- src/config/sitemap.ts`). Diffing that commit's `ROUTES`
block against HEAD's:

```
$ git show 519ab5a:src/config/sitemap.ts    # ROUTES block -> 37 keys
$ diff <old ROUTES> <current ROUTES>
9a10
>   voicebotAi: '/voicebot-ai/',
```

**One added line. Nothing removed. Nothing renamed.** 37 → 38.

**(b) The sitemap id sequence.** Ids run `WEB-001`…`WEB-036` plus `APP-001`
(`/uoc-tinh-chi-phi/`) = **37**. `WEB-037` is the highest `WEB-` id in the file and it is
`/voicebot-ai/` — and it sits *out of numeric order*, inside the products block between
`WEB-005` (`/gcalls-cx/`) and `WEB-006` (`/giai-phap/`). An id appended at the end of the
sequence but inserted in the middle of the file is the signature of a later addition.

**(c) The file's own scope note.** `src/config/sitemap.ts:21-25`:

> "VOICEBOT was on that list until Checkpoint WEB-PRO-004, which reversed the decision and
> minted `/voicebot-ai/` as a product route."

`docs/CHECKPOINT_PRO04_VOICEBOT_AI.md:178` confirms the edit: "`src/config/sitemap.ts` |
Route `voicebotAi`, entry `WEB-037`, scope note rewritten."

**(d) Where "37" still survives as a stale count.** These are the documents the owner saw:

| File:line | Text | Status |
| --- | --- | --- |
| `src/app/router.tsx:10` | "Route table for the GCALLS website — **37 routes**." | **STALE** — the router registers 38 |
| `docs/BOSS_DEMO_V1.md:157,179,180` | "18 of **37** routes", "All **37** routes loaded", "0 broken links across all **37** routes" | STALE — written pre-WEB-PRO-004 |
| `docs/WORDPRESS_HEADLESS_AUDIT.md:340` | "Collisions with the new **37-route** sitemap" | STALE — same vintage |
| `docs/CHECKPOINT_SITE_QA_001.md:74` | "The router's own header comment still says '37 routes', which was one stale count of its own." | **CORRECT** — already identified this exact defect |

`docs/CHECKPOINT_SITE_QA_001.md:59-64` states the resolved position: "`ROUTES` in
`src/config/sitemap.ts` holds 38 paths, `SITEMAP` holds 38 entries, and
`src/app/router.tsx` registers 38 — verified by parsing all three and diffing the key sets."

**Residual defect (not fixed by this read-only audit): the docstring at
`src/app/router.tsx:10` still says "37 routes" and is wrong.** It is the last live source
of the confusion.

---

## 3. THE 38 ROUTES

### How the columns were derived

- **sectionCount** — top-level JSX children of the page component's returned root, counted
  from source, excluding `<JsonLd>` and the breadcrumb wrapper `<div className="bg-brand-light/60 …">`.
  Where a page delegates to a shared layout, the layout's own frame sections are added
  (`ResourcePageLayout` = 6: hero, purpose, nav, routing, faq, cta —
  `src/components/resources/sections.tsx:525-566`; `CompanyPageLayout` = 6: hero, purpose,
  status, routing, faq, cta — `src/components/company/sections.tsx:551-598`).
- **currentRenderer** — traced to the PHP that emits the body.
- **mediaStatus** — from `src/data/productImages.ts`, `wordpress/imports/content-manifest.json`
  (`media`, 13 entries), `wordpress/wp-content/plugins/gcalls-core/data/media-frames.json`
  (raster verdicts) and `data/section-components.json` → `approvedMedia.approved`.
- **SEOStatus** — see §3.2. `"seo"` appears **0 times** in `content-pages.json` and 0 times
  in `product-pages.json` (verified by grep); the real source is the import manifest.

### 3.1 The table

| # | route | group | component | sectionCount | currentRenderer | ReactStatus | WordPressStatus | mediaStatus | SEOStatus | blocker |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | home | `HomePage` | **13** | Elementor — `data/homepage-elementor.json` via `includes/class-home-layout.php`; 13 sections in `data/homepage-inventory.json` | DONE | ALREADY-PORTED (13↔13, 1:1) | NONE raster; inline SVG/CSS mockups only | manifest `web-001` title+desc → Rank Math at import | none |
| 2 | `/san-pham/` | hub | `ProductsHubPage` → `ProductsHubLayout` | **6** (hero, direct answer, cards, decision guide *(conditional, `ProductsHubLayout.tsx:256`)*, links, cta) | Content_Pages (slug `san-pham`) — 4 sections + hero + cta = 6 blocks | DONE (page-local layout, not generic `HubLayout`) | PARTIAL | React: `GCALLS_PLUS_IMAGES.webphoneDesktop` via `productVisuals.tsx:21`. WP: **no media slot on hub cards** | manifest `web-002` | per-card media slot not ported to WP |
| 3 | `/gcalls-plus-webphone/` | product | `GcallsPlusPage` | **17** | shortcode `[gcalls_product_page id=gcalls-plus]` → `class-shortcodes.php:54` + `class-sections.php`; 14 sections + hero + direct + faq + cta | DONE | PARTIAL | **BLOCKED/REFUSED (partial).** Manifest cites 11 GP ids; `approvedMedia.approved` clears only **7** (GP-02, 05, 07, 11, 13, 14, 15). **GP-03, GP-09, GP-10, GP-12 render nothing** and fall back to a drawn diagram (`class-sections.php:423,449`). Separately all 6 raster frames in `media-frames.json` for this page are `REFUSED`, `in_package:false` | manifest `web-003` | 4 cited images unapproved; React shows the full 12-image approved set, WordPress shows 7 |
| 4 | `/qc-bot-ai/` | product | `QaQcCenterPage` | **18** | shortcode `[gcalls_product_page id=qa-qc]`; 15 sections + hero + direct + faq + cta | DONE | PARTIAL | Drawn mockups (`qc_dashboard`, `qc_review`, `qc_scorecard`, `qc_signals`, `qc_transcript`) + 1 PASS raster `qc-scoring` (`qc-scoring-dashboard-demo.webp`, `in_package:true`) | manifest `web-004` | F3 brief item "QA/QC neutral diagrams" not yet run (`react-wordpress-component-map.md`, §"Bốn trang sản phẩm") |
| 5 | `/gcalls-cx/` | product | `GcallsCxPage` | **19** | shortcode `[gcalls_product_page id=cx]`; 16 sections + hero + direct + faq + cta | DONE | PARTIAL | React: 5 approved CX captures in `public/images/products/gcalls-cx/`. WP: drawn `cx_context`/`cx_inbox`/`cx_report`/`cx_ticket` + 1 PASS raster `cx-omnichannel` | manifest `web-005` | "CX real-media từ `f4dddfb`" not ported; also memory-flagged — CX source screenshots are PitelCX+PII, resolved to neutral diagrams (commit `736ef8f`), do not rebrand without owner OK |
| 6 | `/voicebot-ai/` | product | `VoicebotAiPage` | **12** | shortcode `[gcalls_product_page id=voicebot]`; 10 sections + hero + faq + cta (no `direct` block) | DONE | PARTIAL | Drawn `voicebot_builder`, `voicebot_handoff` + 1 PASS raster `voicebot-flow`. Repo holds **no Voicebot screenshot** (claim guard, `src/data/voicebotAi.ts`) | manifest `web-037` | "Voicebot media slot" outstanding; no product evidence exists to fill it |
| 7 | `/giai-phap/` | hub | `SolutionsHubPage` → `SolutionsHubLayout` | **6** | Content_Pages (slug `giai-phap`) — 4 sections + hero + cta = 6 | DONE | PARTIAL | NONE | manifest `web-006` | per-card glyphs + two visual groups not ported |
| 8 | `/tong-dai-tich-hop-crm/` | solution | `CRMIntegrationPage` | **18** | Content_Pages (slug `tong-dai-tich-hop-crm`) — 14 + hero + faq + cta = 17 | DONE | PARTIAL | React: 4 inline mockups (CRMMockup, DialpadMockup, CustomerPopupMockup, CallTimelineMockup, WidgetMockup). WP: no mockup slots in manifest | manifest `web-007` | React mockup components have no WordPress counterpart on this route |
| 9 | `/tong-dai-tich-hop-helpdesk/` | solution | `HelpdeskIntegrationPage` | **16** | Content_Pages (slug `tong-dai-tich-hop-helpdesk`) — 12 + hero + faq + cta = 15 | DONE | PARTIAL | React: HelpdeskFlowMockup, SupportContextMockup. WP: none | manifest `web-008` | same as #8 |
| 10 | `/tong-dai-tich-hop-pos/` | solution | `POSIntegrationPage` | **16** | Content_Pages (slug `tong-dai-tich-hop-pos`) — 13 + hero + faq + cta = 16 | DONE | ALREADY-PORTED (block parity) | React: PosContextMockup, SalesContextMockup. WP: none | manifest `web-009` | mockups only |
| 11 | `/tong-dai-quoc-te/` | solution | `InternationalCallingPage` | **18** | Content_Pages (slug `tong-dai-quoc-te`) — 14 + hero + faq + cta = 17 | DONE | PARTIAL | React: InternationalNumbersMockup, CallRoutingMockup, NumberDirectoryMockup. WP: none | manifest `web-010` | mockups only |
| 12 | `/tich-hop/` | hub | `IntegrationsHubPage` (bespoke sections, not `HubLayout`) | **6** (breadcrumb + hero + direct answer + platform cards + decision guide + onward links + cta = 7 numbered, 6 content) | Content_Pages (slug `tich-hop`) — 4 + hero + cta = 6 | DONE | PARTIAL | React: neutral Gcalls→connection-layer→CRM/Helpdesk/POS diagram. WP: none | manifest `web-011` | hub diagram not ported |
| 13 | `/tich-hop/hubspot/` | integration-child | `HubspotIntegrationPage` | **17** | Content_Pages (slug `hubspot`) — 13 + hero + faq + cta = 16 | DONE | PARTIAL | React: CrmRecordClickToCallMockup, CustomerPopupMockup, CallTimelineMockup. WP: none | manifest `web-012` | mockups only |
| 14 | `/tich-hop/salesforce/` | integration-child | `SalesforceIntegrationPage` | **20** | Content_Pages (slug `salesforce`) — 15 + hero + faq + cta = 18 | DONE | PARTIAL | as #13 | manifest `web-013` | mockups only |
| 15 | `/tich-hop/zoho-crm/` | integration-child | `ZohoCrmIntegrationPage` | **19** | Content_Pages (slug `zoho-crm`) — 15 + hero + faq + cta = 18 | DONE | PARTIAL | React: CrmModuleContextMockup, CustomerContextPanelMockup. WP: none | manifest `web-014` | mockups only |
| 16 | `/tich-hop/freshdesk/` | integration-child | `FreshdeskIntegrationPage` | **20** | Content_Pages (slug `freshdesk`) — 16 + hero + faq + cta = 19 | DONE | PARTIAL | React: HelpdeskFlowMockup, SupportContextMockup. WP: none | manifest `web-015` | mockups only |
| 17 | `/tich-hop/zendesk/` | integration-child | `ZendeskIntegrationPage` | **20** | Content_Pages (slug `zendesk`) — 16 + hero + faq + cta = 19 | DONE | PARTIAL | React: SupportHandoverMockup. WP: none | manifest `web-016` | mockups only |
| 18 | `/nganh/` | hub | `IndustriesHubPage` → `IndustriesHubLayout` | **5** (hero, direct answer, cards, links, cta) | Content_Pages (slug `nganh`) — **1 `cards` section** + hero + cta = 3 | DONE (page-local layout + hero orientation diagram) | **NOT-PORTED (layout)** — card FIELDS restored (tags, cta, note) per `react-wordpress-component-map.md` Trap A/B; page-specific layout and hero diagram not ported | React: hero orientation diagram + per-card wayfinding icon. WP: NONE | manifest `web-017` | **generic card wall.** Also: WP copy is built from `src/data/industries/index.ts`, React hub from `src/data/hubs.ts` — different prose and different H1; reconciling changes H1 and SEO (owner decision) |
| 19 | `/nganh/giao-duc/` | industry-child | `IndustryPage industry="education"` | **9** | Content_Pages (slug `giao-duc`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED (9↔9) | NONE | manifest `web-018` | none |
| 20 | `/nganh/tai-chinh/` | industry-child | `IndustryPage industry="finance"` | **9** | Content_Pages (slug `tai-chinh`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED | NONE | manifest `web-019` | none |
| 21 | `/nganh/bao-hiem/` | industry-child | `IndustryPage industry="insurance"` | **9** | Content_Pages (slug `bao-hiem`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED | NONE | manifest `web-020` | none |
| 22 | `/nganh/bat-dong-san/` | industry-child | `IndustryPage industry="real-estate"` | **9** | Content_Pages (slug `bat-dong-san`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED | NONE | manifest `web-021` | none |
| 23 | `/nganh/thuong-mai-dien-tu/` | industry-child | `IndustryPage industry="ecommerce"` | **9** | Content_Pages (slug `thuong-mai-dien-tu`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED | NONE | manifest `web-022` | none |
| 24 | `/nganh/bpo/` | industry-child | `IndustryPage industry="bpo"` | **9** | Content_Pages (slug `bpo`) — 6 + hero + faq + cta = 9 | DONE | ALREADY-PORTED | NONE | manifest `web-023` | none |
| 25 | `/bang-gia/` | utility | `PricingPage` | **10** | Content_Pages (slug `bang-gia`) — 6 + hero + faq + cta = 9. Manifest carries `reviewRequired` (the only page that does) | DONE | PARTIAL | NONE | manifest `web-024` | React `PricingProductSelector` / `PricingComparison` / `EstimatorPreview` are interactive; WP has static cards. `reviewRequired` flag is unresolved in the manifest |
| 26 | `/uoc-tinh-chi-phi/` | utility | `CostEstimatorPage` | **7** (hero + estimator + drivers + how-it-works + transparency + faq + cta) | shortcode `[gcalls_estimator]` — `class-shortcodes.php:51,738`, config in `data/estimator-config.json`. **Not** in `content-pages.json` | DONE | PARTIAL | NONE | manifest `app-001` | body is a bare shortcode pasted into post content; the 6 surrounding React sections have no WordPress representation |
| 27 | `/tai-nguyen/` | hub | `ResourcesHubPage` → `ResourcesHubLayout` | **5** (hero, direct answer, cards, links, cta) | Content_Pages (slug `tai-nguyen`) — **1 `cards` section** + hero + cta = 3 | DONE (page-local 262-line layout) | **NOT-PORTED (layout)** — card fields restored; layout not ported | NONE | manifest `web-025` | **generic card wall.** Plus a **CONFLICT**: `RESOURCES_HUB` tags Blog "Chưa có bài viết", which is false on WordPress where `/blog/` is the posts page of 18 published articles. The status field is deliberately withheld from the port — owner must decide (fix React or never port the field) |
| 28 | `/blog/` | blog | `BlogPage` → `ResourcePageLayout` | **9** (6 frame + BlogArchiveSection, BlogCategorySection, ResourceStatusSection) | **theme template** — `wp-content/themes/gcalls-theme/home.php`, the Posts page, grouped by `gcalls_hub` taxonomy. Not Elementor, not Content_Pages | DONE | PARTIAL | NONE | manifest `web-026`; `isPostsPage:true` | React archive is a static category listing; WordPress lists 18 real published posts. The two disagree about what exists (see #27) |
| 29 | `/tai-nguyen/guides/` | resource-child | `GuidesPage` → `ResourcePageLayout` | **8** (6 + GuidePathSection, ResourceStatusSection) | Content_Pages (slug `guides`) — 4 + hero + faq + cta = 7 | DONE | PARTIAL | NONE | manifest `web-027` | memory-flagged residual gap: guides path BODIES were dropped and the completeness test does not catch it |
| 30 | `/tai-nguyen/case-studies/` | resource-child | `CaseStudiesPage` → `ResourcePageLayout` | **10** (6 + ResourceItemGrid, CaseFilterSection, EvidenceStandardSection, ResourceStatusSection) | Content_Pages (slug `case-studies`) — 6 + hero + faq + cta = 9 | DONE | PARTIAL | NONE | manifest `web-028` | client-side filter (`CaseFilterSection`) has no WP counterpart |
| 31 | `/tai-nguyen/ebook/` | resource-child | `EbookPage` → `ResourcePageLayout` | **9** (6 + EbookTopicSection, ResourceItemGrid, ResourceStatusSection) | Content_Pages (slug `ebook`) — 5 + hero + faq + cta = 8 | DONE | ALREADY-PORTED (near parity) | NONE | manifest `web-029` | none |
| 32 | `/tai-nguyen/glossary/` | resource-child | `GlossaryPage` → `ResourcePageLayout` | **8** (6 + GlossaryIndexSection, GlossaryGroupsSection) | Content_Pages (slug `glossary`) — 9 + hero + faq + cta = 12 | DONE | ALREADY-PORTED | NONE | manifest `web-030` | none |
| 33 | `/tai-nguyen/faq/` | resource-child | `FaqPage` → `ResourcePageLayout` | **8** (6 + FaqIndexSection, FaqGroupsSection) | Content_Pages (slug `faq`) — 9 + hero + cta = 11 (page-level `faq` array empty; the Q&A lives in the 9 sections) | DONE | ALREADY-PORTED | NONE | manifest `web-031` | none |
| 34 | `/cong-ty/` | hub | `CompanyHubPage` → `CompanyHubLayout` (382 lines) | **7** (hero, direct answer, cards, decision guide, contact, links, cta) | Content_Pages (slug `cong-ty`) — **1 `cards` section containing 2 cards** + hero + cta = 3 | DONE | **NOT-PORTED — CONFLICT** | React: official logo `/images/brand/gcalls-official-logo-137x40.png` via `company-hub/BrandVisual.tsx:31`. **WP has no route into its media registry for it** | manifest `web-032` | **The single worst gap.** WP's 2 cards are child-page links (Khách hàng, Đối tác); React's 3 cards are *principles* pointing at `/san-pham/`, `/giai-phap/`, `/lien-he/` — **new copy, not dropped fields**, so a port script cannot fix it. Needs owner approval. Logo also unported |
| 35 | `/cong-ty/khach-hang/` | company-child | `CustomersPage` → `CompanyPageLayout` | **12** (6 frame + 6 children) | Content_Pages (slug `khach-hang`) — 9 + hero + faq + cta = 12 | DONE | ALREADY-PORTED (12↔12) | NONE (no logo wall — permission gate is a type error, `src/data/company/types.ts`) | manifest `web-033` | none |
| 36 | `/cong-ty/doi-tac/` | company-child | `PartnersPage` → `CompanyPageLayout` | **12** (6 frame + 5 children + 1 `afterStatus`) | Content_Pages (slug `doi-tac`) — 9 + hero + faq + cta = 12 | DONE | ALREADY-PORTED (12↔12) | NONE | manifest `web-034` | none — the "no partnership implied" step-note was the GCALLS-053 Trap A fix and now renders |
| 37 | `/lien-he/` | utility | `ContactPage` | **1** (one `<Section>`: ContactInfoPanel + LeadForm) | Content_Pages (slug `lien-he`) — 1 `cards` section + hero + `form_slot` (active) rendering `[gcalls_lead_form]` = 3 | DONE | ALREADY-PORTED | NONE | manifest `web-035` | memory-flagged infra: OneShield edge strips security headers on `/lien-he/`, blocking any nonce form (INFRA_ONESHIELD_BLOCKED) — edge-only, not a code defect |
| 38 | `/referral/` | utility | `ReferralPage` → **`RouteShell`** | **3** (RouteShell hero + children `<Section>` + cta `<Section>`; the cards `<Section>` is skipped — no `related` prop passed) | Content_Pages (slug `referral`) — 2 sections (`steps`, `prose`) + hero + cta = 4 | **PARTIAL** — the only route with no dedicated V2 layout; it renders through the generic `RouteShell` frame with a body injected as children | ALREADY-PORTED | NONE | manifest `web-036` | **still on the generic `RouteShell` frame** (see §4) |

### 3.2 SEO — what actually supplies title and description

Verified facts:

- `grep -c '"seo"' wordpress/wp-content/plugins/gcalls-core/data/content-pages.json` → **0**.
- Same grep on `data/product-pages.json` → **0**.
- `includes/class-content-pages.php:78-79` registers two Rank Math filters at priority 25;
  their bodies (`:897-913`) read `$page['seo']['title']` / `$page['seo']['description']`
  and fall through to the incoming value when empty.

**Therefore both filters are unconditional no-ops today for all 31 manifest routes.** They
are not broken — they are dead until someone adds a `seo` block to the manifest.

**The real SEO source for all 38 routes is `wordpress/imports/content-manifest.json`.** It
carries 38 page entries and **38 of 38 have both `seo.title` and `seo.description`
populated** (verified by iteration). `includes/class-importer.php` consumes the `seo` field
and writes `rank_math_title` / `rank_math_description` postmeta (constants at
`class-seo.php:31-34`). So SEO is **written once at import time**, not computed per request.

Two consequences worth recording:

1. **SEO is fixed at import.** Editing `content-pages.json` copy does not update the
   Rank Math meta. Re-running the importer, or editing in WP admin, is the only path.
2. `class-seo.php:61-63` registers a *different* pair of Rank Math fallbacks, and those
   are scoped to **articles**, not pages: the comment at `class-seo.php:42-43` states they
   exist "for articles Rank Math has no title or description for — 46 and 21 of the 250
   respectively", and both bail on `! is_singular()`. They never touch the 38 routes' pages
   beyond the generic singular path.

`src/config/seo.ts` supplies the React-side title/description; every one of the 38
`SITEMAP` entries carries a `title` and `description` field (`sitemap.ts:96-101`, required
by the `SitemapEntry` interface), so **no route lacks an SEO source on either side**.

---

## 4. ROUTES ON `ShellPage` OR GENERIC / UNDIFFERENTIATED RENDERING

### 4.1 React — routes served by `ShellPage`

**ZERO.**

`src/app/router.tsx:181` — `const SHELL_ROUTES: RoutePath[] = []`. The spread at
`:251-254` therefore registers nothing. The header comment at `:170-180` records that the
array and `ShellPage` are kept on purpose as the landing for a route minted ahead of its
content, and `src/pages/ShellPage.tsx:26` has `const RELATED: Record<string, string[]> = {}`
to match.

### 4.2 React — routes still on a generic frame (not `ShellPage`, but not bespoke either)

| route | how | evidence |
| --- | --- | --- |
| `/referral/` | renders `<RouteShell>` directly with a two-block body as children | `src/pages/ReferralPage.tsx` — `return (<RouteShell>`; `src/components/layout/RouteShell.tsx:155,183,207` |

This is the **only** one. Every other route has either a bespoke page component or a
page-local layout. Note in particular that the INVENTORY_003B document's claim that the six
hubs share a generic `hub/HubLayout` at n=1 is **stale**: each hub now has its own layout
(`ProductsHubLayout`, `SolutionsHubLayout`, `IndustriesHubLayout`, `ResourcesHubLayout`,
`CompanyHubLayout`, and bespoke sections for `/tich-hop/`), and `hub/HubLayout` is now
referenced only in comments explaining why it is *not* used.

### 4.3 WordPress — routes rendered as a bare card wall with no page-specific layout

**Four routes.** All are `Content_Pages` slugs whose manifest body is a single `cards`
section:

| route | manifest slug | body | evidence |
| --- | --- | --- | --- |
| **`/cong-ty/`** | `cong-ty` | 1 `cards` section, **2 cards** vs a 7-section React layout | `content-pages.json` → `cong-ty.sections` length 1; `content-inventory.json.pages["cong-ty"] = 1` |
| **`/nganh/`** | `nganh` | 1 `cards` section, 6 cards vs a 5-section React layout + hero diagram | `content-inventory.json.pages["nganh"] = 1` |
| **`/tai-nguyen/`** | `tai-nguyen` | 1 `cards` section, 6 cards vs a 5-section React layout | `content-inventory.json.pages["tai-nguyen"] = 1` |
| `/lien-he/` | `lien-he` | 1 `cards` section (email + hotline) **plus an active `form_slot`** — borderline, listed for completeness; the form is the page's substance and it is ported | `content-pages.json` → `lien-he.form_slot.state = "active"` |

Per `docs/content-review/gcalls-053/react-wordpress-component-map.md` (Trap A/B), the card
**fields** on `/nganh/` and `/tai-nguyen/` have been restored (tags, per-card CTA labels,
section note), but the **page-specific layouts** have not. `/cong-ty/` is a different
problem: it is not missing fields, it is missing *copy the React page has and WordPress
never had*.

### 4.4 WordPress — routes with no manifest entry at all

Not gaps, just different renderers; recorded so the count reconciles:

- `/` → Elementor (`data/homepage-elementor.json`)
- `/gcalls-plus-webphone/`, `/qc-bot-ai/`, `/gcalls-cx/`, `/voicebot-ai/` → `[gcalls_product_page]`
- `/uoc-tinh-chi-phi/` → `[gcalls_estimator]`
- `/blog/` → theme `home.php`

**31 (Content_Pages) + 4 (product shortcode) + 1 (estimator shortcode) + 1 (Elementor home)
+ 1 (theme blog) = 38.** No route is `NOT PRESENT`.

---

## 5. THE BLOG CORPUS IS NOT INSIDE THE 38

Confirmed, with four independent pieces of evidence.

**(a) `/blog/` is exactly one entry in the registry.** `ROUTES.blog = '/blog/'`, sitemap id
`WEB-026`, one router entry (`src/app/router.tsx:227`). Individual articles have no `ROUTES`
key and no `SITEMAP` entry.

**(b) The import manifest separates them structurally.**
`wordpress/imports/content-manifest.json` → `counts`:

```json
{"pages": 38, "articles": 18, "media": 13, "menuItems": 62}
```

`pages` and `articles` are different arrays. The 38 is the page count; the articles are
counted apart.

**(c) The repo's own corpus record.**
`wordpress/wp-content/plugins/gcalls-core/data/corpus-migration.json` (`built_from: gc-db.sql`,
plugin 0.9.7) holds **250 articles**:

| status | count |
| --- | --- |
| `publish` | **18** |
| `draft` | **230** |
| `private` | 2 |
| **total** | **250** |

`policy.protected_ids` has exactly **18** entries — the published articles the migration is
forbidden to touch (`never_change_status: true`, `never_publish_draft: true`).

> **Correction to the brief.** The task states "18 published posts + 163 drafts". The repo's
> current record is **18 published + 230 drafts + 2 private = 250**. The 163 figure is the
> earlier "163 blog posts already imported as drafts" finding, which pre-dates this manifest;
> it is a subset, not the total. `class-seo.php:42` independently corroborates 250
> ("46 and 21 of the 250"). Either way, none of these are routes.

**(d) In React, article routes register zero paths in production.**
`src/data/blog/catalog.ts` holds 18 article entries; every one is `status: 'draft'`, so
`VISIBLE_ARTICLES` (`src/data/blog/visibility.ts:49`) filters to an empty array and the
`...VISIBLE_ARTICLES.map(...)` spread at `src/app/router.tsx:265-268` contributes **nothing**
to the route table. The router comment at `:259-263` states this is the primary of three
guards against a draft shipping.

**Conclusion: the 38 count contains `/blog/` once and zero articles.**

---

## 6. WHAT MUST HAPPEN FOR EACH NOT-PORTED / CONFLICT ROUTE

Only three routes are worse than PARTIAL. In priority order:

**1. `/cong-ty/` — NOT-PORTED, CONFLICT, needs owner.**
WordPress renders 1 card section with 2 child-page links; React renders a 7-section
`CompanyHubLayout` whose 3 cards are *principles* pointing at `/san-pham/`, `/giai-phap/`
and `/lien-he/`. That is new approved copy, not fields a script dropped, so no port script
can close it. Required: (a) owner approves the React principle copy for WordPress;
(b) `gcalls-official-logo-137x40.png` is given a route into the WordPress media registry
(it is hashed in commit `e60b714` but has no importer entry); (c) the contact block's
verified details are added to the manifest. Until then `/cong-ty/` is a card wall.

**2. `/nganh/` — layout NOT-PORTED, plus a copy-source divergence.**
Card fields are done. Outstanding: the page-local `IndustriesHubLayout` (5 sections) and the
hero orientation diagram. Blocking decision first: WordPress builds this page from
`src/data/industries/index.ts` while the React hub uses `src/data/hubs.ts` (`INDUSTRIES_HUB`).
The two agree on the six card titles and their order but **differ in prose and in the hero
H1**. Porting the React layout without settling that changes the H1 and therefore the SEO
record written at import. Owner decision required before any layout work.

**3. `/tai-nguyen/` — layout NOT-PORTED, plus a factual conflict.**
Card fields are done; the 262-line `ResourcesHubLayout` (5 sections) is not. Same
`src/data/resources/index.ts` vs `src/data/hubs.ts` divergence as `/nganh/`. **In addition**,
`RESOURCES_HUB` labels the Blog card "Chưa có bài viết" — false on WordPress, where `/blog/`
is the posts page of 18 published articles. The port deliberately withholds that one field.
Owner must choose: correct the status in `src/data/hubs.ts` to match reality, or accept that
WordPress permanently does not port that field.

### Second tier — PARTIAL routes with a concrete named gap

- **`/gcalls-plus-webphone/`** — 4 of the 11 media ids the manifest cites (**GP-03, GP-09,
  GP-10, GP-12**) are absent from `approvedMedia.approved`, so those sections silently fall
  back to a drawn diagram. Either approve them through the contract (with a recorded reason)
  or remove the citations. React already ships all 12 approved masked captures; WordPress
  shows 7.
- **The four product pages** (`/gcalls-plus-webphone/`, `/qc-bot-ai/`, `/gcalls-cx/`,
  `/voicebot-ai/`) — the F3 brief items (page-local ProductStage, CX real media from
  `f4dddfb`, QA/QC neutral diagrams, Voicebot media slot) were deliberately deferred until
  GCALLS-052 settles the homepage, to avoid porting twice.
- **`/uoc-tinh-chi-phi/`** — the WordPress page body is a bare `[gcalls_estimator]`
  shortcode. The six React sections around the calculator (hero, cost drivers, how it works,
  transparency note, FAQ, CTA) have no WordPress representation at all.
- **`/bang-gia/`** — the only manifest page carrying `reviewRequired`, still unresolved.
  React's product selector, comparison table and estimator preview are interactive; the
  WordPress port is static cards.
- **The 9 solution/integration detail routes** — block counts are at or within 2 of parity;
  what is missing on every one of them is the React inline mockup components, which have no
  WordPress counterpart on those routes.
- **`/tai-nguyen/guides/`** — memory-flagged residual gap: the guides path **bodies** were
  dropped in the port and `content-completeness-test.php` does not detect it (it locks
  section counts, and the section is present but thin).

### Documentation defect to fix (one line, not in this audit's write scope)

`src/app/router.tsx:10` still reads "Route table for the GCALLS website — 37 routes." It is
the last live source of the 37/38 confusion and should read 38.

---

## 7. WHAT THIS AUDIT COULD NOT DETERMINE

- **Live rendered section counts.** No server was started and no live site was touched, per
  the read-only constraint. All React counts are static counts of top-level JSX children;
  a conditionally-rendered section (`/san-pham/`'s decision guide, `ProductsHubLayout.tsx:256`;
  `RouteShell`'s cards section) is noted inline rather than silently included or excluded.
- **Whether the 13 approved media files are actually present in the WordPress media library.**
  `Shortcodes::media()` resolves through `Importer::find_media()`, which is a database
  lookup. The repo shows the manifest intent (13 entries) and the plugin's own
  `assets/images/product-gallery/` (3 PASS + 6 REFUSED demo rasters); it cannot show what a
  live WordPress instance holds.
- **Per-route Rank Math meta as it exists in the database.** The manifest supplies all 38;
  whether the importer has been run against the current manifest is a live-state question.
- **`docs/INVENTORY_003B_SECTION_MAPPING.md` is stale** and should not be used as the section
  reference. It reports the six hubs as generic `HubLayout` at n=1 and `/referral/` at n=1,
  neither of which matches current source. Its per-page numbers for the product pages
  (17/18/19/12) do still match; its integration-page numbers do not.
