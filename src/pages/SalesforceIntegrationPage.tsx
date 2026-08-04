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
import { CallTimelineMockup, CustomerPopupMockup } from '@/components/product-ui'
import { CrmRecordClickToCallMockup } from '@/components/integration/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBenefits } from '@/components/integration/IntegrationBenefits'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import {
  SALESFORCE_CONSULT_LEAD,
  SALESFORCE_DEMO_LEAD,
  SF_BEFORE_AFTER,
  SF_BENEFITS,
  SF_CAPABILITIES,
  SF_DIRECT_ANSWER,
  SF_FAQ,
  SF_FINAL_CTA,
  SF_HERO,
  SF_LINKS,
  SF_OVERVIEW,
  SF_PROBLEMS,
  SF_RELATED,
  SF_RELATIONSHIPS,
  SF_SETUP,
  SF_TRUST,
  SF_UI_PREVIEW,
  SF_USE_CASES,
  SF_VS_CRM,
  SF_WORKFLOW,
  buildSalesforceJsonLd,
} from '@/data/salesforceIntegration'

/**
 * `/tich-hop/salesforce/` — Salesforce platform integration (INT-02).
 *
 * A PLATFORM-SPECIFIC page answering "how does Gcalls connect calling with a
 * business already running Sales and Service workflows in Salesforce?". It is
 * NOT a general CRM integration page, NOT a Salesforce tutorial, NOT a
 * Salesforce comparison article, NOT a Gcalls Plus product page — and NOT the
 * HubSpot page with names replaced. It reuses INT-01's ARCHITECTURE; it shares
 * none of its copy.
 *
 * Generic CRM intent belongs to `/tong-dai-tich-hop-crm/`. Section 12 below
 * exists to hand that visitor over rather than keep them, which is also what
 * keeps the two pages off each other's keywords.
 *
 * THREE EVIDENCE GATES ARE CLOSED — popup (CONTEXT ONLY), SMS/Brandname
 * (WITHHELD), recording sync (WITHHELD). None renders a capability card or a
 * section here. Read the gates at the head of
 * `src/data/salesforceIntegration.ts` before adding any of them.
 *
 * NO FAKE SALESFORCE UI. Every product surface on this page is either the
 * approved Gcalls-side demo UI from `@/components/product-ui` or the
 * deliberately unbranded CRM-record panel from
 * `@/components/integration/visuals`. No Salesforce logo, wordmark or brand
 * colour appears anywhere, and none is used as proof of partnership.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function SalesforceIntegrationPage() {
  const jsonLd = useMemo(() => buildSalesforceJsonLd(SITE_ORIGIN), [])
  const demoHref = leadCtaHref(SALESFORCE_DEMO_LEAD)
  const consultHref = leadCtaHref(SALESFORCE_CONSULT_LEAD)

  return (
    <>
      <JsonLd id="salesforce-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Tích hợp', path: '/tich-hop/' }, { label: 'Salesforce' }]}
          />
        </Container>
      </div>

      {/*
        01 — Hero. Primary CTA carries intent=demo through the shared form; the
        secondary CTA is an in-page anchor to the workflow section.
      */}
      <IntegrationHero
        eyebrow={SF_HERO.eyebrow}
        title={SF_HERO.h1}
        description={SF_HERO.description}
        keyPoints={SF_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: SF_HERO.primaryCta.label, path: demoHref }}
        secondaryCta={SF_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="380px">
            <CrmRecordClickToCallMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain rendered HTML, never hidden in tabs. */}
      <Section ariaLabelledBy="salesforce-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="salesforce-la-gi" className="mt-4">
              {SF_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {SF_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Business problems. No productivity percentage on any pain point. */}
      <IntegrationProblems
        eyebrow={SF_PROBLEMS.eyebrow}
        title={SF_PROBLEMS.h2}
        titleId="bai-toan-salesforce"
        items={SF_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow, under a single approved H2. */}
      <IntegrationWorkflow
        eyebrow={SF_OVERVIEW.eyebrow}
        title={SF_OVERVIEW.h2}
        titleId="tong-quan-salesforce"
        lead={SF_OVERVIEW.description}
        steps={SF_OVERVIEW.flow}
      />

      {/*
        05 — Verified capabilities. Exactly four; see the evidence gates.
        Capability 02 is customer CONTEXT, not a popup — that gate is closed.
      */}
      <Section tinted ariaLabelledBy="nang-luc-salesforce">
        <Container>
          <SectionHeader
            eyebrow={SF_CAPABILITIES.eyebrow}
            title={SF_CAPABILITIES.h2}
            titleId="nang-luc-salesforce"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SF_CAPABILITIES.items.map((item) => (
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
      <Section ariaLabelledBy="quy-trinh-salesforce" className="scroll-mt-20">
        <Container>
          <div id={SF_WORKFLOW.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={SF_WORKFLOW.eyebrow}
            title={SF_WORKFLOW.h2}
            titleId="quy-trinh-salesforce"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SF_WORKFLOW.steps.map((step) => (
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

      {/* 07 — Before / after. A workflow illustration; no ROI percentage. */}
      <IntegrationBeforeAfter
        tinted
        eyebrow={SF_BEFORE_AFTER.eyebrow}
        title={SF_BEFORE_AFTER.h2}
        titleId="truoc-sau-salesforce"
        before={SF_BEFORE_AFTER.before}
        after={SF_BEFORE_AFTER.after}
      />

      {/* 08 — Benefits. Conservative statements only, no number anywhere. */}
      <IntegrationBenefits
        eyebrow={SF_BENEFITS.eyebrow}
        title={SF_BENEFITS.h2}
        titleId="gia-tri-salesforce"
        items={SF_BENEFITS.items}
      />

      {/*
        09 — Use cases.
        QA is deliberately not one of them: it is not a Salesforce-native
        feature, so the note routes that need to QA QC Center instead.
      */}
      <IntegrationUseCases
        tinted
        eyebrow={SF_USE_CASES.eyebrow}
        title={SF_USE_CASES.h2}
        titleId="use-case-salesforce"
        items={SF_USE_CASES.items}
      />

      <Section tinted className="!pt-0">
        <Container>
          <p className="mt-8 flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-relaxed text-muted-foreground">
            <Info size={15} className="shrink-0 text-brand" aria-hidden="true" />
            {SF_USE_CASES.qaNote.lead}
            <Link
              to={SF_USE_CASES.qaNote.link.path}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {SF_USE_CASES.qaNote.link.label}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </Container>
      </Section>

      {/* 10 — Setup. No duration on any step or in total; no edition claim. */}
      <IntegrationSteps
        eyebrow={SF_SETUP.eyebrow}
        title={SF_SETUP.h2}
        titleId="thiet-lap-salesforce"
        steps={SF_SETUP.steps}
      />

      <Section className="!pt-0">
        <Container>
          <Note>{SF_SETUP.note}</Note>
        </Container>
      </Section>

      {/*
        11 — UI preview.
        Gcalls-side surfaces only. The note is structural, not decorative: it is
        what stops the reader inferring these are Salesforce screenshots.
      */}
      <Section tinted ariaLabelledBy="giao-dien-salesforce">
        <Container>
          <SectionHeader
            eyebrow={SF_UI_PREVIEW.eyebrow}
            title={SF_UI_PREVIEW.h2}
            titleId="giao-dien-salesforce"
            lead={SF_UI_PREVIEW.description}
          />

          {/*
            A plain two-column grid rather than the shared overlap composition
            (`ProductVisualWithSupport`). That variant anchors the supporting
            card to `bottom-0` of a box sized by the shorter main card, so from
            `lg` the taller timeline extends upward and covers the section
            heading — reproducible on the locked HubSpot page at the same width,
            so it is a pre-existing shared-composition issue, not one this page
            introduced. Fixing it here page-locally keeps the locked page's
            rendering untouched; the shared component still needs its own fix.

            The mobile contract is unchanged: the two visuals stack in column
            order at 390px, never a floating composition.
          */}
          <div className="mt-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
            <ProductVisual maxWidth="300px" note={false}>
              <CustomerPopupMockup />
            </ProductVisual>
            <ProductVisual maxWidth="440px" note={false}>
              <CallTimelineMockup />
            </ProductVisual>
          </div>

          <Note>{SF_UI_PREVIEW.note}</Note>
        </Container>
      </Section>

      {/* 12 — Salesforce vs the generic CRM page. Hands the visitor over. */}
      <Section ariaLabelledBy="salesforce-vs-crm">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow icon={<Compass size={14} aria-hidden="true" />}>
              {SF_VS_CRM.eyebrow}
            </Eyebrow>
            <GradientHeading id="salesforce-vs-crm" className="mt-4">
              {SF_VS_CRM.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {SF_VS_CRM.description}
            </p>

            <div className="mt-8">
              <Link
                to={SF_VS_CRM.cta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {SF_VS_CRM.cta.label}
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
            {SF_RELATED.h2}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {SF_RELATED.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {SF_RELATED.items.map((item) => (
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
        14 — Product relationships. A routing table, not a capability list: it
        separates the calling layer, the generic CRM solution, this page and QA.
      */}
      <IntegrationBoundaries
        eyebrow={SF_RELATIONSHIPS.eyebrow}
        title={SF_RELATIONSHIPS.h2}
        titleId="quan-he-san-pham-salesforce"
        items={SF_RELATIONSHIPS.items}
      />

      {/* 15 — Trust. Neutral: no partner status, certification or figure. */}
      <Section tinted ariaLabelledBy="pham-vi-salesforce">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{SF_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="pham-vi-salesforce" className="mt-4">
              {SF_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {SF_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={consultHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {SF_TRUST.cta.label}
              </Link>
              {SF_TRUST.links.map((link) => (
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

      {/* 16 — FAQ */}
      <Section ariaLabelledBy="faq-salesforce">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls tích hợp Salesforce"
            titleId="faq-salesforce"
          />
          <div className="mt-10">
            <FaqAccordion items={SF_FAQ} idPrefix="salesforce-faq" />
          </div>
        </Container>
      </Section>

      {/* 17 — Onward links */}
      <Section tinted ariaLabelledBy="lien-ket-salesforce">
        <Container>
          <h2
            id="lien-ket-salesforce"
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {SF_LINKS.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {SF_LINKS.items.map((link) => (
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
      <Section ariaLabelledBy="cta-salesforce">
        <FinalCtaBand
          eyebrow={SF_FINAL_CTA.eyebrow}
          title={SF_FINAL_CTA.h2}
          titleId="cta-salesforce"
          description={SF_FINAL_CTA.description}
          primary={{ label: SF_FINAL_CTA.primaryCta.label, path: demoHref }}
          lead={SALESFORCE_DEMO_LEAD}
          secondary={{ label: SF_FINAL_CTA.secondaryCta.label, path: consultHref }}
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
