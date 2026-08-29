#!/usr/bin/env node
/**
 * Builds the Elementor page template for the home page.
 *
 * WHY A GENERATOR AND NOT A HAND-WRITTEN JSON FILE
 * An Elementor export is a few thousand lines of nested settings objects with
 * positional ids. Hand-edited, it is unreviewable — a diff shows a hundred
 * changed ids and hides the one changed sentence — and a single malformed
 * bracket imports as a blank page. Generated, the SOURCE of the page is this
 * file: thirteen sections of readable copy, and the ids are derived, so
 * re-running produces a byte-identical file and a real diff.
 *
 * WHERE THE COPY COMES FROM
 * Every heading, paragraph, list item and button label below is transcribed
 * from the approved React home page in `src/components/home/`, with the section
 * each one came from named. Nothing here is invented, and no figure appears
 * that the React page does not already show — the analytics visual carries the
 * same "dữ liệu minh họa" disclaimer the React section carries, because it is
 * the same illustrative data.
 *
 * THE CONSTRAINTS THIS FILE RESPECTS
 * - Elementor FREE widgets only: heading, text-editor, button, icon-list,
 *   shortcode, html, divider, spacer. No Pro widget, no cloud library.
 * - Colours and fonts are the four approved tokens, and they are also declared
 *   in the Elementor kit; a widget-level colour is used only where a section
 *   needs its own background.
 * - Charts are static inline SVG. There is no chart library on this site and
 *   the numbers are illustrative, so an animated chart would add a dependency
 *   to decorate an illustration.
 * - Product screenshots are placed with [gcalls_media id="…"], never an
 *   attachment id or an uploads URL, so the template imports correctly on any
 *   environment. See class-shortcodes.php.
 * - Every CTA carries the same lead attribution the React CTA carries.
 *
 * Usage: node wordpress/scripts/build-homepage-template.mjs [--out <path>]
 */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const BRAND = '#673ab7'
const BRAND_DARK = '#4a2391'
const BRAND_LIGHT = '#f5f1fc'
const INK = '#1e2026'
const MUTED = '#5b5f6b'
const WHITE = '#ffffff'

/**
 * Deterministic element ids.
 *
 * Elementor only requires them to be unique within the document. Deriving them
 * from a running counter keeps the output stable between runs, which is what
 * makes the committed file diffable.
 */
let counter = 0
const eid = () => createHash('sha1').update(`gcalls-home-${++counter}`).digest('hex').slice(0, 7)

/* ------------------------------------------------------------------ *
 * Element constructors
 * ------------------------------------------------------------------ */

const widget = (widgetType, settings) => ({
  id: eid(),
  elType: 'widget',
  widgetType,
  settings,
  elements: [],
})

const column = (elements, size = 100, settings = {}) => ({
  id: eid(),
  elType: 'column',
  settings: { _column_size: size, _inline_size: null, ...settings },
  elements,
  isInner: false,
})

/**
 * Vertical rhythm, measured off the reference rather than chosen.
 *
 * React's Section pads 96px on six of its thirteen sections and 112px on the
 * seven content-heavy ones; this port shipped 72px everywhere, and across
 * nineteen sections that is most of a screen of breathing room missing.
 *
 * 104 is the reference's mean, and one value is right here rather than two:
 * React's split follows ITS thirteen sections, and this template splits four of
 * those in half to work around Elementor's lack of nesting, so copying the
 * per-section values would apply "content-heavy" padding to a section holding
 * one sub-heading.
 */
const SECTION_PAD = '104'

const section = (columns, settings = {}) => ({
  id: eid(),
  elType: 'section',
  settings: {
    content_width: 'boxed',
    padding: { unit: 'px', top: SECTION_PAD, right: '0', bottom: SECTION_PAD, left: '0', isLinked: false },
    ...settings,
  },
  elements: columns,
  isInner: false,
})

const tinted = (color) => ({ background_background: 'classic', background_color: color })

const heading = (title, size = 'h2', extra = {}) =>
  widget('heading', {
    title,
    header_size: size,
    title_color: INK,
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
    typography_font_weight: '700',
    ...extra,
  })

const text = (html, extra = {}) =>
  widget('text-editor', {
    editor: `<p>${html}</p>`,
    text_color: MUTED,
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
    ...extra,
  })

/**
 * A conversion button.
 *
 * `attribution` is spread into the query string exactly as `leadCtaHref()`
 * builds it in React. A button without it still works and still converts, and
 * the lead arrives with no record of the page that produced it — which is the
 * failure this argument exists to prevent.
 */
