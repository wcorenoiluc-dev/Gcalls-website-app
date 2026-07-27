import { ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/common/primitives'
import { COST_DRIVERS } from '@/data/estimator'
import type { EstimatorResultData, PriceState, Recommendation } from '@/lib/estimate'

/**
 * Step 4 — recommended configuration, cost model and price state.
 *
 * The price block renders whatever `buildPriceState()` returns. It contains no
 * fallback arithmetic of its own, so it cannot produce 0₫, NaN or undefined.
 */
export function EstimatorResult({
  result,
  recommendation,
  price,
  onRequestQuote,
}: {
  result: EstimatorResultData
  recommendation: Recommendation
  price: PriceState
  onRequestQuote: () => void
}) {
  const rows: Array<[string, string]> = []
  const push = (label: string, value?: string | number | null) => {
    if (value === undefined || value === null || value === '') return
    rows.push([label, String(value)])
  }

  push('Sản phẩm / giải pháp', result.solution)
  push('Số lượng Agent', result.agents)
  push('Quy mô sử dụng', result.usage)
  push('Đầu số / hotline', result.hotlines)
  push('Kênh giao tiếp', result.channels.join(', '))
  push('Tích hợp', result.integrations.join(', '))
  push('Thị trường', result.countries.join(', '))
  push(
    'Cuộc gọi cần phân tích QA',
    result.qaVolume !== undefined ? result.qaVolume.toLocaleString('vi-VN') : undefined,
  )
  push('Yêu cầu bổ sung', result.extras.join(', '))

  return (
    <div className="flex flex-col gap-5">
      {/* ── Recommended configuration ─────────────────────────────── */}
      <Card className="p-6 sm:p-8">
        <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
          Cấu hình đề xuất
        </p>

        <h3 className="mt-2 flex items-center gap-2 text-xl font-extrabold text-foreground sm:text-2xl">
          <CheckCircle2 size={20} className="shrink-0 text-brand" aria-hidden="true" />
          {recommendation.primary.name}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          {recommendation.primary.summary}
        </p>

        <dl className="mt-6 flex flex-col">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-1 border-b border-brand-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <dt className="text-[15px] text-muted-foreground">{label}</dt>
              <dd className="text-[15px] font-semibold text-foreground sm:text-right">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {recommendation.consider.length > 0 && (
          <div className="mt-6 rounded-[10px] bg-brand-light px-5 py-4">
            <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
              Có thể cân nhắc
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {recommendation.consider.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.cta.path}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-foreground underline-offset-4 transition-colors duration-150 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {item.name}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* ── Cost model ────────────────────────────────────────────── */}
      <Card className="p-6 sm:p-8">
        <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
          Mô hình chi phí
        </p>
        <h3 className="mt-2 text-lg font-extrabold text-foreground sm:text-xl">
          Những yếu tố cấu thành chi phí cho cấu hình này
        </h3>

        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COST_DRIVERS.map((driver) => (
            <li
              key={driver.id}
              className="rounded-[10px] border border-brand-border px-4 py-3"
            >
              <p className="text-[15px] font-bold text-foreground">{driver.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {driver.detail}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      {/* ── Price state ───────────────────────────────────────────── */}
      <Card className="bg-brand-light p-6 sm:p-8">
        <p className="text-[12px] font-bold uppercase tracking-wider text-brand">
          Chi phí tham khảo
        </p>

        <p className="mt-2 text-[22px] font-extrabold leading-tight text-brand sm:text-2xl">
          {price.label}
        </p>

        <p className="mt-2 flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {price.supporting}
        </p>

        <button
          type="button"
          onClick={onRequestQuote}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-6 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
        >
          Nhận báo giá chi tiết
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </Card>
    </div>
  )
}
