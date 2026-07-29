import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/config/navigation'
import { SiteLayout } from '@/layouts/SiteLayout'
import { RouteFallback } from '@/components/common/RouteFallback'
import { HomePage } from '@/pages/HomePage'

/**
 * Route table for the GCALLS website — 37 routes.
 *
 * Paths come from `src/config/sitemap.ts`, the single source of truth, so the
 * router, navigation, footer, breadcrumbs and SEO metadata cannot drift apart.
 *
 * Home is bundled eagerly; everything else is code-split. Routes that share a
 * page component (the sitemap-driven shells) share one chunk.
 */

const GcallsPlusPage = lazy(() =>
  import('@/pages/GcallsPlusPage').then((m) => ({ default: m.GcallsPlusPage })),
)
const QaQcCenterPage = lazy(() =>
  import('@/pages/QaQcCenterPage').then((m) => ({ default: m.QaQcCenterPage })),
)
const GcallsCxPage = lazy(() =>
  import('@/pages/GcallsCxPage').then((m) => ({ default: m.GcallsCxPage })),
)
const CRMIntegrationPage = lazy(() =>
  import('@/pages/CRMIntegrationPage').then((m) => ({ default: m.CRMIntegrationPage })),
)
const HelpdeskIntegrationPage = lazy(() =>
  import('@/pages/HelpdeskIntegrationPage').then((m) => ({
    default: m.HelpdeskIntegrationPage,
  })),
)
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
)
const CostEstimatorPage = lazy(() =>
  import('@/pages/CostEstimatorPage').then((m) => ({ default: m.CostEstimatorPage })),
)
const SolutionsHubPage = lazy(() =>
  import('@/pages/SolutionsHubPage').then((m) => ({ default: m.SolutionsHubPage })),
)
const IntegrationsHubPage = lazy(() =>
  import('@/pages/IntegrationsHubPage').then((m) => ({ default: m.IntegrationsHubPage })),
)
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const ReferralPage = lazy(() =>
  import('@/pages/ReferralPage').then((m) => ({ default: m.ReferralPage })),
)
const ShellPage = lazy(() =>
  import('@/pages/ShellPage').then((m) => ({ default: m.ShellPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

/** Routes served by the sitemap-driven shell. */
const SHELL_ROUTES = [
  // Products
  ROUTES.products,
  // Solutions
  ROUTES.posIntegration,
  ROUTES.internationalCalling,
  // Integrations
  ROUTES.hubspot,
  ROUTES.salesforce,
  ROUTES.zohoCrm,
  ROUTES.freshdesk,
  ROUTES.zendesk,
  // Industries
  ROUTES.industries,
  ROUTES.education,
  ROUTES.finance,
  ROUTES.insurance,
  ROUTES.realEstate,
  ROUTES.ecommerce,
  ROUTES.bpo,
  // Resources
  ROUTES.resources,
  ROUTES.blog,
  ROUTES.guides,
  ROUTES.caseStudies,
  ROUTES.ebook,
  ROUTES.glossary,
  ROUTES.faq,
  // Company
  ROUTES.company,
  ROUTES.customers,
  ROUTES.partners,
]

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },

      // Fully built pages
      { path: ROUTES.gcallsPlus, element: lazyRoute(<GcallsPlusPage />) },
      { path: ROUTES.qcCenter, element: lazyRoute(<QaQcCenterPage />) },
      { path: ROUTES.gcallsCx, element: lazyRoute(<GcallsCxPage />) },
      { path: ROUTES.crmIntegration, element: lazyRoute(<CRMIntegrationPage />) },
      {
        path: ROUTES.helpdeskIntegration,
        element: lazyRoute(<HelpdeskIntegrationPage />),
      },
      { path: ROUTES.pricing, element: lazyRoute(<PricingPage />) },
      { path: ROUTES.costEstimator, element: lazyRoute(<CostEstimatorPage />) },

      // Hubs and pages with bespoke content
      { path: ROUTES.solutions, element: lazyRoute(<SolutionsHubPage />) },
      { path: ROUTES.integrations, element: lazyRoute(<IntegrationsHubPage />) },
      { path: ROUTES.contact, element: lazyRoute(<ContactPage />) },
      { path: ROUTES.referral, element: lazyRoute(<ReferralPage />) },

      // Sitemap-driven shells
      ...SHELL_ROUTES.map((path) => ({
        path,
        element: lazyRoute(<ShellPage />),
      })),

      { path: '*', element: lazyRoute(<NotFoundPage />) },
    ],
  },
])
