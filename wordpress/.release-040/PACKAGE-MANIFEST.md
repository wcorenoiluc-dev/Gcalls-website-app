# GCALLS-040 package manifest — final local candidate

Built by `wordpress/scripts/build-040-release.mjs`, which refuses to run unless
the 0.10.1 base zip and the live 0.8.5 `theme.css` match their recorded hashes.

## Artifacts

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.3.zip` | `gcalls-theme-0.8.6.zip` |
| Bytes | 446 240 | 99 021 |
| SHA-256 | `22eb0cdc72eefe437b911579dac6b58ef635141d606b3e6e4b6b2eaca8843c9e` | `3f3f8648a499f938cdd2dbf864853f34a41311766ca6123d9b5fd40fa803d26a` |
| `unzip -t` | No errors detected | No errors detected |
| Roots | exactly one: `gcalls-core/` | exactly one: `gcalls-theme/` |
| Files | 39 | 25 |

The GCALLS-039 artifacts are NOT overwritten: they remain at
`wordpress/.release/` as `gcalls-core-0.10.2.zip` and `gcalls-theme-0.8.6.zip`.

The theme's file CONTENT is byte-identical to the 039 theme artifact (verified
with `diff -rq`); the zip hash differs only because the archive stores fresh
modification times. The theme version is unchanged at 0.8.6 because nothing in
it changed — the home-page rhythm is authored in the Core data file, exactly as
docs/content-review/gcalls-033 predicted it should be.

## Gate: FUNCTIONAL_PRESERVATION_WITH_APPROVED_REMOVALS

This replaces "strict superset of every file in 0.10.1". Every route, section,
CTA and feature of 0.10.1 is preserved; the only files allowed to leave are the
six named below, each pinned by SHA-256 and independently confirmed REFUSED by
`data/media-frames.json` before deletion.

Core 0.10.1 (41 files) → 0.10.3 (39 files) = **+4 added, −6 approved removals**.

**Added (4)** — `data/media-frames.json`, `data/section-components.json`,
`includes/class-icons.php`, `includes/class-sections.php`

**Changed (8)** — `assets/css/mockups.css`, `data/product-pages.json`,
`data/homepage-elementor.json`, `data/homepage-inventory.json`,
`gcalls-core.php`, `includes/class-content-pages.php`,
`includes/class-mockups.php`, `includes/class-shortcodes.php`

**Removed (6, approved)**

| id | path | SHA-256 | verdict |
| --- | --- | --- | --- |
| `webphone-overview` | `assets/images/product-gallery/webphone-overview.webp` | `1ea97958d1d26af6…d705c965` | REFUSED |
| `customer-profile` | `assets/images/product-gallery/customer-profile.webp` | `926de3b7385b311b…a13cc8099` | REFUSED |
| `call-history` | `assets/images/product-gallery/call-history.webp` | `0da67896db7940b1…54c1bf675` | REFUSED |
| `analytics-dashboard` | `assets/images/product-gallery/analytics-dashboard.webp` | `3369ece36e9ac834…fec5767b2` | REFUSED |
| `agent-performance` | `assets/images/product-gallery/agent-performance.webp` | `6bbaf13f3e8d8360…44e796ca` | REFUSED |
| `click-to-call` | `assets/images/product-gallery/click-to-call.webp` | `72b8782477a6948d…b45c557b67` | REFUSED |

Nothing was deleted by glob. The originals remain in the repository as evidence,
and no git history or live media was touched. The registry still lists all six
as REFUSED with their provenance, and now also records `in_package: false`.

The three PASS frames survive and are asserted present:
`gcalls-cx-omnichannel-demo.webp`, `voicebot-flow-builder-demo.webp`,
`qc-scoring-dashboard-demo.webp`.

## Gates verified on the extracted final ZIP

| Gate | Result |
| --- | --- |
| `media-frames-test.php` (incl. `--expect-package`) | **29 ok, 0 failed** |
| `renderer-test.php` | **30 ok, 0 failed** — 0 DB writes, 1 read |
| Form artifacts / `Leads::` references | **0 / 0** |
| Six withheld assets present in package | **0** |
| Executable DB writers in changed PHP | **0** |
| Home page root sections in shipped data | **13** |
| Installed site vs final ZIP | **byte-identical** (`diff -rq`) |
