import {
  ArrowLeftRight,
  Building2,
  Database,
  Globe,
  Headset,
  Mic,
  MicOff,
  NotebookPen,
  Pause,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Search,
  ShoppingCart,
  User,
  UserCircle2,
  Wifi,
} from 'lucide-react'
import type { GpMediaVariant } from '@/data/gcallsPlus'

/**
 * Code-native product mockups for /gcalls-plus-webphone/.
 *
 * ---------------------------------------------------------------------------
 * DEMO DATA ONLY
 * ---------------------------------------------------------------------------
 * Every name, number, company, note and timestamp below is a placeholder
 * ("Khách hàng A", "090x xxx 001", "Nhân viên A"). Nothing is a real person,
 * a real tenant, or a real Gcalls figure. No throughput, answer-rate or
 * revenue numbers are drawn — the page's claim-safety rules forbid quoting
 * them, so the mockups do not show any. These replace the masked captures
 * that could not ship (PII_BLOCKED, see vite.config.wordpress.ts) — nothing
 * here references an image file.
 *
 * Each mockup is fluid: it fills the ProductMediaFrame it is placed in and
 * uses `sm:` breakpoints internally so it stays legible at 390px instead of
 * shrinking into unreadable text.
 * ---------------------------------------------------------------------------
 */

const FONT = { fontFamily: "'Open Sans', sans-serif" } as const
const INK = '#1e2026'
const MUTED = '#5b5f6b'
const BRAND = '#673ab7'
const LINE = 'rgba(103,58,183,0.10)'

const SAMPLE_CONTACT = {
  name: 'Khách hàng A',
  phone: '090x xxx 001',
  company: 'Công ty Demo A',
  owner: 'Nhân viên A',
  stage: 'Đang chăm sóc',
}

const SAMPLE_CALLS = [
  { id: 1, dir: 'in', status: 'answered', when: 'Hôm nay · 09:14', length: '03:42', by: 'Nhân viên A' },
  { id: 2, dir: 'out', status: 'answered', when: 'Hôm qua · 15:20', length: '06:05', by: 'Nhân viên B' },
  { id: 3, dir: 'in', status: 'missed', when: '12/09 · 11:08', length: '—', by: '—' },
] as const

const SAMPLE_NOTES = [
  { id: 1, by: 'Nhân viên A', when: 'Hôm nay · 09:20', text: 'Khách hỏi về gói mở rộng, hẹn gọi lại thứ Năm.' },
  { id: 2, by: 'Nhân viên B', when: 'Hôm qua · 15:28', text: 'Đã gửi tài liệu hướng dẫn qua email.' },
] as const

const SAMPLE_CONTACT_LIST = [
  { id: 1, name: 'Khách hàng A', company: 'Công ty Demo A', active: true },
  { id: 2, name: 'Khách hàng B', company: 'Công ty Demo B', active: false },
  { id: 3, name: 'Khách hàng C', company: 'Công ty Demo C', active: false },
  { id: 4, name: 'Khách hàng D', company: 'Công ty Demo D', active: false },
] as const

/* ---------------------------------------------------------------------- */
/* Shared bits                                                             */
/* ---------------------------------------------------------------------- */

function BrowserChrome({ title }: { title: string }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 sm:px-4"
      style={{ background: BRAND }}
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
        <span className="ml-2 truncate text-[11px] font-medium tracking-wide text-white/85">{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Wifi size={12} color="rgba(255,255,255,0.75)" aria-hidden="true" />
        <span className="hidden text-[10px] text-white/75 sm:inline">SIP: Kết nối</span>
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      </div>
    </div>
  )
}

function StatusPill({
  tone,
  children,
}: {
  tone: 'live' | 'ok' | 'missed' | 'neutral'
  children: React.ReactNode
}) {
  const colours = {
    live: { bg: '#dcfce7', fg: '#15803d' },
    ok: { bg: '#ede8f9', fg: BRAND },
    missed: { bg: '#fee2e2', fg: '#b91c1c' },
    neutral: { bg: '#f3f4f6', fg: MUTED },
  }[tone]
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: colours.bg, color: colours.fg }}
    >
      {children}
    </span>
  )
}

