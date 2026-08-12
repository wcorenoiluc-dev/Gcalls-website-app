/**
 * Homepage operational-loss estimator.
 *
 * Scope: the HOMEPAGE ONLY. This is deliberately NOT `src/lib/estimate.ts` —
 * that module prices a Gcalls deployment and feeds `/uoc-tinh-chi-phi/`. This
 * one answers a different question ("what might disjointed operations be
 * costing us today?") from inputs the visitor supplies about their own team,
 * and it must never be read as a Gcalls saving figure. See DISCLAIMER below,
 * which is rendered with every result.
 *
 * ---------------------------------------------------------------------------
 * THE OUTPUT IS AN ESTIMATE, NOT A CLAIM
 * ---------------------------------------------------------------------------
 * Every number here is derived arithmetically from values the VISITOR typed,
 * under assumptions the visitor selected. Nothing is measured, benchmarked or
 * evidenced by Gcalls, so no wording around this widget may promise a saving,
 * a payback period or a performance outcome.
 * ---------------------------------------------------------------------------
 */

export interface LossEstimateInput {
  /** Head-count doing the manual work. */
  employees: number
  /** Fully-loaded monthly cost per person, VND. */
  monthlySalary: number
  /** Minutes per person per day spent on manual handling. */
  wastedMinutesPerDay: number
  /** Share of work redone because of errors, as a percentage (0–50). */
  errorRatePercent: number
  /** Working days per month. */
  workingDays: number
  /** Working hours per day. */
  workingHoursPerDay: number
}

export interface LossEstimateResult {
  /** Cost of one working hour for one person, VND. */
  hourlyCost: number
  /** Hours per month lost to manual handling across the team. */
  manualHours: number
  /** Additional hours from rework. */
  reworkHours: number
  /** manualHours + reworkHours. */
  totalLostHours: number
  /** totalLostHours × hourlyCost, VND — unrounded. */
  estimatedLoss: number
  /** totalLostHours rounded to the nearest hour, for display. */
  displayHours: number
  /** estimatedLoss rounded to the nearest 100,000 VND, for display. */
  displayLoss: number
}

/** A single numeric field's bounds and starting value. */
export interface FieldBounds {
  min: number
  max: number
  step: number
  default: number
}

/**
 * Bounds for every input.
 *
 * These are guard rails, not opinions: they stop a typo (or a pasted value)
 * from producing an absurd headline figure that reads as a Gcalls claim.
 */
export const LOSS_FIELDS = {
  employees: { min: 1, max: 500, step: 1, default: 10 },
  monthlySalary: { min: 1_000_000, max: 200_000_000, step: 500_000, default: 12_000_000 },
  wastedMinutesPerDay: { min: 0, max: 480, step: 5, default: 60 },
  errorRatePercent: { min: 0, max: 50, step: 1, default: 5 },
  workingDays: { min: 1, max: 31, step: 1, default: 22 },
  workingHoursPerDay: { min: 1, max: 16, step: 1, default: 8 },
} as const satisfies Record<keyof LossEstimateInput, FieldBounds>

export type LossFieldKey = keyof typeof LOSS_FIELDS

export const DEFAULT_LOSS_INPUT: LossEstimateInput = {
  employees: LOSS_FIELDS.employees.default,
  monthlySalary: LOSS_FIELDS.monthlySalary.default,
  wastedMinutesPerDay: LOSS_FIELDS.wastedMinutesPerDay.default,
  errorRatePercent: LOSS_FIELDS.errorRatePercent.default,
  workingDays: LOSS_FIELDS.workingDays.default,
  workingHoursPerDay: LOSS_FIELDS.workingHoursPerDay.default,
}

/**
 * Coerce anything a text input can produce into a usable number.
 *
 * An `<input type="number">` yields `""` while being edited and `NaN` from
 * `Number("")`-style parses, and a paste can carry a value far outside the
 * slider range. Falling back to the field default (rather than 0) keeps the
 * result meaningful while the visitor is mid-edit.
 */
export function clampField(key: LossFieldKey, value: number): number {
  const field = LOSS_FIELDS[key]
  if (!Number.isFinite(value)) return field.default
  return Math.min(field.max, Math.max(field.min, value))
}

