import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  Info,
  ListChecks,
  Plug,
  Repeat,
  Rocket,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
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
  VB_CAPABILITIES,
  VB_CONSULT_LEAD,
  VB_DEPLOYMENT,
  VB_HERO,
  VB_HOW_IT_WORKS,
  VB_HUMAN_AI,
  VB_INDUSTRIES,
  VB_INTEGRATION,
  VB_OUTCOMES,
  VB_PROBLEMS,
  VB_USE_CASES,
} from '@/data/voicebotAi'
import { VoicebotCampaignMockup, VoicebotHandoffMockup } from './visuals'

const PRIMARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const SECONDARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/**
 * Shared consultation CTA — always routes through the shared lead architecture
 * (`/lien-he/` + categorical query context), never to a dead `#`.
 */
export function ConsultCta({
  label,
  className = PRIMARY_BTN,
}: {
  label: string
  className?: string
}) {
  return (
    <Link
      to={leadCtaHref(VB_CONSULT_LEAD)}
      onClick={() =>
        track('cta_clicked', {
          label,
          source: VB_CONSULT_LEAD.source,
          intent: VB_CONSULT_LEAD.intent,
          product: VB_CONSULT_LEAD.product,
        })
      }
      className={className}
    >
      {label}
    </Link>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

export function VoicebotHero() {
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
          {/* Text first in DOM order → first on mobile. */}
          <div>
            <Eyebrow>{VB_HERO.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {VB_HERO.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {VB_HERO.description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ConsultCta label={VB_HERO.primaryCta.label} />

              <a href={VB_HERO.secondaryCta.href} className={SECONDARY_BTN}>
                {VB_HERO.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>

            <p className="mt-5 flex max-w-xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
              <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {VB_HERO.microcopy}
            </p>
          </div>

          {/* Visual second. Caption states plainly that it is an illustration. */}
          <ProductVisual
            maxWidth="560px"
            note="Minh họa giao diện. Đây là hình minh họa được dựng lại, không phải ảnh chụp hệ thống đang vận hành; toàn bộ số liệu là dữ liệu mẫu."
          >
            <VoicebotCampaignMockup />
          </ProductVisual>
        </div>
      </Container>
    </section>
  )
}

/* ── 02 Operational problem ──────────────────────────────────────────────── */

export function VoicebotProblems() {
  return (
    <Section tinted ariaLabelledBy="bai-toan-van-hanh">
      <Container>
        <SectionHeader
          eyebrow={VB_PROBLEMS.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={VB_PROBLEMS.h2}
          titleId="bai-toan-van-hanh"
          lead={VB_PROBLEMS.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VB_PROBLEMS.items.map((item) => (
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

/* ── 03 Use cases ────────────────────────────────────────────────────────── */

/** Target of the hero's secondary CTA — the anchor must stay on this section. */
export function VoicebotUseCases() {
  return (
    <Section ariaLabelledBy="tinh-huong-ung-dung-heading">
      <Container>
        <div id={VB_USE_CASES.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={VB_USE_CASES.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={VB_USE_CASES.h2}
          titleId="tinh-huong-ung-dung-heading"
          lead={VB_USE_CASES.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VB_USE_CASES.items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {item.n}
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 04 How it works ─────────────────────────────────────────────────────── */

export function VoicebotHowItWorks() {
  return (
    <Section tinted ariaLabelledBy="quy-trinh-hoat-dong">
      <Container>
        <SectionHeader
          eyebrow={VB_HOW_IT_WORKS.eyebrow}
          eyebrowIcon={<Route size={14} aria-hidden="true" />}
          title={VB_HOW_IT_WORKS.h2}
          titleId="quy-trinh-hoat-dong"
          lead={VB_HOW_IT_WORKS.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VB_HOW_IT_WORKS.steps.map((step) => (
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

/* ── 05 Solution capabilities ────────────────────────────────────────────── */

/**
 * The scope note under the list is required, not decorative: it is what keeps
 * these five lines readable as survey scope rather than a committed feature set.
 */
export function VoicebotCapabilities() {
  return (
    <FeatureSplit
      eyebrow={VB_CAPABILITIES.eyebrow}
      eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
      title={VB_CAPABILITIES.h2}
      titleId="kha-nang-giai-phap"
      description={VB_CAPABILITIES.description}
      points={VB_CAPABILITIES.points}
      visual={
        <ProductVisual
          maxWidth="480px"
          note="Minh họa giao diện. Mã liên hệ và lý do chuyển tiếp là dữ liệu mẫu."
        >
          <VoicebotHandoffMockup />
        </ProductVisual>
      }
    >
      <p className="mt-6 flex max-w-xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
        <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
        {VB_CAPABILITIES.note}
      </p>
    </FeatureSplit>
  )
}

/* ── 06 Human + AI ───────────────────────────────────────────────────────── */

/**
 * The section that keeps this page from reading as "Voicebot thay thế nhân
 * viên". Placed immediately after the capability section, deliberately.
 */
export function VoicebotHumanAi() {
  return (
    <Section tinted ariaLabelledBy="con-nguoi-va-ai">
      <Container>
        <SectionHeader
          eyebrow={VB_HUMAN_AI.eyebrow}
          eyebrowIcon={<UserCheck size={14} aria-hidden="true" />}
          title={VB_HUMAN_AI.h2}
          titleId="con-nguoi-va-ai"
          lead={VB_HUMAN_AI.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {VB_HUMAN_AI.columns.map((column, i) => (
            <Card as="li" key={column.role} className="flex h-full flex-col p-6 sm:p-8">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-brand"
                aria-hidden="true"
              >
                {i === 0 ? <Sparkles size={20} /> : <UserCheck size={20} />}
              </span>

              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                {column.role}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {column.detail}
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {column.items.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                      aria-hidden="true"
                    >
                      <Check size={12} className="text-brand" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-foreground sm:text-base">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          {VB_HUMAN_AI.closing}
        </p>
      </Container>
    </Section>
  )
}

/* ── 07 Integration ──────────────────────────────────────────────────────── */

export function VoicebotIntegration() {
  return (
    <Section ariaLabelledBy="tich-hop-quy-trinh">
      <Container>
        <SectionHeader
          eyebrow={VB_INTEGRATION.eyebrow}
          eyebrowIcon={<Plug size={14} aria-hidden="true" />}
          title={VB_INTEGRATION.h2}
          titleId="tich-hop-quy-trinh"
          lead={VB_INTEGRATION.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VB_INTEGRATION.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {VB_INTEGRATION.links.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-brand-border bg-background px-4 text-[15px] font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {l.label}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap justify-center gap-x-6">
          {VB_INTEGRATION.hubLinks.map((l) => (
            <li key={l.path}>
              <Link to={l.path} className={INLINE_LINK}>
                {l.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 08 Industries ───────────────────────────────────────────────────────── */

export function VoicebotIndustries() {
  return (
    <Section tinted ariaLabelledBy="nganh-phu-hop">
      <Container>
        <SectionHeader
          eyebrow={VB_INDUSTRIES.eyebrow}
          eyebrowIcon={<Building2 size={14} aria-hidden="true" />}
          title={VB_INDUSTRIES.h2}
          titleId="nganh-phu-hop"
          lead={VB_INDUSTRIES.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VB_INDUSTRIES.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>

              <ul className="mt-4 flex flex-wrap gap-x-4">
                {item.links.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className={INLINE_LINK}>
                      {l.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 09 Deployment ───────────────────────────────────────────────────────── */

export function VoicebotDeployment() {
  return (
    <Section ariaLabelledBy="quy-trinh-trien-khai">
      <Container>
        <SectionHeader
          eyebrow={VB_DEPLOYMENT.eyebrow}
          eyebrowIcon={<Rocket size={14} aria-hidden="true" />}
          title={VB_DEPLOYMENT.h2}
          titleId="quy-trinh-trien-khai"
          lead={VB_DEPLOYMENT.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {VB_DEPLOYMENT.steps.map((step) => (
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

        <div className="mt-8 flex justify-center">
          <ConsultCta label="Đăng ký tư vấn Voicebot" className={SECONDARY_BTN} />
        </div>
      </Container>
    </Section>
  )
}

/* ── 10 Outcomes ─────────────────────────────────────────────────────────── */

/** Qualitative only — no percentage, hour count or cost figure appears here. */
export function VoicebotOutcomes() {
  return (
    <Section tinted ariaLabelledBy="gia-tri-dau-ra">
      <Container>
        <SectionHeader
          eyebrow={VB_OUTCOMES.eyebrow}
          eyebrowIcon={<TrendingUp size={14} aria-hidden="true" />}
          title={VB_OUTCOMES.h2}
          titleId="gia-tri-dau-ra"
          lead={VB_OUTCOMES.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VB_OUTCOMES.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full gap-4 p-6">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-brand"
                aria-hidden="true"
              >
                <Repeat size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
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
