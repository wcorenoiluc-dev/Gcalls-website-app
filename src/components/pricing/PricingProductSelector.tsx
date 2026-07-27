import { useRef } from 'react'
import { SOLUTION_PRICING } from '@/data/pricing'

/**
 * Product / solution selector.
 *
 * Seven options do not fit as tabs at 390px, so the row is a horizontally
 * scrollable chip strip on mobile and wraps into a centred segmented group
 * from `md` up. The scroll is contained by the strip — it never becomes
 * page-level horizontal overflow.
 *
 * Implemented as a real ARIA tablist with roving arrow-key navigation.
 */
export function PricingProductSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()

    const index = SOLUTION_PRICING.findIndex((s) => s.id === selectedId)
    const last = SOLUTION_PRICING.length - 1
    let next = index

    if (event.key === 'ArrowLeft') next = index <= 0 ? last : index - 1
    if (event.key === 'ArrowRight') next = index >= last ? 0 : index + 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = last

    const nextId = SOLUTION_PRICING[next].id
    onSelect(nextId)
    listRef.current
      ?.querySelector<HTMLButtonElement>(`[data-chip="${nextId}"]`)
      ?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Chọn sản phẩm hoặc giải pháp"
      onKeyDown={onKeyDown}
      className="
        -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0
      "
    >
      {SOLUTION_PRICING.map((solution) => {
        const selected = solution.id === selectedId
        return (
          <button
            key={solution.id}
            type="button"
            role="tab"
            data-chip={solution.id}
            id={`chip-${solution.id}`}
            aria-selected={selected}
            aria-controls={`panel-${solution.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(solution.id)}
            className={`
              min-h-12 shrink-0 snap-start whitespace-nowrap rounded-full px-5 text-[15px]
              font-semibold transition-colors duration-150
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
              ${
                selected
                  ? 'bg-brand text-white shadow-[0_2px_14px_rgba(103,58,183,0.26)]'
                  : 'border border-brand-border bg-background text-muted-foreground hover:border-brand hover:text-brand'
              }
            `}
          >
            {solution.name}
          </button>
        )
      })}
    </div>
  )
}
