# Checkpoint S01 — CRM Integration

**Route:** `/tong-dai-tich-hop-crm/`
**Type:** Solution page (MOFU / BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 1. Baseline

The page already existed as a **FULL** implementation with a reusable
architecture. S01 was a **normalization, not a rebuild**: the existing kit was
audited and preserved, and only content, SEO and the missing sections changed.

| Asset | Baseline | S01 outcome |
|---|---|---|
| `src/pages/CRMIntegrationPage.tsx` | 355 lines, 15 blocks | Recomposed to 19 blocks |
| `src/data/crmIntegration.ts` | 319 lines | Rewritten to locked copy |
| `src/components/integration/` (7 components) | Existing kit | **Reused**; 2 added, 1 extended |
| `src/components/product-ui/` | Approved demo mockups | **Reused unchanged** |

Reused without modification: `IntegrationHero`, `IntegrationProblems`,
`IntegrationWorkflow`, `IntegrationSteps`, plus the shared `FeatureSplit`,
`FinalCtaBand`, `PricingCtaBand`, `ProductVisual`, `FaqAccordion`, `JsonLd`,
`Breadcrumb`.

Extended: `IntegrationPlatforms` gained an optional per-platform `path` so each
vendor card routes to the page that owns its keyword.

Added (both reusable by Helpdesk/POS later): `IntegrationBeforeAfter`,
`IntegrationBoundaries`.

Dropped: `IntegrationBenefits` and `IntegrationUseCases` are no longer used by
this page — S01 replaces the generic benefit list and the 5-row role/flow table
with the dedicated Sales and Customer Service use-case sections. Both components
remain in the kit for the other integration pages.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp CRM`
- **Title:** `Tổng đài tích hợp CRM | Click-to-Call & dữ liệu khách hàng`
- **Meta:** `Gcalls kết nối tổng đài với CRM để đội Sales và CSKH gọi trực tiếp từ hệ thống, nhận diện khách hàng khi có cuộc gọi và đồng bộ lịch sử tương tác theo cấu hình.`
- **H1:** `Tổng đài tích hợp CRM – kết nối cuộc gọi với dữ liệu khách hàng`
- **Canonical:** `https://gcalls.co/tong-dai-tich-hop-crm/`
- **Robots:** `noindex, nofollow` in preview; the route is `indexable: true`, so
  it becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag in
  `src/config/seo.ts` is enabled. That flag is global and out of S01 scope.

### Cannibalization control

This page owns the generic CRM keyword only. The three vendor-specific FAQs
("Gcalls có tích hợp HubSpot/Salesforce/Zoho không?") that existed in the
baseline were **removed** — those keywords belong to `/tich-hop/hubspot/`,
`/tich-hop/salesforce/` and `/tich-hop/zoho-crm/`. Vendor names now appear once,
in a routed ecosystem grid, and FAQ 2 answers the vendor question generically.

---

## 3. Capabilities published

| Capability | Status |
|---|---|
| Click-to-Call | Published |
| Customer Popup | Published |
| Interaction History Sync | Published |
| **Recording sync** | **NOT PUBLISHED — unverified** |

Recording sync is permitted by S01 §10 only against current verified
implementation. The approved estimator config (`src/data/estimator.ts`, solution
`crm`, field `crmNeeds`) enumerates exactly four integration needs —
click-to-call, customer-context, call-history, workflow — with no recording
option, and nothing else in the repository evidences it. Omitted rather than
written speculatively.

---

## 4. CRM vendors actually verified

**HubSpot, Salesforce, Zoho CRM**, plus a neutral "Khác" card.

Evidence: the `crmPlatform` select in the approved estimator config lists
exactly these three plus "Khác". No additional vendor was published.

**Partnership claims: 0.** Naming a platform asserts connection experience only.
No wording anywhere on the page implies official partner status, marketplace
certification or preferred-vendor status, and no vendor logo is rendered — using
third-party marks would imply exactly the relationship that is unverified.

---

## 5. Data synchronization boundaries

Scope is stated as conditional everywhere: `theo cấu hình`, `tùy nền tảng`,
`dữ liệu phù hợp`, `phạm vi tích hợp`. The page never claims universal field
synchronization, and the data-sync section explicitly defers specific fields to
a technical survey.

---

## 6. Visuals

All reused from the approved `@/components/product-ui` barrel, tagged
`DEMO_VISUAL_REPLACE_LATER` at source:

| Mockup | Used for |
|---|---|
| `CRMMockup` | Hero, customer context |
| `DialpadMockup` | Hero support visual |
| `CustomerPopupMockup` | Direct answer |
| `WidgetMockup` | Click-to-Call |
| `CallTimelineMockup` | Data synchronization |

**No new demo visuals were created.** No third-party CRM screen is depicted or
fabricated, and no mockup is presented as belonging to HubSpot, Salesforce or
Zoho. Contact names inside the mockups are synthetic demo personas carrying a
visible "Demo" chip — no real PII.

---

## 7. Claims

Not present anywhere on the page (S01 §24):
`tăng 30–50% hiệu suất` · `đồng bộ 100%` · `xóa bỏ hoàn toàn nhập liệu thủ công`
· `tích hợp mọi CRM` · `real-time guaranteed`

Verified by rendered-DOM scan: **0 percentage tokens, 0 fake prices, 0
unsupported numerical claims.** The before/after section is an explicit workflow
illustration and carries no ROI or time-saved figure — `IntegrationBeforeAfter`
renders no metrics slot at all.

Trust is **neutral**: no verified CRM customer case exists in this repository,
so no logo, quote, result or case-study metric is shown.

---

## 8. Internal links

`/gcalls-plus-webphone/` · `/gcalls-cx/` · `/qc-bot-ai/` ·
`/tong-dai-tich-hop-helpdesk/` · `/tong-dai-tich-hop-pos/` · `/tich-hop/` ·
`/tich-hop/hubspot/` · `/tich-hop/salesforce/` · `/tich-hop/zoho-crm/` ·
`/bang-gia/` · `/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/`

All 13 resolve to routes declared in the locked sitemap. 0 broken links, 0
legacy route variants.

**Conversion:** every lead CTA carries `intent=consultation` via the shared lead
form. The estimator deep link uses `?product=crm-integration`, resolved to the
estimator's internal `crm` id by `PRODUCT_SLUG_ALIASES` in
`src/components/estimator/Estimator.tsx` — the same alias mechanism P03
established for `gcalls-cx`. Verified working: the CRM solution is preselected.

---

## 9. Responsive QA

Measured on real rendered layouts at 390 / 430 / 768 / 1024 / 1440:

- **0 page-level horizontal overflow at every width**
- **0 elements overflowing the viewport at every width**
- Exactly **1 H1** at every width
- Before/after columns stack under `lg`; steps stack vertically at all widths so
  the flow never shrinks to illegibility
- Platform grid is 1-up at 390, 2-up from `sm`, 4-up from `lg`
- CTAs stack full-width below `sm`

Sub-44px tap targets are limited to the visually-hidden skip link and decorative
controls inside the pre-existing demo mockups (dialpad keys, timeline filter
chips). Every real link and CTA is ≥44px.

---

## 10. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | PASS (0 errors) |
| `npm run lint` | PASS (0 errors; 6 pre-existing warnings, all in `src/app/components/ui/*` shadcn vendor files) |
| `npm run build` | PASS |
| H1 count | 1 |
| JSON-LD | 1 block, 4 nodes: BreadcrumbList, Service, SoftwareApplication, FAQPage — no Offer, price, rating, review or partnership |
| Direct answer in rendered HTML | PASS (plain text, not collapsed) |
| FAQ count | 6 |
| Regression P01 / P02 / P03 | PASS — content, H1/H2 counts, metadata and lead intents unchanged |

---

## 11. Remaining evidence questions

1. **Recording sync** — needs product confirmation before it can be published as
   a fourth capability. Currently omitted.
2. **CRM customer story** — no verified case exists. Trust stays neutral until
   one is supplied with evidence.
3. **Vendor relationships** — if any official partner or marketplace listing
   status exists for HubSpot, Salesforce or Zoho, it is not recorded in this
   repository and is therefore not claimed.
4. **Additional CRM platforms** — only the three evidenced by the estimator were
   published. Any further vendor needs evidence before being added.
