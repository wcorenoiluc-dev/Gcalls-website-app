/**
 * Identifies the animated visual components on the React home page.
 *
 * "Seven mockups" has to come from the source, not from memory: the checkpoint
 * names five and leaves two to be determined. A component counts if HomePage
 * actually renders it (directly or through a parent) AND it drives a visual
 * through timed state — a setInterval/setTimeout cycle or a transition keyed on
 * state — rather than merely holding a click handler.
 */
import fs from 'node:fs'
import path from 'node:path'

const HOME = 'src/components/home'
const page = fs.readFileSync('src/pages/HomePage.tsx', 'utf8')

/**
 * Import aliases have to be resolved before anything can be matched by file.
 * HomePage renders `<Hero>` and `<IntegrationCtaSection>`; the files are
 * HeroSection.tsx and IntegrationsSection.tsx. Matching on the file name alone
 * reported the two biggest animated components on the page as "not rendered",
 * which is exactly the kind of wrong answer that reaches a checkpoint report.
 */
const aliasToFile = new Map()
for (const m of page.matchAll(/import \{([^}]+)\} from '@\/components\/home\/(\w+)'/g)) {
  for (const raw of m[1].split(',')) {
    const local = raw.trim().split(' as ').pop()
    if (local) aliasToFile.set(local, m[2])
  }
}

const renderedTags = new Set()
for (const m of page.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)) renderedTags.add(m[1])

const rendered = new Set()
for (const tag of renderedTags) rendered.add(aliasToFile.get(tag) ?? tag)

const files = fs.readdirSync(HOME).filter((f) => f.endsWith('.tsx'))
const rows = []

for (const file of files) {
  const src = fs.readFileSync(path.join(HOME, file), 'utf8')
  const name = file.replace('.tsx', '')

  const timers = (src.match(/setInterval|setTimeout|requestAnimationFrame/g) ?? []).length
  const stateVars = [...new Set([...src.matchAll(/const \[(\w+),\s*set\w+\]\s*=\s*useState/g)].map((m) => m[1]))]
  const effects = (src.match(/useEffect\(/g) ?? []).length
  const transitions = (src.match(/transition[:\s]/g) ?? []).length
  const charts = /recharts|<(Area|Bar|Line|Pie)Chart/.test(src)
  const svg = (src.match(/<svg/g) ?? []).length

  // Rendered directly, or imported by a component that is rendered.
  let renderedBy = rendered.has(name) ? 'HomePage' : ''
  if (!renderedBy) {
    for (const other of files) {
      const otherSrc = fs.readFileSync(path.join(HOME, other), 'utf8')
      const otherName = other.replace('.tsx', '')
      if (rendered.has(otherName) && otherSrc.includes(`<${name}`)) renderedBy = otherName
    }
  }

  rows.push({ name, renderedBy, timers, effects, states: stateVars.length, transitions, charts, svg, lines: src.split('\n').length })
}

const w = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(`${w('COMPONENT',26)}${w('RENDERED BY',20)}${w('TIMER',7)}${w('EFFECT',8)}${w('STATE',7)}${w('TRANS',7)}${w('CHART',7)}${w('SVG',5)}LINES`)
for (const r of rows.sort((a, b) => (b.timers - a.timers) || (b.states - a.states))) {
  console.log(`${w(r.name,26)}${w(r.renderedBy || '— not rendered',20)}${w(r.timers,7)}${w(r.effects,8)}${w(r.states,7)}${w(r.transitions,7)}${w(r.charts?'yes':'-',7)}${w(r.svg,5)}${r.lines}`)
}

const animated = rows.filter((r) => r.renderedBy && (r.timers > 0 || r.states > 0 || r.charts))
console.log(`\nRendered AND animated/stateful: ${animated.length}`)
for (const r of animated) console.log(`  ${r.name}  (via ${r.renderedBy})`)
