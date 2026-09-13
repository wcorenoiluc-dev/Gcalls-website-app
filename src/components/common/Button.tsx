import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Link, type LinkProps } from 'react-router'

/**
 * The single CTA primitive for the site.
 *
 * Every solid-purple, white-on-purple-band and outline call-to-action must
 * render through `CtaLink` / `CtaButton` (or, for the handful of legacy
 * inline-styled home-page links, spread `ctaAttrs(variant)` onto the
 * element). The component emits two stable semantic hooks:
 *
 *   data-gcalls-button           — "this is a CTA control"
 *   data-variant="primary|light|outline|outline-dark"
 *
 * `src/styles/buttons.css` keys its unlayered, `#root`-scoped colour rules on
 * those attributes. That is what protects the label against WordPress's
 * global-styles `a:where(:not(.wp-element-button)) { color: brand }` rule
 * (and any other unlayered `a { color }` rule a theme or plugin ships): a
 * Tailwind `text-white` utility lives in `@layer utilities` and loses to any
 * unlayered rule, so the label of a purple `<a>` rendered purple-on-purple —
 * the live "invisible CTA" defect. Colour is therefore owned by buttons.css;
 * the Tailwind classes below own layout, spacing, radius, shadow and hover
 * background only.
 *
 * Badges, chips and eyebrows are NOT buttons — do not put these attributes
 * on them (see `Eyebrow` in primitives.tsx).
 */
export type CtaVariant = 'primary' | 'light' | 'outline' | 'outline-dark'
export type CtaSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed'

const SIZE: Record<CtaSize, string> = {
  sm: 'min-h-11 px-5 text-[15px]',
  md: 'min-h-12 px-7 text-base',
  lg: 'min-h-[52px] px-7 text-base',
}

/**
 * Layout-only per-variant classes. No `text-*` colour utilities here on
 * purpose — colour comes from buttons.css so it cannot be out-cascaded.
 */
const VARIANT: Record<CtaVariant, string> = {
  primary:
    'bg-brand shadow-[0_2px_16px_rgba(103,58,183,0.28)] hover:bg-brand-dark focus-visible:outline-brand',
  light: 'bg-white hover:bg-brand-light focus-visible:outline-white',
  outline:
    'border-2 border-brand bg-background hover:bg-brand-light focus-visible:outline-brand',
  'outline-dark':
    'border border-white/45 bg-transparent hover:bg-white/12 focus-visible:outline-white',
}

export interface CtaStyleOptions {
  variant: CtaVariant
  size?: CtaSize
  /** Full width below `sm`, auto width from `sm` up (the site-wide CTA rhythm). */
  fullWidth?: boolean
  className?: string
}

export function ctaClassName({
  variant,
  size = 'md',
  fullWidth = false,
  className = '',
}: CtaStyleOptions): string {
  return [
    BASE,
    SIZE[size],
    VARIANT[variant],
    fullWidth ? 'w-full sm:w-auto' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/** The semantic attributes buttons.css keys on. */
export function ctaAttrs(variant: CtaVariant) {
  return { 'data-gcalls-button': '', 'data-variant': variant } as const
}

type CtaLinkProps = Omit<CtaStyleOptions, 'className'> & {
  /** Internal route (`/lien-he/`), hash (`#estimator`), or absolute/tel/mailto URL. */
  to: LinkProps['to']
  children: ReactNode
  className?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>

function isPlainAnchorTarget(to: LinkProps['to']): to is string {
  return typeof to === 'string' && /^(https?:\/\/|mailto:|tel:|#)/i.test(to)
}

export function CtaLink({
  variant,
  size,
  fullWidth,
  className,
  to,
  children,
  ...rest
}: CtaLinkProps) {
  const cls = ctaClassName({ variant, size, fullWidth, className })
  if (isPlainAnchorTarget(to)) {
    return (
      <a href={to} className={cls} {...ctaAttrs(variant)} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={cls} {...ctaAttrs(variant)} {...rest}>
      {children}
    </Link>
  )
}

type CtaButtonProps = Omit<CtaStyleOptions, 'className'> & {
  children: ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export function CtaButton({
  variant,
  size,
  fullWidth,
  className,
  type = 'button',
  children,
  ...rest
}: CtaButtonProps) {
  return (
    <button
      type={type}
      className={ctaClassName({ variant, size, fullWidth, className })}
      {...ctaAttrs(variant)}
      {...rest}
    >
      {children}
    </button>
  )
}
