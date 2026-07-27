import { useEffect, useRef } from 'react'
import { Phone, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import {
  COMMERCIAL_ITEMS,
  CONTACT,
  NAV_GROUPS,
  PRIMARY_CTA,
} from '@/config/navigation'

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
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="mb-4">
              <p
                className="px-4 pt-2 pb-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: '#5b5f6b' }}
              >
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className={rowClass}>
                      <span className="flex flex-col py-2">
                        <span
                          className="font-medium"
                          style={{
                            color: pathname === item.path ? '#673ab7' : '#1e2026',
                          }}
                        >
                          {item.label}
                        </span>
                        {item.supportingLabel && (
                          <span className="text-sm" style={{ color: '#5b5f6b' }}>
                            {item.supportingLabel}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mb-4">
            <p
              className="px-4 pt-2 pb-1 text-xs font-bold uppercase tracking-wider"
              style={{ color: '#5b5f6b' }}
            >
              Chi phí
            </p>
            <ul>
              {COMMERCIAL_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`${rowClass} font-medium`}>
                    <span
                      style={{
                        color: pathname === item.path ? '#673ab7' : '#1e2026',
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
