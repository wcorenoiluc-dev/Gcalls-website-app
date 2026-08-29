/**
 * Builds the three product demo images — CX, Voicebot and QC Bot.
 *
 * WHY THESE THREE ARE PICTURES WHEN THE MOCKUPS ARE MARKUP
 * class-mockups.php argues, correctly, that an interactive panel beats a
 * screenshot: you can click it. That argument is about the panels further down
 * each product page, and those stay exactly as they are. The hero is a
 * different job. It has to say "this is a real product" in the first screen,
 * at a glance, before anyone scrolls — and a full application frame, with a
 * sidebar and a populated workspace, is what says it. The markup mockups are
 * deliberately small, single-purpose panels; scaling one up to fill a hero
 * would show four list rows and a lot of white space.
 *
 * WHY THEY ARE GENERATED AND NOT DRAWN
 * Gcalls Plus is the only product with approved screenshots of real software.
 * The other three have no product to photograph, so their heroes are drawn
 * here from vector primitives and committed as WebP. Keeping the source in the
 * repository means the wording inside the picture is greppable and reviewable
 * in a diff, which a binary handed over in a ZIP never is. Re-run this script
 * and the same bytes come back.
 *
 * WHAT THE CONTENT RULES ARE
 * Everything inside these frames is invented and visibly so: Khách hàng A–E,
 * Nhân viên 01–03, Công ty Demo N, phone numbers masked to the last two
 * digits, example.com addresses. Every frame carries a caption saying the demo
 * data is anonymised. Channels are named in words — "Zalo OA", "Facebook" —
 * and never drawn as a third-party logo, because reproducing another
 * platform's mark on Gcalls marketing is a trademark question we have no
 * answer to. No prices, no package names, no ROI, no performance claim: the
 * only numbers are per-call shapes that could not be read as a result.
 *
 * Usage: node wordpress/scripts/build-demo-imagery.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'wp-content/plugins/gcalls-core/assets/images/product-gallery')

const W = 1600
const H = 900

/* The palette is mockups.css, so the picture and the panels below it agree. */
const C = {
  brand: '#673ab7',
  dark: '#4a2391',
  light: '#f5f1fc',
  border: '#e8e5ef',
  muted: '#5b5f6b',
  ink: '#1e2026',
  white: '#ffffff',
  ok: '#1e7a4a',
  okBg: '#e8f5ee',
  no: '#a01b1b',
  noBg: '#fdeaea',
  warn: '#d9a441',
  page: '#f7f5fb',
}

/* &, < and > inside a label would close the tag early. */
const esc = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif"

const rect = (x, y, w, h, fill, r = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`

const text = (x, y, s, { size = 16, fill = C.ink, weight = 400, anchor = 'start' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`

/** A pill — the status badges and channel tags. */
const pill = (x, y, w, h, label, bg, fg, size = 13) =>
  rect(x, y, w, h, bg, h / 2) +
  text(x + w / 2, y + h / 2 + size * 0.36, label, { size, fill: fg, weight: 600, anchor: 'middle' })

/** A round avatar with an initial. */
const avatar = (cx, cy, r, letter, bg = C.brand) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/>` +
  text(cx, cy + r * 0.36, letter, { size: r, fill: C.white, weight: 700, anchor: 'middle' })

/**
 * The application window: lavender page, rounded white card, chrome bar with
 * the three dots and a title, and the anonymised-data caption under it.
 */
function frame(title, body, caption) {
  const X = 56
  const Y = 48
  const FW = W - X * 2
  const FH = H - Y - 96
  const BAR = 46

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="page" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.light}"/><stop offset="1" stop-color="${C.white}"/>
  </linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.dark}"/><stop offset="1" stop-color="${C.brand}"/>
  </linearGradient>
  <filter id="shadow" x="-6%" y="-6%" width="112%" height="118%">
    <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="${C.dark}" flood-opacity="0.16"/>
  </filter>
  <clipPath id="card"><rect x="${X}" y="${Y}" width="${FW}" height="${FH}" rx="18"/></clipPath>
</defs>
${rect(0, 0, W, H, 'url(#page)')}
<g filter="url(#shadow)">${rect(X, Y, FW, FH, C.white, 18)}</g>
<g clip-path="url(#card)">
  ${rect(X, Y, FW, BAR, 'url(#bar)')}
  <circle cx="${X + 26}" cy="${Y + BAR / 2}" r="6" fill="#ffffff" fill-opacity="0.45"/>
  <circle cx="${X + 48}" cy="${Y + BAR / 2}" r="6" fill="#ffffff" fill-opacity="0.45"/>
  <circle cx="${X + 70}" cy="${Y + BAR / 2}" r="6" fill="#ffffff" fill-opacity="0.45"/>
  ${text(X + 92, Y + BAR / 2 + 6, title, { size: 17, fill: C.white, weight: 700 })}
  <g transform="translate(${X},${Y + BAR})">${body}</g>
</g>
${text(W / 2, H - 42, caption, { size: 19, fill: C.muted, anchor: 'middle' })}
</svg>`
}

