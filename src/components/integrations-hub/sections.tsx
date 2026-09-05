import { ArrowRight, Compass, Headset, Users } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { leadAwareHref, leadCtaHref } from '@/lib/leads/ctaLink'
import { INTEGRATIONS_HUB, type HubCard } from '@/data/hubs'
import { ConnectionDiagram } from './ConnectionDiagram'

const H = INTEGRATIONS_HUB
const ID = H.id

const PRIMARY_BTN =
  'inline-flex min-h-12 items-center justify-center rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
const SECONDARY_BTN =
  'inline-flex min-h-12 items-center justify-center gap-1.5 rounded-[10px] border border-brand-border bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
const INLINE_LINK =
  'inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/* ── Breadcrumb ──────────────────────────────────────────────────────────── */

export function IntegBreadcrumb() {
  return (
    <div className="bg-brand-light/60 pt-20 sm:pt-24">
      <Container>
        <Breadcrumb trail={[{ label: H.breadcrumbLabel }]} />
      </Container>
    </div>
  )
}

/* ── 02 Hero (holds the single H1) + neutral connection diagram ───────────── */

export function IntegHero() {
  return (
    <section
      aria-labelledby={`${ID}-h1`}
      className="w-full pt-12 pb-14 sm:pt-16 sm:pb-16"
      style={{
        background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[46fr_54fr] lg:gap-14">
          <div>
            <Eyebrow>{H.hero.eyebrow}</Eyebrow>

            <GradientHeading as="h1" id={`${ID}-h1`} className="mt-4">
              {H.hero.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {H.hero.description}
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
              <Link to={leadCtaHref(H.lead)} className={PRIMARY_BTN}>
                {H.hero.primaryCta.label}
              </Link>
              <Link to={H.hero.secondaryCta.path} className={SECONDARY_BTN}>
                {H.hero.secondaryCta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ConnectionDiagram />
        </div>
      </Container>
    </section>
  )
}

/* ── 03 Direct answer ────────────────────────────────────────────────────── */

export function IntegDirectAnswer() {
  return (
    <Section ariaLabelledBy={`${ID}-answer`}>
      <Container>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{H.directAnswer.eyebrow}</Eyebrow>
          <GradientHeading id={`${ID}-answer`} className="mt-4">
            {H.directAnswer.question}
          </GradientHeading>
          <p className="mt-5 rounded-[14px] border border-brand-border bg-background px-5 py-4 text-base leading-relaxed text-muted-foreground">
            {H.directAnswer.answer}
          </p>
        </div>
      </Container>
    </Section>
  )
}

/* ── 04 Platform cards — CRM (3) + Helpdesk (2), grouped ──────────────────── */

/**
 * Type indicator + supporting label. The icon is the visual system-type cue;
 * `supportingLabel` is the text. Platform names are text only — no logo, no
 * partnership or certification wording anywhere.
 */
function PlatformCard({ item }: { item: HubCard }) {
  const isHelpdesk = item.supportingLabel === 'Helpdesk'
  const TypeIcon = isHelpdesk ? Headset : Users
  return (
    <Card as="li" className="flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-brand"
          aria-hidden="true"
        >
          <TypeIcon size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight text-foreground">
            {item.title}
          </h3>
          {item.supportingLabel && (
            <p className="mt-0.5 text-sm font-semibold text-brand">{item.supportingLabel}</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{item.detail}</p>

      <div className="mt-auto pt-5">
        <Link
          to={leadAwareHref(item.path, H.lead)}
          aria-label={item.cta}
          className={INLINE_LINK}
        >
          {item.cta}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}

function CardGroup({
  label,
  icon: Icon,
  items,
  cols,
}: {
  label: string
  icon: typeof Users
  items: readonly HubCard[]
  cols: string
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon size={15} className="text-brand" aria-hidden="true" />
        {label}
      </p>
      <ul className={`mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 ${cols}`}>
        {items.map((item) => (
          <PlatformCard key={item.path} item={item} />
        ))}
      </ul>
    </div>
  )
}

export function IntegPlatformCards() {
  const crm = H.cards.items.filter((i) => i.supportingLabel === 'CRM')
  const helpdesk = H.cards.items.filter((i) => i.supportingLabel === 'Helpdesk')

  return (
    <Section tinted ariaLabelledBy={`${ID}-cards`}>
      <Container>
        <SectionHeader
          eyebrow={H.cards.eyebrow}
          title={H.cards.h2}
          titleId={`${ID}-cards`}
          lead={H.cards.lead}
        />

        <div className="mt-10 flex flex-col gap-8">
          <CardGroup label="CRM" icon={Users} items={crm} cols="lg:grid-cols-3" />
          {/* Helpdesk: two balanced columns — never stretched to fill a third. */}
          <CardGroup
            label="Helpdesk"
            icon={Headset}
            items={helpdesk}
            cols="lg:grid-cols-2"
          />
        </div>

        {H.cards.note && (
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {H.cards.note}
          </p>
        )}
      </Container>
    </Section>
  )
}

/* ── 06 Decision guide — where the team works → overview → reason ─────────── */

export function IntegDecisionGuide() {
  const g = H.decisionGuide
  if (!g) return null
  return (
    <Section ariaLabelledBy={`${ID}-guide`}>
      <Container>
        <SectionHeader
          eyebrow={g.eyebrow}
          eyebrowIcon={<Compass size={14} aria-hidden="true" />}
          title={g.h2}
          titleId={`${ID}-guide`}
          lead={g.lead}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {g.rows.map((row) => (
            <Card as="li" key={row.path} className="flex h-full flex-col p-6">
              <p className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Đội ngũ đang làm việc ở đâu
              </p>
              <p className="mt-2 text-base font-semibold leading-snug text-foreground">
                {row.problem}
              </p>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Lý do
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {row.reason}
              </p>

              <div className="mt-auto pt-5">
                <Link
                  to={leadAwareHref(row.path, H.lead)}
                  aria-label={`Trang tổng quan nên xem: ${row.solution}`}
                  className={INLINE_LINK}
                >
                  {row.solution}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </ul>

        {g.note && (
          <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {g.note}
          </p>
        )}
      </Container>
    </Section>
  )
}

/* ── 07 Onward links ─────────────────────────────────────────────────────── */

export function IntegOnwardLinks() {
  return (
    <Section tinted ariaLabelledBy={`${ID}-links`}>
      <Container>
        <h2
          id={`${ID}-links`}
          className="text-[22px] font-extrabold tracking-tight text-foreground sm:text-2xl"
        >
          {H.links.h2}
        </h2>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          {H.links.items.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={INLINE_LINK}>
                {link.label}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
