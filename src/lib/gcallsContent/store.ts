import type { PreviewFocusMessage, PreviewReadyMessage, PreviewUpdateMessage } from './types';

type Listener = () => void;

/**
 * Module-level store for live preview overrides received from the Content
 * Studio admin screen via postMessage. Deliberately not a React context —
 * this needs to exist before any component mounts (the listener attaches
 * once, at import time) and be readable by any component via
 * `useSyncExternalStore`, without every route wrapping its tree in a
 * provider it will almost never use outside of preview.
 */
class PreviewStore {
  private overrides = new Map<string, Record<string, unknown>>();
  private listeners = new Set<Listener>();

  private key(route: string, section: string): string {
    return `${route}::${section}`;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (route: string, section: string): Record<string, unknown> | undefined => {
    return this.overrides.get(this.key(route, section));
  };

  private set(route: string, section: string, fields: Record<string, unknown>): void {
    this.overrides.set(this.key(route, section), fields);
    this.listeners.forEach((l) => l());
  }

  /** Exposed for tests only. */
  __setForTest(route: string, section: string, fields: Record<string, unknown>): void {
    this.set(route, section, fields);
  }

  /** True only inside the same-origin preview iframe opened by the admin screen. */
  private inPreviewFrame(): boolean {
    if (typeof window === 'undefined') return false;
    const cfg = window.__GCALLS_SHELL_CONFIG__;
    return !!cfg?.gcallsContent?.previewMode && window !== window.parent;
  }

  /** Scrolls a section into view and outlines it briefly (contract §4 `preview-focus`). */
  private focus(selector: string | undefined): void {
    if (!selector || typeof document === 'undefined') return;
    let el: Element | null = null;
    try {
      el = document.querySelector(selector);
    } catch {
      return; // A malformed selector is a data problem, never a crash.
    }
    if (!(el instanceof HTMLElement)) return;
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    const previousOutline = el.style.outline;
    const previousOffset = el.style.outlineOffset;
    el.style.outline = '3px solid rgba(103,58,183,0.6)';
    el.style.outlineOffset = '-3px';
    window.setTimeout(() => {
      el.style.outline = previousOutline;
      el.style.outlineOffset = previousOffset;
    }, 1200);
  }

  /** Tells the admin screen the route has mounted so it can push the current draft. */
  private announceReady(): void {
    if (!this.inPreviewFrame()) return;
    const route = window.__GCALLS_SHELL_CONFIG__?.routePath ?? window.location.pathname;
    const message: PreviewReadyMessage = { source: 'gcalls-react-shell', type: 'preview-ready', route };
    window.parent.postMessage(message, window.location.origin);
  }

  attachListener(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('message', (event: MessageEvent) => {
      // Same-origin only. The preview iframe and wp-admin are required to
      // share an origin (see Preview::render() on the plugin side) so this
      // is a real security boundary, not a formality.
      if (event.origin !== window.location.origin) return;

      // When this app is running inside the preview iframe, the only
      // legitimate sender is its own parent frame (the Content Studio
      // editor screen) — checking `event.source` too means a same-origin
      // but unrelated window (e.g. another tab a visitor has open) can't
      // spoof a preview update just by matching the origin string.
      if (window !== window.parent && event.source !== window.parent) return;

      const data = event.data as
        | (Partial<Omit<PreviewUpdateMessage, 'type'>> & Partial<Omit<PreviewFocusMessage, 'type'>> & { type?: string })
        | undefined;
      if (!data || data.source !== 'gcalls-content-studio') return;

      if (data.type === 'preview-focus') {
        if (typeof data.selector === 'string') this.focus(data.selector);
        return;
      }

      if (data.type !== 'preview-update') return;
      if (typeof data.route !== 'string' || typeof data.section !== 'string' || typeof data.fields !== 'object' || data.fields === null) {
        return;
      }
      this.set(data.route, data.section, data.fields as Record<string, unknown>);
    });

    // `preview-ready` once the document has painted its first frame. The
    // route's React tree mounts synchronously on module load, so the next
    // frame is the earliest moment the admin can safely push a draft.
    if (this.inPreviewFrame()) {
      const announce = () => window.requestAnimationFrame(() => this.announceReady());
      if (document.readyState === 'complete') announce();
      else window.addEventListener('load', announce, { once: true });
    }
  }
}

export const previewStore = new PreviewStore();
previewStore.attachListener();
