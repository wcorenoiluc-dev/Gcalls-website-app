import { useMemo } from 'react'
import { ArrowRight, Compass, Info } from 'lucide-react'
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
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { ProductVisual } from '@/components/common/ProductVisual'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import {
  CrmModuleContextMockup,
  CustomerContextPanelMockup,
} from '@/components/zoho/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBenefits } from '@/components/integration/IntegrationBenefits'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import {
  ZH_BEFORE_AFTER,
  ZH_BENEFITS,
  ZH_BOUNDARY,
  ZH_CAPABILITIES,
  ZH_DIRECT_ANSWER,
  ZH_FAQ,
  ZH_FINAL_CTA,
  ZH_HERO,
  ZH_LINKS,
  ZH_OVERVIEW,
  ZH_PROBLEMS,
  ZH_RELATED,
  ZH_SETUP,
  ZH_TRUST,
  ZH_UI_PREVIEW,
  ZH_USE_CASES,
  ZH_VS_CRM,
  ZH_WORKFLOW,
  ZOHO_CONSULT_LEAD,
  ZOHO_DEMO_LEAD,
  buildZohoCrmJsonLd,
} from '@/data/zohoCrmIntegration'

/**
 * `/tich-hop/zoho-crm/` — Zoho CRM platform integration (INT-03).
 *
 * A PLATFORM-SPECIFIC page answering "how does Gcalls connect phone
 * conversations with a business already using Zoho CRM?". It is NOT a generic
 * CRM integration page, NOT a Zoho CRM tutorial, NOT a generic SME call-center
 * article, NOT a Gcalls Plus product page — and NOT the HubSpot or Salesforce
 * page with renamed labels. It reuses their ARCHITECTURE; it shares none of
 * their copy and none of their visuals.
 *
 * Generic CRM intent belongs to `/tong-dai-tich-hop-crm/`. Section 12 below
 * exists to hand that visitor over rather than keep them, which is also what
 * keeps the pages off each other's keywords.
 *
 * FIVE CAPABILITY GATES WERE RUN INDEPENDENTLY (INT-03 §10), not inherited:
 * Click-to-Call VERIFIED · incoming context CONTEXT ONLY (the word "Popup"
 * appears nowhere) · call activity CONDITIONAL ONLY · Click-to-SMS WITHHELD ·
 * recording sync WITHHELD. The two withheld gates render no capability card;
 * they surface only as the FAQ questions §22 mandates, answered by deferring to
 * survey. Read the gates at the head of `src/data/zohoCrmIntegration.ts` before
 * adding any of them.
 *
 * NO FAKE ZOHO UI. Every product surface is either the approved Gcalls-side
 * demo UI from `@/components/product-ui` or the deliberately unbranded CRM
 * module panel in `@/components/zoho/visuals`. No Zoho logo, wordmark or brand
 * colour appears, and none is used as proof of partnership.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function ZohoCrmIntegrationPage() {
  const jsonLd = useMemo(() => buildZohoCrmJsonLd(SITE_ORIGIN), [])
  const demoHref = leadCtaHref(ZOHO_DEMO_LEAD)
  const consultHref = leadCtaHref(ZOHO_CONSULT_LEAD)

  return (
    <>
      <JsonLd id="zoho-crm-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Tích hợp', path: '/tich-hop/' }, { label: 'Zoho CRM' }]}
          />
        </Container>
      </div>

      {/*
        01 — Hero. Primary CTA carries intent=demo through the shared form; the
        secondary CTA is an in-page anchor to the workflow section.
      */}
      <IntegrationHero
        eyebrow={ZH_HERO.eyebrow}
        title={ZH_HERO.h1}
        description={ZH_HERO.description}
        keyPoints={ZH_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: ZH_HERO.primaryCta.label, path: demoHref }}
        secondaryCta={ZH_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="380px">
            <CrmModuleContextMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain rendered HTML, never hidden in tabs. */}
      <Section ariaLabelledBy="zoho-crm-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="zoho-crm-la-gi" className="mt-4">
              {ZH_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {ZH_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Business problems. No ROI or productivity figure anywhere. */}
      <IntegrationProblems
        eyebrow={ZH_PROBLEMS.eyebrow}
        title={ZH_PROBLEMS.h2}
        titleId="bai-toan-zoho-crm"
        items={ZH_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow, under a single approved H2. */}
      <IntegrationWorkflow
        eyebrow={ZH_OVERVIEW.eyebrow}
        title={ZH_OVERVIEW.h2}
        titleId="tong-quan-zoho-crm"
        lead={ZH_OVERVIEW.description}
        steps={ZH_OVERVIEW.flow}
      />

      {/*
        05 — Core capabilities. Only the gates that passed: no SMS card, no
        recording card, and no popup wording anywhere.
      */}
      <Section tinted ariaLabelledBy="nang-luc-zoho-crm">
        <Container>
          <SectionHeader
            eyebrow={ZH_CAPABILITIES.eyebrow}
            title={ZH_CAPABILITIES.h2}
            titleId="nang-luc-zoho-crm"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ZH_CAPABILITIES.items.map((item) => (
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

      {/* 06 — Workflow. Hero's secondary CTA anchors here. */}
      <Section ariaLabelledBy="quy-trinh-zoho-crm" className="scroll-mt-20">
        <Container>
          <div id={ZH_WORKFLOW.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={ZH_WORKFLOW.eyebrow}
            title={ZH_WORKFLOW.h2}
            titleId="quy-trinh-zoho-crm"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ZH_WORKFLOW.steps.map((step) => (
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

      {/* 07 — Before / after. A workflow illustration; no percentage. */}
      <IntegrationBeforeAfter
        tinted
        eyebrow={ZH_BEFORE_AFTER.eyebrow}
        title={ZH_BEFORE_AFTER.h2}
        titleId="truoc-sau-zoho-crm"
        before={ZH_BEFORE_AFTER.before}
        after={ZH_BEFORE_AFTER.after}
      />

      {/* 08 — Benefits. Conservative statements only, no number anywhere. */}
      <IntegrationBenefits
        eyebrow={ZH_BENEFITS.eyebrow}
        title={ZH_BENEFITS.h2}
        titleId="gia-tri-zoho-crm"
        items={ZH_BENEFITS.items}
      />

      {/* 09 — Use cases. No performance result claim. */}
      <IntegrationUseCases
        tinted
        eyebrow={ZH_USE_CASES.eyebrow}
        title={ZH_USE_CASES.h2}
        titleId="use-case-zoho-crm"
        items={ZH_USE_CASES.items}
      />

      {/* 10 — Setup. No duration on any step or in total; no edition claim. */}
      <IntegrationSteps
        eyebrow={ZH_SETUP.eyebrow}
        title={ZH_SETUP.h2}
        titleId="thiet-lap-zoho-crm"
        steps={ZH_SETUP.steps}
      />

      <Section className="!pt-0">
        <Container>
          <Note>{ZH_SETUP.note}</Note>
        </Container>
      </Section>

      {/*
        11 — UI preview.
        A Gcalls-side customer-context surface built for this page (§17 priority
        3). Priority 2 was tried and rejected on evidence grounds: the approved
        `CRMMockup` and `CallTimelineMockup` both render a recording row, and a
        recording sitting inside a customer record on a Zoho page invites exactly
        the inference gate E (recording sync) refuses. The incoming-popup surface
        is out for the same reason under gate B. See the header of
        `@/components/zoho/visuals`. The note is structural, not decorative: it
        is what stops the reader inferring this is a Zoho CRM screenshot.
      */}
      <Section tinted ariaLabelledBy="giao-dien-zoho-crm">
        <Container>
          <SectionHeader
            eyebrow={ZH_UI_PREVIEW.eyebrow}
            title={ZH_UI_PREVIEW.h2}
            titleId="giao-dien-zoho-crm"
            lead={ZH_UI_PREVIEW.description}
          />

          <div className="mt-10">
            <ProductVisual maxWidth="420px" note={false}>
              <CustomerContextPanelMockup />
            </ProductVisual>
          </div>

          <Note>{ZH_UI_PREVIEW.note}</Note>
        </Container>
      </Section>

      {/* 12 — Zoho vs the generic CRM page. Hands the visitor over. */}
      <Section ariaLabelledBy="zoho-vs-crm">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow icon={<Compass size={14} aria-hidden="true" />}>
              {ZH_VS_CRM.eyebrow}
            </Eyebrow>
            <GradientHeading id="zoho-vs-crm" className="mt-4">
              {ZH_VS_CRM.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {ZH_VS_CRM.description}
            </p>

            <div className="mt-8">
              <Link
                to={ZH_VS_CRM.cta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {ZH_VS_CRM.cta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 13 — Related integrations. Routing only, no vendor comparison. */}
      <Section tinted ariaLabelledBy="crm-khac">
        <Container>
          <h2
            id="crm-khac"
            className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
          >
            {ZH_RELATED.h2}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {ZH_RELATED.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {ZH_RELATED.items.map((item) => (
              <Card as="li" key={item.path} className="flex h-full flex-col p-6">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
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

      {/*
        14 — Product boundary. A routing table, not a capability list: it
        separates the calling layer, the generic CRM solution, this page and the
        omnichannel product.
      */}
      <IntegrationBoundaries
        eyebrow={ZH_BOUNDARY.eyebrow}
        title={ZH_BOUNDARY.h2}
        titleId="ranh-gioi-zoho-crm"
        items={ZH_BOUNDARY.items}
      />

      {/* 15 — Trust. Neutral: no partner status, certification or figure. */}
      <Section tinted ariaLabelledBy="pham-vi-zoho-crm">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{ZH_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="pham-vi-zoho-crm" className="mt-4">
              {ZH_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {ZH_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={consultHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {ZH_TRUST.cta.label}
              </Link>
              {ZH_TRUST.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 16 — FAQ. FAQ 5 and 6 defer SMS and recording to survey. */}
      <Section ariaLabelledBy="faq-zoho-crm">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls tích hợp Zoho CRM"
            titleId="faq-zoho-crm"
          />
          <div className="mt-10">
            <FaqAccordion items={ZH_FAQ} idPrefix="zoho-crm-faq" />
          </div>
        </Container>
      </Section>

      {/* 17 — Onward links */}
      <Section tinted ariaLabelledBy="lien-ket-zoho-crm">
        <Container>
          <h2
            id="lien-ket-zoho-crm"
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {ZH_LINKS.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {ZH_LINKS.items.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {link.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/*
        18 — Final CTA.
        Two different intents: primary demo, secondary consultation. The
        secondary path is a pre-built lead href rather than a plain route, so
        intent=consultation survives to the form.
      */}
      <Section ariaLabelledBy="cta-zoho-crm">
        <FinalCtaBand
          eyebrow={ZH_FINAL_CTA.eyebrow}
          title={ZH_FINAL_CTA.h2}
          titleId="cta-zoho-crm"
          description={ZH_FINAL_CTA.description}
          primary={{ label: ZH_FINAL_CTA.primaryCta.label, path: demoHref }}
          lead={ZOHO_DEMO_LEAD}
          secondary={{ label: ZH_FINAL_CTA.secondaryCta.label, path: consultHref }}
          showPhone
        />
      </Section>
    </>
  )
}

/** Scoping note. Same treatment the other integration pages use. */
function Note({ children }: { children: string }) {
  return (
    <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
      <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      {children}
    </p>
  )
}
