import {
  AudioLines,
  BarChart3,
  FileText,
  ListChecks,
  Minus,
  Search,
  Sparkles,
  UserCheck,
} from 'lucide-react'

/**
 * QA QC Center conceptual visuals.
 *
 * ---------------------------------------------------------------------------
 * NO QA/QC PRODUCT SCREENSHOT EXISTS — AND NONE IS SIMULATED HERE
 * ---------------------------------------------------------------------------
 * `docs/content-review/images/website-image-master-map.csv` records this route
 * as `PRODUCT_SCREENSHOT_REQUIRED / NOT DELIVERED`, with the instruction "Do
 * not stage a fake scoring screen." These surfaces therefore describe the
 * WORKFLOW rather than impersonate the product, and every one of them is
 * labelled "Giao diện minh họa".
 *
 * WHAT WAS REMOVED, AND WHY A CAPTION WAS NOT ENOUGH
 * The previous versions of these five mockups rendered, as if they were
 * product output:
 *
 *   - a fabricated customer conversation (four scripted turns) in both the
 *     hero and the transcript panel
 *   - a suggested QA score of `78`, twice
 *   - pass / fail verdicts against named QA criteria
 *   - fabricated call identifiers `#A-1042`, `#A-1039`, `#A-1035`, `#A-1028`
 *     with per-call sentiment verdicts
 *   - dashboard totals `1.248` calls analysed, `86` needing review, average QA
 *     score `81`, `34` review sessions, and a `62/74/58/88/79/41` trend chart
 *
 * A "dữ liệu mẫu" caption does not make an invented quality score safe to
 * publish. On a page whose subject IS scoring, a fabricated score is the claim,
 * and a reader cannot tell an illustrative 81 from a measured one.
 *
 * WHAT IS KEPT
 * The 20/30/30/20 rubric weights stay, because they are a configuration
 * example rather than a result: they are shown summing to 100% under an
 * explicit "cấu hình mẫu" heading, with every RESULT column reading "—".
 *
 * Labels come from the approved copy in `qaQcCenter.ts` — the signal groups are
 * read from `QQ_SIGNALS.points` directly, so a mockup cannot drift into
 * depicting a capability the copy does not claim.
 * ---------------------------------------------------------------------------
 */

const SHELL =
  'w-full overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-[0_18px_50px_rgba(103,58,183,0.13)]'

/** Window chrome shared by every surface. */
function Chrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-brand px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/25" />
        ))}
      </div>
      <span className="ml-1 text-xs font-medium text-white/80">{label}</span>
      <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
        Minh họa
      </span>
    </div>
  )
}

