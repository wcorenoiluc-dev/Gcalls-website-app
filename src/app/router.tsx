import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { ROUTES, type RoutePath } from '@/config/navigation'
import { SiteLayout } from '@/layouts/SiteLayout'
import { RouteFallback } from '@/components/common/RouteFallback'
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { VISIBLE_ARTICLES } from '@/data/blog/visibility'

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
const VoicebotAiPage = lazy(() =>
  import('@/pages/VoicebotAiPage').then((m) => ({ default: m.VoicebotAiPage })),
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
/**
 * One component serves all six `/nganh/…` routes, so they share a single chunk
 * — the sections are identical and only the content object differs.
 */
const IndustryPage = lazy(() =>
  import('@/pages/IndustryPage').then((m) => ({ default: m.IndustryPage })),
)
/**
 * Resource pages — Checkpoint WEB-RES-001. Six routes, six components: unlike
 * the industry pages, these bodies genuinely differ (a glossary and a
 * case-study index are not the same page with different words), so each keeps
 * its own chunk. They share the resource section library, which vite hoists
 * into a chunk of its own.
 */
const BlogPage = lazy(() =>
  import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })),
)
const GuidesPage = lazy(() =>
  import('@/pages/GuidesPage').then((m) => ({ default: m.GuidesPage })),
)
const CaseStudiesPage = lazy(() =>
  import('@/pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })),
)
const EbookPage = lazy(() =>
  import('@/pages/EbookPage').then((m) => ({ default: m.EbookPage })),
)
const GlossaryPage = lazy(() =>
  import('@/pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })),
)
const FaqPage = lazy(() =>
  import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })),
)
/**
 * Company pages — Checkpoint WEB-COMPANY-001. The last two shells on the site.
 */
