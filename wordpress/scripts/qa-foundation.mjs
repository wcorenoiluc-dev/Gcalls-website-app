#!/usr/bin/env node
/**
 * Checkpoint 003A §K — foundation QA that can run WITHOUT the hosting.
 *
 * Everything here checks the source in this repository. The checks that need a
 * running WordPress — theme activation, plugin activation, the Elementor
 * editor, permalinks, the HTTPS and www redirects, Site Health — are listed at
 * the end as explicitly NOT RUN rather than silently skipped, because a QA
 * report that hides its own gaps is worse than no report.
 *
 * Usage: node wordpress/scripts/qa-foundation.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')
const THEME = path.join(WP, 'wp-content/themes/gcalls-theme')
const PLUGIN = path.join(WP, 'wp-content/plugins/gcalls-core')

const failures = []
const notes = []

const check = (label, condition, detail = '') => {
  if (condition) console.log(`  ok   ${label}`)
  else {
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
    failures.push(label)
  }
}

const read = (file) => fs.readFileSync(file, 'utf8')
const exists = (file) => fs.existsSync(file)

console.log('QA FOUNDATION — GCALLS-WORDPRESS-MIGRATION-003A + 003B-P0\n')

/* ------------------------------------------------------------------ *
 * 1. PHP syntax
 * ------------------------------------------------------------------ */

console.log('1. PHP syntax')
try {
  const out = execFileSync(process.execPath, [path.join(HERE, 'php-lint.mjs')], { encoding: 'utf8' })
  const parsed = out.match(/php-lint: (\d+) file\(s\), (\d+) problem\(s\)/)
  check(`php-lint (${parsed?.[1] ?? '?'} files)`, parsed?.[2] === '0', out.trim())
} catch (error) {
  check('php-lint', false, String(error.stdout ?? error.message).trim())
}

/*
 * CSS is parsed for the same reason PHP is: neither can be rendered on this
 * machine, so a structural error would first surface on the live site. An
 * unbalanced brace makes a browser discard everything from the mistake to the
 * next rule it can resynchronise on, which deletes styling silently.
 */
try {
  const out = execFileSync(process.execPath, [path.join(HERE, 'css-lint.mjs')], { encoding: 'utf8' })
  const parsed = out.match(/css-lint: (\d+) file\(s\), (\d+) problem\(s\), (\d+) duplicate/)
  check(`css-lint (${parsed?.[1] ?? '?'} files)`, parsed?.[2] === '0', out.trim().split('\n').slice(-6).join(' | '))
  if (parsed?.[3] && parsed[3] !== '0') notes.push(`css-lint: ${parsed[3]} duplicate selector(s) — npm run wp:css to list`)
} catch (error) {
  const out = String(error.stdout ?? error.message)
  const parsed = out.match(/css-lint: (\d+) file\(s\), (\d+) problem\(s\)/)
  check(
    `css-lint (${parsed?.[1] ?? '?'} files)`,
    false,
    `${parsed?.[2] ?? '?'} problem(s) — run npm run wp:css`,
  )
}

/* ------------------------------------------------------------------ *
 * 2. Theme completeness — the file list checkpoint §F requires
 * ------------------------------------------------------------------ */

console.log('\n2. Theme files')
const REQUIRED_THEME_FILES = [
  'style.css',
  'functions.php',
  'theme.json',
  'index.php',
  'front-page.php',
  'page.php',
  'single.php',
  'home.php',
  'archive.php',
  'search.php',
  '404.php',
  'header.php',
  'footer.php',
  'screenshot.png',
  'assets/css/theme.css',
  'assets/js/navigation.js',
  'template-parts/content.php',
  'inc/setup.php',
  'page-templates/full-width.php',
]

for (const file of REQUIRED_THEME_FILES) {
  check(file, exists(path.join(THEME, file)))
}

/* ------------------------------------------------------------------ *
 * 3. Theme requirements — §F 1-13
 * ------------------------------------------------------------------ */

console.log('\n3. Theme requirements')
const styleCss = read(path.join(THEME, 'style.css'))
const setup = read(path.join(THEME, 'inc/setup.php'))
const assets = read(path.join(THEME, 'inc/assets.php'))
const themeCss = read(path.join(THEME, 'assets/css/theme.css'))
const themeJson = JSON.parse(read(path.join(THEME, 'theme.json')))

check('style.css declares Theme Name', /^Theme Name:\s*\S/m.test(styleCss))
check('style.css declares Text Domain', /^Text Domain:\s*gcalls-theme/m.test(styleCss))

for (const support of [
  'title-tag',
  'post-thumbnails',
  'custom-logo',
  'html5',
  'responsive-embeds',
  'editor-styles',
]) {
  check(`theme support: ${support}`, setup.includes(`'${support}'`))
}

check('registers navigation menus', setup.includes('register_nav_menus'))
check('enqueues via wp_enqueue_scripts', assets.includes("add_action( 'wp_enqueue_scripts'"))
check('enqueues stylesheet with a version', /wp_enqueue_style\(\s*'gcalls-theme'/.test(assets))

check('brand primary #673ab7 present', /#673ab7/i.test(themeCss))
check('Open Sans present', /Open Sans/.test(themeCss))
check('1280px container present', /--gcalls-container:\s*1280px/.test(themeCss))
check('0.625rem radius present', /--gcalls-radius:\s*0\.625rem/.test(themeCss))
check(
  'theme.json palette carries the brand colour',
  JSON.stringify(themeJson.settings.color.palette).toLowerCase().includes('#673ab7'),
)
check(
  'theme.json wideSize matches the container',
  themeJson.settings.layout.wideSize === '1280px',
)

/* ------------------------------------------------------------------ *
 * 4. Escaping and secrets
 * ------------------------------------------------------------------ */

console.log('\n4. Escaping and secrets')

const phpFiles = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.php')) phpFiles.push(full)
  }
}
walk(THEME)
walk(PLUGIN)

// A bare `echo $var` in a template is an escaping defect. Calls that carry
// their own escaping (the_content, the_title with wrapper args, esc_*) are not
// matched by this.
//
// ONE ESCAPE HATCH, AND IT IS COUNTED.
// A line marked `// gcalls-qa: raw output — <reason>` is allowed through. It
// exists for output that is ALREADY filtered and would be damaged by escaping
// it again: `the_content()` captured into a buffer is the case that forced it,
// because wp_kses_post() strips the data attributes Elementor renders with.
// The exemptions are listed on every run, so they cannot pile up unnoticed —
// a rule nobody can see the exceptions to stops being a rule.
const RAW_OK = /\/\/\s*gcalls-qa:\s*raw output\s*—/
const rawEcho = []
const rawAllowed = []
for (const file of phpFiles) {
  const source = read(file)
  const lines = source.split('\n')
  lines.forEach((line, index) => {
    if (!/\becho\s+\$[a-z_]/i.test(line) || /esc_|wp_kses|wp_json_encode/.test(line)) return
    const where = `${path.relative(REPO, file)}:${index + 1}`
    // The marker may sit on the echo or on the comment lines just above it,
    // because a reason worth writing rarely fits after the statement.
    const context = lines.slice(Math.max(0, index - 3), index + 1).join('\n')
    if (RAW_OK.test(context)) rawAllowed.push(where)
    else rawEcho.push(where)
  })
}
check('no unescaped `echo $var`', rawEcho.length === 0, rawEcho.join(', '))
check(
  `raw-output exemptions are declared (${rawAllowed.length})`,
  rawAllowed.length <= 2,
  rawAllowed.join(', '),
)

const SECRET_PATTERNS = [
  /DB_PASSWORD\s*['"]?\s*[,=]\s*['"][^'"]{3,}/i,
  /\b(api|secret|access)[_-]?(key|token)\b\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
]
const secrets = []
for (const file of [...phpFiles, path.join(WP, 'config/htaccess-wordpress.conf')]) {
  if (!exists(file)) continue
  const source = read(file)
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(source)) secrets.push(path.relative(REPO, file))
  }
}
check('no credential-looking strings in source', secrets.length === 0, secrets.join(', '))

/* ------------------------------------------------------------------ *
 * 5. Plugin structure
 * ------------------------------------------------------------------ */

console.log('\n5. Plugin')
const pluginMain = read(path.join(PLUGIN, 'gcalls-core.php'))
check('plugin header declares Plugin Name', /^\s*\*\s*Plugin Name:\s*\S/m.test(pluginMain))
check('plugin declares Text Domain', /Text Domain:\s*gcalls-core/.test(pluginMain))
check('uninstall.php present', exists(path.join(PLUGIN, 'uninstall.php')))
check(
  'uninstall.php guards on WP_UNINSTALL_PLUGIN',
  read(path.join(PLUGIN, 'uninstall.php')).includes('WP_UNINSTALL_PLUGIN'),
)

for (const file of [
  'includes/class-hub-taxonomy.php',
  'includes/class-breadcrumbs.php',
  'includes/class-faq.php',
  'includes/class-seo.php',
  'includes/class-redirects.php',
  'includes/class-hardening.php',
  'includes/class-importer.php',
  'includes/class-cli.php',
  'includes/template-tags.php',
]) {
  check(file, exists(path.join(PLUGIN, file)))
}

// The theme calls gcalls_core_breadcrumbs() through function_exists(), which
// resolves in the global namespace. Declaring it inside the plugin's namespace
// would make that check fail silently and drop breadcrumbs from every page.
const tags = read(path.join(PLUGIN, 'includes/template-tags.php'))
check(
  'template tags are in the global namespace',
  !/^\s*namespace\s/m.test(tags) && /function gcalls_core_breadcrumbs/.test(tags),
)

