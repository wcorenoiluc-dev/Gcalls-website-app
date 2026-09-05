import { Facebook, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'

/**
 * Gcalls CX — NEUTRAL LAYOUT DIAGRAMS.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE ARE DIAGRAMS, NOT SCREENSHOTS  (GCALLS_CX_MEDIA decision)
 * ---------------------------------------------------------------------------
 * The owner-supplied capture set (`CX V2-…zip`, 58 images) is screenshots of a
 * DIFFERENT product ("PitelCX — Contact Center Platform"): its branding sits in
 * both the chrome and inside chat content, and the captures are saturated with
 * personal data (customer names, phone numbers, emails, companies, debts,
 * customer IDs, agent leaderboards, KPI values). See
 * `docs/content-review/gcalls-cx-ui-v2/pii-branding-report.md`.
 *
 * Owner decision on that review: DO NOT publish or rebrand those captures.
 * Ship neutral layout diagrams instead. So this file draws the *shape* of each
 * surface from the design system and deliberately contains:
 *   - NO fabricated figures (no ticket IDs, no "47 open", no "312", no CSAT /
 *     FCR / SLA / percentages) — content slots are rendered as skeleton bars.
 *   - NO personal data and NO fabricated names or conversation text.
 *   - ONLY real, evidenced labels: the five verified channels and generic UI
 *     state chips (Chờ xử lý / Đang xử lý / Đã xong).
 * Every diagram is captioned "Giao diện minh họa" by `ProductVisual`, so a
 * reader can never mistake a slot for a Gcalls figure, a channel guarantee or a
 * customer outcome.
 *
 * This is the single swap point: if authentic, cleared Gcalls CX captures ever
 * exist, replace these diagrams here.
 * ---------------------------------------------------------------------------
 */

const SHELL =
  'w-full overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-[0_18px_50px_rgba(103,58,183,0.13)]'

/** The five verified channels, with their presentation tokens. */
const CHANNEL_STYLE = {
  voice: { icon: Phone, label: 'Voice', fg: '#673ab7', bg: '#f5f1fc' },
  zalo: { icon: MessageCircle, label: 'Zalo', fg: '#0891b2', bg: '#ecfeff' },
  facebook: { icon: Facebook, label: 'Facebook', fg: '#1d4ed8', bg: '#eff6ff' },
  sms: { icon: MessageSquare, label: 'SMS', fg: '#16a34a', bg: '#f0fdf4' },
  email: { icon: Mail, label: 'Email', fg: '#d97706', bg: '#fffbeb' },
} as const

type ChannelKey = keyof typeof CHANNEL_STYLE

function ChannelBadge({ channel }: { channel: ChannelKey }) {
  const c = CHANNEL_STYLE[channel]
  const Icon = c.icon
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ color: c.fg, background: c.bg }}
    >
      <Icon size={10} aria-hidden="true" />
      {c.label}
    </span>
  )
}

/**
 * Skeleton content slot — a neutral placeholder bar standing in for text that a
 * real deployment would render. Carries no information, so nothing here can be
 * read as data. `w` is a Tailwind width class.
 */
function Bar({ w = 'w-full', className = '' }: { w?: string; className?: string }) {
  return (
    <span
      className={`block h-2 rounded-full bg-brand-light ${w} ${className}`}
      aria-hidden="true"
    />
  )
}

function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-brand px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/25" />
        ))}
      </div>
      <span className="ml-1 text-xs font-medium text-white/80">{label}</span>
    </div>
  )
}

