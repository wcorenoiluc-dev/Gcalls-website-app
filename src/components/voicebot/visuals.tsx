import { ArrowRight, ListChecks, Phone, PhoneForwarded, RotateCcw, Sparkles, UserCheck } from 'lucide-react'
import { VB_HUMAN_AI } from '@/data/voicebotAi'

/**
 * Voicebot AI illustrative visuals — NEUTRAL DIAGRAMS ONLY.
 *
 * ---------------------------------------------------------------------------
 * NO FABRICATED DATA. READ THIS FIRST.
 * ---------------------------------------------------------------------------
 * The previous versions of this file (`VoicebotCampaignMockup`,
 * `VoicebotHandoffMockup`) rendered a fake campaign console and a fake handoff
 * queue: quantities (480/312/198/24), response percentages (46/27/15/12),
 * invented lead IDs (LH-24xx), timestamps and customer statuses. None of it was
 * real, and "Minh họa" on a realistic dashboard is not enough to keep dressed-up
 * numbers on a page. They are gone.
 *
 * What remains are process diagrams built only from the approved copy in
 * `src/data/voicebotAi.ts`. They contain NO quantity, NO percentage, NO lead ID,
 * NO timestamp, NO customer identity, and NO status implying a real result. A
 * standing check (`scripts/voicebot-fabricated-scan.mjs`) fails the build if any
 * of the retired values reappears anywhere in the Voicebot source.
 * ---------------------------------------------------------------------------
 */

/** A labelled node in a flow diagram. */
function FlowNode({
  icon,
  label,
  sublabel,
  emphasis = false,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3 ${
        emphasis
          ? 'border-brand bg-brand text-white shadow-[0_10px_30px_rgba(103,58,183,0.25)]'
          : 'border-brand-border bg-white text-foreground'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
          emphasis ? 'bg-white/15 text-white' : 'bg-brand-light text-brand'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight">{label}</span>
        {sublabel && (
          <span
            className={`mt-0.5 block text-[12px] leading-snug ${
              emphasis ? 'text-white/80' : 'text-muted-foreground'
            }`}
          >
            {sublabel}
          </span>
        )}
      </span>
    </div>
  )
}

/**
 * Hero diagram — the shape of a Voicebot campaign, as a process flow.
 *
 *   Danh sách đầu vào → Voicebot (theo kịch bản) → Xác nhận / Gọi lại /
 *   Chuyển nhân viên
 *
 * The three outcome branches are the approved response types; the "chuyển
 * nhân viên" branch resolves to the team, which is the whole point of the page.
 * No counts, rates, IDs, times or statuses.
 */
export function VoicebotProcessDiagram() {
  const branches = [
    { label: 'Xác nhận', icon: <UserCheck size={16} aria-hidden="true" /> },
    { label: 'Gọi lại', icon: <RotateCcw size={16} aria-hidden="true" /> },
    { label: 'Chuyển nhân viên', icon: <PhoneForwarded size={16} aria-hidden="true" /> },
  ]

  return (
    <div className="flex w-full max-w-[380px] flex-col items-stretch gap-2.5">
      <FlowNode
        icon={<ListChecks size={18} aria-hidden="true" />}
        label="Danh sách đầu vào"
        sublabel="Dữ liệu và kịch bản do doanh nghiệp duyệt"
      />

      <span className="mx-auto text-brand/60" aria-hidden="true">↓</span>

      <FlowNode
        icon={<Phone size={18} aria-hidden="true" />}
        label="Voicebot"
        sublabel="Gọi theo kịch bản đã thiết lập"
        emphasis
      />

      <span className="mx-auto text-brand/60" aria-hidden="true">↓</span>

      <ul className="grid grid-cols-3 gap-2">
        {branches.map((b) => (
          <li
            key={b.label}
            className="flex flex-col items-center gap-1.5 rounded-[12px] border border-brand-border bg-white px-2 py-2.5 text-center"
          >
            <span className="text-brand" aria-hidden="true">
              {b.icon}
            </span>
            <span className="text-[12px] font-semibold leading-tight text-foreground">
              {b.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Capability / handoff diagram — division of labour, two lanes.
 *
 *   Voicebot xử lý   →   Đội ngũ tiếp nhận
 *
 * Both lanes are populated ONLY from approved copy (`VB_HUMAN_AI.columns`), so
 * nothing here is a capability the copy does not already state.
 */
export function VoicebotHandoffDiagram() {
  const [bot, human] = VB_HUMAN_AI.columns

  const lanes = [
    { title: 'Voicebot xử lý', icon: <Sparkles size={16} aria-hidden="true" />, items: bot.items, emphasis: true },
    { title: 'Đội ngũ tiếp nhận', icon: <UserCheck size={16} aria-hidden="true" />, items: human.items, emphasis: false },
  ]

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        {lanes.map((lane, i) => (
          <div key={lane.title} className="contents">
            <div
              className={`flex flex-col rounded-[14px] border p-3 ${
                lane.emphasis ? 'border-brand bg-brand-light' : 'border-brand-border bg-white'
              }`}
            >
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-brand">
                {lane.icon}
                {lane.title}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {lane.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-[9px] border border-brand-border/70 bg-white px-2.5 py-1.5 text-[12px] leading-snug text-foreground"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            {/* Handoff arrow sits between the two lanes. */}
            {i === 0 && (
              <div className="flex items-center justify-center text-brand" aria-hidden="true">
                <ArrowRight size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] leading-snug text-muted-foreground">
        Điều kiện chuyển tiếp được thiết lập theo từng kịch bản.
      </p>
    </div>
  )
}
