import { useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'
import { SOLUTION_PRICING, estimateCost } from '@/data/pricing'
import { Card } from './primitives'

/**
 * Interactive cost-estimator preview.
 *
 * Reads the same `src/data/pricing.ts` configuration as `/uoc-tinh-chi-phi/`
 * — there is exactly one pricing model in the codebase. The result panel calls
 * the shared `estimateCost()`, which returns a quote-request state while
 * pricing is unconfigured. It never computes or displays a number, and never
 * `0₫`.
 *
 * Mobile order: inputs first, result second, CTA full width.
 */
export function EstimatorPreview() {
  const [solutionId, setSolutionId] = useState(SOLUTION_PRICING[0].id)
  const [agents, setAgents] = useState(5)

  const solution =
    SOLUTION_PRICING.find((s) => s.id === solutionId) ?? SOLUTION_PRICING[0]
  const extraField = solution.estimatorField
  const [extraValue, setExtraValue] = useState('')
  const result = estimateCost()

  const fieldClass =
    'min-h-12 w-full rounded-[10px] border border-brand-border bg-background px-4 text-base text-foreground transition-colors duration-150 focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand'

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      {/* Inputs — first in DOM order, so first on mobile. */}
      <Card className="p-6 sm:p-8 lg:col-span-3">
        <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
          Nhu cầu của bạn
        </h3>

        <div className="mt-5 flex flex-col gap-5">
          <div>
            <label
              htmlFor="estimator-solution"
              className="block text-sm font-bold text-foreground"
            >
              Sản phẩm / giải pháp
            </label>
            <select
              id="estimator-solution"
              value={solutionId}
              onChange={(event) => {
                setSolutionId(event.target.value)
                setExtraValue('')
              }}
              className={`${fieldClass} mt-2`}
            >
              {SOLUTION_PRICING.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="estimator-agents"
              className="block text-sm font-bold text-foreground"
            >
              Số Agent
            </label>
            <input
              id="estimator-agents"
              type="number"
              min={1}
              max={9999}
              inputMode="numeric"
              value={agents}
              onChange={(event) =>
                setAgents(Math.max(1, Number(event.target.value) || 1))
              }
              className={`${fieldClass} mt-2`}
            />
          </div>

          {/* Product-specific field, driven by the pricing config. */}
          {extraField && (
            <div>
              <label
                htmlFor="estimator-extra"
                className="block text-sm font-bold text-foreground"
              >
                {extraField.label}
                <span className="ml-1 font-normal text-muted-foreground">
                  ({extraField.unit})
                </span>
              </label>
              <input
                id="estimator-extra"
                type="number"
                min={0}
                inputMode="numeric"
                value={extraValue}
                placeholder="Tùy chọn"
                onChange={(event) => setExtraValue(event.target.value)}
                className={`${fieldClass} mt-2`}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Result — second on mobile. */}
      <Card className="h-fit bg-brand-light p-6 sm:p-8 lg:col-span-2">
        <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
          Cấu hình tham khảo
        </h3>

        <dl className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted-foreground">Giải pháp</dt>
            <dd className="font-semibold text-foreground">{solution.name}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted-foreground">Số Agent</dt>
            <dd className="font-semibold text-foreground">{agents}</dd>
          </div>
          {extraField && extraValue !== '' && (
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">{extraField.label}</dt>
              <dd className="font-semibold text-foreground">
                {extraValue} {extraField.unit}
              </dd>
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-2 border-t border-brand-border pt-2.5">
            <dt className="text-muted-foreground">Mô hình báo giá</dt>
            <dd className="text-right font-semibold text-foreground">
              {solution.pricingModel}
            </dd>
          </div>
        </dl>

        <p className="mt-5 flex items-center gap-2 text-[15px] font-semibold text-brand">
          <CheckCircle2 size={17} aria-hidden="true" />
          Cấu hình đã sẵn sàng
        </p>

        {/* No pricing config yet → quote-request state, never a number. */}
        <p className="mt-2 text-xl font-extrabold leading-tight text-brand">
          {result.label}
        </p>
        {result.note && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {result.note}
          </p>
        )}

        <Link
          to={ROUTES.costEstimator}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-5 text-[15px] font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Sparkles size={16} aria-hidden="true" />
          Ước tính chi phí chi tiết
        </Link>

        <a
          href="#nhan-bao-gia"
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-5 text-[15px] font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Nhận báo giá
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </Card>
    </div>
  )
}
