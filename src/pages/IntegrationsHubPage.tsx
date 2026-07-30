import { HubLayout } from '@/components/hub/HubLayout'
import { INTEGRATIONS_HUB } from '@/data/hubs'

/**
 * `/tich-hop/` — integration hub.
 *
 * Lists exactly the five platforms that have a route in the locked sitemap:
 * HubSpot, Salesforce, Zoho CRM, Freshdesk, Zendesk. Names only — no logo, no
 * partnership or certification claim. Copy lives in `src/data/hubs.ts`.
 */
export function IntegrationsHubPage() {
  return <HubLayout content={INTEGRATIONS_HUB} trail={[{ label: 'Tích hợp' }]} />
}
