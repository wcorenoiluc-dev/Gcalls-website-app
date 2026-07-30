# GCALLS WEBSITE — BOSS DEMO V1

**Status:** BOSS DEMO V1 READY
**Prepared:** 2026-07-30
**Branch:** `feature/gcalls-website-foundation`
**Recommended tag:** `gcalls-website-demo-v1`

---

## 1. Demo objective

Show leadership the **content and design prototype** for the new Gcalls website
(V2) and get a decision on positioning, product architecture and page structure
— before any migration work begins.

This build is a **review preview**, not a launch. Concretely:

| | |
|---|---|
| What this is | A React/Vite prototype of the approved V2 site, deployed to a private preview URL |
| What this is not | A replacement for gcalls.co, and not a WordPress/Elementor build |
| What we need from this review | Approval (or change requests) on positioning, the product/solution split, and page-by-page content |
| What happens after approval | The approved content is migrated to WordPress/Elementor — **not before** |

`gcalls.co` production is untouched. No DNS change, no WordPress change, no
content change on the live site was made for this demo.

---

## 2. Positioning

**Gcalls builds business communication software that keeps the phone call
connected to customer data and to the team's workflow.**

The site is built around one distinction, because it is the thing prospects get
wrong most often:

- **A product** answers "what tool does the team use?" — Webphone, quality
  control, omnichannel.
- **A solution** answers "how does that tool fit the systems and markets we
  already have?" — CRM, Helpdesk, POS, international.

Every page on the site is either a product page, a solution page, or a hub that
routes between them. Nothing on the site is organised as a feature list.

**Claim discipline.** Every page states scope conditionally — "theo cấu hình",
"tùy quốc gia", "theo phạm vi triển khai" — because unverifiable numbers are
the fastest way to lose a technical buyer and the hardest thing to walk back.
Section 9 lists exactly what was withheld and why.

---

## 3. Core product architecture

Three products, three different problems. Deliberately **not** three price
tiers of one product — the site says so explicitly on `/san-pham/`.

| Product | Route | Answers |
|---|---|---|
| **Gcalls Plus Webphone** | `/gcalls-plus-webphone/` | The team needs a reliable calling channel, plus contacts, interaction history and call-activity tracking. |
| **QA QC Center** — *powered by QC Bot AI* | `/qc-bot-ai/` | A manager needs to assess conversation quality systematically without listening to every call. |
| **Gcalls CX** | `/gcalls-cx/` | Customers arrive on several channels and the support team is opening several tools to answer. |

Product hub: **`/san-pham/`** — carries all three, plus a four-row decision
guide that sends a mis-scoped visitor to the right page (including sending
integration-shaped problems to the solution hub instead).

---

## 4. Core solution architecture

Four solutions. Three are system integrations; one is market reach. All four
run on the same calling layer.

| Solution | Route | Answers |
|---|---|---|
| **Tổng đài tích hợp CRM** | `/tong-dai-tich-hop-crm/` | Sales works around leads, contacts and pipeline in a CRM. |
| **Tổng đài tích hợp Helpdesk** | `/tong-dai-tich-hop-helpdesk/` | Support works around tickets and a resolution process. |
| **Tổng đài tích hợp POS** | `/tong-dai-tich-hop-pos/` | Customer and sales context lives in a retail / order system. |
| **Tổng đài quốc tế** | `/tong-dai-quoc-te/` | The business needs numbers and calling configuration for foreign markets. |

Solution hub: **`/giai-phap/`** — organised as **business problem → solution**.
Sales, Customer Service and Quality Assurance appear there as *ways of
describing a need*, each mapped onto a real page. They are deliberately not
routes of their own, so they cannot compete with the real pages for the same
queries.

---

## 5. URLs to review

Replace `<DEMO_ORIGIN>` with the preview URL from section 11.

### Priority 1 — the commercial core

