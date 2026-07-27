import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { DevStatusNote, PageShell } from '@/components/layout/PageShell'
import { CONTACT, ROUTES } from '@/config/navigation'
import { PRICING_NOTE, SOLUTION_PRICING, estimateCost } from '@/data/pricing'

/**
 * Cost estimator — structure only (Checkpoint 2).
 *
 * Implements the approved workflow as a visible 4-step outline plus the
 * input/result layout, but deliberately implements NO pricing logic.
 *
 * Pricing configuration does not exist yet, so the result panel shows
 * "Liên hệ để nhận báo giá". It must never show 0₫ — a zero reads as a real
 * quote and is worse than no number at all.
 *
 * Mobile layout: single column, inputs first, result second, CTA full width.
 */

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: 'Chọn giải pháp',
    detail: 'Xác định sản phẩm và giải pháp tích hợp phù hợp với doanh nghiệp.',
  },
  {
    id: 2,
    title: 'Nhập nhu cầu',
    detail: 'Cung cấp quy mô đội ngũ và nhu cầu sử dụng thực tế.',
  },
  {
    id: 3,
    title: 'Xem ước tính',
    detail: 'Nhận ước tính chi phí dựa trên thông tin đã nhập.',
  },
  {
    id: 4,
    title: 'Nhận báo giá chi tiết',
    detail: 'Đội ngũ Gcalls gửi báo giá chi tiết theo nhu cầu của bạn.',
  },
]

export function CostEstimatorPage() {
  // Shared with /bang-gia/ — one pricing model, no duplicated constants (§19).
  const result = estimateCost()

  return (
    <PageShell
      eyebrow="Chi phí"
      title="Ước tính chi phí"
      intro="Chọn giải pháp, nhập nhu cầu sử dụng và nhận ước tính chi phí tổng đài Gcalls cho doanh nghiệp của bạn."
      breadcrumb={[{ label: 'Ước tính chi phí' }]}
    >
      <div className="flex flex-col gap-8">
        <DevStatusNote>
          Cấu hình giá chưa được đưa vào hệ thống, nên công cụ chưa tính toán. Cấu trúc
          trang và luồng sử dụng đã sẵn sàng.
        </DevStatusNote>

        {/* Workflow — stacks to one column on mobile */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKFLOW_STEPS.map((step) => (
            <li
              key={step.id}
              className="rounded-2xl p-5"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(103,58,183,0.12)',
              }}
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                style={{ background: '#f6f3fc', color: '#673ab7' }}
              >
                {step.id}
              </span>
              <p className="mt-3 text-base font-bold" style={{ color: '#1e2026' }}>
                {step.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#5b5f6b' }}>
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        {/* Estimator layout: input first, result second — on every breakpoint */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section
            className="lg:col-span-3 rounded-2xl p-6 sm:p-8"
            style={{ background: '#ffffff', border: '1px solid rgba(103,58,183,0.12)' }}
            aria-labelledby="estimator-input-heading"
          >
            <h2
              id="estimator-input-heading"
              className="text-lg sm:text-xl font-bold"
              style={{ color: '#1e2026' }}
            >
              Nhu cầu của bạn
            </h2>
            <p className="mt-2 text-base leading-relaxed" style={{ color: '#5b5f6b' }}>
              Biểu mẫu nhập nhu cầu sẽ được xây dựng ở checkpoint tiếp theo, gồm lựa chọn
              giải pháp, số lượng người dùng và nhu cầu tích hợp.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              {[
                `Giải pháp quan tâm (${SOLUTION_PRICING.length} lựa chọn)`,
                'Số lượng Agent',
                'Nhu cầu sử dụng theo giải pháp',
              ].map(
                (field) => (
                  <li
                    key={field}
                    className="flex items-center gap-3 min-h-[52px] px-4 rounded-xl"
                    style={{
                      background: '#f6f3fc',
                      border: '1px dashed rgba(103,58,183,0.28)',
                    }}
                  >
                    <Check size={16} style={{ color: '#673ab7', flexShrink: 0 }} />
                    <span className="text-base" style={{ color: '#5b5f6b' }}>
                      {field}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </section>

          <section
            className="lg:col-span-2 rounded-2xl p-6 sm:p-8 h-fit"
            style={{ background: '#f6f3fc', border: '1px solid rgba(103,58,183,0.12)' }}
            aria-labelledby="estimator-result-heading"
          >
            <h2
              id="estimator-result-heading"
              className="text-lg sm:text-xl font-bold"
              style={{ color: '#1e2026' }}
            >
              Ước tính
            </h2>

            {/* Price state comes from the shared config — never renders 0₫. */}
            <p className="mt-4 text-xl sm:text-2xl font-extrabold" style={{ color: '#673ab7' }}>
              {result.label}
            </p>
            <p className="mt-3 text-base leading-relaxed" style={{ color: '#5b5f6b' }}>
              {PRICING_NOTE}. Chi phí phụ thuộc vào quy mô đội ngũ, giải pháp tích hợp và
              nhu cầu sử dụng thực tế.
            </p>

            <Link
              to={ROUTES.pricing}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full min-h-[52px] px-6 rounded-xl text-base font-semibold transition-colors duration-150 hover:bg-[#5929a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              style={{
                background: '#673ab7',
                color: '#ffffff',
                boxShadow: '0 2px 16px rgba(103,58,183,0.28)',
              }}
            >
              Nhận báo giá chi tiết
              <ArrowRight size={18} />
            </Link>

            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-3 inline-flex items-center justify-center w-full min-h-[48px] px-6 rounded-xl text-base font-medium transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              style={{ color: '#673ab7', border: '1px solid rgba(103,58,183,0.24)' }}
            >
              {CONTACT.email}
            </a>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
