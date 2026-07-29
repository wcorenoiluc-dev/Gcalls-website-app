import { ArrowRight, Plug } from 'lucide-react'
import { Link } from 'react-router'
import { ProductVisualWithSupport } from '@/components/common/ProductVisual'
import { APIManagerMockup, WidgetMockup } from '@/components/product-ui'
import { GP_INTEGRATION } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'

/**
 * CRM / system integration.
 *
 * Shows the Gcalls-side integration configuration surface only. No specific
 * third-party platform UI is depicted and no connector behaviour is claimed
 * for any named CRM — the brief forbids inventing either.
 *
 * SUPPORTING CONTEXT ONLY. The "tổng đài tích hợp CRM" keyword is owned by
 * /tong-dai-tich-hop-crm/, so this section carries no capability bullet list:
 * it states the boundary and hands off. Do not grow it into a second CRM
 * landing page (P01-B §10).
 */
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
        <ProductVisualWithSupport
          main={<APIManagerMockup />}
          support={<WidgetMockup />}
          mainMaxWidth="560px"
        />
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
