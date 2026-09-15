import { ROUTES } from '@/config/navigation'
import { PRODUCTS_HUB } from '@/data/hubs'
import type { SectionDef } from '../types'

/**
 * `/san-pham/` — the product hub. The hub skeleton (hero · direct answer ·
 * cards · decision guide · links · final CTA) is rendered by HubLayout from
 * one HubContent object; each part is its own editable section here and
 * ProductsHubPage merges the published overrides back into that object.
 */
export const PRODUCTS_ROUTE = ROUTES.products

const PRODUCTS_GUIDE = PRODUCTS_HUB.decisionGuide

export const PRODUCTS_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-h1"]`, defaults: PRODUCTS_HUB.hero,
    fields: { 'secondaryCta.path': { label: 'Nút phụ · Liên kết' } } },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-answer"]`, defaults: PRODUCTS_HUB.directAnswer },
  { key: 'cards', label: 'Thẻ sản phẩm', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-cards"]`, defaults: PRODUCTS_HUB.cards,
    fields: { items: { type: 'cards', label: 'Sản phẩm', help: 'Đường dẫn phải là route tồn tại trong routes.json.' } } },
  ...(PRODUCTS_GUIDE
    ? [{ key: 'decisionGuide', label: 'Hướng dẫn lựa chọn', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-guide"]`, defaults: PRODUCTS_GUIDE,
        fields: { rows: { type: 'cards' as const, label: 'Bài toán → hướng phù hợp' } } } satisfies SectionDef]
    : []),
  { key: 'links', label: 'Liên kết tiếp theo', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-links"]`, defaults: PRODUCTS_HUB.links,
    fields: { items: { type: 'repeater', label: 'Liên kết' } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: `section[aria-labelledby="${PRODUCTS_HUB.id}-cta"]`, defaults: PRODUCTS_HUB.finalCta },
]
