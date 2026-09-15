import { ROUTES } from '@/config/navigation'
import {
  QQ_BENEFITS,
  QQ_BOUNDARIES,
  QQ_CAPABILITIES,
  QQ_DASHBOARD,
  QQ_DIRECT_ANSWER,
  QQ_FAQ,
  QQ_FINAL_CTA,
  QQ_HERO,
  QQ_HOW_IT_WORKS,
  QQ_HUMAN_LOOP,
  QQ_INTEGRATION,
  QQ_OVERVIEW,
  QQ_PRICING,
  QQ_PROBLEMS,
  QQ_SCORING,
  QQ_SIGNALS,
  QQ_STORY,
  QQ_USE_CASES,
} from '@/data/qaQcCenter'
import type { SectionDef } from '../types'

/** `/qc-bot-ai/` — every section, in page order; defaults reference src/data/qaQcCenter.ts. */
export const QC_BOT_AI_ROUTE = ROUTES.qcCenter

export const QC_BOT_AI_SECTIONS: SectionDef[] = [
  { key: 'hero', label: 'Hero', previewSelector: 'main > section:first-of-type', defaults: QQ_HERO },
  { key: 'directAnswer', label: 'Định nghĩa (Direct answer)', previewSelector: 'section[aria-labelledby="qa-qc-la-gi"]', defaults: QQ_DIRECT_ANSWER },
  { key: 'problems', label: 'Bài toán QA', previewSelector: 'section[aria-labelledby="bai-toan-qa"]', defaults: QQ_PROBLEMS, fields: { items: { type: 'cards' } } },
  { key: 'overview', label: 'Tổng quan', previewSelector: 'section[aria-labelledby="tong-quan-qa-qc"]', defaults: QQ_OVERVIEW },
  { key: 'howItWorks', label: 'Cách hoạt động', previewSelector: 'section[aria-labelledby="cach-hoat-dong-heading"]', defaults: QQ_HOW_IT_WORKS, fields: { steps: { type: 'cards' } } },
  { key: 'capabilities', label: 'Năng lực AI', previewSelector: 'section[aria-labelledby="nang-luc-ai"]', defaults: QQ_CAPABILITIES, fields: { items: { type: 'cards' } } },
  { key: 'scoring', label: 'QA Scoring', previewSelector: 'section[aria-labelledby="qa-scoring"]', defaults: QQ_SCORING },
  { key: 'signals', label: 'Conversation signals', previewSelector: 'section[aria-labelledby="conversation-signals"]', defaults: QQ_SIGNALS },
  { key: 'humanLoop', label: 'AI + con người', previewSelector: 'section[aria-labelledby="ai-human-qa"]', defaults: QQ_HUMAN_LOOP, fields: { roles: { type: 'cards' } } },
  { key: 'dashboard', label: 'Quality dashboard', previewSelector: 'section[aria-labelledby="quality-dashboard"]', defaults: QQ_DASHBOARD },
  { key: 'benefits', label: 'Giá trị vận hành', previewSelector: 'section[aria-labelledby="gia-tri-van-hanh"]', defaults: QQ_BENEFITS, fields: { items: { type: 'cards' } } },
  { key: 'useCases', label: 'Tình huống sử dụng', previewSelector: 'section[aria-labelledby="tinh-huong-su-dung"]', defaults: QQ_USE_CASES, fields: { items: { type: 'cards' } } },
  { key: 'integration', label: 'Kết nối dữ liệu', previewSelector: 'section[aria-labelledby="ket-noi-du-lieu"]', defaults: QQ_INTEGRATION },
  { key: 'boundaries', label: 'Chọn sản phẩm', previewSelector: 'section[aria-labelledby="chon-san-pham"]', defaults: QQ_BOUNDARIES, fields: { items: { type: 'cards' } } },
  { key: 'story', label: 'Quy trình QA', previewSelector: 'section[aria-labelledby="quy-trinh-qa"]', defaults: QQ_STORY },
  { key: 'pricing', label: 'Cấu hình chi phí', previewSelector: 'section[aria-labelledby="cau-hinh-chi-phi"]', defaults: QQ_PRICING },
  { key: 'faq', label: 'FAQ', previewSelector: 'section[aria-labelledby="faq-qa-qc"]', defaults: { items: QQ_FAQ },
    fields: { items: { type: 'repeater', label: 'Câu hỏi thường gặp', item: { q: { label: 'Câu hỏi', maxLen: 240 }, a: { type: 'textarea', label: 'Câu trả lời', maxLen: 1200 } } } } },
  { key: 'finalCta', label: 'CTA cuối trang', previewSelector: 'section[aria-labelledby="cta-qa-qc"]', defaults: QQ_FINAL_CTA },
]
