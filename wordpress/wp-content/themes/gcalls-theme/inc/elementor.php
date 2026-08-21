<?php
/**
 * Elementor integration.
 *
 * The theme must work with Elementor installed and work without it. Every
 * function here is guarded, so deactivating Elementor leaves a site that still
 * renders — pages fall back to the default template and the stored Elementor
 * markup is simply not printed.
 *
 * Elementor Pro is NOT assumed. Theme Builder (Pro) can take over header and
 * footer if a licence is ever added, but nothing here requires it: the header
 * and footer in this theme are real PHP templates that a handover editor can
 * change from Appearance without buying anything.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Is Elementor active and loaded?
 */
function gcalls_elementor_active(): bool {
	return did_action( 'elementor/loaded' ) > 0;
}

/**
 * Was the current singular view actually built in Elementor?
 *
 * Distinguishes "Elementor is installed" from "this page has Elementor
 * content", which is the distinction that decides whether to wrap the output
 * in the theme's own container. Wrapping Elementor sections in a 1280px
 * container would break every full-bleed section the editor builds.
 *
 * @param int|null $post_id Defaults to the current post.
 */
function gcalls_is_elementor_page( ?int $post_id = null ): bool {
	if ( ! gcalls_elementor_active() ) {
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
 * Restricts Elementor to Pages.
 *
 * Blog posts stay in the block editor on purpose: the 18 articles are long-form
 * prose with FAQ blocks and internal links, and prose edited as Elementor
 * widgets cannot be exported, diffed or re-imported. Pages are layout; posts
 * are content.
 *
 * Filterable rather than hardcoded so enabling another post type later is a
 * one-line change in a plugin, not a theme edit.
 *
 * @param array<int, string> $post_types Post types Elementor may edit.
 * @return array<int, string>
 */
function gcalls_elementor_post_types( array $post_types ): array {
	return (array) apply_filters( 'gcalls_elementor_post_types', array( 'page' ) );
}
add_filter( 'elementor/utils/get_public_post_types', 'gcalls_elementor_post_types' );

/**
 * Registers the theme's own Elementor-friendly page template.
 *
 * Elementor ships Canvas and Full Width templates of its own. This one differs:
 * it keeps the theme header and footer (so navigation is consistent across the
 * site) while removing the content container, which is what a section-based
 * layout needs.
 *
 * @param array<string, string> $templates Registered page templates.
 * @return array<string, string>
 */
function gcalls_register_page_templates( array $templates ): array {
	$templates['page-templates/full-width.php'] = __( 'Toàn chiều rộng (Elementor)', 'gcalls-theme' );

	return $templates;
}
add_filter( 'theme_page_templates', 'gcalls_register_page_templates' );

/**
 * Tells Elementor which selector wraps the content it renders.
 *
 * Without this the editor's inline editing highlights the wrong box on a
 * full-width page.
 */
function gcalls_elementor_content_selector(): void {
	if ( ! gcalls_elementor_active() ) {
		return;
	}

	add_theme_support( 'elementor' );
}
add_action( 'after_setup_theme', 'gcalls_elementor_content_selector', 20 );
