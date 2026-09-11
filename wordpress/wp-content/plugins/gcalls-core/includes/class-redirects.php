<?php
/**
 * Legacy route and redirect map.
 *
 * The editorial decision file classifies 263 legacy URLs: 126 keep their URL,
 * 101 are rebuilt under a new topic, 24 are retired with 410 Gone, and the rest
 * are merged or need a manual decision. Those rulings have to survive the
 * migration, and a redirect that lives only in .htaccess is invisible to every
 * report the site can produce.
 *
 * This class holds the map in the database, applies it on 404, and exposes it
 * so the importer can populate it. It deliberately does NOT ship the 263 rows
 * hardcoded: they belong to editorial and change without a deploy.
 *
 * 410 vs 301 matters here. A retired article that 301s to the blog index tells
 * a crawler the content moved, which is false, and soft-404s the target. 410
 * says the page is gone on purpose.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Stores and applies the legacy URL map.
 */
final class Redirects {

	/** Option holding the map: source path => rule. */
	public const OPTION = 'gcalls_redirect_map';

	/**
	 * Hooks the 404 handler.
	 *
	 * `template_redirect` is the last point before a template is chosen and the
	 * first at which the query is resolved, so it is where a 404 is known.
	 */
	public static function init(): void {
		add_action( 'template_redirect', array( self::class, 'maybe_redirect' ) );
	}

	/**
	 * Reads the stored map.
	 *
	 * @return array<string, array{type: string, target: string}>
	 */
	public static function map(): array {
		$map = get_option( self::OPTION, array() );

		return is_array( $map ) ? $map : array();
	}

	/**
	 * Replaces the stored map.
	 *
	 * Every entry is normalised and validated here rather than at the call
	 * site, so an importer, a CLI command and a future admin screen cannot each
	 * store a slightly different shape.
	 *
	 * @param array<string, array{type?: string, target?: string}> $map     Raw map.
	 * @param bool                                                 $dry_run When true, nothing is written.
	 * @return array{stored: int, skipped: array<int, string>}
	 */
	public static function set_map( array $map, bool $dry_run = false ): array {
		$clean   = array();
		$skipped = array();

		foreach ( $map as $source => $rule ) {
			$path = self::normalise_path( (string) $source );
			$type = isset( $rule['type'] ) ? strtolower( (string) $rule['type'] ) : '301';

			if ( '' === $path ) {
				$skipped[] = (string) $source . ' (đường dẫn nguồn rỗng)';
				continue;
			}

			if ( ! in_array( $type, array( '301', '302', '410' ), true ) ) {
				$skipped[] = $path . ' (loại không hợp lệ: ' . $type . ')';
				continue;
			}

			$target = isset( $rule['target'] ) ? (string) $rule['target'] : '';

			if ( '410' !== $type ) {
				// A redirect target has to be a PATH, not prose. The editorial
				// URL plan carries `(primary is draft — slug TBD)` in the Final
				// URL column for two merged rows, and normalise_path() happily
				// turned that into `/(primary is draft — slug TBD)/`: two live
				// URLs 301'd to a page that does not exist. A redirect into a
				// 404 is worse than no redirect, because a crawler treats it as
				// a deliberate destination.
				if ( 1 !== preg_match( '#^(?:https?://[^/]+)?/[A-Za-z0-9%._~/-]*$#', trim( $target ) ) ) {
					$skipped[] = $path . ' (đích không phải đường dẫn hợp lệ: ' . $target . ')';
					continue;
				}

				$target = self::normalise_path( $target );

				if ( '' === $target ) {
					$skipped[] = $path . ' (thiếu đích)';
					continue;
				}

				if ( $target === $path ) {
					$skipped[] = $path . ' (nguồn trùng đích — sẽ tạo vòng lặp)';
					continue;
				}
			} else {
				$target = '';
			}

			$clean[ $path ] = array(
				'type'   => $type,
				'target' => $target,
			);
		}

		if ( ! $dry_run ) {
			update_option( self::OPTION, $clean, false );
		}

		return array(
			'stored'  => count( $clean ),
			'skipped' => $skipped,
		);
	}

	/**
	 * Normalises a path to a leading-and-trailing-slashed, query-free form.
	 *
	 * An absolute URL on this site is reduced to its path; an absolute URL
	 * elsewhere is rejected, because an open redirect is a security bug and this
	 * map is populated from a file.
	 *
	 * @param string $value Path or URL.
	 * @return string Normalised path, or '' when unusable.
	 */
	public static function normalise_path( string $value ): string {
		$value = trim( $value );

		if ( '' === $value ) {
			return '';
		}

		if ( preg_match( '#^https?://#i', $value ) ) {
			$host = wp_parse_url( $value, PHP_URL_HOST );

			if ( ! is_string( $host ) || ! self::is_local_host( $host ) ) {
				return '';
			}

			$value = (string) wp_parse_url( $value, PHP_URL_PATH );
		}

		$value = (string) wp_parse_url( $value, PHP_URL_PATH );
		$value = '/' . trim( $value, '/' );

		return '/' === $value ? '/' : trailingslashit( $value );
	}

	/**
	 * Is this host the site's own?
	 *
	 * @param string $host Hostname.
	 */
	private static function is_local_host( string $host ): bool {
		$site_host = (string) wp_parse_url( home_url( '/' ), PHP_URL_HOST );

		return strtolower( $host ) === strtolower( $site_host );
	}

	/**
	 * Applies the map to the current request when it 404s.
	 */
	public static function maybe_redirect(): void {
		if ( ! is_404() || is_admin() ) {
			return;
		}

		// NOT sanitize_text_field(). That function strips percent-encoded
		// sequences on purpose — it is an XSS defence for display strings — and
		// a URL path is exactly where percent-encoding is meaningful. Four
		// retired Cyrillic spam URLs arrived as `/%d0%ba%d0%b0…/`, came out of
		// the sanitiser as a row of hyphens, matched nothing, and answered 404
		// where the map says 410. Every ASCII rule passed, which is why it took
		// a full 44-URL audit to see.
		//
		// The raw value is used, then cut at the query string and filtered to
		// the characters a path may contain. Nothing is echoed; it is only ever
		// a lookup key.
		$raw     = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
		$raw     = is_string( $raw ) ? $raw : '';
		$raw     = (string) preg_replace( '/[?#].*$/', '', $raw );
		$request = (string) preg_replace( '#[^A-Za-z0-9%._~!$&\'()*+,;=:@/-]#', '', $raw );

		if ( '' === $request ) {
			return;
		}

		$path = self::normalise_path( $request );
		$map  = self::map();

		if ( ! isset( $map[ $path ] ) ) {
			return;
		}

		$rule = $map[ $path ];

		if ( '410' === $rule['type'] ) {
			status_header( 410 );
			nocache_headers();
			return;
		}

		wp_safe_redirect( home_url( $rule['target'] ), (int) $rule['type'] );
		exit;
	}
}
