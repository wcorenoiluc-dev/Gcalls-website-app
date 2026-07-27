import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { Container, Eyebrow, GradientHeading } from '@/components/common/primitives'
import { ProductVisualWithSupport } from '@/components/common/ProductVisual'
import { CRMMockup, SoftphoneMockup } from '@/components/product-ui'
import { GP_HERO } from '@/data/gcallsPlus'

/**
 * Page hero. Carries the page's single H1.
 *
 * Visual composition per brief §3:
 *   MAIN     Contact Profile (+ keypad, inside the mockup)
 *   SUPPORT  Active Call
 * Desktop shows both, supporting card overlapping. Mobile stacks them — one
 * main visual, then the supporting card below. Never 3–4 floating screenshots.
 *
 * Content order is text-first, visual-second at every breakpoint.
 */
export function GcallsPlusHero() {
  return (
    <section
      className="w-full pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      style={{
        background:
          'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Text first in DOM order → first on mobile. */}
          <div>
            <Eyebrow>{GP_HERO.eyebrow}</Eyebrow>

            <GradientHeading as="h1" className="mt-5">
              {GP_HERO.h1}
            </GradientHeading>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {GP_HERO.description}
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {GP_HERO.keyPoints.map((point) => (
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
              <Link
                to={GP_HERO.primaryCta.path}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-7 text-base font-semibold text-white shadow-[0_2px_16px_rgba(103,58,183,0.28)] transition-colors duration-150 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {GP_HERO.primaryCta.label}
              </Link>

              <a
                href={GP_HERO.secondaryCta.href}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border-2 border-brand bg-background px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                {GP_HERO.secondaryCta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Visual second. */}
          <ProductVisualWithSupport
            main={<CRMMockup />}
            support={<SoftphoneMockup />}
            mainMaxWidth="580px"
          />
        </div>
      </Container>
    </section>
  )
}
