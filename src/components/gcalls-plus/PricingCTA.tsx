import { PricingCtaBand } from '@/components/common/PricingCtaBand'
import { GP_PRICING } from '@/data/gcallsPlus'

/**
 * Pricing / cost CTA. Thin wrapper over the shared band so every product page
 * presents cost the same way and reads the same pricing config.
 */
export function PricingCTA() {
  return (
    <PricingCtaBand
      eyebrow={GP_PRICING.eyebrow}
      title={GP_PRICING.h2}
      titleId="chi-phi"
      description={GP_PRICING.description}
      primary={GP_PRICING.primaryCta}
      secondary={GP_PRICING.secondaryCta}
    />
  )
}
