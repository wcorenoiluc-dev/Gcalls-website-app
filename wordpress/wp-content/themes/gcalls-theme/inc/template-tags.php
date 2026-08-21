<?php
/**
 * Template helpers.
 *
 * Every function here prints escaped output. Templates call these instead of
 * assembling markup inline, so escaping is decided once per piece of data
 * rather than once per template that happens to print it.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Prints the site branding: the custom logo if one is set, the site title
 * otherwise.
 *
 * The homepage gets an <h1> only when nothing else on the page would claim it;
 * on an inner page the site name is a link, not a heading, so the article title
 * stays the single h1.
 */
function gcalls_site_branding(): void {
	$tag = ( is_front_page() && ! is_paged() ) ? 'h1' : 'p';

	echo '<' . esc_attr( $tag ) . ' class="gcalls-branding">';

	if ( has_custom_logo() ) {
		the_custom_logo();
	} else {
		printf(
			'<a class="gcalls-branding__text" href="%1$s" rel="home">%2$s</a>',
			esc_url( home_url( '/' ) ),
			esc_html( get_bloginfo( 'name' ) )
		);
	}

	echo '</' . esc_attr( $tag ) . '>';
}

/**
 * Prints the published/updated line for a post.
 *
 * Shows the updated date only when it is meaningfully later than the published
 * date — WordPress stores a modified date for every save, so an unconditional
 * "updated" line would mark a typo fix as new content.
 */
function gcalls_posted_on(): void {
	$published = (int) get_post_time( 'U', true );
	$modified  = (int) get_post_modified_time( 'U', true );

	printf(
		'<time class="gcalls-meta__date" datetime="%1$s">%2$s</time>',
		esc_attr( (string) get_the_date( DATE_W3C ) ),
		esc_html( (string) get_the_date() )
	);

	if ( $modified > $published + DAY_IN_SECONDS ) {
		printf(
			' <time class="gcalls-meta__updated" datetime="%1$s">%2$s</time>',
			esc_attr( (string) get_the_modified_date( DATE_W3C ) ),
			esc_html( sprintf( /* translators: %s: date the article was last updated. */ __( 'Cập nhật %s', 'gcalls-theme' ), get_the_modified_date() ) )
		);
	}
}

/**
 * Prints the taxonomy terms attached to a post.
 *
 * Prefers the Gcalls Core HUB taxonomy when the plugin is active, and falls
 * back to the built-in category so the template still says something useful
 * with the plugin switched off.
 */
function gcalls_post_terms(): void {
	$taxonomy = taxonomy_exists( 'gcalls_hub' ) ? 'gcalls_hub' : 'category';
	$terms    = get_the_terms( get_the_ID(), $taxonomy );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return;
	}

	echo '<ul class="gcalls-terms">';

	foreach ( $terms as $term ) {
		$link = get_term_link( $term );

		if ( is_wp_error( $link ) ) {
			continue;
		}

		printf(
			'<li class="gcalls-terms__item"><a href="%1$s">%2$s</a></li>',
			esc_url( $link ),
			esc_html( $term->name )
		);
	}

	echo '</ul>';
}

/**
 * Prints the featured image with the dimensions WordPress recorded.
 *
 * `post-thumbnail` carries width and height attributes, which is what stops the
 * page from reflowing as images arrive. The first image in the main query is
 * eager and high priority because it is the LCP candidate; everything after it
 * is lazy.
 *
 * @param string $size Registered image size.
 */
function gcalls_post_thumbnail( string $size = 'post-thumbnail' ): void {
	if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
		return;
	}

	static $rendered = 0;
	$is_first = ( 0 === $rendered );
	++$rendered;

	$attributes = $is_first
		? array(
			'loading'       => 'eager',
			'fetchpriority' => 'high',
			'decoding'      => 'async',
		)
		: array(
			'loading'  => 'lazy',
			'decoding' => 'async',
		);

	echo '<figure class="gcalls-thumbnail">';
	the_post_thumbnail( $size, $attributes );
	echo '</figure>';
}

/**
 * Prints the breadcrumb trail.
 *
 * Delegates to Gcalls Core when the plugin is active — the trail and its
 * structured data have to agree, and the plugin owns both. Prints nothing at
 * all when the plugin is absent, which is correct: a breadcrumb that disagrees
 * with the schema is worse than no breadcrumb.
 */
function gcalls_breadcrumbs(): void {
	if ( function_exists( 'gcalls_core_breadcrumbs' ) ) {
		gcalls_core_breadcrumbs();
	}
}

/**
 * Prints numbered pagination for archive templates.
 */
function gcalls_pagination(): void {
	the_posts_pagination(
		array(
			'mid_size'           => 2,
			'prev_text'          => esc_html__( 'Trang trước', 'gcalls-theme' ),
			'next_text'          => esc_html__( 'Trang sau', 'gcalls-theme' ),
			'screen_reader_text' => esc_html__( 'Điều hướng trang', 'gcalls-theme' ),
			'aria_label'         => esc_html__( 'Trang', 'gcalls-theme' ),
		)
	);
}
