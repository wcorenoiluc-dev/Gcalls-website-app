# Checkpoint INT-02 — Salesforce Integration

**Route:** `/tich-hop/salesforce/`
**Type:** Platform integration page (BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 0. Baseline verification

| Item | Verified |
|---|---|
| Repository | `/Users/macos/Desktop/Gcalls/App/Gcalls-website-app` |
| Branch | `feature/gcalls-website-foundation` |
| Working tree at start | clean |
| Boss Demo tag | `gcalls-website-demo-v1` (annotated) → commit **`cd4f1d9`** — verified UNMOVED |
| INT-01 HubSpot committed | YES |

**Exact INT-01 HubSpot commit SHA (was truncated in the INT-01 report):**

```
a8425abc616d6763aaa790571176c2049e654145
```

The tag is an *annotated* tag, so `git rev-parse gcalls-website-demo-v1` returns
the tag object (`cd3b77a`), not the commit. `git rev-parse
gcalls-website-demo-v1^{commit}` resolves to `cd4f1d92a9aa1c5a895628908b67be1e2ea42637`
— unchanged. The tag was not touched.

---

## 1. Baseline — SHELL

`/tich-hop/salesforce/` existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD, no lead
CTA, no Salesforce visual. Its sitemap entry carried a placeholder title
(`Tích hợp Gcalls với Salesforce | Kết nối tổng đài và CRM`), `status: 'shell'`,
`priority: 0.7`.

The route was removed from `SHELL_ROUTES` and given a real lazy route. Its
`ShellPage` `RELATED` entry was removed for the same reason — it is no longer a
shell. Zoho CRM keeps its entry and still links back here (verified by real click).

### Architecture reused — Integration Kit (nothing cloned)

| Component | Reused | Note |
|---|---|---|
| `IntegrationHero` | Yes | unchanged |
| `IntegrationProblems` | Yes | unchanged |
| `IntegrationWorkflow` | Yes | **one additive optional `lead` prop** (see §12) |
| `IntegrationBeforeAfter` | Yes | unchanged — unused by INT-01 |
| `IntegrationBenefits` | Yes | unchanged — unused by INT-01 |
| `IntegrationUseCases` | Yes | unchanged |
| `IntegrationSteps` | Yes | unchanged |
| `IntegrationBoundaries` | Yes | unchanged — unused by INT-01 |
| `IntegrationPlatforms` | **Not used** | a vendor grid on a page that IS a vendor page would compete with HubSpot/Zoho instead of routing to them |

Also reused unchanged: `FinalCtaBand`, `FaqAccordion`, `JsonLd`, `Breadcrumb`,
`ProductVisual`, the `primitives` set, `leadCtaHref`, and the approved
`@/components/product-ui` mockups.

**Zero duplicated components.** `CrmRecordClickToCallMockup` is vendor-neutral by
construction (labelled `CRM RECORD`, no vendor mark) and is *not* cloned: a new
barrel, `src/components/integration/visuals.tsx`, re-exports it so this page has a
semantically correct import path while the component stays in one place. It still
physically lives in `src/components/hubspot/visuals.tsx` because that file is
INT-01's documented `DEMO_VISUAL_REPLACE_LATER` swap point and INT-01 is locked.
This mirrors the existing `src/components/product-ui/index.ts` pattern.

**Content reuse: none.** No HubSpot sentence, capability description, benefit,
problem, FAQ answer or claim was copied or renamed.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp Salesforce`
- **Title:** `Tổng đài tích hợp Salesforce | Click-to-Call & Popup khách hàng`
- **Meta:** `Gcalls tích hợp Salesforce giúp đội Sales và Service gọi từ CRM, nhận biết khách hàng khi có cuộc gọi và ghi nhận lịch sử tương tác theo cấu hình.`
- **H1:** `Tổng đài tích hợp Salesforce cho đội Sales và Customer Service`
- **Canonical:** `https://gcalls.co/tich-hop/salesforce/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of INT-02 scope.

All four values verified against the rendered DOM, not the source.

Legacy canonicals `/gcalls-tich-hop-salesforce/` and
`/tong-dai-tich-hop-salesforce/` are **not** used anywhere; the canonical is
derived from the route by `buildCanonical`.

Secondary keywords covered in body copy: `Gcalls Salesforce`, `tích hợp Gcalls
Salesforce`, `click to call Salesforce`, `gọi điện trên Salesforce`, `đồng bộ
cuộc gọi Salesforce`, `Salesforce CRM call integration`, `call history
Salesforce`, `Salesforce call center`.

### ⚠️ Title / body tension worth a decision (flagged, not silently resolved)

The locked §5 title contains **"Popup khách hàng"**, but the §11 popup gate
resolved **CONTEXT ONLY** (see §3), so the rendered body deliberately contains
**0 occurrences of the word "popup"** and never claims an automatic popup.

The title was published exactly as §5 locks it — it is a keyword target for
`popup khách hàng Salesforce`, and §5 carries no conditional. But a title that
names a behaviour the body declines to assert is a real inconsistency, and it is
the one thing on this page a reader could take as a popup claim. **Recommend
either verifying popup behaviour (which would let §11 flip positive and the two
agree) or amending the locked title.** Not changed unilaterally.

### Cannibalization

This page owns Salesforce-specific intent only. Generic CRM intent
(`tổng đài tích hợp CRM`) stays with `/tong-dai-tich-hop-crm/` — section 12
exists to hand that visitor over rather than keep them. HubSpot and Zoho intent
stays on their own routes; they appear once each, as routed links, never as
comparison claims.

---

## 3. Evidence gates

### SALESFORCE POPUP (§11): **CONTEXT ONLY**

SEO material treats `popup khách hàng Salesforce` as a core topic. What this
repository actually evidences is the S01 CRM-layer capability "Customer Popup",
already worded conditionally (`Hiển thị thông tin khách hàng liên quan khi có
cuộc gọi`), plus the estimator's `customer-context` need. That is **CRM-generic**
evidence. Nothing evidences Salesforce-specific popup behaviour, and nothing
evidences that the display is **automatic** on an incoming call for a Salesforce
org.

Decisively: INT-01 faced the **identical** evidence standing for HubSpot — also
one of the same three estimator platforms — and published conservative "Customer
Context" wording with no popup capability and no popup section. Reversing that
here, on no additional evidence, would make two pages assert different product
behaviour from one shared evidence base.

The Home-page line `Gcalls tự động kéo thông tin từ CRM và hiển thị popup ngay
lập tức` is **not** treated as an evidence base — S01 already declined recording
sync despite a comparable Home claim, and that precedent is followed.

Result: no dedicated popup section renders, capability 02 is
**Incoming Customer Context**, FAQ 3 stays conditional, and the rendered page
contains **0 occurrences of "popup"** (verified in DOM).

### SMS / BRANDNAME (§12): **WITHHELD**

Historical public material mentions SMS Brandname alongside the Salesforce
integration. §12 forbids inheriting it automatically and it cannot be verified
here. The only SMS evidence in the project belongs to a **different product** —
Gcalls CX, where SMS is one of five omnichannel channels. Pulling a Gcalls CX
channel onto a CRM integration page is the cross-product inheritance S03 forbade
for POS and INT-01 forbade for HubSpot. Decisively: the approved `crmNeeds` field
enumerates four needs and SMS is not one of them.

Rendered page contains **0 occurrences of "SMS"** and **0 of "Brandname"**
(verified in DOM). Nothing implies SMS is part of any deployment.

### RECORDING SYNC (§13): **WITHHELD**

`crmNeeds` enumerates four integration needs and recording is not one of them.
Both S01 §10 and S02 §12 already resolved this same gate NEGATIVE on the same
evidence. The approved conditional sentence from §13
(`Ghi âm hoặc liên kết bản ghi cuộc gọi có thể được đưa vào Salesforce theo cấu
hình`) is therefore **not published**.

The only recording mention on the whole page is FAQ 5's **question**; its answer
uses the §13 "IF NOT VERIFIED" wording verbatim (verified in DOM: exactly one
`Ghi âm` occurrence, inside `faq-salesforce`).

### Partnership / certification / AppExchange: **NOT PUBLISHED**
### Edition / plan coverage: **NOT PUBLISHED**

No partner, certification, marketplace-listing or edition-tier evidence exists
anywhere in this repository. Naming Salesforce asserts connection experience
only, exactly as S01 established and INT-01 repeated. The setup note states
explicitly that Gcalls does not assume every Salesforce edition or plan supports
the same integration scope.

---

## 4. Section inventory — 18 rendered content sections

Hero · Direct Answer · Business Problems · Overview + Core Flow · Verified
Capabilities (4) · Workflow (6) · Before/After · Benefits (4) · Use Cases (4) +
QA hand-off note · Setup (9) + scope note · UI Preview · Salesforce vs Generic
CRM · Related Integrations · Product Relationships · Trust · FAQ (7) · Onward
Links · Final CTA.

Brief items §11, §12 and §13 are **evidence decisions, not sections**; all three
closed against publication, so none renders.

Verified in DOM: **1 H1**, 17 in-content H2s, 4 capability cards, 6 workflow
steps, 9 setup steps, 4 benefits, 4 use cases, 7 FAQ items.

---

## 5. Visual evidence

| Check | Result |
|---|---|
| Fake Salesforce UI | **0** |
| Salesforce logo / wordmark / brand colour | **0** |
| Salesforce branding used as partnership proof | **0** |
| Real PII | **0** |
| Price / metric / score / percentage in any visual | **0** |

**Hero** — `CrmRecordClickToCallMockup` via
`src/components/integration/visuals.tsx`. Deliberately unbranded, labelled
`CRM RECORD`, showing exactly the integration point this page claims: a
Click-to-Call control beside a customer record. Identifier masked (`KH #2148`),
company fictional (`Công ty mẫu`), phone masked to two digits (`••• ••• •48`) —
not dialable.

**UI Preview** — §19 preference tiers 1–2 only: the approved Gcalls-side
customer-context surface (`CustomerPopupMockup`) and call-activity surface
(`CallTimelineMockup`) from `@/components/product-ui`. No conceptual panel was
needed in this section. Their sample contacts and numbers are the same fictional
demo data already shipped on Home, S01 and INT-01 — illustrative, not real
people. A visible note states these are Gcalls-side illustrations with sample
data and **not Salesforce screenshots**.

`DEMO_VISUAL_REPLACE_LATER` markers are carried in
`src/components/integration/visuals.tsx` and at the source file.

---

## 6. Claim guard — clean

Verified **absent from the rendered DOM**: 25–30% / 30–50% productivity, 100%
sync, zero manual work, setup in minutes / instant activation, all Salesforce
plans or editions, every object synchronized, official Salesforce partner,
Salesforce certified, AppExchange listing, real-time guaranteed, customer counts.

| Scan | Result |
|---|---|
| Any `%` figure anywhere on the page | **0** |
| `đối tác chính thức` / `chứng nhận` / `certified` / `AppExchange` / `partner` | **0** |
| `vài phút` / `tức thì` / `100%` / `mọi gói` / `mọi edition` / `toàn bộ object` | **0** |
| Currency / price token (`₫`, `VNĐ`, `VND`, `USD`) | **0** |
| **Unsupported numeric claims** | **0** |

Setup is 9 steps with **no duration on any step or in total**. Step 5 says
`Kiểm tra quyền truy cập/API` — no object, field, API version, credential or
connection mechanism is named, because nothing here evidences which is current.
Before/After carries no ROI figure (and the shared component renders no metrics
slot, so one cannot be added without changing that component too).

---

## 7. CTA architecture — all real-click tested

| CTA | Intent | Result |
|---|---|---|
| Hero primary — `Xem demo tích hợp Salesforce` | `demo` | **PASS** |
| Hero secondary — `Xem workflow tích hợp` | anchor `#workflow-salesforce` | **PASS** (hash set, target at top of viewport, scrollY 3776) |
| Final band primary — `Xem demo tích hợp Salesforce` | `demo` | **PASS** |
| Final band secondary — `Tư vấn tích hợp` | `consultation` | **PASS** |
| Trust — `Trao đổi về Salesforce workflow hiện tại` | `consultation` | **PASS** |
| Generic CRM — `Xem giải pháp Tổng đài tích hợp CRM` | route | **PASS** |
| HubSpot link | route | **PASS** |
| Zoho CRM link | route | **PASS** |

All use the shared `LeadForm` via `leadCtaHref`. No page-local form or submit
logic. **0 dead CTAs.**

### LeadSource choice

No Salesforce-specific `LeadSource` exists in the shared model and inventing an
untyped string would break normalisation, so the **most specific valid member
already supported** is used: `crm_integration`. The platform is carried in
`product: 'Salesforce'`, and `solution: 'Tích hợp CRM'` keeps the form's
"Nhu cầu" select pre-selecting.

### Salesforce context retained at the destination — VERIFIED VISIBLY

`Salesforce` was added to the `PRODUCT_DISPLAY_LABELS` allow-list in
`src/lib/leads/ctaLink.ts` (the file's own comment designates this as the
extension point for a new product CTA label). Browser-verified on `/lien-he/`:

| Input | Rendered | Need pre-selected |
|---|---|---|
| `intent=demo&product=Salesforce` | `Quan tâm: Salesforce` | `Tích hợp CRM` |
| `intent=consultation&product=Salesforce` | `Quan tâm: Salesforce` | `Tích hợp CRM` |
| `product=totally made up junk context` | *(nothing rendered)* | — |
| `product=<img src=x onerror=alert(1)>` | *(nothing rendered)* | — |

`intent=demo` survives to the form. Junk and injection-shaped `?product=` values
render nothing — the allow-list holds, so **no free-form URL context reaches the
page.**

---

## 8. Internal links — contextual, no footer-style dump

`/tong-dai-tich-hop-crm/` · `/tich-hop/` · `/tich-hop/hubspot/` ·
`/tich-hop/zoho-crm/` · `/gcalls-plus-webphone/` · `/qc-bot-ai/` ·
`/gcalls-cx/` · `/bang-gia/` · `/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/`
— **all 11 required destinations present**, plus the hotline `tel:`.

21 in-content links total. Each required destination is placed where it is
contextually earned (CRM in §12 and §14, HubSpot/Zoho/hub in §13, Gcalls Plus and
QA QC Center in §14, estimator/pricing in Trust); the onward row carries only the
5 remaining destinations rather than repeating them.

**QA is never presented as a Salesforce-native feature.** It is absent from the
use cases and appears only as (a) a contextual note under Use Cases routing to
QA QC Center, and (b) a Product Relationships row stating explicitly that call
quality review is *not* a function of the CRM integration layer.

**Broken links: 0** — every destination resolved with 1 H1 and none rendered the
404 page.

---

## 9. Responsive QA — actual rendered

Measured in real viewports (same-origin iframes at exact widths; the macOS Chrome
window floors at ~514px, so window resizing alone cannot reach 390).

| Width | Page-level overflow | Element-level offenders | H1 | Workflow columns |
|---|---|---|---|---|
| 390 | **0** | 0 | 1 | 1 |
| 430 | **0** | 0 | 1 | 1 |
| 768 | **0** | 0 | 1 | 2 |
| 1024 | **0** | 0 | 1 | 3 |
| 1440 | **0** | 0 | 1 | 3 |

Workflow readable at every width. UI preview readable at every width, heading
never covered.

**CTA tap targets:** all 21 in-content navigational links measure ≥ 44px. The 8
sub-44 elements are decorative `<button>`s *inside* the demo mockups
(`Ghi chú`, `Gắn tag`, `Xem hồ sơ`, the timeline filter tabs, the popup
answer/decline circles) — illustration, not navigation.

### Shared-component defect found, fixed page-locally

The shared `ProductVisualWithSupport` overlap composition anchors its supporting
card to `bottom-0` of a box sized by the *shorter* main card. From `lg` the
taller `CallTimelineMockup` therefore extends **upward and covers the section
heading**. This reproduces identically on the locked HubSpot page at the same
width, so it **predates INT-02** and is not a regression introduced here — but
§29 requires this page's UI preview to be readable.

Fixed **page-locally**, without touching the shared component or the locked page:
this page renders the two visuals in a plain two-column grid that stacks at
mobile. The locked HubSpot rendering is byte-for-byte unchanged.

Side effect: the previously documented shared `CallTimelineMockup` hotline-row
clip (INT-01 §11 — second hotline pill clipped at 390 and 1024) **does not occur
on this page**, because the timeline gets a 440px column instead of a 300px
overlap card. Both hotline pills render fully. Verified: the same offenders are
still present on the locked HubSpot page at 1024 (`DIV.ml-auto` and
`SPAN.text-[10px]`, both `right: 1053`), confirming the issue is the shared
composition, not this page.

**Two shared-component items remain open for a future fix** (both pre-existing,
both out of INT-02 scope because §16/§29 forbid modifying locked shared surfaces):

1. `ProductVisualWithSupport` heading overlap from `lg`.
2. `CallTimelineMockup` internal hotline-row clip at narrow widths.

---

## 10. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** — 0 errors (6 pre-existing `react-refresh` warnings in vendor `src/app/components/ui/*`, untouched) |
| `npm run build` | **PASS** (`SalesforceIntegrationPage` chunk 25.10 kB / 6.96 kB gzip) |
| 1 H1 | PASS |
| 0 dead CTA | PASS |
| 0 broken link | PASS |
| 0 fake Salesforce UI | PASS |
| 0 fake price | PASS |
| 0 unsupported numeric claim | PASS |
| 0 real PII | PASS |

Re-run after the §9 UI-preview fix; all three still pass.

JSON-LD: 4 nodes — `BreadcrumbList`, `Service`, `SoftwareApplication`, `FAQPage`.
No `Offer`, price, `AggregateRating`, `Review`, performance metric, partner or
certification property. `featureList` carries exactly the four verified
capabilities, so the structured data cannot assert more than the visible page —
in particular it does not mention popup, SMS or recording synchronisation.

---

## 11. Regression

No content rewritten on Home, any of the six hubs, Gcalls Plus, QA QC Center,
Gcalls CX, CRM, Helpdesk, POS, International, Pricing, Estimator or HubSpot.

Verified intact by real click-through after all changes (1 H1, no 404):
Salesforce, HubSpot, CRM Integration, Helpdesk, POS, International.

Shared files touched, and why:

| File | Change |
|---|---|
| `src/app/router.tsx` | Registered the real page; removed the route from `SHELL_ROUTES` |
| `src/config/sitemap.ts` | INT-02 title/meta lock; `shell` → `complete`, priority 0.7 → 0.8 |
| `src/pages/ShellPage.tsx` | Removed the now-unused `RELATED` entry |
| `src/lib/leads/ctaLink.ts` | Added `Salesforce` to the `PRODUCT_DISPLAY_LABELS` allow-list |
| `src/components/integration/IntegrationWorkflow.tsx` | Added one **optional** `lead` prop, forwarded to the existing `SectionHeader.lead`. Additive: every existing call site omits it and renders exactly as before |

New files:

- `src/data/salesforceIntegration.ts` (locked copy + JSON-LD)
- `src/pages/SalesforceIntegrationPage.tsx`
- `src/components/integration/visuals.tsx` (re-export barrel, no new component)
- `docs/CHECKPOINT_INT02_SALESFORCE.md`

Boss Demo V1 remains frozen: tag `gcalls-website-demo-v1` → `cd4f1d9`, verified
unmoved. **Zoho CRM remains a shell — not started.**

---

## 12. Open evidence questions

Carry into any future Salesforce revision — each is currently WITHHELD or
conservative, **not denied**:

1. **Incoming customer popup.** Does the shipped Salesforce integration display
   customer data automatically on an incoming call, or does the agent open the
   record? Resolving this also resolves the title/body tension in §2.
2. **SMS / Brandname.** Is SMS Brandname part of the Salesforce integration in
   the current product, or only of Gcalls CX? Needs current product evidence,
   not historical marketing copy.
3. **Recording sync.** Can a recording, or a link to one, be written into
   Salesforce? Creation vs linking must be distinguished before publishing.
4. **Object coverage.** Which Salesforce objects are supported (Lead, Contact,
   Account, Case, Opportunity, custom)? Nothing here evidences any list, which is
   why §18 step 2 exists and no object is named as supported.
5. **Edition / licence coverage.** Which Salesforce editions, licences or clouds
   are supported?
6. **Connection mechanism.** Which API, package or auth method is current? Setup
   step 5 is deliberately vague until this is answered.
7. **Partnership status.** Is Gcalls an AppExchange listing or a Salesforce
   partner in any formal sense? Must be reported before publishing.
8. **Real UI evidence.** A PII-masked screenshot of Gcalls running inside
   Salesforce would replace the unbranded conceptual hero panel.
9. **Shared visual components.** The two `ProductVisualWithSupport` /
   `CallTimelineMockup` items in §9 need a shared-component fix that also
   re-verifies the locked pages.

---

## 13. Status

**CONTENT LOCKED V1.**

Copy in `src/data/salesforceIntegration.ts` is locked; the file header carries the
claim guard and all three evidence gates with their reasoning. Do not reword, and
do not add capabilities, objects, synced fields, editions, plans or benefits that
are not there.

Zoho CRM remains a shell — **not** started here.
