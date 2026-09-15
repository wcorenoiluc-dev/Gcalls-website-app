import { Users } from 'lucide-react'
import { ProductMediaFrame } from '@/components/common/ProductMediaFrame'
import { CustomerContextMockup } from './ProductInterfaceMockup'
import { GP_CONTEXT, GP_MEDIA } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'

/**
 * Customer context — contact profile alongside the call.
 *
 * Rendered as a code-native mockup (profile, call history, notes, owner, live
 * call status) with sample data only. The masked contact-profile capture this
 * section used to reference is PII_BLOCKED and the keypad capture that stood
 * beside it showed a dialpad — the wrong subject for a section about context.
 * Deliberately not labelled "CRM": this is the Gcalls side of the workflow.
 */
export function CustomerContext() {
  const cContext = useGcallsContent(ROUTES.gcallsPlus, 'context', GP_CONTEXT)
  return (
    <FeatureSplit
      tinted
      eyebrow={cContext.eyebrow}
      eyebrowIcon={<Users size={14} aria-hidden="true" />}
      title={cContext.h2}
      titleId="ngu-canh-khach-hang"
      description={cContext.description}
      points={cContext.points}
      visual={
        <ProductMediaFrame
          caption={GP_MEDIA.context.caption}
          aspectRatio="16 / 11"
          maxWidth="600px"
          maxHeight="440px"
          padded={false}
          label="Giao diện mô phỏng hồ sơ liên hệ Gcalls Plus: thông tin liên hệ, người phụ trách, trạng thái cuộc gọi, lịch sử cuộc gọi và ghi chú; dữ liệu mẫu"
        >
          <CustomerContextMockup />
        </ProductMediaFrame>
      }
    />
  )
}
