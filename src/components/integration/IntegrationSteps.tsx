import type { ReactNode } from 'react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Numbered step grid — used for both configuration and deployment sections.
 *
 * States process only. No setup-time or go-live duration is claimed anywhere,
 * and no credential, key or tenant detail is exposed.
 */
export function IntegrationSteps({
  eyebrow,
  eyebrowIcon,
  title,
  titleId,
  lead,
  steps,
  tinted = false,
}: {
  eyebrow: string
  eyebrowIcon?: ReactNode
  title: string
  titleId: string
  lead?: string
  steps: readonly { n: string; title: string; detail?: string }[]
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={eyebrowIcon}
          title={title}
          titleId={titleId}
          lead={lead}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {step.title}
              </h3>
              {step.detail && (
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              )}
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
