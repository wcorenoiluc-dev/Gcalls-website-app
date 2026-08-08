import { useMemo } from 'react'
import { SITE_ORIGIN } from '@/config/seo'
import { BLOG, buildResourceJsonLd } from '@/data/resources'
import {
  ResourcePageLayout,
  ResourceStatusSection,
} from '@/components/resources/sections'
import { BlogCategorySection } from '@/components/resources/bodies'

/**
 * `/blog/` — Checkpoint WEB-RES-001.
 *
 * An editorial foundation, not an article index. The page publishes the six
 * categories, the honest state of the blog, and routing into finished pages.
 *
 * Structured data is BreadcrumbList + FAQPage only. No `Article` or
 * `BlogPosting` node is emitted, because no article exists — see the note at
 * the head of `src/data/resources/index.ts`.
 *
 * Exactly one H1, in the hero.
 */
export function BlogPage() {
  const jsonLd = useMemo(() => buildResourceJsonLd(BLOG, SITE_ORIGIN), [])

  return (
    <ResourcePageLayout content={BLOG} jsonLd={jsonLd}>
      <BlogCategorySection content={BLOG} />
      <ResourceStatusSection id={BLOG.id} status={BLOG.status} tinted />
    </ResourcePageLayout>
  )
}
