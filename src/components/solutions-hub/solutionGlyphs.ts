import { Bot, Cloud, Globe2, LifeBuoy, MousePointerClick, ShoppingCart, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/config/navigation'
import { leadCtaHref } from '@/lib/leads/ctaLink'

/**
 * A glyph per solution, and the two visual groups the cards are shown in.
 *
 * ---------------------------------------------------------------------------
 * KEYED BY DESTINATION, AND THE ICONS ARE THE HOMEPAGE'S
 * ---------------------------------------------------------------------------
 * The glyphs match `src/components/home/EcosystemSection.tsx` one for one, so a
 * visitor sees the same mark for the same solution on both surfaces. They are
 * repeated here rather than imported because that roster is a module-private
 * const on an out-of-scope page; `scripts/verify-solutions-hub.mjs` reads that
 * file and fails if the two ever disagree.
 *
 * Keys are the card's `path`, which for Cloud Call Center and Call Button
 * Widget is a lead href rather than a route — so the key is built with the same
 * `leadCtaHref` call the data uses, never a hand-written string.
 *
 * GROUPS ARE A UI AFFORDANCE, NOT A TAXONOMY. Seven solutions are one list; the
 * two headings only make a 7-card grid scannable, and neither is an SEO claim.
 * The gate asserts the two groups partition all seven exactly once.
 * ---------------------------------------------------------------------------
 */

const CLOUD_CALL_CENTER_HREF = leadCtaHref({
  intent: 'consultation',
  source: 'consultation',
  solution: 'Cloud Call Center',
})

const CALL_BUTTON_WIDGET_HREF = leadCtaHref({
  intent: 'consultation',
  source: 'consultation',
  solution: 'Call Button Widget',
})

export const SOLUTION_GLYPH: Record<string, LucideIcon> = {
  [ROUTES.crmIntegration]: Users,
  [ROUTES.helpdeskIntegration]: LifeBuoy,
  [ROUTES.posIntegration]: ShoppingCart,
  [ROUTES.internationalCalling]: Globe2,
  [ROUTES.voicebotAi]: Bot,
  [CLOUD_CALL_CENTER_HREF]: Cloud,
  [CALL_BUTTON_WIDGET_HREF]: MousePointerClick,
}

/** Group A — the solutions defined by a system or a market. */
export const GROUP_A_PATHS: readonly string[] = [
  ROUTES.crmIntegration,
  ROUTES.helpdeskIntegration,
  ROUTES.posIntegration,
  ROUTES.internationalCalling,
]

/** Group B — the solutions that add automation or an extra channel. */
export const GROUP_B_PATHS: readonly string[] = [
  ROUTES.voicebotAi,
  CLOUD_CALL_CENTER_HREF,
  CALL_BUTTON_WIDGET_HREF,
]

/** Short UI labels for the two groups. Neither is a claim. */
export const GROUP_LABELS = {
  a: 'Hệ thống và thị trường',
  b: 'Tự động hóa và khả năng bổ sung',
} as const
