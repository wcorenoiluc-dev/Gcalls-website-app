<?php
/**
 * GCALLS-053 — contract test for the content-page card renderer.
 *
 * WHY THIS EXISTS
 * content-pages.json carried `supporting`, `tags`, `cta` and `current` and the
 * renderer's key vocabulary had no slot for any of them, so fifteen cards on
 * the three hub landing pages shipped as a title over one sentence and eight
 * boundary cards lost the marker saying which one the reader is on. Nothing
 * caught it: the sections were not empty, so the completeness test passed, and
 * the renderer obeyed the manifest, so the renderer test passed.
 *
 * That is why this test locks an EXPECTED INVENTORY rather than asserting
 * "not empty". A count that must be six fails when it becomes five; a count
 * that must merely be non-zero never fails at all.
 *
 * It asserts against RENDERED MARKUP, not against the manifest. The manifest
 * agreeing with itself is not evidence — that is exactly the condition that
 * held while the fields were being dropped.
 *
 * Run: php wordpress/tests/content-card-parity-test.php
 *      GCALLS_CORE_DIR=/path/to/gcalls-core/ php wordpress/tests/content-card-parity-test.php
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

define( 'ABSPATH', __DIR__ );

$gcalls_core = getenv( 'GCALLS_CORE_DIR' ) ?: dirname( __DIR__ ) . '/wp-content/plugins/gcalls-core/';
$gcalls_core = rtrim( (string) $gcalls_core, '/' ) . '/';

if ( ! is_dir( $gcalls_core ) ) {
	echo "FATAL: plugin directory not found: $gcalls_core\n";
	exit( 2 );
}

define( 'GCALLS_CORE_DIR', $gcalls_core );
define( 'GCALLS_CORE_URL', 'https://example.test/wp-content/plugins/gcalls-core/' );

if ( ! defined( 'Gcalls\\Core\\VERSION' ) ) {
	define( 'Gcalls\\Core\\VERSION', '0.0.0-test' );
}

/* ---- WordPress stubs. Nothing here touches a database. ---- */
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_url( $u ) { return htmlspecialchars( (string) $u, ENT_QUOTES, 'UTF-8' ); }
function esc_html__( $t, $d = null ) { return esc_html( $t ); }
function esc_attr__( $t, $d = null ) { return esc_attr( $t ); }
function __( $t, $d = null ) { return $t; }
function is_singular( $t = null ) { return false; }
function get_post( $p = null ) { return null; }
function get_option( $k, $default = false ) { return $default; }
function home_url( $p = '' ) { return 'https://example.test' . $p; }
function add_filter( ...$a ) { return true; }
function add_action( ...$a ) { return true; }
function wp_enqueue_style( ...$a ) { return true; }
function shortcode_exists( $t ) { return false; }
function do_shortcode( $c ) { return $c; }
function _n( $single, $plural, $n, $d = null ) { return 1 === (int) $n ? $single : $plural; }

/* The published-post count is injected so the test can prove BOTH branches of
 * the derived status without a database: the renderer must show a real count
 * when there are posts, and say the category is being edited when there are
 * none. $GLOBALS is the seam because wp_count_posts() is a global function. */
function wp_count_posts( $type = 'post' ) {
	return (object) array( 'publish' => (int) ( $GLOBALS['gcalls_test_published'] ?? 0 ) );
}

require_once GCALLS_CORE_DIR . 'includes/class-content-pages.php';

/* ---- tiny harness ---- */
$pass = 0;
$fail = 0;
function ok( string $name, bool $cond, string $detail = '' ): void {
	global $pass, $fail;
	if ( $cond ) { $pass++; echo "  ok    $name\n"; }
	else { $fail++; echo "  FAIL  $name" . ( '' !== $detail ? " — $detail" : '' ) . "\n"; }
}

$manifest = json_decode( (string) file_get_contents( GCALLS_CORE_DIR . 'data/content-pages.json' ), true );
if ( ! is_array( $manifest ) || empty( $manifest['pages'] ) ) {
	echo "FATAL: content-pages.json unreadable\n";
	exit( 2 );
}
$pages = array();
foreach ( $manifest['pages'] as $p ) { $pages[ $p['slug'] ] = $p; }

/* card() is private by design — it is an implementation detail of section().
 * The contract being tested is its OUTPUT, so it is reached by reflection
 * rather than by widening the class's surface for a test. */
$card_method = new ReflectionMethod( 'Gcalls\\Core\\Content_Pages', 'card' );
$card_method->setAccessible( true );
$render_card = static fn( array $c ): string => (string) $card_method->invoke( null, $c );

