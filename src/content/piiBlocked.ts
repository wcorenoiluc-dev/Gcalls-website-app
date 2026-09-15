/**
 * Product captures that must never ship or be selectable as media.
 *
 * `docs/content-review/images/product-media-manifest.json` (GCALLS-032)
 * records these five as PII_BLOCKED — the mask on each misses a real account
 * tag or other identifying value, no re-masked v2 exists, and the automated
 * sanitizer's own verdict for each is BLOCKED.
 *
 * Single source of truth, consumed by:
 *  - `vite.config.wordpress.ts` (excluded from the React Shell dist copy);
 *  - `src/content/manifest.ts` → `content-manifest.json#blockedMedia`, which
 *    Gcalls Content Studio uses to refuse the same files in its media picker.
 *
 * Do not remove an entry without independently confirming its v2 cleared the
 * sanitizer.
 */
export const PII_BLOCKED_IMAGE_FILENAMES: readonly string[] = [
  'gcalls-plus-webphone-desktop-v1.webp', // GP-09
  'gcalls-plus-contact-profile-desktop-v1.webp', // GP-10
  'gcalls-plus-integrations-desktop-v1.webp', // GP-12
  'gcalls-plus-advanced-filter-desktop-v1.webp', // GP-03
  'gcalls-plus-click-to-call-config-desktop-v1.webp', // GP-08
]
