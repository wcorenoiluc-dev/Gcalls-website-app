import { AlertCircle } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Numbered problem cards for an integration page.
 *
 * Descriptive only — no percentage, time-saved or efficiency figure is
 * attached to any pain point, because none is approved.
 */
export function IntegrationProblems({
  eyebrow,
  title,
  titleId,
  items,
}: {
  eyebrow: string
  title: string
  titleId: string
  items: readonly { n: string; title: string; detail: string }[]
}) {
  return (
    <Section tinted ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={title}
          titleId={titleId}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full gap-4 p-6">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {item.n}
              </span>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
