import { CONTACT } from '@/config/navigation'
import { CompanyHubLayout } from '@/components/company-hub/CompanyHubLayout'
import { COMPANY_HUB } from '@/data/hubs'

/**
 * `/cong-ty/` — company hub.
 *
 * A corporate overview built only from what this repository can support. Years
 * in business, customer count, supported-CRM count, country coverage,
 * headcount, funding and awards are all WITHHELD — none is verified here. See
 * the company block in `src/data/hubs.ts`.
 *
 * The contact block is the most credible thing this page can offer, and it
 * reads `CONTACT` directly rather than restating the address or the number.
 *
 * Uses the page-local `CompanyHubLayout`, not `hub/HubLayout`: the hero carries
 * the official logo and the contact block is hub-specific, and the shared
 * layout also renders five other approved routes.
 */
export function CompanyHubPage() {
  return (
    <CompanyHubLayout
      content={COMPANY_HUB}
      contact={CONTACT}
      trail={[{ label: 'Về Gcalls' }]}
    />
  )
}
