/**
 * Resource page registry and structured data — Checkpoint WEB-RES-001.
 *
 * Six pages share one layout, one section library and the navigation below;
 * everything that differs lives in the content files imported here.
 *
 * Read `./types.ts` first: it carries the fabrication guard and the claim guard
 * that all six files inherit.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAY BE EMITTED AS STRUCTURED DATA, AND WHY
 * ---------------------------------------------------------------------------
 * Every builder below generates its nodes FROM THE RENDERED CONTENT OBJECT, so
 * a node cannot describe something the page does not show.
 *
 *  · `BreadcrumbList` — every page. Always valid; the trail is real.
 *  · `FAQPage` — only from a `FaqItem[]` that the page renders in full.
 *  · `CollectionPage` — only for a page whose body IS a complete, visible set
 *    of items. That is Guides today, and nothing else: Blog has no articles,
 *    Case Studies has no case studies and Ebook has no ebooks, so a
 *    CollectionPage there would announce a collection that does not exist.
 *  · `DefinedTermSet` — the glossary only, generated from the same term array
 *    the page renders.
 *
 * FORBIDDEN, and deliberately absent: `Article`, `BlogPosting`, `NewsArticle`,
 * `Product`, `Offer`, `Review`, `Rating`, `AggregateRating`, `author`,
 * `datePublished` and `dateModified`. There is no article, no offer, no review
 * and no publication date in this repository to base any of them on.
 */

import { ROUTES } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import { BLOG } from './blog'
import { GUIDES } from './guides'
import { CASE_STUDIES } from './caseStudies'
import { EBOOK } from './ebook'
import { GLOSSARY } from './glossary'
import { FAQ } from './faq'
import type {
  GlossaryGroup,
  ResourceLink,
  ResourcePageBase,
} from './types'

export { BLOG, GUIDES, CASE_STUDIES, EBOOK, GLOSSARY, FAQ }
export type * from './types'

/**
 * The resource navigation rendered on all six pages.
 *
 * One array, so a page cannot ship a stale copy of the set, and `RoutePath`
 * typing means an entry pointing at a route that does not exist fails to
 * compile.
 */
export interface ResourceNavEntry extends ResourceLink {
  detail: string
}

export const RESOURCE_NAV: readonly ResourceNavEntry[] = [
  {
    label: 'Blog',
    path: ROUTES.blog,
    detail: 'Góc nhìn vận hành theo sáu danh mục biên tập.',
  },
  {
    label: 'Guides',
    path: ROUTES.guides,
    detail: 'Sáu lộ trình đánh giá trước khi triển khai.',
  },
  {
    label: 'Case Studies',
    path: ROUTES.caseStudies,
    detail: 'Tiêu chuẩn bằng chứng cho câu chuyện triển khai.',
  },
  {
    label: 'Ebook',
    path: ROUTES.ebook,
    detail: 'Chủ đề chuyên sâu đang được chuẩn bị.',
  },
  {
    label: 'Glossary',
    path: ROUTES.glossary,
    detail: 'Hai mươi bốn thuật ngữ thường gặp.',
  },
  {
    label: 'FAQ',
    path: ROUTES.faq,
    detail: 'Hai mươi mốt câu hỏi theo sáu nhóm chủ đề.',
  },
] as const

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

function breadcrumbNode(content: ResourcePageBase, origin: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tài nguyên',
        item: `${origin}${ROUTES.resources}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: content.breadcrumbLabel,
        item: `${origin}${content.route}`,
      },
    ],
  }
}

/**
 * A FAQPage node.
 *
 * `link` is presentation only and is never folded into `text`, so the answer in
 * the structured data is character-for-character the answer in the DOM.
 */
export function faqPageNode(items: readonly FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/**
 * A CollectionPage node.
 *
 * Only call this where the page renders the complete set being described. See
 * the note at the top of this file for why five of the six pages do not.
 */
export function collectionPageNode(
  content: ResourcePageBase,
  origin: string,
  collection: {
    name: string
    description: string
    items: readonly { name: string; description: string }[]
  },
) {
  return {
    '@type': 'CollectionPage',
    name: content.hero.h1,
    description: content.hero.description,
    url: `${origin}${content.route}`,
    inLanguage: 'vi-VN',
    isPartOf: { '@type': 'WebSite', name: 'Gcalls', url: `${origin}/` },
    mainEntity: {
      '@type': 'ItemList',
      name: collection.name,
      description: collection.description,
      numberOfItems: collection.items.length,
      itemListElement: collection.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description,
      })),
    },
  }
}

/**
 * The glossary's DefinedTermSet, generated from the rendered term groups.
 *
 * `termCode` is the term's anchor id, which is also the id of its heading in
 * the DOM — so every `DefinedTerm` points at content a reader can actually
 * navigate to. Only `definition` is published as the term's description:
 * `gcallsNote` is a qualification about Gcalls, not part of the definition of
 * the industry term, and folding it in would put a product statement inside a
 * dictionary entry.
 */
export function definedTermSetNode(
  origin: string,
  route: string,
  groups: readonly GlossaryGroup[],
) {
  const url = `${origin}${route}`

  return {
    '@type': 'DefinedTermSet',
    '@id': url,
    name: 'Thuật ngữ tổng đài, tích hợp hệ thống và chất lượng hội thoại',
    url,
    inLanguage: 'vi-VN',
    hasDefinedTerm: groups.flatMap((group) =>
      group.terms.map((term) => ({
        '@type': 'DefinedTerm',
        '@id': `${url}#${term.id}`,
        name: term.term,
        termCode: term.id,
        description: term.definition,
        inDefinedTermSet: url,
      })),
    ),
  }
}

/**
 * Assembles a page's `@graph`.
 *
 * The breadcrumb is always present, the FAQ node is added automatically when
 * the page carries an FAQ array it renders, and anything page-specific is
 * passed in as `extra`.
 */
export function buildResourceJsonLd(
  content: ResourcePageBase,
  origin: string,
  extra: readonly unknown[] = [],
) {
  const graph: unknown[] = [breadcrumbNode(content, origin)]

  if (content.faq && content.faq.length > 0) {
    graph.push(faqPageNode(content.faq))
  }

  graph.push(...extra)

  return { '@context': 'https://schema.org', '@graph': graph }
}
