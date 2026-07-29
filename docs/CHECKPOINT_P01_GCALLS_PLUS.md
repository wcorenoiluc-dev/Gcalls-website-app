# Checkpoint P01 — /gcalls-plus-webphone/

Scope: finalize content, SEO, AIO structure and conversion experience for the
**existing** Gcalls Plus Webphone product page. Not a redesign. Home untouched.
No new product pages. Header/Footer untouched.

---

## 0. Baseline audit (before changes)

| Aspect | Finding |
|---|---|
| Framework | React 18.3 + Vite 6.4 + TypeScript, Tailwind v4, React Router 7.18. Client-only SPA, no SSR. **Not migrated** — checkpoint stays on the existing stack. |
| Route | `/gcalls-plus-webphone/` declared in `src/config/navigation.ts` (`ROUTES.gcallsPlus`), registered in `src/app/router.tsx`, rendered by `src/pages/GcallsPlusPage.tsx`. Status `complete` in the sitemap. |
| Components | 12 dedicated sections under `src/components/gcalls-plus/`: Hero, Problems, Overview, Features, InteractionHistory, CustomerContext, Performance, Integration, UseCases, Deployment, PricingCTA, CustomerStory. Plus shared `FaqAccordion` + `FinalCtaBand`. |
| Page sections | 14 in order: Breadcrumb → Hero → Problems → Overview → Features → History → Context → Performance → Integration → UseCases → Deployment → Pricing → Story → FAQ → Final CTA. |
| Metadata | Authored per entity in `src/config/sitemap.ts` (entry `WEB-003`), surfaced through `src/config/seo.ts`, applied at runtime by `src/components/common/Seo.tsx`. JSON-LD (`BreadcrumbList` + `Product` + `SoftwareApplication` + `FAQPage`) built in `src/data/gcallsPlus.ts`. |
| Demo visuals | Reused Gcalls mockups via the `@/components/product-ui` barrel (`CRMMockup`, `SoftphoneMockup`, `DialpadMockup`, …). All labelled demo data; no dashboard figure reads as a claim. |
| LeadForm / CTA | Shared architecture already in place: `src/lib/leads/*` + `src/components/lead/LeadForm.tsx`. CTAs call `leadCtaHref({intent, source, product})` → `/lien-he/` with categorical query context; `ContactPage` parses it and pre-scopes the form. |
| Responsive | Mobile-first, `Container` at `max-w-[1280px] px-5 lg:px-8`. Hero is `grid-cols-1 lg:grid-cols-2`, text-first in DOM order. |
| Copy governance | `src/data/gcallsPlus.ts` is the single locked copy source with claim-safety rules (no efficiency/savings %, no uptime figure, no customer counts, no deployment timeframe). |

**Baseline gaps found:** hero eyebrow/H1/description were the pre-checkpoint
wording; hero listed 4 flat check items with no supporting lines; the hero
primary CTA linked to `/bang-gia/` and **bypassed the shared lead architecture**
entirely; the meta description did not match the approved string.

---

## 1–2. Positioning & SEO ownership (verified, no drift)

Positioning held: browser-based business calling for Sales / CSKH. The page does
**not** claim omnichannel contact center (that is Gcalls CX) and does **not**
own the CRM-integration keyword.

Cannibalisation check against the four excluded routes:

| Route | Owns | Collision? |
|---|---|---|
| `/tong-dai-tich-hop-crm/` | "Tổng đài tích hợp CRM \| Click-to-Call & dữ liệu khách hàng" | No. This page mentions CRM only in its Integration section, which **links out** to the CRM page. |
| `/gcalls-cx/` | Contact Center đa kênh | No. FAQ explicitly draws the Plus-vs-CX boundary. |
| `/qc-bot-ai/`, `/tong-dai-quoc-te/` | QA/QC, quốc tế | No overlap in title, H1 or body. |

---

## 3. Metadata — applied verbatim

