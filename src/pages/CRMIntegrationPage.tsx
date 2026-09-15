import { useMemo, type ReactNode } from 'react'
import '@/styles/pages-06-09.css'
import { Database, Headset, MousePointerClick, Target, Users } from 'lucide-react'
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
import {
  ProductVisual,
  ProductVisualWithSupport,
} from '@/components/common/ProductVisual'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'
import { CRM_HOW_IT_WORKS_CONTENT, CRM_PLATFORMS_CONTENT } from '@/content/sections/crmIntegration'
import {
  CRMMockup,
  CallTimelineMockup,
  CustomerPopupMockup,
  DialpadMockup,
  WidgetMockup,
} from '@/components/product-ui'
import {
  CRM_BEFORE_AFTER,
  CRM_BOUNDARIES,
  CRM_CAPABILITIES,
  CRM_CONTEXT,
  CRM_DATA_SYNC,
  CRM_DEPLOYMENT,
  CRM_DIRECT_ANSWER,
  CRM_FAQ,
  CRM_FAQ_SECTION,
  CRM_FINAL_CTA,
  CRM_HERO,
  CRM_HOW_IT_WORKS,
  CRM_LEAD,
  CRM_OVERVIEW,
  CRM_PRICING,
  CRM_PROBLEMS,
  CRM_SALES_USE_CASE,
  CRM_SERVICE_USE_CASE,
  CRM_TRUST,
  buildCrmJsonLd,
} from '@/data/crmIntegration'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationPlatforms } from '@/components/integration/IntegrationPlatforms'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'

