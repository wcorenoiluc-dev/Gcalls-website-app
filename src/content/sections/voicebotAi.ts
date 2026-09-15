import { ROUTES } from '@/config/navigation'
import {
  VB_CAPABILITIES,
  VB_DEPLOYMENT,
  VB_FAQ,
  VB_FAQ_SECTION,
  VB_FINAL_CTA,
  VB_HERO,
  VB_HOW_IT_WORKS,
  VB_HUMAN_AI,
  VB_INDUSTRIES,
  VB_INTEGRATION,
  VB_OUTCOMES,
  VB_PROBLEMS,
  VB_USE_CASES,
} from '@/data/voicebotAi'
import type { SectionDef } from '../types'

/**
 * `/voicebot-ai/` — every content section in page order; defaults reference
 * src/data/voicebotAi.ts. Technical keys (the use-case anchor id) are left
 * out of the editable object; mockup demo data lives in visuals.tsx and is
 * not content.
 */
export const VOICEBOT_ROUTE = ROUTES.voicebotAi

/** VB_USE_CASES without its anchor id (an in-page target, not copy). */
const { anchorId: _anchor, ...VB_USE_CASES_CONTENT } = VB_USE_CASES
void _anchor
export { VB_USE_CASES_CONTENT }

const ROUTE_HELP = 'Đường dẫn phải là route tồn tại trong routes.json.'

export const VOICEBOT_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: VB_HERO,
    fields: { 'secondaryCta.href': { label: 'Nút phụ · Liên kết', help: 'Neo trong trang (#…) hoặc route.' } } },
  { key: 'problems', label: 'Bài toán vận hành', previewSelector: 'section[aria-labelledby="bai-toan-van-hanh"]', defaults: VB_PROBLEMS,
    fields: { items: { type: 'cards', label: 'Các bài toán', item: { n: { label: 'Số thứ tự' } } } } },
  { key: 'useCases', label: 'Tình huống ứng dụng', previewSelector: 'section[aria-labelledby="tinh-huong-ung-dung-heading"]', defaults: VB_USE_CASES_CONTENT,
    fields: { items: { type: 'cards', label: 'Tình huống', item: { n: { label: 'Số thứ tự' } } } } },
  { key: 'howItWorks', label: 'Quy trình hoạt động', previewSelector: 'section[aria-labelledby="quy-trinh-hoat-dong"]', defaults: VB_HOW_IT_WORKS,
    fields: { steps: { type: 'cards', label: 'Các bước', item: { n: { label: 'Số thứ tự' } } } } },
  { key: 'capabilities', label: 'Khả năng giải pháp', previewSelector: 'section[aria-labelledby="kha-nang-giai-phap"]', defaults: VB_CAPABILITIES,
    fields: { points: { label: 'Các khả năng' }, note: { type: 'textarea', label: 'Ghi chú phạm vi' } } },
  { key: 'humanAi', label: 'Con người và AI', previewSelector: 'section[aria-labelledby="con-nguoi-va-ai"]', defaults: VB_HUMAN_AI,
    fields: { columns: { type: 'cards', label: 'Hai cột (Voicebot / Nhân viên)', help: 'Danh sách gạch đầu dòng trong mỗi cột giữ nguyên theo mặc định.' }, closing: { type: 'textarea', label: 'Câu kết' } } },
  { key: 'integration', label: 'Tích hợp vào quy trình', previewSelector: 'section[aria-labelledby="tich-hop-quy-trinh"]', defaults: VB_INTEGRATION,
    fields: {
      items: { type: 'cards', label: 'Hệ thống có thể khảo sát tích hợp' },
      links: { type: 'repeater', label: 'Liên kết sản phẩm liên quan', item: { path: { help: ROUTE_HELP } } },
      hubLinks: { type: 'repeater', label: 'Liên kết hub', item: { path: { help: ROUTE_HELP } } },
    } },
  { key: 'industries', label: 'Ngành phù hợp', previewSelector: 'section[aria-labelledby="nganh-phu-hop"]', defaults: VB_INDUSTRIES,
    fields: { items: { type: 'cards', label: 'Nhóm ngành', help: 'Liên kết ngành trong mỗi thẻ giữ nguyên theo mặc định.' } } },
  { key: 'deployment', label: 'Quy trình triển khai', previewSelector: 'section[aria-labelledby="quy-trinh-trien-khai"]', defaults: VB_DEPLOYMENT,
    fields: { steps: { type: 'cards', label: 'Các bước', item: { n: { label: 'Số thứ tự' } } } } },
  { key: 'outcomes', label: 'Giá trị đầu ra', previewSelector: 'section[aria-labelledby="gia-tri-dau-ra"]', defaults: VB_OUTCOMES,
    fields: { items: { type: 'cards', label: 'Giá trị' } } },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-voicebot"]', defaults: { ...VB_FAQ_SECTION, items: VB_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-voicebot"]', defaults: VB_FINAL_CTA,
    fields: { 'primaryCta.path': { help: ROUTE_HELP } } },
]