/* Inner canvas size, below the chrome bar. */
const IW = W - 112
const IH = H - 48 - 96 - 46

/* ------------------------------------------------------------------ CX */

function cx() {
  const RAIL = 250
  const LIST = 470
  let s = rect(0, 0, RAIL, IH, C.page) + rect(RAIL - 1, 0, 1, IH, C.border)

  s += text(24, 44, 'Kênh hội thoại', { size: 13, fill: C.muted, weight: 700 })

  const rails = [
    ['Tất cả', '24', true],
    ['Hotline', '8', false],
    ['Zalo OA', '6', false],
    ['Facebook', '5', false],
    ['Email', '5', false],
  ]
  rails.forEach(([label, n, on], i) => {
    const y = 66 + i * 46
    if (on) s += rect(12, y, RAIL - 24, 38, C.light, 9) + rect(12, y, 3, 38, C.brand, 1.5)
    s += text(30, y + 24, label, { size: 15, fill: on ? C.brand : C.ink, weight: on ? 700 : 400 })
    s += text(RAIL - 30, y + 24, n, { size: 13, fill: C.muted, anchor: 'end' })
  })

  s += rect(24, 320, RAIL - 48, 1, C.border)
  s += text(24, 352, 'Hàng đợi', { size: 13, fill: C.muted, weight: 700 })
  const queue = [['Chờ phân công', '3'], ['Quá hạn phản hồi', '1'], ['Đã đóng hôm nay', '12']]
  queue.forEach(([label, n], i) => {
    const y = 376 + i * 34
    s += text(24, y + 16, label, { size: 14, fill: C.ink })
    s += text(RAIL - 30, y + 16, n, { size: 13, fill: C.muted, anchor: 'end', weight: 600 })
  })

  /* Thread list. */
  s += `<g transform="translate(${RAIL},0)">`
  s += rect(0, 0, LIST, 58, C.white) + rect(0, 57, LIST, 1, C.border)
  s += text(22, 36, 'Hộp thư hợp nhất', { size: 16, weight: 700 })
  s += pill(LIST - 108, 18, 86, 24, '24 hội thoại', C.light, C.brand, 12)

  const threads = [
    ['A', 'Khách hàng A', 'Hotline', 'Cần hỗ trợ gia hạn dịch vụ', 'Mới', C.brand, true, '09:12'],
    ['B', 'Khách hàng B', 'Zalo OA', 'Hỏi về thời gian xử lý yêu cầu', 'Đang xử lý', '#3f7fd0', false, '09:04'],
    ['C', 'Khách hàng C', 'Facebook', 'Phản hồi sau khi dùng thử', 'Chờ phản hồi', '#2f9e5f', false, '08:51'],
    ['D', 'Khách hàng D', 'Email', 'Yêu cầu báo giá cấu hình', 'Mới', '#c46b1f', false, '08:33'],
    ['E', 'Khách hàng E', 'Hotline', 'Xác nhận lịch hẹn kỹ thuật', 'Đang xử lý', '#7a4fb5', false, '08:20'],
    ['G', 'Khách hàng G', 'Zalo OA', 'Cập nhật thông tin liên hệ', 'Đã đóng', '#3f7fd0', false, '08:02'],
    ['H', 'Khách hàng H', 'Email', 'Hỏi tài liệu hướng dẫn sử dụng', 'Chờ phản hồi', '#c46b1f', false, '07:48'],
  ]
  const ROW = 92
  threads.forEach(([ini, name, chan, snip, state, col, on, time], i) => {
    const y = 58 + i * ROW
    if (on) s += rect(0, y, LIST, ROW, C.light) + rect(0, y, 3, ROW, C.brand)
    s += rect(0, y + ROW - 1, LIST, 1, C.border)
    s += avatar(44, y + 42, 19, ini, col)
    s += text(76, y + 32, name, { size: 15, weight: 700 })
    s += text(76, y + 55, snip, { size: 13.5, fill: C.muted })
    s += pill(76, y + 64, chan.length * 8 + 22, 22, chan, C.white, col, 12)
    s += rect(76, y + 64, chan.length * 8 + 22, 22, 'none', 11, `stroke="${col}" stroke-opacity="0.35"`)
    const bw = state.length * 8 + 20
    s += pill(LIST - bw - 20, y + 24, bw, 24, state, state === 'Mới' ? C.okBg : C.light, state === 'Mới' ? C.ok : C.brand, 12)
    s += text(LIST - 20, y + 68, time, { size: 12, fill: C.muted, anchor: 'end' })
  })
  s += `</g>`

  /* Conversation + customer context. */
  const CX0 = RAIL + LIST
  const CW = IW - CX0
  s += `<g transform="translate(${CX0},0)">`
  s += rect(0, 0, 1, IH, C.border)
  s += rect(0, 0, CW, 58, C.white) + rect(0, 57, CW, 1, C.border)
  s += avatar(40, 29, 17, 'A')
  s += text(68, 26, 'Khách hàng A', { size: 15, weight: 700 })
  s += text(68, 46, 'Công ty Demo 1 · 090 *** **12', { size: 12.5, fill: C.muted })
  s += pill(CW - 128, 17, 108, 26, 'Gán Nhân viên 01', C.light, C.brand, 12)

  const msgs = [
    ['in', 'Bên mình cần gia hạn dịch vụ trong tháng này.', '09:04'],
    ['out', 'Dạ, em kiểm tra hợp đồng của anh/chị ngay ạ.', '09:06'],
    ['in', 'Cho mình xin thông tin qua email luôn nhé.', '09:09'],
    ['out', 'Dạ em gửi tới lienhe@example.com trong hôm nay.', '09:12'],
  ]
  let my = 86
  msgs.forEach(([dir, body, time]) => {
    const bw = Math.min(CW - 120, body.length * 7.6 + 34)
    const bh = 56
    const x = dir === 'in' ? 24 : CW - bw - 24
    s += rect(x, my, bw, bh, dir === 'in' ? C.page : C.light, 12)
    if (dir === 'out') s += rect(x, my, 3, bh, C.brand, 1.5)
    s += text(x + 16, my + 26, body, { size: 13.5, fill: C.ink })
    s += text(x + 16, my + 45, `${dir === 'in' ? 'Khách hàng A' : 'Nhân viên 01'} · ${time}`, { size: 11.5, fill: C.muted })
    my += bh + 14
  })

  /* Context card — the point of the page: one customer, every channel. */
  const cy0 = my + 10
  s += rect(24, cy0, CW - 48, 128, C.white, 12)
  s += rect(24, cy0, CW - 48, 128, 'none', 12, `stroke="${C.border}"`)
  s += text(42, cy0 + 30, 'Lịch sử liên hệ gần đây', { size: 13.5, weight: 700, fill: C.muted })
  const hist = [['Hotline', 'Cuộc gọi đến · 4:12'], ['Zalo OA', 'Tin nhắn · đã đóng'], ['Email', 'Yêu cầu báo giá']]
  hist.forEach(([chan, note], i) => {
    const y = cy0 + 52 + i * 26
    s += `<circle cx="${44}" cy="${y - 4}" r="3.5" fill="${C.brand}"/>`
    s += text(58, y, chan, { size: 13, weight: 600 })
    s += text(150, y, note, { size: 13, fill: C.muted })
  })
  s += `</g>`

  return s
}

