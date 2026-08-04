import { LeadForm } from '@/components/lead/LeadForm'
import type { EstimatorResultData } from '@/lib/estimate'
import type { EstimatorLeadContext } from '@/lib/leads'

/**
 * Estimator quote form.
 *
 * A thin adapter: it maps the estimator's result into the shared lead context
 * and renders the site's single `LeadForm`. The visitor never retypes the
 * configuration they already selected — it travels with the lead.
 */
function toLeadContext(result: EstimatorResultData | null): EstimatorLeadContext | undefined {
  if (!result) return undefined

  return {
    selectedSolution: result.solution,
    agents: result.agents,
    usage: result.usage,
    hotlines: result.hotlines,
    integrations: result.integrations.length ? result.integrations : undefined,
    countries: result.countries.length ? result.countries : undefined,
    qaVolume: result.qaVolume,
    cxChannels: result.channels.length ? result.channels : undefined,
    pricingStatus: result.pricingStatus,
  }
}

export function QuoteRequestForm({ estimate }: { estimate: EstimatorResultData | null }) {
  return (
    <LeadForm
      variant="estimator"
      source="cost_estimator"
      intent="quote"
      product={estimate?.solution}
      estimatorResult={toLeadContext(estimate)}
    />
  )
}
