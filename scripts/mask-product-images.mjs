/**
 * Irreversibly mask PII out of the real Gcalls Plus product screenshots and
 * emit optimised WebP masters for the website.
 *
 * Checkpoint GCALLS-DEMO-IMAGE-FOUNDATION-001 §C/§E/§F.
 *
 * Rules enforced here:
 *   - The source files are never written to. Only reads.
 *   - Masking is destructive pixel replacement (opaque fill + synthetic
 *     placeholder text). No blur, nothing recoverable.
 *   - No upscaling: every output keeps the source pixel dimensions, so a
 *     screenshot never gets stretched into a blurry hero.
 *   - Images carrying real performance data are refused, not masked.
 *
 *   GCALLS_IMAGE_SOURCE=/path/to/assets node scripts/mask-product-images.mjs
 */
import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const SRC =
  process.env.GCALLS_IMAGE_SOURCE ??
  '/Users/macos/Desktop/Gcalls/Gcalls_Webphone_UI_Assets_P0'
const OUT = path.resolve('public/images/products/gcalls-plus')
const REPORT = path.resolve('docs/content-review/images/masking-report.json')

const FONT = 'Helvetica, Arial, sans-serif'
const NOTE = 'Ảnh minh hoạ — dữ liệu đã được che'

/** Placeholder pools. Deterministic, obviously synthetic, never a real person. */
const CONTACTS = Array.from({ length: 40 }, (_, i) => `Khách hàng ${String(i + 1).padStart(2, '0')}`)
const PHONES = Array.from({ length: 40 }, (_, i) => `09${String(10000000 + i * 137).slice(0, 8)}`)
const AGENTS = ['nhanvien.a', 'nhanvien.b', 'nhanvien.c', 'nhanvien.d']

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A solid rectangle, optionally with replacement text drawn on top. */
function bar({ x, y, w, h, fill = '#ffffff', text, size = 12, color = '#3c4257', weight = 400, align = 'left', pad = 4 }) {
  const tx = align === 'center' ? w / 2 : align === 'right' ? w - pad : pad
  const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start'
  const label = text
    ? `<text x="${tx}" y="${h / 2 + size * 0.36}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(text)}</text>`
    : ''
  return {
    input: Buffer.from(
      `<svg width="${Math.round(w)}" height="${Math.round(h)}" xmlns="http://www.w3.org/2000/svg"><rect width="${Math.round(w)}" height="${Math.round(h)}" fill="${fill}"/>${label}</svg>`,
    ),
    top: Math.round(y),
    left: Math.round(x),
  }
}

/**
 * A repeated column of rows — used to anonymise list/table columns while
 * keeping the row rhythm and separator lines that make the screenshot legible.
 */
function rows({ x, y, w, rowH, count, values, fill = '#ffffff', sep = '#eef0f2', size = 11, color = '#3c4257', weight = 400, pad = 6, drawSep = true }) {
  const h = rowH * count
  const parts = [`<rect width="${Math.round(w)}" height="${Math.round(h)}" fill="${fill}"/>`]
  for (let i = 0; i < count; i += 1) {
    const cy = i * rowH
    if (drawSep && i > 0) {
      parts.push(`<rect x="0" y="${cy}" width="${Math.round(w)}" height="1" fill="${sep}"/>`)
    }
    const v = values[i % values.length]
    if (v) {
      parts.push(
        `<text x="${pad}" y="${cy + rowH / 2 + size * 0.36}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(v)}</text>`,
      )
    }
  }
  return {
    input: Buffer.from(
      `<svg width="${Math.round(w)}" height="${Math.round(h)}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`,
    ),
    top: Math.round(y),
    left: Math.round(x),
  }
}

/** Bottom-right "illustrative image" note, per the blog image briefs. */
function note(width, height) {
  const w = 220
  const h = 20
  return {
    input: Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" rx="4" fill="#1f1147" fill-opacity="0.82"/><text x="${w / 2}" y="${h / 2 + 4}" font-family="${FONT}" font-size="10" fill="#ffffff" text-anchor="middle">${esc(NOTE)}</text></svg>`,
    ),
    top: height - h - 8,
    left: width - w - 8,
  }
}

const PURPLE = '#673ab8'
const BAR = '#6041b1'
const WHITE = '#ffffff'
const PANEL = '#f7f8ff'

/** account chip in the top-right of every desktop console shot */
const acct = (x, y, w = 88, h = 17) =>
  bar({ x, y, w, h, fill: BAR, text: 'demo.user', size: 10, color: '#ffffff' })

/** Contact groups shown in the left rail — internal tenant labels. */
const GROUPS = ['Nhóm 01', 'Nhóm 02', 'Nhóm 03', 'Nhóm 04', 'Nhóm 05', 'Nhóm 06']

