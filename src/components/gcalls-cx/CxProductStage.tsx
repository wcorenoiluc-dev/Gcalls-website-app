import { GCALLS_CX_IMAGES } from '@/data/productImages'
import { CxScreenshotFrame } from './CxScreenshotFrame'

/**
 * Hero product stage — THREE separate, real product surfaces.
 *
 * The single sanitized Workspace capture is visually weak on its own (its
 * customer conversation had to be masked, emptying the centre). So the hero
 * shows three focused, individually-cropped surfaces rather than one screenshot
 * — and it does NOT composite them into a single fabricated frame. Each is a
 * genuine crop over PII-masked pixels, labelled for what it is:
 *   - Đa kênh  — the channel rail (Voice / Social / Email / SMS)
 *   - Ticket   — SLA tracking + problem description
 *   - Cuộc gọi — the inbound call info card
 *
 * Layout: desktop places the portrait "Đa kênh" surface beside a stacked pair
 * of landscape surfaces; support surfaces sit BESIDE the main one and never
 * overlap it. At and below `lg` everything becomes a clean single-column stack
 * with the main surface first. Nothing is absolutely positioned, so nothing can
 * overlap the fixed header.
 */
function StageLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 inline-flex items-center rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
      {children}
    </p>
  )
}

export function CxProductStage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <StageLabel>Đa kênh</StageLabel>
        <CxScreenshotFrame image={GCALLS_CX_IMAGES.channelsRail} priority />
      </div>

      <div className="flex flex-col gap-6 lg:col-span-7 lg:gap-8">
        <div>
          <StageLabel>Ticket</StageLabel>
          <CxScreenshotFrame image={GCALLS_CX_IMAGES.ticketCompact} priority />
        </div>
        <div>
          <StageLabel>Cuộc gọi</StageLabel>
          <CxScreenshotFrame image={GCALLS_CX_IMAGES.callInfo} />
        </div>
      </div>

      <p className="lg:col-span-12 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        Ba giao diện thật của sản phẩm, đã ẩn dữ liệu nhận dạng và làm trung hoà số
        liệu mẫu. Mỗi ảnh là một phần màn hình riêng, không ghép thành một ảnh chụp
        duy nhất.
      </p>
    </div>
  )
}
