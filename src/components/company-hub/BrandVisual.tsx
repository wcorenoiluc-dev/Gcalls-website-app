import { Database, PhoneCall, Workflow } from 'lucide-react'

/**
 * Company-hub hero brand visual: the official logo over three neutral layers.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS AND IS NOT IN HERE
 * ---------------------------------------------------------------------------
 * The logo is the official Gcalls wordmark, downloaded and served locally. The
 * homepage of gcalls.co declares this exact file as its `Organization.logo` in
 * its own schema.org JSON-LD, with width 137 and height 40 — which the fetched
 * file matches exactly. Provenance, hash and rejected candidates are recorded
 * in `docs/content-review/gcalls-company-hub-ui-v2/official-logo-manifest.json`.
 *
 * It is rendered at its intrinsic 137x40 and never larger: it is a raster, so
 * scaling it up would visibly degrade the company's own mark. It is not
 * recoloured and not redrawn.
 *
 * The three layers below it are the ones the approved hero copy already names —
 * calls, customer data, operating process. They are labels on neutral shapes:
 * no dashboard, no KPI, no metric, no stock photography of a team, and no
 * office image, since nothing here can verify an office photo is Gcalls'.
 *
 * This asset is page-local by instruction. The global header, footer and logo
 * component are out of scope for this checkpoint and are untouched.
 * ---------------------------------------------------------------------------
 */

/** The official mark's intrinsic size. Never render it larger than this. */
const LOGO = {
  src: '/images/brand/gcalls-official-logo-137x40.png',
  width: 137,
  height: 40,
  alt: 'Logo chính thức của Gcalls',
} as const

const LAYERS = [
  {
    icon: PhoneCall,
    label: 'Cuộc gọi',
    detail: 'Kênh liên hệ với khách hàng',
  },
  {
    icon: Database,
    label: 'Dữ liệu khách hàng',
    detail: 'Danh bạ, lịch sử và ngữ cảnh',
  },
  {
    icon: Workflow,
    label: 'Quy trình vận hành',
    detail: 'Cách đội ngũ xử lý công việc',
  },
] as const

export function BrandVisual() {
  return (
    <div className="rounded-[18px] border border-brand-border bg-white p-6 shadow-[0_18px_50px_rgba(103,58,183,0.10)] sm:p-8">
      <img
        src={LOGO.src}
        width={LOGO.width}
        height={LOGO.height}
        alt={LOGO.alt}
        loading="eager"
        decoding="sync"
        /* Capped at the intrinsic width so the mark is never upscaled. */
        style={{ maxWidth: `${LOGO.width}px` }}
        className="block h-auto w-full"
      />

      <p className="mt-6 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
        Ba lớp Gcalls kết nối
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {LAYERS.map((layer, i) => (
          <li key={layer.label}>
            <div className="flex items-center gap-3.5 rounded-[12px] border border-brand-border bg-brand-light/25 p-3.5">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-light text-brand"
                aria-hidden="true"
              >
                <layer.icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-snug text-foreground">
                  {layer.label}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                  {layer.detail}
                </p>
              </div>
            </div>

            {i < LAYERS.length - 1 && (
              <p
                className="py-0.5 text-center text-[12px] leading-none text-brand-border"
                aria-hidden="true"
              >
                ↓
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
