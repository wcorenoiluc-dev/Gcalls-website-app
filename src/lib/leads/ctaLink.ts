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
  /**
   * The specific offering the visitor was looking at — an approved product
   * label ("Gcalls Plus Webphone"), or, on a platform integration page, the
   * platform itself ("HubSpot"). Categorical, never free text from a visitor.
   */
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
  'demo',
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
 * Product labels that may be RENDERED back to the visitor.
 *
 * `intent` and `source` are typed unions validated above, but `product` is a
 * free-form string in the URL — it has to be, because the pricing and estimator
 * surfaces pass a selected plan or solution name through it. That is harmless
 * while the value is only used to prefill a select and tag analytics, but the
 * moment it is DISPLAYED an arbitrary `?product=` would let a crafted link put
 * attacker-chosen text on a gcalls.co page. React escapes markup, so this is
 * content spoofing rather than XSS — still not something to ship.
 *
 * So display is gated on this map. Anything unrecognised renders nothing instead
 * of rendering itself. Keys are the labels actually passed by `src/data/*` CTA
 * contexts plus the pricing plan and solution names.
 *
 * The VALUE is what the visitor reads, which is why several keys map to a
 * different string: internal labels like `CRM Integration` are English
 * engineering names and must not surface on a Vietnamese page. Mapping them to
 * their approved Vietnamese label also makes them match the pre-selected
 * "Nhu cầu", so those pages show nothing rather than the same words twice.
 *
 * Adding a new product CTA label? Add it here too, or its page will silently
 * lose the confirmation line.
 */
const PRODUCT_DISPLAY_LABELS: Readonly<Record<string, string>> = {
  // Platform integration pages
  HubSpot: 'HubSpot',
  Salesforce: 'Salesforce',
  'Zoho CRM': 'Zoho CRM',
  Freshdesk: 'Freshdesk',
  // Products
  'Gcalls Plus': 'Gcalls Plus',
  'Gcalls Plus Webphone': 'Gcalls Plus Webphone',
  'Gcalls CX': 'Gcalls CX',
  'QA QC Center': 'QA QC Center',
  // Solutions — English internal labels mapped to their approved Vietnamese one
  'CRM Integration': 'Tích hợp CRM',
  'Helpdesk Integration': 'Tích hợp Helpdesk',
  'POS Integration': 'Tích hợp POS',
  'International Calling': 'Tổng đài quốc tế',
  'Tích hợp CRM': 'Tích hợp CRM',
  'Tích hợp Helpdesk': 'Tích hợp Helpdesk',
  'Tích hợp POS': 'Tích hợp POS',
  'Tổng đài quốc tế': 'Tổng đài quốc tế',
  'Bảng giá': 'Bảng giá',
  // Pricing plan names
  Startup: 'Gói Startup',
  Business: 'Gói Business',
  Professional: 'Gói Professional',
  Enterprise: 'Gói Enterprise',
}

/**
 * What to show the visitor for `product`, or undefined if it must not be shown.
 *
 * Deliberately separate from `parseLeadCtaContext`: narrowing the parsed value
 * would change which products prefill the form and reach analytics. This only
 * gates RENDERING, so existing behaviour is untouched.
 */
export function displayableLeadProduct(product?: string): string | undefined {
  return product ? PRODUCT_DISPLAY_LABELS[product] : undefined
}

/**
 * Reads CTA context back off the URL.
 *
 * `intent` and `source` are validated against the allow-lists above. `product`
 * and `solution` are categorical by construction but NOT enumerable here (see
 * `DISPLAYABLE_PRODUCTS`), so they are length-capped only and must never be
 * rendered without passing through `displayableLeadProduct`.
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
