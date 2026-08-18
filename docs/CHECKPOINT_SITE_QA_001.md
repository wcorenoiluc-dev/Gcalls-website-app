# Checkpoint WEB-SITE-QA-001 — Whole-site content, routing and conversion QA

Resumes from WEB-COMPANY-001 (`b846021`). Nothing was deployed, published or
pushed; no preview URL was created; no hosting, DNS or Cloudflare configuration
was touched.

Two gates: independently re-verify WEB-COMPANY-001, then QA the whole site.

---

## 1. Entry gate — WEB-COMPANY-001 re-verified, not taken on trust

The previous report reached the reviewer containing only section A, so every
claim in it was re-derived from the repository and from the rendered pages
rather than read back.

All of it held. `/cong-ty/khach-hang/` and `/cong-ty/doi-tac/` each render a
full page with exactly one H1, a unique title and description, a
`https://gcalls.co`-prefixed canonical matching the route, `noindex, nofollow`,
and a `BreadcrumbList` matching the visible trail element for element. Both are
absent from `SHELL_ROUTES`, which is empty. FAQ DOM matched FAQPage JSON-LD
question-for-question and answer-for-answer (5 items and 6 items respectively),
verified by expanding every accordion panel and comparing normalised text.

Two claims were worth re-testing properly rather than accepting:

**No unapproved customer identity is published.** `VinUniversity`,
`VinaCapital` and `Kingsport` appear in this repository exactly twice, both times
inside guard comments in `src/data/company/types.ts` and
`src/data/resources/types.ts`. Neither survives into `dist/`. The site renders
**zero `<img>` elements on all 38 routes** — every visual is inline SVG — so
there is no third-party mark anywhere, and `ApprovedLogo` is empty.

**No partner relationship is claimed.** Every occurrence of "đối tác chính
thức", "đối tác được chứng nhận", "ủy quyền" and "tương thích với mọi" on
`/cong-ty/doi-tac/` was extracted with its surrounding sentence, including
answers inside collapsed accordion panels. All of them sit inside a denial or a
statement of the boundary itself. Zero affirmative partner-status claims.

CTA attribution held: Customers `intent=consultation&source=consultation`,
Partners `intent=partnership&source=contact`, both existing approved enum
values. Loading `/lien-he/` with the Partners parameters renders the form and
accepts them.

Direct hash loading was re-tested cold, at a 390 px viewport, in a fresh
document per URL so the lazy chunk genuinely had not loaded. Every target landed
at **96 px**, clear of the 65 px sticky header.

**Entry gate: PASS. No correction was needed to either company page.**

One documentation discrepancy, not a code defect: the checkpoint brief asks for
`/tai-nguyen/faq/#tich-hop-crm`. That anchor does not exist on the FAQ route —
the FAQ group id is `tich-hop`, and `tich-hop-crm` is a **glossary** term id.
Both real URLs were verified at 96 px, and the non-existent one degrades
correctly (stays at top, no console error). Nothing links to it.

---

## 2. Route inventory — 38, not 22

The brief expects 22 public content routes. The registry proves 38, and the
registry is right.

`ROUTES` in `src/config/sitemap.ts` holds 38 paths, `SITEMAP` holds 38 entries,
and `src/app/router.tsx` registers 38 — verified by parsing all three and
diffing the key sets. No route is missing from the router, no path is registered
twice, and no page component exists outside the registry. All 38 entries carry
`status: 'complete'`; none is `shell` or `in_progress`.

22 was the count before the last three clusters landed. Integrations INT-01…05
added five platform pages, WEB-IND-001 six industry pages, WEB-RES-001 six
resource pages and WEB-COMPANY-001 two company pages, against a starting set
that already included the six navigation hubs. The router's own header comment
still says "37 routes", which was one stale count of its own.

`SHELL_ROUTES` contains zero public content routes. It is kept, along with
`ShellPage` and `RouteShell`, and this checkpoint did not delete the fallback:
the mechanism renders a real page from a sitemap entry, so it remains the
cheapest correct way to mint a route ahead of its content.

---

## 3. What the whole-site pass actually found

