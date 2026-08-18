import { useMemo } from 'react'
import { AlertCircle, ClipboardList, Target } from 'lucide-react'
import { SITE_ORIGIN } from '@/config/seo'
import { CUSTOMERS, buildCompanyJsonLd } from '@/data/company'
import {
  CompanyItemGrid,
  CompanyPageLayout,
  CompanyRoutingSection,
  CompanyStepsSection,
} from '@/components/company/sections'
import {
  CustomerEvidenceSection,
  CustomerProfileSection,
} from '@/components/company/bodies'

/**
 * `/cong-ty/khach-hang/` — Checkpoint WEB-COMPANY-001.
 *
 * A customers page with no customers on it, deliberately. This repository holds
 * no permission record for any customer name or mark, so the page publishes
 * operational profiles instead of a logo wall — which is what a visitor
 * comparing themselves to existing customers actually needs, and which requires
 * nobody's consent.
 *
 * Structured data is BreadcrumbList + WebPage + FAQPage. No `Organization` node
 * names or implies a relationship with anyone; no `Review`, `Rating` or
 * `AggregateRating` node exists. See `src/data/company/index.ts`.
 *
 * Exactly one H1, in the hero.
 */
export function CustomersPage() {
  const jsonLd = useMemo(() => buildCompanyJsonLd(CUSTOMERS, SITE_ORIGIN), [])

  return (
    <CompanyPageLayout content={CUSTOMERS} jsonLd={jsonLd}>
      <CompanyItemGrid
        id={`${CUSTOMERS.id}-serves`}
        eyebrow={CUSTOMERS.serves.eyebrow}
        eyebrowIcon={<Target size={14} aria-hidden="true" />}
        h2={CUSTOMERS.serves.h2}
        description={CUSTOMERS.serves.description}
        items={CUSTOMERS.serves.items}
        note={CUSTOMERS.serves.note}
        tinted
      />

      <CustomerProfileSection content={CUSTOMERS} />

      <CompanyItemGrid
        id={`${CUSTOMERS.id}-problems`}
        eyebrow={CUSTOMERS.problems.eyebrow}
        eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
        h2={CUSTOMERS.problems.h2}
        description={CUSTOMERS.problems.description}
        items={CUSTOMERS.problems.items}
        note={CUSTOMERS.problems.note}
        columns={3}
        tinted
      />

      {/* Solution routing sits inside the body; industry routing closes the page. */}
      <CompanyRoutingSection
        id={`${CUSTOMERS.id}-pathways`}
        routing={CUSTOMERS.pathways}
      />

      <CompanyStepsSection
        id={`${CUSTOMERS.id}-working-model`}
        eyebrow={CUSTOMERS.workingModel.eyebrow}
        eyebrowIcon={<ClipboardList size={14} aria-hidden="true" />}
        h2={CUSTOMERS.workingModel.h2}
        description={CUSTOMERS.workingModel.description}
        steps={CUSTOMERS.workingModel.steps}
        note={CUSTOMERS.workingModel.note}
        tinted
      />

      <CustomerEvidenceSection content={CUSTOMERS} />
    </CompanyPageLayout>
  )
}
