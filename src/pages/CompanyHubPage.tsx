import { CONTACT } from '@/config/navigation'
import { Card, Container, Eyebrow, Section } from '@/components/common/primitives'
import { HubLayout } from '@/components/hub/HubLayout'
import { COMPANY_HUB } from '@/data/hubs'

/**
 * `/cong-ty/` — company hub.
 *
 * A corporate overview built only from what this repository can support. Years
 * in business, customer count, supported-CRM count, country coverage,
 * headcount, funding and awards are all WITHHELD — none is verified here. See
 * the company block in `src/data/hubs.ts`.
 *
 * The one hub-specific section is the contact block below: real, verifiable
 * contact details are the most credible thing this page can offer, and they
 * already exist in `src/config/navigation.ts`.
 */
export function CompanyHubPage() {
  return (
    <HubLayout content={COMPANY_HUB} trail={[{ label: 'Về Gcalls' }]}>
      <Section ariaLabelledBy="company-contact">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>LIÊN HỆ TRỰC TIẾP</Eyebrow>
            <h2
              id="company-contact"
              className="mt-4 text-[26px] font-extrabold tracking-tight text-foreground sm:text-[32px]"
            >
              Cách liên hệ với đội ngũ Gcalls
            </h2>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
            <Card as="li" className="flex h-full flex-col p-6 text-center">
              <p className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-flex min-h-11 items-center justify-center text-lg font-extrabold tracking-tight text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {CONTACT.email}
              </a>
            </Card>

            <Card as="li" className="flex h-full flex-col p-6 text-center">
              <p className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
                Điện thoại
              </p>
              <a
                href={CONTACT.phoneHref}
                className="mt-2 inline-flex min-h-11 items-center justify-center text-lg font-extrabold tracking-tight text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {CONTACT.phone}
              </a>
            </Card>
          </ul>
        </Container>
      </Section>
    </HubLayout>
  )
}
