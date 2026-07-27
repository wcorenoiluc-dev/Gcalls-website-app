/**
 * Cost estimator configuration.
 *
 * Defines which product/solution options exist and — critically — WHICH FIELDS
 * EACH ONE ASKS FOR. Only fields relevant to the selected solution are shown;
 * the estimator never asks every question for every product.
 *
 * This module describes *inputs*. Pricing itself lives in `src/data/pricing.ts`
 * and is never duplicated here. No rate, multiplier or monetary value appears
 * in this file.
 */

import { ROUTES, type RoutePath } from '@/config/navigation'

/* ------------------------------------------------------------------ *
 * Field schema
 * ------------------------------------------------------------------ */

export type FieldType = 'number' | 'select' | 'multi' | 'boolean'

export interface EstimatorField {
  id: string
  label: string
  type: FieldType
  /** Shown under the label. */
  hint?: string
  unit?: string
  /** number fields */
  min?: number
  max?: number
  defaultValue?: number
  /** select / multi fields */
  options?: Array<{ value: string; label: string }>
  /** Which step this field belongs to: 2 = scale, 3 = extra requirements. */
  step: 2 | 3
}

export interface EstimatorSolution {
  id: string
  name: string
  /** One-line use case shown on the selection card. */
  useCase: string
  /** Route for the matching product page. */
  path: RoutePath
  /** Key in src/data/pricing.ts SOLUTION_PRICING. */
  pricingId: string
  fields: EstimatorField[]
}

/* ------------------------------------------------------------------ *
 * Shared field builders — keeps labels consistent across solutions
 * ------------------------------------------------------------------ */

const agents = (hint?: string): EstimatorField => ({
  id: 'agents',
  label: 'Số lượng Agent',
  type: 'number',
  min: 1,
  max: 10000,
  defaultValue: 5,
  unit: 'người',
  hint,
  step: 2,
})

const minutes: EstimatorField = {
  id: 'minutes',
  label: 'Số phút gọi dự kiến mỗi tháng',
  type: 'number',
  min: 0,
  max: 10_000_000,
  unit: 'phút/tháng',
  hint: 'Ước lượng tương đối là đủ — có thể để trống nếu chưa rõ.',
  step: 2,
}

const hotlines: EstimatorField = {
  id: 'hotlines',
  label: 'Số hotline / đầu số',
  type: 'number',
  min: 0,
  max: 1000,
  defaultValue: 1,
  unit: 'đầu số',
  step: 2,
}

const monthlyCalls: EstimatorField = {
  id: 'monthlyCalls',
  label: 'Số cuộc gọi dự kiến mỗi tháng',
  type: 'number',
  min: 0,
  max: 10_000_000,
  unit: 'cuộc/tháng',
  step: 2,
}

/* ------------------------------------------------------------------ *
 * Solutions
 * ------------------------------------------------------------------ */

