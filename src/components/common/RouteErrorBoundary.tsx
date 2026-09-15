import { useRouteError } from 'react-router'
import { RotateCw } from 'lucide-react'
import { CtaButton, CtaLink } from '@/components/common/Button'
import { ROUTES } from '@/config/navigation'

/**
 * Friendly route-level error UI.
 *
 * React Router's default `errorElement` is a developer screen ("Unexpected
 * Application Error!" plus a stack trace). A visitor whose tab outlived a
 * plugin deploy — so its lazy chunk was replaced by a new build — saw exactly
 * that after 0.3.7 (`VoicebotAiPage-DIqdMIiu.js` no longer existed).
 *
 * This component replaces it everywhere in the route table:
 *  - as the layout route's `errorElement`, so header and footer never vanish;
 *  - as every lazy child route's `errorElement`, so the failure stays inside
 *    <main> with the site chrome intact.
 *
 * No stack trace, no error text from the exception; one action: reload
 * (which fetches the current build), plus a way home.
 * `src/lib/preloadRecovery.ts` already reloads once automatically for a
 * missing chunk — this boundary is what shows when that single retry did not
 * help.
 */
export function RouteErrorBoundary() {
  // Reading the error keeps React Router from logging it as unhandled; it
  // is deliberately not rendered.
  useRouteError()

  return (
    <section
      role="alert"
      aria-labelledby="route-error-heading"
      className="w-full pt-28 pb-20 sm:pt-32"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#673ab7' }}>
          Không tải được trang
        </p>
        <h1
          id="route-error-heading"
          className="mt-3 text-[28px] leading-[1.25] sm:text-4xl font-extrabold tracking-tight"
          style={{ color: '#1e2026' }}
        >
          Trang chưa tải được
        </h1>
        <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: '#5b5f6b' }}>
          Có thể website vừa được cập nhật trong lúc bạn đang mở trang này. Tải lại trang để
          nhận phiên bản mới nhất.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <CtaButton variant="primary" size="lg" fullWidth onClick={() => window.location.reload()}>
            <RotateCw size={18} aria-hidden="true" />
            Tải lại trang
          </CtaButton>
          <CtaLink to={ROUTES.home} variant="outline" size="lg" fullWidth>
            Về trang chủ
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
