import { useMemo, type ReactNode } from 'react'
import { ArrowRight, Phone, ShoppingBag, Store } from 'lucide-react'
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
  POS_BEFORE_AFTER,
  POS_BOUNDARIES,
  POS_CAPABILITIES,
  POS_DEPLOYMENT,
  POS_DIRECT_ANSWER,
  POS_ECOMMERCE,
  POS_FAQ,
  POS_FINAL_CTA,
  POS_HERO,
  POS_HOW_IT_WORKS,
  POS_LEAD,
  POS_OVERVIEW,
  POS_PLUS_RELATION,
  POS_PRICING,
  POS_PROBLEMS,
  POS_RETAIL,
  POS_SALES_CONTEXT,
  POS_TRUST,
  buildPosJsonLd,
} from '@/data/posIntegration'
import { PosContextMockup, SalesContextMockup } from '@/components/pos/visuals'
import { IntegrationBeforeAfter } from '@/components/integration/IntegrationBeforeAfter'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationWorkflow } from '@/components/integration/IntegrationWorkflow'

/**
 * `/tong-dai-tich-hop-pos/` — Gcalls Call Center + POS / sales systems (S03).
 *
 * A SOLUTION page answering "how do I connect calls with customer, order and
 * sales context from my retail systems?". It is not a CRM page, not a Helpdesk
 * page, not a Gcalls CX page and not a vendor landing page.
 *
 * Built on the shared integration kit, but the business story is POS-specific:
 * customer → purchase/order context → call → sales/service follow-up. There is
 * deliberately NO platform ecosystem grid, because the §19 evidence gate
 * resolved to generic positioning.
 *
 * Four evidence gates, all closed negative — see the header of
 * `src/data/posIntegration.ts`:
 *  - Order data: generic sales context only; no specific field is claimed.
 *  - Incoming customer popup: not verified, not published.
 *  - POS Click-to-Call: not verified, not published (not inherited from CRM).
 *  - Platform names: none published; no vendor route exists or is created.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function POSIntegrationPage() {
  const jsonLd = useMemo(() => buildPosJsonLd(SITE_ORIGIN), [])
  const leadHref = leadCtaHref(POS_LEAD)

  return (
    <>
      <JsonLd id="pos-integration" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài tích hợp POS' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA routes through the shared lead form. */}
      <IntegrationHero
        eyebrow={POS_HERO.eyebrow}
        title={POS_HERO.h1}
        description={POS_HERO.description}
        keyPoints={POS_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: POS_HERO.primaryCta.label, path: leadHref }}
        secondaryCta={POS_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="400px">
            <PosContextMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain visible text, never collapsed. */}
      <Section ariaLabelledBy="pos-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="pos-la-gi" className="mt-4">
              {POS_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {POS_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 */}
      <IntegrationProblems
        eyebrow={POS_PROBLEMS.eyebrow}
        title={POS_PROBLEMS.h2}
        titleId="bai-toan-pos"
        items={POS_PROBLEMS.items}
      />

      {/* 04 — Overview + core flow diagram */}
      <IntegrationWorkflow
        eyebrow={POS_OVERVIEW.eyebrow}
        title={POS_OVERVIEW.h2}
        titleId="tong-quan-pos"
        steps={POS_OVERVIEW.flow}
      />

      {/* 05 — How it works */}
      <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
        <Container>
          <div id={POS_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={POS_HOW_IT_WORKS.eyebrow}
            title={POS_HOW_IT_WORKS.h2}
            titleId="cach-hoat-dong-heading"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POS_HOW_IT_WORKS.steps.map((step) => (
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
      <Section ariaLabelledBy="nang-luc-pos">
        <Container>
          <SectionHeader
            eyebrow={POS_CAPABILITIES.eyebrow}
            title={POS_CAPABILITIES.h2}
            titleId="nang-luc-pos"
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {POS_CAPABILITIES.items.map((item) => (
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

      {/* 07 — Sales context. The note keeps field scope explicit. */}
      <FeatureSplit
        tinted
        eyebrow={POS_SALES_CONTEXT.eyebrow}
        eyebrowIcon={<ShoppingBag size={14} aria-hidden="true" />}
        title={POS_SALES_CONTEXT.h2}
        titleId="sales-context"
        description={POS_SALES_CONTEXT.description}
        points={POS_SALES_CONTEXT.points}
        visual={
          <ProductVisual maxWidth="380px">
            <SalesContextMockup />
          </ProductVisual>
        }
      >
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          {POS_SALES_CONTEXT.note}
        </p>
      </FeatureSplit>

      {/* 08 — Before / after workflow */}
      <IntegrationBeforeAfter
        eyebrow={POS_BEFORE_AFTER.eyebrow}
        title={POS_BEFORE_AFTER.h2}
        titleId="truoc-sau-pos"
        before={POS_BEFORE_AFTER.before}
        after={POS_BEFORE_AFTER.after}
      />

      {/* 09 + 10 — Retail and E-commerce use cases */}
      <Section ariaLabelledBy="use-case-ban-le">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <UseCase
              eyebrow={POS_RETAIL.eyebrow}
              icon={<Store size={14} aria-hidden="true" />}
              title={POS_RETAIL.h2}
              titleId="use-case-ban-le"
              description={POS_RETAIL.description}
              points={POS_RETAIL.points}
            />
            <UseCase
              eyebrow={POS_ECOMMERCE.eyebrow}
              icon={<ShoppingBag size={14} aria-hidden="true" />}
              title={POS_ECOMMERCE.h2}
              titleId="use-case-tmdt"
              description={POS_ECOMMERCE.description}
              link={POS_ECOMMERCE.link}
            />
          </div>
        </Container>
      </Section>

      {/* 11 — POS / CRM / Helpdesk / CX boundary */}
      <IntegrationBoundaries
        tinted
        eyebrow={POS_BOUNDARIES.eyebrow}
        title={POS_BOUNDARIES.h2}
        titleId="ranh-gioi-pos"
        items={POS_BOUNDARIES.items}
        related={POS_BOUNDARIES.related}
      />

      {/* 12 — Relationship to the calling layer */}
      <FeatureSplit
        reverse
        eyebrow={POS_PLUS_RELATION.eyebrow}
        eyebrowIcon={<Phone size={14} aria-hidden="true" />}
        title={POS_PLUS_RELATION.h2}
        titleId="lop-nghe-goi"
        description={POS_PLUS_RELATION.description}
        visual={
          <ProductVisual maxWidth="360px">
            <PosContextMockup />
          </ProductVisual>
        }
      >
        <div className="mt-6">
          <Link
            to={POS_PLUS_RELATION.link.path}
            className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {POS_PLUS_RELATION.link.label}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </FeatureSplit>

      {/* 13 — Implementation process */}
      <IntegrationSteps
        tinted
        eyebrow={POS_DEPLOYMENT.eyebrow}
        title={POS_DEPLOYMENT.h2}
        titleId="trien-khai-pos"
        steps={POS_DEPLOYMENT.steps}
      />

      {/* 14 — Trust. Neutral, and carries the generic-platform position. */}
      <Section ariaLabelledBy="du-lieu-thuc-te">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{POS_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="du-lieu-thuc-te" className="mt-4">
              {POS_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {POS_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={leadHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {POS_TRUST.cta.label}
              </Link>
              {POS_TRUST.links.map((link) => (
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

      {/* 15 — Configuration & cost */}
      <PricingCtaBand
        tinted
        eyebrow={POS_PRICING.eyebrow}
        title={POS_PRICING.h2}
        titleId="chi-phi-pos"
        description={POS_PRICING.description}
        primary={POS_PRICING.primaryCta}
        secondary={POS_PRICING.secondaryCta}
      />

      {/* 16 — FAQ */}
      <Section ariaLabelledBy="faq-pos">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về tổng đài tích hợp POS"
            titleId="faq-pos"
          />
          <div className="mt-10">
            <FaqAccordion items={POS_FAQ} idPrefix="pos-faq" />
          </div>
        </Container>
      </Section>

      {/* 17 — Final CTA */}
      <Section tinted ariaLabelledBy="cta-pos">
        <FinalCtaBand
          eyebrow={POS_FINAL_CTA.eyebrow}
          title={POS_FINAL_CTA.h2}
          titleId="cta-pos"
          description={POS_FINAL_CTA.description}
          primary={POS_FINAL_CTA.primaryCta}
          lead={POS_LEAD}
          secondary={POS_FINAL_CTA.secondaryCta}
          showPhone
        />
      </Section>
    </>
  )
}

/** Retail / e-commerce use-case block — same shape, different content. */
function UseCase({
  eyebrow,
  icon,
  title,
  titleId,
  description,
  points,
  link,
}: {
  eyebrow: string
  icon: ReactNode
  title: string
  titleId: string
  description: string
  points?: readonly string[]
  link?: { label: string; path: string }
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

      {points && (
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
      )}

      {link && (
        <div className="mt-6">
          <Link
            to={link.path}
            className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {link.label}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  )
}
