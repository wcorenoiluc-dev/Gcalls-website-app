#!/usr/bin/env node
/**
 * The homepage loss estimator exists twice — once in TypeScript for the React
 * app, once in plain browser JS for the WordPress plugin — and there is no
 * build step that could make one derive from the other. This runs both over the
 * same inputs and fails if they disagree anywhere.
 *
 * The grid deliberately includes the documented rounding tie (the default input
 * set produces exactly 15,750,000 VND, half of a 100,000 display step), the
 * bounds of every field, and values outside them, because those are where a
 * naive Math.round port and a clamp-free port break.
 *
 * Usage: node wordpress/scripts/test-loss-estimator.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')

const ts = await import(path.join(REPO, 'src/components/home/lossEstimate.ts'))
const { LOSS_FIELDS, DEFAULT_LOSS_INPUT, calculateLoss, roundHalfUpToStep, clampField } = ts

/* Load the browser file in a sandbox with just enough window to run. */
const sandbox = {
  window: {},
  document: {
    readyState: 'complete',
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({ setAttribute() {}, appendChild() {}, addEventListener() {} }),
  },
  Intl,
}
sandbox.globalThis = sandbox
vm.createContext(sandbox)
vm.runInContext(
  fs.readFileSync(path.join(WP, 'wp-content/plugins/gcalls-core/assets/js/loss-estimator.js'), 'utf8'),
  sandbox,
  { filename: 'loss-estimator.js' },
)

const js = sandbox.window.gcallsLossEstimate

let failures = 0
const ok = (label) => console.log(`  ok   ${label}`)
const fail = (label, detail) => {
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  failures += 1
}

if (!js) {
  fail('loss-estimator.js exposes window.gcallsLossEstimate')
  process.exit(1)
}

/* ------------------------------------------------------------------ *
 * 1. The rounding tie the comment in both files is about
 * ------------------------------------------------------------------ */

console.log('1. The documented rounding tie')

const tie = calculateLoss(DEFAULT_LOSS_INPUT)

if (tie.displayLoss === 15_800_000) ok('the default input set rounds half UP to 15.800.000')
else fail('the default input set rounds half UP to 15.800.000', `got ${tie.displayLoss}`)

if (js.calculateLoss(DEFAULT_LOSS_INPUT).displayLoss === tie.displayLoss) {
  ok('the port agrees on the tie')
} else {
  fail('the port agrees on the tie', `js ${js.calculateLoss(DEFAULT_LOSS_INPUT).displayLoss} vs ts ${tie.displayLoss}`)
}

/* ------------------------------------------------------------------ *
 * 2. A grid across every field's range, plus values outside it
 * ------------------------------------------------------------------ */

console.log('\n2. The two implementations agree across the input space')

const keys = Object.keys(LOSS_FIELDS)
const samplesFor = (key) => {
  const { min, max, step, default: value } = LOSS_FIELDS[key]
  const mid = min + Math.floor((max - min) / 2 / step) * step
  return [min, min - step, value, mid, max, max + step]
}

let compared = 0
let mismatched = 0

for (const key of keys) {
  for (const sample of samplesFor(key)) {
    for (const other of keys) {
      const input = { ...DEFAULT_LOSS_INPUT, [key]: sample }
      if (other !== key) input[other] = LOSS_FIELDS[other].max

      const a = calculateLoss(input)
      const b = js.calculateLoss({
        employees: js.clampField(LOSS_FIELDS.employees, input.employees),
        monthlySalary: js.clampField(LOSS_FIELDS.monthlySalary, input.monthlySalary),
        wastedMinutesPerDay: js.clampField(LOSS_FIELDS.wastedMinutesPerDay, input.wastedMinutesPerDay),
        errorRatePercent: js.clampField(LOSS_FIELDS.errorRatePercent, input.errorRatePercent),
        workingDays: js.clampField(LOSS_FIELDS.workingDays, input.workingDays),
        workingHoursPerDay: js.clampField(LOSS_FIELDS.workingHoursPerDay, input.workingHoursPerDay),
      })

      compared += 1

      if (a.displayLoss !== b.displayLoss || a.displayHours !== b.displayHours) {
        mismatched += 1
        if (mismatched <= 3) {
          fail(
            `${key}=${sample}`,
            `ts ${a.displayHours}h/${a.displayLoss} vs js ${b.displayHours}h/${b.displayLoss}`,
          )
        }
      }
    }
  }
}

