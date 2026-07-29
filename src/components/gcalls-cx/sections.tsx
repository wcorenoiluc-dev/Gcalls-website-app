import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  HelpCircle,
  Inbox,
  Layers,
  MessagesSquare,
  Plug,
  Rocket,
  Route,
  Target,
  TicketCheck,
  TrendingUp,
  UserSearch,
} from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { FeatureSplit } from '@/components/common/FeatureSplit'
import { ProductVisual } from '@/components/common/ProductVisual'
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import {
  CX_BENEFITS,
  CX_BOUNDARIES,
  CX_CHANNELS,
  CX_CONTEXT,
  CX_DEMO_LEAD,
  CX_DEPLOYMENT,
  CX_DIRECT_ANSWER,
  CX_HERO,
  CX_HOW_IT_WORKS,
  CX_INBOX,
  CX_INTEGRATION,
  CX_OVERVIEW,
  CX_PROBLEMS,
  CX_REPORTING,
  CX_TICKETS,
  CX_TRUST,
  CX_USE_CASES,
} from '@/data/gcallsCx'
import {
  CustomerContextMockup,
  CxReportingMockup,
  OmnichannelInboxMockup,
  TicketPanelMockup,
} from './visuals'

const PRIMARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const SECONDARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Shared demo CTA — always routes through the shared lead architecture. */
export function CxDemoCta({
  label,
  className = PRIMARY_BTN,
}: {
  label: string
  className?: string
}) {
  return (
    <Link
      to={leadCtaHref(CX_DEMO_LEAD)}
      onClick={() =>
        track('cta_clicked', {
          label,
          source: CX_DEMO_LEAD.source,
          intent: CX_DEMO_LEAD.intent,
          product: CX_DEMO_LEAD.product,
        })
      }
      className={className}
    >
      {label}
    </Link>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

export function CxHero() {
  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background:
          'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow>{CX_HERO.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {CX_HERO.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {CX_HERO.description}
            </p>

            <ul className="mt-7 flex flex-col gap-5">
              {CX_HERO.valuePoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                    aria-hidden="true"
                  >
                    <Check size={12} className="text-brand" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-base font-semibold leading-snug text-foreground">
                      {point.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                      {point.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <CxDemoCta label={CX_HERO.primaryCta.label} />

              <a href={CX_HERO.secondaryCta.href} className={SECONDARY_BTN}>
                {CX_HERO.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <ProductVisual maxWidth="560px">
            <OmnichannelInboxMockup />
          </ProductVisual>
        </div>
      </Container>
    </section>
  )
}

/* ── 02 Direct answer / AIO ──────────────────────────────────────────────── */

export function CxDirectAnswer() {
  return (
    <Section ariaLabelledBy="gcalls-cx-la-gi">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-brand-border bg-brand-light/40 px-6 py-8 sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px]">
            <HelpCircle size={14} aria-hidden="true" />
            Định nghĩa
          </span>

          <h2
            id="gcalls-cx-la-gi"
            className="mt-4 text-[22px] font-extrabold leading-snug tracking-tight text-foreground sm:text-[26px]"
          >
            {CX_DIRECT_ANSWER.question}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {CX_DIRECT_ANSWER.answer}
          </p>
        </div>
      </Container>
    </Section>
  )
}

/* ── 03 Problems ─────────────────────────────────────────────────────────── */

export function CxProblems() {
  return (
    <Section tinted ariaLabelledBy="bai-toan-da-kenh">
      <Container>
        <SectionHeader
          eyebrow={CX_PROBLEMS.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={CX_PROBLEMS.h2}
          titleId="bai-toan-da-kenh"
          lead={CX_PROBLEMS.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CX_PROBLEMS.items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full gap-4 p-6">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {item.n}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {item.detail}
                </p>
              </div>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 04 Overview ─────────────────────────────────────────────────────────── */

export function CxOverview() {
  return (
    <Section ariaLabelledBy="omnichannel-workspace">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow icon={<Layers size={14} aria-hidden="true" />}>
              {CX_OVERVIEW.eyebrow}
            </Eyebrow>

            <GradientHeading id="omnichannel-workspace" className="mt-4">
              {CX_OVERVIEW.h2}
            </GradientHeading>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {CX_OVERVIEW.description}
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CX_OVERVIEW.components.map((component) => (
                <li key={component} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                    aria-hidden="true"
                  >
                    <Check size={12} className="text-brand" strokeWidth={3} />
                  </span>
                  <span className="text-base leading-relaxed text-foreground">
                    {component}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ProductVisual maxWidth="520px">
            <CustomerContextMockup />
          </ProductVisual>
        </div>
      </Container>
    </Section>
  )
}

/* ── 05 Channels ─────────────────────────────────────────────────────────── */

/**
 * Exactly the five channels evidenced by the approved estimator config. Each
 * description is conditional on deployment — no universal connector guarantee.
 */
export function CxChannels() {
  return (
    <Section tinted ariaLabelledBy="diem-cham">
      <Container>
        <SectionHeader
          eyebrow={CX_CHANNELS.eyebrow}
          eyebrowIcon={<MessagesSquare size={14} aria-hidden="true" />}
          title={CX_CHANNELS.h2}
          titleId="diem-cham"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CX_CHANNELS.items.map((item) => (
            <Card as="li" key={item.name} className="flex h-full flex-col p-6">
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                {item.name}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 06 Omnichannel inbox ────────────────────────────────────────────────── */

export function CxInbox() {
  return (
    <FeatureSplit
      eyebrow={CX_INBOX.eyebrow}
      eyebrowIcon={<Inbox size={14} aria-hidden="true" />}
      title={CX_INBOX.h2}
      titleId="omnichannel-inbox"
      description={CX_INBOX.description}
      points={CX_INBOX.points}
      visual={
        <ProductVisual
          maxWidth="520px"
          note="Giao diện minh họa. Mã khách hàng, hội thoại và trạng thái hiển thị là dữ liệu mẫu."
        >
          <OmnichannelInboxMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 07 Ticket & workflow ────────────────────────────────────────────────── */

export function CxTickets() {
  return (
    <FeatureSplit
      reverse
      tinted
      eyebrow={CX_TICKETS.eyebrow}
      eyebrowIcon={<TicketCheck size={14} aria-hidden="true" />}
      title={CX_TICKETS.h2}
      titleId="ticket-workflow"
      description={CX_TICKETS.description}
      points={CX_TICKETS.points}
      visual={
        <ProductVisual
          maxWidth="480px"
          note="Giao diện minh họa. Mã ticket, người phụ trách và lịch sử hiển thị là dữ liệu mẫu."
        >
          <TicketPanelMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 08 Customer context ─────────────────────────────────────────────────── */

export function CxCustomerContext() {
  return (
    <FeatureSplit
      eyebrow={CX_CONTEXT.eyebrow}
      eyebrowIcon={<UserSearch size={14} aria-hidden="true" />}
      title={CX_CONTEXT.h2}
      titleId="customer-context"
      description={CX_CONTEXT.description}
      points={CX_CONTEXT.points}
      visual={
        <ProductVisual
          maxWidth="480px"
          note="Giao diện minh họa. Thông tin khách hàng hiển thị là dữ liệu mẫu, không phải dữ liệu thật."
        >
          <CustomerContextMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 09 How it works ─────────────────────────────────────────────────────── */

export function CxHowItWorks() {
  return (
    <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
      <Container>
        <div id={CX_HOW_IT_WORKS.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={CX_HOW_IT_WORKS.eyebrow}
          eyebrowIcon={<Route size={14} aria-hidden="true" />}
          title={CX_HOW_IT_WORKS.h2}
          titleId="cach-hoat-dong-heading"
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CX_HOW_IT_WORKS.steps.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
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
  )
}

/* ── 10 Reporting ────────────────────────────────────────────────────────── */

export function CxReporting() {
  return (
    <FeatureSplit
      reverse
      eyebrow={CX_REPORTING.eyebrow}
      eyebrowIcon={<BarChart3 size={14} aria-hidden="true" />}
      title={CX_REPORTING.h2}
      titleId="bao-cao-van-hanh"
      description={CX_REPORTING.description}
      points={CX_REPORTING.points}
      visual={
        <ProductVisual
          maxWidth="460px"
          note="Giao diện minh họa. Toàn bộ số liệu, trạng thái và phân bổ kênh hiển thị là dữ liệu mẫu, không phải kết quả vận hành của khách hàng Gcalls."
        >
          <CxReportingMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 11 Operational benefits ─────────────────────────────────────────────── */

export function CxBenefits() {
  return (
    <Section tinted ariaLabelledBy="gia-tri-van-hanh">
      <Container>
        <SectionHeader
          eyebrow={CX_BENEFITS.eyebrow}
          eyebrowIcon={<TrendingUp size={14} aria-hidden="true" />}
          title={CX_BENEFITS.h2}
          titleId="gia-tri-van-hanh"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CX_BENEFITS.items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 12 Use cases ────────────────────────────────────────────────────────── */

export function CxUseCases() {
  return (
    <Section ariaLabelledBy="tinh-huong-su-dung">
      <Container>
        <SectionHeader
          eyebrow={CX_USE_CASES.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={CX_USE_CASES.h2}
          titleId="tinh-huong-su-dung"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CX_USE_CASES.items.map((item) => (
            <Card as="li" key={item.role} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.role}
              </h3>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>

              {'link' in item && item.link && (
                <Link to={item.link.path} className={`mt-4 self-start ${INLINE_LINK}`}>
                  {item.link.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 13 CRM & system integration ─────────────────────────────────────────── */

/** Hand-off only. The CRM keyword stays owned by /tong-dai-tich-hop-crm/. */
export function CxIntegration() {
  return (
    <Section tinted ariaLabelledBy="ket-noi-he-thong">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow icon={<Plug size={14} aria-hidden="true" />}>
            {CX_INTEGRATION.eyebrow}
          </Eyebrow>

          <GradientHeading id="ket-noi-he-thong" className="mt-4">
            {CX_INTEGRATION.h2}
          </GradientHeading>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {CX_INTEGRATION.description}
          </p>

          <div className="mt-7 flex justify-center">
            <Link to={CX_INTEGRATION.primaryLink.path} className={SECONDARY_BTN}>
              {CX_INTEGRATION.primaryLink.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-5 flex flex-wrap justify-center gap-x-6">
            {CX_INTEGRATION.relatedLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className={INLINE_LINK}>
                  {l.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

/* ── 14 Product boundaries ───────────────────────────────────────────────── */

export function CxBoundaries() {
  return (
    <Section ariaLabelledBy="chon-dung-giai-phap">
      <Container>
        <SectionHeader
          eyebrow={CX_BOUNDARIES.eyebrow}
          eyebrowIcon={<Compass size={14} aria-hidden="true" />}
          title={CX_BOUNDARIES.h2}
          titleId="chon-dung-giai-phap"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CX_BOUNDARIES.items.map((item) => {
            const body = (
              <>
                <span className="block text-[15px] leading-snug text-muted-foreground">
                  {item.need}
                </span>
                <span className="mt-1.5 block text-base font-bold leading-snug text-brand">
                  {item.product}
                </span>
              </>
            )

            return 'current' in item && item.current ? (
              <Card as="li" key={item.product} highlighted className="p-5">
                <div className="flex h-full flex-col">
                  {body}
                  <span className="mt-3 inline-flex w-fit items-center rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-brand">
                    Trang hiện tại
                  </span>
                </div>
              </Card>
            ) : (
              <Card as="li" key={item.product} className="p-5">
                <Link
                  to={item.path}
                  className="group flex min-h-11 items-start justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="min-w-0 group-hover:underline">{body}</span>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand"
                  />
                </Link>
              </Card>
            )
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link to={CX_BOUNDARIES.allSolutions.path} className={INLINE_LINK}>
            {CX_BOUNDARIES.allSolutions.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

/* ── 15 Deployment ───────────────────────────────────────────────────────── */

/** No fixed duration is promised anywhere — none is evidenced. */
export function CxDeployment() {
  return (
    <Section tinted ariaLabelledBy="trien-khai-cx">
      <Container>
        <SectionHeader
          eyebrow={CX_DEPLOYMENT.eyebrow}
          eyebrowIcon={<Rocket size={14} aria-hidden="true" />}
          title={CX_DEPLOYMENT.h2}
          titleId="trien-khai-cx"
          lead={CX_DEPLOYMENT.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CX_DEPLOYMENT.steps.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {step.title}
              </h3>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

/* ── 16 Trust (neutral) ──────────────────────────────────────────────────── */

/**
 * No verified Gcalls CX customer case exists in the repository, so none is
 * shown. Nothing is fabricated — no logo, quote, result or figure.
 */
export function CxTrust() {
  return (
    <Section ariaLabelledBy="trien-khai-thuc-te">
      <Container>
        <Card className="mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center sm:px-10">
          <Eyebrow>{CX_TRUST.eyebrow}</Eyebrow>

          <GradientHeading id="trien-khai-thuc-te" className="mt-4">
            {CX_TRUST.h2}
          </GradientHeading>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {CX_TRUST.description}
          </p>

          <div className="mt-7 w-full sm:w-auto">
            <CxDemoCta label={CX_TRUST.cta.label} />
          </div>

          <Link to={CX_TRUST.link.path} className={`mt-4 ${INLINE_LINK}`}>
            {CX_TRUST.link.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Card>
      </Container>
    </Section>
  )
}
