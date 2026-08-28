#!/usr/bin/env node
/**
 * Exports the estimator questionnaire from React into the plugin.
 *
 * WHAT THE ESTIMATOR ACTUALLY IS
 * Not a price calculator. `src/lib/estimate.ts` gates every number behind
 * `PRICING_CONFIGURED`, which is `false`, and there is deliberately no
 * arithmetic behind it — the comment there says inventing one "would produce a
 * number that looks authoritative and is not". So the tool collects
 * requirements, applies a small set of explicit recommendation rules, and ends
 * on "Chi phí theo cấu hình". The port keeps that gate: the PHP has no rates
 * either, so it cannot start showing prices by accident.
 *
 * WHY GENERATED, NOT TRANSCRIBED
 * The questionnaire is 467 lines of fields, options and hints across seven
 * solutions. Retyped into PHP it would be wrong within one edit of the React
 * file and nobody would notice, because a missing question looks exactly like a
 * question that was never asked.
 *
 * `estimator.ts` imports the `@/` alias, which plain Node cannot resolve, so the
 * one import line is rewritten against the route table extracted from
 * `sitemap.ts` and the module is then loaded directly (Node 24 strips types).
 *
 * Usage: node wordpress/scripts/build-estimator-config.mjs
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const OUT = path.join(WP, 'wp-content/plugins/gcalls-core/data/estimator-config.json')

/* Route table, extracted the same way export-content.mjs extracts it. */
const sitemapSrc = fs.readFileSync(path.join(REPO, 'src/config/sitemap.ts'), 'utf8')
const routesBlock = sitemapSrc.slice(
  sitemapSrc.indexOf('export const ROUTES = {'),
  sitemapSrc.indexOf('} as const'),
)

const routes = {}
for (const [, key, value] of routesBlock.matchAll(/^\s*(\w+):\s*'([^']+)',/gm)) routes[key] = value

if (Object.keys(routes).length === 0) throw new Error('no routes extracted from sitemap.ts')

/* Rewrite the single aliased import, then load the module as-is. */
const estimatorSrc = fs.readFileSync(path.join(REPO, 'src/data/estimator.ts'), 'utf8')
const patched = estimatorSrc.replace(
  /^import \{[^}]*\} from '@\/config\/navigation'$/m,
  `const ROUTES = ${JSON.stringify(routes)}\ntype RoutePath = string`,
)

if (patched === estimatorSrc) throw new Error('the navigation import in estimator.ts did not match — check the import line')

const temp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gcalls-est-')), 'estimator.ts')
fs.writeFileSync(temp, patched)

const { ESTIMATOR_SOLUTIONS } = await import(temp)

/**
 * The recommendation rules, transcribed from `recommend()` in estimate.ts.
 *
 * These are shipped as DATA rather than as PHP branches so the PHP and the
 * TypeScript cannot disagree about them silently: qa-foundation.mjs asserts the
 * two lists match.
 */
const RECOMMENDATION_RULES = {
  'gcalls-plus': [{ consider: 'crm', when: { field: 'needsCrm', equals: true } }],
  crm: [{ consider: 'gcalls-plus' }],
  helpdesk: [{ consider: 'gcalls-plus' }],
  pos: [{ consider: 'gcalls-plus' }],
  cx: [{ consider: 'crm', when: { field: 'needsIntegration', equals: true } }],
  'qa-qc': [{ consider: 'gcalls-plus' }],
  international: [],
}

const config = {
  generator: 'wordpress/scripts/build-estimator-config.mjs',
  // Mirrors PRICING_CONFIGURED in src/data/pricing.ts. While this is false the
  // result panel shows the configuration state and never a number.
  pricingConfigured: /export const PRICING_CONFIGURED = (\w+)/.exec(
    fs.readFileSync(path.join(REPO, 'src/data/pricing.ts'), 'utf8'),
  )?.[1] === 'true',
  priceUnavailableLabel: 'Chi phí theo cấu hình',
  priceUnavailableSupporting: 'Gcalls cần xác nhận cấu hình để đưa ra báo giá phù hợp.',
  solutions: ESTIMATOR_SOLUTIONS.map((solution) => ({
    id: solution.id,
    name: solution.name,
    useCase: solution.useCase,
    path: solution.path,
    fields: solution.fields.map((field) => ({
      id: field.id,
      label: field.label,
      type: field.type,
      hint: field.hint ?? null,
      unit: field.unit ?? null,
      min: field.min ?? null,
      max: field.max ?? null,
      defaultValue: field.defaultValue ?? null,
      options: field.options ?? null,
      step: field.step,
    })),
  })),
  recommendationRules: RECOMMENDATION_RULES,
}

const problems = []

if (config.solutions.length === 0) problems.push('no solutions extracted')
if (config.pricingConfigured) {
  problems.push('PRICING_CONFIGURED is true — the port has no rate table and must not claim to price anything')
}
for (const solution of config.solutions) {
  if (!solution.fields.length) problems.push(`${solution.id} has no fields`)
  if (!(solution.id in RECOMMENDATION_RULES)) problems.push(`${solution.id} has no recommendation rule`)
  for (const field of solution.fields) {
    if (!field.label) problems.push(`${solution.id}.${field.id} has no label`)
    if (['select', 'multi'].includes(field.type) && !field.options?.length) {
      problems.push(`${solution.id}.${field.id} is a ${field.type} with no options`)
    }
  }
}
for (const id of Object.keys(RECOMMENDATION_RULES)) {
  if (!config.solutions.some((s) => s.id === id)) problems.push(`rule for unknown solution ${id}`)
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `${JSON.stringify(config, null, 2)}\n`)
fs.rmSync(path.dirname(temp), { recursive: true, force: true })

const fields = config.solutions.reduce((n, s) => n + s.fields.length, 0)

console.log(`build-estimator-config: ${path.relative(REPO, OUT)}`)
console.log(`  solutions          ${config.solutions.length}`)
console.log(`  fields             ${fields}`)
console.log(`  pricingConfigured  ${config.pricingConfigured} (a price is never shown while this is false)`)

if (problems.length) {
  console.log('\nPROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log('\nbuild-estimator-config: OK')
