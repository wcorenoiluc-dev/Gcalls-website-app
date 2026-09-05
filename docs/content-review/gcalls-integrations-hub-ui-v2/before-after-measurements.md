# Before / After Measurements

## Before (base 9c562e7 — generic `HubLayout`)
- All five platform cards in one grid: `sm:grid-cols-2` with no `lg:grid-cols-3` (5 % 3 ≠ 0), so at desktop the fifth card is an orphan on its own row; CRM and Helpdesk are not visually separated.
- No hero visual (text-only hero); no Gcalls→layer→CRM/Helpdesk/POS diagram.
- Decision guide rendered as generic problem/reason cards.

## After (this branch — dedicated page)
- CRM group in a 3-column grid (3 cards, no orphan); Helpdesk group in a balanced 2-column grid.
- Neutral connection diagram in the hero (right column, 46/54 split).
- Decision guide reframed as "Đội ngũ đang làm việc ở đâu → Trang tổng quan → Lý do".

## After geometry (measured)
| Breakpoint | H1 | main children | horizontal overflow | broken imgs | upscaled imgs |
|---|--:|--:|--:|--:|--:|
| 320 | 1 | 7 | 0 | 0 | 0 |
| 390 | 1 | 7 | 0 | 0 | 0 |
| 768 | 1 | 7 | 0 | 0 | 0 |
| 1024 | 1 | 7 | 0 | 0 | 0 |
| 1280 | 1 | 7 | 0 | 0 | 0 |
| 1440 | 1 | 7 | 0 | 0 | 0 |

Container max width at 1440 = 1440px (site Container). Section seams and 1180 container come from the untouched global primitives. Zero dead whitespace / zero empty grid tracks (CRM 3-in-3, Helpdesk 2-in-2).
