import { ArrowDown, MessageSquare, PhoneCall, Ticket, UserCog, Users } from 'lucide-react'

/**
 * Zendesk integration — conceptual visual.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * No current, approved Zendesk integration screenshot exists in this repository,
 * and §19 also requires verifying that any such screenshot reflects CURRENT
 * behaviour — which cannot be done here. No real or sanitized Gcalls-side
 * integration screenshot exists either. So §19 priority 3 applies. Replace this
 * with an authentic, PII-masked, current screenshot when one is approved — this
 * file is the single swap point.
 *
 * WHY A NEW VISUAL RATHER THAN REUSING THE HELPDESK PAIR.
 * INT-04 reused both `@/components/helpdesk/visuals` mockups for Freshdesk. Doing
 * the same twice would make this page read as the Freshdesk page with the vendor
 * renamed, which §1 forbids. This panel therefore depicts the angle that is
 * genuinely Zendesk's on this brief: HANDOVER CONTINUITY — §3 names loss of
 * conversation context when ownership changes as a core pain, and §17 use case 4
 * is an enterprise workflow where several agents work one request.
 *
 * RULES THIS FOLLOWS (INT-05 §19, §23, §28, §31):
 *  - NO FAKE ZENDESK UI. Nothing imitates Zendesk's interface, navigation,
 *    typography or layout, and there is NO Zendesk logo, wordmark or brand
 *    colour. The panel is labelled generically — "HỒ SƠ HỖ TRỢ" — so it cannot be
 *    mistaken for a Zendesk screenshot, and no branded ticket screen is drawn.
 *  - NOT used as proof of partnership. §23 publishes no partner, certification or
 *    marketplace claim, so no vendor mark appears.
 *  - It depicts ONLY what the gates verified: ticket/support-record CONTEXT and
 *    LINKING (gate D), and interaction history CATEGORIES (gate H, conditional).
 *    Both carry a visible "Theo cấu hình" qualifier.
 *  - NO ticket is shown being created (gates E, F) — the record already exists and
 *    is marked "Đã liên kết", never "Đã tạo".
 *  - NO status control, tag chip or disposition selector is drawn (gate J).
 *    Support status appears as a READ-ONLY context row only.
 *  - NO recording player (gate I) and NO SMS control — neither is verified for
 *    Zendesk.
 *  - NO embedded call box is drawn (gate B). The Gcalls call layer is a separate,
 *    explicitly Gcalls-labelled block, and the page captions it in words too.
 *  - NO PII. Agents are role labels ("Agent 02", "Agent 07") and the customer a
 *    masked identifier ("KH #4192"). No name, email, address or dialable number.
 *  - NO metric, count, score, percentage or price.
 * ---------------------------------------------------------------------------
 */

const PANEL =
  'w-full overflow-hidden rounded-[16px] border border-brand-border bg-white shadow-[0_14px_40px_rgba(103,58,183,0.11)]'

/**
 * Support handover: one request, several agents, one shared conversation context.
 *
 * The Gcalls calling layer sits at the top as its own labelled block, feeding an
 * abstract, already-existing support record. Read the rules above before adding
 * any status control, tag, recording or vendor mark.
 */
export function SupportHandoverMockup() {
  const context = [
    { icon: Users, label: 'Khách hàng', value: 'KH #4192' },
    { icon: Ticket, label: 'Ticket đang xử lý', value: 'Đang mở' },
    { icon: MessageSquare, label: 'Trạng thái hỗ trợ', value: 'Chờ phản hồi' },
  ]

  const handover = [
    { agent: 'Agent 02', note: 'Cuộc gọi trước đó' },
    { agent: 'Agent 07', note: 'Ghi chú nội bộ' },
  ]

  return (
    <div className="flex w-full flex-col">
      {/*
        Gate B — the Gcalls calling layer, as its OWN block. Deliberately not
        drawn inside the support record: no embedded Zendesk call box is claimed,
        and the page repeats that in words directly under this visual.
      */}
      <div className={PANEL}>
        <div className="flex items-center gap-2 bg-brand px-4 py-2.5 text-white">
          <PhoneCall size={14} aria-hidden="true" />
          <span className="text-[13px] font-bold tracking-wide">
            GCALLS · LỚP NGHE GỌI
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-[13px] font-extrabold text-brand"
            aria-hidden="true"
          >
            KH
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-foreground">KH #4192</p>
            <p className="truncate text-[13px] text-muted-foreground">
              Cuộc hội thoại do Gcalls xử lý
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-1">
        <ArrowDown size={15} className="text-muted-foreground/50" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-light px-3.5 py-1.5 text-[13px] font-bold text-brand">
          Lớp tích hợp Gcalls
        </span>
        <ArrowDown size={15} className="text-muted-foreground/50" aria-hidden="true" />
      </div>

      {/* Gate D — an ALREADY EXISTING support record the call is linked to. */}
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

        <ul className="flex flex-col gap-2 px-4 pt-4">
          {context.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2.5 rounded-[10px] border border-brand-border/70 px-3 py-2.5"
            >
              <row.icon size={14} className="shrink-0 text-brand" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
                {row.label}
              </span>
              <span className="shrink-0 text-[13px] font-bold text-foreground">
                {row.value}
              </span>
            </li>
          ))}
        </ul>

        {/*
          The handover thread — this page's distinctive angle. Interaction history
          as CATEGORIES attributed to role labels, so a later agent sees the same
          context. No timestamp, duration, recording or status control.
        */}
        <div className="m-4 rounded-[12px] border border-brand-border/70 bg-surface-alt px-3 py-3">
          <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            <UserCog size={12} className="text-brand" aria-hidden="true" />
            Bối cảnh khi chuyển người phụ trách
          </span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {handover.map((row) => (
              <li key={row.agent} className="flex items-center gap-2">
                <span className="shrink-0 rounded-full border border-brand-border bg-background px-2 py-0.5 text-[12px] font-bold text-brand">
                  {row.agent}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
                  {row.note}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[12px] font-semibold text-muted-foreground">
            Theo cấu hình tích hợp
          </p>
        </div>
      </div>
    </div>
  )
}
