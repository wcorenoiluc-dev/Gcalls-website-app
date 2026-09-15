/**
 * One-shot recovery for a stale tab whose lazy chunk no longer exists.
 *
 * Every React Shell deploy replaces dist/ wholesale: hashed chunk names
 * change and the old files are deleted. A tab opened before the deploy still
 * holds the OLD entry bundle, whose dynamic imports point at the OLD chunk
 * names, so the next client-side navigation fails with
 * `Failed to fetch dynamically imported module` (Vite surfaces it as the
 * `vite:preloadError` window event). After 0.3.7 that rendered React
 * Router's debug screen on /voicebot-ai/.
 *
 * State machine (per build id, kept in sessionStorage so it survives the
 * reload it triggers but not a new tab):
 *
 *   [fresh] --preload error--> reload once, mark "gcalls-shell-reload:<build>"
 *   [marked] --preload error--> do NOTHING (no loop); the route error boundary
 *                               renders its friendly message instead.
 *
 * Build id = plugin version + entry file name under WordPress; outside
 * WordPress (Vite dev/preview) it is the mode + the module script src. Safe
 * to import anywhere: every access is guarded, nothing here throws.
 */

const STORAGE_PREFIX = 'gcalls-shell-reload:'

function buildId(): string {
  try {
    const cfg = (window as { __GCALLS_SHELL_CONFIG__?: { pluginVersion?: string } }).__GCALLS_SHELL_CONFIG__
    const entry = document.querySelector<HTMLScriptElement>('script[type="module"][src]')?.src ?? ''
    const entryName = entry.split('/').pop() ?? ''
    if (cfg?.pluginVersion) return `${cfg.pluginVersion}:${entryName}`
    return `${import.meta.env.MODE}:${entryName || 'inline'}`
  } catch {
    return 'unknown'
  }
}

function alreadyReloaded(id: string): boolean {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + id) === '1'
  } catch {
    return true // storage unavailable → never reload automatically
  }
}

function markReloaded(id: string): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + id, '1')
  } catch {
    /* ignore */
  }
}

function looksLikeChunkFailure(reason: unknown): boolean {
  const message =
    typeof reason === 'string'
      ? reason
      : reason && typeof reason === 'object' && 'message' in reason
        ? String((reason as { message: unknown }).message)
        : ''
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Unable to preload CSS/i.test(message)
  )
}

let recovering = false

function recover(): void {
  if (recovering) return
  const id = buildId()
  if (alreadyReloaded(id)) return // second failure for this build: let the error boundary show
  recovering = true
  markReloaded(id)
  window.location.reload()
}

export function installPreloadRecovery(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('vite:preloadError', (event) => {
    // Stop Vite from re-throwing; we decide what happens next.
    event.preventDefault()
    recover()
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (looksLikeChunkFailure(event.reason)) {
      event.preventDefault()
      recover()
    }
  })

  window.addEventListener('error', (event) => {
    if (looksLikeChunkFailure(event.error ?? event.message)) recover()
  })
}

installPreloadRecovery()
