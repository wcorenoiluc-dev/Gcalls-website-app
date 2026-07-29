import { AlertTriangle, BarChart3, Check, FileText, Search, Sparkles } from 'lucide-react'

/**
 * QA QC Center demo product UI.
 *
 * ---------------------------------------------------------------------------
 * DEMO_VISUAL_REPLACE_LATER
 * ---------------------------------------------------------------------------
 * The project holds no real or sanitized QC Bot screenshots. Rather than reuse
 * an unrelated Gcalls mockup (which would misrepresent the product) or drop in
 * stock artwork, these are clean conceptual surfaces built from the design
 * system. Replace them with authentic screenshots when available — this file
 * is the single swap point.
 *
 * RULES THESE MOCKUPS FOLLOW (P02 §24):
 *  - They depict ONLY capabilities named in the approved copy: transcript,
 *    QA criteria, scoring, keyword signals, sentiment signals, flagged calls,
 *    quality dashboard. No capability is invented for the sake of a visual.
 *  - No real PII and no fabricated customer or agent names. Speakers are role
 *    labels ("Agent", "Khách hàng"); calls are IDs, not people.
 *  - Every number is demo data. Each is rendered inside `ProductVisual`, which
 *    prints the demo-data caption beneath it, so no figure can be read as a
 *    Gcalls result or a customer outcome.
 *  - Nothing here is a compliance verdict presented as real customer data;
 *    flags read as "cần xem lại", not as confirmed violations.
 * ---------------------------------------------------------------------------
 */

const SHELL =
  'w-full overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-[0_18px_50px_rgba(103,58,183,0.13)]'

/** Window chrome shared by every mockup. */
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
 * Transcript panel — Speech-to-Text output with one highlighted keyword.
 * Speakers are roles, never names.
 */
