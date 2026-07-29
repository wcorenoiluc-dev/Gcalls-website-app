import { useMemo } from 'react'
import { ArrowRight, LifeBuoy, Users } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { JsonLd } from '@/components/common/JsonLd'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FeatureSplit } from '@/components/common/FeatureSplit'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { PricingCtaBand } from '@/components/common/PricingCtaBand'
import { ProductVisual } from '@/components/common/ProductVisual'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import {
  HD_BEFORE_AFTER,
  HD_BOUNDARIES,
  HD_CAPABILITIES,
  HD_DEPLOYMENT,
  HD_DIRECT_ANSWER,
  HD_FAQ,
  HD_FINAL_CTA,
  HD_HERO,
  HD_HOW_IT_WORKS,
  HD_OVERVIEW,
  HD_PLATFORMS,
  HD_PLATFORM_NOTE,
  HD_PLATFORM_SECTION,
  HD_PRICING,
  HD_PROBLEMS,
  HD_SUPPORT_CONTEXT,
  HD_TRUST,
  HD_USE_CASES,
  HELPDESK_LEAD,
  buildHelpdeskJsonLd,
} from '@/data/helpdeskIntegration'
import {
  HelpdeskFlowMockup,
  SupportContextMockup,
} from '@/components/helpdesk/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationPlatforms } from '@/components/integration/IntegrationPlatforms'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'

