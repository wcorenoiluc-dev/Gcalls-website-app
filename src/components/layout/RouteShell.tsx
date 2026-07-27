import type { ReactNode } from 'react'
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
import { Breadcrumb } from '@/components/layout/Breadcrumb'
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
 * Hub pages carry an approved H1 that differs from their nav label, so those
 * are listed explicitly. Everything else uses its label, which reads correctly
 * as a heading.
 */
const HUB_HEADINGS: Record<string, string> = {
  [ROUTES.products]: 'Hệ sinh thái sản phẩm Gcalls',
  [ROUTES.solutions]: 'Giải pháp giao tiếp theo bài toán vận hành doanh nghiệp',
  [ROUTES.integrations]: 'Kết nối Gcalls với hệ thống doanh nghiệp đang sử dụng',
  [ROUTES.industries]: 'Giải pháp giao tiếp theo bối cảnh vận hành của từng ngành',
  [ROUTES.resources]: 'Kiến thức về Call Center, CRM, CX và AI',
  [ROUTES.contact]: 'Trao đổi với Gcalls về bài toán giao tiếp của doanh nghiệp',
}

function shellHeading(entry: SitemapEntry): string {
  return HUB_HEADINGS[entry.route] ?? entry.label
}
