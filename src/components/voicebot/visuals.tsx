import { Clock, PhoneCall, Repeat, UserCheck } from 'lucide-react'

/**
 * Voicebot AI illustrative product UI.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER — AND READ THIS FIRST
 * ---------------------------------------------------------------------------
 * This repository holds NO Voicebot screenshot, sanitized or otherwise. These
 * are conceptual surfaces built from the design system, not a picture of a
 * running product. Both are rendered inside `ProductVisual` with an explicit
 * "Minh họa giao diện" caption so no reader can mistake them for a live Gcalls
 * console. This file is the single swap point once real screenshots exist.
 *
 * RULES THESE MOCKUPS FOLLOW (WEB-PRO-004 §5, §6):
 *  - They depict ONLY what the approved copy already says: chiến dịch cuộc
 *    gọi, trạng thái kết nối, kết quả phản hồi, nhóm cần chuyển nhân viên,
 *    lịch sử tương tác. No capability is invented for the sake of a visual.
 *  - No concurrency figure, no accuracy figure, no language count, no SLA, no
 *    saving — every one of those is on the unverified list.
 *  - No real PII and no fabricated customer names. Contacts are masked IDs.
 * ---------------------------------------------------------------------------
 */

const SHELL =
  'w-full overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-[0_18px_50px_rgba(103,58,183,0.13)]'

/** Window chrome shared by every mockup, matching the other product pages. */
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

/**
 * Campaign console — the hero visual.
 *
 * Shows a campaign, connection status, response outcomes, the group that needs
 * a human, and a short interaction history. Nothing else.
 */
export function VoicebotCampaignMockup() {
  const tiles = [
    { label: 'Trong danh sách', value: '480' },
    { label: 'Đã gọi', value: '312' },
    { label: 'Đã kết nối', value: '198' },
    { label: 'Cần nhân viên', value: '24' },
  ]

  const outcomes = [
    { label: 'Xác nhận lịch hẹn', share: 46, tone: 'brand' as const },
    { label: 'Đề nghị gọi lại', share: 27, tone: 'brand' as const },
    { label: 'Cần nhân viên hỗ trợ', share: 15, tone: 'amber' as const },
    { label: 'Không kết nối', share: 12, tone: 'muted' as const },
  ]

  const history = [
    { id: 'LH-2481', at: '09:12', status: 'Đã xác nhận' },
    { id: 'LH-2479', at: '09:08', status: 'Chuyển nhân viên' },
    { id: 'LH-2476', at: '09:03', status: 'Hẹn gọi lại' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Voicebot · Chiến dịch nhắc lịch hẹn" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <PhoneCall size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">
          Chiến dịch đang chạy
        </span>
        <span className="ml-auto rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
          Minh họa
        </span>
      </div>

      <div className="p-4">
        <ul className="grid grid-cols-2 gap-2.5">
          {tiles.map((t) => (
            <li
              key={t.label}
              className="rounded-[12px] border border-brand-border px-3 py-2.5"
            >
              <p className="text-lg font-extrabold leading-none tabular-nums text-brand">
                {t.value}
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {t.label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-[12px] border border-brand-border p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Kết quả phản hồi
          </p>

          <ul className="mt-3 flex flex-col gap-2.5">
            {outcomes.map((o) => (
              <li key={o.label}>
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-[12px] text-foreground">
                    {o.label}
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {o.share}%
                  </span>
                </div>
                {/* Track is full-width so the fill has a definite basis. */}
                <div
                  className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-light"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full rounded-full ${
                      o.tone === 'amber'
                        ? 'bg-amber-400'
                        : o.tone === 'muted'
                          ? 'bg-brand/25'
                          : 'bg-brand/80'
                    }`}
                    style={{ width: `${o.share}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-[12px] border border-brand-border p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
            <Clock size={12} aria-hidden="true" />
            Lịch sử tương tác
          </p>

          <ul className="mt-2.5 flex flex-col divide-y divide-brand-border">
            {history.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                <span className="shrink-0 text-[12px] font-bold tabular-nums text-brand">
                  {h.id}
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {h.at}
                </span>
                <span className="ml-auto min-w-0 truncate text-[11px] font-semibold text-foreground">
                  {h.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Handoff queue — calls the bot classified as needing a person.
 *
 * The point of the visual is the handoff, which is why the queue is the only
 * thing on screen: it is the section's argument in picture form.
 */
export function VoicebotHandoffMockup() {
  const rows = [
    { id: 'LH-2479', reason: 'Khách hỏi ngoài kịch bản', route: 'Tư vấn' },
    { id: 'LH-2465', reason: 'Đề nghị thương lượng điều khoản', route: 'Tư vấn' },
    { id: 'LH-2452', reason: 'Phản hồi cần xử lý riêng', route: 'CSKH' },
    { id: 'LH-2440', reason: 'Yêu cầu gặp nhân viên', route: 'CSKH' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Phân luồng · Cần nhân viên xử lý" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <UserCheck size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">
          Cuộc gọi chuyển sang đội ngũ
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">Minh họa</span>
      </div>

      <ul className="flex flex-col divide-y divide-brand-border">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
            <span className="shrink-0 text-[12px] font-bold tabular-nums text-brand">
              {r.id}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
              {r.reason}
            </span>
            <span className="shrink-0 rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
              {r.route}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-t border-brand-border px-4 py-2.5">
        <Repeat size={13} className="text-brand" aria-hidden="true" />
        <span className="text-[11px] leading-snug text-muted-foreground">
          Điều kiện chuyển tiếp được thiết lập theo từng kịch bản.
        </span>
      </div>
    </div>
  )
}
