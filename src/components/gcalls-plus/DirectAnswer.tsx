import { HelpCircle } from 'lucide-react'
import { Container, Section } from '@/components/common/primitives'
import { GP_DIRECT_ANSWER } from '@/data/gcallsPlus'

/**
 * Direct answer / AIO block.
 *
 * Sits immediately after the hero and is ALWAYS rendered as visible text — no
 * tab, no modal, no accordion, no truncation. Both a human skimming the page
 * and an answer engine reading the HTML get the product definition without
 * having to interact with anything.
 *
 * The question is an h2 so the definition is a real document section rather
 * than a styled paragraph, and the answer is the single natural placement of
 * the primary keyword "phần mềm tổng đài webphone".
 */
export function DirectAnswer() {
  return (
    <Section ariaLabelledBy="gcalls-plus-la-gi">
      <Container>
        <div className="mx-auto max-w-3xl rounded-[20px] border border-brand-border bg-brand-light/40 px-6 py-8 sm:px-10 sm:py-10">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px]"
          >
            <HelpCircle size={14} aria-hidden="true" />
            Định nghĩa
          </span>

          <h2
            id="gcalls-plus-la-gi"
            className="mt-4 text-[22px] font-extrabold leading-snug tracking-tight text-foreground sm:text-[26px]"
          >
            {GP_DIRECT_ANSWER.question}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {GP_DIRECT_ANSWER.answer}
          </p>
        </div>
      </Container>
    </Section>
  )
}
