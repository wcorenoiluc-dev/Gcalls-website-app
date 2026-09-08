<?php
/**
 * GCALLS-053 — the blog index must never claim to be empty while posts exist.
 *
 * WHAT WENT WRONG
 * home.php entered its grouped branch on `taxonomy_exists( 'gcalls_hub' )`
 * alone. gcalls-core registers that taxonomy on load, so the answer is yes on
 * any site with the plugin active — including one where no article has been
 * filed under a hub. The branch then found `get_terms( hide_empty => true )`
 * empty and took its own else, which prints template-parts/content-none.php:
 * "Chưa có bài viết nào trong mục này." on an archive holding eighteen
 * PUBLISHED articles. The posts were never consulted. Only the terms were.
 *
 * WHY THIS TEST EXISTS RATHER THAN A CODE READING
 * Every other suite here loads the PLUGIN. Nothing loaded the theme, so the
 * template that decides what /blog/ says had no test at all, and the failure is
 * a branch condition — exactly the kind of thing that reads correctly and
 * behaves otherwise. This runs the real template against stubbed WordPress
 * functions and asserts on the HTML it produces.
 *
 * NOTHING HERE TOUCHES A DATABASE OR A LIVE SITE. Post counts are supplied by
 * the stubs; the eighteen published articles are never read, queried or
 * modified.
 *
 * Run: php wordpress/tests/blog-index-test.php [--theme-dir=PATH]
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

$opts  = getopt( '', array( 'theme-dir::' ) );
$theme = (string) ( $opts['theme-dir'] ?? dirname( __DIR__ ) . '/wp-content/themes/gcalls-theme' );
$theme = rtrim( $theme, '/' ) . '/';

if ( ! is_readable( $theme . 'home.php' ) ) {
	fwrite( STDERR, "FATAL: home.php not readable under $theme\n" );
	exit( 2 );
}

define( 'ABSPATH', __DIR__ );

/* ---- the scenario, read by the stubs below ---- */
$GLOBALS['gc_terms']     = array();  // gcalls_hub terms with at least one post.
$GLOBALS['gc_posts']     = 0;        // published posts the main loop would see.
$GLOBALS['gc_unfiled']   = 0;        // published posts carrying no hub term.
$GLOBALS['gc_taxonomy']  = true;     // whether the plugin registered the taxonomy.
$GLOBALS['gc_none_used'] = false;    // set when content-none is rendered.
$GLOBALS['gc_loop_left'] = 0;        // main-loop cursor, set by render().

/* ---- WordPress stubs ---- */
function get_header() {}
function get_footer() {}
function gcalls_breadcrumbs() {}
function gcalls_pagination() {}
function gcalls_core_hubs() { return array(); }
function taxonomy_exists( $t ) { return (bool) $GLOBALS['gc_taxonomy']; }
function is_paged() { return false; }
function is_wp_error( $t ) { return false; }
function get_option( $k, $d = false ) { return 0; }
function get_post_field( $f, $p = null ) { return ''; }
function get_the_title( $p = null ) { return 'Blog'; }
function the_content() {}
/* The main loop is consumed, not merely queried: a have_posts() that keeps
 * saying yes turns the fallback `while ( have_posts() )` into an infinite one. */
