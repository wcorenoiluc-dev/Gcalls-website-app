#!/usr/bin/env node
/**
 * GCALLS-036B — local source preview.
 *
 * NOT LIVE ACCEPTANCE. This draws the candidate from the manifests and the
 * shared contract so component choice, DOM hierarchy, class modifiers, grid
 * columns, split direction, icons and CTA count can be measured before
 * anything is uploaded. Live acceptance still needs the package on the host.
 *
 * The mockups are the one thing not drawn faithfully: their real
 * implementations live in class-mockups.php and are not being rewritten, so the
 * preview substitutes a labelled box of the same role. Every such box says so
 * in the DOM (data-preview-stub) and the acceptance script counts them.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { loadContract, loadIcons, renderSection, emptySources, esc, leadHref } from './lib/section-contract.mjs'
import { PKG, pkgPresent, pkgMissingNote } from './lib/pkg-dir.mjs'

const OUT = 'docs/content-review/gcalls-036b/preview'

const contract = await loadContract()
const icons = await loadIcons()
const rules = contract.rules || {}
const themeCss = await readFile('wordpress/wp-content/themes/gcalls-theme/assets/css/theme.css', 'utf8')
const gcCss = await readFile('wordpress/wp-content/themes/gcalls-theme/assets/css/gc-components.css', 'utf8')

const unmapped = new Set()

/** A stand-in for a class-mockups.php drawing, at a plausible aspect ratio. */
const stub = (id) =>
  `<div class="gc-stub" data-preview-stub="${esc(id)}"><span>${esc(id)}</span></div>`

function page(title, bodyClass, inner) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${themeCss}</style>
<style>${gcCss}</style>
<style>
/* Preview-only: mirrors .gcalls-product__hero in the plugin's product.css,
   which lays the hero out as 0.82fr copy / 1.18fr visual and stacks on
   narrow viewports. Proportions are copied, not chosen. */
.gc-hero-grid{display:grid;gap:clamp(2rem,4vw,4.5rem);
  grid-template-columns:minmax(0,0.82fr) minmax(0,1.18fr);align-items:center}
