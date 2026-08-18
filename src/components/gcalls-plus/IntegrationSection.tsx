import { ArrowRight, Plug } from 'lucide-react'
import { Link } from 'react-router'
import { ProductVisual } from '@/components/common/ProductVisual'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { GP_INTEGRATION } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

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
          <ProductScreenshot image={GCALLS_PLUS_IMAGES.integrationsDesktop} />
        </ProductVisual>
      }
    >
      <Link
        to={GP_INTEGRATION.cta.path}
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-6 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
      >
        {GP_INTEGRATION.cta.label}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </FeatureSplit>
  )
}