/** The value a result field shows when there is no approved figure for it. */
function NoValue({ label = 'chưa có dữ liệu' }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-muted-foreground"
      title={label}
    >
      <Minus size={12} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Neutral placeholder line standing in for transcript text. */
function GhostLine({ w }: { w: string }) {
  return (
    <span
      className="block h-2 rounded-full bg-brand-light"
      style={{ width: w }}
      aria-hidden="true"
    />
  )
}

/* ── Hero: the workflow, as a pipeline ───────────────────────────────────── */

/**
 * Audio → Transcript → Criteria → Human review.
 *
 * The brief's prescribed hero composition where no real capture exists. It is
 * a diagram of the approved five-step flow, compressed to its four visible
 * stages, and it ends on the human step on purpose — the page must never read
 * as "AI replaces QA".
 */
export function ReviewPipelineMockup() {
  const stages = [
    { icon: AudioLines, label: 'Audio', detail: 'Bản ghi cuộc gọi' },
    { icon: FileText, label: 'Transcript', detail: 'Speech-to-Text' },
    { icon: ListChecks, label: 'Criteria', detail: 'Tiêu chí & trọng số' },
    { icon: UserCheck, label: 'Human review', detail: 'QA xác nhận' },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="QA QC Center · Quy trình" />

      <ol className="flex flex-col gap-3 p-5">
        {stages.map((s, i) => (
          <li key={s.label} className="flex items-start gap-3.5">
            <div className="flex flex-col items-center self-stretch">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${
                  i === stages.length - 1
                    ? 'bg-brand text-white'
                    : 'bg-brand-light text-brand'
                }`}
                aria-hidden="true"
              >
                <s.icon size={17} />
              </span>
              {i < stages.length - 1 && (
                <span
                  className="mt-1 w-px flex-1 bg-brand-border"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <p className="text-[13px] font-bold leading-snug text-foreground">
                {s.label}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                {s.detail}
              </p>
              {/* Placeholder geometry, never simulated conversation text. */}
              <div className="mt-2 flex flex-col gap-1.5">
                <GhostLine w={['82%', '68%', '74%', '58%'][i]} />
                <GhostLine w={['54%', '44%', '48%', '36%'][i]} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ── Transcript ──────────────────────────────────────────────────────────── */

/**
 * Speech-to-Text output as structure, not content.
 *
 * Speaker roles and the search affordance are real product vocabulary from the
 * approved copy; the utterances are placeholder geometry. Writing plausible
 * Vietnamese dialogue here would be inventing a customer conversation, which
 * is what the previous version did.
 */
export function TranscriptMockup() {
  const turns = [
    { who: 'Agent', widths: ['88%', '62%'] },
    { who: 'Khách hàng', widths: ['76%', '48%'], flagged: true },
    { who: 'Agent', widths: ['92%', '55%'] },
    { who: 'Khách hàng', widths: ['64%'] },
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Transcript" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <Search size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs text-muted-foreground">Tìm trong transcript…</span>
      </div>

      <ul className="flex flex-col gap-3.5 p-4">
        {turns.map((t, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="w-9 shrink-0 pt-0.5 text-[11px] tabular-nums text-muted-foreground"
              aria-hidden="true"
            >
              --:--
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
                {t.who}
              </p>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {t.widths.map((w, j) => (
                  <GhostLine key={j} w={w} />
                ))}
              </div>
              {t.flagged && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
                  <Sparkles size={11} aria-hidden="true" />
                  Từ khóa theo cấu hình
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── QA scoring ──────────────────────────────────────────────────────────── */

/**
 * The rubric as a configuration screen.
 *
 * Criteria names and weights are an example CONFIGURATION — the weights are
 * shown summing to 100%, under a heading that says so. Every result field
 * reads "—": no suggested score, and no met/not-met verdict, because both
 * would be an invented evaluation of a call that never happened.
 */
export function ScoreCardMockup() {
  const criteria = [
    { label: 'Chào hỏi & xác minh', weight: 20 },
    { label: 'Tuân thủ kịch bản', weight: 30 },
    { label: 'Xử lý phản hồi', weight: 30 },
    { label: 'Kết thúc cuộc gọi', weight: 20 },
  ]
  const total = criteria.reduce((sum, c) => sum + c.weight, 0)

  return (
    <div className={SHELL}>
      <Chrome label="QA Scoring · Cấu hình mẫu" />

      <div className="p-4">
        <div className="flex items-center justify-between rounded-[12px] bg-brand-light px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
              Điểm đề xuất
            </p>
            <p className="text-[11px] text-muted-foreground">Chờ QA xác nhận</p>
          </div>
          <p className="text-2xl font-extrabold leading-none text-muted-foreground">
            <NoValue label="chưa có điểm" />
          </p>
        </div>

        <p className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          <span>Tiêu chí</span>
          <span>Trọng số</span>
        </p>

        <ul className="mt-2 flex flex-col gap-2">
          {criteria.map((c) => (
            <li
              key={c.label}
              className="flex items-center gap-2.5 rounded-[10px] border border-brand-border px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                {c.label}
              </span>
              <span className="shrink-0 text-[12px] font-semibold tabular-nums text-brand">
                {c.weight}%
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 flex items-center justify-between rounded-[10px] bg-brand-light/60 px-3 py-2 text-[12px] font-bold text-brand">
          <span>Tổng trọng số</span>
          <span className="tabular-nums">{total}%</span>
        </p>
      </div>
    </div>
  )
}

/* ── Conversation signals ────────────────────────────────────────────────── */

/**
 * The signal GROUPS the copy claims, not a queue of invented calls.
 *
 * There are no call identifiers and no per-call sentiment verdicts — the
 * previous version invented four of each — and every count reads "—".
 *
 * Each label below is the head term of the matching entry in
 * `QQ_SIGNALS.points`, never a new capability: rendering the full sentences
 * here just reprinted the bullet list standing beside this mockup, which read
 * as a duplication rather than as a product surface. The tie is enforced
 * mechanically — `verify-qaqc-ui.mjs` asserts each label is a substring of its
 * approved point, so a label cannot drift away from the locked copy.
 */
const SIGNAL_GROUPS = ['Từ khóa', 'Tín hiệu cảm xúc', 'Dấu hiệu bất thường', 'Xu hướng']

export function SignalsMockup() {
  return (
    <div className={SHELL}>
      <Chrome label="Conversation Signals" />

      <div className="flex items-center gap-2 border-b border-brand-border px-4 py-2.5">
        <Sparkles size={14} className="text-brand" aria-hidden="true" />
        <span className="text-xs font-semibold text-foreground">
          Nhóm tín hiệu theo cấu hình
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Cuộc gọi cần xem lại
        </span>
      </div>

      <ul className="flex flex-col divide-y divide-brand-border">
        {SIGNAL_GROUPS.map((group) => (
          <li key={group} className="flex items-center gap-3 px-4 py-3">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 text-[12px] leading-snug text-foreground">
              {group}
            </span>
            <span className="shrink-0 text-[12px] font-semibold">
              <NoValue />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Exported so the verifier can tie each label back to the approved copy. */
export const SIGNAL_GROUP_LABELS = SIGNAL_GROUPS

/* ── Quality dashboard ───────────────────────────────────────────────────── */

/**
 * The dashboard's SHAPE, in its empty state.
 *
 * Tiles name the metrics the copy says the dashboard tracks and show "—" for
 * each, and the trend panel is an empty state rather than a chart. The
 * previous version printed four totals and a six-bar trend, none of which came
 * from anything measured.
 */
export function QualityDashboardMockup() {
  const tiles = [
    'Cuộc gọi đã phân tích',
    'Cần xem lại',
    'Điểm QA trung bình',
    'Phiên review',
  ]

  return (
    <div className={SHELL}>
      <Chrome label="Quality Dashboard" />

      <div className="p-4">
        <ul className="grid grid-cols-2 gap-2.5">
          {tiles.map((label) => (
            <li
              key={label}
              className="rounded-[12px] border border-brand-border px-3 py-2.5"
            >
              <p className="text-lg font-extrabold leading-none text-muted-foreground">
                <NoValue />
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {label}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-[12px] border border-dashed border-brand-border p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
            <BarChart3 size={12} aria-hidden="true" />
            Xu hướng điểm QA
          </p>
          <div className="flex h-24 items-center justify-center">
            <p className="text-[12px] text-muted-foreground">
              Biểu đồ hiển thị khi có dữ liệu của doanh nghiệp
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