/** Neutral state chips — generic UI states, not metrics. */
const STATES = ['Chờ xử lý', 'Đang xử lý', 'Đã xong'] as const
function StateChip({ state }: { state: (typeof STATES)[number] }) {
  const warn = state === 'Chờ xử lý'
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        warn ? 'bg-amber-50 text-amber-700' : 'bg-brand-light text-brand'
      }`}
    >
      {state}
    </span>
  )
}

/**
 * Omnichannel inbox — the *layout* of a unified conversation list: a channel
 * filter, then rows that each carry a channel and a handling state. Row content
 * is skeletoned; no identifiers, previews or counts.
 */
export function InboxDiagram() {
  const rows: Array<{ channel: ChannelKey; state: (typeof STATES)[number]; w: string }> = [
    { channel: 'zalo', state: 'Chờ xử lý', w: 'w-3/4' },
    { channel: 'voice', state: 'Đang xử lý', w: 'w-2/3' },
    { channel: 'facebook', state: 'Đang xử lý', w: 'w-4/5' },
    { channel: 'email', state: 'Đã xong', w: 'w-1/2' },
    { channel: 'sms', state: 'Đã xong', w: 'w-3/5' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Omnichannel Inbox" />

      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-brand-border px-4 py-2.5">
        <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold text-white">
          Tất cả
        </span>
        {(Object.keys(CHANNEL_STYLE) as ChannelKey[]).map((k) => (
          <ChannelBadge key={k} channel={k} />
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-brand-border">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3.5">
            <span
              className="h-8 w-8 shrink-0 rounded-full bg-brand-light"
              aria-hidden="true"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <ChannelBadge channel={r.channel} />
                <Bar w="w-20" />
              </div>
              <Bar w={r.w} className="!h-1.5" />
            </div>
            <StateChip state={r.state} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Ticket panel — the layout of a ticket: a state + channel + owner header, a
 * subject/description block, and an activity trail of workflow stages. No
 * ticket number, no timestamps, no names.
 */
export function TicketDiagram() {
  const stages = ['Tiếp nhận', 'Phân công', 'Đang xử lý', 'Phản hồi']

  return (
    <div className={SHELL}>
      <Chrome label="Ticket" />

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StateChip state="Đang xử lý" />
          <ChannelBadge channel="zalo" />
          <span className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Phụ trách</span>
            <span className="h-5 w-5 rounded-full bg-brand-light" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Bar w="w-2/3" className="!h-2.5" />
          <Bar w="w-full !h-1.5" />
          <Bar w="w-5/6 !h-1.5" />
        </div>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-brand">
          Lịch sử xử lý
        </p>
        <ul className="mt-3 flex flex-col gap-3 border-t border-brand-border pt-3">
          {stages.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  i < 3 ? 'bg-brand' : 'bg-brand-light'
                }`}
                aria-hidden="true"
              />
              <span className="text-[12px] leading-snug text-foreground">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * Customer context — the layout of a profile: identity block, channels touched,
 * a recent-interaction list and a related-ticket slot. Identity, interaction
 * text and dates are skeletoned; no personal data of any kind.
 */
export function CustomerContextDiagram() {
  const recent: ChannelKey[] = ['zalo', 'voice', 'email']

  return (
    <div className={SHELL}>
      <Chrome label="Customer Context" />

      <div className="p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-[13px] font-extrabold text-brand"
            aria-hidden="true"
          >
            KH
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Bar w="w-1/2" className="!h-2.5" />
            <Bar w="w-2/3 !h-1.5" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {recent.map((c) => (
            <ChannelBadge key={c} channel={c} />
          ))}
        </div>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-brand">
          Tương tác gần đây
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {recent.map((c, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-[10px] border border-brand-border px-3 py-2.5"
            >
              <ChannelBadge channel={c} />
              <Bar w="min-w-0 flex-1" className="!h-1.5" />
              <span className="h-3 w-10 shrink-0 rounded-full bg-brand-light" aria-hidden="true" />
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-[10px] bg-brand-light px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
            Ticket liên quan
          </p>
          <div className="mt-1.5">
            <Bar w="w-3/5" className="!bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Operational reporting — a NEUTRAL dashboard diagram. It shows the *categories*
 * a report groups by (from CX_REPORTING: conversation volume, ticket status,
 * channel distribution, team workload) with skeleton content in place of every
 * figure. No numbers, no percentages, no KPI values are drawn — the layout
 * communicates "operational reporting exists", not any result.
 */
export function ReportingDiagram() {
  return (
    <div className={SHELL}>
      <Chrome label="Báo cáo vận hành" />

      <div className="p-4">
        <ul className="grid grid-cols-2 gap-2.5">
          {['Khối lượng hội thoại', 'Ticket đang mở'].map((label) => (
            <li
              key={label}
              className="rounded-[12px] border border-brand-border px-3 py-2.5"
            >
              <Bar w="w-10" className="!h-4" />
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{label}</p>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-[12px] border border-brand-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Trạng thái ticket
          </p>
          <ul className="mt-2.5 flex flex-col gap-2.5">
            {STATES.map((label, i) => (
              <li key={label} className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
                  {label}
                </span>
                <Bar w={['w-1/2', 'w-4/5', 'w-3/5'][i]} className="!h-2.5" />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-[12px] border border-brand-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Phân bổ theo kênh
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {(Object.keys(CHANNEL_STYLE) as ChannelKey[]).map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0">
                  <ChannelBadge channel={c} />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
