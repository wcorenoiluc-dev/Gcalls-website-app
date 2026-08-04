import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

/**
 * Frame for a Gcalls demo product-UI visual.
 *
 * ---------------------------------------------------------------------------
 * DEMO DATA
 * ---------------------------------------------------------------------------
 * Everything inside these mockups — call counts, answer rates, durations,
 * agent names, scores — is illustrative. `DemoDataNote` labels that on the
 * page so a reader never mistakes a demo figure for a Gcalls result, and so
 * no dashboard number can be read as a marketing claim.
 * ---------------------------------------------------------------------------
 *
 * Mobile contract (brief §17):
 *  - one main visual per section; at most one supporting card, stacked below
 *  - never a multi-screen floating composition at 390px
 *  - no fixed desktop width; the mockup fills the column
 */

export function DemoDataNote({
  children = 'Giao diện minh họa. Số liệu hiển thị là dữ liệu mẫu.',
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
 * Wraps a mockup so it never imposes a desktop width on a phone.
 *
 * `maxWidth` applies from `lg` up only — below that the visual takes the full
 * column width rather than being scaled down until its internal text is
 * unreadable.
 */
export function ProductVisual({
  children,
  maxWidth = '560px',
  note,
  className = '',
}: {
  children: ReactNode
  maxWidth?: string
  /** Pass `false` to suppress the demo-data caption. */
  note?: ReactNode | false
  className?: string
}) {
  return (
    <div className={className}>
      <div className="w-full lg:mx-auto" style={{ maxWidth: `min(100%, ${maxWidth})` }}>
        {children}
      </div>
      {note !== false && <DemoDataNote>{note}</DemoDataNote>}
    </div>
  )
}

/**
 * Main visual + at most one supporting card.
 *
 * Desktop: supporting card overlaps the main visual's lower-right corner, in
 * the site's established style. Below `lg` it drops out of absolute
 * positioning and stacks underneath — the brief forbids floating compositions
 * at 390px.
 */
export function ProductVisualWithSupport({
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
      <div className="relative lg:pb-16">
        <div
          className="w-full lg:mx-auto"
          style={{ maxWidth: `min(100%, ${mainMaxWidth})` }}
        >
          {main}
        </div>

        <div
          className="
            mt-4 w-full
            lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-auto lg:max-w-[300px]
          "
        >
          {support}
        </div>
      </div>

      {note !== false && <DemoDataNote>{note}</DemoDataNote>}
    </div>
  )
}
