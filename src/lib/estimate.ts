/**
 * Estimator logic: deterministic recommendation + the price-display gate.
 *
 * ---------------------------------------------------------------------------
 * PRICE SAFETY
 * ---------------------------------------------------------------------------
 * This module is the ONLY place that decides whether the estimator may show a
 * number. It reads the single pricing configuration in `src/data/pricing.ts`;
 * it does not define rates of its own.
 *
 * `buildPriceState()` returns a numeric total only when the pricing config is
 * live AND the selected solution has approved rates AND the computed value is
 * a finite positive number. Otherwise it returns the "Chi phí theo cấu hình"
 * state. 0₫, NaN, undefined and invented placeholder prices are unreachable by
 * construction, not merely avoided by convention.
 * ---------------------------------------------------------------------------
 */

import {
  PRICING_CONFIGURED,
  SOLUTION_PRICING,
  type SolutionPricing,
} from '@/data/pricing'
import { ESTIMATOR_SOLUTIONS, type EstimatorSolution } from '@/data/estimator'

/** Raw answers keyed by field id. */
export type EstimatorAnswers = Record<
  string,
  number | string | string[] | boolean | undefined
>

/**
 * Structured result. Reusable by the quote form and, later, by a CRM payload.
 */
export interface EstimatorResultData {
  solution: string
  solutionId: string
  agents?: number
  usage?: string
  hotlines?: number
  integrations: string[]
  countries: string[]
  qaVolume?: number
  channels: string[]
  extras: string[]
  pricingStatus: 'configured' | 'not-configured'
}

export interface PriceState {
  /** True only when a real, approved, positive number is available. */
  hasPrice: boolean
  /** Display label. Never "0₫", "NaN" or "undefined". */
  label: string
  supporting: string
}

/* ------------------------------------------------------------------ *
 * Recommendation — deterministic, no hidden upsell
 * ------------------------------------------------------------------ */

export interface Recommendation {
  primary: SolutionPricing
  /** Genuinely adjacent capabilities, shown as "Có thể cân nhắc". */
  consider: SolutionPricing[]
}

const byId = (id: string) => SOLUTION_PRICING.find((s) => s.id === id)

/**
 * Maps a selection to the recommended configuration.
 *
 * Rules are explicit and readable — no scoring, no inference. Adjacent
 * products are surfaced only where the answers indicate a real need
 * (e.g. an integration selection implies a telephony layer), and are always
 * labelled as optional considerations rather than requirements.
 */
export function recommend(
  solution: EstimatorSolution,
  answers: EstimatorAnswers,
): Recommendation {
  const primary = byId(solution.pricingId) ?? SOLUTION_PRICING[0]
  const consider: SolutionPricing[] = []

  const add = (id: string) => {
    const found = byId(id)
    if (found && found.id !== primary.id && !consider.some((c) => c.id === found.id)) {
      consider.push(found)
    }
  }

  switch (solution.id) {
    case 'gcalls-plus':
      // Only when the user actually asked for CRM integration.
      if (answers.needsCrm === true) add('crm')
      break

    case 'crm':
    case 'helpdesk':
    case 'pos':
      // An integration needs a telephony layer underneath it.
      add('gcalls-plus')
      break

    case 'cx':
      if (answers.needsIntegration === true) add('crm')
      break

    case 'qa-qc':
      // QA analyses conversations that a call system produces.
      add('gcalls-plus')
      break

    case 'international':
      // Nothing implied — international numbers stand alone.
      break
  }

  return { primary, consider }
}

/* ------------------------------------------------------------------ *
 * Result assembly
 * ------------------------------------------------------------------ */

function labelFor(solution: EstimatorSolution, fieldId: string, value: string) {
  const field = solution.fields.find((f) => f.id === fieldId)
  return field?.options?.find((o) => o.value === value)?.label ?? value
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : undefined
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : []
}

export function buildResult(
  solution: EstimatorSolution,
  answers: EstimatorAnswers,
): EstimatorResultData {
  const integrations: string[] = []
  const extras: string[] = []

  for (const id of ['crmPlatform', 'helpdeskPlatform', 'posPlatform'] as const) {
    const value = answers[id]
    if (typeof value === 'string' && value) {
      integrations.push(labelFor(solution, id, value))
    }
  }
  for (const id of ['crmNeeds', 'helpdeskNeeds', 'posNeeds'] as const) {
    for (const value of asArray(answers[id])) {
      integrations.push(labelFor(solution, id, value))
    }
  }
  if (answers.needsCrm === true) integrations.push('Tích hợp CRM')
  if (answers.needsIntegration === true) integrations.push('Tích hợp hệ thống khác')

  if (answers.needsTranscript === true) extras.push('Transcript hội thoại')
  if (answers.needsSignals === true) extras.push('Phân tích từ khóa / cảm xúc')
  for (const value of asArray(answers.intlPurpose)) {
    extras.push(labelFor(solution, 'intlPurpose', value))
  }

  // Usage is expressed in whatever unit the chosen solution measures.
  const usageParts: string[] = []
  const usageFields: Array<[string, string]> = [
    ['minutes', 'phút gọi/tháng'],
    ['monthlyCalls', 'cuộc gọi/tháng'],
    ['interactions', 'tương tác/tháng'],
    ['intlMinutes', 'phút quốc tế/tháng'],
  ]
  for (const [id, unit] of usageFields) {
    const value = asNumber(answers[id])
    if (value !== undefined && value > 0) {
      usageParts.push(`${value.toLocaleString('vi-VN')} ${unit}`)
    }
  }

  return {
    solution: solution.name,
    solutionId: solution.id,
    agents: asNumber(answers.agents),
    usage: usageParts.length ? usageParts.join(' · ') : undefined,
    hotlines: asNumber(answers.hotlines) ?? asNumber(answers.intlNumbers),
    integrations,
    countries: asArray(answers.markets).map((v) => labelFor(solution, 'markets', v)),
    qaVolume: asNumber(answers.qaVolume),
    channels: asArray(answers.channels).map((v) => labelFor(solution, 'channels', v)),
    extras,
    pricingStatus: PRICING_CONFIGURED ? 'configured' : 'not-configured',
  }
}

/* ------------------------------------------------------------------ *
 * Price gate
 * ------------------------------------------------------------------ */

export const PRICE_UNAVAILABLE_LABEL = 'Chi phí theo cấu hình'
export const PRICE_UNAVAILABLE_SUPPORTING =
  'Gcalls cần xác nhận cấu hình để đưa ra báo giá phù hợp.'

/**
 * Decides what the result panel shows for cost.
 *
 * Returns a number ONLY if every gate passes. Any missing rate, disabled
 * config, non-finite value or non-positive total falls through to the
 * quote-request state.
 */
export function buildPriceState(recommendation: Recommendation): PriceState {
  const unavailable: PriceState = {
    hasPrice: false,
    label: PRICE_UNAVAILABLE_LABEL,
    supporting: PRICE_UNAVAILABLE_SUPPORTING,
  }

  if (!PRICING_CONFIGURED) return unavailable
  if (!recommendation.primary.pricingConfigured) return unavailable

  // A pricing engine plugs in here once approved rates exist. Until then there
  // is deliberately no arithmetic to run — inventing one would produce a
  // number that looks authoritative and is not.
  return unavailable
}

/** Resolve a solution by id, falling back to the first. */
export function getSolution(id: string): EstimatorSolution {
  return ESTIMATOR_SOLUTIONS.find((s) => s.id === id) ?? ESTIMATOR_SOLUTIONS[0]
}
