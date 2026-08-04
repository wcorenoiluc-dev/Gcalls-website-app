# Checkpoint INT-01 — HubSpot Integration

**Route:** `/tich-hop/hubspot/`
**Type:** Platform integration page (BOFU, Commercial Investigation)
**Status:** CONTENT LOCKED V1

---

## 0. Recovery record

This checkpoint was completed across two runs; the first was interrupted by a
network failure. Nothing was rebuilt from scratch and no work was discarded.

**State recovered at the start of run 2:**

| Item | State found | Action |
|---|---|---|
| `src/data/hubspotIntegration.ts` | PRESENT, 626 lines, structurally valid | Kept as-is |
| `src/pages/HubspotIntegrationPage.tsx` | PRESENT, 447 lines | Kept as-is |
| `src/components/hubspot/visuals.tsx` | PRESENT, 96 lines | Kept as-is |
| Router registration | DONE | Verified |
| Sitemap metadata | DONE | Verified |
| JSON-LD | DONE | Verified |
| `LeadForm` need-fallback wiring | DONE | Verified, then extended (§9) |
| `docs/CHECKPOINT_INT01_HUBSPOT.md` | NOT STARTED | Written in run 2 |
| Responsive / functional / SEO QA | NOT RUN | Run in run 2 |

The interrupted run had progressed further than its last visible message
suggested — the page component and visuals already existed. The content file was
audited for truncation, unbalanced braces, unfinished strings, duplicated
sections, placeholder markers and foreign-project content: **none found**. It was
therefore not rewritten.

**Interruption point:** after the implementation layer, before documentation
and QA.

Boss Demo V1 remains frozen: tag `gcalls-website-demo-v1` → `cd4f1d9`, verified
unmoved.

---

## 1. Baseline

**SHELL.** `/tich-hop/hubspot/` existed only in `SHELL_ROUTES`, served by the
generic sitemap-driven `RouteShell`. No page component, no data file, no JSON-LD,
no lead CTA, no HubSpot visual.

The route was removed from `SHELL_ROUTES` and given a real lazy route. Its
`ShellPage` `RELATED` entry was removed for the same reason — it is no longer a
shell. Salesforce and Zoho CRM keep their entries and still link back here
(verified by real click).

### Integration Kit reused — YES (nothing modified, nothing cloned)

| Component | Reused |
|---|---|
| `IntegrationHero` | Yes |
| `IntegrationProblems` | Yes |
| `IntegrationWorkflow` | Yes |
| `IntegrationSteps` | Yes |
| `IntegrationUseCases` | Yes |
| `IntegrationBeforeAfter` | **Not used** |
| `IntegrationBoundaries` | **Not used** |
| `IntegrationPlatforms` | **Not used** |

`IntegrationPlatforms` is deliberately absent: a vendor grid on a page that IS a
vendor page would compete with Salesforce and Zoho instead of routing to them.
Section 12 (Related integrations) does the routing job with no comparison claim.

---

## 2. SEO ownership

- **Primary keyword:** `tổng đài tích hợp HubSpot`
- **Title:** `Tổng đài tích hợp HubSpot | Click-to-Call & dữ liệu cuộc gọi | Gcalls`
- **Meta:** `Gcalls tích hợp HubSpot giúp đội Sales và CSKH gọi từ CRM, nhận biết khách hàng khi có cuộc gọi và ghi nhận lịch sử tương tác theo cấu hình.`
- **H1:** `Tổng đài Gcalls tích hợp HubSpot – đưa cuộc gọi vào quy trình CRM`
- **Canonical:** `https://gcalls.co/tich-hop/hubspot/`
- **Robots:** `noindex, nofollow` in preview; route is `indexable: true`, so it
  becomes `index, follow` when the site-wide `ALLOW_INDEXING` launch flag is
  enabled. Global flag, out of INT-01 scope.

All four values verified against the rendered DOM, not the source.

