import { useMemo } from 'react'
import { Section } from '@/components/common/primitives'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { SITE_ORIGIN } from '@/config/seo'
import { INTEGRATIONS_HUB } from '@/data/hubs'
import {
  IntegBreadcrumb,
  IntegDecisionGuide,
  IntegDirectAnswer,
  IntegHero,
  IntegOnwardLinks,
  IntegPlatformCards,
} from '@/components/integrations-hub/sections'

/**
 * `/tich-hop/` — Integrations hub.
 *
 * A dedicated navigation hub (not the generic HubLayout) so the five platforms
 * group correctly: CRM in three columns, Helpdesk in a balanced two, plus a
 * neutral Gcalls → connection-layer → CRM/Helpdesk/POS diagram. All copy is
 * read verbatim from `INTEGRATIONS_HUB` (locked in `src/data/hubs.ts`, not
 * edited here). POS is a decision-guide system type, never a sixth platform
 * card. Platform names are descriptive only — no logo, no partnership or
 * certification claim. Exactly one H1, in the hero.
 */
export function IntegrationsHubPage() {
  const jsonLd = useMemo(() => buildIntegrationsJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="hub-integrations" data={jsonLd} />

      {/* 01 */} <IntegBreadcrumb />
      {/* 02 */} <IntegHero />
      {/* 03 */} <IntegDirectAnswer />
      {/* 04 + 05 (cards + scoping note) */} <IntegPlatformCards />
      {/* 06 */} <IntegDecisionGuide />
      {/* 07 */} <IntegOnwardLinks />

      {/* 08 — the single final CTA */}
      <Section ariaLabelledBy="integrations-cta">
        <FinalCtaBand
          eyebrow={INTEGRATIONS_HUB.finalCta.eyebrow}
          title={INTEGRATIONS_HUB.finalCta.h2}
          titleId="integrations-cta"
          description={INTEGRATIONS_HUB.finalCta.description}
          primary={INTEGRATIONS_HUB.finalCta.primaryCta}
          secondary={INTEGRATIONS_HUB.finalCta.secondaryCta}
          lead={INTEGRATIONS_HUB.lead}
          showPhone
        />
      </Section>
    </>
  )
}

/**
 * Structured data — mirrors the shared hub graph: BreadcrumbList + CollectionPage
 * (ItemList of the five platform cards) + FAQPage (the hub's own direct answer).
 * No product, offer, rating or availability claim is emitted.
 */
function buildIntegrationsJsonLd(origin: string) {
  const H = INTEGRATIONS_HUB
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
            name: H.breadcrumbLabel,
            item: `${origin}${H.route}`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: H.hero.h1,
        description: H.directAnswer.answer,
        url: `${origin}${H.route}`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: H.cards.items.map((item, index) => ({
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
            name: H.directAnswer.question,
            acceptedAnswer: { '@type': 'Answer', text: H.directAnswer.answer },
          },
        ],
      },
    ],
  }
}
