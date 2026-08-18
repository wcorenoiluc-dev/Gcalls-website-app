import { useMemo } from 'react'
import { SITE_ORIGIN } from '@/config/seo'
import { GLOSSARY, buildResourceJsonLd, definedTermSetNode } from '@/data/resources'
import { ResourcePageLayout } from '@/components/resources/sections'
import {
  GlossaryGroupsSection,
  GlossaryIndexSection,
} from '@/components/resources/directory'

/**
 * `/tai-nguyen/glossary/` — Checkpoint WEB-RES-001.
 *
 * Twenty-four terms in six groups. The `DefinedTermSet` node is generated from
 * the same array the page renders and each `DefinedTerm` id is the anchor of a
 * heading that exists in the DOM, so the structured data matches what a reader
 * sees, term for term.
 *
 * Only `definition` is published as a term's description. `gcallsNote` is a
 * qualification about Gcalls, not part of the industry definition, and stays
 * out of the schema — see `definedTermSetNode`.
 *
 * Exactly one H1, in the hero. Group labels are H2, term names H3.
 */
export function GlossaryPage() {
  const jsonLd = useMemo(
    () =>
      buildResourceJsonLd(GLOSSARY, SITE_ORIGIN, [
        definedTermSetNode(SITE_ORIGIN, GLOSSARY.route, GLOSSARY.groups),
      ]),
    [],
  )

  return (
    <ResourcePageLayout
      content={GLOSSARY}
      jsonLd={jsonLd}
      routingTinted
      faqTinted={false}
    >
      <GlossaryIndexSection content={GLOSSARY} />
      <GlossaryGroupsSection content={GLOSSARY} />
    </ResourcePageLayout>
  )
}
