import { ArrowRight, Plug } from 'lucide-react'
import { ProductMediaFrame } from '@/components/common/ProductMediaFrame'
import { IntegrationMapMockup } from './ProductInterfaceMockup'
import { GP_INTEGRATION, GP_MEDIA } from '@/data/gcallsPlus'
import { FeatureSplit } from '@/components/common/FeatureSplit'
import { CtaLink } from '@/components/common/Button'

/**
 * CRM / system integration.
 *
 * Code-native hub-and-spoke visual: Gcalls Plus at the centre, generic CRM /
 * Helpdesk / POS / SMS-Web nodes around it. No third-party logo is drawn —
 * the repo holds no approved partner marks — and no connector behaviour is
 * claimed for any named platform.
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
        <ProductMediaFrame
          caption={GP_MEDIA.integration.caption}
          aspectClassName="aspect-[5/6] sm:aspect-[4/3]"
          maxWidth="560px"
          maxHeight="480px"
          padded={false}
          label="Sơ đồ mô phỏng: Gcalls Plus ở trung tâm kết nối với CRM, Helpdesk, POS và SMS/Web để đồng bộ liên hệ và ghi nhận cuộc gọi"
        >
          <IntegrationMapMockup />
        </ProductMediaFrame>
      }
    >
      <CtaLink to={GP_INTEGRATION.cta.path} variant="outline" fullWidth className="mt-8">
        {GP_INTEGRATION.cta.label}
        <ArrowRight size={18} aria-hidden="true" />
      </CtaLink>
    </FeatureSplit>
  )
}
