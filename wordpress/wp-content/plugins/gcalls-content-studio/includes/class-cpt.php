<?php
/**
 * The `gcalls_content` post type: one post per React route.
 *
 * `post_content` holds the *published* JSON for the whole route (every
 * section, keyed by section slug) — deliberately, so WordPress's native
 * revision system (declared via `supports => revisions`) tracks every
 * publish as a real revision for free, with no hand-rolled history table.
 * `post_meta` holds the separate in-progress draft, which is why "Save
 * Draft" never disturbs the published version or its revision trail.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Cpt {

	public const META_DRAFT             = '_gcalls_draft_json';
	public const META_SCHEMA_VERSION    = '_gcalls_schema_version';
	public const META_PUBLISHED_REV     = '_gcalls_published_revision';
	public const META_LAST_EDITOR       = '_gcalls_last_editor';

	public function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	public function register(): void {
		register_post_type(
			CPT,
			array(
				'label'               => 'Gcalls Content',
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => false, // Custom admin screens own the UI, not the default post-list table.
				'show_in_menu'        => false,
				'show_in_rest'        => false, // This plugin's own REST controller replaces the default one.
				'exclude_from_search' => true,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'can_export'          => true,
				'hierarchical'        => false,
				'supports'            => array( 'title', 'revisions', 'author' ),
				'capability_type'     => array( 'gcalls_content_item', 'gcalls_content_items' ),
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'edit_post'          => CAP_EDIT,
					'read_post'          => CAP_EDIT,
					'delete_post'        => CAP_EDIT,
					'edit_posts'         => CAP_EDIT,
					'edit_others_posts'  => CAP_EDIT,
					'publish_posts'      => CAP_PUBLISH,
					'read_private_posts' => CAP_EDIT,
					'delete_posts'       => CAP_EDIT,
				),
			)
		);
	}

	/** Finds (or, once, creates) the single content record for a route. */
	public function get_or_create( string $route ): int {
		$existing = get_page_by_path( $route, OBJECT, CPT );
		if ( $existing instanceof \WP_Post ) {
			return $existing->ID;
		}

		$route_meta = Schema::routes()[ $route ] ?? null;
		$post_id    = wp_insert_post(
			array(
				'post_type'    => CPT,
				'post_status'  => 'publish',
				'post_title'   => $route_meta['label'] ?? $route,
				'post_name'    => $route,
				'post_content' => wp_json_encode( array() ),
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return 0;
		}

		update_post_meta( $post_id, self::META_SCHEMA_VERSION, SCHEMA_VERSION );
		return $post_id;
	}

	public function find( string $route ): ?\WP_Post {
		$post = get_page_by_path( $route, OBJECT, CPT );
		return $post instanceof \WP_Post ? $post : null;
	}
}