/**
 * The contact console (contact list + profile card + call log) appears in four
 * captures at slightly different vertical offsets. One builder, four offsets.
 */
function contactConsole({ h, listY, listRows, logY, logRows, titleY, tenY, emailY, phoneY, headerY, groupY, actY, hotY, logW = 136, logRight }) {
  const listH = h - listY
  const logH = (logRight ?? h) - logY
  return [
    // left rail: contact group names
    rows({ x: 18, y: groupY, w: 108, rowH: 20.2, count: 6, values: GROUPS, fill: PANEL, drawSep: false, size: 11, color: '#4b4f63', pad: 20 }),
    // contact list header (tenant name + record count)
    bar({ x: 126, y: headerY, w: 92, h: 16, fill: WHITE, text: 'DEMO (85)', size: 10, color: '#6b7280', weight: 700 }),
    // contact list: names, phone numbers and last-contact timestamps
    rows({ x: 126, y: listY, w: 154, rowH: listH / listRows, count: listRows, values: CONTACTS, fill: WHITE, size: 10, color: '#2f3542', pad: 6 }),
    // right rail: recent call log — numbers and the agent who handled each call
    rows({ x: 642, y: logY, w: logW, rowH: logH / logRows, count: logRows, values: PHONES, fill: WHITE, size: 10, color: '#3c4257', pad: 14 }),
    // profile card
    bar({ x: 408, y: titleY, w: 210, h: 18, fill: WHITE, text: 'KHÁCH HÀNG 01', size: 12, color: '#2f3542', weight: 700 }),
    bar({ x: 498, y: tenY, w: 118, h: 15, fill: WHITE, text: 'Khách hàng 01', size: 10, color: '#4b4f63', align: 'right' }),
    bar({ x: 498, y: emailY, w: 118, h: 15, fill: WHITE, text: 'demo@example.com', size: 10, color: '#4b4f63', align: 'right' }),
    bar({ x: 498, y: phoneY, w: 118, h: 15, fill: WHITE, text: '0900 000 000', size: 10, color: '#4b4f63', align: 'right' }),
    // activity feed: "<agent> called <customer>" + the tenant hotline
    bar({ x: 334, y: actY, w: 218, h: 16, fill: WHITE, text: 'nhanvien.a đã thực hiện cuộc gọi', size: 10, color: '#2f3542', weight: 700 }),
    bar({ x: 444, y: hotY, w: 62, h: 14, fill: WHITE, text: '1900 0000', size: 9, color: '#4b4f63' }),
  ]
}

