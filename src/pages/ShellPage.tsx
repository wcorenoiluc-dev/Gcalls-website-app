import { useLocation } from 'react-router'
import { RouteShell } from '@/components/layout/RouteShell'
import { ROUTES } from '@/config/navigation'

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
 * Onward navigation for leaf routes that have no children of their own.
 * Chosen per route so the links are genuinely relevant, not filler.
 *
 * Only CHILD routes appear here. Every hub, product and solution page now has
 * its own component, so an entry for one of those would be dead code.
 */
const RELATED: Record<string, string[]> = {
  // Integration platform pages
  [ROUTES.hubspot]: [ROUTES.crmIntegration, ROUTES.salesforce, ROUTES.zohoCrm],
  [ROUTES.salesforce]: [ROUTES.crmIntegration, ROUTES.hubspot, ROUTES.zohoCrm],
  [ROUTES.zohoCrm]: [ROUTES.crmIntegration, ROUTES.hubspot, ROUTES.salesforce],
  [ROUTES.freshdesk]: [ROUTES.helpdeskIntegration, ROUTES.zendesk, ROUTES.gcallsCx],
  [ROUTES.zendesk]: [ROUTES.helpdeskIntegration, ROUTES.freshdesk, ROUTES.gcallsCx],

  // Industries
  [ROUTES.education]: [ROUTES.gcallsPlus, ROUTES.crmIntegration, ROUTES.industries],
  [ROUTES.finance]: [ROUTES.gcallsPlus, ROUTES.qcCenter, ROUTES.industries],
  [ROUTES.insurance]: [ROUTES.gcallsPlus, ROUTES.qcCenter, ROUTES.industries],
  [ROUTES.realEstate]: [ROUTES.gcallsPlus, ROUTES.crmIntegration, ROUTES.industries],
  [ROUTES.ecommerce]: [ROUTES.posIntegration, ROUTES.gcallsCx, ROUTES.industries],
  [ROUTES.bpo]: [ROUTES.gcallsCx, ROUTES.qcCenter, ROUTES.industries],

  // Resources
  [ROUTES.blog]: [ROUTES.guides, ROUTES.caseStudies, ROUTES.resources],
  [ROUTES.guides]: [ROUTES.blog, ROUTES.glossary, ROUTES.resources],
  [ROUTES.caseStudies]: [ROUTES.blog, ROUTES.ebook, ROUTES.resources],
  [ROUTES.ebook]: [ROUTES.guides, ROUTES.caseStudies, ROUTES.resources],
  [ROUTES.glossary]: [ROUTES.faq, ROUTES.guides, ROUTES.resources],
  [ROUTES.faq]: [ROUTES.glossary, ROUTES.pricing, ROUTES.resources],

  // Company
  [ROUTES.customers]: [ROUTES.company, ROUTES.partners, ROUTES.caseStudies],
  [ROUTES.partners]: [ROUTES.company, ROUTES.referral, ROUTES.contact],
}

export function ShellPage() {
  const { pathname } = useLocation()

  return <RouteShell related={RELATED[pathname] ?? []} />
}
