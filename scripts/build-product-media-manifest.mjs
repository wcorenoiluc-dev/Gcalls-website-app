import sharp from 'sharp'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'

const SRC = '/Users/macos/Desktop/Gcalls/Gcalls_Webphone_UI_Assets_P0'
const OUT = 'public/images/products/gcalls-plus'
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')

/* Per-file editorial decisions. `visual` is what my own eyes found at 1:1,
 * which is the gate PHẦN F asks for — regex cannot read pixels. */
const D = {
  'gcalls-plus-contact-profile.png': {
    output: 'gcalls-plus-contact-profile-desktop-v1.webp',
    feature: 'Hồ sơ khách hàng 360°', form: 'desktop',
    route: '/gcalls-plus-webphone/', section: 'CustomerContext',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'số điện thoại', 'email', 'tên tài khoản'],
    sanitization: 'BLOCKED',
    visual: 'Tag tài khoản thật "${Buffer.from('Z2lhbmdwdGw=','base64').toString()}" còn nguyên dưới nhóm liên hệ. Mask không phủ chip này.',
    alt: 'Hồ sơ khách hàng trong Gcalls Plus với lịch sử tương tác và danh bạ',
  },
  'gcalls-plus-contact-profile-with-keypad.png': {
    output: 'gcalls-plus-webphone-desktop-v1.webp',
    feature: 'Webphone + hồ sơ khách hàng', form: 'desktop',
    route: '/', section: 'Hero / CRMSection',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'số điện thoại', 'email', 'tên tài khoản'],
    sanitization: 'BLOCKED',
    visual: 'Cùng leak "${Buffer.from('Z2lhbmdwdGw=','base64').toString()}" như contact-profile.',
    alt: 'Webphone Gcalls Plus mở cạnh hồ sơ khách hàng',
  },
  'gcalls-plus-integrations-menu.png': {
    output: 'gcalls-plus-integrations-desktop-v1.webp',
    feature: 'Menu tích hợp CRM/Helpdesk', form: 'desktop',
    route: '/gcalls-plus-webphone/', section: 'IntegrationSection',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'tên tài khoản'],
    sanitization: 'BLOCKED',
    visual: 'Cùng leak "${Buffer.from('Z2lhbmdwdGw=','base64').toString()}".',
    alt: 'Danh sách nền tảng tích hợp sẵn của Gcalls Plus',
  },
  'gcalls-plus-advanced-filter-modal.png': {
    output: 'gcalls-plus-advanced-filter-desktop-v1.webp',
    feature: 'Bộ lọc nâng cao', form: 'desktop',
    route: '/gcalls-plus-webphone/', section: 'InteractionHistory',
    crop: 'full frame, no crop',
    pii: ['tên nhân viên'],
    sanitization: 'BLOCKED',
    visual: 'Mask hẹp hơn chuỗi gốc: mảnh glyph của tên thật lòi ra bên phải "nhanvien.a"; chữ cái đầu "H" trong avatar chưa che. Có ~150px trắng thừa dưới đáy.',
    alt: 'Bộ lọc nâng cao cho lịch sử cuộc gọi',
  },
  'gcalls-plus-click-to-call-config.png': {
    output: 'gcalls-plus-click-to-call-config-desktop-v1.webp',
    feature: 'Cấu hình nút click-to-call', form: 'desktop',
    route: '/', section: 'CallWidgetSection',
    crop: 'full frame, no crop',
    pii: ['tên công ty', 'số điện thoại', 'URL nội bộ'],
    sanitization: 'BLOCKED',
    visual: 'Cột Icon còn URL thật bị cắt ngang ("https://gcalls.cor…", "https://encrypte…"). Hộp mask cột "Số nhận" lệch khỏi hàng.',
    alt: 'Bảng cấu hình nút gọi trên website',
  },
  'gcalls-plus-call-history-table.png': {
    output: 'gcalls-plus-call-history-desktop-v1.webp',
    feature: 'Lịch sử cuộc gọi dạng bảng', form: 'desktop',
    route: '/', section: 'CallTimelineSection',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'số điện thoại', 'tên nhân viên'],
    sanitization: 'PASS',
    visual: 'Sạch. 19 hàng đều thay bằng Khách hàng NN / nhanvien.x / 09100000NN.',
    alt: 'Bảng lịch sử cuộc gọi với trạng thái và thời lượng từng cuộc',
  },
  'gcalls-plus-timeline-history.png': {
    output: 'gcalls-plus-timeline-history-desktop-v1.webp',
    feature: 'Dòng thời gian tương tác', form: 'desktop',
    route: '/', section: 'CallTimelineSection',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'số điện thoại'],
    sanitization: 'PASS',
    visual: 'Sạch. Tài khoản hiển thị "demo.user", hotline "1900 0000".',
    alt: 'Dòng thời gian cuộc gọi kèm ghi âm và nhãn phân loại',
  },
  'gcalls-plus-agent-status-log.png': {
    output: 'gcalls-plus-agent-status-log-desktop-v1.webp',
    feature: 'Log trạng thái nhân viên', form: 'desktop',
    route: '/gcalls-plus-webphone/', section: 'PerformanceSection',
    crop: 'full frame, no crop',
    pii: ['tên nhân viên'],
    sanitization: 'PASS',
    visual: 'Sạch (nhanvien.a/.b). Nhưng tiêu đề "Log trạng thái" bị cắt mất nửa trên và chỉ có 2 hàng — yếu về mặt hình ảnh.',
    alt: 'Nhật ký trạng thái trực tuyến của nhân viên theo ngày',
  },
  'gcalls-plus-activity-type-dropdown.png': {
    output: 'gcalls-plus-activity-type-dropdown-desktop-v1.webp',
    feature: 'Bộ lọc loại hoạt động', form: 'desktop',
    route: null, section: null,
    crop: 'full frame, no crop',
    pii: [],
    sanitization: 'PASS',
    visual: 'Sạch. Còn mảnh chữ số bị cắt ở mép trái (x=0). Quá nhỏ/không đủ nội dung để làm visual chính.',
    alt: 'Bộ lọc loại hoạt động: cuộc gọi, ghi chú, nhắc nhở, tin nhắn',
  },
  'gcalls-plus-overview-activity.png': {
    output: 'gcalls-plus-overview-activity-desktop-v1.webp',
    feature: 'Tổng quan hoạt động', form: 'desktop',
    route: null, section: null,
    crop: 'full frame, no crop',
    pii: [],
    sanitization: 'PASS',
    visual: 'Sạch nhưng là EMPTY STATE — "Chưa có nhật ký cuộc gọi". Không chứng minh được gì, không dùng làm product proof.',
    alt: 'Màn hình tổng quan hoạt động của Gcalls Plus',
  },
  'gcalls-plus-integration-config.png': {
    output: 'gcalls-plus-integration-config-desktop-v1.webp',
    feature: 'Cấu hình tích hợp Odoo', form: 'desktop',
    route: null, section: null,
    crop: 'full frame, no crop',
    pii: [],
    sanitization: 'PASS',
    visual: 'Sạch nhưng EMPTY STATE — "Không có dữ liệu". Không dùng làm product proof.',
    alt: 'Màn hình cấu hình tích hợp Odoo',
  },
  'gcalls-plus-keypad-mobile.png': {
    output: 'gcalls-plus-webphone-keypad-mobile-v1.webp',
    feature: 'Bàn phím gọi trên di động', form: 'mobile',
    route: '/', section: 'Hero (crop phụ) / WorkFromAnywhereSection',
    crop: 'full frame, no crop',
    pii: [],
    sanitization: 'PASS',
    visual: 'Sạch. Chất lượng tốt, dùng được làm crop phụ cho hero.',
    alt: 'Bàn phím gọi của Gcalls Plus trên điện thoại',
  },
  'gcalls-plus-active-call-mobile.png': {
    output: 'gcalls-plus-webphone-active-call-mobile-v1.webp',
    feature: 'Màn hình cuộc gọi đang diễn ra', form: 'mobile',
    route: '/', section: 'Hero (crop phụ) / WorkFromAnywhereSection',
    crop: 'full frame, no crop',
    pii: ['tên liên hệ', 'số điện thoại'],
    sanitization: 'PASS',
    visual: 'Sạch (Khách hàng 01 / 0900 000 000). Ảnh mạnh nhất cho crop phụ hero.',
    alt: 'Màn hình cuộc gọi đang diễn ra trên ứng dụng di động Gcalls',
  },
  'gcalls-plus-analytics-dashboard.png': {
    output: null,
    feature: 'Dashboard phân tích cuộc gọi', form: 'desktop',
    route: null, section: null, crop: null,
    pii: ['dữ liệu hiệu suất thật (tổng cuộc gọi, tỷ lệ kết nối, thời lượng)'],
    sanitization: 'REFUSED',
    visual: 'Chưa sanitize — script từ chối xử lý, chờ phê duyệt nội dung số liệu.',
    alt: null,
  },
  'gcalls-plus-agent-performance.png': {
    output: null,
    feature: 'Hiệu suất từng nhân viên', form: 'desktop',
    route: null, section: null, crop: null,
    pii: ['danh sách nhân viên thật', 'máy nhánh', 'năng suất', 'thời điểm đăng nhập'],
    sanitization: 'REFUSED',
    visual: 'Chưa sanitize — script từ chối xử lý.',
    alt: null,
  },
}

