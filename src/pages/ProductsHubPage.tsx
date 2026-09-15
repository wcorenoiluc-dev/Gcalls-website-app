import { HubLayout } from '@/components/hub/HubLayout'
import { PRODUCTS_HUB, type HubContent } from '@/data/hubs'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'

/**
 * `/san-pham/` — product hub.
 *
 * Prominently carries all three products (Gcalls Plus Webphone, QA QC Center
 * powered by QC Bot AI, Gcalls CX) and states the boundary between them. Copy
 * lives in `src/data/hubs.ts`.
 */
export function ProductsHubPage() {
  // Each hub part is its own Content Studio section (src/content/sections/products.ts);
  // published overrides are merged back into the HubContent object HubLayout renders.
  const hero = useGcallsContent(ROUTES.products, 'hero', PRODUCTS_HUB.hero)
  const directAnswer = useGcallsContent(ROUTES.products, 'directAnswer', PRODUCTS_HUB.directAnswer)
  const cards = useGcallsContent(ROUTES.products, 'cards', PRODUCTS_HUB.cards)
  const decisionGuide = useGcallsContent(ROUTES.products, 'decisionGuide', PRODUCTS_HUB.decisionGuide ?? EMPTY_GUIDE)
  const links = useGcallsContent(ROUTES.products, 'links', PRODUCTS_HUB.links)
  const finalCta = useGcallsContent(ROUTES.products, 'finalCta', PRODUCTS_HUB.finalCta)
  const content: HubContent = {
    ...PRODUCTS_HUB,
    hero,
    directAnswer,
    cards,
    decisionGuide: PRODUCTS_HUB.decisionGuide ? decisionGuide : undefined,
    links,
    finalCta,
  }
  return <HubLayout content={content} trail={[{ label: 'Sản phẩm' }]} />
}

/** Placeholder defaults for a hub without a decision guide — never rendered (see the ternary above). */
const EMPTY_GUIDE: NonNullable<HubContent['decisionGuide']> = { eyebrow: '', h2: '', rows: [] }
