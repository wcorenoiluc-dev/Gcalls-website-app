import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { NAV_GROUPS, type NavGroup } from '@/config/navigation'

/**
 * Desktop navigation with mega menus.
 *
 * Visual identity preserved from the approved header: same 14px medium link,
 * same #5b5f6b resting colour, same #673ab7-on-#f6f3fc hover, same pill radius
 * and panel treatment. Only the information architecture changed — six groups
 * now, each opening a multi-column panel.
 *
 * Panels in the second half of the bar are right-aligned so a wide menu never
 * runs off-screen at 1024px.
 */

const linkClass =
  'px-3 py-2 max-lg:min-h-11 xl:px-4 inline-flex items-center text-sm font-medium rounded-lg transition-colors duration-150 ' +
  'text-[#5b5f6b] hover:text-[#673ab7] hover:bg-[#f6f3fc] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]'

const activeLinkClass = 'text-[#673ab7] bg-[#f6f3fc]'

function NavDropdown({ group, alignEnd }: { group: NavGroup; alignEnd: boolean }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const allItems = group.columns.flatMap((column) => column.items)
  const containsActive =
    allItems.some((item) => item.path === pathname) ||
    group.overview?.path === pathname

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

  // Close once navigation has happened.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const multiColumn = group.columns.length > 1

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${linkClass} gap-1 ${containsActive ? activeLinkClass : ''}`}
        style={{ fontFamily: "'Open Sans', sans-serif" }}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {group.label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full pt-2 ${alignEnd ? 'right-0' : 'left-0'} ${
            multiColumn ? 'w-[520px]' : 'w-[300px]'
          }`}
          role="group"
          aria-label={group.label}
        >
          <div
            className="rounded-xl p-3"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(103,58,183,0.10)',
              boxShadow: '0 8px 32px rgba(103,58,183,0.14)',
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            {group.overview && (
              <Link
                to={group.overview.path}
                className="mb-2 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#673ab7]"
                style={{ background: '#faf9fc' }}
              >
                <span className="text-sm font-bold" style={{ color: '#673ab7' }}>
                  {group.overview.label}
                </span>
                <ArrowRight size={15} aria-hidden="true" style={{ color: '#673ab7' }} />
              </Link>
            )}

            <div className={multiColumn ? 'grid grid-cols-2 gap-x-2' : ''}>
              {group.columns.map((column, index) => (
                <div key={column.heading ?? index}>
                  {column.heading && (
                    <p
                      className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: '#9ca3af' }}
                    >
                      {column.heading}
                    </p>
                  )}

                  <ul>
                    {column.items.map((navItem) => (
                      <li key={navItem.path}>
                        <Link
                          to={navItem.path}
                          className="block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#673ab7]"
                        >
                          <span
                            className="block text-sm font-medium"
                            style={{
                              color: pathname === navItem.path ? '#673ab7' : '#1e2026',
                            }}
                          >
                            {navItem.label}
                          </span>
                          {navItem.supportingLabel && (
                            <span
                              className="mt-0.5 block text-xs"
                              style={{ color: '#673ab7' }}
                            >
                              {navItem.supportingLabel}
                            </span>
                          )}
                          {navItem.description && (
                            <span
                              className="mt-0.5 block text-xs leading-relaxed"
                              style={{ color: '#5b5f6b' }}
                            >
                              {navItem.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {group.cta && (
              <div
                className="mt-2 pt-2"
                style={{ borderTop: '1px solid rgba(103,58,183,0.10)' }}
              >
                <Link
                  to={group.cta.path}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#673ab7]"
                  style={{ color: '#673ab7' }}
                >
                  {group.cta.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function DesktopNav() {
  const half = NAV_GROUPS.length / 2

  return (
    <nav
      className="hidden md:flex items-center gap-0.5 lg:gap-1"
      aria-label="Điều hướng chính"
    >
      {NAV_GROUPS.map((group, index) => (
        <NavDropdown key={group.id} group={group} alignEnd={index >= half} />
      ))}
    </nav>
  )
}
