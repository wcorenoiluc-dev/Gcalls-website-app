import '@/styles/pages-06-09.css'
import { HubLayout } from '@/components/hub/HubLayout'
import { SOLUTIONS_HUB } from '@/data/hubs'

/**
 * `/giai-phap/` — solutions hub.
 *
 * Shows the four solutions (CRM, Helpdesk, POS, International) and uses a
 * decision guide to route a business problem to the right one. Sales, Customer
 * Service and Quality Assurance appear in that guide as ways of describing a
 * need — they are deliberately not routes. Copy lives in `src/data/hubs.ts`.
 */
export function SolutionsHubPage() {
  return (
    /* Page-scoped heading + CTA polish — see src/styles/pages-06-09.css. */
    <div data-page="giai-phap">
      <HubLayout content={SOLUTIONS_HUB} trail={[{ label: 'Giải pháp' }]} />
    </div>
  )
}
