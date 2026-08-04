import { useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, FileText, Globe, Info } from 'lucide-react'
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
  INTL_BOUNDARIES,
  INTL_DEPLOYMENT,
  INTL_DIRECT_ANSWER,
  INTL_FAQ,
  INTL_FINAL_CTA,
  INTL_HERO,
  INTL_HOW_IT_WORKS,
  INTL_INBOUND,
  INTL_LEAD,
  INTL_MARKETS,
  INTL_NUMBER_CONCEPT,
  INTL_OPERATIONS,
  INTL_OUTBOUND,
  INTL_PRICING,
  INTL_PROBLEMS,
  INTL_REGISTRATION,
  INTL_REGULATION,
  INTL_TRUST,
  INTL_USE_CASES,
  buildIntlJsonLd,
} from '@/data/internationalCalling'
import {
  CallRoutingMockup,
  InternationalNumbersMockup,
  NumberDirectoryMockup,
} from '@/components/international/visuals'
import { IntegrationBoundaries } from '@/components/integration/IntegrationBoundaries'
import { IntegrationHero } from '@/components/integration/IntegrationHero'
import { IntegrationProblems } from '@/components/integration/IntegrationProblems'
import { IntegrationSteps } from '@/components/integration/IntegrationSteps'
import { IntegrationUseCases } from '@/components/integration/IntegrationUseCases'

/**
 * `/tong-dai-quoc-te/` — International Calling (S04).
 *
 * A SOLUTION page answering "how do we set up and run business calling for the
 * markets we sell into?". It is not a carrier price list, not a Gcalls Plus
 * page and not a country-coverage landing page.
 *
 * Built on the shared integration/solution kit for visual consistency with
 * CRM / Helpdesk / POS, but the business story is market-and-regulation
 * specific: target market → number type → documentation → configuration →
 * inbound/outbound operation.
 *
 * FIVE HISTORICAL CLAIMS ARE WITHHELD — "70+ quốc gia", "tiết kiệm 80–90%",
 * "triển khai 1 ngày – 1 tuần", "Brandname" and "SLA". See the claim guard and
 * evidence gates at the head of `src/data/internationalCalling.ts` before
 * editing any copy on this page.
 *
 * Exactly one H1, in IntegrationHero.
 */
