/**
 * Quote-request submission.
 *
 * ---------------------------------------------------------------------------
 * NO BACKEND EXISTS YET.
 * ---------------------------------------------------------------------------
 * There is no API, form service or CRM endpoint in this project. This module
 * is the single seam where one gets connected.
 *
 * The development implementation deliberately does NOT claim the request
 * reached Gcalls — telling a visitor their enquiry was sent when nothing was
 * transmitted would be a false statement and would lose real leads. It
 * returns `delivered: false`, and the UI says the form is ready to be
 * connected rather than "we'll be in touch".
 *
 * TODO(lead-capture): implement `submitQuoteRequest` against the chosen
 * destination and flip `delivered` to true only on a confirmed 2xx response.
 * Candidates: a form endpoint (Formspree/Basin), an internal API route, or a
 * direct CRM integration. Whichever is chosen must also:
 *   - validate server-side (client validation here is a convenience only)
 *   - protect against spam
 *   - record consent if analytics/marketing follow-up is intended
 * ---------------------------------------------------------------------------
 */

import type { EstimatorResultData } from './estimate'

export interface QuoteRequestContact {
  name: string
  company: string
  email: string
  phone: string
  note: string
}

export interface QuoteRequestPayload {
  contact: QuoteRequestContact
  /** The estimator configuration, carried through verbatim. */
  estimate: EstimatorResultData | null
  /** ISO timestamp, stamped by the caller. */
  submittedAt: string
  /** Route the request originated from. */
  source: string
}

export interface QuoteRequestOutcome {
  ok: boolean
  /**
   * True only when a backend confirmed receipt. While no backend exists this
   * is always false, and the UI must not claim the message was sent.
   */
  delivered: boolean
  message: string
}

/** Set once a real endpoint is wired up. */
export const LEAD_BACKEND_CONFIGURED = false

export async function submitQuoteRequest(
  payload: QuoteRequestPayload,
): Promise<QuoteRequestOutcome> {
  if (!LEAD_BACKEND_CONFIGURED) {
    if (import.meta.env.DEV) {
      console.info('[lead] quote request payload', payload)
    }

    return {
      ok: true,
      delivered: false,
      message: 'Biểu mẫu đã sẵn sàng để kết nối hệ thống tiếp nhận lead.',
    }
  }

  // Real implementation goes here.
  return { ok: false, delivered: false, message: '' }
}
