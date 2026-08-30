/*
 * Offline preview: render the manifest to HTML with the theme's own tokens and
 * measure it, with no PHP and no WordPress.
 *
 * This exists so layout can be proven before any of it reaches a runtime that
 * cannot be exercised on this machine. It renders from the SAME manifest the
 * PHP renderer will read, so a section that is missing or hollow here is
 * missing or hollow there.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-core'

const MANIFEST = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/gcalls-core/data/content-pages.json', 'utf8'))
const THEME = fs.readFileSync('wordpress/wp-content/themes/gcalls-theme/assets/css/theme.css', 'utf8')
const OUT = process.argv[2] || 'wordpress/content/preview'
fs.mkdirSync(OUT, { recursive: true })

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]))

/* Only these hrefs may be emitted. Anything else is dropped, not rendered. */
const SAFE_HREF = /^\/[a-z0-9\-\/]*\/(\?[a-z0-9=&%\-_.]*)?$/i
const href = (h) => (h && SAFE_HREF.test(h) ? h : '')

const card = (c) =>
  `<article class="cp-card">` +
  (c.title ? `<h3 class="cp-card__title">${esc(c.title)}</h3>` : '') +
  (c.body ? `<p class="cp-card__body">${esc(c.body)}</p>` : '') +
  (href(c.href) ? `<a class="cp-card__link" href="${esc(href(c.href))}">Tìm hiểu thêm</a>` : '') +
  `</article>`

