/**
 * Placeholder shown while a lazily-loaded route chunk resolves.
 *
 * Reserves viewport height so the header and footer do not collapse together
 * mid-navigation.
 */
export function RouteFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" aria-live="polite" />
}
