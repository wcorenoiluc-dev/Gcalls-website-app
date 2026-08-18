import { History } from 'lucide-react'
import { ProductVisual } from '@/components/common/ProductVisual'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { GP_HISTORY } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Interaction history — timeline, call history and filtering.
 *
 * The visual is a real capture of the call-history table with every customer
 * name, phone number and agent account masked out of the file itself. It is
 * portrait and dense, so it is never scaled below its column width; the
 * section's meaning is carried by the live bullet list beside it.
 */
const MASKED_SCREENSHOT_NOTE =
  'Ảnh chụp thật từ môi trường demo nội bộ. Dữ liệu khách hàng và nhân viên đã được che vĩnh viễn.'

export function InteractionHistory() {
  return (
    <FeatureSplit
      eyebrow={GP_HISTORY.eyebrow}
      eyebrowIcon={<History size={14} aria-hidden="true" />}
      title={GP_HISTORY.h2}
      titleId="lich-su-tuong-tac"
      description={GP_HISTORY.description}
      points={GP_HISTORY.points}
      reverse
      visual={
        <ProductVisual maxWidth="560px" note={MASKED_SCREENSHOT_NOTE}>
          <ProductScreenshot image={GCALLS_PLUS_IMAGES.callHistoryDesktop} />
        </ProductVisual>
      }
    />
  )
}
