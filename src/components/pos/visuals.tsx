import { History, PhoneCall, ShoppingBag, User } from 'lucide-react'

/**
 * POS integration — conceptual visuals.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * The repository holds no real or sanitized Gcalls POS integration
 * screenshots, so these are conceptual surfaces built from the design system.
 * Replace them with authentic screenshots when available — this file is the
 * single swap point.
 *
 * RULES THESE FOLLOW (S03 §28):
 *  - NO third-party product interface is imitated. Nothing here resembles or
 *    is branded as KiotViet, Sapo, Haravan, Pancake, Nhanh.vn or any other POS
 *    product. No vendor name, logo or colour appears anywhere — consistent
 *    with the §19 decision to publish no platform names at all.
 *  - The sales surface is deliberately ABSTRACT: a neutral, unbranded panel in
 *    Gcalls' own design language depicting the *concept* of sales context
 *    reaching the call, not any product's order-management screen.
 *  - NO specific order field is depicted. There is no order id, status, SKU,
 *    line item, quantity, payment method or purchase value anywhere, because
 *    none of those is evidenced (S03 §11). The panel shows data CATEGORIES
 *    with an explicit "theo cấu hình" qualifier instead.
 *  - No automatic incoming popup is depicted, and no Click-to-Call control is
 *    drawn — neither is verified for POS (§12, §13).
 *  - No real PII. The contact is a masked identifier ("KH #5074") and the
 *    agent a role label ("Agent 07").
 * ---------------------------------------------------------------------------
 */

const PANEL =
  'w-full overflow-hidden rounded-[16px] border border-brand-border bg-white shadow-[0_14px_40px_rgba(103,58,183,0.11)]'

/** Gcalls-side call panel — the only "product" surface shown. */
function CallPanel() {
  return (
    <div className={PANEL}>
      <div className="flex items-center gap-2 bg-brand px-4 py-2.5 text-white">
        <PhoneCall size={14} aria-hidden="true" />
        <span className="text-[13px] font-bold tracking-wide">GCALLS · CUỘC GỌI</span>
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-[13px] font-extrabold text-brand"
          aria-hidden="true"
        >
          KH
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-foreground">KH #5074</p>
          <p className="truncate text-[13px] text-muted-foreground">
            Đang trao đổi · Agent 07
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Abstract sales-context surface.
 *
 * Category labels only — deliberately no order id, status, SKU, amount or
 * payment detail, since no such field is evidenced.
 */
function SalesContextPanel() {
  const rows = [
    { icon: User, label: 'Hồ sơ khách hàng liên quan' },
    { icon: ShoppingBag, label: 'Dữ liệu bán hàng phù hợp' },
    { icon: History, label: 'Lịch sử tương tác' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-muted-foreground">
          <ShoppingBag size={13} className="text-brand" aria-hidden="true" />
          SALES CONTEXT
        </span>
        <span className="shrink-0 rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-bold text-brand">
          Theo cấu hình
        </span>
      </div>

      <ul className="flex flex-col gap-2 px-4 py-4">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2.5 rounded-[10px] border border-brand-border/70 px-3 py-2.5"
          >
            <row.icon size={14} className="shrink-0 text-brand" aria-hidden="true" />
            <span className="min-w-0 flex-1 text-[14px] leading-snug text-foreground">
              {row.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-brand-border/60 px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
        Trường dữ liệu cụ thể phụ thuộc vào hệ thống và API.
      </p>
    </div>
  )
}

/** Call panel + abstract sales context, stacked. */
export function PosContextMockup() {
  return (
    <div className="flex w-full flex-col gap-3">
      <CallPanel />
      <SalesContextPanel />
    </div>
  )
}

/** Standalone sales-context surface for the Sales Context section. */
export function SalesContextMockup() {
  return <SalesContextPanel />
}
