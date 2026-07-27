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
 */
const RELATED: Record<string, string[]> = {
  // Products
  [ROUTES.qcCenter]: [ROUTES.gcallsPlus, ROUTES.gcallsCx, ROUTES.pricing],
  [ROUTES.gcallsCx]: [ROUTES.gcallsPlus, ROUTES.qcCenter, ROUTES.pricing],

  // Solutions
  [ROUTES.helpdeskIntegration]: [
    ROUTES.crmIntegration,
    ROUTES.posIntegration,
    ROUTES.gcallsPlus,
  ],
  [ROUTES.posIntegration]: [
    ROUTES.crmIntegration,
    ROUTES.helpdeskIntegration,
    ROUTES.gcallsPlus,
  ],
  [ROUTES.internationalCalling]: [
    ROUTES.gcallsPlus,
    ROUTES.gcallsCx,
    ROUTES.costEstimator,
  ],

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

const HEADINGS: Record<string, string> = {
  [ROUTES.products]: 'Sản phẩm Gcalls',
  [ROUTES.industries]: 'Ngành đang được hỗ trợ',
  [ROUTES.resources]: 'Danh mục tài nguyên',
  [ROUTES.company]: 'Tìm hiểu thêm về Gcalls',
}

export function ShellPage() {
  const { pathname } = useLocation()

  return (
    <RouteShell
      related={RELATED[pathname] ?? []}
      childrenHeading={HEADINGS[pathname]}
    />
  )
}
