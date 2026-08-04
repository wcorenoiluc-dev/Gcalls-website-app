import { useMemo } from 'react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/seo'
import {
  VB_CONSULT_LEAD,
  VB_FAQ,
  VB_FINAL_CTA,
  buildVoicebotJsonLd,
} from '@/data/voicebotAi'
import {
  VoicebotCapabilities,
  VoicebotDeployment,
  VoicebotHero,
  VoicebotHowItWorks,
  VoicebotHumanAi,
  VoicebotIndustries,
  VoicebotIntegration,
  VoicebotOutcomes,
  VoicebotProblems,
  VoicebotUseCases,
} from '@/components/voicebot/sections'

/**
 * `/voicebot-ai/` — Gcalls Voicebot AI.
 *
 * Positioning is bounded: this page owns automated, script-driven call tasks.
 * AI call quality assurance belongs to /qc-bot-ai/, omnichannel conversations
 * to /gcalls-cx/, and deep CRM call workflow to /tong-dai-tich-hop-crm/ — the
 * integration section links to each rather than absorbing them.
 *
 * SCOPE. Voicebot was recorded as out of scope in `src/config/sitemap.ts` until
 * Checkpoint WEB-PRO-004 reversed that. The reversal added no product evidence:
 * this repository still holds no Voicebot config, estimator field or
 * screenshot. All copy lives in `src/data/voicebotAi.ts`, which carries the
 * claim guard — no saving figure, no accuracy figure, no concurrency, no
 * language count, no SLA, no fixed deployment duration, no named technology
 * vendor, and never "thay thế nhân viên".
 *
 * Exactly one H1, in VoicebotHero.
 */
export function VoicebotAiPage() {
  const jsonLd = useMemo(() => buildVoicebotJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="voicebot-ai" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[
              { label: 'Sản phẩm', path: ROUTES.products },
              { label: 'Gcalls Voicebot AI' },
            ]}
          />
        </Container>
      </div>

      {/* 01 */} <VoicebotHero />
      {/* 02 */} <VoicebotProblems />
      {/* 03 */} <VoicebotUseCases />
      {/* 04 */} <VoicebotHowItWorks />
      {/* 05 */} <VoicebotCapabilities />
      {/* 06 */} <VoicebotHumanAi />
      {/* 07 */} <VoicebotIntegration />
      {/* 08 */} <VoicebotIndustries />
      {/* 09 */} <VoicebotDeployment />
      {/* 10 */} <VoicebotOutcomes />

      {/* 11 */}
      <Section ariaLabelledBy="faq-voicebot">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Voicebot AI"
            titleId="faq-voicebot"
          />
          <div className="mt-10">
            {/* Same array as the FAQPage JSON-LD, so the two cannot drift. */}
            <FaqAccordion items={VB_FAQ} idPrefix="vb-faq" />
          </div>
        </Container>
      </Section>

      {/* 12 */}
      <Section ariaLabelledBy="cta-voicebot">
        <FinalCtaBand
          eyebrow={VB_FINAL_CTA.eyebrow}
          title={VB_FINAL_CTA.h2}
          titleId="cta-voicebot"
          description={VB_FINAL_CTA.description}
          primary={VB_FINAL_CTA.primaryCta}
          lead={VB_CONSULT_LEAD}
          showPhone
        />
      </Section>
    </>
  )
}
