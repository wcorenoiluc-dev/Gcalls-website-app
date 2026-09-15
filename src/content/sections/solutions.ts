import { ROUTES } from '@/config/navigation'
import { SOLUTIONS_HUB } from '@/data/hubs'
import type { SectionDef } from '../types'

/**
 * `/giai-phap/` — the solutions hub. Same skeleton as /san-pham/: HubLayout
 * renders one HubContent object; each part is its own editable section and
 * SolutionsHubPage merges the published overrides back into that object.
 */
export const SOLUTIONS_ROUTE = ROUTES.solutions

const SOLUTIONS_GUIDE = SOLUTIONS_HUB.decisionGuide
const ROUTE_HELP = 'Đường dẫn phải là route tồn tại trong routes.json.'

export const SOLUTIONS_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-h1"]`, defaults: SOLUTIONS_HUB.hero,
    fields: { 'secondaryCta.path': { label: 'Nút phụ · Liên kết', help: ROUTE_HELP } } },
  { key: 'directAnswer', label: 'Tổng quan (Direct answer)', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-answer"]`, defaults: SOLUTIONS_HUB.directAnswer },
  { key: 'cards', label: 'Bốn nhóm giải pháp', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-cards"]`, defaults: SOLUTIONS_HUB.cards,
    fields: {
      items: { type: 'cards', label: 'Giải pháp', help: 'Các điểm nhấn (points) trong mỗi thẻ giữ nguyên theo mặc định.', item: { path: { help: ROUTE_HELP }, cta: { type: 'ctaLabel', label: 'Nhãn nút' } } },
      note: { type: 'textarea', label: 'Ghi chú phạm vi' },
    } },
  ...(SOLUTIONS_GUIDE
    ? [{ key: 'decisionGuide', label: 'Bài toán → giải pháp', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-guide"]`, defaults: SOLUTIONS_GUIDE,
        fields: { rows: { type: 'cards' as const, label: 'Bài toán → hướng phù hợp', item: { path: { help: ROUTE_HELP } } }, note: { type: 'textarea' as const, label: 'Ghi chú' } } } satisfies SectionDef]
    : []),
  { key: 'links', label: 'Xem thêm', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-links"]`, defaults: SOLUTIONS_HUB.links,
    fields: { items: { type: 'repeater', label: 'Liên kết', item: { path: { help: ROUTE_HELP } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: `section[aria-labelledby="${SOLUTIONS_HUB.id}-cta"]`, defaults: SOLUTIONS_HUB.finalCta,
    fields: { 'primaryCta.path': { help: ROUTE_HELP }, 'secondaryCta.path': { help: ROUTE_HELP } } },
]
