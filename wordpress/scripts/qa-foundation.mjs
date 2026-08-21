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

console.log('QA FOUNDATION — GCALLS-WORDPRESS-MIGRATION-003A\n')

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
 * 7. Server configuration
 * ------------------------------------------------------------------ */

console.log('\n7. Server configuration')
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
 * 8. Elementor
 * ------------------------------------------------------------------ */

console.log('\n8. Elementor')
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
 * 9. Git hygiene
 * ------------------------------------------------------------------ */

console.log('\n9. Git hygiene')
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
]) {
  console.log(`  --   ${item}`)
}

for (const note of notes) console.log(`\nnote: ${note}`)

console.log(`\nfailures: ${failures.length}`)
process.exit(failures.length === 0 ? 0 : 1)
