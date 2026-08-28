import fs from 'node:fs'
const BASE = 'https://ashernguyenxuanthuy.com'
const manifest = JSON.parse(fs.readFileSync('wordpress/imports/content-manifest.json', 'utf8'))
const routes = manifest.pages.map((p) => p.route)
const rows = []

for (const route of routes) {
  try {
    const res = await fetch(BASE + route, { redirect: 'manual' })
    const html = res.status === 200 ? await res.text() : ''
    rows.push({
      route,
      status: res.status,
      header: html.includes('gcalls-nav__list') || html.includes('gcalls-header'),
      footer: html.includes('gcalls-footer__brand'),
      cta: html.includes('gcalls-cta'),
      phpErr: /(Warning|Notice|Deprecated|Fatal error|Parse error):\s/.test(html),
      bytes: html.length,
      imgs: (html.match(/<img[^>]+src="[^"]*uploads/g) ?? []).length,
    })
  } catch (error) {
    rows.push({ route, status: 'ERR', error: String(error).slice(0, 40) })
  }
}

const w = (s, n) => String(s).padEnd(n).slice(0, n)
console.log(`${w('ROUTE',34)}${w('ST',5)}${w('HDR',5)}${w('FTR',5)}${w('CTA',5)}${w('PHPERR',8)}${w('BYTES',8)}IMG`)
for (const r of rows) {
  console.log(`${w(r.route,34)}${w(r.status,5)}${w(r.header?'y':'-',5)}${w(r.footer?'y':'-',5)}${w(r.cta?'y':'-',5)}${w(r.phpErr?'YES':'-',8)}${w(r.bytes,8)}${r.imgs}`)
}
const fail = rows.filter((r) => r.status !== 200 || !r.header || !r.footer || r.phpErr || r.bytes < 8000)
console.log(`\n${rows.length} routes · ${rows.length - fail.length} PASS · ${fail.length} FAIL`)
for (const f of fail) console.log(`  FAIL ${f.route}: status=${f.status} hdr=${f.header} ftr=${f.footer} php=${f.phpErr} bytes=${f.bytes}`)
