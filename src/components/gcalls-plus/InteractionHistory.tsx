import { History } from 'lucide-react'
import { ProductVisual } from '@/components/common/ProductVisual'
import { CallTimelineMockup } from '@/components/product-ui'
import { GP_HISTORY } from '@/data/gcallsPlus'
import { FeatureSplit } from './FeatureSplit'

/**
 * Interaction history — timeline, call history and filtering.
 *
 * The wide call-history table lives inside CallTimelineMockup, which already
 * crops to its primary column below `md` (Checkpoint 2). It is never scaled
 * down to an unreadable size; the section's meaning is carried by the live
 * bullet list beside it.
 */
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
        <ProductVisual maxWidth="560px">
          <CallTimelineMockup />
        </ProductVisual>
      }
    />
  )
}
