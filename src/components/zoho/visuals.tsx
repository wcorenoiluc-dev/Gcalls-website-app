import { History, Layers, Phone, PhoneCall, Tag, User, Users } from 'lucide-react'

/**
 * Zoho CRM integration — conceptual visuals.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * No authentic or sanitized screenshot of Gcalls running inside Zoho CRM exists
 * in this repository. Replace these with one when it is approved and PII-masked —
 * this file is the single swap point.
 *
 * WHY THIS PAGE USES ITS OWN VISUALS RATHER THAN THE HOME CRM MOCKUP.
 * §17 priority 2 ("existing approved CRM visual") was tried first and rejected
 * on evidence grounds: the approved `CRMMockup` interaction list renders
 * "Ghi âm có sẵn", and `CallTimelineMockup` renders a recording player. Recording
 * is a real Gcalls product feature, but gate E (recording sync INTO Zoho) is
 * WITHHELD — and a recording row sitting inside a customer record on a Zoho page
 * invites precisely the inference that gate refuses. The same reasoning rules out
 * the incoming-popup surface under gate B. So this page falls through to §17
 * priority 3 and depicts only the verified set, exactly as S02 (Helpdesk) and S03
 * (POS) did with their own visuals files.
 *
 * RULES THIS FOLLOWS (INT-03 §17, §21, §25, §28):
 *  - NO FAKE ZOHO CRM UI. This does not imitate Zoho CRM's interface,
 *    navigation, typography or layout, and it carries NO Zoho logo, wordmark or
 *    brand colour. The panel is labelled generically — "CRM MODULE" — precisely
 *    so it cannot be mistaken for a Zoho screenshot, and the page states the
 *    same thing in words directly under the UI preview.
 *  - NO third-party logo is used as proof of partnership. §21 publishes no
 *    partner, certification or marketplace claim, so no vendor mark appears.
 *  - It depicts ONLY what the §10 gates verified: a customer record inside a CRM
 *    module, a Click-to-Call control (gate A, VERIFIED), and an activity trail
 *    (gate C, CONDITIONAL). Both conditional surfaces carry a visible
 *    "Theo cấu hình" qualifier.
 *  - NO automatic incoming popup is depicted — gate B is CONTEXT ONLY.
 *  - NO SMS control and NO recording player is depicted — gates D and E are
 *    WITHHELD, and drawing either would assert what the copy refuses to.
 *  - NO PII. The contact is a masked identifier ("KH #3061") and a fictional
 *    company label; there is no real name, email, address or dialable number.
 *    The phone number is masked to its last two digits.
 *  - NO metric, score, count, percentage or price appears.
 *
 * Deliberately DIFFERENT from `CrmRecordClickToCallMockup` (the HubSpot /
 * Salesforce panel) rather than a re-skin of it: this one is organised around a
 * MODULE plus an activity trail, which is the axis this page's copy uses
 * throughout ("module/record", §16 step 2, §21), where the Salesforce page uses
 * "object". A renamed clone would have been exactly the "page with renamed
 * labels" §2 forbids.
 * ---------------------------------------------------------------------------
 */

const PANEL =
  'w-full overflow-hidden rounded-[16px] border border-brand-border bg-white shadow-[0_14px_40px_rgba(103,58,183,0.11)]'

/**
 * Generic CRM module view with a customer record, a Click-to-Call control and an
 * activity trail. Deliberately unbranded — see the rules above before adding any
 * vendor mark.
 */
export function CrmModuleContextMockup() {
  const rows = [
    { icon: Layers, label: 'Module', value: 'Leads / Contacts' },
    { icon: User, label: 'Customer record', value: 'KH #3061' },
    { icon: History, label: 'Lịch sử tương tác', value: 'Đã liên kết' },
  ]

  const trail = ['Cuộc gọi ra', 'Ghi chú', 'Bước follow-up']

  return (
    <div className={PANEL}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <span className="text-[13px] font-bold tracking-wide text-muted-foreground">
          CRM MODULE
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
        Gate A — the Click-to-Call integration point. Masked number, no dialable
        digits, no vendor styling on the control.
      */}
      <div className="mx-4 mt-4 flex items-center gap-3 rounded-[12px] border border-brand/30 bg-brand-light/50 px-3 py-3">
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            Số điện thoại
          </span>
          <span className="block truncate text-[15px] font-bold text-foreground">
            ••• ••• •61
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

      {/*
        Gate C — the activity trail, as CATEGORIES only. No timestamp, duration,
        count, recording player or SMS entry, because none of those is evidenced.
      */}
      <div className="m-4 rounded-[12px] border border-brand-border/70 bg-surface-alt px-3 py-3">
        <span className="block text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
          Call activity
        </span>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {trail.map((item) => (
            <li
              key={item}
              className="rounded-full border border-brand-border bg-background px-2.5 py-1 text-[12px] font-semibold text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * Gcalls-side customer context reaching the agent during a call, plus the
 * interaction-history categories that can be written back.
 *
 * Depicts the verified set ONLY:
 *  - customer context (gate B, in the CONTEXT ONLY register — the agent is
 *    already on a call, nothing pops up on its own, and the panel is captioned
 *    "Theo cấu hình" rather than implying automatic display)
 *  - interaction history as CATEGORIES (gate C, CONDITIONAL ONLY)
 *
 * Deliberately absent: any recording row or player (gate E WITHHELD), any SMS
 * control or message (gate D WITHHELD), any incoming-call ring state (gate B),
 * and any duration, count, score, percentage or price.
 */
export function CustomerContextPanelMockup() {
  const context = [
    { icon: Users, label: 'Khách hàng', value: 'KH #3061' },
    { icon: Layers, label: 'Nguồn dữ liệu', value: 'CRM module' },
    { icon: Tag, label: 'Phân loại', value: 'Theo cấu hình' },
  ]

  const history = [
    'Cuộc gọi trước đó',
    'Ghi chú của đội ngũ',
    'Bước follow-up đang mở',
  ]

  return (
    <div className={PANEL}>
      <div className="flex items-center gap-2 bg-brand px-4 py-2.5 text-white">
        <PhoneCall size={14} aria-hidden="true" />
        <span className="text-[13px] font-bold tracking-wide">
          GCALLS · CUSTOMER CONTEXT
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

      <div className="m-4 rounded-[12px] border border-brand-border/70 bg-surface-alt px-3 py-3">
        <span className="block text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
          Lịch sử tương tác
        </span>
        <ul className="mt-2 flex flex-col gap-1.5">
          {history.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <History size={12} className="shrink-0 text-brand" aria-hidden="true" />
              <span className="text-[13px] text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
