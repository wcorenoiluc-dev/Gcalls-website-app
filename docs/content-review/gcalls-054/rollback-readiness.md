# Rollback Readiness

**Conclusion: NOT fully rollback-ready.** File-level rollback (plugin/theme ZIPs) is available locally,
but content/Elementor/menu/media rollback depends on a **live DB + uploads snapshot that does not exist
here** and requires the owner (no SSH/1Panel access from this session).

## Current live versions (rollback-to target)
- Gcalls Core **0.10.8** · Gcalls Theme **0.8.5** · Elementor **4.2.3** (from frontend asset `?ver=`).

## Local artifacts (SHA-256 short)
| Artifact | Present | File |
|---|---|---|
| Core ZIP = current live 0.10.8 | ✅ | `wordpress/.release-047/gcalls-core-0.10.8.zip` (`0357782e…`) |
| Core ZIP 0.10.10 | ✅ | `wordpress/.release-051/gcalls-core-0.10.10.zip` (`c1dd7c6b…`) |
| Theme ZIP = current live 0.8.5 | ✅ | `wordpress/.deploy-043/rollback/gcalls-theme-0.8.5-d8d8615.zip` (`83bc1ff8…`) |
| Core ZIP 0.10.0 (older rollback) | ✅ | `wordpress/.deploy-045/rollback/gcalls-core-0.10.0.zip` (`929a55d6…`) |
| **Core 0.10.11 (the release to deploy)** | ❌ **not built yet** | latest local is 0.10.10; GCALLS-053 owns the 0.10.11 build (Phase G) |
| Homepage Elementor source | ⚠️ source only | `wordpress/wp-content/plugins/gcalls-core/data/homepage-elementor.json` (78,731 B) — this is the *source artifact*, NOT a snapshot of the live homepage `_elementor_data` |
| Live homepage `_elementor_data` snapshot | ❌ | requires wp-admin/DB export (protected meta, not anonymously readable) |
| Database snapshot | ❌ | requires 1Panel/host; none local |
| Menu snapshot (exportable structure) | ❌ | REST `wp/v2/menus` = 401; only anonymous rendered nav captured |
| Media rollback strategy | ❌ | none captured |

## Why "importer rollback" is not enough (per brief §12)
The Gcalls Core importer can re-apply source content, but it cannot restore, if a deploy corrupts them:
updated **page content**, **Elementor `_elementor_data`**, **menus**, **plugin/theme files as they were
live**, or **media references**. A true rollback needs a pre-deploy **DB dump + uploads snapshot** plus
the current-version ZIPs. Only the ZIPs exist here.

## Required before Phase H (deployment) can claim rollback-ready
1. Owner takes a **1Panel/DB snapshot** (or `wp db export`) + **uploads/media snapshot** immediately
   before deploy, and confirms it is restorable.
2. Owner exports the current **menu structure** (Appearance → Menus, or authenticated REST).
3. Confirm the **live homepage `_elementor_data`** is exported (authenticated) so the homepage can be
   restored independently of the source artifact.
4. Keep the current-version ZIPs staged: Core `0.10.8`, Theme `0.8.5` (both present locally, hashes above).

Until 1–3 exist, rollback covers **files only**, not content/menus/media.
