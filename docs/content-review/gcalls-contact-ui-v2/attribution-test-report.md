# Attribution & PII Test Report — `/lien-he/`

Attribution is validated by `parseLeadCtaContext` (allow-lists intent/source, length-caps product/solution) and only ever DISPLAYED through `displayableLeadProduct` (allow-list map). Nothing a visitor typed is placed in the URL or DOM.

## Query-context cases

| Case | Query | H1=1 | script injected | attribution shown | unlisted leaked |
|---|---|:--:|:--:|:--:|:--:|
| Clean | intent=demo&source=gcalls_plus&product=Gcalls Plus Webphone | ✓ | none | yes | — |
| Hostile | intent=EVIL&source=notallowed&product=<script>alert(1)</script> | ✓ | none ✓ | suppressed ✓ | — |
| Unlisted | product=Sản phẩm không có thật XYZ | — | — | — | suppressed ✓ |

- Invalid `intent`/`source` fall back to defaults (consultation/contact); they never reach the DOM.
- An unrecognised or hostile `product` renders NOTHING (allow-list gate) — no content spoofing, no markup (React escapes; the gate stops it before display).

## PII safety (typed a full contact set, then submitted)

- PII in URL after submit: **none ✓** (URL: `/lien-he/`)
- PII in console: **none ✓**
- No name/email/phone/message is ever written to the query string, console, or an error redirect.
