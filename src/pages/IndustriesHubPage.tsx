import { HubLayout } from '@/components/hub/HubLayout'
import { INDUSTRIES_HUB } from '@/data/hubs'

/**
 * `/nganh/` — industry hub.
 *
 * Six industry cards, each connecting an operating context to the products and
 * solutions that usually fit it. No industry benchmark or result is claimed.
 * Copy lives in `src/data/hubs.ts`.
 */
export function IndustriesHubPage() {
  return <HubLayout content={INDUSTRIES_HUB} trail={[{ label: 'Theo ngành' }]} />
}
