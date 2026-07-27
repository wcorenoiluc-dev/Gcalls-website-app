import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { NAV_GROUPS, type NavGroup } from '@/config/navigation'

/**
 * Desktop navigation.
 *
 * Visual identity preserved from the Figma Make baseline: same 14px medium
 * link, same #5b5f6b resting colour, same #673ab7-on-#f6f3fc hover treatment,
 * same pill radius.
 *
 * Two behavioural changes, both correctness fixes rather than redesign:
 *  - hover states moved from imperative onMouseEnter/onMouseLeave handlers to
 *    CSS, so they also fire on keyboard focus;
 *  - the five dead `href="#"` links are replaced by the real route IA, which
 *    needs two dropdown groups.
 */

const linkClass =
  // max-lg:min-h-11 gives a 44px target in the tablet touch range; the
  // desktop (lg+) appearance is untouched.
  'px-4 py-2 max-lg:min-h-11 inline-flex items-center text-sm font-medium rounded-lg transition-colors duration-150 ' +
  'text-[#5b5f6b] hover:text-[#673ab7] hover:bg-[#f6f3fc] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]'

const activeLinkClass = 'text-[#673ab7] bg-[#f6f3fc]'

function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const containsActive = group.items.some((item) => item.path === pathname)

  // Close when focus or pointer leaves the group, and on Escape.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // Close the panel once navigation has happened.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${linkClass} inline-flex items-center gap-1 ${
          containsActive ? activeLinkClass : ''
        }`}
        style={{ fontFamily: "'Open Sans', sans-serif" }}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {group.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full pt-2 min-w-[248px] max-w-[320px]"
          role="group"
          aria-label={group.label}
        >
          <div
            className="rounded-xl p-2 flex flex-col"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(103,58,183,0.10)',
              boxShadow: '0 8px 32px rgba(103,58,183,0.14)',
            }}
          >
            {group.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                <span
                  className="block text-sm font-medium"
                  style={{ color: pathname === item.path ? '#673ab7' : '#1e2026' }}
                >
                  {item.label}
                </span>
                {item.supportingLabel && (
                  <span className="block text-xs mt-0.5" style={{ color: '#5b5f6b' }}>
                    {item.supportingLabel}
                  </span>
                )}
                {item.description && (
                  <span
                    className="block text-xs mt-1 leading-relaxed"
                    style={{ color: '#5b5f6b' }}
                  >
                    {item.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
      {NAV_GROUPS.map((group) => (
        <NavDropdown key={group.id} group={group} />
      ))}
    </nav>
  )
}
