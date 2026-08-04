import { Workflow } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_WORKFLOW } from '@/data/gcallsPlus'

/**
 * Daily call workflow — call → context → notes → history.
 *
 * Distinct from DeploymentSection: this is what an agent does on every call,
 * not how the system is rolled out. Rendered as an ordered list so the
 * sequence is carried by the markup, not only by the numerals.
 */
export function WorkflowSection() {
  return (
    <Section ariaLabelledBy="quy-trinh">
      <Container>
        <SectionHeader
          eyebrow={GP_WORKFLOW.eyebrow}
          eyebrowIcon={<Workflow size={14} aria-hidden="true" />}
          title={GP_WORKFLOW.h2}
          titleId="quy-trinh"
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GP_WORKFLOW.steps.map((step) => (
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
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
