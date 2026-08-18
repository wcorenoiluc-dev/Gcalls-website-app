/**
 * Per-route SEO metadata.
 *
 * Titles and descriptions are authored per entity in `src/config/sitemap.ts`
 * and read from there — there is no template that generates metadata for
 * shells, so no two routes share a title or description.
 *
 * BLOG ARTICLES (Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING) are the
 * one family of routes NOT in the sitemap. They are authored in
 * `src/data/blog/catalog.ts`, which owns their SEO title, meta description,
 * canonical and draft status, and they are merged in below. The sitemap stays
 * the source of truth for the site's *architecture*; the catalog is the source
 * of truth for the blog's *content*. Neither duplicates the other.
 *
 * The leaf constants live in `./site.ts` — see the note there for why.
 */

import { SITEMAP, ROUTES, getEntry } from './sitemap'
import { BLOG_CATALOG } from '@/data/blog/catalog'
import { blogRobots } from '@/data/blog/visibility'
import {
  ALLOW_INDEXING,
  DEFAULT_OG_TYPE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_ORIGIN,
} from './site'

export { ALLOW_INDEXING, DEFAULT_OG_TYPE, SITE_LOCALE, SITE_NAME, SITE_ORIGIN }

export interface PageMeta {
  title: string
  description: string
  /** Use `title` verbatim, without the "| Gcalls" suffix. */
  exactTitle?: boolean
  /** False keeps this route noindex even once indexing is enabled globally. */
  indexable: boolean
  /**
   * An explicit robots directive that overrides everything else, including the
   * global indexing flag. Only blog drafts set this — see `blogRobots`.
   */
  robots?: string
  /** Open Graph type. Articles override the site default. */
  ogType?: string
}

const FALLBACK_META: PageMeta = {
  title: 'Không tìm thấy trang',
  description: 'Trang bạn tìm không tồn tại.',
  exactTitle: false,
  indexable: false,
}

const SITEMAP_META: Record<string, PageMeta> = Object.fromEntries(
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

/**
 * Blog article metadata.
 *
 * `exactTitle` is true because an article's SEO title is authored whole; a
 * "| Gcalls" suffix would push several of them past a useful length and none
 * of them needs the brand repeated. `indexable` is false for every draft and
 * `robots` carries the stronger directive.
 */
const BLOG_META: Record<string, PageMeta> = Object.fromEntries(
  BLOG_CATALOG.map((article) => [
    article.url,
    {
      title: article.seoTitle,
      description: article.metaDescription,
      exactTitle: true,
      indexable: article.status !== 'draft',
      robots: blogRobots(article),
      ogType: 'article',
    },
  ]),
)

export const PAGE_META: Record<string, PageMeta> = {
  ...SITEMAP_META,
  ...BLOG_META,
}

export function getPageMeta(path: string): PageMeta {
  return PAGE_META[path] ?? FALLBACK_META
}

export function buildTitle(meta: PageMeta): string {
  return meta.exactTitle ? meta.title : `${meta.title} | ${SITE_NAME}`
}

export function buildCanonical(path: string): string {
  return `${SITE_ORIGIN}${path}`
}

/**
 * Robots directive for a specific route.
 *
 * An explicit `robots` on the meta wins unconditionally. That is what stops
 * `VITE_ALLOW_INDEXING=true` at go-live from publishing an unreviewed draft:
 * the draft's directive is not derived from the flag at all.
 */
export function buildRobots(path: string): string {
  const meta = PAGE_META[path]
  if (meta?.robots) return meta.robots

  const entry = getEntry(path)
  const routeIndexable = entry?.indexable ?? false
  return ALLOW_INDEXING && routeIndexable ? 'index, follow' : 'noindex, nofollow'
}

/** Open Graph type for a route. */
export function buildOgType(path: string): string {
  return PAGE_META[path]?.ogType ?? DEFAULT_OG_TYPE
}

/** Kept for callers that only need the global default. */
export const ROBOTS_CONTENT = ALLOW_INDEXING ? 'index, follow' : 'noindex, nofollow'

export { ROUTES }
