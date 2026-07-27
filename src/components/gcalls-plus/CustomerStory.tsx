import { Quote } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_STORY } from '@/data/gcallsPlus'

/**
 * Customer story.
 *
 * No approved public case content exists, so this renders a clean placeholder.
 * Per the brief nothing is invented here — no metrics, quotes, results,
 * timelines or testimonials, and no unnamed "a leading enterprise" filler.
 */
export function CustomerStory() {
  return (
    <Section tinted ariaLabelledBy="cau-chuyen-khach-hang">
      <Container>
        <SectionHeader
          eyebrow={GP_STORY.eyebrow}
          eyebrowIcon={<Quote size={14} aria-hidden="true" />}
          title={GP_STORY.h2}
          titleId="cau-chuyen-khach-hang"
        />

        <Card className="mx-auto mt-10 flex max-w-2xl flex-col items-center px-6 py-12 text-center sm:px-10">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light"
            aria-hidden="true"
          >
            <Quote size={20} className="text-brand" />
          </span>

          <p className="mt-5 text-lg font-bold text-foreground sm:text-xl">
            {GP_STORY.placeholder}
          </p>

          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            {GP_STORY.placeholderNote}
          </p>
        </Card>
      </Container>
    </Section>
  )
}
