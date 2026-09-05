# Contact Page UI V2 — Checkpoint

**Branch:** `feature/gcalls-contact-ui-v2` · **Base SHA:** `9c562e7`
**Worktree:** `/Users/macos/Desktop/Gcalls/App/Gcalls-contact-ui-v2`
**Server:** requested port 5216 (taken by another worker) → used **5217** (production preview) and
**5218** (dev, mock-endpoint, for transport states). Both stopped; ports freed.
**Preview:** `http://127.0.0.1:5217/lien-he/`
**Date:** 2026-09-05

## Outcome
`/lien-he/` rebuilt as a dedicated two-column contact layout: left column (≈40%) holds the single H1,
the page purpose, the two direct channels as real links and a short "what helps" list; right column
(≈60%) holds the shared `LeadForm` in its own panel. No product mockups, no dashboards, no eyebrow/
heading duplication, and no generic closing CTA band. The form shows **success only on a real
`ok:true`** — impossible on this route because no backend is configured.

## Ownership respected
- Edited: `src/pages/ContactPage.tsx`, new `src/components/contact/ContactInfoPanel.tsx`, test scripts,
  this docs folder.
- NOT edited (hash-verified identical to base — see changed-files.md): `LeadForm.tsx`,
  `submitLead.ts`, `navigation.ts`, `ctaLink.ts`. No shared-component change was needed, so no
  `shared-lead-form-change-proposal.md`.
- Global primitives, Homepage, estimator, product pages, WordPress: untouched.

## Content lock
- Email `sales@gcalls.co`, hotline `028 7302 5469`, `tel:+842873025469` — from `CONTACT`, unchanged.
- H1 = "Liên hệ" (approved sitemap label). Lead paragraph = approved sitemap `intro`. SEO title/meta
  come from the app-level `<Seo/>` (pathname-driven), unchanged by dropping RouteShell.
- No invented SLA / response-time promise.

## Gates (screenshots/metrics.json)
All PASS: `h1_exactly_1`, `overflow_zero` (1440→320), `brokenImages_zero`, `honeypot_hidden`,
`noDisabledFields_default`, `container_max_1180`, `mailto_present`, `tel_present`, `noDevNotice`,
`noRawShortcode`, `noSuccessOnContact`, `notConfiguredShown`, `fieldsPreservedAfterError`,
`pii_not_in_url`, `pii_not_in_console`, `attr_clean_shows`, `attr_hostile_no_injection`,
`attr_unlisted_suppressed`, regression all pass.
Only console message is the pre-existing site-wide `/favicon.ico` 404 (first load only; identical on
`/`) — not caused by this task.

## Signals
PASS: `CONTACT_CONTENT_PASS` · `CONTACT_DIRECT_CHANNELS_PASS` · `CONTACT_ATTRIBUTION_PASS` ·
`CONTACT_FORM_UI_LOCAL_PASS` · `CONTACT_PII_ZERO` · `CONTACT_PRODUCTION_WRITE_ZERO` ·
`CONTACT_REGRESSION_PASS` · `CONTACT_UI_REVIEW_PENDING_OWNER`
Held open (unchanged): `CONTACT_BACKEND_LIVE_BLOCKED` · `SMTP_NOT_VERIFIED` ·
`EDGE_CACHE_NOT_VERIFIED` · `INBOX_DELIVERY_NOT_VERIFIED`
NOT emitted: `FORM_LIVE_PASS`.

## Stop point
Local checkpoint commit after gates PASS. No push, no deploy, no WordPress, no real send, no SMTP/cache.
