/**
 * Internal-link validation for blog bodies.
 *
 * §I of the checkpoint: a planned link whose target does not exist yet is
 * recorded in the editorial map and must NOT be rendered as a dead link. This
 * module is the enforcement point.
 *
 * A path is renderable only if it is a real site route or an article this build
 * actually renders. Anything else degrades to plain text — the sentence still
 * reads correctly, the reader never hits a 404, and
 * `scripts/verify-blog-batch-01.mjs` fails the build so the author finds out.
 */

import { ROUTES } from '@/config/navigation'
import { VISIBLE_ARTICLES } from '@/data/blog/visibility'

const SITE_PATHS = new Set<string>(Object.values(ROUTES))

const ARTICLE_PATHS = new Set<string>(VISIBLE_ARTICLES.map((article) => article.url))

/** True when `path` resolves to something this build can actually navigate to. */
export function isRenderableLink(path: string): boolean {
  if (path.startsWith('#')) return true
  return SITE_PATHS.has(path) || ARTICLE_PATHS.has(path)
}
