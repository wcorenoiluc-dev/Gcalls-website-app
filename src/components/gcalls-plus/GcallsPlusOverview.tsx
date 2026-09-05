import { Check, Layers } from 'lucide-react'
import { Container, Eyebrow, GradientHeading, Section } from '@/components/common/primitives'
import { ProductScreenshot } from '@/components/common/ProductScreenshot'
import { GCALLS_PLUS_IMAGES } from '@/data/productImages'
import { Stage } from '@/components/gcalls-plus/ProductStage'
import { GP_OVERVIEW } from '@/data/gcallsPlus'

/**
 * What Gcalls Plus is.
 *
 * The visual is the real activity console — contact groups, the activity
 * filter and the call log on one screen — captured from the product and masked
 * before it entered the repo.
 *
 * It replaces `DashboardMain`, a drawn mockup that rendered invented customer
 * names, invented phone numbers and invented KPI tiles ("84 cuộc gọi hôm nay",
 * "73% tỷ lệ nghe máy", "11 đã chốt deal", each with a trend arrow). A caption
 * calling that illustrative does not make it safe to show: the brief forbids
 * inventing customers, phone numbers and KPIs at all, and forbids redrawing an
 * interface when a real capture of it exists. One does.
 *
 * Text-left / visual-right at desktop; text-then-visual in one column below.
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

          <Stage maxWidth="560px">
            <ProductScreenshot image={GCALLS_PLUS_IMAGES.overviewActivityDesktop} />
          </Stage>
        </div>
      </Container>
    </Section>
  )
}