| Page | Path |
|---|---|
| Home | `/` |
| Gcalls Plus Webphone | `/gcalls-plus-webphone/` |
| QA QC Center | `/qc-bot-ai/` |
| Gcalls CX | `/gcalls-cx/` |
| CRM Integration | `/tong-dai-tich-hop-crm/` |
| Helpdesk Integration | `/tong-dai-tich-hop-helpdesk/` |
| POS Integration | `/tong-dai-tich-hop-pos/` |
| **International Calling — new in this build** | `/tong-dai-quoc-te/` |

### Priority 2 — navigation hubs (all six new in this build)

| Hub | Path |
|---|---|
| Products | `/san-pham/` |
| Solutions | `/giai-phap/` |
| Integrations | `/tich-hop/` |
| Industries | `/nganh/` |
| Resources | `/tai-nguyen/` |
| Company | `/cong-ty/` |

### Priority 3 — conversion surfaces

| Page | Path |
|---|---|
| Pricing | `/bang-gia/` |
| Cost Estimator | `/uoc-tinh-chi-phi/` |
| Contact / consultation form | `/lien-he/` |

---

## 6. Recommended review journey

About 15 minutes. Follow it in order — it is the same path a real prospect takes.

1. **`/`** — read the positioning above the fold. Does it sound like Gcalls?
2. **Header → Sản phẩm → Tất cả sản phẩm** (`/san-pham/`) — is the three-product
   split correct, and is the boundary between them stated the way you would
   state it?
3. **Gcalls Plus Webphone** — the flagship page. Then use its
   **"Ước tính cấu hình & chi phí"** button.
4. **Cost Estimator** — the product arrives pre-selected. Step through it and
   press **"Nhận báo giá chi tiết"**. The quote form appears with the
   configuration attached.
5. **Header → Giải pháp → Tất cả giải pháp** (`/giai-phap/`) — read the
   *problem → solution* guide. This is the page a confused prospect lands on.
6. **`/tong-dai-quoc-te/`** — the newest page. Two things to check specifically:
   the **"Thị trường thường được yêu cầu"** block (every market carries a
   **"Cần khảo sát"** state — it is a list of requests, not a coverage promise),
   and the **registration / documentation** section.
7. **`/qc-bot-ai/`** → **"Yêu cầu demo QA QC Center"**.
8. **`/cong-ty/`** — the company overview. Note what is *absent*: no years, no
   customer count, no logo wall. Section 9 explains why.
9. **On a phone** — open the same pages at phone width and use the hamburger
   menu. Everything was verified at 390px.

---

## 7. What is complete

**18 of 37 routes are fully built pages.** Every route reachable in one click
from the main navigation is one of them — a reviewer cannot land on a
placeholder from the header.

### Built in this checkpoint

| Item | Detail |
|---|---|
| **International Calling** (`/tong-dai-quoc-te/`) | 17 sections: hero, direct answer, problems, international-number concept, country/regulation differences, requested markets, how it works, inbound, outbound, number registration/documentation, operational management, use cases, product boundaries, deployment, configuration & cost, trust, FAQ, final CTA. Was a generic shell before this checkpoint. |
| **6 navigation hubs** | `/san-pham/` `/giai-phap/` `/tich-hop/` `/nganh/` `/tai-nguyen/` `/cong-ty/` — each with hero, direct answer, primary cards, decision guidance, onward links and CTA. All six were generic shells before this checkpoint. |
| **Preview hosting config** | `public/_redirects` (SPA deep links), `public/_headers` (`X-Robots-Tag`), `public/robots.txt`. |

### Already approved and unchanged

Home, Gcalls Plus Webphone, QA QC Center, Gcalls CX, CRM / Helpdesk / POS
Integration, Pricing, Cost Estimator, Contact, Referral. **No locked copy on
any of these pages was edited in this checkpoint.**

### Verified by real interaction, not by inspection

