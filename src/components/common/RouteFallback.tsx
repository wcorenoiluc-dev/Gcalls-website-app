/**
 * Placeholder shown while a lazily-loaded route chunk resolves.
 *
 * Reserves a full viewport of height so the footer starts below the fold
 * while the chunk loads; when the page content replaces the placeholder the
 * footer therefore moves off-screen → off-screen, which is not a visible
 * layout shift. (At 70vh the footer was visible during loading and every
 * lazy route scored CLS ≈ 0.30 from that one footer jump.)
 */
export function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" aria-live="polite" />
}
