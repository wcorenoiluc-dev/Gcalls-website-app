=== Gcalls Core ===
Contributors: gcalls
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.4.0
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
