# Regression Report — `/lien-he/` UI V2

`LeadForm` is a shared component, but it was NOT modified (hash-identical to base — see changed-files.md), so every route that renders it is unchanged by construction. Captured at 1440.

| Route | H1 | overflow | renders form | console errors |
|---|--:|--:|:--:|--:|
| / | 1 | 0 | no | 0 |
| /lien-he/ | 1 | 0 | yes | 0 |
| /uoc-tinh-chi-phi/ | 1 | 0 | no | 0 |
| /gcalls-plus-webphone/ | 1 | 0 | no | 0 |
| /gcalls-cx/ | 1 | 0 | no | 0 |
| /qc-bot-ai/ | 1 | 0 | no | 0 |
| /voicebot-ai/ | 1 | 0 | no | 0 |

**All pass: true.** No route outside /lien-he/ changed H1 count, overflowed, or logged a console error. The estimator and product pages that embed LeadForm render it identically.
