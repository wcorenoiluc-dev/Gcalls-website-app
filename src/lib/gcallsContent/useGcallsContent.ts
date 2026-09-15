import { useSyncExternalStore } from 'react';
import { previewStore } from './store';

/**
 * Shape-guided merge: copies only the keys `defaults` already declares, and
 * only when the incoming value has the same shape as the default. Anything
 * else — an unknown key, a type mismatch, a malformed nested object — falls
 * back to the default silently. WordPress content can only ever narrow
 * toward the shape the component already renders, never introduce a new
 * shape (e.g. raw HTML) the component wasn't built to handle.
 *
 * Rules, per value kind of the DEFAULT:
 *   boolean / string      → accepted when the incoming primitive has the same type
 *   null (image slot)     → accepts null or a `{id,url,width,height}` image object
 *   string[]              → accepted when every incoming element is a string
 *   object[]              → each incoming item is merged over the default item
 *                           at the same index (or the first default item when
 *                           the list grew), with this same shape check — so a
 *                           nested list the CMS never sends (PHP drops nested
 *                           list types by contract) keeps the default's value
 *   plain object          → merged recursively
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isImage(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    typeof value.id === 'number' &&
    typeof value.url === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
  );
}

function mergeValue(fallback: unknown, incoming: unknown): unknown {
  if (typeof fallback === 'boolean') return typeof incoming === 'boolean' ? incoming : fallback;
  if (typeof fallback === 'string') return typeof incoming === 'string' ? incoming : fallback;
  if (typeof fallback === 'number') return typeof incoming === 'number' && Number.isFinite(incoming) ? incoming : fallback;
  if (fallback === null) return incoming === null || isImage(incoming) ? incoming : fallback;
  if (isImage(fallback)) return incoming === null || isImage(incoming) ? incoming : fallback;

  if (Array.isArray(fallback)) {
    if (!Array.isArray(incoming)) return fallback;
    if (fallback.every((v) => typeof v === 'string')) {
      return incoming.every((v) => typeof v === 'string') ? incoming : fallback;
    }
    if (fallback.length > 0 && fallback.every(isPlainObject)) {
      if (!incoming.every(isPlainObject)) return fallback;
      const first = fallback[0] as Record<string, unknown>;
      return incoming.map((item, index) => {
        const template = (fallback[index] as Record<string, unknown> | undefined) ?? first;
        return mergeKnown(template, item);
      });
    }
    return fallback;
  }

  if (isPlainObject(fallback)) {
    return isPlainObject(incoming) ? mergeKnown(fallback, incoming) : fallback;
  }

  return fallback;
}

export function mergeKnown<T extends object>(defaults: T, source: unknown): T {
  if (!isPlainObject(source)) return defaults;
  const merged: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const key of Object.keys(defaults as Record<string, unknown>)) {
    if (!(key in source)) continue;
    merged[key] = mergeValue((defaults as Record<string, unknown>)[key], source[key]);
  }
  return merged as T;
}

/**
 * The React content adapter. Layers, lowest to highest precedence:
 *   1. `defaults`      — the source-controlled React default, always valid.
 *   2. published WP    — `window.__GCALLS_SHELL_CONFIG__.gcallsContent.publishedContent`,
 *                        for the current route only, when present.
 *   3. live preview     — unsaved field values from the Content Studio
 *                         admin screen, received over postMessage.
 *
 * Layer 3 only ever applies inside the same-origin preview iframe
 * (`previewMode`), never for a logged-out visitor on the public site.
 * Nothing here can throw: a missing or malformed bootstrap yields
 * `defaults` unchanged, so the page never blanks and the chrome never goes.
 *
 * `route` is the React path (e.g. `ROUTES.gcallsPlus`), `section` the
 * manifest section key. `defaults` may be a readonly `as const` object; the
 * returned value has the same static type.
 */
export function useGcallsContent<T extends object>(route: string, section: string, defaults: T): T {
  const shellConfig = typeof window !== 'undefined' ? window.__GCALLS_SHELL_CONFIG__ : undefined;
  const bootstrap = shellConfig?.routePath === route ? shellConfig.gcallsContent : undefined;

  const publishedRaw = bootstrap?.publishedContent?.sections?.[section];
  const publishedContent = mergeKnown(defaults, publishedRaw);

  const isPreviewTarget = !!bootstrap?.previewMode;

  const previewOverride = useSyncExternalStore(
    previewStore.subscribe,
    () => (isPreviewTarget ? previewStore.getSnapshot(route, section) : undefined),
    () => undefined
  );

  if (!isPreviewTarget || !previewOverride) {
    return publishedContent;
  }

  return mergeKnown(publishedContent, previewOverride);
}
