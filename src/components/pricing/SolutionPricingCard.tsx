import { ArrowRight, Receipt } from 'lucide-react'
import { Link } from 'react-router'
import { PRICE_FALLBACK, type SolutionPricing } from '@/data/pricing'
import { Card } from '@/components/common/primitives'

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
        <Link
          to={solution.cta.path}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-5 text-[15px] font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {solution.cta.label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}
