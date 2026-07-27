import { Card } from '@/components/common/primitives'

/**
 * "What makes up the cost" factor card.
 *
 * Numbered 01–06. Carries no percentage, weighting or monetary value — the
 * factors are descriptive only.
 */
export function PricingFactorCard({
  n,
  title,
  detail,
}: {
  n: string
  title: string
  detail: string
}) {
  return (
    <Card as="li" className="flex h-full flex-col p-6">
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
        aria-hidden="true"
      >
        {n}
      </span>
      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{detail}</p>
    </Card>
  )
}
