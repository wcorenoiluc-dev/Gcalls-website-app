import type { LeadDeliveryResult, LeadPayload } from './types'

/**
 * Lead transport.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT CONNECTED YET
 * ---------------------------------------------------------------------------
 * This project builds to STATIC assets (`vite build`). There is no serverless
 * runtime, no Node server and no deployment target committed to the repo — so
 * there is nowhere to run code that can hold a private credential.
 *
 * Every real destination (HubSpot, Lark, n8n, a CRM) requires a secret. Putting
 * one in a `VITE_*` variable would ship it to every visitor's browser, so that
 * is not an option. The endpoint therefore stays unconfigured until a server
 * exists — see docs/LEAD_CAPTURE_ARCHITECTURE.md for the exact deployment
 * requirement and the ready-to-use handler contract.
 *
 * `VITE_LEAD_API_URL` is a PUBLIC value (an endpoint URL, not a credential).
 * When it is set, this module POSTs the normalized payload same-origin or to
 * the configured origin, and the server holds the secrets.
 * ---------------------------------------------------------------------------
 */

/** Public endpoint URL. Not a secret. Empty means "no backend yet". */
const LEAD_API_URL = import.meta.env.VITE_LEAD_API_URL ?? ''

export const LEAD_BACKEND_CONFIGURED = LEAD_API_URL.trim().length > 0

/** Endpoint path a future server must expose. */
export const LEAD_API_CONTRACT_PATH = '/api/leads'

const NOT_CONFIGURED_MESSAGE =
  'Biểu mẫu hiện chưa được kết nối hệ thống tiếp nhận. Vui lòng liên hệ Gcalls qua email hoặc hotline.'

const NETWORK_MESSAGE =
  'Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc liên hệ Gcalls qua email hoặc hotline.'

const SERVER_MESSAGE =
  'Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc liên hệ Gcalls qua email hoặc hotline.'

const REQUEST_TIMEOUT_MS = 15_000

export async function submitLead(lead: LeadPayload): Promise<LeadDeliveryResult> {
  if (!LEAD_BACKEND_CONFIGURED) {
    // Developer-facing diagnostic only. The payload is never logged in a
    // production build (see the DEV guard) and never leaves the browser.
    if (import.meta.env.DEV) {
      console.info(
        '[leads] No transport configured (VITE_LEAD_API_URL is empty). ' +
          'Lead was NOT sent. Payload shape:',
        { ...lead, name: '<redacted>', email: '<redacted>', phone: '<redacted>' },
      )
    }

    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      message: NOT_CONFIGURED_MESSAGE,
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(LEAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    })

    if (response.status === 422) {
      const body = await response.json().catch(() => ({}))
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: body?.message ?? 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.',
        fieldErrors: body?.fieldErrors,
      }
    }

    if (response.status === 501) {
      return { ok: false, code: 'NOT_CONFIGURED', message: NOT_CONFIGURED_MESSAGE }
    }

    if (!response.ok) {
      return { ok: false, code: 'SERVER_ERROR', message: SERVER_MESSAGE }
    }

    // Success is only ever declared on a confirmed 2xx from the server.
    const body = await response.json().catch(() => ({}))
    return { ok: true, leadId: body?.leadId }
  } catch {
    return { ok: false, code: 'NETWORK_ERROR', message: NETWORK_MESSAGE }
  } finally {
    clearTimeout(timeout)
  }
}
