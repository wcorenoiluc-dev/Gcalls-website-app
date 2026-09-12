# GCALLS-041 rollback

The candidate writes no option and runs no migration or cron on activation.
The one destructive action in this checkpoint — applying the home layout — is
an explicit admin button, and it takes its own snapshot before writing.

## Artifacts (both hash-verified in this run)

| Component | File | SHA-256 |
| --- | --- | --- |
| Core 0.10.0 | `~/Desktop/gcalls-core-0.10.0-release/gcalls-core-0.10.0.zip` | `929a55d6555cdd25ba94c71bf25a67b16eadf0762217cf369322e5340656d8f8` |
| Theme 0.8.5 | `~/Desktop/GCALLS-026-DEPLOY/gcalls-theme-0.8.5-d8d8615.zip` | `83bc1ff8bc5760204871c2b71f8f7eb7953a1e0158e466a38c185683db2833e8` |

Rollback goes to Core **0.10.0**, not 0.10.1: 0.10.1 is the build base and has
never been deployed (its directory is named `…-CANDIDATE-do-not-deploy-yet`).

## Procedure

1. **Home page layout first.** If the layout was applied, use
   *Gcalls → Home Layout → “Khôi phục layout trước đó”*. It restores the
   `_elementor_data` captured before the first apply. Do this BEFORE downgrading
   the plugin, because the rollback snapshot lives in a plugin option.
2. Deactivate and delete `Gcalls Core`, upload `gcalls-core-0.10.0.zip`, activate.
3. Upload `gcalls-theme-0.8.5-d8d8615.zip` and activate it.
4. Confirm the asset URLs report `0.10.0` and `0.8.5`.

## What rolling back restores

- The **six REFUSED images**, fetchable again by direct URL.
- The **fabricated Analytics dashboard** (114 · 73% · 3:25) on home section 11,
  because 0.10.0 and 0.10.1 both render `mock_analytics()`.
- The **eighteen-section** home page at the 104px rhythm.

A rollback is safe for the site and is a regression for the content-safety
decisions in GCALLS-039 §1 and GCALLS-040 §A. Weigh it accordingly.
