import { Phone } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'

/**
 * GCALLS wordmark. Visual identity preserved exactly from the Figma Make
 * baseline; the only change is that it is now a link to home.
 */
export function Logo() {
  return (
    /* min-h-11 gives a 44px tap target without resizing the 32px mark. */
    <Link
      to={ROUTES.home}
      className="inline-flex items-center gap-2 min-h-11 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#673ab7]"
      aria-label="Gcalls — về trang chủ"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: '#673ab7' }}
      >
        <Phone size={15} color="#fff" strokeWidth={2.5} />
      </div>
      <span
        className="font-bold text-[17px] tracking-tight"
        style={{ color: '#1e2026', fontFamily: "'Open Sans', sans-serif" }}
      >
        g<span style={{ color: '#673ab7' }}>calls</span>
      </span>
    </Link>
  )
}
