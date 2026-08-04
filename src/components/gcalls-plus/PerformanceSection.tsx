import { BarChart2 } from 'lucide-react'
import { ProductVisual } from '@/components/common/ProductVisual'
import { AnalyticsDashboardMockup, UserStatusDashboard } from '@/components/product-ui'
import { GP_PERFORMANCE } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Analytics & team performance.
 *
 * Analytics Dashboard is primary; the agent status log is stacked below it
 * (secondary), never side-by-side at mobile.
 *
 * The demo-data caption matters most here: the brief is explicit that
 * dashboard values must not be converted into marketing claims.
 */
export function PerformanceSection() {
  return (
    <FeatureSplit
      reverse
      eyebrow={GP_PERFORMANCE.eyebrow}
      eyebrowIcon={<BarChart2 size={14} aria-hidden="true" />}
      title={GP_PERFORMANCE.h2}
      titleId="hieu-suat-doi-ngu"
      description={GP_PERFORMANCE.description}
      points={GP_PERFORMANCE.points}
      visual={
        <div className="flex flex-col gap-5">
          <ProductVisual maxWidth="560px" note={false}>
            <AnalyticsDashboardMockup />
          </ProductVisual>

          <ProductVisual
            maxWidth="560px"
            note="Giao diện minh họa. Các chỉ số, tên Agent và số liệu hiển thị là dữ liệu mẫu, không phải kết quả vận hành của Gcalls."
          >
            <UserStatusDashboard />
          </ProductVisual>
        </div>
      }
    />
  )
}
