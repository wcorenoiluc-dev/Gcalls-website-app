import { ArrowRight, Calculator } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'
import { Container, Eyebrow, GradientHeading } from '@/components/common/primitives'

/**
 * Pricing hero.
 *
 * Reference rhythm: centred eyebrow pill → large gradient H1 → lead paragraph
 * → CTA pair → supporting line, on a soft tinted-to-white wash.
 *
 * This carries the page's single H1. Makes no price claim.
 */
export function PricingHero() {
  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background:
          'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Bảng giá Gcalls</Eyebrow>

          <GradientHeading as="h1" className="mt-5 max-w-4xl">
            Bảng giá Gcalls theo nhu cầu vận hành của doanh nghiệp
          </GradientHeading>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Chi phí Gcalls phụ thuộc vào sản phẩm, quy mô đội ngũ, lưu lượng sử dụng, đầu
            số và mức độ tích hợp. Chọn nhu cầu phù hợp để xem cấu hình và cách nhận báo
            giá.
          </p>

          {/* CTAs — full width below sm, inline from sm up. */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to={ROUTES.costEstimator}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
            >
              <Calculator size={18} aria-hidden="true" />
              Ước tính chi phí
            </Link>

            <a
              href="#nhan-bao-gia"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
            >
              Nhận báo giá
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Bắt đầu từ nhu cầu thực tế của doanh nghiệp thay vì một gói cố định cho mọi mô
            hình.
          </p>
        </div>
      </Container>
    </section>
  )
}
