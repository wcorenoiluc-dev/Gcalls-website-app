import { Check, Sparkles } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Benefits list.
 *
 * Qualitative statements only. No productivity percentage, time saved or
 * efficiency figure appears — none is approved for publication.
 */
export function IntegrationBenefits({
  title,
  titleId,
  eyebrow = 'Giá trị',
  items,
}: {
  title: string
  titleId: string
  eyebrow?: string
  items: readonly string[]
}) {
  return (
    <Section ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<Sparkles size={14} aria-hidden="true" />}
          title={title}
          titleId={titleId}
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card as="li" key={item} className="flex min-h-[88px] items-center gap-3.5 p-5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-light"
                aria-hidden="true"
              >
                <Check size={16} className="text-brand" strokeWidth={3} />
              </span>
              <span className="text-base font-medium leading-relaxed text-foreground">
                {item}
              </span>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
