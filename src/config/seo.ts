/**
 * Per-route SEO metadata.
 *
 * Checkpoint 2 scope: make every route *capable* of independent metadata.
 * The copy here is descriptive placeholder metadata derived from the approved
 * route purposes — it is NOT optimised copy and will be rewritten in the SEO
 * checkpoint. What matters now is that no two routes share one global title.
 */

import { ROUTES, type RoutePath } from './navigation'

/* ------------------------------------------------------------------------ *
 * SEARCH INDEXING — READ BEFORE CHANGING
 * ------------------------------------------------------------------------ *
 * The site currently ships `noindex, nofollow` on every route. This is
 * DELIBERATE for the pre-launch build and must not be removed casually.
 *
 * To enable indexing at go-live, set VITE_ALLOW_INDEXING=true in the
 * production environment (see docs/LAUNCH_CHECKLIST.md). Flipping this is a
 * conscious launch step, not a code change.
 * ------------------------------------------------------------------------ */
export const ALLOW_INDEXING = import.meta.env.VITE_ALLOW_INDEXING === 'true'

export const ROBOTS_CONTENT = ALLOW_INDEXING
  ? 'index, follow'
  : 'noindex, nofollow'

/** Canonical origin. Override per environment at launch. */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN ?? 'https://gcalls.co'

export const SITE_NAME = 'Gcalls'
export const SITE_LOCALE = 'vi_VN'
export const DEFAULT_OG_TYPE = 'website'

export interface PageMeta {
  /** <title> for this route. Rendered as `${title} | Gcalls` unless isHome. */
  title: string
  description: string
  /** Set on the home route so the title is not suffixed twice. */
  isHome?: boolean
  /**
   * Use `title` verbatim, without the `| Gcalls` suffix. For routes with an
   * approved full title that already contains the brand.
   */
  exactTitle?: boolean
}

export const PAGE_META: Record<RoutePath, PageMeta> = {
  [ROUTES.home]: {
    title: 'Gcalls — Call Smarter, Grow Faster',
    description:
      'Gcalls Plus Webphone giúp đội Sales và CSKH nghe gọi, quản lý danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi ngay trên trình duyệt.',
    isHome: true,
  },
  [ROUTES.gcallsPlus]: {
    title: 'Gcalls Plus Webphone',
    description:
      'Tổng đài chuyên nghiệp chạy trên trình duyệt cho đội Sales và CSKH: nghe gọi, quản lý danh bạ, lịch sử tương tác và theo dõi hiệu suất.',
  },
  [ROUTES.crmIntegration]: {
    title: 'Tích hợp CRM',
    description:
      'Kết nối tổng đài Gcalls với hệ thống CRM để đồng bộ danh bạ, lịch sử cuộc gọi và ghi chú trực tiếp trong quy trình bán hàng.',
  },
  [ROUTES.helpdeskIntegration]: {
    title: 'Tích hợp Helpdesk',
    description:
      'Kết nối tổng đài Gcalls với hệ thống Helpdesk để gắn cuộc gọi vào ticket và theo dõi toàn bộ lịch sử hỗ trợ khách hàng.',
  },
  [ROUTES.posIntegration]: {
    title: 'Tích hợp POS',
    description:
      'Kết nối tổng đài Gcalls với hệ thống POS để nhận diện khách hàng và xử lý đơn hàng ngay khi cuộc gọi đến.',
  },
  [ROUTES.internationalCalling]: {
    title: 'Tổng đài quốc tế',
    description:
      'Giải pháp tổng đài cho doanh nghiệp có nhu cầu liên lạc quốc tế, với hạ tầng thoại đám mây và quản lý tập trung.',
  },
  [ROUTES.qcCenter]: {
    title: 'QA QC Center',
    description:
      'QA QC Center (QC Bot AI) hỗ trợ đánh giá và kiểm soát chất lượng cuộc gọi của đội Sales và CSKH.',
  },
  [ROUTES.gcallsCx]: {
    title: 'Gcalls CX',
    description:
      'Gcalls CX tập trung vào trải nghiệm khách hàng trên toàn bộ hành trình tương tác qua kênh thoại.',
  },
  [ROUTES.pricing]: {
    title: 'Bảng giá Gcalls | Gói tổng đài cho SME & giải pháp doanh nghiệp',
    exactTitle: true,
    description:
      'Xem bảng giá Gcalls cho Webphone SME, tích hợp CRM/Helpdesk, tổng đài quốc tế, Gcalls CX và giải pháp AI theo nhu cầu doanh nghiệp.',
  },
  [ROUTES.costEstimator]: {
    title: 'Ước tính chi phí',
    description:
      'Chọn giải pháp, nhập nhu cầu sử dụng và nhận ước tính chi phí tổng đài Gcalls cho doanh nghiệp của bạn.',
  },
}

export function getPageMeta(path: string): PageMeta {
  return (
    PAGE_META[path as RoutePath] ?? {
      title: 'Không tìm thấy trang',
      description: 'Trang bạn tìm không tồn tại.',
    }
  )
}

export function buildTitle(meta: PageMeta): string {
  return meta.isHome || meta.exactTitle
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`
}

export function buildCanonical(path: string): string {
  return `${SITE_ORIGIN}${path}`
}