export function TranscriptMockup() {
  const turns = [
    { who: 'Agent', at: '00:04', text: 'Dạ em nghe, em có thể hỗ trợ mình thông tin gì ạ?' },
    { who: 'Khách hàng', at: '00:11', text: 'Tôi gọi lần thứ hai rồi mà vẫn chưa được xử lý.', flag: 'lặp lại liên hệ' },
    { who: 'Agent', at: '00:19', text: 'Em xin lỗi vì sự bất tiện này, em kiểm tra ngay giúp mình ạ.' },
    { who: 'Khách hàng', at: '00:31', text: 'Vậy bao lâu thì tôi nhận được phản hồi?' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Transcript · Cuộc gọi #A-1042" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <Search size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">Tìm trong transcript…</span>
        <span className="ml-auto rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
          Demo
        </span>
      </div>

      <ul className="flex flex-col gap-3 p-4">
        {turns.map((t) => (
          <li key={t.at} className="flex gap-3">
            <span className="w-11 shrink-0 pt-0.5 text-[11px] tabular-nums text-muted-foreground">
              {t.at}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                {t.who}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-foreground">
                {t.text}
              </p>
              {t.flag && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <AlertTriangle size={11} aria-hidden="true" />
                  Từ khóa: {t.flag}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** QA criteria + weights + an AI-assisted score awaiting human confirmation. */
export function ScoreCardMockup() {
  const criteria = [
    { label: 'Chào hỏi & xác minh', weight: '20%', met: true },
    { label: 'Tuân thủ kịch bản', weight: '30%', met: true },
    { label: 'Xử lý phản hồi', weight: '30%', met: false },
    { label: 'Kết thúc cuộc gọi', weight: '20%', met: true },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="QA Scoring" />

      <div className="p-4">
        <div className="flex items-center justify-between rounded-[12px] bg-brand-light px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
              Điểm đề xuất
            </p>
            <p className="text-[11px] text-muted-foreground">Chờ QA xác nhận</p>
          </div>
          <p className="text-2xl font-extrabold tabular-nums text-brand">78</p>
        </div>

        <ul className="mt-3 flex flex-col gap-2">
          {criteria.map((c) => (
            <li
              key={c.label}
              className="flex items-center gap-2.5 rounded-[10px] border border-brand-border px-3 py-2"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  c.met ? 'bg-brand-light' : 'bg-amber-50'
                }`}
                aria-hidden="true"
              >
                {c.met ? (
                  <Check size={11} className="text-brand" strokeWidth={3} />
                ) : (
                  <AlertTriangle size={11} className="text-amber-600" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                {c.label}
              </span>
              <span className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                {c.weight}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** Flagged-call queue driven by keyword and sentiment signals. */
export function SignalsMockup() {
  const rows = [
    { id: '#A-1042', tag: 'Lặp lại liên hệ', tone: 'Tiêu cực', warn: true },
    { id: '#A-1039', tag: 'Yêu cầu hoàn tiền', tone: 'Tiêu cực', warn: true },
    { id: '#A-1035', tag: 'Hỏi chính sách', tone: 'Trung tính', warn: false },
    { id: '#A-1028', tag: 'Xác nhận đơn', tone: 'Tích cực', warn: false },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Conversation Signals" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <Sparkles size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">
          Cuộc gọi cần xem lại
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">Dữ liệu mẫu</span>
      </div>

      <ul className="flex flex-col divide-y divide-brand-border">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3">
            <span className="shrink-0 text-[12px] font-bold tabular-nums text-brand">
              {r.id}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
              {r.tag}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                r.warn
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-brand-light text-brand'
              }`}
            >
              {r.tone}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Aggregate quality dashboard. Every figure is demo data. */
export function QualityDashboardMockup() {
  const tiles = [
    { label: 'Cuộc gọi đã phân tích', value: '1.248' },
    { label: 'Cần xem lại', value: '86' },
    { label: 'Điểm QA trung bình', value: '81' },
    { label: 'Phiên review tuần này', value: '34' },
  ]
  const bars = [
    { day: 'T2', v: 62 },
    { day: 'T3', v: 74 },
    { day: 'T4', v: 58 },
    { day: 'T5', v: 88 },
    { day: 'T6', v: 79 },
    { day: 'T7', v: 41 },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Quality Dashboard" />

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

        <div className="mt-4 rounded-[12px] border border-brand-border p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
            <BarChart3 size={12} aria-hidden="true" />
            Xu hướng điểm QA
          </p>

          {/* Each column is full-height so the bar's % height has a definite
              containing block to resolve against; otherwise it collapses. */}
          <div className="mt-3 flex h-24 items-stretch gap-2" aria-hidden="true">
            {bars.map((b) => (
              <div
                key={b.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <div
                  className="w-full rounded-t-[4px] bg-brand/80"
                  style={{ height: `${b.v}%` }}
                />
                <span className="shrink-0 text-[10px] leading-none text-muted-foreground">
                  {b.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Compact transcript + criteria pairing used in the hero. */
export function ReviewWorkspaceMockup() {
  return (
    <div className={SHELL}>
      <Chrome label="Conversation Review" />

      <div className="grid grid-cols-1 divide-y divide-brand-border sm:grid-cols-[1.4fr_1fr] sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
            <FileText size={12} aria-hidden="true" />
            Transcript
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {[
              { who: 'Agent', text: 'Dạ em nghe, em hỗ trợ mình ạ.' },
              { who: 'Khách hàng', text: 'Tôi gọi lần thứ hai rồi.' },
              { who: 'Agent', text: 'Em xin lỗi, em kiểm tra ngay ạ.' },
            ].map((t, i) => (
              <li key={i}>
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand">
                  {t.who}
                </p>
                <p className="text-[12px] leading-relaxed text-foreground">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Tiêu chí QA
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {['Chào hỏi', 'Kịch bản', 'Xử lý phản hồi'].map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    i === 2 ? 'bg-amber-50' : 'bg-brand-light'
                  }`}
                  aria-hidden="true"
                >
                  {i === 2 ? (
                    <AlertTriangle size={9} className="text-amber-600" />
                  ) : (
                    <Check size={9} className="text-brand" strokeWidth={3} />
                  )}
                </span>
                <span className="text-[12px] text-foreground">{c}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 rounded-[10px] bg-brand-light px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
              Điểm đề xuất
            </p>
            <p className="text-xl font-extrabold tabular-nums text-brand">78</p>
            <p className="text-[10px] text-muted-foreground">Chờ QA xác nhận</p>
          </div>
        </div>
      </div>
    </div>
  )
}
