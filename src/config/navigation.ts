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
  /** Optional one-line description shown in dropdown menus. */
  description?: string
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
  {
    /**
     * Pricing group. "Ước tính chi phí" is deliberately NOT a top-level nav
     * item — it is a child action of Bảng giá. Both children are first-class
     * destinations with their own routes.
     */
    id: 'pricing',
    label: 'Bảng giá',
    items: [
      {
        label: 'Bảng giá Gcalls',
        path: ROUTES.pricing,
        description: 'Xem mô hình chi phí theo từng sản phẩm và giải pháp.',
      },
      {
        label: 'Ước tính chi phí',
        path: ROUTES.costEstimator,
        description: 'Chuẩn bị cấu hình và nhu cầu sử dụng trước khi nhận báo giá.',
      },
    ],
  },
]

export const PRIMARY_CTA = {
  label: 'Đăng ký tư vấn',
  /**
   * Consultation destination. Points at the cost estimator, which now carries
   * the site's quote-request form — the first real lead-capture surface.
   */
  path: ROUTES.costEstimator,
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
    id: 'footer-pricing',
    label: 'Bảng giá',
    items: [
      { label: 'Bảng giá Gcalls', path: ROUTES.pricing },
      { label: 'Ước tính chi phí', path: ROUTES.costEstimator },
    ],
  },
]
