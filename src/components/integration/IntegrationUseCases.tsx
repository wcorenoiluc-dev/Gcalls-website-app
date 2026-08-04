import { Target } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Workflow use cases.
 *
 * Each card shows a role and its workflow chain. No industry-specific result,
 * outcome or figure is claimed.
 */
export function IntegrationUseCases({
  title,
  titleId,
  eyebrow = 'Phù hợp với',
  items,
  tinted = false,
}: {
  title: string
  titleId: string
  eyebrow?: string
  items: readonly { role: string; flow: string }[]
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={title}
          titleId={titleId}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card as="li" key={item.role} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.role}
              </h3>
              <p className="mt-3 rounded-[10px] bg-brand-light px-4 py-3 text-[15px] font-medium leading-relaxed text-brand">
                {item.flow}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
