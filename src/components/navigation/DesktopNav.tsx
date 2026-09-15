import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { NAV_GROUPS, type NavGroup } from '@/config/navigation'

/**
 * Desktop navigation with mega menus.
 *
 * Visual identity preserved from the approved header: same 14px medium link,
 * same #5b5f6b resting colour, same #673ab7-on-#f6f3fc hover, same pill radius
 * and panel treatment.
 *
 * INTERACTION CONTRACT (React Shell 0.3.4 — "missing mega menu" recovery)
 *
 * 0.3.3 kept a per-dropdown `open` boolean that both `onMouseEnter` and
 * `onClick` wrote to. A real pointer always hovers the button before it
 * clicks, so hover set `open = true` and the click that followed toggled it
 * straight back to `false`: the panel flashed for the ~100ms between
 * mousemove and mouseup and every genuine click "did nothing". Automation
 * that dispatches a bare `click` (no hover) opened it fine, which is why the
 * defect was never caught locally.
 *
 * Now:
 *  - exactly one group can be open — state lives in <DesktopNav>, not in
 *    each dropdown;
 *  - hover opens a panel "unpinned"; leaving the group closes an unpinned
 *    panel; a CLICK pins the panel open, a second click on the same button
 *    closes it — a click can never undo a hover-open;
 *  - the opening click cannot bubble into the outside-pointerdown listener,
 *    because that listener ignores any pointerdown inside the <nav>;
 *  - Escape closes and returns focus to the button; ArrowDown opens and moves
 *    focus to the first link; Enter/Space are the button's native click;
 *  - the panel is always in the DOM (`hidden` when closed) so `aria-controls`
 *    always points at a real, unique element and Tab walks its links only
 *    while it is open;
 *  - the button carries `aria-expanded` from the single source of truth, and
 *    stays visually highlighted while its panel is open or contains the
 *    current route.
 *
 * Panels in the second half of the bar are right-aligned so a wide menu never
 * runs off-screen at 1024px.
 */

const linkClass =
  'px-3 py-2 max-lg:min-h-11 xl:px-4 inline-flex items-center text-sm font-medium rounded-lg transition-colors duration-150 ' +
  'text-[#5b5f6b] hover:text-[#673ab7] hover:bg-[#f6f3fc] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]'

const activeLinkClass = 'text-[#673ab7] bg-[#f6f3fc]'

const desktopMenuPanelId = (groupId: string) => `desktop-menu-${groupId}`
const desktopMenuButtonId = (groupId: string) => `desktop-menu-button-${groupId}`

interface NavDropdownProps {
  group: NavGroup
  alignEnd: boolean
  open: boolean
  /** Panel was opened by click/keyboard (survives pointer-leave). */
  pinned: boolean
  /** Open by pointer hover (closes again on pointer leave unless pinned). */
  onHoverOpen: () => void
  onHoverLeave: () => void
  /** Open and pin (click / keyboard). */
  onPinOpen: (focusFirstItem: boolean) => void
  onClose: (restoreFocus: boolean) => void
  buttonRef: (node: HTMLButtonElement | null) => void
}

