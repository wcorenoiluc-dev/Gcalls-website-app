# Checkpoint WEB-COMPANY-001 — Customers and Partners

The last two shells on the site left the sitemap-driven shell:
`/cong-ty/khach-hang/` and `/cong-ty/doi-tac/`. Resumes from WEB-RES-001
(`f6a2fd5`).

Nothing was deployed, published or pushed.

Three pieces of work:

1. The two company pages.
2. A central fix for fragment navigation, which WEB-RES-001 left open.
3. The WEB-RES-001 claim-register corrections — recorded in
   `docs/CHECKPOINT_RES01_RESOURCES.md`, with the Auto Dialer wording change
   applied to the live copy in `src/data/resources/glossary.ts`.

---

## 1. The pages that publish nobody

Both pages are the ones a marketing site normally fills with logos. This
repository holds no permission record for any customer or partner name, so
neither page publishes one — no name, no mark, no text-only stand-in, no quote,
no metric, no anonymised story specific enough to identify anyone.

What replaces the customer wall is the thing a visitor actually wants from it:
**operational profiles**. Five models describing how a team works — outbound
telesales, outbound customer care, teams already on CRM or Helpdesk, teams
serving international markets, large operations exploring automation. A visitor
can match themselves against those; they cannot match themselves against a grid
of marks. And profiles require nobody's consent.

The partners page is a **framework**, not a directory: prospective relationship
categories, collaboration models each carrying its own availability condition,
nine assessment criteria, and the onboarding sequence — ending at "công bố nếu
hai bên đồng ý", which is the only step that would ever put a name on the page.

### The claim this page exists to avoid

Gcalls integrates with HubSpot, Salesforce, Zoho CRM, Freshdesk and Zendesk, and
each has a completed integration page here. That is a technical fact and
establishes no commercial relationship. A partners page listing platforms it
merely integrates with is the most common way that claim gets fabricated, so the
page carries a section saying so in as many words, and the FAQ answers the
question directly.

Four phrases appear on the page and are all inside denials — verified by
extracting the surrounding sentence for every occurrence: "đối tác chính thức",
"đối tác được chứng nhận", "ủy quyền", "tương thích với mọi". Zero affirmative
partner-status claims.

### Typed permission gate

`ApprovedLogo` in `src/data/company/types.ts` requires a legal name, a
repository-relative asset path and a permission record. It is empty everywhere,
and `CompanyStatusSection` renders nothing at all when it is — no frame, no grey
box, no empty carousel. The gate is in the type rather than in a convention, so
a future logo wall cannot be populated without both halves of the permission.

---

## 2. Fragment navigation — root cause and fix

`src/components/common/Seo.tsx`. `ScrollToTop` became `ScrollManager`.

**Root cause, two parts.** Every route is lazy, so on a direct load of
`/tai-nguyen/glossary/#webphone` the browser's native fragment scroll runs
against a document that does not contain the target yet. The old
`ScrollToTop` then fired `window.scrollTo(0, 0)` on every pathname change,
overriding anything the browser had managed and ignoring `hash` entirely.

**Fix.** Two render-aware mechanisms, no timeouts as the primary path:

1. A `MutationObserver` waits for the target to exist. It fires on the frame the
   lazy chunk commits. A 4s timer only stops it from living forever on a hash
   naming an element that will never exist.
2. The scroll is applied **synchronously** the moment the target exists, then
   corrected over a bounded `requestAnimationFrame` loop until it holds
   position.

The offset prefers the target's own `scroll-margin-top` — `scroll-mt-24` already
encodes the answer across the site — and falls back to the measured header
height plus a gap, so an anchor cannot land under the header just because
someone forgot the class.

### Two things this got wrong first, recorded because they are not obvious