| Check | Result |
|---|---|
| All 37 routes loaded | 1 `<h1>` each, no blank page, no Lorem ipsum, no "under construction" |
| Broken internal links | **0** across all 37 routes |
| Hubs rendering a generic shell | **0** |
| Boss journeys A–G click-tested | **7 / 7 pass** |
| Horizontal overflow at 390 / 430 / 768 / 1024 / 1440 | **0** on all 17 review-critical pages |
| Mobile menu + mobile CTA at 390px | Opens, navigates, CTA and phone number reachable |
| Console errors in the production build | **0** |
| `typecheck` / `lint` / `build` | Pass / pass (0 errors) / pass |
| Preview indexable | No — `noindex, nofollow` on every route, plus `robots.txt` and `X-Robots-Tag` |

---

## 8. What is intentionally phase 2

Not gaps in this demo — **scoped out on purpose**, so the review stays on
positioning and structure.

### 19 child routes remain sitemap-driven pages

They are real pages — correct breadcrumb, page-specific H1 and intro, relevant
onward links, working CTA — but they do not yet carry full editorial content.
None of them is reachable in one click from the header as a *destination*; they
sit one level deeper.

| Group | Routes |
|---|---|
| Integration platform pages | HubSpot, Salesforce, Zoho CRM, Freshdesk, Zendesk |
| Industry pages | Giáo dục, Tài chính, Bảo hiểm, Bất động sản, Thương mại điện tử, BPO |
| Resource pages | Blog, Guides, Case Studies, Ebook, Glossary, FAQ |
| Company pages | Khách hàng, Đối tác |

### Also phase 2

| Item | Why deferred |
|---|---|
| Editorial content (blog posts, guides, case studies, ebook) | Needs written and approved content. The hub says "đang biên tập" rather than implying a library exists. |
| Customer names, logos and case studies | Needs approval to publish each customer. Nothing was invented. |
| Favicon, OG share image | No approved brand asset in the repository. |
| `sitemap.xml` | Generate from the sitemap config at go-live, not before. |
| Analytics / GTM, cookie consent | Not needed for a private review; consent is required before analytics. |
| Footer legal links (privacy, terms) | No approved documents to link to. |
| Verified international market list | The single highest-value content unlock for `/tong-dai-quoc-te/` — see section 9. |

---

## 9. Known limitation — lead backend is NOT_CONFIGURED

**Every consultation, demo and quote form on this demo will NOT deliver a lead.**

This is stated plainly rather than hidden, and the site never fakes success.

- The forms are complete: validation, attribution capture, product/solution
  context, and the estimator configuration all work end to end.
- What is missing is a **server** to receive the submission. Every real
  destination (HubSpot, Lark, n8n) needs a private API token, and this project
  builds to static files — there is nowhere to hold a secret without publishing
  it to every visitor's browser.
- If a reviewer submits a form, they get an honest message pointing them to
  `sales@gcalls.co` / `028 7302 5469`. **Success is never displayed unless a
  server confirms delivery.**
- To connect it: deploy the endpoint contract in
  [`LEAD_CAPTURE_ARCHITECTURE.md`](LEAD_CAPTURE_ARCHITECTURE.md) and set
  `VITE_LEAD_API_URL`. No front-end change is needed.

**Do not use this demo to collect real leads.**

### Claims withheld for lack of evidence

Historical Gcalls material carries figures that no current evidence in this
project supports. They are **not published** anywhere on the site. If any of
these can be substantiated, sending the evidence is the fastest content
improvement available:

| Withheld claim | What the site says instead |
|---|---|
| "70+ quốc gia" | "nhiều thị trường"; markets are listed as *requested*, each marked "Cần khảo sát" |
| "Tiết kiệm 80–90% chi phí" | Cost stated by *factor* (quốc gia, loại đầu số, hồ sơ, lưu lượng), never by percentage |
| "Triển khai 1 ngày – 1 tuần" | Ordered steps with no duration; registration time stated as country- and document-dependent |
| "Brandname" / guaranteed caller-ID display | "Số hiển thị phụ thuộc vào cấu hình đầu số và quy định tại quốc gia được gọi đến" |
| "SLA" / uptime figure | Not mentioned |
| "10+ năm", "1.000+ khách hàng", "30+ CRM" | The company page states what Gcalls builds and how it works, with no scale claim |
| Platform partnership / certification | Platform names only, with an explicit note that scope differs per platform |

