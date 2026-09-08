#!/usr/bin/env node
/**
 * GCALLS-036B — contract test between the PHP renderer and the Node preview.
 *
 * WHAT IT CAN AND CANNOT PROVE
 * There is no PHP runtime on this machine, so this does NOT compare rendered
 * HTML. What it does check is that the two implementations cannot legally
 * disagree: they read the same allowlist and the same reconciliation table,
 * they handle the same set of components, they draw icons from the same
 * registry, and every class either of them can emit exists in the stylesheet.
 * A drift in placement would have to show up as a failure here first.
 */
import { readFile } from 'node:fs/promises'

const F = {
  contract: 'wordpress/wp-content/plugins/gcalls-core/data/section-components.json',
  php: 'wordpress/wp-content/plugins/gcalls-core/includes/class-sections.php',
  js: 'wordpress/scripts/lib/section-contract.mjs',
  icons: 'wordpress/wp-content/plugins/gcalls-core/includes/class-icons.php',
  css: 'wordpress/wp-content/themes/gcalls-theme/assets/css/gc-components.css',
  themeCss: 'wordpress/wp-content/themes/gcalls-theme/assets/css/theme.css',
  product: 'wordpress/wp-content/plugins/gcalls-core/data/product-pages.json',
}
import { PKG, pkgPresent, pkgMissingNote } from './lib/pkg-dir.mjs'

const read = async (p) => readFile(p, 'utf8')
const contract = JSON.parse(await read(F.contract))
const php = await read(F.php)
const js = await read(F.js)
const iconsPhp = await read(F.icons)
const css = await read(F.css)
// theme.css 0.8.5 loads first and already owns .gc-btn and .gc-ctarow; the
// component sheet deliberately does not redefine them.
const themeCss = await read(F.themeCss)

const fail = []
const ok = []
const notChecked = []
const check = (cond, msg) => (cond ? ok.push(msg) : fail.push(msg))

/* 1 — every manifest source is in the allowlist */
const sources = { product: new Set(), content: new Set() }
for (const f of [F.product, `${PKG}/product-pages-0.10.1.json`]) {
  let d
  try { d = JSON.parse(await read(f)) } catch { continue }
  for (const p of Object.values(d.pages || {})) for (const s of p.sections || []) if (s.source) sources.product.add(s.source)
}
// The content half lives in the built package, not in the repo. If it is not
// extracted we must NOT report "none" — that reads as a pass while checking an
// empty set. Say it was skipped, and make the run fail so the gap is visible.
const contentPkg = 'content-pages-0.10.1.json'
const haveContent = pkgPresent(contentPkg)
if (haveContent) {
  const d = JSON.parse(await read(`${PKG}/${contentPkg}`))
  for (const p of d.pages || []) for (const s of p.sections || []) if (s.from) sources.content.add(s.from)
}

for (const family of ['product', 'content']) {
  if (family === 'content' && !haveContent) {
    // The content manifest is a build artifact of Core 0.10.1 and is not in the
    // repository, so CI genuinely cannot check this half. That is a stated
    // limit, not a pass: it is announced loudly, never counted as ok, and the
    // default (no env var) is still a hard failure so a local run cannot be
    // fooled by an empty set the way it was before.
    if (process.env.GCALLS_CONTENT_PKG_OPTIONAL === '1') {
      notChecked.push(`UNMAPPED_SOURCE (content): NOT CHECKED — package absent (${sources.product.size} product sources were checked)`)
      continue
    }
    check(false, `UNMAPPED_SOURCE (content): SKIPPED — ${pkgMissingNote(contentPkg)}`)
    continue
  }
  const missing = [...sources[family]].filter((s) => !contract[family][s])
  check(missing.length === 0,
    `UNMAPPED_SOURCE (${family}): ${missing.length ? missing.join(', ') : `none (${sources[family].size} sources checked)`}`)
}

