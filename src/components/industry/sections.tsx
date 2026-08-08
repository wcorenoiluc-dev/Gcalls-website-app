import type { ReactNode } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Check,
  Info,
  ListChecks,
  Route,
  Target,
  TrendingDown,
  TrendingUp,
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
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import type { IndustryContent } from '@/data/industries/types'

/**
 * Sections shared by all six industry pages.
 *
 * These are presentation only — every string arrives from `src/data/industries/*`,
 * which carries the claim guard. A component here must never contain marketing
 * copy of its own, because copy inside a component is copy that escapes review.
 *
 * Mobile-first throughout: single column at 390px, widening at `sm` and `lg`.
 */

const PRIMARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const SECONDARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

/**
 * Card footer link. Carries no margin of its own — callers add `mt-auto` to
 * pin it to the bottom of a flex card. Baking `mt-4` in here and overriding it
 * with `mt-auto` at the call site would leave two competing margin-top
 * utilities in one class list, where the winner depends on stylesheet order
 * rather than on anything visible in this file.
 */
const CARD_LINK =
  'mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Consultation CTA — always routes through the shared lead architecture. */
export function IndustryConsultCta({
  content,
  label,
  className = PRIMARY_BTN,
}: {
  content: IndustryContent
  label: string
  className?: string
}) {
  return (
    <Link
      to={leadCtaHref(content.lead)}
      onClick={() =>
        track('cta_clicked', {
          label,
          source: content.lead.source,
          intent: content.lead.intent,
          solution: content.lead.solution,
        })
      }
      className={className}
    >
      {label}
    </Link>
  )
}

/* ── 01 Hero ─────────────────────────────────────────────────────────────── */

/**
 * Industry hero.
 *
 * `visual` is an OPTIONAL slot, unfilled today. Checkpoint WEB-IND-001A
 * measured every industry hero at 60–61% of container width, leaving 465–480px
 * empty to the right at 1280–1440px — a gap the size of the `ProductVisual`
 * the product pages use. No industry imagery exists in this repository and
 * inventing one would be a fabricated screenshot, so the slot is wired but not
 * filled: passing a `visual` switches the hero to the two-column layout the
 * rest of the site uses, and passing nothing keeps today's single column
 * unchanged. Text stays first in DOM order either way, so mobile still reads
 * text-then-visual.
 */
export function IndustryHero({
  content,
  visual,
}: {
  content: IndustryContent
  visual?: ReactNode
}) {
  const { hero } = content

  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div
          className={
            visual
              ? 'grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14'
              : ''
          }
        >
          <div className={visual ? '' : 'max-w-3xl'}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <GradientHeading as="h1" className="mt-5">
            {hero.h1}
          </GradientHeading>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <IndustryConsultCta content={content} label={hero.primaryCta.label} />

            <a href={hero.secondaryCta.href} className={SECONDARY_BTN}>
              {hero.secondaryCta.label}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
            <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            {hero.microcopy}
          </p>
          </div>

          {visual}
        </div>
      </Container>
    </section>
  )
}

/* ── 02 Operational problem ──────────────────────────────────────────────── */

export function IndustryProblem({ content }: { content: IndustryContent }) {
  const { problem } = content

  return (
    <Section tinted ariaLabelledBy={`${content.id}-problem`}>
      <Container>
        <SectionHeader
          eyebrow={problem.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={problem.h2}
          titleId={`${content.id}-problem`}
          lead={problem.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problem.items.map((item) => (
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

/* ── 03 Business impact ──────────────────────────────────────────────────── */

export function IndustryImpact({ content }: { content: IndustryContent }) {
  const { impact } = content

  return (
    <Section ariaLabelledBy={`${content.id}-impact`}>
      <Container>
        <SectionHeader
          eyebrow={impact.eyebrow}
          eyebrowIcon={<TrendingDown size={14} aria-hidden="true" />}
          title={impact.h2}
          titleId={`${content.id}-impact`}
          lead={impact.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {impact.items.map((item) => (
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
      </Container>
    </Section>
  )
}

/* ── 04 Gcalls capability ────────────────────────────────────────────────── */

/** Target of the hero's secondary CTA — the anchor must stay on this section. */
export function IndustryCapabilities({ content }: { content: IndustryContent }) {
  const { capability } = content

  return (
    <Section tinted ariaLabelledBy={`${content.id}-capability`}>
      <Container>
        <div id={capability.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={capability.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={capability.h2}
          titleId={`${content.id}-capability`}
          lead={capability.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {capability.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {item.detail}
              </p>

              {/* Links only where a real destination owns the topic. */}
              {item.path && item.linkLabel && (
                <Link to={item.path} className={CARD_LINK}>
                  {item.linkLabel}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {capability.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── 05 Fit with the existing workflow ───────────────────────────────────── */

export function IndustryWorkflow({ content }: { content: IndustryContent }) {
  const { workflow } = content

  return (
    <Section ariaLabelledBy={`${content.id}-workflow`}>
      <Container>
        <SectionHeader
          eyebrow={workflow.eyebrow}
          eyebrowIcon={<Route size={14} aria-hidden="true" />}
          title={workflow.h2}
          titleId={`${content.id}-workflow`}
          lead={workflow.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.steps.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground sm:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {step.detail}
              </p>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

/* ── 06 Qualified outcomes ───────────────────────────────────────────────── */

/**
 * The `note` is not decorative. It is the sentence that keeps this section from
 * reading as a performance guarantee, so it renders unconditionally — the type
 * makes it required for exactly that reason.
 */
export function IndustryOutcomes({ content }: { content: IndustryContent }) {
  const { outcomes } = content

  return (
    <Section tinted ariaLabelledBy={`${content.id}-outcomes`}>
      <Container>
        <SectionHeader
          eyebrow={outcomes.eyebrow}
          eyebrowIcon={<TrendingUp size={14} aria-hidden="true" />}
          title={outcomes.h2}
          titleId={`${content.id}-outcomes`}
          lead={outcomes.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full flex-col p-6">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light"
                aria-hidden="true"
              >
                <Check size={17} className="text-brand" />
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {outcomes.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── 07 Where to go next ─────────────────────────────────────────────────── */

export function IndustryRouting({ content }: { content: IndustryContent }) {
  const { routing } = content

  return (
    <Section ariaLabelledBy={`${content.id}-routing`}>
      <Container>
        <SectionHeader
          eyebrow={routing.eyebrow}
          eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
          title={routing.h2}
          titleId={`${content.id}-routing`}
          lead={routing.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routing.items.map((item) => (
            <Card as="li" key={item.path} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {item.detail}
              </p>
              <Link to={item.path} className={CARD_LINK}>
                {item.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
