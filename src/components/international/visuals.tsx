import { ArrowDownLeft, ArrowUpRight, Globe, PhoneCall, Users } from 'lucide-react'

/**
 * International calling — conceptual visuals.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * The repository holds no real or sanitized screenshots of Gcalls'
 * international number management, so these are conceptual surfaces built from
 * the design system. Replace them with authentic screenshots when available —
 * this file is the single swap point.
 *
 * RULES THESE FOLLOW (S04 §M, §T, §B):
 *  - NO country is named, and NO flag, map, globe outline of a specific region
 *    or country code (+1, +44, +65 …) is drawn. Naming or depicting a country
 *    inside a product surface would read as a coverage claim, which §M forbids.
 *    Number slots are therefore abstract: "Thị trường 01", "Thị trường 02".
 *  - NO number type is claimed as available. The number-type row shows the
 *    category label with a "Tùy quốc gia" state, never an availability tick.
 *  - NO caller-ID / brandname display is depicted, and no digits are shown for
 *    any number (§B). Masked slots only.
 *  - NO rate, minute price, saving, uptime or SLA figure appears anywhere.
 *  - No third-party carrier or telecom product interface is imitated.
 *  - No real PII: contacts are masked identifiers, agents are role labels.
 * ---------------------------------------------------------------------------
 */

const PANEL =
  'w-full overflow-hidden rounded-[16px] border border-brand-border bg-white shadow-[0_14px_40px_rgba(103,58,183,0.11)]'

/**
 * Number-directory surface.
 *
 * Abstract market slots — no country, no flag, no dialling code, no digits.
 */
function NumberDirectoryPanel() {
  const rows = [
    { label: 'Thị trường 01', kind: 'Đầu số nội địa' },
    { label: 'Thị trường 02', kind: 'Đầu số toàn quốc' },
    { label: 'Thị trường 03', kind: 'Miễn phí cuộc gọi đến' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center gap-2 bg-brand px-4 py-2.5 text-white">
        <Globe size={14} aria-hidden="true" />
        <span className="text-[13px] font-bold tracking-wide">GCALLS · ĐẦU SỐ</span>
      </div>

      <ul className="flex flex-col gap-2 px-4 py-4">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2.5 rounded-[10px] border border-brand-border/70 px-3 py-2.5"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-brand-light text-[11px] font-extrabold text-brand"
              aria-hidden="true"
            >
              ••
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-bold leading-snug text-foreground">
                {row.label}
              </span>
              <span className="block truncate text-[12px] text-muted-foreground">
                {row.kind}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-bold text-brand">
              Tùy quốc gia
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-brand-border/60 px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
        Loại đầu số khả dụng được xác nhận theo quy định từng thị trường.
      </p>
    </div>
  )
}

/** Gcalls-side call panel. Direction of the call only — no digits, no country. */
function CallRoutingPanel() {
  const rows = [
    { icon: ArrowDownLeft, label: 'Cuộc gọi đến', detail: 'Định tuyến theo cấu hình' },
    { icon: ArrowUpRight, label: 'Cuộc gọi ra', detail: 'Chọn đầu số theo cấu hình' },
    { icon: Users, label: 'Đội ngũ phụ trách', detail: 'Phân công theo nhóm' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-muted-foreground">
          <PhoneCall size={13} className="text-brand" aria-hidden="true" />
          LUỒNG GỌI
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
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-bold leading-snug text-foreground">
                {row.label}
              </span>
              <span className="block truncate text-[12px] text-muted-foreground">
                {row.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Number directory + call routing, stacked. Used by the hero. */
export function InternationalNumbersMockup() {
  return (
    <div className="flex w-full flex-col gap-3">
      <NumberDirectoryPanel />
      <CallRoutingPanel />
    </div>
  )
}

/** Standalone routing surface for the inbound / outbound sections. */
export function CallRoutingMockup() {
  return <CallRoutingPanel />
}

/** Standalone number-directory surface for the operations section. */
export function NumberDirectoryMockup() {
  return <NumberDirectoryPanel />
}
