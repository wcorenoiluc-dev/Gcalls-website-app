<?php
/**
 * GCALLS-039 — proof that the raster-image hole found in GCALLS-038 is closed.
 *
 * The bug: class-mockups.php held two hardcoded frame lists that built image
 * URLs directly, bypassing media policy entirely. Six images carrying an
 * unapproved domain, fabricated identities and invented KPIs rendered on
 * /gcalls-plus-webphone/ and no test objected.
 *
 * These assertions are about REACHABILITY, not about markup: can a caller,
 * by any route this class exposes, cause an unapproved image to render?
 *
 * Run: php wordpress/tests/media-frames-test.php [--core-dir=PATH]
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

$opts        = getopt( '', array( 'core-dir::', 'expect-package' ) );
$gcalls_core = $opts['core-dir'] ?? getenv( 'GCALLS_CORE_DIR' )
	?: dirname( __DIR__ ) . '/wp-content/plugins/gcalls-core/';
$gcalls_core = rtrim( (string) $gcalls_core, '/' ) . '/';

if ( ! is_dir( $gcalls_core ) ) {
	fwrite( STDERR, "FATAL: plugin directory not found: $gcalls_core\n" );
	exit( 2 );
}

define( 'ABSPATH', __DIR__ );
define( 'GCALLS_CORE_DIR', $gcalls_core );
define( 'GCALLS_CORE_URL', 'https://example.test/wp-content/plugins/gcalls-core/' );

if ( ! defined( 'Gcalls\\Core\\VERSION' ) ) {
	define( 'Gcalls\\Core\\VERSION', '0.0.0-test' );
}

function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return htmlspecialchars( (string) $u, ENT_QUOTES, 'UTF-8' ); }
function esc_html__( $t, $d = '' ) { return esc_html( $t ); }
function esc_attr__( $t, $d = '' ) { return esc_attr( $t ); }
function __( $t, $d = '' ) { return $t; }
function sanitize_key( $k ) { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $k ) ); }
function shortcode_atts( $p, $a, $s = '' ) { return array_merge( $p, array_intersect_key( (array) $a, $p ) ); }
function apply_filters( $t, $v ) { return $v; }
function add_shortcode() {}
function wp_enqueue_style() {}
function wp_enqueue_script() {}

require_once GCALLS_CORE_DIR . 'includes/class-mockups.php';

use Gcalls\Core\Mockups;

$pass = 0;
$fail = 0;
function check( bool $ok, string $what ): void {
	global $pass, $fail;
	if ( $ok ) { ++$pass; echo "  ok    $what\n"; }
	else { ++$fail; echo "  FAIL  $what\n"; }
}

$registry = json_decode( (string) file_get_contents( GCALLS_CORE_DIR . 'data/media-frames.json' ), true );
check( is_array( $registry ) && ! empty( $registry['frames'] ), 'registry loads' );

$frames  = $registry['frames'];
$refused = array();
$passing = array();
foreach ( $frames as $id => $f ) {
	if ( 'PASS' === ( $f['verdict'] ?? '' ) ) { $passing[] = $id; } else { $refused[] = $id; }
}

/* 1 — every frame declares the full record the checkpoint requires. */
$incomplete = array();
foreach ( $frames as $id => $f ) {
	foreach ( array( 'file', 'verdict', 'kind', 'provenance', 'reason' ) as $k ) {
		if ( ! isset( $f[ $k ] ) || '' === $f[ $k ] ) { $incomplete[] = "$id.$k"; }
	}
	if ( ! in_array( $f['kind'] ?? '', array( 'real_product', 'illustrative' ), true ) ) {
		$incomplete[] = "$id.kind=" . ( $f['kind'] ?? '?' );
	}
}
check( empty( $incomplete ), 'every frame declares id/provenance/verdict/kind' . ( $incomplete ? ': ' . implode( ',', $incomplete ) : '' ) );

/* 2 — a PASS frame must carry alt text and the fixed label. */
$thin = array();
foreach ( $passing as $id ) {
	if ( '' === ( $frames[ $id ]['alt'] ?? '' ) ) { $thin[] = "$id.alt"; }
	if ( 'Giao diện minh hoạ · Dữ liệu mẫu' !== ( $frames[ $id ]['label'] ?? '' ) ) { $thin[] = "$id.label"; }
}
check( empty( $thin ), 'every PASS frame carries alt text and the fixed label' . ( $thin ? ': ' . implode( ',', $thin ) : '' ) );

/* 3 — the six GCALLS-038 offenders are all REFUSED. */
$offenders = array( 'webphone-overview', 'customer-profile', 'call-history', 'analytics-dashboard', 'agent-performance', 'click-to-call' );
$leaked    = array_filter( $offenders, static fn( $id ) => in_array( $id, $passing, true ) );
check( empty( $leaked ), 'the six offending frames are REFUSED' . ( $leaked ? ': ' . implode( ',', $leaked ) : '' ) );

