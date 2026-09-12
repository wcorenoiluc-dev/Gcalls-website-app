import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'

/**
 * Under the normal domain build this is served from `public/` at the site
 * root. Under the gcalls-react-shell WordPress plugin the app is mounted
 * from `wp-content/plugins/gcalls-react-shell/dist/`, so a root-absolute
 * `/brand/...` path would 404 — the plugin build copies `public/brand` into
 * its own `dist/brand/` and publishes the resulting URL at runtime via
 * `window.__GCALLS_SHELL_CONFIG__.assetsUrl` (see src/data/productImages.ts
 * for the same pattern applied to product screenshots).
 */
const SHELL_ASSETS_URL =
  typeof window !== 'undefined'
    ? (window as { __GCALLS_SHELL_CONFIG__?: { assetsUrl?: string } }).__GCALLS_SHELL_CONFIG__
        ?.assetsUrl
    : undefined

const LOGO_SRC = SHELL_ASSETS_URL
  ? `${SHELL_ASSETS_URL.replace(/\/$/, '')}/brand/gcalls-logo-primary.png`
  : '/brand/gcalls-logo-primary.png'
const LOGO_NATURAL_WIDTH = 389
const LOGO_NATURAL_HEIGHT = 129

type GcallsLogoVariant = 'header' | 'footer'

const VARIANT_WIDTH_CLASSES: Record<GcallsLogoVariant, string> = {
  // Mobile width first, desktop (md+) width second — both within the
  // approved ranges (header 118–130 / 137–150, footer 125–140 / 145–160).
  header: 'w-[124px] md:w-[143px]',
  footer: 'w-[132px] md:w-[152px]',
}

export function GcallsLogo({
  variant = 'header',
  src = LOGO_SRC,
}: {
  variant?: GcallsLogoVariant
  /** Content Studio override; falls back to the default asset on load failure. */
  src?: string
}) {
  return (
    <Link
      to={ROUTES.home}
      className="inline-flex items-center min-h-11 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#673ab7]"
      aria-label="Gcalls — về trang chủ"
    >
      <img
        src={src}
        alt="Gcalls"
        width={LOGO_NATURAL_WIDTH}
        height={LOGO_NATURAL_HEIGHT}
        className={`${VARIANT_WIDTH_CLASSES[variant]} h-auto object-contain`}
        onError={(event) => {
          const img = event.currentTarget
          if (img.src.endsWith(LOGO_SRC)) return
          img.src = LOGO_SRC
        }}
      />
    </Link>
  )
}