### Cannibalization

This page owns HubSpot-specific intent only. Generic CRM intent
(`tổng đài tích hợp CRM`) stays with `/tong-dai-tich-hop-crm/`, which remains a
separate page — section 11 exists to hand that visitor over rather than keep
them. Salesforce and Zoho intent stays on their own routes; they appear once
each, as routed links, never as comparison claims.

---

## 3. Verified capabilities — exactly four

| # | Capability | Evidence |
|---|---|---|
| 01 | Click-to-Call | `estimator.ts` `crmNeeds`; `crmIntegration.ts` (S01) |
| 02 | Incoming Call / Call Box | S01 customer-popup surface; `product-ui` call box |
| 03 | Customer Context | `estimator.ts` `crmNeeds`; S01 Customer Popup |
| 04 | Call Activity / History | `estimator.ts` `crmNeeds`; S01 Interaction History Sync |

Every description defers to configuration (`theo cấu hình`, `khi tích hợp được
cấu hình`, `theo phạm vi tích hợp`), so no capability reads as guaranteed on
every HubSpot account. `featureList` in the `SoftwareApplication` node carries
exactly these four, so the structured data cannot assert more than the visible
page.

---

## 4. Evidence gates — both closed NEGATIVE

### CLICK-TO-SMS: **WITHHELD**

Historical Gcalls material mentions Click-to-SMS inside the HubSpot integration.
That material is not present in this repository and could not be verified here.
The only SMS evidence in the project belongs to a **different product** — Gcalls
CX, where SMS is one of five omnichannel channels. Inheriting a Gcalls CX channel
into a CRM integration page is exactly the cross-product inheritance S03 forbade
for POS. Decisively: the approved `crmNeeds` field enumerates four needs and SMS
is not one of them.

Rendered page contains **0 occurrences of "SMS"** (verified in DOM).

### HUBSPOT TICKET CREATION: **WITHHELD**

No HubSpot ticket evidence exists in this repository. The analogous gate was
already resolved NEGATIVE at S02 for Helpdesk on *stronger* evidence: there the
estimator literally offers "Gắn cuộc gọi vào ticket", and S02 still judged that
to be LINKING to an existing ticket, never CREATION. Here `crmNeeds` offers no
ticket option at all. Ticket/support workflow is owned by
`/tong-dai-tich-hop-helpdesk/` under the standing boundary rules.

No ticket capability card is rendered. The single ticket mention on the page is
FAQ 5, which uses conservative conditional wording and routes to Helpdesk. **The
page nowhere implies that every call automatically creates a ticket.**

### Partnership / certification / plan coverage: **NOT PUBLISHED**

No partner status, marketplace listing, certification or plan-tier evidence
exists anywhere in this repository. Naming HubSpot asserts connection experience
only, exactly as S01 established.

---

## 5. Section inventory — 15 rendered sections

Hero · Direct Answer · Business Problems · Overview · Verified Capabilities ·
Workflow · Benefits · Use Cases · Setup · UI Preview · HubSpot vs Generic CRM ·
Related Integrations · Trust · FAQ (7) · Final CTA — plus an onward-links row.

The brief's items 6 and 7 (Click-to-SMS, Ticket Creation) are **evidence
decisions, not sections**; both resolved WITHHELD, so neither renders. No
section was duplicated as a result of the interruption.

---

## 6. Visual evidence

`DEMO_VISUAL_REPLACE_LATER` — `src/components/hubspot/visuals.tsx` is the single
swap point.

- **Fake HubSpot UI: 0.** The hero panel is labelled generically `CRM RECORD`
  and carries no HubSpot logo, wordmark, brand colour, navigation or typography.
- The UI Preview section uses only approved Gcalls-side surfaces
  (`CustomerPopupMockup`, `CallTimelineMockup`) from `@/components/product-ui`.
