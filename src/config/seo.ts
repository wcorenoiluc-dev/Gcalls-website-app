/**
 * Per-route SEO metadata.
 *
 * Titles and descriptions are authored per entity in `src/config/sitemap.ts`
 * and read from there — there is no template that generates metadata for
 * shells, so no two routes share a title or description.
 */

import { SITEMAP, ROUTES, getEntry } from './sitemap'

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
 * sitemap stays noindex even after the global flag is enabled.
 * ------------------------------------------------------------------------ */
export const ALLOW_INDEXING = import.meta.env.VITE_ALLOW_INDEXING === 'true'

/** Canonical origin. Override per environment at launch. */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN ?? 'https://gcalls.co'

export const SITE_NAME = 'Gcalls'
export const SITE_LOCALE = 'vi_VN'
export const DEFAULT_OG_TYPE = 'website'

export interface PageMeta {
  title: string
  description: string
  /** Use `title` verbatim, without the "| Gcalls" suffix. */
  exactTitle?: boolean
  /** False keeps this route noindex even once indexing is enabled globally. */
  indexable: boolean
}

const FALLBACK_META: PageMeta = {
  title: 'Không tìm thấy trang',
  description: 'Trang bạn tìm không tồn tại.',
  exactTitle: false,
  indexable: false,
}

export const PAGE_META: Record<string, PageMeta> = Object.fromEntries(
  SITEMAP.map((entry) => [
    entry.route,
    {
      title: entry.title,
      description: entry.description,
      exactTitle: entry.exactTitle,
      indexable: entry.indexable,
    },
  ]),
)

export function getPageMeta(path: string): PageMeta {
  return PAGE_META[path] ?? FALLBACK_META
}

export function buildTitle(meta: PageMeta): string {
  return meta.exactTitle ? meta.title : `${meta.title} | ${SITE_NAME}`
}

export function buildCanonical(path: string): string {
  return `${SITE_ORIGIN}${path}`
}

/** Robots directive for a specific route. */
export function buildRobots(path: string): string {
  const entry = getEntry(path)
  const routeIndexable = entry?.indexable ?? false
  return ALLOW_INDEXING && routeIndexable ? 'index, follow' : 'noindex, nofollow'
}

/** Kept for callers that only need the global default. */
export const ROBOTS_CONTENT = ALLOW_INDEXING ? 'index, follow' : 'noindex, nofollow'

export { ROUTES }
