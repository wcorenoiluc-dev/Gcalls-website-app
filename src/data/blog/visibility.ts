/**
 * Draft visibility and robots policy for blog articles — §G of the checkpoint.
 *
 * ---------------------------------------------------------------------------
 * THE RULE
 * ---------------------------------------------------------------------------
 * Every article in Batch 1 has `status: 'draft'`. A draft:
 *
 *  · renders ONLY in development or in a private demo build that explicitly
 *    sets `VITE_BLOG_PREVIEW=true`;
 *  · is not routed at all in a normal production build, so the URL returns the
 *    site's 404 page rather than an unreviewed article;
 *  · never appears in the public archive listing;
 *  · always ships `noindex,nofollow,noarchive,nosnippet,noimageindex`,
 *    regardless of `VITE_ALLOW_INDEXING`.
 *
 * The last point is why `DRAFT_ROBOTS` is a constant rather than something
 * derived from `ALLOW_INDEXING`: flipping the global indexing switch at go-live
 * must not be able to publish a draft by accident. A draft becomes indexable
 * only by changing `status` in `catalog.ts`, which is a reviewed edit.
 * ---------------------------------------------------------------------------
 */

import { BLOG_CATALOG } from './catalog'
import type { BlogArticleMeta } from './types'

/**
 * The strongest available exclusion directive.
 *
 * `noindex,nofollow` alone still permits a snippet or a cached copy from an
 * external reference, which is exactly the leak a private demo must not have.
 */
export const DRAFT_ROBOTS = 'noindex,nofollow,noarchive,nosnippet,noimageindex'

/**
 * Whether draft articles render at all in this build.
 *
 * `import.meta.env.DEV` covers `npm run dev`. `VITE_BLOG_PREVIEW=true` covers
 * the private demo build used for content review. Neither is set in a normal
 * production build.
 */
export const BLOG_PREVIEW_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_BLOG_PREVIEW === 'true'

export function isVisible(article: BlogArticleMeta): boolean {
  return article.status !== 'draft' || BLOG_PREVIEW_ENABLED
}

/** Articles this build is allowed to render. Empty in production today. */
export const VISIBLE_ARTICLES: readonly BlogArticleMeta[] = BLOG_CATALOG.filter(isVisible)

/** Robots directive for a blog article route. */
export function blogRobots(article: BlogArticleMeta): string {
  return article.status === 'draft' ? DRAFT_ROBOTS : 'index, follow'
}