- A visible note under the preview states these are Gcalls-side illustrations
  with sample data and **not HubSpot screenshots**.
- **PII: 0.** Masked identifier (`KH #2148`), fictional company, phone masked to
  its last two digits (`••• ••• •48`) — not dialable.
- No metric, score, count, percentage or price appears in any visual.

---

## 7. Claim guard — clean

Verified absent from the rendered page: 25–30% / 30–50% productivity, 100%
synchronization, zero manual work, setup in minutes or any fixed setup duration,
official HubSpot partner, HubSpot certification, all HubSpot plans supported, all
fields synchronized.

**Unsupported numeric claims: 0.** No percentage appears anywhere on the page.
Setup is described in 8 steps with **no duration attached to any step or in
total**; the note explains scope depends on hotline, users, permissions and
capabilities. Step 4 says "phương thức kết nối hiện hành" rather than naming a
credential type, because nothing here evidences which mechanism is current.

---

## 8. CTA architecture

| CTA | Intent | Result |
|---|---|---|
| Hero primary — `Xem demo tích hợp HubSpot` | `demo` | PASS |
| Hero secondary — `Xem cách hoạt động` | anchor `#workflow-hubspot` | PASS |
| Final band primary — `Xem demo tích hợp HubSpot` | `demo` | PASS |
| Final band secondary — `Tư vấn tích hợp` | `consultation` | PASS |
| Trust — `Trao đổi về workflow HubSpot hiện tại` | `consultation` | PASS |

All use the shared `LeadForm` via `leadCtaHref`. No page-local form or submit
logic. **0 dead CTAs.**

No HubSpot-specific `LeadSource` exists in the shared model and INT-01 forbids
inventing incompatible strings, so the closest typed member `crm_integration` is
used, with the platform carried in `product: 'HubSpot'`.

---

## 9. Destination context — gap found and fixed

INT-01 §10 requires the destination to **visibly** retain HubSpot context. On
first test it did not: the URL carried `product=HubSpot` and the form
pre-selected "Tích hợp CRM", but the word HubSpot appeared **nowhere** on
`/lien-he/`. The visitor got a generic form.

Fixed by rendering a confirmation line — `Quan tâm: HubSpot` — in the shared
`LeadForm`.

**Security note.** `product` is a free-form URL value (it has to be — pricing
passes plan names through it). Rendering it raw would let a crafted link put
attacker-chosen text on a gcalls.co page. React escapes markup, so this is
content spoofing rather than XSS, but it is not shippable either. Display is
therefore gated on an allow-list, `PRODUCT_DISPLAY_LABELS`, applied **at the
render site only** — `parseLeadCtaContext` is unchanged, so which products
prefill the form and reach analytics is exactly as before.

Verified in the browser:

| Input | Rendered |
|---|---|
| `product=HubSpot` | `Quan tâm: HubSpot` |
| `product=CRM Integration` | *(suppressed — duplicates the pre-selected need)* |
| `product=Gcalls Plus Webphone` | *(suppressed — duplicate)* |
| `product=Startup` | `Quan tâm: Gói Startup` |
| `product=totally made up text` | *(nothing rendered)* |

Allow-list values are the visitor-facing label, so English internal names like
`CRM Integration` map to their approved Vietnamese label. That mapping also makes
them equal the pre-selected "Nhu cầu", so those pages render nothing rather than
the same words twice — **the only page that gains a visible chip is HubSpot**,
which keeps regression on locked pages at zero.

---

## 10. Internal links — contextual, no link dump

`/tong-dai-tich-hop-crm/` · `/tich-hop/` · `/tich-hop/salesforce/` ·
`/tich-hop/zoho-crm/` · `/gcalls-plus-webphone/` · `/gcalls-cx/` · `/bang-gia/` ·
`/uoc-tinh-chi-phi/` · `/blog/` · `/lien-he/` — all 11 required destinations
present, plus the hotline `tel:`.

