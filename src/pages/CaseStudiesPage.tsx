import { useMemo } from 'react'
import { ShieldCheck } from 'lucide-react'
import { SITE_ORIGIN } from '@/config/seo'
import { CASE_STUDIES, buildResourceJsonLd } from '@/data/resources'
import {
  ResourceItemGrid,
  ResourcePageLayout,
  ResourceStatusSection,
} from '@/components/resources/sections'
import {
  CaseFilterSection,
  EvidenceStandardSection,
} from '@/components/resources/bodies'

/**
 * `/tai-nguyen/case-studies/` — Checkpoint WEB-RES-001.
 *
 * Publishes zero case studies and says so. What it does publish is the evidence
 * standard an entry must meet, which is useful on its own.
 *
 * Structured data is BreadcrumbList + FAQPage only. No `Review`, `Rating`,
 * `AggregateRating` or CollectionPage node is emitted — there is no review, no
 * rating and no collection.
 *
 * Exactly one H1, in the hero.
 */
export function CaseStudiesPage() {
  const jsonLd = useMemo(() => buildResourceJsonLd(CASE_STUDIES, SITE_ORIGIN), [])

  return (
    <ResourcePageLayout content={CASE_STUDIES} jsonLd={jsonLd}>
      <ResourceItemGrid
        id={`${CASE_STUDIES.id}-why-evidence`}
        eyebrow={CASE_STUDIES.whyEvidence.eyebrow}
        eyebrowIcon={<ShieldCheck size={14} aria-hidden="true" />}
        h2={CASE_STUDIES.whyEvidence.h2}
        description={CASE_STUDIES.whyEvidence.description}
        items={CASE_STUDIES.whyEvidence.items}
        note={CASE_STUDIES.whyEvidence.note}
      />
      <CaseFilterSection content={CASE_STUDIES} />
      <EvidenceStandardSection content={CASE_STUDIES} />
      <ResourceStatusSection
        id={CASE_STUDIES.id}
        status={CASE_STUDIES.status}
        tinted
      />
    </ResourcePageLayout>
  )
}