$section_method = new ReflectionMethod( 'Gcalls\\Core\\Content_Pages', 'section' );
$section_method->setAccessible( true );
$render_section = static fn( array $s ): string => (string) $section_method->invoke( null, $s );

/**
 * THE LOCKED INVENTORY.
 *
 * Each entry is what the page must render, not a floor it must clear. The
 * counts come from content-pages.json as reviewed; changing one of these
 * numbers is a content decision that should show up in a diff.
 */
$expected = array(
	/* `supporting` is present-but-empty on most cards and `tags` is an empty
	 * array on two of the Solutions cards. These counts are what actually
	 * RENDERS, so an empty value counts as absent — an empty label element is
	 * a rendering bug, not a restored field. */
	'san-pham'   => array( 'sections' => 4, 'cards_from' => 'cards', 'cards' => 3, 'supporting' => 1, 'tags' => 3, 'cta' => 3, 'current' => 0 ),
	'giai-phap'  => array( 'sections' => 4, 'cards_from' => 'cards', 'cards' => 7, 'supporting' => 1, 'tags' => 5, 'cta' => 7, 'current' => 0 ),
	'tich-hop'   => array( 'sections' => 4, 'cards_from' => 'cards', 'cards' => 5, 'supporting' => 5, 'tags' => 0, 'cta' => 5, 'current' => 0 ),
	'nganh'      => array( 'sections' => 1, 'cards_from' => 'industries/index — hub', 'cards' => 6, 'supporting' => 0, 'tags' => 6, 'cta' => 6, 'current' => 0 ),
	/* Six tag lists, not five: five cards carry a static status from the React
	 * source, and Blog's is DERIVED from wp_count_posts() at request time. */
	'tai-nguyen' => array( 'sections' => 1, 'cards_from' => 'resources/index — RESOURCE_NAV', 'cards' => 6, 'supporting' => 0, 'tags' => 6, 'cta' => 6, 'current' => 0 ),
	/* Ported from COMPANY_HUB: a direct answer, three principles, a four-row
	 * guide and an onward link row — replacing a single section of two child
	 * links. The three principles each carry their own CTA. */
	'cong-ty'    => array( 'sections' => 4, 'cards_from' => 'cards', 'cards' => 3, 'supporting' => 0, 'tags' => 0, 'cta' => 3, 'current' => 0 ),
);

echo "\nHUB CARD FIELD PARITY\n";

foreach ( $expected as $slug => $want ) {
	if ( ! isset( $pages[ $slug ] ) ) { ok( "$slug exists in the manifest", false ); continue; }
	$page = $pages[ $slug ];

	ok( "$slug renders {$want['sections']} section(s)", count( $page['sections'] ) === $want['sections'],
		'got ' . count( $page['sections'] ) );

	$section = null;
	foreach ( $page['sections'] as $s ) {
		if ( ( $s['from'] ?? '' ) === $want['cards_from'] ) { $section = $s; break; }
	}
	if ( null === $section ) { ok( "$slug has its cards section", false, "no section from=\"{$want['cards_from']}\"" ); continue; }

	$html = $render_section( $section );

	$n_cards      = substr_count( $html, 'class="gcalls-cp__card' ) - substr_count( $html, 'gcalls-cp__card-' ) - substr_count( $html, 'gcalls-cp__card--current"' );
	$n_cards      = substr_count( $html, '<article class="gcalls-cp__card' );
	$n_supporting = substr_count( $html, 'gcalls-cp__card-supporting' );
	$n_taglists   = substr_count( $html, '<ul class="gcalls-cp__tags">' );
	$n_links      = substr_count( $html, 'gcalls-cp__card-link' );
	$n_current    = substr_count( $html, 'aria-current="true"' );

	ok( "$slug renders {$want['cards']} card(s)", $n_cards === $want['cards'], "got $n_cards" );
	ok( "$slug renders {$want['supporting']} supporting label(s)", $n_supporting === $want['supporting'], "got $n_supporting" );
	ok( "$slug renders {$want['tags']} tag list(s)", $n_taglists === $want['tags'], "got $n_taglists" );
	ok( "$slug renders {$want['current']} current marker(s)", $n_current === $want['current'], "got $n_current" );

	/* Every card that supplies its own CTA must use that wording, not the
	 * generic fallback that was overwriting all fifteen of them. */
	$generic = substr_count( $html, '>Tìm hiểu thêm</a>' );
	$want_generic = max( 0, $n_links - $want['cta'] );
	ok( "$slug uses its own CTA wording on {$want['cta']} link(s)", $generic === $want_generic,
		"generic labels: $generic, expected $want_generic (links $n_links)" );
}

