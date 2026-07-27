import { useMemo } from 'react'
import { ArrowRight, History, MousePointerClick, Settings, Users } from 'lucide-react'
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
import { ROUTES } from '@/config/navigation'
import { SITE_ORIGIN } from '@/config/seo'
import {
  APIManagerMockup,
  CRMMockup,
  CallTimelineMockup,
  CustomerPopupMockup,
  DialpadMockup,
  WidgetMockup,
} from '@/components/product-ui'
import {
  CRM_BENEFITS,
  CRM_CLICK_TO_CALL,
  CRM_CONFIG,
  CRM_CONTEXT,
  CRM_DEFINITION,
  CRM_DEPLOYMENT,
  CRM_FAQ,
  CRM_FINAL_CTA,
  CRM_HERO,
  CRM_HISTORY,
  CRM_PLATFORMS,
  CRM_PLATFORM_NOTE,
  CRM_PRICING,
  CRM_PROBLEMS,
  CRM_USE_CASES,
  CRM_WORKFLOW,
  buildCrmJsonLd,
} from '@/data/crmIntegration'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import { IntegrationPlatforms } from '@/components/integration/IntegrationPlatforms'
import { IntegrationBenefits } from '@/components/integration/IntegrationBenefits'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'

/**
 * `/tong-dai-tich-hop-crm/` — Gcalls Call Center + CRM integration.
 *
 * Positioning is the *integration*, not CRM in general: connecting business
 * calling with CRM customer data for Sales and CSKH workflows.
 *
 * Two constraints shaped the build:
 *  - No third-party CRM UI is depicted. Every visual is an existing Gcalls
 *    demo mockup, and the process is explained with a purpose-built workflow
 *    diagram rather than a fabricated HubSpot/Salesforce screen.
 *  - No capability is claimed to behave identically across platforms, and no
 *    automatic-sync behaviour is described — nothing confirms it.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function CRMIntegrationPage() {
  const jsonLd = useMemo(() => buildCrmJsonLd(SITE_ORIGIN), [])

  return (
    <>
      <JsonLd id="crm-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={[{ label: 'Giải pháp' }, { label: 'Tích hợp CRM' }]} />
        </Container>
      </div>

      {/* 01 */}
      <IntegrationHero
        eyebrow={CRM_HERO.eyebrow}
        title={CRM_HERO.h1}
        description={CRM_HERO.description}
        keyPoints={CRM_HERO.keyPoints}
        primaryCta={CRM_HERO.primaryCta}
        secondaryCta={CRM_HERO.secondaryCta}
        visual={
          <ProductVisualWithSupport
            main={<CRMMockup />}
            support={<DialpadMockup />}
            mainMaxWidth="580px"
          />
        }
      />

      {/* 02 */}
      <IntegrationProblems
        eyebrow={CRM_PROBLEMS.eyebrow}
        title={CRM_PROBLEMS.h2}
        titleId="bai-toan-crm"
        items={CRM_PROBLEMS.items}
      />

      {/* 03 — what CRM integration is, with a direct-answer paragraph */}
      <Section ariaLabelledBy="tong-dai-crm-la-gi">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>{CRM_DEFINITION.eyebrow}</Eyebrow>

              <GradientHeading id="tong-dai-crm-la-gi" className="mt-4">
                {CRM_DEFINITION.h2}
              </GradientHeading>

              <p className="mt-5 max-w-xl rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
                {CRM_DEFINITION.directAnswer}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {CRM_DEFINITION.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full bg-brand-light px-4 py-2 text-[15px] font-semibold text-brand"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>

            <ProductVisual maxWidth="320px">
              <CustomerPopupMockup />
            </ProductVisual>
          </div>
        </Container>
      </Section>

      {/* 04 */}
      <IntegrationWorkflow
        title={CRM_WORKFLOW.h2}
        titleId="cach-hoat-dong-heading"
        anchorId="cach-hoat-dong"
        steps={CRM_WORKFLOW.steps}
      />

      {/* 05 — Click-to-Call */}
      <FeatureSplit
        tinted
        eyebrow={CRM_CLICK_TO_CALL.eyebrow}
        eyebrowIcon={<MousePointerClick size={14} aria-hidden="true" />}
        title={CRM_CLICK_TO_CALL.h2}
        titleId="click-to-call"
        description={CRM_CLICK_TO_CALL.description}
        points={CRM_CLICK_TO_CALL.points}
        visual={
          <ProductVisual maxWidth="360px">
            <WidgetMockup />
          </ProductVisual>
        }
      />

      {/* 06 — Customer context */}
      <FeatureSplit
        reverse
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

      {/* 07 — Interaction history */}
      <FeatureSplit
        tinted
        eyebrow={CRM_HISTORY.eyebrow}
        eyebrowIcon={<History size={14} aria-hidden="true" />}
        title={CRM_HISTORY.h2}
        titleId="lich-su-tuong-tac-crm"
        description={CRM_HISTORY.description}
        points={CRM_HISTORY.points}
        visual={
          <ProductVisual maxWidth="560px">
            <CallTimelineMockup />
          </ProductVisual>
        }
      />

      {/* 08 — Integration configuration */}
      <FeatureSplit
        reverse
        eyebrow={CRM_CONFIG.eyebrow}
        eyebrowIcon={<Settings size={14} aria-hidden="true" />}
        title={CRM_CONFIG.h2}
        titleId="cau-hinh-tich-hop"
        description="Quy trình kết nối được thực hiện theo bốn bước, từ chọn tích hợp đến khi đưa vào vận hành."
        visual={
          <ProductVisual maxWidth="560px">
            <APIManagerMockup />
          </ProductVisual>
        }
      >
        <ol className="mt-7 flex flex-col gap-3">
          {CRM_CONFIG.steps.map((step) => (
            <li key={step.n} className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-brand-light text-sm font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <span className="text-base leading-relaxed text-foreground">
                <span className="font-semibold">{step.title}</span>
                <span className="text-muted-foreground"> — {step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </FeatureSplit>

      {/* 09 — CRM ecosystem */}
      <IntegrationPlatforms
        title="Kết nối với các nền tảng CRM theo nhu cầu triển khai"
        titleId="he-sinh-thai-crm"
        platforms={CRM_PLATFORMS}
        note={CRM_PLATFORM_NOTE}
        cta={{ label: 'Tìm hiểu tích hợp', path: ROUTES.costEstimator }}
      />

      {/* 10 */}
      <IntegrationBenefits
        title={CRM_BENEFITS.h2}
        titleId="loi-ich-crm"
        items={CRM_BENEFITS.items}
      />

      {/* 11 */}
      <IntegrationUseCases
        tinted
        title={CRM_USE_CASES.h2}
        titleId="use-case-crm"
        items={CRM_USE_CASES.items}
      />

      {/* 12 */}
      <IntegrationSteps
        eyebrow={CRM_DEPLOYMENT.eyebrow}
        title={CRM_DEPLOYMENT.h2}
        titleId="trien-khai-crm"
        steps={CRM_DEPLOYMENT.steps}
      />

      {/* 13 */}
      <PricingCtaBand
        tinted
        eyebrow={CRM_PRICING.eyebrow}
        title={CRM_PRICING.h2}
        titleId="chi-phi-crm"
        description={CRM_PRICING.description}
        primary={CRM_PRICING.primaryCta}
        secondary={CRM_PRICING.secondaryCta}
      />

      {/* Related solutions — real internal links, no invented routes. */}
      <Section ariaLabelledBy="giai-phap-lien-quan">
        <Container>
          <SectionHeader
            eyebrow="Khám phá thêm"
            title="Giải pháp liên quan"
            titleId="giai-phap-lien-quan"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              {
                path: ROUTES.gcallsPlus,
                name: 'Gcalls Plus Webphone',
                detail:
                  'Hệ thống Webphone / Call Center tinh gọn cho đội Sales và CSKH.',
              },
              {
                path: ROUTES.helpdeskIntegration,
                name: 'Tích hợp Helpdesk',
                detail: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket.',
              },
            ].map((item) => (
              <Card as="li" key={item.path} className="flex h-full flex-col p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
                <div className="mt-auto pt-5">
                  <Link
                    to={item.path}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Tìm hiểu thêm
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 14 */}
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

      {/* 15 */}
      <Section ariaLabelledBy="cta-crm">
        <FinalCtaBand
          eyebrow="Bắt đầu"
          title={CRM_FINAL_CTA.h2}
          titleId="cta-crm"
          description={CRM_FINAL_CTA.description}
          primary={CRM_FINAL_CTA.primaryCta}
          secondary={CRM_FINAL_CTA.secondaryCta}
          lead={{
            intent: 'integration',
            source: 'crm_integration',
            solution: 'Tích hợp CRM',
          }}
          showPhone
        />
      </Section>
    </>
  )
}
