/**
 * Single source of truth for site information architecture.
 *
 * Header navigation, the mobile menu and the footer all read from this file.
 * Adding a route here wires it into all three — do not hardcode links in
 * components.
 *
 * Route paths are the approved GCALLS product/solution routes and include a
 * trailing slash. Do not add routes that are not on this list.
 */

export const ROUTES = {
  home: '/',
  gcallsPlus: '/gcalls-plus-webphone/',
  crmIntegration: '/tong-dai-tich-hop-crm/',
  helpdeskIntegration: '/tong-dai-tich-hop-helpdesk/',
  posIntegration: '/tong-dai-tich-hop-pos/',
  internationalCalling: '/tong-dai-quoc-te/',
  qcCenter: '/qc-bot-ai/',
  gcallsCx: '/gcalls-cx/',
  pricing: '/bang-gia/',
  costEstimator: '/uoc-tinh-chi-phi/',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export interface NavItem {
  /** Display label — the approved entity label for this route. */
  label: string
  path: RoutePath
  /** Optional supporting label (e.g. "QC Bot AI" under "QA QC Center"). */
  supportingLabel?: string
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'products',
    label: 'Sản phẩm',
    items: [
      { label: 'Gcalls Plus Webphone', path: ROUTES.gcallsPlus },
      { label: 'QA QC Center', path: ROUTES.qcCenter, supportingLabel: 'QC Bot AI' },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    ],
  },
  {
    id: 'solutions',
    label: 'Giải pháp',
    items: [
      { label: 'Tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
      { label: 'Tích hợp POS', path: ROUTES.posIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
    ],
  },
]

/** Commercial links — rendered flat (not as a dropdown group) in the header. */
export const COMMERCIAL_ITEMS: NavItem[] = [
  { label: 'Bảng giá', path: ROUTES.pricing },
  { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
]

export const PRIMARY_CTA = {
  label: 'Đăng ký tư vấn',
  /**
   * Consultation destination. Until a real lead-capture form exists
   * (Checkpoint 3), this points at the pricing route rather than a dead `#`.
   */
  path: ROUTES.pricing,
} as const

export const CONTACT = {
  email: 'sales@gcalls.co',
  phone: '028 7302 5469',
  /** tel: needs the digits only. */
  phoneHref: 'tel:02873025469',
} as const

/** Footer column layout. */
export const FOOTER_GROUPS: NavGroup[] = [
  {
    id: 'footer-products',
    label: 'Sản phẩm',
    items: [
      { label: 'Gcalls Plus', path: ROUTES.gcallsPlus },
      { label: 'QA QC Center', path: ROUTES.qcCenter },
      { label: 'Gcalls CX', path: ROUTES.gcallsCx },
    ],
  },
  {
    id: 'footer-solutions',
    label: 'Giải pháp',
    items: [
      { label: 'Tích hợp CRM', path: ROUTES.crmIntegration },
      { label: 'Tích hợp Helpdesk', path: ROUTES.helpdeskIntegration },
      { label: 'Tích hợp POS', path: ROUTES.posIntegration },
      { label: 'Tổng đài quốc tế', path: ROUTES.internationalCalling },
    ],
  },
  {
    id: 'footer-other',
    label: 'Khác',
    items: [
      { label: 'Bảng giá', path: ROUTES.pricing },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
    ],
  },
]