**Smooth scrolling does not survive a route commit.** The first version used
`behavior: 'smooth'` when the target was already present. Instrumenting
`window.scrollTo` showed exactly one call, with a correct measured target, and
zero movement — the browser drops the animation when the scroll is issued during
the commit that replaced the document. All scrolling is now instant, which is
also the honest answer for `prefers-reduced-motion`: the preference is satisfied
unconditionally rather than by branching on a media query.

**A frames-only design silently does nothing in a hidden tab.** The second
version moved everything into the `rAF` correction loop. `requestAnimationFrame`
does not fire in a backgrounded tab, so the loop never ran and the fix appeared
to fail completely. Hence the ordering: the synchronous pass is what has to
work, and the frames only clean up after late layout shifts.

### Verified

| Case | Result |
|---|---|
| Direct load `/tai-nguyen/glossary/#webphone` | target at 96px, clear of the 65px header |
| Direct load `/tai-nguyen/faq/#tich-hop` | 96px |
| Direct load `/tai-nguyen/case-studies/#tieu-chuan-bang-chung` | 96px |
| Cross-route `<Link>` with hash, cold chunk | 96px |
| Cross-route `<Link>` with hash, warm chunk | 96px |
| Cross-route to `/tai-nguyen/faq/#voicebot-ai-qc`, `/tai-nguyen/glossary/#sla` | 96px |
| Company anchors at 390px | 96px, clear of header |
| Same-page `<a href="#id">` click | 96px, native, unchanged |
| Unknown hash | stays at top, no error |
| No hash | scrolls to top, unchanged |

Same-page anchor clicks are deliberately not handled by `ScrollManager`: they do
not change the router location, so the effect never runs for them and cannot
fight the browser's native scroll.

The stale comment in `src/data/voicebotAi.ts` that justified a design decision
with "a hash link inside this SPA does not scroll on its own" was corrected —
the decision stands, the reason no longer does.

---

## 3. Architecture

```
src/data/company/types.ts     shared shapes + permission guard + claim guard
src/data/company/index.ts     registry + JSON-LD builders
src/data/company/*.ts         two content files
src/components/company/       sections.tsx (shared) · bodies.tsx (page-specific)
src/pages/                    CustomersPage.tsx · PartnersPage.tsx, route-level lazy
```

`CompanyPageBase` fixes hero, purpose and audience, the trailing routing
section, the honest state block, the FAQ and the CTA. `CompanyPageLayout`
renders them in order around each page's own body, plus an `afterStatus` slot
that lets Partners place its clarification directly after the directory status
it explains.

No new dependency. Navigation and footer were untouched — both routes were
already linked from the footer and the company hub.

---

## 4. Shell status

`SHELL_ROUTES` is now empty. Every public content route on this site has a real
page: Integrations (INT-01…05), Industries (WEB-IND-001), Resources
(WEB-RES-001), Company (WEB-COMPANY-001).

`ShellPage`, `RouteShell` and the empty `SHELL_ROUTES` array are kept on
purpose. The shell renders a real page from a sitemap entry, so it remains the
correct landing for any route minted ahead of its content — adding a path there
is still the cheapest way to ship a route without a dead end. Deleting the
mechanism would mean rebuilding it the next time that happens.

---

## 5. CTA attribution

| Page | intent | source | solution |
|---|---|---|---|
| Customers | `consultation` | `consultation` | Tư vấn phù hợp giải pháp |
| Partners | `partnership` | `contact` | Hợp tác và tích hợp |

`partnership` is an existing approved `LeadIntent`; no enum was invented.
`LeadSource` has no partnership value, so Partners uses `contact` — the nearest
valid general-contact source — and attribution survives through `intent` and
`solution`. Adding a `partner` source would change a shared union that the
contact form validates against, which is a lead-architecture decision, not a
content one. Recorded as a follow-up rather than taken unilaterally.

---

## 6. Privacy

`PRIVACY STATUS UNVERIFIED`. Non-indexing controls are intact and untouched;
there is still no authentication layer. Access control remains
`WEB-INFRA-001 — PREVIEW ACCESS CONTROL`.
