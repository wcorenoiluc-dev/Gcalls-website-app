import { ProductsHubLayout } from '@/components/products-hub/ProductsHubLayout'
import { PRODUCTS_HUB } from '@/data/hubs'

/**
 * `/san-pham/` — product hub.
 *
 * Carries the three products (Gcalls Plus Webphone, QA QC Center powered by QC
 * Bot AI, Gcalls CX) and states the boundary between them. Copy lives in
 * `src/data/hubs.ts`; the media slots live in
 * `src/components/products-hub/productMedia.tsx`.
 *
 * Voicebot AI is not a product at this hub — see the note above `PRODUCTS_HUB`.
 *
 * Uses the page-local `ProductsHubLayout`, not `hub/HubLayout`: the products
 * hub needs a media slot per card, a tiled hero and a three-column decision
 * guide, and the shared layout also renders five other approved routes.
 */
export function ProductsHubPage() {
  return <ProductsHubLayout content={PRODUCTS_HUB} trail={[{ label: 'Sản phẩm' }]} />
}