/* 4 — REFUSED renders nothing, through the public entry point. */
$still = array();
foreach ( $refused as $id ) {
	$html = Mockups::render( array( 'id' => $id ) );
	if ( '' !== trim( $html ) ) { $still[] = $id; }
}
check( empty( $still ), 'no REFUSED frame renders through Mockups::render()' . ( $still ? ': ' . implode( ',', $still ) : '' ) );

/* 5 — the retired gallery renders nothing. */
check( '' === trim( Mockups::render( array( 'id' => 'plus_gallery' ) ) ), 'plus_gallery renders nothing' );

/* 5a — `analytics` renders the NEUTRAL panel, not the refused drawing.
 *
 * Returning '' here was the earlier behaviour and it was wrong: the home page
 * builds a section around this shortcode, so an empty string left a heading
 * over an empty column. The panel must render, and must state no quantity.
 */
$analytics = Mockups::render( array( 'id' => 'analytics' ) );
check( '' !== trim( $analytics ), 'analytics renders a panel rather than nothing' );
check( str_contains( $analytics, 'gcalls-mock__metrics' ), 'analytics renders the neutral reporting panel' );

/* 5b — none of the refused figures survive anywhere in that output. */
$figures = array( '114', '73%', '3:25', 'data-mock-series', 'data-mock-bar', 'Gcalls Analytics' );
$found   = array_values( array_filter( $figures, static fn( $f ) => str_contains( $analytics, $f ) ) );
check( empty( $found ), 'the refused KPI figures and trend markup are absent' . ( $found ? ': ' . implode( ',', $found ) : '' ) );

/* 5c — no digit is presented as a value at all. */
check( 0 === preg_match( '/<strong[^>]*>\s*[0-9]/', $analytics ), 'no numeric value is presented in the panel' );

/* 5d — it carries the fixed illustrative label. */
check( str_contains( $analytics, 'Giao diện minh hoạ · Dữ liệu mẫu' ), 'the neutral panel carries the fixed label' );

/* 5e — mock_analytics() is unreachable by ANY id, not merely unused. */
$reachable = array();
foreach ( array( 'analytics', 'Analytics', 'ANALYTICS', 'analytics ', 'mock_analytics', 'plus_gallery', 'plus-gallery' ) as $probe ) {
	$html = Mockups::render( array( 'id' => $probe ) );
	if ( str_contains( $html, 'Gcalls Analytics' ) || str_contains( $html, 'data-mock-series' ) ) {
		$reachable[] = $probe;
	}
}
check( empty( $reachable ), 'mock_analytics is unreachable by any id' . ( $reachable ? ': ' . implode( ',', $reachable ) : '' ) );

/* 6 — an unknown id renders nothing rather than warning or guessing. */
check( '' === trim( Mockups::render( array( 'id' => 'no_such_frame_at_all' ) ) ), 'unknown id renders nothing' );

/* 7 — a caller cannot smuggle a filename or URL in through the id. */
$smuggle = array(
	'webphone-overview.webp',
	'../../../assets/images/product-gallery/analytics-dashboard.webp',
	'https://evil.test/x.webp',
	'analytics-dashboard',
);
$got = array();
foreach ( $smuggle as $attempt ) {
	if ( '' !== trim( Mockups::render( array( 'id' => $attempt ) ) ) ) { $got[] = $attempt; }
}
check( empty( $got ), 'a filename or URL cannot be smuggled through the id' . ( $got ? ': ' . implode( ',', $got ) : '' ) );

/* 8 — no hardcoded frame list survives in the source. */
$src = (string) file_get_contents( GCALLS_CORE_DIR . 'includes/class-mockups.php' );
foreach ( $offenders as $id ) {
	// The registry holds filenames; the renderer must not.
	if ( str_contains( $src, $id . '.webp' ) ) { $got[] = $id; }
}
check( empty( $got ), 'no refused filename is hardcoded in class-mockups.php' );

/* 9 — exactly one place builds an image URL. */
check(
	2 === substr_count( $src, "assets/images/product-gallery/' . " ),
	'only frame() constructs a product-gallery URL (' . substr_count( $src, "assets/images/product-gallery/' . " ) . ' sites)'
);

/* 10 — every PASS frame's file actually exists. */
$missing = array_filter( $passing, static fn( $id ) => ! is_readable( GCALLS_CORE_DIR . 'assets/images/product-gallery/' . $frames[ $id ]['file'] ) );
check( empty( $missing ), 'every PASS frame file exists on disk' . ( $missing ? ': ' . implode( ',', $missing ) : '' ) );

