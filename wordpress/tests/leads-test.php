<?php
/**
 * Behavioural tests for the lead pipeline.
 *
 * Runs the REAL `Leads::handle()` against a stub WordPress. Nothing here
 * reimplements the logic under test — the stubs are only the WordPress surface
 * the class calls into, so a bug in validation, ordering or the guards fails
 * these tests rather than hiding behind a parallel copy.
 *
 *   php wordpress/tests/leads-test.php
 *
 * Exit status is 0 when every case passes, 1 otherwise.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

/*
 * Bracketed namespaces throughout. PHP refuses to parse a file that mixes the
 * bracketed and unbracketed forms, and this file needs three blocks: the
 * WordPress stubs in the global namespace, the module's own namespace for the
 * require, and the harness back in global.
 */

namespace {

define( 'ABSPATH', __DIR__ );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'GCALLS_CORE_URL', 'https://example.test/wp-content/plugins/gcalls-core/' );

/* ------------------------------------------------------------- test state */

final class Env {
	/** @var array<string, mixed> */
	public static array $options = array();
	/** @var array<string, mixed> */
	public static array $transients = array();
	/** @var array<int, array<string, mixed>> */
	public static array $meta = array();
	/** @var array<int, array<string, mixed>> */
	public static array $posts = array();
	/** @var array<int, array{to:string, subject:string, body:string, headers:array<int,string>}> */
	public static array $mail = array();
	public static bool $mail_succeeds = true;
	public static bool $insert_succeeds = true;
	public static bool $nonce_valid = true;
	public static int $next_id = 100;
	/** @var array<int, string> */
	public static array $error_log = array();

	public static function reset(): void {
		self::$options         = array();
		self::$transients      = array();
		self::$meta            = array();
		self::$posts           = array();
		self::$mail            = array();
		self::$mail_succeeds   = true;
		self::$insert_succeeds = true;
		self::$nonce_valid     = true;
		self::$next_id         = 100;
		self::$error_log       = array();
	}
}

/** Thrown by the redirect stubs so a test can inspect where the code went. */
final class Redirected extends \Exception {
	public function __construct( public string $url ) {
		parent::__construct( $url );
	}
}

final class WP_Error {
	public function __construct( public string $code = '', public string $message = '' ) {}
}

final class WP_Post {
	public int $ID = 0;
	public string $post_content = '';
}

/* --------------------------------------------------------- WordPress stubs */

function add_action( ...$a ): void {}
function add_filter( ...$a ): void {}
function register_post_type( ...$a ): void {}
function get_role( string $r ) { return null; }
function add_submenu_page( ...$a ): void {}
function register_setting( ...$a ): void {}
function add_meta_box( ...$a ): void {}
function is_admin(): bool { return false; }
function current_user_can( string $c ): bool { return true; }
function is_singular(): bool { return false; }
function get_post() { return null; }
function wp_enqueue_style( ...$a ): void {}
function wp_enqueue_script( ...$a ): void {}
function absint( $v ): int { return abs( (int) $v ); }
function __( string $s, string $d = '' ): string { return $s; }
function esc_html( string $s ): string { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_url_raw( string $u ): string { return filter_var( $u, FILTER_VALIDATE_URL ) ? $u : ''; }
function wp_json_encode( $v ) { return json_encode( $v ); }
function is_wp_error( $v ): bool { return $v instanceof WP_Error; }

function wp_unslash( $v ) { return is_string( $v ) ? stripslashes( $v ) : $v; }
function sanitize_text_field( string $s ): string {
	$s = strip_tags( $s );
	$s = preg_replace( '/[\r\n\t]+/', ' ', $s );
	return trim( (string) $s );
}
function sanitize_textarea_field( string $s ): string { return trim( strip_tags( $s ) ); }
function sanitize_email( string $s ): string { return trim( strip_tags( $s ) ); }
function sanitize_key( string $s ): string { return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( $s ) ) ?? ''; }
function is_email( string $s ) { return (bool) filter_var( $s, FILTER_VALIDATE_EMAIL ); }

