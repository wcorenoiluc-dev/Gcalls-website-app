<?php
/**
 * Audit log: who changed which route/section, when, and what happened.
 *
 * One `gcalls_cs_audit` post per entry, `post_content` = JSON. Non-public,
 * no UI of its own, never queried on the frontend. A dedicated CPT rather
 * than a custom table so it needs no schema migration and exports with the
 * site like every other post.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Audit {

	public function __construct() {
		add_action( 'init', array( $this, 'register' ) );
	}

	public function register(): void {
		register_post_type(
			CPT_AUDIT,
			array(
				'label'               => 'Gcalls Content Audit',
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
				'supports'            => array( 'title' ),
				'capability_type'     => array( 'gcalls_content_item', 'gcalls_content_items' ),
				'map_meta_cap'        => true,
				'capabilities'        => array(
					'edit_post'          => CAP_MANAGE,
					'read_post'          => CAP_EDIT,
					'delete_post'        => CAP_MANAGE,
					'edit_posts'         => CAP_MANAGE,
					'edit_others_posts'  => CAP_MANAGE,
					'publish_posts'      => CAP_MANAGE,
					'read_private_posts' => CAP_EDIT,
					'delete_posts'       => CAP_MANAGE,
				),
			)
		);
	}

	/**
	 * @param string   $action  save_draft | discard_draft | publish | restore_revision | restore_defaults | seo_update
	 * @param string[] $sections
	 */
	public static function append( string $action, string $route, array $sections, int $user_id, ?int $revision = null ): void {
		$user  = $user_id ? get_userdata( $user_id ) : null;
		$entry = array(
			'time'     => gmdate( 'c' ),
			'userId'   => $user_id,
			'user'     => $user ? $user->display_name : 'unknown',
			'route'    => $route,
			'section'  => implode( ',', array_map( 'strval', $sections ) ),
			'action'   => $action,
			'revision' => $revision,
		);
		wp_insert_post(
			array(
				'post_type'    => CPT_AUDIT,
				'post_status'  => 'private',
				'post_title'   => sprintf( '%s %s %s', $action, $route, $entry['section'] ),
				'post_content' => wp_json_encode( $entry ),
				'post_author'  => $user_id,
			),
			true
		);
	}

	/**
	 * @return array<int, array{time:string,user:string,route:string,section:string,action:string,revision:?int}>
	 */
	public static function query( string $route = '', int $limit = 50 ): array {
		$args = array(
			'post_type'        => CPT_AUDIT,
			'post_status'      => 'private',
			'numberposts'      => max( 1, min( 500, $limit ) ),
			'orderby'          => 'date',
			'order'            => 'DESC',
			'suppress_filters' => true,
		);
		if ( '' !== $route ) {
			$args['s'] = $route; // Title contains the route key; filtered again below to be exact.
		}
		$out = array();
		foreach ( get_posts( $args ) as $post ) {
			$entry = json_decode( (string) $post->post_content, true );
			if ( ! is_array( $entry ) ) {
				continue;
			}
			if ( '' !== $route && ( $entry['route'] ?? '' ) !== $route ) {
				continue;
			}
			$out[] = array(
				'time'     => (string) ( $entry['time'] ?? $post->post_date_gmt ),
				'user'     => (string) ( $entry['user'] ?? '' ),
				'route'    => (string) ( $entry['route'] ?? '' ),
				'section'  => (string) ( $entry['section'] ?? '' ),
				'action'   => (string) ( $entry['action'] ?? '' ),
				'revision' => isset( $entry['revision'] ) ? (int) $entry['revision'] : null,
			);
		}
		return $out;
	}
}
