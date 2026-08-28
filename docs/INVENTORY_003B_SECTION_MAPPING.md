# INVENTORY — GCALLS-WORDPRESS-MIGRATION-003B

**Section-by-section mapping: React → WordPress / Elementor.**

| | |
| --- | --- |
| Status | **Preparation only.** Nothing in this document has been built. |
| Source ref | `8f6ea16` (`feature/gcalls-wordpress-migration`), plus this document |
| Live host | **Not touched.** No page, template or setting on the demo host was created or changed while writing this. |
| Regenerate the numbers | `node wordpress/scripts/section-inventory.mjs` |

> **This is an inventory, not a build order for the live site.** Section 10
> proposes a sequence; executing it is 003B and needs the owner at the console
> (see `docs/RUNBOOK_003A_LIVE_HARDENING.md` for why the host is owner-only).

---

## 0. What 003B has to produce

Rebuild the React site as WordPress content:

- **38 pages** (`wordpress/imports/content-manifest.json` → `counts.pages`)
- **18 blog articles** as posts, in the block editor, on `gcalls_hub` terms
- **13 media** items
- the layouts for all of the above, built in Elementor Free

003A delivered the foundation this stands on and none of it is re-litigated
here: the theme, the `gcalls-core` plugin, the `gcalls_hub` taxonomy, FAQ meta
and `FAQPage` schema, breadcrumbs and their JSON-LD, the redirect map, the
import pipeline, the server config and the user-enumeration hardening.

---

## 1. The size of the job (measured, not estimated)

| Measure | Count | Source |
| --- | --- | --- |
| Routes / pages to create | 38 | `content-manifest.json` |
| Page components in React | 36 | `src/pages/*.tsx` |
| Section instances across those components | 266 | `section-inventory.mjs --pages` |
| Distinct sections | 142 | `--reuse` |
| — used on ≥ 2 pages | 28 | |
| — used on exactly 1 page | 114 | |
| Layout primitives (not sections) | 9 | `Container`, `Section`, `SectionHeader`, `Card`, `Eyebrow`, `GradientHeading`, `JsonLd`, `RouteFallback`, `Breadcrumb` |
| Component files under `src/components` (excl. `ui/`, `figma/`) | 100 | `--interactive` |
| — interactive (state, events, charts or network) | 36 | |
| Blog articles | 18 | manifest |
| Media | 13 | manifest |
| HUB terms | 7 | `class-hub-taxonomy.php` |
| CTA links carrying lead attribution | 77 call sites | `grep leadCtaHref` |
| Analytics event names | 12 | `src/lib/analytics.ts` |

**36 components, 38 pages** reconciles as: 33 components map to manifest pages,
of which `IndustryPage` alone serves 6 routes (33 − 1 + 6 = 38). The other
three are not pages — `BlogArticlePage` renders the 18 posts, `NotFoundPage` is
the theme's `404.php`, and `ShellPage` serves an empty route list and has no
WordPress counterpart at all.

---

## 2. Constraints that decide every row below

These are settled by 003A and by the handover terms. They are listed because
each one removes an option that would otherwise look attractive.

1. **Elementor Free, no Pro licence.** No Theme Builder, no Global Widgets, no
   Loop Grid, no Forms widget, no Popup Builder. `elementor-templates/README.md`
   makes this a rule: a template using a Pro widget imports as a blank box.
2. **A saved template is a copy, not a reference.** Inserting one duplicates its
   markup into the page; editing the library entry afterwards changes nothing
   already inserted. Reuse therefore saves *authoring* time and buys *nothing*
   in maintenance. **This is the single most consequential fact in this
   document** — anything that will need editing after launch must not be
   duplicated across 9 pages as Elementor widgets. It belongs in PHP.
3. **No ACF.** Structured per-page content has exactly two homes: inside the
   Elementor tree, or in post meta registered by `gcalls-core`.
4. **Rank Math owns the document head.** Titles, descriptions, canonicals, OG
   and the XML sitemap. `gcalls-core` only feeds it. Nothing in 003B writes head
   tags.
