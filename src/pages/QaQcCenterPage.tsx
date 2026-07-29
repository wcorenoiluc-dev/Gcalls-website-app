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
  QQ_CONSULT_LEAD,
  QQ_DEMO_LEAD,
  QQ_FAQ,
  QQ_FINAL_CTA,
  QQ_PRICING,
  buildQaQcJsonLd,
} from '@/data/qaQcCenter'
import {
  QaQcBenefits,
  QaQcBoundaries,
  QaQcCapabilities,
  QaQcDashboard,
  QaQcDirectAnswer,
  QaQcHero,
  QaQcHowItWorks,
  QaQcHumanLoop,
  QaQcIntegration,
  QaQcOverview,
  QaQcProblems,
  QaQcScoring,
  QaQcSignals,
  QaQcStory,
  QaQcUseCases,
} from '@/components/qa-qc/sections'

/**
 * `/qc-bot-ai/` — QA QC Center, powered by QC Bot AI.
 *
 * ONE product, one page identity: "QA QC Center" is the product; "QC Bot AI"
 * names its AI capability. They are never presented as two products.
 *
 * Positioning is deliberately bounded to AI-supported call quality assurance.
 * Webphone belongs to /gcalls-plus-webphone/, omnichannel to /gcalls-cx/ and
 * CRM integration to /tong-dai-tich-hop-crm/ — see the boundaries section,
 * which routes each of those needs away from this page on purpose.
 *
 * All copy is locked and lives in `src/data/qaQcCenter.ts`, which also carries
 * the claim guard: nothing on this page may assert 100% coverage, guaranteed
 * accuracy, compliance certification, or that AI replaces human QA.
 *
 * Exactly one H1, in QaQcHero.
 */
export function QaQcCenterPage() {
  const jsonLd = useMemo(() => buildQaQcJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="qa-qc-center" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={[{ label: 'Sản phẩm' }, { label: 'QA QC Center' }]} />
        </Container>
      </div>

      {/* 01 */} <QaQcHero />
      {/* 02 */} <QaQcDirectAnswer />
      {/* 03 */} <QaQcProblems />
      {/* 04 */} <QaQcOverview />
      {/* 05 */} <QaQcHowItWorks />
      {/* 06 */} <QaQcCapabilities />
      {/* 07 */} <QaQcScoring />
      {/* 08 */} <QaQcSignals />
      {/* 09 */} <QaQcHumanLoop />
      {/* 10 */} <QaQcDashboard />
      {/* 11 */} <QaQcBenefits />
      {/* 12 */} <QaQcUseCases />
      {/* 13 */} <QaQcIntegration />
      {/* 14 */} <QaQcBoundaries />
      {/* 15 */} <QaQcStory />

      {/* 16 */}
      <PricingCtaBand
        eyebrow={QQ_PRICING.eyebrow}
        title={QQ_PRICING.h2}
        titleId="cau-hinh-chi-phi"
        description={QQ_PRICING.description}
        primary={QQ_PRICING.primaryCta}
        secondary={QQ_PRICING.secondaryCta}
      />

      {/* 17 */}
      <Section tinted ariaLabelledBy="faq-qa-qc">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về QA QC Center"
            titleId="faq-qa-qc"
          />
          <div className="mt-10">
            <FaqAccordion items={QQ_FAQ} idPrefix="qq-faq" />
          </div>
        </Container>
      </Section>

      {/* 18 */}
      <Section ariaLabelledBy="cta-qa-qc">
        <FinalCtaBand
          eyebrow={QQ_FINAL_CTA.eyebrow}
          title={QQ_FINAL_CTA.h2}
          titleId="cta-qa-qc"
          description={QQ_FINAL_CTA.description}
          /* Primary = demo request; secondary = plain consultation. Both go to
             the shared lead form, each carrying its own intent. */
          primary={QQ_FINAL_CTA.primaryCta}
          lead={QQ_DEMO_LEAD}
          secondary={{
            label: QQ_FINAL_CTA.secondaryCta.label,
            path: leadCtaHref(QQ_CONSULT_LEAD),
          }}
          showPhone
        />
      </Section>
    </>
  )
}