function section(s) {
  const head =
    (s.eyebrow ? `<p class="cp-eyebrow">${esc(s.eyebrow)}</p>` : '') +
    (s.heading ? `<h2 class="cp-h2">${esc(s.heading)}</h2>` : '') +
    (s.lead ? `<p class="cp-lead">${esc(s.lead)}</p>` : '')

  if (s.type === 'prose') {
    if (!s.body && !s.heading) return ''
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}${s.body ? `<p class="cp-prose">${esc(s.body)}</p>` : ''}</section>`
  }
  if (s.type === 'cards') {
    if (!s.cards?.length) return ''
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}<div class="cp-grid">${s.cards.map(card).join('')}</div>${s.note ? `<p class="cp-note">${esc(s.note)}</p>` : ''}</section>`
  }
  if (s.type === 'steps') {
    if (!s.steps?.length) return ''
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}<ol class="cp-steps">` +
      s.steps.map((st) => `<li class="cp-step"><span class="cp-step__n">${String(st.n).padStart(2, '0')}</span><div>${st.title ? `<h3 class="cp-step__title">${esc(st.title)}</h3>` : ''}${st.body ? `<p class="cp-step__body">${esc(st.body)}</p>` : ''}</div></li>`).join('') +
      `</ol></section>`
  }
  if (s.type === 'split') {
    if (!s.columns?.length) return ''
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}<div class="cp-grid cp-grid--2">${s.columns.map(card).join('')}</div></section>`
  }
  if (s.type === 'taglist') {
    if (!s.tags?.length) return ''
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}<ul class="cp-tags">` +
      s.tags.map((t) => `<li class="cp-tag">${esc(t)}</li>`).join('') + `</ul></section>`
  }
  if (s.type === 'comparison') {
    return `<section class="cp-section" data-from="${esc(s.from)}">${head}<div class="cp-compare">` +
      [s.before, s.after].map((side, i) =>
        `<div class="cp-compare__col cp-compare__col--${i ? 'after' : 'before'}"><h3 class="cp-compare__label">${esc(side.label)}</h3><ol class="cp-flow">` +
        side.steps.map((st) => `<li>${esc(st)}</li>`).join('') + `</ol></div>`).join('') +
      `</div></section>`
  }
  return ''
}

function page(p) {
  const hero = p.hero
    ? `<header class="cp-hero">` +
      (hero_eyebrow(p) ? `<p class="cp-eyebrow">${esc(p.hero.eyebrow)}</p>` : '') +
      `<h1 class="cp-h1">${esc(p.hero.h1)}</h1>` +
      (p.hero.description ? `<p class="cp-hero__lead">${esc(p.hero.description)}</p>` : '') +
      (p.hero.points?.length ? `<div class="cp-grid cp-grid--3">${p.hero.points.map(card).join('')}</div>` : '') +
      `</header>`
    : ''

  /*
   * The form slot renders as a clearly BLOCKED area, never as a form.
   * No inputs exist, so nothing can be typed and nothing can appear to send —
   * the failure this whole project has been avoiding is a visitor believing a
   * message got through when there is no backend to receive it.
   */
  const slot = p.form_slot
    ? `<section class="cp-section"><div class="cp-slot" role="note"><p class="cp-slot__title">Biểu mẫu đăng ký tư vấn</p>` +
      `<p class="cp-slot__body">Biểu mẫu sẽ được bật trong một bản phát hành riêng. Trong lúc này, vui lòng liên hệ qua email hoặc hotline ở trên.</p></div></section>`
    : ''

  const faq = p.faq?.length
    ? `<section class="cp-section" data-from="FAQ"><h2 class="cp-h2">Câu hỏi thường gặp</h2><div class="cp-faq">` +
      p.faq.map((f) => `<div class="cp-faq__item"><h3 class="cp-faq__q">${esc(f.q)}</h3><p class="cp-faq__a">${esc(f.a)}</p></div>`).join('') +
      `</div></section>`
    : ''

  const a = p.attribution || {}
  const query = ['intent', 'source', 'product', 'solution']
    .filter((k) => a[k]).map((k) => `${k}=${encodeURIComponent(a[k])}`).join('&')
  const ctaHref = `/lien-he/${query ? '?' + query : ''}`

  const cta = p.cta
    ? `<section class="cp-section cp-cta"><h2 class="cp-h2">${esc(p.cta.heading)}</h2>` +
      (p.cta.body ? `<p class="cp-lead">${esc(p.cta.body)}</p>` : '') +
      `<a class="cp-btn" href="${esc(ctaHref)}">${esc(p.cta.label || 'Đăng ký tư vấn')}</a></section>`
    : ''

  return `<main class="cp-page">${hero}${p.sections.map(section).join('')}${slot}${faq}${cta}</main>`
}
const hero_eyebrow = (p) => p.hero && p.hero.eyebrow

const CSS = `
:root{--ink:#1e2026;--muted:#5b5f6b;--brand:#673ab7;--line:rgba(103,58,183,.14);--surf:#fff}
*{box-sizing:border-box}
body{margin:0;background:#faf9fc;color:var(--ink);font:16px/1.6 'Open Sans',system-ui,sans-serif}
.cp-page{max-width:1120px;margin:0 auto;padding:0 20px}
.cp-hero{padding-block:50px}
.cp-section{padding-block:50px}
.cp-eyebrow{color:var(--brand);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px}
.cp-h1{font-size:clamp(28px,3.4vw,44px);line-height:1.15;font-weight:800;margin:0 0 16px;letter-spacing:-.02em}
.cp-h2{font-size:clamp(22px,2.6vw,32px);line-height:1.2;font-weight:800;margin:0 0 12px;letter-spacing:-.01em}
.cp-lead,.cp-hero__lead,.cp-prose{color:var(--muted);margin:0 0 28px;max-width:70ch}
.cp-hero__lead{font-size:17px}
.cp-grid{display:grid;gap:20px;grid-template-columns:1fr}
@media(min-width:768px){.cp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.cp-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.cp-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}}
.cp-card{background:var(--surf);border:1px solid var(--line);border-radius:16px;padding:24px;display:flex;flex-direction:column;height:100%}
.cp-card__title{font-size:15px;font-weight:700;margin:0 0 8px;line-height:1.35}
.cp-card__body{color:var(--muted);font-size:14px;margin:0;flex:1}
.cp-card__link{color:var(--brand);font-size:13px;font-weight:700;margin-top:16px;text-decoration:none}
.cp-steps{list-style:none;margin:0;padding:0;display:grid;gap:20px}
@media(min-width:768px){.cp-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
.cp-step{display:flex;gap:14px;background:var(--surf);border:1px solid var(--line);border-radius:16px;padding:20px 24px}
.cp-step__n{color:var(--brand);font-weight:800;font-family:ui-monospace,monospace;flex:none}
.cp-step__title{font-size:15px;font-weight:700;margin:0 0 6px}
.cp-step__body{color:var(--muted);font-size:14px;margin:0}
.cp-compare{display:grid;gap:20px}
@media(min-width:768px){.cp-compare{grid-template-columns:repeat(2,minmax(0,1fr))}}
.cp-compare__col{background:var(--surf);border:1px solid var(--line);border-radius:16px;padding:24px}
.cp-compare__col--after{border-color:rgba(22,163,74,.35);background:#f6fdf8}
.cp-compare__label{font-size:14px;font-weight:800;margin:0 0 12px}
.cp-flow{margin:0;padding-left:20px;color:var(--muted);font-size:14px}
.cp-flow li{margin-bottom:6px}
.cp-faq{display:grid;gap:16px}
.cp-faq__item{background:var(--surf);border:1px solid var(--line);border-radius:14px;padding:20px 24px}
.cp-faq__q{font-size:15px;font-weight:700;margin:0 0 8px}
.cp-faq__a{color:var(--muted);font-size:14px;margin:0}
.cp-cta{text-align:center}
.cp-btn{display:inline-flex;align-items:center;gap:8px;background:var(--brand);color:#fff;border-radius:12px;padding:14px 28px;font-weight:700;font-size:14px;text-decoration:none}
.cp-tags{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}
.cp-tag{background:var(--surf);border:1px solid var(--line);border-radius:999px;padding:9px 16px;font-size:14px;color:var(--ink)}
.cp-slot{border:1px dashed rgba(103,58,183,.45);background:#faf8ff;border-radius:16px;padding:24px}
.cp-slot__title{font-weight:700;margin:0 0 8px}
.cp-slot__body{color:var(--muted);font-size:14px;margin:0}
.cp-note{color:var(--muted);font-size:13px;margin:16px 0 0}
`

const b = await (async () => {
  const P = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  try { return await chromium.launch() } catch { return chromium.launch({ executablePath: P[0] }) }
})()

const results = {}

for (const p of MANIFEST.pages) {
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(p.slug)}</title><style>${CSS}</style>${page(p)}`
  fs.writeFileSync(path.join(OUT, `${p.slug}.html`), html)
  results[p.slug] = {}

  for (const w of [1440, 1024, 768, 390, 320]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } })
    const pg = await ctx.newPage()
    await pg.setContent(html, { waitUntil: 'load' })
    await pg.waitForTimeout(150)
    await pg.screenshot({ path: path.join(OUT, `${p.slug}-${w}.png`), fullPage: true })

    results[p.slug][w] = await pg.evaluate(() => {
      const secs = [...document.querySelectorAll('.cp-section, .cp-hero')]
      const pads = [...new Set(secs.map((s) => `${Math.round(parseFloat(getComputedStyle(s).paddingTop))}/${Math.round(parseFloat(getComputedStyle(s).paddingBottom))}`))]
      let worst = 0
      for (let i = 1; i < secs.length; i++) {
        const a = secs[i - 1].getBoundingClientRect(), c = secs[i].getBoundingClientRect()
        worst = Math.max(worst, Math.round(c.top - a.bottom))
      }
      const rows = {}
      for (const g of document.querySelectorAll('.cp-grid')) {
        for (const c of g.querySelectorAll('.cp-card')) {
          const t = Math.round(c.getBoundingClientRect().top)
          ;(rows[t] ||= []).push(Math.round(c.getBoundingClientRect().height))
        }
      }
      const equal = Object.values(rows).every((hs) => new Set(hs).size <= 1)
      return {
        sections: secs.length,
        h1: document.querySelectorAll('h1').length,
        pads, worstGap: worst,
        cols: getComputedStyle(document.querySelector('.cp-grid')).gridTemplateColumns.split(' ').length,
        equalHeight: equal,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
        emptySections: secs.filter((s) => !(s.innerText || '').trim()).length,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
        placeholder: /lorem ipsum|TODO|PLACEHOLDER|xxx/i.test(document.body.innerText),
        rawShortcode: /\[[a-z_]+[^\]]*\]/.test(document.body.innerText),
        docH: Math.round(document.body.scrollHeight),
      }
    })
    await ctx.close()
  }
}