---

## 10. WordPress / Elementor migration is AFTER approval

**Migration has not started and must not start until this demo is approved.**

The order matters. Migrating first means every content change has to be made
twice — once here, once in Elementor.

1. Leadership reviews this demo and approves, or requests changes.
2. Changes are applied **here**, in the React prototype, and re-reviewed.
3. Only once content is frozen does WordPress/Elementor work begin, using this
   build as the specification (see
   [`WORDPRESS_HEADLESS_AUDIT.md`](WORDPRESS_HEADLESS_AUDIT.md)).
4. `gcalls.co` DNS is not touched until the WordPress build is signed off
   separately.

---

## 11. Deployment status

| | |
|---|---|
| Build | ✅ Passes. `dist/` is ready to upload as-is. |
| Preview hosting config | ✅ Committed — SPA deep-link rewrite, `noindex` header, `robots.txt` |
| Deployed | ❌ **Not yet** — no deployment credentials are available in this environment |
| Preview URL | Not yet issued |

### Exact remaining manual step

No Cloudflare account, API token or `wrangler` CLI is present in this
environment, so the deploy could not be performed here. One of these two steps
completes it:

**Option A — Cloudflare Pages via Git (recommended, no local credentials):**

1. Push this branch to `github.com/wcorenoiluc-dev/Gcalls-website-app`.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
   select the repo and this branch.
3. Build command `npm run build`, output directory `dist`, framework preset
   *None*.
4. Environment variables: `VITE_SITE_ORIGIN=https://v2.gcalls.co`. Leave
   `VITE_ALLOW_INDEXING` unset and `VITE_LEAD_API_URL` empty.
5. Deploy. A `*.pages.dev` URL is issued immediately.
6. *Optional:* add `v2.gcalls.co` as a custom domain on the Pages project — this
   is a **new** subdomain record and does not affect the `gcalls.co` apex record
   serving WordPress.

**Option B — direct upload:** run `npm run build` and drag `dist/` into
Cloudflare Pages → Create → Upload assets.

### Confirmed not done

- `gcalls.co` production: **not modified**
- WordPress: **not touched**
- DNS: **no change** — a `v2` subdomain would be additive and needs explicit
  instruction before anyone creates it

---

## Appendix — verification detail

### Boss journeys, click-tested

| # | Journey | Result |
|---|---|---|
| A | Home → Gcalls Plus → Cost Estimator → Consultation | Pass — estimator arrives pre-selected; quote form carries "Gcalls Plus Webphone · 5 Agent" |
| B | Home → CRM Integration → Consultation | Pass — `intent=consultation&source=crm_integration&solution=Tích hợp CRM` |
| C | Home → Gcalls CX → Demo | Pass — `intent=demo&source=gcalls_cx&product=Gcalls CX` |
| D | Home → QA QC Center → Demo | Pass — `intent=demo&source=qa_qc_center&product=QA QC Center` |
| E | Home → International Calling → Consultation | Pass — `intent=consultation&source=international&solution=Tổng đài quốc tế`; the form's "Nhu cầu" field arrives pre-selected |
| F | Header → Products Hub → product | Pass |
| G | Header → Solutions Hub → solution | Pass |

### Responsive

17 review-critical pages measured at each width in a real fixed-width viewport:

| Width | Pages | Horizontal overflow |
|---|---|---|
| 390 | 17 | 0 |
| 430 | 17 | 0 |
| 768 | 17 | 0 |
| 1024 | 17 | 0 |
| 1440 | 17 | 0 |

### Search-indexing safety — four independent layers

| Layer | File |
|---|---|
| Pre-hydration meta tag | `index.html` |
| Per-route meta tag at runtime | `src/config/seo.ts` → `src/components/common/Seo.tsx` |
| Crawl policy | `public/robots.txt` (`Disallow: /`) |
| Transport header | `public/_headers` (`X-Robots-Tag: noindex, nofollow, noarchive`) |

All four must be changed together at go-live — see
[`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md) §1.
