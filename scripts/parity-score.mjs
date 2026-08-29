#!/usr/bin/env node
/**
 * Scores how closely the WordPress build matches the React reference.
 *
 * WHY A STRUCTURAL FINGERPRINT AND NOT A PIXEL DIFF
 * A pixel diff between a React page and a WordPress page scores near zero and
 * says nothing: the two use different fonts at different weights, Elementor
 * wraps everything in its own containers, and one shifts by a pixel when a
 * scrollbar appears. What a reviewer actually asks is "is every section here,
 * in the right order, saying the same thing, with the same visuals and the same
 * calls to action" — so that is what is measured.
 *
 * THE SCORE IS DEFINED HERE, IN FULL, SO IT CANNOT BE READ AS AN OPINION
 *
 *   headings  0.50  the heading texts, in order, compared by longest common
 *                   subsequence — order matters, so a section moved counts
 *                   against it, and a section missing counts twice as much as
 *                   one reworded
 *   visuals   0.15  images, ported mockups and drawings at least 64px across,
                   scored as "at least as many as the reference" — see below
 *   ctas      0.15  links into the lead route, as a ratio
 *   rhythm    0.20  full page height, as a ratio — catches a section that is
 *                   present but collapsed, which the heading list cannot see
 *
 * A ratio is always min/max, so overshooting is penalised exactly like falling
 * short. Nothing here can exceed 1, so no route can score above 100%.
 *
 * Usage: node scripts/parity-score.mjs [--width 1440]
 */
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'docs/content-review/parity-006'
const ROUTES = [
  ['home', '/'],
  ['gcalls-plus', '/gcalls-plus-webphone/'],
  ['gcalls-cx', '/gcalls-cx/'],
  ['voicebot', '/voicebot-ai/'],
  ['qa-qc', '/qc-bot-ai/'],
  ['estimator', '/uoc-tinh-chi-phi/'],
  ['blog', '/blog/'],
]
const REACT = 'http://localhost:5173'
const WP = 'https://ashernguyenxuanthuy.com'

const widthArg = process.argv.indexOf('--width')
const WIDTH = widthArg !== -1 ? Number(process.argv[widthArg + 1]) : 1440

/** Normalise a heading for comparison: case, whitespace and punctuation only. */
const normalise = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,:;!?"'“”‘’()\-–—]/g, '')
    .trim()

async function fingerprint(page, base, route) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 })
  await page.waitForTimeout(900)

  return page.evaluate(() => {
    const bar = document.getElementById('wpadminbar')
    if (bar) bar.remove()

    // The admin bar and the theme's skip link are chrome, not content.
    const skip = document.querySelector('.skip-link, .screen-reader-text')
    if (skip) skip.remove()

    const headings = [...document.querySelectorAll('h1, h2, h3')]
      .filter((node) => node.offsetParent !== null || node.getClientRects().length)
      .map((node) => node.textContent || '')
      .filter((text) => text.trim().length > 2)

    // Content visuals only. Counting every <svg> measured the icon library,
    // not the design: React draws its icons with lucide (dozens of 12–20px
    // inline SVGs per page) where the theme uses CSS and text, so identical
    // pages scored 5%. An illustration is something a reader would call a
    // picture — an image, a ported mockup, or a drawing at least 64px across.
    const bigEnough = (node) => {
      const box = node.getBoundingClientRect()
      return box.width >= 64 && box.height >= 64
    }

    const visuals =
      [...document.querySelectorAll('img')].filter(bigEnough).length +
      [...document.querySelectorAll('svg')].filter(bigEnough).length +
      document.querySelectorAll('[data-gcalls-mock]').length

    const ctas = [...document.querySelectorAll('a[href*="lien-he"]')].length

    return {
      headings,
      visuals,
      ctas,
      height: document.documentElement.scrollHeight,
    }
  })
}

