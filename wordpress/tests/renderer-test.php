<?php
/**
 * GCALLS-036C — PHP-side contract test for the semantic renderer.
 *
 * WHY THIS EXISTS
 * The Node preview and the PHP renderer read the same contract, so they cannot
 * disagree about WHICH component a section gets. Nothing so far has executed
 * the PHP at all — there is no PHP runtime on the authoring machine — so the
 * escaping, the attribution assembly and the actual markup have never run.
 * This is the file that runs them, in CI, on the three PHP versions WordPress
 * supports.
 *
 * It stubs the handful of WordPress functions the renderer touches rather than
 * booting WordPress: the renderer is deliberately read-only and framework-thin,
 * and a stub makes "does this write to the database" answerable by the absence
 * of a stub rather than by inspection.
 *
 * Run: php wordpress/tests/renderer-test.php
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

define( 'ABSPATH', __DIR__ );

/*
 * The plugin location is derived from this file's position by default, which
 * assumes the repository layout (wordpress/tests/ next to wordpress/wp-content/).
 * That assumption breaks the moment the test is mounted anywhere else — under
 * PHP WASM it resolved to "//wp-content/..." and died before asserting anything.
 * --core-dir makes the location an input like the manifest already is.
 */
$gcalls_cli    = getopt( '', array( 'core-dir::' ) );
$gcalls_core   = $gcalls_cli['core-dir'] ?? getenv( 'GCALLS_CORE_DIR' )
	?: dirname( __DIR__ ) . '/wp-content/plugins/gcalls-core/';
$gcalls_core   = rtrim( (string) $gcalls_core, '/' ) . '/';

if ( ! is_dir( $gcalls_core ) ) {
	fwrite( STDERR, "FATAL: plugin directory not found: $gcalls_core\n" );
	exit( 2 );
}

define( 'GCALLS_CORE_DIR', $gcalls_core );

/*
 * The plugin bootstrap (gcalls-core.php) is not loaded here — it would register
 * hooks and post types this test has no business running. But class-mockups.php
 * cache-busts its assets with the namespaced VERSION constant that bootstrap
 * defines, so it must exist or rendering dies. Test-only value: nothing asserts
 * on it, and a real load would overwrite it.
 */
if ( ! defined( 'Gcalls\\Core\\VERSION' ) ) {
	define( 'Gcalls\\Core\\VERSION', '0.0.0-test' );
}
define( 'GCALLS_CORE_URL', 'https://example.test/wp-content/plugins/gcalls-core/' );

/* ---- WordPress stubs. Nothing here touches a database. ---- */
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) {
	$u = (string) $u;
	// Mirrors the shape of WP's behaviour for the schemes this renderer emits.
	if ( '' === $u ) { return ''; }
	if ( ! preg_match( '#^(https?:|mailto:|tel:|/|\#)#i', $u ) ) { return ''; }
	return htmlspecialchars( $u, ENT_QUOTES, 'UTF-8' );
}
function esc_html__( $t, $d = '' ) { return esc_html( $t ); }
function __( $t, $d = '' ) { return $t; }
function sanitize_html_class( $c ) { return preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $c ); }
function sanitize_text_field( $t ) { return trim( strip_tags( (string) $t ) ); }
function sanitize_key( $k ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $k ) ); }
function apply_filters( $tag, $value ) { return $value; }
function add_shortcode( $tag, $cb ) {}
function shortcode_atts( $pairs, $atts, $shortcode = '' ) { return array_merge( $pairs, array_intersect_key( (array) $atts, $pairs ) ); }
function home_url( $path = '' ) { return 'https://example.test' . $path; }
/* add_query_arg(): only the array-of-pairs form the renderer uses. */
function add_query_arg( $args, $url = '' ) {
	if ( ! is_array( $args ) || empty( $args ) ) { return (string) $url; }
	$parts = array();
	foreach ( $args as $k => $v ) { $parts[] = rawurlencode( (string) $k ) . '=' . rawurlencode( (string) $v ); }
	return (string) $url . ( str_contains( (string) $url, '?' ) ? '&' : '?' ) . implode( '&', $parts );
}
function esc_url_raw( $u ) { return (string) $u; }
function esc_attr__( $t, $d = '' ) { return esc_attr( $t ); }
function _n( $s, $p, $n, $d = '' ) { return $n > 1 ? $p : $s; }
function wp_json_encode( $v ) { return json_encode( $v ); }
function number_format_i18n( $n, $dec = 0 ) { return number_format( (float) $n, (int) $dec ); }
function get_option( $k, $default = false ) { return $default; }
function wp_kses_post( $t ) { return (string) $t; }
function is_wp_error( $t ) { return false; }
function wp_unique_id( $prefix = '' ) { static $i = 0; return $prefix . ( ++$i ); }
function wp_enqueue_style() {}
function wp_enqueue_script() {}
function wp_localize_script() {}
function do_action() {}
/*
 * READS ARE REAL; WRITES MUST NOT BE.
 *
 * This used to throw on any get_posts(), on the belief that the renderer never
 * touches the database. Running it proved otherwise: a section carrying an
 * approved `media` id goes Sections::visual() -> Shortcodes::media() ->
 * Importer::find_media(), which IS a get_posts() lookup for the attachment.
 * Throwing turned a legitimate read into a fatal error and killed the run.
 *
 * So reads are now counted rather than forbidden, and writes are what must be
 * zero. The old assertion for this was `check( true, ... )` — a tautology that
 * would have reported "ok" no matter what the renderer did.
 */
