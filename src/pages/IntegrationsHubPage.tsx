import { ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/common/primitives'
import { RouteShell } from '@/components/layout/RouteShell'
import { ROUTES } from '@/config/navigation'

/**
 * `/tich-hop/` — integration hub.
 *
 * Groups platform pages by category. Only platforms that have an approved page
 * are listed; "other business systems" points at the solution pages rather
 * than implying a catalogue that does not exist.
 *
 * Platform names only — no logos, no partner or certification claims, and no
 * assertion that capabilities behave identically across platforms.
 */
const CATEGORIES = [
  {
    id: 'crm',
    label: 'CRM',
    detail: 'Kết nối cuộc gọi với dữ liệu và workflow bán hàng.',
    items: [
      { label: 'HubSpot', path: ROUTES.hubspot },
      { label: 'Salesforce', path: ROUTES.salesforce },
      { label: 'Zoho CRM', path: ROUTES.zohoCrm },
    ],
    overview: { label: 'Tổng quan tích hợp CRM', path: ROUTES.crmIntegration },
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    detail: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket.',
    items: [
      { label: 'Freshdesk', path: ROUTES.freshdesk },
      { label: 'Zendesk', path: ROUTES.zendesk },
    ],
    overview: {
      label: 'Tổng quan tích hợp Helpdesk',
      path: ROUTES.helpdeskIntegration,
    },
  },
  {
    id: 'other',
    label: 'Hệ thống doanh nghiệp khác',
    detail: 'POS và các hệ thống vận hành khác theo phạm vi triển khai.',
    items: [
      { label: 'Tích hợp POS', path: ROUTES.posIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
    ],
    overview: { label: 'Ước tính cấu hình tích hợp', path: ROUTES.costEstimator },
  },
]

const NOTE =
  'Khả năng kết nối và phạm vi dữ liệu có thể khác nhau giữa các nền tảng, và được Gcalls xác nhận theo hệ thống thực tế của doanh nghiệp.'

export function IntegrationsHubPage() {
  return (
    <RouteShell>
      <div>
        <h2 className="sr-only">Danh mục tích hợp</h2>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Card as="li" key={category.id} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {category.label}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {category.detail}
              </p>

              <ul className="mt-5 flex flex-col gap-1">
                {category.items.map((platform) => (
                  <li key={platform.path}>
                    <Link
                      to={platform.path}
                      className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-foreground underline-offset-4 transition-colors duration-150 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {platform.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5">
                <Link
                  to={category.overview.path}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {category.overview.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </ul>

        <p className="mt-6 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {NOTE}
        </p>
      </div>
    </RouteShell>
  )
}
