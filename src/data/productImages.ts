/**
 * Approved product imagery.
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE
 * ---------------------------------------------------------------------------
 * Every entry below is a real capture of the Gcalls Plus console, masked by
 * `scripts/mask-product-images.mjs` before it entered the repo. Masking is
 * destructive pixel replacement — customer names, phone numbers, e-mail
 * addresses, agent accounts, tenant names and call recordings are gone from
 * the shipped file, not blurred. The raw captures are never committed.
 *
 * Two source captures are deliberately absent: the analytics dashboard and the
 * agent-performance table. Both carry real operating figures, which is an
 * unapproved claim regardless of masking. See
 * `docs/content-review/images/image-source-inventory.csv`.
 *
 * `width`/`height` are the real intrinsic pixel dimensions. They are required
 * on every consumer so the browser reserves the box and the page does not
 * shift while images load. Nothing here is upscaled.
 * ---------------------------------------------------------------------------
 */

export interface ProductImage {
  /** Absolute, root-relative path under `public/`. */
  readonly src: string
  /** Intrinsic width in pixels. */
  readonly width: number
  /** Intrinsic height in pixels. */
  readonly height: number
  /**
   * Describes what the screenshot shows and that the data is masked. Empty
   * string is only valid for a purely decorative image.
   */
  readonly alt: string
}

const BASE = '/images/products/gcalls-plus'

export const GCALLS_PLUS_IMAGES = {
  /** Webphone: contact profile + activity feed + keypad on one screen. */
  webphoneDesktop: {
    src: `${BASE}/gcalls-plus-webphone-desktop-v1.webp`,
    width: 809,
    height: 429,
    alt: 'Giao diện webphone Gcalls Plus trên trình duyệt: danh sách liên hệ, hồ sơ khách hàng, ô ghi chú và bàn phím gọi trên cùng một màn hình; dữ liệu khách hàng đã được che',
  },
  /** Webphone on a phone, mid-call. */
  activeCallMobile: {
    src: `${BASE}/gcalls-plus-webphone-active-call-mobile-v1.webp`,
    width: 553,
    height: 1084,
    alt: 'Màn hình cuộc gọi đang diễn ra trên điện thoại với các nút tắt tiếng, bàn phím, chuyển tiếp và ghi chú; tên và số điện thoại đã được che',
  },
  /** Webphone on a phone, dialpad. */
  keypadMobile: {
    src: `${BASE}/gcalls-plus-webphone-keypad-mobile-v1.webp`,
    width: 576,
    height: 1092,
    alt: 'Bàn phím gọi của webphone Gcalls Plus trên điện thoại',
  },
  /** Call history table with per-call status, direction and duration. */
  callHistoryDesktop: {
    src: `${BASE}/gcalls-plus-call-history-desktop-v1.webp`,
    width: 808,
    height: 983,
    alt: 'Bảng lịch sử cuộc gọi trong Gcalls Plus với cột nhân viên, danh bạ, số điện thoại, loại cuộc gọi, trạng thái kết nối, thời điểm và thời lượng; dữ liệu khách hàng đã được che',
  },
  /** Same history as a chronological timeline with recordings attached. */
  timelineDesktop: {
    src: `${BASE}/gcalls-plus-timeline-history-desktop-v1.webp`,
    width: 809,
    height: 443,
    alt: 'Dòng thời gian hoạt động cuộc gọi trong Gcalls Plus, mỗi mục kèm trạng thái, thời lượng và bản ghi âm; dữ liệu khách hàng đã được che',
  },
  /** Contact profile card beside the interaction feed. */
  contactProfileDesktop: {
    src: `${BASE}/gcalls-plus-contact-profile-desktop-v1.webp`,
    width: 809,
    height: 440,
    alt: 'Hồ sơ khách hàng trong Gcalls Plus với thông tin liên hệ, ô ghi chú và lịch sử tương tác hiển thị cạnh nhau; dữ liệu khách hàng đã được che',
  },
  /** CRM connector menu opened on a contact. */
  integrationsDesktop: {
    src: `${BASE}/gcalls-plus-integrations-desktop-v1.webp`,
    width: 809,
    height: 494,
    alt: 'Menu kết nối CRM trong Gcalls Plus cho phép mở hồ sơ khách hàng trên hệ thống CRM đang dùng; dữ liệu khách hàng đã được che',
  },
  /** Integration host/field configuration screen. */
  integrationConfigDesktop: {
    src: `${BASE}/gcalls-plus-integration-config-desktop-v1.webp`,
    width: 809,
    height: 446,
    alt: 'Màn hình cấu hình tích hợp trong Gcalls Plus với danh sách host, mô tả và trường dữ liệu được ánh xạ',
  },
  /** Click-to-call button configuration table. */
  clickToCallDesktop: {
    src: `${BASE}/gcalls-plus-click-to-call-config-desktop-v1.webp`,
    width: 809,
    height: 352,
    alt: 'Bảng cấu hình nút gọi click-to-call trong Gcalls Plus với tiêu đề, nội dung, vị trí hiển thị và số nhận cuộc gọi; dữ liệu định danh đã được che',
  },
  /** Agent presence timeline. */
  agentStatusLogDesktop: {
    src: `${BASE}/gcalls-plus-agent-status-log-desktop-v1.webp`,
    width: 809,
    height: 295,
    alt: 'Log trạng thái nhân viên trong Gcalls Plus theo trục thời gian trong ngày với các trạng thái online, nghỉ trưa, im lặng và offline; tên nhân viên đã được che',
  },
  /** Advanced filter dialog over the activity feed. */
  advancedFilterDesktop: {
    src: `${BASE}/gcalls-plus-advanced-filter-desktop-v1.webp`,
    width: 821,
    height: 704,
    alt: 'Hộp thoại lọc nâng cao trong Gcalls Plus với bộ lọc theo khoảng thời gian, team, vai trò và đánh giá cuộc gọi; dữ liệu nhân viên đã được che',
  },
  /** Activity-type selector on the activity feed. */
  activityTypeDesktop: {
    src: `${BASE}/gcalls-plus-activity-type-dropdown-desktop-v1.webp`,
    width: 808,
    height: 240,
    alt: 'Bộ chọn loại hoạt động trong Gcalls Plus với các mục cuộc gọi, ghi chú, nhắc nhở và tin nhắn',
  },
  /** Empty-state activity console. */
  overviewActivityDesktop: {
    src: `${BASE}/gcalls-plus-overview-activity-desktop-v1.webp`,
    width: 810,
    height: 450,
    alt: 'Màn hình tổng quan hoạt động của Gcalls Plus với nhóm danh bạ bên trái, bộ lọc hoạt động ở giữa và nhật ký cuộc gọi bên phải; tên nhóm đã được che',
  },
} as const satisfies Record<string, ProductImage>
