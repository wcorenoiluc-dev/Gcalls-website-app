import { ArrowDown, Link2, PhoneCall, Ticket, User } from 'lucide-react'

/**
 * Helpdesk integration — conceptual visuals.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * The repository holds no real or sanitized Gcalls Helpdesk integration
 * screenshots, so these are conceptual surfaces built from the design system.
 * Replace them with authentic screenshots when available — this file is the
 * single swap point.
 *
 * RULES THESE FOLLOW (S02 §24 — "DO NOT CREATE FAKE TICKET UI"):
 *  - NO third-party product interface is imitated. Nothing here resembles or
 *    is branded as Zendesk, Freshdesk or any other Helpdesk vendor, and no
 *    vendor name, logo or colour appears.
 *  - The support record is deliberately ABSTRACT: a neutral, unbranded panel
 *    labelled "Hồ sơ hỗ trợ", drawn in Gcalls' own design language. It depicts
 *    the *concept* of a linked support record, not a product's screen.
 *  - The composition is the approved shape: Gcalls call panel → integration
 *    layer → abstract support record.
 *  - Only evidenced behaviour is depicted — linking a call to an existing
 *    record and carrying interaction history. No ticket is shown being
 *    created, because automatic ticket creation is not verified.
 *  - No real PII. The contact is a masked identifier ("KH #2318"), the agent a
 *    role label ("Agent 04"), and the record id a neutral placeholder.
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
        <span className="text-[13px] font-bold tracking-wide">GCALLS · CUỘC GỌI ĐẾN</span>
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-[13px] font-extrabold text-brand"
          aria-hidden="true"
        >
          KH
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-foreground">KH #2318</p>
          <p className="truncate text-[13px] text-muted-foreground">
            Đang kết nối · Agent 04
          </p>
        </div>
      </div>
    </div>
  )
}

/** The integration layer itself — the subject of this page. */
function IntegrationLayer() {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <ArrowDown size={15} className="text-muted-foreground/50" aria-hidden="true" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-light px-3.5 py-1.5 text-[13px] font-bold text-brand">
        <Link2 size={13} aria-hidden="true" />
        Lớp tích hợp Gcalls
      </span>
      <ArrowDown size={15} className="text-muted-foreground/50" aria-hidden="true" />
    </div>
  )
}

/**
 * Abstract support record.
 *
 * Intentionally generic and unbranded — this is a concept diagram of "a
 * support record the call is linked to", NOT a mockup of any vendor's ticket
 * screen.
 */
function SupportRecord() {
  const history = [
    { icon: PhoneCall, label: 'Cuộc gọi đến', meta: 'Hôm nay' },
    { icon: Ticket, label: 'Yêu cầu hỗ trợ đang xử lý', meta: 'Đang mở' },
    { icon: User, label: 'Tương tác trước đó', meta: '2 lần' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide text-muted-foreground">
          <Ticket size={13} className="text-brand" aria-hidden="true" />
          HỒ SƠ HỖ TRỢ
        </span>
        <span className="shrink-0 rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-bold text-brand">
          Đã liên kết
        </span>
      </div>

      <ul className="flex flex-col gap-2 px-4 py-4">
        {history.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2.5 rounded-[10px] border border-brand-border/70 px-3 py-2.5"
          >
            <row.icon size={14} className="shrink-0 text-brand" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[14px] text-foreground">
              {row.label}
            </span>
            <span className="shrink-0 text-[12px] text-muted-foreground">{row.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Call → integration layer → abstract support record. */
export function HelpdeskFlowMockup() {
  return (
    <div className="flex w-full flex-col">
      <CallPanel />
      <IntegrationLayer />
      <SupportRecord />
    </div>
  )
}

/** Support context surface, used beside the Support Context section. */
export function SupportContextMockup() {
  const rows = [
    { label: 'Khách hàng', value: 'KH #2318' },
    { label: 'Ticket đang xử lý', value: 'Đang mở' },
    { label: 'Ticket trước đó', value: '2' },
    { label: 'Tương tác gần đây', value: 'Cuộc gọi · Hôm nay' },
    { label: 'Trạng thái', value: 'Chờ phản hồi' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-3">
        <User size={14} className="text-brand" aria-hidden="true" />
        <span className="text-[13px] font-bold tracking-wide text-muted-foreground">
          CONTEXT HỖ TRỢ
        </span>
      </div>

      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-brand-border/60 px-4 py-3 last:border-b-0"
          >
            <dt className="min-w-0 truncate text-[14px] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="shrink-0 text-[14px] font-semibold text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
