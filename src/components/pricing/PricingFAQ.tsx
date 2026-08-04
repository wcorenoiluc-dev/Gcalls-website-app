import { FaqAccordion } from '@/components/common/FaqAccordion'
import { PRICING_FAQ } from '@/data/pricing'

/**
 * Pricing FAQ. Thin wrapper over the shared accordion so the questions and
 * the FAQPage JSON-LD both read from `PRICING_FAQ`.
 */
export function PricingFAQ() {
  return <FaqAccordion items={PRICING_FAQ} idPrefix="faq" />
}