.gc-hero-grid .gc-hero{max-width:none}
.gc-hero__visual{min-width:0}
@media (max-width:900px){.gc-hero-grid{grid-template-columns:minmax(0,1fr)}}
/* Preview-only: the stand-in for a class-mockups.php drawing. */
.gc-stub{align-items:center;aspect-ratio:16/10;background:linear-gradient(135deg,#f5f1fc,#faf9fc);
 border:1px dashed rgba(103,58,183,.35);border-radius:12px;color:#673ab7;display:flex;
 font:600 13px/1.4 system-ui;justify-content:center;text-align:center}
body{margin:0}
</style></head><body class="${esc(bodyClass)}"><main>${inner}</main></body></html>`
}

function heroBlock(hero) {
  if (!hero) return ''
  // A product hero is a two-column grid in the shipped CSS (product.css:
  // .gcalls-product__hero, 0.82fr / 1.18fr). A content hero has no visual and
  // stays one column, which is why the wrapper is conditional.
  const hasVisual = !!hero.mockup
  let out = '<section class="gc-section gc-section--hero"><div class="gc-container">'
  if (hasVisual) out += '<div class="gc-hero-grid">'
  out += '<div class="gc-hero">'
  if (hero.eyebrow) out += `<p class="gc-head__eyebrow">${esc(hero.eyebrow)}</p>`
  // Product manifests say heading/lead; content manifests say h1/description.
  const h1 = hero.heading || hero.h1 || hero.title || ''
  const lede = hero.lead || hero.description || ''
  out += `<h1 class="gc-hero__title">${esc(h1)}</h1>`
  if (lede) out += `<p class="gc-head__desc">${esc(lede)}</p>`
  const pts = hero.points || []
  if (pts.length) {
    out += '<ul class="gc-checks">'
    for (const p of pts) out += `<li><span class="gc-iconbox gc-iconbox--round">${icons.check ? `<svg class="gc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons.check}</svg>` : ''}</span><span>${esc(p)}</span></li>`
    out += '</ul>'
  }
  /*
   * The hero's own ask, from the manifest, with its own attribution.
   *
   * This used to be a hardcoded `Đăng ký tư vấn` pointing at a bare
   * `/lien-he/`. class-shortcodes.php has always read `hero.cta`, so the
   * preview was showing a label and a destination the shipped renderer never
   * produces: three of the four products ask for a DEMO here, and all four
   * carry source/product attribution. Every CTA measurement taken on these
   * previews was therefore measuring the preview, not the candidate.
   */
  const hc = hero.cta || {}
  const hLabel = (hc.label || '').trim() || 'Đăng ký tư vấn'
  out += `<p class="gc-cta__row"><a class="gc-btn gc-btn--primary" href="${esc(hc.href || leadHref(hc))}">${esc(hLabel)}</a></p>`
  out += '</div>'
  /*
   * The hero visual. class-shortcodes.php renders `hero.mockup` through
   * Mockups::render() into .gcalls-product__hero-visual; this preview drew
   * nothing at all, so every product hero measured ~400px shorter than React
   * and scored as having no split. Part of the "WordPress is 16% shorter"
   * finding was this omission, not missing content.
   */
  if (hasVisual) out += `<div class="gc-hero__visual">${stub(hero.mockup)}</div></div>`
  return out + '</div></section>'
}

function directBlock(d) {
  if (!d || !d.question || !d.answer) return ''
  return `<section class="gc-section gc-section--direct"><div class="gc-container"><div class="gc-head"><h2 class="gc-head__title">${esc(d.question)}</h2></div><div class="gc-prose"><p>${esc(d.answer)}</p></div></div></section>`
}

function faqBlock(faq, product) {
  if (!faq || !faq.length) return ''
  let out = `<section class="gc-section gc-section--faq"><div class="gc-container"><div class="gc-head"><h2 class="gc-head__title">Câu hỏi thường gặp${product ? ' về ' + esc(product) : ''}</h2></div><div class="gc-faq">`
  for (const f of faq) {
    const q = f.question || f.q
    const a = f.answer || f.a
    if (!q || !a) continue
    out += `<div class="gc-faq__item"><h3 class="gc-faq__q">${esc(q)}</h3><p class="gc-faq__a">${esc(a)}</p></div>`
  }
  return out + '</div></div></section>'
}

function finalBlock(final) {
  if (!final) return ''
  let out = `<section class="gc-section gc-section--final"><div class="gc-container"><div class="gc-cta"><h2 class="gc-head__title">${esc(final.heading || 'Trao đổi cấu hình phù hợp với đội ngũ của bạn')}</h2>`
  const lede = final.lead || final.body || ''
  if (lede) out += `<p class="gc-head__desc">${esc(lede)}</p>`
  out += '<div class="gc-cta__row">'
  let n = 0
  for (const [k, style] of [['primary', 'gc-btn--primary'], ['secondary', 'gc-btn--ghost']]) {
    const a = final[k]
    if (!a || !a.label) continue
    // A closing button that names its own destination is a LINK, not a lead
    // ask. Forcing `/lien-he/` onto it turned Gcalls Plus's estimator button
    // into a second identical contact link — a duplicate final CTA the
    // acceptance list bans, invented entirely by this renderer. And dropping
    // source/product meant the closing ask arrived unattributed.
    const href = a.href ? a.href : leadHref({ intent: a.intent || 'consultation', source: a.source, product: a.product, solution: a.solution })
    out += `<a class="gc-btn ${style}" href="${esc(href)}">${esc(a.label)}</a>`
    n++
  }
  // Content manifests carry a single `label` (often empty) rather than a
  // primary/secondary pair. A CTA band with no button is the heading-orphan
  // the acceptance list bans, so the band falls back to the site's standard
  // ask rather than rendering a headline into empty space.
  if (!n) {
    out += `<a class="gc-btn gc-btn--primary" href="/lien-he/?intent=consultation">${esc(final.label || 'Đăng ký tư vấn')}</a>`
  }
  return out + '</div></div></div></section>'
}

/**
 * The lead form slot.
 *
 * The manifest states `form_slot.state = blocked_runtime` and says in as many
 * words that it must never render as a form that appears to send. So this is a
 * contact card: the two real channels, as a tel: and a mailto: link that work
 * right now, and one sentence saying the online form is not open yet. A
 * disabled-looking form would be worse than no form — it invites someone to
 * type a message that goes nowhere.
 */
function leadSlotBlock(p) {
  const slot = p.form_slot
  if (!slot) return ''
  const contact = (p.sections || []).find((s) => /contact card/i.test(s.from || ''))
  const cards = contact?.cards || []
  const find = (t) => cards.find((c) => (c.title || '').toLowerCase() === t)?.body || ''
  const email = find('email')
  const phone = find('hotline')
  let out = '<section class="gc-section gc-section--leadslot"><div class="gc-container"><div class="gc-leadslot">'
  out += '<h2 class="gc-head__title">Gửi yêu cầu tư vấn</h2>'
  out += '<p class="gc-head__desc">Biểu mẫu trực tuyến chưa mở. Trong lúc này, hai kênh dưới đây nhận yêu cầu ngay.</p>'
  if (phone) out += `<p class="gc-leadslot__row"><a class="gc-btn gc-btn--primary" href="tel:${esc(phone.replace(/\s/g, ''))}">Gọi ${esc(phone)}</a></p>`
  if (email) out += `<p class="gc-leadslot__row"><a class="gc-btn gc-btn--ghost" href="mailto:${esc(email)}">${esc(email)}</a></p>`
  return out + '</div></div></section>'
}

const written = []

/* ---- product pages ---- */
// The product manifest now comes from the freshly exported file, not the
// 0.10.1 package copy: 036C re-ran the exporter to recover four sections the
// old export dropped. Content pages still come from the package, which is the
// only place the six Batch 2 routes exist.
const prod = JSON.parse(await readFile('wordpress/wp-content/plugins/gcalls-core/data/product-pages.json', 'utf8')).pages
for (const [slug, p] of Object.entries(prod)) {
  let inner = heroBlock(p.hero) + directBlock(p.direct)
  let index = 0
  for (const s of p.sections || []) {
    const plan = contract.product[s.source]
    if (!plan) { unmapped.add(s.source); continue }
    // A substituted mockup lives on the plan, not on the manifest section.
    // An approved screenshot outranks a substituted mockup: the substitution
    // only exists because the real image was blocked.
    const approved = contract.approvedMedia?.approved || {}
    const emptyState = contract.approvedMedia?.emptyState || {}
    const rule = emptyState[s.media]
    const mediaOk = !!approved[s.media] &&
      (!rule?.allowedSections || rule.allowedSections.includes(s.source))
    const mid = s.mockup || s.diagram || (plan.mockupSubstituted && !mediaOk ? plan.mockup : '')
    const mk = mid ? stub(mid) : (mediaOk ? stub(`${s.media} (ảnh thật đã duyệt)`) : '')
    const html = renderSection(s, plan, index, icons, rules, mk)
    if (!html) continue
    inner += html
    index++
  }
  inner += faqBlock(p.faq, p.product)
  inner += finalBlock(p.finalCta)
  await mkdir(OUT, { recursive: true })
  const f = path.join(OUT, `product-${slug}.html`)
  await writeFile(f, page(`${slug} — WordPress candidate`, 'gc-page gc-page--product', inner))
  written.push([f, index])
}

/* ---- content pages ---- */
const cont = JSON.parse(await readFile(path.join(PKG, 'content-pages-0.10.1.json'), 'utf8')).pages
for (const p of cont) {
  let inner = heroBlock(p.hero)
  let index = 0
  for (const s of p.sections || []) {
    const plan = contract.content[s.from]
    if (!plan) { unmapped.add(s.from); continue }
    const html = renderSection(s, plan, index, icons, rules, '')
    if (!html) continue
    inner += html
    index++
  }
  inner += leadSlotBlock(p)
  inner += faqBlock(p.faq)
  inner += finalBlock(p.cta)
  const f = path.join(OUT, `content-${p.slug}.html`)
  await writeFile(f, page(`${p.slug} — WordPress candidate`, `gc-page gc-page--${p.family || 'content'}`, inner))
  written.push([f, index])
}

for (const [f, n] of written) console.log(`${String(n).padStart(3)} sections  ${f}`)
if (unmapped.size) {
  console.error(`\nUNMAPPED_SOURCE (${unmapped.size}): ${[...unmapped].join(', ')}`)
  process.exit(1)
}
console.log(`\n${written.length} preview pages, 0 UNMAPPED_SOURCE`)
if (emptySources.size) {
  console.log(`CONTENT_MISSING (heading with no body in the manifest, section dropped): ${[...emptySources].join(', ')}`)
}