5. **Posts are not built in Elementor** (`inc/elementor.php` restricts it to
   `page`). The 18 articles are block-editor prose.
6. **Breadcrumbs and FAQ schema already exist in PHP** —
   `Breadcrumbs::render()` and `Faq::render()`. They are not to be rebuilt as
   Elementor widgets, which would duplicate the JSON-LD.
7. **The site is `noindex` until go-live** and the host serves `Disallow: /`.
   Nothing in 003B flips that; it is a launch step.

---

## 3. Build classes

Every section in this document is assigned one of five classes.

| Class | Means | Where it lives | Applies when |
| --- | --- | --- | --- |
| **T** | Elementor **saved template** | `wordpress/elementor-templates/*.json`, imported per page | Static, appears on ≥ 2 pages, wording differs per page |
| **P** | Elementor **page-specific** section | Only in that page's `_elementor_data` | Static, appears once |
| **S** | **Shortcode** rendered by `gcalls-core`, dropped into Elementor with a Shortcode widget | `includes/` + `assets/` | Interactive, data-driven, or must stay editable in one place |
| **H** | **Theme PHP** — header, footer, breadcrumb, 404 | `gcalls-theme` | Site chrome, already built |
| **X** | **Not migrated** | — | A React mechanism WordPress already provides |

**The T/S line is the one that matters.** A section is class **S** — not T —
if any of these is true:

- it holds state, listens for events, or animates;
- it renders a chart;
- it submits or fetches;
- its content is a list that will be edited after launch (plans, glossary,
  FAQ, customers, partners, article index);
- it appears on ≥ 4 pages *and* its wording is identical on all of them.

The last rule exists because of constraint 2: nine copies of the same markup
are nine edits later.

> **There is no shortcode layer yet.** `grep -rn "add_shortcode" wordpress/`
> returns nothing today. Building it is the first deliverable of 003B, and
> every class **S** row below depends on it.

---

## 4. Global chrome — mostly done already

| React | Class | WordPress counterpart | State |
| --- | --- | --- | --- |
| `navigation/Header`, `DesktopNav`, `MobileMenu` | H | `header.php` + `assets/js/navigation.js` | **Built** (003A) |
| `layout/SiteLayout` footer | H | `footer.php` | **Built** |
| `layout/Breadcrumb` | H | `gcalls_core_breadcrumbs()` + BreadcrumbList JSON-LD | **Built** |
| `common/JsonLd` | X | Rank Math + `gcalls-core` schema modules | **Built** |
| `common/Seo` | X | Rank Math, fed by the importer's `seo` fields | **Built** |
| `app/router.tsx`, `RouteFallback`, `lazy()` | X | WordPress routing; no client router to replace | n/a |
| `NotFoundPage` | H | `404.php` | **Built** |
| `layout/RouteShell`, `ShellPage` | X | No counterpart — the shell existed to serve routes with no content; every route now has content | Drop |

Nothing in this table is 003B work beyond checking it renders.

---

## 5. The shared section library — build these first

The 28 sections used on more than one page. Building these before touching an
individual page is what keeps 266 section instances from becoming 266 authoring
tasks.

