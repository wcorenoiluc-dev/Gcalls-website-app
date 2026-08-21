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

## Status — checkpoint 003A

`gcalls-hero-section.json` is the only template here: one section proving the
kit, the container width and the button style land correctly. The 38 page
layouts are built in 003B, against the live site, not authored blind here.
