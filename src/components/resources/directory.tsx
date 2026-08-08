import { ArrowRight, Hash, Info, LibraryBig, ListTree } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { INLINE_LINK } from './sections'
import type { FaqContent, GlossaryContent } from '@/data/resources/types'

/**
 * The glossary and site-wide FAQ bodies.
 *
 * Both are directories of many small entries, so both share the same shape: a
 * jump index, then one `<Section>` per group.
 *
 * ---------------------------------------------------------------------------
 * HEADING HIERARCHY
 * ---------------------------------------------------------------------------
 * Each GROUP is its own section with its own H2, and each entry inside it is an
 * H3. That is why the groups are not wrapped in one outer section with a
 * heading of its own — doing so would push entries to H4 in one case and leave
 * `FaqAccordion` (which renders its questions in an H3) mismatched in the
 * other. The page's single H1 stays in the hero.
 */

/* ── Glossary ────────────────────────────────────────────────────────────── */

/**
 * Jump index.
 *
 * Every term is listed, not just every group: a glossary index that only names
 * its six groups makes a reader hunt for the term they arrived for.
 */
export function GlossaryIndexSection({ content }: { content: GlossaryContent }) {
  const { index } = content

  return (
    <Section ariaLabelledBy={`${content.id}-index`}>
      <Container>
        <div id={index.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={index.eyebrow}
          eyebrowIcon={<ListTree size={14} aria-hidden="true" />}
          title={index.h2}
          titleId={`${content.id}-index`}
          lead={index.description}
        />

        <nav aria-label="Danh mục thuật ngữ" className="mt-10">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.groups.map((group) => (
              <Card as="li" key={group.id} className="flex h-full flex-col p-6">
                <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                  <a
                    href={`#${group.id}`}
                    className="inline-flex min-h-11 items-center rounded transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {group.label}
                  </a>
                </h3>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {group.terms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {term.term}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  )
}

/**
 * The term groups.
 *
 * Each term heading carries the anchor id that the index links to and that the
 * `DefinedTerm` nodes reference, plus a visible permalink control with an
 * accessible name — so an anchor is reachable by keyboard and by screen reader,
 * not only by reading the URL bar.
 */
export function GlossaryGroupsSection({ content }: { content: GlossaryContent }) {
  return (
    <>
      {content.groups.map((group, groupIndex) => (
        <Section
          key={group.id}
          /* Group 1 is tinted so it separates from the untinted index above. */
          tinted={groupIndex % 2 === 0}
          ariaLabelledBy={`${group.id}-heading`}
        >
          <Container>
            <div id={group.id} className="scroll-mt-24" />

            <div className="max-w-3xl">
              <h2
                id={`${group.id}-heading`}
                className="text-[26px] font-extrabold leading-[1.2] tracking-tight text-brand sm:text-[32px]"
              >
                {group.label}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {group.description}
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {group.terms.map((term) => (
                <Card as="li" key={term.id} className="flex h-full flex-col p-6">
                  <div id={term.id} className="scroll-mt-24" />

                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                      {term.term}
                    </h3>
                    <a
                      href={`#${term.id}`}
                      aria-label={`Liên kết tới mục ${term.term}`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-brand/70 transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Hash size={15} aria-hidden="true" />
                    </a>
                  </div>

                  {term.aka && term.aka.length > 0 && (
                    <p className="mt-1 text-[14px] italic leading-relaxed text-muted-foreground">
                      Còn gọi là: {term.aka.join(', ')}
                    </p>
                  )}

                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {term.definition}
                  </p>

                  {term.gcallsNote && (
                    <div className="mt-4 rounded-[10px] border border-brand-border bg-surface-alt p-4">
                      <p className="text-[13px] font-bold uppercase tracking-wider text-brand">
                        Liên quan tới Gcalls
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                        {term.gcallsNote}
                      </p>
                    </div>
                  )}

                  {term.link && (
                    <div className="mt-auto pt-3">
                      <Link to={term.link.path} className={INLINE_LINK}>
                        {term.link.label}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </Card>
              ))}
            </ul>

            {groupIndex === content.groups.length - 1 && (
              <p className="mx-auto mt-10 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
                <Info
                  size={15}
                  className="mt-0.5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                {content.note}
              </p>
            )}
          </Container>
        </Section>
      ))}
    </>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function FaqIndexSection({ content }: { content: FaqContent }) {
  const { index } = content

  return (
    <Section ariaLabelledBy={`${content.id}-index`}>
      <Container>
        <div id={index.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={index.eyebrow}
          eyebrowIcon={<LibraryBig size={14} aria-hidden="true" />}
          title={index.h2}
          titleId={`${content.id}-index`}
          lead={index.description}
        />

        <nav aria-label="Nhóm câu hỏi" className="mt-10">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.groups.map((group) => (
              <Card as="li" key={group.id} className="h-full">
                <a
                  href={`#${group.id}`}
                  className="flex h-full min-h-[104px] flex-col rounded-[14px] p-5 transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="flex items-center gap-1.5 text-base font-bold text-foreground">
                    {group.label}
                    <ArrowRight size={16} className="text-brand" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {group.description}
                  </span>
                  <span className="mt-3 text-[13px] font-semibold uppercase tracking-wider text-brand">
                    {group.items.length} câu hỏi
                  </span>
                </a>
              </Card>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  )
}

/**
 * The question groups.
 *
 * `FaqAccordion` renders exactly the array it is given, and the page's FAQPage
 * JSON-LD is built from the same groups flattened in the same order — so the
 * structured data matches the DOM question for question and answer for answer.
 */
export function FaqGroupsSection({ content }: { content: FaqContent }) {
  return (
    <>
      {content.groups.map((group, groupIndex) => (
        <Section
          key={group.id}
          /* Group 1 is tinted so it separates from the untinted index above. */
          tinted={groupIndex % 2 === 0}
          ariaLabelledBy={`${group.id}-heading`}
        >
          <Container>
            <div id={group.id} className="scroll-mt-24" />

            <SectionHeader
              eyebrow={`Nhóm ${groupIndex + 1}`}
              title={group.label}
              titleId={`${group.id}-heading`}
              lead={group.description}
            />

            <div className="mt-10">
              <FaqAccordion
                items={group.items}
                idPrefix={group.id}
                defaultOpenIndex={null}
              />
            </div>

            {groupIndex === content.groups.length - 1 && (
              <p className="mx-auto mt-10 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
                <Info
                  size={15}
                  className="mt-0.5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                {content.note}
              </p>
            )}
          </Container>
        </Section>
      ))}
    </>
  )
}