// Rank Math owns the document head. A second plugin writing these tags produces
// duplicates, and a duplicated canonical is worse than none.
const pluginSources = phpFiles.filter((f) => f.startsWith(PLUGIN)).map(read).join('\n')
check(
  'plugin does not emit its own canonical/OG tags',
  !/rel=["']canonical|property=["']og:/i.test(pluginSources),
)

/* ------------------------------------------------------------------ *
 * 6. Import pipeline
 * ------------------------------------------------------------------ */

console.log('\n6. Import pipeline')
const manifestPath = path.join(WP, 'imports/content-manifest.json')
check('manifest generated', exists(manifestPath))

if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath))
  check('38 pages', manifest.counts.pages === 38, String(manifest.counts.pages))
  check('18 articles', manifest.counts.articles === 18, String(manifest.counts.articles))
  check('7 hubs', manifest.hubs.length === 7, manifest.hubs.join(' '))
  check('13 media', manifest.counts.media === 13, String(manifest.counts.media))
  check(
    'GP-04 and GP-06 excluded',
    !manifest.media.some((m) => m.id === 'GP-04' || m.id === 'GP-06'),
  )
  check(
    'every media item has alt text',
    manifest.media.every((m) => m.alt && m.alt.length > 10),
  )
  check(
    'every media file exists on disk',
    manifest.media.every((m) => exists(path.join(REPO, m.file))),
  )
  check('no article body content in 003A', manifest.withBodies === false)
  check(
    'all 18 articles publish',
    manifest.articles.every((a) => a.status === 'publish'),
  )
  check(
    'no raw PNG in the media map',
    manifest.media.every((m) => m.file.endsWith('.webp')),
  )
}

const importer = read(path.join(PLUGIN, 'includes/class-importer.php'))
check('importer supports dry-run', /dry_run/.test(importer))
check('importer is idempotent by source id', /META_SOURCE_ID/.test(importer))
check('importer writes a rollback manifest', /rollback/.test(importer))
check('importer reports created/updated/skipped/errors', /'created'/.test(importer) && /'skipped'/.test(importer))

const cli = read(path.join(PLUGIN, 'includes/class-cli.php'))
check('CLI defaults to dry-run', /\$dry_run = ! isset\( \$assoc_args\['execute'\] \)/.test(cli))

// A REST route's array holds numeric handlers plus a 'schema' callable. Writing
// a permission_callback into the callable fatals every REST request, which
// takes the Elementor editor down with it.
const hardening = read(path.join(PLUGIN, 'includes/class-hardening.php'))
check(
  'REST endpoint rewrite skips the schema entry',
  /is_int\( \$index \)/.test(hardening) && /isset\( \$handler\['callback'\] \)/.test(hardening),
)

/*
 * The pipeline must not be able to reach a production system.
 *
 * ONE FILE IS EXEMPT, AND IT IS HELD TO MORE, NOT LESS.
 * class-corpus-migration.php fetches article images from gcalls.co on purpose:
 * that is the whole point of the screen, it was approved in as many words, and
 * it is read-only. The exemption is named here rather than the rule being
 * dropped, and the checks under it are stricter than the blanket ban was — a
 * general "no HTTP" rule would have said nothing about whether the one file
 * that does make requests makes safe ones.
 */
const HTTP_EXEMPT = 'includes/class-corpus-migration.php'

