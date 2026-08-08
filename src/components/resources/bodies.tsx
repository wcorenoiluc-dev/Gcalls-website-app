import { ArrowRight, ClipboardCheck, FolderTree, Info, Layers, Tag } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { ResourceLinkList } from './sections'
import type {
  BlogContent,
  CaseStudiesContent,
  EbookContent,
  GuidesContent,
} from '@/data/resources/types'

/**
 * The page-specific bodies for Blog, Guides, Case Studies and Ebook.
 *
 * These are the sections that must NOT be shared: an editorial category, an
 * operational journey, a filter dimension and a topic pathway carry different
 * information and collapsing them into one card component would flatten four
 * pages into one.
 *
 * Presentation only — all copy comes from `src/data/resources/*`.
 */

const CARD_LINK =
  'mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/* ── Blog: editorial categories ──────────────────────────────────────────── */

/**
 * Editorial categories.
 *
 * `topics` render as a bulleted list of SUBJECTS, never as links and never
 * styled as headlines, because an article that does not exist must not look
 * clickable. See the guard at the head of `src/data/resources/blog.ts`.
 */
export function BlogCategorySection({ content }: { content: BlogContent }) {
  const { categories } = content

  return (
    <Section ariaLabelledBy={`${content.id}-categories`}>
      <Container>
        <div id={categories.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={categories.eyebrow}
          eyebrowIcon={<FolderTree size={14} aria-hidden="true" />}
          title={categories.h2}
          titleId={`${content.id}-categories`}
          lead={categories.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.items.map((category) => (
            <Card as="li" key={category.id} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {category.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {category.detail}
              </p>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Chủ đề sẽ được viết
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {category.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    {topic}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                  Trang đã hoàn thiện
                </p>
                <ResourceLinkList links={category.links} />
              </div>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {categories.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Guides: operational journeys ────────────────────────────────────────── */

/**
 * The six guide paths.
 *
 * Each renders all four required parts. The question is the card's heading
 * because that is what a reader scans for; the title sits under it as the
 * label used elsewhere on the site.
 */
export function GuidePathSection({ content }: { content: GuidesContent }) {
  const { paths } = content

  return (
    <Section ariaLabelledBy={`${content.id}-paths`}>
      <Container>
        <div id={paths.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={paths.eyebrow}
          eyebrowIcon={<Layers size={14} aria-hidden="true" />}
          title={paths.h2}
          titleId={`${content.id}-paths`}
          lead={paths.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {paths.items.map((path) => (
            <Card as="li" key={path.id} className="flex h-full flex-col p-6">
              <div id={path.id} className="scroll-mt-24" />

              <div className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {path.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                    {path.question}
                  </h3>
                  <p className="mt-1.5 text-[15px] font-semibold text-brand">
                    {path.title}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Dành cho
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                {path.audience}
              </p>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Cần làm rõ những gì
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {path.checkpoints.map((checkpoint) => (
                  <li
                    key={checkpoint}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    {checkpoint}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Trang liên quan
              </p>
              <ResourceLinkList links={path.related} />

              <Link to={path.nextAction.path} className={CARD_LINK}>
                {path.nextAction.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </ol>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {paths.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Case studies: filter structure ──────────────────────────────────────── */

/**
 * The five filter dimensions.
 *
 * Rendered as STATIC descriptive cards, not as controls. A disabled filter
 * widget over an empty library would imply that entries exist and are merely
 * filtered out; a description of the taxonomy does not.
 */
export function CaseFilterSection({
  content,
  tinted = true,
}: {
  content: CaseStudiesContent
  tinted?: boolean
}) {
  const { filters } = content

  return (
    <Section tinted={tinted} ariaLabelledBy={`${content.id}-filters`}>
      <Container>
        <div id={filters.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={filters.eyebrow}
          eyebrowIcon={<Tag size={14} aria-hidden="true" />}
          title={filters.h2}
          titleId={`${content.id}-filters`}
          lead={filters.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filters.items.map((dimension) => (
            <Card as="li" key={dimension.id} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {dimension.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {dimension.detail}
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {dimension.values.map((value) => (
                  <li
                    key={value}
                    className="rounded-full border border-brand-border bg-surface-alt px-3 py-1.5 text-[13px] font-medium text-muted-foreground"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {filters.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Case studies: evidence checklist ────────────────────────────────────── */

export function EvidenceStandardSection({
  content,
  tinted = false,
}: {
  content: CaseStudiesContent
  tinted?: boolean
}) {
  const { standard } = content

  return (
    <Section tinted={tinted} ariaLabelledBy={`${content.id}-standard`}>
      <Container>
        <div id={standard.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={standard.eyebrow}
          eyebrowIcon={<ClipboardCheck size={14} aria-hidden="true" />}
          title={standard.h2}
          titleId={`${content.id}-standard`}
          lead={standard.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {standard.items.map((requirement) => (
            <Card as="li" key={requirement.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {requirement.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {requirement.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {requirement.detail}
              </p>
            </Card>
          ))}
        </ol>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {standard.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Ebook: topic pathways ───────────────────────────────────────────────── */

/**
 * The five subject areas.
 *
 * `contents` render as the questions a document would answer. There is no
 * cover, no title plate and no download control anywhere in this component —
 * see the guard at the head of `src/data/resources/ebook.ts`.
 */
export function EbookTopicSection({ content }: { content: EbookContent }) {
  const { topics } = content

  return (
    <Section ariaLabelledBy={`${content.id}-topics`}>
      <Container>
        <div id={topics.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={topics.eyebrow}
          eyebrowIcon={<Layers size={14} aria-hidden="true" />}
          title={topics.h2}
          titleId={`${content.id}-topics`}
          lead={topics.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {topics.items.map((topic) => (
            <Card as="li" key={topic.id} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {topic.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {topic.detail}
              </p>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Những câu hỏi cần trả lời
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {topic.contents.map((question) => (
                  <li
                    key={question}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    {question}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                  Trang đã hoàn thiện về chủ đề này
                </p>
                <ResourceLinkList links={topic.links} />
              </div>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {topics.note}
        </p>
      </Container>
    </Section>
  )
}
