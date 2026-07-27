import type { ReactNode } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { Breadcrumb, type Crumb } from './Breadcrumb'
import { CONTACT, PRIMARY_CTA } from '@/config/navigation'

/**
 * Shared shell for every non-home route.
 *
 * Checkpoint 2 builds the *structure* of these pages only: breadcrumb, H1, a
 * short statement of the page's approved purpose, and the closing CTA. Real
 * page content lands in later checkpoints.
 *
 * Mobile-first by construction: single column, 16px body text, full-width
 * CTAs below `sm`, no fixed widths.
 */

interface PageShellProps {
  /** Small kicker above the H1 (e.g. "Sản phẩm"). */
  eyebrow?: string
  title: string
  /** Optional supporting product label, e.g. "QC Bot AI" under "QA QC Center". */
  supportingLabel?: string
  /** One or two sentences describing the approved purpose of this page. */
  intro: string
  breadcrumb: Crumb[]
  /** Page-specific content rendered between the intro and the closing CTA. */
  children?: ReactNode
}

export function PageShell({
  eyebrow,
  title,
  supportingLabel,
  intro,
  breadcrumb,
  children,
}: PageShellProps) {
  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Header area */}
      <section
        className="w-full pt-24 pb-10 sm:pt-28 sm:pb-14"
        style={{
          background: 'linear-gradient(180deg, #f6f3fc 0%, #ffffff 100%)',
          borderBottom: '1px solid rgba(103,58,183,0.10)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Breadcrumb trail={breadcrumb} />

          {eyebrow && (
            <p
              className="mt-6 text-xs font-bold uppercase tracking-wider"
              style={{ color: '#673ab7' }}
            >
              {eyebrow}
            </p>
          )}

          <h1
            className="mt-3 text-[28px] leading-tight sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
            style={{ color: '#1e2026' }}
          >
            {title}
          </h1>

          {supportingLabel && (
            <p className="mt-2 text-base sm:text-lg font-medium" style={{ color: '#673ab7' }}>
              {supportingLabel}
            </p>
          )}

          <p
            className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: '#5b5f6b' }}
          >
            {intro}
          </p>
        </div>
      </section>

      {/* Page body */}
      {children && (
        <section className="w-full py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">{children}</div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div
            className="rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
            style={{
              background: '#673ab7',
              boxShadow: '0 8px 40px rgba(103,58,183,0.24)',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#ffffff' }}>
              Cần tư vấn giải pháp phù hợp?
            </h2>
            <p
              className="mt-3 max-w-xl text-base sm:text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              Đội ngũ Gcalls sẽ trao đổi để hiểu nhu cầu và đề xuất phương án triển khai
              cho doanh nghiệp của bạn.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                to={PRIMARY_CTA.path}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-7 rounded-xl text-base font-semibold transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: '#ffffff', color: '#673ab7' }}
              >
                {PRIMARY_CTA.label}
                <ArrowRight size={18} />
              </Link>

              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-7 rounded-xl text-base font-semibold transition-colors duration-150 hover:bg-[rgba(255,255,255,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}
              >
                <Phone size={18} />
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Development-only marker so an unfinished shell is never mistaken for
 * finished content. Renders nothing in a production build.
 */
export function DevStatusNote({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV) return null

  return (
    <p
      className="text-sm leading-relaxed rounded-xl px-4 py-3"
      style={{
        background: '#f6f3fc',
        color: '#5b5f6b',
        border: '1px dashed rgba(103,58,183,0.32)',
      }}
    >
      <span className="font-semibold" style={{ color: '#673ab7' }}>
        Đang phát triển ·{' '}
      </span>
      {children}
    </p>
  )
}
