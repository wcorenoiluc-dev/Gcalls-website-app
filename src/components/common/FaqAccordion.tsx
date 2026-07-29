import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router'

export interface FaqItem {
  q: string
  a: string
  /**
   * Optional contextual link rendered under the answer, for questions that
   * hand off to the page that actually owns the topic. Omit it and nothing
   * renders — existing FAQs are unaffected.
   */
  link?: { label: string; path: string }
}

/**
 * Shared FAQ accordion.
 *
 * Used by every page that needs an FAQ. Pair it with a FAQPage JSON-LD block
 * built from the SAME array, so the rendered questions and the structured data
 * cannot drift apart. Note that `link` is presentation only — it is never
 * folded into the JSON-LD answer text.
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

                {item.link && (
                  <Link
                    to={item.link.path}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {item.link.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
