<?php
/**
 * Behavioural tests for the read-only page renderer.
 *
 * Runs the REAL `Content_Pages` against a stub WordPress. The stubs are only the
 * WordPress surface the class calls into — nothing here reimplements the logic
 * under test, so a bug in the allowlist, the guards or the escaping fails these
 * tests rather than hiding behind a parallel copy.
 *
 *   php wordpress/tests/content-pages-test.php
 *
 * Exit status is 0 when every case passes, 1 otherwise.
 *
 * THE TEST THAT MATTERS MOST is the last group: the renderer must perform no
 * database write on any path. The stubs count every call to wp_insert_post,
 * wp_update_post, update_post_meta and update_option, and the assertion is that
 * the counter is still zero after every other case has run.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace {

define( 'ABSPATH', __DIR__ );
define( 'GCALLS_CORE_DIR', __DIR__ . '/../wp-content/plugins/gcalls-core/' );
define( 'GCALLS_CORE_URL', 'https://example.test/wp-content/plugins/gcalls-core/' );

final class Env {
	public static array $post = array();
	public static array $options = array( 'page_on_front' => 13 );
	public static bool $admin = false;
	public static bool $ajax = false;
	public static bool $feed = false;
	public static bool $preview = false;
	public static bool $embed = false;
	public static bool $singularPage = true;
	public static bool $mainQuery = true;
	public static bool $inLoop = true;
	/** Every write the renderer must never make. */
	public static int $writes = 0;

	public static function reset(): void {
		self::$post = array( 'ID' => 101, 'post_type' => 'page', 'post_name' => 'tong-dai-tich-hop-crm' );
		self::$options = array( 'page_on_front' => 13 );
		self::$admin = false; self::$ajax = false; self::$feed = false;
		self::$preview = false; self::$embed = false;
		self::$singularPage = true; self::$mainQuery = true; self::$inLoop = true;
	}
}

final class WP_Post {
	public int $ID = 0;
	public string $post_type = 'page';
	public string $post_name = '';
	public function __construct( array $a ) {
		$this->ID = (int) $a['ID']; $this->post_type = $a['post_type']; $this->post_name = $a['post_name'];
	}
}

