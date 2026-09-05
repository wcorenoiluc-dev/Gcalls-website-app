import { History } from 'lucide-react'
import { Container, Section, SectionHeader } from '@/components/common/primitives'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { CaptureNote } from '@/components/gcalls-plus/ProductStage'
import { GP_HISTORY } from '@/data/gcallsPlus'

/**
 * Interaction history.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A SHOWCASE AND NOT A SPLIT
 * ---------------------------------------------------------------------------
 * Two reasons, both measured rather than assumed.
 *
 * 1. GEOMETRY. The previous visual was the call-history table, which is
 *    808x983 — portrait and dense. In a half-width column it rendered 560x681
 *    beside roughly 300px of copy, which is where this section's dead band
 *    came from, and it made the section the second tallest on the page.
 *
 * 2. CONTENT MATCH. The heading is about the interaction JOURNEY rather than
 *    individual calls. That is the timeline capture — chronological, each entry
 *    carrying status, duration and its recording — not the row-per-call table.
 *
 * So the timeline leads, at its full 809px intrinsic width in the centre of the
 * page, and the five approved points sit above it as a single row. The section
 * also breaks up a run of adjacent left/right splits, which the brief asks for.
 *
 * The call-history table capture is deliberately not shown here as well: it is
 * the same product surface, and repeating a surface to fill space is what the
 * media rules rule out.
 * ---------------------------------------------------------------------------
 */
export function InteractionHistory() {
  return (
    <Section ariaLabelledBy="lich-su-tuong-tac">
      <Container>
        <SectionHeader
          eyebrow={GP_HISTORY.eyebrow}
          eyebrowIcon={<History size={14} aria-hidden="true" />}
          title={GP_HISTORY.h2}
          titleId="lich-su-tuong-tac"
          lead={GP_HISTORY.description}
        />

        {/* The meaning stays live text, so it does not depend on the capture. */}
        <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {GP_HISTORY.points.map((point) => (
            <li
              key={point}
              className="rounded-full border border-brand-border bg-background px-4 py-2 text-[15px] font-semibold text-foreground"
            >
              {point}
            </li>
          ))}
        </ul>

        <figure className="mx-auto mt-8 w-full max-w-[809px]">
          <ProductScreenshot image={GCALLS_PLUS_IMAGES.timelineDesktop} />
          <figcaption>
            <CaptureNote />
          </figcaption>
        </figure>
      </Container>
    </Section>
  )
}
