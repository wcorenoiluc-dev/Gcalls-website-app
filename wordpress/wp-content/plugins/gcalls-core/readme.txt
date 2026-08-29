=== Gcalls Core ===
Contributors: gcalls
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.9.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Site behaviour for the Gcalls website that must survive a theme change.

== Description ==

Gcalls Core holds the parts of the Gcalls site that are not presentation:

* the `gcalls_hub` taxonomy — seven editorial hubs with stable IDs, so the
  import pipeline has a key that survives an editorial rename;
* FAQ storage and FAQPage structured data, from one source of truth so the
  visible accordion and the schema cannot disagree;
* breadcrumbs, with BreadcrumbList JSON-LD emitted only when Rank Math is not
  already emitting it;
* the legacy route map, applied on 404, including 410 Gone for retired URLs;
* `wp gcalls import`, an idempotent content importer with dry-run and rollback.

It deliberately writes no meta title, meta description, canonical or Open Graph
tag. Rank Math owns the document head. This plugin only feeds Rank Math's own
post meta so migrated values stay editable in the Rank Math UI.

== Changelog ==

= 0.6.0 =
* Mockups: the seven interactive visuals from the React home page, ported as
  semantic HTML with real buttons — tabs, selectable lists, a playback bar and a
  call timer. Reduced-motion and hidden-tab aware; nothing animated touches page
  flow.
* Mockups: three demo product visuals for Gcalls CX, Voicebot and QC Bot AI,
  authorised by the 007 addendum. Data is invented and labelled as such.

= 0.5.0 =
* Shortcode: [gcalls_product_page] renders a full product page — hero, sections,
  cards, FAQ and CTA — from content generated out of the React data files.
* Shortcode: [gcalls_diagram] draws brand SVG diagrams for Gcalls CX, Voicebot
  and QA/QC, which have no approved screenshots. A Gcalls Plus screenshot is
  never shown under another product's name.
* Redirects: the request path is no longer passed through sanitize_text_field(),
  which strips percent-encoding and made four Cyrillic spam URLs answer 404
  where the map says 410.
* Redirects: a target that is not a path is refused. The URL plan carries
  "(primary is draft — slug TBD)" for two rows, and that had become a live 301
  into a page that does not exist.

= 0.4.3 =
* Fix: validation demanded a front page and a posts page of every manifest,
  including one that carries no pages at all. That refused the full blog corpus
  — articles and redirects only — for lacking something it never claimed to
  have. The rule now applies only when the manifest carries pages.

= 0.4.2 =
* Fix: a page matched by ROLE — the existing front page or posts page — was
  skipped and never got its route meta, so pass two could not find it again and
  Settings > Reading was never applied. Identity meta is derived data and is now
  written on the skip path too.

= 0.4.1 =
* Fix: the import screen could not read a manifest inside a package directory.
  sanitize_file_name() was applied to the whole submitted value, which strips
  the directory separator, so `gcalls-content/content-manifest.json` arrived as
  one impossible filename. Sanitising happens per path segment now.

= 0.4.0 =
* Admin: upload a packaged .zip straight from the import screen. The import
  directory is unreachable from wp-admin otherwise — the Media Library rewrites
  the path and refuses .json — so on a host with no SFTP there was no way in.
  Extracted members are re-checked for traversal and file type.
* Shortcode: [gcalls_estimator], the cost estimator ported from React. It shows
  no price, because no rate table has been approved; the gate is carried over
  rather than dropped.

= 0.3.0 =
* Taxonomy: all thirteen editorial hubs registered, not the seven Batch 1 used.
  163 corpus posts belong to HUB-04, 05, 10 and 11 and would have imported with
  no hub at all.
* Import: preserves the original publication date.
* Import: keeps the legacy author, featured-image id, categories and editorial
  decision as post meta. It creates no users and resolves no attachments.
* Import: a manifest with no redirects leaves the stored map alone instead of
  clearing it.

= 0.2.0 =
* Import: page hierarchy (post_parent), page template, front page and posts page.
* Import: refuses to run when the manifest's hierarchy would change a published
  URL, instead of half-applying it.
* Import: media library, matched by manifest id so templates stay portable.
* Import: builds the header and footer navigation menus.
* Import: never overwrites a body edited in WordPress without an explicit flag.
* Admin: Tools > Gcalls Import — capability, nonce and confirmation checked.
* Shortcodes: [gcalls_faq], [gcalls_cta] with lead attribution, [gcalls_media],
  and a fail-closed [gcalls_lead_form].
* Hardening: unchanged from 0.1.0, including the author-enumeration block.

= 0.1.0 =
* Foundation: taxonomy, FAQ, breadcrumbs, redirect map, import pipeline.
