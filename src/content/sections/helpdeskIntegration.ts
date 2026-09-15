import { ROUTES } from '@/config/navigation'
import {
  HD_BEFORE_AFTER,
  HD_BOUNDARIES,
  HD_CAPABILITIES,
  HD_DEPLOYMENT,
  HD_DIRECT_ANSWER,
  HD_FAQ,
  HD_FAQ_SECTION,
  HD_FINAL_CTA,
  HD_HERO,
  HD_HOW_IT_WORKS,
  HD_OVERVIEW,
  HD_PLATFORMS,
  HD_PLATFORM_NOTE,
  HD_PLATFORM_SECTION,
  HD_PRICING,
  HD_PROBLEMS,
  HD_SUPPORT_CONTEXT,
  HD_TRUST,
  HD_USE_CASES,
} from '@/data/helpdeskIntegration'
import type { SectionDef } from '../types'

/**
 * `/tong-dai-tich-hop-helpdesk/` — every content section in page order;
 * defaults reference src/data/helpdeskIntegration.ts.
 */
export const HELPDESK_ROUTE = ROUTES.helpdeskIntegration

const { anchorId: _anchor, ...HD_HOW_IT_WORKS_CONTENT } = HD_HOW_IT_WORKS
void _anchor
export { HD_HOW_IT_WORKS_CONTENT }

export const HD_PLATFORMS_CONTENT = {
  eyebrow: HD_PLATFORM_SECTION.eyebrow,
  h2: HD_PLATFORM_SECTION.h2,
  note: HD_PLATFORM_NOTE,
  platforms: HD_PLATFORMS,
}

const ROUTE_HELP = 'Đường dẫn phải là route tồn tại trong routes.json.'
const N = { n: { label: 'Số thứ tự' } }

export const HELPDESK_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: HD_HERO,
    fields: { valuePoints: { type: 'cards', label: 'Điểm giá trị' }, 'secondaryCta.href': { label: 'Nút phụ · Liên kết', help: 'Neo trong trang (#…) hoặc route.' } } },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: 'section[aria-labelledby="helpdesk-la-gi"]', defaults: HD_DIRECT_ANSWER },
  { key: 'problems', label: 'Bài toán hỗ trợ khách hàng', previewSelector: 'section[aria-labelledby="bai-toan-helpdesk"]', defaults: HD_PROBLEMS,
    fields: { items: { type: 'cards', label: 'Các bài toán', item: N } } },
  { key: 'overview', label: 'Helpdesk + Calling (luồng cốt lõi)', previewSelector: 'section[aria-labelledby="tong-quan-helpdesk"]', defaults: HD_OVERVIEW,
    fields: { flow: { type: 'cards', label: 'Các bước trong luồng', item: { n: { label: 'Số thứ tự' }, label: { type: 'text', label: 'Tên bước' } } } } },
  { key: 'howItWorks', label: 'Cách tích hợp hoạt động', previewSelector: 'section[aria-labelledby="cach-hoat-dong-heading"]', defaults: HD_HOW_IT_WORKS_CONTENT,
    fields: { steps: { type: 'cards', label: 'Các bước', item: N } } },
  { key: 'capabilities', label: 'Năng lực tích hợp', previewSelector: 'section[aria-labelledby="nang-luc-helpdesk"]', defaults: HD_CAPABILITIES,
    fields: { items: { type: 'cards', label: 'Bốn năng lực', item: N } } },
  { key: 'supportContext', label: 'Support context', previewSelector: 'section[aria-labelledby="support-context"]', defaults: HD_SUPPORT_CONTEXT },
  { key: 'beforeAfter', label: 'Trước & sau tích hợp', previewSelector: 'section[aria-labelledby="truoc-sau-helpdesk"]', defaults: HD_BEFORE_AFTER,
    fields: { 'before.steps': { label: 'Trước · Các bước' }, 'after.steps': { label: 'Sau · Các bước' } } },
  { key: 'platforms', label: 'Helpdesk ecosystem', previewSelector: 'section[aria-labelledby="he-sinh-thai-helpdesk"]', defaults: HD_PLATFORMS_CONTENT,
    fields: { note: { type: 'textarea', label: 'Ghi chú phạm vi' }, platforms: { type: 'cards', label: 'Nền tảng', item: { id: { label: 'Mã (giữ nguyên)' }, name: { label: 'Tên nền tảng' }, path: { help: ROUTE_HELP } } } } },
  { key: 'useCases', label: 'Tình huống sử dụng', previewSelector: 'section[aria-labelledby="use-case-helpdesk"]', defaults: HD_USE_CASES,
    fields: { items: { type: 'cards', label: 'Tình huống', help: 'Liên kết ngành trong thẻ giữ nguyên theo mặc định.', item: N } } },
  { key: 'boundaries', label: 'Chọn đúng luồng tích hợp', previewSelector: 'section[aria-labelledby="ranh-gioi-helpdesk"]', defaults: HD_BOUNDARIES,
    fields: { items: { type: 'cards', label: 'Các luồng', item: { path: { help: ROUTE_HELP }, current: { label: 'Là trang hiện tại' } } }, 'related.links': { type: 'repeater', label: 'Luồng liên quan', item: { path: { help: ROUTE_HELP } } } } },
  { key: 'deployment', label: 'Triển khai', previewSelector: 'section[aria-labelledby="trien-khai-helpdesk"]', defaults: HD_DEPLOYMENT,
    fields: { steps: { type: 'cards', label: 'Các bước', item: N } } },
  { key: 'trust', label: 'Triển khai theo workflow thực tế', previewSelector: 'section[aria-labelledby="workflow-thuc-te"]', defaults: HD_TRUST,
    fields: { 'link.path': { help: ROUTE_HELP } } },
  { key: 'pricing', label: 'Cấu hình & chi phí', previewSelector: 'section[aria-labelledby="chi-phi-helpdesk"]', defaults: HD_PRICING },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-helpdesk"]', defaults: { ...HD_FAQ_SECTION, items: HD_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-helpdesk"]', defaults: HD_FINAL_CTA,
    fields: { 'primaryCta.path': { help: ROUTE_HELP } } },
]