$GLOBALS['db_reads']  = 0;
$GLOBALS['db_writes'] = 0;

function get_posts( $args = array() ) { ++$GLOBALS['db_reads']; return array(); }
function get_post( $id = null ) { ++$GLOBALS['db_reads']; return null; }

class Gcalls_Test_Wpdb {
	public $prefix = 'wp_';
	public function query( $sql ) { ++$GLOBALS['db_writes']; throw new RuntimeException( 'renderer must not write: ' . $sql ); }
	public function insert() { ++$GLOBALS['db_writes']; throw new RuntimeException( 'renderer must not insert' ); }
	public function update() { ++$GLOBALS['db_writes']; throw new RuntimeException( 'renderer must not update' ); }
	public function delete() { ++$GLOBALS['db_writes']; throw new RuntimeException( 'renderer must not delete' ); }
	public function get_results( $sql ) { ++$GLOBALS['db_reads']; return array(); }
	public function get_var( $sql ) { ++$GLOBALS['db_reads']; return null; }
}
$GLOBALS['wpdb'] = new Gcalls_Test_Wpdb();
function wp_get_attachment_image() { return '<img src="x.webp" alt="" width="10" height="10" />'; }

/*
 * Sections::visual() calls Shortcodes::media() for an approved screenshot, and
 * Mockups::render() for a drawn one. Loading only Icons and Sections made the
 * very first real execution of this file die with "Class Shortcodes not found"
 * on the third assertion — the split component reaches both. WordPress loads
 * all of them together, so the test must too.
 */
require_once GCALLS_CORE_DIR . 'includes/class-importer.php';
require_once GCALLS_CORE_DIR . 'includes/class-icons.php';
require_once GCALLS_CORE_DIR . 'includes/class-mockups.php';
require_once GCALLS_CORE_DIR . 'includes/class-shortcodes.php';
require_once GCALLS_CORE_DIR . 'includes/class-sections.php';

use Gcalls\Core\Icons;
use Gcalls\Core\Sections;

$pass = 0;
$fail = 0;
function check( bool $ok, string $what ): void {
	global $pass, $fail;
	if ( $ok ) { ++$pass; echo "  ok    $what\n"; }
	else { ++$fail; echo "  FAIL  $what\n"; }
}

/**
 * Hard stop. Used where continuing would produce a green run over the wrong
 * input — a missing manifest, a hash mismatch, a route that vanished. These
 * must never degrade into "0 tests, no failures, exit 0".
 */
function fatal( string $why ): void {
	fwrite( STDERR, "FATAL: $why\n" );
	exit( 2 );
}

