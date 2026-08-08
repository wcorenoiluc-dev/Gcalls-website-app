import { useMemo } from 'react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/seo'
import {
  INDUSTRIES,
  buildIndustryJsonLd,
  type IndustryKey,
} from '@/data/industries'
import {
  IndustryCapabilities,
  IndustryHero,
  IndustryImpact,
  IndustryOutcomes,
  IndustryProblem,
  IndustryRouting,
  IndustryWorkflow,
} from '@/components/industry/sections'

/**
 * The six `/nganh/…` pages — Checkpoint WEB-IND-001.
 *
 * ONE component for all six, selected by the `industry` prop the router passes.
 * They share a section order because that order is the approved content
 * hierarchy (problem → impact → capability → workflow → qualified outcome →
 * conversion), not because it was convenient: a page that opens with a feature
 * list is wrong for this site regardless of the industry.
 *
 * All copy lives in `src/data/industries/*`, which carries the claim guard.
 * Nothing on this page may state a figure, a saving, a timeline or a coverage
 * count — in particular Auto Dialer, outbound number rotation, "70+ quốc gia",
 * "30+ tích hợp" and every percentage in the ICP source are withheld. See
 * `src/data/industries/types.ts`.
 *
 * Exactly one H1, in IndustryHero.
 */
export function IndustryPage({ industry }: { industry: IndustryKey }) {
  const content = INDUSTRIES[industry]
  const jsonLd = useMemo(() => buildIndustryJsonLd(content, SITE_ORIGIN), [content])

  return (
    <>
      <JsonLd id={`industry-${content.id}`} data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[
              { label: 'Theo ngành', path: ROUTES.industries },
              { label: content.breadcrumbLabel },
            ]}
          />
        </Container>
      </div>

      {/* 01 */} <IndustryHero content={content} />
      {/* 02 · problem      */} <IndustryProblem content={content} />
      {/* 03 · impact       */} <IndustryImpact content={content} />
      {/* 04 · capability   */} <IndustryCapabilities content={content} />
      {/* 05 · workflow fit */} <IndustryWorkflow content={content} />
      {/* 06 · outcomes     */} <IndustryOutcomes content={content} />
      {/* 07 · routing      */} <IndustryRouting content={content} />

      {/* 08 */}
      <Section tinted ariaLabelledBy={`${content.id}-faq`}>
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title={`Câu hỏi thường gặp — ${content.breadcrumbLabel}`}
            titleId={`${content.id}-faq`}
          />
          <div className="mt-10">
            {/* Same array as the FAQPage JSON-LD, so the two cannot drift. */}
            <FaqAccordion items={content.faq} idPrefix={`${content.id}-faq`} />
          </div>
        </Container>
      </Section>

      {/* 09 */}
      <Section ariaLabelledBy={`${content.id}-cta`}>
        <FinalCtaBand
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.h2}
          titleId={`${content.id}-cta`}
          description={content.finalCta.description}
          primary={content.finalCta.primaryCta}
          lead={content.lead}
          showPhone
        />
      </Section>
    </>
  )
}
