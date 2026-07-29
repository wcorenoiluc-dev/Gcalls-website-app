import { ArrowRight, Target } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_USE_CASES } from '@/data/gcallsPlus'

/**
 * Use cases. Neutral descriptions only — no industry-specific results,
 * outcomes or figures are claimed.
 *
 * Two cards carry a contextual link to the matching industry route. The link
 * only renders where the approved content defines one — this is not a place to
 * add links for their own sake.
 */
export function UseCases() {
  return (
    <Section ariaLabelledBy="phu-hop-voi">
      <Container>
        <SectionHeader
          eyebrow={GP_USE_CASES.eyebrow}
          eyebrowIcon={<Target size={14} aria-hidden="true" />}
          title={GP_USE_CASES.h2}
          titleId="phu-hop-voi"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GP_USE_CASES.items.map((item) => (
            <Card as="li" key={item.role} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {item.role}
              </h3>
              <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              {'link' in item && item.link && (
                <Link
                  to={item.link.path}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {item.link.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </Card>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
