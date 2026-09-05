import { AudioLines, FileText, Inbox, ListChecks, UserCheck } from 'lucide-react'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'

/**
 * The three product visuals for `/san-pham/`.
 *
 * Separate from `productMedia.tsx` so that file can export only data — the
 * route→media map and the glyph map — which keeps Fast Refresh working for
 * both. See `productMedia.tsx` for the provenance of each slot.
 */

/** Shell shared by the two diagram slots, so they read as one family. */
const DIAGRAM_SHELL =
  'flex h-full w-full flex-col justify-center gap-2 rounded-[12px] border border-brand-border bg-white p-4'

/** Gcalls Plus — the real, masked webphone workspace. */
export function WebphoneCapture() {
  return (
    <ProductScreenshot
      image={GCALLS_PLUS_IMAGES.webphoneDesktop}
      className="!rounded-[12px] !shadow-none"
    />
  )
}

/**
 * QA QC Center — Audio → Transcript → Bộ tiêu chí → Human review.
 *
 * Ends on the human step deliberately: QA QC Center must never read as "AI
 * replaces QA". Carries no score, call identifier or conversation, so it cannot
 * be mistaken for a screenshot of the product.
 */
export function QaQcPipelineDiagram() {
  const steps = [
    { icon: AudioLines, label: 'Audio' },
    { icon: FileText, label: 'Transcript' },
    { icon: ListChecks, label: 'Bộ tiêu chí' },
    { icon: UserCheck, label: 'Human review' },
  ]

  return (
    <ol className={DIAGRAM_SHELL}>
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-center gap-2.5">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
              i === steps.length - 1
                ? 'bg-brand text-white'
                : 'bg-brand-light text-brand'
            }`}
            aria-hidden="true"
          >
            <s.icon size={14} />
          </span>
          <span className="text-[13px] font-semibold leading-snug text-foreground">
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <span className="ml-auto text-[11px] text-muted-foreground" aria-hidden="true">
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

/**
 * Gcalls CX — many channels into one queue.
 *
 * Channel names only, which is what the approved card copy already says
 * ("Omnichannel · Ticket · Customer context"). No counts, no ticket numbers,
 * and no third-party branding.
 */
export function CxChannelsDiagram() {
  const channels = ['Hotline', 'Email', 'Chat', 'Mạng xã hội']

  return (
    <div className={DIAGRAM_SHELL}>
      <ul className="flex flex-wrap gap-1.5">
        {channels.map((c) => (
          <li
            key={c}
            className="rounded-full bg-brand-light px-2.5 py-1 text-[12px] font-semibold text-brand"
          >
            {c}
          </li>
        ))}
      </ul>

      <p className="text-center text-[11px] text-muted-foreground" aria-hidden="true">
        ↓
      </p>

      <p className="flex items-center justify-center gap-2 rounded-[8px] bg-brand px-3 py-2 text-[13px] font-semibold text-white">
        <Inbox size={14} aria-hidden="true" />
        Một hàng đợi hội thoại
      </p>
    </div>
  )
}
