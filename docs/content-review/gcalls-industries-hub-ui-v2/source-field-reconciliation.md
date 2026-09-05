# Industries hub — source-field reconciliation

Every field of `INDUSTRIES_HUB` (in the read-only `src/data/hubs.ts`) is rendered by the
page-local `IndustriesHubLayout`. Copy is verbatim from source; nothing added, nothing dropped.

| Source field | Rendered where | Status |
| --- | --- | --- |
| `hero.eyebrow` | hero eyebrow | ✓ |
| `hero.h1` | the single `<h1>` | ✓ |
| `hero.description` | hero paragraph | ✓ |
| `hero.primaryCta.label` | hero primary CTA (→ lead href) | ✓ |
| `hero.secondaryCta` | hero secondary CTA (→ `/giai-phap/`) | ✓ |
| `directAnswer.eyebrow/question/answer` | direct-answer block | ✓ |
| `cards.eyebrow/h2` | cards SectionHeader | ✓ |
| `cards.items[6]` | six industry cards (icon added per route) | ✓ |
| `cards.items[].points` | product/solution tag chips | ✓ verbatim |
| `cards.items[].cta` + `.path` | card CTA link + accessible name | ✓ |
| `cards.note` | qualification note under the grid | ✓ |
| `links.h2` + `links.items[5]` | onward links | ✓ |
| `finalCta.*` | single FinalCtaBand (primary+secondary+phone) | ✓ |
| `decisionGuide` | *absent in source* → not rendered | ✓ (nothing to render) |

## Six-industry contract (title → route → tags)

| # | Title | Route | Tags (verbatim from source) |
| --- | --- | --- | --- |
| 1 | Giáo dục | `/nganh/giao-duc/` | Gcalls Plus · Tích hợp CRM |
| 2 | Tài chính | `/nganh/tai-chinh/` | Gcalls Plus · QA QC Center |
| 3 | Bảo hiểm | `/nganh/bao-hiem/` | Gcalls Plus · QA QC Center |
| 4 | Bất động sản | `/nganh/bat-dong-san/` | Gcalls Plus · Tích hợp CRM |
| 5 | Thương mại điện tử | `/nganh/thuong-mai-dien-tu/` | Tích hợp POS · Gcalls CX |
| 6 | BPO | `/nganh/bpo/` | Gcalls CX · QA QC Center |

Exactly six. Tài chính and Bảo hiểm are separate cards. No seventh industry. **No Voicebot tag** on any card. Verified live (`qa-report.json`, all breakpoints: `titlesOK=true`, `tagsOK=true`) and by `industries-hub-verify.mjs`.

## Claim audit

Scanned the files this track owns (`industries-hub-verify.mjs`) and the rendered DOM. None of the forbidden items appear: no conversion rate, sales lift, customer count, industry benchmark, answer rate, handling time, satisfaction rate, customer name, customer logo, legal-compliance claim, or "fits every business in the industry". The qualification note is rendered verbatim: product labels are *thường phù hợp*, not a required configuration. Icons are Lucide wayfinding symbols only — no product evidence, no stock photography.
