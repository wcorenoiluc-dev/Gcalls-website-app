import { SolutionsHubLayout } from '@/components/solutions-hub/SolutionsHubLayout'
import { SOLUTIONS_HUB } from '@/data/hubs'

/**
 * `/giai-phap/` — solution hub.
 *
 * Carries all seven solutions, ported from the homepage's approved
 * `EcosystemSection` roster. Copy lives in `src/data/hubs.ts`.
 *
 * Voicebot appears here — as a SOLUTION, under the approved name "Giải pháp
 * tích hợp Voicebot AI" — and not on `/san-pham/`.
 *
 * Uses the page-local `SolutionsHubLayout`, not `hub/HubLayout`: the seven
 * cards need a glyph each and two visual groups, and the shared layout also
 * renders five other approved routes.
 */
export function SolutionsHubPage() {
  return <SolutionsHubLayout content={SOLUTIONS_HUB} trail={[{ label: 'Giải pháp' }]} />
}
