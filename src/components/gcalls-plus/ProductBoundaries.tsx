import { ArrowRight, Check, Compass } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_BOUNDARIES } from '@/data/gcallsPlus'

/**
 * Product boundaries — what Gcalls Plus is for, and where each adjacent need
 * actually belongs.
 *
 * This is the page's most important semantic section. The right-hand cards
 * exist so no reader concludes Gcalls Plus performs deep CRM workflow,
 * omnichannel, AI conversation QA and international calling itself: each is
 * named as a different Gcalls product and linked to the route that owns it.
 * Keep the framing "khi nhu cầu mở rộng" — never "Gcalls Plus also does this".
 */
export function ProductBoundaries() {
  return (
    <Section tinted ariaLabelledBy="pham-vi-phu-hop">
      <Container>
        <SectionHeader
          eyebrow={GP_BOUNDARIES.eyebrow}
          eyebrowIcon={<Compass size={14} aria-hidden="true" />}
          title={GP_BOUNDARIES.h2}
          titleId="pham-vi-phu-hop"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Group A — fit */}
          <Card highlighted className="flex h-full flex-col p-6 sm:p-8">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-brand">
              {GP_BOUNDARIES.fitTitle}
            </h3>

            <ul className="mt-5 flex flex-col gap-3">
              {GP_BOUNDARIES.fitItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                    aria-hidden="true"
                  >
                    <Check size={12} className="text-brand" strokeWidth={3} />
                  </span>
                  <span className="text-base leading-relaxed text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Group B — hand-off to the product that owns each need */}
          <div className="flex h-full flex-col">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
              {GP_BOUNDARIES.expandTitle}
            </h3>

            <ul className="mt-5 flex flex-col gap-3">
              {GP_BOUNDARIES.expandItems.map((item) => (
                <Card as="li" key={item.solution} className="p-5">
                  <Link
                    to={item.path}
                    className="group flex min-h-11 items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] leading-snug text-muted-foreground">
                        {item.need}
                      </span>
                      <span className="mt-1 block text-base font-bold leading-snug text-brand group-hover:underline">
                        {item.solution}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-brand"
                    />
                  </Link>
                </Card>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
