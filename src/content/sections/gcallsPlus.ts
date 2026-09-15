import { ROUTES } from '@/config/navigation'
import {
  GP_BOUNDARIES,
  GP_CONTEXT,
  GP_DEPLOYMENT,
  GP_DIRECT_ANSWER,
  GP_FAQ,
  GP_FEATURES,
  GP_FINAL_CTA,
  GP_HERO,
  GP_HISTORY,
  GP_INTEGRATION,
  GP_OVERVIEW,
  GP_PERFORMANCE,
  GP_PRICING,
  GP_PROBLEMS,
  GP_STORY,
  GP_USE_CASES,
  GP_WORKFLOW,
} from '@/data/gcallsPlus'
import { TESTIMONIALS_CONTENT } from '@/data/testimonials'
import type { SectionDef } from '../types'

/**
 * `/gcalls-plus-webphone/` — every section, in page order. `defaults`
 * REFERENCE the locked data objects in src/data/gcallsPlus.ts; nothing is
 * copied. Keys match the `useGcallsContent(ROUTES.gcallsPlus, '<key>', …)`
 * calls in src/components/gcalls-plus/* and src/pages/GcallsPlusPage.tsx.
 */
export const GCALLS_PLUS_ROUTE = ROUTES.gcallsPlus

export const GCALLS_PLUS_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: GP_HERO,
    fields: { 'secondaryCta.href': { label: 'Nút phụ · Liên kết', help: 'Có thể dùng #anchor trên trang.' } } },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: 'section[aria-labelledby="gcalls-plus-la-gi"]', defaults: GP_DIRECT_ANSWER },
  { key: 'problems', label: 'Bài toán', previewSelector: 'section[aria-labelledby="bai-toan"]', defaults: GP_PROBLEMS, fields: { items: { type: 'cards' } } },
  { key: 'overview', label: 'Tổng quan Webphone', previewSelector: 'section[aria-labelledby="tong-quan-webphone"]', defaults: GP_OVERVIEW },
  { key: 'features', label: 'Tính năng', previewSelector: 'section[aria-labelledby="tinh-nang-heading"]', defaults: GP_FEATURES, fields: { items: { type: 'cards' } } },
  { key: 'history', label: 'Lịch sử tương tác', previewSelector: 'section[aria-labelledby="lich-su-tuong-tac"]', defaults: GP_HISTORY },
  { key: 'context', label: 'Customer context', previewSelector: 'section[aria-labelledby="ngu-canh-khach-hang"]', defaults: GP_CONTEXT },
  { key: 'workflow', label: 'Quy trình', previewSelector: 'section[aria-labelledby="quy-trinh"]', defaults: GP_WORKFLOW, fields: { steps: { type: 'cards' } } },
  { key: 'performance', label: 'Hiệu suất đội ngũ', previewSelector: 'section[aria-labelledby="hieu-suat-doi-ngu"]', defaults: GP_PERFORMANCE },
  { key: 'integration', label: 'Kết nối hệ thống', previewSelector: 'section[aria-labelledby="tich-hop-he-thong"]', defaults: GP_INTEGRATION },
  { key: 'useCases', label: 'Tình huống sử dụng', previewSelector: 'section[aria-labelledby="phu-hop-voi"]', defaults: GP_USE_CASES, fields: { items: { type: 'cards' } } },
  { key: 'boundaries', label: 'Phạm vi phù hợp', previewSelector: 'section[aria-labelledby="pham-vi-phu-hop"]', defaults: GP_BOUNDARIES },
  { key: 'deployment', label: 'Triển khai', previewSelector: 'section[aria-labelledby="trien-khai"]', defaults: GP_DEPLOYMENT, fields: { steps: { type: 'cards' } } },
  { key: 'pricing', label: 'Chi phí', previewSelector: 'section[aria-labelledby="chi-phi"]', defaults: GP_PRICING },
  { key: 'story', label: 'Khách hàng', previewSelector: 'section[aria-labelledby="cau-chuyen-khach-hang"]', defaults: GP_STORY },
  {
    key: 'testimonials',
    label: 'Testimonial khách hàng',
    previewSelector: 'section[aria-labelledby="cau-chuyen-khach-hang"]',
    defaults: TESTIMONIALS_CONTENT,
    fields: {
      items: {
        type: 'testimonials',
        label: 'Testimonial',
        help: 'Trích dẫn nguyên văn từ nguồn đã công bố; không thêm số liệu.',
        item: { id: { label: 'Mã (không đổi)' }, monogram: { label: 'Chữ cái đại diện', maxLen: 2 }, quote: { type: 'textarea', label: 'Trích dẫn' } },
      },
    },
  },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-gcalls-plus"]', defaults: { items: GP_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-gcalls-plus"]', defaults: GP_FINAL_CTA },
]
