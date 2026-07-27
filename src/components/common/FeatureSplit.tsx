import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { Container, Eyebrow, GradientHeading, Section } from '@/components/common/primitives'

/**
 * Reusable text + product-visual split used by the interaction-history,
 * customer-context, performance and integration sections.
 *
 * Content always precedes the visual in DOM order, so mobile reads
 * text-then-visual. `reverse` only swaps the columns from `lg` up, which keeps
 * the desktop rhythm alternating without disturbing the mobile order.
 *
 * The `points` list exists so the section's marketing meaning is live text
 * outside the screenshot (brief §7) — a reader who never looks at the mockup
 * still gets the message.
 */
export function FeatureSplit({
  eyebrow,
  eyebrowIcon,
  title,
  titleId,
  description,
  points,
  visual,
  reverse = false,
  tinted = false,
  children,
}: {
  eyebrow: string
  eyebrowIcon?: ReactNode
  title: string
  titleId: string
  description: string
  points?: readonly string[]
  visual: ReactNode
  reverse?: boolean
  tinted?: boolean
  children?: ReactNode
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className={reverse ? 'lg:order-2' : ''}>
            <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>

            <GradientHeading id={titleId} className="mt-4">
              {title}
            </GradientHeading>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            {points && (
              <ul className="mt-7 flex flex-col gap-3">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light"
                      aria-hidden="true"
                    >
                      <Check size={12} className="text-brand" strokeWidth={3} />
                    </span>
                    <span className="text-base leading-relaxed text-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {children}
          </div>

          <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
        </div>
      </Container>
    </Section>
  )
}