const SPECS = {
  // ---- clean: nothing to mask -------------------------------------------
  'gcalls-plus-keypad-mobile.png': {
    out: 'gcalls-plus-webphone-keypad-mobile-v1.webp',
    pii: false,
    ops: () => [],
  },

  // ---- mobile webphone ---------------------------------------------------
  'gcalls-plus-active-call-mobile.png': {
    out: 'gcalls-plus-webphone-active-call-mobile-v1.webp',
    pii: true,
    ops: () => [
      bar({ x: 120, y: 98, w: 313, h: 70, fill: PURPLE, text: 'Khách hàng 01', size: 42, color: '#ffffff', align: 'center' }),
      bar({ x: 120, y: 190, w: 313, h: 58, fill: PURPLE, text: '0900 000 000', size: 32, color: '#ffffff', align: 'center' }),
    ],
  },

  // ---- console: light -----------------------------------------------------
  'gcalls-plus-activity-type-dropdown.png': {
    out: 'gcalls-plus-activity-type-dropdown-desktop-v1.webp',
    pii: true,
    ops: () => [
      bar({ x: 196, y: 32, w: 120, h: 24, fill: WHITE, text: 'Demo Workspace', size: 13, color: '#3c4257' }),
    ],
  },

  'gcalls-plus-advanced-filter-modal.png': {
    out: 'gcalls-plus-advanced-filter-desktop-v1.webp',
    pii: true,
    ops: () => [
      bar({ x: 190, y: 12, w: 110, h: 24, fill: WHITE, text: 'Demo Workspace', size: 13, color: '#3c4257' }),
      bar({ x: 166, y: 202, w: 52, h: 20, fill: WHITE, text: 'nhanvien.a', size: 9, color: '#2f3542', weight: 700 }),
      bar({ x: 166, y: 430, w: 52, h: 20, fill: WHITE, text: 'nhanvien.a', size: 9, color: '#2f3542', weight: 700 }),
    ],
  },

  'gcalls-plus-integration-config.png': {
    out: 'gcalls-plus-integration-config-desktop-v1.webp',
    pii: true,
    ops: () => [acct(700, 2, 84, 17)],
  },

  'gcalls-plus-overview-activity.png': {
    out: 'gcalls-plus-overview-activity-desktop-v1.webp',
    pii: true,
    ops: () => [
      acct(700, 2, 84, 17),
      rows({ x: 14, y: 82, w: 172, rowH: 19.8, count: 6, values: GROUPS, fill: PANEL, drawSep: false, size: 11, color: '#4b4f63', pad: 22 }),
    ],
  },

  'gcalls-plus-agent-status-log.png': {
    out: 'gcalls-plus-agent-status-log-desktop-v1.webp',
    pii: true,
    ops: () => [
      acct(700, 6, 84, 15),
      bar({ x: 184, y: 98, w: 86, h: 15, fill: WHITE, text: 'nhanvien.a', size: 10, color: '#2f3542', weight: 700 }),
      bar({ x: 184, y: 130, w: 86, h: 15, fill: WHITE, text: 'nhanvien.b', size: 10, color: '#2f3542', weight: 700 }),
    ],
  },

  'gcalls-plus-click-to-call-config.png': {
    out: 'gcalls-plus-click-to-call-config-desktop-v1.webp',
    pii: true,
    ops: () => [
      acct(700, 2, 84, 17),
      rows({ x: 160, y: 73, w: 70, rowH: 20.6, count: 5, fill: WHITE, size: 10, color: '#4b4f63', pad: 4,
        values: ['cfg-0001', 'cfg-0002', 'cfg-0003', 'cfg-0004', 'cfg-0005'] }),
      rows({ x: 232, y: 73, w: 62, rowH: 20.6, count: 5, fill: WHITE, size: 10, color: '#4b4f63', pad: 4,
        values: ['Công ty A', 'Công ty B', 'Công ty C', 'Công ty D', 'Công ty E'] }),
      rows({ x: 554, y: 73, w: 68, rowH: 20.6, count: 5, fill: WHITE, size: 10, color: '#4b4f63', pad: 4,
        values: ['0900000000', '4000', '1006', '1015', '1015'] }),
    ],
  },

  // ---- console: table / list heavy ---------------------------------------
  'gcalls-plus-call-history-table.png': {
    out: 'gcalls-plus-call-history-desktop-v1.webp',
    pii: true,
    ops: () => [
      bar({ x: 182, y: 20, w: 96, h: 24, fill: WHITE, text: 'Demo', size: 15, color: '#3c4257' }),
      rows({ x: 116, y: 210, w: 102, rowH: 40.55, count: 19, fill: WHITE, size: 11, color: '#4b7bec', pad: 4, values: AGENTS }),
      rows({ x: 220, y: 210, w: 98, rowH: 40.55, count: 19, fill: WHITE, size: 11, color: '#2f3542', weight: 700, pad: 2, values: CONTACTS }),
      rows({ x: 320, y: 210, w: 78, rowH: 40.55, count: 19, fill: WHITE, size: 11, color: '#4b4f63', pad: 2, values: PHONES }),
    ],
  },

  'gcalls-plus-timeline-history.png': {
    out: 'gcalls-plus-timeline-history-desktop-v1.webp',
    pii: true,
    ops: () => [
      acct(700, 2, 84, 17),
      rows({ x: 18, y: 80, w: 108, rowH: 20.2, count: 6, values: GROUPS, fill: PANEL, drawSep: false, size: 11, color: '#4b4f63', pad: 20 }),
      rows({ x: 642, y: 52, w: 136, rowH: 24.44, count: 16, fill: WHITE, size: 10, color: '#3c4257', pad: 14, values: PHONES }),
      // "Bạn đã thực hiện cuộc gọi cho <number|name>" — one per timeline entry
      bar({ x: 350, y: 104, w: 116, h: 17, fill: WHITE, text: '0900 000 000', size: 11, color: '#2f3542', weight: 700 }),
      bar({ x: 350, y: 174, w: 116, h: 17, fill: WHITE, text: '0900 000 001', size: 11, color: '#2f3542', weight: 700 }),
      bar({ x: 350, y: 275, w: 116, h: 17, fill: WHITE, text: 'Khách hàng 02', size: 11, color: '#2f3542', weight: 700 }),
      bar({ x: 350, y: 359, w: 116, h: 17, fill: WHITE, text: 'Khách hàng 03', size: 11, color: '#2f3542', weight: 700 }),
      // tenant hotline on the two connected calls
      bar({ x: 406, y: 204, w: 66, h: 24, fill: WHITE, text: '1900 0000', size: 9, color: '#4b4f63' }),
      bar({ x: 406, y: 388, w: 66, h: 17, fill: WHITE, text: '1900 0000', size: 9, color: '#4b4f63' }),
    ],
  },

  'gcalls-plus-integrations-menu.png': {
    out: 'gcalls-plus-integrations-desktop-v1.webp',
    pii: true,
    // The CRM connector menu at the bottom right is the subject of this shot and
    // holds no personal data — the call log mask stops above it.
    ops: () => [
      acct(700, 2, 84, 17),
      ...contactConsole({
        h: 494, groupY: 80, headerY: 44, listY: 60, listRows: 16,
        logY: 52, logRows: 12, logRight: 356,
        titleY: 22, tenY: 39, emailY: 71, phoneY: 88, actY: 349, hotY: 379,
      }),
    ],
  },

  'gcalls-plus-contact-profile.png': {
    out: 'gcalls-plus-contact-profile-desktop-v1.webp',
    pii: true,
    ops: () => contactConsole({
      h: 440, groupY: 63, headerY: 25, listY: 40, listRows: 16,
      logY: 36, logRows: 16,
      titleY: 4, tenY: 20, emailY: 52, phoneY: 68, actY: 337, hotY: 366,
    }),
  },

  'gcalls-plus-contact-profile-with-keypad.png': {
    out: 'gcalls-plus-webphone-desktop-v1.webp',
    pii: true,
    ops: () => contactConsole({
      h: 429, groupY: 67, headerY: 30, listY: 48, listRows: 15,
      logY: 40, logRows: 15,
      titleY: 8, tenY: 25, emailY: 57, phoneY: 75, actY: 337, hotY: 367,
    }),
  },
}

