<?php
/**
 * Cache invalidation for exactly one route after a publish/restore.
 *
 * Purges only the affected URL: object cache for the record, LiteSpeed URL
 * purge, WP Super Cache / W3 Total Cache single-URL purge when those plugins
 * are present, plus a public action other plugins can hook. Never a full-site
 * purge. Preview always bypasses cache on its own (nocache_headers()).
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Cache {

	public static function public_url( string $route ): string {
		$path = Manifest::route_path( $route );
		return home_url( '' === $path ? '/' : $path );
	}

	public static function purge_route( string $route, int $post_id = 0 ): void {
		$url = self::public_url( $route );

		if ( $post_id ) {
			clean_post_cache( $post_id );
		}

		// LiteSpeed Cache (the demo host runs LiteSpeed SAPI).
		do_action( 'litespeed_purge_url', $url );

		// WP Super Cache.
		if ( function_exists( 'wpsc_delete_url_cache' ) ) {
			wpsc_delete_url_cache( $url );
		}

		// W3 Total Cache.
		if ( function_exists( 'w3tc_flush_url' ) ) {
			w3tc_flush_url( $url );
		}

		// The WordPress page that owns the path (Rank Math meta / page cache keyed by post).
		$page = Seo::owning_page( $route );
		if ( $page ) {
			clean_post_cache( $page->ID );
		}

		/**
		 * Fires after a route's published content changed and its cache was purged.
		 *
		 * @param string $route Route key.
		 * @param string $url   Public URL.
		 */
		do_action( 'gcalls_content_published', $route, $url );
	}
}
