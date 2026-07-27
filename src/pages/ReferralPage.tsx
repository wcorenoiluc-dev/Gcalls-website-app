import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/common/primitives'
import { RouteShell } from '@/components/layout/RouteShell'
import { ROUTES } from '@/config/navigation'

/**
 * `/referral/` — referral programme.
 *
 * Deliberately states process only. No commission rate, reward percentage,
 * payment term or payout schedule appears anywhere — none is approved, and
 * publishing an invented figure would create a commitment Gcalls has not made.
 */
const STEPS = [
  {
    n: '01',
    title: 'Giới thiệu doanh nghiệp',
    detail: 'Chia sẻ thông tin doanh nghiệp có nhu cầu triển khai tổng đài.',
  },
  {
    n: '02',
    title: 'Gcalls trao đổi nhu cầu',
    detail: 'Đội ngũ Gcalls liên hệ để xác nhận phạm vi và tư vấn cấu hình.',
  },
  {
    n: '03',
    title: 'Thống nhất điều khoản hợp tác',
    detail: 'Điều khoản chương trình giới thiệu được trao đổi trực tiếp.',
  },
]

export function ReferralPage() {
  return (
    <RouteShell>
      <div>
        <h2 className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]">
          Cách chương trình hoạt động
        </h2>

        <ol className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {STEPS.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </Card>
          ))}
        </ol>

        <Card className="mt-8 flex flex-col gap-4 bg-brand-light p-6 sm:p-8">
          <p className="flex items-start gap-2.5 text-base leading-relaxed text-foreground">
            <Check size={18} className="mt-0.5 shrink-0 text-brand" strokeWidth={3} aria-hidden="true" />
            Điều khoản hợp tác, phạm vi giới thiệu và cách ghi nhận được thống nhất trực
            tiếp với đội ngũ Gcalls theo từng trường hợp.
          </p>

          <Link
            to={ROUTES.contact}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto sm:self-start"
          >
            Trở thành đối tác giới thiệu Gcalls
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </Card>
      </div>
    </RouteShell>
  )
}
