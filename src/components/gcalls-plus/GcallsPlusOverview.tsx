import { Check, Layers } from 'lucide-react'
import { Container, Eyebrow, GradientHeading, Section } from '@/components/common/primitives'
import { ProductVisual } from '@/components/common/ProductVisual'
import { DashboardMain } from '@/components/product-ui'
import { GP_OVERVIEW } from '@/data/gcallsPlus'

/**
 * What Gcalls Plus is.
 *
 * Uses the Overview Activity dashboard visual. Text-left / visual-right at
 * desktop; text-then-visual in one column on mobile.
 */
export function GcallsPlusOverview() {
  return (
    <Section ariaLabelledBy="tong-quan-webphone">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow icon={<Layers size={14} aria-hidden="true" />}>
              {GP_OVERVIEW.eyebrow}
            </Eyebrow>

            <GradientHeading id="tong-quan-webphone" className="mt-4">
              {GP_OVERVIEW.h2}
            </GradientHeading>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {GP_OVERVIEW.description}
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GP_OVERVIEW.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                    aria-hidden="true"
                  >
                    <Check size={12} className="text-brand" strokeWidth={3} />
                  </span>
                  <span className="text-base leading-relaxed text-foreground">
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ProductVisual maxWidth="560px">
            <DashboardMain />
          </ProductVisual>
        </div>
      </Container>
    </Section>
  )
}
