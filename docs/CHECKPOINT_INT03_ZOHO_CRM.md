# Checkpoint INT-03 — Zoho CRM Integration

**Route:** `/tich-hop/zoho-crm/`
**Type:** Platform integration page (MOFU/BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

Also covered here: **Part A**, the narrow INT-02 Salesforce metadata correction.

---

## 0. Baseline verification

| Item | Verified |
|---|---|
| Repository | `/Users/macos/Desktop/Gcalls/App/Gcalls-website-app` |
| Branch | `feature/gcalls-website-foundation` |
| Working tree at start | clean |
| Boss Demo tag | `gcalls-website-demo-v1` → commit **`cd4f1d9`** — verified UNMOVED |
| INT-01 HubSpot commit | `a8425abc616d6763aaa790571176c2049e654145` |
| INT-02 Salesforce commit | `9f5e9e9` |

---

## Part A — Salesforce SEO title correction

INT-02 shipped with a locked title naming a behaviour its own §11 gate had
declined to publish. The body contains **0 occurrences of "popup"**, so the title
was the only place a reader could read a popup claim off that page.

| | Value |
|---|---|
| **Old title** | `Tổng đài tích hợp Salesforce \| Click-to-Call & Popup khách hàng` |
| **New title** | `Tổng đài tích hợp Salesforce \| Click-to-Call & dữ liệu cuộc gọi` |
| **Body content changed** | **NO** |

Scope: a single string in the `WEB-013` sitemap entry, plus the comment above it
recording why. Verified unchanged in the rendered DOM after the edit:

| Item | Value | Same as INT-02 report |
|---|---|---|
| Meta description | `Gcalls tích hợp Salesforce giúp đội Sales và Service gọi từ CRM…` | yes |
| H1 | `Tổng đài tích hợp Salesforce cho đội Sales và Customer Service` | yes |
| H1 count | 1 | yes |
| `<section>` count | 20 | yes |
| In-content H2 count | 17 | yes |
| FAQ count | 7 | yes |
| Canonical | `https://gcalls.co/tich-hop/salesforce/` | yes |
| Robots | `noindex, nofollow` (preview) | yes |
| JSON-LD `Service.name` | `Tổng đài tích hợp Salesforce` | yes |
| "popup" occurrences in body | 0 | yes |

The Salesforce JSON-LD does **not** derive from page metadata — `Service.name`
and `SoftwareApplication.name` are authored independently in
`buildSalesforceJsonLd`, so no schema value changed. CTAs, visuals, internal
links and section structure were not touched.

**Salesforce final status: CONTENT LOCKED V1.**

---

## 1. Baseline — SHELL

`/tich-hop/zoho-crm/` existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD, no lead
CTA, no Zoho visual. Its sitemap entry carried a placeholder title
(`Tích hợp Gcalls với Zoho CRM | Kết nối tổng đài và CRM`), `status: 'shell'`,
`priority: 0.7`.

The route was removed from `SHELL_ROUTES` and given a real lazy route. Its
`ShellPage` `RELATED` entry was removed for the same reason. All three CRM
platform pages are now real; only the two helpdesk platforms remain shells.

### Architecture reused — Integration Kit (nothing cloned, nothing modified)

| Component | Reused |
|---|---|
| `IntegrationHero` | Yes |
| `IntegrationProblems` | Yes |
| `IntegrationWorkflow` | Yes (with the optional `lead` prop added at INT-02) |
| `IntegrationBeforeAfter` | Yes |
| `IntegrationBenefits` | Yes |
| `IntegrationUseCases` | Yes |
| `IntegrationSteps` | Yes |
| `IntegrationBoundaries` | Yes |
| `IntegrationPlatforms` | **Not used** — a vendor grid on a page that IS a vendor page would compete with HubSpot/Salesforce instead of routing to them |

Also reused unchanged: `FinalCtaBand`, `FaqAccordion`, `JsonLd`, `Breadcrumb`,
`ProductVisual`, the `primitives` set, `leadCtaHref`.

**No shared component was modified for INT-03.** The only shared-file edits are
one route registration, one sitemap entry, one `ShellPage` deletion and one
allow-list entry.

**Content reuse: none.** No HubSpot or Salesforce sentence, capability
description, benefit, problem, FAQ answer, visual or claim was copied or renamed.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp Zoho CRM`
- **Title:** `Tổng đài tích hợp Zoho CRM | Cuộc gọi & dữ liệu khách hàng`
- **Meta:** `Gcalls tích hợp Zoho CRM giúp đội Sales và CSKH kết nối hoạt động nghe gọi với customer context và lịch sử tương tác theo phạm vi cấu hình.`
- **H1:** `Tổng đài tích hợp Zoho CRM cho đội Sales và CSKH`
- **Canonical:** `https://gcalls.co/tich-hop/zoho-crm/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of INT-03 scope.

All four values verified against the rendered DOM, not the source.

The title deliberately carries **no** "Popup khách hàng", "Click-to-SMS" or
"đồng bộ ghi âm" (§5), because gates B, D and E did not verify them. **This is
the mismatch Part A had to correct on Salesforce; INT-03 does not repeat it** —
the title, the body and the JSON-LD all assert the same thing.

Legacy canonicals `/gcalls-tich-hop-zoho-crm/` and
`/tong-dai-tich-hop-zoho-crm/` are **not** used; the canonical is derived from
the route by `buildCanonical`.

### Cannibalization

This page owns Zoho CRM-specific intent only. Generic CRM intent stays with
`/tong-dai-tich-hop-crm/` — section 12 exists to hand that visitor over. HubSpot
and Salesforce intent stays on their own routes; they appear once each, as routed
links, never as comparison claims.

---

## 3. Capability evidence gates (§10) — run independently, not inherited

### Evidence base

Zoho CRM evidence in this repository:

- `src/data/estimator.ts`, solution `crm`: `crmPlatform` names HubSpot,
  Salesforce, **Zoho CRM** and "Khác"; `crmNeeds` enumerates exactly four
  integration needs — Click-to-Call, Customer context, Call history, Workflow.
- `src/data/crmIntegration.ts` (S01, approved): Click-to-Call, Customer Popup,
  Interaction History Sync — all conditionally worded — plus Zoho CRM as a routed
  platform with connection scope only.
- `src/data/hubs.ts`: the integration-hub Zoho card, connection scope only.
- `src/components/product-ui`: the approved Gcalls-side surfaces.

**Rejected false positive.** `docs/WORDPRESS_HEADLESS_AUDIT.md` records that
Gcalls' own company MAIL runs on Zoho (`mx.zoho.com`). That is Gcalls' internal
email vendor — not evidence of a Zoho CRM product integration or a partnership.
Not used.

**Not an evidence base.** Home markets "Đồng bộ hai chiều với HubSpot,
Salesforce, Zoho CRM và Freshsales" and "Đồng bộ liên hệ, lịch sử, ghi âm tự
động". S01 already declined recording sync despite that same line, so Home
marketing copy is not treated as capability evidence here either.

### A. CLICK-TO-CALL: **VERIFIED & PUBLISHED** (conditional register)

The approved estimator `crmNeeds` field offers Click-to-Call as a scoped
integration need for the `crm` solution, whose `crmPlatform` select names Zoho CRM
explicitly; S01's approved capability set publishes Click-to-Call conditionally on
a page that routes Zoho CRM as one of exactly three platforms. That is first-party
approved config **naming Zoho**, not inherited HubSpot/Salesforce copy, and no
Zoho-specific counter-evidence exists.

Published with the §10A wording verbatim, which is itself conditional:
`Nhân viên có thể bắt đầu cuộc gọi từ số điện thoại hoặc customer record trong
Zoho CRM khi integration được cấu hình phù hợp.`

**Not verified, and therefore stated nowhere:** the Zoho-side MECHANISM
(extension, marketplace app, API, telephony-provider slot). Setup step 5 says only
`Kiểm tra permission/API`, and FAQ 2 defers the mechanism to survey. The gate
verified the capability, not how it is wired.

### B. INCOMING CUSTOMER CONTEXT / POPUP: **CONTEXT ONLY**

The repository evidences the S01 CRM-layer "Customer Popup" capability, already
conditionally worded, plus the estimator's `customer-context` need — **CRM-generic
evidence**. Nothing evidences Zoho-specific popup behaviour and nothing evidences
that any display is **automatic** on an incoming call for a Zoho account.

INT-01 and INT-02 resolved this identical gate conservatively on the identical
evidence; a third page asserting more from the same base would make the three
contradict each other.

§10B forbids the word "Popup" unless verified, so it appears **nowhere** on this
page (verified: **0 occurrences** in the DOM). Customer identification is
published only with the explicit `nơi được hỗ trợ` hedge, and no visual depicts an
automatic incoming popup.

### C. CALL ACTIVITY / HISTORY: **CONDITIONAL ONLY**

Evidenced by `crmNeeds` (`call-history`) and S01's "Interaction History Sync".
Published — but every sentence stays conditional (`có thể được ghi nhận hoặc liên
kết`, `theo phạm vi tích hợp`). Nothing is asserted as automatic, complete or
guaranteed on any Zoho account, which is why the report line is CONDITIONAL ONLY
rather than an unqualified VERIFIED.

### D. CLICK-TO-SMS: **WITHHELD**

Historical material mentions Click-to-SMS. §10D forbids publishing merely because
an old SEO sheet mentions it, and it cannot be verified here. The only SMS
evidence in the project belongs to a **different product** — Gcalls CX, where SMS
is one of five omnichannel channels. Decisively: `crmNeeds` enumerates four needs
and SMS is not one of them.

No SMS capability card, benefit, use case, workflow step, setup step or visual
control. The **only** SMS mention on the page is FAQ 5, whose question §22
mandates and whose answer is the §22 "IF NOT VERIFIED" wording — a defer-to-survey
answer, not a claim. Verified in DOM: exactly **one** `SMS` occurrence, inside
`faq-zoho-crm`.

### E. RECORDING SYNC: **WITHHELD**

`crmNeeds` enumerates four needs and recording is not one of them. S01 §10, S02
§12 and INT-02 §13 all already resolved this gate NEGATIVE on the same evidence.

Not published as a capability, benefit, workflow step or visual. The only
recording mention is FAQ 6's question, answered with the §22 "IF NOT VERIFIED"
wording. Verified in DOM: exactly **one** `Ghi âm` occurrence, inside
`faq-zoho-crm`.

### Partnership / certification / marketplace: **NOT PUBLISHED**
### Edition / plan coverage: **NOT PUBLISHED**

No evidence exists anywhere; `docs/CHECKPOINT_S01_CRM_INTEGRATION.md` records the
same finding for Zoho. Naming Zoho CRM asserts connection experience only. The
setup note states explicitly that Gcalls does not assume every Zoho plan or
edition supports the same integration scope.

---

## 4. Published capabilities — four cards

| # | Card | Gate |
|---|---|---|
| 01 | Click-to-Call | A — VERIFIED, §10A wording verbatim |
| 02 | Customer Context | B — CONTEXT ONLY; also carries §11 baseline "Customer Identification **where supported**" |
| 03 | Call Activity / Interaction History | C — CONDITIONAL ONLY |
| 04 | CRM Workflow Continuity | §11 baseline |

§11's four "safe baseline" items are all represented. Baseline items 1 and 4
(Customer Context, Customer Identification where supported) are **merged into one
card** rather than split into two near-identical ones; the "nơi được hỗ trợ" hedge
is kept explicit so nothing is silently dropped or silently strengthened. This
merge is recorded in the data-file header, not left implicit.

Click-to-SMS and recording sync have **no card**. §11 is explicit: do not create
feature cards pretending unverified capabilities exist.

`featureList` in the `SoftwareApplication` node carries exactly these four titles,
so the structured data cannot assert more than the visible page.

---

## 5. Section inventory — 18 rendered content sections

Hero · Direct Answer · Business Problems · Overview + Core Flow · Core
Capabilities (4) · Workflow (6) · Before/After · Benefits (4) · Use Cases (4) ·
Setup (9) + scope note · UI Preview · Zoho vs Generic CRM · Related Integrations ·
Product Boundary · Trust · FAQ (7) · Onward Links · Final CTA.

Verified in DOM: **1 H1**, 17 in-content H2, 4 capability cards, 6 flow nodes,
6 workflow steps, 9 setup steps, 4 benefits, 4 use cases, 7 FAQ items,
19 in-content links.

JSON-LD: 4 nodes — `BreadcrumbList`, `Service`, `SoftwareApplication`, `FAQPage`.
No `Offer`, price, `AggregateRating`, `Review`, performance metric, partner or
certification property.

---

## 6. Visual strategy

| Check | Result |
|---|---|
| Fake Zoho CRM UI | **0** |
| Zoho logo / wordmark / brand colour | **0** |
| Third-party logo used as partnership proof | **0** |
| Real PII | **0** |
| Price / metric / score / percentage in any visual | **0** |

Two purpose-built, deliberately unbranded visuals in
`src/components/zoho/visuals.tsx` (`DEMO_VISUAL_REPLACE_LATER`, single swap
point) — the same pattern S02 (Helpdesk) and S03 (POS) used:

1. **`CrmModuleContextMockup`** (hero) — a generic panel labelled `CRM MODULE`
   showing a module, a masked customer record (`KH #3061`), a masked phone
   (`••• ••• •61`), a Click-to-Call control (gate A) and call-activity
   *categories* (gate C). Organised around **module + activity trail**, which is
   the axis this page's copy uses throughout, where the Salesforce panel uses
   "record"/"object" — deliberately not a re-skin, because a renamed clone is
   exactly the "page with renamed labels" §2 forbids.
2. **`CustomerContextPanelMockup`** (UI preview) — the Gcalls-side context
   reaching the agent during a call, plus interaction-history categories.

### §17 priority 2 was tried and rejected on evidence grounds

The approved `CRMMockup` was wired into the UI preview first. DOM scanning caught
that its interaction list renders **"Ghi âm có sẵn"**, and `CallTimelineMockup`
renders a recording player. Recording is a real Gcalls feature, but **gate E
(recording sync INTO Zoho) is WITHHELD** — and a recording row sitting inside a
customer record on a Zoho page invites precisely the inference that gate refuses.
The incoming-popup surface is out for the same reason under gate B.

The section therefore falls through to §17 priority 3. Consequence worth noting:
this page carries **no demo phone numbers and no fictional contact names at all** —
the only digits anywhere in the preview are the masked identifier `3061`, and the
only email/phone on the whole page is Gcalls' own footer contact.

---

## 7. Claim guard — clean

| Scan (rendered DOM) | Result |
|---|---|
| "popup" | **0** |
| Click-to-SMS as a capability | **0** (SMS appears once, as FAQ 5's question) |
| Recording sync as a capability | **0** (appears once, as FAQ 6's question) |
| Any `%` figure | **0** |
| Currency / price token (`₫`, `VNĐ`, `VND`, `USD`) | **0** |
| `đối tác chính thức` / `chứng nhận` / `certified` / `marketplace` / `partner` | **0** |
| `vài phút` / `tức thì` / `100%` / `toàn bộ trường` / `zero manual` | **0** |
| **Unsupported numeric claims** | **0** |

Setup is 9 steps with **no duration on any step or in total**.

**Scanned false positive, deliberately kept:** the phrase `mọi gói` matches the
claim-guard regex, but its only occurrence is the setup note *denying* the claim —
`Gcalls không mặc định mọi gói hoặc edition Zoho CRM đều hỗ trợ cùng một phạm vi
tích hợp` — which §16 requires. Read in full before "fixing" this.

---

## 8. CTA architecture — all real-click tested

| CTA | Intent | Result |
|---|---|---|
| Hero primary — `Xem demo tích hợp Zoho CRM` | `demo` | **PASS** |
| Hero secondary — `Xem workflow tích hợp` | anchor `#workflow-zoho-crm` | **PASS** (hash set, target at top of viewport, scrollY 3705) |
| Final band primary — `Xem demo tích hợp Zoho CRM` | `demo` | **PASS** |
| Final band secondary — `Tư vấn tích hợp` | `consultation` | **PASS** |
| Trust — `Trao đổi về workflow Zoho CRM hiện tại` | `consultation` | **PASS** |
| Generic CRM — `Xem giải pháp Tổng đài tích hợp CRM` | route | **PASS** |
| HubSpot link | route | **PASS** |
| Salesforce link | route | **PASS** |

All use the shared `LeadForm` via `leadCtaHref`. No page-local form or submit
logic. **0 dead CTAs.**

### LeadSource choice

No Zoho-specific `LeadSource` exists in the shared model and inventing an untyped
string would break normalisation, so the **most specific valid member already
supported** is used: `crm_integration`. The platform is carried in
`product: 'Zoho CRM'`, and `solution: 'Tích hợp CRM'` keeps the form's "Nhu cầu"
select pre-selecting.

### Zoho CRM context retained at the destination — VERIFIED VISIBLY

`'Zoho CRM'` was added to the `PRODUCT_DISPLAY_LABELS` allow-list in
`src/lib/leads/ctaLink.ts`. Browser-verified on `/lien-he/`:

| Input | Rendered | Need pre-selected |
|---|---|---|
| `intent=demo&product=Zoho CRM` | `Quan tâm: Zoho CRM` | `Tích hợp CRM` |
| `intent=consultation&product=Zoho CRM` | `Quan tâm: Zoho CRM` | `Tích hợp CRM` |
| `product=random junk zoho text` | *(nothing rendered)* | — |
| `product=<b>spoof</b>` | *(nothing rendered)* | — |

`intent=demo` survives to the form. Junk and injection-shaped `?product=` values
render nothing — the allow-list holds, so **no free-form URL context reaches the
page.**

---

## 9. Internal links — contextual, no link dump

`/tong-dai-tich-hop-crm/` · `/tich-hop/` · `/tich-hop/hubspot/` ·
`/tich-hop/salesforce/` · `/gcalls-plus-webphone/` · `/gcalls-cx/` ·
`/bang-gia/` · `/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/`
— **all 10 required destinations present**, plus the hotline `tel:`.

19 in-content links total. Each required destination sits where it is contextually
earned (CRM in §12 and §14, HubSpot/Salesforce/hub in §13, Gcalls Plus and Gcalls
CX in §14, estimator/pricing in Trust); the onward row carries only the 4
remaining destinations rather than repeating them.

**Broken links: 0** — every destination resolved with 1 H1 and none rendered the
404 page.

---

## 10. Responsive QA — actual rendered

Measured in real viewports (same-origin iframes at exact widths; the macOS Chrome
window floors at ~514px, so window resizing alone cannot reach 390).

| Width | Page-level overflow | Element-level offenders | H1 | Core-flow columns |
|---|---|---|---|---|
| 390 | **0** | **0** | 1 | 1 |
| 430 | **0** | **0** | 1 | 1 |
| 768 | **0** | **0** | 1 | 1 |
| 1024 | **0** | **0** | 1 | 4 |
| 1440 | **0** | **0** | 1 | 4 |

Workflow readable at every width (1 / 2 / 3 columns for the six-step grid). UI
preview readable at every width, heading never covered.

**CTA tap targets:** all 19 in-content links measure ≥ 44px. **Zero** sub-44
elements of any kind — this page has no interactive demo mockup, because both its
visuals are built from non-interactive elements. That is a cleaner result than
INT-01 (3 sub-44 decorative buttons) and INT-02 (8).

The two shared-component issues documented at INT-02 §9
(`ProductVisualWithSupport` heading overlap, `CallTimelineMockup` hotline clip) do
**not** affect this page — it uses neither the overlap composition nor that
mockup. Both remain open for a future shared-component fix.

---

## 11. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** — 0 errors (6 pre-existing `react-refresh` warnings in vendor `src/app/components/ui/*`, untouched) |
| `npm run build` | **PASS** (`ZohoCrmIntegrationPage` chunk 27.27 kB / 7.31 kB gzip) |
| 1 H1 | PASS |
| 0 dead CTA | PASS |
| 0 broken link | PASS |
| 0 fake Zoho UI | PASS |
| 0 fake price | PASS |
| 0 unsupported numeric claim | PASS |
| 0 real PII | PASS |

Re-run after the §6 UI-preview visual swap; all three still pass.

---

## 12. Regression

No content rewritten on Home, any of the six hubs, Gcalls Plus, QA QC Center,
Gcalls CX, CRM, Helpdesk, POS, International, Pricing, Estimator or HubSpot.
Salesforce changed **only** by the approved Part A title correction.

Verified intact by real click-through after all changes (1 H1, no 404): Zoho CRM,
Salesforce, HubSpot, CRM Integration, Helpdesk, POS, International, Pricing,
Estimator, Blog, Freshdesk, Home.

Shared files touched, and why:

| File | Change |
|---|---|
| `src/app/router.tsx` | Registered the real page; removed the route from `SHELL_ROUTES` |
| `src/config/sitemap.ts` | Part A Salesforce title; INT-03 Zoho title/meta lock, `shell` → `complete`, priority 0.7 → 0.8 |
| `src/pages/ShellPage.tsx` | Removed the now-unused `RELATED` entry |
| `src/lib/leads/ctaLink.ts` | Added `'Zoho CRM'` to the `PRODUCT_DISPLAY_LABELS` allow-list |

New files:

- `src/data/zohoCrmIntegration.ts` (locked copy + gate reasoning + JSON-LD)
- `src/pages/ZohoCrmIntegrationPage.tsx`
- `src/components/zoho/visuals.tsx` (two unbranded conceptual visuals)
- `docs/CHECKPOINT_INT03_ZOHO_CRM.md`

Boss Demo V1 remains frozen: tag `gcalls-website-demo-v1` → `cd4f1d9`, verified
unmoved. **Freshdesk remains a shell — not started.**

---

## 13. Open evidence questions

Carry into any future Zoho CRM revision — each is currently WITHHELD or
conditional, **not denied**:

1. **Connection mechanism.** Which extension, marketplace app, API or
   telephony-provider slot is current for Zoho? Gate A verified the capability,
   not the wiring; setup step 5 and FAQ 2 stay deliberately vague until this is
   answered.
2. **Incoming customer display.** Is customer data shown automatically on an
   incoming call for a Zoho account, or does the agent open the record? Answering
   this is what would let gate B move off CONTEXT ONLY.
3. **Click-to-SMS.** Is SMS part of the Zoho integration in the current product,
   or only of Gcalls CX? Needs current product evidence, not the old SEO sheet.
4. **Recording sync.** Can a recording, or a link to one, be written into Zoho
   CRM? Creation vs linking must be distinguished before publishing.
5. **Module coverage.** Which Zoho modules are supported (Leads, Contacts,
   Accounts, Deals, Cases, custom)? Nothing evidences a list, which is why §16
   step 2 exists and no module is named as supported.
6. **Edition / plan coverage.** Which Zoho CRM editions or licences are
   supported?
7. **Write-back scope.** Which fields, if any, can Gcalls write to a Zoho record?
   Gate C is deliberately worded as "ghi nhận hoặc liên kết" because the
   difference is not evidenced.
8. **Partnership status.** Is Gcalls in the Zoho marketplace or a partner in any
   formal sense? Must be reported before publishing.
9. **Real UI evidence.** A PII-masked screenshot of Gcalls running inside Zoho CRM
   would replace both conceptual visuals.
10. **Shared visual components.** The two `ProductVisualWithSupport` /
    `CallTimelineMockup` items from INT-02 §9 still need a shared-component fix
    that also re-verifies the locked pages.

---

## 14. Status

**CONTENT LOCKED V1.**

Copy in `src/data/zohoCrmIntegration.ts` is locked; the file header carries the
claim guard and all five capability gates with their reasoning. Do not reword, and
do not add capabilities, modules, synced fields, editions, plans or benefits that
are not there.

Freshdesk remains a shell — **not** started here.
