import { useState } from 'react'
import { Plus } from 'lucide-react'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Shared FAQ accordion.
 *
 * Used by every page that needs an FAQ. Pair it with a FAQPage JSON-LD block
 * built from the SAME array, so the rendered questions and the structured data
 * cannot drift apart.
 *
 * Mobile: full-width rows, 56px minimum control height, 16px question text.
 */
export function FaqAccordion({
  items,
  idPrefix = 'faq',
  defaultOpenIndex = 0,
}: {
  items: readonly FaqItem[]
  /** Must be unique per page when more than one accordion is rendered. */
  idPrefix?: string
  defaultOpenIndex?: number | null
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

  return (
    <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      {items.map((item, index) => {
        const open = openIndex === index
        const panelId = `${idPrefix}-panel-${index}`
        const buttonId = `${idPrefix}-button-${index}`

        return (
          <li
            key={item.q}
            className="overflow-hidden rounded-[14px] border border-brand-border bg-background"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
              >
                <span className="text-base font-bold leading-snug text-foreground">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 text-brand transition-transform duration-200 ${
                    open ? 'rotate-45' : ''
                  }`}
                />
              </button>
            </h3>

            {open && (
              <div
                id={panelId}
                aria-labelledby={buttonId}
                className="border-t border-brand-border px-5 py-4"
              >
                <p className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {item.a}
                </p>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
