import { ArrowRight, Compass } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Integration-boundary routing.
 *
 * Sends each need to the page that owns it. This is a routing table, not a
 * capability list — it exists so a visitor with a ticket-shaped or
 * multi-channel-shaped problem leaves for the right page, and so each page
 * keeps its own keyword territory instead of competing for the others'.
 *
 * The row describing the current page is marked, never rendered as a
 * self-link: a link back to the page you are already on is a dead end.
 *
 * Reusable by the other integration solution pages, which need the same table
 * with a different row marked `current`.
 */
export function IntegrationBoundaries({
  eyebrow,
  title,
  titleId,
  items,
  related,
  tinted,
}: {
  eyebrow: string
  title: string
  titleId: string
  items: readonly {
    product: string
    need: string
    path: string
    current?: boolean
  }[]
  /**
   * Adjacent flows that are worth reaching but do not belong in the routing
   * table itself — rendered as a plain inline list under the grid.
   */
  related?: { lead: string; links: readonly { label: string; path: string }[] }
  tinted?: boolean
}) {
  return (
    <Section tinted={tinted} ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<Compass size={14} aria-hidden="true" />}
          title={title}
          titleId={titleId}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <Card
              as="li"
              key={item.path}
              className={`flex h-full flex-col p-6 ${
                item.current ? 'border-brand bg-brand-light/40' : ''
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                  {item.product}
                </h3>
                {item.current && (
                  <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-bold tracking-wide text-white">
                    Trang này
                  </span>
                )}
              </div>

              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {item.need}
              </p>

              {!item.current && (
                <div className="mt-auto pt-5">
                  <Link
                    to={item.path}
                    className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Tìm hiểu {item.product}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </ul>

        {related && (
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3 text-[15px] leading-relaxed text-muted-foreground">
            {related.lead}
            {related.links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {link.label}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </p>
        )}
      </Container>
    </Section>
  )
}
