/**
 * Lead capture — shared types.
 *
 * One model for every conversion surface on the site. Pages never define their
 * own lead shape or submit logic; they render `LeadForm` and pass context.
 */

/** Where the lead originated. Used for routing and reporting, never for PII. */
export type LeadSource =
  | 'contact'
  | 'consultation'
  | 'pricing'
  | 'cost_estimator'
  | 'gcalls_plus'
  | 'crm_integration'
  | 'helpdesk_integration'
  | 'pos_integration'
  | 'international'
  | 'qa_qc_center'
  | 'gcalls_cx'
  | 'other'

/** What the visitor is asking for. */
export type LeadIntent =
  | 'consultation'
  | 'quote'
  | 'product_information'
  | 'integration'
  | 'pricing'
  | 'partnership'

/** Estimator configuration carried into a quote request. */
export interface EstimatorLeadContext {
  selectedSolution: string
  agents?: number
  usage?: string
  hotlines?: number
  integrations?: string[]
  countries?: string[]
  qaVolume?: number
  qaCriteria?: number
  cxChannels?: string[]
  /** Qualitative sizing hint, e.g. "nhỏ" | "vừa" | "lớn". */
  relativeLevel?: string
  pricingStatus: 'configured' | 'not-configured'
}

/** Campaign / navigation context captured from the session. */
export interface LeadAttribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
  landingPage?: string
}

/** What the user typed. */
export interface LeadContactFields {
  name: string
  company: string
  email: string
  phone: string
  message: string
  /** Selected need, from the approved list. */
  need?: string
}

/** Fully normalized payload sent to the transport. */
export interface LeadPayload extends LeadContactFields, LeadAttribution {
  intent: LeadIntent
  source: LeadSource
  sourcePath: string
  product?: string
  solution?: string
  estimatorResult?: EstimatorLeadContext
  /** ISO 8601, stamped at submit time. */
  submittedAt: string
}

/**
 * Result contract.
 *
 * Deliberately a discriminated union rather than thrown errors: the UI must be
 * able to distinguish "not configured" from "server error" and say something
 * honest and different for each.
 */
export type LeadDeliveryResult =
  | { ok: true; leadId?: string }
  | {
      ok: false
      code: 'VALIDATION_ERROR' | 'NOT_CONFIGURED' | 'NETWORK_ERROR' | 'SERVER_ERROR'
      message: string
      /** Field-level errors, for VALIDATION_ERROR. */
      fieldErrors?: Partial<Record<keyof LeadContactFields | 'contact', string>>
    }

/**
 * Server-side delivery adapter.
 *
 * Implemented on the SERVER only — never in the browser, because every real
 * provider needs a private credential. See docs/LEAD_CAPTURE_ARCHITECTURE.md.
 */
export interface LeadProvider {
  readonly name: string
  submit(lead: LeadPayload): Promise<LeadDeliveryResult>
}

/** Approved consultation needs. No unsupported standalone products. */
export const LEAD_NEEDS = [
  'Gcalls Plus Webphone',
  'QA QC Center',
  'Gcalls CX',
  'Tích hợp CRM',
  'Tích hợp Helpdesk',
  'Tích hợp POS',
  'Tổng đài quốc tế',
  'Bảng giá',
  'Khác',
] as const

export type LeadFormVariant = 'consultation' | 'quote' | 'contact' | 'estimator'
