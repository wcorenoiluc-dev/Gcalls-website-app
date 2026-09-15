/**
 * Runtime shape of the Gcalls Content Studio payload the React Shell reads.
 * Mirrors docs/content-studio/CONTRACT-0.2.0.md §3–§4.
 *
 * Content Studio never injects its own top-level `window` global. It
 * contributes a `gcallsContent` key to `window.__GCALLS_SHELL_CONFIG__`, the
 * bootstrap object Gcalls React Shell (a separate WordPress plugin) already
 * sets — via the `gcalls_react_shell_config` filter, applied in
 * `Gcalls_React_Shell::render_root_html()`. That keeps the dependency
 * one-directional: React Shell has no idea Content Studio exists, and the
 * adapter degrades to `defaults` whenever `gcallsContent` is absent —
 * outside WordPress entirely, with React Shell active but Content Studio
 * deactivated, or with neither plugin present at all.
 */

export interface HeroImage {
  id: number;
  url: string;
  width: number;
  height: number;
}

export interface HomeHeroContent {
  enabled: boolean;
  badgeText: string;
  heading: string;
  headingHighlight: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  checklist: string[];
  heroImage: HeroImage | null;
  heroImageAlt: string;
  heroImageDecorative: boolean;
  disclaimerText: string;
}

/** Published (or, in preview, draft) content for one route, keyed by section. Unknown keys are ignored by the adapter, never trusted. */
export type PublishedRouteContent = {
  sections: Partial<Record<string, Record<string, unknown>>>;
};

export interface GcallsSeoOverride {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { id: number; url: string } | null;
  noindex?: boolean;
}

export interface GcallsContentBootstrap {
  restUrl: string;
  nonce: string | null;
  schemaVersion: number;
  version?: number;
  publishedContent: PublishedRouteContent;
  seo?: GcallsSeoOverride;
  previewMode: boolean;
  previewSection?: string;
  previewRevision?: number;
}

/** The bootstrap object Gcalls React Shell sets on every route it renders. `routePath` is React Shell's own key, reused here instead of duplicating it inside `gcallsContent`. */
export interface GcallsShellConfig {
  routePath: string;
  routeKey: string;
  gcallsContent?: GcallsContentBootstrap;
}

export interface PreviewUpdateMessage {
  source: 'gcalls-content-studio';
  type: 'preview-update';
  route: string;
  section: string;
  fields: Record<string, unknown>;
}

export interface PreviewFocusMessage {
  source: 'gcalls-content-studio';
  type: 'preview-focus';
  route: string;
  section: string;
  /** CSS selector from the manifest (`previewSelector`); the admin sends it so the bundle need not embed the manifest. */
  selector?: string;
}

export interface PreviewReadyMessage {
  source: 'gcalls-react-shell';
  type: 'preview-ready';
  route: string;
}

declare global {
  interface Window {
    __GCALLS_SHELL_CONFIG__?: GcallsShellConfig;
  }
}