function NavDropdown({
  group,
  alignEnd,
  open,
  pinned,
  onHoverOpen,
  onHoverLeave,
  onPinOpen,
  onClose,
  buttonRef,
}: NavDropdownProps) {
  const { pathname } = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)

  const allItems = group.columns.flatMap((column) => column.items)
  const containsActive =
    allItems.some((item) => item.path === pathname) ||
    group.overview?.path === pathname

  const panelId = desktopMenuPanelId(group.id)
  const buttonId = desktopMenuButtonId(group.id)
  const multiColumn = group.columns.length > 1

  const onButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      onPinOpen(true)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      onClose(true)
    }
  }

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    onClose(true)
  }

  // ArrowDown → focus the first link once the panel is visible.
  useEffect(() => {
    if (!open || !panelRef.current) return
    if (panelRef.current.dataset.focusFirst !== 'true') return
    panelRef.current.dataset.focusFirst = 'false'
    panelRef.current.querySelector<HTMLElement>('a[href]')?.focus()
  }, [open])

  return (
    <div
      className="relative"
      data-nav-group={group.id}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onHoverOpen()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') onHoverLeave()
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        id={buttonId}
        className={`${linkClass} gap-1 ${open || containsActive ? activeLinkClass : ''}`}
        style={{ fontFamily: "'Open Sans', sans-serif" }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        data-state={open ? 'open' : 'closed'}
        onClick={() => {
          // A click on an already-open panel closes it ONLY if that panel
          // was pinned by a previous click/keyboard; if it is merely
          // hover-open, the click pins it (never closes it).
          if (open && pinned) onClose(false)
          else onPinOpen(false)
        }}
        onKeyDown={onButtonKeyDown}
      >
        {group.label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className={`absolute top-full z-50 pt-2 ${alignEnd ? 'right-0' : 'left-0'} ${
          multiColumn ? 'w-[520px] max-lg:w-[440px]' : 'w-[300px]'
        } max-lg:left-1/2 max-lg:right-auto max-lg:-translate-x-1/2`}
        role="group"
        aria-labelledby={buttonId}
        data-gcalls-mega-menu={group.id}
        onKeyDown={onPanelKeyDown}
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
              data-menu-overview
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
                        data-menu-item
                        aria-current={pathname === navItem.path ? 'page' : undefined}
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
                          <span className="mt-0.5 block text-xs" style={{ color: '#673ab7' }}>
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
            <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(103,58,183,0.10)' }}>
              <Link
                to={group.cta.path}
                data-menu-cta
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
    </div>
  )
}

export function DesktopNav() {
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  // A pinned panel was opened by click/keyboard and ignores pointer-leave.
  const [pinned, setPinned] = useState(false)
  // Mirrors for event handlers that must not close over stale state.
  const openIdRef = useRef<string | null>(null)
  const pinnedRef = useRef(false)
  openIdRef.current = openId
  pinnedRef.current = pinned

  const close = useCallback((restoreFocus: boolean) => {
    if (restoreFocus && openIdRef.current) buttonRefs.current[openIdRef.current]?.focus()
    setOpenId(null)
    setPinned(false)
  }, [])

  // Close once navigation has happened.
  useEffect(() => {
    setOpenId(null)
    setPinned(false)
  }, [pathname])

  // Outside pointerdown closes. Anything inside the <nav> — including the
  // button whose click is about to open a panel — is ignored, so the opening
  // click can never be swallowed by this listener.
  useEffect(() => {
    if (!openId) return
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return
      close(false)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (navRef.current?.contains(event.target as Node)) return
      close(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [openId, close])

  const half = NAV_GROUPS.length / 2

  return (
    <nav
      ref={navRef}
      className="hidden md:flex items-center gap-0.5 lg:gap-1"
      aria-label="Điều hướng chính"
      data-gcalls-desktop-nav
    >
      {NAV_GROUPS.map((group, index) => (
        <NavDropdown
          key={group.id}
          group={group}
          alignEnd={index >= half}
          open={openId === group.id}
          pinned={openId === group.id && pinned}
          buttonRef={(node) => {
            buttonRefs.current[group.id] = node
          }}
          onHoverOpen={() => {
            if (openIdRef.current === group.id) return
            // Hovering another group while one is pinned moves to it, unpinned.
            setOpenId(group.id)
            setPinned(false)
          }}
          onHoverLeave={() => {
            if (pinnedRef.current) return
            if (openIdRef.current !== group.id) return
            setOpenId(null)
          }}
          onPinOpen={(focusFirstItem) => {
            const panel = document.getElementById(desktopMenuPanelId(group.id))
            if (panel) panel.dataset.focusFirst = focusFirstItem ? 'true' : 'false'
            if (focusFirstItem && openIdRef.current === group.id) {
              // Already open: the effect will not re-run, focus directly.
              panel?.querySelector<HTMLElement>('a[href]')?.focus()
            }
            setOpenId(group.id)
            setPinned(true)
          }}
          onClose={close}
        />
      ))}
    </nav>
  )
}
