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
import { SupportHandoverMockup } from '@/components/zendesk/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBenefits } from '@/components/integration/IntegrationBenefits'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'
import {
  ZD_BEFORE_AFTER,
  ZD_BENEFITS,
  ZD_BOUNDARY,
  ZD_CAPABILITIES,
  ZD_DIRECT_ANSWER,
  ZD_FAQ,
  ZD_FINAL_CTA,
  ZD_HERO,
  ZD_LINKS,
  ZD_OVERVIEW,
  ZD_PROBLEMS,
  ZD_RELATED,
  ZD_SETUP,
  ZD_SUPPORT_CONTEXT,
  ZD_TRUST,
  ZD_UI_PREVIEW,
  ZD_USE_CASES,
  ZD_VS_HELPDESK,
  ZD_WORKFLOW,
  ZENDESK_CONSULT_LEAD,
  ZENDESK_DEMO_LEAD,
  buildZendeskJsonLd,
} from '@/data/zendeskIntegration'

/**
 * `/tich-hop/zendesk/` — Zendesk platform integration (INT-05).
 *
 * Final page of Integration Cluster V1.
 *
 * A PLATFORM-SPECIFIC HELPDESK page answering "how does Gcalls connect phone
 * conversations with a support team already working in Zendesk?". It is NOT a
 * generic Helpdesk Integration page, NOT a CRM Integration page, NOT a Freshdesk
 * page with renamed labels, NOT a Zendesk tutorial or comparison, NOT an
 * omnichannel Gcalls CX page and NOT a Gcalls Plus product page.
 *
 * TWELVE EVIDENCE GATES WERE RUN (INT-05 §11). Only four capabilities survived:
 * Customer Context, Ticket / Support Record Context, Call Activity, Support
 * Workflow Continuity. WITHHELD: Click-to-Call, embedded call box, manual ticket
 * creation, automatic ticket creation, unknown-caller contact creation,
 * tags/dispositions/status writes, and recording sync into Zendesk. Two gates are
 * SPLIT and must stay split — call history (Gcalls verified / Zendesk conditional)
 * and recording (in Gcalls verified / synced to Zendesk withheld).
 *
 * §10 records that the source SEO workbook marks this integration "Cần kiểm tra",
 * which is why the historical capability list was treated as claims to TEST.
 * Read the gates at the head of `src/data/zendeskIntegration.ts` first.
 *
 * NOT A RENAMED FRESHDESK PAGE. The copy is INT-05's own, the visual is built for
 * this page's handover angle, and `@/components/helpdesk/visuals` is deliberately
 * not imported — reusing the Freshdesk pair twice would make this read as INT-04
 * with the vendor swapped.
 *
 * NO FAKE ZENDESK UI. The single visual is a deliberately unbranded conceptual
 * surface; no Zendesk logo, wordmark or brand colour appears, no branded ticket
 * screen is drawn, and nothing is used as proof of partnership. The Gcalls calling
 * layer is a separate labelled block, captioned in words so it cannot be read as
 * an embedded Zendesk call box.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function ZendeskIntegrationPage() {
  const jsonLd = useMemo(() => buildZendeskJsonLd(SITE_ORIGIN), [])
  const demoHref = leadCtaHref(ZENDESK_DEMO_LEAD)
  const consultHref = leadCtaHref(ZENDESK_CONSULT_LEAD)

  return (
    <>
      <JsonLd id="zendesk-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Tích hợp', path: '/tich-hop/' }, { label: 'Zendesk' }]}
          />
        </Container>
      </div>

      {/*
        01 — Hero. Primary CTA carries intent=demo through the shared form; the
        secondary CTA is an in-page anchor to the workflow section. The visual's
        caption is the §19-required clarification for gate B.
      */}
      <IntegrationHero
        eyebrow={ZD_HERO.eyebrow}
        title={ZD_HERO.h1}
        description={ZD_HERO.description}
        keyPoints={ZD_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: ZD_HERO.primaryCta.label, path: demoHref }}
        secondaryCta={ZD_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="360px" note={ZD_UI_PREVIEW.layerNote}>
            <SupportHandoverMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain rendered HTML, never in an accordion. */}
      <Section ariaLabelledBy="zendesk-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="zendesk-la-gi" className="mt-4">
              {ZD_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {ZD_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Business problems. No numeric productivity claim anywhere. */}
      <IntegrationProblems
        eyebrow={ZD_PROBLEMS.eyebrow}
        title={ZD_PROBLEMS.h2}
        titleId="bai-toan-zendesk"
        items={ZD_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow, under a single approved H2. */}
      <IntegrationWorkflow
        eyebrow={ZD_OVERVIEW.eyebrow}
        title={ZD_OVERVIEW.h2}
        titleId="tong-quan-zendesk"
        lead={ZD_OVERVIEW.description}
        steps={ZD_OVERVIEW.flow}
      />

      {/*
        05 — Core capabilities, in §12's order. The four that survived.
        No Click-to-Call, no call box, no ticket creation, no status/tag write.
      */}
      <Section tinted ariaLabelledBy="nang-luc-zendesk">
        <Container>
          <SectionHeader
            eyebrow={ZD_CAPABILITIES.eyebrow}
            title={ZD_CAPABILITIES.h2}
            titleId="nang-luc-zendesk"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ZD_CAPABILITIES.items.map((item) => (
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
      <Section ariaLabelledBy="quy-trinh-zendesk" className="scroll-mt-20">
        <Container>
          <div id={ZD_WORKFLOW.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={ZD_WORKFLOW.eyebrow}
            title={ZD_WORKFLOW.h2}
            titleId="quy-trinh-zendesk"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ZD_WORKFLOW.steps.map((step) => (
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
        eyebrow={ZD_BEFORE_AFTER.eyebrow}
        title={ZD_BEFORE_AFTER.h2}
        titleId="truoc-sau-zendesk"
        before={ZD_BEFORE_AFTER.before}
        after={ZD_BEFORE_AFTER.after}
      />

      {/*
        08 — Support context.
        Categories only, centred — no second visual, because the hero surface
        already shows this context and a duplicate panel would add nothing. The
        scope line carries two jobs: it keeps these POSSIBLE fields rather than
        synced ones, and it states that Gcalls does not update status or tags
        (gate J).
      */}
      <Section ariaLabelledBy="context-zendesk">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              eyebrow={ZD_SUPPORT_CONTEXT.eyebrow}
              title={ZD_SUPPORT_CONTEXT.h2}
              titleId="context-zendesk"
              lead={ZD_SUPPORT_CONTEXT.description}
            />

            <ul className="mx-auto mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ZD_SUPPORT_CONTEXT.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 rounded-[12px] border border-brand-border bg-background px-4 py-3"
                >
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

            <Note>{ZD_SUPPORT_CONTEXT.scopeNote}</Note>
          </div>
        </Container>
      </Section>

      {/* 09 — Benefits. Conservative statements only, no number anywhere. */}
      <IntegrationBenefits
        eyebrow={ZD_BENEFITS.eyebrow}
        title={ZD_BENEFITS.h2}
        titleId="gia-tri-zendesk"
        items={ZD_BENEFITS.items}
      />

      {/* 10 — Use cases. No claimed result. */}
      <IntegrationUseCases
        tinted
        eyebrow={ZD_USE_CASES.eyebrow}
        title={ZD_USE_CASES.h2}
        titleId="use-case-zendesk"
        items={ZD_USE_CASES.items}
      />

      {/*
        11 — Setup. No duration on any step or in total, no plan claim, and no
        connection method named as the current or universal one.
      */}
      <IntegrationSteps
        eyebrow={ZD_SETUP.eyebrow}
        title={ZD_SETUP.h2}
        titleId="thiet-lap-zendesk"
        steps={ZD_SETUP.steps}
      />

      <Section className="!pt-0">
        <Container>
          <Note>{ZD_SETUP.note}</Note>
        </Container>
      </Section>

      {/*
        12 — UI preview.
        §19 priority 3: no current approved Zendesk screenshot exists here, and no
        Gcalls-side integration screenshot either. Both notes render: the
        gate-B clarification and the not-a-screenshot scoping note.
      */}
      <Section tinted ariaLabelledBy="giao-dien-zendesk">
        <Container>
          <SectionHeader
            eyebrow={ZD_UI_PREVIEW.eyebrow}
            title={ZD_UI_PREVIEW.h2}
            titleId="giao-dien-zendesk"
            lead={ZD_UI_PREVIEW.description}
          />

          <div className="mt-10">
            <ProductVisual maxWidth="360px" note={false}>
              <SupportHandoverMockup />
            </ProductVisual>
          </div>

          <Note>{ZD_UI_PREVIEW.layerNote}</Note>
          <Note>{ZD_UI_PREVIEW.note}</Note>
        </Container>
      </Section>

      {/* 13 — Zendesk vs the generic Helpdesk page. Hands the visitor over. */}
      <Section ariaLabelledBy="zendesk-vs-helpdesk">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow icon={<Compass size={14} aria-hidden="true" />}>
              {ZD_VS_HELPDESK.eyebrow}
            </Eyebrow>
            <GradientHeading id="zendesk-vs-helpdesk" className="mt-4">
              {ZD_VS_HELPDESK.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {ZD_VS_HELPDESK.description}
            </p>

            <div className="mt-8">
              <Link
                to={ZD_VS_HELPDESK.cta.path}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {ZD_VS_HELPDESK.cta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 14 — Other Helpdesk platforms. Routing only, no superiority claim. */}
      <Section tinted ariaLabelledBy="helpdesk-khac">
        <Container>
          <h2
            id="helpdesk-khac"
            className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]"
          >
            {ZD_RELATED.h2}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {ZD_RELATED.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ZD_RELATED.items.map((item) => (
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
        separates the calling layer, the generic Helpdesk solution, this page, the
        omnichannel product and QA.
      */}
      <IntegrationBoundaries
        eyebrow={ZD_BOUNDARY.eyebrow}
        title={ZD_BOUNDARY.h2}
        titleId="ranh-gioi-zendesk"
        items={ZD_BOUNDARY.items}
      />

      {/* 16 — Trust. Neutral: no partner status, certification, SLA or figure. */}
      <Section tinted ariaLabelledBy="pham-vi-zendesk">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{ZD_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="pham-vi-zendesk" className="mt-4">
              {ZD_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {ZD_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={consultHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {ZD_TRUST.cta.label}
              </Link>
              {ZD_TRUST.links.map((link) => (
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
      <Section ariaLabelledBy="faq-zendesk">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về Gcalls tích hợp Zendesk"
            titleId="faq-zendesk"
          />
          <div className="mt-10">
            <FaqAccordion items={ZD_FAQ} idPrefix="zendesk-faq" />
          </div>
        </Container>
      </Section>

      {/* 18 — Onward links */}
      <Section tinted ariaLabelledBy="lien-ket-zendesk">
        <Container>
          <h2
            id="lien-ket-zendesk"
            className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
          >
            {ZD_LINKS.h2}
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
            {ZD_LINKS.items.map((link) => (
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
      <Section ariaLabelledBy="cta-zendesk">
        <FinalCtaBand
          eyebrow={ZD_FINAL_CTA.eyebrow}
          title={ZD_FINAL_CTA.h2}
          titleId="cta-zendesk"
          description={ZD_FINAL_CTA.description}
          primary={{ label: ZD_FINAL_CTA.primaryCta.label, path: demoHref }}
          lead={ZENDESK_DEMO_LEAD}
          secondary={{ label: ZD_FINAL_CTA.secondaryCta.label, path: consultHref }}
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