/* ---- the Blog card's count is DERIVED, never written down ---- */
echo "\nDERIVED PUBLISHED COUNT\n";
$resources   = $pages['tai-nguyen'];
$res_section = null;
foreach ( $resources['sections'] as $s ) {
	if ( ( $s['from'] ?? '' ) === 'resources/index — RESOURCE_NAV' ) { $res_section = $s; break; }
}

$blog_card = null;
foreach ( $res_section['cards'] as $c ) {
	if ( 'Blog' === ( $c['title'] ?? '' ) ) { $blog_card = $c; break; }
}

ok( 'the Blog card names a count SOURCE rather than a number',
	'published_posts' === ( $blog_card['count_source'] ?? '' ) );
ok( 'the Blog card hardcodes no status tag', empty( $blog_card['tags'] ) );

/* No number from today may be frozen into the manifest. */
ok( 'no published-post count is written into the manifest',
	! preg_match( '/\b(18|230|250)\s*bài/u', json_encode( $manifest, JSON_UNESCAPED_UNICODE ) ) );

$GLOBALS['gcalls_test_published'] = 18;
$html_18 = $render_section( $res_section );
ok( 'with 18 published posts the card says 18', str_contains( $html_18, '18 bài đã đăng' ) );
ok( 'it never says the blog is empty when posts exist',
	! str_contains( $html_18, 'Chưa có bài viết' ) && ! str_contains( $html_18, 'Đang biên tập' ) );

$GLOBALS['gcalls_test_published'] = 41;
ok( 'the count follows the data, not a constant',
	str_contains( $render_section( $res_section ), '41 bài đã đăng' ) );

$GLOBALS['gcalls_test_published'] = 0;
$html_0 = $render_section( $res_section );
ok( 'with no published posts it says so honestly', str_contains( $html_0, 'Đang biên tập' ) );
ok( 'and claims no count', ! str_contains( $html_0, 'bài đã đăng' ) );

$GLOBALS['gcalls_test_published'] = 18;

/* ---- the boundary pages: `current` must reach the markup ---- */
echo "\nBOUNDARY 'current' MARKER\n";
$boundary_slugs = array( 'freshdesk', 'salesforce', 'zendesk', 'zoho-crm', 'tong-dai-quoc-te',
	'tong-dai-tich-hop-crm', 'tong-dai-tich-hop-helpdesk', 'tong-dai-tich-hop-pos' );
$total_current = 0;
foreach ( $boundary_slugs as $slug ) {
	if ( ! isset( $pages[ $slug ] ) ) { ok( "$slug exists", false ); continue; }
	$found = 0;
	foreach ( $pages[ $slug ]['sections'] as $s ) {
		if ( 'cards' !== ( $s['type'] ?? '' ) ) { continue; }
		$found += substr_count( $render_section( $s ), 'aria-current="true"' );
	}
	$total_current += $found;
	ok( "$slug marks exactly one current card", 1 === $found, "got $found" );
}
ok( 'eight boundary pages carry eight current markers in total', 8 === $total_current, "got $total_current" );

/* ---- the dropped steps note ---- */
echo "\nSTEPS SECTION NOTE\n";
$steps_notes = 0;
foreach ( $pages as $slug => $p ) {
	foreach ( $p['sections'] as $s ) {
		if ( 'steps' !== ( $s['type'] ?? '' ) || '' === trim( (string) ( $s['note'] ?? '' ) ) ) { continue; }
		$steps_notes++;
		ok( "$slug steps note reaches the markup", str_contains( $render_section( $s ), 'gcalls-cp__note' ) );
	}
}
ok( 'three steps sections carry a note', 3 === $steps_notes, "got $steps_notes" );

/* The partnership disclaimer is the one that matters most: without it the page
 * reads as a five-step path to a partnership that is not on offer. */
$doi_tac = $pages['doi-tac'] ?? null;
if ( $doi_tac ) {
	$html = '';
	foreach ( $doi_tac['sections'] as $s ) { $html .= $render_section( $s ); }
	ok( '/cong-ty/doi-tac/ still states that no step creates a partnership',
		str_contains( $html, 'không tạo ra quan hệ đối tác' ) || str_contains( $html, 'Không bước nào' ) );
}

echo "\ncontent-card-parity: $pass ok, $fail failed\n";
exit( $fail > 0 ? 1 : 0 );
