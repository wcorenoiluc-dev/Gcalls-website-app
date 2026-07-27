import { Check } from 'lucide-react'
import { ESTIMATOR_SOLUTIONS } from '@/data/estimator'

/**
 * Step 1 — solution selection.
 *
 * Real `<button>` controls in a radiogroup, not clickable divs: they are
 * keyboard reachable, expose `aria-checked`, and show a visible focus ring.
 *
 * One card per row at 390px; two from `sm`; three from `lg`.
 */
export function ProductSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-lg font-extrabold text-foreground sm:text-xl">
        Bạn đang quan tâm giải pháp nào?
      </legend>

      <div
        role="radiogroup"
        aria-label="Chọn sản phẩm hoặc giải pháp"
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ESTIMATOR_SOLUTIONS.map((solution) => {
          const selected = solution.id === selectedId

          return (
            <button
              key={solution.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(solution.id)}
              className={`flex min-h-[104px] w-full flex-col items-start gap-2 rounded-[14px] border-2 p-5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                selected
                  ? 'border-brand bg-brand-light'
                  : 'border-brand-border bg-background hover:border-brand hover:bg-brand-light/40'
              }`}
            >
              <span className="flex w-full items-start justify-between gap-3">
                <span className="text-base font-extrabold text-foreground">
                  {solution.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-brand bg-brand' : 'border-brand-border'
                  }`}
                >
                  {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                </span>
              </span>

              <span className="text-[15px] leading-relaxed text-muted-foreground">
                {solution.useCase}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
