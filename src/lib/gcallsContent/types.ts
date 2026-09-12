/**
 * Shared shape between this app and the Gcalls Content Studio WordPress
 * plugin (wordpress/wp-content/plugins/gcalls-content-studio). Field keys
 * here must match `Schema::hero_fields()` in that plugin's
 * `includes/class-schema.php` exactly — that PHP file is the source of
 * truth for what is editable; this file only mirrors its shape for the
 * adapter to type-check against.
 *
 * Content Studio never injects its own top-level `window` global. It
 * contributes a `gcallsContent` key to `window.__GCALLS_SHELL_CONFIG__`,
 * the bootstrap object Gcalls React Shell (a separate WordPress plugin)
 * already sets — via the `gcalls_react_shell_config` filter, applied in
 * `Gcalls_React_Shell::render_root_html()`. That keeps the dependency
 * one-directional: React Shell has no idea Content Studio exists, and this
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

/** Every route/section pair Content Studio can currently publish for. Add an entry here (and its PHP counterpart) before wiring a new section into the adapter. */
export interface GcallsSectionContentMap {
  '/': {
    hero: HomeHeroContent;
  };
}

export type GcallsRoute = keyof GcallsSectionContentMap;
export type GcallsSection<R extends GcallsRoute> = keyof GcallsSectionContentMap[R];

/** Published (or, in preview, draft) content for one route, keyed by section. Unknown keys are ignored by the adapter, never trusted. */
export type PublishedRouteContent = {
  sections: Partial<Record<string, Record<string, unknown>>>;
};

export interface GcallsContentBootstrap {
  restUrl: string;
  nonce: string | null;
  publishedContent: PublishedRouteContent;
  previewMode: boolean;
  previewSection?: string;
  schemaVersion: number;
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

declare global {
  interface Window {
    __GCALLS_SHELL_CONFIG__?: GcallsShellConfig;
  }
}
