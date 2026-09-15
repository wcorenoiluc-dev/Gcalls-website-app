import { useMemo } from 'react'
import '@/styles/pages-06-09.css'
import { ArrowRight, LifeBuoy, Users } from 'lucide-react'
import { Link } from 'react-router'
import { CtaLink } from '@/components/common/Button'
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
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'
import { HD_HOW_IT_WORKS_CONTENT, HD_PLATFORMS_CONTENT } from '@/content/sections/helpdeskIntegration'
import {
  HD_BEFORE_AFTER,
  HD_BOUNDARIES,
  HD_CAPABILITIES,
  HD_DEPLOYMENT,
  HD_DIRECT_ANSWER,
  HD_FAQ,
  HD_FAQ_SECTION,
  HD_FINAL_CTA,
  HD_HERO,
  HD_HOW_IT_WORKS,
  HD_OVERVIEW,
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
  const R = ROUTES.helpdeskIntegration
  const hero = useGcallsContent(R, 'hero', HD_HERO)
  const directAnswer = useGcallsContent(R, 'directAnswer', HD_DIRECT_ANSWER)
  const problems = useGcallsContent(R, 'problems', HD_PROBLEMS)
  const overview = useGcallsContent(R, 'overview', HD_OVERVIEW)
  const howItWorks = useGcallsContent(R, 'howItWorks', HD_HOW_IT_WORKS_CONTENT)
  const capabilities = useGcallsContent(R, 'capabilities', HD_CAPABILITIES)
  const supportContext = useGcallsContent(R, 'supportContext', HD_SUPPORT_CONTEXT)
  const beforeAfter = useGcallsContent(R, 'beforeAfter', HD_BEFORE_AFTER)
  const platforms = useGcallsContent(R, 'platforms', HD_PLATFORMS_CONTENT)
  const useCases = useGcallsContent(R, 'useCases', HD_USE_CASES)
  const boundaries = useGcallsContent(R, 'boundaries', HD_BOUNDARIES)
  const deployment = useGcallsContent(R, 'deployment', HD_DEPLOYMENT)
  const trust = useGcallsContent(R, 'trust', HD_TRUST)
  const pricing = useGcallsContent(R, 'pricing', HD_PRICING)
  const faq = useGcallsContent(R, 'faq', { ...HD_FAQ_SECTION, items: HD_FAQ })
  const finalCta = useGcallsContent(R, 'finalCta', HD_FINAL_CTA)

  return (
    /* Page-scoped heading + CTA polish — see src/styles/pages-06-09.css. */
    <div data-page="tong-dai-tich-hop-helpdesk">
      <JsonLd id="helpdesk-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-16 pb-3">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài tích hợp Helpdesk' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA routes through the shared lead form. */}
      <IntegrationHero
        eyebrow={hero.eyebrow}
        title={hero.h1}
        description={hero.description}
        keyPoints={hero.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: hero.primaryCta.label, path: leadHref }}
        secondaryCta={hero.secondaryCta}
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
              {directAnswer.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {directAnswer.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 */}
      <IntegrationProblems
        eyebrow={problems.eyebrow}
        title={problems.h2}
        titleId="bai-toan-helpdesk"
        items={problems.items}
      />

      {/* 04 — Overview + core flow diagram */}
      <IntegrationWorkflow
        eyebrow={overview.eyebrow}
        title={overview.h2}
        titleId="tong-quan-helpdesk"
        steps={overview.flow}
      />

      {/* 05 — How it works */}
      <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
        <Container>
          <div id={HD_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={howItWorks.eyebrow}
            title={howItWorks.h2}
            titleId="cach-hoat-dong-heading"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.steps.map((step) => (
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
            eyebrow={capabilities.eyebrow}
            title={capabilities.h2}
            titleId="nang-luc-helpdesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {capabilities.items.map((item) => (
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
        eyebrow={supportContext.eyebrow}
        eyebrowIcon={<Users size={14} aria-hidden="true" />}
        title={supportContext.h2}
        titleId="support-context"
        description={supportContext.description}
        points={supportContext.points}
        visual={
          <ProductVisual maxWidth="380px">
            <SupportContextMockup />
          </ProductVisual>
        }
      />

      {/* 08 — Before / after workflow */}
      <IntegrationBeforeAfter
        eyebrow={beforeAfter.eyebrow}
        title={beforeAfter.h2}
        titleId="truoc-sau-helpdesk"
        before={beforeAfter.before}
        after={beforeAfter.after}
      />

      {/* 09 — Helpdesk ecosystem. Each card routes to the page owning its keyword. */}
      <IntegrationPlatforms
        eyebrow={platforms.eyebrow}
        title={platforms.h2}
        titleId="he-sinh-thai-helpdesk"
        platforms={platforms.platforms}
        note={platforms.note}
        cta={{ label: 'Tìm hiểu tích hợp', path: platforms.platforms[2].path }}
      />

      {/* 10 — Support workflow use cases */}
      <Section ariaLabelledBy="use-case-helpdesk">
        <Container>
          <SectionHeader
            eyebrow={useCases.eyebrow}
            eyebrowIcon={<LifeBuoy size={14} aria-hidden="true" />}
            title={useCases.h2}
            titleId="use-case-helpdesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {useCases.items.map((item) => (
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
        eyebrow={boundaries.eyebrow}
        title={boundaries.h2}
        titleId="ranh-gioi-helpdesk"
        items={boundaries.items}
        related={boundaries.related}
      />

      {/* 12 — Implementation process */}
      <IntegrationSteps
        eyebrow={deployment.eyebrow}
        title={deployment.h2}
        titleId="trien-khai-helpdesk"
        steps={deployment.steps}
      />

      {/* 13 — Trust. Neutral: no case, quote or figure is fabricated. */}
      <Section tinted ariaLabelledBy="workflow-thuc-te">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{trust.eyebrow}</Eyebrow>
            <GradientHeading id="workflow-thuc-te" className="mt-4">
              {trust.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {trust.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaLink variant="primary" fullWidth to={leadHref}>
                {trust.cta.label}
              </CtaLink>
              <Link
                to={trust.link.path}
                className="inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {trust.link.label}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 14 — Configuration & cost */}
      <PricingCtaBand
        eyebrow={pricing.eyebrow}
        title={pricing.h2}
        titleId="chi-phi-helpdesk"
        description={pricing.description}
        primary={pricing.primaryCta}
        secondary={pricing.secondaryCta}
      />

      {/* 15 — FAQ */}
      <Section tinted ariaLabelledBy="faq-helpdesk">
        <Container>
          <SectionHeader
            eyebrow={faq.eyebrow}
            title={faq.h2}
            titleId="faq-helpdesk"
          />
          <div className="mt-10">
            <FaqAccordion items={faq.items} idPrefix="hd-faq" />
          </div>
        </Container>
      </Section>

      {/* 16 — Final CTA */}
      <Section ariaLabelledBy="cta-helpdesk">
        <FinalCtaBand
          eyebrow={finalCta.eyebrow}
          title={finalCta.h2}
          titleId="cta-helpdesk"
          description={finalCta.description}
          primary={finalCta.primaryCta}
          lead={HELPDESK_LEAD}
          secondary={finalCta.secondaryCta}
          showPhone
        />
      </Section>
    </div>
  )
}
