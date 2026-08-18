/**
 * Company page registry and structured data — Checkpoint WEB-COMPANY-001.
 *
 * Two pages share one layout and one section library; everything that differs
 * lives in the content files imported here.
 *
 * Read `./types.ts` first: it carries the permission guard and the claim guard
 * both files inherit.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAY BE EMITTED AS STRUCTURED DATA, AND WHY
 * ---------------------------------------------------------------------------
 * Every node below is generated FROM THE RENDERED CONTENT OBJECT, so a node
 * cannot describe something the page does not show.
 *
 *  · `BreadcrumbList` — both pages. The trail matches the rendered breadcrumb
 *    element for element.
 *  · `WebPage` — both pages. Accurate: each is an informational page, and the
 *    node carries only its own title, description and URL.
 *  · `FAQPage` — generated from the same `FaqItem[]` the page renders in full.
 *
 * `CollectionPage` is deliberately NOT emitted: neither page is an index of
 * anything. A customers page with no customers and a partners page with no
 * partners are precisely the two places where a CollectionPage node would
 * announce a collection that does not exist.
 *
 * FORBIDDEN, and deliberately absent: `Review`, `Rating`, `AggregateRating`,
 * `Product`, `Offer`, and every `Organization` node that would name or imply a
 * relationship with a customer, partner or platform. No `sameAs`, no `logo`, no
 * `brand`, no `memberOf`, no `parentOrganization`. The only organisation named
 * anywhere in this graph is Gcalls itself, as the site the page belongs to.
 */

import { ROUTES } from '@/config/navigation'
import type { FaqItem } from '@/components/common/FaqAccordion'
import { CUSTOMERS } from './customers'
import { PARTNERS } from './partners'
import type { CompanyPageBase } from './types'

export { CUSTOMERS, PARTNERS }
export type * from './types'

function breadcrumbNode(content: CompanyPageBase, origin: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Về Gcalls',
        item: `${origin}${ROUTES.company}`,
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

function webPageNode(content: CompanyPageBase, origin: string) {
  return {
    '@type': 'WebPage',
    name: content.hero.h1,
    description: content.hero.description,
    url: `${origin}${content.route}`,
    inLanguage: 'vi-VN',
    isPartOf: { '@type': 'WebSite', name: 'Gcalls', url: `${origin}/` },
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

/** Assembles a company page's `@graph`. */
export function buildCompanyJsonLd(content: CompanyPageBase, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbNode(content, origin),
      webPageNode(content, origin),
      faqPageNode(content.faq),
    ],
  }
}