/* ---------------------------------------------------------------------------
 * INPUT SELECTION — by parameter, never by a hardcoded session path.
 *
 * GCALLS-036C found two scripts pointing at a previous session's scratchpad
 * directory; one crashed and the other silently checked nothing and reported
 * "none". The artifact under test is therefore named explicitly, and every way
 * of failing to find it is fatal rather than empty.
 *
 *   --manifest=PATH   product-pages.json to render (default: the plugin's own)
 *   --sha256=HEX      require the manifest to hash to exactly this
 *   --min-checks=N    require at least N assertions to have run (default 15)
 * ------------------------------------------------------------------------ */
$opts = getopt( '', array( 'manifest::', 'sha256::', 'min-checks::' ) );

$manifest_path = $opts['manifest']
	?? getenv( 'GCALLS_MANIFEST' )
	?: GCALLS_CORE_DIR . 'data/product-pages.json';

if ( ! is_string( $manifest_path ) || ! is_file( $manifest_path ) ) {
	fatal( "manifest not found: $manifest_path" );
}

$manifest_raw = file_get_contents( $manifest_path );
if ( false === $manifest_raw || '' === $manifest_raw ) {
	fatal( "manifest unreadable or empty: $manifest_path" );
}

$manifest_hash = hash( 'sha256', $manifest_raw );
$want_hash     = $opts['sha256'] ?? getenv( 'GCALLS_MANIFEST_SHA256' );
if ( is_string( $want_hash ) && '' !== $want_hash && ! hash_equals( $want_hash, $manifest_hash ) ) {
	fatal( "manifest hash mismatch\n  want $want_hash\n  got  $manifest_hash" );
}

echo "manifest: $manifest_path\n";
echo "sha256:   $manifest_hash\n\n";

/* The four product routes this checkpoint is about. A manifest that has lost
   one of them is not a manifest this test may pass. */
const EXPECTED_ROUTES = array(
	'/gcalls-plus-webphone/',
	'/gcalls-cx/',
	'/voicebot-ai/',
	'/qc-bot-ai/',
);

/* ---- 1. contract loads and every manifest source resolves ---- */
$contract = Sections::contract();
check( ! empty( $contract['product'] ), 'contract loads' );

$manifest = json_decode( $manifest_raw, true );
if ( ! is_array( $manifest ) || empty( $manifest['pages'] ) || ! is_array( $manifest['pages'] ) ) {
	fatal( 'manifest did not decode to a pages map: ' . json_last_error_msg() );
}

$routes  = array();
foreach ( $manifest['pages'] as $page ) {
	if ( isset( $page['route'] ) ) { $routes[] = (string) $page['route']; }
}
$missing_routes = array_diff( EXPECTED_ROUTES, $routes );
if ( ! empty( $missing_routes ) ) {
	fatal( 'manifest is missing required route(s): ' . implode( ', ', $missing_routes ) );
}
check( true, 'all four product routes present in the manifest' );

$unmapped = array();
foreach ( $manifest['pages'] as $page ) {
	foreach ( $page['sections'] as $section ) {
		if ( null === Sections::resolve( (string) $section['source'], 'product' ) ) {
			$unmapped[] = $section['source'];
		}
	}
}
check( empty( $unmapped ), 'UNMAPPED_SOURCE: ' . ( $unmapped ? implode( ',', $unmapped ) : 'none' ) );

/* ---- 2. render every product page ---- */
$snapshots = array();
foreach ( $manifest['pages'] as $id => $page ) {
	$html                = Sections::render_product_sections( $page );
	$snapshots[ $id ]    = $html;
	$section_count       = substr_count( $html, '<section class="gc-section' );
	check( $section_count > 5, "$id renders $section_count sections" );
	check( false === strpos( $html, '<h1' ), "$id body sections contain no h1 (the hero owns it)" );
	check( false === strpos( $html, 'gcalls-product__grid' ), "$id emits no generic grid" );
}
check( empty( Sections::empty_sources() ), 'CONTENT_MISSING: ' . ( Sections::empty_sources() ? implode( ',', Sections::empty_sources() ) : 'none' ) );

/* ---- 3. an unknown source renders nothing and is recorded ---- */
$before = count( Sections::unmapped() );
$out    = Sections::render_product_sections( array( 'sections' => array( array( 'source' => 'NOT_A_REAL_SOURCE', 'heading' => 'X' ) ) ) );
check( '' === $out, 'unknown source renders nothing' );
check( count( Sections::unmapped() ) > $before, 'unknown source is recorded, not silently dropped' );

