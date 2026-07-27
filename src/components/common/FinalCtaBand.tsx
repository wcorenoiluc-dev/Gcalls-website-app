import { ArrowRight, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { CONTACT } from '@/config/navigation'
import { track } from '@/lib/analytics'
import { leadCtaHref, type LeadCtaContext } from '@/lib/leads/ctaLink'
import { Container } from './primitives'

/**
 * Shared closing CTA band — full-width brand gradient card, centred copy,
 * primary + secondary action.
 *
 * Mobile: full-width stacked buttons at 52px. Desktop: inline, centred.
 */
export function FinalCtaBand({
  eyebrow,
  title,
  titleId,
  description,
  primary,
  secondary,
  anchorId,
  showPhone = false,
  lead,
}: {
  eyebrow?: string
  title: string
  titleId: string
  description: string
  primary: { label: string; path: string }
  secondary?: { label: string; path: string }
  /** Optional in-page anchor target, e.g. for "Nhận báo giá" links. */
  anchorId?: string
  showPhone?: boolean
  /**
   * Conversion context. When provided, the primary CTA routes to the canonical
   * lead form carrying it, instead of a generic destination.
   */
  lead?: LeadCtaContext
}) {
  const primaryHref = lead ? leadCtaHref(lead) : primary.path
  return (
    <Container>
      <div
        id={anchorId}
        className="scroll-mt-24 rounded-[24px] px-6 py-12 text-center sm:px-10 sm:py-16"
        style={{
          backgroundImage: 'var(--brand-gradient)',
          boxShadow: '0 16px 56px rgba(103,58,183,0.28)',
        }}
      >
        {eyebrow && (
          <p className="inline-flex items-center rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wider text-white sm:text-[13px]">
            {eyebrow}
          </p>
        )}

        <h2
          id={titleId}
          className={`mx-auto max-w-2xl text-[26px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[34px] lg:text-[40px] ${
            eyebrow ? 'mt-4' : ''
          }`}
        >
          {title}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          {description}
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            to={primaryHref}
            onClick={() =>
              track('cta_clicked', {
                label: primary.label,
                source: lead?.source,
                intent: lead?.intent,
                product: lead?.product,
                solution: lead?.solution,
              })
            }
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-white px-7 text-base font-semibold text-brand transition-colors duration-150 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            {primary.label}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          {secondary && (
            <Link
              to={secondary.path}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] border border-white/45 px-7 text-base font-semibold text-white transition-colors duration-150 hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              {secondary.label}
            </Link>
          )}
        </div>

        {showPhone && (
          <a
            href={CONTACT.phoneHref}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-4 text-base font-medium text-white/90 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone size={17} aria-hidden="true" />
            {CONTACT.phone}
          </a>
        )}
      </div>
    </Container>
  )
}
