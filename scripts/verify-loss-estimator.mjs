/**
 * Verify the homepage operational-loss estimator against its approved cases.
 *
 * This repository has no test runner, and Checkpoint HOME-CONTENT-AUDIT-
 * CORRECTION-001 explicitly does not want a framework added for one widget. So
 * this is a plain Node script in the same style as the other files in
 * `scripts/`, run directly:
 *
 *   node scripts/verify-loss-estimator.mjs
 *
 * It imports `src/components/home/lossEstimate.ts` ITSELF — Node 24 strips the
 * types on the fly — so it exercises the shipping implementation rather than a
 * copy of the formula that could drift away from it. Exits non-zero on any
 * failure, so it can be wired into CI later without changes.
 */
import {
  DEFAULT_LOSS_INPUT,
  LOSS_FIELDS,
  calculateLoss,
  clampField,
  formatVnd,
  roundHalfUpToStep,
} from '../src/components/home/lossEstimate.ts'

let failures = 0

function check(label, actual, expected) {
  const ok = Object.is(actual, expected)
  if (!ok) failures += 1
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}: ${actual}${ok ? '' : `  (expected ${expected})`}`)
}

/**
 * `Intl` separates a vi-VN amount from its ₫ with U+00A0 (no-break space), not
 * U+0020. Comparing against a hand-typed literal therefore fails on a character
 * nobody can see. Normalise before comparing — the space class is not what
 * these assertions are about.
 */
const nbsp = (s) => s.replace(/ /g, ' ')

/* ------------------------------------------------------------------ *
 * 1. Approved case A — the default input set
 * ------------------------------------------------------------------ */
console.log('\nCase A — defaults (10 người · 12.000.000 · 60 phút · 5% · 22 ngày · 8 giờ)')
const a = calculateLoss(DEFAULT_LOSS_INPUT)
check('hourlyCost unrounded', a.hourlyCost, 12_000_000 / 176)
check('manualHours', a.manualHours, 220)
check('reworkHours ≈ 11', Math.abs(a.reworkHours - 11) < 1e-9, true)
check('totalLostHours ≈ 231', Math.abs(a.totalLostHours - 231) < 1e-9, true)
check('displayHours', a.displayHours, 231)
check('displayLoss', a.displayLoss, 15_800_000)
check('formatted', nbsp(formatVnd(a.displayLoss)), '15.800.000 ₫')

/* ------------------------------------------------------------------ *
 * 2. Approved case B
 * ------------------------------------------------------------------ */
console.log('\nCase B — (25 người · 20.000.000 · 90 phút · 10% · 24 ngày · 9 giờ)')
const b = calculateLoss({
  employees: 25,
  monthlySalary: 20_000_000,
  wastedMinutesPerDay: 90,
  errorRatePercent: 10,
  workingDays: 24,
  workingHoursPerDay: 9,
})
check('hourlyCost unrounded', b.hourlyCost, 20_000_000 / 216)
check('manualHours', b.manualHours, 900)
check('reworkHours ≈ 90', Math.abs(b.reworkHours - 90) < 1e-9, true)
check('totalLostHours ≈ 990', Math.abs(b.totalLostHours - 990) < 1e-9, true)
check('displayHours', b.displayHours, 990)
check('displayLoss', b.displayLoss, 91_700_000)
check('formatted', nbsp(formatVnd(b.displayLoss)), '91.700.000 ₫')

/* ------------------------------------------------------------------ *
 * 3. No early rounding of hourlyCost
 *
 * If `hourlyCost` were rounded before the multiply, case A would land on
 * 68.000 × 231 = 15.708.000 → 15.700.000, not 15.800.000. Case A above already
 * proves it is not, but state the invariant explicitly so a future "tidy-up"
 * that rounds it cannot pass silently.
 * ------------------------------------------------------------------ */
console.log('\nInvariants')
check('hourlyCost is not an integer (i.e. not pre-rounded)', Number.isInteger(a.hourlyCost), false)
check('estimatedLoss returned unrounded', a.estimatedLoss !== a.displayLoss, true)
check('totalLostHours is exactly manualHours + reworkHours', a.totalLostHours, a.manualHours + a.reworkHours)
check('estimatedLoss is exactly totalLostHours × hourlyCost', a.estimatedLoss, a.totalLostHours * a.hourlyCost)
check('estimatedLoss is NOT already on a 100.000 step', a.estimatedLoss % 100_000 === 0, false)

/* ------------------------------------------------------------------ *
 * 4. Rounding is half-UP on a step, never floor/truncate
 * ------------------------------------------------------------------ */
console.log('\nRounding — half-up to a 100.000 step')
check('149.999 → 100.000', roundHalfUpToStep(149_999, 100_000), 100_000)
check('150.000 → 200.000 (tie rounds up)', roundHalfUpToStep(150_000, 100_000), 200_000)
check('150.001 → 200.000', roundHalfUpToStep(150_001, 100_000), 200_000)
check('249.999,9 → 200.000', roundHalfUpToStep(249_999.9, 100_000), 200_000)
check('15.749.999,999999998 → 15.800.000 (float tie)', roundHalfUpToStep(15_749_999.999999998, 100_000), 15_800_000)
check('0 → 0', roundHalfUpToStep(0, 100_000), 0)
console.log('\nRounding — half-up to a 1 hour step')
check('220,4 → 220', roundHalfUpToStep(220.4, 1), 220)
check('220,5 → 221 (tie rounds up)', roundHalfUpToStep(220.5, 1), 221)
check('220,6 → 221', roundHalfUpToStep(220.6, 1), 221)

/* ------------------------------------------------------------------ *
 * 5. No NaN / Infinity reachable
 *
 * Sweep every field with the values a text box or a crafted URL can produce.
 * ------------------------------------------------------------------ */
console.log('\nHostile input — nothing may produce NaN or Infinity')
const HOSTILE = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, -1, -1e9, 1e12, 0.5]
let hostileOk = true
for (const key of Object.keys(LOSS_FIELDS)) {
  for (const bad of HOSTILE) {
    const r = calculateLoss({ ...DEFAULT_LOSS_INPUT, [key]: bad })
    const finite = [r.hourlyCost, r.manualHours, r.reworkHours, r.totalLostHours,
      r.estimatedLoss, r.displayHours, r.displayLoss].every(Number.isFinite)
    if (!finite) {
      hostileOk = false
      console.log(`   NaN/Infinity from ${key}=${bad}`)
    }
  }
}
check(`all ${Object.keys(LOSS_FIELDS).length} fields × ${HOSTILE.length} hostile values stay finite`, hostileOk, true)

/* ------------------------------------------------------------------ *
 * 6. Clamping — the behaviour the number box relies on
 * ------------------------------------------------------------------ */
console.log('\nClamping')
check('employees 99999 → max 500', clampField('employees', 99_999), LOSS_FIELDS.employees.max)
check('employees -5 → min 1', clampField('employees', -5), LOSS_FIELDS.employees.min)
check('employees NaN → default 10', clampField('employees', Number.NaN), LOSS_FIELDS.employees.default)
check('workingDays 0 → min 1 (no divide-by-zero)', clampField('workingDays', 0), 1)
check('workingHoursPerDay 0 → min 1', clampField('workingHoursPerDay', 0), 1)
check('errorRatePercent 999 → max 50', clampField('errorRatePercent', 999), LOSS_FIELDS.errorRatePercent.max)

/* ------------------------------------------------------------------ */
console.log(
  failures === 0
    ? '\n✓ All loss-estimator checks passed.\n'
    : `\n✗ ${failures} check(s) failed.\n`,
)
process.exit(failures === 0 ? 0 : 1)