const cta = (label, attribution, variant = 'primary') => {
  const query = Object.entries(attribution)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return widget('button', {
    text: label,
    link: { url: query ? `/lien-he/?${query}` : '/lien-he/', is_external: '', nofollow: '' },
    align: 'left',
    background_color: variant === 'primary' ? BRAND : 'transparent',
    button_text_color: variant === 'primary' ? WHITE : BRAND,
    border_border: variant === 'primary' ? '' : 'solid',
    border_width: variant === 'primary' ? {} : { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: variant === 'primary' ? '' : BRAND,
    border_radius: { unit: 'px', top: '8', right: '8', bottom: '8', left: '8', isLinked: true },
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
    typography_font_weight: '600',
  })
}

/** An internal link button that is not a conversion CTA. */
const linkButton = (label, url) =>
  widget('button', {
    text: label,
    link: { url, is_external: '', nofollow: '' },
    align: 'left',
    background_color: 'transparent',
    button_text_color: BRAND,
    border_border: 'solid',
    border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
    border_color: BRAND,
    border_radius: { unit: 'px', top: '8', right: '8', bottom: '8', left: '8', isLinked: true },
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
    typography_font_weight: '600',
  })

const iconList = (items, extra = {}) =>
  widget('icon-list', {
    icon_list: items.map((item) => ({
      _id: eid(),
      text: item,
      selected_icon: { value: 'fas fa-check', library: 'fa-solid' },
    })),
    icon_color: BRAND,
    text_color: MUTED,
    space_between: { unit: 'px', size: 12 },
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
    ...extra,
  })

const media = (id) => widget('shortcode', { shortcode: `[gcalls_media id="${id}" size="large"]` })

/**
 * A ported React mockup.
 *
 * Seven sections of the React home page are interactive components, not static
 * art: tabs, selectable lists, a playback bar, a call timer. A screenshot of one
 * is a picture of a single frame, and a reviewer who clicks it learns that the
 * demo is a picture — so those seven sections carry the port, and the real
 * masked screenshots go where React is genuinely static.
 */
const mockup = (id) => widget('shortcode', { shortcode: `[gcalls_mockup id="${id}"]` })

const shortcode = (value) => widget('shortcode', { shortcode: value })

const html = (markup) => widget('html', { html: markup })

/** A titled card, used where React renders a grid of problem/product cards. */
const plainCard = (title, body) =>
  widget('text-editor', {
    editor:
      `<div style="font-size:.95rem;font-weight:700;color:${INK};margin:0 0 .5rem">${title}</div>` +
      `<p style="margin:0;color:${MUTED}">${body}</p>`,
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
  })

const card = (title, body) =>
  widget('text-editor', {
    editor: `<h3 style="font-size:1.05rem;font-weight:700;color:${INK};margin:0 0 .5rem">${title}</h3><p style="margin:0;color:${MUTED}">${body}</p>`,
    typography_typography: 'custom',
    typography_font_family: 'Open Sans',
  })

/**
 * Lays a list of widgets into equal columns.
 *
 * CAUTION: Elementor columns in one section do not wrap. `perRow` sets each
 * column's width and nothing else, so passing six widgets with perRow 3 gives
 * six columns across at every width, not 3×2 — which is exactly what shipped
 * on the pain-point cards. Use `cardGrid()` for anything that has to wrap;
 * this stays for the two ecosystem rows, where the item count already equals
 * perRow and Elementor's own mobile stacking is enough.
 */
const grid = (widgets, perRow) => {
  const size = Math.round(100 / perRow)
  return widgets.map((w) => column([w], size))
}

/* ------------------------------------------------------------------ *
 * React parity primitives
 * ------------------------------------------------------------------ *
 * These emit semantic HTML carrying class names only. No colour literal
 * appears in any of them: the look resolves in the theme stylesheet, which
 * is what keeps the "only approved colours" gate meaningful while still
 * letting the design use the reference's off-palette tints.
 */

/**
 * Icon geometry lifted from the exact lucide icons the reference imports
 * (lucide-react 0.487, ISC licence). Inlined rather than fetched: the
 * reference compiles them into its bundle, and adding an icon font or an SVG
 * sprite request to draw nine glyphs would buy a round trip and a flash of
 * missing icons on a page that currently has neither.
 */
const ICON = {
  'phone-off':
    '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" x2="2" y1="2" y2="22"/>',
  'user-x':
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/>',
  'shield-alert':
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  'bar-chart':
    '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  keyboard:
    '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
}

const icon = (name, width = 2) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[name]}</svg>`

/** The uppercase pill above a heading. */
const eyebrowHtml = (label, { hero = false } = {}) =>
  `<p class="gc-eyebrow${hero ? ' gc-eyebrow--hero' : ''}">` +
  (hero ? '<span class="gc-eyebrow__dot"></span>' : '') +
  `${label}</p>`

/**
 * A heading whose emphasised phrase carries the clipped gradient.
 *
 * The reference colours only the middle span, not the whole line — so the
 * gradient reads as emphasis on the words that carry the claim rather than as
 * a coat of paint over the sentence.
 */
const gradHeadingHtml = (tag, before, accent, after = '') =>
  `<${tag} class="gc-${tag}">${before}<span class="gc-grad">${accent}</span>${after}</${tag}>`

/** Centred eyebrow + gradient heading + lead paragraph. */
const sectionHead = (eyebrowLabel, [before, accent, after], lead) =>
  html(
    `<div class="gc-head">${eyebrowHtml(eyebrowLabel)}` +
      gradHeadingHtml('h2', before, accent, after) +
      (lead ? `<p class="gc-head__lead">${lead}</p>` : '') +
      `</div>`,
  )

/**
 * A wrapping card grid, in one widget.
 *
 * Each item is { icon, title, body }. The title is a real h3 because it heads
 * the paragraph beneath it; the index is decorative and hidden from the
 * accessibility tree, matching the reference's aria-hidden number badge.
 */
const cardGrid = (items, perRow = 3) =>
  html(
    `<div class="gc-cards gc-cards--${perRow}">` +
      items
        .map(
          (item, i) =>
            `<article class="gc-card">` +
            (item.icon ? `<div class="gc-card__icon">${icon(item.icon, 1.8)}</div>` : '') +
            `<div class="gc-card__top"><h3>${item.title}</h3>` +
            `<span class="gc-card__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></div>` +
            `<p class="gc-card__body">${item.body}</p>` +
            `<div class="gc-card__rule" aria-hidden="true"></div>` +
            `</article>`,
        )
        .join('') +
      `</div>`,
  )

