import { chromium } from 'playwright-core'
import sharp from 'sharp'
const html = `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;background:#F7F5FA;position:relative;overflow:hidden}
.bar{position:absolute;top:0;left:0;right:0;height:10px;background:#673AB7}
.blob{position:absolute;right:-80px;top:-60px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(103,58,183,.20),rgba(103,58,183,.05))}
.wrap{position:absolute;left:88px;top:150px;width:720px}
.kicker{font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#673AB7;font-weight:700}
h1{font-size:60px;line-height:1.15;color:#191324;margin:22px 0 20px;font-weight:800;letter-spacing:-.02em}
p{font-size:27px;color:#5C5568;line-height:1.45}
</style><body>
<div class="bar"></div><div class="blob"></div>
<div class="wrap">
<div class="kicker">Tổng đài &amp; Call Center</div>
<h1>Tổng đài ảo là gì và lợi ích hàng đầu cho doanh nghiệp</h1>
<p>Kiến thức vận hành — đầy đủ dấu tiếng Việt: ộ ệ ữ ẩ ướ ỹ ằ</p>
</div></body>`
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await p.setContent(html, { waitUntil: 'load' })
await p.screenshot({ path: '.media-050/probe/chrome.png' })
await b.close()
await sharp('.media-050/probe/chrome.png').resize(1200, 630).webp({ quality: 86 }).toFile('.media-050/probe/chrome.webp')
const md = await sharp('.media-050/probe/chrome.webp').metadata()
console.log('chrome->webp', md.width + 'x' + md.height, (await import('node:fs')).statSync('.media-050/probe/chrome.webp').size, 'bytes')
