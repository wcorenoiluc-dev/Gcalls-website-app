import { ArrowRight, Compass, Mail, Phone } from 'lucide-react'
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
import { BrandVisual } from './BrandVisual'

/**
 * Page-local layout for `/cong-ty/`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT `hub/HubLayout`
 * ---------------------------------------------------------------------------
 * `HubLayout` renders five other approved hubs. This one needs a hero split
 * carrying the official logo, principle cards without the card grid's link
 * chrome, and a contact block that reads directly from `CONTACT` — none of
 * which the other five may receive. The shared layout is untouched.
 *
 * Like `HubLayout`, it contains NO page text of its own: every string comes
 * from the `HubContent` passed in, or from `CONTACT`. Nothing about the
 * company is asserted here that the data does not already say.
 *
 * WHAT IS DELIBERATELY ABSENT: founding year, years in business, customer or
 * country counts, headcount, revenue, funding, awards, certifications, market
 * share, growth rate, uptime/SLA, named customers, a customer logo wall,
 * testimonials and partner logos. None is verifiable from this repository, and
 * the words "hàng đầu", "số một", "tiên phong" and "tốt nhất" appear nowhere.
 * `scripts/verify-company-hub.mjs` asserts each of those stays absent.
 *
 * Exactly one H1.
 * ---------------------------------------------------------------------------
 */
export function CompanyHubLayout({
  content,
  contact,
  trail,
}: {
  content: HubContent
  /** Read straight from `src/config/navigation.ts` — never copied. */
  contact: { email: string; phone: string; phoneHref: string }
  trail: Crumb[]
}) {
  const leadHref = leadCtaHref(content.lead)
  const idBase = content.id

  return (
    <div className="ch-page">
      <JsonLd id={`hub-${idBase}`} data={buildHubJsonLd(content, SITE_ORIGIN)} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={trail} />
        </Container>
      </div>

      {/* ── Hero: 52% copy / 48% brand visual ─────────────────────────── */}
      <section
        aria-labelledby={`${idBase}-h1`}
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[52fr_48fr] lg:gap-14">
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

            <BrandVisual />
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

      {/* ── The three principles, as numbered steps ────────────────────── */}
      <Section tinted ariaLabelledBy={`${idBase}-cards`}>
        <Container>
          <SectionHeader
            eyebrow={content.cards.eyebrow}
            title={content.cards.h2}
            titleId={`${idBase}-cards`}
            lead={content.cards.lead}
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.cards.items.map((item, i) => (
              <Card as="li" key={item.path} className="flex h-full flex-col p-6 sm:p-7">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>

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
              </Card>
            ))}
          </ol>

          {content.cards.note && <Note>{content.cards.note}</Note>}
        </Container>
      </Section>

      {/* ── The pages that say more about Gcalls ───────────────────────── */}
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
                  <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                    {row.solution}
                  </h3>

                  <p className="mt-2 text-[15px] font-semibold leading-snug text-foreground">
                    {row.problem}
                  </p>

                  <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">
                    {row.reason}
                  </p>

                  <div className="mt-auto pt-5">
                    <Link
                      to={leadAwareHref(row.path, content.lead)}
                      aria-label={`Xem trang ${row.solution}`}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Xem trang {row.solution}
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

      {/* ── Direct contact ─────────────────────────────────────────────── *
          Read from `CONTACT` and never duplicated here, so the address and the
          number cannot drift from the rest of the site. This is the single most
          checkable thing on the page, which is why it gets a section. */}
      <Section tinted ariaLabelledBy={`${idBase}-contact`}>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>LIÊN HỆ TRỰC TIẾP</Eyebrow>
            <h2
              id={`${idBase}-contact`}
              className="mt-4 text-[26px] font-extrabold tracking-tight text-foreground sm:text-[32px]"
            >
              Cách liên hệ với đội ngũ Gcalls
            </h2>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
            <Card as="li" className="flex h-full flex-col items-center p-6 text-center">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-brand-light text-brand"
                aria-hidden="true"
              >
                <Mail size={18} />
              </span>
              <p className="mt-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-1.5 inline-flex min-h-11 items-center justify-center text-lg font-extrabold tracking-tight text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {contact.email}
              </a>
            </Card>

            <Card as="li" className="flex h-full flex-col items-center p-6 text-center">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-brand-light text-brand"
                aria-hidden="true"
              >
                <Phone size={18} />
              </span>
              <p className="mt-3 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Điện thoại
              </p>
              <a
                href={contact.phoneHref}
                className="mt-1.5 inline-flex min-h-11 items-center justify-center text-lg font-extrabold tracking-tight text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {contact.phone}
              </a>
            </Card>
          </ul>
        </Container>
      </Section>

      {/* ── Onward links ──────────────────────────────────────────────── */}
      <Section ariaLabelledBy={`${idBase}-links`}>
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
      <Section tinted ariaLabelledBy={`${idBase}-cta`}>
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
      {children}
    </p>
  )
}

/**
 * Hub structured data — identical in shape to the shared hubs'.
 *
 * No Organization node is emitted. One would invite `foundingDate`,
 * `numberOfEmployees` and `award`, none of which is verified here, and the
 * homepage already carries the site's Organization node.
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
