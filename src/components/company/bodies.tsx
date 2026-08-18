import { ArrowRight, Info, Layers, ScrollText, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Card, Container, Section, SectionHeader } from '@/components/common/primitives'
import { CompanyLinkList, INLINE_LINK } from './sections'
import type { CustomersContent, PartnersContent } from '@/data/company/types'

/**
 * The page-specific bodies for Customers and Partners.
 *
 * These are the sections that must NOT be shared. An operational profile, a
 * prospective partnership category and a conditional collaboration model carry
 * different information, and collapsing them into one card component would
 * flatten two pages into one.
 *
 * Presentation only — all copy comes from `src/data/company/*`.
 */

/* ── Customers: operational profiles ─────────────────────────────────────── */

/**
 * The five operational profiles.
 *
 * This is what stands in place of a customer logo wall. Each card describes how
 * a team WORKS, never who it is — which is both the useful thing for a visitor
 * comparing themselves and the only version that requires nobody's permission.
 */
export function CustomerProfileSection({
  content,
  tinted = false,
}: {
  content: CustomersContent
  tinted?: boolean
}) {
  const { profiles } = content

  return (
    <Section tinted={tinted} ariaLabelledBy={`${content.id}-profiles`}>
      <Container>
        <div id={profiles.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={profiles.eyebrow}
          eyebrowIcon={<Layers size={14} aria-hidden="true" />}
          title={profiles.h2}
          titleId={`${content.id}-profiles`}
          lead={profiles.description}
        />

        <ol className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {profiles.items.map((profile) => (
            <Card as="li" key={profile.id} className="flex h-full flex-col p-6">
              <div id={profile.id} className="scroll-mt-24" />

              <div className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-base font-extrabold text-brand"
                  aria-hidden="true"
                >
                  {profile.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                    {profile.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {profile.detail}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Dấu hiệu nhận biết
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {profile.signals.map((signal) => (
                  <li
                    key={signal}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    {signal}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                  Trang liên quan
                </p>
                <CompanyLinkList links={profile.links} />
              </div>
            </Card>
          ))}
        </ol>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {profiles.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Customers: publication standard ─────────────────────────────────────── */

/**
 * Why the page carries no names or logos.
 *
 * `methodologyLink` is a `<Link>` rather than an `<a>` on purpose: it points at
 * another route AND a fragment (`/tai-nguyen/case-studies/#tieu-chuan-bang-chung`),
 * which only resolves because `ScrollManager` waits for the lazy target to
 * render. A plain `<a>` would full-page reload and lose that.
 */
export function CustomerEvidenceSection({ content }: { content: CustomersContent }) {
  const { evidenceStandard } = content

  return (
    <Section ariaLabelledBy={`${content.id}-evidence`}>
      <Container>
        <SectionHeader
          eyebrow={evidenceStandard.eyebrow}
          eyebrowIcon={<ShieldCheck size={14} aria-hidden="true" />}
          title={evidenceStandard.h2}
          titleId={`${content.id}-evidence`}
          lead={evidenceStandard.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {evidenceStandard.items.map((item) => (
            <Card as="li" key={item.title} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {item.detail}
              </p>
            </Card>
          ))}
        </ul>

        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3">
          <Link to={evidenceStandard.methodologyLink.path} className={INLINE_LINK}>
            {evidenceStandard.methodologyLink.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <p className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
            <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            {evidenceStandard.note}
          </p>
        </div>
      </Container>
    </Section>
  )
}

/* ── Partners: prospective categories ────────────────────────────────────── */

/**
 * The six prospective partnership categories.
 *
 * `examples` render as descriptions of a KIND of organisation and are plain
 * text, never links and never styled as names — a category card that looked
 * like a directory entry is exactly the fabrication this page exists to avoid.
 */
export function PartnerCategorySection({
  content,
  tinted = false,
}: {
  content: PartnersContent
  tinted?: boolean
}) {
  const { categories } = content

  return (
    <Section tinted={tinted} ariaLabelledBy={`${content.id}-categories`}>
      <Container>
        <div id={categories.anchorId} className="scroll-mt-24" />

        <SectionHeader
          eyebrow={categories.eyebrow}
          eyebrowIcon={<Layers size={14} aria-hidden="true" />}
          title={categories.h2}
          titleId={`${content.id}-categories`}
          lead={categories.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.items.map((category) => (
            <Card as="li" key={category.id} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {category.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {category.detail}
              </p>

              <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                Loại tổ chức
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {category.examples.map((example) => (
                  <li
                    key={example}
                    className="flex items-start gap-2 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    {example}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="mt-5 text-[13px] font-bold uppercase tracking-wider text-brand">
                  Trang liên quan
                </p>
                <CompanyLinkList links={category.links} />
              </div>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {categories.note}
        </p>
      </Container>
    </Section>
  )
}

/* ── Partners: conditional collaboration models ──────────────────────────── */

/**
 * The six collaboration models.
 *
 * Every card renders its `availability` line in a distinct block, because that
 * line is the difference between describing a model and offering it. The type
 * makes the field required so a card cannot ship without its condition.
 */
export function PartnerModelSection({ content }: { content: PartnersContent }) {
  const { models } = content

  return (
    <Section ariaLabelledBy={`${content.id}-models`}>
      <Container>
        <SectionHeader
          eyebrow={models.eyebrow}
          eyebrowIcon={<ScrollText size={14} aria-hidden="true" />}
          title={models.h2}
          titleId={`${content.id}-models`}
          lead={models.description}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.items.map((model) => (
            <Card as="li" key={model.title} className="flex h-full flex-col p-6">
              <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                {model.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {model.detail}
              </p>

              <div className="mt-auto pt-5">
                <div className="rounded-[10px] border border-brand-border bg-surface-alt p-4">
                  <p className="text-[13px] font-bold uppercase tracking-wider text-brand">
                    Điều kiện áp dụng
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {model.availability}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </ul>

        <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 text-[15px] leading-relaxed text-muted-foreground">
          <Info size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          {models.note}
        </p>
      </Container>
    </Section>
  )
}
