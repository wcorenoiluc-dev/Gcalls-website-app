# Source-Field Reconciliation — `INTEGRATIONS_HUB`

Every field of `INTEGRATIONS_HUB` (in `src/data/hubs.ts`, read-only) is rendered on `/tich-hop/`. Copy
is verbatim; no field dropped, none added.

| Source field | Rendered where |
|---|---|
| `hero.eyebrow` | Hero eyebrow |
| `hero.h1` | The single H1 |
| `hero.description` | Hero paragraph |
| `hero.primaryCta.label` | Hero primary button → lead form (`leadCtaHref(lead)`) |
| `hero.secondaryCta.{label,path}` | Hero secondary button |
| `directAnswer.eyebrow/question/answer` | Direct-answer section (visible, not collapsed) |
| `cards.eyebrow/h2/lead` | Cards SectionHeader |
| `cards.items[0..4].title` | Card heading (h3) |
| `cards.items[].supportingLabel` | Card supporting label (CRM/Helpdesk) |
| `cards.items[].detail` | Card description |
| `cards.items[].path` | Card CTA link target (`leadAwareHref`) |
| `cards.items[].cta` | Card CTA label + `aria-label` |
| `cards.note` | Scoping note under the cards |
| `decisionGuide.eyebrow/h2/lead` | Decision-guide SectionHeader |
| `decisionGuide.rows[0..3].problem` | "Đội ngũ đang làm việc ở đâu" text |
| `decisionGuide.rows[].reason` | "Lý do" text |
| `decisionGuide.rows[].solution` | Row link label ("Trang tổng quan nên xem") |
| `decisionGuide.rows[].path` | Row link target |
| `links.h2` | Onward-links heading (h2) |
| `links.items[].{label,path}` | Onward-links list (5 links) |
| `finalCta.eyebrow/h2/description` | Final CTA band |
| `finalCta.primaryCta` / `finalCta.secondaryCta` | Final CTA buttons (primary → lead form) |
| `lead` | CTA lead context (hero, cards, guide contact row, final CTA) |
| `breadcrumbLabel` | Breadcrumb tail + JSON-LD |
| `route` | JSON-LD urls |

`decisionGuide` has 4 rows: CRM, Helpdesk, POS (→ POS integration overview), and "system not listed"
(→ contact / technical consultation, no capability promise). All four rendered.
