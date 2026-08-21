<?php
/**
 * Front-end and editor asset loading.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Builds the Google Fonts URL for Open Sans and DM Mono.
 *
 * Filterable so a handover that must not call an external host can point this
 * at a self-hosted stylesheet, or return an empty string to drop the request
 * entirely. The CSS declares real fallbacks either way, so an empty return
 * degrades to system-ui rather than to nothing.
 *
 * @return string URL, or '' to skip loading web fonts.
 */
function gcalls_theme_fonts_url(): string {
	$url = add_query_arg(
		array(
			'family'  => 'Open+Sans:wght@400;500;600;700;800|DM+Mono:wght@400;500',
			'display' => 'swap',
		),
		'https://fonts.googleapis.com/css2'
	);

	return (string) apply_filters( 'gcalls_fonts_url', $url );
}

/**
 * Enqueues the front-end stylesheet and the navigation script.
 */
function gcalls_theme_enqueue_assets(): void {
	$fonts_url = gcalls_theme_fonts_url();

	if ( '' !== $fonts_url ) {
		wp_enqueue_style( 'gcalls-fonts', $fonts_url, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- Google serves its own versioned CSS; a ?ver= here only breaks their cache.
	}

	wp_enqueue_style(
		'gcalls-theme',
		GCALLS_THEME_URI . 'assets/css/theme.css',
		array(),
		GCALLS_THEME_VERSION
	);

	wp_enqueue_script(
		'gcalls-navigation',
		GCALLS_THEME_URI . 'assets/js/navigation.js',
		array(),
		GCALLS_THEME_VERSION,
		true
	);

	// Strings the script prints into the DOM. Passing them from PHP is what
	// keeps the script translatable without shipping a JS translation runtime.
	wp_localize_script(
		'gcalls-navigation',
		'gcallsNavStrings',
		array(
			'open'  => __( 'Mở menu', 'gcalls-theme' ),
			'close' => __( 'Đóng menu', 'gcalls-theme' ),
		)
	);

	if ( is_singular() && comments_open() && (bool) get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'gcalls_theme_enqueue_assets' );

/**
 * Loads the web fonts inside the block editor too, so an editor preview is not
 * set in a different typeface from the published page.
 */
function gcalls_theme_enqueue_editor_assets(): void {
	$fonts_url = gcalls_theme_fonts_url();

	if ( '' !== $fonts_url ) {
		wp_enqueue_style( 'gcalls-fonts', $fonts_url, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- See gcalls_theme_enqueue_assets().
	}
}
add_action( 'enqueue_block_editor_assets', 'gcalls_theme_enqueue_editor_assets' );

/**
 * Marks the navigation script as deferred.
 *
 * It is already printed in the footer, so this only matters for the parser
 * pause on a slow connection — but it is one attribute and it is free.
 *
 * @param array<string, mixed> $attributes Script tag attributes.
 * @return array<string, mixed>
 */
function gcalls_theme_defer_navigation( array $attributes ): array {
	if ( isset( $attributes['id'] ) && 'gcalls-navigation-js' === $attributes['id'] ) {
		$attributes['defer'] = true;
	}

	return $attributes;
}
add_filter( 'wp_script_attributes', 'gcalls_theme_defer_navigation' );
