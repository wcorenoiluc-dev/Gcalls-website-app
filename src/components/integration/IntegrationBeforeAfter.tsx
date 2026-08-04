import { ArrowDown, ArrowRight, Check, Minus } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Before / after workflow comparison.
 *
 * This is a WORKFLOW ILLUSTRATION, not a measurement. No time saved, ROI,
 * step-count delta or productivity percentage may be attached to it — the
 * component deliberately renders no metrics slot, so a future edit cannot add
 * one without also changing this file.
 *
 * Reusable by the other integration solution pages (Helpdesk, POS), which face
 * the same "manual hand-off between two systems" narrative.
 *
 * Responsive: the two columns stack under `lg`, and inside each column the
 * steps stack vertically at every width — a horizontal chain would either
 * overflow or shrink to illegibility at 390px.
 */
export function IntegrationBeforeAfter({
  eyebrow,
  title,
  titleId,
  before,
  after,
  tinted,
}: {
  eyebrow: string
  title: string
  titleId: string
  before: { label: string; steps: readonly string[] }
  after: { label: string; steps: readonly string[] }
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} titleId={titleId} />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FlowColumn
            label={before.label}
            steps={before.steps}
            tone="muted"
            headingId={`${titleId}-before`}
          />
          <FlowColumn
            label={after.label}
            steps={after.steps}
            tone="brand"
            headingId={`${titleId}-after`}
          />
        </div>
      </Container>
    </Section>
  )
}

function FlowColumn({
  label,
  steps,
  tone,
  headingId,
}: {
  label: string
  steps: readonly string[]
  tone: 'muted' | 'brand'
  headingId: string
}) {
  const isBrand = tone === 'brand'
  const Icon = isBrand ? Check : Minus

  return (
    <Card aria-labelledby={headingId} className="flex h-full flex-col p-6 sm:p-7">
      <h3
        id={headingId}
        className={`text-lg font-extrabold tracking-tight ${
          isBrand ? 'text-brand' : 'text-muted-foreground'
        }`}
      >
        {label}
      </h3>

      <ol className="mt-5 flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li key={step} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  isBrand ? 'bg-brand-light text-brand' : 'bg-muted text-muted-foreground'
                }`}
                aria-hidden="true"
              >
                <Icon size={14} />
              </span>
              <span
                className={`text-[15px] leading-relaxed ${
                  isBrand ? 'font-semibold text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>

            {i < steps.length - 1 && (
              <span className="pl-[13px] text-muted-foreground/50" aria-hidden="true">
                <ArrowDown size={13} />
              </span>
            )}
          </li>
        ))}
      </ol>

      {isBrand && (
        <p className="mt-auto flex items-center gap-1.5 pt-6 text-[15px] font-semibold text-brand">
          Ít điểm chuyển đổi thủ công hơn
          <ArrowRight size={15} aria-hidden="true" />
        </p>
      )}
    </Card>
  )
}
