import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

/**
 * Product-visual compositions for /gcalls-plus-webphone/.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS PAGE-LOCAL AND NOT `common/ProductVisual`
 * ---------------------------------------------------------------------------
 * `ProductVisualWithSupport` is also consumed by the Hubspot, Salesforce and
 * CRM-integration pages, which are out of scope for this checkpoint. Its
 * overlap geometry is wrong for a portrait phone capture — measured at 1440 on
 * this page, the 300px support card covered roughly half of the main
 * screenshot, was tall enough to bleed up over the fixed header, and left a
 * dead band beneath the caption. Fixing it in place would have moved three
 * approved routes, so the corrected geometry lives here instead.
 * ---------------------------------------------------------------------------
 *
 * WHAT CHANGED
 * The support card is narrow — 150px, about a quarter of the stage rather than
 * half — and it is anchored to the BOTTOM of a stage that reserves its
 * overhang as padding (`lg:pb-14`). Together those two facts mean it can only
 * overlap the main capture's lower-right corner: it cannot reach the header,
 * and it cannot cover the part of the interface the section is about.
 *
 * Below `lg` there is no overlap at all — the brief forbids floating
 * compositions at 390px — so the captures stack, each centred and capped, so a
 * 1092px-tall phone screenshot does not become a full-viewport image.
 */

/**
 * Every visual on this page is a real, irreversibly masked capture, so the
 * default caption says exactly that. It is deliberately NOT the demo-data
 * disclaimer used by the drawn mockups elsewhere on the site: that wording
 * exists to stop a fabricated figure being read as a result, and this page no
 * longer renders any fabricated figures.
 */
export const MASKED_CAPTURE_NOTE =
  'Ảnh chụp thật từ môi trường demo nội bộ. Dữ liệu khách hàng và nhân viên đã được che vĩnh viễn.'

export function CaptureNote({
  children = MASKED_CAPTURE_NOTE,
}: {
  children?: ReactNode
}) {
  return (
    <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
      <Info size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
      {children}
    </p>
  )
}

/** A single capture, capped at its own intrinsic width so it is never upscaled. */
export function Stage({
  children,
  maxWidth = '560px',
  note,
  className = '',
}: {
  children: ReactNode
  maxWidth?: string
  /** `false` suppresses the caption. */
  note?: ReactNode | false
  className?: string
}) {
  return (
    <div className={className}>
      <div
        className="w-full lg:mx-auto"
        style={{ maxWidth: `min(100%, ${maxWidth})` }}
      >
        {children}
      </div>
      {note !== false && <CaptureNote>{note}</CaptureNote>}
    </div>
  )
}

/**
 * Main capture plus one supporting phone capture at the lower-right.
 *
 * `lg:pb-14` is the phone's overhang below the main image, carried as padding
 * so the composition still occupies an honest box and cannot overlap whatever
 * follows it.
 */
export function StageWithSupport({
  main,
  support,
  mainMaxWidth = '560px',
  note,
  className = '',
}: {
  main: ReactNode
  support: ReactNode
  mainMaxWidth?: string
  note?: ReactNode | false
  className?: string
}) {
  return (
    <div className={className}>
      <div className="relative lg:pb-14">
        <div
          className="w-full lg:mx-auto"
          style={{ maxWidth: `min(100%, ${mainMaxWidth})` }}
        >
          {main}
        </div>

        <div className="mx-auto mt-4 w-full max-w-[190px] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:max-w-[150px]">
          {support}
        </div>
      </div>

      {note !== false && <CaptureNote>{note}</CaptureNote>}
    </div>
  )
}