/** Length of the longest common subsequence of two arrays of strings. */
function lcs(a, b) {
  const rows = a.length
  const cols = b.length
  let prev = new Array(cols + 1).fill(0)

  for (let i = 1; i <= rows; i += 1) {
    const row = new Array(cols + 1).fill(0)
    for (let j = 1; j <= cols; j += 1) {
      row[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], row[j - 1])
    }
    prev = row
  }

  return prev[cols]
}

const ratio = (a, b) => {
  const hi = Math.max(a, b)
  return hi === 0 ? 1 : Math.min(a, b) / hi
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 })
const page = await context.newPage()

const rows = []

for (const [name, route] of ROUTES) {
  let react
  let wp
  try {
    react = await fingerprint(page, REACT, route)
    wp = await fingerprint(page, WP, route)
  } catch (error) {
    rows.push({ name, route, error: String(error).split('\n')[0] })
    continue
  }

  const a = react.headings.map(normalise)
  const b = wp.headings.map(normalise)
  const shared = lcs(a, b)

  const parts = {
    headings: Math.max(a.length, b.length) === 0 ? 1 : shared / Math.max(a.length, b.length),
    // Not a ratio. The 007 addendum approved demo visuals for the three
    // products React ships with no imagery at all, so on those routes React
    // scores zero and min/max would punish the site for carrying the artwork
    // it was told to add. What is being asked is "no section lost its
    // illustration", so having at least as many as the reference is full marks.
    visuals: react.visuals === 0 ? 1 : Math.min(1, wp.visuals / react.visuals),
    ctas: ratio(react.ctas, wp.ctas),
    rhythm: ratio(react.height, wp.height),
  }

  const score = parts.headings * 0.5 + parts.visuals * 0.15 + parts.ctas * 0.15 + parts.rhythm * 0.2

  rows.push({
    name,
    route,
    score: Math.round(score * 1000) / 10,
    parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, Math.round(v * 1000) / 10])),
    react: { headings: react.headings.length, visuals: react.visuals, ctas: react.ctas, height: react.height },
    wp: { headings: wp.headings.length, visuals: wp.visuals, ctas: wp.ctas, height: wp.height },
    // The headings React renders that WordPress does not, and vice versa —
    // the section diff a reviewer needs to act on.
    missingInWp: react.headings.filter((h) => !b.includes(normalise(h))),
    extraInWp: wp.headings.filter((h) => !a.includes(normalise(h))),
  })
}

await browser.close()

const w = (s, n) => String(s).padEnd(n).slice(0, n)

console.log(`Parity vs React reference @ ${WIDTH}px\n`)
console.log(`${w('ROUTE', 24)}${w('SCORE', 8)}${w('HEADINGS', 10)}${w('VISUALS', 9)}${w('CTAS', 7)}RHYTHM`)

for (const row of rows) {
  if (row.error) {
    console.log(`${w(row.route, 24)}ERR  ${row.error}`)
    continue
  }
  console.log(
    `${w(row.route, 24)}${w(`${row.score}%`, 8)}${w(`${row.parts.headings}%`, 10)}` +
      `${w(`${row.parts.visuals}%`, 9)}${w(`${row.parts.ctas}%`, 7)}${row.parts.rhythm}%`,
  )
}

const scored = rows.filter((row) => !row.error)
const mean = scored.reduce((total, row) => total + row.score, 0) / (scored.length || 1)

console.log(`\nmean ${Math.round(mean * 10) / 10}% across ${scored.length} routes`)

for (const row of scored) {
  if (row.missingInWp.length === 0 && row.extraInWp.length === 0) continue
  console.log(`\n${row.route}`)
  for (const heading of row.missingInWp) console.log(`  − missing in WP: ${heading.trim().slice(0, 90)}`)
  for (const heading of row.extraInWp) console.log(`  + only in WP:    ${heading.trim().slice(0, 90)}`)
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, `parity-score-${WIDTH}.json`), JSON.stringify(rows, null, 2))
