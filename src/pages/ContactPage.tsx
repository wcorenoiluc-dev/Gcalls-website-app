import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { Section } from '@/components/common/primitives'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { JsonLd } from '@/components/common/JsonLd'
import { LeadForm } from '@/components/lead/LeadForm'
import { ContactInfoPanel } from '@/components/contact/ContactInfoPanel'
import { ROUTES } from '@/config/navigation'
import { getBreadcrumbTrail, getEntry } from '@/config/sitemap'
import { SITE_ORIGIN } from '@/config/seo'
import { parseLeadCtaContext } from '@/lib/leads/ctaLink'

/**
 * `/lien-he/` — the canonical lead route.
 *
 * A dedicated two-column contact layout (left: purpose + direct channels; right:
 * the shared lead form) rather than the generic `RouteShell`, so the page has one
 * H1, no eyebrow/heading duplication and no generic closing CTA band repeating
 * the contact intent.
 *
 * Copy is not authored here: the H1 is the approved sitemap label and the lead
 * paragraph is the approved `intro`. SEO/title/meta come from the app-level
 * <Seo/> (pathname-driven), so dropping RouteShell does not change them.
 *
 * The form is the shared `LeadForm` — this page owns no submit logic and shows a
 * success state only if that transport returns one (there is no backend, so it
 * cannot on this route). Attribution reaching the URL is validated by
 * `parseLeadCtaContext`; nothing a visitor typed is ever placed in the URL or DOM.
 */
export function ContactPage() {
  const { search } = useLocation()
  const context = parseLeadCtaContext(search)
  const entry = getEntry(ROUTES.contact)
  const intro =
    entry?.intro ??
    'Chia sẻ nhu cầu hiện tại để đội ngũ Gcalls có thêm thông tin trước khi trao đổi cùng doanh nghiệp.'

  const trail = getBreadcrumbTrail(ROUTES.contact)
  const breadcrumb = trail.map((crumb, index) => ({
    label: crumb.label,
    path: index < trail.length - 1 ? crumb.route : undefined,
  }))

  const breadcrumbJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_ORIGIN}${ROUTES.home}` },
            ...trail.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 2,
              name: crumb.label,
              item: `${SITE_ORIGIN}${crumb.route}`,
            })),
          ],
        },
      ],
    }),
    [trail],
  )

  return (
    <>
      <JsonLd id="contact" data={breadcrumbJsonLd} />

      {/* Page-local 1180 container (visual contract) instead of the shared 1280
          Container, so no ancestor exceeds 1180 on this route. */}
      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <div className="mx-auto w-full max-w-[1180px] px-5 lg:px-8">
          <Breadcrumb trail={breadcrumb} />
        </div>
      </div>

      <Section>
        <div className="mx-auto w-full max-w-[1180px] px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Left ~40% — purpose + direct channels; first in DOM so mobile
                reads contact-then-form. */}
            <div className="lg:col-span-2">
              <ContactInfoPanel intro={intro} product={context.product} />
            </div>

            {/* Right ~60% — the shared lead form in its own panel. */}
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
        </div>
      </Section>
    </>
  )
}
