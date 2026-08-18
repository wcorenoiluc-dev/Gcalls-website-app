import { useMemo } from 'react'
import { SITE_ORIGIN } from '@/config/seo'
import { FAQ, buildResourceJsonLd, faqPageNode } from '@/data/resources'
import { ResourcePageLayout } from '@/components/resources/sections'
import {
  FaqGroupsSection,
  FaqIndexSection,
} from '@/components/resources/directory'

/**
 * `/tai-nguyen/faq/` — Checkpoint WEB-RES-001.
 *
 * Twenty questions in six groups. The FAQPage node is built by flattening the
 * SAME groups the page renders, in the same order, so every question and
 * answer in the structured data appears verbatim in the DOM.
 *
 * `FAQ.faq` is deliberately unset — the groups are this page's questions, and a
 * second FAQ block would duplicate them and break that exact match.
 *
 * Exactly one H1, in the hero. Group labels are H2, questions H3.
 */
export function FaqPage() {
  const jsonLd = useMemo(
    () =>
      buildResourceJsonLd(FAQ, SITE_ORIGIN, [
        faqPageNode(FAQ.groups.flatMap((group) => group.items)),
      ]),
    [],
  )

  return (
    <ResourcePageLayout content={FAQ} jsonLd={jsonLd} routingTinted>
      <FaqIndexSection content={FAQ} />
      <FaqGroupsSection content={FAQ} />
    </ResourcePageLayout>
  )
}
