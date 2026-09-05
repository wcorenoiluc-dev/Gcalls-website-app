import { BarChart2 } from 'lucide-react'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { Stage } from '@/components/gcalls-plus/ProductStage'
import { GP_PERFORMANCE } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Team activity management.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE IS NO ANALYTICS DASHBOARD HERE
 * ---------------------------------------------------------------------------
 * This section previously stacked two drawn mockups: `AnalyticsDashboardMockup`
 * and `UserStatusDashboard`. Between them they rendered six invented employees
 * ("Nguyễn Hằng", "Trần M. Tuấn", "Lê P. Linh", "Phạm Đ. Dương", "Võ Thị
 * Thanh", "Đỗ Quang Hải"), invented customer phone numbers (0912 345 678,
 * 0976 543 210) and invented performance figures — 97%, 92%, 98%, 86% answer
 * rates and per-agent call counts — in a section whose heading is about
 * measuring how a team actually operates.
 *
 * That is precisely the shape the brief rules out: no invented staff, no
 * invented phone numbers, no invented KPIs, and no fabricated dashboard used
 * as evidence of the product. The demo-data caption underneath did not fix it;
 * a figure a reader has to be talked out of believing should not be on the
 * page.
 *
 * The replacement is the real agent status log, masked before it entered the
 * repo. It is deliberately the ONLY visual here. `productImages.ts` records
 * that the two captures which would have suited this section best — the
 * analytics dashboard and the agent-performance table — were withheld because
 * they carry real operating figures, which is an unapproved claim whether or
 * not the names beside them are masked. So this section shows presence over
 * time (which is a product surface) and leaves performance numbers to the live
 * bullet list, which claims none.
 * ---------------------------------------------------------------------------
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
        <Stage maxWidth="560px">
          <ProductScreenshot image={GCALLS_PLUS_IMAGES.agentStatusLogDesktop} />
        </Stage>
      }
    />
  )
}
