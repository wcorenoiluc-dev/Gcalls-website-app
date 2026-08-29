#!/usr/bin/env node
/**
 * The Gcalls Plus hero gallery, exercised the way a person would.
 *
 * A tab strip that only answers the mouse is not a tab strip, and neither the
 * PHP nor the JS can prove from source that clicking one actually changes the
 * image. This drives it: six tabs, a click, both arrow keys, and a check that
 * the panel behind them really changed each time.
 */
import { chromium } from 'playwright-core'

const URL = 'https://ashernguyenxuanthuy.com/gcalls-plus-webphone/'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
let failures = 0
const ok = (l) => console.log(`  ok   ${l}`)
const fail = (l, d) => { console.log(`  FAIL ${l}${d ? ` — ${d}` : ''}`); failures += 1 }

for (const width of [1440, 390]) {
  console.log(`\n@${width}px`)
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  const tabs = page.locator('[data-gcalls-mock="plus_gallery"] [role="tab"]')
  const count = await tabs.count()
  count === 6 ? ok(`six tabs (${count})`) : fail('six tabs', String(count))

  const shown = async () => page.locator('[data-gcalls-mock="plus_gallery"] img:visible').first().getAttribute('src')

  const first = await shown()

  // Click the fourth tab.
  await tabs.nth(3).click()
  await page.waitForTimeout(350)
  const afterClick = await shown()
  afterClick && afterClick !== first ? ok('clicking a tab changes the image') : fail('clicking a tab changes the image', `${first} → ${afterClick}`)

  const selectedIndex = async () => {
    const flags = await tabs.evaluateAll((nodes) => nodes.map((n) => n.getAttribute('aria-selected')))
    return flags.indexOf('true')
  }

  ;(await selectedIndex()) === 3 ? ok('aria-selected follows the click') : fail('aria-selected follows the click', String(await selectedIndex()))

  // Roving tabindex: exactly one tab reachable by Tab.
  const reachable = await tabs.evaluateAll((nodes) => nodes.filter((n) => n.tabIndex === 0).length)
  reachable === 1 ? ok('exactly one tab is in the tab order') : fail('exactly one tab is in the tab order', String(reachable))

  await tabs.nth(3).focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(300)
  ;(await selectedIndex()) === 4 ? ok('ArrowRight moves to the next tab') : fail('ArrowRight moves to the next tab', String(await selectedIndex()))

  const afterRight = await shown()
  afterRight !== afterClick ? ok('the arrow key changes the image too') : fail('the arrow key changes the image too')

  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(300)
  ;(await selectedIndex()) === 3 ? ok('ArrowLeft moves back') : fail('ArrowLeft moves back', String(await selectedIndex()))

  // On a phone the strip must scroll rather than wrap or clip.
  if (width === 390) {
    const scrollable = await page
      .locator('[data-gcalls-mock="plus_gallery"] [role="tablist"]')
      .evaluate((n) => n.scrollWidth > n.clientWidth || getComputedStyle(n).overflowX === 'auto')
    scrollable ? ok('the tab strip scrolls sideways on a phone') : fail('the tab strip scrolls sideways on a phone')
  }

  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('[data-gcalls-mock="plus_gallery"] img')].filter((i) => i.complete && i.naturalWidth === 0).length,
  )
  broken === 0 ? ok('no broken gallery image') : fail('no broken gallery image', String(broken))

  await context.close()
}

await browser.close()
console.log(`\nfailures: ${failures}`)
process.exit(failures === 0 ? 0 : 1)
