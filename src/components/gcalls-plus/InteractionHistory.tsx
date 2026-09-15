import { History } from 'lucide-react'
import { FramedCapture, ProductMediaFrame } from '@/components/common/ProductMediaFrame'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { GP_HISTORY, GP_MEDIA } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Interaction history — timeline, call history and filtering.
 *
 * The visual is the approved, masked call-history capture — the one section
 * whose subject it actually depicts. It is portrait (808×983) and dense, so
 * it sits `object-fit: contain` inside a bounded frame rather than being
 * scaled to full column width; the section's meaning is carried by the live
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
        <ProductMediaFrame
          caption={GP_MEDIA.history.caption}
          aspectRatio="1 / 1"
          maxWidth="500px"
          maxHeight="500px"
        >
          <FramedCapture image={GCALLS_PLUS_IMAGES.callHistoryDesktop} />
        </ProductMediaFrame>
      }
    />
  )
}
