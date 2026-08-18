/**
 * The approved blog CTA vocabulary — §I of the checkpoint.
 *
 * Ten entries, no more. An article references CTAs by `BlogCtaId`, so a CTA
 * outside this list cannot be authored, and every destination is a `RoutePath`
 * so a CTA cannot point at a route that does not exist.
 *
 * `Cloud Call Center` and `Liên hệ tư vấn` both resolve to `/lien-he/` because
 * there is no standalone cloud-call-center route on this site (see the PRODUCT
 * SCOPE note in `src/config/sitemap.ts`). They carry different lead `solution`
 * values so the two are still distinguishable in reporting.
 */

import { ROUTES } from '@/config/navigation'
import type { BlogCta, BlogCtaId } from './types'

export const BLOG_CTAS: Record<BlogCtaId, BlogCta> = {
  'gcalls-plus': {
    id: 'gcalls-plus',
    label: 'Gcalls Plus Webphone',
    action: 'Xem Gcalls Plus Webphone',
    path: ROUTES.gcallsPlus,
    detail:
      'Trang sản phẩm mô tả cách đội ngũ nghe gọi, quản lý danh bạ và ghi nhận lịch sử tương tác ngay trên trình duyệt.',
    lead: { intent: 'product_information', source: 'gcalls_plus', product: 'Gcalls Plus Webphone' },
  },
  'gcalls-cx': {
    id: 'gcalls-cx',
    label: 'Gcalls CX',
    action: 'Xem Gcalls CX',
    path: ROUTES.gcallsCx,
    detail:
      'Trang sản phẩm mô tả cách hợp nhất hội thoại từ nhiều kênh về một nơi làm việc chung cho đội chăm sóc khách hàng.',
    lead: { intent: 'product_information', source: 'gcalls_cx', product: 'Gcalls CX' },
  },
  'qa-qc-center': {
    id: 'qa-qc-center',
    label: 'QA/QC Center',
    action: 'Xem QA QC Center',
    path: ROUTES.qcCenter,
    detail:
      'Trang sản phẩm mô tả cách tổ chức hoạt động đánh giá chất lượng hội thoại và phần AI hỗ trợ người chấm điểm.',
    lead: { intent: 'product_information', source: 'qa_qc_center', product: 'QA QC Center' },
  },
  'crm-integration': {
    id: 'crm-integration',
    label: 'Tổng đài tích hợp CRM',
    action: 'Xem tổng đài tích hợp CRM',
    path: ROUTES.crmIntegration,
    detail:
      'Trang giải pháp mô tả phạm vi kết nối giữa hệ thống nghe gọi và CRM doanh nghiệp đang dùng.',
    lead: { intent: 'integration', source: 'crm_integration', solution: 'Tích hợp CRM' },
  },
  'helpdesk-integration': {
    id: 'helpdesk-integration',
    label: 'Tổng đài tích hợp Helpdesk',
    action: 'Xem tổng đài tích hợp Helpdesk',
    path: ROUTES.helpdeskIntegration,
    detail:
      'Trang giải pháp mô tả cách cuộc gọi gắn với ticket và lịch sử hỗ trợ trong hệ thống Helpdesk.',
    lead: { intent: 'integration', source: 'helpdesk_integration', solution: 'Tích hợp Helpdesk' },
  },
  international: {
    id: 'international',
    label: 'Tổng đài quốc tế',
    action: 'Xem tổng đài quốc tế',
    path: ROUTES.internationalCalling,
    detail:
      'Trang giải pháp mô tả cách tổ chức liên lạc với khách hàng ngoài Việt Nam và những yếu tố phụ thuộc quy định sở tại.',
    lead: { intent: 'consultation', source: 'international', solution: 'Tổng đài quốc tế' },
  },
  'cloud-call-center': {
    id: 'cloud-call-center',
    label: 'Cloud Call Center',
    action: 'Trao đổi về mô hình Cloud Call Center',
    path: ROUTES.contact,
    detail:
      'Mô tả hiện trạng hệ thống để Gcalls trao đổi về mô hình tổng đài đám mây phù hợp với quy mô đội ngũ.',
    lead: { intent: 'consultation', source: 'consultation', solution: 'Cloud Call Center' },
  },
  'voicebot-ai': {
    id: 'voicebot-ai',
    label: 'Giải pháp tích hợp Voicebot AI',
    action: 'Xem giải pháp Voicebot AI',
    path: ROUTES.voicebotAi,
    detail:
      'Trang giải pháp mô tả phạm vi Gcalls tư vấn, kết nối và tích hợp Voicebot vào luồng thoại sẵn có.',
    lead: { intent: 'integration', source: 'voicebot_ai', solution: 'Voicebot AI' },
  },
  consult: {
    id: 'consult',
    label: 'Liên hệ tư vấn',
    action: 'Đăng ký tư vấn vận hành',
    path: ROUTES.contact,
    detail:
      'Mô tả tình huống đội ngũ đang gặp để Gcalls trao đổi trực tiếp về phạm vi triển khai phù hợp.',
    lead: { intent: 'consultation', source: 'consultation', solution: 'Tư vấn vận hành' },
  },
  'cost-estimator': {
    id: 'cost-estimator',
    label: 'Công cụ ước tính chi phí',
    action: 'Mở công cụ ước tính chi phí',
    path: ROUTES.costEstimator,
    detail:
      'Công cụ giúp mô tả cấu hình đội ngũ và nhu cầu sử dụng trước khi trao đổi về báo giá.',
    lead: { intent: 'quote', source: 'cost_estimator', solution: 'Ước tính chi phí' },
  },
}

export const BLOG_CTA_IDS = Object.keys(BLOG_CTAS) as BlogCtaId[]
