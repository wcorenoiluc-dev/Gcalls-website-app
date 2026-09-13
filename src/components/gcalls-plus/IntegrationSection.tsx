import { ArrowRight, Plug } from 'lucide-react'
import { ProductVisual } from '@/components/common/ProductVisual'
import { ProductScreenshotPlaceholder } from '@/components/common/ProductScreenshotPlaceholder'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { GP_INTEGRATION } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'
import { CtaLink } from '@/components/common/Button'

/**
 * CRM / system integration.
 *
 * Shows the Gcalls-side integration surface only: the connector menu as it
 * actually renders in the product. Connector names appear because they are
 * part of that menu; no third-party platform UI is depicted and no connector
 * behaviour is claimed for any named CRM — the brief forbids inventing either.
 *
 * A single visual, not a main+support pair: the second capture is landscape
 * and would be unreadable in the 300px supporting slot.
 *
 * SUPPORTING CONTEXT ONLY. The "tổng đài tích hợp CRM" keyword is owned by
 * /tong-dai-tich-hop-crm/, so this section carries no capability bullet list:
 * it states the boundary and hands off. Do not grow it into a second CRM
 * landing page (P01-B §10).
 */
const MASKED_SCREENSHOT_NOTE =
  'Ảnh chụp thật từ môi trường demo nội bộ. Dữ liệu khách hàng và nhân viên đã được che vĩnh viễn.'

export function IntegrationSection() {
  return (
    <FeatureSplit
      tinted
      eyebrow={GP_INTEGRATION.eyebrow}
      eyebrowIcon={<Plug size={14} aria-hidden="true" />}
      title={GP_INTEGRATION.h2}
      titleId="tich-hop-he-thong"
      description={GP_INTEGRATION.description}
      visual={
        <ProductVisual maxWidth="560px" note={MASKED_SCREENSHOT_NOTE}>
          <ProductScreenshotPlaceholder
            width={GCALLS_PLUS_IMAGES.integrationsDesktop.width}
            height={GCALLS_PLUS_IMAGES.integrationsDesktop.height}
          />
        </ProductVisual>
      }
    >
      <CtaLink to={GP_INTEGRATION.cta.path} variant="outline" fullWidth className="mt-8">
        {GP_INTEGRATION.cta.label}
        <ArrowRight size={18} aria-hidden="true" />
      </CtaLink>
    </FeatureSplit>
  )
}
