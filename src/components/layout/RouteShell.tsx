import { useMemo, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import {
  Card,
  Container,
  Eyebrow,
  GradientHeading,
  Section,
  SectionHeader,
} from '@/components/common/primitives'
import { FinalCtaBand } from '@/components/common/FinalCtaBand'
import { JsonLd } from '@/components/common/JsonLd'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { SITE_ORIGIN } from '@/config/seo'
import { PRIMARY_CTA, ROUTES } from '@/config/navigation'
import {
  getBreadcrumbTrail,
  getChildren,
  getEntry,
  type SitemapEntry,
} from '@/config/sitemap'

/**
 * Production-quality shell for routes whose full content is not written yet.
 *
 * Every field comes from the sitemap entry, so each shell is entity-specific
 * rather than a generic template: its own eyebrow, H1, intro and child cards.
 *
 * Deliberately NOT a "coming soon" page. A visitor who lands here gets a real
 * page: correct breadcrumb, a heading that answers what the page is about,
 * onward navigation to related destinations, and a working CTA. Build status
 * is never shown to the public — it lives in the sitemap for the team.
 */

function DestinationCards({ entries }: { entries: SitemapEntry[] }) {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Card as="li" key={entry.route} className="flex h-full flex-col p-6">
          <h3 className="text-lg font-extrabold tracking-tight text-foreground">
            {entry.label}
          </h3>
          {entry.supportingLabel && (
            <p className="mt-1 text-sm font-semibold text-brand">
              {entry.supportingLabel}
            </p>
          )}
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {entry.summary ?? entry.description}
          </p>

          <div className="mt-auto pt-5">
            <Link
              to={entry.route}
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Tìm hiểu thêm
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Card>
      ))}
    </ul>
  )
}

export function RouteShell({
  /** Extra content rendered between the intro and the destination cards. */
  children,
  /** Related routes to surface when this page has no children of its own. */
  related = [],
  /** Heading above the destination card grid. */
  childrenHeading,
}: {
  children?: ReactNode
  related?: string[]
  childrenHeading?: string
}) {
  const { pathname } = useLocation()
  const entry = getEntry(pathname)

  /**
   * BreadcrumbList — added in Checkpoint WEB-SITE-QA-001.
   *
   * `/lien-he/` and `/referral/` were the only two routes on the site that
   * rendered a visible breadcrumb and emitted no matching structured data. Both
   * render through this component, so the node is built HERE, from the same
   * `getBreadcrumbTrail(pathname)` result the `<Breadcrumb>` element below is fed
   * — the two cannot disagree, which is exactly the failure mode three product
   * pages had before this checkpoint corrected them.
   *
   * `Trang chủ` is prepended because `Breadcrumb` prepends it too (see
   * `src/components/layout/Breadcrumb.tsx`) and `getBreadcrumbTrail` drops it.
   *
   * Nothing else is emitted: a shell has no verified entity behind it, so no
   * `WebPage`, `Service` or `Product` node belongs here.
   *
   * Computed BEFORE the `!entry` guard below, because a hook cannot sit after a
   * conditional return.
   */
  const breadcrumbJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Trang chủ',
              item: `${SITE_ORIGIN}${ROUTES.home}`,
            },
            ...getBreadcrumbTrail(pathname).map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 2,
              name: crumb.label,
              item: `${SITE_ORIGIN}${crumb.route}`,
            })),
          ],
        },
      ],
    }),
    [pathname],
  )

  if (!entry) return null

  const trail = getBreadcrumbTrail(pathname)
  const breadcrumb = trail.map((crumb, index) => ({
    label: crumb.label,
    // Last crumb is the current page and must not be a link.
    path: index < trail.length - 1 ? crumb.route : undefined,
  }))

  const childEntries = getChildren(entry.route)
  const relatedEntries = related
    .map((route) => getEntry(route))
    .filter((value): value is SitemapEntry => Boolean(value))

  const cards = childEntries.length > 0 ? childEntries : relatedEntries

  return (
    <>
      <JsonLd id={`shell-${entry.id}`} data={breadcrumbJsonLd} />

      <div className="bg-brand-light/60 pt-20 sm:pt-24">
        <Container>
          <Breadcrumb trail={breadcrumb} />
        </Container>
      </div>

      {/* Page header */}
      <section
        className="w-full pt-12 pb-12 sm:pt-16 sm:pb-16"
        style={{
          background: 'linear-gradient(180deg, #f5f1fc 0%, #faf9fc 55%, #ffffff 100%)',
        }}
      >
        <Container>
          {entry.eyebrow && <Eyebrow>{entry.eyebrow}</Eyebrow>}

          <GradientHeading as="h1" className="mt-4 max-w-4xl">
            {entry.label === 'Trang chủ' ? entry.title : shellHeading(entry)}
          </GradientHeading>

          {entry.supportingLabel && (
            <p className="mt-2 text-base font-semibold text-brand sm:text-lg">
              {entry.supportingLabel}
            </p>
          )}

          {entry.intro && (
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {entry.intro}
            </p>
          )}
        </Container>
      </section>

      {children && (
        <Section>
          <Container>{children}</Container>
        </Section>
      )}

      {cards.length > 0 && (
        <Section tinted={!children}>
          <Container>
            {childrenHeading ? (
              <SectionHeader
                eyebrow="Khám phá"
                title={childrenHeading}
                titleId="shell-children"
              />
            ) : (
              <h2 id="shell-children" className="sr-only">
                Các trang liên quan
              </h2>
            )}
            <DestinationCards entries={cards} />
          </Container>
        </Section>
      )}

      <Section tinted={Boolean(children) && cards.length === 0}>
        <FinalCtaBand
          eyebrow="Bắt đầu"
          title="Cần tư vấn cấu hình phù hợp với doanh nghiệp?"
          titleId="shell-cta"
          description="Chia sẻ quy mô đội ngũ, hệ thống đang sử dụng và nhu cầu giao tiếp để Gcalls đề xuất cấu hình phù hợp."
          primary={PRIMARY_CTA}
          secondary={{ label: 'Xem bảng giá', path: ROUTES.pricing }}
          lead={{ intent: 'consultation', source: 'consultation' }}
          showPhone
        />
      </Section>
    </>
  )
}

/**
 * H1 for a shell.
 *
 * A route whose approved H1 differs from its nav label is listed explicitly.
 * Everything else uses its label, which reads correctly as a heading.
 *
 * The six navigation hubs are NOT here any more: each now has its own page
 * component (`src/pages/*HubPage.tsx`) with its own H1, because a hub reached
 * in one click from the header must not render a shell.
 */
const HUB_HEADINGS: Record<string, string> = {
  [ROUTES.contact]: 'Trao đổi với Gcalls về bài toán giao tiếp của doanh nghiệp',
}

function shellHeading(entry: SitemapEntry): string {
  return HUB_HEADINGS[entry.route] ?? entry.label
}
