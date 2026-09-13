import type { ReactNode } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Container, Eyebrow, GradientHeading } from '@/components/common/primitives'
import { CtaLink } from '@/components/common/Button'

/**
 * Hero for an integration page. Props-driven so Helpdesk and POS reuse it.
 *
 * Text first in DOM order → text-then-visual on mobile, two columns at `lg`.
 * Carries the page's single H1.
 */
export function IntegrationHero({
  eyebrow,
  title,
  description,
  keyPoints,
  primaryCta,
  secondaryCta,
  visual,
}: {
  eyebrow: string
  title: string
  description: string
  keyPoints: readonly string[]
  primaryCta: { label: string; path: string }
  secondaryCta: { label: string; href: string }
  visual: ReactNode
}) {
  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {title}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {keyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
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

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <CtaLink to={primaryCta.path} variant="primary" fullWidth>
                {primaryCta.label}
              </CtaLink>

              <CtaLink to={secondaryCta.href} variant="outline" fullWidth>
                {secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </CtaLink>
            </div>
          </div>

          {visual}
        </div>
      </Container>
    </section>
  )
}
