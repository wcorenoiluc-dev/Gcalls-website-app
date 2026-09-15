/**
 * Published customer testimonials.
 *
 * SOURCE OF TRUTH: the "KHÁCH HÀNG NÓI GÌ VỀ GCALLS" section of the public
 * Gcalls website. Every quote, name and role below is copied verbatim from
 * that page — nothing is paraphrased, shortened, or given a number it did not
 * already carry. Retrieval provenance is recorded on each entry so a reviewer
 * can re-verify against the live source.
 *
 * NO LOGO / NO HEADSHOT: the repository holds no approved brand mark or
 * portrait for any of these companies. Cards render a text monogram of the
 * company name. Do not add an image field here until an asset is approved
 * through the media manifest.
 *
 * Content Studio schema (per entry): company, representative, role, quote,
 * source. Keep the field names stable — the WordPress side keys on them.
 */

export interface Testimonial {
  /** Stable id, also used as the React key. */
  readonly id: string
  /** Customer company / brand name, exactly as published. */
  readonly company: string
  /** 1–2 letter monogram shown in place of an unapproved logo. */
  readonly monogram: string
  /** Representative's name, exactly as published. */
  readonly representative: string
  /** Representative's role, exactly as published. */
  readonly role: string
  /** Verbatim quote. */
  readonly quote: string
  readonly source: {
    readonly url: string
    /** ISO date on which the quote was retrieved and compared. */
    readonly retrievedAt: string
    /** Section heading on the source page. */
    readonly section: string
  }
}

const SOURCE = {
  url: 'https://gcalls.co/',
  retrievedAt: '2026-09-15',
  section: 'KHÁCH HÀNG NÓI GÌ VỀ GCALLS',
} as const

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'ktdc-group',
    company: 'KTDC Group',
    monogram: 'K',
    representative: 'Ms. Thư Nguyễn',
    role: 'Managing Director',
    quote:
      'Gcalls giúp KTDC hạn chế tối đa cuộc gọi nhỡ của khách hàng. Ngay cả khi có gọi nhỡ, KTDC cũng có thông tin để follow up và gọi lại. Với mỗi cuộc gọi đến, bất cứ bạn chăm sóc khách hàng nào cũng có thể tư vấn và chăm sóc một cách hiệu quả nhất vì mọi thông tin đều được lưu lại trên hệ thống Gcalls. Giá trị mà Gcalls mang lại cho KTDC Group không chỉ về mặt chất lượng và hiệu quả công việc, mà còn là sự tận tâm của đội ngũ nhân viên hỗ trợ hết mình.',
    source: SOURCE,
  },
  {
    id: 'ofelia',
    company: 'OFÉLIA',
    monogram: 'O',
    representative: 'Ms. Nguyễn Diệp Trân',
    role: 'Trưởng bộ phận CSKH',
    quote:
      'Gcalls giúp OFÉLIA tăng hiệu suất hỗ trợ khách hàng so với công cụ truyền thống. Đồng thời, tính năng lưu lại dữ liệu giúp tôi kiểm soát chất lượng chăm sóc khách hàng để mang lại hiệu quả cao nhất. Khi cần hỗ trợ trong quá trình sử dụng, Gcalls cũng xử lý rất nhanh chóng và nhiệt tình.',
    source: SOURCE,
  },
  {
    id: 'zuttoride',
    company: 'ZuttoRide',
    monogram: 'Z',
    representative: 'Ms. Trúc Phương',
    role: 'Customer Service Manager',
    quote:
      'Trong quá trình 2 năm qua, rất nhiều công ty khác đã giới thiệu dịch vụ tổng đài nhưng chị vẫn chọn Gcalls. Vì Gcalls đáp ứng đầy đủ nhu cầu đối với một tổng đài 24/7. Và chị đánh giá rất cao về khả năng hỗ trợ khách hàng của Gcalls. Gần như 24/24, lúc nào team ZuttoRide cần là Gcalls sẽ có mặt.',
    source: SOURCE,
  },
]