/* ------------------------------------------------------------ Voicebot */

function voicebot() {
  const RAIL = 236
  const PROPS = 320
  let s = rect(0, 0, RAIL, IH, C.page) + rect(RAIL - 1, 0, 1, IH, C.border)

  s += text(22, 42, 'Khối kịch bản', { size: 13, fill: C.muted, weight: 700 })
  const blocks = [
    ['Lời chào', 'Phát câu mở đầu'],
    ['Câu hỏi', 'Thu thập thông tin'],
    ['Điều kiện', 'Rẽ nhánh theo ý định'],
    ['Chuyển máy', 'Nối tới nhân viên'],
    ['Kết thúc', 'Đóng cuộc gọi'],
  ]
  blocks.forEach(([label, note], i) => {
    const y = 62 + i * 62
    s += rect(14, y, RAIL - 28, 52, C.white, 10)
    s += rect(14, y, RAIL - 28, 52, 'none', 10, `stroke="${C.border}"`)
    s += rect(14, y, 4, 52, C.brand, 2)
    s += text(30, y + 22, label, { size: 14, weight: 700 })
    s += text(30, y + 40, note, { size: 12, fill: C.muted })
  })

  /* Canvas. */
  const CW = IW - RAIL - PROPS
  s += `<g transform="translate(${RAIL},0)">`
  s += rect(0, 0, CW, IH, '#fbfafe')
  /* Dot grid, so it reads as a builder canvas. */
  let dots = ''
  for (let x = 30; x < CW; x += 30) for (let y = 30; y < IH; y += 30) dots += `<circle cx="${x}" cy="${y}" r="1" fill="${C.border}"/>`
  s += dots

  const node = (x, y, w, n, title, body, tone = C.brand) =>
    rect(x, y, w, 78, C.white, 12) +
    rect(x, y, w, 78, 'none', 12, `stroke="${tone}" stroke-opacity="0.45"`) +
    rect(x, y, 4, 78, tone, 2) +
    `<circle cx="${x + 30}" cy="${y + 26}" r="13" fill="${tone}"/>` +
    text(x + 30, y + 31, n, { size: 12, fill: C.white, weight: 700, anchor: 'middle' }) +
    text(x + 52, y + 31, title, { size: 14.5, weight: 700 }) +
    text(x + 20, y + 58, body, { size: 12.5, fill: C.muted })

  const link = d => `<path d="${d}" fill="none" stroke="${C.brand}" stroke-opacity="0.5" stroke-width="2"/>`

  const NW = 330
  const cxm = (CW - NW) / 2
  s += node(cxm, 40, NW, '01', 'Lời chào', 'Xin chào, đây là tổng đài Công ty Demo.')
  s += link(`M ${cxm + NW / 2} 118 V 158`)
  s += node(cxm, 158, NW, '02', 'Xác định nhu cầu', 'Anh/chị cần hỗ trợ về nội dung nào ạ?')
  s += link(`M ${cxm + NW / 2} 236 V 268`)
  s += node(cxm, 268, NW, '03', 'Điều kiện — ý định', 'Rẽ nhánh theo câu trả lời của khách.', C.warn)

  /* Two branches. */
  const bw = 300
  const lx = 40
  const rx = CW - bw - 40
  s += link(`M ${cxm + NW / 2} 346 V 372 H ${lx + bw / 2} V 400`)
  s += link(`M ${cxm + NW / 2} 346 V 372 H ${rx + bw / 2} V 400`)
  s += text(lx + bw / 2, 366, 'tra cứu', { size: 12, fill: C.muted, anchor: 'middle' })
  s += text(rx + bw / 2, 366, 'gặp nhân viên', { size: 12, fill: C.muted, anchor: 'middle' })
  s += node(lx, 400, bw, '04', 'Tra cứu trạng thái', 'Đọc kết quả từ hệ thống nội bộ.')
  s += node(rx, 400, bw, '05', 'Chuyển nhân viên', 'Nối máy tới hàng đợi hỗ trợ.')

  s += link(`M ${lx + bw / 2} 478 V 506 H ${cxm + NW / 2} V 534`)
  s += link(`M ${rx + bw / 2} 478 V 506 H ${cxm + NW / 2} V 534`)
  s += node(cxm, 534, NW, '06', 'Kết thúc', 'Ghi nhật ký và đóng cuộc gọi.', C.ok)
  s += `</g>`

  /* Properties panel. */
  s += `<g transform="translate(${IW - PROPS},0)">`
  s += rect(0, 0, PROPS, IH, C.white) + rect(0, 0, 1, IH, C.border)
  s += text(22, 40, 'Thuộc tính khối', { size: 14, weight: 700 })
  s += rect(22, 56, PROPS - 44, 1, C.border)
  s += text(22, 84, 'Khối đang chọn', { size: 12, fill: C.muted, weight: 700 })
  s += rect(22, 96, PROPS - 44, 40, C.light, 8)
  s += text(38, 121, '02 · Xác định nhu cầu', { size: 13.5, fill: C.brand, weight: 700 })

  s += text(22, 168, 'Câu thoại', { size: 12, fill: C.muted, weight: 700 })
  s += rect(22, 180, PROPS - 44, 66, C.page, 8)
  s += rect(22, 180, PROPS - 44, 66, 'none', 8, `stroke="${C.border}"`)
  s += text(36, 206, 'Anh/chị cần hỗ trợ về', { size: 13 })
  s += text(36, 228, 'nội dung nào ạ?', { size: 13 })

  s += text(22, 278, 'Ý định nhận diện', { size: 12, fill: C.muted, weight: 700 })
  const intents = ['Tra cứu trạng thái', 'Gặp nhân viên', 'Cập nhật thông tin', 'Không xác định']
  intents.forEach((it, i) => {
    const y = 292 + i * 38
    s += rect(22, y, PROPS - 44, 30, C.white, 6)
    s += rect(22, y, PROPS - 44, 30, 'none', 6, `stroke="${C.border}"`)
    s += `<circle cx="40" cy="${y + 15}" r="5" fill="${i === 3 ? C.border : C.brand}"/>`
    s += text(56, y + 20, it, { size: 12.5, fill: i === 3 ? C.muted : C.ink })
  })

  s += text(22, 476, 'Chuyển tiếp khi im lặng', { size: 12, fill: C.muted, weight: 700 })
  s += rect(22, 488, PROPS - 44, 34, C.page, 8)
  s += text(38, 510, 'Nhắc lại 1 lần, sau đó chuyển máy', { size: 12.5 })
  s += `</g>`

  return s
}

