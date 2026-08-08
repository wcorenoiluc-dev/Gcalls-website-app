import { useMemo } from 'react'
import { BadgeCheck } from 'lucide-react'
import { SITE_ORIGIN } from '@/config/seo'
import { EBOOK, buildResourceJsonLd } from '@/data/resources'
import {
  ResourceItemGrid,
  ResourcePageLayout,
  ResourceStatusSection,
} from '@/components/resources/sections'
import { EbookTopicSection } from '@/components/resources/bodies'

/**
 * `/tai-nguyen/ebook/` — Checkpoint WEB-RES-001.
 *
 * No ebook exists, so nothing on this page is downloadable, gated or titled as
 * a published work. It publishes the subject areas and the quality bar, both of
 * which are true today.
 *
 * Structured data is BreadcrumbList + FAQPage only.
 *
 * Exactly one H1, in the hero.
 */
export function EbookPage() {
  const jsonLd = useMemo(() => buildResourceJsonLd(EBOOK, SITE_ORIGIN), [])

  return (
    <ResourcePageLayout content={EBOOK} jsonLd={jsonLd} routingTinted faqTinted={false}>
      <EbookTopicSection content={EBOOK} />
      <ResourceItemGrid
        id={`${EBOOK.id}-standard`}
        eyebrow={EBOOK.standard.eyebrow}
        eyebrowIcon={<BadgeCheck size={14} aria-hidden="true" />}
        h2={EBOOK.standard.h2}
        description={EBOOK.standard.description}
        items={EBOOK.standard.items}
        note={EBOOK.standard.note}
        columns={3}
        tinted
      />
      <ResourceStatusSection id={EBOOK.id} status={EBOOK.status} tinted={false} />
    </ResourcePageLayout>
  )
}
