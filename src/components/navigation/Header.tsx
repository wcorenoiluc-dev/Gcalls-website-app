import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, X } from 'lucide-react'
import { Link } from 'react-router'
import { PRIMARY_CTA } from '@/config/navigation'
import { DesktopNav } from './DesktopNav'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

/**
 * Site header. Extracted from the `NavBar` in the Figma Make monolith with
 * its visual design preserved exactly: fixed position, translucent white with
 * a 16px backdrop blur, purple hairline border, and a shadow that appears
 * once the page is scrolled.
 *
 * Functional changes:
 *  - dead `href="#"` links replaced with real routes (see config/navigation)
 *  - the mobile toggle now opens an actual panel
 *  - toggle grown to a 44x44 tap target (was ~38px)
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(103,58,183,0.10)',
          boxShadow: scrolled ? '0 1px 12px rgba(103,58,183,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Logo />

          <DesktopNav />

          <div className="flex items-center gap-3">
            <Link
              to={PRIMARY_CTA.path}
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 hover:bg-[#5929a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              style={{
                background: '#673ab7',
                color: '#fff',
                fontFamily: "'Open Sans', sans-serif",
                boxShadow: '0 2px 16px rgba(103,58,183,0.28)',
              }}
            >
              {PRIMARY_CTA.label}
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              onClick={() => setMobileOpen((value) => !value)}
              style={{ color: '#673ab7' }}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {mobileOpen ? <X size={22} /> : <MoreHorizontal size={22} />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        triggerRef={toggleRef}
      />
    </>
  )
}
