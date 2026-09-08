<?php
/**
 * GCALLS-040 §A.2 — the check that must pass before Homepage Layout may run.
 *
 * Applying the home layout REPLACES `_elementor_data` on the front page. That
 * is a destructive write, and the only thing that makes it acceptable is that
 * the target is a disposable local fixture. This asserts that, rather than
 * assuming it from the fact that a local script is the one running.
 *
 * Every condition is stated and must hold. Exit code 0 means "this is a local
 * fixture and the write may proceed"; anything else means it may not.
 *
 * Run: php wordpress/tests/local-only-guard.php
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

require_once '/wordpress/wp-load.php';

$fail = array();
$note = array();

/* 1 — the site must answer on loopback, not on a public hostname. */
$home = (string) get_option( 'home' );
$site = (string) get_option( 'siteurl' );

foreach ( array( 'home' => $home, 'siteurl' => $site ) as $label => $url ) {
	$host = (string) wp_parse_url( $url, PHP_URL_HOST );

	if ( ! in_array( $host, array( '127.0.0.1', 'localhost', '::1' ), true ) ) {
		$fail[] = "$label host is '$host', not loopback";
	} else {
		$note[] = "$label = $url";
	}
}

/* 2 — the database must be the fixture's own, not a live connection.
 *
 * SQLite here is a file; the assertion is that the file lives under the
 * fixture, not that it merely exists. A MySQL host that is not loopback is
 * refused outright — that is the shape a live credential would take. */
if ( defined( 'DB_HOST' ) && '' !== (string) DB_HOST ) {
	$db_host = (string) preg_replace( '/:\d+$/', '', (string) DB_HOST );

	if ( ! in_array( $db_host, array( '127.0.0.1', 'localhost', '::1' ), true ) ) {
		$fail[] = "DB_HOST is '" . DB_HOST . "', which is not loopback";
	} else {
		$note[] = 'DB_HOST = ' . DB_HOST;
	}
}

$sqlite = '/wordpress/wp-content/database/.ht.sqlite';

if ( is_readable( $sqlite ) ) {
	$note[] = 'SQLite database = ' . $sqlite . ' (' . (string) filesize( $sqlite ) . ' bytes)';
} elseif ( ! defined( 'DB_HOST' ) || '' === (string) DB_HOST ) {
	$fail[] = 'no SQLite fixture database and no DB_HOST — cannot prove the storage is local';
}

/* 3 — the fixture must not be carrying live content. A site holding the
 * eighteen live articles is not a fixture, whatever its URL says. */
$posts = (int) wp_count_posts( 'post' )->publish;

if ( $posts > 1 ) {
	$fail[] = "$posts published posts — this looks like a content site, not a fixture";
} else {
	$note[] = "published posts = $posts (fixture)";
}

/* 4 — and it must not be holding uploaded media. */
$attachments = (int) wp_count_posts( 'attachment' )->inherit;

if ( $attachments > 0 ) {
	$fail[] = "$attachments attachment(s) — a fixture has none";
} else {
	$note[] = 'attachments = 0';
}

echo "local-only guard\n";
foreach ( $note as $line ) { echo "  ok    $line\n"; }
foreach ( $fail as $line ) { echo "  FAIL  $line\n"; }

if ( $fail ) {
	echo "\nREFUSED: this is not a disposable local fixture. Homepage Layout must not run.\n";
	exit( 1 );
}

echo "\nLOCAL FIXTURE CONFIRMED — Homepage Layout may run here.\n";
exit( 0 );