fs.writeFileSync(path.join(OUT, 'preview-acceptance.json'), JSON.stringify(results, null, 1))
await b.close()

console.log(`${'route'.padEnd(30)} ${'bp'.padEnd(5)} sec h1 cols pads      worstGap equalH ovf empty ph raw`)
let fails = 0
for (const [slug, byW] of Object.entries(results)) {
  for (const [w, r] of Object.entries(byW)) {
    const bad = r.h1 !== 1 || r.overflowX || r.emptySections > 0 || r.worstGap > 80 || !r.equalHeight || r.placeholder || r.rawShortcode || !r.pads.every((p) => p === '50/50')
    if (bad) fails++
    console.log(`${slug.padEnd(30)} ${w.padEnd(5)} ${String(r.sections).padStart(3)} ${r.h1}  ${r.cols}    ${r.pads.join(',').padEnd(9)} ${String(r.worstGap).padStart(8)} ${String(r.equalHeight).padEnd(6)} ${String(r.overflowX).padEnd(3)} ${r.emptySections}     ${r.placeholder ? 'Y' : 'n'}  ${r.rawShortcode ? 'Y' : 'n'}${bad ? '   <-- FAIL' : ''}`)
  }
}
console.log(`\n${fails === 0 ? 'PREVIEW ACCEPTANCE: PASS' : `PREVIEW ACCEPTANCE: ${fails} FAIL`}`)
