import { ROUTES } from '@/config/navigation'
import {
  CX_BENEFITS,
  CX_BOUNDARIES,
  CX_CHANNELS,
  CX_CONTEXT,
  CX_DEPLOYMENT,
  CX_DIRECT_ANSWER,
  CX_FAQ,
  CX_FINAL_CTA,
  CX_HERO,
  CX_HOW_IT_WORKS,
  CX_INBOX,
  CX_INTEGRATION,
  CX_OVERVIEW,
  CX_PRICING,
  CX_PROBLEMS,
  CX_REPORTING,
  CX_TICKETS,
  CX_TRUST,
  CX_USE_CASES,
} from '@/data/gcallsCx'
import type { SectionDef } from '../types'

/** `/gcalls-cx/` — every section, in page order; defaults reference src/data/gcallsCx.ts. */
export const GCALLS_CX_ROUTE = ROUTES.gcallsCx

export const GCALLS_CX_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: CX_HERO },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: 'section[aria-labelledby="gcalls-cx-la-gi"]', defaults: CX_DIRECT_ANSWER },
  { key: 'problems', label: 'Bài toán đa kênh', previewSelector: 'section[aria-labelledby="bai-toan-da-kenh"]', defaults: CX_PROBLEMS, fields: { items: { type: 'cards' } } },
  { key: 'overview', label: 'Omnichannel workspace', previewSelector: 'section[aria-labelledby="omnichannel-workspace"]', defaults: CX_OVERVIEW },
  { key: 'channels', label: 'Điểm chạm', previewSelector: 'section[aria-labelledby="diem-cham"]', defaults: CX_CHANNELS, fields: { items: { type: 'cards' } } },
  { key: 'inbox', label: 'Omnichannel inbox', previewSelector: 'section[aria-labelledby="omnichannel-inbox"]', defaults: CX_INBOX },
  { key: 'tickets', label: 'Ticket workflow', previewSelector: 'section[aria-labelledby="ticket-workflow"]', defaults: CX_TICKETS },
  { key: 'context', label: 'Customer context', previewSelector: 'section[aria-labelledby="customer-context"]', defaults: CX_CONTEXT },
  { key: 'howItWorks', label: 'Cách hoạt động', previewSelector: 'section[aria-labelledby="cach-hoat-dong-heading"]', defaults: CX_HOW_IT_WORKS, fields: { steps: { type: 'cards' } } },
  { key: 'reporting', label: 'Báo cáo vận hành', previewSelector: 'section[aria-labelledby="bao-cao-van-hanh"]', defaults: CX_REPORTING },
  { key: 'benefits', label: 'Giá trị vận hành', previewSelector: 'section[aria-labelledby="gia-tri-van-hanh"]', defaults: CX_BENEFITS, fields: { items: { type: 'cards' } } },
  { key: 'useCases', label: 'Tình huống sử dụng', previewSelector: 'section[aria-labelledby="tinh-huong-su-dung"]', defaults: CX_USE_CASES, fields: { items: { type: 'cards' } } },
  { key: 'integration', label: 'Kết nối hệ thống', previewSelector: 'section[aria-labelledby="ket-noi-he-thong"]', defaults: CX_INTEGRATION },
  { key: 'boundaries', label: 'Chọn đúng giải pháp', previewSelector: 'section[aria-labelledby="chon-dung-giai-phap"]', defaults: CX_BOUNDARIES, fields: { items: { type: 'cards' } } },
  { key: 'deployment', label: 'Triển khai', previewSelector: 'section[aria-labelledby="trien-khai-cx"]', defaults: CX_DEPLOYMENT, fields: { steps: { type: 'cards' } } },
  { key: 'pricing', label: 'Cấu hình chi phí', previewSelector: 'section[aria-labelledby="cau-hinh-chi-phi-cx"]', defaults: CX_PRICING },
  { key: 'trust', label: 'Triển khai thực tế', previewSelector: 'section[aria-labelledby="trien-khai-thuc-te"]', defaults: CX_TRUST,
    fields: { 'cta.mobileLabel': { label: 'Nút demo · Nhãn rút gọn (mobile)', help: 'Hiển thị dưới 640px để nhãn luôn một dòng.' } } },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-gcalls-cx"]', defaults: { items: CX_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-gcalls-cx"]', defaults: CX_FINAL_CTA },
]