export const ESTIMATOR_SOLUTIONS: EstimatorSolution[] = [
  {
    id: 'gcalls-plus',
    name: 'Gcalls Plus Webphone',
    useCase: 'Hệ thống Webphone / Call Center tinh gọn cho Sales và CSKH.',
    path: ROUTES.gcallsPlus,
    pricingId: 'gcalls-plus',
    fields: [
      agents(),
      minutes,
      hotlines,
      {
        id: 'needsCrm',
        label: 'Có cần tích hợp CRM không?',
        type: 'boolean',
        step: 3,
      },
    ],
  },
  {
    id: 'qa-qc',
    name: 'QA QC Center',
    useCase:
      'AI hỗ trợ chuyển hội thoại thành dữ liệu phục vụ đánh giá chất lượng.',
    path: ROUTES.qcCenter,
    pricingId: 'qa-qc',
    fields: [
      agents(),
      monthlyCalls,
      {
        id: 'qaVolume',
        label: 'Số cuộc gọi cần phân tích mỗi tháng',
        type: 'number',
        min: 0,
        max: 10_000_000,
        unit: 'cuộc/tháng',
        hint: 'Phần cuộc gọi cần đưa vào quy trình đánh giá chất lượng.',
        step: 2,
      },
      {
        id: 'qaCriteria',
        label: 'Số bộ tiêu chí QA',
        type: 'number',
        min: 0,
        max: 200,
        defaultValue: 1,
        unit: 'bộ tiêu chí',
        step: 2,
      },
      {
        id: 'needsTranscript',
        label: 'Có cần transcript hội thoại không?',
        type: 'boolean',
        step: 3,
      },
      {
        id: 'needsSignals',
        label: 'Có cần phân tích từ khóa / cảm xúc không?',
        type: 'boolean',
        step: 3,
      },
    ],
  },
  {
    id: 'cx',
    name: 'Gcalls CX',
    useCase: 'Contact Center đa kênh cho quy trình chăm sóc khách hàng.',
    path: ROUTES.gcallsCx,
    pricingId: 'cx',
    fields: [
      agents(),
      {
        id: 'channels',
        label: 'Kênh cần sử dụng',
        type: 'multi',
        options: [
          { value: 'voice', label: 'Voice' },
          { value: 'zalo', label: 'Zalo' },
          { value: 'facebook', label: 'Facebook' },
          { value: 'sms', label: 'SMS' },
          { value: 'email', label: 'Email' },
        ],
        step: 2,
      },
      {
        id: 'interactions',
        label: 'Khối lượng tương tác dự kiến mỗi tháng',
        type: 'number',
        min: 0,
        max: 10_000_000,
        unit: 'tương tác/tháng',
        step: 2,
      },
      {
        id: 'needsIntegration',
        label: 'Có cần tích hợp hệ thống khác không?',
        type: 'boolean',
        step: 3,
      },
    ],
  },
  {
    id: 'crm',
    name: 'Tích hợp CRM',
    useCase: 'Kết nối cuộc gọi với dữ liệu và workflow CRM.',
    path: ROUTES.crmIntegration,
    pricingId: 'crm',
    fields: [
      {
        id: 'crmPlatform',
        label: 'CRM đang sử dụng',
        type: 'select',
        options: [
          { value: 'hubspot', label: 'HubSpot' },
          { value: 'salesforce', label: 'Salesforce' },
          { value: 'zoho', label: 'Zoho CRM' },
          { value: 'other', label: 'Khác' },
        ],
        hint: 'Khả năng kết nối cụ thể sẽ được Gcalls xác nhận theo hệ thống thực tế.',
        step: 2,
      },
      agents(),
      {
        id: 'crmNeeds',
        label: 'Nhu cầu tích hợp',
        type: 'multi',
        options: [
          { value: 'click-to-call', label: 'Click-to-Call' },
          { value: 'customer-context', label: 'Customer context' },
          { value: 'call-history', label: 'Call history' },
          { value: 'workflow', label: 'Workflow integration' },
        ],
        step: 3,
      },
    ],
  },
  {
    id: 'helpdesk',
    name: 'Tích hợp Helpdesk',
    useCase: 'Đưa cuộc gọi vào quy trình hỗ trợ và ticket.',
    path: ROUTES.helpdeskIntegration,
    pricingId: 'helpdesk',
    fields: [
      {
        id: 'helpdeskPlatform',
        label: 'Helpdesk đang sử dụng',
        type: 'select',
        options: [
          { value: 'freshdesk', label: 'Freshdesk' },
          { value: 'zendesk', label: 'Zendesk' },
          { value: 'other', label: 'Khác' },
        ],
        hint: 'Khả năng kết nối cụ thể sẽ được Gcalls xác nhận theo hệ thống thực tế.',
        step: 2,
      },
      agents(),
      {
        id: 'supportTeams',
        label: 'Số nhóm hỗ trợ',
        type: 'number',
        min: 1,
        max: 500,
        defaultValue: 1,
        unit: 'nhóm',
        step: 2,
      },
      {
        id: 'helpdeskNeeds',
        label: 'Nhu cầu kết nối',
        type: 'multi',
        options: [
          { value: 'ticket', label: 'Gắn cuộc gọi vào ticket' },
          { value: 'history', label: 'Lịch sử cuộc gọi trong hồ sơ hỗ trợ' },
        ],
        step: 3,
      },
    ],
  },
  {
    id: 'pos',
    name: 'Tích hợp POS',
    useCase: 'Kết nối cuộc gọi với dữ liệu khách hàng và bán hàng.',
    path: ROUTES.posIntegration,
    pricingId: 'pos',
    fields: [
      {
        id: 'posPlatform',
        label: 'POS / hệ thống bán hàng đang sử dụng',
        type: 'select',
        options: [
          { value: 'kiotviet', label: 'KiotViet' },
          { value: 'sapo', label: 'Sapo' },
          { value: 'haravan', label: 'Haravan' },
          { value: 'other', label: 'Khác' },
        ],
        hint: 'Khả năng kết nối cụ thể sẽ được Gcalls xác nhận theo hệ thống thực tế.',
        step: 2,
      },
      {
        id: 'locations',
        label: 'Số điểm / hệ thống cần kết nối',
        type: 'number',
        min: 1,
        max: 5000,
        defaultValue: 1,
        unit: 'điểm',
        step: 2,
      },
      agents(),
      {
        id: 'posNeeds',
        label: 'Nhu cầu dữ liệu',
        type: 'multi',
        options: [
          { value: 'customer', label: 'Dữ liệu khách hàng' },
          { value: 'order', label: 'Dữ liệu đơn hàng' },
        ],
        step: 3,
      },
    ],
  },
  {
    id: 'international',
    name: 'Tổng đài quốc tế',
    useCase: 'Đầu số và liên lạc doanh nghiệp tại các thị trường quốc tế.',
    path: ROUTES.internationalCalling,
    pricingId: 'international',
    fields: [
      {
        id: 'markets',
        label: 'Quốc gia / thị trường',
        type: 'multi',
        options: [
          { value: 'us', label: 'Mỹ' },
          { value: 'uk', label: 'Anh' },
          { value: 'sg', label: 'Singapore' },
          { value: 'au', label: 'Úc' },
          { value: 'jp', label: 'Nhật Bản' },
          { value: 'kr', label: 'Hàn Quốc' },
          { value: 'other', label: 'Thị trường khác' },
        ],
        hint: 'Cước và hồ sơ đăng ký khác nhau theo từng thị trường.',
        step: 2,
      },
      {
        id: 'intlNumbers',
        label: 'Số đầu số cần sử dụng',
        type: 'number',
        min: 1,
        max: 1000,
        defaultValue: 1,
        unit: 'đầu số',
        step: 2,
      },
      {
        id: 'intlMinutes',
        label: 'Lưu lượng gọi quốc tế dự kiến mỗi tháng',
        type: 'number',
        min: 0,
        max: 10_000_000,
        unit: 'phút/tháng',
        step: 2,
      },
      {
        id: 'intlPurpose',
        label: 'Loại nhu cầu',
        type: 'multi',
        options: [
          { value: 'local-presence', label: 'Local presence' },
          { value: 'sales', label: 'Sales' },
          { value: 'cs', label: 'Customer Service' },
          { value: 'bpo', label: 'BPO / Operations' },
        ],
        step: 3,
      },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Cost drivers, process and FAQ copy
 * ------------------------------------------------------------------ */

export const COST_DRIVERS = [
  {
    id: 'product',
    title: 'Sản phẩm',
    detail: 'Giải pháp được chọn quyết định cấu hình nền tảng cần triển khai.',
  },
  {
    id: 'agents',
    title: 'Agent',
    detail: 'Số người dùng cần truy cập hệ thống.',
  },
  {
    id: 'usage',
    title: 'Lưu lượng',
    detail: 'Phút gọi hoặc khối lượng tương tác phát sinh mỗi tháng.',
  },
  {
    id: 'numbers',
    title: 'Đầu số',
    detail: 'Loại và số lượng hotline, bao gồm cả đầu số quốc tế nếu có.',
  },
  {
    id: 'integration',
    title: 'Tích hợp',
    detail: 'Phạm vi kết nối với CRM, Helpdesk, POS hoặc hệ thống nội bộ.',
  },
  {
    id: 'modules',
    title: 'QA / Omnichannel',
    detail: 'Nhu cầu kiểm soát chất lượng và số kênh giao tiếp cần vận hành.',
  },
] as const

export const HOW_IT_WORKS = [
  { n: '01', title: 'Chọn sản phẩm', detail: 'Xác định giải pháp phù hợp với bài toán hiện tại.' },
  { n: '02', title: 'Nhập quy mô', detail: 'Cung cấp số lượng Agent và nhu cầu sử dụng dự kiến.' },
  { n: '03', title: 'Xác định cấu hình', detail: 'Xem cấu hình tham khảo và các yếu tố ảnh hưởng chi phí.' },
  { n: '04', title: 'Gcalls xác nhận và báo giá', detail: 'Đội ngũ Gcalls rà soát yêu cầu thực tế trước khi báo giá.' },
] as const

export const QUOTE_DIFFERENCES = [
  'Quốc gia và loại đầu số',
  'Lưu lượng thực tế',
  'Phạm vi tích hợp',
  'Yêu cầu dữ liệu',
  'Quy trình triển khai',
  'Cấu hình riêng',
] as const

export const ESTIMATOR_FAQ = [
  {
    q: 'Công cụ này có phải báo giá chính thức không?',
    a: 'Không. Công cụ giúp chuẩn bị cấu hình tham khảo và xác định các yếu tố ảnh hưởng chi phí. Báo giá chính thức được Gcalls xác nhận dựa trên yêu cầu thực tế.',
  },
  {
    q: 'Tôi có cần biết chính xác số phút gọi không?',
    a: 'Không bắt buộc. Bạn có thể nhập ước lượng tương đối hoặc để trống. Thông tin càng cụ thể thì cấu hình tham khảo càng sát với nhu cầu.',
  },
  {
    q: 'Có thể ước tính nhiều giải pháp không?',
    a: 'Công cụ ước tính theo từng giải pháp. Bạn có thể quay lại bước đầu để chọn giải pháp khác, hoặc ghi chú thêm nhu cầu khi gửi yêu cầu báo giá.',
  },
  {
    q: 'QA QC Center được tính dựa trên yếu tố nào?',
    a: 'Cấu hình QA QC Center có thể phụ thuộc vào quy mô đội ngũ, khối lượng hội thoại cần phân tích và bộ tiêu chí QA cần áp dụng.',
  },
  {
    q: 'Tổng đài quốc tế phụ thuộc vào yếu tố nào?',
    a: 'Chi phí phụ thuộc vào quốc gia, loại đầu số, hồ sơ đăng ký và lưu lượng sử dụng tại từng thị trường.',
  },
  {
    q: 'Khi nào tôi nhận được báo giá chính thức?',
    a: 'Sau khi bạn gửi yêu cầu kèm cấu hình tham khảo, đội ngũ Gcalls sẽ liên hệ để xác nhận phạm vi triển khai và gửi báo giá phù hợp.',
  },
]

/** Estimator step labels. Lives here so the stepper file exports only a component. */
export const ESTIMATOR_STEPS = [
  { n: 1, label: 'Chọn sản phẩm / giải pháp' },
  { n: 2, label: 'Quy mô sử dụng' },
  { n: 3, label: 'Nhu cầu bổ sung' },
  { n: 4, label: 'Kết quả' },
] as const
