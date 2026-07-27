import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Phone, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { CONTACT, NAV_GROUPS, PRIMARY_CTA } from '@/config/navigation'

/**
 * Mobile navigation panel.
 *
 * The Figma Make baseline tracked a `mobileOpen` state and swapped the toggle
 * icon, but never rendered a panel — mobile visitors had zero navigation.
 * This is that missing panel.
 *
 * Accessibility / usability contract (Checkpoint 2, §11 and §19):
 *  - real route links, grouped Products / Solutions / Commercial
 *  - every interactive row is >= 48px tall (target was >= 44px)
 *  - 16px link text (mobile readability floor)
 *  - Escape closes; closes automatically after navigation
 *  - focus moves into the panel on open and returns to the toggle on close
 *  - focus is trapped while open; background scroll and interaction blocked
 *  - `aria-modal` dialog semantics
 *  - no horizontal overflow at 390px
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  /** Toggle button, so focus can be restored to it on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Groups are expandable (Checkpoint 3B). The group containing the current
  // route starts open so a visitor sees where they are; otherwise the first
  // group is open so the panel is never entirely collapsed.
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const active = NAV_GROUPS.find((g) =>
      g.columns.some((c) => c.items.some((i) => i.path === pathname)),
    )
    return [active?.id ?? NAV_GROUPS[0].id]
  })

  const toggleGroup = (id: string) =>
    setOpenGroups((current) =>
      current.includes(id) ? current.filter((g) => g !== id) : [...current, id],
    )

  // Close after navigating to a new route.
  useEffect(() => {
    if (open) onClose()
    // Intentionally keyed on pathname only: this must fire on navigation,
    // not when `open` itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Escape to close + focus trap.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // Move focus into the panel on open; restore it to the toggle on close.
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    } else {
      triggerRef.current?.focus()
    }
    // triggerRef is a stable ref object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const rowClass =
    'flex items-center min-h-[48px] px-4 rounded-xl text-base transition-colors ' +
    'duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 ' +
    'focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]'

  return (
    <div className="md:hidden fixed inset-0 z-[60]" role="presentation">
      {/* Backdrop — blocks interaction with the page behind. */}
      <button
        type="button"
        className="absolute inset-0 w-full h-full"
        style={{ background: 'rgba(30,32,38,0.45)' }}
        aria-label="Đóng menu"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className="absolute top-0 right-0 left-0 max-h-full overflow-y-auto overflow-x-hidden"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid rgba(103,58,183,0.10)',
          boxShadow: '0 8px 32px rgba(103,58,183,0.16)',
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {/* Panel header mirrors the site header so the transition is seamless. */}
        <div className="h-16 px-5 flex items-center justify-between">
          <span className="text-base font-semibold" style={{ color: '#1e2026' }}>
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{ color: '#673ab7' }}
            aria-label="Đóng menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-3 pb-5">
          {NAV_GROUPS.map((group) => {
            const groupOpen = openGroups.includes(group.id)
            const panelId = `mobile-group-${group.id}`
            const buttonId = `mobile-group-button-${group.id}`

            return (
              <div key={group.id} className="mb-2">
                {/* Expandable section header. 48px+ tap target. */}
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={groupOpen}
                    aria-controls={panelId}
                    onClick={() => toggleGroup(group.id)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl px-4 text-left transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#673ab7]"
                  >
                    <span
                      className="text-base font-semibold"
                      style={{ color: '#1e2026' }}
                    >
                      {group.label}
                    </span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 transition-transform duration-200 ${
                        groupOpen ? 'rotate-180' : ''
                      }`}
                      style={{ color: '#673ab7' }}
                    />
                  </button>
                </h3>

                {groupOpen && (
                  <div id={panelId} aria-labelledby={buttonId} className="pb-1 pl-2">
                    {group.overview && (
                      <Link to={group.overview.path} className={`${rowClass} font-semibold`}>
                        <span style={{ color: '#673ab7' }}>{group.overview.label}</span>
                      </Link>
                    )}

                    {group.columns.map((column, columnIndex) => (
                      <div key={column.heading ?? columnIndex}>
                        {column.heading && (
                          <p
                            className="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wider"
                            style={{ color: '#9ca3af' }}
                          >
                            {column.heading}
                          </p>
                        )}
                        <ul>
                          {column.items.map((navItem) => (
                            <li key={navItem.path}>
                              <Link to={navItem.path} className={rowClass}>
                                <span className="flex flex-col py-2">
                                  <span
                                    className="font-medium"
                                    style={{
                                      color:
                                        pathname === navItem.path ? '#673ab7' : '#1e2026',
                                    }}
                                  >
                                    {navItem.label}
                                  </span>
                                  {navItem.supportingLabel && (
                                    <span className="text-sm" style={{ color: '#673ab7' }}>
                                      {navItem.supportingLabel}
                                    </span>
                                  )}
                                  {navItem.description && (
                                    <span
                                      className="text-sm leading-relaxed"
                                      style={{ color: '#5b5f6b' }}
                                    >
                                      {navItem.description}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Primary CTA — full width on mobile. */}
          <div className="px-1 pt-2">
            <Link
              to={PRIMARY_CTA.path}
              className="flex items-center justify-center gap-2 w-full min-h-[52px] rounded-xl text-base font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              style={{
                background: '#673ab7',
                color: '#ffffff',
                boxShadow: '0 2px 16px rgba(103,58,183,0.28)',
              }}
            >
              {PRIMARY_CTA.label}
            </Link>

            <a
              href={CONTACT.phoneHref}
              className="flex items-center justify-center gap-2 w-full min-h-[48px] mt-2 rounded-xl text-base font-medium transition-colors duration-150 hover:bg-[#f6f3fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
              style={{ color: '#673ab7', border: '1px solid rgba(103,58,183,0.24)' }}
            >
              <Phone size={16} />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
