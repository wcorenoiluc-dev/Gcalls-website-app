/**
 * Renders the drawn covers, a blog card and an article header, using the real
 * theme stylesheet and the real hub data.
 *
 * WHAT THIS IS AND IS NOT
 * It is NOT WordPress output. There is no PHP on this machine, so the theme
 * cannot be executed and no screenshot of the actual blog page is obtainable
 * before deploy. What this does is take the hub table straight out of
 * `gcalls_hub_cover_styles()` — parsed, not retyped — and draw it with the
 * stylesheet the theme ships. So the palette, the glyphs and every CSS rule
 * are the real ones; only the surrounding page furniture is a stand-in.
 *
 * That is enough to answer the question a screenshot is being asked for here:
 * does a drawn cover look like a cover, and are thirteen of them
 * distinguishable from each other.
 *
 *   node wordpress/scripts/preview-blog.mjs
 *   → wordpress/dist/parity/blog-preview.html
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.join(HERE, '..')
const OUT = path.join(WP, 'dist', 'parity')
const THEME = path.join(WP, 'wp-content/themes/gcalls-theme')

const tags = await readFile(path.join(THEME, 'inc/template-tags.php'), 'utf8')
const themeCss = await readFile(path.join(THEME, 'assets/css/theme.css'), 'utf8')

/* The hub table, parsed from the PHP so this cannot drift from it. */
const block = tags.slice(
  tags.indexOf('function gcalls_hub_cover_styles()'),
  tags.indexOf('function gcalls_post_cover'),
)

const hubs = [...block.matchAll(/'([a-z0-9-]+)'\s*=>\s*array\(\s*'hue'\s*=>\s*(\d+),\s*'glyph'\s*=>\s*'([^']+)'\s*\)/g)]
  .map(([, slug, hue, glyph]) => ({ slug, hue: Number(hue), glyph }))

if (hubs.length === 0) throw new Error('could not parse gcalls_hub_cover_styles() from the theme')

/* Names, from the plugin's canonical list — same source the taxonomy uses. */
const hubPhp = await readFile(
  path.join(WP, 'wp-content/plugins/gcalls-core/includes/class-hub-taxonomy.php'),
  'utf8',
)
const names = Object.fromEntries(
  [...hubPhp.matchAll(/'slug'\s*=>\s*'([^']+)',\s*'name'\s*=>\s*'([^']+)'/g)].map(([, s, n]) => [s, n]),
)

const cover = (hub, extraClass = '') =>
  `<span class="gcalls-cover ${extraClass}" style="--gcalls-cover-hue:${hub.hue}" role="img" aria-label="Ảnh minh họa chủ đề ${names[hub.slug] ?? hub.slug}">` +
  `<svg class="gcalls-cover__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${hub.glyph}"/></svg>` +
  `<span class="gcalls-cover__label">${names[hub.slug] ?? hub.slug}</span></span>`

const SAMPLES = [
  { hub: 'crm-helpdesk-va-tich-hop', title: 'Dữ liệu đồng bộ giữa tổng đài và helpdesk', excerpt: 'Khi tổng đài và helpdesk dùng chung một nguồn dữ liệu, nhân viên không phải tra cứu hai nơi cho cùng một khách hàng.', date: '28 tháng 8, 2026' },
  { hub: 'tong-dai-va-call-center', title: 'Tổng đài trên trình duyệt hoạt động thế nào', excerpt: 'Cuộc gọi đi qua WebRTC ngay trong tab đang mở, nên đội ngũ không cần cài đặt thêm phần mềm nào trên máy.', date: '28 tháng 8, 2026' },
  { hub: 'qa-qc-va-quan-tri-chat-luong', title: 'Xây dựng bộ tiêu chí đánh giá chất lượng cuộc gọi', excerpt: 'Một bộ tiêu chí tốt đo được điều quản lý thực sự quan tâm, và đủ ngắn để chấm hết một ca làm việc.', date: '28 tháng 8, 2026' },
]

const card = (s) => `
<article class="gcalls-card">
  <a class="gcalls-card__media" href="#" tabindex="-1" aria-hidden="true">${cover(hubs.find((h) => h.slug === s.hub))}</a>
  <div class="gcalls-card__body">
    <ul class="gcalls-terms"><li class="gcalls-terms__item"><a href="#">${names[s.hub]}</a></li></ul>
    <h3 class="gcalls-card__title"><a href="#">${s.title}</a></h3>
    <p class="gcalls-card__excerpt">${s.excerpt}</p>
    <p class="gcalls-meta"><time class="gcalls-meta__date">${s.date}</time></p>
    <span class="gcalls-card__more" aria-hidden="true">Đọc tiếp
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
    </span>
  </div>
</article>`

const page = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gcalls — blog cover preview</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${themeCss}
body { padding: 2rem 0; }
.pv-wrap { margin: 0 auto; max-width: var(--gcalls-container); padding: 0 var(--gcalls-gutter); }
.pv-h { font-size: 1.1rem; margin: 2.5rem 0 1rem; }
.pv-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
</style></head>
<body><div class="pv-wrap">

<h1 class="gcalls-page-header__title">Blog</h1>

<p class="pv-h">Thirteen HUB covers — drawn, no attachment, no upload</p>
<div class="pv-grid">${hubs.map((h) => cover(h)).join('')}</div>

<p class="pv-h">Blog card — cover, HUB, title, excerpt, date, read-more</p>
<div class="gcalls-cards">${SAMPLES.map(card).join('')}</div>

<p class="pv-h">Article header — cover, meta, contents list</p>
<article class="gcalls-article">
  <header class="gcalls-page-header">
    <ul class="gcalls-terms"><li class="gcalls-terms__item"><a href="#">${names['crm-helpdesk-va-tich-hop']}</a></li></ul>
    <h2 class="gcalls-page-header__title">Dữ liệu đồng bộ giữa tổng đài và helpdesk</h2>
    <p class="gcalls-meta"><time class="gcalls-meta__date">28 tháng 8, 2026</time> <time class="gcalls-meta__updated">Cập nhật 29 tháng 8, 2026</time></p>
  </header>
  <figure class="gcalls-article__cover">${cover(hubs.find((h) => h.slug === 'crm-helpdesk-va-tich-hop'))}</figure>
  <nav class="gcalls-toc" aria-labelledby="t"><p class="gcalls-toc__title" id="t">Nội dung bài viết</p><ol>
    <li><a href="#a">Vì sao dữ liệu lệch nhau giữa hai hệ thống</a></li>
    <li class="li--sub"><a href="#b">Trường hợp thường gặp</a></li>
    <li><a href="#c">Đồng bộ theo chiều nào</a></li>
    <li><a href="#d">Checklist trước khi tích hợp</a></li>
  </ol></nav>
  <div class="gcalls-prose gcalls-article__body">
    <h2 id="a">Vì sao dữ liệu lệch nhau giữa hai hệ thống</h2>
    <p>Đoạn nội dung minh họa để kiểm tra chiều rộng đọc của thân bài. Thân bài giới hạn ở biến --gcalls-measure nên dòng không kéo dài quá mức trên màn hình rộng.</p>
  </div>
</article>

</div></body></html>`

await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, 'blog-preview.html'), page)
console.log(`blog preview: ${path.join(OUT, 'blog-preview.html')} — ${hubs.length} hub covers`)
