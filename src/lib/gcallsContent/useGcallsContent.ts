import { useSyncExternalStore } from 'react';
import { previewStore } from './store';

/**
 * Copies only the keys `defaults` already declares, and only when the
 * incoming value has the same shape as the default (same JS type; arrays
 * checked element-by-element for plain strings). Anything else — an unknown
 * key, a type mismatch, a malformed nested object — falls back to the
 * default silently. This is what "merge only valid published overrides,
 * ignore unknown fields, fall back to defaults if invalid" means in code:
 * WordPress content can only ever narrow toward the shape the component
 * already renders, never introduce a new shape (e.g. raw HTML) the
 * component wasn't built to handle.
 */
function mergeKnown<T extends Record<string, unknown>>(defaults: T, source: unknown): T {
  if (!source || typeof source !== 'object') return defaults;
  const merged = { ...defaults };
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    if (!(key in (source as object))) continue;
    const incoming = (source as Record<string, unknown>)[key as string];
    const fallback = defaults[key];

    if (typeof fallback === 'boolean' && typeof incoming === 'boolean') {
      merged[key] = incoming as T[typeof key];
    } else if (typeof fallback === 'string' && typeof incoming === 'string') {
      merged[key] = incoming as T[typeof key];
    } else if (Array.isArray(fallback) && Array.isArray(incoming) && incoming.every((v) => typeof v === 'string')) {
      merged[key] = incoming as T[typeof key];
    } else if (fallback === null && incoming === null) {
      merged[key] = incoming as T[typeof key];
    } else if (
      fallback !== null &&
      typeof fallback === 'object' &&
      !Array.isArray(fallback) &&
      incoming !== null &&
      typeof incoming === 'object' &&
      !Array.isArray(incoming)
    ) {
      // Shallow object fields (e.g. heroImage): only accept it if every key
      // the default declares is present with a matching primitive type.
      const fallbackObj = fallback as Record<string, unknown>;
      const incomingObj = incoming as Record<string, unknown>;
      const validShape = Object.keys(fallbackObj).every((k) => typeof incomingObj[k] === typeof fallbackObj[k]);
      if (validShape) {
        merged[key] = incomingObj as T[typeof key];
      }
    }
    // Any other mismatch: keep the default already copied into `merged`.
  }
  return merged;
}

/**
 * The React content adapter. Layers, lowest to highest precedence:
 *   1. `defaults`      — the source-controlled React default, always valid.
 *   2. published WP    — `window.GCALLS_WP.publishedContent`, when present.
 *   3. live preview     — unsaved field values from the Content Studio
 *                         admin screen, received over postMessage.
 *
 * Layer 3 only ever applies for the route/section the admin screen is
 * currently editing (`window.GCALLS_WP.previewMode` + `previewSection`),
 * and only inside the same-origin preview iframe — never for a logged-out
 * visitor on the public site.
 */
export function useGcallsContent<T extends Record<string, unknown>>(route: string, section: string, defaults: T): T {
  const shellConfig = typeof window !== 'undefined' ? window.__GCALLS_SHELL_CONFIG__ : undefined;
  const bootstrap = shellConfig?.routePath === route ? shellConfig.gcallsContent : undefined;

  const publishedRaw = bootstrap?.publishedContent?.sections?.[section];
  const publishedContent = mergeKnown(defaults, publishedRaw);

  const isPreviewTarget = !!bootstrap?.previewMode && bootstrap.previewSection === section;

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
