import { ROUTES } from '@/config/navigation'
import { DEFAULT_HERO_CONTENT } from '@/components/home/HeroSection'
import {
  HOME_ANALYTICS,
  HOME_CALL_TIMELINE,
  HOME_CALL_WIDGET,
  HOME_CLOUD,
  HOME_CRM,
  HOME_CUSTOMER_POPUP,
  HOME_ECOSYSTEM,
  HOME_INTEGRATION_CTA,
  HOME_PAIN_POINTS,
  HOME_SOLUTION_BRIDGE,
  HOME_USE_CASES_FINAL_CTA,
  HOME_WORK_FROM_ANYWHERE,
} from '@/components/home/homeContent'
import type { SectionDef } from '../types'

/**
 * `/` — the thirteen homepage sections, in the approved order (see the
 * order note in src/pages/HomePage.tsx). Defaults REFERENCE the copy in
 * src/components/home/homeContent.ts and the hero's DEFAULT_HERO_CONTENT.
 * Mockup demo data (call logs, KPI tiles, agent rows) is deliberately not
 * editable — it is illustrative UI, not marketing copy.
 */
export const HOME_ROUTE = ROUTES.home

const IMAGE_HELP = 'Chọn ảnh từ Thư viện Media; ảnh có ý nghĩa cần alt, ảnh trang trí thì bật "decorative".'

export const HOME_SECTIONS: SectionDef[] = [
  {
    key: 'hero',
    label: 'Hero',
    previewSelector: 'section[aria-labelledby="home-hero-heading"]',
    defaults: DEFAULT_HERO_CONTENT,
    fields: {
      enabled: { label: 'Hiển thị section' },
      badgeText: { label: 'Nhãn (badge)', maxLen: 40 },
      heading: { label: 'Tiêu đề chính', maxLen: 160, required: true },
      headingHighlight: { label: 'Phần nhấn mạnh của tiêu đề', maxLen: 80 },
      description: { type: 'textarea', label: 'Mô tả', maxLen: 600 },
      primaryCtaLabel: { label: 'Nút chính · Nhãn', maxLen: 60 },
      primaryCtaUrl: { label: 'Nút chính · Liên kết' },
      secondaryCtaLabel: { label: 'Nút phụ · Nhãn', maxLen: 60 },
      secondaryCtaUrl: { label: 'Nút phụ · Liên kết' },
      checklist: { label: 'Checklist', maxItems: 6, maxLen: 100 },
      heroImage: { label: 'Ảnh hero', help: IMAGE_HELP },
      heroImageAlt: { type: 'imageAlt', label: 'Alt ảnh hero', maxLen: 160 },
      heroImageDecorative: { type: 'decorative', label: 'Ảnh hero chỉ trang trí' },
      disclaimerText: { label: 'Dòng lưu ý', maxLen: 220 },
    },
  },
  { key: 'painPoints', label: 'Nỗi đau doanh nghiệp', previewSelector: 'section[aria-labelledby="home-pain-points-heading"]', defaults: HOME_PAIN_POINTS,
    fields: { items: { type: 'cards', label: 'Sáu nỗi đau', maxItems: 6, help: 'Nội dung đã duyệt — không thêm số liệu.' } } },
  { key: 'solutionBridge', label: 'Giải pháp tổng đài Gcalls', previewSelector: 'section[aria-labelledby="home-solution-bridge-heading"]', defaults: HOME_SOLUTION_BRIDGE,
    fields: { chips: { label: 'Chip năng lực', maxItems: 4 } } },
  { key: 'ecosystem', label: 'Hệ sinh thái Gcalls', previewSelector: 'section[aria-labelledby="home-ecosystem-heading"]', defaults: HOME_ECOSYSTEM,
    fields: { products: { type: 'cards', label: 'Sản phẩm', maxItems: 3, help: 'Liên kết và biểu tượng cố định theo thứ tự thẻ.' }, solutions: { type: 'cards', label: 'Giải pháp', maxItems: 7 } } },
  { key: 'callTimeline', label: 'Hoạt động cuộc gọi realtime', previewSelector: 'main > section:nth-of-type(5)', defaults: HOME_CALL_TIMELINE },
  { key: 'crm', label: 'CRM mini tích hợp', previewSelector: 'main > section:nth-of-type(6)', defaults: HOME_CRM,
    fields: { useCases: { type: 'cards', label: 'Use case', maxItems: 3 } } },
  { key: 'analytics', label: 'Analytics & KPI dashboard', previewSelector: 'main > section:nth-of-type(7)', defaults: HOME_ANALYTICS,
    fields: { useCases: { type: 'cards', label: 'Dành cho', maxItems: 4 } } },
  { key: 'cloud', label: 'Cloud Call Center', previewSelector: 'main > section:nth-of-type(8)', defaults: HOME_CLOUD,
    fields: { gridItems: { type: 'cards', label: 'Tính năng Cloud PBX', maxItems: 8 }, flowSteps: { type: 'cards', label: 'Hành trình cuộc gọi', maxItems: 7 } } },
  { key: 'customerPopup', label: 'Customer popup', previewSelector: 'section[aria-labelledby="home-customer-popup-heading"]', defaults: HOME_CUSTOMER_POPUP },
  { key: 'callWidget', label: 'Call button widget & hệ sinh thái', previewSelector: 'section[aria-labelledby="home-call-widget-heading"]', defaults: HOME_CALL_WIDGET },
  { key: 'integrationCta', label: 'Integration CTA', previewSelector: 'section[aria-labelledby="home-integration-cta-heading"]', defaults: HOME_INTEGRATION_CTA,
    fields: { features: { type: 'cards', label: 'Năng lực tích hợp', maxItems: 6 } } },
  { key: 'workFromAnywhere', label: 'Work from anywhere', previewSelector: 'section[aria-labelledby="home-wfa-heading"]', defaults: HOME_WORK_FROM_ANYWHERE,
    fields: { features: { type: 'cards', maxItems: 4 }, statusBenefits: { type: 'cards', maxItems: 4 }, quickBenefits: { maxItems: 4 } } },
  { key: 'useCasesFinalCta', label: 'Use cases & CTA cuối trang', previewSelector: 'section[aria-labelledby="home-final-cta-heading"]', defaults: HOME_USE_CASES_FINAL_CTA,
    fields: { useCases: { type: 'cards', label: 'Use case', maxItems: 4 } } },
]