Every one of the 38 routes was loaded and measured. The 12 completed clusters
built since the claim-safety regime came in were clean. **The homepage was not**,
and it is the single substantive finding of this checkpoint.

`src/components/home/*` is Figma-derived and predates the guards that every
later page is held to. It was making claims that its own product and integration
pages are explicitly forbidden from making.

### 3.1 Fabricated social proof in the hero — the most serious one

A five-star row reading **4.9**, four avatar initials (`VP`, `BM`, `SV`, `TH`)
and the caption *"Được tin dùng bởi các doanh nghiệp Việt Nam"*.

Nothing behind any of it. No rating, no review, no customer count, no permission
record. The four initials matched the invented companies in the mock contact list
further down the same page — "CTCP Việt Phát", "Công ty TNHH Bình Minh", "Tập
đoàn Sao Việt".

This is the exact claim `/cong-ty/khach-hang/` was built to avoid, and
`src/data/company/types.ts` makes the permission gate a *type error* — while the
homepage hero was showing a rating and a logo wall in miniature. Removed, with
the reasoning recorded at the site so it cannot be restored by accident.

### 3.2 Homepage claims that contradicted the locked integration pages

| Was | Why it could not stand |
|---|---|
| "xác thực OAuth 2.0, sandbox miễn phí cho dev" | No repository evidence for either. A named auth standard and a free sandbox are checkable facts. |
| "hiển thị popup **ngay lập tức**" | The popup gate resolved CONTEXT ONLY across INT-02…05, and the Salesforce page **title had to be corrected at INT-03** for publishing precisely this. |
| "Click To Call … từ CRM, Helpdesk, **ERP**" | The Freshdesk and Zendesk Click-to-Call gates both closed against publication. ERP is not an integration category anywhere on this site. |
| "**Đồng bộ hai chiều** với … **Freshsales**" | No page claims two-way sync. Freshsales has no integration page, no config and no evidence — and carried a green "live" status dot. |
| "ghi âm tự động" in Data Sync | Recording-sync gates closed at INT-03, INT-04 §11 J and INT-05 §11 J. |
| "nền tảng **phổ biến nhất**" | Unsupported superlative. |
| "Tích hợp sẵn sàng · **Không cần dev**" | `src/data/gcallsPlus.ts` already records that "Không cần IT" is not approved as an absolute. Same claim, same site. |
| "**không yêu cầu kiến thức kỹ thuật chuyên sâu**" | Contradicts the approved register on all five platform pages. |

### 3.3 Guaranteed outcomes and unevidenced figures

- **"kết nối với nhân viên trong vòng 30 giây"** and a "Kết nối trong 30s" pill —
  a guaranteed connection time, the same family as the withheld deployment-time
  claims, and dependent on agent availability and carrier routing.
- **"50+ / Nhân sự được quản lý"** and **"100% / Dữ liệu tập trung"** — these
  render twice each, in the copy column *and* as floating cards, so they are
  page-level statements, not sample data inside an illustration. "50+" reads as a
  customer-scale figure; a bare "100%" is the absolute the guards forbid. Both
  are now capability labels.
- **"Không bỏ lỡ bất kỳ cuộc gọi nào"**, **"không bỏ lỡ bất kỳ cơ hội nào"**,
  **"tăng tỷ lệ kết nối thành công"**, **"hoàn toàn tự động"** — absolute outcome
  guarantees, reworded to describe the mechanism.
- The six page-level metric cards on the analytics section (284 calls, 391 calls,
  a 4.7/5 score, with trend arrows) keep their numbers but now carry an explicit
  caption saying they are illustrative — matching the "(minh họa)" convention
  already used elsewhere on the page, one of which had already been applied to a
  single card.

Numbers *inside* the product-UI mockups were left alone. They are sample data in
a framed dashboard, which is what a product screenshot is for.

---

## 4. Structured data — Product, Offer and OfferCatalog removed

`/bang-gia/` emitted a `Product` whose `AggregateOffer` carried
`availability: https://schema.org/InStock` and `offerCount: 4`. The existing
comment explained only half the problem: omitting `price` was right, but the node
still asserted that four purchasable plans are available now, while
`PRICING_CONFIGURED` is false and the visible page renders fallback copy instead
of numbers. Structured data was making a stronger claim than the page it
described.

