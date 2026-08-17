import { ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import {
  BLOG_HUB_LABELS,
  BLOG_HUB_ORDER,
  VISIBLE_ARTICLES,
  type BlogArticleMeta,
  type BlogHubId,
} from '@/data/blog'

/**
 * The `/blog/` archive listing — Checkpoint
 * GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * Renders ONLY articles this build is allowed to show. In a normal production
 * build `VISIBLE_ARTICLES` is empty because every Batch 1 article is a draft,
 * so this section does not render at all and `/blog/` keeps publishing exactly
 * what it published before: the editorial scope and the honest content status.
 * That is the same guard `src/data/resources/blog.ts` has always carried — no
 * card that looks like an article may exist before the article does.
 *
 * Grouped by hub rather than by date because Batch 1 was authored in one pass:
 * a date-ordered list of eighteen articles sharing one date communicates
 * nothing, while the hub grouping is the editorial structure a reviewer needs.
 */

function ArticleCard({ article }: { article: BlogArticleMeta }) {
  return (
    <Card as="li" className="flex flex-col p-5">
      <p className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
        <span className="text-brand">
          {article.contentTier === 'PILLAR' ? 'Bài nền tảng' : 'Bài chuyên đề'}
        </span>
        {article.status === 'draft' && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px]"
            style={{ background: '#fff7ed', color: '#9a3412' }}
          >
            Bản nháp
          </span>
        )}
      </p>

      <h3 className="mt-2.5 text-[18px] font-bold leading-snug text-foreground">
        {article.title}
      </h3>

      <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>

      <Link
        to={article.url}
        className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Đọc bài này
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </Card>
  )
}

export function BlogArchiveSection() {
  if (VISIBLE_ARTICLES.length === 0) return null

  const byHub = BLOG_HUB_ORDER.map((hub: BlogHubId) => ({
    hub,
    label: BLOG_HUB_LABELS[hub],
    articles: VISIBLE_ARTICLES.filter((article) => article.hub === hub),
  })).filter((group) => group.articles.length > 0)

  return (
    <Section ariaLabelledBy="blog-archive-heading" tinted>
      <Container>
        <SectionHeader
          eyebrow="DANH SÁCH BÀI VIẾT"
          eyebrowIcon={<FileText size={14} aria-hidden="true" />}
          title="Bài viết theo nhóm chủ đề"
          titleId="blog-archive-heading"
          lead={`${VISIBLE_ARTICLES.length} bài viết đang ở trạng thái bản nháp, hiển thị để soát xét nội bộ. Mỗi bài đều gửi chỉ thị không lập chỉ mục và không xuất hiện trong bản dựng production.`}
          align="left"
        />

        <div className="mt-10 flex flex-col gap-12">
          {byHub.map((group) => (
            <section key={group.hub} aria-labelledby={`hub-${group.hub}`}>
              <h3
                id={`hub-${group.hub}`}
                className="text-[19px] font-extrabold tracking-tight text-foreground sm:text-[22px]"
              >
                {group.label}
                <span className="ml-2 text-[15px] font-semibold text-muted-foreground">
                  {group.articles.length} bài
                </span>
              </h3>

              <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {group.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  )
}