const networkCalls = phpFiles
  .filter((f) => f.startsWith(PLUGIN) && !f.endsWith(HTTP_EXEMPT))
  .filter((f) => /wp_remote_(get|post|request)|curl_exec|file_get_contents\(\s*['"]https?:/.test(read(f)))
check('pipeline makes no outbound HTTP calls', networkCalls.length === 0, networkCalls.join(', '))

const migration = read(path.join(PLUGIN, HTTP_EXEMPT))

// GET only. A POST to gcalls.co from this site would be a write to production,
// which is the thing the original rule existed to make impossible.
check('the migration tool only ever GETs', !/wp_remote_post|wp_remote_request/.test(migration))
/*
 * wp_safe_remote_get, not wp_remote_get. The safe variant sets
 * reject_unsafe_urls, so WordPress runs the URL and every redirect target
 * through wp_http_validate_url and refuses loopback, private and link-local
 * addresses. The host resolves at request time, which is the only place that
 * check is worth anything — a name that was public at preflight and points at
 * a metadata address by the time the fetch happens is the case that matters.
 */
check('the migration tool uses the safe HTTP API', (migration.match(/wp_safe_remote_get\(/g) ?? []).length === 1)
check('the migration tool never uses the unsafe one', !/[^_]wp_remote_get\(/.test(migration))
check('redirects are capped', /'redirection'\s*=>\s*3/.test(migration))
check('the response size is capped at the transport', /'limit_response_size'\s*=>\s*self::MAX_DOWNLOAD_BYTES/.test(migration))
// The URL comes from the bundled manifest, never from a request.
check('the fetched URL comes from the manifest', /wp_safe_remote_get\(\s*\n?\s*\$item\['url'\]/.test(migration))
check('the URL is checked against an allowlist first', /url_is_allowed\( \(string\) \$item\['url'\] \)/.test(migration))
check('the allowlist requires HTTPS', /0 !== strpos\( \$url, 'https:\/\/' \)/.test(migration))
check('the allowlist checks both URL and host', /isset\( \$allowed_urls\[ \$url \] \) && isset\( \$allowed_hosts/.test(migration))
check('the migration tool never reads a URL from the request', !/\$_(POST|GET|REQUEST)\[[^\]]*url/i.test(migration))
// The bytes must match what was probed, or the file is not what was approved.
check('downloaded bytes are checked against the manifest hash', /hash\( 'sha256', \$body \) !== \$item\['sha256'\]/.test(migration))
check('the file type is decided by the file', migration.includes('wp_check_filetype_and_ext'))

/* ------------------------------------------------------------------ *
 * 7. User-enumeration hardening
 *
 * Regression cover for the leak found on the live host on 2026-08-27:
 *
 *   GET /?author=1  ->  301 Location: /author/admin/
 *
 * The 404 handler was already correct. It never ran, because it shared
 * priority 10 on template_redirect with core's redirect_canonical(), and equal
 * priorities run in registration order — core first. redirect_canonical()
 * rewrites `?author=<id>` to the pretty URL only when count_user_posts() is
 * non-zero, which is why `?author=2` (no posts) already 404d and `?author=1`
 * (one post) did not. The leak follows post ownership, so attributing content
 * to another administrator relocates it rather than closing it.
 *
 * These assertions read the source, not a running site. The live equivalents
 * are in the NOT RUN list at the end.
 * ------------------------------------------------------------------ */

console.log('\n7. User-enumeration hardening')

check(
  'author archive blocked before redirect_canonical (priority 0)',
  /add_action\(\s*'template_redirect',\s*array\( self::class, 'block_author_archives' \),\s*0\s*\)/.test(hardening),
  'a priority-10 registration loses to core and the 301 escapes',
)
check(
  'canonical redirect cancelled on author requests',
  /remove_action\( 'template_redirect', 'redirect_canonical' \)/.test(hardening),
)
check(
  'canonical redirect cancelled per-request, not globally',
  hardening.indexOf("remove_action( 'template_redirect', 'redirect_canonical' )") >
    hardening.indexOf('public static function block_author_archives'),
  'removing it at init would break permalinks site-wide',
)
check(
  '404 permalink guessing disabled for author requests',
  /do_redirect_guess_404_permalink/.test(hardening),
)
check('author archive still answers 404', /\$wp_query->set_404\(\);/.test(hardening) && /status_header\( 404 \)/.test(hardening))
check(
  'oEmbed drops author_name and author_url',
  /'oembed_response_data'/.test(hardening) && /unset\( \$data\['author_name'\], \$data\['author_url'\] \)/.test(hardening),
)
check(
  'core users sitemap provider removed',
  /'wp_sitemaps_add_provider'/.test(hardening) && /'users' === \$name \? false : \$provider/.test(hardening),
)
check(
  'REST users stay closed to anonymous callers',
  /'rest_endpoints'/.test(hardening) && /is_user_logged_in\(\)/.test(hardening) && /rest_authorization_required_code\(\)/.test(hardening),
)

// The editor and wp-admin must survive all of the above. template_redirect does
// not fire in wp-admin, so the only way this module could reach the editor is a
// blanket REST filter — which is exactly what took the site down once already.
check(
  'no blanket REST authentication filter',
  !/rest_authentication_errors/.test(hardening),
  'gating all of REST breaks the Elementor editor',
)
check(
  'hardening registers nothing on admin_init',
  !/admin_init/.test(hardening),
)
check(
  'author blocking is scoped to author queries only',
  /if \( ! is_author\(\) \) \{\s*\n\s*return;/.test(hardening),
)
// Nothing in gcalls-theme prints author attribution today. If that changes, it
// must use the template tags — not a hand-built /author/ URL, which now 404s.
const themeSources = phpFiles.filter((f) => f.startsWith(THEME)).map(read).join('\n')
check(
  'theme builds no hand-rolled /author/ links',
  !/["']\/author\//.test(themeSources),
)

/* ------------------------------------------------------------------ *
 * 8. Server configuration
 * ------------------------------------------------------------------ */

console.log('\n8. Server configuration')
const htaccess = read(path.join(WP, 'config/htaccess-wordpress.conf'))
const robots = read(path.join(WP, 'config/robots.txt'))

check('WordPress front-controller block present', /RewriteRule \. \/index\.php \[L\]/.test(htaccess))
check('no React SPA fallback', !/RewriteRule \^ index\.html/.test(htaccess))
check('http -> https redirect', /RewriteCond %\{HTTPS\} !=on/.test(htaccess))
check('www -> non-www redirect', /RewriteCond %\{HTTP_HOST\} \^www\\\./.test(htaccess))
// Anchored to the start of a line: the file's own header comment mentions
// "# BEGIN WordPress" in prose, and a plain indexOf finds that first.
const wpBlockStart = htaccess.search(/^# BEGIN WordPress$/m)
check(
  'redirect rules sit above the WordPress block',
  wpBlockStart > 0 && htaccess.indexOf('RewriteCond %{HTTP_HOST} ^www\\.') < wpBlockStart,
)
check(
  'X-Robots-Tag carries all five directives',
  /X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex"/.test(htaccess),
)
check('wp-config.php denied', /wp-config\\\.php/.test(htaccess))
check('xmlrpc.php denied', /xmlrpc\.php/.test(htaccess))
check('PHP execution blocked in uploads', /wp-content\/uploads\/.*\\\.\(php/.test(htaccess))
check('robots.txt disallows everything', /^User-agent: \*\nDisallow: \/$/m.test(robots))

// WordPress finds its block by scanning for a line CONTAINING "# BEGIN
// WordPress", not by matching a line exactly. A comment that quotes the marker
// is therefore treated as the real marker, and everything below it is replaced
// on the next permalink save — which silently deleted the redirects, the
// security headers and the deny rules the first time this file was deployed.
const beginMarkers = htaccess.split('\n').filter((line) => line.includes('# BEGIN WordPress'))
const endMarkers = htaccess.split('\n').filter((line) => line.includes('# END WordPress'))
check('exactly one # BEGIN WordPress line', beginMarkers.length === 1, `${beginMarkers.length} lines`)
check('exactly one # END WordPress line', endMarkers.length === 1, `${endMarkers.length} lines`)
check(
  'the custom rules survive a permalink save',
  beginMarkers.length === 1 && htaccess.indexOf(beginMarkers[0]) > htaccess.indexOf('X-Robots-Tag'),
)

/* ------------------------------------------------------------------ *
 * 9. Elementor
 * ------------------------------------------------------------------ */

console.log('\n9. Elementor')
const elementor = read(path.join(THEME, 'inc/elementor.php'))
check('Elementor integration is guarded', /did_action\( 'elementor\/loaded' \)/.test(elementor))
check('Elementor limited to pages', /'page'/.test(elementor) && /get_public_post_types/.test(elementor))
check('full-width page template registered', /theme_page_templates/.test(elementor))

const templateDir = path.join(WP, 'elementor-templates')
const templates = fs.readdirSync(templateDir).filter((f) => f.endsWith('.json'))
check('at least one Elementor template', templates.length > 0)
for (const file of templates) {
  const template = JSON.parse(read(path.join(templateDir, file)))
  check(`${file} has a valid envelope`, Boolean(template.version && template.type && Array.isArray(template.content)))
}

/* ------------------------------------------------------------------ *
 * 10. Git hygiene
 * ------------------------------------------------------------------ */

console.log('\n10. Git hygiene')
const gitignore = read(path.join(REPO, '.gitignore'))
for (const rule of ['wordpress/wp-content/uploads/', 'wordpress/wp-config.php', 'wordpress/core/']) {
  check(`.gitignore covers ${rule}`, gitignore.includes(rule))
}

let tracked = ''
try {
  tracked = execFileSync('git', ['ls-files', 'wordpress'], { cwd: REPO, encoding: 'utf8' })
} catch {
  notes.push('git ls-files unavailable — tracked-file check skipped')
}
if (tracked) {
  const forbidden = tracked
    .split('\n')
    .filter((f) => /wp-config\.php$|\/uploads\/|\.sql$|wp-includes\/|wp-admin\//.test(f))
  check('no WordPress core, uploads or dumps tracked', forbidden.length === 0, forbidden.join(', '))
}

/* ------------------------------------------------------------------ *
 * 11. Import pipeline — 003B P0
 * ------------------------------------------------------------------ */

console.log('\n11. Import pipeline (003B P0)')

const importerSrc = read(path.join(PLUGIN, 'includes/class-importer.php'))
const adminScreen = path.join(PLUGIN, 'includes/class-admin.php')
const shortcodes = path.join(PLUGIN, 'includes/class-shortcodes.php')

check('importer consumes parentRoute', importerSrc.includes('parentRoute'))
check('importer sets post_parent', importerSrc.includes("'post_parent'"))
check('importer sets the page template', importerSrc.includes('_wp_page_template'))
check('importer sets the front page', importerSrc.includes("'page_on_front'"))
check('importer sets the posts page', importerSrc.includes("'page_for_posts'"))
check('importer builds nav menus', importerSrc.includes('wp_update_nav_menu_item'))
check('importer imports media by manifest id', importerSrc.includes('META_MEDIA_ID'))
check('importer validates before writing', /public static function validate\(/.test(importerSrc))
check('a failed validation aborts the whole run', importerSrc.includes("\$report['aborted'] = true"))
check('importer detects editor changes', importerSrc.includes('was_edited'))
check(
  'overwriting an edited body needs its own flag',
  importerSrc.includes('overwrite_edited') && importerSrc.includes('$overwrite_edited'),
)

// The importer must never be able to start on its own. This is the check that
// would catch someone "helpfully" wiring it to a hook.
const pluginPhp = read(path.join(PLUGIN, 'gcalls-core.php'))
const autoRun = [pluginPhp, importerSrc, exists(adminScreen) ? read(adminScreen) : '']
  .join('\n')
  .match(/add_action\(\s*'(admin_init|init|wp_loaded|shutdown)'[^)]*Import/gi)
check('importer is never hooked to run automatically', !autoRun, String(autoRun))

check('admin screen exists', exists(adminScreen))
if (exists(adminScreen)) {
  const admin = read(adminScreen)
  check('admin screen requires manage_options', admin.includes("current_user_can( 'manage_options' )"))
  check('admin screen checks a nonce', admin.includes('check_admin_referer'))
  check('admin screen requires explicit confirmation', admin.includes("\$_POST['confirm']"))
  check('admin screen defaults to dry run', admin.includes("'dry_run'          => empty( \$_POST['confirm'] )"))
  check('admin screen registers no admin_init hook', !admin.includes("add_action( 'admin_init'"))
  check('manifest path is confined to one directory', admin.includes('realpath') && admin.includes('str_starts_with'))
}

/* ------------------------------------------------------------------ *
 * 12. Shortcodes and CTA attribution
 * ------------------------------------------------------------------ */

console.log('\n12. Shortcodes and CTA attribution')

check('shortcode module exists', exists(shortcodes))
if (exists(shortcodes)) {
  const sc = read(shortcodes)
  for (const tag of ['gcalls_faq', 'gcalls_cta', 'gcalls_lead_form', 'gcalls_media']) {
    check(`registers [${tag}]`, sc.includes(`add_shortcode( '${tag}'`))
  }
  check(
    'CTA carries all four attribution keys',
    ['intent', 'source', 'product', 'solution'].every((key) => sc.includes(`'${key}'`)),
  )
  // The lead pipeline has no approved destination. A shortcode that posts
  // anywhere is the one change that must not slip in unnoticed.
  check('lead form sends nothing anywhere', !/wp_remote_(post|get|request)|curl_exec/.test(sc))
  check('lead form is disabled, not silently discarding input', sc.includes('<fieldset disabled>'))
  check('lead form gives the working contact channels', sc.includes('sales@gcalls.co'))
}

/* ------------------------------------------------------------------ *
 * 13. Content manifest — hierarchy, menus, articles
 * ------------------------------------------------------------------ */

console.log('\n13. Content manifest')

const contentManifestPath = path.join(WP, 'imports/content-manifest.json')
check('manifest present', exists(contentManifestPath))

if (exists(contentManifestPath)) {
  const manifest = JSON.parse(read(contentManifestPath))

  check('38 pages', manifest.counts?.pages === 38, String(manifest.counts?.pages))
  check('18 articles', manifest.counts?.articles === 18, String(manifest.counts?.articles))
  check('13 media', manifest.counts?.media === 13, String(manifest.counts?.media))
  check('7 hubs', manifest.hubs?.length === 7, String(manifest.hubs?.length))

  const byRoute = new Map(manifest.pages.map((page) => [page.route, page]))

  // Re-derive every permalink from the manifest's own hierarchy. This is the
  // same rule the PHP importer enforces; agreeing here means a broken manifest
  // fails in CI rather than on the host.
  const wrong = []
  for (const page of manifest.pages) {
    if (page.isFrontPage) continue
    const chain = []
    let cursor = page
    while (cursor?.parentRoute) {
      chain.unshift(cursor.parentRoute.replace(/^\/|\/$/g, ''))
      cursor = byRoute.get(cursor.parentRoute)
      if (chain.length > 10) break
    }
    const expected = `/${[...chain, page.slug].filter(Boolean).join('/')}/`
    if (expected !== page.route) wrong.push(`${page.id}: ${expected} != ${page.route}`)
  }
  check('every page permalink matches its route', wrong.length === 0, wrong.join('; '))

  const blog = byRoute.get('/blog/')
  check('/blog/ stays top level', blog?.parentRoute === null, String(blog?.parentRoute))
  check('/blog/ is the posts page', blog?.isPostsPage === true)
  check('/blog/ is still filed under Tài nguyên in navigation', blog?.navParentRoute === '/tai-nguyen/')

  check('exactly one front page', manifest.pages.filter((page) => page.isFrontPage).length === 1)
  check('exactly one posts page', manifest.pages.filter((page) => page.isPostsPage).length === 1)
  check(
    'every page carries the full-width template',
    manifest.pages.every((page) => page.template === 'page-templates/full-width.php'),
  )

  // Posts live at /%postname%/, so an article slug and a top-level page slug
  // compete for the same URL.
  const topLevel = new Set(
    manifest.pages.filter((page) => !page.parentRoute && !page.isFrontPage).map((page) => page.slug),
  )
  const clashes = manifest.articles.filter((article) => topLevel.has(article.slug)).map((a) => a.slug)
  check('no article slug collides with a top-level page', clashes.length === 0, clashes.join(', '))

  check('every article has a hub', manifest.articles.every((article) => article.hub))
  check(
    'every article is published',
    manifest.articles.every((article) => article.status === 'publish'),
  )
  check(
    'no article claims a featured image',
    manifest.articles.every((article) => !article.featuredImage),
  )

  check('menus exported for both theme locations', Boolean(manifest.menus?.primary && manifest.menus?.['footer-nav']))
  const menuRoutes = [
    ...(manifest.menus?.primary ?? []),
    ...(manifest.menus?.['footer-nav'] ?? []),
  ].flatMap((group) => [group.route, ...(group.children ?? []).map((child) => child.route)])
  const dangling = menuRoutes.filter((route) => route && !byRoute.has(route))
  check('every menu item points at a real page', dangling.length === 0, dangling.join(', '))
}

/* ------------------------------------------------------------------ *
 * 14. Elementor home page template
 * ------------------------------------------------------------------ */

console.log('\n14. Elementor home page template')

const homeTemplatePath = path.join(WP, 'elementor-templates/gcalls-homepage.json')
check('home page template present', exists(homeTemplatePath))

if (exists(homeTemplatePath)) {
  const raw = read(homeTemplatePath)
  let template = null

  try {
    template = JSON.parse(raw)
  } catch (error) {
    check('template is valid JSON', false, String(error))
  }

  if (template) {
    check('template is valid JSON', true)
    check('envelope type is page', template.type === 'page', String(template.type))
    check('envelope declares a version', Boolean(template.version))
    check('content is a non-empty array', Array.isArray(template.content) && template.content.length > 0)
    check('every top-level element is a section', template.content.every((el) => el.elType === 'section'))

    const flat = JSON.stringify(template)
    const widgetTypes = [...flat.matchAll(/"widgetType":"([^"]+)"/g)].map((m) => m[1])

    // Elementor FREE only. A Pro widget imports as a blank box on this site.
    const FREE = new Set([
      'heading', 'text-editor', 'button', 'icon-list', 'image',
      'shortcode', 'html', 'divider', 'spacer', 'video', 'icon',
    ])
    const proWidgets = [...new Set(widgetTypes)].filter((type) => !FREE.has(type))
    check('no Elementor Pro widget', proWidgets.length === 0, proWidgets.join(', '))

    const ids = [...flat.matchAll(/"id":"([0-9a-f]{6,8})"/g)].map((m) => m[1])
    check('element ids are unique', new Set(ids).size === ids.length, `${ids.length} ids, ${new Set(ids).size} unique`)

    // Colours must come from the approved token set.
    const hexes = [...new Set([...flat.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toLowerCase()))]
    const allowed = new Set(['#673ab7', '#4a2391', '#f5f1fc', '#1e2026', '#5b5f6b', '#ffffff', '#faf9fc', '#e9defb', '#e8e5ef'])
    const strayColours = hexes.filter((hex) => !allowed.has(hex))
    check('only approved colours', strayColours.length === 0, strayColours.join(', '))

    check('uses Open Sans', flat.includes('Open Sans'))

    // Product screenshots must be placed by manifest id, never by an uploads
    // URL or an attachment id, or the template only works on one site.
    //
    // Since 010 the home page places no screenshot at all: the reference's
    // home page is thirteen sections of ported mockups and zero product
    // photography, and the last two screenshots here (the mobile webphone on
    // §9, the click-to-call config on §10) stood where the reference has
    // interactive components. So this can no longer demand that an image
    // exists — only that any image placed goes through the manifest, and that
    // none is placed by attachment id, which is the portability bug the gate
    // was really written for.
    check('no hardcoded uploads URL', !/wp-content\\\/uploads/.test(flat))

    const imageWidgets = (flat.match(/"widgetType":"image"/g) ?? []).length
    check('no screenshot placed by attachment id', imageWidgets === 0, `${imageWidgets} image widget(s)`)

    const mediaCalls = [...flat.matchAll(/gcalls_media\s+([^\\"]*)/g)].map((m) => m[1])
    check(
      'any placed screenshot names a manifest id',
      mediaCalls.every((call) => call.includes('id=')),
      mediaCalls.filter((c) => !c.includes('id=')).join(' | '),
    )

    // The chart moved in 007. It used to be a static inline SVG in this
    // template; it is now the ported Analytics mockup, so the drawing and its
    // "dữ liệu minh họa" caption live in class-mockups.php. What this template
    // must still guarantee is that it pulls in that mockup rather than an
    // invented chart of its own — and section 18 checks the caption at source.
    check('the chart is the ported mockup, not a new one', flat.includes('gcalls_mockup id=\\"analytics'))
    check('no chart library is loaded', !/recharts|chart\.js|d3\.min/.test(flat))

    // Every conversion button has to carry its attribution, or the lead
    // arrives with no record of the page that produced it.
    const leadLinks = [...flat.matchAll(/\/lien-he\/(\?[^"]*)?/g)].map((m) => m[1] ?? '')
    check('at least one conversion CTA', leadLinks.length > 0)
    check(
      'every conversion CTA carries attribution',
      leadLinks.every((query) => query.includes('intent=') && query.includes('source=')),
      leadLinks.filter((q) => !q.includes('intent=')).join(' | '),
    )
  }
}

/* ------------------------------------------------------------------ *
 * 15. Full blog corpus — 004
 * ------------------------------------------------------------------ */

console.log('\n15. Full blog corpus (004)')

const corpusScript = path.join(WP, 'scripts/export-blog-corpus.mjs')
const wxrReader = path.join(WP, 'scripts/lib/wxr.mjs')

check('corpus exporter present', exists(corpusScript))
check('WXR reader present', exists(wxrReader))

if (exists(wxrReader)) {
  const reader = read(wxrReader)
  // A plain indexOf('</item>') truncates the first body that contains that
  // string and silently swallows every article after it.
  check('WXR reader is CDATA-aware', reader.includes('indexOfOutsideCdata'))
}

if (exists(corpusScript)) {
  const corpus = read(corpusScript)
  check('corpus reads the editorial master map', corpus.includes('editorial-master-map.csv'))
  check('corpus reads the URL plan', corpus.includes('editorial-url-plan.csv'))
  check('corpus reads the security incident record', corpus.includes('blog-security-incident.csv'))
  check('retire paths come from the URL plan, not a slugified title', corpus.includes("plan?.['Legacy URL']"))
  check('merge sources get a distinct slug', corpus.includes('-merge-'))
  check('merge sources claim no canonical', corpus.includes('if (!isMerge)'))
  check('the WXR is not vendored, only hashed', corpus.includes('wxrSha'))
  check('legacy authors are not turned into users', !/wp_(insert|create)_user/.test(corpus))
  check('dry run exits non-zero on problems', corpus.includes('DRY RUN: FAIL'))
}

// The corpus files themselves are the decision source and must stay in the repo.
for (const file of [
  'editorial-master-map.csv',
  'blog-inventory.csv',
  'editorial-url-plan.csv',
  'blog-security-incident.csv',
  'editorial-hub-summary.csv',
]) {
  check(`${file} tracked`, exists(path.join(REPO, 'docs/content-review/blog', file)))
}

const hubTaxonomy = read(path.join(PLUGIN, 'includes/class-hub-taxonomy.php'))
const hubIds = [...hubTaxonomy.matchAll(/'(HUB-\d+)' => array/g)].map((m) => m[1])
check('all 13 editorial hubs registered', hubIds.length === 13, `${hubIds.length}: ${hubIds.join(', ')}`)

for (const hub of ['HUB-04', 'HUB-05', 'HUB-10', 'HUB-11']) {
  check(`${hub} registered (163 corpus posts depend on these)`, hubIds.includes(hub))
}

check('importer preserves the original publication date', importerSrc.includes("$postarr['post_date']"))
check('importer keeps the legacy author as meta', importerSrc.includes('_gcalls_legacy_author'))
check('importer keeps the featured image as a reference', importerSrc.includes('_gcalls_legacy_thumbnail'))
check('importer records the editorial decision', importerSrc.includes('_gcalls_editorial_decision'))
// Importing a manifest with no redirects must not clear the stored map.
check(
  'an empty redirect map never wipes the stored one',
  importerSrc.includes('giữ nguyên map hiện tại thay vì xoá'),
)

/* ------------------------------------------------------------------ *
 * 16. Live demo completion — 005
 * ------------------------------------------------------------------ */

console.log('\n16. Live demo completion (005)')

if (exists(adminScreen)) {
  const admin = read(adminScreen)
  check('import screen accepts a packaged zip', admin.includes('unzip_file'))
  check('upload has its own nonce', admin.includes('NONCE_UPLOAD'))
  check('upload is size-capped', admin.includes('MAX_UPLOAD_BYTES'))
  check('only .zip is accepted', admin.includes("'zip' !== strtolower"))
  check('upload source is verified', admin.includes('is_uploaded_file'))
  // unzip_file() will happily write a member named ../../../wp-config.php.
  check('extracted members are re-checked for traversal', admin.includes('unsafe_members'))
  check('extracted member types are allowlisted', admin.includes('ALLOWED_MEMBER_EXTENSIONS'))
}

const estimatorConfig = path.join(PLUGIN, 'data/estimator-config.json')
const estimatorJs = path.join(PLUGIN, 'assets/js/estimator.js')

check('estimator config generated', exists(estimatorConfig))
check('estimator front end present', exists(estimatorJs))

if (exists(estimatorConfig)) {
  const config = JSON.parse(read(estimatorConfig))

  check('7 solutions', config.solutions?.length === 7, String(config.solutions?.length))
  check(
    'every solution has fields and a recommendation rule',
    config.solutions.every((s) => s.fields.length > 0 && s.id in config.recommendationRules),
  )

  // The React source gates every number behind PRICING_CONFIGURED === false.
  // If the port ever claims otherwise it would be showing a total it has no
  // rate table to compute.
  const pricingSrc = read(path.join(REPO, 'src/data/pricing.ts'))
  const reactConfigured = /export const PRICING_CONFIGURED = true/.test(pricingSrc)
  check('pricing gate matches the React source', config.pricingConfigured === reactConfigured)
  check('the port claims no pricing', config.pricingConfigured === false)

  // The questionnaire must not drift from the React source.
  const estimatorSrc = read(path.join(REPO, 'src/data/estimator.ts'))
  const sourceIds = [...new Set([...estimatorSrc.matchAll(/^\s{4}id: '([a-z-]+)',$/gm)].map((m) => m[1]))]
  const missing = config.solutions.map((s) => s.id).filter((id) => !sourceIds.includes(id))
  check('every exported solution exists in the React source', missing.length === 0, missing.join(', '))
}

if (exists(estimatorJs)) {
  const js = read(estimatorJs)
  check('estimator front end computes no price', !/[*+]\s*(rate|price|cost)|toFixed|\bVND\b|₫/.test(js))
  // Assignment, not the word: the file's own comment explains why it avoids it.
  check('estimator renders via DOM, not innerHTML', !/\.innerHTML\s*[+]?=/.test(js))
  check('estimator CTA carries attribution', js.includes('intent=quote&source=cost-estimator'))
}

if (exists(shortcodes)) {
  const sc = read(shortcodes)
  check('estimator shortcode registered', sc.includes("add_shortcode( 'gcalls_estimator'"))
  check('shortcode refuses to render if pricing is ever claimed', sc.includes("! empty( \$config['pricingConfigured'] )"))
  check('estimator degrades without JavaScript', sc.includes('<noscript>'))
}

/* ------------------------------------------------------------------ *
 * 17. UI parity — 006
 * ------------------------------------------------------------------ */

console.log('\n17. UI parity (006)')

const productData = path.join(PLUGIN, 'data/product-pages.json')
check('product page content generated', exists(productData))

if (exists(productData)) {
  const product = JSON.parse(read(productData))
  const ids = Object.keys(product.pages ?? {})

  check('four product pages', ids.length === 4, ids.join(', '))

  for (const [id, page] of Object.entries(product.pages ?? {})) {
    check(`${id}: hero + at least 8 sections`, Boolean(page.hero?.heading) && page.sections.length >= 8, `${page.sections.length} sections`)
  }

  // A Gcalls Plus screenshot under another product's name would show a reviewer
  // the wrong software. Only gcalls-plus may carry media; the rest get diagrams.
  const wrongMedia = Object.entries(product.pages ?? {})
    .filter(([id]) => id !== 'gcalls-plus')
    .flatMap(([id, page]) => page.sections.filter((s) => s.media).map((s) => `${id}:${s.media}`))
  check('no product screenshot reused across products', wrongMedia.length === 0, wrongMedia.join(', '))

  const diagrams = Object.values(product.pages ?? {}).flatMap((p) => p.sections.filter((s) => s.diagram).length)
  check('CX / Voicebot / QA-QC carry diagrams', diagrams.reduce((a, b) => a + b, 0) >= 4)
}

if (exists(shortcodes)) {
  const sc = read(shortcodes)
  check('registers [gcalls_product_page]', sc.includes("add_shortcode( 'gcalls_product_page'"))
  check('registers [gcalls_diagram]', sc.includes("add_shortcode( 'gcalls_diagram'"))
  check('diagrams are inline SVG', sc.includes('<svg viewBox="0 0 715 275"'))
  check('diagram carries an illustration caption', sc.includes('Hình minh họa giải pháp'))
}

const redirectsSrc = read(path.join(PLUGIN, 'includes/class-redirects.php'))
// sanitize_text_field() strips percent-encoding by design; on a URL path that
// silently mangles every non-ASCII rule.
check('request path is not passed through sanitize_text_field', !redirectsSrc.includes("sanitize_text_field( wp_unslash( \$_SERVER['REQUEST_URI'] ) )"))
check('redirect targets must look like a path', redirectsSrc.includes('đích không phải đường dẫn hợp lệ'))

const parityThemeCss = read(path.join(THEME, 'assets/css/theme.css'))
/*
 * The article body is filtered exactly once.
 *
 * the_content() applies every content filter and runs every shortcode. Calling
 * it twice — once to render and once to scan for headings — renders every
 * shortcode twice, which on these articles means two CTAs and two FAQ blocks
 * on the page. The contents list is built from the captured output for that
 * reason, and this counts the calls so it stays that way.
 */
{
  const single = read(path.join(THEME, 'single.php'))
  const contentCalls = (single.match(/(?<!\/\/[^\n]*)\bthe_content\(\)/g) ?? []).length
  const commented = (single.match(/^\s*\*.*the_content\(\)/gm) ?? []).length
  check(
    'single.php filters the content exactly once',
    contentCalls - commented === 1,
    `${contentCalls} call(s), ${commented} in comments`,
  )
  check(
    'single.php does not re-filter for the contents list',
    !/apply_filters\(\s*'the_content'/.test(single),
  )

  const tags = read(path.join(THEME, 'inc/template-tags.php'))
  check('the contents builder never filters', !/apply_filters\(\s*'the_content'/.test(tags))
  check('the contents builder uses a DOM parser', tags.includes('DOMDocument'))
  check('the contents builder has a no-DOM fallback', tags.includes('gcalls_article_contents_fallback'))
  check('heading ids survive from the source', tags.includes("getAttribute( 'id' )"))

  const fixtures = path.join(WP, 'tests/test-article-contents.php')
  check('contents fixtures exist', exists(fixtures))
  if (exists(fixtures)) {
    const f = read(fixtures)
    for (const shape of ['<strong>', 'Tổng quan', 'da-chia-se', 'gcalls_cta', 'chưa đóng']) {
      check(`fixture covers ${shape}`, f.includes(shape))
    }
  }
}

/*
 * Same net as the plugin's: every class the theme's PHP emits must have a rule.
 * There is no PHP and no WordPress here, so a class that exists in the markup
 * and nowhere in the stylesheet would first be seen on the live site as an
 * unstyled block where a cover should be.
 */
{
  const themePhp = phpFiles
    .filter((f) => f.startsWith(THEME))
    .map((f) => read(f))
    .join('\n')

  const emittedTheme = new Set(
    [...themePhp.matchAll(/class="([^"$]+)"/g)]
      .flatMap((m) => m[1].split(/\s+/))
      .filter((c) => /^gcalls-(cover|toc|card|article|adjacent|related|terms|meta|branding)/.test(c) && !c.endsWith('-')),
  )

  const unstyledTheme = [...emittedTheme].filter((c) => !parityThemeCss.includes('.' + c))
  check('every theme class has a rule', unstyledTheme.length === 0, unstyledTheme.join(', '))
}

for (const [label, needle] of [
  ['border-box reset', 'box-sizing: border-box'],
  ['focus-visible ring', ':focus-visible'],
  ['sticky header', 'position: sticky'],
  ['scroll lock class', 'gcalls-nav-open'],
  ['footer brand column', 'gcalls-footer__brand'],
  ['heading scale via clamp', 'clamp('],
]) {
  check(`theme has ${label}`, parityThemeCss.includes(needle))
}

const navJs = read(path.join(THEME, 'assets/js/navigation.js'))
check('menu closes on Escape', navJs.includes("'Escape'"))
check('menu closes on outside click', navJs.includes('nav.contains( event.target )'))
check('menu closes when crossing to desktop', navJs.includes('min-width: 1024px'))
check('menu locks background scroll', navJs.includes('gcalls-nav-open'))

const headerPhp = read(path.join(THEME, 'header.php'))
check('header renders the conversion CTA', headerPhp.includes('gcalls_cta'))
check('header CTA carries attribution', headerPhp.includes('source="header"'))

const footerPhp = read(path.join(THEME, 'footer.php'))
check('footer has the brand column', footerPhp.includes('gcalls-footer__brand'))
check('footer gives the working contact channels', footerPhp.includes('sales@gcalls.co') && footerPhp.includes('028 7302 5469'))

const singlePhp = read(path.join(THEME, 'single.php'))
check('article ends with a CTA', singlePhp.includes('gcalls_cta'))
check('article shows related posts from its hub', singlePhp.includes('gcalls-related'))

if (exists(contentManifestPath)) {
  const parityManifest = JSON.parse(read(contentManifestPath))
  const primary = parityManifest.menus?.primary ?? []
  check('Blog is a top-level header item', primary.some((g) => g.route === '/blog/'), primary.map((g) => g.label).join(' · '))
}

/* ------------------------------------------------------------------ *
 * 18. Ported mockups and demo visuals — 007
 * ------------------------------------------------------------------ */

console.log('\n18. Ported mockups (007)')

const mockPhp = path.join(PLUGIN, 'includes/class-mockups.php')
const mockJs = path.join(PLUGIN, 'assets/js/mockups.js')
const mockCss = path.join(PLUGIN, 'assets/css/mockups.css')

check('mockup module present', exists(mockPhp))
check('mockup engine present', exists(mockJs))
check('mockup styles present', exists(mockCss))

if (exists(mockPhp)) {
  const mock = read(mockPhp)
  // The seven React components identified by scripts/mockup-audit.mjs.
  for (const id of ['hero', 'call_timeline', 'crm', 'analytics', 'cloud', 'integrations', 'work_anywhere']) {
    check(`ports ${id}`, mock.includes(`function mock_${id}(`))
  }
  // The three demo product visuals authorised by the 007 addendum.
  for (const id of ['cx_inbox', 'voicebot_builder', 'qc_transcript']) {
    check(`demo visual ${id}`, mock.includes(`function mock_${id}(`))
  }

  // 010: the two home-page components that used to be screenshots. Both are
  // interactive in the reference, and the sections they sit on are precisely
  // the ones whose argument is a moment — a call arriving, a visitor opening
  // the call button — which a still frame cannot make.
  for (const id of ['customer_popup', 'widget']) {
    check(`ported visual ${id}`, mock.includes(`function mock_${id}(`))
  }

  const homeFlat = exists(homeTemplatePath) ? read(homeTemplatePath) : ''
  for (const id of ['customer_popup', 'widget', 'hero']) {
    check(`the home page places mockup ${id}`, homeFlat.includes(`gcalls_mockup id=\\"${id}\\"`))
  }

  // The hero is a composition, not a single panel: the reference pins four
  // cards around the dashboard and keeps one of them below lg.
  check('the hero is a layered stage', mock.includes('gcalls-stage__main') && mock.includes('gcalls-stage__float'))

  /*
   * Every class the PHP emits has a rule behind it.
   *
   * There is no PHP binary on the build machine, so these mockups cannot be
   * rendered locally and a class name that exists in the markup but not in
   * the stylesheet would first be visible on the live site, as an unstyled
   * pile of text where a card should be. Comparing the two files catches
   * exactly that, which is the failure this arrangement is actually exposed
   * to — a typo in one of two places that are edited together.
   */
  const mockCss = read(path.join(PLUGIN, 'assets/css/mockups.css'))
  const emitted = new Set(
    [...mock.matchAll(/class="([^"]+)"/g)]
      .flatMap((m) => m[1].split(/\s+/))
      // PHP builds some class attributes by concatenation, so a token can
      // arrive with the opening quote of the next string still attached, or
      // as the fixed prefix of a name finished at runtime. Trim the first and
      // drop the second — a modifier stub ending in "--" names no single rule.
      .map((c) => c.replace(/['"].*$/, ''))
      .filter((c) => c.startsWith('gcalls-') && !c.endsWith('-')),
  )
  // `gcalls-mock` is the wrapper render() adds, not something a mockup emits.
  emitted.delete('gcalls-mock')
  const unstyled = [...emitted].filter((c) => !mockCss.includes('.' + c))
  check('every mockup class has a rule', unstyled.length === 0, unstyled.join(', '))

  /*
   * The nine visuals the 012 brief names, plus the two the port already had.
   *
   * Each has to exist AND be placed on the page React places it on. The
   * failure this guards against is subtler than a missing method: the port
   * previously satisfied "a visual exists" by pointing four different CX
   * sections at two panels and two generic mockups, so every check passed
   * while the reporting section showed a contact list.
   */
  const PRODUCT_VISUALS = [
    'cx_inbox', 'cx_ticket', 'cx_context', 'cx_report',
    'voicebot_builder', 'voicebot_handoff',
    'qc_transcript', 'qc_scorecard', 'qc_signals', 'qc_dashboard', 'qc_review',
  ]

  for (const id of PRODUCT_VISUALS) {
    check(`product visual ${id}`, mock.includes(`function mock_${id}(`))
  }

  const productJsonRaw = exists(path.join(PLUGIN, 'data/product-pages.json'))
    ? read(path.join(PLUGIN, 'data/product-pages.json'))
    : ''
  const placed = new Set([...productJsonRaw.matchAll(/"mockup":\s*"([a-z_]+)"/g)].map((m) => m[1]))
  const unplaced = PRODUCT_VISUALS.filter((id) => !placed.has(id))
  check('every product visual is placed on a page', unplaced.length === 0, unplaced.join(', '))

  // The generic CRM and analytics panels are for the home page. Reaching for
  // them on a product page is how a section ends up illustrated by something
  // that is not it.
  const generic = ['crm', 'analytics'].filter((id) => placed.has(id))
  check('no generic mockup stands in on a product page', generic.length === 0, generic.join(', '))

  check('every mockup carries the demo caption', mock.includes('Giao diện minh họa – dữ liệu demo'))

  /* ---------------------------------------------------------------- *
   * SEO fallbacks — one <head> writer, never two
   * ---------------------------------------------------------------- */
  const seo = read(path.join(PLUGIN, 'includes/class-seo.php'))

  check('SEO fallbacks hook Rank Math, not wp_head', seo.includes("'rank_math/frontend/title'") && seo.includes("'rank_math/frontend/description'"))
  check('SEO fallbacks register only when Rank Math is active', /rank_math_active\(\)[\s\S]{0,400}rank_math\/frontend\/title/.test(seo))
  // A second description tag is the failure this arrangement exists to avoid.
  check('the plugin prints no meta description of its own', !/meta\s+name=.description/i.test(seo))
  check('the plugin prints no canonical of its own', !/rel=.canonical/i.test(seo))
  check('the title fallback defers to a non-empty value', /fallback_title[\s\S]{0,300}'' !== trim\( \$title \)/.test(seo))
  check('the description fallback defers to a non-empty value', /fallback_description[\s\S]{0,300}'' !== trim\( \$description \)/.test(seo))
  check('the description fallback prefers the excerpt', /post_excerpt/.test(seo))
  check('the SEO fallbacks write nothing', !/fallback_(title|description)[\s\S]{0,900}update_post_meta/.test(seo))
  // noindex must survive untouched: the demo is excluded from search and that
  // is driven by the WordPress setting, not by anything added here.
  check('robots handling is unchanged', seo.includes("add_filter( 'wp_robots'") && seo.includes("get_option( 'blog_public' )"))

  /* ---------------------------------------------------------------- *
   * Article renderers — CTA, related, FAQ
   * ---------------------------------------------------------------- */
  const themeTags = read(path.join(THEME, 'inc/template-tags.php'))
  const singlePhp = read(path.join(THEME, 'single.php'))

  check('a second CTA is suppressed when the body has one', singlePhp.includes('gcalls_article_has_cta'))
  check('the CTA is added at render time, not written', !/update_post_meta|wp_update_post/.test(singlePhp))
  check('related articles top up when a hub is thin', themeTags.includes('function gcalls_related_articles'))
  check('related articles are published only', /gcalls_related_articles[\s\S]{0,900}'post_status'\s*=>\s*'publish'/.test(themeTags))
  check('related articles exclude the current post', /gcalls_related_articles[\s\S]{0,600}\$exclude = array\( \$current \)/.test(themeTags))

  const faq = read(path.join(PLUGIN, 'includes/class-faq.php'))
  check('FAQ drops a pair missing either side', /'' === \$question \|\| '' === \$answer/.test(faq))
  check('FAQ is never generated', !/lorem|auto.?generate/i.test(faq))

  /* ---------------------------------------------------------------- *
   * The home-page layout updater
   * ---------------------------------------------------------------- *
   * This is the only thing in the plugin that writes to the database
   * outside the importer, so its safety properties are gates rather than
   * intentions. The failure it exists to prevent — applying an Elementor
   * template by hand and INSERTING nineteen sections into a page that
   * already has nineteen — is silent, and the page still loads.
   */
  const layoutPath = path.join(PLUGIN, 'includes/class-home-layout.php')
  check('home-layout updater present', exists(layoutPath))

  if (exists(layoutPath)) {
    const layout = read(layoutPath)

    // Anything that fires on its own turns a plugin update into a page
    // rewrite. The screen may only be reached, never triggered.
    for (const hook of ['admin_init', 'register_activation_hook', 'wp_schedule_event', 'init']) {
      check(`the updater never hooks ${hook}`, !layout.includes(`'${hook}'`))
    }
    check('the updater hooks admin_menu only', (layout.match(/add_action\(/g) ?? []).length === 1)

    check('the updater checks manage_options', layout.includes("current_user_can( 'manage_options' )"))
    check('the updater checks a nonce', layout.includes('check_admin_referer('))
    check('the updater requires explicit confirmation', layout.includes('gcalls_confirm'))

    // Replace, never append: writing the meta key wholesale is what makes
    // duplicated sections impossible to express.
    check('the updater replaces _elementor_data', layout.includes("update_post_meta( \$page_id, '_elementor_data'"))
    check('the updater keeps a rollback copy', layout.includes('OPTION_ROLLBACK') && layout.includes('previous_data'))

    /*
     * The rollback snapshot must survive a second apply.
     *
     * The first cut overwrote it unconditionally, so pressing the button
     * twice captured what the first press had just written: the site's
     * original layout was gone and "Hoàn tác" would have restored this
     * release's own layout while reporting success. A rollback that quietly
     * becomes a no-op is worse than none, because nobody tests it until the
     * moment they need it.
     */
    check(
      'a second apply cannot overwrite the original snapshot',
      layout.includes('$have_original') && /if \( \$have_original \)/.test(layout),
    )
    check('the updater counts its runs', layout.includes("'runs'"))
    check('the updater validates the envelope before writing', layout.includes("'type'") && layout.includes("'elType'"))
    check('the updater clears the page CSS cache', layout.includes('_elementor_css'))

    // It writes to the CONFIGURED front page, not to a hardcoded id, so it
    // cannot rewrite the wrong page if the site points somewhere else.
    check('the updater targets the configured front page', layout.includes("get_option( 'page_on_front' )"))
    check('the updater shares no code with the importer', !/\bImporter::/.test(layout))

    const bootstrap = read(path.join(PLUGIN, 'gcalls-core.php'))
    check('the updater loads only in the admin', /is_admin\(\)[\s\S]*class-home-layout\.php/.test(bootstrap))
    /*
     * The plugin does have an activation hook, and should: it registers the
     * taxonomy and flushes rewrite rules once. What must never appear inside
     * it is this updater — activation runs on every plugin update, so a call
     * here would rewrite the front page whenever the plugin was upgraded.
     */
    const activateBody = bootstrap.slice(
      bootstrap.indexOf('function activate()'),
      bootstrap.indexOf('register_activation_hook'),
    )
    check(
      'activation does not invoke the updater',
      activateBody !== '' && !/Home_Layout/.test(activateBody),
      activateBody.trim().slice(0, 80),
    )
  }

  // The layout the updater writes ships inside the plugin, so the code and
  // the layout can never come from different builds.
  /* ---------------------------------------------------------------- *
   * Corpus migration tool
   * ---------------------------------------------------------------- *
   * The only thing in this plugin that downloads files and rewrites post
   * bodies in bulk. Its safety properties are gates, not intentions.
   */
  const mig = read(path.join(PLUGIN, 'includes/class-corpus-migration.php'))

  check('the migration tool checks manage_options', (mig.match(/current_user_can\( 'manage_options' \)/g) ?? []).length >= 2)
  check('the AJAX worker checks a nonce', mig.includes('check_ajax_referer('))
  check('the control form checks a nonce', mig.includes('check_admin_referer('))
  check('the AJAX worker is POST-only', mig.includes("'POST' !== ( \$_SERVER['REQUEST_METHOD']"))
  // The unauthenticated variant is how an admin-ajax action becomes a public
  // endpoint. Match the registration, not the string — the file discusses the
  // hook in a comment precisely because it is the thing being avoided.
  check('the AJAX action is not public', !/add_action\(\s*'wp_ajax_nopriv_/.test(mig))
  check('the tool never hooks itself to run', !/'admin_init'|'init'|wp_schedule|register_activation_hook/.test(mig))
  check('the tool registers no REST route', !/register_rest_route/.test(mig))

  // Published articles are protected in the manifest AND re-checked at the
  // last moment, because a batch can take minutes and a status can change.
  check('published posts are re-checked before every write', (mig.match(/'publish' === \$post->post_status/g) ?? []).length >= 2)
  check('the hash is re-checked before every write', (mig.match(/hash\( 'sha256', \(string\) \$post->post_content \)/g) ?? []).length >= 2)
  /*
   * post_status is absent from every update array, so status cannot change.
   * The test looks for the quoted ARRAY KEY, not the word: the file mentions
   * post_status in a comment and reads $post->post_status to check it, and
   * neither of those writes anything.
   */
  check('the rewrite cannot change status', !/wp_update_post\([\s\S]{0,300}'post_status'\s*=>/.test(mig))
  check('the rewrite cannot change title or slug', !/wp_update_post\([\s\S]{0,300}'post_(title|name)'\s*=>/.test(mig))

  check('the rollback journal is written before the post', /self::journal_write\([\s\S]{0,700}wp_update_post/.test(mig))
  check('rollback deletes no attachment', !/wp_delete_attachment/.test(mig))

  /* ---------------------------------------------------------------- *
   * The twelve execution-safety cases from the 016 review
   * ---------------------------------------------------------------- */

  // 1-3. Disk. There is no bypass, the threshold has a hard floor, and an
  // unreadable value is a failure rather than an assumption.
  check('disk failure disables execute', /! is_float\( \$free \) \|\| \$free <= 0\.0[\s\S]{0,300}'ok'\s*=>\s*false/.test(mig))
  check('the disk threshold has a 750 MB floor', /max\( 750 \* 1024 \* 1024/.test(mig))
  check('the disk threshold scales the worst case by 1.2', /\$worst \* 1\.2/.test(mig))
  check('there is no disk-check override', !/skip_disk|ignore_disk|force_disk|bo_qua_disk/i.test(mig))
  check('disk is measured at the uploads directory', /disk_free_space\( \$measured \)/.test(mig) && /\$uploads\['basedir'\]/.test(mig))
  check('execute is blocked while any preflight fails', /\$failed = array_filter\( self::preflight\(\)[\s\S]{0,200}array\(\) !== \$failed/.test(mig))

  // 4-6. Journal.
  check('journal records are per post, not one blob', mig.includes('OPT_JOURNAL_PREFIX') && !mig.includes("OPT_ROLLBACK "))
  check('journal options are autoload=false', /add_option\( \$key, \$record, '', false \)/.test(mig))
  check('journal records carry a checksum', /'checksum'\s*=>\s*hash\( 'sha256', \$body \)/.test(mig))
  check('a corrupt checksum stops the rollback', /hash\( 'sha256', \(string\) \$entry\['body'\] \) !== \$entry\['checksum'\][\s\S]{0,200}\$corrupt\[\]/.test(mig))
  check('rollback refuses a foreign run id', /\(string\) \$entry\['run_id'\] !== \$run_id/.test(mig))
  check('the run id is in the option name', /self::OPT_JOURNAL_PREFIX \. \$run_id/.test(mig))
  check('an existing journal record is never overwritten', /is_array\( \$existing \) && isset\( \$existing\['body'\] \)[\s\S]{0,80}return true/.test(mig))
  check('the journal write is verified by reading back', /\$written = get_option\( \$key \)/.test(mig))

  // 7-9. Download safety is asserted above, against the same file.

  // 10-12. Idempotency and client trust.
  check('a completed media item is not re-fetched', /isset\( \$map\['by_url'\]\[ \$item\['url'\] \] \)/.test(mig))
  check('the AJAX worker reads nothing but the nonce from the request', !/\$_POST\[(?!'?nonce)/.test(mig.slice(mig.indexOf('function ajax_step'), mig.indexOf('function progress'))))
  check('the manifest version is re-checked every step', /function ajax_step[\s\S]{0,2000}\$manifest\['plugin_version'\] \?\? '' \) !== VERSION/.test(mig))
  check('disk is re-checked every step of a real run', /function ajax_step[\s\S]{0,2600}! \$state\['dry_run'\][\s\S]{0,200}self::disk_check/.test(mig))

  // Idempotency: an image already imported is found by URL or by identical
  // bytes and is not fetched again.
  check(
    'media import is idempotent by URL and hash',
    /isset\( \$map\['by_url'\]\[ \$item\['url'\] \] \)\s*\|\|\s*isset\( \$map\['by_hash'\]\[ \$item\['sha256'\] \] \)/.test(mig),
  )
  check('progress is persisted between requests', mig.includes('OPT_STATE') && mig.includes('media_index') && mig.includes('post_index'))
  check('the run is chunked', /MEDIA_BATCH = \d+/.test(mig) && /POST_BATCH = \d+/.test(mig))
  check('the tool does not use WP-Cron', !/wp_schedule_(single_)?event/.test(mig))
  check('dry run is the default', /'dry_run'\s*=>\s*true/.test(mig))

  // The state machine must not skip from media straight to rewriting.
  for (const s of ['PREPARED', 'BASELINE_VERIFIED', 'MEDIA_IMPORTING', 'MEDIA_COMPLETE', 'POST_REWRITE', 'VERIFYING', 'COMPLETE', 'PAUSED_ERROR']) {
    check(`state ${s} exists`, mig.includes(`'${s}'`))
  }

  const migManifest = path.join(PLUGIN, 'data/corpus-migration.json')
  check('the corpus manifest ships with the plugin', exists(migManifest))

  if (exists(migManifest)) {
    const mf = JSON.parse(read(migManifest))
    // Read the version here rather than reuse the one parsed further down —
    // that binding does not exist yet at this point in the file.
    const pluginVersion = read(path.join(PLUGIN, 'gcalls-core.php')).match(/^const VERSION = '([^']+)';$/m)?.[1] ?? ''
    check('the manifest matches the plugin version', mf.plugin_version === pluginVersion, `${mf.plugin_version} vs ${pluginVersion}`)
    check('the manifest protects the eighteen', (mf.policy?.protected_ids ?? []).length === 18)
    check('the manifest never publishes a draft', mf.policy?.never_publish_draft === true)
    const protectedRows = mf.articles.filter((a) => a.outcome === 'PROTECTED_PUBLISH')
    check('every protected article is marked so', protectedRows.length === 18, String(protectedRows.length))
    check('no protected article has rewritable URLs', protectedRows.every((a) => a.rewritable.length === 0))
  }

  const shipped = path.join(PLUGIN, 'data/homepage-elementor.json')
  check('the shipped home layout is present', exists(shipped))

  if (exists(shipped)) {
    const parsedLayout = JSON.parse(read(shipped))
    check('the shipped layout is a page envelope', parsedLayout.type === 'page')
    check(
      'the shipped layout matches the template',
      read(shipped) === read(homeTemplatePath),
      'plugin copy differs from wordpress/elementor-templates/',
    )
    /*
     * The expected section count is NOT a literal here.
     *
     * It is read from data/homepage-inventory.json, which the generator emits
     * beside the layout: one reviewed entry per section naming the React
     * component it ports. So this gate fails both ways — if the envelope gains
     * or loses a section the inventory did not declare, and if the inventory is
     * edited without the envelope following. Bumping a number to go green is
     * not available; the inventory diff has to be read.
     *
     * GCALLS-020 took the ecosystem run from five sections to four: the two
     * heading-only sections merged into the grids they introduce (-2) and one
     * was added for React's overview CTAs, which this page never carried (+1).
     * Page total 19 -> 18.
     */
    const inventoryPath = path.join(PLUGIN, 'data/homepage-inventory.json')
    check('the section inventory ships beside the layout', exists(inventoryPath))

    if (exists(inventoryPath)) {
      const inv = JSON.parse(read(inventoryPath))
      const expected = inv.sections.length

      check(
        `the shipped layout has ${expected} sections, as the inventory declares`,
        Array.isArray(parsedLayout.content) && parsedLayout.content.length === expected,
        `${parsedLayout.content?.length} vs inventory ${expected}`,
      )

      const drift = inv.sections
        .filter((row, i) => parsedLayout.content[i]?.id !== row.elementId)
        .map((row) => `#${row.index} ${row.component}`)
      check('every inventory row matches the envelope section at its index', drift.length === 0, drift.join(' | '))

      check(
        'every inventory row names a React component',
        inv.sections.every((row) => typeof row.component === 'string' && row.component.length > 0),
      )
    }
  }
  // Fake data is the addendum's rule, and the React source's realistic personal
  // names are exactly what must not be carried over.
  check('uses demo contacts, not the React names', mock.includes('Khách hàng A') && !mock.includes('Nguyễn Văn Minh'))
  check('uses example.com addresses', mock.includes('example.com'))
  check('phone numbers are masked', /\d{3} \*\*\* \*\*\d{2}/.test(mock))
  check('controls are real buttons', mock.includes('<button type="button"') && mock.includes('aria-selected'))
}

if (exists(mockJs)) {
  const js = read(mockJs)
  check('honours prefers-reduced-motion', js.includes('prefers-reduced-motion'))
  check('pauses on a hidden tab', js.includes('visibilitychange') && js.includes('document.hidden'))
  // The chart DOES set bar heights, and that is fine: the bars sit inside a
  // container with a fixed height, so a taller bar cannot push the page. What
  // must never be animated is anything that participates in page flow —
  // position offsets, margins and padding — which is what this now checks, and
  // the fixed container height is asserted against the CSS below.
  check('animates nothing that participates in page flow', !/\.style\.(top|left|right|bottom|margin|padding)\s*=/.test(js))
  check('renders no innerHTML', !/\.innerHTML\s*[+]?=/.test(js))
}

if (exists(mockCss)) {
  const css = read(mockCss)
  check('reduced-motion disables the pulse', css.includes('@media (prefers-reduced-motion: reduce)'))
  check('lists reserve their height so filtering cannot shift the page', css.includes('min-height'))
  // The one place a script changes a height is the chart bars; the container
  // they grow inside is fixed, so the section below never moves.
  check('the chart container has a fixed height', /\.gcalls-mock__bars\s*\{[^}]*height:\s*\d/.test(css))
  const hexes = [...new Set([...css.matchAll(/#([0-9a-zA-Z]+)/g)].map((m) => m[1]))]
  check('all colour literals are valid hex', hexes.every((h) => [3, 4, 6, 8].includes(h.length) && /^[0-9a-fA-F]+$/.test(h)), hexes.filter((h) => !/^[0-9a-fA-F]+$/.test(h)).join(', '))
}

const masterMap = path.join(REPO, 'docs/content-review/images/image-master-map-007.json')
check('image master map generated', exists(masterMap))

if (exists(masterMap)) {
  const map = JSON.parse(read(masterMap))
  check('every visual has a replacement rule', map.every((row) => row.replacement))
  // A real screenshot must never appear under another product's name.
  const wrong = map.filter((row) => row.type.startsWith('real') && !['Trang chủ', 'gcalls-plus'].includes(row.product))
  check('real screenshots only on the home page and Gcalls Plus', wrong.length === 0, wrong.map((r) => `${r.product}:${r.filename}`).join(', '))
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

console.log('\nNOT RUN — requires a live WordPress on the hosting:')
for (const item of [
  'theme activation',
  'plugin activation',
  'Elementor editor load',
  'permalink /%postname%/ resolution',
  'HTTPS and www redirects against the real host',
  'X-Robots-Tag on a real response',
  'WordPress Site Health',
  'PHP warnings on the rendered front end',
  'GET /?author=1 returns 404 with no Location header',
  'GET /author/<slug>/ returns 404',
  'oEmbed response carries no author_name or author_url',
  'GET /wp-json/wp/v2/users returns 401 to an anonymous caller',
  'the import itself — dry run then execute, from Tools > Gcalls Import',
  'Elementor renders the imported home page template',
  'the 18 articles appear under 7 hubs on /blog/',
  'nav menus assigned to the primary and footer locations',
  'the full corpus import — 250 posts, 44 gone URLs',
  'the 24 retired URLs answer 410',
  'the 20 removed spam URLs answer 410',
]) {
  console.log(`  --   ${item}`)
}

/* ------------------------------------------------------------------ *
 * Checkpoint 008 — the interactive product visuals
 *
 * The 008 pack arrived as a plugin ZIP built outside this repository, so the
 * things it added exist only as long as something here asserts them. Each of
 * these is a defect that shipped once and would not have failed any other gate.
 * ------------------------------------------------------------------ */

console.log('\n19. Checkpoint 008 — product visuals')

const GALLERY_DIR = path.join(PLUGIN, 'assets/images/product-gallery')
const GALLERY_FILES = [
  'webphone-overview.webp',
  'customer-profile.webp',
  'call-history.webp',
  'analytics-dashboard.webp',
  'agent-performance.webp',
  'click-to-call.webp',
]

const missingGallery = GALLERY_FILES.filter((name) => !exists(path.join(GALLERY_DIR, name)))
check('the six gallery images are present', missingGallery.length === 0, missingGallery.join(', '))

// The 0.8.6 hero images: one per product that has no real screenshot. Built by
// build-demo-imagery.mjs, which is where the anonymisation rules live.
const DEMO_FILES = [
  'gcalls-cx-omnichannel-demo.webp',
  'voicebot-flow-builder-demo.webp',
  'qc-scoring-dashboard-demo.webp',
]

const missingDemo = DEMO_FILES.filter((name) => !exists(path.join(GALLERY_DIR, name)))
check('the three product demo images are present', missingDemo.length === 0, missingDemo.join(', '))

const ALL_IMAGES = [...GALLERY_FILES, ...DEMO_FILES]

// Half a megabyte each would be 3 MB of hero, on a page a phone loads first.
const oversized = ALL_IMAGES.filter((name) => {
  const file = path.join(GALLERY_DIR, name)
  return exists(file) && fs.statSync(file).size > 500 * 1024
})
check('every product image is under 500 KB', oversized.length === 0, oversized.join(', '))

// WebP begins RIFF....WEBP. A PNG renamed .webp passes every other check here
// and fails only in the browser.
const notWebp = ALL_IMAGES.filter((name) => {
  const file = path.join(GALLERY_DIR, name)
  if (!exists(file)) return false
  const head = fs.readFileSync(file).subarray(0, 12)
  return head.subarray(0, 4).toString() !== 'RIFF' || head.subarray(8, 12).toString() !== 'WEBP'
})
check('every product image really is WebP', notWebp.length === 0, notWebp.join(', '))

// The plugin header is what WordPress shows on the Plugins screen; VERSION is
// what every wp_enqueue_* call appends to its asset URL. Bump one without the
// other and the admin reports a new version while browsers keep serving the
// old CSS from cache — which is exactly how a deployed fix looks like it did
// not deploy.
const bootstrapPhp = read(path.join(PLUGIN, 'gcalls-core.php'))
const headerVersion = bootstrapPhp.match(/^\s*\*\s*Version:\s*(\S+)\s*$/m)?.[1]
const constVersion = bootstrapPhp.match(/^const VERSION = '([^']+)';$/m)?.[1]

check('the plugin declares a header version', Boolean(headerVersion), String(headerVersion))
check('the plugin declares a VERSION constant', Boolean(constVersion), String(constVersion))
check(
  'the header version and VERSION agree',
  Boolean(headerVersion) && headerVersion === constVersion,
  `header ${headerVersion} vs const ${constVersion}`
)

const mockupsPhp = read(path.join(PLUGIN, 'includes/class-mockups.php'))
const mockupsJs = read(path.join(PLUGIN, 'assets/js/mockups.js'))

check('the gallery mockup exists', mockupsPhp.includes('mock_plus_gallery'))

// The three hero shots. Each needs a renderer and each renderer needs to name
// its own file — a showcase method that points at the wrong image would show
// one product under another product's heading, which is the failure the
// "no two products share a hero visual" check further down exists to catch.
const SHOWCASES = [
  ['mock_cx_showcase', 'gcalls-cx-omnichannel-demo.webp'],
  ['mock_voicebot_showcase', 'voicebot-flow-builder-demo.webp'],
  ['mock_qc_showcase', 'qc-scoring-dashboard-demo.webp'],
]

for (const [method, file] of SHOWCASES) {
  check(`${method} exists`, mockupsPhp.includes(method))
  check(`${method} names ${file}`, mockupsPhp.includes(file))
}

// A hero image with no alt is a hero that says nothing to a screen reader, and
// the three of them are the only images on their pages.
check(
  'every showcase image carries alt text',
  (mockupsPhp.match(/alt="' \. esc_attr\( \$alt \)/g) ?? []).length > 0 ||
    /function showcase\([\s\S]*?alt=/.test(mockupsPhp)
)

// The interactive panels are the reason the hero could become a picture: they
// still carry the clicking. If one disappeared, the picture would be all that
// is left and the page would have no demo you can operate.
for (const panel of ['mock_cx_inbox', 'mock_voicebot_builder', 'mock_qc_transcript']) {
  check(`${panel} survives as an interactive panel`, mockupsPhp.includes(panel))
}

// The QC page names its speakers this way in the addendum, in the picture and
// in the panel — three places that have to agree.
for (const speaker of ['Khách hàng A', 'Nhân viên 01']) {
  check(`the QC transcript says "${speaker}"`, mockupsPhp.includes(speaker))
}

const galleryStates = ['Tổng quan', 'Khách hàng', 'Lịch sử gọi', 'Thống kê', 'Hiệu suất', 'Click-to-Call']
const missingStates = galleryStates.filter((label) => !mockupsPhp.includes(label))
check('the gallery has all six states', missingStates.length === 0, missingStates.join(', '))

check('the gallery is wired up', mockupsJs.includes('wireGallery'))

// A tab strip that only answers the mouse is not a tab strip.
for (const key of ['ArrowLeft', 'ArrowRight']) {
  check(`the gallery answers ${key}`, mockupsJs.includes(key))
}
check('the gallery marks the selected tab', mockupsJs.includes('aria-selected'))

// Roving tabindex: exactly one tab in the strip is reachable by Tab, and the
// arrows move it. Without it Tab walks through all six before leaving.
check('the gallery uses a roving tabindex', /tabIndex|tabindex/.test(mockupsJs))

// innerHTML with anything but a literal is how a mockup becomes an injection
// point. The mockups build DOM nodes instead.
check('the mockups never assign innerHTML', !mockupsJs.includes('innerHTML'))

const productJson = path.join(PLUGIN, 'data/product-pages.json')

if (!exists(productJson)) {
  check('product-pages.json exists', false)
} else {
  const productPages = JSON.parse(read(productJson)).pages ?? {}
  const HERO_VISUAL = {
    'gcalls-plus': 'plus_gallery',
    cx: 'cx_inbox',
    voicebot: 'voicebot_builder',
    'qa-qc': 'qc_review',
  }

  const wrongHero = Object.entries(HERO_VISUAL)
    .filter(([id, want]) => (productPages[id]?.hero?.mockup ?? '') !== want)
    .map(([id, want]) => `${id} wants ${want}, has "${productPages[id]?.hero?.mockup ?? ''}"`)

  check('all four product heroes carry their own visual', wrongHero.length === 0, wrongHero.join('; '))

  // Never the same visual twice: reusing the Gcalls Plus gallery on Voicebot
  // would show one product and label it another, which the 007 addendum
  // forbids in as many words.
  const heroes = Object.values(HERO_VISUAL)
  check('no two products share a hero visual', new Set(heroes).size === heroes.length)
}

const shortcodesSrc = read(path.join(PLUGIN, 'includes/class-shortcodes.php'))

// One FAQ, from product-pages.json. The page rendered two for a while: the
// manifest's, and a second from self::faq() reading post meta.
check(
  'the product page renders one FAQ, not two',
  !/\$out \.= self::faq\(/.test(shortcodesSrc),
)

// A card title heads a description or it is not a heading. Both blanket
// answers have shipped: all-h3 gave 76 headings against the reference's 59,
// all-paragraph gave 31.
// The exporter marks each section `cards` or not; the renderer must read that
// mark rather than guess from the item's shape. Three different guesses have
// shipped, each measurably wrong against the reference.
check(
  'card titles are headings only in card sections',
  /\$title_tag = empty\( \$section\['cards'\] \) \? 'p' : 'h3'/.test(shortcodesSrc),
)

const productBuilder = read(path.join(WP, 'scripts/build-product-content.mjs'))
check('the exporter classifies each section as cards or bullets', /const cards = CARD_KEYS\.includes\(listKey\)/.test(productBuilder))

for (const note of notes) console.log(`\nnote: ${note}`)

console.log(`\nfailures: ${failures.length}`)
process.exit(failures.length === 0 ? 0 : 1)
