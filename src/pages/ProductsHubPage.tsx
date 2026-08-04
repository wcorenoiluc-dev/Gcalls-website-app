import { HubLayout } from '@/components/hub/HubLayout'
import { PRODUCTS_HUB } from '@/data/hubs'

/**
 * `/san-pham/` — product hub.
 *
 * Prominently carries all three products (Gcalls Plus Webphone, QA QC Center
 * powered by QC Bot AI, Gcalls CX) and states the boundary between them. Copy
 * lives in `src/data/hubs.ts`.
 */
export function ProductsHubPage() {
  return <HubLayout content={PRODUCTS_HUB} trail={[{ label: 'Sản phẩm' }]} />
}