export function InternationalCallingPage() {
  const jsonLd = useMemo(() => buildIntlJsonLd(SITE_ORIGIN), [])
  const leadHref = leadCtaHref(INTL_LEAD)

  return (
    <>
      <JsonLd id="international-calling" data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[{ label: 'Giải pháp' }, { label: 'Tổng đài quốc tế' }]}
          />
        </Container>
      </div>

      {/* 01 — Hero. Primary CTA routes through the shared lead form. */}
      <IntegrationHero
        eyebrow={INTL_HERO.eyebrow}
        title={INTL_HERO.h1}
        description={INTL_HERO.description}
        keyPoints={INTL_HERO.valuePoints.map((v) => `${v.title} — ${v.detail}`)}
        primaryCta={{ label: INTL_HERO.primaryCta.label, path: leadHref }}
        secondaryCta={INTL_HERO.secondaryCta}
        visual={
          <ProductVisual maxWidth="400px">
            <InternationalNumbersMockup />
          </ProductVisual>
        }
      />

      {/* 02 — Direct answer. Plain visible text, never collapsed. */}
      <Section ariaLabelledBy="tong-dai-quoc-te-la-gi">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Định nghĩa</Eyebrow>

            <GradientHeading id="tong-dai-quoc-te-la-gi" className="mt-4">
              {INTL_DIRECT_ANSWER.question}
            </GradientHeading>

            <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
              {INTL_DIRECT_ANSWER.answer}
            </p>
          </div>
        </Container>
      </Section>

      {/* 03 — Problems */}
      <IntegrationProblems
        eyebrow={INTL_PROBLEMS.eyebrow}
        title={INTL_PROBLEMS.h2}
        titleId="bai-toan-quoc-te"
        items={INTL_PROBLEMS.items}
      />

      {/* 04 — What an international number is. §T: categories, not availability. */}
      <Section ariaLabelledBy="dau-so-quoc-te">
        <Container>
          <SectionHeader
            eyebrow={INTL_NUMBER_CONCEPT.eyebrow}
            eyebrowIcon={<Globe size={14} aria-hidden="true" />}
            title={INTL_NUMBER_CONCEPT.h2}
            titleId="dau-so-quoc-te"
            lead={INTL_NUMBER_CONCEPT.description}
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {INTL_NUMBER_CONCEPT.types.map((type) => (
              <Card as="li" key={type.n} className="flex h-full flex-col p-6">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {type.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                  {type.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {type.detail}
                </p>
              </Card>
            ))}
          </ul>

          <Note>{INTL_NUMBER_CONCEPT.note}</Note>
        </Container>
      </Section>

      {/* 05 — Country / regulation differences */}
      <Section tinted ariaLabelledBy="khac-biet-quoc-gia">
        <Container>
          <SectionHeader
            eyebrow={INTL_REGULATION.eyebrow}
            title={INTL_REGULATION.h2}
            titleId="khac-biet-quoc-gia"
            lead={INTL_REGULATION.description}
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {INTL_REGULATION.items.map((item) => (
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

          <Note>{INTL_REGULATION.note}</Note>

          {/*
            Requested markets — NOT a coverage list (data-layer gate §M).
            The "Cần khảo sát" state on every chip and the note below it are
            structural, not decorative: together they are what keeps this list
            from reading as availability. Do not remove either.
          */}
          <div className="mt-14 rounded-[14px] border border-brand-border bg-background p-6 sm:p-8">
            <Eyebrow>{INTL_MARKETS.eyebrow}</Eyebrow>

            <h3
              id="thi-truong-thuong-gap"
              className="mt-4 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
            >
              {INTL_MARKETS.h2}
            </h3>

            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
              {INTL_MARKETS.description}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {INTL_MARKETS.items.map((market) => (
                <li
                  key={market}
                  className="flex items-center gap-2 rounded-full border border-brand-border bg-surface-alt px-3.5 py-2"
                >
                  <span className="text-[15px] font-semibold text-foreground">
                    {market}
                  </span>
                  <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-bold text-brand">
                    {INTL_MARKETS.qualifier}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex max-w-3xl items-start gap-2 text-[14px] leading-relaxed text-muted-foreground">
              <Info
                size={15}
                className="mt-0.5 shrink-0 text-brand"
                aria-hidden="true"
              />
              {INTL_MARKETS.note}
            </p>
          </div>
        </Container>
      </Section>

      {/* 06 — How it works */}
      <Section ariaLabelledBy="cach-trien-khai-heading" className="scroll-mt-20">
        <Container>
          <div id={INTL_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

          <SectionHeader
            eyebrow={INTL_HOW_IT_WORKS.eyebrow}
            title={INTL_HOW_IT_WORKS.h2}
            titleId="cach-trien-khai-heading"
          />

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INTL_HOW_IT_WORKS.steps.map((step) => (
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

      {/* 07 — Inbound */}
      <FeatureSplit
        tinted
        eyebrow={INTL_INBOUND.eyebrow}
        eyebrowIcon={<ArrowDownLeft size={14} aria-hidden="true" />}
        title={INTL_INBOUND.h2}
        titleId="cuoc-goi-den"
        description={INTL_INBOUND.description}
        points={INTL_INBOUND.points}
        visual={
          <ProductVisual maxWidth="380px">
            <CallRoutingMockup />
          </ProductVisual>
        }
      >
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          {INTL_INBOUND.note}
        </p>
      </FeatureSplit>

      {/* 08 — Outbound. §B: no brandname / fixed caller-ID promise. */}
      <FeatureSplit
        reverse
        eyebrow={INTL_OUTBOUND.eyebrow}
        eyebrowIcon={<ArrowUpRight size={14} aria-hidden="true" />}
        title={INTL_OUTBOUND.h2}
        titleId="cuoc-goi-ra"
        description={INTL_OUTBOUND.description}
        points={INTL_OUTBOUND.points}
        visual={
          <ProductVisual maxWidth="380px">
            <NumberDirectoryMockup />
          </ProductVisual>
        }
      >
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          {INTL_OUTBOUND.note}
        </p>
      </FeatureSplit>

      {/* 09 — Number registration / documentation. §D: no durations. */}
      <Section tinted ariaLabelledBy="dang-ky-dau-so">
        <Container>
          <SectionHeader
            eyebrow={INTL_REGISTRATION.eyebrow}
            eyebrowIcon={<FileText size={14} aria-hidden="true" />}
            title={INTL_REGISTRATION.h2}
            titleId="dang-ky-dau-so"
            lead={INTL_REGISTRATION.description}
          />

          <ol className="mt-10 flex flex-col gap-3">
            {INTL_REGISTRATION.steps.map((step) => (
              <Card
                as="li"
                key={step.n}
                className="flex items-start gap-4 p-5 sm:items-center sm:p-6"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <h3 className="text-base font-bold leading-snug tracking-tight text-foreground sm:text-lg">
                  {step.title}
                </h3>
              </Card>
            ))}
          </ol>

          <Note>{INTL_REGISTRATION.note}</Note>
        </Container>
      </Section>

      {/* 10 — Operational management */}
      <Section ariaLabelledBy="quan-ly-van-hanh">
        <Container>
          <SectionHeader
            eyebrow={INTL_OPERATIONS.eyebrow}
            title={INTL_OPERATIONS.h2}
            titleId="quan-ly-van-hanh"
            lead={INTL_OPERATIONS.description}
          />

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {INTL_OPERATIONS.items.map((item) => (
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

      {/* 11 — International use cases */}
      <IntegrationUseCases
        tinted
        eyebrow={INTL_USE_CASES.eyebrow}
        title={INTL_USE_CASES.h2}
        titleId="use-case-quoc-te"
        items={INTL_USE_CASES.items}
      />

      {/* 12 — Product boundaries */}
      <IntegrationBoundaries
        eyebrow={INTL_BOUNDARIES.eyebrow}
        title={INTL_BOUNDARIES.h2}
        titleId="ranh-gioi-quoc-te"
        items={INTL_BOUNDARIES.items}
        related={INTL_BOUNDARIES.related}
      />

      {/* 13 — Deployment. §D: no timeline on any step or in total. */}
      <IntegrationSteps
        tinted
        eyebrow={INTL_DEPLOYMENT.eyebrow}
        title={INTL_DEPLOYMENT.h2}
        titleId="trien-khai-quoc-te"
        steps={INTL_DEPLOYMENT.steps}
      />

      {/* 14 — Configuration & cost */}
      <Section ariaLabelledBy="chi-phi-quoc-te">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{INTL_PRICING.eyebrow}</Eyebrow>
            <GradientHeading id="chi-phi-quoc-te" className="mt-4">
              {INTL_PRICING.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {INTL_PRICING.description}
            </p>

            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {INTL_PRICING.factors.map((factor) => (
                <li
                  key={factor}
                  className="rounded-full bg-brand-light px-4 py-2 text-[15px] font-semibold text-brand"
                >
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <PricingCtaBand
        tinted
        eyebrow="ƯỚC TÍNH"
        title="Chuẩn bị cấu hình trước khi nhận báo giá chính thức"
        titleId="uoc-tinh-quoc-te"
        description="Chọn thị trường, số đầu số và lưu lượng dự kiến để có cấu hình tham khảo, sau đó gửi yêu cầu để Gcalls xác nhận phạm vi triển khai."
        primary={INTL_PRICING.primaryCta}
        secondary={INTL_PRICING.secondaryCta}
      />

      {/* 15 — Trust. Neutral: no coverage count, saving, SLA or uptime. */}
      <Section ariaLabelledBy="cach-lam-viec">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{INTL_TRUST.eyebrow}</Eyebrow>
            <GradientHeading id="cach-lam-viec" className="mt-4">
              {INTL_TRUST.h2}
            </GradientHeading>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {INTL_TRUST.description}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={leadHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {INTL_TRUST.cta.label}
              </Link>
              {INTL_TRUST.links.map((link) => (
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
      <Section tinted ariaLabelledBy="faq-quoc-te">
        <Container>
          <SectionHeader
            eyebrow="Câu hỏi thường gặp"
            title="Câu hỏi thường gặp về tổng đài quốc tế"
            titleId="faq-quoc-te"
          />
          <div className="mt-10">
            <FaqAccordion items={INTL_FAQ} idPrefix="intl-faq" />
          </div>
        </Container>
      </Section>

      {/* 17 — Final CTA */}
      <Section ariaLabelledBy="cta-quoc-te">
        <FinalCtaBand
          eyebrow={INTL_FINAL_CTA.eyebrow}
          title={INTL_FINAL_CTA.h2}
          titleId="cta-quoc-te"
          description={INTL_FINAL_CTA.description}
          primary={INTL_FINAL_CTA.primaryCta}
          lead={INTL_LEAD}
          secondary={INTL_FINAL_CTA.secondaryCta}
          showPhone
        />
      </Section>
    </>
  )
}

/**
 * Scoping note under a section grid.
 *
 * Every conditional statement on this page ("tùy quốc gia", "cần khảo sát") is
 * rendered through this one component so the qualifiers look deliberate and
 * consistent rather than like scattered fine print.
 */
function Note({ children }: { children: string }) {
  return (
    <p className="mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
      <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      {children}
    </p>
  )
}