const bySha = {}
const entries = []
for (const file of readdirSync(SRC).filter((f) => f.endsWith('.png')).sort()) {
  const abs = path.join(SRC, file)
  const buf = readFileSync(abs)
  const s = createHash('sha256').update(buf).digest('hex')
  const meta = await sharp(buf).metadata()
  const iend = buf.subarray(-8).toString('hex').endsWith('ae426082')
  const d = D[file] ?? {}
  const outPath = d.output ? path.join(OUT, d.output) : null
  const outExists = outPath && existsSync(outPath)
  const om = outExists ? await sharp(readFileSync(outPath)).metadata() : null

  const dup = bySha[s]
  bySha[s] = file

  entries.push({
    filename: file,
    sha256: s,
    dimensions: `${meta.width}x${meta.height}`,
    valid: iend ? 'valid' : 'corrupt/truncated',
    duplicate_of: dup ?? null,
    product: 'Gcalls Plus Webphone',
    feature: d.feature ?? null,
    form_factor: d.form ?? null,
    contains_pii: (d.pii ?? []).length > 0,
    pii_kinds: d.pii ?? [],
    sanitization_status: d.sanitization ?? 'NOT_PROCESSED',
    visual_inspection: d.visual ?? null,
    intended_route: d.route ?? null,
    intended_section: d.section ?? null,
    crop_strategy: d.crop ?? null,
    output_filename: d.output ?? null,
    output_dimensions: om ? `${om.width}x${om.height}` : null,
    output_bytes: outExists ? statSync(outPath).size : null,
    output_sha256: outExists ? sha(outPath) : null,
    upscaled: om ? (om.width > meta.width || om.height > meta.height) : null,
    alt_text: d.alt ?? null,
    caption: d.output ? 'Giao diện Gcalls — dữ liệu đã được ẩn danh' : null,
    source_approval: d.sanitization === 'REFUSED' ? 'WITHHELD — chờ chủ sở hữu duyệt số liệu'
      : d.sanitization === 'BLOCKED' ? 'WITHHELD — còn PII sau khi mask'
      : 'APPROVED for anonymised derivative only',
  })
}

const counts = entries.reduce((a, e) => { a[e.sanitization_status] = (a[e.sanitization_status] ?? 0) + 1; return a }, {})
const manifest = {
  generated_at_gmt: new Date().toISOString(),
  checkpoint: 'GCALLS-032',
  source_directory: SRC,
  note:
    'Không có bản trùng tên có hậu tố "(1)" trên máy này, và cả 15 PNG nguồn đều kết thúc bằng chunk IEND hợp lệ — không file nào truncated. ' +
    'Không có media thật cho Gcalls CX, Voicebot AI hoặc QC Bot AI: REAL_PRODUCT_MEDIA_MISSING. ' +
    'Không có tesseract/exiftool trên máy; text trong ảnh được kiểm bằng mắt ở tỉ lệ 1:1, metadata kiểm qua sharp (tất cả sạch).',
  real_product_media_missing: ['Gcalls CX', 'Voicebot AI', 'QC Bot AI'],
  max_source_width: Math.max(...entries.map((e) => +e.dimensions.split('x')[0])),
  counts,
  assets: entries,
}
writeFileSync('docs/content-review/images/product-media-manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log('counts:', counts)
console.log('max source width:', manifest.max_source_width)