function home_url( string $path = '' ): string { return 'https://example.test' . $path; }
function admin_url( string $path = '' ): string { return 'https://example.test/wp-admin/' . $path; }
function get_edit_post_link( int $id, string $ctx = '' ): string { return 'https://example.test/wp-admin/post.php?post=' . $id; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function wp_salt( string $scheme = 'auth' ): string { return 'test-salt-value'; }
function wp_generate_password( int $len = 12, bool $special = true, bool $extra = false ): string {
	return substr( str_repeat( bin2hex( random_bytes( 16 ) ), 3 ), 0, $len );
}
function wp_verify_nonce( $nonce, $action ) { return Env::$nonce_valid ? 1 : false; }
function wp_nonce_field( ...$a ): string { return ''; }

function get_option( string $key, $default = false ) { return Env::$options[ $key ] ?? $default; }
function update_option( string $key, $value, $autoload = null ): bool { Env::$options[ $key ] = $value; return true; }

function get_transient( string $key ) { return Env::$transients[ $key ] ?? false; }
function set_transient( string $key, $value, int $ttl = 0 ): bool { Env::$transients[ $key ] = $value; return true; }
function delete_transient( string $key ): bool { unset( Env::$transients[ $key ] ); return true; }

function wp_insert_post( array $post, bool $wp_error = false ) {
	if ( ! Env::$insert_succeeds ) {
		return $wp_error ? new WP_Error( 'db_error', 'insert failed' ) : 0;
	}
	$id = Env::$next_id++;
	Env::$posts[ $id ] = $post;
	return $id;
}
function update_post_meta( int $id, string $key, $value ): bool { Env::$meta[ $id ][ $key ] = $value; return true; }
function get_post_meta( int $id, string $key, bool $single = false ) { return Env::$meta[ $id ][ $key ] ?? ''; }

function wp_mail( $to, $subject, $body, $headers = array() ): bool {
	Env::$mail[] = array( 'to' => $to, 'subject' => $subject, 'body' => $body, 'headers' => (array) $headers );
	return Env::$mail_succeeds;
}

function add_query_arg( array $args, string $url ): string {
	$sep = str_contains( $url, '?' ) ? '&' : '?';
	return $url . $sep . http_build_query( $args );
}
function wp_validate_redirect( string $url, string $fallback ): string {
	$host = parse_url( $url, PHP_URL_HOST );
	return ( null === $host || 'example.test' === $host ) ? $url : $fallback;
}
function wp_safe_redirect( string $url, int $status = 302 ): void { throw new Redirected( $url ); }

}

/* The module under test. */
namespace Gcalls\Core {

const VERSION = '0.9.7';

/** Minimal stand-in: Leads only reads the route constant. */
final class Shortcodes {
	public const LEAD_ROUTE = '/lien-he/';
}

require_once __DIR__ . '/../wp-content/plugins/gcalls-core/includes/class-leads.php';

}

