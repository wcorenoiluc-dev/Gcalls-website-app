import { useLocation } from 'react-router'
import { Mail, Phone } from 'lucide-react'
import { Card } from '@/components/common/primitives'
import { RouteShell } from '@/components/layout/RouteShell'
import { CONTACT } from '@/config/navigation'
import { LeadForm } from '@/components/lead/LeadForm'
import { parseLeadCtaContext } from '@/lib/leads/ctaLink'

/**
 * `/lien-he/` — the canonical lead route.
 *
 * Every conversion CTA on the site lands here carrying categorical context
 * (`?intent=&source=&product=`), which pre-scopes the form and records where
 * the lead came from. Nothing a visitor typed ever appears in the URL.
 *
 * `intent` and `source` are validated against typed allow-lists on parse.
 * `product` is not enumerable at parse time (pricing passes plan names), so it
 * is length-capped for use and separately allow-listed before it is ever
 * DISPLAYED — see `displayableLeadProduct`.
 *
 * The form itself is the shared `LeadForm` — this page owns no submit logic.
 */
export function ContactPage() {
  const { search } = useLocation()
  const context = parseLeadCtaContext(search)

  return (
    <RouteShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Direct contact details stay available regardless of form state. */}
        <Card className="h-fit bg-brand-light p-6 sm:p-8 lg:col-span-2">
          <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
            Liên hệ trực tiếp
          </h2>

          <ul className="mt-5 flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-[10px] text-base font-medium text-foreground transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Mail size={18} className="text-brand" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-[10px] text-base font-medium text-foreground transition-colors duration-150 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone size={18} className="text-brand" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </Card>

        <div className="lg:col-span-3">
          <LeadForm
            variant="contact"
            source={context.source ?? 'contact'}
            intent={context.intent ?? 'consultation'}
            product={context.product}
            solution={context.solution}
          />
        </div>
      </div>
    </RouteShell>
  )
}
