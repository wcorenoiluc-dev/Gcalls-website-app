/**
 * Turn docs/screenshots/manifest.json into docs/WEBSITE_PAGES_OVERVIEW.md.
 * Full-page shots go in a collapsible <details>; each section is embedded inline
 * with its heading label. Image paths are relative to the docs/ folder.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.resolve('docs/screenshots')
const DOC = path.resolve('docs/WEBSITE_PAGES_OVERVIEW.md')

const manifest = JSON.parse(await readFile(path.join(OUT_DIR, 'manifest.json'), 'utf8'))
const today = '2026-08-04'

// image path relative to docs/
const rel = (p) => 'screenshots/' + p.split(path.sep).join('/')

const lines = []
lines.push('# Tổng quan các trang website Gcalls — nội dung & ảnh chụp')
lines.push('')
lines.push(`> Sinh tự động ngày **${today}** từ dev server (\`localhost:5173\`), viewport 1440×900 @2x.`)
lines.push('> Mỗi trang gồm 1 ảnh full-page (thu gọn trong mục *Ảnh toàn trang*) và ảnh chụp từng section.')
lines.push('')

// Group index
const groups = [...new Set(manifest.map((p) => p.group))]
lines.push('## Mục lục')
lines.push('')
for (const g of groups) {
  lines.push(`- **${g}**`)
  for (const p of manifest.filter((x) => x.group === g)) {
    const anchor = p.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
    lines.push(`  - [${p.title}](#${anchor}) — \`${p.path}\` · ${p.sections.length} section`)
  }
}
lines.push('')

const totalSections = manifest.reduce((s, p) => s + p.sections.length, 0)
lines.push(`**Tổng: ${manifest.length} trang · ${totalSections} section được chụp.**`)
lines.push('')
lines.push('---')
lines.push('')

for (const p of manifest) {
  lines.push(`## ${p.title}`)
  lines.push('')
  lines.push(`- **Đường dẫn:** \`${p.path}\``)
  lines.push(`- **Nhóm:** ${p.group}`)
  lines.push(`- **Số section:** ${p.sections.length}`)
  lines.push('')
  lines.push('<details>')
  lines.push(`<summary>📄 Ảnh toàn trang (full-page)</summary>`)
  lines.push('')
  lines.push(`![${p.title} — full page](${rel(p.full)})`)
  lines.push('')
  lines.push('</details>')
  lines.push('')
  lines.push('### Các section')
  lines.push('')
  p.sections.forEach((s, i) => {
    const n = String(i + 1).padStart(2, '0')
    const title = s.heading || s.label || ''
    const cap = title ? `Section ${n} — ${title}` : `Section ${n}`
    lines.push(`#### ${cap}`)
    lines.push('')
    if (s.eyebrow) lines.push(`*${s.eyebrow}*`)
    lines.push('')
    if (s.text) {
      // Render body as a blockquote so it reads as description, not page copy
      for (const para of s.text.split(/(?<=[.!?…])\s+(?=[A-ZĐÀÁẢÃẠ0-9])/)) {
        lines.push(`> ${para}`)
      }
      lines.push('')
    }
    lines.push(`![${cap}](${rel(s.file)})`)
    lines.push('')
  })
  lines.push('---')
  lines.push('')
}

await writeFile(DOC, lines.join('\n'))
console.log(`Wrote ${DOC} (${manifest.length} pages, ${totalSections} sections)`)
