import '@/styles/pages-06-09.css'
import { HubLayout } from '@/components/hub/HubLayout'
import { ROUTES } from '@/config/navigation'
import { useGcallsContent } from '@/lib/gcallsContent/useGcallsContent'
import { SOLUTIONS_HUB, type HubContent } from '@/data/hubs'

/**
 * `/giai-phap/` — solutions hub.
 *
 * Shows the four solutions (CRM, Helpdesk, POS, International) and uses a
 * decision guide to route a business problem to the right one. Sales, Customer
 * Service and Quality Assurance appear in that guide as ways of describing a
 * need — they are deliberately not routes. Copy lives in `src/data/hubs.ts`.
 */
export function SolutionsHubPage() {
  // Each hub part is its own Content Studio section (src/content/sections/solutions.ts);
  // published overrides are merged back into the HubContent object HubLayout renders.
  const hero = useGcallsContent(ROUTES.solutions, 'hero', SOLUTIONS_HUB.hero)
  const directAnswer = useGcallsContent(ROUTES.solutions, 'directAnswer', SOLUTIONS_HUB.directAnswer)
  const cards = useGcallsContent(ROUTES.solutions, 'cards', SOLUTIONS_HUB.cards)
  const decisionGuide = useGcallsContent(ROUTES.solutions, 'decisionGuide', SOLUTIONS_HUB.decisionGuide ?? EMPTY_GUIDE)
  const links = useGcallsContent(ROUTES.solutions, 'links', SOLUTIONS_HUB.links)
  const finalCta = useGcallsContent(ROUTES.solutions, 'finalCta', SOLUTIONS_HUB.finalCta)
  const content: HubContent = {
    ...SOLUTIONS_HUB,
    hero,
    directAnswer,
    cards,
    decisionGuide: SOLUTIONS_HUB.decisionGuide ? decisionGuide : undefined,
    links,
    finalCta,
  }

  return (
    /* Page-scoped heading + CTA polish — see src/styles/pages-06-09.css. */
    <div data-page="giai-phap">
      <HubLayout content={content} trail={[{ label: 'Giải pháp' }]} />
    </div>
  )
}

/** Placeholder defaults for a hub without a decision guide — never rendered (see the ternary above). */
const EMPTY_GUIDE: NonNullable<HubContent['decisionGuide']> = { eyebrow: '', h2: '', rows: [] }
