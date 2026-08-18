import { useMemo } from 'react'
import {
  ArrowRight,
  CalendarClock,
  EyeOff,
  Image as ImageIcon,
  ListTree,
  MessageSquareQuote,
  PenLine,
} from 'lucide-react'
import { Link } from 'react-router'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { JsonLd } from '@/components/common/JsonLd'
import { Card, Container, Eyebrow, Section } from '@/components/common/primitives'
import { ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/site'
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import { buildToc, parseBody, type TocEntry } from '@/lib/blog/markdown'
import {
  BLOG_CTAS,
  DRAFT_ROBOTS,
  VISIBLE_ARTICLES,
  relatedArticles,
  type BlogArticleBody,
  type BlogArticleMeta,
} from '@/data/blog'
import { BlogBody } from './BlogBody'

/**
 * Blog article sections — Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * One layout for all eighteen articles. Everything that differs arrives from
 * `src/data/blog/`; nothing here authors copy.
 *
 * Exactly one H1 per page, rendered in `ArticleHero` from the catalog title.
 * The body grammar has no H1, so a second one cannot be introduced by an
 * author — see `src/lib/blog/markdown.ts`.
 */

/** `2026-08-15` → `15/08/2026`. */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/* ── Draft banner ────────────────────────────────────────────────────────── */

/**
 * Visible, unmissable statement that this page is not published.
 *
 * A draft route does not exist at all in a normal production build (see
 * `data/blog/visibility.ts`), so this banner only ever appears in development
 * or in the private review build. It states the exact robots directive the page
 * is shipping, so a reviewer can confirm the guard without opening devtools.
 */
export function DraftBanner() {
  return (
    <div
      role="status"
      className="w-full border-b border-brand-border"
      style={{ background: '#fff7ed' }}
    >
      <Container className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#9a3412]">
          <EyeOff size={14} aria-hidden="true" />
          Bản nháp — chưa xuất bản
        </span>
        {/*
          `min-w-0` + `break-all` are load-bearing, not decoration. DRAFT_ROBOTS
          is a 48-character unbroken token; without them it refuses to wrap and
          pushes the DOCUMENT 47px wide at 390px and 117px at 320px. Caught by
          scripts/capture-blog-batch-01.mjs.
        */}
        <span className="min-w-0 text-[13px] leading-relaxed text-[#7c2d12]">
          Trang này chỉ hiển thị trong môi trường phát triển hoặc bản demo nội bộ, và
          luôn gửi chỉ thị <code className="break-all font-mono">{DRAFT_ROBOTS}</code>.
        </span>
      </Container>
    </div>
  )
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

export function ArticleHero({ article }: { article: BlogArticleMeta }) {
  return (
    <section
      className="w-full pt-10 pb-10 sm:pt-14 sm:pb-14"
      style={{
        background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 60%, #ffffff 100%)',
      }}
    >
      <Container>
        <Breadcrumb
          trail={[
            { label: 'Tài nguyên', path: ROUTES.resources },
            { label: 'Blog', path: ROUTES.blog },
            { label: article.title },
          ]}
        />

        <div className="mt-6 max-w-3xl">
          <Eyebrow>{article.hubLabel}</Eyebrow>

          <h1 className="mt-5 text-[30px] font-extrabold leading-[1.18] tracking-tight text-foreground sm:text-[40px] lg:text-[46px]">
            {article.title}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {article.excerpt}
          </p>

          <dl className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <PenLine size={15} aria-hidden="true" className="text-brand" />
              <dt className="sr-only">Tác giả</dt>
              <dd>{article.author}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarClock size={15} aria-hidden="true" className="text-brand" />
              <dt className="sr-only">Cập nhật</dt>
              <dd>Cập nhật {formatDate(article.updatedAt)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Phân loại</dt>
              <dd>
                {article.contentTier === 'PILLAR' ? 'Bài nền tảng' : 'Bài chuyên đề'}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  )
}

/* ── Direct answer ───────────────────────────────────────────────────────── */

/**
 * The 40–80 word direct answer (§E).
 *
 * Rendered above the table of contents and marked up as a `<dl>` so the
 * question and its answer stay associated for assistive technology and for
 * anything extracting the pair.
 */
export function DirectAnswer({ body }: { body: BlogArticleBody }) {
  return (
    <Card className="mt-2 p-5 sm:p-7" highlighted>
      <dl>
        <dt className="text-[13px] font-bold uppercase tracking-wider text-brand">
          {body.directAnswer.question}
        </dt>
        <dd className="mt-3 text-[16px] font-medium leading-[1.7] text-foreground sm:text-[18px]">
          {body.directAnswer.answer}
        </dd>
      </dl>
    </Card>
  )
}

/* ── Table of contents ───────────────────────────────────────────────────── */

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null

  return (
    <nav
      aria-labelledby="muc-luc-heading"
      className="mt-8 rounded-[14px] border border-brand-border bg-surface-alt p-5 sm:p-6"
    >
      <h2
        id="muc-luc-heading"
        className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-foreground"
      >
        <ListTree size={16} aria-hidden="true" className="text-brand" />
        Mục lục
      </h2>

      <ol className="mt-4 flex flex-col gap-1">
        {entries.map((entry) => (
          <li key={entry.id} className={entry.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${entry.id}`}
              className="inline-flex min-h-11 items-center text-[15px] leading-snug text-muted-foreground underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function ArticleFaq({ body }: { body: BlogArticleBody }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-14">
      <h2
        id="faq-heading"
        className="flex items-center gap-2 text-[24px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
      >
        <MessageSquareQuote size={22} aria-hidden="true" className="text-brand" />
        Câu hỏi thường gặp
      </h2>

      <div className="mt-6">
        <FaqAccordion items={body.faq} idPrefix="article-faq" />
      </div>
    </section>
  )
}

/* ── Image production briefs (draft only) ────────────────────────────────── */

/**
 * The image briefs required by §K.
 *
 * These are PRODUCTION INSTRUCTIONS, not images. No `<img>` is rendered
 * anywhere in this file: no asset has been produced for Batch 1, and a
 * placeholder frame or a mocked-up screenshot would be a fabrication. The panel
 * is draft-only, so it disappears the moment an article is published.
 */
export function ImageBriefs({ body }: { body: BlogArticleBody }) {
  return (
    <section
      aria-labelledby="image-briefs-heading"
      className="mt-14 rounded-[14px] border border-dashed border-brand-border bg-surface-alt p-5 sm:p-6"
    >
      <h2
        id="image-briefs-heading"
        className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-wider text-foreground"
      >
        <ImageIcon size={16} aria-hidden="true" className="text-brand" />
        Brief ảnh — chưa sản xuất
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Bài viết này chưa có ảnh nào được sản xuất. Dưới đây là yêu cầu sản xuất, hiển
        thị trong bản nháp để phục vụ soát xét nội bộ. Không dùng ảnh cũ, không dựng
        ảnh chụp sản phẩm giả.
      </p>

      <ul className="mt-5 flex flex-col gap-4">
        {body.images.map((brief) => (
          <li
            key={brief.id}
            className="rounded-[10px] border border-brand-border bg-background p-4"
          >
            <p className="flex flex-wrap items-center gap-2">
              {/*
                `break-all` matters: statuses like PRODUCT_SCREENSHOT_REQUIRED
                are single 27-character tokens, and `flex-wrap` cannot break a
                word. Without it the pill measures 279px inside a 208px column
                at 320px and pushes the document 17px wide.
              */}
              <span className="max-w-full break-all rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {brief.status}
              </span>
              <span className="text-[14px] font-semibold text-foreground">
                {brief.role === 'featured' ? 'Ảnh đại diện' : 'Ảnh trong bài'} ·{' '}
                {brief.kind} · {brief.dimensions}
              </span>
            </p>

            <dl className="mt-3 flex flex-col gap-2 text-[14px] leading-relaxed">
              {(
                [
                  ['Nội dung thể hiện', brief.shows],
                  ['Vị trí', brief.placement],
                  ['Nguồn dự kiến', brief.source],
                  ['Yêu cầu che dữ liệu', brief.masking],
                  ['Alt text', brief.alt],
                  ['Khả năng tái sử dụng', brief.reusable],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="sm:flex sm:gap-3">
                  <dt className="shrink-0 font-semibold text-foreground sm:w-44">
                    {label}
                  </dt>
                  <dd className="text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {body.plannedLinks && body.plannedLinks.length > 0 && (
        <>
          <h3 className="mt-6 text-[15px] font-bold uppercase tracking-wider text-foreground">
            Liên kết đã lên kế hoạch — chưa render
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-[14px] leading-relaxed text-muted-foreground">
            {body.plannedLinks.map((link) => (
              <li key={link.label}>
                <span className="font-semibold text-foreground">{link.label}</span> —{' '}
                {link.target}. {link.reason}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */

/**
 * Article CTAs, drawn from the approved vocabulary in `data/blog/ctas.ts`.
 *
 * A CTA that lands on `/lien-he/` routes through the shared lead architecture
 * so the form arrives pre-scoped and the lead records where it came from.
 * Wayfinding CTAs to a product page stay bare links.
 */
export function ArticleCta({ article }: { article: BlogArticleMeta }) {
  const ctas = article.productCta.map((id) => BLOG_CTAS[id])

  return (
    <section
      aria-labelledby="article-cta-heading"
      className="mt-14 rounded-[14px] border-2 border-brand bg-brand-light p-5 sm:p-7"
    >
      <h2
        id="article-cta-heading"
        className="text-[20px] font-extrabold tracking-tight text-foreground sm:text-[24px]"
      >
        Bước tiếp theo
      </h2>

      <ul className="mt-5 flex flex-col gap-4">
        {ctas.map((cta) => {
          const isLeadRoute = cta.path === ROUTES.contact
          const href = isLeadRoute ? leadCtaHref(cta.lead) : cta.path

          return (
            <li key={cta.id} className="flex flex-col gap-2">
              <Link
                to={href}
                onClick={() =>
                  track('cta_clicked', {
                    label: cta.action,
                    source: cta.lead.source,
                    intent: cta.lead.intent,
                    ...(cta.lead.solution ? { solution: cta.lead.solution } : {}),
                    ...(cta.lead.product ? { product: cta.lead.product } : {}),
                  })
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-6 text-center text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto sm:justify-start"
              >
                {cta.action}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                {cta.detail}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ── Related ─────────────────────────────────────────────────────────────── */

export function RelatedArticles({ article }: { article: BlogArticleMeta }) {
  const related = useMemo(
    () => relatedArticles(article, VISIBLE_ARTICLES),
    [article],
  )

  if (related.length === 0) return null

  return (
    <Section tinted ariaLabelledBy="related-heading">
      <Container>
        <h2
          id="related-heading"
          className="text-[24px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
        >
          Bài liên quan
        </h2>

        <ul className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {related.map((item) => (
            <Card key={item.id} as="li" className="flex flex-col p-5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
                {item.hubLabel}
              </p>
              <h3 className="mt-2.5 text-[17px] font-bold leading-snug text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">
                {item.excerpt}
              </p>
              <Link
                to={item.url}
                className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Đọc bài này
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── Structured data ─────────────────────────────────────────────────────── */

/**
 * `Article` + `BreadcrumbList` + `FAQPage`, all generated FROM THE RENDERED
 * CONTENT so a node cannot describe something the page does not show.
 *
 * `image` is deliberately absent: no asset exists for Batch 1 and pointing the
 * node at a placeholder would publish a picture that is not there. `author` is
 * the editorial team, which is the real byline. `datePublished` is the
 * authoring date, not a backdated one.
 *
 * The nodes are emitted on drafts too. That is safe and deliberate: the page
 * ships `noindex,nofollow,noarchive,nosnippet,noimageindex`, and having the
 * schema present is what lets a reviewer validate it before publication rather
 * than after.
 */
export function ArticleJsonLd({
  article,
  body,
}: {
  article: BlogArticleMeta
  body: BlogArticleBody
}) {
  const data = useMemo(() => {
    const url = `${SITE_ORIGIN}${article.url}`

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': url,
          headline: article.title,
          description: article.metaDescription,
          url,
          inLanguage: 'vi-VN',
          articleSection: article.hubLabel,
          keywords: [article.primaryKeyword, ...article.secondaryKeywords],
          datePublished: article.createdAt,
          dateModified: article.updatedAt,
          author: { '@type': 'Organization', name: article.author },
          publisher: { '@type': 'Organization', name: 'Gcalls', url: `${SITE_ORIGIN}/` },
          isPartOf: { '@type': 'Blog', name: 'Blog Gcalls', url: `${SITE_ORIGIN}${ROUTES.blog}` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_ORIGIN}/` },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tài nguyên',
              item: `${SITE_ORIGIN}${ROUTES.resources}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Blog',
              item: `${SITE_ORIGIN}${ROUTES.blog}`,
            },
            { '@type': 'ListItem', position: 4, name: article.title, item: url },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: body.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      ],
    }
  }, [article, body])

  return <JsonLd id={`blog-${article.id}`} data={data} />
}

/* ── Page composition ────────────────────────────────────────────────────── */

export function BlogArticleView({
  article,
  body,
}: {
  article: BlogArticleMeta
  body: BlogArticleBody
}) {
  const blocks = useMemo(() => parseBody(body.body), [body])
  const toc = useMemo(() => buildToc(blocks), [blocks])

  return (
    <>
      <ArticleJsonLd article={article} body={body} />

      {article.status === 'draft' && <DraftBanner />}

      <ArticleHero article={article} />

      <Section className="!pt-0">
        <Container>
          <article className="mx-auto w-full max-w-[760px]">
            <DirectAnswer body={body} />
            <TableOfContents entries={toc} />
            <BlogBody blocks={blocks} />
            <ArticleFaq body={body} />
            <ArticleCta article={article} />
            {article.status === 'draft' && <ImageBriefs body={body} />}
          </article>
        </Container>
      </Section>

      <RelatedArticles article={article} />
    </>
  )
}
