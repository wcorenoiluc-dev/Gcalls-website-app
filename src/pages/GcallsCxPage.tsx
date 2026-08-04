import { useMemo } from 'react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { PricingCtaBand } from '@/components/common/PricingCtaBand'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import {
  CX_CONSULT_LEAD,
  CX_DEMO_LEAD,
  CX_FAQ,
  CX_FINAL_CTA,
  CX_PRICING,
  buildGcallsCxJsonLd,
} from '@/data/gcallsCx'
import {
  CxBenefits,
  CxBoundaries,
  CxChannels,
  CxCustomerContext,
  CxDeployment,
  CxDirectAnswer,
  CxHero,
  CxHowItWorks,
  CxInbox,
  CxIntegration,
  CxOverview,
  CxProblems,
  CxReporting,
  CxTickets,
  CxTrust,
  CxUseCases,
} from '@/components/gcalls-cx/sections'

/**
 * `/gcalls-cx/` — Gcalls CX, omnichannel Contact Center.
 *
 * Positioning is bounded: this page owns omnichannel contact center only.
 * Browser calling belongs to /gcalls-plus-webphone/, AI call QA to
 * /qc-bot-ai/, deep CRM workflow to /tong-dai-tich-hop-crm/ and cross-border
 * calling to /tong-dai-quoc-te/. The boundaries section routes each of those
 * needs away from this page on purpose — it is not a capability list.
 *
 * SCOPE: Auto Call / Auto Dialer is NOT published (no evidence in this
 * repository) and Voicebot belongs to /voicebot-ai/, not here. See the header of
 * `src/data/gcallsCx.ts`, which also carries the claim guard — no "không bỏ
 * sót lead", no "hỗ trợ mọi kênh", no unsupported percentage.
 *
 * Exactly one H1, in CxHero.
 */
export function GcallsCxPage() {
  const jsonLd = useMemo(() => buildGcallsCxJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="gcalls-cx" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={[{ label: 'Sản phẩm' }, { label: 'Gcalls CX' }]} />
        </Container>
      </div>

      {/* 01 */} <CxHero />
      {/* 02 */} <CxDirectAnswer />
      {/* 03 */} <CxProblems />
      {/* 04 */} <CxOverview />
      {/* 05 */} <CxChannels />
      {/* 06 */} <CxInbox />
      {/* 07 */} <CxTickets />
      {/* 08 */} <CxCustomerContext />
      {/* 09 */} <CxHowItWorks />
      {/* 10 */} <CxReporting />
      {/* 11 */} <CxBenefits />
      {/* 12 */} <CxUseCases />
      {/* 13 */} <CxIntegration />
      {/* 14 */} <CxBoundaries />
      {/* 15 */} <CxDeployment />
      {/* 16 */} <CxTrust />

      {/* 17 */}
      <PricingCtaBand
        tinted
        eyebrow={CX_PRICING.eyebrow}
        title={CX_PRICING.h2}
        titleId="cau-hinh-chi-phi-cx"
        description={CX_PRICING.description}
        primary={CX_PRICING.primaryCta}
        secondary={CX_PRICING.secondaryCta}
      />

      {/* 18 */}
      <Section ariaLabelledBy="faq-gcalls-cx">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls CX"
            titleId="faq-gcalls-cx"
          />
          <div className="mt-10">
            <FaqAccordion items={CX_FAQ} idPrefix="cx-faq" />
          </div>
        </Container>
      </Section>

      {/* 19 */}
      <Section tinted ariaLabelledBy="cta-gcalls-cx">
        <FinalCtaBand
          eyebrow={CX_FINAL_CTA.eyebrow}
          title={CX_FINAL_CTA.h2}
          titleId="cta-gcalls-cx"
          description={CX_FINAL_CTA.description}
          /* Primary = demo request; secondary = plain consultation. Both go to
             the shared lead form, each carrying its own intent. */
          primary={CX_FINAL_CTA.primaryCta}
          lead={CX_DEMO_LEAD}
          secondary={{
            label: CX_FINAL_CTA.secondaryCta.label,
            path: leadCtaHref(CX_CONSULT_LEAD),
          }}
          showPhone
        />
      </Section>
    </>
  )
}