/**
 * `/tong-dai-tich-hop-helpdesk/` — Gcalls Call Center + Helpdesk (S02).
 *
 * A SOLUTION page answering "how does a support team connect calls with its
 * existing ticket workflow?". It is not a CRM page, not a Gcalls CX page and
 * not a vendor page.
 *
 * Built entirely on the S01 integration kit — hero, problems, workflow,
 * platforms, before/after, boundaries and steps are all shared components, so
 * this page adds no duplicate architecture.
 *
 * Constraints that shaped the build:
 *  - NO fake ticket UI. No Zendesk or Freshdesk interface is imitated; the
 *    support record is an abstract, unbranded panel in Gcalls' own design
 *    language. See `src/components/helpdesk/visuals.tsx`.
 *  - Automatic ticket creation and recording sync are NOT published — neither
 *    is evidenced. The page describes LINKING calls to existing records only.
 *  - Vendor keywords stay with /tich-hop/zendesk/ and /tich-hop/freshdesk/.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function HelpdeskIntegrationPage() {
  const jsonLd = useMemo(() => buildHelpdeskJsonLd(SITE_ORIGIN), [])
  const leadHref = leadCtaHref(HELPDESK_LEAD)

  return (
    <>
      <JsonLd id="helpdesk-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài tích hợp Helpdesk' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA routes through the shared lead form. */}
      <IntegrationHero
        eyebrow={HD_HERO.eyebrow}
        title={HD_HERO.h1}
        description={HD_HERO.description}
        keyPoints={HD_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: HD_HERO.primaryCta.label, path: leadHref }}
        secondaryCta={HD_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="420px">
            <HelpdeskFlowMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain visible text, never collapsed. */}
      <Section ariaLabelledBy="helpdesk-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="helpdesk-la-gi" className="mt-4">
              {HD_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {HD_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 */}
      <IntegrationProblems
        eyebrow={HD_PROBLEMS.eyebrow}
        title={HD_PROBLEMS.h2}
        titleId="bai-toan-helpdesk"
        items={HD_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow diagram */}
      <IntegrationWorkflow
        eyebrow={HD_OVERVIEW.eyebrow}
        title={HD_OVERVIEW.h2}
        titleId="tong-quan-helpdesk"
        steps={HD_OVERVIEW.flow}
      />

      {/* 05 — How it works */}
      <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
        <Container>
          <div id={HD_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={HD_HOW_IT_WORKS.eyebrow}
            title={HD_HOW_IT_WORKS.h2}
            titleId="cach-hoat-dong-heading"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HD_HOW_IT_WORKS.steps.map((step) => (
              <Card as="li" key={step.n} className="flex h-full flex-col p-6">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </Card>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 06 — Four core capabilities */}
      <Section ariaLabelledBy="nang-luc-helpdesk">
        <Container>
          <SectionHeader
            eyebrow={HD_CAPABILITIES.eyebrow}
            title={HD_CAPABILITIES.h2}
            titleId="nang-luc-helpdesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {HD_CAPABILITIES.items.map((item) => (
              <Card as="li" key={item.n} className="flex h-full flex-col p-6 sm:p-7">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {item.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 07 — Support context */}
      <FeatureSplit
        tinted
        eyebrow={HD_SUPPORT_CONTEXT.eyebrow}
        eyebrowIcon={<Users size={14} aria-hidden="true" />}
        title={HD_SUPPORT_CONTEXT.h2}
        titleId="support-context"
        description={HD_SUPPORT_CONTEXT.description}
        points={HD_SUPPORT_CONTEXT.points}
        visual={
          <ProductVisual maxWidth="380px">
            <SupportContextMockup />
          </ProductVisual>
        }
      />

      {/* 08 — Before / after workflow */}
      <IntegrationBeforeAfter
        eyebrow={HD_BEFORE_AFTER.eyebrow}
        title={HD_BEFORE_AFTER.h2}
        titleId="truoc-sau-helpdesk"
        before={HD_BEFORE_AFTER.before}
        after={HD_BEFORE_AFTER.after}
      />

      {/* 09 — Helpdesk ecosystem. Each card routes to the page owning its keyword. */}
      <IntegrationPlatforms
        eyebrow={HD_PLATFORM_SECTION.eyebrow}
        title={HD_PLATFORM_SECTION.h2}
        titleId="he-sinh-thai-helpdesk"
        platforms={HD_PLATFORMS}
        note={HD_PLATFORM_NOTE}
        cta={{ label: 'Tìm hiểu tích hợp', path: HD_PLATFORMS[2].path }}
      />

      {/* 10 — Support workflow use cases */}
      <Section ariaLabelledBy="use-case-helpdesk">
        <Container>
          <SectionHeader
            eyebrow={HD_USE_CASES.eyebrow}
            eyebrowIcon={<LifeBuoy size={14} aria-hidden="true" />}
            title={HD_USE_CASES.h2}
            titleId="use-case-helpdesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {HD_USE_CASES.items.map((item) => (
              <Card as="li" key={item.n} className="flex h-full flex-col p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                {'link' in item && item.link && (
                  <div className="mt-auto pt-5">
                    <Link
                      to={item.link.path}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {item.link.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 11 — Helpdesk / CRM / CX / Plus boundary */}
      <IntegrationBoundaries
        tinted
        eyebrow={HD_BOUNDARIES.eyebrow}
        title={HD_BOUNDARIES.h2}
        titleId="ranh-gioi-helpdesk"
        items={HD_BOUNDARIES.items}
        related={HD_BOUNDARIES.related}
      />

      {/* 12 — Implementation process */}
      <IntegrationSteps
        eyebrow={HD_DEPLOYMENT.eyebrow}
        title={HD_DEPLOYMENT.h2}
        titleId="trien-khai-helpdesk"
        steps={HD_DEPLOYMENT.steps}
      />

      {/* 13 — Trust. Neutral: no case, quote or figure is fabricated. */}
      <Section tinted ariaLabelledBy="workflow-thuc-te">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{HD_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="workflow-thuc-te" className="mt-4">
              {HD_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {HD_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={leadHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {HD_TRUST.cta.label}
              </Link>
              <Link
                to={HD_TRUST.link.path}
                className="inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {HD_TRUST.link.label}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 14 — Configuration & cost */}
      <PricingCtaBand
        eyebrow={HD_PRICING.eyebrow}
        title={HD_PRICING.h2}
        titleId="chi-phi-helpdesk"
        description={HD_PRICING.description}
        primary={HD_PRICING.primaryCta}
        secondary={HD_PRICING.secondaryCta}
      />

      {/* 15 — FAQ */}
      <Section tinted ariaLabelledBy="faq-helpdesk">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về tổng đài tích hợp Helpdesk"
            titleId="faq-helpdesk"
          />
          <div className="mt-10">
            <FaqAccordion items={HD_FAQ} idPrefix="hd-faq" />
          </div>
        </Container>
      </Section>

      {/* 16 — Final CTA */}
      <Section ariaLabelledBy="cta-helpdesk">
        <FinalCtaBand
          eyebrow={HD_FINAL_CTA.eyebrow}
          title={HD_FINAL_CTA.h2}
          titleId="cta-helpdesk"
          description={HD_FINAL_CTA.description}
          primary={HD_FINAL_CTA.primaryCta}
          lead={HELPDESK_LEAD}
          secondary={HD_FINAL_CTA.secondaryCta}
          showPhone
        />
      </Section>
    </>
  )
}
