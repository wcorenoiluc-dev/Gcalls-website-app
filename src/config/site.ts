/**
 * Site-level constants with NO dependencies.
 *
 * Extracted from `seo.ts` at Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * WHY THIS FILE EXISTS: `seo.ts` now reads the blog catalog so that article
 * routes get their own title, description and robots directive. The catalog in
 * turn needs `SITE_ORIGIN` to build canonical URLs. Left in `seo.ts`, that is a
 * module cycle, and because both modules initialise constants at module scope
 * the cycle fails at runtime with a temporal-dead-zone error rather than
 * degrading gracefully. Moving the leaf constants here breaks the cycle:
 * `seo.ts → data/blog/catalog.ts → config/site.ts`, one direction only.
 *
 * `seo.ts` re-exports everything below, so existing imports keep working.
 */

/** Canonical origin. Override per environment at launch. */
export const SITE_ORIGIN = import.meta.env.VITE_SITE_ORIGIN ?? 'https://gcalls.co'

export const SITE_NAME = 'Gcalls'
export const SITE_LOCALE = 'vi_VN'
export const DEFAULT_OG_TYPE = 'website'

/* ------------------------------------------------------------------------ *
 * SEARCH INDEXING — READ BEFORE CHANGING
 * ------------------------------------------------------------------------ *
 * The site currently ships `noindex, nofollow` on every route. This is
 * DELIBERATE for the pre-launch build and must not be removed casually.
 *
 * To enable indexing at go-live, set VITE_ALLOW_INDEXING=true in the
 * production environment (see docs/LAUNCH_CHECKLIST.md). Flipping this is a
 * conscious launch step, not a code change.
 *
 * Per-route control also exists: an entry with `indexable: false` in the
 * sitemap stays noindex even after the global flag is enabled. Blog articles
 * with `status: 'draft'` are stronger still — see `data/blog/visibility.ts`.
 * ------------------------------------------------------------------------ */
export const ALLOW_INDEXING = import.meta.env.VITE_ALLOW_INDEXING === 'true'
