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
const rawEcho = []
for (const file of phpFiles) {
  const source = read(file)
  source.split('\n').forEach((line, index) => {
    if (/\becho\s+\$[a-z_]/i.test(line) && !/esc_|wp_kses|wp_json_encode/.test(line)) {
      rawEcho.push(`${path.relative(REPO, file)}:${index + 1}`)
    }
  })
}
check('no unescaped `echo $var`', rawEcho.length === 0, rawEcho.join(', '))

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

// The pipeline must not be able to reach a production system.
const networkCalls = phpFiles
  .filter((f) => f.startsWith(PLUGIN))
  .filter((f) => /wp_remote_(get|post|request)|curl_exec|file_get_contents\(\s*['"]https?:/.test(read(f)))
check('pipeline makes no outbound HTTP calls', networkCalls.length === 0, networkCalls.join(', '))

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
    check('no hardcoded uploads URL', !/wp-content\\\/uploads/.test(flat))
    check('images placed via [gcalls_media]', flat.includes('gcalls_media id='))

    // Charts are static SVG: there is no chart library on this site.
    check('charts are inline SVG', flat.includes('<svg'))
    check('illustrative figures are labelled as such', flat.includes('dữ liệu minh họa'))

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

for (const note of notes) console.log(`\nnote: ${note}`)

console.log(`\nfailures: ${failures.length}`)
process.exit(failures.length === 0 ? 0 : 1)
