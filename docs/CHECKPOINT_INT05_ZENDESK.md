# Checkpoint INT-05 — Zendesk Integration

**Route:** `/tich-hop/zendesk/`
**Type:** Platform-specific **Helpdesk** integration page (MOFU/BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

**Final page of Integration Cluster V1.** All five platform pages are now built:
HubSpot (INT-01), Salesforce (INT-02), Zoho CRM (INT-03), Freshdesk (INT-04),
Zendesk (INT-05). No integration platform route renders a shell any more.

---

## 0. Baseline verification

| Item | Verified |
|---|---|
| Repository | `/Users/macos/Desktop/Gcalls/App/Gcalls-website-app` |
| `git rev-parse --show-toplevel` | same path |
| Branch | `feature/gcalls-website-foundation` |
| Working tree at start | clean |
| Boss Demo tag | `gcalls-website-demo-v1` → commit **`cd4f1d9`** — verified UNMOVED |
| INT-04 Freshdesk | `04cf6e78bd3d761cbef03d090883579cacce2900` — exists |

---

## 1. Baseline — SHELL

`/tich-hop/zendesk/` existed only in `SHELL_ROUTES`, served by the generic
sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD, no lead
CTA, no estimator link. Its sitemap entry carried a placeholder title
(`Tích hợp Gcalls với Zendesk | Kết nối tổng đài và Helpdesk`), `status: 'shell'`,
`priority: 0.7`.

The route was removed from `SHELL_ROUTES` and given a real lazy route; its
`ShellPage` `RELATED` entry was removed. **The integration platform block is now
empty in both files** — Integration Cluster V1 no longer touches the shell.

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
| `IntegrationPlatforms` | **Not used** — a vendor grid on a page that IS a vendor page would compete with Freshdesk instead of routing to it |
| `@/components/helpdesk/visuals` | **Deliberately NOT imported** — see §7 |

Also reused unchanged: `FinalCtaBand`, `FaqAccordion`, `JsonLd`, `Breadcrumb`,
`ProductVisual`, the `primitives` set, `leadCtaHref`, the pre-existing
`helpdesk_integration` LeadSource, and the existing `helpdesk-integration`
estimator slug.

**Not a renamed Freshdesk page.** §1 forbids copying INT-04 text and swapping the
vendor. The approved copy differs (hero value points, problems, benefit 2, use
case 4), every sentence authored here for the shared components is written fresh,
the visual is purpose-built for this page, and the Support Context section uses a
different layout. Shared edits are limited to one route registration, one sitemap
entry, one `ShellPage` deletion and one allow-list entry.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp Zendesk`
- **Title:** `Tổng đài tích hợp Zendesk | Kết nối cuộc gọi với ticket CSKH`
- **Meta:** `Gcalls tích hợp Zendesk giúp đội CSKH kết nối hoạt động nghe gọi với customer context, ticket và lịch sử hỗ trợ theo phạm vi cấu hình.`
- **H1:** `Tổng đài tích hợp Zendesk cho đội CSKH và Support`
- **Canonical:** `https://gcalls.co/tich-hop/zendesk/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of INT-05 scope.

All four verified against the rendered DOM.

The title names **no** withheld capability. INT-02 had to be corrected for exactly
that class of mismatch; title, body and JSON-LD all assert the same four
capabilities.

Legacy canonicals `/gcalls-tich-hop-zendesk/` and `/tong-dai-tich-hop-zendesk/`
are not used.

### Note on the secondary keyword `click to call Zendesk`

Listed in §4, but gate A is **WITHHELD**, so the page does not claim the
capability. The keyword is served **honestly**: FAQ 2 answers the question a
searcher is asking by explaining that the mechanism depends on configuration and
will be scoped in survey. Ranking for a question is not asserting a feature, and
this was deliberately not resolved by publishing an unverified claim.

### Cannibalization

This page owns Zendesk-specific intent only. `tổng đài tích hợp Helpdesk` stays
with `/tong-dai-tich-hop-helpdesk/` — section 13 hands that visitor over.
Freshdesk intent stays on its own route; it appears once, as a routed link, with
no superiority comparison (§21).

---

## 3. Evidence base and the §10 evidence principle

Zendesk is governed by the **Helpdesk** evidence base, materially narrower than
the CRM base used by INT-01/02/03:

| Source | What it evidences for Zendesk |
|---|---|
| `estimator.ts`, solution `helpdesk` | `helpdeskPlatform` names Freshdesk, **Zendesk**, Khác. `helpdeskNeeds` enumerates **exactly two** needs: "Gắn cuộc gọi vào ticket" (LINKING) and "Lịch sử cuộc gọi trong hồ sơ hỗ trợ" |
| `helpdeskIntegration.ts` (S02, locked) | Four conditional capabilities — Call Context, Ticket / Support Record **Connection**, Interaction History, Customer Identification — plus Zendesk as a routed platform, connection scope only, plus an approved support-context **category** list |
| `gcallsPlus.ts` (P01) | Call history and activity data affirmed as a Gcalls capability |
| `qaQcCenter.ts` (P02) | QA runs "từ bản ghi cuộc gọi" — affirms recordings can exist in Gcalls |

**The decisive contrast:** `crmNeeds` enumerates **four** needs and **includes
`click-to-call`**; `helpdeskNeeds` enumerates **two** and includes **no calling
mechanism at all**.

### §10 — the source marks itself "Cần kiểm tra"

§10 states that the current SEO workbook marks this integration **"Cần kiểm tra"**.
The source flags itself as unverified, which is *stronger* grounds for withholding
than INT-04 had for Freshdesk, not weaker. §10 also sets a ceiling: this page must
not claim more than the generic Helpdesk page, the current estimator config, or
verified current product evidence. The locked S02 page publishes four capabilities
and Click-to-Call is not among them, so neither is it here.

Home marketing copy is not an evidence base either — `IntegrationsSection` renders
a "Zendesk ✓" badge and a vendor tile, and S01 already declined recording sync
despite a comparable Home line.

---

## 4. Capability evidence gates — twelve decisions

### A. CLICK-TO-CALL: **WITHHELD**
`helpdeskNeeds` — the same approved config that names Zendesk — enumerates two
needs and Click-to-Call is not one. §11A explicitly forbids inheriting it from the
CRM integrations; in this repository it exists only as a CRM capability, and S03
§13 set the same rule when it withheld Click-to-Call for POS. §28 names it as a
must-not-publish item. Rendered page: **1 occurrence, FAQ 2's question only.**

### B. INCOMING CALL / EMBEDDED CALL BOX: **WITHHELD** (embedded box)
§11B requires the halves be differentiated and not merged:

| Half | Decision |
|---|---|
| Gcalls receives an incoming call | **VERIFIED** — a Gcalls product capability (`gcallsPlus.ts`, the approved call-box surfaces). Depicted and described only as the Gcalls calling layer |
| The call is answered **inside Zendesk** | **WITHHELD** — nothing evidences an embedded Zendesk call box |

§19's clarification requirement is satisfied twice over. The component labels the
block **"GCALLS · LỚP NGHE GỌI"** (the Gcalls calling layer) rather than the
"GCALLS · CUỘC GỌI ĐẾN" string §19 flags, so the distinction is made *at the label
level*; and `layerNote` renders as a caption under **both** places the visual
appears (hero and UI preview): *"Khối 'GCALLS · LỚP NGHE GỌI' là lớp nghe gọi của
Gcalls, không phải call box được nhúng trong Zendesk."* Verified in DOM: 2
occurrences of "call box", both inside that denial.

### C. CUSTOMER CONTEXT / SIDE PANEL: **CONTEXT ONLY**
S02 publishes "Call Context" and "Customer Identification" conditionally; that is
the whole of it. No Zendesk side panel or app-sidebar placement is evidenced, so
none is claimed — rendered page contains **0 occurrences of "iframe" or "side
panel"**. No exact Zendesk field name is published.

### D. TICKET CONNECTION: **VERIFIED & PUBLISHED**, scoped to CONTEXT + LINKING
§11D requires all four sub-capabilities be differentiated:

| Sub-capability | Decision |
|---|---|
| view ticket **context** | PUBLISHED (conditional) — S02 "Call Context" |
| **link** call with ticket | PUBLISHED (conditional) — `helpdeskNeeds` "Gắn cuộc gọi vào ticket"; S02's capability comment states it describes LINKING and deliberately not creating |
| **update** ticket | **WITHHELD** — no evidence of any write |
| **create** ticket | **WITHHELD** — gates E, F |

### E. MANUAL TICKET CREATION: **WITHHELD**
No approved source evidences Gcalls creating a Zendesk ticket. `helpdeskNeeds`
offers no creation option.

### F. AUTOMATIC TICKET CREATION: **WITHHELD**
The strongest historical claim with the least support. S02's own gate closed it
NEGATIVE and the S02 claim guard names "tự động tạo ticket" as a forbidden
universal behaviour. **Nothing on the page implies any call creates a ticket** —
the only mention is FAQ 4's question, answered conservatively. The visual marks the
support record `Đã liên kết`, never `Đã tạo`.

### G. UNKNOWN-CALLER CONTACT CREATION: **WITHHELD**
No approved source evidences Gcalls writing a new contact into Zendesk. Not
published in any form, including as a workflow step.

### H. CALL ACTIVITY / HISTORY — two decisions, never merged

| | Decision |
|---|---|
| **GCALLS CALL HISTORY** | **VERIFIED & PUBLISHED**. `gcallsPlus.ts` FAQ (approved) affirms it: "Gcalls Plus hỗ trợ theo dõi lịch sử và dữ liệu hoạt động cuộc gọi" |
| **ZENDESK HISTORY SYNC** | **CONDITIONAL ONLY**. `helpdeskNeeds` offers "Lịch sử cuộc gọi trong hồ sơ hỗ trợ" and S02 publishes "Interaction History" conditionally — published, but never automatic, complete or field-guaranteed |

§11H is explicit that storing a call in Gcalls is not proof it is written into
Zendesk. Capability card 03 carries both halves in its own wording; FAQ 5 makes
storage location a survey item. Do not collapse them.

### I. RECORDING — two decisions, never merged

| | Decision |
|---|---|
| **RECORDING IN GCALLS** | **VERIFIED & PUBLISHED**, conditional register. `qaQcCenter.ts` (approved) runs QA "từ bản ghi cuộc gọi". Stated **only** in FAQ 6, not as a Zendesk-integration capability |
| **RECORDING SYNC TO ZENDESK** | **WITHHELD**. S02's gate closed this NEGATIVE; S01, INT-02, INT-03 and INT-04 agree |

Rendered page: **1 occurrence of "Ghi âm", FAQ 6's question only.** No recording
player appears in any visual.

### J. TAGS / DISPOSITIONS / STATUS UPDATE: **WITHHELD**
**VERIFIED FIELDS: none.** Nothing evidences Gcalls writing a tag, disposition or
ticket status into Zendesk.

**Distinction made explicit, not blurred:** "Trạng thái hỗ trợ" appears in the §15
categories as something an agent may **READ** — which is what S02 already approved.
Reading a status is not updating it. The support-context scope note says so in
words (*"không bao gồm việc Gcalls cập nhật trạng thái hay tag trên ticket"*), and
the visual draws status as a read-only row with **no control, chip or selector**.

### Partnership / Zendesk certification / marketplace / SLA: **NOT PUBLISHED**
### Plan coverage: **NOT PUBLISHED**
### Setup instructions as universal: **NOT PUBLISHED**

No evidence exists for any;
`docs/CHECKPOINT_S02_HELPDESK_INTEGRATION.md` records the same finding for Zendesk.
Setup step 5 says "phương thức kết nối hiện hành" and names no app, extension or
API version.

---

## 5. Published capabilities — the four §12 baseline items, in §12's order

| # | Card | Gate |
|---|---|---|
| 01 | Customer Context | C — CONTEXT ONLY, with permission/config hedge |
| 02 | Ticket / Support Record Context | D — context + linking to an **existing** record |
| 03 | Call Activity | H — carries the Gcalls-verified / Zendesk-conditional split |
| 04 | Support Workflow Continuity | §12 baseline, written on the handover angle |

Click-to-Call, embedded call box, ticket creation (manual or automatic),
unknown-caller contact creation and status/tag writes have **no card**.

`featureList` in the `SoftwareApplication` node carries exactly these four titles.

---

## 6. Section inventory — 19 rendered content sections

Hero · Direct Answer · Business Problems · Overview + Core Flow · Core
Capabilities (4) · Workflow (6) · Before/After · Support Context (6 categories +
scope note) · Benefits (4) · Use Cases (4) · Setup (9) + scope note · UI Preview ·
Zendesk vs Generic Helpdesk · Other Helpdesk Platforms · Product Boundaries (5) ·
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
| Fake Zendesk UI | **0** |
| Fake branded ticket screen | **0** |
| Zendesk logo / wordmark / brand colour | **0** |
| Screenshot used as partnership proof | **0** |
| Real PII | **0** |
| Price / metric / score / percentage in any visual | **0** |

**§19 priority resolution.** Priority 1 (a current approved Zendesk screenshot)
does not exist here, and §19 also requires verifying that any such screenshot
reflects *current* behaviour — impossible here. Priority 2 (a real/sanitized
Gcalls-side integration screenshot) does not exist either. So **priority 3**
applies.

**A new visual was built rather than reusing the Helpdesk pair.** INT-04 reused
both `@/components/helpdesk/visuals` mockups for Freshdesk. Doing the same again
would make this page read as INT-04 with the vendor renamed, which §1 forbids. So
`src/components/zendesk/visuals.tsx` (`DEMO_VISUAL_REPLACE_LATER`, single swap
point) holds one purpose-built panel, `SupportHandoverMockup`, depicting the angle
that is genuinely Zendesk's on this brief: **handover continuity** — §3 names loss
of conversation context on ownership change as a core pain, and §17 use case 4 is
an enterprise workflow where several agents work one request.

What it depicts, and what it deliberately does not:

- `GCALLS · LỚP NGHE GỌI` as a **separate labelled block**, never drawn inside the
  support record (gate B).
- `Lớp tích hợp Gcalls` connector → an **already existing** `HỒ SƠ HỖ TRỢ` marked
  `Đã liên kết` (gate D). Never `Đã tạo` (gates E, F).
- Context rows including `Trạng thái hỗ trợ` as **read-only text** — no control,
  chip or selector (gate J).
- `BỐI CẢNH KHI CHUYỂN NGƯỜI PHỤ TRÁCH` with role labels `Agent 02` / `Agent 07`
  and interaction **categories**, plus a visible `Theo cấu hình tích hợp` qualifier
  (gate H, conditional).
- **No** recording player (gate I), **no** SMS control, **no** embedded call box,
  **no** timestamp, duration, count or score.
- PII masked throughout: customer `KH #4192`, agents as role labels. The only
  email or phone anywhere on the page is Gcalls' own footer contact.

---

## 8. Claim guard — clean

| Scan (rendered DOM) | Result |
|---|---|
| "Click-to-Call" | 1 — FAQ 2 **question** only |
| "Ghi âm" / "bản ghi" | 1 — FAQ 6 **question** only |
| "tạo ticket" | 1 — FAQ 4 **question** only |
| "call box" | 2 — both inside the gate-B **denial** caption |
| "cập nhật trạng thái" / "gắn tag" | 1 — inside the gate-J **denial** in the scope note |
| "SMS" | **0** |
| "popup" | **0** |
| "iframe" / "side panel" | **0** |
| Any `%` figure | **0** |
| Currency / price token | **0** |
| `đối tác chính thức` / `chứng nhận` / `certified` / `marketplace` / `partner` / `SLA` | **0** |
| `vài phút` / `tức thì` / `100%` / `real-time guaranteed` / `toàn bộ trường` | **0** |
| **Unsupported numeric claims** | **0** |

Setup is 9 steps with **no duration** on any step or in total.

**Scanned false positive, deliberately kept:** `mọi gói` matches the guard regex,
but its only occurrence is the setup note *denying* the claim — `Gcalls không mặc
định mọi gói Zendesk đều hỗ trợ cùng một phạm vi tích hợp` — which §18 requires.

---

## 9. CTA architecture — all real-click tested

| CTA | Intent | Result |
|---|---|---|
| Hero primary — `Xem demo tích hợp Zendesk` | `demo` | **PASS** |
| Hero secondary — `Xem workflow tích hợp` | anchor `#workflow-zendesk` | **PASS** (hash set, target top = 96px below the sticky header, scrollY 5661) |
| Final band primary — `Xem demo tích hợp Zendesk` | `demo` | **PASS** |
| Final band secondary — `Tư vấn tích hợp` | `consultation` | **PASS** |
| Trust — `Trao đổi về workflow Zendesk hiện tại` | `consultation` | **PASS** |
| Generic Helpdesk — `Xem giải pháp Tổng đài tích hợp Helpdesk` | route | **PASS** |
| Freshdesk link | route | **PASS** |
| Estimator — `Ước tính cấu hình & chi phí` | `?product=helpdesk-integration` | **PASS** (see §10) |

All use the shared `LeadForm` via `leadCtaHref`. No page-local form or submit
logic. **0 dead CTAs.**

### LeadSource

`source: 'helpdesk_integration'` — a pre-existing typed member — with
`solution: 'Tích hợp Helpdesk'` (an approved `LEAD_NEEDS` value). Most specific
valid combination already supported; no shared type changed.

### Zendesk context retained at the destination — VERIFIED VISIBLY

`Zendesk` was added to the `PRODUCT_DISPLAY_LABELS` allow-list in
`src/lib/leads/ctaLink.ts`. Browser-verified on `/lien-he/`:

| Input | Rendered | Need pre-selected |
|---|---|---|
| `intent=demo&product=Zendesk` | `Quan tâm: Zendesk` | `Tích hợp Helpdesk` |
| `intent=consultation&product=Zendesk` | `Quan tâm: Zendesk` | `Tích hợp Helpdesk` |
| `product=junk zendesk free text` | *(nothing rendered)* | — |
| `product=<em>spoof</em>` | *(nothing rendered)* | — |

`intent=demo` survives to the form. Junk and injection-shaped `?product=` values
render nothing — the allow-list holds.

---

## 10. Cost estimator (§26)

**No Zendesk-specific estimator product was invented.** The page reuses the
existing generic slug `helpdesk-integration`, already in `PRODUCT_SLUG_ALIASES`
(`src/components/estimator/Estimator.tsx`) where it maps to the `helpdesk`
solution. A `zendesk` key would resolve to no solution and drop the visitor on the
generic "choose a solution" step.

**Verified in the browser** at `/uoc-tinh-chi-phi/?product=helpdesk-integration`:
of the 7 solution cards, exactly **one** carries `aria-checked="true"` —
`Tích hợp Helpdesk` — and the other six are `false`.

Zendesk-specific context is preserved **separately** on the LeadForm via the two
lead contexts, so nothing is lost.

---

## 11. Internal links — contextual, no dump

`/tong-dai-tich-hop-helpdesk/` · `/tich-hop/` · `/tich-hop/freshdesk/` ·
`/gcalls-plus-webphone/` · `/gcalls-cx/` · `/qc-bot-ai/` · `/nganh/bpo/` ·
`/nganh/thuong-mai-dien-tu/` · `/bang-gia/` · `/uoc-tinh-chi-phi/` · `/blog/` ·
`/lien-he/`
— **all 12 required destinations present**, plus the hotline `tel:`.

19 in-content links total. Each sits where it is contextually earned (generic
Helpdesk in §13 and §15, Freshdesk/hub in §14, Gcalls Plus / Gcalls CX / QA QC
Center in §15, estimator and pricing in Trust, Gcalls CX again in FAQ 7). The two
industry links are earned rather than dumped: BPO / support centre is a §3 persona,
and the §17 SaaS and enterprise-service use cases map onto those pages.

**Broken links: 0** — every destination resolved with 1 H1 and none rendered the
404 page.

---

## 12. Responsive QA — actual rendered

Measured in real viewports (same-origin iframes at exact widths; the macOS Chrome
window floors at ~514px, so window resizing alone cannot reach 390).

| Width | Page-level overflow | Element-level offenders | H1 | Core flow cols | Workflow cols | Context cols |
|---|---|---|---|---|---|---|
| 390 | **0** | **0** | 1 | 1 | 1 | 1 |
| 430 | **0** | **0** | 1 | 1 | 1 | 1 |
| 768 | **0** | **0** | 1 | 1 | 2 | 2 |
| 1024 | **0** | **0** | 1 | 4 | 3 | 2 |
| 1440 | **0** | **0** | 1 | 4 | 3 | 2 |

Workflow readable at every width. Support visual readable (350–360px). FAQ
readable — accordion triggers measure 56px tall and span the full content column
(348 → 766px).

**CTA tap targets:** all 19 in-content links ≥ 44px. **Zero** sub-44 elements of
any kind — the visual contains no interactive controls.

The two shared-component issues documented at INT-02 §9
(`ProductVisualWithSupport` heading overlap, `CallTimelineMockup` hotline clip) do
**not** affect this page — it uses neither. Both remain open.

---

## 13. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** — 0 errors (6 pre-existing `react-refresh` warnings in vendor `src/app/components/ui/*`, untouched) |
| `npm run build` | **PASS** (`ZendeskIntegrationPage` chunk 30.50 kB / 8.48 kB gzip) |
| 1 H1 | PASS |
| 0 broken links | PASS |
| 0 dead CTA | PASS |
| 0 fake Zendesk UI | PASS |
| 0 fake price | PASS |
| 0 unsupported numeric claims | PASS |
| 0 real PII | PASS |

---

## 14. Regression

No content rewritten on HubSpot, Salesforce, Zoho CRM, Freshdesk, generic CRM
Integration, generic Helpdesk Integration, POS, International, Gcalls Plus, QA QC
Center, Gcalls CX, Pricing, Estimator, Home or any hub page.

Verified intact by real click-through after all changes (1 H1, no 404): Zendesk,
Freshdesk, HubSpot, Salesforce, Zoho CRM, generic Helpdesk, generic CRM, POS,
International, Gcalls Plus, Gcalls CX, QA QC Center, Pricing, Estimator, Blog, both
industry pages, Home.

Shared files touched, and why:

| File | Change |
|---|---|
| `src/app/router.tsx` | Registered the real page; emptied the integration block of `SHELL_ROUTES` |
| `src/config/sitemap.ts` | INT-05 title/meta lock; `shell` → `complete`, priority 0.7 → 0.8 |
| `src/pages/ShellPage.tsx` | Removed the last integration `RELATED` entry |
| `src/lib/leads/ctaLink.ts` | Added `Zendesk` to the `PRODUCT_DISPLAY_LABELS` allow-list |

New files:

- `src/data/zendeskIntegration.ts` (locked copy + twelve gate decisions + JSON-LD)
- `src/pages/ZendeskIntegrationPage.tsx`
- `src/components/zendesk/visuals.tsx` (one purpose-built unbranded visual)
- `docs/CHECKPOINT_INT05_ZENDESK.md`

Boss Demo V1 remains frozen: tag `gcalls-website-demo-v1` → `cd4f1d9`, verified
unmoved. **Industries not started.**

---

## 15. Open evidence questions

Every one is WITHHELD or conditional, **not denied**. §10 records that the source
workbook itself marks this integration "Cần kiểm tra", so this list is the concrete
form of that check.

1. **Click-to-Call in Zendesk.** Does the current product support starting a call
   from a Zendesk contact or ticket, and by what mechanism? Highest-value question
   here — it is a listed keyword and historical material described it.
2. **Embedded call box.** Can an agent answer a call inside the Zendesk interface,
   or only in the Gcalls surface? The two must stay distinguished.
3. **Customer context surface.** Does a Gcalls panel render in Zendesk (app
   sidebar or otherwise)? If so, which fields does it show?
4. **Ticket write operations.** Can Gcalls create a ticket (manually or per call),
   and can it update one? Creation, update and linking must stay distinguished.
5. **Unknown-caller contact creation.** Can Gcalls create a Zendesk user/contact
   from an unrecognised number?
6. **Zendesk history sync scope.** Which call fields can be written into Zendesk,
   and where do they land (ticket comment, internal note, custom field, event)?
7. **Recording sync.** Can a recording, or a link to one, be attached to a Zendesk
   ticket? Creation vs linking must be distinguished.
8. **Tags / dispositions / status.** Can Gcalls write any of these? Currently
   VERIFIED FIELDS: none.
9. **Connection mechanism.** Which app, integration or API is current? Setup step 5
   stays deliberately vague until this is answered.
10. **Plan coverage.** Which Zendesk plans support the integration?
11. **Partnership status.** Is Gcalls a Zendesk marketplace listing or partner in
    any formal sense? Must be reported before publishing.
12. **Real UI evidence.** A PII-masked screenshot verified as current behaviour
    would replace the conceptual visual and let §19 priority 1 apply.
13. **Shared visual components.** The two items from INT-02 §9 still need a
    shared-component fix that also re-verifies the locked pages.

### Cluster-level note

Click-to-Call is now **published on the three CRM platform pages and withheld on
both Helpdesk platform pages**, entirely because `crmNeeds` enumerates it and
`helpdeskNeeds` does not. If the product team confirms Helpdesk-side Click-to-Call,
INT-04 and INT-05 should be revisited **together** so the two stay consistent.

---

## 16. Status

**CONTENT LOCKED V1.**

Copy in `src/data/zendeskIntegration.ts` is locked; the file header carries the
claim guard, the §10 evidence principle and all twelve gate decisions with their
reasoning, including the Helpdesk-vs-CRM contrast that explains why this page is
narrower than INT-01/02/03. Do not reword, and do not add capabilities, ticket
behaviours, fields, plans or benefits that are not there.

**Integration Cluster V1 is complete.** Industries not started.
