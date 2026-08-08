import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  DEFAULT_OG_TYPE,
  buildRobots,
  SITE_LOCALE,
  SITE_NAME,
  buildCanonical,
  buildTitle,
  getPageMeta,
} from '@/config/seo'

/**
 * Applies per-route document metadata.
 *
 * Deliberately dependency-free: a client SPA can only set head tags after
 * hydration anyway, so a library would add weight without adding capability.
 * If SSR is adopted (see the SSR/SPA decision in the audit), this component
 * is the single place that changes.
 */
function upsertMeta(
  selector: string,
  attrs: Record<string, string>,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getPageMeta(pathname)
    const title = buildTitle(meta)
    const canonical = buildCanonical(pathname)

    document.title = title
    document.documentElement.lang = 'vi'

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: meta.description,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: buildRobots(pathname),
    })

    upsertLink('canonical', canonical)

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: DEFAULT_OG_TYPE,
    })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    })
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: SITE_LOCALE,
    })

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    })
  }, [pathname])

  return null
}

/* ------------------------------------------------------------------------ *
 * Scroll restoration and fragment navigation
 * ------------------------------------------------------------------------ */

/**
 * Minimum gap between the sticky header and an anchor target, used only when a
 * target declares no `scroll-margin-top` of its own.
 */
const MIN_ANCHOR_GAP = 16

/**
 * Safety cap on waiting for a lazy route's anchor target.
 *
 * This is NOT the mechanism — a `MutationObserver` is, so the scroll happens on
 * the frame the target appears rather than after a guessed delay. This only
 * stops the observer from living forever when the hash names an element that
 * will never exist (a stale or hand-typed URL).
 */
const HASH_TARGET_TIMEOUT_MS = 4000

/**
 * Frame budget for settling on an anchor.
 *
 * The alignment below re-measures and corrects on each animation frame instead
 * of scrolling once and hoping. That is what makes it survive the two things
 * that actually break fragment navigation in this app: a route commit that
 * cancels an in-flight scroll, and content above the target changing height as
 * the rest of the new route paints. ~20 frames is a third of a second at 60fps
 * and the loop exits as soon as the target is stable, so the budget is a
 * backstop rather than a delay anyone waits out.
 */
const SETTLE_FRAMES = 20

/**
 * Where the target should sit below the viewport top.
 *
 * Prefers the target's own `scroll-margin-top` — the site's `scroll-mt-24`
 * convention already encodes the answer there — and falls back to the measured
 * header height, so a new anchor cannot land underneath the fixed header just
 * because someone forgot the class.
 */
function anchorOffset(element: HTMLElement): number {
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
  const declared = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
  return Math.max(declared, headerHeight + MIN_ANCHOR_GAP)
}

/**
 * Scroll behaviour on navigation.
 *
 * Without a hash this is the plain scroll-to-top a multi-page site is expected
 * to do. With one it resolves the fragment, which the browser cannot do on its
 * own here: every route is lazy, so on a direct load of `/…/glossary/#webphone`
 * the native fragment scroll runs against a document that does not yet contain
 * the target, and the previous unconditional `scrollTo(0, 0)` then overrode
 * whatever the browser had managed.
 *
 * Two mechanisms, both render-aware rather than timed:
 *
 *  1. A `MutationObserver` waits for the target to exist. It fires on the frame
 *     the lazy chunk commits, so nothing guesses how long a chunk takes.
 *  2. The scroll itself is applied SYNCHRONOUSLY the moment the target exists,
 *     then re-corrected on a short `requestAnimationFrame` loop until it holds
 *     position. The synchronous pass is what actually has to work; the frames
 *     only clean up after content above the target settles at a different
 *     height. Ordering it this way matters, because `requestAnimationFrame`
 *     does not fire in a hidden or backgrounded tab — a frames-only design
 *     silently does nothing there, which is how the first version of this fix
 *     passed review and still failed.
 *
 * All scrolling is instant. Smooth behaviour was tried and removed: it is
 * driven by the same frame pipeline and is therefore dropped outright when a
 * route commit or a background tab interrupts it. Instant is also the honest
 * answer for `prefers-reduced-motion`, which this satisfies unconditionally
 * rather than by branching on a media query.
 *
 * Same-page `<a href="#id">` clicks are deliberately NOT handled here. They do
 * not change the router location, the browser scrolls them natively against a
 * fully painted page, and `scroll-mt-24` already gives the right offset — so
 * this effect never runs for them and cannot fight the native scroll.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = decodeURIComponent(hash.slice(1))

    let cancelled = false
    let frame = 0
    let observer: MutationObserver | null = null
    let timer = 0

    const stopWaiting = () => {
      observer?.disconnect()
      observer = null
      window.clearTimeout(timer)
    }

    /**
     * Move the target to its offset. Relative, so it converges even as the
     * document height changes underneath it. Returns true once in position.
     */
    const step = (): boolean => {
      const element = document.getElementById(id)
      if (!element) return false

      const delta = element.getBoundingClientRect().top - anchorOffset(element)
      if (Math.abs(delta) <= 1) return true

      window.scrollBy({ top: delta, behavior: 'auto' })
      return false
    }

    /** Apply immediately, then correct over a bounded number of frames. */
    const align = () => {
      step()

      let frames = 0
      let stable = 0

      const tick = () => {
        if (cancelled) return

        if (step()) stable += 1
        else stable = 0

        frames += 1
        if (stable < 2 && frames < SETTLE_FRAMES) {
          frame = requestAnimationFrame(tick)
        }
      }

      frame = requestAnimationFrame(tick)
    }

    if (document.getElementById(id)) {
      align()
    } else {
      // Start at the top so a route arrived at from elsewhere never opens
      // mid-page while the target is still on its way.
      window.scrollTo(0, 0)

      observer = new MutationObserver(() => {
        if (!document.getElementById(id)) return
        stopWaiting()
        align()
      })
      observer.observe(document.body, { childList: true, subtree: true })

      // Only a backstop for a hash naming an element that will never exist.
      timer = window.setTimeout(stopWaiting, HASH_TARGET_TIMEOUT_MS)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      stopWaiting()
    }
  }, [pathname, hash])

  return null
}
