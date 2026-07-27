import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/common/primitives'
import { RouteShell } from '@/components/layout/RouteShell'
import { ROUTES } from '@/config/navigation'

/**
 * `/giai-phap/` — solutions hub.
 *
 * Adds use-case navigation on top of the standard shell. Sales, Customer
 * Service and Quality Assurance are deliberately NOT routes: they are ways of
 * describing a need, and each maps onto real product/solution pages. Rendering
 * them as labelled link groups gives visitors that entry point without minting
 * pages that would compete with the real ones for the same queries.
 */
const USE_CASES = [
  {
    id: 'sales',
    label: 'Sales',
    detail: 'Gọi ra, quản lý lead và theo dõi follow-up trên dữ liệu khách hàng.',
    targets: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Tích hợp CRM', path: ROUTES.crmIntegration },
    ],
  },
  {
    id: 'customer-service',
    label: 'Customer Service',
    detail: 'Tiếp nhận và xử lý yêu cầu khách hàng với ngữ cảnh đầy đủ.',
    targets: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'Tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    ],
  },
  {
    id: 'quality-assurance',
    label: 'Quality Assurance',
    detail: 'Đánh giá và kiểm soát chất lượng hội thoại của đội ngũ.',
    targets: [{ label: 'QA QC Center', path: ROUTES.qcCenter }],
  },
]

export function SolutionsHubPage() {
  return (
    <RouteShell childrenHeading="Giải pháp theo hệ thống doanh nghiệp">
      <div>
        <h2 className="text-[26px] font-extrabold tracking-tight text-foreground sm:text-[30px]">
          Bắt đầu từ bài toán của đội ngũ
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Sales, Customer Service và Quality Assurance là các bài toán vận hành. Mỗi bài
          toán được giải quyết bằng sản phẩm và giải pháp tương ứng dưới đây.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <Card as="li" key={useCase.id} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {useCase.label}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {useCase.detail}
              </p>

              <ul className="mt-auto flex flex-col gap-1 pt-5">
                {useCase.targets.map((target) => (
                  <li key={target.path}>
                    <Link
                      to={target.path}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {target.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </div>
    </RouteShell>
  )
}