| Section | Pages | Class | Note |
| --- | --- | --- | --- |
| `IntegrationHero` | 9 | **T** | Title, sub, two CTAs, one visual slot |
| `IntegrationProblems` | 9 | **T** | Problem cards, 3–4 per page |
| `IntegrationSteps` | 9 | **T** | Numbered steps |
| `ProductVisual` | 9 | **T** | Frame around a mockup; the mockup itself is media |
| `IntegrationBoundaries` | 8 | **T** | "What this does not do" — same shape, different rows |
| `IntegrationWorkflow` | 8 | **T** | |
| `IntegrationBeforeAfter` | 7 | **T** | Two-column comparison |
| `IntegrationUseCases` | 6 | **T** | |
| `HubLayout` | 6 | **S** | Hub index pages read a child list — see §7 |
| `PricingCtaBand` | 6 | **S** | Prices change; six duplicated copies would drift |
| `ResourcePageLayout` | 6 | **T** | Resource page frame |
| `FaqAccordion` | 15 | **S** | `[gcalls_faq]` → `Faq::render()`. Already exists in PHP and already emits `FAQPage` JSON-LD; an Elementor accordion would duplicate the schema |
| `FinalCtaBand` | 15 | **S** | Carries lead attribution — see §8 |
| `FeatureSplit` | 4 | **T** | Text + visual, alternating |
| `IntegrationBenefits` | 4 | **T** | |
| `ResourceStatusSection` | 4 | **S** | Publication status of resource items |
| `CallTimelineMockup` | 3 | **P**/media | Static image or inline SVG |
| `CustomerPopupMockup` | 3 | **P**/media | |
| `CompanyItemGrid`, `CompanyPageLayout`, `CompanyStepsSection` | 2 each | **S** | Customers and partners are edited lists |
| `ResourceItemGrid` | 2 | **S** | |
| `IntegrationPlatforms` | 2 | **T** | Logo grid |
| `ProductVisualWithSupport` | 2 | **T** | |
| `CrmRecordClickToCallMockup`, `HelpdeskFlowMockup`, `SupportContextMockup` | 2 each | **P**/media | |

Primitives (`Section`, `Container`, `SectionHeader`, `Card`, `Eyebrow`,
`GradientHeading`) are **not** templates. They become Elementor container
settings and the kit's typography styles, defined once in Site Settings against
`assets/css/theme.css`. Getting these into the kit before the first page is
built is what stops per-widget colour overrides, which
`elementor-templates/README.md` forbids.

---

## 6. Per-page inventory

Sections in render order, primitives omitted. Classes come from §5 and §7.
Every page uses the `page-templates/full-width.php` template
(`content-manifest.json`).

### 6.1 Core

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/` | `HomePage` | 13 | Hero · PainPointsSection · SolutionBridgeSection · EcosystemSection · CallTimelineSection · CRMSection · AnalyticsSection · CloudSection · CustomerPopupSection · CallWidgetSection · IntegrationCtaSection · WorkFromAnywhereSection · UseCasesFinalCtaSection |

The home page is the **hardest page on the site** and must not be first. Seven
of its thirteen sections are animated or charted (§7): `Hero`,
`CallTimelineSection`, `CRMSection`, `AnalyticsSection`, `CloudSection`,
`IntegrationCtaSection`, `WorkFromAnywhereSection`. An eighth is hidden:
`PainPointsSection` renders `LossEstimator`, a 354-line interactive calculator
that does not appear in the page's own imports and is easy to miss when
counting the work. `TeamSection` is genuinely retired — `HomePage` records why
— and is out of scope.

### 6.2 Products

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/san-pham/` | `ProductsHubPage` | 1 | HubLayout |
| `/gcalls-plus-webphone/` | `GcallsPlusPage` | 17 | GcallsPlusHero · DirectAnswer · GcallsPlusProblems · GcallsPlusOverview · GcallsPlusFeatures · InteractionHistory · CustomerContext · WorkflowSection · PerformanceSection · IntegrationSection · UseCases · ProductBoundaries · DeploymentSection · PricingCTA · CustomerStory · FaqAccordion · FinalCtaBand |
| `/qc-bot-ai/` | `QaQcCenterPage` | 18 | QaQcHero · QaQcDirectAnswer · QaQcProblems · QaQcOverview · QaQcHowItWorks · QaQcCapabilities · QaQcScoring · QaQcSignals · QaQcHumanLoop · QaQcDashboard · QaQcBenefits · QaQcUseCases · QaQcIntegration · QaQcBoundaries · QaQcStory · PricingCtaBand · FaqAccordion · FinalCtaBand |
| `/gcalls-cx/` | `GcallsCxPage` | 19 | CxHero · CxDirectAnswer · CxProblems · CxOverview · CxChannels · CxInbox · CxTickets · CxCustomerContext · CxHowItWorks · CxReporting · CxBenefits · CxUseCases · CxIntegration · CxBoundaries · CxDeployment · CxTrust · PricingCtaBand · FaqAccordion · FinalCtaBand |
| `/voicebot-ai/` | `VoicebotAiPage` | 12 | VoicebotHero · VoicebotProblems · VoicebotUseCases · VoicebotHowItWorks · VoicebotCapabilities · VoicebotHumanAi · VoicebotIntegration · VoicebotIndustries · VoicebotDeployment · VoicebotOutcomes · FaqAccordion · FinalCtaBand |