`Product` on `/gcalls-plus-webphone/`, `/qc-bot-ai/` and `/gcalls-cx/` carried
nothing the neighbouring `SoftwareApplication` node did not already carry — same
name, description, category, url. All it added was commerce vocabulary that
invites `offers`, `availability` and `aggregateRating`.

`OfferCatalog` (including nested `hasOfferCatalog` on `/voicebot-ai/` and all six
industry pages) described use-case and capability lists as catalogues of things
offered for sale.

Now: `Product` gone from four routes, `OfferCatalog` → `ItemList`,
`hasOfferCatalog` → `hasPart` + `ItemList`. Verified across all 38 routes:
**zero** `Product`, `Offer`, `OfferCatalog`, `AggregateOffer`, `Review`,
`Rating`, `AggregateRating` or `Article` nodes anywhere.

### BreadcrumbList mismatches

`/gcalls-plus-webphone/`, `/qc-bot-ai/` and `/gcalls-cx/` rendered
`Trang chủ › Sản phẩm › <product>` but emitted only two items — the "Sản phẩm"
level was missing. Corrected.

`/lien-he/` and `/referral/` rendered a visible breadcrumb and emitted no
`BreadcrumbList` at all. Both render through `RouteShell`, so the node is now
built there from the same `getBreadcrumbTrail(pathname)` result the
`<Breadcrumb>` element receives — the two cannot disagree, which is exactly how
the three product pages drifted.

---

## 5. Conversion — four CTAs were dropping attribution

Some content structures hold a `path` that usually points at a content page and
occasionally at `/lien-he/`. Rendered with a plain `<Link to={path}>` those
arrived at the form with no `intent` and no `source`, while every neighbouring
CTA on the same page carried full context:

| Route | CTA |
|---|---|
| `/tich-hop/` | "Trao đổi với Gcalls" (decision-guide row: my system is not in the list) |
| `/cong-ty/` | "Trao đổi với Gcalls" (principles card) |
| `/tai-nguyen/guides/` | "Trao đổi về thị trường cần triển khai" |
| `/referral/` | "Trở thành đối tác giới thiệu Gcalls" |

Fixed at the render sites via a new `leadAwareHref(path, lead)` in
`src/lib/leads/ctaLink.ts`, which tags a link only when its destination is the
contact route. Putting it at the render site rather than in each data row means a
row added later cannot reintroduce the bug.

Wayfinding links were deliberately left bare — a "Xem thêm" list or a
sitemap-derived card grid that happens to include the contact page is navigation
to a destination, not a conversion, and tagging it would attribute leads to
whichever page a visitor merely passed through.

`/referral/` now carries `intent=partnership&source=contact` with
`solution=Chương trình giới thiệu`. `partnership` is an existing approved
`LeadIntent`; `LeadSource` still has no referral or partner value, so it uses
`contact`, exactly as `/cong-ty/doi-tac/` does. **No enum value was invented.**

`/uoc-tinh-chi-phi/` has no in-content lead CTA and this is correct: it is an
interactive wizard whose quote CTA appears once a configuration exists, and it
offers "Bắt đầu ước tính" plus a "Xem bảng giá" secondary in the meantime.

---

## 6. Telephone link

`tel:02873025469` → `tel:+842873025469`. RFC 3966 treats a number with no country
code as a *local* number, interpretable only alongside a `phone-context`
parameter; without one, dialer behaviour is undefined. The practical failure is a
visitor abroad — which this site actively courts, `/tong-dai-quoc-te/` being
about multi-market operations — tapping the number and reaching nothing. The
displayed format stays domestic.

---

## 7. Claim register correction (§3 of the brief)

The register in `docs/CHECKPOINT_RES01_RESOURCES.md` carried one row reading
"International cost saving of 50–90%". **That is not a range either source
states.** Direct inspection of the supplied ICP image gives **50%–80%**; the DIB
planning material gives **80%–90%**. "50–90%" spliced the bottom of one onto the
top of the other, producing a figure nobody claimed and hiding the fact that the
two sources disagree.

