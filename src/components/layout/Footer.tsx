import { Mail, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { CONTACT, FOOTER_GROUPS } from '@/config/navigation'
import { Logo } from '@/components/navigation/Logo'

/**
 * Shared site footer.
 *
 * The Figma Make baseline had no footer at all. This is deliberately minimal:
 * navigation columns plus the approved contact details. No legal, company or
 * social links are invented here — add them only once approved.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="w-full"
      style={{
        background: '#faf8fd',
        borderTop: '1px solid rgba(103,58,183,0.10)',
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand + contact */}
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#5b5f6b' }}>
              Tổng đài chuyên nghiệp chạy trên trình duyệt cho đội Sales và CSKH.
            </p>

            <ul className="mt-5 flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm rounded-lg transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                  style={{ color: '#1e2026' }}
                >
                  <Mail size={16} style={{ color: '#673ab7' }} />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm rounded-lg transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                  style={{ color: '#1e2026' }}
                >
                  <Phone size={16} style={{ color: '#673ab7' }} />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation columns */}
          {FOOTER_GROUPS.map((group) => (
            <nav key={group.id} aria-label={group.label}>
              <h2
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: '#1e2026' }}
              >
                {group.label}
              </h2>
              <ul className="mt-4 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="inline-flex items-center min-h-[44px] text-sm rounded-lg transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                      style={{ color: '#5b5f6b' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-10 pt-6 text-sm"
          style={{ borderTop: '1px solid rgba(103,58,183,0.10)', color: '#5b5f6b' }}
        >
          © {year} Gcalls. Call smarter, grow faster.
        </div>
      </div>
    </footer>
  )
}
