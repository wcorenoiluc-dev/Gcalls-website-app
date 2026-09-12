# GCALLS-041 package manifest

| | Core | Theme |
| --- | --- | --- |
| File | `gcalls-core-0.10.4.zip` | `gcalls-theme-0.8.6.zip` |
| Bytes | 447 261 | 99 021 |
| SHA-256 | `b7dde3b8ca6b477cdbdefed52eee716a199d9a9fea8e16a946b86c8c6805321b` | `42a875db8bf3c6d6a934eee73dca8cc4013bb1730b24c61cc29c6afa9c389b66` |
| `unzip -t` | No errors detected | No errors detected |
| Root | one: `gcalls-core/` | one: `gcalls-theme/` |
| Files | 39 | 25 |

GCALLS-040 artifacts are kept for comparison at `wordpress/.release-040/`
(`gcalls-core-0.10.3.zip` `22eb0cdc…`, `gcalls-theme-0.8.6.zip` `3f3f8648…`).
Theme file CONTENT is unchanged from 040 (`diff -rq` clean); the zip hash
differs only through stored mtimes.

## Changelog 0.10.3 → 0.10.4

**§1 — the figure rule, applied everywhere it belongs**

`tiles()` now takes metric LABELS and renders `—`; it can no longer be handed a
value, so the fix cannot be undone by a future caller typing a number back in.
Removed figures:

| Mockup | Route | Was |
| --- | --- | --- |
| `hero` | home page | 84 · 73% · 5:24 · 11 |
| `cx_report` | `/gcalls-cx/` | 312 · 47, ticket counts, channel percentages |
| `voicebot_builder` | `/voicebot-ai/` | 480 · 312 · 198 · 24, outcome percentages |
| `qc_dashboard` | `/qc-bot-ai/` | 1.248 · 86 · 81 (QA score) · 34 |
| `qc_scorecard` | `/qc-bot-ai/` | proposed score 78 |

`qc_scorecard`'s criterion weights (20/30/30/20) are KEPT and marked
`gcalls-crit__w`: they define the rubric and sum to 100, rather than reporting
an outcome. That is the only exemption, and it is by class so nothing else
inherits it.

Captions default to the registry's fixed wording — `Giao diện minh hoạ ·
Dữ liệu mẫu` — and the label is 12px sentence case rather than 11px uppercase.

**§2 — navigation destinations**

32 restored in `data/content-pages.json`, each verified 200 on live before being
written. Card links gained an accessible name (`Tìm hiểu thêm về <title>`), so a
page carrying a dozen of them no longer presents a dozen links all reading
"Tìm hiểu thêm".

## Gates on the extracted final ZIP

| Gate | Result |
| --- | --- |
| `media-frames-test.php` (`--expect-package`) | **33 ok, 0 failed** |
| `renderer-test.php` | **30 ok, 0 failed** — 0 DB writes, 1 read |
| Final-output scan, 18 routes | **0 findings** |
| Form artifacts / `Leads::` | **0 / 0** |
| Six withheld REFUSED assets | **0 in package** |
| Acceptance, WP 7.1 + Elementor 4.2.3 | **90/90** |
