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
import { ProductVisual, ProductVisualWithSupport } from '@/components/common/ProductVisual'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import {
  CallTimelineMockup,
  CustomerPopupMockup,
} from '@/components/product-ui'
import { CrmRecordClickToCallMockup } from '@/components/hubspot/visuals'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import {
  HS_BENEFITS,
  HS_CAPABILITIES,
  HS_DIRECT_ANSWER,
  HS_FAQ,
  HS_FINAL_CTA,
  HS_HERO,
  HS_LINKS,
  HS_OVERVIEW,
  HS_PROBLEMS,
  HS_RELATED,
  HS_SETUP,
  HS_TRUST,
  HS_UI_PREVIEW,
  HS_USE_CASES,
  HS_VS_CRM,
  HS_WORKFLOW,
  HUBSPOT_CONSULT_LEAD,
  HUBSPOT_DEMO_LEAD,
  buildHubspotJsonLd,
} from '@/data/hubspotIntegration'

/**
 * `/tich-hop/hubspot/` — HubSpot platform integration (INT-01).
 *
 * A PLATFORM-SPECIFIC page answering "how does Gcalls connect calling with the
 * workflow of a business already using HubSpot?". It is NOT a general CRM
 * integration page, NOT a HubSpot product introduction, NOT a HubSpot tutorial
 * and NOT a Gcalls Plus feature page.
 *
 * Generic CRM intent belongs to `/tong-dai-tich-hop-crm/`. Section 11 below
 * exists to hand that visitor over rather than keep them, which is also what
 * keeps the two pages off each other's keywords.
 *
 * TWO EVIDENCE GATES ARE CLOSED NEGATIVE — Click-to-SMS and Ticket creation.
 * Neither renders a capability card here. Read the gates at the head of
 * `src/data/hubspotIntegration.ts` before adding either.
 *
 * NO FAKE HUBSPOT UI. Every product surface on this page is either the
 * approved Gcalls-side demo UI from `@/components/product-ui` or the
 * deliberately unbranded CRM-record panel in `@/components/hubspot/visuals`.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function HubspotIntegrationPage() {
  const jsonLd = useMemo(() => buildHubspotJsonLd(SITE_ORIGIN), [])
  const demoHref = leadCtaHref(HUBSPOT_DEMO_LEAD)
  const consultHref = leadCtaHref(HUBSPOT_CONSULT_LEAD)

  return (
    <>
      <JsonLd id="hubspot-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Tích hợp', path: '/tich-hop/' }, { label: 'HubSpot' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA carries intent=demo through the shared form. */}
      <IntegrationHero
        eyebrow={HS_HERO.eyebrow}
        title={HS_HERO.h1}
        description={HS_HERO.description}
        keyPoints={HS_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: HS_HERO.primaryCta.label, path: demoHref }}
        secondaryCta={HS_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="380px">
            <CrmRecordClickToCallMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain rendered HTML, never hidden in tabs. */}
      <Section ariaLabelledBy="hubspot-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="hubspot-la-gi" className="mt-4">
              {HS_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {HS_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Business problems */}
      <IntegrationProblems
        eyebrow={HS_PROBLEMS.eyebrow}
        title={HS_PROBLEMS.h2}
        titleId="bai-toan-hubspot"
        items={HS_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow */}
      <IntegrationWorkflow
        eyebrow={HS_OVERVIEW.eyebrow}
        title={HS_OVERVIEW.h2}
        titleId="tong-quan-hubspot"
        steps={HS_OVERVIEW.flow}
      />

      {/* 05 — Verified capabilities. Exactly four; see the evidence gates. */}
      <Section tinted ariaLabelledBy="nang-luc-hubspot">
        <Container>
          <SectionHeader
            eyebrow={HS_CAPABILITIES.eyebrow}
            title={HS_CAPABILITIES.h2}
            titleId="nang-luc-hubspot"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {HS_CAPABILITIES.items.map((item) => (
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
      <Section ariaLabelledBy="quy-trinh-hubspot" className="scroll-mt-20">
        <Container>
          <div id={HS_WORKFLOW.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={HS_WORKFLOW.eyebrow}
            title={HS_WORKFLOW.h2}
            titleId="quy-trinh-hubspot"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HS_WORKFLOW.steps.map((step) => (
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

      {/* 07 — Benefits. No percentage anywhere. */}
      <Section tinted ariaLabelledBy="gia-tri-hubspot">
        <Container>
          <SectionHeader
            eyebrow={HS_BENEFITS.eyebrow}
            title={HS_BENEFITS.h2}
            titleId="gia-tri-hubspot"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HS_BENEFITS.items.map((item) => (
              <Card as="li" key={item.n} className="flex h-full flex-col p-6">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {item.n}
                </span>
                <h3 className="mt-4 text-base font-extrabold tracking-tight text-foreground">
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

      {/* 08 — Use cases */}
      <IntegrationUseCases
        eyebrow={HS_USE_CASES.eyebrow}
        title={HS_USE_CASES.h2}
        titleId="use-case-hubspot"
        items={HS_USE_CASES.items}
      />

      {/* 09 — Setup. No duration on any step or in total. */}
      <IntegrationSteps
        tinted
        eyebrow={HS_SETUP.eyebrow}
        title={HS_SETUP.h2}
        titleId="thiet-lap-hubspot"
        steps={HS_SETUP.steps}
      />

      <Section tinted className="!pt-0">
        <Container>
          <Note>{HS_SETUP.note}</Note>
        </Container>
      </Section>

      {/*
        10 — UI preview.
        Gcalls-side surfaces only. The note is structural, not decorative: it is
        what stops the reader inferring these are HubSpot screenshots.
      */}
      <Section ariaLabelledBy="giao-dien-hubspot">
        <Container>
          <SectionHeader
            eyebrow={HS_UI_PREVIEW.eyebrow}
            title={HS_UI_PREVIEW.h2}
            titleId="giao-dien-hubspot"
            lead={HS_UI_PREVIEW.description}
          />

          <div className="mt-10">
            <ProductVisualWithSupport
              main={<CustomerPopupMockup />}
              support={<CallTimelineMockup />}
              mainMaxWidth="300px"
              note={false}
            />
          </div>

          <Note>{HS_UI_PREVIEW.note}</Note>
        </Container>
      </Section>

      {/* 11 — HubSpot vs the generic CRM page. Hands the visitor over. */}
      <Section tinted ariaLabelledBy="hubspot-vs-crm">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow icon={<Compass size={14} aria-hidden="true" />}>
              {HS_VS_CRM.eyebrow}
            </Eyebrow>
            <GradientHeading id="hubspot-vs-crm" className="mt-4">
              {HS_VS_CRM.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {HS_VS_CRM.description}
            </p>

            <div className="mt-8">
              <Link
                to={HS_VS_CRM.cta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {HS_VS_CRM.cta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 12 — Related integrations. Routing only, no vendor comparison. */}
      <Section ariaLabelledBy="crm-khac">
        <Container>
          <h2
            id="crm-khac"
            className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
          >
            {HS_RELATED.h2}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {HS_RELATED.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {HS_RELATED.items.map((item) => (
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

      {/* 13 — Trust. Neutral: no partner status, certification or figure. */}
      <Section tinted ariaLabelledBy="pham-vi-hubspot">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{HS_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="pham-vi-hubspot" className="mt-4">
              {HS_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {HS_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={consultHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {HS_TRUST.cta.label}
              </Link>
              {HS_TRUST.links.map((link) => (
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

      {/* 14 — FAQ */}
      <Section ariaLabelledBy="faq-hubspot">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls tích hợp HubSpot"
            titleId="faq-hubspot"
          />
          <div className="mt-10">
            <FaqAccordion items={HS_FAQ} idPrefix="hubspot-faq" />
          </div>
        </Container>
      </Section>

      {/* 15 — Onward links */}
      <Section tinted ariaLabelledBy="lien-ket-hubspot">
        <Container>
          <h2
            id="lien-ket-hubspot"
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {HS_LINKS.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {HS_LINKS.items.map((link) => (
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
        16 — Final CTA.
        Two different intents: primary demo, secondary consultation. The
        secondary path is a pre-built lead href rather than a plain route, so
        intent=consultation survives to the form.
      */}
      <Section ariaLabelledBy="cta-hubspot">
        <FinalCtaBand
          eyebrow={HS_FINAL_CTA.eyebrow}
          title={HS_FINAL_CTA.h2}
          titleId="cta-hubspot"
          description={HS_FINAL_CTA.description}
          primary={{ label: HS_FINAL_CTA.primaryCta.label, path: demoHref }}
          lead={HUBSPOT_DEMO_LEAD}
          secondary={{ label: HS_FINAL_CTA.secondaryCta.label, path: consultHref }}
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
