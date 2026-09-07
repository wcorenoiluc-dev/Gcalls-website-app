import { chromium } from 'playwright-core'
const ROUTES = ['/', '/gcalls-plus-webphone/', '/gcalls-cx/', '/voicebot-ai/', '/san-pham/', '/giai-phap/', '/qc-bot-ai/']
const b = await chromium.launch({ channel: 'chrome', headless: true })
const probe = async (base, route) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  const errs = []
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  p.on('pageerror', (e) => errs.push(String(e)))
  await p.goto(base + route, { waitUntil: 'networkidle' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) }
    window.scrollTo(0, 0)
  })
  await p.waitForTimeout(400)
  const m = await p.evaluate(() => {
    const c = document.querySelector('.max-w-\\[1280px\\]')
    return {
      h: Math.round(document.documentElement.scrollHeight),
      container: c ? Math.round(c.getBoundingClientRect().width) : null,
      sections: document.querySelectorAll('main section').length,
      h1: document.querySelectorAll('h1').length,
      imgs: document.images.length,
    }
  })
  await ctx.close()
  // The favicon 404 is site-wide and fires only on a context's first load.
  return { ...m, errs: errs.filter(e => !/failed to load resource/i.test(e)).length }
}
console.log('route'.padEnd(24), 'height'.padEnd(18), 'cont'.padEnd(12), 'sec'.padEnd(8), 'h1'.padEnd(6), 'img'.padEnd(8), 'err')
let diffs = 0
for (const r of ROUTES) {
  const a = await probe('http://localhost:5202', r)
  const c = await probe('http://localhost:5201', r)
  const same = JSON.stringify(a) === JSON.stringify(c)
  const expected = r === '/qc-bot-ai/'
  if (!same && !expected) diffs++
  console.log(
    r.padEnd(24),
    `${a.h}->${c.h}`.padEnd(18),
    `${a.container}->${c.container}`.padEnd(12),
    `${a.sections}->${c.sections}`.padEnd(8),
    `${a.h1}->${c.h1}`.padEnd(6),
    `${a.imgs}->${c.imgs}`.padEnd(8),
    `${a.errs}->${c.errs}`,
    same ? 'IDENTICAL' : (expected ? 'CHANGED (in scope)' : '*** UNEXPECTED ***'),
  )
}
console.log('\nunexpected route changes:', diffs)
await b.close()
