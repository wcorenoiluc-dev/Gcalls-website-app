import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PRICING_FAQ } from '@/data/pricing'

/**
 * Pricing FAQ accordion.
 *
 * The reference has no FAQ section; this is built in its visual language —
 * 14px radius, hairline border, brand accent on the control.
 *
 * Full-width rows with a 56px minimum control height on mobile. Answers are
 * the approved copy verbatim and are mirrored into FAQPage JSON-LD from the
 * same `PRICING_FAQ` array, so the two cannot drift.
 */
export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      {PRICING_FAQ.map((item, index) => {
        const open = openIndex === index
        const panelId = `faq-panel-${index}`
        const buttonId = `faq-button-${index}`

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