/**
 * Refused, not masked: these carry real operating performance figures
 * (call volumes, connect rates, per-agent productivity, login times). Masking
 * the names would leave the numbers, and the numbers are an unapproved claim.
 */
const REFUSED = {
  'gcalls-plus-analytics-dashboard.png':
    'Chứa dữ liệu hiệu suất thật (tổng cuộc gọi, tỷ lệ kết nối, thời lượng) — cần approval trước khi công bố.',
  'gcalls-plus-agent-performance.png':
    'Chứa toàn bộ danh sách nhân viên thật kèm máy nhánh, năng suất và thời điểm đăng nhập gần nhất.',
}

await mkdir(OUT, { recursive: true })
await mkdir(path.dirname(REPORT), { recursive: true })

const report = []

for (const [file, spec] of Object.entries(SPECS)) {
  const abs = path.join(SRC, file)
  const raw = await readFile(abs)
  const sourceChecksum = createHash('sha256').update(raw).digest('hex')
  const meta = await sharp(raw).metadata()

  const ops = spec.ops()
  const composited = ops.length
    ? await sharp(raw).composite(ops).png().toBuffer()
    : raw

  const withNote = spec.pii
    ? await sharp(composited).composite([note(meta.width, meta.height)]).png().toBuffer()
    : composited

  // No resize anywhere in this chain: output pixels === source pixels.
  const webp = await sharp(withNote).webp({ quality: 86, effort: 6 }).toBuffer()
  await writeFile(path.join(OUT, spec.out), webp)

  report.push({
    source: file,
    sourceChecksum,
    width: meta.width,
    height: meta.height,
    output: spec.out,
    outputBytes: webp.length,
    outputChecksum: createHash('sha256').update(webp).digest('hex'),
    maskRegions: ops.length,
    maskingApplied: spec.pii,
    method: spec.pii ? 'opaque pixel replacement + synthetic labels (irreversible)' : 'none required',
    status: 'READY_FOR_INTEGRATION',
  })
  console.log(
    `${spec.pii ? 'masked ' : 'copied '} ${file} -> ${spec.out}  ${meta.width}x${meta.height}  ${(webp.length / 1024).toFixed(1)} KB  regions=${ops.length}`,
  )
}

for (const [file, reason] of Object.entries(REFUSED)) {
  const raw = await readFile(path.join(SRC, file))
  const meta = await sharp(raw).metadata()
  report.push({
    source: file,
    sourceChecksum: createHash('sha256').update(raw).digest('hex'),
    width: meta.width,
    height: meta.height,
    output: null,
    maskingApplied: false,
    status: 'NEEDS_APPROVAL',
    reason,
  })
  console.log(`REFUSED ${file} — ${reason}`)
}

await writeFile(REPORT, `${JSON.stringify(report, null, 2)}\n`)
const total = report.reduce((a, r) => a + (r.outputBytes ?? 0), 0)
console.log(
  `\n${report.filter((r) => r.output).length} written, ${Object.keys(REFUSED).length} refused, ${(total / 1024).toFixed(1)} KB total`,
)
