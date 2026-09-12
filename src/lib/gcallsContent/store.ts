import type { PreviewUpdateMessage } from './types';

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

      const data = event.data as Partial<PreviewUpdateMessage> | undefined;
      if (!data || data.source !== 'gcalls-content-studio' || data.type !== 'preview-update') return;
      if (typeof data.route !== 'string' || typeof data.section !== 'string' || typeof data.fields !== 'object' || data.fields === null) {
        return;
      }
      this.set(data.route, data.section, data.fields as Record<string, unknown>);
    });
  }
}

export const previewStore = new PreviewStore();
previewStore.attachListener();
