import { useState } from 'react'
import { ChevronDown, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { CONTACT, FOOTER_COLUMNS } from '@/config/navigation'
import { GcallsLogo } from '@/components/brand/GcallsLogo'

/**
 * Shared site footer.
 *
 * Desktop/tablet: a 6-column grid (brand + 5 nav groups), all groups always
 * expanded — see the `md:` override in footer.css. Mobile: each nav group
 * collapses into its own accordion, first group open by default.
 *
 * Column headings use the `.gcalls-footer__*` classes in footer.css rather
 * than Tailwind utility classes. WordPress's own theme.css sets font-size/
 * line-height/font-weight directly on bare h1–h6 selectors, unlayered — and
 * per the CSS Cascade Layers spec any unlayered rule beats a layered one
 * (Tailwind's utilities) regardless of specificity. See footer.css for the
 * full explanation.
 */
export function Footer() {
  const year = new Date().getFullYear()
  const [openGroup, setOpenGroup] = useState<string | null>(FOOTER_COLUMNS[0]?.id ?? null)

  return (
    <footer
      className="w-full"
      style={{
        background: '#faf9fc',
        borderTop: '1px solid #ece8f4',
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div
        className="mx-auto px-5 py-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12"
        style={{ maxWidth: '1320px' }}
      >
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-9 gcalls-footer__grid">
          {/* Brand + contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <GcallsLogo variant="footer" />
            <p className="gcalls-footer__description mt-4 max-w-xs">
              Tổng đài chuyên nghiệp chạy trên trình duyệt cho đội Sales và CSKH.
            </p>

            <ul className="mt-5 flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="gcalls-footer__contact inline-flex min-h-[44px] items-center gap-2 rounded-lg transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                >
                  <Mail size={16} style={{ color: '#673ab7', flexShrink: 0 }} aria-hidden="true" />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="gcalls-footer__contact inline-flex min-h-[44px] items-center gap-2 rounded-lg transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                >
                  <Phone size={16} style={{ color: '#673ab7', flexShrink: 0 }} aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation columns */}
          {FOOTER_COLUMNS.map((group: (typeof FOOTER_COLUMNS)[number]) => {
            const open = openGroup === group.id
            const panelId = `footer-panel-${group.id}`
            const buttonId = `footer-button-${group.id}`

            return (
              <nav key={group.id} aria-label={group.label}>
                <h2 className="gcalls-footer__heading">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup(open ? null : group.id)}
                    className="gcalls-footer__toggle gcalls-footer__heading flex min-h-11 w-full items-center justify-between gap-2 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                  >
                    {group.label}
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`gcalls-footer__chevron flex-shrink-0 ${open ? 'is-open' : ''}`}
                      style={{ color: '#673ab7' }}
                    />
                  </button>
                </h2>
                <ul
                  id={panelId}
                  aria-labelledby={buttonId}
                  className={`gcalls-footer__links mt-4 gap-2.5 ${open ? 'is-open' : ''}`}
                >
                  {group.items.map((item: (typeof group.items)[number]) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="gcalls-footer__link inline-flex min-h-[44px] items-center rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )
          })}
        </div>

        <div
          className="mt-10 pt-6 text-sm"
          style={{ borderTop: '1px solid #ece8f4', color: '#5b5f6b' }}
        >
          © {year} Gcalls. Call smarter, grow faster.
        </div>
      </div>
    </footer>
  )
}