/* ------------------------------------------------------------------ QC */

function qc() {
  const LEFT = 560
  let s = ''

  /* Call header. */
  s += rect(0, 0, IW, 62, C.white) + rect(0, 61, IW, 1, C.border)
  s += text(24, 38, 'Cuộc gọi DEMO-2481', { size: 16, weight: 700 })
  s += text(210, 38, 'Nhân viên 01 · Khách hàng A · 04:12', { size: 13.5, fill: C.muted })
  s += pill(IW - 190, 19, 76, 26, 'Đã chấm', C.okBg, C.ok, 12)
  s += pill(IW - 106, 19, 86, 26, 'Cần phúc tra', C.light, C.brand, 12)

  /* Transcript. */
  s += `<g transform="translate(0,62)">`
  s += rect(0, 0, LEFT, IH - 62, C.white) + rect(LEFT - 1, 0, 1, IH - 62, C.border)
  s += text(24, 34, 'Bản ghi hội thoại', { size: 14, weight: 700 })

  const lines = [
    ['Nhân viên 01', 'Dạ em chào anh/chị, em gọi từ Công ty Demo ạ.', '00:02', true],
    ['Khách hàng A', 'Vâng, em nói giúp anh về yêu cầu hôm trước.', '00:11', false],
    ['Nhân viên 01', 'Dạ em xin phép xác nhận lại nhu cầu của bên mình.', '00:19', true],
    ['Khách hàng A', 'Đúng rồi, anh cần gia hạn thêm cho bộ phận CSKH.', '00:34', false],
    ['Nhân viên 01', 'Dạ em ghi nhận và sẽ gửi thông tin qua email ạ.', '00:52', true],
  ]
  let y = 52
  lines.forEach(([who, body, time, agent]) => {
    const h = 68
    s += rect(20, y, LEFT - 44, h, agent ? C.light : C.page, 10)
    if (agent) s += rect(20, y, 3, h, C.brand, 1.5)
    s += text(36, y + 26, who, { size: 12.5, fill: agent ? C.brand : C.muted, weight: 700 })
    s += text(LEFT - 44, y + 26, time, { size: 11.5, fill: C.muted, anchor: 'end' })
    s += text(36, y + 50, body, { size: 13.5, fill: C.ink })
    y += h + 10
  })

  /* Waveform — a shape, not a measurement. */
  s += text(24, y + 26, 'Dạng sóng cuộc gọi', { size: 12, fill: C.muted, weight: 700 })
  let wave = ''
  const heights = [8, 14, 22, 30, 18, 26, 34, 20, 12, 24, 32, 16, 10, 28, 36, 22, 14, 26, 18, 30, 12, 20, 8, 16, 24, 34, 20, 12, 26, 14, 22, 30, 16, 10, 18]
  heights.forEach((hh, i) => {
    const bx = 24 + i * 14
    wave += rect(bx, y + 76 - hh / 2, 6, hh, i < 18 ? C.brand : C.border, 3)
  })
  s += wave
  s += `</g>`

  /* Scorecard. */
  s += `<g transform="translate(${LEFT},62)">`
  const RW = IW - LEFT
  s += rect(0, 0, RW, IH - 62, C.page)
  s += text(28, 38, 'Bộ tiêu chí chấm điểm', { size: 14, weight: 700 })

  const criteria = [
    ['Chào hỏi đúng chuẩn', 'đạt'],
    ['Xác nhận danh tính khách hàng', 'đạt'],
    ['Xác định đúng nhu cầu', 'đạt'],
    ['Tuân thủ kịch bản tư vấn', 'đạt'],
    ['Thái độ và tốc độ nói', 'đạt'],
    ['Tóm tắt trước khi kết thúc', 'chưa đạt'],
  ]
  criteria.forEach(([label, mark], i) => {
    const cy0 = 56 + i * 60
    s += rect(28, cy0, RW - 56, 48, C.white, 10)
    s += rect(28, cy0, RW - 56, 48, 'none', 10, `stroke="${C.border}"`)
    s += text(48, cy0 + 30, label, { size: 13.5 })
    const ok = mark === 'đạt'
    s += pill(RW - 128, cy0 + 12, 80, 24, mark, ok ? C.okBg : C.noBg, ok ? C.ok : C.no, 12)
  })

  /* Signals — words, not KPIs. */
  const sy = 56 + criteria.length * 60 + 12
  s += text(28, sy + 24, 'Tín hiệu phát hiện', { size: 13, fill: C.muted, weight: 700 })
  const signals = [
    ['Từ khóa bắt buộc', 'đủ', C.ok],
    ['Ngắt lời khách hàng', 'không', C.ok],
    ['Thiếu bước tóm tắt', 'có', C.warn],
  ]
  signals.forEach(([label, val, tone], i) => {
    const yy = sy + 40 + i * 40
    s += rect(28, yy, RW - 56, 32, C.white, 8)
    s += rect(28, yy, RW - 56, 32, 'none', 8, `stroke="${C.border}"`)
    s += `<circle cx="48" cy="${yy + 16}" r="5" fill="${tone}"/>`
    s += text(64, yy + 21, label, { size: 12.5 })
    s += text(RW - 48, yy + 21, val, { size: 12.5, fill: tone, weight: 700, anchor: 'end' })
  })
  s += `</g>`

  return s
}