All four product pages are class **P** section-by-section (each section appears
once) except the trailing shared bands. `PerformanceSection`, `QaQcDashboard`
and `CxReporting` render charts — see §7.

### 6.3 Solutions

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/giai-phap/` | `SolutionsHubPage` | 1 | HubLayout |
| `/tong-dai-tich-hop-crm/` | `CRMIntegrationPage` | 18 | IntegrationHero · ProductVisualWithSupport · CRMMockup · DialpadMockup · ProductVisual · CustomerPopupMockup · IntegrationProblems · IntegrationWorkflow · FeatureSplit · WidgetMockup · IntegrationBeforeAfter · IntegrationPlatforms · CallTimelineMockup · IntegrationBoundaries · IntegrationSteps · PricingCtaBand · FaqAccordion · FinalCtaBand |
| `/tong-dai-tich-hop-helpdesk/` | `HelpdeskIntegrationPage` | 14 | IntegrationHero · ProductVisual · HelpdeskFlowMockup · IntegrationProblems · IntegrationWorkflow · FeatureSplit · SupportContextMockup · IntegrationBeforeAfter · IntegrationPlatforms · IntegrationBoundaries · IntegrationSteps · PricingCtaBand · FaqAccordion · FinalCtaBand |
| `/tong-dai-tich-hop-pos/` | `POSIntegrationPage` | 13 | IntegrationHero · ProductVisual · PosContextMockup · IntegrationProblems · IntegrationWorkflow · FeatureSplit · SalesContextMockup · IntegrationBeforeAfter · IntegrationBoundaries · IntegrationSteps · PricingCtaBand · FaqAccordion · FinalCtaBand |
| `/tong-dai-quoc-te/` | `InternationalCallingPage` | 13 | IntegrationHero · ProductVisual · InternationalNumbersMockup · IntegrationProblems · FeatureSplit · CallRoutingMockup · NumberDirectoryMockup · IntegrationUseCases · IntegrationBoundaries · IntegrationSteps · PricingCtaBand · FaqAccordion · FinalCtaBand |

### 6.4 Integrations

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/tich-hop/` | `IntegrationsHubPage` | 1 | HubLayout |
| `/tich-hop/hubspot/` | `HubspotIntegrationPage` | 12 | IntegrationHero · ProductVisual · CrmRecordClickToCallMockup · IntegrationProblems · IntegrationWorkflow · IntegrationUseCases · IntegrationSteps · ProductVisualWithSupport · CustomerPopupMockup · CallTimelineMockup · FaqAccordion · FinalCtaBand |
| `/tich-hop/salesforce/` | `SalesforceIntegrationPage` | 14 | IntegrationHero · ProductVisual · CrmRecordClickToCallMockup · IntegrationProblems · IntegrationWorkflow · IntegrationBeforeAfter · IntegrationBenefits · IntegrationUseCases · IntegrationSteps · CustomerPopupMockup · CallTimelineMockup · IntegrationBoundaries · FaqAccordion · FinalCtaBand |
| `/tich-hop/zoho-crm/` | `ZohoCrmIntegrationPage` | 13 | IntegrationHero · ProductVisual · CrmModuleContextMockup · IntegrationProblems · IntegrationWorkflow · IntegrationBeforeAfter · IntegrationBenefits · IntegrationUseCases · IntegrationSteps · CustomerContextPanelMockup · IntegrationBoundaries · FaqAccordion · FinalCtaBand |
| `/tich-hop/freshdesk/` | `FreshdeskIntegrationPage` | 13 | IntegrationHero · ProductVisual · HelpdeskFlowMockup · IntegrationProblems · IntegrationWorkflow · IntegrationBeforeAfter · SupportContextMockup · IntegrationBenefits · IntegrationUseCases · IntegrationSteps · IntegrationBoundaries · FaqAccordion · FinalCtaBand |
| `/tich-hop/zendesk/` | `ZendeskIntegrationPage` | 12 | IntegrationHero · ProductVisual · SupportHandoverMockup · IntegrationProblems · IntegrationWorkflow · IntegrationBeforeAfter · IntegrationBenefits · IntegrationUseCases · IntegrationSteps · IntegrationBoundaries · FaqAccordion · FinalCtaBand |