const CustomersPage = lazy(() =>
  import('@/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })),
)
const PartnersPage = lazy(() =>
  import('@/pages/PartnersPage').then((m) => ({ default: m.PartnersPage })),
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
/**
 * Blog articles — Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * One component, eighteen explicit paths built from the catalog. Explicit
 * rather than a `:slug` parameter because Batch 1 preserves legacy ROOT-LEVEL
 * URLs, and a root-level wildcard would swallow every unmatched path on the
 * site — including the 404.
 */
const BlogArticlePage = lazy(() =>
  import('@/pages/BlogArticlePage').then((m) => ({ default: m.BlogArticlePage })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

/**
 * Every lazy child route carries its own `errorElement`, so a chunk that
 * fails to load (a tab that outlived a deploy) shows a friendly message inside
 * <main> while the header and footer of SiteLayout keep working. The layout
 * route has one too, for errors thrown before any child renders.
 */
const lazyError = { errorElement: <RouteErrorBoundary /> }

/**
 * Routes served by the sitemap-driven shell.
 *
 * EMPTY as of Checkpoint WEB-COMPANY-001: every public content route on this
 * site now has a real page. The clusters closed in order — Integrations
 * (INT-01…05), Industries (WEB-IND-001), Resources (WEB-RES-001), Company
 * (WEB-COMPANY-001).
 *
 * The array and `ShellPage` are kept ON PURPOSE rather than deleted. The shell
 * renders a real page from a sitemap entry, so it remains the correct landing
 * for any route minted ahead of its content — adding a path here is still the
 * cheapest way to ship a new route without a dead end. Deleting the mechanism
 * would mean rebuilding it the next time that happens.
 */
const SHELL_ROUTES: RoutePath[] = []

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <SiteLayout />,
    errorElement: (
      <SiteLayout>
        <RouteErrorBoundary />
      </SiteLayout>
    ),
    children: [
      { index: true, element: <HomePage /> },

      // Fully built pages
      { path: ROUTES.gcallsPlus, ...lazyError, element: lazyRoute(<GcallsPlusPage />) },
      { path: ROUTES.qcCenter, ...lazyError, element: lazyRoute(<QaQcCenterPage />) },
      { path: ROUTES.gcallsCx, ...lazyError, element: lazyRoute(<GcallsCxPage />) },
      { path: ROUTES.voicebotAi, ...lazyError, element: lazyRoute(<VoicebotAiPage />) },
      { path: ROUTES.crmIntegration, ...lazyError, element: lazyRoute(<CRMIntegrationPage />) },
      {
        path: ROUTES.helpdeskIntegration,
        ...lazyError, element: lazyRoute(<HelpdeskIntegrationPage />),
      },
      { path: ROUTES.posIntegration, ...lazyError, element: lazyRoute(<POSIntegrationPage />) },
      {
        path: ROUTES.internationalCalling,
        ...lazyError, element: lazyRoute(<InternationalCallingPage />),
      },
      { path: ROUTES.pricing, ...lazyError, element: lazyRoute(<PricingPage />) },
      { path: ROUTES.costEstimator, ...lazyError, element: lazyRoute(<CostEstimatorPage />) },

      // Integration platform pages
      { path: ROUTES.hubspot, ...lazyError, element: lazyRoute(<HubspotIntegrationPage />) },
      { path: ROUTES.salesforce, ...lazyError, element: lazyRoute(<SalesforceIntegrationPage />) },
      { path: ROUTES.zohoCrm, ...lazyError, element: lazyRoute(<ZohoCrmIntegrationPage />) },
      { path: ROUTES.freshdesk, ...lazyError, element: lazyRoute(<FreshdeskIntegrationPage />) },
      { path: ROUTES.zendesk, ...lazyError, element: lazyRoute(<ZendeskIntegrationPage />) },

      // Industry pages — one component, six content objects
      { path: ROUTES.education, ...lazyError, element: lazyRoute(<IndustryPage industry="education" />) },
      { path: ROUTES.finance, ...lazyError, element: lazyRoute(<IndustryPage industry="finance" />) },
      { path: ROUTES.insurance, ...lazyError, element: lazyRoute(<IndustryPage industry="insurance" />) },
      {
        path: ROUTES.realEstate,
        ...lazyError, element: lazyRoute(<IndustryPage industry="real-estate" />),
      },
      { path: ROUTES.ecommerce, ...lazyError, element: lazyRoute(<IndustryPage industry="ecommerce" />) },
      { path: ROUTES.bpo, ...lazyError, element: lazyRoute(<IndustryPage industry="bpo" />) },

      // Resource pages
      { path: ROUTES.blog, ...lazyError, element: lazyRoute(<BlogPage />) },
      { path: ROUTES.guides, ...lazyError, element: lazyRoute(<GuidesPage />) },
      { path: ROUTES.caseStudies, ...lazyError, element: lazyRoute(<CaseStudiesPage />) },
      { path: ROUTES.ebook, ...lazyError, element: lazyRoute(<EbookPage />) },
      { path: ROUTES.glossary, ...lazyError, element: lazyRoute(<GlossaryPage />) },
      { path: ROUTES.faq, ...lazyError, element: lazyRoute(<FaqPage />) },

      // Company pages
      { path: ROUTES.customers, ...lazyError, element: lazyRoute(<CustomersPage />) },
      { path: ROUTES.partners, ...lazyError, element: lazyRoute(<PartnersPage />) },

      // Navigation hubs — all six, so no header path lands on a shell
      { path: ROUTES.products, ...lazyError, element: lazyRoute(<ProductsHubPage />) },
      { path: ROUTES.solutions, ...lazyError, element: lazyRoute(<SolutionsHubPage />) },
      { path: ROUTES.integrations, ...lazyError, element: lazyRoute(<IntegrationsHubPage />) },
      { path: ROUTES.industries, ...lazyError, element: lazyRoute(<IndustriesHubPage />) },
      { path: ROUTES.resources, ...lazyError, element: lazyRoute(<ResourcesHubPage />) },
      { path: ROUTES.company, ...lazyError, element: lazyRoute(<CompanyHubPage />) },

      // Pages with bespoke content
      { path: ROUTES.contact, ...lazyError, element: lazyRoute(<ContactPage />) },
      { path: ROUTES.referral, ...lazyError, element: lazyRoute(<ReferralPage />) },

      // Sitemap-driven shells
      ...SHELL_ROUTES.map((path) => ({
        path,
        ...lazyError, element: lazyRoute(<ShellPage />),
      })),

      /**
       * Blog article routes.
       *
       * `VISIBLE_ARTICLES` is empty in a normal production build because every
       * Batch 1 article is a draft, so these paths are NOT REGISTERED there and
       * fall through to the 404 below. This is the primary guard against a
       * draft shipping; the robots directive and the page-level `isVisible`
       * check are the second and third.
       */
      ...VISIBLE_ARTICLES.map((article) => ({
        path: article.url,
        ...lazyError, element: lazyRoute(<BlogArticlePage slug={article.slug} />),
      })),

      { path: '*', ...lazyError, element: lazyRoute(<NotFoundPage />) },
    ],
  },
])
