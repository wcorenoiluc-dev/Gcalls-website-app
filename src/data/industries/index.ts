/**
 * Industry page registry — Checkpoint WEB-IND-001.
 *
 * Six industries share one page component and one set of section components;
 * everything that differs between them lives in the content files imported
 * here. Adding a seventh industry is a new content file, a `ROUTES` entry, a
 * sitemap entry and one line in `INDUSTRIES` — no new component.
 *
 * Read `./types.ts` first: it carries the content hierarchy and the claim guard
 * that all six files inherit.
 */

import { ROUTES } from '@/config/navigation'
import type { IndustryContent } from './types'
import { EDUCATION } from './education'
import { FINANCE } from './finance'
import { INSURANCE } from './insurance'
import { REAL_ESTATE } from './realEstate'
import { ECOMMERCE } from './ecommerce'
import { BPO } from './bpo'

export type { IndustryContent } from './types'

/** Keys match `IndustryContent.id`, and are what the router passes. */
export const INDUSTRIES = {
  education: EDUCATION,
  finance: FINANCE,
  insurance: INSURANCE,
  'real-estate': REAL_ESTATE,
  ecommerce: ECOMMERCE,
  bpo: BPO,
} as const

export type IndustryKey = keyof typeof INDUSTRIES

/**
 * Structured data for an industry page.
 *
 * `Service` rather than `Product`, for the same reason the Voicebot page uses
 * it: the approved positioning is consulting and integration. No `Offer`,
 * price, `AggregateRating` or `Review` is emitted — none is evidenced.
 *
 * The FAQ node is generated from the same array the page renders, so the two
 * cannot drift apart.
 */
export function buildIndustryJsonLd(content: IndustryContent, origin: string) {
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
            name: 'Theo ngành',
            item: `${origin}${ROUTES.industries}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: content.breadcrumbLabel,
            item: `${origin}${content.route}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: `Gcalls cho ngành ${content.breadcrumbLabel}`,
        serviceType: content.hero.h1,
        description: content.hero.description,
        provider: { '@type': 'Organization', name: 'Gcalls' },
        areaServed: 'VN',
        url: `${origin}${content.route}`,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: content.capability.h2,
          itemListElement: content.capability.items.map((item) => ({
            '@type': 'OfferCatalog',
            name: item.title,
            description: item.detail,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: content.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}
