import { Users } from 'lucide-react'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { StageWithSupport } from '@/components/gcalls-plus/ProductStage'
import { GP_CONTEXT } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Customer context — contact profile alongside the call.
 *
 * Contact Profile is the main visual; the phone keypad is the single
 * supporting card. Both are real captures with customer data masked out of the
 * file. Deliberately not labelled "CRM": this is the Gcalls side of the
 * workflow, not a CRM product.
 *
 * Uses the page-local `StageWithSupport`. Under the shared component the
 * keypad rendered 300px wide and covered the contact profile — the one thing
 * this section is about — while leaving a dead band underneath.
 */

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
        <StageWithSupport
          main={<ProductScreenshot image={GCALLS_PLUS_IMAGES.contactProfileDesktop} />}
          support={<ProductScreenshot image={GCALLS_PLUS_IMAGES.keypadMobile} />}
          mainMaxWidth="560px"
        />
      }
    />
  )
}
