import { getAttribution } from './attribution'
import type {
  EstimatorLeadContext,
  LeadContactFields,
  LeadIntent,
  LeadPayload,
  LeadSource,
} from './types'

/** Collapse internal whitespace and trim. */
function clean(value: string, maxLength = 2000): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

/** Preserve newlines in free text but still trim and cap length. */
function cleanMultiline(value: string, maxLength = 4000): string {
  return value
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength)
}

export interface NormalizeInput {
  fields: LeadContactFields
  intent: LeadIntent
  source: LeadSource
  sourcePath: string
  product?: string
  solution?: string
  estimatorResult?: EstimatorLeadContext
}

/**
 * Produces the canonical payload sent to the transport.
 *
 * Every form goes through this, so the server receives one consistent shape
 * regardless of which page the visitor converted on.
 */
export function normalizeLeadPayload(input: NormalizeInput): LeadPayload {
  const { fields } = input

  return {
    name: clean(fields.name, 200),
    company: clean(fields.company, 200),
    email: clean(fields.email, 200).toLowerCase(),
    phone: clean(fields.phone, 40),
    message: cleanMultiline(fields.message),
    need: fields.need ? clean(fields.need, 120) : undefined,

    intent: input.intent,
    source: input.source,
    sourcePath: input.sourcePath,
    product: input.product,
    solution: input.solution,
    estimatorResult: input.estimatorResult,

    ...getAttribution(),

    submittedAt: new Date().toISOString(),
  }
}
