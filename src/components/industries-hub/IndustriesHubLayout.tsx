import { ArrowRight, Info } from 'lucide-react'
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
import { HeroOrientationDiagram } from './HeroOrientationDiagram'
import { INDUSTRY_ICON } from './icons'

/**
 * Page-local layout for `/nganh/`.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT THE SHARED `HubLayout`
 * ---------------------------------------------------------------------------
 * `/nganh/` needs two things the shared hub skeleton does not give: a hero
 * orientation diagram and a per-card wayfinding icon. Rather than push those
 * into the shared component (which every other hub also renders), this track
 * builds a page-local layout over the SAME shared primitives and the SAME
 * `INDUSTRIES_HUB` source. It renders every field of the source — hero, direct
 * answer, six cards, the qualification note, onward links and the final CTA —
 * so nothing the content contract carries is dropped.
 *
 * Exactly one H1, rendered here in the hero.
 * ---------------------------------------------------------------------------
 */
export function IndustriesHubLayout({ content, trail }: { content: HubContent; trail: Crumb[] }) {
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

      {/* Hero — light: copy + orientation diagram. */}
      <section
        aria-labelledby={`${idBase}-h1`}
        className="w-full pt-12 pb-14 sm:pt-16 sm:pb-20"
        style={{ background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)' }}
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[44fr_56fr] lg:gap-14">
            <div>
              <Eyebrow>{content.hero.eyebrow}</Eyebrow>

              <GradientHeading as="h1" id={`${idBase}-h1`} className="mt-4">
                {content.hero.h1}
              </GradientHeading>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
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
            </div>

            <HeroOrientationDiagram items={content.cards.items} />
          </div>
        </Container>
      </section>

      {/* Direct answer */}
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

      {/* Six industry cards — 3x2 desktop, 2x3 tablet, 1 col mobile. */}
      <Section tinted ariaLabelledBy={`${idBase}-cards`}>
        <Container>
          <SectionHeader
            eyebrow={content.cards.eyebrow}
            title={content.cards.h2}
            titleId={`${idBase}-cards`}
            lead={content.cards.lead}
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.cards.items.map((item) => {
              const Icon = INDUSTRY_ICON[item.path]
              return (
                <Card as="li" key={item.path} className="flex h-full flex-col p-6 sm:p-7">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[11px] bg-brand-light text-brand"
                    aria-hidden="true"
                  >
                    {Icon && <Icon size={22} />}
                  </span>

                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                    {item.title}
                  </h3>

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
                    <Link
                      to={leadAwareHref(item.path, content.lead)}
                      aria-label={`${item.cta} (${item.title})`}
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

          {content.cards.note && (
            <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
              <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {content.cards.note}
            </p>
          )}
        </Container>
      </Section>

      {/* Onward links */}
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

      {/* Final CTA — exactly one. */}
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

/**
 * Hub structured data — BreadcrumbList + CollectionPage(ItemList) + FAQPage from
 * the hub's own direct answer. No product/offer/rating claim. Replicated here so
 * the page-local layout does not depend on the shared `HubLayout` internals.
 */
function buildHubJsonLd(content: HubContent, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: content.breadcrumbLabel, item: `${origin}${content.route}` },
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
            acceptedAnswer: { '@type': 'Answer', text: content.directAnswer.answer },
          },
        ],
      },
    ],
  }
}
