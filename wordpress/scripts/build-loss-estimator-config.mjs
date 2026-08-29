#!/usr/bin/env node
/**
 * Exports the homepage loss estimator's data into the plugin.
 *
 * WHAT IS AND IS NOT COPIED
 * The bounds, the defaults, the field wording and the disclaimer come straight
 * out of `src/components/home/lossEstimate.ts`. The FORMULA is not exported:
 * `assets/js/loss-estimator.js` implements it, and `test-loss-estimator.mjs`
 * runs both implementations over the same inputs and fails if they ever
 * disagree by a single dong. A formula transcribed once and checked never is a
 * formula that will drift; one checked on every run cannot.
 *
 * WHY THE DISCLAIMER TRAVELS WITH THE DATA
 * The wording is fixed by the content checkpoint and has to be rendered with
 * every result. Shipping it as config rather than as a PHP string means the
 * port cannot end up with an older, softer version of it.
 *
 * `lossEstimate.ts` imports nothing, so Node loads it directly (type-stripping).
 *
 * Usage: node wordpress/scripts/build-loss-estimator-config.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const OUT = path.join(WP, 'wp-content/plugins/gcalls-core/data/loss-estimator-config.json')

const source = path.join(REPO, 'src/components/home/lossEstimate.ts')
const module_ = await import(source)

const { LOSS_FIELDS, LOSS_FIELD_META, DEFAULT_LOSS_INPUT, LOSS_DISCLAIMER } = module_

const problems = []

if (!Array.isArray(LOSS_FIELD_META) || LOSS_FIELD_META.length === 0) {
  problems.push('LOSS_FIELD_META is empty')
}

const fields = (LOSS_FIELD_META ?? []).map((meta) => {
  const bounds = LOSS_FIELDS[meta.key]

  if (!bounds) {
    problems.push(`${meta.key}: no bounds in LOSS_FIELDS`)
    return null
  }
  for (const part of ['label', 'hint', 'unit']) {
    if (!meta[part]) problems.push(`${meta.key}: empty ${part}`)
  }
  if (!(bounds.min <= bounds.default && bounds.default <= bounds.max)) {
    problems.push(`${meta.key}: default ${bounds.default} outside [${bounds.min}, ${bounds.max}]`)
  }
  if (bounds.step <= 0) problems.push(`${meta.key}: step must be positive`)
  if (DEFAULT_LOSS_INPUT[meta.key] !== bounds.default) {
    problems.push(`${meta.key}: DEFAULT_LOSS_INPUT disagrees with LOSS_FIELDS.default`)
  }

  return {
    key: meta.key,
    label: meta.label,
    hint: meta.hint,
    unit: meta.unit,
    min: bounds.min,
    max: bounds.max,
    step: bounds.step,
    default: bounds.default,
  }
})

// Every key the formula divides by has to be kept away from zero, or the port
// can produce Infinity where React clamps.
for (const key of ['workingDays', 'workingHoursPerDay']) {
  if ((LOSS_FIELDS[key]?.min ?? 0) < 1) problems.push(`${key}: min must be at least 1 — the formula divides by it`)
}

if (!LOSS_DISCLAIMER || LOSS_DISCLAIMER.length < 80) {
  problems.push('LOSS_DISCLAIMER is missing or suspiciously short')
}

if (problems.length) {
  console.error('build-loss-estimator-config: refusing to write\n')
  for (const problem of problems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}

const config = {
  generator: 'wordpress/scripts/build-loss-estimator-config.mjs',
  source: 'src/components/home/lossEstimate.ts',
  fields,
  disclaimer: LOSS_DISCLAIMER,
  labels: {
    eyebrow: 'Công cụ ước tính tổn thất',
    heading: 'Ước tính chi phí vận hành thủ công',
    headingAccent: 'mỗi tháng',
    intro:
      'Điều chỉnh các thông số theo thực tế doanh nghiệp của bạn để xem số giờ làm việc ' +
      'và chi phí tương ứng đang dành cho thao tác thủ công và xử lý lại.',
    reset: 'Đặt lại giá trị mặc định',
    resultBadge: 'Ước tính hằng tháng',
    hoursLabel: 'Tổng thời gian dành cho thao tác thủ công và làm lại',
    hoursUnit: 'giờ',
    costLabel: 'Chi phí tương ứng ước tính',
    perHour: 'Tương đương {rate} / giờ / người',
    cta: 'Nhận tư vấn tối ưu vận hành',
  },
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `${JSON.stringify(config, null, 2)}\n`)

console.log(`build-loss-estimator-config: ${path.relative(REPO, OUT)}`)
console.log(`  fields     ${fields.length}`)
console.log(`  disclaimer ${LOSS_DISCLAIMER.length} chars`)