function CallRow({ call }: { call: (typeof SAMPLE_CALLS)[number] }) {
  const missed = call.status === 'missed'
  const Icon = missed ? PhoneMissed : call.dir === 'in' ? PhoneIncoming : PhoneCall
  return (
    <li className="flex items-center gap-2.5 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: missed ? '#fee2e2' : '#f0ecf9' }}
      >
        <Icon size={12} color={missed ? '#b91c1c' : BRAND} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold" style={{ color: INK }}>
          {call.dir === 'in' ? 'Cuộc gọi đến' : 'Cuộc gọi đi'} · {call.by}
        </span>
        <span className="block text-[10px]" style={{ color: MUTED }}>
          {call.when}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <StatusPill tone={missed ? 'missed' : 'ok'}>{missed ? 'Gọi nhỡ' : 'Đã nghe'}</StatusPill>
        <span className="mt-0.5 block text-[10px]" style={{ color: MUTED }}>
          {call.length}
        </span>
      </span>
    </li>
  )
}

/* ---------------------------------------------------------------------- */
/* 1. Hero — webphone workspace inside a browser frame                     */
/* ---------------------------------------------------------------------- */

/**
 * The webphone as it sits in a browser tab: contact list (from `sm`),
 * the active contact with notes, and the call panel docked on the right.
 * The phone-shaped call panel lives INSIDE the frame, beside the workspace —
 * never floated over a placeholder.
 */
