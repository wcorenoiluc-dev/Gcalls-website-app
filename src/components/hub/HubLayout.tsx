import type { ReactNode } from 'react'
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
import type { HubContent } from '@/data/hubs'

/**
 * Shared layout for the six navigation hubs.
 *
 * ---------------------------------------------------------------------------
 * WHY A HUB IS NOT A LANDING PAGE
 * ---------------------------------------------------------------------------
 * A hub's job is ROUTING: a visitor arriving from the header must understand
 * the category and leave for the right child page. It deliberately does NOT
 * reproduce the 15–17 section structure of a product or solution page, because
 * a hub that argues the whole case competes with the pages it is supposed to
 * send people to — and duplicates their keywords.
 *
 * Every hub therefore gets exactly the same skeleton:
 *   breadcrumb · hero + CTAs · direct answer · primary cards ·
 *   decision guidance (optional) · scoping note (optional) ·
 *   onward links · closing CTA
 *
 * All copy lives in `src/data/hubs.ts`. This file contains no page text at all,
 * so a content change never becomes a layout change.
 *
 * Exactly one H1 per hub, rendered here.
 */
export function HubLayout({
  content,
  trail,
  children,
}: {
  content: HubContent
  /** Breadcrumb tail after "Trang chủ". */
  trail: Crumb[]
  /** Hub-specific section rendered between the cards and the onward links. */
  children?: ReactNode
}) {
  const leadHref = leadCtaHref(content.lead)
  const idBase = content.id

  return (
    <>
      <JsonLd id={`hub-${idBase}`} data={buildHubJsonLd(content, SITE_ORIGIN)} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={trail} />
        </Container>
      </div>

      {/* Hero */}
      <section
        aria-labelledby={`${idBase}-h1`}
        className="w-full pt-12 pb-14 sm:pt-16 sm:pb-20"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          <Eyebrow>{content.hero.eyebrow}</Eyebrow>

          <GradientHeading as="h1" id={`${idBase}-h1`} className="mt-4 max-w-4xl">
            {content.hero.h1}
          </GradientHeading>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.hero.description}
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
            <Link
              to={leadHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {content.hero.primaryCta.label}
            </Link>
            <Link
              to={content.hero.secondaryCta.path}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {content.hero.secondaryCta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Direct answer — plain visible text, never collapsed. */}
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

      {/* Primary cards */}
      <Section tinted ariaLabelledBy={`${idBase}-cards`}>
        <Container>
          <SectionHeader
            eyebrow={content.cards.eyebrow}
            title={content.cards.h2}
            titleId={`${idBase}-cards`}
            lead={content.cards.lead}
          />

          <ul
            className={`mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
              content.cards.items.length % 3 === 0 ? 'lg:grid-cols-3' : ''
            }`}
          >
            {content.cards.items.map((item) => (
              <Card as="li" key={item.path} className="flex h-full flex-col p-6 sm:p-7">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.title}
                </h3>

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

                <div className="mt-auto pt-5">
                  {/* Same reason as the decision-guide row below: `/cong-ty/`'s
                      "Trao đổi với Gcalls" card points at `/lien-he/`. */}
                  <Link
                    to={leadAwareHref(item.path, content.lead)}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {item.cta}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            ))}
          </ul>

          {content.cards.note && <Note>{content.cards.note}</Note>}
        </Container>
      </Section>

      {children}

      {/* Decision guidance — problem in, destination out. */}
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

            <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {content.decisionGuide.rows.map((row) => (
                <Card as="li" key={row.path} className="flex h-full flex-col p-6">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                    Bài toán
                  </p>
                  <p className="mt-2 text-base font-semibold leading-snug text-foreground">
                    {row.problem}
                  </p>

                  <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                    Hướng phù hợp
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {row.reason}
                  </p>

                  <div className="mt-auto pt-5">
                    {/*
                      A guide row usually points at a content page, but the last
                      row on `/tich-hop/` points at `/lien-he/` ("my system is not
                      in the list") — a conversion, and it used to arrive with no
                      attribution at all. `leadAwareHref` tags only that case.
                    */}
                    <Link
                      to={leadAwareHref(row.path, content.lead)}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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

      {/* Onward internal links */}
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

      {/* Closing CTA */}
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
    </>
  )
}

/** Scoping note. Same treatment the solution pages use for qualifiers. */
export function Note({ children }: { children: string }) {
  return (
    <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
      <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      {children}
    </p>
  )
}

/**
 * Hub structured data.
 *
 * BreadcrumbList + CollectionPage with an ItemList of the hub's cards, plus a
 * FAQPage node carrying only the hub's own direct answer. A hub makes no
 * product, offer, rating or availability claim, so none is emitted.
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
