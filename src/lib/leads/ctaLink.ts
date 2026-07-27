import { ROUTES } from '@/config/navigation'
import type { LeadIntent, LeadSource } from './types'

/**
 * Builds a contextual link to the canonical lead route.
 *
 * Conversion CTAs across the site route to `/lien-he/` carrying categorical
 * context so the form arrives pre-scoped and the lead records where it came
 * from. This is Option A from the brief — a dedicated page rather than a modal
 * — because the site already has a canonical contact route, it needs no new
 * overlay machinery, and it is the better mobile experience at 390px.
 *
 * ONLY non-sensitive, categorical values go in the query string. Never a name,
 * email, phone, message or anything a visitor typed.
 */
export interface LeadCtaContext {
  intent?: LeadIntent
  source?: LeadSource
  /** Approved product label, e.g. "Gcalls Plus Webphone". */
  product?: string
  /** Approved solution label, e.g. "Tích hợp CRM". */
  solution?: string
}

export function leadCtaHref(context: LeadCtaContext = {}): string {
  const params = new URLSearchParams()

  if (context.intent) params.set('intent', context.intent)
  if (context.source) params.set('source', context.source)
  if (context.product) params.set('product', context.product)
  if (context.solution) params.set('solution', context.solution)

  const query = params.toString()
  return query ? `${ROUTES.contact}?${query}` : ROUTES.contact
}

const VALID_INTENTS: LeadIntent[] = [
  'consultation',
  'quote',
  'product_information',
  'integration',
  'pricing',
  'partnership',
]

const VALID_SOURCES: LeadSource[] = [
  'contact',
  'consultation',
  'pricing',
  'cost_estimator',
  'gcalls_plus',
  'crm_integration',
  'helpdesk_integration',
  'pos_integration',
  'international',
  'qa_qc_center',
  'gcalls_cx',
  'other',
]

/**
 * Reads CTA context back off the URL.
 *
 * Values are validated against the allow-lists above, so a crafted query
 * string cannot inject arbitrary text into the lead record or the page.
 */
export function parseLeadCtaContext(search: string): LeadCtaContext {
  const params = new URLSearchParams(search)

  const intent = params.get('intent') as LeadIntent | null
  const source = params.get('source') as LeadSource | null
  const product = params.get('product')
  const solution = params.get('solution')

  return {
    intent: intent && VALID_INTENTS.includes(intent) ? intent : undefined,
    source: source && VALID_SOURCES.includes(source) ? source : undefined,
    product: product ? product.slice(0, 80) : undefined,
    solution: solution ? solution.slice(0, 80) : undefined,
  }
}
