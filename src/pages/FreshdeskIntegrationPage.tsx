import { useMemo } from 'react'
import { ArrowRight, Check, Compass, Info } from 'lucide-react'
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
  HelpdeskFlowMockup,
  SupportContextMockup,
} from '@/components/helpdesk/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBenefits } from '@/components/integration/IntegrationBenefits'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import {
  FD_BEFORE_AFTER,
  FD_BENEFITS,
  FD_BOUNDARY,
  FD_CAPABILITIES,
  FD_DIRECT_ANSWER,
  FD_FAQ,
  FD_FINAL_CTA,
  FD_HERO,
  FD_LINKS,
  FD_OVERVIEW,
  FD_PROBLEMS,
  FD_RELATED,
  FD_SETUP,
  FD_SUPPORT_CONTEXT,
  FD_TRUST,
  FD_UI_PREVIEW,
  FD_USE_CASES,
  FD_VS_HELPDESK,
  FD_WORKFLOW,
  FRESHDESK_CONSULT_LEAD,
  FRESHDESK_DEMO_LEAD,
  buildFreshdeskJsonLd,
} from '@/data/freshdeskIntegration'

/**
 * `/tich-hop/freshdesk/` — Freshdesk platform integration (INT-04).
 *
 * A PLATFORM-SPECIFIC HELPDESK page answering "how does Gcalls connect calls
 * with a support team already working in Freshdesk?". It is NOT a general
 * Helpdesk Integration page, NOT a CRM Integration page, NOT a Freshdesk
 * tutorial, NOT a Zendesk page with renamed labels, NOT an omnichannel Gcalls CX
 * page and NOT a Gcalls Plus feature page.
 *
 * THIS IS A TICKET WORKFLOW, NOT A CRM RECORD WORKFLOW. Tickets and support
 * requests are the axis throughout, and no CRM-page wording was reused.
 *
 * ELEVEN EVIDENCE GATES WERE RUN (INT-04 §11). Only four capabilities survived:
 * Customer Context, Call Activity, Ticket / Support Record Context, Support
 * Workflow Continuity. WITHHELD: Click-to-Call, incoming call / call box,
 * Click-to-SMS, manual ticket creation, automatic ticket creation, unknown-caller
 * contact creation, and recording sync into Freshdesk. Two gates are SPLIT and
 * must stay split — call history (Gcalls verified / Freshdesk conditional) and
 * recording (in Gcalls verified / synced to Freshdesk withheld).
 *
 * The narrower result than INT-01/02/03 is deliberate: `helpdeskNeeds` enumerates
 * two connection needs where `crmNeeds` enumerates four and includes
 * Click-to-Call. Read the gates at the head of
 * `src/data/freshdeskIntegration.ts` before adding anything.
 *
 * NO FAKE FRESHDESK UI. Both visuals are the deliberately unbranded conceptual
 * support surfaces from `@/components/helpdesk/visuals` — reused, not cloned, and
 * already correct for this gate set (they depict linking to an EXISTING support
 * record, never creation). No Freshdesk logo, wordmark or brand colour appears,
 * and nothing is used as proof of partnership.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function FreshdeskIntegrationPage() {
  const jsonLd = useMemo(() => buildFreshdeskJsonLd(SITE_ORIGIN), [])
  const demoHref = leadCtaHref(FRESHDESK_DEMO_LEAD)
  const consultHref = leadCtaHref(FRESHDESK_CONSULT_LEAD)

  return (
    <>
      <JsonLd id="freshdesk-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Tích hợp', path: '/tich-hop/' }, { label: 'Freshdesk' }]}
          />
        </Container>
      </div>

      {/*
        01 — Hero. Primary CTA carries intent=demo through the shared form; the
        secondary CTA is an in-page anchor to the workflow section.
      */}
      <IntegrationHero
        eyebrow={FD_HERO.eyebrow}
        title={FD_HERO.h1}
        description={FD_HERO.description}
        keyPoints={FD_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: FD_HERO.primaryCta.label, path: demoHref }}
        secondaryCta={FD_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="360px">
            <HelpdeskFlowMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain rendered HTML, never in an accordion. */}
      <Section ariaLabelledBy="freshdesk-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="freshdesk-la-gi" className="mt-4">
              {FD_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {FD_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Business problems. No productivity figure anywhere. */}
      <IntegrationProblems
        eyebrow={FD_PROBLEMS.eyebrow}
        title={FD_PROBLEMS.h2}
        titleId="bai-toan-freshdesk"
        items={FD_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow, under a single approved H2. */}
      <IntegrationWorkflow
        eyebrow={FD_OVERVIEW.eyebrow}
        title={FD_OVERVIEW.h2}
        titleId="tong-quan-freshdesk"
        lead={FD_OVERVIEW.description}
        steps={FD_OVERVIEW.flow}
      />

      {/*
        05 — Core capabilities. The four that survived the gates.
        No Click-to-Call, no call box, no SMS, no ticket creation card.
      */}
      <Section tinted ariaLabelledBy="nang-luc-freshdesk">
        <Container>
          <SectionHeader
            eyebrow={FD_CAPABILITIES.eyebrow}
            title={FD_CAPABILITIES.h2}
            titleId="nang-luc-freshdesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FD_CAPABILITIES.items.map((item) => (
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
      <Section ariaLabelledBy="quy-trinh-freshdesk" className="scroll-mt-20">
        <Container>
          <div id={FD_WORKFLOW.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={FD_WORKFLOW.eyebrow}
            title={FD_WORKFLOW.h2}
            titleId="quy-trinh-freshdesk"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FD_WORKFLOW.steps.map((step) => (
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

      {/* 07 — Before / after. Illustrative only; no ROI percentage. */}
      <IntegrationBeforeAfter
        tinted
        eyebrow={FD_BEFORE_AFTER.eyebrow}
        title={FD_BEFORE_AFTER.h2}
        titleId="truoc-sau-freshdesk"
        before={FD_BEFORE_AFTER.before}
        after={FD_BEFORE_AFTER.after}
      />

      {/*
        08 — Support context.
        The category list is exactly S02's approved set. `company` and
        `assigned agent` are deliberately absent — see the data-file note. The
        scope line is what keeps this POSSIBLE context rather than synced fields.
      */}
      <Section ariaLabelledBy="context-freshdesk">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow>{FD_SUPPORT_CONTEXT.eyebrow}</Eyebrow>

              <GradientHeading id="context-freshdesk" className="mt-4">
                {FD_SUPPORT_CONTEXT.h2}
              </GradientHeading>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {FD_SUPPORT_CONTEXT.description}
              </p>

              <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FD_SUPPORT_CONTEXT.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                      aria-hidden="true"
                    >
                      <Check size={12} className="text-brand" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <Note>{FD_SUPPORT_CONTEXT.scopeNote}</Note>
            </div>

            <ProductVisual maxWidth="380px" note={false}>
              <SupportContextMockup />
            </ProductVisual>
          </div>
        </Container>
      </Section>

      {/* 09 — Benefits. Conservative statements only, no number anywhere. */}
      <IntegrationBenefits
        eyebrow={FD_BENEFITS.eyebrow}
        title={FD_BENEFITS.h2}
        titleId="gia-tri-freshdesk"
        items={FD_BENEFITS.items}
      />

      {/* 10 — Use cases. No result claim. */}
      <IntegrationUseCases
        tinted
        eyebrow={FD_USE_CASES.eyebrow}
        title={FD_USE_CASES.h2}
        titleId="use-case-freshdesk"
        items={FD_USE_CASES.items}
      />

      {/*
        11 — Setup. No duration on any step or in total, no plan claim, and no
        extension named as the current or universal method.
      */}
      <IntegrationSteps
        eyebrow={FD_SETUP.eyebrow}
        title={FD_SETUP.h2}
        titleId="thiet-lap-freshdesk"
        steps={FD_SETUP.steps}
      />

      <Section className="!pt-0">
        <Container>
          <Note>{FD_SETUP.note}</Note>
        </Container>
      </Section>

      {/*
        12 — UI preview.
        §19 priority 3: no real Freshdesk screenshot exists here, and none could
        be verified as current behaviour. The conceptual unbranded surface depicts
        linking a call to an EXISTING support record — never creation.
      */}
      <Section tinted ariaLabelledBy="giao-dien-freshdesk">
        <Container>
          <SectionHeader
            eyebrow={FD_UI_PREVIEW.eyebrow}
            title={FD_UI_PREVIEW.h2}
            titleId="giao-dien-freshdesk"
            lead={FD_UI_PREVIEW.description}
          />

          <div className="mt-10">
            <ProductVisual maxWidth="360px" note={false}>
              <HelpdeskFlowMockup />
            </ProductVisual>
          </div>

          <Note>{FD_UI_PREVIEW.note}</Note>
        </Container>
      </Section>

      {/* 13 — Freshdesk vs the generic Helpdesk page. Hands the visitor over. */}
      <Section ariaLabelledBy="freshdesk-vs-helpdesk">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow icon={<Compass size={14} aria-hidden="true" />}>
              {FD_VS_HELPDESK.eyebrow}
            </Eyebrow>
            <GradientHeading id="freshdesk-vs-helpdesk" className="mt-4">
              {FD_VS_HELPDESK.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {FD_VS_HELPDESK.description}
            </p>

            <div className="mt-8">
              <Link
                to={FD_VS_HELPDESK.cta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {FD_VS_HELPDESK.cta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 14 — Other Helpdesk platforms. Routing only, no vendor comparison. */}
      <Section tinted ariaLabelledBy="helpdesk-khac">
        <Container>
          <h2
            id="helpdesk-khac"
            className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
          >
            {FD_RELATED.h2}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {FD_RELATED.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FD_RELATED.items.map((item) => (
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
        15 — Product boundaries. A routing table, not a capability list: it
        separates the calling layer, the generic Helpdesk solution, this page,
        the omnichannel product and QA.
      */}
      <IntegrationBoundaries
        eyebrow={FD_BOUNDARY.eyebrow}
        title={FD_BOUNDARY.h2}
        titleId="ranh-gioi-freshdesk"
        items={FD_BOUNDARY.items}
      />

      {/* 16 — Trust. Neutral: no partner status, certification, SLA or figure. */}
      <Section tinted ariaLabelledBy="pham-vi-freshdesk">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{FD_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="pham-vi-freshdesk" className="mt-4">
              {FD_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {FD_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={consultHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {FD_TRUST.cta.label}
              </Link>
              {FD_TRUST.links.map((link) => (
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

      {/*
        17 — FAQ. Five of the seven answers are the approved conservative
        branches: FAQ 2 (no Click-to-Call claim), FAQ 3 (no field list), FAQ 4
        (no automatic ticket creation), FAQ 5 and FAQ 6 (both gate splits).
      */}
      <Section ariaLabelledBy="faq-freshdesk">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls tích hợp Freshdesk"
            titleId="faq-freshdesk"
          />
          <div className="mt-10">
            <FaqAccordion items={FD_FAQ} idPrefix="freshdesk-faq" />
          </div>
        </Container>
      </Section>

      {/* 18 — Onward links */}
      <Section tinted ariaLabelledBy="lien-ket-freshdesk">
        <Container>
          <h2
            id="lien-ket-freshdesk"
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {FD_LINKS.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {FD_LINKS.items.map((link) => (
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
        19 — Final CTA.
        Two different intents: primary demo, secondary consultation. The
        secondary path is a pre-built lead href rather than a plain route, so
        intent=consultation survives to the form.
      */}
      <Section ariaLabelledBy="cta-freshdesk">
        <FinalCtaBand
          eyebrow={FD_FINAL_CTA.eyebrow}
          title={FD_FINAL_CTA.h2}
          titleId="cta-freshdesk"
          description={FD_FINAL_CTA.description}
          primary={{ label: FD_FINAL_CTA.primaryCta.label, path: demoHref }}
          lead={FRESHDESK_DEMO_LEAD}
          secondary={{ label: FD_FINAL_CTA.secondaryCta.label, path: consultHref }}
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