The CRM solution page, integration hub, Salesforce and Zoho are linked from their
own dedicated sections, so the onward row carries only the remaining
destinations rather than repeating them.

**Broken links: 0** — every destination resolved and none rendered the 404 page.

---

## 11. Responsive QA — actual rendered

Measured in real viewports (same-origin iframes at exact widths; the macOS Chrome
window floors at ~514px, so window resizing alone could not reach 390).

| Width | Page-level overflow | H1 |
|---|---|---|
| 390 | 0 | 1 |
| 430 | 0 | 1 |
| 768 | 0 | 1 |
| 1024 | 0 | 1 |
| 1440 | 0 | 1 |

Workflow readable at every width (1 / 2 / 3 columns). UI preview readable.

**CTA tap targets:** all 20 real navigational CTAs measure ≥ 44px (minimum
exactly 44). The three sub-44 elements are decorative `<button>`s *inside* the
demo mockup (`Ghi chú`, `Gắn tag`, `Xem hồ sơ`) — illustration, not navigation.

### Known pre-existing item (NOT an INT-01 defect)

At 390 and 1024 the shared `CallTimelineMockup` hotline row overflows its own
`overflow-hidden` container by ~6px, clipping the second hotline pill. Confirmed
identical on **Home** and the approved **CRM Integration** page at the same
widths, so it predates this work and belongs to the shared component. Page-level
overflow remains 0. Not touched here — §16 forbids modifying locked shared
surfaces. **Flagged for a future shared-component fix.**

---

## 12. Technical QA

| Check | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — 0 errors (6 pre-existing `react-refresh` warnings in vendor `src/app/components/ui/*`, untouched) |
| `npm run build` | PASS |

Re-run after the §9 fix; all three still pass.

---

## 13. Regression

No content rewritten on Home, Product Hub, Solution Hub, Integration Hub,
Industry Hub, Resource Hub, Company Hub, Gcalls Plus, QA QC Center, Gcalls CX,
CRM, Helpdesk, POS or International.

Shared files touched, and why:

| File | Change |
|---|---|
| `src/app/router.tsx` | Registered the real page; removed the route from `SHELL_ROUTES` |
| `src/config/sitemap.ts` | INT-01 title/meta lock; `shell` → `complete`, priority 0.8 |
| `src/pages/ShellPage.tsx` | Removed the now-unused `RELATED` entry |
| `src/components/lead/LeadForm.tsx` | Need fallback (`product` → `solution`); destination context line |
| `src/lib/leads/ctaLink.ts` | `displayableLeadProduct` allow-list |
| `src/pages/ContactPage.tsx` | Doc comment corrected — it claimed `product` was allow-list validated on parse, which was not true |

CRM Integration page verified intact by real click-through after the changes.

---

## 14. Open evidence questions

Carry into any future HubSpot revision — each is currently WITHHELD, not denied:

1. **Click-to-SMS.** Does the shipped HubSpot integration support it? Needs
   current product/support evidence, not historical marketing copy.
2. **Ticket creation/update.** Is there any supported HubSpot ticket flow, and
   is it creation or linking? Must not be published as automatic.
3. **Plan coverage.** Which HubSpot tiers/subscriptions are supported?
4. **Connection mechanism.** Which auth/connection method is current? Step 4 is
   deliberately vague until this is answered.
5. **Partnership status.** Is Gcalls listed in the HubSpot marketplace or a
   partner in any formal sense? Must be reported before publishing.
6. **Real UI evidence.** A PII-masked screenshot of the Gcalls extension running
   inside HubSpot would replace the conceptual visual.

---

## 15. Status

**CONTENT LOCKED V1.**

Copy in `src/data/hubspotIntegration.ts` is locked; the file header carries the
claim guard and both evidence gates. Do not reword, and do not add capabilities,
synced fields, plans or benefits that are not there.

Salesforce and Zoho CRM remain shells — **not** started here.
