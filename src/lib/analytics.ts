/**
 * Analytics abstraction.
 *
 * No vendor is integrated. This is a thin, typed seam so GA4 / GTM (or any
 * other destination) can be wired in one place later without touching the
 * components that emit events.
 *
 * ---------------------------------------------------------------------------
 * NO PII, ENFORCED
 * ---------------------------------------------------------------------------
 * Analytics must never receive a name, email, phone, message or estimator
 * note. `track()` strips any key on the blocklist below and warns in
 * development, so a careless call site cannot leak personal data even by
 * accident. Only categorical context (source, intent, product, solution) is
 * allowed through.
 * ---------------------------------------------------------------------------
 *
 * TODO(analytics): implement `deliver()` against the chosen vendor. For GTM
 * that is typically `window.dataLayer.push({ event: name, ...params })`; for
 * GA4 via gtag, `window.gtag('event', name, params)`. Add consent handling
 * before enabling in production — see docs/LAUNCH_CHECKLIST.md.
 */

export type AnalyticsEvent =
  // Conversion funnel
  | 'cta_clicked'
  | 'lead_form_viewed'
  | 'lead_form_started'
  | 'lead_form_validation_error'
  | 'lead_form_submitted'
  | 'lead_form_success'
  | 'lead_form_error'
  // Estimator
  | 'estimator_started'
  | 'estimator_solution_selected'
  | 'estimator_completed'
  | 'quote_request_started'
  | 'quote_request_success'
  // Retained for compatibility with earlier call sites.
  | 'quote_request_submitted'

export type AnalyticsParams = Record<string, string | number | boolean | undefined>

/** Keys that must never reach an analytics destination. */
const PII_KEYS = new Set([
  'name',
  'fullname',
  'full_name',
  'email',
  'phone',
  'tel',
  'message',
  'note',
  'notes',
  'company',
  'address',
])

function stripPii(params?: AnalyticsParams): AnalyticsParams | undefined {
  if (!params) return undefined

  const safe: AnalyticsParams = {}
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEYS.has(key.toLowerCase())) {
      if (import.meta.env.DEV) {
        console.warn(
          `[analytics] Dropped "${key}" — personal data must not be sent to analytics.`,
        )
      }
      continue
    }
    safe[key] = value
  }
  return safe
}

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
  const safe = stripPii(params)
  buffer.push({ name, params: safe })
  deliver(name, safe)
}

/** Read the in-memory event buffer (development / testing aid). */
export function getTrackedEvents() {
  return [...buffer]
}
