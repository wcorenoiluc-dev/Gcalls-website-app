/**
 * GCALLS-034 A3 — build the five sanitized `-v2` derivatives.
 *
 * Region masks, not word masks. OCR at this text size (≈8px) reads almost
 * nothing at native resolution, so anything driven by OCR word boxes would
 * leave PII uncovered. Every data-bearing panel is therefore covered wholesale
 * with an OPAQUE fill and redrawn with neutral demo content. OCR is used
 * afterwards, on a 4x upscaled copy of the OUTPUT, purely as verification.
 *
 * Opaque fills only — no blur anywhere, at any point.
 * The published asset is never upscaled; only the verification copy is.
 */
import sharp from '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app/node_modules/sharp/dist/index.cjs'
import { mkdir } from 'node:fs/promises'

const SRC = '/Users/macos/Desktop/Gcalls/Gcalls_Webphone_UI_Assets_P0/'
const OUT = '/private/tmp/claude-501/-Users-macos-Desktop-Gcalls-App-Gcalls-website-app/6d8e7d66-d8f7-4338-87e2-2f9593c94625/scratchpad/v2/'

const FONT = 'Helvetica, Arial, sans-serif'
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const rect = (x, y, w, h, fill, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${rx ? ` rx="${rx}"` : ''}/>`
const text = (x, y, t, { size = 7.4, fill = '#3a3d4d', weight = 400, anchor } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}"${anchor ? ` text-anchor="${anchor}"` : ''}>${esc(t)}</text>`

/** A repeated list of rows, redrawn as neutral demo entries. */
function rows({ x, y, w, rowH, count, avatar, lines, sep = '#eef0f5' }) {
  let s = ''
  for (let i = 0; i < count; i++) {
    const ty = y + i * rowH
    if (avatar) s += `<circle cx="${x + avatar.dx}" cy="${ty + avatar.dy}" r="${avatar.r}" fill="${avatar.fill}"/>`
    for (const l of lines) s += text(x + l.dx, ty + l.dy, l.text, l)
    s += `<line x1="${x}" y1="${ty + rowH - 0.5}" x2="${x + w}" y2="${ty + rowH - 0.5}" stroke="${sep}" stroke-width="1"/>`
  }
  return s
}

/**
 * The contact-profile screen, which three of the five sources share.
 * `dy` shifts everything below the app chrome; integrations-menu has a top bar
 * that the other two do not, which pushes the whole workspace down.
 */
function contactProfileScreen({ dy = 0, listBottom, rightBottom, rightCount, listCount, activityRight = 650 }) {
  let s = ''
  // Contact-group sidebar — group labels include a person's name.
  s += rect(0, 52 + dy, 110, 130, '#f7f8ff')
  for (let i = 0; i < 6; i++) s += text(18, 68 + dy + i * 21, `Nhóm 0${i + 1}`, { size: 8, fill: '#4a4f66' })

  // Contact list — every row is a real name and phone number.
  s += rect(111, 40 + dy, 175, listBottom - (40 + dy), '#ffffff')
  s += rows({
    x: 111, y: 42 + dy, w: 175, rowH: 25, count: listCount,
    avatar: { dx: 14, dy: 12, r: 7, fill: '#d5d9ea' },
    lines: [
      { dx: 28, dy: 11, text: 'Khách hàng A', size: 7.5, fill: '#2b2e3d' },
      { dx: 28, dy: 20, text: '090 *** **12', size: 6.8, fill: '#8f94a8' },
      { dx: 170, dy: 11, text: 'hôm nay', size: 6.2, fill: '#a8adbe', anchor: 'end' },
    ],
  })

  // Detail header — the contact's full name.
  s += rect(404, 2 + dy, 244, 21, '#ffffff')
  s += text(408, 16 + dy, 'KHÁCH HÀNG A', { size: 11, weight: 700, fill: '#2b2e3d' })

  // Field values — name, email, phone, gender.
  s += rect(522, 24 + dy, 126, 76, '#ffffff')
  for (const [t, ty] of [['Khách hàng A', 35], ['demo@example.com', 63], ['090 *** **12', 78], ['—', 93]]) {
    s += text(527, ty + dy, t, { size: 7.4 })
  }

  // Account chip.
  s += rect(307, 118 + dy, 56, 21, '#7b65d3', 10)
  s += text(335, 132 + dy, 'gcalls_demo', { size: 7.2, fill: '#ffffff', anchor: 'middle' })

  // Actor avatar — a real person's initial. Drawn BEFORE the activity line and
  // stopped at x=344: when it came after, its cover clipped the first two
  // letters of the username underneath it.
  s += rect(322, 338 + dy, 22, 28, '#ffffff')
  s += `<rect x="326" y="${346 + dy}" width="16" height="16" rx="4" fill="#d5d9ea"/>`

  // Activity line — actor username plus the contact's name.
  s += rect(344, 332 + dy, activityRight - 344, 21, '#ffffff')
  s += `<text x="348" y="${345 + dy}" font-family="${FONT}" font-size="7.4" fill="#3a3d4d">gcalls_demo đã thực hiện cuộc gọi cho <tspan font-weight="700">Khách hàng A</tspan></text>`

  // Hotline column — cover the header and the value together, then redraw
  // both. Masking only the value clipped the header and left it half-erased.
  s += rect(446, 360 + dy, 62, 22, '#ffffff')
  s += text(450, 370 + dy, 'Hotline', { size: 6.4, fill: '#a8adbe' })
  s += text(450, 378 + dy, '090 *** **12', { size: 7 })

  // Right-hand call list — phone numbers and saved contact names.
  s += rect(631, 40 + dy, 178, rightBottom - (40 + dy), '#ffffff')
  s += rows({
    x: 631, y: 42 + dy, w: 178, rowH: 30, count: rightCount,
    lines: [
      { dx: 8, dy: 12, text: '090 *** **12', size: 7.6, fill: '#3f4a86' },
      { dx: 8, dy: 22, text: 'Chưa lưu tên · hàng ngày', size: 6.2, fill: '#a8adbe' },
      { dx: 172, dy: 12, text: '00:00', size: 6.2, fill: '#a8adbe', anchor: 'end' },
    ],
  })
  return s
}

const CONFIG = {
  'gcalls-plus-contact-profile.png': {
    out: 'gcalls-plus-contact-profile-desktop-v2',
    build: () => contactProfileScreen({ dy: 0, listBottom: 440, rightBottom: 440, listCount: 16, rightCount: 13 }),
  },

  'gcalls-plus-contact-profile-with-keypad.png': {
    out: 'gcalls-plus-webphone-desktop-v2',
    build: () => contactProfileScreen({ dy: 0, listBottom: 429, rightBottom: 429, listCount: 16, rightCount: 13 }),
  },

  'gcalls-plus-integrations-menu.png': {
    out: 'gcalls-plus-integrations-desktop-v2',
    build: () => {
      // The workspace sits under an app bar, so everything shifts down 19px.
      // The activity line is also clipped early by the View Profile panel.
      let s = contactProfileScreen({ dy: 19, listBottom: 470, rightBottom: 358, listCount: 16, rightCount: 10, activityRight: 610 })
      // App bar account chip — a real operator name.
      s += rect(683, 0, 92, 17, '#5b3fbf')
      s += text(729, 12, 'gcalls_demo', { size: 7.2, fill: '#ffffff', anchor: 'middle' })
      return s
    },
  },

  'gcalls-plus-advanced-filter-modal.png': {
    out: 'gcalls-plus-advanced-filter-desktop-v2',
    build: () => {
      let s = ''
      // Two activity rows, each an avatar initial plus an actor username.
      // The box has to run past the actor line to the date line below it —
      // stopping at 38px sliced that line in half and left a smear.
      for (const top of [200, 432]) {
        s += rect(128, top, 186, 48, '#ffffff')
        s += `<circle cx="146" cy="${top + 19}" r="13" fill="#d5d9ea"/>`
        s += text(168, top + 17, 'gcalls_demo đã thực hiện', { size: 8.6, weight: 700, fill: '#2b2e3d' })
        s += text(168, top + 30, 'Nhân viên 01', { size: 7.2, fill: '#8f94a8' })
        s += text(168, top + 42, 'Cuộc gọi gần đây', { size: 7.2, fill: '#a8adbe' })
      }
      return s
    },
  },

  'gcalls-plus-click-to-call-config.png': {
    out: 'gcalls-plus-click-to-call-config-desktop-v2',
    build: () => {
      let s = ''
      // App bar account chip.
      s += rect(688, 0, 90, 17, '#5b3fbf')
      s += text(733, 12, 'gcalls_demo', { size: 7.2, fill: '#ffffff', anchor: 'middle' })

      // Table columns carrying identifiers, a real number and real URLs.
      const cols = [
        { x: 160, w: 65, val: i => `demo-000${i + 1}` },          // ID / token
        { x: 225, w: 69, val: () => 'Công ty Demo' },              // company
        { x: 555, w: 68, val: () => '090 *** **12' },              // receiving number
        { x: 624, w: 68, val: () => 'icon-demo.svg' },             // icon URL
        { x: 692, w: 66, val: () => '1000' },                      // extension
      ]
      // Measured row baselines: 86, then a 18.75px step. An earlier 19.2px
      // guess drifted a row low by the bottom of the table.
      for (const c of cols) {
        s += rect(c.x, 76, c.w, 96, '#ffffff')
        for (let i = 0; i < 5; i++) s += text(c.x + 4, 86 + i * 18.75, c.val(i), { size: 6.8, fill: '#3a3d4d' })
        s += `<line x1="${c.x + c.w - 0.5}" y1="76" x2="${c.x + c.w - 0.5}" y2="172" stroke="#e6e8ef" stroke-width="1"/>`
      }
      return s
    },
  },
}

await mkdir(OUT, { recursive: true })
const only = process.argv[2]
for (const [file, cfg] of Object.entries(CONFIG)) {
  if (only && file !== only) continue
  const meta = await sharp(SRC + file).metadata()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">${cfg.build()}</svg>`
  const dest = `${OUT}${cfg.out}.webp`
  await sharp(SRC + file)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 92 })
    .toFile(dest)
  const m2 = await sharp(dest).metadata()
  console.log(`${cfg.out.padEnd(46)} ${m2.width}x${m2.height}  source ${meta.width}x${meta.height}  upscaled=${m2.width > meta.width || m2.height > meta.height}`)
}
