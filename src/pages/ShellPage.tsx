import { useLocation } from 'react-router'
import { RouteShell } from '@/components/layout/RouteShell'

/**
 * Generic page shell.
 *
 * One component serves every not-yet-written route: `RouteShell` reads the
 * sitemap entry for the current pathname, so each page renders its own
 * eyebrow, H1, intro and onward navigation. Nothing here is shared boilerplate
 * text.
 *
 * Routes with bespoke content (contact form, hub extras) have their own page
 * components instead.
 */

/**
 * Onward navigation for shell routes.
 *
 * EMPTY as of Checkpoint WEB-COMPANY-001 — every public content route now has
 * its own page, so no entry here would ever be read. The map is kept for the
 * same reason `SHELL_ROUTES` is: a route minted ahead of its content should
 * land on a real page with relevant onward links, and this is where those links
 * are declared. Add the route to `SHELL_ROUTES` in `src/app/router.tsx` and its
 * links here at the same time.
 */
const RELATED: Record<string, string[]> = {}

export function ShellPage() {
  const { pathname } = useLocation()

  return <RouteShell related={RELATED[pathname] ?? []} />
}