| Field | Value | Status |
|---|---|---|
| SEO title | `Gcalls Plus Webphone \| Tổng đài trên trình duyệt cho Sales & CSKH` | already exact (`exactTitle: true`, no `\| Gcalls` suffix appended) |
| Meta description | `Gcalls Plus Webphone giúp doanh nghiệp nghe gọi, quản lý danh bạ, lịch sử tương tác và hoạt động cuộc gọi ngay trên trình duyệt, phù hợp cho Sales và CSKH.` | **updated** |
| H1 | `Gcalls Plus Webphone – tổng đài doanh nghiệp ngay trên trình duyệt` | **updated** |
| Canonical | `https://gcalls.co/gcalls-plus-webphone/` | verified |

### Indexing split — verified, not assumed

Robots is `ALLOW_INDEXING && entry.indexable`, where `ALLOW_INDEXING` reads
`VITE_ALLOW_INDEXING` at build time and `WEB-003` is `indexable: true`.

Both paths were exercised in the browser:

- preview build (flag unset) → `noindex, nofollow`
- `VITE_ALLOW_INDEXING=true` → `index, follow`

Canonical stays absolute to `https://gcalls.co` in both, so production metadata
cannot inherit the preview `noindex`.

---

## 4. Hero — applied

Eyebrow, H1 and description set verbatim. The four-item flat checklist was
replaced by the three approved value points, each with its supporting line:
*Làm việc ngay trên trình duyệt* / *Theo dõi context khách hàng* /
*Quản lý hoạt động đội ngũ*.

Primary CTA **Đăng ký tư vấn** now routes through the shared lead architecture
(`leadCtaHref`) instead of `/bang-gia/`, and fires the standard
`cta_clicked` analytics event. Verified end-to-end: clicking it lands on
`/lien-he/` with the context applied and the form's *Nhu cầu* pre-selected to
"Gcalls Plus Webphone".

### Lead-context mapping (deviation, deliberate)

The brief specifies `product = gcalls-plus`, `intent = consultation`,
`source = gcalls`. Mapped onto the existing shared model in
`src/lib/leads/types.ts`:

| Brief | Shipped | Why |
|---|---|---|
| `intent = consultation` | `'consultation'` | verbatim |
| `product = gcalls-plus` | `'Gcalls Plus Webphone'` | the approved `LEAD_NEEDS` label; the raw slug is not in that list, so the form could not pre-select the need |
| `source = gcalls` | `'gcalls_plus'` | `'gcalls'` is not a member of the `LeadSource` union; `'gcalls_plus'` is the value meaning "originated on the Gcalls Plus page" and preserves per-page attribution |

Defined once as `GP_LEAD_CONTEXT` in `src/data/gcallsPlus.ts`. **Confirm this
mapping** — if `source` must literally be `gcalls`, that is a one-line change to
the `LeadSource` union plus the allow-list in `ctaLink.ts`, but it would collapse
per-page attribution across the whole site.

---

## P01 files changed

- `src/config/sitemap.ts` — `WEB-003` description
- `src/data/gcallsPlus.ts` — `GP_HERO` (eyebrow, h1, description, `valuePoints`, CTA); new `GP_LEAD_CONTEXT`
- `src/components/gcalls-plus/GcallsPlusHero.tsx` — value-point rendering, CTA through `leadCtaHref` + analytics

---
---

# Checkpoint P01-B — remaining sections

Continues from P01. **Hero, SEO title, meta description, H1 and the lead
architecture were not touched.** Both open questions from P01 are now closed by
review: lead context stays `gcalls_plus` / `Gcalls Plus Webphone` /
`consultation` (per-page attribution preferred), and the primary keyword is
placed in body content, not the hero.

## Final section order (17 `<section>` elements)

| # | Section | Component | Status |
|---|---|---|---|
| — | Breadcrumb | `Breadcrumb` | unchanged |
| 01 | Hero | `GcallsPlusHero` | **unchanged from approved P01** |
| 02 | Direct answer / AIO | `DirectAnswer` | **new** |
| 03 | Business problems | `GcallsPlusProblems` | copy + card structure |
| 04 | Product overview | `GcallsPlusOverview` | copy |
| 05 | Core features | `GcallsPlusFeatures` | copy |
| 06 | Interaction history | `InteractionHistory` | copy |
| 07 | Customer context | `CustomerContext` | copy |
| 08 | Workflow | `WorkflowSection` | **new** |
| 09 | Team activity & analytics | `PerformanceSection` | copy |
| 10 | CRM / system integration | `IntegrationSection` | copy, bullets removed |
| 11 | Use cases | `UseCases` | copy + 2 industry links |
| 12 | Product boundaries | `ProductBoundaries` | **new** |
| 13 | Deployment | `DeploymentSection` | copy, 4 → 6 steps, lead added |
| 14 | Configuration & pricing | `PricingCTA` | copy + estimator deep link |
| 15 | Trust | `CustomerStory` | copy + blog link |
| 16 | FAQ | `FaqAccordion` | 8 → 6 approved questions |
| 17 | Final CTA | `FinalCtaBand` | copy, reuses `GP_LEAD_CONTEXT` |

