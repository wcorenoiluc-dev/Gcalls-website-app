import type { ReactNode } from 'react'

/**
 * Shared pricing-page primitives.
 *
 * These encode the visual language captured in docs/PRICING_REFERENCE_AUDIT.md:
 * eyebrow pill, gradient section heading, 14px card radius, #E8E5EF hairline
 * borders, and a 1280px container on a 20/32px gutter.
 *
 * Mobile-first: every size below starts at the 390px value and scales up.
 */

/** 1280px content container matching the reference. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-5 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

/** Vertical section rhythm, with an optional tinted band. */
export function Section({
  children,
  tinted = false,
  className = '',
  ariaLabelledBy,
}: {
  children: ReactNode
  tinted?: boolean
  className?: string
  ariaLabelledBy?: string
}) {
  return (
    <section
      aria-labelledby={ariaLabelledBy}
      className={`w-full py-14 sm:py-20 lg:py-24 ${
        tinted ? 'bg-surface-alt' : 'bg-background'
      } ${className}`}
    >
      {children}
    </section>
  )
}

/** Filled purple pill above a section heading. */
export function Eyebrow({
  children,
  icon,
  className = '',
}: {
  children: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px] ${className}`}
    >
      {icon}
      {children}
    </p>
  )
}

/**
 * Gradient-filled heading, matching the reference's clipped-gradient H1/H2.
 * Falls back to a solid brand colour where background-clip is unsupported.
 */
export function GradientHeading({
  as: Tag = 'h2',
  id,
  children,
  className = '',
}: {
  as?: 'h1' | 'h2'
  id?: string
  children: ReactNode
  className?: string
}) {
  const size =
    Tag === 'h1'
      ? 'text-[32px] leading-[1.15] sm:text-5xl lg:text-[56px]'
      : 'text-[26px] leading-[1.2] sm:text-[34px] lg:text-[40px]'

  return (
    <Tag
      id={id}
      className={`font-extrabold tracking-tight text-brand ${size} ${className}`}
      style={{
        backgroundImage: 'var(--brand-gradient)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </Tag>
  )
}

/** Centred section header: eyebrow + heading + optional lead paragraph. */
export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  titleId,
  lead,
  align = 'center',
}: {
  eyebrow: string
  eyebrowIcon?: ReactNode
  title: string
  titleId?: string
  lead?: string
  align?: 'center' | 'left'
}) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex flex-col ${alignment}`}>
      <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
      <GradientHeading id={titleId} className="mt-4">
        {title}
      </GradientHeading>
      {lead && (
        <p
          className={`mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

/** Standard surface card — 14px radius, hairline border, per the reference. */
export function Card({
  children,
  className = '',
  highlighted = false,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  highlighted?: boolean
  as?: 'div' | 'li' | 'article'
}) {
  return (
    <Tag
      className={`rounded-[14px] bg-background ${
        highlighted
          ? 'border-2 border-brand shadow-[0_12px_40px_rgba(103,58,183,0.16)]'
          : 'border border-brand-border'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

/**
 * Quote-request price state.
 *
 * There is no numeric variant here by design: the only component allowed to
 * print a number is one reading `formatPrice()`, and that returns this label
 * until pricing is approved.
 */
export function PriceState({
  label,
  note,
  className = '',
}: {
  label: string
  note?: string
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[22px] font-extrabold leading-tight text-brand sm:text-2xl">
        {label}
      </p>
      {note && <p className="mt-1.5 text-sm text-muted-foreground">{note}</p>}
    </div>
  )
}