/* 11 — EVERY mockup the home page asks for must render something.
 *
 * This is the assertion that would have caught the regression this checkpoint
 * found. data/homepage-elementor.json builds sections around nine
 * [gcalls_mockup] shortcodes; when `analytics` was made to return '', root
 * section 11 became a heading and a paragraph beside an empty column, and
 * nothing in the suite objected because no product page asks for that id.
 */
$home_json = GCALLS_CORE_DIR . 'data/homepage-elementor.json';
$home_ids  = array();

if ( is_readable( $home_json ) ) {
	// The layout is JSON, so the shortcode's quotes arrive escaped as \" —
	// unescape before matching rather than trying to spell that in the pattern.
	$home_raw = str_replace( '\\"', '"', (string) file_get_contents( $home_json ) );
	preg_match_all( '/\[gcalls_mockup\s+id="([a-z_]+)"/', $home_raw, $m );
	$home_ids = array_values( array_unique( $m[1] ) );
}

check( count( $home_ids ) >= 9, 'home page mockup ids were found in the layout (' . count( $home_ids ) . ')' );

$blank = array_values( array_filter( $home_ids, static fn( $id ) => '' === trim( Mockups::render( array( 'id' => $id ) ) ) ) );
check( empty( $blank ), 'every mockup the home page asks for renders' . ( $blank ? ': ' . implode( ',', $blank ) : '' ) );

/* 12 — GCALLS-040: the six REFUSED files are GONE from the package.
 *
 * Fail-closed rendering was never the whole problem. An image that ships is
 * fetchable by direct URL whatever the renderer decides, so the artifact must
 * not contain it. These assertions run against whatever --core-dir points at:
 * against the repository they are expected to FAIL for the six (the originals
 * are kept as evidence), and against an unpacked ZIP they must pass.
 */
$gallery_dir = GCALLS_CORE_DIR . 'assets/images/product-gallery/';

$declared_out = array();
$declared_in  = array();
foreach ( $frames as $id => $f ) {
	if ( ! array_key_exists( 'in_package', $f ) ) { $declared_out[] = "$id(undeclared)"; continue; }
	if ( true === $f['in_package'] ) { $declared_in[] = $id; } else { $declared_out[] = $id; }
}
check( 6 === count( $declared_out ) && 3 === count( $declared_in ), 'registry declares 3 packaged frames and 6 withheld (' . count( $declared_in ) . '/' . count( $declared_out ) . ')' );

/* Every frame the registry says it ships must be shipped. */
$absent_but_promised = array_filter( $declared_in, static fn( $id ) => ! is_readable( $gallery_dir . $frames[ $id ]['file'] ) );
check( empty( $absent_but_promised ), 'every in_package frame has its file' . ( $absent_but_promised ? ': ' . implode( ',', $absent_but_promised ) : '' ) );

/* And in_package must agree with verdict — a PASS frame may not be withheld,
 * a REFUSED frame may not be shipped. */
$disagree = array();
foreach ( $frames as $id => $f ) {
	if ( ( 'PASS' === ( $f['verdict'] ?? '' ) ) !== ( true === ( $f['in_package'] ?? null ) ) ) { $disagree[] = $id; }
}
check( empty( $disagree ), 'in_package agrees with verdict for every frame' . ( $disagree ? ': ' . implode( ',', $disagree ) : '' ) );

// --expect-package: assert the artifact-only facts. Environment variables do
// not cross into the WASM runtime, so this is a CLI option rather than a getenv.
if ( isset( $opts['expect-package'] ) ) {
	$still_there = array_filter( $declared_out, static fn( $id ) => is_readable( $gallery_dir . $frames[ $id ]['file'] ) );
	check( empty( $still_there ), 'no withheld frame file is in the package' . ( $still_there ? ': ' . implode( ',', $still_there ) : '' ) );

	$files_on_disk = array_values( array_diff( scandir( $gallery_dir ), array( '.', '..' ) ) );
	check( 3 === count( $files_on_disk ), 'the package ships exactly 3 gallery images (' . count( $files_on_disk ) . ')' );
}

/* 13 — GCALLS-040: the home page is thirteen compositions, and every widget
 * that was in the eighteen is still there. */
