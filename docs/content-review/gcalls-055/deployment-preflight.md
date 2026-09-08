# GCALLS-055 — deployment preflight

Prepared locally. **Nothing has been deployed.** Live was read read-only and not
written to at any point in this run.

---

## 1. The deployment target is not the site you may be thinking of

| Host | What it is | Published posts |
| --- | --- | --- |
| **ashernguyenxuanthuy.com** | **the demo/deploy target** | **18** |
| gcalls.co | the OLD site — not a target | 191 |
| v2.gcalls.co | does not resolve (connect failure) | — |

`gcalls.co` carries 191 published posts whose newest creation date is 2023‑07‑14
and newest modification 2024‑07‑03 — none of this project's work. GCALLS‑047
records the split directly: *"191 bài cũ publish · 18 trên demo"*. **Deploying to
gcalls.co would be wrong.**

Verified read-only on the demo host: `X-WP-Total` = **18 posts**, **38 pages**;
`/blog/` returns 200 and does not contain "Chưa có bài viết".

## 2. Currently installed on the demo host

Read from asset `?ver=` query strings:

| Component | Live now | Target |
| --- | --- | --- |
| gcalls-core | **0.10.8** | 0.10.11 |
| gcalls-theme | **0.8.5** | **0.8.7** (see §4) |
| Elementor | 4.2.3 | unchanged |

## 3. Artifacts to deploy

| File | Bytes | SHA-256 |
| --- | --- | --- |
| `gcalls-core-0.10.11.zip` | 517992 | `953a9970ead94debe7d595e30ea533a544cc305b83e63e1ca3721a0ad99eabde` |
| `gcalls-theme-0.8.7.zip` | 98980 | `b08fb85242f3fa8ccb8b3fcdb99134dc32bc4ffa6b0d9247272ab4b9710569f2` |

Built from commit `3154182`. Both in `wordpress/.release-053/`, listed in its
`SHA256SUMS`.

Two superseded 0.10.11 builds are retired outside the repo under `.bak` filenames
with their hashes recorded (`e1f0008b…`, `1d6f7042…`), so exactly one file named
`gcalls-core-0.10.11.zip` exists anywhere on disk.

## 4. The theme version is a deviation, and needs an owner decision

The instruction says deploy **Theme 0.8.6**. That is not possible as written.

The blog-index fix lives in `home.php` — the theme, not the plugin — so Core
0.10.11 cannot carry it. Shipping the changed theme as "0.8.6" would make that
number mean a third thing: **six** archives named `gcalls-theme-0.8.6.zip`
already exist with **six different SHA-256 values**. Their extracted contents are
byte-identical (content fingerprint
`13cb4457b1a325c3715f61320903f6e17391f6edf1f067e23075d090faa5a1fc`), so the
divergence is only zip metadata — but a seventh with genuinely *different*
content would make the version meaningless. `build-051-release.mjs` refuses to
invent a version bump for exactly this reason.

**Consequence: without a theme deploy, the blog fix does not reach live**, and
decision 3 is not satisfied. 0.8.7 is built and reproducible (rebuild yields an
identical hash).

## 5. Rollback — available and hash-verified

| Component | File | Bytes | SHA-256 (first 16) |
| --- | --- | --- | --- |
| Core 0.10.8 | `.release-047/gcalls-core-0.10.8.zip` | 504110 | `0357782e9786b214` |
| Theme 0.8.5 | `.deploy-043/rollback/gcalls-theme-0.8.5-d8d8615.zip` | 92237 | `83bc1ff8bc576020` |

The Core 0.10.8 hash matches the `supersetOf` baseline recorded in
`release-manifest.json`, so its provenance is confirmed rather than assumed.
A second byte-identical copy of the theme rollback exists under `.deploy-045/`.

**Not yet verified:** that these rollback ZIPs match the bytes actually installed
live. That requires an authenticated session and is part of the snapshot step.

## 6. Snapshots still to take — all require an authenticated wp-admin session

None of these can be produced from here:

- database snapshot
- uploads/media snapshot or recoverable backup
- active plugin/theme/version fingerprint
- menu snapshot
- homepage `_elementor_data` snapshot
- content-page manifest snapshot
- confirmation that the live theme bytes match the 0.8.5 rollback ZIP

## 7. Known obstacle to live verification

The edge WAF (OneShield, `/_osh/collect.js`) returned **403 Forbidden** on
`/wp-json/` after a short burst of requests, for both default and browser
User-Agents. Single-item header probes succeeded before the block. Probing was
stopped deliberately rather than retried, to avoid an IP-level block that would
obstruct deployment.

Consequences for the post-deploy read:
- Full per-post enumeration needs headless Chrome (the documented workaround) or
  an authenticated session — not bulk REST from a script.
- Pace the 38-route post-deploy re-read; do not hammer it.

## 8. What Phase G cannot tell us

`class-seo.php` forbids the plugin from emitting title/description/canonical
("Rank Math owns the `<head>`"), and Rank Math is in neither the artifact nor the
local fixture. So the rendered `<head>` **cannot be graded locally**. What was
verified is narrower: all 38 pages carry correct `rank_math_title` and
`rank_math_description` post meta, and every permalink equals its canonical
route. The head itself must be checked live, after deploy.
