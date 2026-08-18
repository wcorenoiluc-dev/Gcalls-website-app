import { useEffect, useState } from 'react'
import { RouteFallback } from '@/components/common/RouteFallback'
import { BlogArticleView } from '@/components/blog/sections'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { BLOG_BY_SLUG, isVisible, loadArticleBody, type BlogArticleBody } from '@/data/blog'

/**
 * One component for all eighteen Batch 1 article routes.
 *
 * The route table passes the slug, so there is no path parameter and no risk of
 * a wildcard swallowing an unrelated root-level URL. Metadata is available
 * synchronously from the catalog; the body is code-split and loaded here.
 *
 * `isVisible` is re-checked even though the router only registers visible
 * articles. The router guard is what actually prevents a draft shipping to
 * production; this is the second lock, so a future refactor that loosens the
 * route table cannot silently publish an unreviewed article.
 */
export function BlogArticlePage({ slug }: { slug: string }) {
  const article = BLOG_BY_SLUG[slug]
  const [body, setBody] = useState<BlogArticleBody | null>(null)

  useEffect(() => {
    let cancelled = false

    setBody(null)
    void loadArticleBody(slug).then((loaded) => {
      if (!cancelled) setBody(loaded)
    })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!article || !isVisible(article)) return <NotFoundPage />
  if (!body) return <RouteFallback />

  return <BlogArticleView article={article} body={body} />
}
