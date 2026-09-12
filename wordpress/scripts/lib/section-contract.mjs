/**
 * The Node half of the GCALLS-036B section contract.
 *
 * WHY THIS EXISTS AND WHY IT IS NOT A SECOND RENDERER
 * There is no PHP runtime on this machine, so the only way to look at the
 * candidate before it is uploaded is to draw it from Node. That is a real risk:
 * two renderers drift, and the preview then proves nothing about what
 * WordPress will actually emit. The mitigation is that neither side owns any
 * placement decision. `data/section-components.json` owns
 *   source -> component, modifier class, icon key
 * AND the column-reconciliation rules. PHP reads it (Sections::contract()) and
 * so does this file. What is duplicated here is only the markup assembly, and
 * `contract-test-sections.mjs` checks that the two agree on the vocabulary they
 * are allowed to emit.
 */
import { readFile } from 'node:fs/promises'

const CONTRACT = 'wordpress/wp-content/plugins/gcalls-core/data/section-components.json'
const ICONS_PHP = 'wordpress/wp-content/plugins/gcalls-core/includes/class-icons.php'

export async function loadContract() {
  return JSON.parse(await readFile(CONTRACT, 'utf8'))
}

/** key -> inner SVG, parsed out of the generated PHP registry so there is one source. */
export async function loadIcons() {
  const php = await readFile(ICONS_PHP, 'utf8')
  const out = {}
  const re = /'([a-z0-9-]+)' => '(.*?)', \/\/ lucide/g
  let m
  while ((m = re.exec(php)) !== null) out[m[1]] = m[2].replace(/\\'/g, "'")
  return out
}

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function items(section) {
  for (const key of ['items', 'cards', 'steps', 'tags']) {
    const v = section[key]
    if (Array.isArray(v) && v.length) {
      const out = v.map((i) => (typeof i === 'string' ? { title: i } : i)).filter((i) => i && typeof i === 'object')
      if (out.length) return out
    }
  }
  return []
}

/** Mirrors Sections::grid_class(). The table comes from the contract, not from here. */
export function gridClass(mod, count, rules) {
  const table = rules.gridColumnsByCount || {}
  let cols = table[String(count)] !== undefined ? Number(table[String(count)]) : 3
  const m = /gc-grid--(\d)/.exec(mod || '')
  if (m) {
    cols = Number(m[1])
    if (table[String(count)] !== undefined && count <= 4) cols = Number(table[String(count)])
  }
  if (rules.clampColumnsToItemCount && count > 0 && count < cols) cols = count
  return `gc-grid gc-grid--${Math.max(1, cols)}`
}

/** Mirrors Sections::steps(). */
export function stepsCols(mod, count, rules) {
  let cols = 3
  const m = /gc-steps--(\d)/.exec(mod || '')
  if (m) cols = Number(m[1])
  return Math.min(cols, rules.stepsMaxColumns ?? 5, Math.max(1, count))
}

function icon(key, icons, cls = '') {
  const inner = icons[key]
  if (!inner) return ''
  return `<svg class="${esc(('gc-icon ' + cls).trim())}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`
}

function header(section, bare, dropLead) {
  const heading = (section.heading || '').trim()
  if (!heading) return ''
  const eyebrow = (section.eyebrow || '').trim()
  const lead = (section.lead || '').trim()
  let out = `<div class="gc-head${bare ? ' gc-head--bare' : ''}">`
  if (eyebrow) out += `<p class="gc-head__eyebrow">${esc(eyebrow)}</p>`
  out += `<h2 class="gc-head__title">${esc(heading)}</h2>`
  if (lead && !dropLead) out += `<p class="gc-head__desc">${esc(lead)}</p>`
  return out + '</div>'
}

function checklist(section, icons) {
  const list = items(section)
  if (!list.length) return ''
  let out = '<ul class="gc-checks">'
  for (const it of list) {
    const t = (it.title || '').trim()
    const b = (it.body || '').trim()
    if (!t && !b) continue
    out += `<li><span class="gc-iconbox gc-iconbox--round">${icon('check', icons)}</span><span>`
    if (t) out += `<strong>${esc(t)}</strong>`
    if (b) out += `${t ? ' ' : ''}${esc(b)}`
    out += '</span></li>'
  }
  return out + '</ul>'
}

function grid(section, mod, iconKey, icons, rules) {
  const list = items(section)
  if (!list.length) return ''
  let out = `<div class="${esc(gridClass(mod, list.length, rules))}">`
  for (const it of list) {
    out += '<article class="gc-card">'
    if (iconKey) out += `<span class="gc-iconbox">${icon(iconKey, icons)}</span>`
    if ((it.label || '').trim()) out += `<span class="gc-badge">${esc(it.label)}</span>`
    /*
     * A card that carries a destination must BE a link. The "Xem thêm" blocks
     * on the hub pages are pure navigation — every card has an href and an
     * empty body — and both renderers dropped the href, so those sections
     * rendered as a heading over five dead labels. 39 destinations across five
     * routes were reachable in the manifest and unreachable on the page.
     */
    const cardHref = (it.href || '').trim()
    if ((it.title || '').trim()) {
      const t = esc(it.title)
      out += `<h3 class="gc-card__title">${cardHref ? `<a href="${esc(cardHref)}">${t}</a>` : t}</h3>`
    }
    if ((it.body || '').trim()) out += `<p class="gc-card__body">${esc(it.body)}</p>`
    out += '</article>'
  }
  return out + '</div>'
}

function steps(section, mod, rules) {
  const list = items(section)
  if (!list.length) return ''
  let out = `<ol class="gc-steps gc-steps--${stepsCols(mod, list.length, rules)}">`
  for (const it of list) {
    out += '<li class="gc-steps__item">'
    if ((it.title || '').trim()) out += `<h3 class="gc-card__title">${esc(it.title)}</h3>`
    if ((it.body || '').trim()) out += `<p class="gc-card__body">${esc(it.body)}</p>`
    out += '</li>'
  }
  return out + '</ol>'
}

function vendors(section, iconKey, icons) {
  const list = items(section)
  if (!list.length) return ''
  let out = '<div class="gc-vendors">'
  for (const it of list) {
    const t = (it.title || '').trim()
    if (!t) continue
    out += `<div class="gc-vendors__item"><span class="gc-iconbox">${icon(iconKey, icons)}</span><span class="gc-vendors__name">${esc(t)}</span></div>`
  }
  return out + '</div>'
}

function trustbar(section, iconKey, icons) {
  const list = items(section)
  if (!list.length) return ''
  let out = '<div class="gc-trustbar">'
  for (const it of list) {
    const t = (it.title || '').trim()
    if (!t) continue
    out += `<span class="gc-trustbar__item">${icon(iconKey, icons)}${esc(t)}</span>`
  }
  return out + '</div>'
}

/**
 * The visual half of a split. `mockupHtml` is supplied by the caller because
 * the real drawing lives in class-mockups.php; the preview substitutes a
 * labelled placeholder of the same shape so geometry can still be measured.
 */
function visual(section, mockupHtml) {
  if (mockupHtml) {
    return `<figure class="gc-diagram"><div class="gc-diagram__canvas">${mockupHtml}</div><figcaption class="gc-diagram__label">Giao diện minh hoạ</figcaption></figure>`
  }
  return ''
}

function prose(section) {
  const body = (section.body || '').trim()
  return body ? `<div class="gc-prose"><p>${esc(body)}</p></div>` : ''
}

function comparison(section) {
  const sides = []
  for (const key of ['before', 'after']) {
    const side = section[key]
    if (!side || !Array.isArray(side.steps) || !side.steps.length) continue
    let html = `<div class="gc-flow gc-flow--${key}">`
    if (side.label) html += `<p class="gc-flow__label">${esc(side.label)}</p>`
    html += '<ol class="gc-flow__steps">'
    for (const st of side.steps) html += `<li>${esc(st)}</li>`
    sides.push(html + '</ol></div>')
  }
  return sides.length ? `<div class="gc-compare-flow">${sides.join('')}</div>` : ''
}

function taglist(section, iconKey, icons) {
  const tags = section.tags || []
  if (!tags.length) return ''
  let out = '<ul class="gc-taglist">'
  for (const t of tags) {
    const label = typeof t === 'string' ? t : t.title || ''
    if (!label.trim()) continue
    out += `<li class="gc-taglist__item">${icon(iconKey, icons)}${esc(label)}</li>`
  }
  return out + '</ul>'
}

function groups(section, iconKey, icons) {
  const gs = section.groups || []
  if (!gs.length) return ''
  let out = '<div class="gc-groups">'
  for (const g of gs) {
    if (!g.items || !g.items.length) continue
    out += '<div class="gc-groups__col">'
    if (g.label) out += `<p class="gc-groups__label">${esc(g.label)}</p>`
    out += '<ul class="gc-groups__list">'
    for (const it of g.items) {
      const t = (it.title || '').trim(); const b = (it.body || '').trim(); const h = (it.href || '').trim()
      if (!t && !b) continue
      out += `<li><span class="gc-iconbox gc-iconbox--round">${icon(iconKey, icons)}</span><span>`
      if (t) out += `<strong>${esc(t)}</strong>`
      if (b) out += h ? ` <a href="${esc(h)}">${esc(b)}</a>` : ` ${esc(b)}`
      out += '</span></li>'
    }
    out += '</ul></div>'
  }
  return out + '</div>'
}

function decision(section, icons) {
  const list = items(section)
  if (!list.length) return ''
  let out = '<ul class="gc-decision">'
  for (const it of list) {
    const need = (it.title || '').trim(); const prod = (it.body || '').trim(); const h = (it.href || '').trim()
    if (!need && !prod) continue
    out += `<li class="gc-decision__row"><span class="gc-decision__need">${esc(need)}</span>`
    out += `<span class="gc-decision__answer">${icon('arrow', icons)}`
    out += h && prod ? `<a href="${esc(h)}">${esc(prod)}</a>` : esc(prod)
    out += '</span></li>'
  }
  return out + '</ul>'
}

function placeholder(section) {
  const t = (section.placeholder || '').trim()
  if (!t) return ''
  let out = `<div class="gc-placeholder"><p class="gc-placeholder__text">${esc(t)}</p>`
  if (section.placeholderNote) out += `<p class="gc-placeholder__note">${esc(section.placeholderNote)}</p>`
  if (section.link?.label && section.link?.href) out += `<p class="gc-placeholder__link"><a href="${esc(section.link.href)}">${esc(section.link.label)}</a></p>`
  return out + '</div>'
}

/** Mirrors Shortcodes::lead_href(): exactly four keys, empties omitted. */
function leadHref(cta) {
  const q = []
  for (const k of ['intent', 'source', 'product', 'solution']) {
    const v = (cta[k] || '').trim()
    if (v) q.push(`${k}=${encodeURIComponent(v)}`)
  }
  return '/lien-he/' + (q.length ? `?${q.join('&')}` : '')
}

function sectionCta(section) {
  const list = section.cta || []
  if (!list.length) return ''
  let out = ''
  let first = true
  for (const c of list) {
    const label = (c.label || '').trim()
    if (!label) continue
    const href = c.href ? c.href : leadHref(c)
    if (!href) continue
    out += `<a class="gc-btn ${first ? 'gc-btn--primary' : 'gc-btn--ghost'}" href="${esc(href)}">${esc(label)}</a>`
    first = false
  }
  return out ? `<div class="gc-ctarow gc-ctarow--section">${out}</div>` : ''
}

export const emptySources = new Set()

export function renderSection(section, plan, index, icons, rules, mockupHtml) {
  const comp = plan.component
  if (!comp || (rules.skipComponents || []).includes(comp)) return ''
  const iconKey = plan.icon || ''
  const mod = plan.modifier || ''
  let body = ''
  switch (comp) {
    case 'split': {
      const v = visual(section, mockupHtml)
      body = v
        ? `<div class="gc-split${section.reverse ? ' gc-split--reverse' : ''}"><div class="gc-split__copy">${checklist(section, icons)}</div><div class="gc-split__visual">${v}</div></div>`
        : checklist(section, icons)
      break
    }
    case 'steps': body = steps(section, mod, rules); break
    case 'vendors': body = vendors(section, iconKey, icons); break
    case 'trustbar': body = trustbar(section, iconKey, icons); break
    case 'prose':
    case 'diagram': body = prose(section); break
    case 'comparison': body = comparison(section); break
    case 'taglist': body = taglist(section, iconKey, icons); break
    case 'related': body = grid(section, 'gc-related', iconKey, icons, rules); break
    case 'groups': body = groups(section, iconKey, icons); break
    case 'decision': body = decision(section, icons); break
    case 'placeholder': body = placeholder(section); break
    case 'cta': body = grid(section, 'gc-grid gc-grid--2', 'tag', icons, rules); break
    default: body = grid(section, mod, iconKey, icons, rules)
  }
  // Mirrors Sections::render_component(): a section whose only content is its
  // lead promotes that lead to a prose block rather than leaving a heading
  // with a caption and nothing else.
  let leadOnly = false
  if (!body) {
    const lead = (section.lead || '').trim()
    if (lead) { body = `<div class="gc-prose"><p>${esc(lead)}</p></div>`; leadOnly = true }
  }
  body += sectionCta(section)
  // Mirrors the PHP: a heading with no body is dropped and reported, never
  // rendered as an orphan and never filled with invented copy.
  if (!body) { emptySources.add(section.source || section.from || '?'); return '' }
  const head = header(section, comp === 'split', leadOnly)
  if (!head && !body) return ''
  const cls = `gc-section gc-section--${comp}${index % 2 === 1 ? ' gc-section--alt' : ''}`
  return `<section class="${cls}"><div class="gc-container">${head}${body}</div></section>`
}

export { esc, leadHref }
