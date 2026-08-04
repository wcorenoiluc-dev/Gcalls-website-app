import { Users } from 'lucide-react'
import { ProductVisualWithSupport } from '@/components/common/ProductVisual'
import { CRMMockup, DialpadMockup } from '@/components/product-ui'
import { GP_CONTEXT } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * Customer context — contact profile alongside the call.
 *
 * Contact Profile is the main visual; the keypad is the single supporting
 * card. Deliberately not labelled "CRM": this is the Gcalls side of the
 * workflow, not a CRM product.
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
        <ProductVisualWithSupport
          main={<CRMMockup />}
          support={<DialpadMockup />}
          mainMaxWidth="560px"
        />
      }
    />
  )
}