/* 2 — every icon key the contract names exists in the PHP registry */
const registry = new Set([...iconsPhp.matchAll(/'([a-z0-9-]+)' => '/g)].map((m) => m[1]))
const iconKeys = new Set()
for (const family of ['product', 'content'])
  for (const v of Object.values(contract[family])) if (v.icon) iconKeys.add(v.icon)
const missingIcons = [...iconKeys].filter((k) => !registry.has(k))
check(missingIcons.length === 0, `icon keys missing from registry: ${missingIcons.length ? missingIcons.join(', ') : 'none'} (${iconKeys.size} referenced, ${registry.size} registered)`)

/* 3 — both implementations handle the same component set */
const used = new Set()
for (const family of ['product', 'content']) for (const v of Object.values(contract[family])) used.add(v.component)
const phpCases = new Set([...php.matchAll(/case '([a-z]+)':/g)].map((m) => m[1]))
const jsCases = new Set([...js.matchAll(/case '([a-z]+)':/g)].map((m) => m[1]))
const phpMissing = [...used].filter((c) => c !== 'skip' && c !== 'grid' && c !== 'usecases' && !phpCases.has(c))
const jsMissing = [...used].filter((c) => c !== 'skip' && c !== 'grid' && c !== 'usecases' && !jsCases.has(c))
check(phpMissing.length === 0, `components unhandled in PHP: ${phpMissing.length ? phpMissing.join(', ') : 'none'}`)
check(jsMissing.length === 0, `components unhandled in Node: ${jsMissing.length ? jsMissing.join(', ') : 'none'}`)
check([...used].every((c) => contract.components.includes(c)), 'every component used is declared in contract.components')

/* 4 — neither side hard-codes the reconciliation table */
check(php.includes('gridColumnsByCount'), 'PHP reads gridColumnsByCount from the contract')
check(js.includes('gridColumnsByCount'), 'Node reads gridColumnsByCount from the contract')
check(!/\$cols = 3;\s*\n\s*if \( 4 === \$count/.test(php), 'PHP has no inline 4-item special case left')

/* 5 — every gc- class either side can emit exists in the stylesheet */
const emitted = new Set()
for (const src of [php, js]) for (const m of src.matchAll(/\bgc-[a-z0-9-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?/g)) emitted.add(m[0])
// modifier classes built from a number are checked as their family
const dynamic = /^(gc-grid--|gc-steps--|gc-section--|gc-flow--|gc-iconbox--)/
const cssClasses = new Set([...(css + themeCss).matchAll(/\.(gc-[a-z0-9_-]+)/g)].map((m) => m[1]))
const orphan = [...emitted].filter((c) => !cssClasses.has(c) && !dynamic.test(c) && !['gc-page', 'gc-icon'].includes(c))
check(orphan.length === 0, `classes emitted with no stylesheet rule: ${orphan.length ? orphan.join(', ') : 'none'}`)

/* 6 — the duplicate CTA is closed off in the contract, not in the renderer */
const skipped = Object.entries(contract.product).filter(([, v]) => v.component === 'skip').map(([k]) => k)
check(skipped.length === 4 && skipped.every((s) => s.endsWith('_FINAL_CTA')),
  `duplicate CTA sources marked skip: ${skipped.join(', ')}`)

/* 7 — no !important anywhere in the component stylesheet */
check(!/[^*]!important/.test(css.replace(/\/\*[\s\S]*?\*\//g, '')), 'no !important in gc-components.css')

/* ── Negative tests ──────────────────────────────────────────────────────
 * Each one feeds the Node renderer something malformed and asserts it refuses,
 * because every one of these has actually shipped at some point in this port.
 */
const { renderSection, emptySources } = await import('./lib/section-contract.mjs')
const icons = Object.fromEntries([...iconsPhp.matchAll(/'([a-z0-9-]+)' => '(.*?)', \/\/ lucide/g)].map((m) => [m[1], m[2]]))
const rules = contract.rules || {}

// 1. unknown source -> no plan -> the caller must not render it
check(contract.product.NOT_A_REAL_SOURCE === undefined && contract.content.NOT_A_REAL_SOURCE === undefined,
  'negative: unknown source has no allowlist entry')

// 2. a grid can never emit a zero-width or empty track
let badGrid = false
for (let n = 0; n <= 9; n++) {
  const html = renderSection({ heading: 'H', items: Array.from({ length: n }, (_, i) => ({ title: `t${i}` })) },
    { component: 'grid', modifier: 'gc-grid gc-grid--4', icon: 'check' }, 0, icons, rules, '')
  const m = /gc-grid--(\d)/.exec(html)
  if (n > 0 && m && Number(m[1]) > n) badGrid = true
}
check(!badGrid, 'negative: grid never asks for more columns than it has items')

// 3. duplicate final CTA: every *_FINAL_CTA must be skip, and skip must render ''
const skipRender = renderSection({ heading: 'X', lead: 'Y' }, { component: 'skip' }, 0, icons, rules, '')
check(skipRender === '', 'negative: a skip component renders nothing even with a heading and lead')

// 4. missing lead attribution -> the CTA must still produce a valid href, never "?intent=&source="
const ctaHtml = renderSection({ heading: 'H', lead: 'L', cta: [{ label: 'Ask' }] },
  { component: 'prose', modifier: 'gc-prose', icon: 'dot' }, 0, icons, rules, '')
check(/href="\/lien-he\/"/.test(ctaHtml) && !/[?&](intent|source|product|solution)=(&|")/.test(ctaHtml),
  'negative: a CTA with no attribution emits a bare /lien-he/ and no empty query keys')

// 5. a CTA with no label is dropped rather than rendered as an empty button
const emptyLabel = renderSection({ heading: 'H', lead: 'L', cta: [{ label: '', intent: 'demo' }] },
  { component: 'prose', modifier: 'gc-prose', icon: 'dot' }, 0, icons, rules, '')
check(!/<a class="gc-btn/.test(emptyLabel), 'negative: a CTA with no label is dropped')
emptySources.clear()

/* ---------------------------------------------------------------------------
 * 6-9. Hero and final CTA parity between the manifest and the PREVIEW renderer.
 *
 * These exist because the preview hardcoded both of them. class-shortcodes.php
 * read `hero.cta` and honoured a closing button's own `href`; preview-sections
 * rendered a fixed "Đăng ký tư vấn" at a bare /lien-he/, and rewrote every
 * closing button to /lien-he/?intent=. Nothing failed. The contract test only
 * compared COMPONENT coverage, so two renderers could disagree about the most
 * important link on the page and still report 17 ok.
 * ------------------------------------------------------------------------ */
const preview = await read('wordpress/scripts/preview-sections.mjs')
const productPages = JSON.parse(await read(F.product)).pages

check(!/href="\/lien-he\/">Đăng ký tư vấn</.test(preview),
  'hero CTA is read from the manifest, not hardcoded in the preview')

check(/hero\.cta/.test(preview),
  'preview hero reads hero.cta')

// A closing button carrying its own href must survive as that href.
const hrefAsks = Object.values(productPages)
  .map((p) => p.finalCta?.secondary).filter((a) => a?.href)
check(hrefAsks.length > 0 && /a\.href \? a\.href/.test(preview),
  `final CTA honours an explicit href (${hrefAsks.length} such asks in the manifest)`)

// No page may close with two asks pointing at the same destination.
let dupFinal = []
for (const [id, p] of Object.entries(productPages)) {
  const f = p.finalCta
  if (!f) continue
  const dest = ['primary', 'secondary'].map((k) => {
    const a = f[k]
    if (!a?.label) return null
    return a.href || `/lien-he/?intent=${a.intent || ''}&source=${a.source || ''}&product=${a.product || ''}`
  }).filter(Boolean)
  if (dest.length === 2 && dest[0] === dest[1]) dupFinal.push(id)
}
check(dupFinal.length === 0,
  `negative: no page closes with two identical asks${dupFinal.length ? ': ' + dupFinal.join(', ') : ''}`)

// Every lead CTA in the manifest that has attribution must carry source+product,
// not intent alone — an unattributed lead cannot be routed back to its page.
const thin = []
for (const [id, p] of Object.entries(productPages)) {
  for (const [where, a] of [['hero', p.hero?.cta], ['final.primary', p.finalCta?.primary], ['final.secondary', p.finalCta?.secondary]]) {
    if (!a?.label || a.href) continue
    if (!a.source || !a.product) thin.push(`${id}:${where}`)
  }
}
check(thin.length === 0, `every lead CTA carries source and product${thin.length ? ': ' + thin.join(', ') : ''}`)

/* 9b. A card with a destination renders as a link, in BOTH renderers. */
const cardLink = renderSection(
  { heading: 'H', items: [{ title: 'Đi tới', href: '/san-pham/' }, { title: 'Không link' }] },
  { component: 'grid', modifier: 'gc-grid', icon: '' }, 0, icons, rules, '')
check(/<h3 class="gc-card__title"><a href="\/san-pham\/">Đi tới<\/a><\/h3>/.test(cardLink),
  'a card with an href renders its title as a link (Node)')
check(/<h3 class="gc-card__title">Không link<\/h3>/.test(cardLink),
  'a card without an href stays plain text (Node)')
check(/\$href\s*=\s*isset\( \$item\['href'\] \)/.test(php) && /esc_url\( \$href \)/.test(php),
  'PHP grid() reads item href and escapes it with esc_url')
emptySources.clear()

/* ---------------------------------------------------------------------------
 * 10. Approved media must still be PASS in the media manifest.
 *
 * `approvedMedia.approved` is an allowlist the renderer is fail-closed against,
 * but nothing tied it back to the manifest that made the judgement. An id added
 * here for a blocked screenshot would have rendered a PII original with no test
 * objecting. The manifest is the authority; this asserts the two agree.
 * ------------------------------------------------------------------------ */
const inventory = (await read('docs/content-review/images/image-source-inventory.csv')).split('\n')
const idToFile = new Map()
for (const line of inventory.slice(1)) {
  const [id, file] = line.split(',')
  if (id?.startsWith('GP-')) idToFile.set(id, file)
}
const mediaManifest = JSON.parse(await read('docs/content-review/images/product-media-manifest.json'))
const byFile = new Map(mediaManifest.assets.map((a) => [a.filename, a]))
const approvedIds = Object.keys(contract.approvedMedia?.approved || {})
const badMedia = []
for (const id of approvedIds) {
  const a = byFile.get(idToFile.get(id))
  if (!a) { badMedia.push(`${id}:not-in-manifest`); continue }
  if (a.sanitization_status !== 'PASS') badMedia.push(`${id}:${a.sanitization_status}`)
  if (a.upscaled) badMedia.push(`${id}:upscaled`)
}
check(badMedia.length === 0,
  `every approved media id is manifest PASS and not upscaled (${approvedIds.length} approved)${badMedia.length ? ': ' + badMedia.join(', ') : ''}`)

// The blocked record must name every withheld original, or it drifts: the map
// listed 4 of the 5 PII blocks and neither refusal, so the document understated
// what is being held back while the allowlist quietly did the real work.
const withheld = []
for (const [id, file] of idToFile) {
  const a = byFile.get(file)
  if (a && a.sanitization_status !== 'PASS') withheld.push(id)
}
const undocumented = withheld.filter((id) => !(contract.approvedMedia?.blocked || {})[id])
check(undocumented.length === 0,
  `every withheld original is recorded in approvedMedia.blocked (${withheld.length} withheld)${undocumented.length ? ': ' + undocumented.join(', ') : ''}`)

// An empty-state asset must never be usable as primary feature proof.
const emptyRules = contract.approvedMedia?.emptyState || {}
const unrestricted = Object.entries(emptyRules)
  .filter(([k, v]) => k !== 'note' && !(v?.allowedSections || []).length)
  .map(([k]) => k)
check(unrestricted.length === 0,
  `every empty-state asset is restricted to named sections${unrestricted.length ? ': ' + unrestricted.join(', ') : ''}`)

for (const m of ok) console.log(`  ok    ${m}`)
for (const m of notChecked) console.log(`  SKIP  ${m}`)
for (const m of fail) console.log(`  FAIL  ${m}`)
console.log(`\ncontract-test: ${ok.length} ok, ${fail.length} failed` + (notChecked.length ? `, ${notChecked.length} NOT CHECKED (see SKIP above)` : ''))
/*
 * A run that asserted nothing is not a pass, and NOT CHECKED is not a pass
 * either once this is being used as a release gate. GCALLS-037 makes that
 * explicit: `--release-gate` (or GCALLS_RELEASE_GATE=1) refuses to exit 0 while
 * anything is unverified, so the informative CI run and the gate that decides
 * whether something may ship cannot be confused for one another.
 */
const releaseGate = process.argv.includes('--release-gate') || process.env.GCALLS_RELEASE_GATE === '1'
const ran = ok.length + fail.length

if (ran === 0) {
  console.error('FATAL: 0 assertions ran — an empty run is not a pass')
  process.exit(2)
}
if (releaseGate && notChecked.length) {
  console.error(`FATAL: release gate refuses ${notChecked.length} NOT CHECKED item(s); supply the package via $GCALLS_PKG`)
  process.exit(2)
}
process.exit(fail.length ? 1 : 0)
