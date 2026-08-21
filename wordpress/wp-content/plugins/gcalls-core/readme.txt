=== Gcalls Core ===
Contributors: gcalls
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.1.0
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

= 0.1.0 =
* Foundation: taxonomy, FAQ, breadcrumbs, redirect map, import pipeline.
