/**
 * Blog registry — Checkpoint GCALLS-BLOG-BATCH-01-CORRECTION-AUTHORING.
 *
 * Metadata (`catalog.ts`) is imported eagerly: the archive, the SEO layer and
 * the router all need it synchronously, and it is small.
 *
 * Article BODIES are code-split, one chunk each. The loader map is written out
 * by hand rather than generated from a template literal so that a body file
 * missing from disk is a TYPE error at build time, not a 404 at runtime.
 */

import type { BlogArticleBody, BlogArticleMeta } from './types'

export * from './types'
export {
  BLOG_CATALOG,
  BLOG_BY_SLUG,
  BLOG_BY_ROUTE,
  BLOG_HUB_LABELS,
  BLOG_HUB_ORDER,
  BLOG_AUTHOR,
} from './catalog'
export { BLOG_CTAS, BLOG_CTA_IDS } from './ctas'
export {
  BLOG_PREVIEW_ENABLED,
  DRAFT_ROBOTS,
  VISIBLE_ARTICLES,
  blogRobots,
  isVisible,
} from './visibility'

import { BLOG_CATALOG, BLOG_BY_SLUG } from './catalog'

type BodyModule = { article: BlogArticleBody }

/**
 * Same build-time gate as `catalog.ts` — see the note on `SHIP_DRAFTS` there.
 *
 * Written inline so Vite's env substitution folds it to a literal `false` in a
 * production build. That drops `DRAFT_BODY_LOADERS`, and with it every dynamic
 * `import()` inside it, so the eighteen article bodies are not emitted as
 * chunks at all. Without this gate they ship as unreachable JavaScript that
 * still contains the full text of unpublished drafts.
 */
const SHIP_DRAFTS: boolean =
  import.meta.env.DEV || import.meta.env.VITE_BLOG_PREVIEW === 'true'

/** Bodies of published articles. Empty today — Batch 1 is entirely draft. */
const PUBLISHED_BODY_LOADERS: Record<string, () => Promise<BodyModule>> = {}

const DRAFT_BODY_LOADERS: Record<string, () => Promise<BodyModule>> = {
  '5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi': () =>
    import('./articles/5-linh-vuc-rat-can-dich-vu-call-center-trung-tam-cuoc-goi'),
  'call-center-diem-khac-biet-giua-on-premises-va-cloud-call-center-phan-1': () =>
    import('./articles/call-center-diem-khac-biet-giua-on-premises-va-cloud-call-center-phan-1'),
  '4-ly-do-su-dung-tong-dai-ao-call-center-la-can-thiet-voi-mot-doanh-nghiep': () =>
    import('./articles/4-ly-do-su-dung-tong-dai-ao-call-center-la-can-thiet-voi-mot-doanh-nghiep'),
  'tong-dai-tren-trinh-duyet-hoat-dong-the-nao': () =>
    import('./articles/tong-dai-tren-trinh-duyet-hoat-dong-the-nao'),
  'phan-mem-goi-tu-dong-va-loi-ich-doi-voi-chien-luoc-ban-hang': () =>
    import('./articles/phan-mem-goi-tu-dong-va-loi-ich-doi-voi-chien-luoc-ban-hang'),
  'checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm': () =>
    import('./articles/checklist-danh-gia-san-sang-tich-hop-tong-dai-voi-crm'),
  'dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu': () =>
    import('./articles/dong-bo-hoa-du-lieu-la-gi-tai-sao-nen-dong-bo-du-lieu'),
  'du-lieu-dong-bo-giua-tong-dai-va-helpdesk': () =>
    import('./articles/du-lieu-dong-bo-giua-tong-dai-va-helpdesk'),
  'hop-nhat-hoi-thoai-hotline-zalo-oa-va-facebook': () =>
    import('./articles/hop-nhat-hoi-thoai-hotline-zalo-oa-va-facebook'),
  'khi-nao-doanh-nghiep-can-nen-tang-da-kenh': () =>
    import('./articles/khi-nao-doanh-nghiep-can-nen-tang-da-kenh'),
  'xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi': () =>
    import('./articles/xay-dung-bo-tieu-chi-danh-gia-chat-luong-cuoc-goi'),
  'cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai': () =>
    import('./articles/cham-diem-cuoc-goi-thu-cong-va-ho-tro-bang-ai'),
  'cai-thien-trai-nghiem-khach-hang-bang-bieu-mau-cham-diem-danh-gia-cuoc-goi': () =>
    import('./articles/cai-thien-trai-nghiem-khach-hang-bang-bieu-mau-cham-diem-danh-gia-cuoc-goi'),
  'loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot': () =>
    import('./articles/loai-cuoc-goi-phu-hop-dua-vao-kich-ban-voicebot'),
  'voicebot-ivr-va-tong-dai-tu-dong-khac-nhau-the-nao': () =>
    import('./articles/voicebot-ivr-va-tong-dai-tu-dong-khac-nhau-the-nao'),
  'doanh-nghiep-can-gi-khi-goi-ra-thi-truong-nuoc-ngoai': () =>
    import('./articles/doanh-nghiep-can-gi-khi-goi-ra-thi-truong-nuoc-ngoai'),
  'ho-so-dang-ky-dau-so-quoc-te': () => import('./articles/ho-so-dang-ky-dau-so-quoc-te'),
  'tong-dai-quoc-te-mo-rong-thi-truong': () =>
    import('./articles/tong-dai-quoc-te-mo-rong-thi-truong'),
}

export const BLOG_BODY_LOADERS: Record<string, () => Promise<BodyModule>> = SHIP_DRAFTS
  ? { ...PUBLISHED_BODY_LOADERS, ...DRAFT_BODY_LOADERS }
  : PUBLISHED_BODY_LOADERS

export async function loadArticleBody(slug: string): Promise<BlogArticleBody> {
  const loader = BLOG_BODY_LOADERS[slug]
  if (!loader) throw new Error(`No blog body registered for slug "${slug}"`)

  const mod = await loader()
  if (mod.article.slug !== slug) {
    throw new Error(
      `Blog body slug mismatch: registry key "${slug}" loaded "${mod.article.slug}"`,
    )
  }
  return mod.article
}

/**
 * Related posts.
 *
 * Same hub first (that is the cluster the reader is actually in), then the same
 * funnel stage from any hub, capped at three. Only articles this build renders
 * are eligible, so a related card can never be a dead link.
 */
export function relatedArticles(
  article: BlogArticleMeta,
  pool: readonly BlogArticleMeta[],
  limit = 3,
): BlogArticleMeta[] {
  const others = pool.filter((candidate) => candidate.id !== article.id)
  const sameHub = others.filter((candidate) => candidate.hub === article.hub)
  const sameStage = others.filter(
    (candidate) =>
      candidate.hub !== article.hub && candidate.funnelStage === article.funnelStage,
  )
  const rest = others.filter(
    (candidate) => !sameHub.includes(candidate) && !sameStage.includes(candidate),
  )

  return [...sameHub, ...sameStage, ...rest].slice(0, limit)
}

export function articleBySlug(slug: string): BlogArticleMeta | undefined {
  return BLOG_BY_SLUG[slug]
}

export function articleCount(): number {
  return BLOG_CATALOG.length
}
