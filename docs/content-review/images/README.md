# Image foundation — inventory, privacy gate and output spec

Checkpoint `GCALLS-DEMO-IMAGE-FOUNDATION-001` §B–§G.

## Files here

| File | What it holds |
| --- | --- |
| `image-source-inventory.csv` | All 15 delivered source captures: checksum, dimensions, per-image PII findings, masking decision, target page and final filename. |
| `website-image-master-map.csv` | Every website section that needs a visual, classified P0 / P1 / P2, with owner, due date, approval state and a replacement rule. |
| `blog-image-status.csv` | All 30 Batch 1 image briefs reconciled against what actually exists. |
| `masking-report.json` | Machine output of `scripts/mask-product-images.mjs`: source checksum, output checksum, region count per file. |
| `demo-qa/` | Demo build QA report and screenshot evidence. |

## Source

One folder was in scope: `Gcalls_Webphone_UI_Assets_P0`. 15 PNG captures of the
Gcalls Plus console.

- 15 files, **15 distinct SHA-256 checksums — no duplicates**, so no
  duplicate group needed resolving.
- No two files share a name, so the "same name, different content" case did
  not arise.
- `20260716-222433.png` is **not present** in the source folder. Nothing
  excluded by §C was found to exclude.
- No legacy WordPress imagery was used. No screenshot of any other product was
  used. Nothing was staged or mocked up to look like Gcalls.

## Privacy gate (§C)

Every one of the 15 images was opened and read before any decision. Findings,
in short:

- **13 contain PII** — customer names, mobile numbers, e-mail addresses,
  employee accounts, extension numbers, tenant and contact-group names, call
  recordings attached to named contacts.
- **1 contains none** (`gcalls-plus-keypad-mobile.png` — a dialpad rendering no
  data). It ships unmodified.
- **2 are refused rather than masked**: `gcalls-plus-analytics-dashboard.png`
  and `gcalls-plus-agent-performance.png`. Both carry real operating figures —
  call volumes, connect rates, average duration, per-agent productivity,
  last-login times. Masking the names would leave the numbers, and the numbers
  are an unapproved claim. They need either published approval of the figures
  or a fresh capture from a seeded demo tenant.

### How masking works

`scripts/mask-product-images.mjs`, re-runnable, deterministic.

- **Destructive pixel replacement.** Regions are overwritten with an opaque
  fill and synthetic replacement text (`Khách hàng 01`, `0910000000`,
  `nhanvien.a`, `Demo Workspace`). Nothing is blurred, pixelated or reduced in
  opacity — there is no recoverable original underneath.
- Placeholders are obviously synthetic, so a reader cannot mistake one for a
  real record.
- Masked files carry an on-image note: *Ảnh minh hoạ — dữ liệu đã được che*.
- **The source files are never written to.** The script only reads them, and
  the raw captures are not committed to this repository.
- Every output was re-opened and visually re-checked after generation. Three
  correction passes were needed before all regions were clean.

## Output spec (§E)

- Source aspect ratio kept; **no resize anywhere in the pipeline**, so output
  pixels equal source pixels and nothing is upscaled into blur.
- WebP, quality 86. 13 files, ~305 KB total, largest 71 KB — well under the
  500 KB ceiling.
- Intrinsic `width`/`height` recorded in `src/data/productImages.ts` and passed
  to the DOM on every consumer, so nothing shifts while loading.
- Alt text is per-image and describes the function on screen, plus the fact
  that data is masked.

### Naming

`gcalls-[product]-[feature]-[desktop|mobile]-v1.webp`

Blog assets, when they exist, follow `blog-[hub]-[slug]-featured-v1.webp` and
`blog-[slug]-[diagram-name]-v1.svg`. None exist yet — see below.

## Blog images (§G)

30 briefs across the 18 Batch 1 articles: **18 featured, 12 in-article**.

| Brief type | Count |
| --- | --- |
| `CUSTOM_DIAGRAM_REQUIRED` | 22 |
| `EDITORIAL_ILLUSTRATION_REQUIRED` | 3 |
| `PRODUCT_SCREENSHOT_REQUIRED` | 5 |

Reconciled against what exists today:

| Resolved status | Count |
| --- | --- |
| `CUSTOM_DIAGRAM_REQUIRED` (new SVG) | 22 |
| `EDITORIAL_ILLUSTRATION_REQUIRED` (new artwork) | 3 |
| `BLOCKED` | 4 |
| `NEEDS_APPROVAL` | 1 |
| `IMAGE_READY` | **0** |

- **1 brief has a usable source**: the webphone mid-call shot for
  `tong-dai-tren-trinh-duyet-hoat-dong-the-nao`. It is masked and ready, but
  blocked on *format*, not on data — the capture is 809×429 and the brief
  demands 1600×900. It must be composed at native size on a 1600×900 brand
  canvas; upscaling 2× would blur it, which §E forbids.
- **4 are blocked on missing product**: QA QC Center analysis and the Gcalls CX
  multichannel queue do not exist as captures; the outbound campaign list and
  the after-call disposition box are not the same surfaces as the delivered
  call-history table and activity-type filter. Substituting either would invent
  a feature flow.
- **25 need new artwork** that no source can supply.

No brief was marked `IMAGE_READY`, and no placeholder was used to simulate
readiness.
