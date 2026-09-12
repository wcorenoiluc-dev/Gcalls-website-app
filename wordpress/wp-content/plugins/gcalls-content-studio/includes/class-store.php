<?php
/**
 * Domain logic for reading/writing a route's content — the layer both the
 * REST controller and the admin screen call into, so the two never drift.
 *
 * Storage shape of `post_content` (published) and the `_gcalls_draft_json`
 * meta (draft) is identical:
 *   { "sections": { "hero": { ...fields... } } }
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Store {

	private Cpt $cpt;

	public function __construct() {
		$this->cpt = new Cpt();
	}

	/** @return array{sections: array<string, array<string, mixed>>} */
	public function published( string $route ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array( 'sections' => array() );
		}
		$decoded = json_decode( (string) $post->post_content, true );
		return is_array( $decoded ) && isset( $decoded['sections'] ) ? $decoded : array( 'sections' => array() );
	}

	/** @return array{sections: array<string, array<string, mixed>>}|null null when there is no unpublished draft */
	public function draft( string $route ): ?array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return null;
		}
		$raw = get_post_meta( $post->ID, Cpt::META_DRAFT, true );
		if ( ! is_string( $raw ) || '' === $raw ) {
			return null;
		}
		$decoded = json_decode( $raw, true );
		return is_array( $decoded ) ? $decoded : null;
	}

	/**
	 * Merges the sanitized fields for one section into the draft and saves
	 * it. Never touches post_content, so the live published version and its
	 * revision history are untouched by a draft save.
	 *
	 * @param array<string, mixed> $sanitized_fields
	 */
	public function save_draft( string $route, string $section, array $sanitized_fields, int $editor_id ): void {
		$post_id = $this->cpt->get_or_create( $route );
		$current = $this->draft( $route ) ?? $this->published( $route );

		$current['sections'][ $section ] = array_merge(
			$current['sections'][ $section ] ?? array(),
			$sanitized_fields
		);

		update_post_meta( $post_id, Cpt::META_DRAFT, wp_json_encode( $current ) );
		update_post_meta( $post_id, Cpt::META_LAST_EDITOR, $editor_id );
		update_post_meta( $post_id, '_gcalls_draft_modified', time() );
	}

	/**
	 * Copies the draft into the published post_content, which WordPress
	 * turns into a new revision automatically. Clears the draft on success.
	 *
	 * @return array{0: bool, 1: array<int, string>} [success, errors]
	 */
	public function publish( string $route, int $editor_id ): array {
		$draft = $this->draft( $route );
		if ( null === $draft ) {
			return array( false, array( 'no_draft' ) );
		}

		$errors = array();
		foreach ( $draft['sections'] as $section => $fields ) {
			$errors = array_merge( $errors, Schema::publish_errors( $route, $section, $fields ) );
		}
		if ( ! empty( $errors ) ) {
			return array( false, $errors );
		}

		$post_id = $this->cpt->get_or_create( $route );
		$merged  = $this->published( $route );
		foreach ( $draft['sections'] as $section => $fields ) {
			$merged['sections'][ $section ] = $fields;
		}

		wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => wp_json_encode( $merged ),
			)
		);

		$revisions = wp_get_post_revisions( $post_id, array( 'numberposts' => 1 ) );
		$latest    = reset( $revisions );
		if ( $latest instanceof \WP_Post ) {
			update_post_meta( $post_id, Cpt::META_PUBLISHED_REV, $latest->ID );
		}
		update_post_meta( $post_id, Cpt::META_LAST_EDITOR, $editor_id );
		delete_post_meta( $post_id, Cpt::META_DRAFT );

		return array( true, array() );
	}

	/**
	 * @return array<int, array{id: int, date: string, author: string, is_published: bool}>
	 */
	public function revisions( string $route ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array();
		}
		$published_rev = (int) get_post_meta( $post->ID, Cpt::META_PUBLISHED_REV, true );

		$out = array();
		foreach ( wp_get_post_revisions( $post->ID ) as $revision ) {
			$author = get_userdata( (int) $revision->post_author );
			$out[]  = array(
				'id'           => $revision->ID,
				'date'         => $revision->post_modified_gmt,
				'author'       => $author ? $author->display_name : 'unknown',
				'is_published' => $revision->ID === $published_rev,
			);
		}
		return $out;
	}

	/** Restores an old revision as the new published version. Itself creates a fresh revision — restoring never loses history. */
	public function restore_revision( string $route, int $revision_id, int $editor_id ): bool {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return false;
		}
		$revision = get_post( $revision_id );
		if ( ! $revision || 'revision' !== $revision->post_type || (int) $revision->post_parent !== $post->ID ) {
			return false; // Refuses to restore a revision that does not belong to this route's post.
		}

		wp_restore_post_revision( $revision_id );

		$revisions = wp_get_post_revisions( $post->ID, array( 'numberposts' => 1 ) );
		$latest    = reset( $revisions );
		if ( $latest instanceof \WP_Post ) {
			update_post_meta( $post->ID, Cpt::META_PUBLISHED_REV, $latest->ID );
		}
		update_post_meta( $post->ID, Cpt::META_LAST_EDITOR, $editor_id );
		return true;
	}

	/** "Khôi phục mặc định React" — publishes an empty section so the adapter falls through to its source-controlled defaults. Creates a revision like any other publish, so it is itself restorable. */
	public function restore_defaults( string $route, string $section, int $editor_id ): void {
		$post_id = $this->cpt->get_or_create( $route );
		$merged  = $this->published( $route );
		unset( $merged['sections'][ $section ] );

		wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => wp_json_encode( $merged ),
			)
		);

		$revisions = wp_get_post_revisions( $post_id, array( 'numberposts' => 1 ) );
		$latest    = reset( $revisions );
		if ( $latest instanceof \WP_Post ) {
			update_post_meta( $post_id, Cpt::META_PUBLISHED_REV, $latest->ID );
		}
		update_post_meta( $post_id, Cpt::META_LAST_EDITOR, $editor_id );

		$draft = $this->draft( $route );
		if ( null !== $draft ) {
			unset( $draft['sections'][ $section ] );
			update_post_meta( $post_id, Cpt::META_DRAFT, wp_json_encode( $draft ) );
		}
	}

	public function meta( string $route ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array();
		}
		$editor_id = (int) get_post_meta( $post->ID, Cpt::META_LAST_EDITOR, true );
		$editor    = $editor_id ? get_userdata( $editor_id ) : null;
		return array(
			'lastModified'       => $post->post_modified_gmt,
			'lastEditor'         => $editor ? $editor->display_name : null,
			'hasDraft'           => null !== $this->draft( $route ),
			'publishedRevision'  => (int) get_post_meta( $post->ID, Cpt::META_PUBLISHED_REV, true ),
			'schemaVersion'      => (int) ( get_post_meta( $post->ID, Cpt::META_SCHEMA_VERSION, true ) ?: SCHEMA_VERSION ),
		);
	}
}
