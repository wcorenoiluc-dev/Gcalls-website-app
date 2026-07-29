import { useMemo, type ReactNode } from 'react'
import { Database, Headset, MousePointerClick, Target, Users } from 'lucide-react'
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
import {
  ProductVisual,
  ProductVisualWithSupport,
} from '@/components/common/ProductVisual'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
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
  CRM_FINAL_CTA,
  CRM_HERO,
  CRM_HOW_IT_WORKS,
  CRM_LEAD,
  CRM_OVERVIEW,
  CRM_PLATFORMS,
  CRM_PLATFORM_NOTE,
  CRM_PLATFORM_SECTION,
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

  return (
    <>
      <JsonLd id="crm-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài tích hợp CRM' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA routes through the shared lead form. */}
      <IntegrationHero
        eyebrow={CRM_HERO.eyebrow}
        title={CRM_HERO.h1}
        description={CRM_HERO.description}
        keyPoints={CRM_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: CRM_HERO.primaryCta.label, path: leadHref }}
        secondaryCta={CRM_HERO.secondaryCta}
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
                {CRM_DIRECT_ANSWER.question}
              </GradientHeading>

              <p className="mt-5 max-w-xl rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
                {CRM_DIRECT_ANSWER.answer}
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
        eyebrow={CRM_PROBLEMS.eyebrow}
        title={CRM_PROBLEMS.h2}
        titleId="bai-toan-crm"
        items={CRM_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow diagram */}
      <IntegrationWorkflow
        eyebrow={CRM_OVERVIEW.eyebrow}
        title={CRM_OVERVIEW.h2}
        titleId="tong-quan-crm"
        steps={CRM_OVERVIEW.flow}
      />

      {/* 05 — How it works */}
      <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
        <Container>
          <div id={CRM_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={CRM_HOW_IT_WORKS.eyebrow}
            title={CRM_HOW_IT_WORKS.h2}
            titleId="cach-hoat-dong-heading"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CRM_HOW_IT_WORKS.steps.map((step) => (
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
            eyebrow={CRM_CAPABILITIES.eyebrow}
            title={CRM_CAPABILITIES.h2}
            titleId="nang-luc-tich-hop"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {CRM_CAPABILITIES.items.map((item) => (
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
        title={CRM_CAPABILITIES.items[0].title}
        titleId="click-to-call"
        description={CRM_CAPABILITIES.items[0].detail}
        visual={
          <ProductVisual maxWidth="360px">
            <WidgetMockup />
          </ProductVisual>
        }
      />

      {/* 08 — Before / after workflow */}
      <IntegrationBeforeAfter
        eyebrow={CRM_BEFORE_AFTER.eyebrow}
        title={CRM_BEFORE_AFTER.h2}
        titleId="truoc-sau-tich-hop"
        before={CRM_BEFORE_AFTER.before}
        after={CRM_BEFORE_AFTER.after}
      />

      {/* 09 — CRM ecosystem. Each card routes to the page owning its keyword. */}
      <IntegrationPlatforms
        eyebrow={CRM_PLATFORM_SECTION.eyebrow}
        title={CRM_PLATFORM_SECTION.h2}
        titleId="he-sinh-thai-crm"
        platforms={CRM_PLATFORMS}
        note={CRM_PLATFORM_NOTE}
        cta={{ label: 'Tìm hiểu tích hợp', path: CRM_PLATFORMS[3].path }}
      />

      {/* 10 — Customer context */}
      <FeatureSplit
        eyebrow={CRM_CONTEXT.eyebrow}
        eyebrowIcon={<Users size={14} aria-hidden="true" />}
        title={CRM_CONTEXT.h2}
        titleId="customer-context"
        description={CRM_CONTEXT.description}
        points={CRM_CONTEXT.points}
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
        eyebrow={CRM_DATA_SYNC.eyebrow}
        eyebrowIcon={<Database size={14} aria-hidden="true" />}
        title={CRM_DATA_SYNC.h2}
        titleId="dong-bo-du-lieu"
        description={CRM_DATA_SYNC.description}
        points={CRM_DATA_SYNC.points}
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
              eyebrow={CRM_SALES_USE_CASE.eyebrow}
              icon={<Target size={14} aria-hidden="true" />}
              title={CRM_SALES_USE_CASE.h2}
              titleId="use-case-sales"
              description={CRM_SALES_USE_CASE.description}
              points={CRM_SALES_USE_CASE.points}
            />
            <UseCase
              eyebrow={CRM_SERVICE_USE_CASE.eyebrow}
              icon={<Headset size={14} aria-hidden="true" />}
              title={CRM_SERVICE_USE_CASE.h2}
              titleId="use-case-cskh"
              description={CRM_SERVICE_USE_CASE.description}
              points={CRM_SERVICE_USE_CASE.points}
            />
          </div>
        </Container>
      </Section>

      {/* 14 — CRM / Helpdesk / CX / Plus boundary */}
      <IntegrationBoundaries
        tinted
        eyebrow={CRM_BOUNDARIES.eyebrow}
        title={CRM_BOUNDARIES.h2}
        titleId="ranh-gioi-tich-hop"
        items={CRM_BOUNDARIES.items}
        related={CRM_BOUNDARIES.related}
      />

      {/* 15 — Implementation process */}
      <IntegrationSteps
        eyebrow={CRM_DEPLOYMENT.eyebrow}
        title={CRM_DEPLOYMENT.h2}
        titleId="trien-khai-crm"
        steps={CRM_DEPLOYMENT.steps}
      />

      {/* 16 — Trust. Neutral: no case, quote or figure is fabricated. */}
      <Section tinted ariaLabelledBy="boi-canh-trien-khai">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{CRM_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="boi-canh-trien-khai" className="mt-4">
              {CRM_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {CRM_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={leadHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {CRM_TRUST.cta.label}
              </Link>
              <Link
                to={CRM_TRUST.link.path}
                className="inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {CRM_TRUST.link.label}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 17 — Configuration & cost */}
      <PricingCtaBand
        eyebrow={CRM_PRICING.eyebrow}
        title={CRM_PRICING.h2}
        titleId="chi-phi-crm"
        description={CRM_PRICING.description}
        primary={CRM_PRICING.primaryCta}
        secondary={CRM_PRICING.secondaryCta}
      />

      {/* 18 — FAQ */}
      <Section tinted ariaLabelledBy="faq-crm">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về tổng đài tích hợp CRM"
            titleId="faq-crm"
          />
          <div className="mt-10">
            <FaqAccordion items={CRM_FAQ} idPrefix="crm-faq" />
          </div>
        </Container>
      </Section>

      {/* 19 — Final CTA */}
      <Section ariaLabelledBy="cta-crm">
        <FinalCtaBand
          eyebrow={CRM_FINAL_CTA.eyebrow}
          title={CRM_FINAL_CTA.h2}
          titleId="cta-crm"
          description={CRM_FINAL_CTA.description}
          primary={CRM_FINAL_CTA.primaryCta}
          lead={CRM_LEAD}
          secondary={CRM_FINAL_CTA.secondaryCta}
          showPhone
        />
      </Section>
    </>
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
