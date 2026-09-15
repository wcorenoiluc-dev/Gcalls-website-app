import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
const port = process.argv[2] || '4190'
const s = spawn('npx', ['vite','preview','--port',port,'--strictPort'], { stdio: 'ignore' })
await new Promise(r => setTimeout(r, 2500))
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
for (const r of ['/', '/san-pham/', '/gcalls-plus-webphone/', '/qc-bot-ai/', '/gcalls-cx/']) {
  await p.goto('http://localhost:' + port + r, { waitUntil: 'networkidle' })
  await p.waitForSelector('main h1')
  const html = await p.evaluate(() => document.querySelector('main').innerHTML.replace(/main-[A-Za-z0-9_-]{8}/g, 'X'))
  console.log(r, createHash('sha256').update(html).digest('hex').slice(0, 16))
}
await b.close(); s.kill()
