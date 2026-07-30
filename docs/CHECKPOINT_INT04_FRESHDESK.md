# Checkpoint INT-04 — Freshdesk Integration

**Route:** `/tich-hop/freshdesk/`
**Type:** Platform-specific **Helpdesk** integration page (MOFU/BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 0. Baseline verification

| Item | Verified |
|---|---|
| Repository | `/Users/macos/Desktop/Gcalls/App/Gcalls-website-app` |
| `git rev-parse --show-toplevel` | same path |
| Branch | `feature/gcalls-website-foundation` |
| Working tree at start | clean |
| Boss Demo tag | `gcalls-website-demo-v1` → commit **`cd4f1d9`** — verified UNMOVED |
| INT-01 HubSpot | `a8425abc616d6763aaa790571176c2049e654145` |
| INT-02 Salesforce | `9f5e9e9` |
| INT-03 Zoho CRM | `4bc7dc29f332c0885e0e1d9a8ad3765cbf80d24e` — exists |

---

## 1. Baseline — SHELL

`/tich-hop/freshdesk/` existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD, no lead
CTA, no estimator link. Its sitemap entry carried a placeholder title
(`Tích hợp Gcalls với Freshdesk | Kết nối tổng đài và Helpdesk`),
`status: 'shell'`, `priority: 0.7`.

The route was removed from `SHELL_ROUTES` and given a real lazy route; its
`ShellPage` `RELATED` entry was removed. Zendesk is now the last platform shell.

### Architecture reused — nothing cloned, no shared component modified

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
| `IntegrationPlatforms` | **Not used** — a vendor grid on a page that IS a vendor page would compete with Zendesk instead of routing to it |
| `@/components/helpdesk/visuals` | Yes — both mockups reused, **no new visuals file created** |

Also reused unchanged: `FinalCtaBand`, `FaqAccordion`, `JsonLd`, `Breadcrumb`,
`ProductVisual`, the `primitives` set, `leadCtaHref`, and the existing
`helpdesk-integration` estimator slug.

**No CRM-page wording was reused.** This is a ticket workflow, not a CRM record
workflow — tickets and support requests are the axis throughout. Shared edits are
limited to one route registration, one sitemap entry, one `ShellPage` deletion and
one allow-list entry.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp Freshdesk`
- **Title:** `Tổng đài tích hợp Freshdesk | Kết nối cuộc gọi với ticket CSKH`
- **Meta:** `Gcalls tích hợp Freshdesk giúp đội CSKH kết nối hoạt động nghe gọi với customer context, ticket và lịch sử hỗ trợ theo phạm vi cấu hình.`
- **H1:** `Tổng đài tích hợp Freshdesk cho đội CSKH và Support`
- **Canonical:** `https://gcalls.co/tich-hop/freshdesk/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of INT-04 scope.

All four verified against the rendered DOM.

The title deliberately names **no** withheld capability — no Click-to-Call, popup,
SMS, automatic ticket creation or recording sync. INT-02 had to be corrected for
exactly that class of title/body mismatch; INT-04 does not repeat it, and the
title, body and JSON-LD all assert the same four capabilities.

Legacy canonicals `/gcalls-tich-hop-freshdesk/` and
`/tong-dai-tich-hop-freshdesk/` are not used.

### Note on the secondary keyword `click to call Freshdesk`

It is a listed §4 secondary keyword, but gate A is **WITHHELD**, so the page does
not claim the capability. The keyword is served **honestly**: FAQ 2 answers the
question a searcher is actually asking by explaining that the mechanism depends on
configuration and will be scoped in survey. Ranking for a question is not the same
as asserting a feature, and this was deliberately not resolved by publishing an
unverified claim.

### Cannibalization

This page owns Freshdesk-specific intent only. `tổng đài tích hợp Helpdesk` stays
with `/tong-dai-tich-hop-helpdesk/` — section 13 hands that visitor over. Zendesk
intent stays on its own route; it appears once, as a routed link, with no
comparison or superiority claim.

---

## 3. Evidence base — HELPDESK, not CRM

**This is the single most important finding of INT-04.** Freshdesk is governed by
the Helpdesk evidence base, which is materially **narrower** than the CRM base
used by INT-01/02/03:

| Source | What it evidences for Freshdesk |
|---|---|
| `estimator.ts`, solution `helpdesk` | `helpdeskPlatform` names **Freshdesk**, Zendesk, Khác. `helpdeskNeeds` enumerates **exactly two** needs: "Gắn cuộc gọi vào ticket" (LINKING) and "Lịch sử cuộc gọi trong hồ sơ hỗ trợ" |
| `helpdeskIntegration.ts` (S02, locked) | Four conditional capabilities — Call Context, Ticket / Support Record **Connection**, Interaction History, Customer Identification — plus Freshdesk as a routed platform, connection scope only, plus an approved support-context **category** list |
| `gcallsPlus.ts` (P01) | Call history and activity data affirmed as a Gcalls capability |
| `qaQcCenter.ts` (P02) | QA runs "từ bản ghi cuộc gọi" — affirms recordings can exist in Gcalls |

**The decisive contrast:** `crmNeeds` enumerates **four** needs and **includes
`click-to-call`**; `helpdeskNeeds` enumerates **two** and includes **no calling
mechanism at all**. That single difference is why this page publishes fewer
capabilities than the Salesforce or Zoho pages. It must not be "fixed" by
borrowing from them.

**§10 historical material treated as claims to TEST, not evidence.** The
historical list (Click-to-Call in Freshdesk, incoming call box, Click-to-SMS,
customer iframe, recent-ticket fields, manual ticket creation, automatic per-call
ticket creation, contact creation for unknown numbers) could not be verified in the
current repository. §10 is explicit that a feature must not be published merely
because an old page described it, so all of it is withheld.

---

## 4. Capability evidence gates — eleven decisions

### A. CLICK-TO-CALL: **WITHHELD**

`helpdeskNeeds` — the same approved config that names Freshdesk — enumerates two
needs and Click-to-Call is not one of them. In this repository Click-to-Call exists
**only** as a CRM capability. S03 §13 already established it must not be inherited
out of the CRM category (it was withheld for POS on exactly this reasoning), and
Freshdesk is a Helpdesk platform, not a CRM.

**Decisively:** the locked S02 **generic** Helpdesk page publishes four
capabilities and Click-to-Call is not among them. A platform-specific page cannot
claim MORE than the category page it specialises, from a narrower evidence base.

Consequence: no capability card; FAQ 2 uses the §24 "IF NOT VERIFIED" wording; the
hero claims no calling mechanism; the flow node and Before/After say
"call action" / "configured call action". Rendered page: **1 occurrence of
"Click-to-Call", in FAQ 2's question only.**

### B. INCOMING CALL / CALL BOX: **WITHHELD**

Nothing evidences answering a call **inside Freshdesk**. INT-01 published an
incoming call-box card for HubSpot on CRM-scoped S01 evidence; no equivalent exists
in the Helpdesk base. No capability card, and no copy says a call is answered
inside Freshdesk.

*Worth stating plainly:* the hero visual's panel reads `GCALLS · CUỘC GỌI ĐẾN`.
That is **Gcalls'** own incoming-call surface — a well-evidenced Gcalls product
capability — explicitly labelled GCALLS, feeding an integration layer and an
abstract support record. What gate B withholds is a Freshdesk-**embedded** call
box, and nothing on the page depicts or claims one.

### C. CUSTOMER CONTEXT / IFRAME: **CONTEXT ONLY**

S02 publishes "Call Context" and "Customer Identification" conditionally, and that
is the whole of it. **No iframe of any kind is evidenced** — rendered page contains
**0 occurrences of "iframe"**, and no embedded panel or in-Freshdesk widget is
claimed.

§11C forbids field-level detail without current evidence, so the support-context
section publishes only the **category** list S02 already approved, and explicitly
**omits the two extra items §15 lists as merely possible — `company` and
`assigned agent`** — because neither appears in any approved source.

### D. TICKET CONNECTION: **VERIFIED & PUBLISHED**, scoped to CONTEXT + LINKING

`helpdeskNeeds` literally offers "Gắn cuộc gọi vào ticket", and S02's
"Ticket / Support Record Connection" carries a code comment stating it describes
LINKING and "deliberately does not describe creating one".

§11D requires the four sub-capabilities be differentiated:

| Sub-capability | Decision |
|---|---|
| ticket **context** | PUBLISHED (conditional) |
| ticket **linking** | PUBLISHED (conditional) |
| ticket **creation** | WITHHELD (gates E, F) |
| ticket **update** | WITHHELD — no evidence; FAQ 4 defers it to survey |

### E. MANUAL TICKET CREATION: **WITHHELD**
No approved source evidences Gcalls creating a Freshdesk ticket. `helpdeskNeeds`
offers no creation option.

### F. AUTOMATIC TICKET CREATION: **WITHHELD**
The strongest historical claim with the least support. S02's own gate already
closed it NEGATIVE and the S02 claim guard names "tự động tạo ticket" as a
forbidden universal behaviour. **Nothing on the page implies any call creates a
ticket** — the only mention is FAQ 4's question, answered conservatively.

### G. CONTACT CREATION FOR UNKNOWN CALLERS: **WITHHELD**
No approved source evidences Gcalls writing a new contact into Freshdesk. Not
published in any form, including as a workflow step.

### H. CLICK-TO-SMS: **WITHHELD**
The only SMS evidence belongs to a **different product** — Gcalls CX, where SMS is
one of five omnichannel channels. `helpdeskNeeds` offers no SMS option. Withheld
for the fourth consecutive checkpoint. Rendered page contains **0 occurrences of
"SMS"** — this page does not even carry an SMS FAQ.

### I. CALL HISTORY — two decisions, never merged

| | Decision |
|---|---|
| **GCALLS CALL HISTORY** | **VERIFIED & PUBLISHED**. `gcallsPlus.ts` FAQ (approved) affirms it directly: "Gcalls Plus hỗ trợ theo dõi lịch sử và dữ liệu hoạt động cuộc gọi" |
| **FRESHDESK HISTORY SYNC** | **CONDITIONAL ONLY**. `helpdeskNeeds` offers "Lịch sử cuộc gọi trong hồ sơ hỗ trợ" and S02 publishes "Interaction History" conditionally — published, but never as automatic, complete or field-guaranteed |

Capability card 02 carries the split **inside its own wording**: history in Gcalls
is affirmed, writing it into Freshdesk stays conditional. FAQ 5 makes storage
location an explicit survey item. Do not collapse the two halves.

### J. RECORDING — two decisions, never merged

| | Decision |
|---|---|
| **RECORDING IN GCALLS** | **VERIFIED & PUBLISHED**, conditional register. `qaQcCenter.ts` (approved) runs its QA workflow "từ bản ghi cuộc gọi". Stated **only** in FAQ 6, and NOT as a Freshdesk-integration capability, because it is not one |
| **RECORDING SYNC TO FRESHDESK** | **WITHHELD**. S02's gate already closed this NEGATIVE; S01, INT-02 and INT-03 reached the same conclusion |

FAQ 6's approved wording encodes exactly this split. Rendered page: **1 occurrence
of "Ghi âm", in FAQ 6's question only.**

### Partnership / Freshworks certification / marketplace / SLA: **NOT PUBLISHED**
### Plan coverage: **NOT PUBLISHED**
### Extension instructions: **NOT PUBLISHED**

No evidence exists for any of these;
`docs/CHECKPOINT_S02_HELPDESK_INTEGRATION.md` records the same finding for
Freshdesk. §18 forbids publishing old extension instructions as the current or
universal method, so setup step 5 says "phương thức kết nối hiện hành" and names no
extension, app, API version or credential type.

---

## 5. Published capabilities — the four §12 baseline items, and only those

| # | Card | Gate |
|---|---|---|
| 01 | Customer Context | C — CONTEXT ONLY, with permission/config hedge |
| 02 | Call Activity | I — carries the Gcalls-verified / Freshdesk-conditional split |
| 03 | Ticket / Support Record Context | D — context + linking to an **existing** record |
| 04 | Support Workflow Continuity | §12 baseline |

Click-to-Call, incoming call / call box, Click-to-SMS, manual ticket creation,
automatic ticket creation and unknown-caller contact creation have **no card**.
§12 is explicit that these appear only if their individual gates pass.

`featureList` in the `SoftwareApplication` node carries exactly these four titles,
so the structured data cannot assert more than the visible page.

---

## 6. Section inventory — 19 rendered content sections

Hero · Direct Answer · Business Problems · Overview + Core Flow · Core
Capabilities (4) · Workflow (6) · Before/After · Support Context (6 categories +
scope note) · Benefits (4) · Use Cases (4) · Setup (9) + scope note · UI Preview ·
Freshdesk vs Generic Helpdesk · Other Helpdesk Platforms · Product Boundaries (5) ·
Trust · FAQ (7) · Onward Links · Final CTA.

Verified in DOM: **1 H1**, 18 in-content H2, 4 capability cards, 6 flow nodes,
6 workflow steps, 6 support-context categories, 9 setup steps, 4 benefits,
4 use cases, 7 FAQ items, 19 in-content links.

JSON-LD: 4 nodes — `BreadcrumbList`, `Service`, `SoftwareApplication`, `FAQPage`.
No `Offer`, price, `AggregateRating`, `Review`, performance metric, SLA, partner or
certification property.

---

## 7. Visual strategy

| Check | Result |
|---|---|
| Fake Freshdesk UI | **0** |
| Fake branded ticket screen | **0** |
| Freshdesk logo / wordmark / brand colour | **0** |
| Screenshot used as partnership proof | **0** |
| Real PII | **0** |
| Price / metric / score / percentage in any visual | **0** |

**§19 priority resolution.** Priority 1 (a real, currently approved Freshdesk
screenshot) does not exist here — and §19 also requires verifying that any such
screenshot represents *current* behaviour, which could not be done. Priority 2 (a
real/sanitized Gcalls-side integration screenshot) does not exist either. The page
therefore uses **priority 3**: the conceptual, deliberately unbranded surfaces from
`@/components/helpdesk/visuals` (`DEMO_VISUAL_REPLACE_LATER`, single swap point).

Those surfaces are **reused, not cloned**, and are already correct for this gate
set: their own file header states that no ticket is shown being created because
automatic creation is not verified. They depict `GCALLS · CUỘC GỌI ĐẾN` →
`Lớp tích hợp Gcalls` → an abstract `HỒ SƠ HỖ TRỢ` marked `Đã liên kết` — i.e.
exactly gate D's verified linking behaviour, with the Gcalls side clearly labelled
as Gcalls.

No new visuals file was created, because the gates permit nothing that these two
do not already depict honestly. PII is masked throughout (`KH #2318`, `Agent 04`),
and the only email or phone anywhere on the page is Gcalls' own footer contact.

---

## 8. Claim guard — clean

| Scan (rendered DOM) | Result |
|---|---|
| "Click-to-Call" | 1 — FAQ 2 **question** only |
| "Ghi âm" / "bản ghi" | 1 — FAQ 6 **question** only |
| "tạo ticket" | 1 — FAQ 4 **question** only |
| "SMS" | **0** |
| "popup" | **0** |
| "iframe" | **0** |
| Any `%` figure | **0** |
| Currency / price token | **0** |
| `đối tác chính thức` / `chứng nhận` / `certified` / `Freshworks` / `marketplace` / `partner` / `SLA` | **0** |
| `vài phút` / `tức thì` / `100%` / `real-time guaranteed` / `toàn bộ trường` | **0** |
| **Unsupported numeric claims** | **0** |

Setup is 9 steps with **no duration** on any step or in total.

**Scanned false positive, deliberately kept:** `mọi gói` matches the guard regex,
but its only occurrence is the setup note *denying* the claim — `Gcalls không mặc
định mọi gói Freshdesk đều hỗ trợ cùng một phạm vi tích hợp` — which §18 requires.
Read it in full before "fixing" it.

---

## 9. CTA architecture — all real-click tested

| CTA | Intent | Result |
|---|---|---|
| Hero primary — `Xem demo tích hợp Freshdesk` | `demo` | **PASS** |
| Hero secondary — `Xem workflow tích hợp` | anchor `#workflow-freshdesk` | **PASS** (hash set, target at top of viewport, scrollY 3808) |
| Final band primary — `Xem demo tích hợp Freshdesk` | `demo` | **PASS** |
| Final band secondary — `Tư vấn tích hợp` | `consultation` | **PASS** |
| Trust — `Trao đổi về workflow Freshdesk hiện tại` | `consultation` | **PASS** |
| Generic Helpdesk — `Xem giải pháp Tổng đài tích hợp Helpdesk` | route | **PASS** |
| Zendesk link | route | **PASS** |
| Estimator — `Ước tính cấu hình & chi phí` | `?product=helpdesk-integration` | **PASS** (see §10) |

All use the shared `LeadForm` via `leadCtaHref`. No page-local form or submit
logic. **0 dead CTAs.**

### LeadSource — a well-matched one already existed

Unlike the CRM platform pages (which had to fall back to `crm_integration`), this
page uses `source: 'helpdesk_integration'` — a pre-existing typed member — paired
with `solution: 'Tích hợp Helpdesk'` (an approved `LEAD_NEEDS` value). Most
specific valid combination in the shared model; no shared type changed.

### Freshdesk context retained at the destination — VERIFIED VISIBLY

`Freshdesk` was added to the `PRODUCT_DISPLAY_LABELS` allow-list in
`src/lib/leads/ctaLink.ts`. Browser-verified on `/lien-he/`:

| Input | Rendered | Need pre-selected |
|---|---|---|
| `intent=demo&product=Freshdesk` | `Quan tâm: Freshdesk` | `Tích hợp Helpdesk` |
| `intent=consultation&product=Freshdesk` | `Quan tâm: Freshdesk` | `Tích hợp Helpdesk` |
| `product=random junk freshdesk blob` | *(nothing rendered)* | — |
| `product=<i>spoofed</i>` | *(nothing rendered)* | — |

`intent=demo` survives to the form. Junk and injection-shaped `?product=` values
render nothing — the allow-list holds.

---

## 10. Cost estimator (§26)

**No Freshdesk estimator key was invented.** The page reuses the existing generic
slug `helpdesk-integration`, already present in `PRODUCT_SLUG_ALIASES`
(`src/components/estimator/Estimator.tsx`), where it maps to the `helpdesk`
solution.

Why this matters: a `freshdesk` key would resolve to no solution and
`usePreselectedSolution` would silently return `null`, dropping the visitor onto
the generic "choose a solution" step. Freshdesk context is preserved **separately**
on the LeadForm via the two lead contexts, so nothing is lost.

**Verified in the browser** at `/uoc-tinh-chi-phi/?product=helpdesk-integration`:
the `Tích hợp Helpdesk` card carries `aria-checked="true"` while every other
solution carries `aria-checked="false"`, and it renders visually selected (brand
border + check mark). The estimator remains on step 1 so the visitor confirms
before advancing — that is existing behaviour, not a preselection failure.

---

## 11. Internal links — contextual, no dump

`/tong-dai-tich-hop-helpdesk/` · `/tich-hop/` · `/tich-hop/zendesk/` ·
`/gcalls-plus-webphone/` · `/gcalls-cx/` · `/qc-bot-ai/` ·
`/nganh/thuong-mai-dien-tu/` · `/nganh/bpo/` · `/bang-gia/` ·
`/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/`
— **all 12 required destinations present**, plus the hotline `tel:`.

19 in-content links total. Each sits where it is contextually earned (generic
Helpdesk in §13 and §15, Zendesk/hub in §14, Gcalls Plus / Gcalls CX / QA QC Center
in §15, estimator and pricing in Trust, Gcalls CX again in FAQ 7). The two industry
links are earned rather than dumped: SaaS Support and E-commerce Customer Service
are two of the four §17 use cases, and BPO / support centre is a §3 persona.

**Broken links: 0** — every destination resolved with 1 H1 and none rendered the
404 page.

---

## 12. Responsive QA — actual rendered

Measured in real viewports (same-origin iframes at exact widths; the macOS Chrome
window floors at ~514px, so window resizing alone cannot reach 390).

| Width | Page-level overflow | Element-level offenders | H1 | Core flow cols | Workflow cols |
|---|---|---|---|---|---|
| 390 | **0** | **0** | 1 | 1 | 1 |
| 430 | **0** | **0** | 1 | 1 | 1 |
| 768 | **0** | **0** | 1 | 1 | 2 |
| 1024 | **0** | **0** | 1 | 4 | 3 |
| 1440 | **0** | **0** | 1 | 4 | 3 |

(`scrollWidth − viewport` measured −15 at every width — the iframe scrollbar — i.e.
no horizontal overflow anywhere.)

Workflow readable at every width. Support-context visual readable (335–380px).
UI preview readable (335–360px). FAQ readable — accordion triggers measure
56–76px tall and span the full content column at every width.

**CTA tap targets:** all 19 in-content links ≥ 44px. **Zero** sub-44 elements of
any kind, links or buttons — neither visual on this page contains interactive
controls.

The two shared-component issues documented at INT-02 §9
(`ProductVisualWithSupport` heading overlap, `CallTimelineMockup` hotline clip) do
**not** affect this page — it uses neither. Both remain open.

---

## 13. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** — 0 errors (6 pre-existing `react-refresh` warnings in vendor `src/app/components/ui/*`, untouched) |
| `npm run build` | **PASS** (`FreshdeskIntegrationPage` chunk 26.25 kB / 7.30 kB gzip) |
| 1 H1 | PASS |
| 0 broken links | PASS |
| 0 dead CTA | PASS |
| 0 fake Freshdesk UI | PASS |
| 0 fake price | PASS |
| 0 unsupported numeric claims | PASS |
| 0 real PII | PASS |

---

## 14. Regression

No content rewritten on HubSpot, Salesforce, Zoho CRM, generic CRM Integration,
generic Helpdesk Integration, POS, International, Gcalls Plus, QA QC Center,
Gcalls CX, Pricing, Estimator, Home or any hub page.

Verified intact by real click-through after all changes (1 H1, no 404): Freshdesk,
HubSpot, Salesforce, Zoho CRM, generic Helpdesk, generic CRM, POS, International,
Gcalls Plus, Gcalls CX, QA QC Center, Pricing, Estimator, Blog, both industry
pages, Zendesk (still a shell), Home.

Shared files touched, and why:

| File | Change |
|---|---|
| `src/app/router.tsx` | Registered the real page; removed the route from `SHELL_ROUTES` |
| `src/config/sitemap.ts` | INT-04 title/meta lock; `shell` → `complete`, priority 0.7 → 0.8 |
| `src/pages/ShellPage.tsx` | Removed the now-unused `RELATED` entry |
| `src/lib/leads/ctaLink.ts` | Added `Freshdesk` to the `PRODUCT_DISPLAY_LABELS` allow-list |

New files:

- `src/data/freshdeskIntegration.ts` (locked copy + eleven gate decisions + JSON-LD)
- `src/pages/FreshdeskIntegrationPage.tsx`
- `docs/CHECKPOINT_INT04_FRESHDESK.md`

`src/components/helpdesk/visuals.tsx` was **read and reused, not modified.**

Boss Demo V1 remains frozen: tag `gcalls-website-demo-v1` → `cd4f1d9`, verified
unmoved. **Zendesk remains a shell — not started.**

---

## 15. Open evidence questions

Every one of these is WITHHELD or conditional, **not denied**. Each is a concrete
question for the product/CS team.

1. **Click-to-Call in Freshdesk.** Does the current product support starting a
   call from a Freshdesk contact or ticket, and by what mechanism? This is the
   highest-value question on the list — it is a listed keyword, historical material
   described it, and the Helpdesk evidence base does not enumerate it.
2. **Incoming call inside Freshdesk.** Can an agent receive or answer a call
   without leaving Freshdesk, or only in the Gcalls surface?
3. **Customer iframe.** Does a Gcalls panel render inside Freshdesk? If so, which
   fields does it show — and are `company` and `assigned agent` among them?
4. **Ticket write operations.** Can Gcalls create a ticket (manually or per call),
   and can it update one? Creation, update and linking must stay distinguished.
5. **Contact creation for unknown callers.** Can Gcalls create a Freshdesk contact
   from an unrecognised number?
6. **Click-to-SMS.** Is SMS part of the Freshdesk integration in the current
   product, or only of Gcalls CX? Which provider is required?
7. **Freshdesk history sync scope.** Which call fields can be written into
   Freshdesk, and where do they land (ticket note, activity, custom field)?
8. **Recording sync.** Can a recording, or a link to one, be attached to a
   Freshdesk ticket? Creation vs linking must be distinguished.
9. **Connection mechanism.** Which extension, marketplace app or API is current?
   Setup step 5 stays deliberately vague until this is answered.
10. **Plan coverage.** Which Freshdesk plans support the integration?
11. **Partnership status.** Is Gcalls a Freshworks marketplace listing or partner
    in any formal sense? Must be reported before publishing.
12. **Real UI evidence.** A PII-masked screenshot of Gcalls running inside
    Freshdesk, verified as current behaviour, would replace the conceptual
    surfaces and would let §19 priority 1 apply.
13. **Shared visual components.** The two items from INT-02 §9 still need a
    shared-component fix that also re-verifies the locked pages.

---

## 16. Status

**CONTENT LOCKED V1.**

Copy in `src/data/freshdeskIntegration.ts` is locked; the file header carries the
claim guard and all eleven gate decisions with their reasoning, including the
Helpdesk-vs-CRM evidence contrast that explains why this page is narrower than
INT-01/02/03. Do not reword, and do not add capabilities, ticket behaviours,
fields, plans or benefits that are not there.

Zendesk remains a shell — **not** started here.
