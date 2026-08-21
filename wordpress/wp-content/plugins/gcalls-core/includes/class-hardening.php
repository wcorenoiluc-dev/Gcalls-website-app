<?php
/**
 * Site hardening.
 *
 * Small, reversible defaults. Every one of these is also enforced at the web
 * server in config/htaccess-wordpress.conf — a single layer can be edited away
 * by a plugin or a panel setting, two cannot be by accident.
 *
 * This is NOT a security plugin and must not grow into one. Checkpoint H is
 * explicit that overlapping security/optimisation plugins are not to be
 * installed; the same reasoning applies to reimplementing them here.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Turns off interfaces this site does not use.
 */
final class Hardening {

	/**
	 * Registers the filters.
	 */
	public static function init(): void {
		// Nothing here uses XML-RPC: no Jetpack, no mobile app, no remote
		// publishing. Leaving it on serves pingback amplification and password
		// spraying, and nothing else.
		add_filter( 'xmlrpc_enabled', '__return_false' );

		// Pingbacks travel over XML-RPC; removing the header stops the site
		// advertising an endpoint that now refuses everything.
		add_filter( 'wp_headers', array( self::class, 'remove_pingback_header' ) );

		// The generator tag announces the exact WordPress version, which is
		// free reconnaissance. It is not a fix for anything — patching is —
		// but it costs nothing to withhold.
		remove_action( 'wp_head', 'wp_generator' );

		// The author archive maps user IDs to login names, which is the first
		// half of a credential-stuffing attempt. This demo has no author
		// archives to lose.
		add_action( 'template_redirect', array( self::class, 'block_author_archives' ) );

		// The REST users endpoint leaks the same list to unauthenticated
		// callers. Editors keep their access; anonymous callers do not.
		add_filter( 'rest_endpoints', array( self::class, 'restrict_user_endpoints' ) );
	}

	/**
	 * Drops the X-Pingback header.
	 *
	 * @param array<string, string> $headers Response headers.
	 * @return array<string, string>
	 */
	public static function remove_pingback_header( array $headers ): array {
		unset( $headers['X-Pingback'] );

		return $headers;
	}

	/**
	 * Sends author archives to the 404 handler.
	 */
	public static function block_author_archives(): void {
		if ( ! is_author() ) {
			return;
		}

		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}

	/**
	 * Requires a logged-in user to list users over REST.
	 *
	 * The block editor calls these endpoints as an authenticated user, so this
	 * does not break editing — it only closes them to anonymous callers.
	 *
	 * @param array<string, mixed> $endpoints REST endpoints.
	 * @return array<string, mixed>
	 */
	public static function restrict_user_endpoints( array $endpoints ): array {
		foreach ( array( '/wp/v2/users', '/wp/v2/users/(?P<id>[\d]+)' ) as $route ) {
			if ( ! isset( $endpoints[ $route ] ) ) {
				continue;
			}

			foreach ( $endpoints[ $route ] as $index => $handler ) {
				$existing = $handler['permission_callback'] ?? null;

				$endpoints[ $route ][ $index ]['permission_callback'] = static function ( $request ) use ( $existing ) {
					if ( ! is_user_logged_in() ) {
						return new \WP_Error(
							'gcalls_rest_forbidden',
							__( 'Cần đăng nhập để xem danh sách người dùng.', 'gcalls-core' ),
							array( 'status' => rest_authorization_required_code() )
						);
					}

					return is_callable( $existing ) ? $existing( $request ) : true;
				};
			}
		}

		return $endpoints;
	}
}
