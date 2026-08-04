import type { ReactNode } from 'react'
import { ArrowRight, Calculator, Receipt } from 'lucide-react'
import { Link } from 'react-router'
import { Container, Eyebrow, GradientHeading, Section } from './primitives'
import { PRICING_NOTE } from '@/data/pricing'

/**
 * Shared "estimate your cost" band used by every product and solution page.
 *
 * Renders no price. The configuration note comes from the shared pricing
 * config, so these pages cannot drift from /bang-gia/ and /uoc-tinh-chi-phi/.
 */
export function PricingCtaBand({
  eyebrow,
  title,
  titleId,
  description,
  primary,
  secondary,
  eyebrowIcon = <Receipt size={14} aria-hidden="true" />,
  tinted = false,
}: {
  eyebrow: string
  title: string
  titleId: string
  description: string
  primary: { label: string; path: string }
  secondary: { label: string; path: string }
  eyebrowIcon?: ReactNode
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <div
          className="rounded-[24px] border border-brand-border p-6 sm:p-10 lg:p-12"
          style={{ background: 'var(--brand-light)' }}
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>

              <GradientHeading id={titleId} className="mt-4">
                {title}
              </GradientHeading>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                to={primary.path}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                <Calculator size={18} aria-hidden="true" />
                {primary.label}
              </Link>

              <Link
                to={secondary.path}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {secondary.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <p className="mt-1 text-sm text-muted-foreground lg:text-right">
                {PRICING_NOTE}.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
