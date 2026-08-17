import { useMemo } from 'react'
import { SITE_ORIGIN } from '@/config/seo'
import { BLOG, buildResourceJsonLd } from '@/data/resources'
import {
  ResourcePageLayout,
  ResourceStatusSection,
} from '@/components/resources/sections'
import { BlogCategorySection } from '@/components/resources/bodies'
import { BlogArchiveSection } from '@/components/blog/archive'

/**
 * `/blog/` — the archive. Checkpoint WEB-RES-001, extended at Checkpoint
 * GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * The page still publishes the editorial scope, the six categories and the
 * honest state of the blog. `BlogArchiveSection` adds the article listing and
 * renders NOTHING unless this build is allowed to show articles — every Batch 1
 * article is a draft, so a normal production build sees the page exactly as it
 * was before.
 *
 * Structured data stays BreadcrumbList + FAQPage. Still no `Article` or
 * `BlogPosting` node here: the archive is not an article, and the per-article
 * nodes are emitted on the article pages themselves, generated from the body
 * those pages render. See the note at the head of `src/data/resources/index.ts`.
 *
 * Exactly one H1, in the hero.
 */
export function BlogPage() {
  const jsonLd = useMemo(() => buildResourceJsonLd(BLOG, SITE_ORIGIN), [])

  return (
    <ResourcePageLayout content={BLOG} jsonLd={jsonLd}>
      <BlogArchiveSection />
      <BlogCategorySection content={BLOG} />
      <ResourceStatusSection id={BLOG.id} status={BLOG.status} tinted />
    </ResourcePageLayout>
  )
}
