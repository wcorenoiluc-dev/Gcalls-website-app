import { PricingCtaBand } from '@/components/common/PricingCtaBand'
import { GP_PRICING } from '@/data/gcallsPlus'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'

/**
 * Pricing / cost CTA. Thin wrapper over the shared band so every product page
 * presents cost the same way and reads the same pricing config.
 */
export function PricingCTA() {
  const cPricing = useGcallsContent(ROUTES.gcallsPlus, 'pricing', GP_PRICING)
  return (
    <PricingCtaBand
      eyebrow={cPricing.eyebrow}
      title={cPricing.h2}
      titleId="chi-phi"
      description={cPricing.description}
      primary={cPricing.primaryCta}
      secondary={cPricing.secondaryCta}
    />
  )
}
