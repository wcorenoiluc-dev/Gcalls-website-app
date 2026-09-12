/**
 * Text color tokens for content rendered directly on a dark/purple section
 * background (e.g. the `#673ab7 → #4c1d95` gradient bands used across the
 * homepage and pricing CTAs).
 *
 * Why this exists: WordPress core's global-styles output injects an
 * unlayered `h1,h2,h3,h4,h5,h6{color:var(--wp--preset--color--foreground)}`
 * rule into `wp_head()`. Per the CSS Cascade Layers spec, any unlayered
 * style beats a layered one regardless of specificity — and Tailwind v4's
 * utilities (including `.text-white`) compile into `@layer utilities`. So a
 * heading styled only via a `text-white` className silently loses that fight
 * and renders in WordPress's dark foreground color instead, while sibling
 * text using an inline `style` color (which always wins over any stylesheet
 * rule) renders correctly. Headings in a dark section must therefore set
 * color via inline `style`, never via a Tailwind color className — use these
 * tokens rather than repeating hex/rgba literals per component.
 */
export const darkSection = {
  /** Primary headings (h1–h4) directly on the dark background. */
  heading: '#FFFFFF',
  /** Emphasized span inside a heading that needs a hint of tint instead of flat white. */
  headingAccent: '#F0E8FF',
  /** Body paragraphs. */
  body: 'rgba(255,255,255,0.82)',
  /** List item text. */
  list: 'rgba(255,255,255,0.90)',
  /** Eyebrow / pill badge text. */
  badge: '#FFFFFF',
  /** Secondary captions and de-emphasized notes. */
  caption: 'rgba(255,255,255,0.72)',
  /** Icons and check marks. */
  icon: '#FFFFFF',
} as const;
