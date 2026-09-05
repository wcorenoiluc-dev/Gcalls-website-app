import type { ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Info,
  Library,
  Newspaper,
  Route,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { Eyebrow, GradientHeading } from '@/components/common/primitives'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import type { Crumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import type { HubContent } from '@/data/hubs'

/**
 * Page-local layout for `/tai-nguyen/` — the Resources knowledge hub.
 *
 * WHY NOT THE SHARED HubLayout
 * This hub is editorial, not a product surface: it routes a reader to six
 * knowledge categories. It gets its own container width (1180), a lighter
 * section rhythm (~50px seams), a 3×2 editorial card grid with a distinct icon
 * and a distinct CTA per category, and NO product-dashboard imagery. The shared
 * `HubLayout` (used by the other five hubs) is untouched.
 *
 * All copy comes from `RESOURCES_HUB` in src/data/hubs.ts. This file adds no
 * page text and no content counts of its own. Exactly one H1, in the hero.
 */

/** Editorial icon per category — a knowledge-hub cue, never a product dashboard. */
const CARD_ICON: Record<string, { icon: LucideIcon; kind: string }> = {
  Blog: { icon: Newspaper, kind: 'bài viết' },
  Guides: { icon: Route, kind: 'lộ trình' },
  'Case Studies': { icon: ClipboardCheck, kind: 'tình huống triển khai' },
  Ebook: { icon: BookOpen, kind: 'tài liệu chuyên sâu' },
  Glossary: { icon: Library, kind: 'thuật ngữ' },
  FAQ: { icon: HelpCircle, kind: 'câu hỏi' },
}

function LocalContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-5 lg:px-8 ${className}`}>{children}</div>
}

export function ResourcesHubLayout({ content, trail }: { content: HubContent; trail: Crumb[] }) {
  const leadHref = leadCtaHref(content.lead)

  return (
    <>
      <JsonLd id="hub-resources" data={buildResourcesJsonLd(content, SITE_ORIGIN)} />

      {/* Breadcrumb */}
      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <LocalContainer>
          <Breadcrumb trail={trail} />
        </LocalContainer>
      </div>

      {/* Hero — light, not a big panel. */}
      <section
        aria-labelledby="resources-h1"
        className="w-full pt-12 pb-[50px] sm:pt-14"
        style={{ background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 60%, #ffffff 100%)' }}
      >
        <LocalContainer>
          <Eyebrow>{content.hero.eyebrow}</Eyebrow>
          <GradientHeading as="h1" id="resources-h1" className="mt-4 max-w-4xl">
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
        </LocalContainer>
      </section>

      {/* Direct answer */}
      <section aria-labelledby="resources-answer" className="w-full py-[50px]">
        <LocalContainer>
          <div className="max-w-3xl">
            <Eyebrow>{content.directAnswer.eyebrow}</Eyebrow>
            <GradientHeading id="resources-answer" className="mt-4">
              {content.directAnswer.question}
            </GradientHeading>
            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {content.directAnswer.answer}
            </p>
          </div>
        </LocalContainer>
      </section>

      {/* Six resource cards — 3×2 desktop, 2×3 tablet, 1 col mobile, equal height. */}
      <section aria-labelledby="resources-cards" className="w-full bg-brand-light/40 py-[50px]">
        <LocalContainer>
          <Eyebrow>{content.cards.eyebrow}</Eyebrow>
          <h2 id="resources-cards" className="mt-3 text-[26px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[30px]">
            {content.cards.h2}
          </h2>

          <ul
            data-cards-grid
            className="mt-9 grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {content.cards.items.map((item) => {
              const meta = CARD_ICON[item.title] ?? { icon: Info, kind: 'nội dung' }
              const Icon = meta.icon
              return (
                <li key={item.path} className="h-full">
                  <div className="flex h-full flex-col rounded-[16px] border border-brand-border bg-white p-6 shadow-[0_6px_24px_rgba(31,17,71,0.05)] transition-shadow duration-150 hover:shadow-[0_12px_34px_rgba(103,58,183,0.12)]">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-brand-light text-brand"
                      aria-hidden="true"
                    >
                      <Icon size={22} />
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
                            className="rounded-full bg-brand-light px-3 py-1 text-[12.5px] font-semibold text-brand"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-5">
                      <Link
                        to={item.path}
                        aria-label={`${item.cta} — ${meta.kind}`}
                        className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {item.cta}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Qualification note */}
          {content.cards.note && (
            <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
              <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {content.cards.note}
            </p>
          )}
        </LocalContainer>
      </section>

      {/* Onward links */}
      <section aria-labelledby="resources-links" className="w-full py-[50px]">
        <LocalContainer>
          <h2 id="resources-links" className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl">
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
        </LocalContainer>
      </section>

      {/* Final CTA — exactly one. */}
      <section aria-labelledby="resources-cta" className="w-full pb-[50px]">
        <FinalCtaBand
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.h2}
          titleId="resources-cta"
          description={content.finalCta.description}
          primary={content.finalCta.primaryCta}
          secondary={content.finalCta.secondaryCta}
          lead={content.lead}
          showPhone
        />
      </section>
    </>
  )
}

/** BreadcrumbList + CollectionPage(ItemList) + the hub's own single Q&A. No product/offer claim. */
function buildResourcesJsonLd(content: HubContent, origin: string) {
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
          itemListElement: content.cards.items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
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