if (mismatched === 0) ok(`${compared} input combinations, identical output`)
else fail(`${compared} input combinations`, `${mismatched} disagreed`)

/* ------------------------------------------------------------------ *
 * 3. Clamping and the non-finite paths
 * ------------------------------------------------------------------ */

console.log('\n3. Clamping and non-finite input')

for (const key of keys) {
  const field = LOSS_FIELDS[key]
  const cases = [
    [field.min - 1000, field.min],
    [field.max + 1000, field.max],
    [Number.NaN, field.default],
    [Number.POSITIVE_INFINITY, field.default],
  ]

  for (const [given, want] of cases) {
    const a = clampField(key, given)
    const b = js.clampField(field, given)
    if (a === want && b === want) continue
    fail(`clamp ${key} ${String(given)}`, `ts ${a}, js ${b}, expected ${want}`)
  }
}

if (failures === 0) ok('every field clamps identically, including NaN and Infinity')

/* A result can never be Infinity: the two divisors are clamped to >= 1. */
const extreme = calculateLoss({ ...DEFAULT_LOSS_INPUT, workingDays: 0, workingHoursPerDay: 0 })
if (Number.isFinite(extreme.estimatedLoss)) ok('zero working days cannot divide by zero')
else fail('zero working days cannot divide by zero', String(extreme.estimatedLoss))

/* ------------------------------------------------------------------ *
 * 4. roundHalfUpToStep itself
 * ------------------------------------------------------------------ */

console.log('\n4. roundHalfUpToStep')

const rounding = [
  [15_749_999.999999998, 100_000, 15_800_000],
  [15_750_000, 100_000, 15_800_000],
  [15_749_999, 100_000, 15_700_000],
  [0.5, 1, 1],
  [-0.5, 1, -0],
  [Number.NaN, 1, 0],
]

for (const [value, step, want] of rounding) {
  const a = roundHalfUpToStep(value, step)
  const b = js.roundHalfUpToStep(value, step)
  if (a === want && b === want) ok(`${value} → ${want} (step ${step})`)
  else fail(`${value} → ${want} (step ${step})`, `ts ${a}, js ${b}`)
}

/* ------------------------------------------------------------------ *
 * 5. The config the plugin ships matches the module
 * ------------------------------------------------------------------ */

console.log('\n5. The shipped config matches the source module')

const configPath = path.join(WP, 'wp-content/plugins/gcalls-core/data/loss-estimator-config.json')

if (!fs.existsSync(configPath)) {
  fail('loss-estimator-config.json exists', 'run npm run wp:loss')
} else {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

  if (config.disclaimer === ts.LOSS_DISCLAIMER) ok('the disclaimer is the approved wording, verbatim')
  else fail('the disclaimer is the approved wording, verbatim')

  const mismatches = config.fields.filter((field) => {
    const bounds = LOSS_FIELDS[field.key]
    return (
      !bounds ||
      bounds.min !== field.min ||
      bounds.max !== field.max ||
      bounds.step !== field.step ||
      bounds.default !== field.default
    )
  })

  if (mismatches.length === 0) ok(`all ${config.fields.length} fields carry the source bounds`)
  else fail('all fields carry the source bounds', mismatches.map((f) => f.key).join(', '))
}

console.log(`\nfailures: ${failures}`)
process.exit(failures === 0 ? 0 : 1)