It is now two rows, one per source, both WITHHELD, with the conflict stated
rather than averaged away. The same conflated string is corrected in the guards
in `src/data/resources/types.ts` and `src/data/company/customers.ts`.

Availability is split as the brief requires: country-dependent availability is
`QUALIFIED CAPABILITY`; the numeric "70+ countries" is
`NEEDS_GCALLS_VERIFICATION`. `100%` call coverage, `1,200` hours saved, a 24/7
performance promise, `40%` answer-rate improvement and every deployment-time
figure remain `WITHHELD`. Auto Dialer remains `NEEDS_GCALLS_VERIFICATION`. The
site publishes no numeric saving promise anywhere — verified by scanning the
rendered text of all 38 routes.

---

## 8. Verification method, and its one real limit

Everything above was measured on the production build served by `vite preview`,
in Chrome, across all 38 routes.

**Viewports.** 1440×900, 1024×768 and 768×1024 were tested by resizing the
window. Chrome will not make a window narrower than about 500 px, so **390 and
360 were tested inside a same-origin iframe sized to give exactly those content
widths** — media queries inside an iframe resolve against the iframe's viewport,
so Tailwind's responsive classes behave as they would on a phone. Both narrow
widths were genuinely measured, not inferred from 768.

Result at every viewport: zero horizontal overflow on every route family and
every high-risk page, zero console errors, zero console warnings. Vietnamese
diacritics render throughout. The mobile menu opens, locks body scroll, exposes
62 links all clearing 44 px, and closes. Reduced motion is handled globally in
`src/styles/responsive.css`, and `ScrollManager` scrolls instantly and
unconditionally.

**FAQ/DOM equality** was checked by clicking every accordion button and comparing
the rendered answer to the JSON-LD answer, not by substring search — collapsed
panels are unmounted, so a naive scan would have reported a false failure.
`DefinedTermSet` was checked term by term: 24 terms, every name, description and
anchor present.

---

## 9. What is NOT fixed, and why

**The Figma-derived components have no accessibility annotation.** On `/` there
are 334 SVG icons without `aria-hidden` (of 340) and 88 focusable buttons, most
of them decorative mock dashboard controls — pagination "1 2 3 …", row action
menus, fake search fields. A keyboard user tabs through them; a screen reader
reads the mock data as page content. `/gcalls-plus-webphone/` and the other
mockup-carrying pages have the same shape. Hand-authored sections do this
correctly and show a baseline of 7–11.

This was left alone deliberately. Fixing it properly needs per-element judgement
across nine large files — some mockup controls are genuinely interactive demos
with real state, others are dead — and the blunt fix (marking whole stages
`aria-hidden`) would break the working tab switchers. Half-doing it would be
worse than reporting it. It wants its own scoped checkpoint.

Sub-44 px tap targets are confined to exactly these mock controls, plus the
desktop mega-menu triggers at 36 px, which are pointer targets on ≥1024 px
layouts and are replaced by the 44 px mobile menu below that.

**No `sitemap.xml` is generated.** The registry in `src/config/sitemap.ts` is
complete, but no XML is emitted — correctly, since `robots.txt` is `Disallow: /`
and every route ships `noindex, nofollow`. Shipping a sitemap for a
deliberately unindexed preview would contradict all three non-indexing layers.
It is a go-live dependency.

**There is no automated test suite.** `package.json` has no `test` script and no
test runner among its dependencies. Validation is typecheck + lint + production
build, plus the browser-driven checks recorded here. That gap predates this
checkpoint; nothing was weakened.

---

## 10. Privacy

`PRIVACY STATUS UNVERIFIED`, unchanged. All three non-indexing layers are intact
and untouched — `index.html` meta robots, the per-route runtime directive, and
`public/robots.txt` plus the `X-Robots-Tag` in `public/_headers`. `git diff`
confirms zero changes under `public/` or to `index.html`.

There is still no authentication layer, so all content remains readable by anyone
who can reach the host. Access control remains
**WEB-INFRA-001 — PREVIEW ACCESS CONTROL**, which this checkpoint did not begin.
