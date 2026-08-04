import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_FEATURES } from '@/data/gcallsPlus'

/**
 * Core features grid. Six cards, one per row at 390px.
 *
 * Anchor target for the hero's "Khám phá tính năng" CTA.
 */
export function GcallsPlusFeatures() {
  return (
    <Section tinted ariaLabelledBy="tinh-nang-heading" className="scroll-mt-20">
      <Container>
        <div id="tinh-nang" className="scroll-mt-24" />

        <SectionHeader
          eyebrow={GP_FEATURES.eyebrow}
          title={GP_FEATURES.h2}
          titleId="tinh-nang-heading"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GP_FEATURES.items.map((item) => (
            <Card as="li" key={item.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {item.n}
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
