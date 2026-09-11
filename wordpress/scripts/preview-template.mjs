/**
 * Renders the generated Elementor template's own markup in a local page, with
 * the real theme stylesheet, so the parity layer can be looked at before it is
 * anywhere near the live site.
 *
 * This is not a WordPress emulator and does not try to be. Elementor's own
 * section/column chrome is approximated by the two rules at the bottom of the
 * <style> block — enough that a two-column section reads as two columns. What
 * it renders exactly is the HTML this repository generates plus the CSS this
 * repository ships, which is the pair that actually decides whether a card has
 * a border or six of them sit in one row.
 *
 *   node wordpress/scripts/preview-template.mjs
 *   → wordpress/dist/parity/preview.html
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.join(HERE, '..')
const OUT = path.join(WP, 'dist', 'parity')

const template = JSON.parse(await readFile(path.join(WP, 'elementor-templates/gcalls-homepage.json'), 'utf8'))
const themeCss = await readFile(path.join(WP, 'wp-content/themes/gcalls-theme/assets/css/theme.css'), 'utf8')

/** Walks a section tree and renders the widgets this preview knows about. */
function renderWidget(w) {
  const s = w.settings ?? {}
  switch (w.widgetType) {
    case 'html':
      return s.html ?? ''
    case 'heading': {
      const tag = s.header_size ?? 'h2'
      return `<${tag}>${s.title ?? ''}</${tag}>`
    }
    case 'text-editor':
      return s.editor ?? ''
    case 'button':
      return `<a class="pv-btn" href="${s.link?.url ?? '#'}">${s.text ?? ''}</a>`
    case 'icon-list':
      return (
        '<ul class="pv-list">' +
        (s.icon_list ?? []).map(i => `<li>${i.text}</li>`).join('') +
        '</ul>'
      )
    case 'shortcode':
      return `<div class="pv-shortcode">${s.shortcode ?? ''}</div>`
    default:
      return `<div class="pv-shortcode">[${w.widgetType}]</div>`
  }
}

function renderElement(el) {
  if (el.elType === 'widget') return renderWidget(el)
  const kids = (el.elements ?? []).map(renderElement).join('')
  if (el.elType === 'column') {
    const size = el.settings?._column_size ?? 100
    return `<div class="pv-col" style="--pv-size:${size}">${kids}</div>`
  }
  const bg = el.settings?.background_color
  const pad = el.settings?.padding
  const style = [
    bg ? `background:${bg}` : '',
    pad ? `padding:${pad.top}px 0 ${pad.bottom}px` : '',
  ]
    .filter(Boolean)
    .join(';')
  return `<section class="pv-section" style="${style}"><div class="pv-container">${kids}</div></section>`
}

const body = template.content.map(renderElement).join('\n')

const page = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gcalls — template preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${themeCss}

/* --- Elementor's own layout chrome, approximated --- */
.pv-section { width: 100%; }
.pv-container { margin: 0 auto; max-width: var(--gcalls-container); padding: 0 var(--gcalls-gutter); display: flex; flex-wrap: wrap; gap: 2.5rem; align-items: center; }
.pv-col { flex: 1 1 calc(var(--pv-size) * 1% - 2.5rem); min-width: 0; }
@media (max-width: 1023px) { .pv-col { flex-basis: 100%; } }
.pv-btn { display: inline-block; margin: 0 .5rem .5rem 0; padding: .75rem 1.5rem; border: 1px solid var(--gcalls-brand); border-radius: 8px; color: var(--gcalls-brand); text-decoration: none; font-weight: 600; }
.pv-list { list-style: none; margin: 1rem 0; padding: 0; }
.pv-list li { color: var(--gcalls-muted); padding: .35rem 0 .35rem 1.5rem; position: relative; }
.pv-list li::before { content: "✓"; color: var(--gcalls-brand); position: absolute; left: 0; }
.pv-shortcode { background: var(--gcalls-brand-light); border: 1px dashed var(--gcalls-border); border-radius: 8px; color: var(--gcalls-muted); font-family: var(--gcalls-font-mono); font-size: .75rem; padding: 2rem 1rem; text-align: center; }
</style></head>
<body>
${body}
</body></html>`

await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, 'preview.html'), page)
console.log(`preview: ${path.join(OUT, 'preview.html')} (${template.content.length} sections)`)
