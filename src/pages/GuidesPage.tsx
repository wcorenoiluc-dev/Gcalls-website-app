import { useMemo } from 'react'
import { SITE_ORIGIN } from '@/config/seo'
import { GUIDES, buildResourceJsonLd, collectionPageNode } from '@/data/resources'
import {
  ResourcePageLayout,
  ResourceStatusSection,
} from '@/components/resources/sections'
import { GuidePathSection } from '@/components/resources/bodies'

/**
 * `/tai-nguyen/guides/` — Checkpoint WEB-RES-001.
 *
 * The one resource page that carries a `CollectionPage` node, because it is the
 * one whose body IS a complete, visible collection: the six guide paths are
 * rendered in full on the page, so the ItemList describes content a reader can
 * actually see. Blog, Case Studies and Ebook have no items and therefore get no
 * CollectionPage.
 *
 * Exactly one H1, in the hero.
 */
export function GuidesPage() {
  const jsonLd = useMemo(
    () =>
      buildResourceJsonLd(GUIDES, SITE_ORIGIN, [
        collectionPageNode(GUIDES, SITE_ORIGIN, {
          name: GUIDES.paths.h2,
          description: GUIDES.paths.description,
          items: GUIDES.paths.items.map((path) => ({
            name: path.title,
            description: path.question,
          })),
        }),
      ]),
    [],
  )

  return (
    <ResourcePageLayout content={GUIDES} jsonLd={jsonLd}>
      <GuidePathSection content={GUIDES} />
      <ResourceStatusSection id={GUIDES.id} status={GUIDES.status} tinted />
    </ResourcePageLayout>
  )
}
