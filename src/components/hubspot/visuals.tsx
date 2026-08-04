import { Building2, History, Phone, User } from 'lucide-react'

/**
 * HubSpot integration — the CRM-side surface of the integration concept.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * No authentic or sanitized screenshot of the Gcalls extension running inside
 * HubSpot exists in this repository. Replace this with one when it is approved
 * and PII-masked — this file is the single swap point.
 *
 * RULES THIS FOLLOWS (INT-01 §18, §21, §30):
 *  - NO FAKE HUBSPOT UI. This does not imitate HubSpot's interface, navigation,
 *    typography or layout, and it carries NO HubSpot logo, wordmark or brand
 *    colour. The panel is labelled generically — "CRM RECORD" — precisely so it
 *    cannot be mistaken for a HubSpot screenshot. The page states the same
 *    thing in words directly under the visual.
 *  - The only thing depicted is the INTEGRATION POINT this page actually
 *    claims: a Click-to-Call control sitting next to a customer record. Every
 *    other surface on the page is the approved Gcalls-side product UI from
 *    `@/components/product-ui`.
 *  - NO PII. The contact is a masked identifier ("KH #2148") and a fictional
 *    company label; there is no real name, email, address or dialable number.
 *    The phone number is masked to its last two digits.
 *  - NO metric, score, count, percentage or price appears.
 * ---------------------------------------------------------------------------
 */

const PANEL =
  'w-full overflow-hidden rounded-[16px] border border-brand-border bg-white shadow-[0_14px_40px_rgba(103,58,183,0.11)]'

/**
 * Generic CRM record with a Click-to-Call control.
 *
 * Deliberately unbranded — see the rules above before adding any vendor mark.
 */
export function CrmRecordClickToCallMockup() {
  const rows = [
    { icon: User, label: 'Contact', value: 'KH #2148' },
    { icon: Building2, label: 'Company', value: 'Công ty mẫu' },
    { icon: History, label: 'Lần liên hệ gần nhất', value: 'Đã ghi nhận' },
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <span className="text-[13px] font-bold tracking-wide text-muted-foreground">
          CRM RECORD
        </span>
        <span className="shrink-0 rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-bold text-brand">
          Theo cấu hình
        </span>
      </div>

      <ul className="flex flex-col gap-2 px-4 pt-4">
        {rows.map((row) => (
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
        The integration point itself. Masked number — no dialable digits, and
        no vendor styling on the control.
      */}
      <div className="m-4 flex items-center gap-3 rounded-[12px] border border-brand/30 bg-brand-light/50 px-3 py-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            Số điện thoại
          </span>
          <span className="block truncate text-[15px] font-bold text-foreground">
            ••• ••• •48
          </span>
        </span>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] bg-brand px-3 py-2 text-[13px] font-bold text-white"
          aria-hidden="true"
        >
          <Phone size={13} />
          Click-to-Call
        </span>
      </div>
    </div>
  )
}