/* ---- 4. escaping: a hostile manifest cannot inject markup or a class ---- */
$hostile = array(
	'sections' => array(
		array(
			'source'  => 'GP_FEATURES',
			'heading' => '</h2><script>alert(1)</script>',
			'lead'    => '"><img src=x onerror=alert(1)>',
			'items'   => array( array( 'title' => '<b>t</b>', 'body' => '<script>x</script>', 'label' => 'a" class="evil' ) ),
		),
	),
);
$out = Sections::render_product_sections( $hostile );
check( false === strpos( $out, '<script>' ), 'no script tag survives escaping' );
/*
 * An event handler only matters if it is INSIDE a tag. Testing for the literal
 * "onerror=" failed on correctly-escaped output — the renderer emits
 * `&quot;&gt;&lt;img src=x onerror=alert(1)&gt;`, which is inert text, and the
 * substring is still present. Verified by dumping the render. So the assertion
 * asks the real question: did any tag acquire an on*= attribute?
 */
check(
	! preg_match( '/<[a-z][a-z0-9]*[^>]*\\son[a-z]+\\s*=/i', $out ),
	'no event handler survives escaping (no live on*= attribute on any tag)'
);
check( false === strpos( $out, 'class="evil' ), 'a label cannot break out into a class attribute' );

/* ---- 5. the source id never reaches the markup ---- */
$leaks = array();
foreach ( $snapshots as $id => $html ) {
	foreach ( array_keys( $contract['product'] ) as $source ) {
		if ( false !== strpos( $html, $source ) ) { $leaks[] = "$id:$source"; }
	}
}
check( empty( $leaks ), 'raw source id never appears in markup: ' . ( $leaks ? implode( ',', $leaks ) : 'none' ) );

/* ---- 6. CTA attribution uses the four allowed keys and nothing else ---- */
$cta_html = Sections::render_product_sections(
	array(
		'sections' => array(
			array(
				'source'  => 'GP_PRICING',
				'heading' => 'H',
				'lead'    => 'L',
				'cta'     => array( array( 'label' => 'Ask', 'intent' => 'demo', 'source' => 's', 'product' => 'p', 'evil' => 'x' ) ),
			),
		),
	)
);
check( false !== strpos( $cta_html, 'intent=demo' ), 'CTA carries its intent' );
check( false === strpos( $cta_html, 'evil' ), 'CTA drops any key outside the allowlist' );
check( false === strpos( $cta_html, 'solution=' ), 'CTA omits an empty attribution key rather than sending it blank' );

/* ---- 7. icon registry ---- */
check( '' === Icons::render( 'no-such-icon' ), 'an unknown icon key renders nothing' );
check( false !== strpos( Icons::render( 'check' ), 'aria-hidden="true"' ), 'icons are decorative' );
check( count( Icons::keys() ) > 40, 'icon registry is populated (' . count( Icons::keys() ) . ' keys)' );

/* ---- 8. database: reads are allowed and counted, writes must be zero ---- */
check(
	0 === $GLOBALS['db_writes'],
	'zero database writes during rendering (' . $GLOBALS['db_writes'] . ' writes, ' . $GLOBALS['db_reads'] . ' reads)'
);
check(
	$GLOBALS['db_reads'] > 0,
	'renderer DOES read the database for approved media (' . $GLOBALS['db_reads'] . ' reads) — recorded, not assumed away'
);

$ran        = $pass + $fail;
$min_checks = (int) ( $opts['min-checks'] ?? getenv( 'GCALLS_MIN_CHECKS' ) ?: 15 );

echo "\nrenderer-test: $pass ok, $fail failed ($ran assertions ran)\n";

/*
 * A run that asserted nothing is not a pass. Without this, deleting the body of
 * this file — or an early `return` — produces "0 ok, 0 failed" and exit 0, and
 * a release gate reading only the exit code would call that green.
 */
if ( $ran < $min_checks ) {
	fatal( "only $ran assertion(s) ran, expected at least $min_checks" );
}

exit( $fail > 0 ? 1 : 0 );