/** Clamp a whole input object — the single entry point before calculating. */
export function normalizeLossInput(input: LossEstimateInput): LossEstimateInput {
  return {
    employees: clampField('employees', input.employees),
    monthlySalary: clampField('monthlySalary', input.monthlySalary),
    wastedMinutesPerDay: clampField('wastedMinutesPerDay', input.wastedMinutesPerDay),
    errorRatePercent: clampField('errorRatePercent', input.errorRatePercent),
    workingDays: clampField('workingDays', input.workingDays),
    workingHoursPerDay: clampField('workingHoursPerDay', input.workingHoursPerDay),
  }
}

/**
 * Round half-up to a step, immune to binary floating-point representation error.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT JUST `Math.round(value / step) * step`
 * ---------------------------------------------------------------------------
 * The default input set lands exactly on a rounding tie. Mathematically:
 *
 *   hourlyCost    = 12,000,000 / 176 = 68,181.81…
 *   totalLostHours = 231
 *   estimatedLoss  = 15,750,000   ← exactly half of a 100,000 step
 *
 * Neither 12,000,000/176 nor 231 × that quotient is representable in binary
 * doubles, so JavaScript computes 15,749,999.999999998. Dividing by 100,000
 * gives 157.49999999999997, and `Math.round` — which rounds half UP but has no
 * idea this value *is* a half — returned 157, printing 15.700.000 ₫ where the
 * arithmetic says 15.800.000 ₫. An error of one full display step, produced by
 * an error of 2×10⁻⁹ in the input.
 *
 * `toPrecision(12)` collapses that ~10⁻¹⁶ relative noise before the comparison,
 * restoring the tie so half-up can act on it. Twelve significant digits is
 * chosen deliberately: it is far coarser than double precision (~15–17 digits,
 * so all representation noise is absorbed) and far finer than any difference
 * this widget can legitimately display (the smallest step is 100,000 VND
 * against a ceiling in the low billions — six significant digits of headroom).
 *
 * This affects DISPLAY ONLY. `estimatedLoss` and `totalLostHours` are returned
 * unrounded, and `hourlyCost` is never rounded before being multiplied — the
 * approved formula runs end to end at full precision.
 * ---------------------------------------------------------------------------
 */
export function roundHalfUpToStep(value: number, step: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.round(Number((value / step).toPrecision(12))) * step
}

/**
 * The approved formula, verbatim:
 *
 *   hourlyCost      = monthlySalary / (workingDays × workingHoursPerDay)
 *   manualHours     = employees × workingDays × wastedMinutesPerDay / 60
 *   reworkHours     = manualHours × errorRate
 *   totalLostHours  = manualHours + reworkHours
 *   estimatedLoss   = totalLostHours × hourlyCost
 *
 * Every intermediate stays unrounded — no floor, no truncation, no early
 * rounding of `hourlyCost`. `workingDays` and `workingHoursPerDay` are clamped
 * to a minimum of 1 above, so the division cannot produce Infinity, and the
 * clamps guarantee finite inputs so no result can be NaN.
 */
export function calculateLoss(rawInput: LossEstimateInput): LossEstimateResult {
  const input = normalizeLossInput(rawInput)

  const hourlyCost = input.monthlySalary / (input.workingDays * input.workingHoursPerDay)
  const manualHours =
    (input.employees * input.workingDays * input.wastedMinutesPerDay) / 60
  const reworkHours = manualHours * (input.errorRatePercent / 100)
  const totalLostHours = manualHours + reworkHours
  const estimatedLoss = totalLostHours * hourlyCost

  return {
    hourlyCost,
    manualHours,
    reworkHours,
    totalLostHours,
    estimatedLoss,
    displayHours: roundHalfUpToStep(totalLostHours, 1),
    displayLoss: roundHalfUpToStep(estimatedLoss, 100_000),
  }
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

/** Currency, vi-VN. */
export function formatVnd(value: number): string {
  return vndFormatter.format(value)
}

/** Plain number, vi-VN grouping. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/**
 * Rendered with every result. Wording is fixed by the content checkpoint —
 * do not soften it, and do not move the result display away from it.
 */
export const LOSS_DISCLAIMER =
  'Kết quả chỉ là ước tính dựa trên thông tin doanh nghiệp cung cấp và các giả định vận hành đã chọn. Kết quả không phải cam kết tiết kiệm hoặc bảo đảm hiệu suất khi triển khai Gcalls.'