/** Builds the `/lien-he/` href exactly as leadCtaHref() does in React. */
const leadHref = (attribution) => {
  const query = Object.entries(attribution)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

  return query ? `/lien-he/?${query}` : '/lien-he/'
}

/* ------------------------------------------------------------------ *
 * The illustrative analytics visual
 * ------------------------------------------------------------------ */

/**
 * A static bar chart, drawn rather than measured.
 *
 * The React AnalyticsSection states in its own copy that these are "dữ liệu
 * minh họa, không phải kết quả đo được của một doanh nghiệp cụ thể". The same
 * sentence is printed under this SVG. The bars carry NO numeric labels and no
 * axis values: an unlabelled shape reads as an illustration, while a labelled
 * one reads as a measurement, and this project has a standing rule against
 * publishing operating figures it has not earned.
 */
const analyticsSvg = `
<figure style="margin:0">
  <svg viewBox="0 0 640 260" role="img" aria-label="Biểu đồ minh họa hoạt động cuộc gọi theo ngày trong tuần" style="width:100%;height:auto">
    <defs>
      <linearGradient id="gcallsBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${BRAND}"/>
        <stop offset="100%" stop-color="${BRAND_DARK}"/>
      </linearGradient>
    </defs>
    <g stroke="${BRAND_LIGHT}" stroke-width="1">
      <line x1="48" y1="40" x2="620" y2="40"/>
      <line x1="48" y1="90" x2="620" y2="90"/>
      <line x1="48" y1="140" x2="620" y2="140"/>
      <line x1="48" y1="190" x2="620" y2="190"/>
    </g>
    <line x1="48" y1="212" x2="620" y2="212" stroke="#e8e5ef" stroke-width="1.5"/>
    <g fill="url(#gcallsBar)">
      <rect x="70"  y="120" width="42" height="92"  rx="6"/>
      <rect x="150" y="86"  width="42" height="126" rx="6"/>
      <rect x="230" y="62"  width="42" height="150" rx="6"/>
      <rect x="310" y="98"  width="42" height="114" rx="6"/>
      <rect x="390" y="52"  width="42" height="160" rx="6"/>
      <rect x="470" y="132" width="42" height="80"  rx="6"/>
      <rect x="550" y="164" width="42" height="48"  rx="6"/>
    </g>
    <g fill="${MUTED}" font-family="'Open Sans', sans-serif" font-size="13" text-anchor="middle">
      <text x="91"  y="232">T2</text>
      <text x="171" y="232">T3</text>
      <text x="251" y="232">T4</text>
      <text x="331" y="232">T5</text>
      <text x="411" y="232">T6</text>
      <text x="491" y="232">T7</text>
      <text x="571" y="232">CN</text>
    </g>
  </svg>
  <figcaption style="color:${MUTED};font-size:.875rem;margin-top:.75rem">
    Các chỉ số Gcalls Analytics theo dõi. Số liệu bên dưới là dữ liệu minh họa, không phải kết quả đo được của một doanh nghiệp cụ thể.
  </figcaption>
</figure>`.trim()

