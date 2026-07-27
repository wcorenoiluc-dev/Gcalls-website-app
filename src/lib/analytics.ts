/**
 * Analytics abstraction.
 *
 * No vendor is integrated. This is a thin, typed seam so GA4 / GTM (or any
 * other destination) can be wired in one place later without touching the
 * components that emit events.
 *
 * TODO(analytics): implement `deliver()` against the chosen vendor. For GTM
 * that is typically `window.dataLayer.push({ event: name, ...params })`; for
 * GA4 via gtag, `window.gtag('event', name, params)`. Add consent handling
 * before enabling in production — see docs/LAUNCH_CHECKLIST.md.
 */

export type AnalyticsEvent =
  | 'estimator_started'
  | 'estimator_solution_selected'
  | 'estimator_completed'
  | 'quote_request_started'
  | 'quote_request_submitted'

export type AnalyticsParams = Record<string, string | number | boolean | undefined>

/** Events recorded this session — useful for local verification. */
const buffer: Array<{ name: AnalyticsEvent; params?: AnalyticsParams }> = []

function deliver(name: AnalyticsEvent, params?: AnalyticsParams): void {
  // Intentionally a no-op in production until a vendor is connected. Emitting
  // to a non-existent dataLayer would silently drop events and give a false
  // impression that tracking works.
  if (import.meta.env.DEV) {
    console.info('[analytics]', name, params ?? {})
  }
}

export function track(name: AnalyticsEvent, params?: AnalyticsParams): void {
  buffer.push({ name, params })
  deliver(name, params)
}

/** Read the in-memory event buffer (development / testing aid). */
export function getTrackedEvents() {
  return [...buffer]
}
