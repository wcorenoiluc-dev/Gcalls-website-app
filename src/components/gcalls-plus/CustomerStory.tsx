import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_STORY } from '@/data/gcallsPlus'

/**
 * Trust / customer section.
 *
 * The project holds no approved customer logo assets and no cleared public
 * case content, so this renders a clean placeholder and links to the blog
 * instead. Nothing is invented here — no metrics, quotes, results, timelines,
 * testimonials, customer counts, or unnamed "a leading enterprise" filler.
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

          <Link
            to={GP_STORY.link.path}
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {GP_STORY.link.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Card>
      </Container>
    </Section>
  )
}
