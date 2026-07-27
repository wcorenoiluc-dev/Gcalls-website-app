import { ESTIMATOR_STEPS } from '@/data/estimator'

/**
 * Step indicator.
 *
 * Mobile shows a compact "Bước n/4" plus the current step name — a four-item
 * horizontal tracker does not fit legibly at 390px. From `md` up it becomes
 * the full labelled tracker.
 */
export function EstimatorStepper({ current }: { current: number }) {
  const step = ESTIMATOR_STEPS.find((s) => s.n === current) ?? ESTIMATOR_STEPS[0]

  return (
    <div aria-label="Tiến trình ước tính">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">
            Bước {current}/{ESTIMATOR_STEPS.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {Math.round((current / ESTIMATOR_STEPS.length) * 100)}%
          </p>
        </div>
        <p className="mt-1 text-lg font-extrabold text-foreground">{step.label}</p>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-light"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={ESTIMATOR_STEPS.length}
          aria-valuetext={`Bước ${current}: ${step.label}`}
        >
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${(current / ESTIMATOR_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tablet / desktop */}
      <ol className="hidden md:flex md:items-center md:gap-2">
        {ESTIMATOR_STEPS.map((item, index) => {
          const state =
            item.n < current ? 'done' : item.n === current ? 'current' : 'todo'

          return (
            <li key={item.n} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    state === 'todo'
                      ? 'bg-brand-light text-brand/60'
                      : 'bg-brand text-white'
                  }`}
                >
                  {item.n}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    state === 'current' ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  {item.label}
                </span>
              </div>

              {index < ESTIMATOR_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`ml-1 hidden h-px flex-1 lg:block ${
                    item.n < current ? 'bg-brand' : 'bg-brand-border'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
