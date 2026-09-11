/**
 * Why X-Robots-Tag disappears, and which layer is serving the cached response.
 *
 * The header is set by `Header always set` in .htaccess, so Apache adds it when
 * the request reaches Apache. The observation to explain is that it is present
 * on one request and absent on the next, for the same URL.
 *
 * A single MISS proves nothing here — that is the request that DOES reach PHP
 * and Apache, and it is the one that looks correct. So every URL is called
 * repeatedly and every response's headers are recorded, which is the only way
 * to see the difference between the first and the rest.
 *
 * Read-only: GETs against the demo domain, nothing else.
 *
 *   node wordpress/scripts/diagnose-robots-header.mjs [--repeat 6]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'dist')

const args = process.argv.slice(2)
const REPEAT = args.includes('--repeat') ? Number(args[args.indexOf('--repeat') + 1]) : 6
const ORIGIN = 'https://ashernguyenxuanthuy.com'

const URLS = [
  '/',
  '/blog/',
  '/gcalls-plus-webphone/',
  '/gcalls-cx/',
  '/voicebot-ai/',
  '/qc-bot-ai/',
  '/uoc-tinh-chi-phi/',
  '/du-lieu-dong-bo-giua-tong-dai-va-helpdesk/',
]

/** Headers that name a caching layer, if any of them are present. */
const CACHE_SIGNALS = [
  'x-litespeed-cache',
  'x-litespeed-cache-control',
  'x-lsadc-cache',
  'x-qc-cache',
  'cf-cache-status',
  'cf-ray',
  'x-cache',
  'x-cache-hits',
  'x-proxy-cache',
  'x-varnish',
  'age',
  'x-served-by',
  'x-fastcgi-cache',
  'x-nginx-cache',
  'x-wp-cf-super-cache',
  'x-cache-enabled',
  'x-injected-by',
  'server',
  'via',
]

const rows = []

for (const route of URLS) {
  for (let i = 1; i <= REPEAT; i++) {
    let res
    try {
      res = await fetch(ORIGIN + route, {
        redirect: 'follow',
        headers: { 'user-agent': 'gcalls-noindex-audit (read-only)' },
        signal: AbortSignal.timeout(20000),
      })
    } catch (error) {
      rows.push({ route, attempt: i, status: 0, error: String(error).slice(0, 60) })
      continue
    }

    const headers = {}
    res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v))

    // Drain the body so the connection completes the same way each time.
    const body = await res.text()

    rows.push({
      route,
      attempt: i,
      status: res.status,
      xRobots: headers['x-robots-tag'] ?? '',
      metaRobots: (body.match(/<meta name="robots" content="([^"]*)"/i) ?? [])[1] ?? '',
      signals: Object.fromEntries(CACHE_SIGNALS.filter((h) => h in headers).map((h) => [h, headers[h]])),
      allHeaderNames: Object.keys(headers).sort().join(','),
    })
  }
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'robots-header-diagnosis.json'), JSON.stringify(rows, null, 2))

/* --------------------------------------------------------------- report */

console.log(`X-Robots-Tag diagnosis — ${REPEAT} sequential requests per URL\n`)
console.log(`${'route'.padEnd(46)} ${'attempt'.padEnd(8)} status  X-Robots-Tag  meta robots`)
console.log('-'.repeat(104))

for (const r of rows) {
  console.log(
    `${r.route.padEnd(46)} ${String(r.attempt).padEnd(8)} ${String(r.status).padEnd(7)} ` +
      `${(r.xRobots ? 'PRESENT' : 'absent').padEnd(13)} ${r.metaRobots || '(none)'}`,
  )
}

const withHeader = rows.filter((r) => r.xRobots)
const withoutHeader = rows.filter((r) => !r.xRobots && r.status === 200)
const withMeta = rows.filter((r) => /noindex/i.test(r.metaRobots))

console.log('\nTOTALS')
console.log(`  responses measured                 ${rows.length}`)
console.log(`  X-Robots-Tag present               ${withHeader.length}`)
console.log(`  X-Robots-Tag absent                ${withoutHeader.length}`)
console.log(`  robots meta carries noindex        ${withMeta.length}`)

/* Which caching layer is announcing itself, if any. */
const seen = {}
for (const r of rows) {
  for (const [k, v] of Object.entries(r.signals ?? {})) {
    seen[k] = seen[k] ?? new Set()
    seen[k].add(v)
  }
}

console.log('\nHEADERS THAT WOULD NAME A CACHE LAYER')
if (Object.keys(seen).length === 0) {
  console.log('  none present')
} else {
  for (const [k, v] of Object.entries(seen)) {
    console.log(`  ${k.padEnd(28)} ${[...v].join(' | ').slice(0, 70)}`)
  }
}

/* Whether the header ever varies within one URL, which is the tell. */
console.log('\nPER URL')
for (const route of URLS) {
  const mine = rows.filter((r) => r.route === route)
  const present = mine.filter((r) => r.xRobots).length
  console.log(`  ${route.padEnd(46)} header on ${present}/${mine.length} requests`)
}

console.log('\nwritten: wordpress/dist/robots-header-diagnosis.json')
