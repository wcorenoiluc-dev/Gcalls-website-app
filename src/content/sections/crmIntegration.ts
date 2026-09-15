import { ROUTES } from '@/config/navigation'
import {
  CRM_BEFORE_AFTER,
  CRM_BOUNDARIES,
  CRM_CAPABILITIES,
  CRM_CONTEXT,
  CRM_DATA_SYNC,
  CRM_DEPLOYMENT,
  CRM_DIRECT_ANSWER,
  CRM_FAQ,
  CRM_FAQ_SECTION,
  CRM_FINAL_CTA,
  CRM_HERO,
  CRM_HOW_IT_WORKS,
  CRM_OVERVIEW,
  CRM_PLATFORMS,
  CRM_PLATFORM_NOTE,
  CRM_PLATFORM_SECTION,
  CRM_PRICING,
  CRM_PROBLEMS,
  CRM_SALES_USE_CASE,
  CRM_SERVICE_USE_CASE,
  CRM_TRUST,
} from '@/data/crmIntegration'
import type { SectionDef } from '../types'

/**
 * `/tong-dai-tich-hop-crm/` — every content section in page order; defaults
 * reference src/data/crmIntegration.ts. The Click-to-Call feature split reuses
 * capability 01 and is therefore edited through the "capabilities" section.
 */
export const CRM_ROUTE = ROUTES.crmIntegration

const { anchorId: _anchor, ...CRM_HOW_IT_WORKS_CONTENT } = CRM_HOW_IT_WORKS
void _anchor
export { CRM_HOW_IT_WORKS_CONTENT }

/** Platform grid: section header + note + the routed platform cards. */
export const CRM_PLATFORMS_CONTENT = {
  eyebrow: CRM_PLATFORM_SECTION.eyebrow,
  h2: CRM_PLATFORM_SECTION.h2,
  note: CRM_PLATFORM_NOTE,
  platforms: CRM_PLATFORMS,
}

const ROUTE_HELP = 'Đường dẫn phải là route tồn tại trong routes.json.'
const N = { n: { label: 'Số thứ tự' } }

export const CRM_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: CRM_HERO,
    fields: { valuePoints: { type: 'cards', label: 'Điểm giá trị' }, 'secondaryCta.href': { label: 'Nút phụ · Liên kết', help: 'Neo trong trang (#…) hoặc route.' } } },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: 'section[aria-labelledby="tong-dai-crm-la-gi"]', defaults: CRM_DIRECT_ANSWER },
  { key: 'problems', label: 'Bài toán vận hành', previewSelector: 'section[aria-labelledby="bai-toan-crm"]', defaults: CRM_PROBLEMS,
    fields: { items: { type: 'cards', label: 'Các bài toán', item: N } } },
  { key: 'overview', label: 'CRM + Calling (luồng cốt lõi)', previewSelector: 'section[aria-labelledby="tong-quan-crm"]', defaults: CRM_OVERVIEW,
    fields: { flow: { type: 'cards', label: 'Các bước trong luồng', item: { n: { label: 'Số thứ tự' }, label: { type: 'text', label: 'Tên bước' } } } } },
  { key: 'howItWorks', label: 'Cách tích hợp hoạt động', previewSelector: 'section[aria-labelledby="cach-hoat-dong-heading"]', defaults: CRM_HOW_IT_WORKS_CONTENT,
    fields: { steps: { type: 'cards', label: 'Các bước', item: N } } },
  { key: 'capabilities', label: 'Năng lực tích hợp', previewSelector: 'section[aria-labelledby="nang-luc-tich-hop"]', defaults: CRM_CAPABILITIES,
    fields: { items: { type: 'cards', label: 'Ba năng lực', help: 'Năng lực 01 cũng được dùng cho khối Click-to-Call bên dưới.', item: N } } },
  { key: 'beforeAfter', label: 'Trước & sau tích hợp', previewSelector: 'section[aria-labelledby="truoc-sau-tich-hop"]', defaults: CRM_BEFORE_AFTER,
    fields: { 'before.steps': { label: 'Trước · Các bước' }, 'after.steps': { label: 'Sau · Các bước' } } },
  { key: 'platforms', label: 'CRM ecosystem', previewSelector: 'section[aria-labelledby="he-sinh-thai-crm"]', defaults: CRM_PLATFORMS_CONTENT,
    fields: { note: { type: 'textarea', label: 'Ghi chú phạm vi' }, platforms: { type: 'cards', label: 'Nền tảng', item: { id: { label: 'Mã (giữ nguyên)' }, name: { label: 'Tên nền tảng' }, path: { help: ROUTE_HELP } } } } },
  { key: 'context', label: 'Customer context', previewSelector: 'section[aria-labelledby="customer-context"]', defaults: CRM_CONTEXT },
  { key: 'dataSync', label: 'Dữ liệu tương tác', previewSelector: 'section[aria-labelledby="dong-bo-du-lieu"]', defaults: CRM_DATA_SYNC },
  { key: 'salesUseCase', label: 'Use case · Sales', previewSelector: 'section[aria-labelledby="use-case-sales"]', defaults: CRM_SALES_USE_CASE },
  { key: 'serviceUseCase', label: 'Use case · Customer Service', previewSelector: 'section[aria-labelledby="use-case-cskh"]', defaults: CRM_SERVICE_USE_CASE },
  { key: 'boundaries', label: 'Chọn đúng luồng tích hợp', previewSelector: 'section[aria-labelledby="ranh-gioi-tich-hop"]', defaults: CRM_BOUNDARIES,
    fields: { items: { type: 'cards', label: 'Các luồng', item: { path: { help: ROUTE_HELP }, current: { label: 'Là trang hiện tại' } } }, 'related.links': { type: 'repeater', label: 'Luồng liên quan', item: { path: { help: ROUTE_HELP } } } } },
  { key: 'deployment', label: 'Triển khai', previewSelector: 'section[aria-labelledby="trien-khai-crm"]', defaults: CRM_DEPLOYMENT,
    fields: { steps: { type: 'cards', label: 'Các bước', item: N } } },
  { key: 'trust', label: 'Bối cảnh triển khai', previewSelector: 'section[aria-labelledby="boi-canh-trien-khai"]', defaults: CRM_TRUST,
    fields: { 'link.path': { help: ROUTE_HELP } } },
  { key: 'pricing', label: 'Cấu hình & chi phí', previewSelector: 'section[aria-labelledby="chi-phi-crm"]', defaults: CRM_PRICING },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-crm"]', defaults: { ...CRM_FAQ_SECTION, items: CRM_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-crm"]', defaults: CRM_FINAL_CTA,
    fields: { 'primaryCta.path': { help: ROUTE_HELP } } },
]