**These 10 pages are ~85% shared structure.** They are the correct place to
start: they exercise every class **T** template in §5, and once the templates
are right, nine of the ten are content entry rather than layout work.

### 6.5 Industries

| Routes | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/nganh/` | `IndustriesHubPage` | 1 | HubLayout |
| `/nganh/giao-duc/`, `/tai-chinh/`, `/bao-hiem/`, `/bat-dong-san/`, `/thuong-mai-dien-tu/`, `/bpo/` | `IndustryPage` ×6 | 9 | IndustryHero · IndustryProblem · IndustryImpact · IndustryCapabilities · IndustryWorkflow · IndustryOutcomes · IndustryRouting · FaqAccordion · FinalCtaBand |

One component, six routes, one content object each
(`src/data/industries/*.ts`). In WordPress this becomes **one Elementor
template imported into six pages** — the strongest case in the project for a
class **T** template, and also the sharpest illustration of constraint 2: a
later change to the industry layout is six edits, not one. If the six are
expected to stay identical, a single `[gcalls_industry_page]` shortcode reading
a content array is the cheaper long-term shape. **Decision needed — §9.**

### 6.6 Pricing

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/bang-gia/` | `PricingPage` | 9 | PricingHero · PricingProductSelector · PricingPlanCard · PricingFactorCard · SolutionPricingCard · EstimatorPreview · PricingComparison · EnterprisePricingCTA · PricingFAQ |
| `/uoc-tinh-chi-phi/` | `CostEstimatorPage` | 3 | Estimator · FaqAccordion · FinalCtaBand |

Both are class **S** almost end to end. Prices are the most-edited content on
any B2B site and are read from `src/data/pricing.ts` by six components; putting
them into Elementor widgets scatters one price across several widget trees on
two pages. The estimator is an application, not a layout (§7).

### 6.7 Resources

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/tai-nguyen/` | `ResourcesHubPage` | 1 | HubLayout |
| `/blog/` | `BlogPage` | 4 | ResourcePageLayout · BlogArchiveSection · BlogCategorySection · ResourceStatusSection |
| `/tai-nguyen/guides/` | `GuidesPage` | 3 | ResourcePageLayout · GuidePathSection · ResourceStatusSection |
| `/tai-nguyen/case-studies/` | `CaseStudiesPage` | 5 | ResourcePageLayout · ResourceItemGrid · CaseFilterSection · EvidenceStandardSection · ResourceStatusSection |
| `/tai-nguyen/ebook/` | `EbookPage` | 4 | ResourcePageLayout · EbookTopicSection · ResourceItemGrid · ResourceStatusSection |
| `/tai-nguyen/glossary/` | `GlossaryPage` | 3 | ResourcePageLayout · GlossaryIndexSection · GlossaryGroupsSection |
| `/tai-nguyen/faq/` | `FaqPage` | 3 | ResourcePageLayout · FaqIndexSection · FaqGroupsSection |

`/blog/` is the one page here that is **not** an Elementor page: it is the
WordPress posts page, rendered by the theme's `home.php`, filtered by
`gcalls_hub`. `BlogArchiveSection` and `BlogCategorySection` map to that
template, not to widgets. The glossary and FAQ index pages are long edited
lists — class **S**, reading post meta or a term list, never 200 hand-placed
Elementor widgets.

### 6.8 Company and conversion

| Route | Component | n | Sections in order |
| --- | --- | --- | --- |
| `/cong-ty/` | `CompanyHubPage` | 1 | HubLayout |
| `/cong-ty/khach-hang/` | `CustomersPage` | 6 | CompanyPageLayout · CompanyItemGrid · CustomerProfileSection · CompanyRoutingSection · CompanyStepsSection · CustomerEvidenceSection |
| `/cong-ty/doi-tac/` | `PartnersPage` | 5 | CompanyPageLayout · CompanyItemGrid · PartnerCategorySection · PartnerModelSection · CompanyStepsSection |
| `/lien-he/` | `ContactPage` | 2 | RouteShell · LeadForm |
| `/referral/` | `ReferralPage` | 1 | RouteShell |

`/lien-he/` is the site's single conversion endpoint and every one of the 77
CTA links lands on it — see §8.

### 6.9 Blog articles

`BlogArticlePage` → 18 posts. Not Elementor (constraint 5). Block-editor prose,
`gcalls_hub` term per `catalog.ts`, FAQ blocks into `_gcalls_faq` meta, and the
legacy root-level URLs preserved through `Redirects`. The importer already
handles the mapping; `export-content.mjs --with-bodies` is wired and unused,
and 003B is what turns it on.

### 6.10 What `wp gcalls import` does not do yet

Verified against `includes/class-importer.php` at `8f6ea16`. The manifest
carries ten fields per page; the importer consumes six of them.

| Manifest field | Consumed? | Consequence if left as is |
| --- | --- | --- |
| `id`, `slug`, `title`, `status` | yes | — |
| `seo` | yes → Rank Math meta | — |
| `hub`, `faq` (articles) | yes | — |
| `parentRoute` | **no** | 38 flat pages. `/tich-hop/hubspot/` becomes `/hubspot/`, and the breadcrumb trail — which walks `post_parent` — collapses |
| `template` | **no** | Every page lands on the default template, not `page-templates/full-width.php`, so Elementor sections render inside the theme's 1280px container |
| `isFrontPage` | **no** | `page_on_front` is not set; `/` keeps whatever is there |

`grep -n "post_parent\|_wp_page_template\|isFrontPage" includes/class-importer.php`
returns nothing. This is not a defect in 003A — the checkpoint built the model
and the pipeline and explicitly did not migrate content — but it is a
prerequisite for step 3 of §10, and a two-pass parent assignment (create all,
then link) is the usual shape because a child can be imported before its
parent.

**One inconsistency to resolve while doing it:** `web-026` has
`route: "/blog/"` but `parentRoute: "/tai-nguyen/"`. Under hierarchical page
permalinks a child of `/tai-nguyen/` resolves at `/tai-nguyen/blog/`, not
`/blog/`. `/blog/` is also the WordPress posts page, which is a page object
whose URL is its own slug. Either the parent is wrong or `/blog/` needs a
redirect entry — decide before importing, because changing a URL after
indexing costs a redirect.

---

## 7. Interactive components — the 36 that cannot be static markup

`section-inventory.mjs --interactive` lists all of them. Grouped by what they
need:

### 7.1 Chrome — already solved (6)
`navigation/Header`, `DesktopNav`, `MobileMenu`, `layout/RouteShell`,
`common/Seo`, `common/JsonLd`. Theme and Rank Math. No 003B work.

### 7.2 Real applications — must be rebuilt as code (7)
| React | Needs |
| --- | --- |
| `estimator/Estimator` (+ `ProductSelector`, `RequirementsForm`, `EstimatorResult`, `QuoteRequestForm`) | `[gcalls_estimator]`; the pricing model in `src/lib/estimate.ts` ported to PHP or to a small enqueued script; 4 analytics events |
| `pricing/EstimatorPreview` | Reduced form of the same, embedded on `/bang-gia/` |
| `home/LossEstimator` | Nested inside `PainPointsSection` on the home page, so it ships with it; covered by `npm test` |
| `lead/LeadForm` | `[gcalls_lead_form]` + a real endpoint — §8 |

`scripts/verify-loss-estimator.mjs` is the existing arithmetic test and is the
regression cover for any port of that maths. Keep it green.

### 7.3 Charts (6)
`home/AnalyticsSection`, `home/HeroSection`, `gcalls-plus/PerformanceSection`,
`gcalls-cx/sections` (CxReporting), `qa-qc/sections` (QaQcDashboard),
`qa-qc/visuals`.

These use Recharts. There is no Recharts in WordPress and no Elementor Free
chart widget. Three options, in order of preference:

1. **Export as SVG/PNG media.** The data is illustrative, not live. 13 media
   items are already in the manifest; this adds a handful more. Cheapest,
   fastest, no JS, no layout shift.
2. Inline hand-authored SVG in an HTML widget — same result, editable, more work.
3. Ship a charting library — only if the charts must animate. Costs a JS
   dependency on every product page for decoration.

**Recommendation: option 1** unless the owner wants the animation.
**Decision needed — §9.**

### 7.4 Animated product mockups (7)
`home/CallTimelineSection`, `home/CRMSection`, `home/CloudSection`,
`home/IntegrationsSection`, `home/WorkFromAnywhereSection`,
`home/PainPointsSection`, and `home/TeamSection` — which is retired and counted
here only because the file still exists.

Sequenced `useState` + `useEffect` demonstrations of the product, 192–547 lines
each. They are the home page's argument, and they are also the largest single
risk in 003B — reproducing them as Elementor widgets is not possible and
reproducing them in vanilla JS is real front-end work. Options: static
screenshot per state, one composite image, or a scoped script per section.
**Decision needed — §9.**

### 7.5 Accordions, tabs and filters (6)
`common/FaqAccordion` → `[gcalls_faq]`, which already exists and already emits
the schema. `pricing/PricingComparison`, `pricing/PricingProductSelector`,
`resources/sections`, `company/sections`, `blog/sections` (`useMemo` filter) →
Elementor Free's own Tabs / Toggle widgets where the content is static; a
shortcode where the list is edited.

### 7.6 CTA analytics wrappers (4)
`industry/sections`, `voicebot/sections`, `common/FinalCtaBand`,
`gcalls-plus/GcallsPlusHero`. Their only interactivity is `track('cta_clicked')`
on a link — see §8.

---

## 8. The cross-cutting concern: CTAs, leads and attribution

This does not belong to any one section, which is exactly why it gets missed.

**77 call sites** build their link with `leadCtaHref()`, which appends
`intent`, `source`, `product` and `solution` to `/lien-he/`. The contact page
reads them back and pre-fills the form, and the lead records where it came
from. A CTA rebuilt in Elementor as a plain button pointing at `/lien-he/`
looks identical and silently destroys the attribution on that page.

**Every CTA in 003B must carry its query string.** That is 77 links to get
right, and it is the strongest argument for making `FinalCtaBand` and
`PricingCtaBand` class **S** shortcodes that take the attribution as
attributes.

Alongside that, `track()` fires 12 event names. Client-side analytics needs an
equivalent on the WordPress side or the funnel goes dark at launch.

**And one opportunity.** `docs/LEAD_CAPTURE_ARCHITECTURE.md` records that no
lead submitted through this website reaches Gcalls today, because a static
build cannot hold a credential. **WordPress removes that constraint.** A PHP
endpoint in `gcalls-core` can hold one safely. 003B is the first point in this
project where the contact form can actually deliver, and it should be treated
as in-scope rather than inherited as broken. **Decision needed — §9.**

---

## 9. Decisions the owner has to make before 003B starts

| # | Decision | Why it blocks | Recommendation |
| --- | --- | --- | --- |
| 1 | Charts (§7.3): static media, inline SVG, or a JS library? | Affects 6 sections on 4 pages and whether any JS ships | Static media |
| 2 | Animated mockups (§7.4): screenshots, composites, or rebuilt in JS? | 7 sections, all on the home page; the largest effort item in 003B | Screenshots for launch, revisit after |
| 3 | Industry pages (§6.5): one template imported 6× or one shortcode? | Decides whether a layout change later is 1 edit or 6 | Shortcode if the six stay identical |
| 4 | Lead endpoint (§8): connect the form in 003B or leave the honest "not connected" message? | Decides whether the demo can convert; needs a credential and a destination | Connect it — WordPress is what unblocks it |
| 5 | Analytics (§8): which destination replaces `track()`? | 12 events, all CTA and funnel measurement | Owner's existing GA4/GTM property |
| 6 | Pricing (§6.6): shortcode reading one source, or Elementor widgets? | Prices are edited most often and appear on 2 pages via 6 components | Shortcode |
| 7 | Does the home page keep `LossEstimator`? | It is a working calculator nested in `PainPointsSection`, and porting it is real work | Keep — it is live today |

---

## 10. Proposed build order

Not a runbook. Each step is a checkpoint-sized unit, ordered so the risky work
lands on foundations that are already proven.

| Step | Work | Why here |
| --- | --- | --- |
| 1 | **Shortcode layer** in `gcalls-core` + `[gcalls_faq]` | Every class **S** row depends on it; nothing exists today |
| 2 | **Elementor kit**: colours, typography, container widths from `theme.css` / `theme.json` | Built after any page, every page needs re-doing |
| 3 | **Teach the importer `parentRoute` / `template` / `isFrontPage` (§6.10), then import the 38 pages as drafts** | Without it the import produces 38 flat pages on the wrong template; fixing that after layouts exist means re-doing URLs |
| 4 | **The 8 shared Integration templates** (§5) | Proves the kit against real sections |
| 5 | **The 5 integration detail pages** (`/tich-hop/*`) | ~85% shared; the first pages to validate the templates end to end |
| 6 | **The 4 solution pages** + `/tong-dai-quoc-te/` | Same library, more per-page content |
| 7 | **Industry template + 6 pages** (after decision 3) | |
| 8 | **The 4 product pages** | Mostly unique sections, needs decision 1 |
| 9 | **Hub pages** (6 × `HubLayout`) | Needs the child pages to exist first |
| 10 | **Resources + blog**: posts page, 18 articles, hub terms, glossary and FAQ indexes | Independent of the Elementor work; can run in parallel from step 3 |
| 11 | **Pricing + estimator** (decisions 6, 1) | Application work, not layout |
| 12 | **Contact, lead endpoint, CTA attribution sweep, analytics** (decisions 4, 5) | Touches all 77 CTAs; do it once, at the end, against finished pages |
| 13 | **Home page** | Highest risk, most animation, and the page every reviewer opens first — it deserves the most-proven foundation |

---

## 11. Definition of done for 003B

- 38 pages published, each on `page-templates/full-width.php`, in the right
  parent, with its manifest slug and Rank Math meta — which means the importer
  gaps in §6.10 are closed, not worked around by hand in wp-admin.
- 18 posts published with `gcalls_hub` terms, FAQ meta and legacy URLs
  redirecting per the map.
- Every CTA carries its `intent` / `source` / `product` / `solution`.
- No Elementor Pro widget anywhere; no per-widget colour outside the kit.
- `npm run wp:lint` and `npm run wp:qa` green, extended with 003B checks:
  page count and parents, shortcode registration, CTA query-string coverage,
  and no Pro widget in any exported template.
- Every layout that exists only in the database is exported to
  `wordpress/elementor-templates/` so it is reviewable in Git — the rule
  003A set, and the thing most likely to be skipped under time pressure.
- The `noindex` / `Disallow: /` posture is **unchanged**. Go-live is separate.