namespace {

/* ------------------------------------------------------------- harness */

$pass = 0;
$fail = 0;

/**
 * Drives one submission and returns the redirect URL.
 *
 * @param array<string, string> $post   POST body.
 * @param array<string, string> $server Extra server vars.
 * @return string
 */
function submit( array $post, array $server = array() ): string {
	$_POST   = $post;
	$_SERVER = array_merge(
		array(
			'REQUEST_METHOD' => 'POST',
			'HTTP_ORIGIN'    => 'https://example.test',
			'REMOTE_ADDR'    => '203.0.113.7',
			'CONTENT_LENGTH' => (string) strlen( http_build_query( $post ) ),
		),
		$server
	);

	try {
		\Gcalls\Core\Leads::handle();
	} catch ( Redirected $r ) {
		return $r->url;
	}

	return '(no redirect)';
}

/** A complete, valid submission. */
function valid( array $overrides = array() ): array {
	return array_merge(
		array(
			'gcalls_lead_nonce'  => 'nonce',
			'gcalls_started'     => (string) ( time() - 30 ),
			'gcalls_website'     => '',
			'gcalls_idempotency' => bin2hex( random_bytes( 12 ) ),
			'name'               => 'Nguyen Van A',
			'phone'              => '0912 345 678',
			'email'              => 'a@example.com',
			'company'            => 'Cong ty ABC',
			'message'            => 'Toi muon tu van ve tong dai.',
			'consent'            => '1',
			'intent'             => 'consultation',
			'source'             => 'gcalls_plus',
			'product'            => 'Gcalls Plus Webphone',
			'utm_source'         => 'google',
			'utm_medium'         => 'cpc',
			'utm_campaign'       => 'brand',
			'_wp_http_referer'   => '/lien-he/',
		),
		$overrides
	);
}

function ok( string $name, bool $condition, string $detail = '' ): void {
	global $pass, $fail;

	if ( $condition ) {
		$pass++;
		echo "  ok   $name\n";
		return;
	}

	$fail++;
	echo "  FAIL $name" . ( '' !== $detail ? " — $detail" : '' ) . "\n";
}

echo "LEAD PIPELINE\n\n";

/* 1. Valid lead ------------------------------------------------------- */
Env::reset();
$url = submit( valid() );
ok( '1  valid lead redirects to success', str_contains( $url, 'gcalls_lead=ok' ), $url );
ok( '1  valid lead is stored', 1 === count( Env::$posts ) );
ok( '1  stored privately', ( Env::$posts[100]['post_status'] ?? '' ) === 'private' );
ok( '1  notification sent', 1 === count( Env::$mail ) );
ok( '1  notification_status recorded', 'sent' === ( Env::$meta[100]['_gcalls_notification_status'] ?? '' ) );
ok( '1  reference issued', str_starts_with( (string) ( Env::$meta[100]['_gcalls_reference'] ?? '' ), 'GC-' ) );
ok( '1  recipient is the configured default', 'sales@gcalls.co' === ( Env::$mail[0]['to'] ?? '' ) );
ok( '1  phone normalized', '0912345678' === ( Env::$meta[100]['_gcalls_phone'] ?? '' ), (string) ( Env::$meta[100]['_gcalls_phone'] ?? '' ) );
ok( '1  marked real, not test', 'real' === ( Env::$meta[100]['_gcalls_is_test'] ?? '' ) );
ok( '1  raw IP not stored', ! in_array( '203.0.113.7', array_map( 'strval', Env::$meta[100] ), true ) );

/* 2. Attribution preserved -------------------------------------------- */
ok( '2  intent preserved', 'consultation' === ( Env::$meta[100]['_gcalls_intent'] ?? '' ) );
ok( '2  source preserved', 'gcalls_plus' === ( Env::$meta[100]['_gcalls_source'] ?? '' ) );
ok( '2  product preserved', 'Gcalls Plus Webphone' === ( Env::$meta[100]['_gcalls_product'] ?? '' ) );
ok( '2  utm_source preserved', 'google' === ( Env::$meta[100]['_gcalls_utm_source'] ?? '' ) );
ok( '2  utm_campaign preserved', 'brand' === ( Env::$meta[100]['_gcalls_utm_campaign'] ?? '' ) );
ok( '2  attribution reaches the email', str_contains( Env::$mail[0]['body'] ?? '', 'gcalls_plus' ) );

/* 3. Missing name ------------------------------------------------------ */
Env::reset();
$url = submit( valid( array( 'name' => '' ) ) );
ok( '3  missing name rejected', str_contains( $url, 'gcalls_lead=error' ) && str_contains( $url, 'code=invalid' ) );
ok( '3  missing name names the field', str_contains( $url, 'name' ) );
ok( '3  nothing stored', 0 === count( Env::$posts ) );
ok( '3  typed values parked for repopulation', str_contains( $url, 'draft=' ) );

/* 4. Invalid phone ----------------------------------------------------- */
Env::reset();
$url = submit( valid( array( 'phone' => 'abc' ) ) );
ok( '4  invalid phone rejected', str_contains( $url, 'code=invalid' ) );
ok( '4  nothing stored', 0 === count( Env::$posts ) );

/* 5. Invalid email ----------------------------------------------------- */
Env::reset();
$url = submit( valid( array( 'email' => 'not-an-email' ) ) );
ok( '5  invalid email rejected', str_contains( $url, 'code=invalid' ) );
ok( '5  nothing stored', 0 === count( Env::$posts ) );

/* 5b. Email is optional ------------------------------------------------ */
Env::reset();
$url = submit( valid( array( 'email' => '' ) ) );
ok( '5b omitted email is accepted', str_contains( $url, 'gcalls_lead=ok' ) );

/* 6. Missing consent --------------------------------------------------- */
Env::reset();
$body = valid();
unset( $body['consent'] );
$url = submit( $body );
ok( '6  missing consent rejected', str_contains( $url, 'code=invalid' ) );
ok( '6  nothing stored', 0 === count( Env::$posts ) );

/* 7. Honeypot ---------------------------------------------------------- */
Env::reset();
$url = submit( valid( array( 'gcalls_website' => 'http://spam.example' ) ) );
ok( '7  honeypot answers as success', str_contains( $url, 'gcalls_lead=ok' ) );
ok( '7  honeypot stores nothing', 0 === count( Env::$posts ) );
ok( '7  honeypot sends no mail', 0 === count( Env::$mail ) );

/* 8. Too fast ---------------------------------------------------------- */
Env::reset();
$url = submit( valid( array( 'gcalls_started' => (string) time() ) ) );
ok( '8  instant submit rejected', str_contains( $url, 'code=too_fast' ) );
ok( '8  nothing stored', 0 === count( Env::$posts ) );

/* 9. Rate limit -------------------------------------------------------- */
Env::reset();
$last = '';
for ( $i = 0; $i < 7; $i++ ) {
	$last = submit( valid( array( 'gcalls_idempotency' => bin2hex( random_bytes( 12 ) ) ) ) );
}
ok( '9  sixth submission is rate limited', str_contains( $last, 'code=rate_limited' ), $last );
ok( '9  only the allowed number stored', 5 === count( Env::$posts ), (string) count( Env::$posts ) );

/* 10. Duplicate idempotency token -------------------------------------- */
Env::reset();
$token = bin2hex( random_bytes( 12 ) );
$one   = submit( valid( array( 'gcalls_idempotency' => $token ) ) );
$two   = submit( valid( array( 'gcalls_idempotency' => $token ) ) );
ok( '10 duplicate token stores one lead', 1 === count( Env::$posts ), (string) count( Env::$posts ) );
ok( '10 duplicate returns the same reference', $one === $two, "$one vs $two" );
ok( '10 duplicate sends one email', 1 === count( Env::$mail ) );

/* 11. Oversized payload ------------------------------------------------ */
Env::reset();
$url = submit( valid(), array( 'CONTENT_LENGTH' => '999999' ) );
ok( '11 oversized payload rejected', str_contains( $url, 'code=too_large' ) );
ok( '11 nothing stored', 0 === count( Env::$posts ) );

/* 12. Bad nonce -------------------------------------------------------- */
Env::reset();
Env::$nonce_valid = false;
$url = submit( valid() );
ok( '12 bad nonce rejected', str_contains( $url, 'code=nonce' ) );
ok( '12 nothing stored', 0 === count( Env::$posts ) );

/* 13. Cross-origin ----------------------------------------------------- */
Env::reset();
$url = submit( valid(), array( 'HTTP_ORIGIN' => 'https://evil.example' ) );
ok( '13 cross-origin rejected', str_contains( $url, 'code=origin' ) );
ok( '13 nothing stored', 0 === count( Env::$posts ) );

/* 14. GET ------------------------------------------------------------- */
Env::reset();
$url = submit( valid(), array( 'REQUEST_METHOD' => 'GET' ) );
ok( '14 GET rejected', str_contains( $url, 'code=method' ) );

/* 15. Notification fails, storage succeeds ----------------------------- */
Env::reset();
Env::$mail_succeeds = false;
$url = submit( valid() );
ok( '15 visitor still sees success', str_contains( $url, 'gcalls_lead=ok' ) );
ok( '15 lead is still stored', 1 === count( Env::$posts ) );
ok( '15 marked failed', 'failed' === ( Env::$meta[100]['_gcalls_notification_status'] ?? '' ) );
ok( '15 admin counter incremented', 1 === (int) ( Env::$options['gcalls_lead_failed_notifications'] ?? 0 ) );

/* 16. Storage fails ---------------------------------------------------- */
Env::reset();
Env::$insert_succeeds = false;
$url = submit( valid() );
ok( '16 storage failure shows no success', ! str_contains( $url, 'gcalls_lead=ok' ) );
ok( '16 storage failure is reported', str_contains( $url, 'code=storage' ) );
ok( '16 no email sent for a lead that was not stored', 0 === count( Env::$mail ) );

/* 17. Open redirect ---------------------------------------------------- */
Env::reset();
$url = submit( valid( array( '_wp_http_referer' => 'https://evil.example/steal' ) ) );
ok( '17 foreign return URL is not honoured', ! str_contains( $url, 'evil.example' ), $url );

/* 18. Recipient cannot be set by the client ---------------------------- */
Env::reset();
submit( valid( array( 'to' => 'attacker@evil.example', 'recipient' => 'attacker@evil.example' ) ) );
ok( '18 client cannot redirect the notification', 'sales@gcalls.co' === ( Env::$mail[0]['to'] ?? '' ) );

/* 19. Header injection via the name ------------------------------------ */
Env::reset();
submit( valid( array( 'name' => "Evil\r\nBcc: victim@example.com" ) ) );
$subject = Env::$mail[0]['subject'] ?? '';
ok( '19 no CR/LF survives into the subject', ! str_contains( $subject, "\r" ) && ! str_contains( $subject, "\n" ) );
ok( '19 no injected Bcc header', ! in_array( 'Bcc: victim@example.com', Env::$mail[0]['headers'] ?? array(), true ) );

/* 20. Test marker is server-decided ------------------------------------ */
Env::reset();
submit( valid( array( 'name' => 'GCALLS TEST — DO NOT CONTACT', 'is_test' => 'real' ) ) );
ok( '20 test lead is marked test by the server', 'test' === ( Env::$meta[100]['_gcalls_is_test'] ?? '' ) );
ok( '20 test marker appears in the subject', str_contains( Env::$mail[0]['subject'] ?? '', '[TEST]' ) );

Env::reset();
submit( valid( array( 'is_test' => 'test' ) ) );
ok( '20 client cannot mark a real lead as test', 'real' === ( Env::$meta[100]['_gcalls_is_test'] ?? '' ) );

/* 21. Reply-To only for a validated address ---------------------------- */
Env::reset();
submit( valid( array( 'email' => '' ) ) );
$headers = Env::$mail[0]['headers'] ?? array();
ok( '21 no Reply-To without an email', ! (bool) preg_grep( '/^Reply-To:/', $headers ) );

Env::reset();
submit( valid() );
$headers = Env::$mail[0]['headers'] ?? array();
ok( '21 Reply-To set for a valid email', (bool) preg_grep( '/^Reply-To: a@example\.com$/', $headers ) );
ok( '21 From is on this site\'s domain', (bool) preg_grep( '/^From: .*@example\.test>?$/', $headers ) );

/* ------------------------------------------------------------- summary */

echo "\n$pass pass, $fail fail\n";

exit( $fail > 0 ? 1 : 0 );

}
