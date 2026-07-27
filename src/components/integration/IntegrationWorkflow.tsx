import { ArrowRight } from 'lucide-react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Workflow diagram for an integration page.
 *
 * A purpose-built diagram rather than a fabricated CRM product screenshot —
 * the brief forbids inventing third-party platform UI, and a diagram states
 * the flow honestly without implying what any vendor's screen looks like.
 *
 * Mobile: a vertical chain, one step per row with a downward connector.
 * From `lg`: a horizontal chain that wraps, with arrows between steps.
 */
export function IntegrationWorkflow({
  title,
  titleId,
  eyebrow = 'Cách hoạt động',
  steps,
  anchorId,
}: {
  title: string
  titleId: string
  eyebrow?: string
  steps: readonly { n: string; label: string; detail: string }[]
  anchorId?: string
}) {
  return (
    <Section ariaLabelledBy={titleId} className="scroll-mt-20">
      <Container>
        {anchorId && <div id={anchorId} className="scroll-mt-24" />}

        <SectionHeader eyebrow={eyebrow} title={title} titleId={titleId} />

        <ol className="mt-10 flex flex-col gap-3 lg:grid lg:grid-cols-4 lg:gap-4">
          {steps.map((step, index) => (
            <li key={step.n} className="relative flex flex-col">
              <div className="flex h-full flex-col rounded-[14px] border border-brand-border bg-background p-5">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-light text-sm font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug text-foreground">
                  {step.label}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>

              {/* Connector — vertical on mobile, horizontal from lg. */}
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden="true"
                    className="mx-auto my-1 flex h-5 items-center justify-center text-brand lg:hidden"
                  >
                    <ArrowRight size={16} className="rotate-90" />
                  </span>
                  {/* Suppressed at the end of each 4-column row, where the
                      arrow would otherwise point into empty space. */}
                  {(index + 1) % 4 !== 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand lg:block"
                    >
                      <ArrowRight size={16} />
                    </span>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
