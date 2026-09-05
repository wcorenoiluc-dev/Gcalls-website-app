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
import { PRODUCT_GLYPH, PRODUCT_MEDIA } from './productMedia'

/**
 * Page-local layout for `/san-pham/`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT `hub/HubLayout`
 * ---------------------------------------------------------------------------
 * `HubLayout` renders six hubs — `/giai-phap/`, `/tich-hop/`, `/nganh/`,
 * `/tai-nguyen/` and `/cong-ty/` as well as this one. The products hub needs
 * things the other five must not get: a media slot per card, a hero that shows
 * the three products as tiles, and a decision guide laid out as
 * problem → layer → destination. Adding those to the shared layout would move
 * five approved routes, so this file exists instead and `HubLayout` is
 * untouched.
 *
 * Like `HubLayout`, it contains NO page text: every string is read from the
 * `HubContent` passed in, so a content change never becomes a layout change.
 * The structured data is built the same way for the same reason.
 *
 * Exactly one H1.
 * ---------------------------------------------------------------------------
 */
export function ProductsHubLayout({
  content,
  trail,
}: {
  content: HubContent
  trail: Crumb[]
}) {
  const leadHref = leadCtaHref(content.lead)
  const idBase = content.id

  return (
    <div className="ph-page">
      <JsonLd id={`hub-${idBase}`} data={buildHubJsonLd(content, SITE_ORIGIN)} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={trail} />
        </Container>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────
          44% copy / 56% tiles. The tiles are the argument: three products,
          three different problems, side by side — which is what stops a
          visitor reading them as three price tiers. No dashboard, no KPI,
          no floating cards. */}
      <section
        aria-labelledby={`${idBase}-h1`}
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[44fr_56fr] lg:gap-14">
            {/* Copy first in DOM order → first on mobile. */}
            <div>
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

            {/* Tiles second. Purely presentational: the real, focusable
                navigation is the card list further down, so these carry no
                links and would otherwise duplicate every CTA on the page. */}
            <ul className="flex flex-col gap-3" aria-hidden="true">
              {content.cards.items.map((item) => {
                const Glyph = PRODUCT_GLYPH[item.path]
                return (
                  <li
                    key={item.path}
                    className="flex items-center gap-4 rounded-[14px] border border-brand-border bg-background/80 p-4 backdrop-blur-sm"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-brand-light text-brand">
                      {Glyph ? <Glyph size={22} /> : null}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold leading-snug text-foreground">
                        {item.title}
                      </p>
                      {item.supportingLabel && (
                        <p className="text-[12px] font-semibold text-brand">
                          {item.supportingLabel}
                        </p>
                      )}
                      <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                        {item.points?.join(' · ') ?? item.detail}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
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

      {/* ── Product cards ─────────────────────────────────────────────── */}
      <Section tinted ariaLabelledBy={`${idBase}-cards`}>
        <Container>
          <SectionHeader
            eyebrow={content.cards.eyebrow}
            title={content.cards.h2}
            titleId={`${idBase}-cards`}
            lead={content.cards.lead}
          />

          {/*
            Three columns from `lg`, two from `sm`, one below. At `sm` the third
            card would sit alone in a half-width row, so it is centred and
            spans both tracks rather than leaving an empty track beside it.
          */}
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.cards.items.map((item, i) => {
              const media = PRODUCT_MEDIA[item.path]
              const isDanglingAtTablet =
                content.cards.items.length % 2 === 1 &&
                i === content.cards.items.length - 1

              return (
                <Card
                  as="li"
                  key={item.path}
                  className={`flex h-full flex-col overflow-hidden ${
                    isDanglingAtTablet
                      ? 'sm:col-span-2 sm:mx-auto sm:max-w-[calc(50%-0.625rem)] lg:col-span-1 lg:mx-0 lg:max-w-none'
                      : ''
                  }`}
                >
                  {/* Fixed ratio so three cards line up whatever the media is. */}
                  {media && (
                    <figure className="m-0 border-b border-brand-border bg-brand-light/30 p-4">
                      <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden">
                        {media.node}
                      </div>
                      <figcaption className="mt-2.5 flex items-start gap-1.5 text-[12px] leading-snug text-muted-foreground">
                        <Info size={12} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                        {media.label}
                      </figcaption>
                    </figure>
                  )}

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
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

                    {/*
                      One link per card, and the only interactive element in it,
                      so there are no nested links. `aria-label` names the
                      destination in full — several cards' visible CTAs would
                      otherwise read alike out of context.
                    */}
                    <div className="mt-auto pt-5">
                      <Link
                        to={leadAwareHref(item.path, content.lead)}
                        aria-label={`${item.cta} — ${item.title}`}
                        className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {item.cta}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </ul>

          {content.cards.note && <Note>{content.cards.note}</Note>}
        </Container>
      </Section>

      {/* ── Decision guide: problem → layer → destination ──────────────── */}
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
              {content.decisionGuide.rows.map((row) => {
                /*
                  The integration row is not a fourth product: it routes to
                  `/giai-phap/`, and its own approved copy says so ("Đây là bài
                  toán giải pháp, không phải chọn sản phẩm"). It is marked as a
                  different KIND of row so the guide cannot be read as a
                  four-product list.
                */
                const isProduct = row.path in PRODUCT_MEDIA

                return (
                  <Card
                    as="li"
                    key={row.path}
                    className={`grid grid-cols-1 gap-4 p-6 md:grid-cols-[1.4fr_1.2fr_auto] md:items-center md:gap-6 ${
                      isProduct ? '' : 'border-dashed bg-brand-light/20'
                    }`}
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
                        {isProduct ? 'Lớp cần giải quyết' : 'Không phải chọn sản phẩm'}
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
                )
              })}
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
 * BreadcrumbList + CollectionPage with an ItemList of the hub's cards, plus a
 * FAQPage node carrying the hub's own direct answer. A hub makes no product,
 * offer, rating or availability claim, so none is emitted.
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
