import { useMemo } from 'react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { GP_FAQ, GP_FINAL_CTA, buildGcallsPlusJsonLd } from '@/data/gcallsPlus'
import { GcallsPlusHero } from '@/components/gcalls-plus/GcallsPlusHero'
import { GcallsPlusProblems } from '@/components/gcalls-plus/GcallsPlusProblems'
import { GcallsPlusOverview } from '@/components/gcalls-plus/GcallsPlusOverview'
import { GcallsPlusFeatures } from '@/components/gcalls-plus/GcallsPlusFeatures'
import { InteractionHistory } from '@/components/gcalls-plus/InteractionHistory'
import { CustomerContext } from '@/components/gcalls-plus/CustomerContext'
import { PerformanceSection } from '@/components/gcalls-plus/PerformanceSection'
import { IntegrationSection } from '@/components/gcalls-plus/IntegrationSection'
import { UseCases } from '@/components/gcalls-plus/UseCases'
import { DeploymentSection } from '@/components/gcalls-plus/DeploymentSection'
import { PricingCTA } from '@/components/gcalls-plus/PricingCTA'
import { CustomerStory } from '@/components/gcalls-plus/CustomerStory'

/**
 * `/gcalls-plus-webphone/` — Gcalls Plus Webphone product page.
 *
 * Positioning is deliberately narrow: browser-based Call Center / Webphone for
 * Sales and CSKH teams. The broader "nền tảng giao tiếp doanh nghiệp"
 * positioning belongs to Home and is not repeated here.
 *
 * All copy is locked and lives in `src/data/gcallsPlus.ts`, taken verbatim
 * from the approved SEO/AIO + Website Master source. All product visuals are
 * existing Gcalls demo mockups from `@/components/product-ui`, each labelled
 * as demo data so no dashboard figure reads as a marketing claim.
 *
 * Exactly one H1, in GcallsPlusHero.
 */
export function GcallsPlusPage() {
  const jsonLd = useMemo(() => buildGcallsPlusJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="gcalls-plus" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Sản phẩm' }, { label: 'Gcalls Plus Webphone' }]}
          />
        </Container>
      </div>

      {/* 01 */} <GcallsPlusHero />
      {/* 02 */} <GcallsPlusProblems />
      {/* 03 */} <GcallsPlusOverview />
      {/* 04 */} <GcallsPlusFeatures />
      {/* 05 */} <InteractionHistory />
      {/* 06 */} <CustomerContext />
      {/* 07 */} <PerformanceSection />
      {/* 08 */} <IntegrationSection />
      {/* 09 */} <UseCases />
      {/* 10 */} <DeploymentSection />
      {/* 11 */} <PricingCTA />
      {/* 12 */} <CustomerStory />

      {/* 13 */}
      <Section ariaLabelledBy="faq-gcalls-plus">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls Plus Webphone"
            titleId="faq-gcalls-plus"
          />
          <div className="mt-10">
            <FaqAccordion items={GP_FAQ} idPrefix="gp-faq" />
          </div>
        </Container>
      </Section>

      {/* 14 */}
      <Section tinted ariaLabelledBy="cta-gcalls-plus">
        <FinalCtaBand
          eyebrow={GP_FINAL_CTA.eyebrow}
          title={GP_FINAL_CTA.h2}
          titleId="cta-gcalls-plus"
          description={GP_FINAL_CTA.description}
          primary={GP_FINAL_CTA.primaryCta}
          secondary={GP_FINAL_CTA.secondaryCta}
          showPhone
        />
      </Section>
    </>
  )
}