export function WebphoneWorkspaceMockup() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white" style={FONT}>
      <BrowserChrome title="Gcalls Plus Webphone" />

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_128px] sm:grid-cols-[132px_1fr_150px]">
        {/* Contact list — hidden at phone width so the two panels that matter stay legible. */}
        <aside
          className="hidden min-h-0 flex-col sm:flex"
          style={{ borderRight: `1px solid ${LINE}`, background: '#faf9fc' }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
            <Search size={11} color={BRAND} aria-hidden="true" />
            <span className="text-[10px]" style={{ color: MUTED }}>
              Tìm liên hệ
            </span>
          </div>
          <ul className="flex flex-col">
            {SAMPLE_CONTACT_LIST.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 px-2.5 py-2"
                style={{ background: c.active ? '#ede8f9' : 'transparent', borderBottom: `1px solid ${LINE}` }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: c.active ? BRAND : '#e5e0f2', color: c.active ? '#fff' : BRAND }}
                >
                  {c.name.slice(-1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10.5px] font-semibold" style={{ color: INK }}>
                    {c.name}
                  </span>
                  <span className="block truncate text-[9.5px]" style={{ color: MUTED }}>
                    {c.company}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Active contact + notes */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: BRAND }}
            >
              A
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-bold" style={{ color: INK }}>
                {SAMPLE_CONTACT.name}
              </span>
              <span className="block truncate text-[10px]" style={{ color: MUTED }}>
                {SAMPLE_CONTACT.phone} · {SAMPLE_CONTACT.company}
              </span>
            </span>
            <span className="hidden sm:inline-flex">
              <StatusPill tone="live">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Đang gọi
              </StatusPill>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 px-3 py-2 text-[10px]" style={{ borderBottom: `1px solid ${LINE}` }}>
            <span style={{ color: MUTED }}>
              Phụ trách: <b style={{ color: INK }}>{SAMPLE_CONTACT.owner}</b>
            </span>
            <span style={{ color: MUTED }}>
              Trạng thái: <b style={{ color: INK }}>{SAMPLE_CONTACT.stage}</b>
            </span>
          </div>

          <div className="px-3 pt-2">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
              <NotebookPen size={11} color={BRAND} aria-hidden="true" /> Ghi chú
            </span>
            <ul className="mt-1 flex flex-col gap-1.5">
              {SAMPLE_NOTES.map((n) => (
                <li key={n.id} className="rounded-lg px-2.5 py-1.5" style={{ background: '#faf9fc', border: `1px solid ${LINE}` }}>
                  <span className="block text-[10.5px] leading-snug" style={{ color: INK }}>
                    {n.text}
                  </span>
                  <span className="mt-0.5 block text-[9.5px]" style={{ color: MUTED }}>
                    {n.by} · {n.when}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto hidden px-3 pb-2 pt-2 sm:block">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
              <PhoneCall size={11} color={BRAND} aria-hidden="true" /> Lịch sử cuộc gọi
            </span>
            <ul className="mt-0.5">
              {SAMPLE_CALLS.slice(0, 2).map((c) => (
                <CallRow key={c.id} call={c} />
              ))}
            </ul>
          </div>
        </div>

        {/* Docked call panel — the "phone" */}
        <div
          className="flex min-h-0 flex-col items-center justify-between px-2.5 py-3 text-center"
          style={{ background: 'linear-gradient(180deg,#2a1b4d 0%,#3e2679 100%)' }}
        >
          <div>
            <span className="text-[9.5px] uppercase tracking-wider text-white/60">Cuộc gọi đến</span>
            <span className="mx-auto mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <User size={20} color="#fff" aria-hidden="true" />
            </span>
            <span className="mt-2 block text-[11.5px] font-bold text-white">{SAMPLE_CONTACT.name}</span>
            <span className="block text-[10px] text-white/70">{SAMPLE_CONTACT.phone}</span>
            <span className="mt-1.5 block text-[12px] font-semibold tabular-nums text-green-300">02:14</span>
          </div>

          <div className="grid w-full grid-cols-3 gap-1.5">
            {[
              { Icon: MicOff, label: 'Tắt mic' },
              { Icon: Pause, label: 'Giữ' },
              { Icon: ArrowLeftRight, label: 'Chuyển' },
            ].map(({ Icon, label }) => (
              <span key={label} className="flex flex-col items-center gap-0.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                  <Icon size={13} color="#fff" aria-hidden="true" />
                </span>
                <span className="text-[8.5px] text-white/75">{label}</span>
              </span>
            ))}
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: '#ef4444' }}>
            <PhoneOff size={16} color="#fff" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* 2. Customer context — profile, history, notes, owner, call status       */
/* ---------------------------------------------------------------------- */

export function CustomerContextMockup() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white" style={FONT}>
      <BrowserChrome title="Gcalls Plus — Hồ sơ liên hệ" />

      {/* Profile header */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-4" style={{ borderBottom: `1px solid ${LINE}` }}>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: BRAND }}
        >
          A
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold" style={{ color: INK }}>
            {SAMPLE_CONTACT.name}
          </span>
          <span className="block truncate text-[10.5px]" style={{ color: MUTED }}>
            {SAMPLE_CONTACT.phone} · {SAMPLE_CONTACT.company}
          </span>
        </span>
        <span className="flex flex-col items-end gap-1">
          <StatusPill tone="live">
            <Phone size={9} aria-hidden="true" /> Đang gọi · 02:14
          </StatusPill>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: MUTED }}>
            <UserCircle2 size={11} color={BRAND} aria-hidden="true" />
            Phụ trách: <b style={{ color: INK }}>{SAMPLE_CONTACT.owner}</b>
          </span>
        </span>
      </div>

      {/* Body: history + notes */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 px-3 py-3 sm:grid-cols-[1.15fr_1fr] sm:px-4">
        <section aria-label="Lịch sử cuộc gọi (dữ liệu mẫu)">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
            <PhoneCall size={11} color={BRAND} aria-hidden="true" /> Lịch sử cuộc gọi
          </span>
          <ul className="mt-1">
            {SAMPLE_CALLS.map((c) => (
              <CallRow key={c.id} call={c} />
            ))}
          </ul>
        </section>

        <section aria-label="Ghi chú (dữ liệu mẫu)" className="flex min-h-0 flex-col">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
            <NotebookPen size={11} color={BRAND} aria-hidden="true" /> Ghi chú
          </span>
          <ul className="mt-1 flex flex-col gap-1.5">
            {SAMPLE_NOTES.map((n) => (
              <li key={n.id} className="rounded-lg px-2.5 py-2" style={{ background: '#faf9fc', border: `1px solid ${LINE}` }}>
                <span className="block text-[10.5px] leading-snug" style={{ color: INK }}>
                  {n.text}
                </span>
                <span className="mt-0.5 block text-[9.5px]" style={{ color: MUTED }}>
                  {n.by} · {n.when}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="mt-2 hidden items-center gap-2 rounded-lg px-2.5 py-2 sm:flex"
            style={{ border: `1px dashed rgba(103,58,183,0.30)` }}
          >
            <Mic size={11} color={BRAND} aria-hidden="true" />
            <span className="text-[10px]" style={{ color: MUTED }}>
              Thêm ghi chú cho cuộc gọi này…
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* 3. Integration map — Gcalls Plus hub with CRM / Helpdesk / POS / SMS-Web */
/* ---------------------------------------------------------------------- */

const INTEGRATION_NODES = [
  { id: 'crm', label: 'CRM', sub: 'Hồ sơ & pipeline', Icon: Database, pos: 'top' },
  { id: 'helpdesk', label: 'Helpdesk', sub: 'Ticket & yêu cầu', Icon: Headset, pos: 'left' },
  { id: 'pos', label: 'POS', sub: 'Đơn hàng & giao dịch', Icon: ShoppingCart, pos: 'right' },
  { id: 'web', label: 'SMS / Web', sub: 'Tin nhắn & form', Icon: Globe, pos: 'bottom' },
] as const

/**
 * Hub-and-spoke diagram: Gcalls Plus at the centre, four system nodes around
 * it, with labelled flows. Built from a CSS grid plus an SVG spoke overlay
 * that scales with the frame — no third-party logo, no raster asset.
 */
export function IntegrationMapMockup() {
  const node = (n: (typeof INTEGRATION_NODES)[number]) => (
    <div
      key={n.id}
      className="flex w-full max-w-[150px] flex-col items-center rounded-xl bg-white px-2 py-2 text-center sm:max-w-[170px] sm:py-2.5"
      style={{ border: `1px solid ${LINE}`, boxShadow: '0 4px 14px rgba(31,17,71,0.08)' }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: '#ede8f9' }}>
        <n.Icon size={15} color={BRAND} aria-hidden="true" />
      </span>
      <span className="mt-1 text-[11px] font-bold sm:text-[12px]" style={{ color: INK }}>
        {n.label}
      </span>
      <span className="text-[9.5px] leading-tight sm:text-[10px]" style={{ color: MUTED }}>
        {n.sub}
      </span>
    </div>
  )
  const byPos = Object.fromEntries(INTEGRATION_NODES.map((n) => [n.pos, n])) as Record<
    (typeof INTEGRATION_NODES)[number]['pos'],
    (typeof INTEGRATION_NODES)[number]
  >

  return (
    <div className="relative h-full w-full rounded-xl" style={{ ...FONT, background: 'linear-gradient(180deg,#faf9fc 0%,#f5f1fc 100%)' }}>
      {/* Spokes, drawn in frame-relative coordinates so they scale with the box. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[
          [50, 22],
          [16, 46],
          [84, 46],
          [50, 70],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1="50"
            y1="46"
            x2={x}
            y2={y}
            stroke={BRAND}
            strokeOpacity="0.35"
            strokeWidth="0.6"
            strokeDasharray="1.6 1.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="relative grid h-full w-full grid-cols-3 grid-rows-[1fr_1fr_1fr_auto] items-center justify-items-center gap-1 p-2 sm:p-3">
        <span />
        {node(byPos.top)}
        <span />

        {node(byPos.left)}
        <div
          className="flex w-full max-w-[128px] flex-col items-center rounded-2xl px-2 py-2.5 text-center text-white sm:max-w-[150px] sm:py-3"
          style={{ background: BRAND, boxShadow: '0 12px 30px rgba(103,58,183,0.35)' }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Phone size={17} color="#fff" aria-hidden="true" />
          </span>
          <span className="mt-1 text-[11.5px] font-bold sm:text-[13px]">Gcalls Plus</span>
          <span className="text-[9.5px] text-white/80 sm:text-[10px]">Webphone</span>
        </div>
        {node(byPos.right)}

        <span />
        {node(byPos.bottom)}
        <span />

      {/* Flow legend — a normal grid row, never laid over a node */}
      <div className="col-span-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 pt-1">
        {[
          { Icon: ArrowLeftRight, text: 'Đồng bộ liên hệ' },
          { Icon: PhoneCall, text: 'Ghi nhận cuộc gọi' },
          { Icon: Building2, text: 'Mở hồ sơ khi có cuộc gọi' },
        ].map(({ Icon, text }) => (
          <span key={text} className="flex items-center gap-1 text-[9.5px] font-medium sm:text-[10px]" style={{ color: MUTED }}>
            <Icon size={10} color={BRAND} aria-hidden="true" />
            {text}
          </span>
        ))}
      </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */
/* Variant switch — the seam Content Studio will drive                     */
/* ---------------------------------------------------------------------- */

export function ProductInterfaceMockup({ variant }: { variant: Exclude<GpMediaVariant, `capture:${string}`> }) {
  switch (variant) {
    case 'webphone-workspace':
      return <WebphoneWorkspaceMockup />
    case 'customer-context':
      return <CustomerContextMockup />
    case 'integration-map':
      return <IntegrationMapMockup />
  }
}