/**
 * `/tong-dai-tich-hop-crm/` — Gcalls Call Center + CRM integration (S01).
 *
 * This is a SOLUTION page answering "how do I connect my calling workflow with
 * my existing CRM?". It is not a product page, not a vendor page and not a
 * generic CRM explainer.
 *
 * Three constraints shaped the build:
 *  - No third-party CRM UI is depicted. Every visual is an existing approved
 *    Gcalls demo mockup from `@/components/product-ui`; no HubSpot, Salesforce
 *    or Zoho screen is fabricated, and no mockup is presented as belonging to
 *    a third-party product.
 *  - No capability behaves identically across platforms and no universal
 *    synchronisation is described — scope always defers to configuration. See
 *    the claim guard in `src/data/crmIntegration.ts`.
 *  - Recording sync is NOT published (unverified), and vendor keywords stay
 *    with the vendor pages.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function CRMIntegrationPage() {
  const jsonLd = useMemo(() => buildCrmJsonLd(SITE_ORIGIN), [])
  const leadHref = leadCtaHref(CRM_LEAD)
  const R = ROUTES.crmIntegration
  const hero = useGcallsContent(R, 'hero', CRM_HERO)
  const directAnswer = useGcallsContent(R, 'directAnswer', CRM_DIRECT_ANSWER)
  const problems = useGcallsContent(R, 'problems', CRM_PROBLEMS)
  const overview = useGcallsContent(R, 'overview', CRM_OVERVIEW)
  const howItWorks = useGcallsContent(R, 'howItWorks', CRM_HOW_IT_WORKS_CONTENT)
  const capabilities = useGcallsContent(R, 'capabilities', CRM_CAPABILITIES)
  const beforeAfter = useGcallsContent(R, 'beforeAfter', CRM_BEFORE_AFTER)
  const platforms = useGcallsContent(R, 'platforms', CRM_PLATFORMS_CONTENT)
  const context = useGcallsContent(R, 'context', CRM_CONTEXT)
  const dataSync = useGcallsContent(R, 'dataSync', CRM_DATA_SYNC)
  const salesUseCase = useGcallsContent(R, 'salesUseCase', CRM_SALES_USE_CASE)
  const serviceUseCase = useGcallsContent(R, 'serviceUseCase', CRM_SERVICE_USE_CASE)
  const boundaries = useGcallsContent(R, 'boundaries', CRM_BOUNDARIES)
  const deployment = useGcallsContent(R, 'deployment', CRM_DEPLOYMENT)
  const trust = useGcallsContent(R, 'trust', CRM_TRUST)
  const pricing = useGcallsContent(R, 'pricing', CRM_PRICING)
  const faq = useGcallsContent(R, 'faq', { ...CRM_FAQ_SECTION, items: CRM_FAQ })
  const finalCta = useGcallsContent(R, 'finalCta', CRM_FINAL_CTA)

  return (
    /* Page-scoped heading + CTA polish — see src/styles/pages-06-09.css. */
    <div data-page="tong-dai-tich-hop-crm">
      <JsonLd id="crm-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-16 pb-3">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài tích hợp CRM' }]}
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
          <ProductVisualWithSupport
            main={<CRMMockup />}
            support={<DialpadMockup />}
            mainMaxWidth="580px"
          />
        }
      />

      {/* 02 — Direct answer. Plain visible text, never collapsed. */}
      <Section ariaLabelledBy="tong-dai-crm-la-gi">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>Định nghĩa</Eyebrow>

              <GradientHeading id="tong-dai-crm-la-gi" className="mt-4">
                {directAnswer.question}
              </GradientHeading>

              <p className="mt-5 max-w-xl rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
                {directAnswer.answer}
              </p>
            </div>

            <ProductVisual maxWidth="320px">
              <CustomerPopupMockup />
            </ProductVisual>
          </div>
        </Container>
      </Section>

      {/* 03 */}
      <IntegrationProblems
        eyebrow={problems.eyebrow}
        title={problems.h2}
        titleId="bai-toan-crm"
        items={problems.items}
      />

      {/* 04 — Overview + core flow diagram */}
      <IntegrationWorkflow
        eyebrow={overview.eyebrow}
        title={overview.h2}
        titleId="tong-quan-crm"
        steps={overview.flow}
      />

      {/* 05 — How it works */}
      <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
        <Container>
          <div id={CRM_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

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

      {/* 06 — Three core capabilities */}
      <Section ariaLabelledBy="nang-luc-tich-hop">
        <Container>
          <SectionHeader
            eyebrow={capabilities.eyebrow}
            title={capabilities.h2}
            titleId="nang-luc-tich-hop"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
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

      {/* 07 — Click-to-Call in the Gcalls widget */}
      <FeatureSplit
        tinted
        eyebrow="CLICK-TO-CALL"
        eyebrowIcon={<MousePointerClick size={14} aria-hidden="true" />}
        title={capabilities.items[0].title}
        titleId="click-to-call"
        description={capabilities.items[0].detail}
        visual={
          <ProductVisual maxWidth="360px">
            <WidgetMockup />
          </ProductVisual>
        }
      />

      {/* 08 — Before / after workflow */}
      <IntegrationBeforeAfter
        eyebrow={beforeAfter.eyebrow}
        title={beforeAfter.h2}
        titleId="truoc-sau-tich-hop"
        before={beforeAfter.before}
        after={beforeAfter.after}
      />

      {/* 09 — CRM ecosystem. Each card routes to the page owning its keyword. */}
      <IntegrationPlatforms
        eyebrow={platforms.eyebrow}
        title={platforms.h2}
        titleId="he-sinh-thai-crm"
        platforms={platforms.platforms}
        note={platforms.note}
        cta={{ label: 'Tìm hiểu tích hợp', path: platforms.platforms[3].path }}
      />

      {/* 10 — Customer context */}
      <FeatureSplit
        eyebrow={context.eyebrow}
        eyebrowIcon={<Users size={14} aria-hidden="true" />}
        title={context.h2}
        titleId="customer-context"
        description={context.description}
        points={context.points}
        visual={
          <ProductVisual maxWidth="560px">
            <CRMMockup />
          </ProductVisual>
        }
      />

      {/* 11 — Data synchronization */}
      <FeatureSplit
        tinted
        reverse
        eyebrow={dataSync.eyebrow}
        eyebrowIcon={<Database size={14} aria-hidden="true" />}
        title={dataSync.h2}
        titleId="dong-bo-du-lieu"
        description={dataSync.description}
        points={dataSync.points}
        visual={
          <ProductVisual maxWidth="560px">
            <CallTimelineMockup />
          </ProductVisual>
        }
      />

      {/* 12 + 13 — Sales and Customer Service use cases */}
      <Section ariaLabelledBy="use-case-sales">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <UseCase
              eyebrow={salesUseCase.eyebrow}
              icon={<Target size={14} aria-hidden="true" />}
              title={salesUseCase.h2}
              titleId="use-case-sales"
              description={salesUseCase.description}
              points={salesUseCase.points}
            />
            <UseCase
              eyebrow={serviceUseCase.eyebrow}
              icon={<Headset size={14} aria-hidden="true" />}
              title={serviceUseCase.h2}
              titleId="use-case-cskh"
              description={serviceUseCase.description}
              points={serviceUseCase.points}
            />
          </div>
        </Container>
      </Section>

      {/* 14 — CRM / Helpdesk / CX / Plus boundary */}
      <IntegrationBoundaries
        tinted
        eyebrow={boundaries.eyebrow}
        title={boundaries.h2}
        titleId="ranh-gioi-tich-hop"
        items={boundaries.items}
        related={boundaries.related}
      />

      {/* 15 — Implementation process */}
      <IntegrationSteps
        eyebrow={deployment.eyebrow}
        title={deployment.h2}
        titleId="trien-khai-crm"
        steps={deployment.steps}
      />

      {/* 16 — Trust. Neutral: no case, quote or figure is fabricated. */}
      <Section tinted ariaLabelledBy="boi-canh-trien-khai">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{trust.eyebrow}</Eyebrow>
            <GradientHeading id="boi-canh-trien-khai" className="mt-4">
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

      {/* 17 — Configuration & cost */}
      <PricingCtaBand
        eyebrow={pricing.eyebrow}
        title={pricing.h2}
        titleId="chi-phi-crm"
        description={pricing.description}
        primary={pricing.primaryCta}
        secondary={pricing.secondaryCta}
      />

      {/* 18 — FAQ */}
      <Section tinted ariaLabelledBy="faq-crm">
        <Container>
          <SectionHeader
            eyebrow={faq.eyebrow}
            title={faq.h2}
            titleId="faq-crm"
          />
          <div className="mt-10">
            <FaqAccordion items={faq.items} idPrefix="crm-faq" />
          </div>
        </Container>
      </Section>

      {/* 19 — Final CTA */}
      <Section ariaLabelledBy="cta-crm">
        <FinalCtaBand
          eyebrow={finalCta.eyebrow}
          title={finalCta.h2}
          titleId="cta-crm"
          description={finalCta.description}
          primary={finalCta.primaryCta}
          lead={CRM_LEAD}
          secondary={finalCta.secondaryCta}
          showPhone
        />
      </Section>
    </div>
  )
}

/** Sales / Customer Service use-case block — same shape, different content. */
function UseCase({
  eyebrow,
  icon,
  title,
  titleId,
  description,
  points,
}: {
  eyebrow: string
  icon: ReactNode
  title: string
  titleId: string
  description: string
  points: readonly string[]
}) {
  return (
    <section aria-labelledby={titleId}>
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>

      <h2
        id={titleId}
        className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]"
      >
        {title}
      </h2>

      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {points.map((point) => (
          <li
            key={point}
            className="rounded-full bg-brand-light px-4 py-2 text-[15px] font-semibold text-brand"
          >
            {point}
          </li>
        ))}
      </ul>
    </section>
  )
}
