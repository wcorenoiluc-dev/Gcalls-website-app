# Checkpoint WEB-RES-001 — Resources cluster

Six `/tai-nguyen/…` routes left the sitemap-driven shell: Blog, Guides, Case
Studies, Ebook, Glossary and FAQ. Commit `f6a2fd5`.

Nothing was deployed, published or pushed.

> **Corrections (WEB-COMPANY-001 §2).** The claim register below supersedes the
> version issued with the original WEB-RES-001 report. Four rows were wrong in a
> way that mattered: one row combined two different claims under a single
> publication status, two independent WITHHELD claims were reported as one, and
> the published Auto Dialer wording was self-contradictory. All four are
> corrected here, and the Auto Dialer correction was also applied to the live
> copy in `src/data/resources/glossary.ts`.

> **Further correction (WEB-SITE-QA-001 §3).** The international cost-saving row
> said "50–90%", which is not what either source says. Direct inspection of the
> supplied ICP image gives **50%–80%**; the DIB planning material gives
> **80%–90%**. "50–90%" was a conflation of the two — the low end of one with the
> high end of the other — producing a range no source states. It is now two rows,
> one per source, so the conflict is visible rather than averaged away. Both stay
> WITHHELD and the site publishes no numeric saving figure. The same conflated
> string is corrected in the guard in `src/data/resources/types.ts`.

---

## 1. Architecture

```
src/data/resources/types.ts     shared shapes + fabrication guard + claim guard
src/data/resources/index.ts     registry, RESOURCE_NAV, JSON-LD builders
src/data/resources/*.ts         six content files
src/components/resources/       sections.tsx · bodies.tsx · directory.tsx
src/pages/                      six page components, route-level lazy
```

`ResourcePageBase` fixes only what every resource page genuinely shares — hero,
purpose and audience, onward routing, closing CTA — and each page extends it
with its own body. The shared base enforces the required section order; the
extensions are what keep six pages from reading identically.

---

## 2. Fabrication safety

No article, author, publication date, case study, customer quote, customer
logo, ebook title, cover image or download control was created. Pages with no
approved inventory show an honest state naming exactly what does not exist.

Structured data emitted: `BreadcrumbList` (all six), `FAQPage` (from arrays the
pages render in full), `CollectionPage` (Guides only — the one page whose body
is a complete visible collection), `DefinedTermSet` (Glossary only, 24 terms,
each `termCode` resolving to a rendered heading id).

Deliberately absent: `Article`, `BlogPosting`, `Product`, `Offer`, `Review`,
`Rating`, `AggregateRating`, `author`, `datePublished`, `dateModified`.

---

## 3. Claim register — CORRECTED

One publication status per row.

