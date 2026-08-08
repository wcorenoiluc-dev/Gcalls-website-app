import type { ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Info,
  ListChecks,
  Route as RouteIcon,
  Users,
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
import { FaqAccordion } from '@/components/common/FaqAccordion'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES, type RoutePath } from '@/config/navigation'
import { track } from '@/lib/analytics'
import { leadCtaHref } from '@/lib/leads/ctaLink'
import { RESOURCE_NAV } from '@/data/resources'
import type {
  ResourceItem,
  ResourceLink,
  ResourcePageBase,
  ResourceRouting,
  ResourceStatus,
} from '@/data/resources/types'

/**
 * Sections shared by all six resource pages — Checkpoint WEB-RES-001.
 *
 * Presentation only. Every string arrives from `src/data/resources/*`, which
 * carries the fabrication and claim guards; copy written inside a component is
 * copy that escapes review.
 *
 * Mobile-first throughout: single column at 360–390px, widening at `sm` and
 * `lg`. Every interactive control clears 48px, and long Vietnamese headings are
 * allowed to wrap rather than being truncated.
 */

const PRIMARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

const SECONDARY_BTN =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto'

/** Card footer link. Callers add nothing; `mt-auto` pins it to the card base. */
const CARD_LINK =
  'mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Inline link inside a body of text or a link list. */
export const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** Consultation CTA — always routes through the shared lead architecture. */
export function ResourceConsultCta({
  content,
  label,
  className = PRIMARY_BTN,
}: {
  content: ResourcePageBase
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
 * Resource hero. Exactly one H1 per page, and it lives here.
 *
 * No image slot: no resource imagery exists in this repository, and a
 * placeholder would either be a broken frame or a fabricated screenshot.
 */
export function ResourceHeroSection({ content }: { content: ResourcePageBase }) {
  const { hero } = content

  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <GradientHeading as="h1" className="mt-5">
            {hero.h1}
          </GradientHeading>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <ResourceConsultCta content={content} label={hero.primaryCta.label} />

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
      </Container>
    </section>
  )
}

/* ── 02 Purpose and audience ─────────────────────────────────────────────── */

export function ResourcePurposeSection({ content }: { content: ResourcePageBase }) {
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

/* ── 03 Resource navigation ──────────────────────────────────────────────── */

/**
 * The six-way resource navigation, rendered on every resource page.
 *
 * The current page stays in the list rather than being hidden — a navigation
 * that changes shape per page is harder to learn — but renders as a non-link
 * with `aria-current="page"`, so it is announced correctly and cannot send a
 * reader to the page they are already on.
 */
export function ResourceNavSection({
  current,
  tinted = true,
}: {
  current: RoutePath
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy="resource-nav-heading">
      <Container>
        <SectionHeader
          eyebrow="TRUNG TÂM TÀI NGUYÊN"
          eyebrowIcon={<BookOpen size={14} aria-hidden="true" />}
          title="Sáu danh mục tài nguyên"
          titleId="resource-nav-heading"
          lead="Mỗi danh mục phục vụ một mục đích khác nhau. Chọn danh mục phù hợp với việc bạn đang cần làm."
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_NAV.map((entry) => {
            const isCurrent = entry.path === current

            return (
              <Card
                as="li"
                key={entry.path}
                highlighted={isCurrent}
                className="h-full"
              >
                {isCurrent ? (
                  <div className="flex h-full flex-col p-5" aria-current="page">
                    <span className="text-base font-bold text-brand">
                      {entry.label}
                    </span>
                    <span className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                      {entry.detail}
                    </span>
                    <span className="mt-3 text-[13px] font-semibold uppercase tracking-wider text-brand">
                      Đang xem
                    </span>
                  </div>
                ) : (
                  <Link
                    to={entry.path}
                    className="flex h-full min-h-[104px] flex-col rounded-[14px] p-5 transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                  >
                    <span className="flex items-center gap-1.5 text-base font-bold text-foreground">
                      {entry.label}
                      <ArrowRight size={16} className="text-brand" aria-hidden="true" />
                    </span>
                    <span className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                      {entry.detail}
                    </span>
                  </Link>
                )}
              </Card>
            )
          })}
        </ul>

        <p className="mt-8 text-center text-[15px] leading-relaxed text-muted-foreground">
          <Link to={ROUTES.resources} className={INLINE_LINK}>
            Về trung tâm tài nguyên
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </p>
      </Container>
    </Section>
  )
}

/* ── Generic item grid ───────────────────────────────────────────────────── */

/**
 * Title + body cards. Used where a section is genuinely a flat list of points
 * — the case-study rationale, the ebook quality bar — and nothing more
 * structured is warranted.
 */
export function ResourceItemGrid({
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
  items: readonly ResourceItem[]
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

/* ── Honest state ────────────────────────────────────────────────────────── */

/**
 * The block that stands where an inventory would go.
 *
 * It is deliberately plain: no card grid, no skeleton rows, nothing that could
 * be mistaken at a glance for content loading in. It states what does not
 * exist, then hands the reader a list of pages that do.
 */
export function ResourceStatusSection({
  id,
  status,
  tinted = true,
}: {
  id: string
  status: ResourceStatus
  tinted?: boolean
}) {
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

/* ── Link list ───────────────────────────────────────────────────────────── */

/** Compact list of internal links, used inside content cards. */
export function ResourceLinkList({ links }: { links: readonly ResourceLink[] }) {
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

/* ── Routing ─────────────────────────────────────────────────────────────── */

export function ResourceRoutingSection({
  id,
  routing,
  tinted = false,
}: {
  id: string
  routing: ResourceRouting
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

export function ResourceFaqSection({
  content,
  tinted = true,
}: {
  content: ResourcePageBase
  tinted?: boolean
}) {
  if (!content.faq || content.faq.length === 0) return null

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
 * The shared resource page shell.
 *
 * It renders the required sections in the required order — breadcrumb, H1 hero,
 * purpose and audience, resource navigation, then the page's own body, then
 * onward routing, FAQ and the single consultation CTA — so the order is
 * enforced in one place rather than re-remembered in six page files.
 *
 * `children` is the part that must differ between pages, and it is the only
 * part that does.
 */
export function ResourcePageLayout({
  content,
  jsonLd,
  children,
  routingTinted = false,
  faqTinted = true,
}: {
  content: ResourcePageBase
  jsonLd: unknown
  children: ReactNode
  /**
   * Section tinting alternates down the page, and the body length differs per
   * page, so the two sections that follow the body take their tint from the
   * caller rather than guessing.
   */
  routingTinted?: boolean
  faqTinted?: boolean
}) {
  return (
    <>
      <JsonLd id={`resource-${content.id}`} data={jsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb
            trail={[
              { label: 'Tài nguyên', path: ROUTES.resources },
              { label: content.breadcrumbLabel },
            ]}
          />
        </Container>
      </div>

      {/* 01 */} <ResourceHeroSection content={content} />
      {/* 02 */} <ResourcePurposeSection content={content} />
      {/* 03 */} <ResourceNavSection current={content.route} />

      {/* 04 — page-specific body */}
      {children}

      {/* 05 */} <ResourceRoutingSection
        id={content.id}
        routing={content.routing}
        tinted={routingTinted}
      />
      {/* 06 */} <ResourceFaqSection content={content} tinted={faqTinted} />

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
