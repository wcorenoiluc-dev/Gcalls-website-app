import { ArrowRight, Check } from 'lucide-react'
import { Container } from './primitives'

/**
 * Enterprise section.
 *
 * Reference's premium treatment: full-bleed gradient card, generous radius,
 * white type. Promises no SLA, timeline or deployment guarantee — the copy
 * describes process only.
 */
const POINTS = [
  'Phạm vi triển khai theo hệ thống hiện tại',
  'Tích hợp theo quy trình doanh nghiệp',
  'Cấu hình theo quy mô đội ngũ',
  'Kế hoạch triển khai và hỗ trợ theo dự án',
]

export function EnterprisePricingCTA() {
  return (
    <Container>
      <div
        className="rounded-[24px] px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
        style={{
          backgroundImage: 'var(--brand-gradient)',
          boxShadow: '0 16px 56px rgba(103,58,183,0.28)',
        }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px]">
              Enterprise
            </p>

            <h2
              id="enterprise-heading"
              className="mt-4 text-[26px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[34px] lg:text-[40px]"
            >
              Cần một cấu hình riêng cho hệ thống hiện tại?
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Với doanh nghiệp có yêu cầu tích hợp, nhiều nhóm người dùng, nhiều kênh
              hoặc quy trình vận hành riêng, Gcalls sẽ khảo sát nhu cầu trước khi xây
              dựng cấu hình và báo giá.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <ul className="flex flex-col gap-3.5">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20"
                    aria-hidden="true"
                  >
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-white sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#nhan-bao-gia"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-white px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:self-start"
            >
              Nhận báo giá Enterprise
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
