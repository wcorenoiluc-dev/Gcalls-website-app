import { AlertCircle } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_PROBLEMS } from '@/data/gcallsPlus'

/**
 * Business problems.
 *
 * Numbered pain cards, no percentages or efficiency figures attached — none
 * is approved (source doc §14).
 */
export function GcallsPlusProblems() {
  return (
    <Section tinted ariaLabelledBy="bai-toan">
      <Container>
        <SectionHeader
          eyebrow={GP_PROBLEMS.eyebrow}
          eyebrowIcon={<AlertCircle size={14} aria-hidden="true" />}
          title={GP_PROBLEMS.h2}
          titleId="bai-toan"
          lead={GP_PROBLEMS.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {GP_PROBLEMS.items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full gap-4 p-6">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {item.n}
              </span>
              <p className="self-center text-base leading-relaxed text-foreground">
                {item.text}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