function have_posts() { return $GLOBALS['gc_loop_left'] > 0; }
function the_post() { --$GLOBALS['gc_loop_left']; }
function wp_reset_postdata() {}
function apply_filters( $tag, $value ) { return $value; }
function wp_kses_post( $t ) { return (string) $t; }
function esc_html( $t ) { return htmlspecialchars( (string) $t, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $t ) { return esc_html( $t ); }
function esc_html__( $t, $d = null ) { return esc_html( $t ); }
function esc_attr__( $t, $d = null ) { return esc_html( $t ); }
function esc_html_e( $t, $d = null ) { echo esc_html( $t ); }
function esc_attr_e( $t, $d = null ) { echo esc_html( $t ); }
function disabled( $a, $b = true, $echo = true ) { if ( $a === $b && $echo ) { echo ' disabled'; } }
function _n( $s, $p, $n, $d = null ) { return 1 === (int) $n ? $s : $p; }

function get_terms( $args ) {
	$out = array();
	foreach ( $GLOBALS['gc_terms'] as $slug => $count ) {
		$out[] = (object) array(
			'term_id'     => count( $out ) + 1,
			'slug'        => $slug,
			'name'        => strtoupper( $slug ),
			'count'       => $count,
			'description' => '',
		);
	}
	return $out;
}

/**
 * The template renders cards through get_template_part. The only branch this
 * test cares about is 'none' — the empty state — so it is recorded rather than
 * rendered, and every other part prints a marker.
 */
function get_template_part( $slug, $name = null ) {
	if ( 'none' === $name ) {
		$GLOBALS['gc_none_used'] = true;
		echo '<p>Chưa có bài viết nào trong mục này.</p>';
		return;
	}
	echo '<article class="card"></article>';
}

/** Minimal WP_Query: hub queries return that term's count, the NOT EXISTS query the unfiled count. */
class WP_Query {
	private int $left = 0;

	public function __construct( array $args ) {
		$tax = $args['tax_query'][0] ?? array();

		if ( 'NOT EXISTS' === ( $tax['operator'] ?? '' ) ) {
			$this->left = (int) $GLOBALS['gc_unfiled'];
			return;
		}

		$id    = (int) ( $tax['terms'] ?? 0 );
		$slugs = array_keys( $GLOBALS['gc_terms'] );
		$slug  = $slugs[ $id - 1 ] ?? null;

		$this->left = null === $slug ? 0 : (int) $GLOBALS['gc_terms'][ $slug ];
	}

	public function have_posts(): bool { return $this->left > 0; }
	public function the_post(): void { --$this->left; }

	public function __get( $name ) {
		return 'post_count' === $name ? (int) $GLOBALS['gc_unfiled'] : null;
	}
}

/* ---- harness ---- */
$pass = 0;
$fail = 0;
function ok( string $name, bool $cond, string $detail = '' ): void {
	global $pass, $fail;
	if ( $cond ) { ++$pass; echo "  ok    $name\n"; }
	else { ++$fail; echo "  FAIL  $name" . ( '' !== $detail ? " — $detail" : '' ) . "\n"; }
}

function render( string $theme ): string {
	$GLOBALS['gc_none_used'] = false;
	$GLOBALS['gc_loop_left'] = (int) $GLOBALS['gc_posts'];
	ob_start();
	include $theme . 'home.php';
	return (string) ob_get_clean();
}

echo "BLOG INDEX EMPTY STATE\n\n";

/*
 * The exact live shape at the time of writing: eighteen published posts, the
 * taxonomy registered, and NOT ONE post filed under a hub. This is the case
 * that printed the empty state.
 */
$GLOBALS['gc_taxonomy'] = true;
$GLOBALS['gc_terms']    = array();
$GLOBALS['gc_posts']    = 18;
$GLOBALS['gc_unfiled']  = 18;
$html                   = render( $theme );

ok( '18 posts, no hub terms: the empty state is not rendered', ! $GLOBALS['gc_none_used'] );
ok( '18 posts, no hub terms: the page does not say the blog is empty',
	! str_contains( $html, 'Chưa có bài viết' ) );
ok( '18 posts, no hub terms: the posts are listed',
	18 === substr_count( $html, '<article class="card">' ),
	substr_count( $html, '<article class="card">' ) . ' card(s)' );

/* The ordinary case: posts filed under hubs. Grouped view, every post shown. */
$GLOBALS['gc_terms']   = array( 'van-hanh' => 10, 'tich-hop' => 8 );
$GLOBALS['gc_posts']   = 18;
$GLOBALS['gc_unfiled'] = 0;
$html                  = render( $theme );

ok( 'grouped: the empty state is not rendered', ! $GLOBALS['gc_none_used'] );
ok( 'grouped: every post is listed once',
	18 === substr_count( $html, '<article class="card">' ),
	substr_count( $html, '<article class="card">' ) . ' card(s)' );
ok( 'grouped: the total is counted, not written down', str_contains( $html, '18 bài viết trong 2' ) );

/* Some posts filed, some not. Nothing published may be invisible on its index. */
$GLOBALS['gc_terms']   = array( 'van-hanh' => 10, 'tich-hop' => 5 );
$GLOBALS['gc_posts']   = 18;
$GLOBALS['gc_unfiled'] = 3;
$html                  = render( $theme );

ok( 'partly filed: the three unfiled posts still appear',
	18 === substr_count( $html, '<article class="card">' ),
	substr_count( $html, '<article class="card">' ) . ' card(s)' );
ok( 'partly filed: the total counts all eighteen', str_contains( $html, '18 bài viết' ) );

/* And the empty state must still work when it is actually true. */
$GLOBALS['gc_terms']   = array();
$GLOBALS['gc_posts']   = 0;
$GLOBALS['gc_unfiled'] = 0;
$html                  = render( $theme );

ok( 'no posts at all: the empty state IS rendered', $GLOBALS['gc_none_used'] );

/* Without the plugin the theme must still show the archive rather than break. */
$GLOBALS['gc_taxonomy'] = false;
$GLOBALS['gc_posts']    = 18;
$html                   = render( $theme );

ok( 'no taxonomy: falls back to the plain loop', ! $GLOBALS['gc_none_used'] );

echo "\nblog-index: $pass ok, $fail failed\n";
exit( $fail > 0 ? 1 : 0 );
