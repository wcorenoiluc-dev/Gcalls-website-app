<?php
/**
 * Global-namespace template tags.
 *
 * This file declares NO namespace on purpose. The theme calls these through
 * `function_exists()`, which resolves against the global namespace — a function
 * declared inside `namespace Gcalls\Core` would be
 * `Gcalls\Core\gcalls_core_breadcrumbs()` and the theme's check would silently
 * fail, taking the breadcrumb trail off every page with no error to notice.
 *
 * Keep this file free of logic: each function is a one-line bridge to a class
 * that holds the real behaviour.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Prints the breadcrumb trail.
 */
function gcalls_core_breadcrumbs(): void {
	\Gcalls\Core\Breadcrumbs::render();
}

/**
 * Returns the breadcrumb trail as data, for callers that need to render it
 * themselves.
 *
 * @return array<int, array{label: string, url: string}>
 */
function gcalls_core_breadcrumb_trail(): array {
	return \Gcalls\Core\Breadcrumbs::trail();
}

/**
 * Is the current request served by a page built in Elementor?
 *
 * Mirrors the theme helper of the same purpose so a plugin or a must-use
 * snippet can ask the question without depending on the theme being active.
 */
function gcalls_core_is_elementor_page( ?int $post_id = null ): bool {
	if ( did_action( 'elementor/loaded' ) < 1 ) {
		return false;
	}

	$post_id = $post_id ?? get_the_ID();

	if ( ! $post_id ) {
		return false;
	}

	$documents = \Elementor\Plugin::$instance->documents ?? null;

	if ( ! $documents || ! method_exists( $documents, 'get' ) ) {
		return false;
	}

	$document = $documents->get( $post_id );

	return $document instanceof \Elementor\Core\Base\Document && $document->is_built_with_elementor();
}

/**
 * Renders the FAQ accordion for the current post.
 *
 * A template tag as well as a shortcode: `single.php` calls this directly,
 * because a post body should not have to carry a shortcode for something that
 * belongs to every article.
 *
 * @param int|null $post_id Defaults to the current post.
 */
function gcalls_core_faq( ?int $post_id = null ): void {
	\Gcalls\Core\Faq::render( $post_id );
}

/**
 * The canonical HUB list, in the order the plugin declares it.
 *
 * Exists so the theme can render a complete filter — including hubs that
 * carry no article yet — without reaching into the class or hardcoding the
 * thirteen slugs a second time. `get_terms()` cannot answer this: it returns
 * what the database holds, in whatever order was asked for, and a hub that has
 * never been used is indistinguishable from one that does not exist.
 *
 * @return array<string, array{slug: string, name: string}> Keyed by HUB id.
 */
function gcalls_core_hubs(): array {
	return \Gcalls\Core\Hub_Taxonomy::hubs();
}
