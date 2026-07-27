/**
 * Lead capture pipeline.
 *
 *   CTA → LeadForm → normalizeLeadPayload → validateLead → submitLead
 *       → transport → LeadDeliveryResult → analytics
 *
 * Pages import from here and never implement their own submit logic.
 */

export * from './types'
export { validateLead, isValid, type LeadFieldErrors } from './validation'
export { normalizeLeadPayload, type NormalizeInput } from './normalize'
export { captureAttribution, getAttribution } from './attribution'
export {
  submitLead,
  LEAD_BACKEND_CONFIGURED,
  LEAD_API_CONTRACT_PATH,
} from './submitLead'
