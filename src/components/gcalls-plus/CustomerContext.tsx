import { Users } from 'lucide-react'
import { ProductVisualWithSupport } from '@/components/common/ProductVisual'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { GP_CONTEXT } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Customer context — contact profile alongside the call.
 *
 * Contact Profile is the main visual; the phone keypad is the single
 * supporting card. Both are real captures with customer data masked out of the
 * file. Deliberately not labelled "CRM": this is the Gcalls side of the
 * workflow, not a CRM product.
 */
const MASKED_SCREENSHOT_NOTE =
  'Ảnh chụp thật từ môi trường demo nội bộ. Dữ liệu khách hàng và nhân viên đã được che vĩnh viễn.'

export function CustomerContext() {
  return (
    <FeatureSplit
      tinted
      eyebrow={GP_CONTEXT.eyebrow}
      eyebrowIcon={<Users size={14} aria-hidden="true" />}
      title={GP_CONTEXT.h2}
      titleId="ngu-canh-khach-hang"
      description={GP_CONTEXT.description}
      points={GP_CONTEXT.points}
      visual={
        <ProductVisualWithSupport
          main={<ProductScreenshot image={GCALLS_PLUS_IMAGES.contactProfileDesktop} />}
          support={<ProductScreenshot image={GCALLS_PLUS_IMAGES.keypadMobile} />}
          mainMaxWidth="560px"
          note={MASKED_SCREENSHOT_NOTE}
        />
      }
    />
  )
}
