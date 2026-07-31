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
const POSIntegrationPage = lazy(() =>
  import('@/pages/POSIntegrationPage').then((m) => ({
    default: m.POSIntegrationPage,
  })),
)
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
)
const CostEstimatorPage = lazy(() =>
  import('@/pages/CostEstimatorPage').then((m) => ({ default: m.CostEstimatorPage })),
)
const InternationalCallingPage = lazy(() =>
  import('@/pages/InternationalCallingPage').then((m) => ({
    default: m.InternationalCallingPage,
  })),
)
const HubspotIntegrationPage = lazy(() =>
  import('@/pages/HubspotIntegrationPage').then((m) => ({
    default: m.HubspotIntegrationPage,
  })),
)
const SalesforceIntegrationPage = lazy(() =>
  import('@/pages/SalesforceIntegrationPage').then((m) => ({
    default: m.SalesforceIntegrationPage,
  })),
)
const ZohoCrmIntegrationPage = lazy(() =>
  import('@/pages/ZohoCrmIntegrationPage').then((m) => ({
    default: m.ZohoCrmIntegrationPage,
  })),
)
const FreshdeskIntegrationPage = lazy(() =>
  import('@/pages/FreshdeskIntegrationPage').then((m) => ({
    default: m.FreshdeskIntegrationPage,
  })),
)
const ZendeskIntegrationPage = lazy(() =>
  import('@/pages/ZendeskIntegrationPage').then((m) => ({
    default: m.ZendeskIntegrationPage,
  })),
)
const ProductsHubPage = lazy(() =>
  import('@/pages/ProductsHubPage').then((m) => ({ default: m.ProductsHubPage })),
)
const SolutionsHubPage = lazy(() =>
  import('@/pages/SolutionsHubPage').then((m) => ({ default: m.SolutionsHubPage })),
)
const IntegrationsHubPage = lazy(() =>
  import('@/pages/IntegrationsHubPage').then((m) => ({ default: m.IntegrationsHubPage })),
)
const IndustriesHubPage = lazy(() =>
  import('@/pages/IndustriesHubPage').then((m) => ({ default: m.IndustriesHubPage })),
)
const ResourcesHubPage = lazy(() =>
  import('@/pages/ResourcesHubPage').then((m) => ({ default: m.ResourcesHubPage })),
)
const CompanyHubPage = lazy(() =>
  import('@/pages/CompanyHubPage').then((m) => ({ default: m.CompanyHubPage })),
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

/**
 * Routes served by the sitemap-driven shell.
 *
 * Every remaining entry is a CHILD route. No hub and no page reachable in one
 * click from the header renders a shell — that is a Boss Demo V1 requirement,
 * and the list below is where a regression would show up first.
 */
const SHELL_ROUTES = [
  // Integrations — no platform child page is a shell any more. All five have
  // real pages: HubSpot (INT-01), Salesforce (INT-02), Zoho CRM (INT-03),
  // Freshdesk (INT-04), Zendesk (INT-05) — Integration Cluster V1 complete.
  // Industries — child pages
  ROUTES.education,
  ROUTES.finance,
  ROUTES.insurance,
  ROUTES.realEstate,
  ROUTES.ecommerce,
  ROUTES.bpo,
  // Resources — child pages
  ROUTES.blog,
  ROUTES.guides,
  ROUTES.caseStudies,
  ROUTES.ebook,
  ROUTES.glossary,
  ROUTES.faq,
  // Company — child pages
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
      { path: ROUTES.posIntegration, element: lazyRoute(<POSIntegrationPage />) },
      {
        path: ROUTES.internationalCalling,
        element: lazyRoute(<InternationalCallingPage />),
      },
      { path: ROUTES.pricing, element: lazyRoute(<PricingPage />) },
      { path: ROUTES.costEstimator, element: lazyRoute(<CostEstimatorPage />) },

      // Integration platform pages
      { path: ROUTES.hubspot, element: lazyRoute(<HubspotIntegrationPage />) },
      { path: ROUTES.salesforce, element: lazyRoute(<SalesforceIntegrationPage />) },
      { path: ROUTES.zohoCrm, element: lazyRoute(<ZohoCrmIntegrationPage />) },
      { path: ROUTES.freshdesk, element: lazyRoute(<FreshdeskIntegrationPage />) },
      { path: ROUTES.zendesk, element: lazyRoute(<ZendeskIntegrationPage />) },

      // Navigation hubs — all six, so no header path lands on a shell
      { path: ROUTES.products, element: lazyRoute(<ProductsHubPage />) },
      { path: ROUTES.solutions, element: lazyRoute(<SolutionsHubPage />) },
      { path: ROUTES.integrations, element: lazyRoute(<IntegrationsHubPage />) },
      { path: ROUTES.industries, element: lazyRoute(<IndustriesHubPage />) },
      { path: ROUTES.resources, element: lazyRoute(<ResourcesHubPage />) },
      { path: ROUTES.company, element: lazyRoute(<CompanyHubPage />) },

      // Pages with bespoke content
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