/* --------------------------------------------------------------- build */

const IMAGES = [
  {
    file: 'gcalls-cx-omnichannel-demo.webp',
    title: 'Gcalls CX — Hộp thư hợp nhất',
    caption: 'Giao diện minh họa Gcalls CX – dữ liệu demo đã được ẩn danh',
    body: cx,
  },
  {
    file: 'voicebot-flow-builder-demo.webp',
    title: 'Gcalls Voicebot AI — Trình dựng kịch bản',
    caption: 'Giao diện minh họa Voicebot AI – dữ liệu demo đã được ẩn danh',
    body: voicebot,
  },
  {
    file: 'qc-scoring-dashboard-demo.webp',
    title: 'Gcalls QC Bot AI — Chấm điểm cuộc gọi',
    caption: 'Giao diện minh họa QC Bot AI – dữ liệu demo đã được ẩn danh',
    body: qc,
  },
]

const LIMIT = 500 * 1024

await mkdir(OUT, { recursive: true })

let worst = 0
for (const img of IMAGES) {
  const svg = frame(img.title, img.body(), img.caption)
  const buf = await sharp(Buffer.from(svg), { density: 96 })
    .resize(W, H)
    .webp({ quality: 88, effort: 6 })
    .toBuffer()

  if (buf.length > LIMIT) {
    console.error(`FAIL ${img.file}: ${buf.length} bytes is over the 500 KB budget`)
    process.exitCode = 1
  }

  await writeFile(path.join(OUT, img.file), buf)
  worst = Math.max(worst, buf.length)
  console.log(`  ${img.file.padEnd(36)} ${String(buf.length).padStart(7)} bytes  ${W}×${H}`)
}

console.log(`\nbuild-demo-imagery: 3 image(s), largest ${(worst / 1024).toFixed(1)} KB of a 500 KB budget`)