/* ------------------------------------------------------------------ *
 * The thirteen sections
 * ------------------------------------------------------------------ */

const content = [
  /* 1 — HeroSection.tsx
   *
   * One html widget, not six stacked Elementor widgets. The reference's left
   * column is a single flex stack whose parts have fixed relationships — the
   * badge sits on the heading, the two buttons share a row and wrap together,
   * the fine print hangs off a hairline under the checks. Expressed as
   * separate widgets each one becomes a block with its own margin, which is
   * how the port ended up with the buttons on two rows and no badge, checks
   * or fine print at all.
   *
   * The CTA href is built by leadHref() from the same attribution object
   * HeroSection passes to leadCtaHref(), so the lead still arrives labelled. */
  section(
    [
      column(
        [
          html(
            `<div class="gc-hero">` +
              eyebrowHtml('Gcalls Webphone', { hero: true }) +
              gradHeadingHtml(
                'h1',
                'Tổng Đài Ảo Tích Hợp CRM - ',
                'Bứt Phá Doanh Số',
                ' Cho Đội Sales &amp; CSKH',
              ) +
              `<p class="gc-hero-lede">Giải pháp tổng đài thông minh giúp đội Sales và CSKH thực hiện cuộc gọi trên trình duyệt, lưu lịch sử và ghi âm, quản lý thông tin khách hàng, theo dõi hiệu suất và kết nối với hệ thống quản trị doanh nghiệp.</p>` +
              `<div class="gc-ctarow">` +
              `<a class="gc-btn gc-btn--primary" href="${leadHref({ intent: 'demo', source: 'consultation', product: 'Gcalls Plus Webphone' })}">${icon('phone')}Đăng ký demo</a>` +
              `<a class="gc-btn gc-btn--ghost" href="/gcalls-plus-webphone/">Khám phá Gcalls Webphone${icon('chevron-right')}</a>` +
              `</div>` +
              `<div class="gc-checks">` +
              [
                'Gọi trực tiếp trên trình duyệt',
                'Lưu lịch sử và ghi âm cuộc gọi',
                'Quản lý danh bạ khách hàng',
                'Theo dõi KPI realtime',
              ]
                .map(
                  (item) =>
                    `<div class="gc-check"><span class="gc-check__i">${icon('check', 3)}</span><span>${item}</span></div>`,
                )
                .join('') +
              `</div>` +
              // Both lines are claim-safety copy, and the second is repeated
              // out here on purpose: the same label inside the mockup frame is
              // covered by the overlapping cards at desktop widths, and a
              // label a layout can hide is not a label.
              `<div class="gc-fine">` +
              `<p>Phạm vi triển khai và cấu hình được xác nhận cùng đội ngũ Gcalls theo hệ thống thực tế của doanh nghiệp.</p>` +
              `<p>Hình ảnh giao diện và toàn bộ số liệu trong ảnh là minh họa, không phải kết quả vận hành của một doanh nghiệp cụ thể.</p>` +
              `</div></div>`,
          ),
        ],
        50,
      ),
      column([mockup('hero')], 50),
    ],
    tinted(BRAND_LIGHT),
  ),

  /* 2 — PainPointsSection.tsx
   *
   * The six cards are one CSS grid, not six Elementor columns — see the
   * caution on grid(). The icons and the accent cycle are the reference's
   * own: painPoints[] assigns three accents in rotation, which the stylesheet
   * reproduces with :nth-child rather than by writing colour into the
   * template. */
  section([
    column([
      sectionHead(
        'Nỗi đau doanh nghiệp',
        [
          '“Khoảng Trống” Vận Hành Khiến Doanh Nghiệp ',
          'Rò Rỉ Khách Hàng Và Thất Thoát Doanh Thu',
        ],
        'Đội Sales và CSKH có thể mất nhiều thời gian và dữ liệu khi hệ thống nghe gọi, quản lý khách hàng và báo cáo vận hành hoạt động rời rạc.',
      ),
    ]),
  ]),
  section(
    [
      column([
        cardGrid(
          [
            {
              icon: 'phone-off',
              title: 'Gián đoạn hoạt động telesales khi số gọi ra bị khóa hoặc bị người nhận báo cáo spam',
              body: 'Chiến dịch gọi ra đang chạy có thể dừng giữa chừng, đội ngũ phải chờ xử lý đầu số trước khi tiếp tục liên hệ khách hàng.',
            },
            {
              icon: 'user-x',
              title: 'Khách hàng e ngại và từ chối cuộc gọi đến từ số lạ',
              body: 'Khi cuộc gọi không mang dấu hiệu nhận diện, người nhận khó biết ai đang gọi và thường bỏ qua trước khi nghe nội dung tư vấn.',
            },
            {
              icon: 'shield-alert',
              title: 'Quản lý khó kiểm soát chất lượng tư vấn thực tế',
              body: 'Nếu không có ghi âm, ghi chú và tiêu chí đánh giá tập trung, quản lý chỉ nắm được một phần nội dung trao đổi giữa nhân viên và khách hàng.',
            },
            {
              icon: 'bar-chart',
              title: 'Thiếu dữ liệu thời gian thực để đánh giá hiệu suất đội ngũ',
              body: 'Báo cáo tổng hợp thủ công thường đến sau khi vấn đề đã xảy ra, khiến quản lý khó điều phối nguồn lực trong ngày.',
            },
            {
              icon: 'globe',
              title: 'Chi phí cao và tỷ lệ bắt máy thấp khi liên hệ thị trường quốc tế',
              body: 'Gọi ra thị trường nước ngoài bằng đầu số không phù hợp làm tăng chi phí liên lạc và giảm khả năng khách hàng nhận máy.',
            },
            {
              icon: 'keyboard',
              title: 'Nhân viên mất thời gian nhập liệu và đối chiếu thông tin thủ công',
              body: 'Mỗi cuộc gọi kéo theo thao tác sao chép, nhập lại và kiểm tra chéo giữa các hệ thống, làm chậm quy trình và dễ phát sinh sai sót.',
            },
          ],
          3,
        ),
      ]),
    ],
    { padding: { unit: 'px', top: '0', right: '0', bottom: '48', left: '0', isLinked: false } },
  ),
  // Still PainPointsSection: React nests LossEstimator at the end of it rather
  // than giving it a section, because the estimator quantifies the six problems
  // above using the visitor's own numbers. Its disclaimer only reads honestly
  // while it sits next to the problem statement — promoted into a standalone
  // "savings" block it becomes a claim, which is exactly what the content
  // checkpoint forbids. Elementor has no nesting that would reproduce the React
  // DOM, so it is a section with the padding closed up instead.
  section(
    [
      column([
        shortcode('[gcalls_loss_estimator]'),
        cta('Hoặc trao đổi trực tiếp với đội ngũ Gcalls', {
          intent: 'consultation',
          source: 'consultation',
        }),
      ]),
    ],
    { padding: { unit: 'px', top: '0', right: '0', bottom: SECTION_PAD, left: '0', isLinked: false } },
  ),

  /* 3 — SolutionBridgeSection.tsx */
  section(
    [
      column([
        heading(
          'Tổng Đài Thông Minh Gcalls: Bứt Phá Doanh Số Đội Ngũ & Nâng Cao Trải Nghiệm Khách Hàng',
          'h2',
          { title_color: WHITE },
        ),
        text(
          'Gcalls kết nối hoạt động nghe gọi, dữ liệu khách hàng, lịch sử chăm sóc và báo cáo vận hành trong một hệ thống thống nhất, đồng thời hỗ trợ tích hợp với CRM, Helpdesk, POS và các giải pháp tự động hóa phù hợp.',
          { text_color: '#e9defb' },
        ),
        iconList(
          [
            'Vận hành trên trình duyệt',
            'Tích hợp CRM, POS và Helpdesk',
            'Hỗ trợ nhu cầu liên lạc quốc tế',
            'Báo cáo theo thời gian thực',
          ],
          { icon_color: WHITE, text_color: WHITE },
        ),
        cta('Đăng ký tư vấn', { intent: 'consultation', source: 'homepage-bridge' }, 'primary'),
      ]),
    ],
    { background_background: 'classic', background_color: BRAND_DARK },
  ),

  /* 4 — EcosystemSection.tsx */
  section([
    column([
      heading('Hệ sinh thái sản phẩm và giải pháp Gcalls'),
      text(
        'Doanh nghiệp có thể bắt đầu từ một sản phẩm phù hợp với nhu cầu hiện tại, sau đó mở rộng sang các giải pháp tích hợp khi quy mô vận hành thay đổi.',
      ),
    ]),
  ]),
  section([column([heading('Sản phẩm Gcalls', 'h3')])]),
  section([
    column([
      cardGrid(
        [
          {
            title: 'Gcalls Plus Webphone',
            body: 'Tổng đài trên trình duyệt hỗ trợ nghe gọi, lịch sử cuộc gọi, ghi âm, danh bạ và theo dõi hoạt động đội ngũ.',
          },
          {
            title: 'QA QC Center',
            body: 'Hỗ trợ chuyển giọng nói thành văn bản, phân tích từ khóa, chấm điểm theo tiêu chí và tổng hợp dữ liệu phục vụ kiểm soát chất lượng.',
          },
          {
            title: 'Gcalls CX',
            body: 'Nền tảng Contact Center hỗ trợ quản lý tương tác đa kênh và quy trình chăm sóc khách hàng.',
          },
          {
            title: 'Gcalls Voicebot AI',
            body: 'Gcalls tư vấn, kết nối và tích hợp Voicebot vào hệ thống tổng đài theo kịch bản và phạm vi triển khai của doanh nghiệp.',
          },
        ],
        4,
      ),
    ]),
  ]),
  section([column([heading('Giải pháp Gcalls', 'h3')])]),
  section(
    [
      column([
        cardGrid(
          [
            { title: 'Tích hợp CRM', body: 'Kết nối cuộc gọi với dữ liệu và quy trình trên CRM của doanh nghiệp.' },
            { title: 'Tích hợp Helpdesk', body: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket của đội CSKH.' },
            { title: 'Tích hợp POS', body: 'Kết nối cuộc gọi với dữ liệu bán hàng và đơn hàng trên hệ thống POS.' },
            { title: 'Tổng đài quốc tế', body: 'Đầu số và phương án liên lạc theo từng thị trường doanh nghiệp phục vụ.' },
          ],
          4,
        ),
      ]),
    ],
    { padding: { unit: 'px', top: '0', right: '0', bottom: SECTION_PAD, left: '0', isLinked: false } },
  ),

  /* 5 — CallTimelineSection.tsx */
  section(
    [
      column([
        heading('Theo dõi toàn bộ hoạt động cuộc gọi theo thời gian thực'),
        heading('Mỗi cuộc gọi đều trở thành dữ liệu giá trị', 'h3'),
        text(
          'Từ cuộc gọi đến, cuộc gọi đi, cuộc gọi nhỡ, ghi âm, ghi chú đến đánh giá chất lượng cuộc gọi — tất cả đều được lưu trữ tập trung trên Gcalls Webphone.',
        ),
        text(
          'Lịch sử trao đổi, ghi âm, ghi chú và kết quả cuộc gọi được lưu lại giúp đội Sales và CSKH tiếp nối công việc với đầy đủ ngữ cảnh của lần liên hệ trước.',
        ),
      ], 50),
      column([mockup('call_timeline')], 50),
    ],
    tinted('#faf9fc'),
  ),

  /* 6 — CRMSection.tsx */
  section([
    column([mockup('crm')], 50),
    column(
      [
        heading('Quản lý khách hàng tập trung ngay trên Gcalls'),
        heading('Mỗi khách hàng đều có một hồ sơ riêng', 'h3'),
        text(
          'Toàn bộ thông tin khách hàng, lịch sử tương tác và ghi chú chăm sóc được lưu trữ tập trung giúp đội Sales và CSKH làm việc hiệu quả hơn.',
        ),
        text(
          'Khi có cuộc gọi đến hoặc đi, nhân viên có thể xem ngay thông tin khách hàng, lịch sử chăm sóc, ghi chú và các hoạt động liên quan mà không cần chuyển đổi giữa nhiều hệ thống.',
        ),
        iconList([
          'Quản lý tập trung trên Webphone',
          'Tương tác được lưu trữ đầy đủ',
          'Tích hợp sẵn trong nền tảng',
        ]),
      ],
      50,
    ),
  ]),

  /* 7 — AnalyticsSection.tsx */
  section(
    [
      column([
        heading('Theo dõi hiệu suất đội ngũ theo thời gian thực'),
        text(
          'Dashboard trực quan giúp quản lý theo dõi tình trạng cuộc gọi, hiệu suất nhân viên và chất lượng vận hành chỉ trong vài giây.',
        ),
        text(
          'Không cần tổng hợp báo cáo thủ công từ nhiều nguồn. Mọi chỉ số quan trọng đều được hiển thị trực quan giúp quản lý nhanh chóng nắm bắt tình hình vận hành.',
        ),
        heading('Ra quyết định nhanh hơn với dữ liệu trực quan', 'h3'),
        mockup('analytics'),
        heading('Các chỉ số quan trọng trong một màn hình', 'h3'),
        heading('Dành cho quản lý, trưởng nhóm và chủ doanh nghiệp', 'h3'),
      ]),
    ],
    tinted(BRAND_LIGHT),
  ),

  /* 8 — CloudSection.tsx */
  section([
    column([
      heading('Xây dựng hệ thống tổng đài doanh nghiệp trên nền tảng Cloud'),
      text(
        'Từ doanh nghiệp nhỏ đến Contact Center nhiều chi nhánh, Gcalls giúp triển khai hệ thống tổng đài linh hoạt, dễ mở rộng và vận hành hoàn toàn trên nền tảng điện toán đám mây.',
      ),
      text(
        'Cấu hình luồng cuộc gọi tới đúng bộ phận, đúng nhân viên hoặc đúng chi nhánh, kèm nhóm đổ chuông và chuyển tiếp cho trường hợp không có người nhận máy.',
      ),
      heading('Điều hướng cuộc gọi đến đúng người phụ trách', 'h3'),
      heading('Đầy đủ tính năng Cloud PBX doanh nghiệp', 'h3'),
      mockup('cloud'),
      heading('Hành trình cuộc gọi từ đầu đến cuối', 'h3'),
      cta('Cloud Call Center', {
        intent: 'consultation',
        source: 'consultation',
        solution: 'Cloud Call Center',
      }),
    ]),
  ]),

  /* 9 — CustomerPopupSection.tsx */
  section(
    [
      column([
        heading('Nhận diện khách hàng ngay khi cuộc gọi đến', 'h2'),
        text(
          'Khi có cuộc gọi đến, nhân viên xem được thông tin khách hàng lấy từ hệ thống đã kết nối — trong phạm vi tích hợp được cấu hình cho doanh nghiệp.',
        ),
      ], 50),
      // The ported CustomerPopupMockup, not the mobile screenshot that used to
      // sit here. This section's argument is the moment a call arrives and the
      // agent sees who it is — a still frame cannot show a moment, and the
      // reference makes it answerable on purpose.
      column([mockup('customer_popup')], 50),
    ],
    tinted('#faf9fc'),
  ),

  /* 10 — CallWidgetSection.tsx */
  section([
    column([
      heading('Biến khách truy cập website thành cuộc gọi'),
      text(
        'Nhúng nút gọi vào website chỉ với vài dòng code. Khách truy cập để lại số điện thoại và đội ngũ gọi lại theo cấu hình phân phối cuộc gọi của doanh nghiệp.',
      ),
      iconList([
        'Tăng tỷ lệ chuyển đổi từ visitor thành lead',
        'Thu thập số điện thoại và gọi lại tức thì',
        'Theo dõi nguồn cuộc gọi từ từng trang web',
      ]),
      // The ported WidgetMockup. The screenshot that used to sit here showed
      // the click-to-call ADMIN configuration screen; this section sells what
      // the website VISITOR sees, which is the button and the callback panel.
      // Right subject, wrong end of it.
      mockup('widget'),
      cta('Call Button Widget', {
        intent: 'consultation',
        source: 'consultation',
        solution: 'Call Button Widget',
      }),
    ]),
  ]),

  /* 11 — IntegrationsSection.tsx */
  section(
    [
      column([
        // React opens this section with the ecosystem sub-heading and only then
        // names the integration, so the order here follows it.
        heading('Hệ sinh thái tích hợp của Gcalls', 'h3', { title_color: WHITE }),
        heading('Kết nối Gcalls với hệ thống CRM của doanh nghiệp bạn', 'h2', { title_color: WHITE }),
        text(
          'Gcalls giúp doanh nghiệp đồng bộ dữ liệu khách hàng, cuộc gọi và hoạt động chăm sóc khách hàng với CRM, Helpdesk và các hệ thống nội bộ thông qua API mở và Webhook.',
          { text_color: '#e9defb' },
        ),
        text(
          'Từ CRM, Helpdesk đến các hệ thống nội bộ — Gcalls kết nối qua API mở. Phạm vi và công việc cần thiết được đánh giá trong quá trình khảo sát kỹ thuật.',
          { text_color: '#e9defb' },
        ),
        mockup('integrations'),
        heading('Trao đổi phạm vi tích hợp cùng đội ngũ Gcalls', 'h3', { title_color: WHITE }),
        cta('Trao đổi phạm vi tích hợp cùng đội ngũ Gcalls', {
          intent: 'consultation',
          source: 'homepage-integration',
          solution: 'CRM Integration',
        }),
      ]),
    ],
    { background_background: 'classic', background_color: BRAND },
  ),

  /* 12 — WorkFromAnywhereSection.tsx */
  section([
    column(
      [
        heading('Mang tổng đài doanh nghiệp theo bạn đến bất kỳ đâu'),
        text(
          'Dù đang ở văn phòng, làm việc tại nhà hay di chuyển gặp khách hàng, đội ngũ vẫn có thể tiếp nhận và thực hiện cuộc gọi như đang ngồi tại tổng đài.',
        ),
        text(
          'Quản lý theo dõi trạng thái từng nhân viên, lịch sử hoạt động và hiệu suất — dù đội ngũ đang làm việc từ bất kỳ đâu.',
        ),
        iconList([
          'Gọi điện trực tiếp trên Chrome, Edge, Safari — không cài extension',
          'Chất lượng âm thanh HD, noise cancellation, dễ cấu hình',
          'Dữ liệu lưu trên Cloud, truy cập bất cứ đâu, không phụ thuộc server nội bộ',
          'Lịch sử, ghi chú, trạng thái đồng bộ tức thì giữa các thiết bị',
        ]),
        heading('Chỉ cần trình duyệt là có thể bắt đầu', 'h3'),
        heading('Biết đội ngũ đang làm gì theo thời gian thực', 'h3'),
      ],
      50,
    ),
    column([mockup('work_anywhere')], 50),
  ]),

  /* 13 — UseCasesFinalCtaSection.tsx */
  section(
    [
      column([
        heading('Tổng đài doanh nghiệp luôn đồng hành cùng đội ngũ của bạn'),
        heading('Gcalls phù hợp với mô hình đội ngũ nào', 'h3'),
        heading('Bắt đầu với đội ngũ hiện tại của bạn', 'h3'),
        text(
          'Không cần phần cứng, không cần cài đặt phức tạp — chỉ cần trình duyệt và kết nối internet, đội ngũ của bạn đã có thể bắt đầu ngay.',
        ),
        text(
          'Đội ngũ Gcalls trao đổi về quy mô, hệ thống đang dùng và quy trình vận hành để đề xuất cấu hình phù hợp trước khi triển khai.',
        ),
        // React closes with two buttons beside the panel: one for a demo, one
        // for a conversation. Both matter here because the lead form is
        // fail-closed until a destination is approved, so these links are the
        // only route a visitor has out of this section.
        cta('Đăng ký demo', { intent: 'demo', source: 'consultation' }, 'primary'),
        cta('Nhận tư vấn giải pháp', { intent: 'consultation', source: 'consultation' }),
        // The lead panel itself, fail-closed until a destination is approved.
        shortcode('[gcalls_lead_form title="Đăng ký tư vấn"]'),
      ]),
    ],
    tinted(BRAND_LIGHT),
  ),
]

/* ------------------------------------------------------------------ *
 * Envelope and output
 * ------------------------------------------------------------------ */

const template = {
  version: '0.4',
  title: 'Gcalls — Trang chủ',
  type: 'page',
  content,
}

const outArg = process.argv.indexOf('--out')
const outPath =
  outArg !== -1 && process.argv[outArg + 1]
    ? path.resolve(process.argv[outArg + 1])
    : path.join(WP_DIR, 'elementor-templates', 'gcalls-homepage.json')

await mkdir(path.dirname(outPath), { recursive: true })
await writeFile(outPath, `${JSON.stringify(template, null, 2)}\n`)

/*
 * A second copy, inside the plugin.
 *
 * The home page is Elementor data in the database, so shipping plugin files
 * alone cannot change it — the layout has to be written to page 13. Carrying
 * the template inside the plugin means the operator uploads one ZIP and the
 * layout it expects travels with it, instead of a JSON file that has to be
 * matched to the right plugin build by hand. `Home_Layout` reads exactly this
 * file, so the code and the layout it applies can never be from different
 * builds.
 *
 * Only written when the default output path is used: `--out` is for producing
 * a template somewhere else on purpose, and that should not silently rewrite
 * what the plugin ships.
 */
if (outArg === -1) {
  const shipped = path.join(
    WP_DIR,
    'wp-content/plugins/gcalls-core/data/homepage-elementor.json',
  )
  await mkdir(path.dirname(shipped), { recursive: true })
  await writeFile(shipped, `${JSON.stringify(template, null, 2)}\n`)
}

const widgets = JSON.stringify(content).match(/"elType":"widget"/g)?.length ?? 0

console.log(`build-homepage-template: ${path.relative(path.resolve(WP_DIR, '..'), outPath)}`)
console.log(`  sections  ${content.length}`)
console.log(`  widgets   ${widgets}`)
console.log(`  ids       ${counter} (deterministic — reruns are byte-identical)`)
