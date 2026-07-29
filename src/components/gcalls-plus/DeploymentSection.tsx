import { Rocket } from 'lucide-react'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { GP_DEPLOYMENT } from '@/data/gcallsPlus'

/**
 * Deployment steps.
 *
 * No absolute timeframe or effort promise appears anywhere. "Cài đặt trong 30
 * phút" and "Không cần IT" are explicitly unapproved (P01-B §13/§24); instead
 * the lead paragraph states plainly that timing depends on configuration.
 */
export function DeploymentSection() {
  return (
    <Section tinted ariaLabelledBy="trien-khai">
      <Container>
        <SectionHeader
          eyebrow={GP_DEPLOYMENT.eyebrow}
          eyebrowIcon={<Rocket size={14} aria-hidden="true" />}
          title={GP_DEPLOYMENT.h2}
          titleId="trien-khai"
          lead={GP_DEPLOYMENT.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GP_DEPLOYMENT.steps.map((step) => (
            <Card as="li" key={step.n} className="flex h-full flex-col p-6">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">
                {step.title}
              </h3>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
