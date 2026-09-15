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
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'
import { VB_USE_CASES_CONTENT } from '@/content/sections/voicebotAi'
import { CtaLink, type CtaVariant } from '@/components/common/Button'
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

const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/**
 * Shared consultation CTA — always routes through the shared lead architecture
 * (`/lien-he/` + categorical query context), never to a dead `#`.
 */
export function ConsultCta({
  label,
  variant = 'primary',
}: {
  label: string
  variant?: CtaVariant
}) {
  return (
    <CtaLink
      variant={variant}
      fullWidth
      to={leadCtaHref(VB_CONSULT_LEAD)}
      onClick={() =>
        track('cta_clicked', {
          label,
          source: VB_CONSULT_LEAD.source,
          intent: VB_CONSULT_LEAD.intent,
          product: VB_CONSULT_LEAD.product,
        })
      }
    >
      {label}
    </CtaLink>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

export function VoicebotHero() {
  const content = useGcallsContent(ROUTES.voicebotAi, 'hero', VB_HERO)

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
            <Eyebrow>{content.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {content.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {content.description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ConsultCta label={content.primaryCta.label} />

              <CtaLink to={content.secondaryCta.href} variant="outline" fullWidth>
                {content.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
            </div>

            <p className="mt-5 flex max-w-xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
              <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {content.microcopy}
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'problems', VB_PROBLEMS)

  return (
    <Section tinted ariaLabelledBy="bai-toan-van-hanh">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="bai-toan-van-hanh"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'useCases', VB_USE_CASES_CONTENT)

  return (
    <Section ariaLabelledBy="tinh-huong-ung-dung-heading">
      <Container>
        <div id={VB_USE_CASES.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="tinh-huong-ung-dung-heading"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'howItWorks', VB_HOW_IT_WORKS)

  return (
    <Section tinted ariaLabelledBy="quy-trinh-hoat-dong">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<Route size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="quy-trinh-hoat-dong"
          lead={content.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.steps.map((step) => (
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'capabilities', VB_CAPABILITIES)

  return (
    <FeatureSplit
      eyebrow={content.eyebrow}
      eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
      title={content.h2}
      titleId="kha-nang-giai-phap"
      description={content.description}
      points={content.points}
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
        {content.note}
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'humanAi', VB_HUMAN_AI)

  return (
    <Section tinted ariaLabelledBy="con-nguoi-va-ai">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<UserCheck size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="con-nguoi-va-ai"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {content.columns.map((column, i) => (
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
          {content.closing}
        </p>
      </Container>
    </Section>
  )
}

/* ── 07 Integration ──────────────────────────────────────────────────────── */

export function VoicebotIntegration() {
  const content = useGcallsContent(ROUTES.voicebotAi, 'integration', VB_INTEGRATION)

  return (
    <Section ariaLabelledBy="tich-hop-quy-trinh">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<Plug size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="tich-hop-quy-trinh"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
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
          {content.links.map((l) => (
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
          {content.hubLinks.map((l) => (
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'industries', VB_INDUSTRIES)

  return (
    <Section tinted ariaLabelledBy="nganh-phu-hop">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<Building2 size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="nganh-phu-hop"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => (
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
  const content = useGcallsContent(ROUTES.voicebotAi, 'deployment', VB_DEPLOYMENT)

  return (
    <Section ariaLabelledBy="quy-trinh-trien-khai">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<Rocket size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="quy-trinh-trien-khai"
          lead={content.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {content.steps.map((step) => (
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
          <ConsultCta label={content.cta.label} variant="outline" />
        </div>
      </Container>
    </Section>
  )
}

/* ── 10 Outcomes ─────────────────────────────────────────────────────────── */

/** Qualitative only — no percentage, hour count or cost figure appears here. */
export function VoicebotOutcomes() {
  const content = useGcallsContent(ROUTES.voicebotAi, 'outcomes', VB_OUTCOMES)

  return (
    <Section tinted ariaLabelledBy="gia-tri-dau-ra">
      <Container>
        <SectionHeader
          eyebrow={content.eyebrow}
          eyebrowIcon={<TrendingUp size={14} aria-hidden="true" />}
          title={content.h2}
          titleId="gia-tri-dau-ra"
          lead={content.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
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