| Claim | Source level | Page | Current wording | Publication status | Verification required |
|---|---|---|---|---|---|
| International number availability by country | B | Glossary, FAQ, Guides | Availability depends on country, regulation and documentation | QUALIFIED CAPABILITY | Per-market confirmation at deployment time |
| International numbers in 70+ countries | B | — | Numeric count not published | NEEDS_GCALLS_VERIFICATION | Approved and current country-availability list |
| International cost saving — **ICP image: 50%–80%** | C | — | Not published | WITHHELD | Approved calculation methodology and evidence |
| International cost saving — **DIB planning material: 80%–90%** | C | — | Not published | WITHHELD | Reconciliation of the two conflicting source figures, then approved methodology |
| QC analysis or scoring of 100% of calls | C | — | Not published; QC is described as sampling a person verifies | WITHHELD | Approved product scope, processing limits and measurement definition |
| Auto Dialer / Auto Call | B | Glossary | "Tài liệu nguồn có đề cập Auto Dialer, nhưng Gcalls chưa xác nhận đây là tính năng thuộc phạm vi chào bán công khai. Khả năng cung cấp và phạm vi triển khai cần được xác nhận trong quá trình tư vấn." | NEEDS_GCALLS_VERIFICATION | Product confirmation that the capability exists and its operational scope |
| Voice Brandname | B | Glossary, FAQ | Carrier-provided and carrier-approved; Gcalls has published no carrier list or market scope; not applied by default to international numbers | NEEDS_GCALLS_VERIFICATION | Carrier list, approved markets, approval conditions and lead time |
| SDK integration | B | Glossary | Defined as a concept; Gcalls use "cần được đánh giá về phạm vi kỹ thuật… trong quá trình tư vấn" | NEEDS_GCALLS_VERIFICATION | Whether a Gcalls SDK is published, and its supported surface |
| Keyword and intent analysis | B | — | Not published | NEEDS_GCALLS_VERIFICATION | Product confirmation before any page names them |
| Speech-to-Text | B | Glossary | Accuracy dependencies stated; "Gcalls không công bố mức độ chính xác" | QUALIFIED CAPABILITY | Language and accuracy scope if a figure is ever published |
| Script-based call scoring | B | Glossary, FAQ | Support data; "cần người kiểm chứng trước khi sử dụng để đánh giá nhân sự" | QUALIFIED CAPABILITY | Supported criteria model per deployment |
| Sentiment analysis | B | Glossary, FAQ | Probabilistic; a triage tool, not a conclusion | QUALIFIED CAPABILITY | Accuracy scope if ever published |
| Omnichannel channel list | B | FAQ, Glossary | Channels "xác định theo nhu cầu và điều kiện kỹ thuật của từng nền tảng" | QUALIFIED CAPABILITY | Confirmed channel list per deployment tier |
| IVR and call flow | B | Glossary | Concepts; designed per organisation | QUALIFIED CAPABILITY | — |
| Ticket management / Helpdesk integration | A | FAQ, Glossary | Bounded by the platform's API and plan | APPROVED CAPABILITY | — |
| Click-to-Call, customer-info popup, call-history sync, CRM integration | A | Glossary, FAQ, Blog, Guides | Bounded by platform API and data quality | APPROVED CAPABILITY | — |
| Browser-based Webphone | A | Glossary, Blog, Guides | Existing product page scope | APPROVED CAPABILITY | — |
| Voicebot (Gcalls role) | A | Glossary, FAQ, Ebook | Gcalls consults, connects and integrates — never authors the engine | APPROVED CAPABILITY | — |
| 2.5% connection-rate increase | C | — | Not published | WITHHELD | Approved measurement evidence |
| 30–50% productivity increase | C | — | Not published | WITHHELD | Approved measurement evidence |
| 40% time saving / answer-rate increase | C | — | Not published | WITHHELD | Approved measurement evidence |
| 1,200 hours saved | C | — | Not published | WITHHELD | Approved measurement evidence |
| 24/7 result claims | C | — | Not published; support levels are contractual | WITHHELD | Contracted SLA terms |
| Installation in 30 minutes / deployment within one day | C | Guides, FAQ | Contradicted: "Không có mốc thời gian chung… sau bước khảo sát" | WITHHELD | Approved deployment benchmarks |
| Perfect stability / unlimited scale | C | — | Not published | WITHHELD | Approved uptime and capacity evidence |
| AI replaces staff | C | FAQ | Explicitly denied | WITHHELD | — |

### What changed, and why

1. **International availability was one row and should have been two.** "Which
   countries can Gcalls serve" and "70+ countries" are different claims with
   different statuses — the first is a qualified capability the pages do
   publish, the second is an unverified count they do not. Reporting them
   together forced a single status onto two facts.
2. **Cost saving and QC coverage were reported as one WITHHELD row.** They are
   independent claims from different parts of the planning source, and each
   needs its own evidence before it could ever be published — a shared row hid
   that the two unblock separately.
3. **The Auto Dialer wording was paradoxical.** The published sentence said the
   capability "has not been announced on this website" — on the website. The
   replacement separates the two facts that actually apply: the planning source
   mentions it, and Gcalls has not confirmed it as publicly offered scope.

Status is unchanged in every case. These are reporting and wording corrections,
not reclassifications.

---

## 4. Privacy

`PRIVACY STATUS UNVERIFIED`. Non-indexing controls (robots.txt, meta robots,
`X-Robots-Tag`, per-route `indexable`) are intact; there is no authentication
layer. Access control remains `WEB-INFRA-001 — PREVIEW ACCESS CONTROL`.
