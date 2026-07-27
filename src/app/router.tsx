import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/config/navigation'
import { SiteLayout } from '@/layouts/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { GcallsPlusPage } from '@/pages/GcallsPlusPage'
import { CRMIntegrationPage } from '@/pages/CRMIntegrationPage'
import { HelpdeskIntegrationPage } from '@/pages/HelpdeskIntegrationPage'
import { POSIntegrationPage } from '@/pages/POSIntegrationPage'
import { InternationalCallingPage } from '@/pages/InternationalCallingPage'
import { QCPage } from '@/pages/QCPage'
import { GcallsCXPage } from '@/pages/GcallsCXPage'
import { PricingPage } from '@/pages/PricingPage'
import { CostEstimatorPage } from '@/pages/CostEstimatorPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Route table for the GCALLS website.
 *
 * Paths are the approved product/solution routes and carry a trailing slash.
 * They are defined once in `config/navigation.ts` so navigation, footer and
 * SEO metadata cannot drift apart from the router.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.gcallsPlus, element: <GcallsPlusPage /> },
      { path: ROUTES.crmIntegration, element: <CRMIntegrationPage /> },
      { path: ROUTES.helpdeskIntegration, element: <HelpdeskIntegrationPage /> },
      { path: ROUTES.posIntegration, element: <POSIntegrationPage /> },
      { path: ROUTES.internationalCalling, element: <InternationalCallingPage /> },
      { path: ROUTES.qcCenter, element: <QCPage /> },
      { path: ROUTES.gcallsCx, element: <GcallsCXPage /> },
      { path: ROUTES.pricing, element: <PricingPage /> },
      { path: ROUTES.costEstimator, element: <CostEstimatorPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
