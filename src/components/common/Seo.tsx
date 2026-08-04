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

/** Scrolls to top on route change — expected behaviour for a multi-page site. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
