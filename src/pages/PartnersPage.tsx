import { useMemo } from 'react'
import { GitBranch, Network, Scale, SplitSquareHorizontal } from 'lucide-react'
import { SITE_ORIGIN } from '@/config/seo'
import { PARTNERS, buildCompanyJsonLd } from '@/data/company'
import {
  CompanyItemGrid,
  CompanyPageLayout,
  CompanyStepsSection,
} from '@/components/company/sections'
import {
  PartnerCategorySection,
  PartnerModelSection,
} from '@/components/company/bodies'

/**
 * `/cong-ty/doi-tac/` — Checkpoint WEB-COMPANY-001.
 *
 * A partnership FRAMEWORK, not a partner directory. No partner is named, no
 * third-party logo is shown, and no platform Gcalls integrates with is
 * described as a partner of any kind — the clarification section after the
 * status block says so in as many words, because conflating integration with
 * partnership is the specific claim this page exists to avoid.
 *
 * Structured data is BreadcrumbList + WebPage + FAQPage, with no `Organization`
 * node asserting a relationship with anyone.
 *
 * Exactly one H1, in the hero.
 */
export function PartnersPage() {
  const jsonLd = useMemo(() => buildCompanyJsonLd(PARTNERS, SITE_ORIGIN), [])

  return (
    <CompanyPageLayout
      content={PARTNERS}
      jsonLd={jsonLd}
      statusTinted={false}
      afterStatus={
        <CompanyItemGrid
          id={`${PARTNERS.id}-clarification`}
          eyebrow={PARTNERS.clarification.eyebrow}
          eyebrowIcon={<SplitSquareHorizontal size={14} aria-hidden="true" />}
          h2={PARTNERS.clarification.h2}
          description={PARTNERS.clarification.description}
          items={PARTNERS.clarification.items}
          note={PARTNERS.clarification.note}
          tinted
        />
      }
    >
      <CompanyItemGrid
        id={`${PARTNERS.id}-why`}
        eyebrow={PARTNERS.why.eyebrow}
        eyebrowIcon={<Network size={14} aria-hidden="true" />}
        h2={PARTNERS.why.h2}
        description={PARTNERS.why.description}
        items={PARTNERS.why.items}
        note={PARTNERS.why.note}
        tinted
      />

      <PartnerCategorySection content={PARTNERS} />

      <PartnerModelSection content={PARTNERS} />

      <CompanyStepsSection
        id={`${PARTNERS.id}-principles`}
        eyebrow={PARTNERS.principles.eyebrow}
        eyebrowIcon={<Scale size={14} aria-hidden="true" />}
        h2={PARTNERS.principles.h2}
        description={PARTNERS.principles.description}
        steps={PARTNERS.principles.items}
        note={PARTNERS.principles.note}
        columns={3}
      />

      <CompanyStepsSection
        id={`${PARTNERS.id}-journey`}
        eyebrow={PARTNERS.journey.eyebrow}
        eyebrowIcon={<GitBranch size={14} aria-hidden="true" />}
        h2={PARTNERS.journey.h2}
        description={PARTNERS.journey.description}
        steps={PARTNERS.journey.steps}
        note={PARTNERS.journey.note}
        tinted
      />
    </CompanyPageLayout>
  )
}
