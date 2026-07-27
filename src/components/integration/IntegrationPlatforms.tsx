import { ArrowRight, Info, Plug } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'

/**
 * Supported-platform cards.
 *
 * Names only — no vendor logos are rendered, since using third-party marks
 * implies a partnership or certification that has not been verified here.
 *
 * The `note` below the grid is required, not decorative: it states that
 * capabilities can differ per platform, which prevents the grid from reading
 * as "everything works identically everywhere".
 */
export function IntegrationPlatforms({
  title,
  titleId,
  eyebrow = 'Hệ sinh thái',
  platforms,
  note,
  cta,
}: {
  title: string
  titleId: string
  eyebrow?: string
  platforms: readonly { id: string; name: string; detail: string }[]
  note: string
  cta: { label: string; path: string }
}) {
  return (
    <Section tinted ariaLabelledBy={titleId}>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          eyebrowIcon={<Plug size={14} aria-hidden="true" />}
          title={title}
          titleId={titleId}
        />

        {/* One per row at 390px, two from sm — never a cramped 4-up on mobile. */}
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform) => (
            <Card as="li" key={platform.id} className="flex h-full flex-col p-6">
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {platform.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {platform.detail}
              </p>

              <div className="mt-auto pt-5">
                <Link
                  to={cta.path}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand underline-offset-4 transition-colors duration-150 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {cta.label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-6 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {note}
        </p>
      </Container>
    </Section>
  )
}
