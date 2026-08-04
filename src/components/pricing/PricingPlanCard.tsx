import { ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router'
import {
  PRICE_FALLBACK,
  PRICING_NOTE,
  formatPrice,
  hasApprovedPrice,
  type PricingPlan,
} from '@/data/pricing'
import { Card, PriceState } from '@/components/common/primitives'

/**
 * Gcalls Plus package card.
 *
 * Card anatomy follows the reference: name → fit statement → price state →
 * full-width CTA → hairline → configuration note.
 *
 * Two deliberate deviations from the reference, both documented in
 * docs/PRICING_REFERENCE_AUDIT.md:
 *  - the highlighted card is NOT scaled or translated (transforms are a known
 *    source of mobile overflow); emphasis comes from border weight and shadow;
 *  - CTAs are 48px tall rather than the reference's 36px.
 *
 * No feature checklist is rendered: `plan.features` is empty because no
 * entitlements are approved, and padding the card with invented checkmarks
 * would be a false claim.
 */
export function PricingPlanCard({ plan }: { plan: PricingPlan }) {
  const highlighted = Boolean(plan.highlight)
  const priceLabel = formatPrice(
    plan,
    plan.pricingMode === 'custom' ? PRICE_FALLBACK.contact : PRICE_FALLBACK.quote,
  )
  const showsNumber = hasApprovedPrice(plan)

  return (
    <Card
      as="li"
      highlighted={highlighted}
      className={`relative flex h-full flex-col p-6 sm:p-7 ${
        highlighted ? 'bg-brand-light/40' : ''
      }`}
    >
      {/* Highlight badge — centred on the top border, as in the reference.
          Deliberately not "most popular": that is unverified. */}
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_2px_10px_rgba(103,58,183,0.3)]">
          {plan.highlight}
        </span>
      )}

      <h3
        className={`text-xl font-extrabold tracking-tight text-foreground sm:text-2xl ${
          plan.highlight ? 'mt-3' : ''
        }`}
      >
        {plan.name}
      </h3>

      <p className="mt-3 min-h-[72px] text-[15px] leading-relaxed text-muted-foreground">
        {plan.audience}
      </p>

      <PriceState
        label={priceLabel}
        note={showsNumber ? '/ tháng' : undefined}
        className="mt-5"
      />

      <Link
        to={plan.cta.path}
        className={`
          mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px]
          px-5 text-[15px] font-semibold transition-colors duration-150
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
          ${
            highlighted
              ? 'bg-brand text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] hover:bg-brand-dark'
              : 'border-2 border-brand bg-background text-brand hover:bg-brand-light'
          }
        `}
      >
        {plan.cta.label}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <div className="mt-auto pt-6">
        <p className="flex items-start gap-2 border-t border-brand-border pt-4 text-sm leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {PRICING_NOTE}
        </p>
      </div>
    </Card>
  )
}
