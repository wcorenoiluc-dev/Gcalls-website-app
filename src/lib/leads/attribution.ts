import type { LeadAttribution } from './types'

/**
 * Campaign attribution capture.
 *
 * ---------------------------------------------------------------------------
 * STORAGE BEHAVIOUR — documented because it touches visitor data
 * ---------------------------------------------------------------------------
 * UTM parameters, the landing page and the referrer are captured ONCE per
 * browser session and kept in `sessionStorage`. Rationale:
 *
 *  - sessionStorage, not cookies: no cross-site transmission, no consent
 *    banner obligation, and it disappears when the tab closes.
 *  - captured once: a visitor who arrives from an ad and then browses should
 *    still be attributed to that ad, not to the last internal page they saw.
 *  - contains NO personal data — only campaign identifiers the visitor's own
 *    URL already carried.
 * ---------------------------------------------------------------------------
 */

const STORAGE_KEY = 'gcalls:attribution'

const UTM_KEYS = [
  ['utm_source', 'utmSource'],
  ['utm_medium', 'utmMedium'],
  ['utm_campaign', 'utmCampaign'],
  ['utm_content', 'utmContent'],
  ['utm_term', 'utmTerm'],
] as const

function readStored(): LeadAttribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LeadAttribution) : null
  } catch {
    // Private mode / storage disabled — attribution is best-effort, never
    // allowed to break a form submission.
    return null
  }
}

/**
 * Captures attribution on first call of the session. Safe to call repeatedly.
 */
export function captureAttribution(): LeadAttribution {
  const existing = readStored()
  if (existing) return existing

  const attribution: LeadAttribution = {}

  try {
    const params = new URLSearchParams(window.location.search)
    for (const [param, key] of UTM_KEYS) {
      const value = params.get(param)
      if (value) attribution[key] = value.slice(0, 120)
    }

    attribution.landingPage = window.location.pathname
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      attribution.referrer = document.referrer.slice(0, 300)
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Ignore — see above.
  }

  return attribution
}

export function getAttribution(): LeadAttribution {
  return readStored() ?? captureAttribution()
}