Three components were added because nothing existing mapped to them: the daily
call **Workflow** is distinct from **Deployment** (what an agent does per call
vs. how the system is rolled out), **Product boundaries** had no equivalent, and
the **Direct answer** had to be uncollapsed markup — the FAQ accordion could not
carry it because only one panel is open at a time.

## Primary keyword placement

Exact phrase **"phần mềm tổng đài webphone"** — **1 occurrence**, verified in the
rendered DOM. It is in the Direct answer / AIO block (section 02), first clause:

> "Gcalls Plus Webphone là **phần mềm tổng đài Webphone** hoạt động trực tiếp
> trên trình duyệt, giúp đội Sales và Chăm sóc khách hàng thực hiện cuộc gọi…"

Not repeated anywhere else, and not forced into the hero. This block is plain
visible text — no tab, modal, accordion or truncation — so it is present for
both readers and answer engines without interaction.

## Internal link map

Nine required destinations, all reachable from `<main>`, all verified to resolve
(no 404), zero `#` placeholder conversion links:

| Destination | Where it appears |
|---|---|
| `/tong-dai-tich-hop-crm/` | Integration CTA · Boundaries card 1 · FAQ 4 |
| `/gcalls-cx/` | Boundaries card 2 |
| `/qc-bot-ai/` | Boundaries card 3 |
| `/tong-dai-quoc-te/` | Boundaries card 4 |
| `/uoc-tinh-chi-phi/?product=gcalls-plus` | Pricing primary · Final CTA secondary · FAQ 6 |
| `/bang-gia/` | Pricing secondary |
| `/nganh/giao-duc/` | Use case 3 |
| `/nganh/thuong-mai-dien-tu/` | Use case 5 |
| `/blog/` | Trust section |
| `/lien-he/` | Hero CTA · Final CTA (via `leadCtaHref`) |

Every link sits inside content that motivates it; none was added as a bare SEO
link dump.

## Claims decisions

- "Cài đặt trong 30 phút" and "Không cần IT" — **not published.** The deployment
  section instead states plainly that timing depends on hotline, call flow, user
  count and integration scope.
- Scanned the rendered route for `30 phút`, `không cần IT`, `99.99`, `100%`,
  `unlimited`, `không giới hạn`, `1.000+`, `40%`, `95%`, `30–50%` — **0 hits in
  copy.**
- 7 percentage values appear on the page; **all 7 are inside demo mockups that
  carry the "Giao diện minh họa · dữ liệu mẫu" caption**, verified by walking
  each text node to its captioned ancestor. None is presented as customer proof.
- **0 prices rendered. 0 `0₫`.** Pricing stays quote-only via the shared config.
- Trust section: the project holds **no approved customer logo assets** and no
  cleared case content, so it remains a placeholder plus a blog link. No
  testimonial, quote, percentage improvement, case study or customer count was
  invented.

## Visual assets

Reused, no new visuals created: `CRMMockup`, `SoftphoneMockup`, `DialpadMockup`,
`DashboardMain`, `CallTimelineMockup`, `AnalyticsDashboardMockup`,
`UserStatusDashboard`, `APIManagerMockup`, `WidgetMockup` — all from the existing
`@/components/product-ui` barrel. No stock photography, robot art, generic AI
illustration, fake CRM UI or real PII.

## Structured data

Four nodes, no duplicates: `BreadcrumbList`, `Product`, `SoftwareApplication`,
`FAQPage` (6 questions, matching the rendered accordion). Verified absent:
`offers`, `price`, `aggregateRating`, `review`, `award`, `customerCount`.

