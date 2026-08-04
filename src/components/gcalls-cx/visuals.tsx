import { Facebook, Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'

/**
 * Gcalls CX demo product UI.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * The repository holds no real or sanitized Gcalls CX screenshots. Rather than
 * repurpose an unrelated Gcalls mockup (which would misrepresent the product)
 * or use stock artwork, these are conceptual surfaces built from the design
 * system. Replace them with authentic screenshots when available — this file
 * is the single swap point.
 *
 * RULES THESE MOCKUPS FOLLOW (P03 §28):
 *  - They depict ONLY capabilities evidenced for Gcalls CX: the five verified
 *    channels, omnichannel inbox, ticket/workflow, customer context and
 *    operational reporting. Nothing is invented to fill a layout.
 *  - No real PII and no fabricated customer names. Contacts are masked
 *    identifiers ("KH #4821"); agents are role labels ("Agent 02").
 *  - Every figure is demo data, rendered inside `ProductVisual`, which prints
 *    the demo-data caption beneath it — so no number can read as a Gcalls
 *    result, a channel guarantee or a customer outcome.
 *  - Channel badges show only the five verified channels.
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

/** Omnichannel inbox — conversations from connected channels, with status. */
export function OmnichannelInboxMockup() {
  const rows: Array<{
    id: string
    channel: ChannelKey
    preview: string
    status: string
    warn?: boolean
  }> = [
    { id: 'KH #4821', channel: 'zalo', preview: 'Đơn của mình khi nào giao?', status: 'Chờ xử lý', warn: true },
    { id: 'KH #4817', channel: 'voice', preview: 'Cuộc gọi đến · 2:14', status: 'Đang xử lý' },
    { id: 'KH #4813', channel: 'facebook', preview: 'Shop còn size M không ạ?', status: 'Đang xử lý' },
    { id: 'KH #4809', channel: 'email', preview: 'Yêu cầu xuất hóa đơn', status: 'Đã xong' },
    { id: 'KH #4804', channel: 'sms', preview: 'Xác nhận lịch hẹn', status: 'Đã xong' },
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
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-foreground">{r.id}</span>
                <ChannelBadge channel={r.channel} />
              </div>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {r.preview}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                r.warn ? 'bg-amber-50 text-amber-700' : 'bg-brand-light text-brand'
              }`}
            >
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Ticket panel — status, assignee and history. */
export function TicketPanelMockup() {
  const history = [
    { at: '09:12', text: 'Tiếp nhận từ Zalo OA' },
    { at: '09:20', text: 'Phân công cho Agent 02' },
    { at: '10:05', text: 'Đã phản hồi khách hàng' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Ticket #T-2043" />

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            Đang xử lý
          </span>
          <ChannelBadge channel="zalo" />
          <span className="ml-auto text-[11px] text-muted-foreground">
            Phụ trách: Agent 02
          </span>
        </div>

        <p className="mt-3 text-[13px] font-bold text-foreground">
          Yêu cầu kiểm tra tình trạng đơn hàng
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Khách hàng liên hệ qua Zalo OA và cần cập nhật thời gian giao dự kiến.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5 border-t border-brand-border pt-3">
          {history.map((h) => (
            <li key={h.at} className="flex gap-3">
              <span className="w-10 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                {h.at}
              </span>
              <span className="text-[12px] leading-snug text-foreground">{h.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Customer context — profile, channel history, ticket history. */
export function CustomerContextMockup() {
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
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-foreground">KH #4821</p>
            <p className="text-[11px] text-muted-foreground">
              Khách hàng · 3 kênh đã tương tác
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <ChannelBadge channel="zalo" />
          <ChannelBadge channel="voice" />
          <ChannelBadge channel="email" />
        </div>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-brand">
          Tương tác gần đây
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {[
            { c: 'zalo' as ChannelKey, t: 'Hỏi tình trạng đơn hàng', d: 'Hôm nay' },
            { c: 'voice' as ChannelKey, t: 'Cuộc gọi đến · 2:14', d: 'Hôm qua' },
            { c: 'email' as ChannelKey, t: 'Yêu cầu xuất hóa đơn', d: '3 ngày trước' },
          ].map((i) => (
            <li
              key={i.t}
              className="flex items-center gap-2 rounded-[10px] border border-brand-border px-3 py-2"
            >
              <ChannelBadge channel={i.c} />
              <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
                {i.t}
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{i.d}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-[10px] bg-brand-light px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
            Ticket liên quan
          </p>
          <p className="mt-0.5 text-[12px] text-foreground">
            #T-2043 · Đang xử lý · Agent 02
          </p>
        </div>
      </div>
    </div>
  )
}

/** Operational reporting — workload, ticket status, channel distribution. */
export function CxReportingMockup() {
  const tiles = [
    { label: 'Hội thoại hôm nay', value: '312' },
    { label: 'Ticket đang mở', value: '47' },
  ]
  const statuses = [
    { label: 'Chờ xử lý', value: 12, tone: '#d97706' },
    { label: 'Đang xử lý', value: 21, tone: '#673ab7' },
    { label: 'Đã xong', value: 14, tone: '#16a34a' },
  ]
  const maxStatus = Math.max(...statuses.map((s) => s.value))
  const dist: Array<{ c: ChannelKey; pct: number }> = [
    { c: 'voice', pct: 34 },
    { c: 'zalo', pct: 28 },
    { c: 'facebook', pct: 19 },
    { c: 'email', pct: 12 },
    { c: 'sms', pct: 7 },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Báo cáo vận hành" />

      <div className="p-4">
        <ul className="grid grid-cols-2 gap-2.5">
          {tiles.map((t) => (
            <li
              key={t.label}
              className="rounded-[12px] border border-brand-border px-3 py-2.5"
            >
              <p className="text-lg font-extrabold tabular-nums leading-none text-brand">
                {t.value}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {t.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-[12px] border border-brand-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Trạng thái ticket
          </p>
          <ul className="mt-2.5 flex flex-col gap-2">
            {statuses.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 text-[11px] text-muted-foreground">
                  {s.label}
                </span>
                <span
                  className="h-2 rounded-full"
                  style={{
                    width: `${(s.value / maxStatus) * 62}%`,
                    background: s.tone,
                  }}
                  aria-hidden="true"
                />
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-foreground">
                  {s.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-[12px] border border-brand-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Phân bổ theo kênh
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {dist.map((d) => (
              <li key={d.c} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0">
                  <ChannelBadge channel={d.c} />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-light">
                  <span
                    className="block h-full rounded-full bg-brand/80"
                    style={{ width: `${d.pct}%` }}
                    aria-hidden="true"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
