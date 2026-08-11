/**
 * Navigation information architecture.
 *
 * Everything here is derived from `src/config/sitemap.ts`, which is the single
 * source of truth for routes and labels. This module shapes that data into the
 * header mega menus and the footer columns.
 *
 * ROUTES and RoutePath are re-exported so existing imports keep working —
 * there is still exactly one place a URL is defined.
 */

import { ROUTES, getEntry, type RoutePath } from './sitemap'

export { ROUTES }
export type { RoutePath }

export interface NavItem {
  label: string
  path: RoutePath
  /** Supporting label, e.g. "QC Bot AI" under "QA QC Center". */
  supportingLabel?: string
  /** One-line description shown in mega menus. */
  description?: string
}

/** A labelled column inside a mega menu. */
export interface NavColumn {
  /** Optional column heading, e.g. "CRM" / "HELPDESK". */
  heading?: string
  items: NavItem[]
}

export interface NavGroup {
  id: string
  label: string
  /** "See all" destination for the group. */
  overview?: NavItem
  columns: NavColumn[]
  cta?: NavItem
}

/** Pull label + summary straight from the sitemap so they cannot drift. */
function item(route: RoutePath, overrides: Partial<NavItem> = {}): NavItem {
  const entry = getEntry(route)
  return {
    label: overrides.label ?? entry?.label ?? route,
    path: route,
    description: overrides.description ?? entry?.summary,
    supportingLabel: overrides.supportingLabel ?? entry?.supportingLabel,
  }
}

/* ------------------------------------------------------------------ *
 * Header mega menus
 * ------------------------------------------------------------------ */

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'products',
    label: 'Sản phẩm',
    overview: item(ROUTES.products, { label: 'Tất cả sản phẩm' }),
    columns: [
      {
        items: [
          item(ROUTES.gcallsPlus),
          item(ROUTES.qcCenter),
          item(ROUTES.gcallsCx),
          item(ROUTES.voicebotAi),
        ],
      },
    ],
    cta: { label: 'Khám phá sản phẩm', path: ROUTES.products },
  },
  {
    id: 'solutions',
    label: 'Giải pháp',
    overview: item(ROUTES.solutions, { label: 'Tất cả giải pháp' }),
    columns: [
      {
        heading: 'System integration',
        items: [
          item(ROUTES.crmIntegration),
          item(ROUTES.helpdeskIntegration),
          item(ROUTES.posIntegration),
        ],
      },
      {
        heading: 'Global communication',
        items: [item(ROUTES.internationalCalling)],
      },
    ],
    cta: { label: 'Khám phá giải pháp', path: ROUTES.solutions },
  },
  {
    id: 'integrations',
    label: 'Tích hợp',
    overview: item(ROUTES.integrations, { label: 'Tất cả tích hợp' }),
    columns: [
      {
        heading: 'CRM',
        items: [item(ROUTES.hubspot), item(ROUTES.salesforce), item(ROUTES.zohoCrm)],
      },
      {
        heading: 'Helpdesk',
        items: [item(ROUTES.freshdesk), item(ROUTES.zendesk)],
      },
    ],
    cta: { label: 'Khám phá tích hợp', path: ROUTES.integrations },
  },
  {
    id: 'industries',
    label: 'Theo ngành',
    overview: item(ROUTES.industries, { label: 'Tất cả ngành' }),
    columns: [
      {
        items: [item(ROUTES.education), item(ROUTES.finance), item(ROUTES.insurance)],
      },
      {
        items: [item(ROUTES.realEstate), item(ROUTES.ecommerce), item(ROUTES.bpo)],
      },
    ],
    cta: { label: 'Xem tất cả ngành', path: ROUTES.industries },
  },
  {
    id: 'resources',
    label: 'Tài nguyên',
    overview: item(ROUTES.resources, { label: 'Trung tâm tài nguyên' }),
    columns: [
      {
        heading: 'Kiến thức',
        items: [
          item(ROUTES.blog),
          item(ROUTES.guides),
          item(ROUTES.glossary),
          item(ROUTES.faq),
        ],
      },
      {
        heading: 'Chuyên sâu',
        items: [item(ROUTES.caseStudies), item(ROUTES.ebook)],
      },
    ],
    cta: { label: 'Xem tài nguyên', path: ROUTES.resources },
  },
  {
    /**
     * Pricing. "Ước tính chi phí" is a child action here and must never be
     * promoted to a top-level navigation item.
     */
    id: 'pricing',
    label: 'Bảng giá',
    columns: [
      {
        items: [item(ROUTES.pricing), item(ROUTES.costEstimator)],
      },
    ],
  },
]

export const PRIMARY_CTA = {
  label: 'Đăng ký tư vấn',
  /**
   * Canonical lead route. Every consultation CTA converges here so there is a
   * single conversion surface rather than several page-specific ones.
   */
  path: ROUTES.contact,
} as const

export const CONTACT = {
  email: 'sales@gcalls.co',
  phone: '028 7302 5469',
  /**
   * E.164, with the +84 country code — corrected in Checkpoint WEB-SITE-QA-001.
   *
   * It was `tel:02873025469`. RFC 3966 treats a number without a country code as
   * a LOCAL number, which is only interpretable alongside a `phone-context`
   * parameter; without one, behaviour is up to the dialer. The practical failure
   * is a visitor abroad — which this site actively courts, since
   * `/tong-dai-quoc-te/` is about multi-market operations — tapping the number
   * and reaching nothing. `+84` drops the trunk `0` and is unambiguous
   * everywhere, while `phone` below keeps the domestic display format.
   */
  phoneHref: 'tel:+842873025469',
} as const

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */

export interface FooterColumn {
  id: string
  label: string
  items: NavItem[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'footer-products',
    label: 'Sản phẩm',
    items: [
      item(ROUTES.gcallsPlus, { label: 'Gcalls Plus' }),
      item(ROUTES.qcCenter),
      item(ROUTES.gcallsCx),
      item(ROUTES.voicebotAi),
    ],
  },
  {
    id: 'footer-solutions',
    label: 'Giải pháp',
    items: [
      item(ROUTES.crmIntegration, { label: 'CRM Integration' }),
      item(ROUTES.helpdeskIntegration, { label: 'Helpdesk Integration' }),
      item(ROUTES.posIntegration, { label: 'POS Integration' }),
      item(ROUTES.internationalCalling),
    ],
  },
  {
    id: 'footer-explore',
    label: 'Khám phá',
    items: [
      item(ROUTES.integrations, { label: 'Tích hợp' }),
      item(ROUTES.industries, { label: 'Theo ngành' }),
      item(ROUTES.pricing, { label: 'Bảng giá' }),
      item(ROUTES.costEstimator),
    ],
  },
  {
    id: 'footer-resources',
    label: 'Tài nguyên',
    items: [
      item(ROUTES.blog),
      item(ROUTES.guides),
      item(ROUTES.caseStudies),
      item(ROUTES.ebook),
      item(ROUTES.glossary),
      item(ROUTES.faq),
    ],
  },
  {
    id: 'footer-company',
    label: 'Gcalls',
    items: [
      item(ROUTES.company, { label: 'Về Gcalls' }),
      item(ROUTES.customers),
      item(ROUTES.partners),
      item(ROUTES.referral),
      item(ROUTES.contact),
    ],
  },
]
