<?php
/**
 * The `gcalls_content` post type: one post per React route key.
 *
 * `post_content` holds the *published* JSON for the whole route (every
 * section keyed by section key) so WordPress's native revision system tracks
 * every publish as a real revision. Post meta holds the separate in-progress
 * draft, the record version (optimistic lock), the audit-relevant who/when
 * fields and the SEO fallback. Nothing here is public, queryable, or given a
 * frontend URL.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Cpt {

	public const META_DRAFT          = '_gcalls_draft_json';
	public const META_SCHEMA_VERSION = '_gcalls_schema_version';
	public const META_VERSION        = '_gcalls_version';
	public const META_PUBLISHED_REV  = '_gcalls_published_revision';
	public const META_UPDATED_BY     = '_gcalls_updated_by';
	public const META_UPDATED_AT     = '_gcalls_updated_at';
	public const META_PUBLISHED_BY   = '_gcalls_published_by';
	public const META_PUBLISHED_AT   = '_gcalls_published_at';
	public const META_SEO            = '_gcalls_seo_json';

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
				'show_ui'             => false,
				'show_in_menu'        => false,
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'can_export'          => true,
				'hierarchical'        => false,
				'supports'            => array( 'title', 'revisions', 'author' ),
				'capability_type'     => array( 'gcalls_content_item', 'gcalls_content_items' ),
				'map_meta_cap'        => true,
				// Primitive caps only. Never alias edit_post/read_post/delete_post to these
				// names: WordPress would register them as META caps that need a post ID and
				// current_user_can( 'edit_gcalls_content' ) would always be denied.
				'capabilities'        => array(
					'edit_posts'         => CAP_EDIT,
					'edit_others_posts'  => CAP_EDIT,
					'publish_posts'      => CAP_PUBLISH,
					'read_private_posts' => CAP_EDIT,
					'delete_posts'       => CAP_EDIT,
					'delete_others_posts' => CAP_EDIT,
					'create_posts'       => CAP_EDIT,
				),
			)
		);
	}

	/** Finds (or, once, creates) the single content record for a route key. */
	public function get_or_create( string $route ): int {
		$existing = $this->find( $route );
		if ( $existing ) {
			return $existing->ID;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => CPT,
				'post_status'  => 'publish',
				'post_title'   => Manifest::route_label( $route ),
				'post_name'    => $route,
				'post_content' => wp_json_encode( array( 'sections' => array() ) ),
			),
			true
		);

		if ( is_wp_error( $post_id ) || ! is_int( $post_id ) || 0 === $post_id ) {
			return 0;
		}

		update_post_meta( $post_id, self::META_SCHEMA_VERSION, SCHEMA_VERSION );
		update_post_meta( $post_id, self::META_VERSION, 0 );
		return $post_id;
	}

	public function find( string $route ): ?\WP_Post {
		$posts = get_posts(
			array(
				'post_type'        => CPT,
				'name'             => $route,
				'post_status'      => 'any',
				'numberposts'      => 1,
				'suppress_filters' => true,
			)
		);
		$post = $posts[0] ?? null;
		return $post instanceof \WP_Post ? $post : null;
	}
}
