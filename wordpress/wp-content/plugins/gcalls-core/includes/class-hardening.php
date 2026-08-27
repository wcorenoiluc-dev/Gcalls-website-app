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
		//
		// Priority 0 is load-bearing. WordPress registers redirect_canonical()
		// on this same hook at priority 10, and equal priorities run in
		// registration order — core's default filters are always registered
		// before a plugin's. At priority 10 this callback therefore ran SECOND,
		// after core had already answered `?author=1` with
		// `301 Location: /author/<user_nicename>/` and exited. The 404 below
		// was correct and simply never reached, because redirect_canonical()
		// rewrites the ID form only when count_user_posts() is non-zero.
		//
		// That is the whole reason `?author=2` already 404s while `?author=1`
		// leaks: the difference is post ownership, not the account. Attributing
		// content to a new administrator MOVES this leak to that account
		// instead of removing it, so this fix has to precede any reassignment.
		add_action( 'template_redirect', array( self::class, 'block_author_archives' ), 0 );

		// oEmbed answers unauthenticated and puts author_name and author_url —
		// the login slug and the archive URL — into a JSON response for every
		// published post. Closing the archive without closing this only moves
		// the disclosure to a different endpoint.
		add_filter( 'oembed_response_data', array( self::class, 'strip_oembed_author' ) );

		// Core's sitemap index publishes an author sitemap listing the same
		// slugs. Rank Math owns sitemaps on this site, so the provider is
		// normally unreachable — this keeps it that way if that ever changes.
		add_filter( 'wp_sitemaps_add_provider', array( self::class, 'remove_users_sitemap' ), 10, 2 );

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

		// Cancel the canonical redirect for THIS request only. A 404 body is
		// not enough on its own: redirect_canonical() would still run at
		// priority 10 and send `301 Location: /author/<user_nicename>/`, which
		// discloses the login slug in a header before any body is considered.
		// Removing the callback here rather than filtering it globally leaves
		// canonical redirects working for every other URL, which is what keeps
		// permalinks and the trailing-slash policy intact.
		remove_action( 'template_redirect', 'redirect_canonical' );

		// The same disclosure through the other door: core may guess a
		// permalink for a 404 and redirect to it.
		add_filter( 'do_redirect_guess_404_permalink', '__return_false' );

		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}

	/**
	 * Removes the author identity from oEmbed responses.
	 *
	 * The embed keeps working — title, provider, thumbnail and the iframe
	 * markup are untouched. Only the two fields that name the account are
	 * dropped, and no consumer requires them.
	 *
	 * @param mixed $data oEmbed response data.
	 * @return mixed
	 */
	public static function strip_oembed_author( $data ) {
		if ( ! is_array( $data ) ) {
			return $data;
		}

		unset( $data['author_name'], $data['author_url'] );

		return $data;
	}

	/**
	 * Drops the core users sitemap provider.
	 *
	 * @param mixed  $provider Provider instance, or false if already removed.
	 * @param string $name     Provider name.
	 * @return mixed
	 */
	public static function remove_users_sitemap( $provider, $name ) {
		return 'users' === $name ? false : $provider;
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
				// A route's array holds numerically-indexed handlers AND a
				// 'schema' entry whose value is a callable, not a handler.
				// Writing a permission_callback into that callable turns a valid
				// two-element callable into an invalid three-element array, and
				// WordPress then fatals on EVERY REST request — including the
				// endpoints this rule was never meant to touch, which is what
				// takes the Elementor editor down with it.
				if ( ! is_int( $index ) || ! is_array( $handler ) || ! isset( $handler['callback'] ) ) {
					continue;
				}

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
