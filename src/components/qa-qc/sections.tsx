import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  HelpCircle,
  Layers,
  ListChecks,
  Plug,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router'
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
  QQ_BENEFITS,
  QQ_BOUNDARIES,
  QQ_CAPABILITIES,
  QQ_DASHBOARD,
  QQ_DEMO_LEAD,
  QQ_DIRECT_ANSWER,
  QQ_HERO,
  QQ_HOW_IT_WORKS,
  QQ_HUMAN_LOOP,
  QQ_INTEGRATION,
  QQ_OVERVIEW,
  QQ_PROBLEMS,
  QQ_SCORING,
  QQ_SIGNALS,
  QQ_STORY,
  QQ_USE_CASES,
} from '@/data/qaQcCenter'
import {
  QualityDashboardMockup,
  ReviewWorkspaceMockup,
  ScoreCardMockup,
  SignalsMockup,
  TranscriptMockup,
} from './visuals'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'

const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Shared demo CTA — always routes through the shared lead architecture. */
export function DemoCta({
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
      to={leadCtaHref(QQ_DEMO_LEAD)}
      onClick={() =>
        track('cta_clicked', {
          label,
          source: QQ_DEMO_LEAD.source,
          intent: QQ_DEMO_LEAD.intent,
          product: QQ_DEMO_LEAD.product,
        })
      }
    >
      {label}
    </CtaLink>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

export function QaQcHero() {
  const cHero = useGcallsContent(ROUTES.qcCenter, 'hero', QQ_HERO)
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
            <Eyebrow>{cHero.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {cHero.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {cHero.description}
            </p>

            <ul className="mt-7 flex flex-col gap-5">
              {cHero.valuePoints.map((point) => (
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
              <DemoCta label={cHero.primaryCta.label} />

              <CtaLink to={cHero.secondaryCta.href} variant="outline" fullWidth>
                {cHero.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
            </div>
          </div>

          {/* Visual second. */}
          <ProductVisual maxWidth="580px">
            <ReviewWorkspaceMockup />
          </ProductVisual>
        </div>
      </Container>
    </section>
  )
}

/* ── 02 Direct answer / AIO ──────────────────────────────────────────────── */

/**
 * Always visible text — no tab, modal, accordion or truncation, so both a
 * reader and an answer engine get the definition without interacting.
 */
export function QaQcDirectAnswer() {
  const cDirectAnswer = useGcallsContent(ROUTES.qcCenter, 'directAnswer', QQ_DIRECT_ANSWER)
  return (
    <Section ariaLabelledBy="qa-qc-la-gi">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-brand-border bg-brand-light/40 px-6 py-8 sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px]">
            <HelpCircle size={14} aria-hidden="true" />
            Định nghĩa
          </span>

          <h2
            id="qa-qc-la-gi"
            data-heading="compact"
            className="mt-4 text-[22px] font-extrabold leading-snug tracking-tight text-foreground sm:text-[26px]"
          >
            {cDirectAnswer.question}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {cDirectAnswer.answer}
          </p>
        </div>
      </Container>
    </Section>
  )
}

/* ── 03 Problems ─────────────────────────────────────────────────────────── */

export function QaQcProblems() {
  const cProblems = useGcallsContent(ROUTES.qcCenter, 'problems', QQ_PROBLEMS)
  return (
    <Section tinted ariaLabelledBy="bai-toan-qa">
      <Container>
        <SectionHeader
          eyebrow={cProblems.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={cProblems.h2}
          titleId="bai-toan-qa"
          lead={cProblems.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cProblems.items.map((item) => (
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

export function QaQcOverview() {
  const cOverview = useGcallsContent(ROUTES.qcCenter, 'overview', QQ_OVERVIEW)
  return (
    <Section ariaLabelledBy="tong-quan-qa-qc">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow icon={<Layers size={14} aria-hidden="true" />}>
              {cOverview.eyebrow}
            </Eyebrow>

            <GradientHeading id="tong-quan-qa-qc" className="mt-4">
              {cOverview.h2}
            </GradientHeading>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {cOverview.description}
            </p>

            {/* Single natural occurrence of the primary keyword. */}
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {cOverview.keywordLead}
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cOverview.components.map((component) => (
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

          <ProductVisual maxWidth="560px">
            <TranscriptMockup />
          </ProductVisual>
        </div>
      </Container>
    </Section>
  )
}

/* ── 05 How it works ─────────────────────────────────────────────────────── */

export function QaQcHowItWorks() {
  const cHowItWorks = useGcallsContent(ROUTES.qcCenter, 'howItWorks', QQ_HOW_IT_WORKS)
  return (
    <Section tinted ariaLabelledBy="cach-hoat-dong-heading" className="scroll-mt-20">
      <Container>
        <div id={cHowItWorks.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={cHowItWorks.eyebrow}
          eyebrowIcon={<Route size={14} aria-hidden="true" />}
          title={cHowItWorks.h2}
          titleId="cach-hoat-dong-heading"
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cHowItWorks.steps.map((step) => (
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

/* ── 06 Core AI capabilities ─────────────────────────────────────────────── */

export function QaQcCapabilities() {
  const cCapabilities = useGcallsContent(ROUTES.qcCenter, 'capabilities', QQ_CAPABILITIES)
  return (
    <Section ariaLabelledBy="nang-luc-ai">
      <Container>
        <SectionHeader
          eyebrow={cCapabilities.eyebrow}
          eyebrowIcon={<Sparkles size={14} aria-hidden="true" />}
          title={cCapabilities.h2}
          titleId="nang-luc-ai"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cCapabilities.items.map((item) => (
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

/* ── 07 Scoring ──────────────────────────────────────────────────────────── */

export function QaQcScoring() {
  const cScoring = useGcallsContent(ROUTES.qcCenter, 'scoring', QQ_SCORING)
  return (
    <FeatureSplit
      tinted
      eyebrow={cScoring.eyebrow}
      eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
      title={cScoring.h2}
      titleId="qa-scoring"
      description={cScoring.description}
      points={cScoring.points}
      visual={
        <ProductVisual
          maxWidth="480px"
          note="Giao diện minh họa. Tiêu chí, trọng số và điểm hiển thị là dữ liệu mẫu, không phải kết quả đánh giá thực tế."
        >
          <ScoreCardMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 08 Conversation signals ─────────────────────────────────────────────── */

export function QaQcSignals() {
  const cSignals = useGcallsContent(ROUTES.qcCenter, 'signals', QQ_SIGNALS)
  return (
    <FeatureSplit
      reverse
      eyebrow={cSignals.eyebrow}
      eyebrowIcon={<Sparkles size={14} aria-hidden="true" />}
      title={cSignals.h2}
      titleId="conversation-signals"
      description={cSignals.description}
      points={cSignals.points}
      visual={
        <ProductVisual
          maxWidth="480px"
          note="Giao diện minh họa. Mã cuộc gọi và tín hiệu hiển thị là dữ liệu mẫu."
        >
          <SignalsMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 09 AI + human QA loop ───────────────────────────────────────────────── */

/**
 * The section that keeps this page from reading as "AI replaces QA".
 * Placed immediately after the AI capability sections, deliberately.
 */
export function QaQcHumanLoop() {
  const cHumanLoop = useGcallsContent(ROUTES.qcCenter, 'humanLoop', QQ_HUMAN_LOOP)
  return (
    <Section tinted ariaLabelledBy="ai-human-qa">
      <Container>
        <SectionHeader
          eyebrow={cHumanLoop.eyebrow}
          eyebrowIcon={<ShieldCheck size={14} aria-hidden="true" />}
          title={cHumanLoop.h2}
          titleId="ai-human-qa"
          lead={cHumanLoop.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cHumanLoop.roles.map((role, i) => (
            <Card as="li" key={role.role} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                {role.role}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {role.detail}
              </p>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

/* ── 10 Quality dashboard ────────────────────────────────────────────────── */

export function QaQcDashboard() {
  const cDashboard = useGcallsContent(ROUTES.qcCenter, 'dashboard', QQ_DASHBOARD)
  return (
    <FeatureSplit
      eyebrow={cDashboard.eyebrow}
      eyebrowIcon={<BarChart3 size={14} aria-hidden="true" />}
      title={cDashboard.h2}
      titleId="quality-dashboard"
      description={cDashboard.description}
      visual={
        <ProductVisual
          maxWidth="520px"
          note="Giao diện minh họa. Toàn bộ chỉ số, điểm số và xu hướng hiển thị là dữ liệu mẫu, không phải kết quả vận hành của khách hàng Gcalls."
        >
          <QualityDashboardMockup />
        </ProductVisual>
      }
    />
  )
}

/* ── 11 Operational benefits ─────────────────────────────────────────────── */

export function QaQcBenefits() {
  const cBenefits = useGcallsContent(ROUTES.qcCenter, 'benefits', QQ_BENEFITS)
  return (
    <Section tinted ariaLabelledBy="gia-tri-van-hanh">
      <Container>
        <SectionHeader
          eyebrow={cBenefits.eyebrow}
          eyebrowIcon={<TrendingUp size={14} aria-hidden="true" />}
          title={cBenefits.h2}
          titleId="gia-tri-van-hanh"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cBenefits.items.map((item) => (
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

export function QaQcUseCases() {
  const cUseCases = useGcallsContent(ROUTES.qcCenter, 'useCases', QQ_USE_CASES)
  return (
    <Section ariaLabelledBy="tinh-huong-su-dung">
      <Container>
        <SectionHeader
          eyebrow={cUseCases.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={cUseCases.h2}
          titleId="tinh-huong-su-dung"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cUseCases.items.map((item) => (
            <Card as="li" key={item.role} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.role}
              </h3>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>

              {'links' in item && item.links && (
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
              )}
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/* ── 13 Integration ──────────────────────────────────────────────────────── */

export function QaQcIntegration() {
  const cIntegration = useGcallsContent(ROUTES.qcCenter, 'integration', QQ_INTEGRATION)
  return (
    <Section tinted ariaLabelledBy="ket-noi-du-lieu">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow icon={<Plug size={14} aria-hidden="true" />}>
            {cIntegration.eyebrow}
          </Eyebrow>

          <GradientHeading id="ket-noi-du-lieu" className="mt-4">
            {cIntegration.h2}
          </GradientHeading>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {cIntegration.description}
          </p>

          <ul className="mt-7 flex flex-wrap justify-center gap-3">
            {cIntegration.links.map((l) => (
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
        </div>
      </Container>
    </Section>
  )
}

/* ── 14 Product boundaries ───────────────────────────────────────────────── */

export function QaQcBoundaries() {
  const cBoundaries = useGcallsContent(ROUTES.qcCenter, 'boundaries', QQ_BOUNDARIES)
  return (
    <Section ariaLabelledBy="chon-san-pham">
      <Container>
        <SectionHeader
          eyebrow={cBoundaries.eyebrow}
          eyebrowIcon={<Compass size={14} aria-hidden="true" />}
          title={cBoundaries.h2}
          titleId="chon-san-pham"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cBoundaries.items.map((item) => {
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
          <Link to={cBoundaries.allSolutions.path} className={INLINE_LINK}>
            {cBoundaries.allSolutions.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

/* ── 15 QA process (neutral customer story) ──────────────────────────────── */

/**
 * No verified QC Bot customer case exists in the repository, so no story is
 * shown. Nothing is fabricated here — no results, quotes, logos or figures.
 */
export function QaQcStory() {
  const cStory = useGcallsContent(ROUTES.qcCenter, 'story', QQ_STORY)
  return (
    <Section tinted ariaLabelledBy="quy-trinh-qa">
      <Container>
        <Card className="mx-auto flex max-w-3xl flex-col items-center px-6 py-12 text-center sm:px-10">
          <Eyebrow icon={<Users size={14} aria-hidden="true" />}>
            {cStory.eyebrow}
          </Eyebrow>

          <GradientHeading id="quy-trinh-qa" className="mt-4">
            {cStory.h2}
          </GradientHeading>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {cStory.description}
          </p>

          <div className="mt-7 w-full sm:w-auto">
            <DemoCta label={cStory.cta.label} />
          </div>

          <Link to={cStory.link.path} className={`mt-4 ${INLINE_LINK}`}>
            {cStory.link.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Card>
      </Container>
    </Section>
  )
}
