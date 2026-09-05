import { ArrowRight, Compass, Info } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import type { Crumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadAwareHref, leadCtaHref } from '@/lib/leads/ctaLink'
import type { HubCard, HubContent } from '@/data/hubs'
import {
  GROUP_A_PATHS,
  GROUP_B_PATHS,
  GROUP_LABELS,
  SOLUTION_GLYPH,
} from './solutionGlyphs'

/**
 * Page-local layout for `/giai-phap/`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT `hub/HubLayout`
 * ---------------------------------------------------------------------------
 * `HubLayout` renders five other approved hubs. This one needs a glyph per
 * card and the seven solutions split into two labelled groups so a 7-card grid
 * stays scannable — neither of which the other five may receive. So the shared
 * layout is untouched and this file exists instead.
 *
 * Like `HubLayout`, it contains NO page text: every string is read from the
 * `HubContent` passed in, so a content change never becomes a layout change.
 *
 * THE GROUPS ARE PRESENTATION ONLY. Seven solutions are one taxonomy; the two
 * headings exist to break up the grid. Any card whose path is in neither group
 * list still renders, in a third block, so a solution added to the data can
 * never silently vanish from the page.
 *
 * Exactly one H1.
 * ---------------------------------------------------------------------------
 */
export function SolutionsHubLayout({
  content,
  trail,
}: {
  content: HubContent
  trail: Crumb[]
}) {
  const leadHref = leadCtaHref(content.lead)
  const idBase = content.id

  const inGroup = (paths: readonly string[]) =>
    content.cards.items.filter((item) => paths.includes(item.path))

  const groupA = inGroup(GROUP_A_PATHS)
  const groupB = inGroup(GROUP_B_PATHS)
  /* Anything the two lists do not cover. Normally empty — rendering it anyway
     means a new solution shows up as an unstyled extra rather than disappearing. */
  const ungrouped = content.cards.items.filter(
    (item) => !GROUP_A_PATHS.includes(item.path) && !GROUP_B_PATHS.includes(item.path),
  )

  return (
    <div className="sh-page">
      <JsonLd id={`hub-${idBase}`} data={buildHubJsonLd(content, SITE_ORIGIN)} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={trail} />
        </Container>
      </div>

      {/* ── Hero. Light: copy and CTAs only, no mock dashboard. ────────── */}
      <section
        aria-labelledby={`${idBase}-h1`}
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>

            <GradientHeading as="h1" id={`${idBase}-h1`} className="mt-4">
              {content.hero.h1}
            </GradientHeading>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.hero.description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to={leadHref}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:whitespace-nowrap"
              >
                {content.hero.primaryCta.label}
              </Link>
              <Link
                to={content.hero.secondaryCta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:whitespace-nowrap"
              >
                {content.hero.secondaryCta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Direct answer — plain visible text, never collapsed ────────── */}
      <Section ariaLabelledBy={`${idBase}-answer`}>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>{content.directAnswer.eyebrow}</Eyebrow>

            <GradientHeading id={`${idBase}-answer`} className="mt-4">
              {content.directAnswer.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {content.directAnswer.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* ── The seven solutions, in two visual groups ──────────────────── */}
      <Section tinted ariaLabelledBy={`${idBase}-cards`}>
        <Container>
          <SectionHeader
            eyebrow={content.cards.eyebrow}
            title={content.cards.h2}
            titleId={`${idBase}-cards`}
            lead={content.cards.lead}
          />

          {/* Four cards: 2x2 from `sm`, staying 2x2 at `lg` so the row is even. */}
          <SolutionGroup
            label={GROUP_LABELS.a}
            items={groupA}
            lead={content.lead}
            className="mt-10 sm:grid-cols-2"
          />

          {/* Three cards: three columns at `lg`. At `sm` the third would sit
              alone in a half-width row, so it spans both tracks and is centred
              rather than leaving an empty track beside it. */}
          <SolutionGroup
            label={GROUP_LABELS.b}
            items={groupB}
            lead={content.lead}
            className="mt-12 sm:grid-cols-2 lg:grid-cols-3"
            centreLastAtTablet
          />

          {ungrouped.length > 0 && (
            <SolutionGroup
              label="Khác"
              items={ungrouped}
              lead={content.lead}
              className="mt-12 sm:grid-cols-2 lg:grid-cols-3"
            />
          )}

          {content.cards.note && <Note>{content.cards.note}</Note>}
        </Container>
      </Section>

      {/* ── Decision guide ────────────────────────────────────────────── */}
      {content.decisionGuide && (
        <Section ariaLabelledBy={`${idBase}-guide`}>
          <Container>
            <SectionHeader
              eyebrow={content.decisionGuide.eyebrow}
              eyebrowIcon={<Compass size={14} aria-hidden="true" />}
              title={content.decisionGuide.h2}
              titleId={`${idBase}-guide`}
              lead={content.decisionGuide.lead}
            />

            <ul className="mt-10 flex flex-col gap-4">
              {content.decisionGuide.rows.map((row) => (
                <Card
                  as="li"
                  key={row.path}
                  className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[1.4fr_1.2fr_auto] md:items-center md:gap-6"
                >
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                      Bài toán
                    </p>
                    <p className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
                      {row.problem}
                    </p>
                  </div>

                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                      Vì sao
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                      {row.reason}
                    </p>
                  </div>

                  <div className="md:justify-self-end">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                      Trang nên xem
                    </p>
                    <Link
                      to={leadAwareHref(row.path, content.lead)}
                      aria-label={`Trang nên xem: ${row.solution}`}
                      className="mt-1.5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {row.solution}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </Card>
              ))}
            </ul>

            {content.decisionGuide.note && <Note>{content.decisionGuide.note}</Note>}
          </Container>
        </Section>
      )}

      {/* ── Onward links ──────────────────────────────────────────────── */}
      <Section tinted ariaLabelledBy={`${idBase}-links`}>
        <Container>
          <h2
            id={`${idBase}-links`}
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {content.links.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {content.links.items.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Closing CTA — the only one on the page ─────────────────────── */}
      <Section ariaLabelledBy={`${idBase}-cta`}>
        <FinalCtaBand
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.h2}
          titleId={`${idBase}-cta`}
          description={content.finalCta.description}
          primary={content.finalCta.primaryCta}
          secondary={content.finalCta.secondaryCta}
          lead={content.lead}
          showPhone
        />
      </Section>
    </div>
  )
}

/**
 * One labelled group of solution cards.
 *
 * The group heading is an `h3` under the section's `h2`, so the two groups do
 * not compete with it for document structure.
 */
function SolutionGroup({
  label,
  items,
  lead,
  className = '',
  centreLastAtTablet = false,
}: {
  label: string
  items: readonly HubCard[]
  lead: HubContent['lead']
  className?: string
  centreLastAtTablet?: boolean
}) {
  if (items.length === 0) return null

  return (
    <div>
      <h3 className="text-[13px] font-bold uppercase tracking-wider text-brand">
        {label}
      </h3>

      <ul className={`grid grid-cols-1 gap-5 ${className}`}>
        {items.map((item, i) => {
          const Glyph = SOLUTION_GLYPH[item.path]
          const dangling =
            centreLastAtTablet && items.length % 2 === 1 && i === items.length - 1

          return (
            <Card
              as="li"
              key={item.path}
              className={`flex h-full flex-col p-6 sm:p-7 ${
                dangling
                  ? 'sm:col-span-2 sm:mx-auto sm:max-w-[calc(50%-0.625rem)] lg:col-span-1 lg:mx-0 lg:max-w-none'
                  : ''
              }`}
            >
              {Glyph && (
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-brand-light text-brand"
                  aria-hidden="true"
                >
                  <Glyph size={20} />
                </span>
              )}

              <h4 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                {item.title}
              </h4>

              {item.supportingLabel && (
                <p className="mt-1 text-sm font-semibold text-brand">
                  {item.supportingLabel}
                </p>
              )}

              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>

              {item.points && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full bg-brand-light px-3 py-1.5 text-[13px] font-semibold text-brand"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {/*
                One link per card and the only interactive element in it, so
                there are no nested links. `aria-label` names the destination in
                full: two cards share the visible label "Nhận tư vấn", which is
                ambiguous out of context.
              */}
              <div className="mt-auto pt-5">
                <Link
                  to={leadAwareHref(item.path, lead)}
                  aria-label={`${item.cta} — ${item.title}`}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {item.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          )
        })}
      </ul>
    </div>
  )
}

/** Scoping note. Same treatment the shared hubs use for qualifiers. */
function Note({ children }: { children: string }) {
  return (
    <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
      <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      {children}
    </p>
  )
}

/**
 * Hub structured data — identical in shape to the shared hubs'.
 *
 * The ItemList carries all seven solutions. Two of them have no page of their
 * own, so their `url` is the lead route with their attribution — the same
 * destination the card links to, rather than an invented path.
 */
function buildHubJsonLd(content: HubContent, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: content.breadcrumbLabel,
            item: `${origin}${content.route}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: content.hero.h1,
        description: content.directAnswer.answer,
        url: `${origin}${content.route}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: content.cards.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: `${origin}${item.path}`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: content.directAnswer.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: content.directAnswer.answer,
            },
          },
        ],
      },
    ],
  }
}