$home_inv = GCALLS_CORE_DIR . 'data/homepage-inventory.json';
if ( is_readable( $home_inv ) && is_readable( $home_json ) ) {
	$inv  = json_decode( (string) file_get_contents( $home_inv ), true );
	$home = json_decode( (string) file_get_contents( $home_json ), true );

	check( 13 === count( $inv['sections'] ?? array() ), 'inventory lists 13 compositions (' . count( $inv['sections'] ?? array() ) . ')' );
	check( 13 === count( $home['content'] ?? array() ), 'layout emits 13 root sections (' . count( $home['content'] ?? array() ) . ')' );

	// Every one of the eighteen source sections is claimed exactly once.
	$claimed = array();
	foreach ( $inv['sections'] ?? array() as $sec ) {
		foreach ( $sec['mergedFrom'] ?? array() as $i ) { $claimed[] = $i; }
	}
	sort( $claimed );
	check( range( 0, 17 ) === $claimed, 'all 18 source sections are claimed exactly once (' . count( $claimed ) . ')' );

	// The seam between two compositions is 50px, and only the outer edges differ.
	$seams = array();
	$pads  = array();
	foreach ( $home['content'] as $sec ) {
		$p      = $sec['settings']['padding'] ?? array();
		$pads[] = array( (int) ( $p['top'] ?? -1 ), (int) ( $p['bottom'] ?? -1 ) );
	}
	for ( $i = 1; $i < count( $pads ); $i++ ) { $seams[] = $pads[ $i - 1 ][1] + $pads[ $i ][0]; }
	$bad_seams = array_values( array_filter( $seams, static fn( $s ) => 50 !== $s ) );
	check( empty( $bad_seams ), 'every seam between compositions is 50px' . ( $bad_seams ? ': ' . implode( ',', $bad_seams ) : '' ) );
	check( 56 === $pads[0][0] && 56 === $pads[ count( $pads ) - 1 ][1], 'hero top and final-CTA bottom are 56px' );
}

/* 14 — GCALLS-041: NO mockup, anywhere, renders an unsourced figure.
 *
 * The hero strip was found only when the home page was rendered for the first
 * time in GCALLS-040, because every earlier check looked at the four product
 * pages and the hero is not on them. This asserts the rule over EVERY id the
 * class exposes, so the next drawing cannot reintroduce it on a surface nobody
 * happened to screenshot.
 */
$all_ids = array();
foreach ( get_class_methods( Mockups::class ) as $m ) { /* public only; ids come from the map below */ }

$probe_ids = array(
	'hero', 'call_timeline', 'crm', 'analytics', 'cloud', 'customer_popup',
	'widget', 'integrations', 'work_anywhere', 'cx_report', 'cx_inbox',
	'voicebot_builder', 'voicebot_flow', 'qc_dashboard', 'qc_scorecard',
	'api', 'routing', 'security', 'plus_gallery',
);

$with_figures = array();
$rendered     = 0;

foreach ( $probe_ids as $probe ) {
	$html = Mockups::render( array( 'id' => $probe ) );

	if ( '' === trim( $html ) ) { continue; }

	++$rendered;

	// A digit inside the element that presents a VALUE. Labels, timestamps in
	// list rows and masked phone numbers are not values; <strong>/<b> in a
	// tile, KPI or meter is.
	/*
	 * One narrow exemption: `gcalls-crit__w` is a scorecard criterion WEIGHT.
	 * It defines the rubric (20/30/30/20, summing to 100) rather than reporting
	 * an outcome, and stripping it would leave criteria with no weighting at
	 * all. The exemption is by class, so it covers exactly this and nothing
	 * else — a figure anywhere else still fails.
	 */
	$values = preg_replace( '/<b class="gcalls-crit__w">[^<]*<\\/b>/', '', $html );

	if ( preg_match( '/<(strong|b|em)[^>]*>\\s*[0-9]/', $values, $m ) ) {
		$with_figures[] = $probe;
	}
}

check( $rendered >= 10, "at least ten mockups rendered for the figure sweep ($rendered)" );
check( empty( $with_figures ), 'no mockup presents a numeric figure' . ( $with_figures ? ': ' . implode( ',', $with_figures ) : '' ) );

/* 15 — every rendered mockup carries the fixed illustrative label. */
$unlabelled = array();
foreach ( $probe_ids as $probe ) {
	$html = Mockups::render( array( 'id' => $probe ) );
	if ( '' === trim( $html ) ) { continue; }
	if ( ! str_contains( $html, 'Giao diện minh hoạ · Dữ liệu mẫu' ) ) { $unlabelled[] = $probe; }
}
check( empty( $unlabelled ), 'every rendered mockup carries the fixed label' . ( $unlabelled ? ': ' . implode( ',', $unlabelled ) : '' ) );

/* 16 — tiles() cannot be handed a value any more. */
$src_m = (string) file_get_contents( GCALLS_CORE_DIR . 'includes/class-mockups.php' );
check(
	1 === preg_match( '/private static function tiles\( array \$labels \): string/', $src_m ),
	'tiles() accepts labels only — a caller cannot supply a figure'
);

$ran = $pass + $fail;
echo "\nmedia-frames-test: $pass ok, $fail failed ($ran assertions ran)\n";

if ( $ran < 33 ) {
	fwrite( STDERR, "FATAL: only $ran assertion(s) ran\n" );
	exit( 2 );
}

exit( $fail > 0 ? 1 : 0 );