## Responsive verification — actually rendered

P01 could not resize the browser window (it is maximised and `resize_window` had
no effect on `innerWidth`). P01-B therefore rendered the real route inside
same-origin iframes at each target width and measured the live layout — media
queries respond to the iframe viewport, so this is a genuine render, not source
inspection. Confirmed visually with screenshots at 390px.

| Width | `innerWidth` | `scrollWidth` / `clientWidth` | Overflowing elements | Verdict |
|---|---|---|---|---|
| 390 | 390 | 375 / 375 | 0 | PASS |
| 430 | 430 | 415 / 415 | 0 | PASS |
| 768 | 768 | 753 / 753 | 0 | PASS |
| 1024 | 1024 | 1009 / 1009 | 0 | PASS |
| 1440 | 1440 | 1425 / 1425 | 0 | PASS |

Every element in `<main>` was bounds-checked against the viewport at each width;
0 offenders. 1 `<h1>` and 17 sections at every width.

## Regression QA

- Hero markup, copy and CTA unchanged from approved P01.
- Hero CTA → `/lien-he/` with `intent=consultation`, `source=gcalls_plus`,
  `product=Gcalls Plus Webphone`; the form's *Nhu cầu* arrives preselected.
- All 10 internal destinations resolve; 0 render the 404 page.
- FAQ 4 → CRM route, FAQ 6 → estimator deep link, both verified after opening.
- `/tong-dai-tich-hop-crm/` and `/bang-gia/` re-checked after the shared
  `FaqAccordion` change: 1 h1, 0 injected FAQ links, no overflow.

## Shared-component changes (deliberate, additive)

Two files outside `gcalls-plus/` were touched. Neither changes any other route's
appearance or behaviour:

1. `FaqAccordion` — optional `link` on `FaqItem`. Renders nothing when absent,
   and is never folded into the JSON-LD answer text. Required by FAQ 4 and 6.
2. `Estimator` — reads `?product=` and preselects that solution when it names a
   real one. **The brief mandates `/uoc-tinh-chi-phi/?product=gcalls-plus` in
   three places; without this the parameter would be silently inert.** Visiting
   `/uoc-tinh-chi-phi/` with no parameter behaves exactly as before (verified:
   0 of 7 solution buttons preselected).

## P01-B files changed

New:
- `src/components/gcalls-plus/DirectAnswer.tsx`
- `src/components/gcalls-plus/WorkflowSection.tsx`
- `src/components/gcalls-plus/ProductBoundaries.tsx`

Modified:
- `src/data/gcallsPlus.ts` — all body-section content, `GP_DIRECT_ANSWER`,
  `GP_WORKFLOW`, `GP_BOUNDARIES`, `GP_ESTIMATOR_HREF`, JSON-LD
- `src/pages/GcallsPlusPage.tsx` — section order, reuses `GP_LEAD_CONTEXT`
- `GcallsPlusProblems` · `GcallsPlusOverview` (heading id) · `UseCases` ·
  `DeploymentSection` · `IntegrationSection` · `CustomerStory`
- `src/components/common/FaqAccordion.tsx` · `src/components/estimator/Estimator.tsx`

## Verification

`npm run check` ✓ — typecheck ✓ · lint ✓ (0 errors; 6 pre-existing
`react-refresh` warnings in untouched `app/components/ui/*`) · build ✓

Robots split re-verified after all changes: preview → `noindex, nofollow`;
`VITE_ALLOW_INDEXING=true` → `index, follow`; canonical absolute in both.

---

## Status: **CONTENT LOCKED V1**

## Remaining product evidence questions

These are content gaps, not defects — each needs approved evidence before it can
appear:

1. **Customer logos / case study.** No approved assets exist in the project, so
   the trust section is a placeholder. Supply cleared logos or a case study to
   fill it.
2. **Deployment timeframe.** "30 phút" and "Không cần IT" stay unpublished until
   formally approved evidence exists.
3. **Public pricing.** No price is rendered anywhere; the page is quote-only.
4. **Device/headset requirements** for the Webphone are described as
   deployment-dependent — a definitive support matrix would let FAQ 2 be
   specific instead of conditional.
