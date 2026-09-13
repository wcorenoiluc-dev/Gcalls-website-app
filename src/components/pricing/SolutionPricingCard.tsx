import { ArrowRight, Receipt } from 'lucide-react'
import { PRICE_FALLBACK, type SolutionPricing } from '@/data/pricing'
import { Card } from '@/components/common/primitives'
import { CtaLink } from '@/components/common/Button'

/**
 * Solution pricing-model card.
 *
 * States *how* a solution is quoted rather than what it costs. The pricing
 * model strings are qualitative and come from the content brief; none of them
 * implies a rate.
 */
export function SolutionPricingCard({ solution }: { solution: SolutionPricing }) {
  return (
    <Card as="li" className="flex h-full flex-col p-6">
      <h3 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
        {solution.name}
      </h3>

      <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
        {solution.summary}
      </p>

      <div className="mt-5 rounded-[10px] bg-brand-light px-4 py-3.5">
        <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
          Mô hình báo giá
        </p>
        <p className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
          {solution.pricingModel}
        </p>
      </div>

      <p className="mt-4 flex items-center gap-2 text-[15px] font-bold text-brand">
        <Receipt size={16} aria-hidden="true" />
        {PRICE_FALLBACK.quote}
      </p>

      <div className="mt-auto pt-6">
        <CtaLink to={solution.cta.path} variant="outline" size="sm" className="w-full">
          {solution.cta.label}
          <ArrowRight size={16} aria-hidden="true" />
        </CtaLink>
      </div>
    </Card>
  )
}
