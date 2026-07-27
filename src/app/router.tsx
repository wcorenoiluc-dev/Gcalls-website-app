import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/config/navigation'
import { SiteLayout } from '@/layouts/SiteLayout'
import { RouteFallback } from '@/components/common/RouteFallback'
import { HomePage } from '@/pages/HomePage'

/**
 * Route table for the GCALLS website.
 *
 * Paths are the approved product/solution routes and carry a trailing slash.
 * They are defined once in `config/navigation.ts` so navigation, footer and
 * SEO metadata cannot drift apart from the router.
 *
 * Home is bundled eagerly — it is the most common entry point and already
 * carries the heaviest section code. Every other route is code-split, which
 * keeps the initial payload flat as content-heavy pages (pricing first) land.
 */

const GcallsPlusPage = lazy(() =>
  import('@/pages/GcallsPlusPage').then((m) => ({ default: m.GcallsPlusPage })),
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
  import('@/pages/POSIntegrationPage').then((m) => ({ default: m.POSIntegrationPage })),
)
const InternationalCallingPage = lazy(() =>
  import('@/pages/InternationalCallingPage').then((m) => ({
    default: m.InternationalCallingPage,
  })),
)
const QCPage = lazy(() => import('@/pages/QCPage').then((m) => ({ default: m.QCPage })))
const GcallsCXPage = lazy(() =>
  import('@/pages/GcallsCXPage').then((m) => ({ default: m.GcallsCXPage })),
)
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
)
const CostEstimatorPage = lazy(() =>
  import('@/pages/CostEstimatorPage').then((m) => ({ default: m.CostEstimatorPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.gcallsPlus, element: lazyRoute(<GcallsPlusPage />) },
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
      { path: ROUTES.qcCenter, element: lazyRoute(<QCPage />) },
      { path: ROUTES.gcallsCx, element: lazyRoute(<GcallsCXPage />) },
      { path: ROUTES.pricing, element: lazyRoute(<PricingPage />) },
      { path: ROUTES.costEstimator, element: lazyRoute(<CostEstimatorPage />) },
      { path: '*', element: lazyRoute(<NotFoundPage />) },
    ],
  },
])
