# Elementor templates

Section templates exported from Elementor, kept in Git so a page layout is
reviewable and reproducible instead of existing only inside one database.

## Format

An Elementor export is a JSON envelope:

```json
{ "version": "0.4", "title": "...", "type": "section", "content": [ ... ] }
```

`type` is `section`, `container`, `page` or `popup`. `content` holds the
element tree exactly as Elementor stores it in `_elementor_data`.

## Importing

Templates → Saved Templates → Import Templates, or:

```
wp elementor library import wordpress/elementor-templates/<file>.json
```

## Rules

- **Colours and fonts come from the Gcalls kit, not from per-widget values.**
  A hardcoded `#673ab7` inside a widget stops responding to a brand change and
  will be missed at the next rebrand. Where a value must be inline it matches
  `wp-content/themes/gcalls-theme/assets/css/theme.css`.
- **No Elementor Pro widgets.** The handover has no Pro licence. A template
  using a Pro widget imports as a blank box on a Free install, which is worse
  than not shipping it.
- **Posts are not built in Elementor.** These templates are for Pages only —
  see `inc/elementor.php` in the theme for why.
- Re-export after editing in the UI; hand-editing the JSON is possible but the
  IDs are positional and easy to break.

## Generated templates

`gcalls-homepage.json` is **generated**, not exported from Elementor. Edit
`wordpress/scripts/build-homepage-template.mjs` and run `npm run wp:homepage`;
do not hand-edit the JSON, and re-generate rather than re-exporting after a UI
edit unless you intend the UI to become the source.

The reason is reviewability. An Elementor export is a few thousand lines of
nested settings with positional ids: a diff of one changed sentence shows a
hundred changed ids and hides the sentence. The generator's diff is the
sentence. Ids are derived from a counter, so re-running produces a
byte-identical file.

### Images in a generated template

Product screenshots are placed with `[gcalls_media id="GP-09"]`, never with an
Elementor image widget. An image widget stores an attachment ID and an uploads
URL, and both are specific to the site the template was exported from — imported
anywhere else it renders a broken image, or whatever attachment now holds that
ID. The shortcode resolves the attachment by its manifest id at render time, so
the template carries no environment-specific value at all. See
`class-shortcodes.php`.

## Status — checkpoint 003B P0

| File | What it is |
| --- | --- |
| `gcalls-hero-section.json` | 003A. One section proving the kit, container width and button style. |
| `gcalls-homepage.json` | 003B P0. The full home page, 15 sections, generated. Elementor Free widgets only. |

The remaining 37 page layouts are not built yet. `docs/INVENTORY_003B_SECTION_MAPPING.md`
holds the section-by-section mapping and the build order they follow.
