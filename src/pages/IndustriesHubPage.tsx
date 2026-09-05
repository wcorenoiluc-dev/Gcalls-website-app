import { IndustriesHubLayout } from '@/components/industries-hub/IndustriesHubLayout'
import { INDUSTRIES_HUB } from '@/data/hubs'
import '@/styles/industries-hub.css'

/**
 * `/nganh/` — industry hub.
 *
 * Six industry cards, each connecting an operating context to the products and
 * solutions that usually fit it. No industry benchmark or result is claimed.
 * Copy lives in `src/data/hubs.ts`; this page renders it through a page-local
 * layout (`IndustriesHubLayout`) that adds a hero orientation diagram and a
 * per-card wayfinding icon without touching the shared `HubLayout`.
 *
 * The `ind-page` class scopes `src/styles/industries-hub.css` (1180px container,
 * 50px section rhythm) to this page only.
 */
export function IndustriesHubPage() {
  return (
    <div className="ind-page">
      <IndustriesHubLayout content={INDUSTRIES_HUB} trail={[{ label: 'Theo ngành' }]} />
    </div>
  )
}
