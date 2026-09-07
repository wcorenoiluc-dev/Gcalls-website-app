import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

/**
 * Visual frame for /qc-bot-ai/.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS PAGE-LOCAL
 * ---------------------------------------------------------------------------
 * The shared `common/ProductVisual` is rendered by the Gcalls CX, Voicebot,
 * International Calling and eight integration pages, all out of scope here, so
 * it is left untouched. This page needs a different caption: `ProductVisual`
 * defaults to "Số liệu hiển thị là dữ liệu mẫu", which is the wrong promise
 * now that these surfaces show no figures at all.
 * ---------------------------------------------------------------------------
 */

/**
 * The standing caption for every QA/QC visual.
 *
 * It says two things deliberately: that the surface is an illustration, and
 * that it is NOT operating data. It does not say "dữ liệu mẫu" — sample data is
 * what the old mockups claimed while showing invented scores, and the point of
 * the rebuild is that there are no longer any figures to disclaim.
 */
export const ILLUSTRATION_NOTE =
  'Giao diện minh họa mô tả quy trình QA. Không phải ảnh chụp sản phẩm và không chứa dữ liệu vận hành của khách hàng.'

export function IllustrationNote({
  children = ILLUSTRATION_NOTE,
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

/**
 * Caps the visual so it never imposes a desktop width on a phone, and captions
 * it. `maxWidth` applies from `lg` up; below that the surface fills its column.
 */
export function QaQcStage({
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
        /* Hook for the preview crops and the illustration assertions — these
           surfaces are DOM, not <img>, so there is nothing else to key on. */
        data-qq-visual="illustration"
        className="w-full lg:mx-auto"
        style={{ maxWidth: `min(100%, ${maxWidth})` }}
      >
        {children}
      </div>
      {note !== false && <IllustrationNote>{note}</IllustrationNote>}
    </div>
  )
}