function is_admin(): bool { return Env::$admin; }
function wp_doing_ajax(): bool { return Env::$ajax; }
function is_feed(): bool { return Env::$feed; }
function is_preview(): bool { return Env::$preview; }
function is_embed(): bool { return Env::$embed; }
function is_singular( $t = '' ): bool { return Env::$singularPage; }
function is_main_query(): bool { return Env::$mainQuery; }
function in_the_loop(): bool { return Env::$inLoop; }
function get_post() { return Env::$post ? new WP_Post( Env::$post ) : null; }
function get_option( string $k, $d = false ) { return Env::$options[ $k ] ?? $d; }
function add_filter( ...$a ): void {}
function __( string $s, string $d = '' ): string { return $s; }
function esc_html__( string $s, string $d = '' ): string { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_html( string $s ): string { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_attr( string $s ): string { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_url( string $s ): string { return $s; }
function home_url( string $p = '' ): string { return 'https://example.test' . $p; }
function wp_strip_all_tags( string $s ): string { return trim( strip_tags( $s ) ); }
function add_query_arg( array $args, string $url ): string {
	return $url . ( str_contains( $url, '?' ) ? '&' : '?' ) . http_build_query( $args );
}

/* Writers. The renderer must never reach any of these. */
function wp_insert_post( ...$a ) { Env::$writes++; return 1; }
function wp_update_post( ...$a ) { Env::$writes++; return 1; }
function update_post_meta( ...$a ) { Env::$writes++; return true; }
function update_option( ...$a ) { Env::$writes++; return true; }

}

namespace Gcalls\Core {

final class Shortcodes {
	public const LEAD_ROUTE = '/lien-he/';
}

require_once __DIR__ . '/../wp-content/plugins/gcalls-core/includes/class-content-pages.php';

}

namespace {

use Gcalls\Core\Content_Pages;

$pass = 0; $fail = 0;

function ok( string $name, bool $cond, string $detail = '' ): void {
	global $pass, $fail;
	if ( $cond ) { $pass++; echo "  ok   $name\n"; return; }
	$fail++; echo "  FAIL $name" . ( '' !== $detail ? " — $detail" : '' ) . "\n";
}

$SHELL = '';

echo "CONTENT PAGES RENDERER\n\n";

/* 1 — allowlisted slug renders ------------------------------------- */
Env::reset();
$out = Content_Pages::render( $SHELL );
ok( '1  allowlisted slug renders', str_contains( $out, 'gcalls-cp' ) && strlen( $out ) > 500, strlen( $out ) . ' chars' );
ok( '1  renders exactly one h1', 1 === substr_count( $out, '<h1' ), (string) substr_count( $out, '<h1' ) );
ok( '1  renders h2 sections', substr_count( $out, '<h2' ) > 3 );

/* 2 — exact slug allowlist ----------------------------------------- */
foreach ( array( 'tong-dai-tich-hop-cr', 'tong-dai-tich-hop-crm-x', 'TONG-DAI-TICH-HOP-CRM', 'about', '' ) as $slug ) {
	Env::reset();
	Env::$post['post_name'] = $slug;
	ok( "2  slug '$slug' is not rendered", Content_Pages::render( $SHELL ) === $SHELL );
}

/* 3 — pages only, never a post ------------------------------------- */
Env::reset();
Env::$post['post_type'] = 'post';
ok( '3  post_type=post is never rendered', Content_Pages::render( $SHELL ) === $SHELL );

/* 4 — the front page is never a target ----------------------------- */
Env::reset();
Env::$post['ID'] = 13;
ok( '4  front page is never rendered', Content_Pages::render( $SHELL ) === $SHELL );

/* 5 — context exclusions ------------------------------------------- */
foreach ( array( 'admin', 'ajax', 'feed', 'preview', 'embed' ) as $ctx ) {
	Env::reset();
	Env::${$ctx} = true;
	ok( "5  not rendered in $ctx", Content_Pages::render( $SHELL ) === $SHELL );
}

/* 6 — query conditions --------------------------------------------- */
foreach ( array( 'singularPage', 'mainQuery', 'inLoop' ) as $flag ) {
	Env::reset();
	Env::${$flag} = false;
	ok( "6  not rendered when !$flag", Content_Pages::render( $SHELL ) === $SHELL );
}

/* 7 — empty-shell baseline ----------------------------------------- */
Env::reset();
$real = str_repeat( 'Nội dung thật do biên tập viên viết. ', 20 );
ok( '7  real content is left alone', Content_Pages::render( $real ) === $real );
ok( '7  a short shell is still filled', Content_Pages::render( '<p>Liên hệ</p>' ) !== '<p>Liên hệ</p>' );
ok( '7  is_empty_shell true for empty', Content_Pages::is_empty_shell( '' ) );
ok( '7  is_empty_shell false for real', ! Content_Pages::is_empty_shell( $real ) );

/* 8 — URL allowlist ------------------------------------------------ */
foreach ( array(
	'javascript:alert(1)', 'data:text/html,<script>', 'https://evil.example/x',
	'//evil.example/x', 'ftp://x/', ' javascript:alert(1)',
) as $bad ) {
	ok( "8  rejects '$bad'", '' === Content_Pages::safe_href( $bad ) );
}
foreach ( array( '/gcalls-cx/', '/lien-he/?intent=consultation&source=crm_integration' ) as $good ) {
	ok( "8  accepts '$good'", $good === Content_Pages::safe_href( $good ) );
}

/* 9 — escaping ------------------------------------------------------ */
Env::reset();
$out = Content_Pages::render( $SHELL );
ok( '9  no unescaped angle bracket from manifest text', ! preg_match( '/<script/i', $out ) );
ok( '9  output has no javascript: href', ! str_contains( strtolower( $out ), 'javascript:' ) );

/* 10 — no empty sections ------------------------------------------- */
Env::reset();
$out = Content_Pages::render( $SHELL );
ok( '10 no empty section element', ! preg_match( '#<section[^>]*>\s*</section>#', $out ) );
ok( '10 no empty card', ! preg_match( '#<article[^>]*>\s*</article>#', $out ) );
ok( '10 no empty list', ! preg_match( '#<(ol|ul)[^>]*>\s*</\1>#', $out ) );

/* 11 — CTA attribution is the route's own, never the header -------- */
Env::reset();
$out = Content_Pages::render( $SHELL );
ok( '11 CTA points at the lead route', str_contains( $out, '/lien-he/' ) );
ok( '11 CTA carries an intent', str_contains( $out, 'intent=' ) );
ok( '11 CTA does not use source=header', ! str_contains( $out, 'source=header' ) );

/* 12 — FAQ schema is not emitted when no FAQ shows ----------------- */
Env::reset();
$out = Content_Pages::render( $SHELL );
$hasFaqMarkup = str_contains( $out, 'gcalls-cp__faq-item' );
ok( '12 no FAQ structured data emitted by this renderer', ! str_contains( $out, 'FAQPage' ) );
ok( '12 FAQ markup present only with FAQ items', $hasFaqMarkup );

/* 13 — SEO filters are scoped -------------------------------------- */
Env::reset();
ok( '13 seo_title passes through when no seo in manifest', 'Original' === Content_Pages::seo_title( 'Original' ) );
Env::reset();
Env::$post['post_name'] = 'not-allowlisted';
ok( '13 seo_title untouched off-allowlist', 'Original' === Content_Pages::seo_title( 'Original' ) );
Env::reset();
Env::$post['ID'] = 13;
ok( '13 seo_title untouched on the front page', 'Original' === Content_Pages::seo_title( 'Original' ) );
Env::reset();
Env::$admin = true;
ok( '13 seo_title untouched in admin', 'Original' === Content_Pages::seo_title( 'Original' ) );

/* 14 — THE ONE THAT MATTERS: no database write, ever --------------- */
ok( '14 renderer performed ZERO database writes across every case above', 0 === Env::$writes, (string) Env::$writes );

echo "\n$pass pass, $fail fail\n";
exit( $fail > 0 ? 1 : 0 );

}
