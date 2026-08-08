import type { ReactNode } from 'react'
import { ArrowRight, Check, Info, ListChecks, Route as RouteIcon, Users } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/config/navigation'
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import type {
  CompanyHeroVisual,
  CompanyItem,
  CompanyLink,
  CompanyPageBase,
  CompanyRouting,
  CompanyStatus,
  CompanyStep,
} from '@/data/company/types'

/**
 * Sections shared by the Customers and Partners pages — Checkpoint WEB-COMPANY-001.
 *
 * Presentation only. Every string arrives from `src/data/company/*`, which
 * carries the permission guard; copy written inside a component is copy that
 * escapes review. That matters more here than anywhere else on the site: these
 * are the two pages where an unreviewed sentence would become a claim about
 * somebody else's organisation.
 *
 * Mobile-first throughout: single column at 360–390px, widening at `sm` and
 * `lg`. Interactive controls clear 48px; inline text links clear 44px, matching
 * the established convention.
 */

const PRIMARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const SECONDARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const CARD_LINK =
  'mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Conversion CTA — always routes through the shared lead architecture. */
export function CompanyCta({
  content,
  label,
  className = PRIMARY_BTN,
}: {
  content: CompanyPageBase
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

/* ── Hero ────────────────────────────────────────────────────────────────── */

/**
 * Company hero. Exactly one H1 per page, and it lives here.
 *
 * `visual` is an OPTIONAL slot, unfilled today and unfilled on purpose: no
 * customer or partner imagery exists in this repository, and a logo wall is the
 * specific thing these pages must not fabricate. Passing a node switches the
 * hero to the two-column layout the product pages use; passing nothing leaves
 * the single column, with no empty frame either way.
 */
export function CompanyHeroSection({
  content,
  visual,
}: {
  content: CompanyPageBase
  visual?: CompanyHeroVisual
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
            visual ? 'grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14' : ''
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
              <CompanyCta content={content} label={hero.primaryCta.label} />

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

/* ── Purpose and audience ────────────────────────────────────────────────── */

export function CompanyPurposeSection({ content }: { content: CompanyPageBase }) {
  const { purpose } = content

  return (
    <Section ariaLabelledBy={`${content.id}-purpose`}>
      <Container>
        <SectionHeader
          eyebrow={purpose.eyebrow}
          eyebrowIcon={<Users size={14} aria-hidden="true" />}
          title={purpose.h2}
          titleId={`${content.id}-purpose`}
          lead={purpose.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {purpose.audience.map((item) => (
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

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {purpose.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Generic item grid ───────────────────────────────────────────────────── */

/** Title + body cards, for sections that are genuinely a flat list of points. */
export function CompanyItemGrid({
  id,
  eyebrow,
  eyebrowIcon,
  h2,
  description,
  items,
  note,
  columns = 4,
  tinted = false,
  anchorId,
}: {
  id: string
  eyebrow: string
  eyebrowIcon?: ReactNode
  h2: string
  description: string
  items: readonly CompanyItem[]
  note: string
  columns?: 2 | 3 | 4
  tinted?: boolean
  anchorId?: string
}) {
  const grid =
    columns === 2
      ? 'sm:grid-cols-2'
      : columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <Section tinted={tinted} ariaLabelledBy={id}>
      <Container>
        {anchorId && <div id={anchorId} className="scroll-mt-24" />}

        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={eyebrowIcon}
          title={h2}
          titleId={id}
          lead={description}
        />

        <ul className={`mt-10 grid grid-cols-1 gap-5 ${grid}`}>
          {items.map((item) => (
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

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Numbered steps ──────────────────────────────────────────────────────── */

/**
 * An ordered sequence — the customer working model, the partner journey, the
 * assessment criteria.
 *
 * `note` renders unconditionally and the type makes it required, because on
 * both pages it is the sentence that keeps a sequence of phases from reading as
 * a delivery timetable or an established programme.
 */
export function CompanyStepsSection({
  id,
  eyebrow,
  eyebrowIcon,
  h2,
  description,
  steps,
  note,
  columns = 4,
  tinted = false,
}: {
  id: string
  eyebrow: string
  eyebrowIcon?: ReactNode
  h2: string
  description: string
  steps: readonly CompanyStep[]
  note: string
  columns?: 3 | 4
  tinted?: boolean
}) {
  const grid = columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <Section tinted={tinted} ariaLabelledBy={id}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={eyebrowIcon}
          title={h2}
          titleId={id}
          lead={description}
        />

        <ol className={`mt-10 grid grid-cols-1 gap-5 ${grid}`}>
          {steps.map((step) => (
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
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </Card>
          ))}
        </ol>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Link list ───────────────────────────────────────────────────────────── */

export function CompanyLinkList({ links }: { links: readonly CompanyLink[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-1">
      {links.map((link) => (
        <li key={link.path}>
          <Link to={link.path} className={INLINE_LINK}>
            {link.label}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ── Honest state ────────────────────────────────────────────────────────── */

/**
 * The block that stands where a logo wall or a partner directory would go.
 *
 * Deliberately plain: no card grid, no greyed-out marks, no skeleton rows,
 * nothing that could be mistaken at a glance for content still loading. It
 * states what does not exist, then hands the reader pages that do.
 *
 * `status.approvedLogos` renders ONLY when populated, which today it never is.
 * That is the whole point of routing a future logo wall through a typed slot:
 * the empty case produces no markup at all rather than an empty frame.
 */
export function CompanyStatusSection({
  id,
  status,
  tinted = true,
}: {
  id: string
  status: CompanyStatus
  tinted?: boolean
}) {
  const logos = status.approvedLogos ?? []

  return (
    <Section tinted={tinted} ariaLabelledBy={`${id}-status`}>
      <Container>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{status.eyebrow}</Eyebrow>

          <GradientHeading id={`${id}-status`} className="mt-4">
            {status.h2}
          </GradientHeading>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {status.description}
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {status.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light"
                  aria-hidden="true"
                >
                  <Check size={14} className="text-brand" />
                </span>
                <span className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {logos.length > 0 && (
            <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {logos.map((logo) => (
                <Card as="li" key={logo.name} className="flex h-full items-center p-5">
                  <img
                    src={logo.assetPath}
                    alt={logo.name}
                    loading="lazy"
                    className="max-h-10 w-full object-contain"
                  />
                </Card>
              ))}
            </ul>
          )}

          <Card className="mt-8 p-6">
            <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
              {status.linksHeading}
            </h3>
            <ul className="mt-3 flex flex-col gap-1 sm:grid sm:grid-cols-2 sm:gap-x-6">
              {status.links.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={INLINE_LINK}>
                    {link.label}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <p className="mt-6 flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
            <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            {status.note}
          </p>
        </div>
      </Container>
    </Section>
  )
}

/* ── Routing ─────────────────────────────────────────────────────────────── */

export function CompanyRoutingSection({
  id,
  routing,
  tinted = false,
}: {
  id: string
  routing: CompanyRouting
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={`${id}-routing`}>
      <Container>
        <SectionHeader
          eyebrow={routing.eyebrow}
          eyebrowIcon={<RouteIcon size={14} aria-hidden="true" />}
          title={routing.h2}
          titleId={`${id}-routing`}
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

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export function CompanyFaqSection({
  content,
  tinted = true,
}: {
  content: CompanyPageBase
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={`${content.id}-faq`}>
      <Container>
        <SectionHeader
          eyebrow="Câu hỏi thường gặp"
          eyebrowIcon={<ListChecks size={14} aria-hidden="true" />}
          title={`Câu hỏi thường gặp — ${content.breadcrumbLabel}`}
          titleId={`${content.id}-faq`}
        />
        <div className="mt-10">
          {/* Same array as the FAQPage JSON-LD, so the two cannot drift. */}
          <FaqAccordion items={content.faq} idPrefix={`${content.id}-faq`} />
        </div>
      </Container>
    </Section>
  )
}

/* ── Page layout ─────────────────────────────────────────────────────────── */

/**
 * The shared company page shell.
 *
 * Renders the required sections in the required order — breadcrumb, H1 hero,
 * purpose and audience, then the page's own body, then the honest state block,
 * onward routing, FAQ and the single CTA — so the order is enforced in one
 * place rather than re-remembered in each page file.
 *
 * The status block sits AFTER the body deliberately. A reader who has just been
 * shown what Gcalls can honestly say needs to know what is missing; a reader
 * shown the gap first would leave before reaching the substance.
 */
export function CompanyPageLayout({
  content,
  jsonLd,
  children,
  afterStatus,
  statusTinted = true,
  routingTinted = false,
  faqTinted = true,
}: {
  content: CompanyPageBase
  jsonLd: unknown
  children: ReactNode
  /**
   * Optional section between the honest state block and the trailing routing.
   * Partners uses it for the integration-is-not-partnership clarification,
   * which reads best immediately after the directory status it explains.
   */
  afterStatus?: ReactNode
  /**
   * Section tinting alternates down the page and the body length differs per
   * page, so the trailing sections take their tint from the caller rather than
   * guessing.
   */
  statusTinted?: boolean
  routingTinted?: boolean
  faqTinted?: boolean
}) {
  return (
    <>
      <JsonLd id={`company-${content.id}`} data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[
              { label: 'Về Gcalls', path: ROUTES.company },
              { label: content.breadcrumbLabel },
            ]}
          />
        </Container>
      </div>

      {/* 01 */} <CompanyHeroSection content={content} />
      {/* 02 */} <CompanyPurposeSection content={content} />

      {/* 03 — page-specific body */}
      {children}

      {/* 04 */} <CompanyStatusSection
        id={content.id}
        status={content.status}
        tinted={statusTinted}
      />

      {afterStatus}

      {/* 05 */} <CompanyRoutingSection
        id={content.id}
        routing={content.routing}
        tinted={routingTinted}
      />
      {/* 06 */} <CompanyFaqSection content={content} tinted={faqTinted} />

      {/* 07 */}
      <Section ariaLabelledBy={`${content.id}-cta`}>
        <FinalCtaBand
          eyebrow={content.finalCta.eyebrow}
          title={content.finalCta.h2}
          titleId={`${content.id}-cta`}
          description={content.finalCta.description}
          primary={content.finalCta.primaryCta}
          lead={content.lead}
          showPhone
        />
      </Section>
    </>
  )
}
