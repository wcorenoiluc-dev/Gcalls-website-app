# CHECKPOINT — GCALLS-054 Demo Deployment Preflight (READ-ONLY)

**Date:** 2026-09-08 · **Mode:** read-only preflight, parallel to GCALLS-053 Phase F–G.
**Live changes made: NONE.** No upload, install, activate, settings save, cache purge, homepage apply,
form submit, email, DB write, corpus, import/publish. `gcalls.co` not contacted. No source edited.

## 1. Demo target — CONFIRMED
`https://ashernguyenxuanthuy.com/` — private content-review demo (`x-robots-tag: noindex,nofollow`),
site title "Gcalls", home/url self-consistent, no cross-domain redirect. Source of truth:
`GCALLS-BOSS-DEMO-CHECKLIST.md` + `RUNBOOK_003A`. Not gcalls.co. → `DEMO_TARGET_CONFIRMED`. See `demo-target.md`.

## 2. Admin session — NOT PRESENT
`/wp-admin/` → 302 `wp-login.php`. This session has no wp-admin/SSH/1Panel access. No password attempted.
The authenticated half of the audit is **blocked**; owner must log in at
`https://ashernguyenxuanthuy.com/wp-login.php`. → `DEMO_ADMIN_ACCESS` NOT granted.

## 3. Runtime fingerprint (anonymous)
| Component | Version | Source |
|---|---|---|
| Gcalls Core | **0.10.8** | frontend asset `?ver=` |
| Gcalls Theme | **0.8.5** | frontend asset `?ver=` |
| Elementor | **4.2.3** | asset `?ver=` + generator meta |
| Elementor Pro | not detected | no pro asset/namespace on frontend |
| RankMath (SEO) | present | REST namespace `rankmath/v1` |
| WordPress core version | **needs admin** | `generator` suppressed (RankMath); only Elementor generator exposed |
| PHP version | **needs admin** | not exposed on frontend |
| Cache/security/backup/SMTP/redirect/media plugins | **needs admin** | only `elementor` + `gcalls-core` emit frontend assets; RankMath via REST |
| Active theme | `gcalls-theme` | frontend assets |
| Site language / TZ | vi / Asia/Ho_Chi_Minh | REST |
→ `DEMO_RUNTIME_FINGERPRINT_CAPTURED`. Full data: `runtime-fingerprint.json`. **The demo currently runs
Core 0.10.8; the release to deploy is 0.10.11 (not built yet).**

## 4. Homepage baseline
Page id 13 · 200 · **one H1** ("Tổng Đài Ảo Tích Hợp CRM…") · **18** top-level Elementor sections · 0 inner ·
**67** widgets · form present · 0 horizontal overflow at 1440 and 390 · content hash `09bbc0f5…`.
Shots: `screenshots/home-1440.png`, `screenshots/home-390.png`. `_elementor_data` byte size / SHA =
**needs admin** (protected meta). Full: `homepage-baseline.json`.

## 5. 37-route baseline — PASS
**37/37** routes: HTTP 200, exactly one H1, 0 broken images, 0 horizontal overflow (1440 & 390 checked).
Per-route status/H1/sections/wordcount/shortcodes/broken/overflow/content-hash in
`route-baseline-before.json`. → `DEMO_37_ROUTE_BASELINE_CAPTURED`.

## 6. Blog protection baseline
**18 published posts** (REST `X-WP-Total = 18`), IDs/slugs/titles/dates/featured-media captured (no PII).
Anonymous draft enumeration correctly rejected (HTTP 400) → **draft count needs admin**; expected 163
migration drafts to be confirmed by owner. → `PROTECTED_18_BASELINE_CAPTURED`.
Files: `published-18-baseline.json`, `draft-count-baseline.json`.

## 7. Page-status baseline
**38 published pages** via REST, all `status: publish` (0 non-publish) — baseline to detect post-deploy
draft-flips / content loss. `page-status-baseline.json`.

## 8. Menu baseline
REST `wp/v2/menus` = **401** (auth required). Captured anonymous rendered nav instead: **36 header** +
**25 footer** links (label + href). Item IDs / parent-child / order = needs admin. `menu-baseline.json`.

## 9. Cache & OneShield — INFRA BLOCKER REPRODUCED
`/` and `/lien-he/` are full-page cached at the OneShield edge (`x-osh-cache: HIT` ~6/8), which **strips
all four security headers on HIT** and **ignores the query string** in the cache key (`?cb=` still HITs).
`/wp-login.php` never cached. → `INFRA_ONESHIELD_BLOCKED`, **`CONTACT_CACHE_UNSAFE`**. `/lien-he/` must be
excluded from full-page cache before any nonce form ships. See `cache-audit.md`.

## 10. SMTP — status unknown
Admin-only surface; no session → cannot read plugin/mailer/from-address/connection. No test email sent,
no secret read. → `SMTP_NOT_VERIFIED`. See `smtp-audit.md`.

## 11. Storage / upload readiness — needs admin
Disk free, upload limit, PHP post size, max execution time, plugin-upload availability, maintenance mode,
backup mechanism are all admin/host surfaces → **blocked** this session. No backup created (out of scope).

## 12. Rollback readiness — FILES ONLY
Core `0.10.8` and Theme `0.8.5` rollback ZIPs present locally (hashes in `rollback-readiness.md`); Core
`0.10.11` not built yet. **No live DB / menu / media / homepage `_elementor_data` snapshot** → content
rollback NOT ready. Importer rollback is insufficient. See `rollback-readiness.md`.

## 13. Phase-H manifest + runbook
Proposed in `phase-h-runbook.md` (11 ordered steps; include Core 0.10.11 + homepage artifact; exclude
articles/163 drafts/corpus/lead backend/SMTP/cache/PII). Not executed.

## 15. Final signals
Emit: `DEMO_TARGET_CONFIRMED`, `DEMO_RUNTIME_FINGERPRINT_CAPTURED`, `DEMO_37_ROUTE_BASELINE_CAPTURED`,
`PROTECTED_18_BASELINE_CAPTURED`.
Hold open: `DEMO_ADMIN_ACCESS_PASS` (no session), `CONTACT_CACHE_NOT_VERIFIED`→ resolved to
**`CONTACT_CACHE_UNSAFE`** + `INFRA_ONESHIELD_BLOCKED`, `SMTP_NOT_VERIFIED`, `INBOX_DELIVERY_NOT_VERIFIED`.
**`DEMO_DEPLOYMENT_PREFLIGHT_PASS` — PARTIAL:** anonymous baselines complete; blocked on admin session,
Core 0.10.11 build, DB/media snapshot, and the OneShield cache fix.

## Missing access / blockers for owner
1. wp-admin session (plugins, Elementor, drafts=163, SMTP, cache plugin, storage, `_elementor_data`).
2. Core `0.10.11` Phase-G-PASS ZIP (GCALLS-053).
3. Pre-deploy DB + uploads + menu + homepage-data snapshot (rollback).
4. OneShield config fix to exclude `/lien-he/` from full-page cache + restore security headers.
