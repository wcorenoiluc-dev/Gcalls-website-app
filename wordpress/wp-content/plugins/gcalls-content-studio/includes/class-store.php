<?php
/**
 * Domain logic for reading/writing a route's content — the layer REST, the
 * admin screens and the config filter all call into, so they never drift.
 *
 * Storage shape of `post_content` (published) and the draft meta is identical:
 *   { "sections": { "<sectionKey>": { ...fields... } } }
 *
 * Every write bumps `_gcalls_version`; callers pass the version they loaded
 * (`baseVersion`) and get a conflict back when someone else wrote first.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Store {

	public const ERR_CONFLICT = 'conflict';

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
		return $this->decode_sections( (string) $post->post_content );
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
		return is_array( $decoded ) && isset( $decoded['sections'] ) && is_array( $decoded['sections'] ) ? $decoded : null;
	}

	/** @return array{sections: array<string, array<string, mixed>>} */
	private function decode_sections( string $json ): array {
		$decoded = json_decode( $json, true );
		if ( is_array( $decoded ) && isset( $decoded['sections'] ) && is_array( $decoded['sections'] ) ) {
			return array( 'sections' => $decoded['sections'] );
		}
		return array( 'sections' => array() );
	}

	public function version( string $route ): int {
		$post = $this->cpt->find( $route );
		return $post ? (int) get_post_meta( $post->ID, Cpt::META_VERSION, true ) : 0;
	}

	/** True when the caller's base version matches the stored one (or the record does not exist yet). */
	private function lock_ok( string $route, ?int $base_version ): bool {
		if ( null === $base_version ) {
			return true; // Legacy/unsupplied: trust the caller. The admin always sends it.
		}
		return $this->version( $route ) === $base_version;
	}

	private function bump( int $post_id, int $user_id ): int {
		$version = (int) get_post_meta( $post_id, Cpt::META_VERSION, true ) + 1;
		update_post_meta( $post_id, Cpt::META_VERSION, $version );
		update_post_meta( $post_id, Cpt::META_UPDATED_BY, $user_id );
		update_post_meta( $post_id, Cpt::META_UPDATED_AT, gmdate( 'c' ) );
		return $version;
	}

	/**
	 * Merges the sanitized fields for one section into the draft and saves
	 * it. Never touches post_content, so the live published version and its
	 * revision history are untouched by a draft save.
	 *
	 * @param array<string, mixed> $sanitized_fields
	 * @return array{0: bool, 1: array<int, string>}
	 */
	public function save_draft( string $route, string $section, array $sanitized_fields, int $user_id, ?int $base_version ): array {
		if ( ! $this->lock_ok( $route, $base_version ) ) {
			return array( false, array( self::ERR_CONFLICT ) );
		}
		$post_id = $this->cpt->get_or_create( $route );
		if ( 0 === $post_id ) {
			return array( false, array( 'storage_failed' ) );
		}
		$current = $this->draft( $route ) ?? $this->published( $route );

		$current['sections'][ $section ] = $sanitized_fields;

		update_post_meta( $post_id, Cpt::META_DRAFT, wp_json_encode( $current ) );
		$this->bump( $post_id, $user_id );
		Audit::append( 'save_draft', $route, array( $section ), $user_id );
		return array( true, array() );
	}

	/** @return array{0: bool, 1: array<int, string>} */
	public function discard_draft( string $route, int $user_id ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array( true, array() );
		}
		$draft = $this->draft( $route );
		delete_post_meta( $post->ID, Cpt::META_DRAFT );
		$this->bump( $post->ID, $user_id );
		Audit::append( 'discard_draft', $route, array_keys( $draft['sections'] ?? array() ), $user_id );
		return array( true, array() );
	}

	/**
	 * Copies the draft into the published post_content (WordPress creates a
	 * revision), clears the draft, records who/when, purges the route cache.
	 *
	 * @return array{0: bool, 1: array<int, string>} [success, errors]
	 */
	public function publish( string $route, int $user_id, ?int $base_version ): array {
		if ( ! $this->lock_ok( $route, $base_version ) ) {
			return array( false, array( self::ERR_CONFLICT ) );
		}
		$draft = $this->draft( $route );
		if ( null === $draft ) {
			return array( false, array( 'no_draft' ) );
		}

		$errors = array();
		foreach ( $draft['sections'] as $section => $fields ) {
			if ( ! Schema::section_exists( $route, (string) $section ) ) {
				$errors[] = 'unknown_section:' . $section;
				continue;
			}
			// Re-sanitize at publish time: the manifest may have changed
			// since the draft was saved, and nothing unvalidated may go live.
			[ $clean, $sanitize_errors ] = Schema::sanitize( $route, (string) $section, is_array( $fields ) ? $fields : array() );
			$hard = array_filter( $sanitize_errors, static fn( string $e ) => ! str_starts_with( $e, 'required:' ) && ! str_starts_with( $e, 'missing:' ) );
			$errors = array_merge( $errors, array_values( $hard ), Schema::publish_errors( $route, (string) $section, $clean ) );
			$draft['sections'][ $section ] = $clean;
		}
		if ( ! empty( $errors ) ) {
			return array( false, array_values( array_unique( $errors ) ) );
		}

		$post_id = $this->cpt->get_or_create( $route );
		if ( 0 === $post_id ) {
			return array( false, array( 'storage_failed' ) );
		}
		$merged = $this->published( $route );
		foreach ( $draft['sections'] as $section => $fields ) {
			$merged['sections'][ $section ] = $fields;
		}

		$result = wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => wp_json_encode( $merged ),
				'post_author'  => $user_id,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			return array( false, array( 'storage_failed' ) );
		}

		$revision_id = $this->record_latest_revision( $post_id );
		update_post_meta( $post_id, Cpt::META_PUBLISHED_BY, $user_id );
		update_post_meta( $post_id, Cpt::META_PUBLISHED_AT, gmdate( 'c' ) );
		update_post_meta( $post_id, Cpt::META_SCHEMA_VERSION, SCHEMA_VERSION );
		delete_post_meta( $post_id, Cpt::META_DRAFT );
		$this->bump( $post_id, $user_id );

		Audit::append( 'publish', $route, array_keys( $draft['sections'] ), $user_id, $revision_id );
		Cache::purge_route( $route, $post_id );

		return array( true, array() );
	}

	private function record_latest_revision( int $post_id ): ?int {
		$revisions = wp_get_post_revisions( $post_id, array( 'numberposts' => 1 ) );
		$latest    = reset( $revisions );
		if ( $latest instanceof \WP_Post ) {
			update_post_meta( $post_id, Cpt::META_PUBLISHED_REV, $latest->ID );
			return (int) $latest->ID;
		}
		return null;
	}

	/**
	 * @return array<int, array{id:int,date:string,author:string,isPublished:bool,summary:string}>
	 */
	public function revisions( string $route ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array();
		}
		$published_rev = (int) get_post_meta( $post->ID, Cpt::META_PUBLISHED_REV, true );
		$revisions     = array_values( wp_get_post_revisions( $post->ID ) ); // newest first

		$out = array();
		foreach ( $revisions as $i => $revision ) {
			$author = get_userdata( (int) $revision->post_author );
			$older  = $revisions[ $i + 1 ] ?? null;
			$out[]  = array(
				'id'          => (int) $revision->ID,
				'date'        => (string) $revision->post_modified_gmt,
				'author'      => $author ? $author->display_name : 'unknown',
				'isPublished' => (int) $revision->ID === $published_rev,
				'summary'     => $this->summarize_change( (string) $revision->post_content, $older ? (string) $older->post_content : '' ),
			);
		}
		return $out;
	}

	/** Names the section keys whose JSON differs between two revisions. */
	private function summarize_change( string $newer, string $older ): string {
		$a = $this->decode_sections( $newer )['sections'];
		$b = $this->decode_sections( $older )['sections'];
		$changed = array();
		foreach ( array_unique( array_merge( array_keys( $a ), array_keys( $b ) ) ) as $key ) {
			if ( wp_json_encode( $a[ $key ] ?? null ) !== wp_json_encode( $b[ $key ] ?? null ) ) {
				$changed[] = (string) $key;
			}
		}
		return implode( ', ', $changed );
	}

	/** @return array{id:int,date:string,author:string,sections:array<string, array<string, mixed>>}|null */
	public function revision( string $route, int $revision_id ): ?array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return null;
		}
		$revision = get_post( $revision_id );
		if ( ! $revision instanceof \WP_Post || 'revision' !== $revision->post_type || (int) $revision->post_parent !== (int) $post->ID ) {
			return null;
		}
		$author = get_userdata( (int) $revision->post_author );
		return array(
			'id'       => (int) $revision->ID,
			'date'     => (string) $revision->post_modified_gmt,
			'author'   => $author ? $author->display_name : 'unknown',
			'sections' => $this->decode_sections( (string) $revision->post_content )['sections'],
		);
	}

	/**
	 * Restores an old revision as the new published version. Itself creates a
	 * fresh revision — restoring never loses history.
	 *
	 * @return array{0: bool, 1: array<int, string>}
	 */
	public function restore_revision( string $route, int $revision_id, int $user_id, ?int $base_version ): array {
		if ( ! $this->lock_ok( $route, $base_version ) ) {
			return array( false, array( self::ERR_CONFLICT ) );
		}
		$post = $this->cpt->find( $route );
		if ( ! $post || null === $this->revision( $route, $revision_id ) ) {
			return array( false, array( 'invalid_revision' ) );
		}

		$restored = wp_restore_post_revision( $revision_id );
		if ( ! $restored ) {
			return array( false, array( 'storage_failed' ) );
		}

		$new_rev = $this->record_latest_revision( $post->ID );
		update_post_meta( $post->ID, Cpt::META_PUBLISHED_BY, $user_id );
		update_post_meta( $post->ID, Cpt::META_PUBLISHED_AT, gmdate( 'c' ) );
		$this->bump( $post->ID, $user_id );

		Audit::append( 'restore_revision', $route, array( (string) $revision_id ), $user_id, $new_rev );
		Cache::purge_route( $route, $post->ID );
		return array( true, array() );
	}

	/**
	 * "Khôi phục mặc định React" — publishes the route with this section
	 * removed, so the adapter falls through to its source-controlled
	 * defaults. Creates a revision like any other publish.
	 */
	public function restore_defaults( string $route, string $section, int $user_id ): void {
		$post_id = $this->cpt->get_or_create( $route );
		if ( 0 === $post_id ) {
			return;
		}
		$merged = $this->published( $route );
		unset( $merged['sections'][ $section ] );

		wp_update_post(
			array(
				'ID'           => $post_id,
				'post_content' => wp_json_encode( $merged ),
				'post_author'  => $user_id,
			)
		);

		$rev = $this->record_latest_revision( $post_id );
		update_post_meta( $post_id, Cpt::META_PUBLISHED_BY, $user_id );
		update_post_meta( $post_id, Cpt::META_PUBLISHED_AT, gmdate( 'c' ) );

		$draft = $this->draft( $route );
		if ( null !== $draft ) {
			unset( $draft['sections'][ $section ] );
			if ( empty( $draft['sections'] ) ) {
				delete_post_meta( $post_id, Cpt::META_DRAFT );
			} else {
				update_post_meta( $post_id, Cpt::META_DRAFT, wp_json_encode( $draft ) );
			}
		}
		$this->bump( $post_id, $user_id );
		Audit::append( 'restore_defaults', $route, array( $section ), $user_id, $rev );
		Cache::purge_route( $route, $post_id );
	}

	/** @return array<string, mixed> Contract §5 `meta`. */
	public function meta( string $route ): array {
		$post = $this->cpt->find( $route );
		if ( ! $post ) {
			return array(
				'version'           => 0,
				'status'            => 'published',
				'hasDraft'          => false,
				'updatedAt'         => null,
				'updatedBy'         => null,
				'publishedAt'       => null,
				'publishedBy'       => null,
				'publishedRevision' => 0,
				'schemaVersion'     => SCHEMA_VERSION,
			);
		}
		$has_draft = null !== $this->draft( $route );
		return array(
			'version'           => (int) get_post_meta( $post->ID, Cpt::META_VERSION, true ),
			'status'            => $has_draft ? 'draft' : 'published',
			'hasDraft'          => $has_draft,
			'updatedAt'         => $this->meta_string( $post->ID, Cpt::META_UPDATED_AT ),
			'updatedBy'         => $this->user_name( $post->ID, Cpt::META_UPDATED_BY ),
			'publishedAt'       => $this->meta_string( $post->ID, Cpt::META_PUBLISHED_AT ),
			'publishedBy'       => $this->user_name( $post->ID, Cpt::META_PUBLISHED_BY ),
			'publishedRevision' => (int) get_post_meta( $post->ID, Cpt::META_PUBLISHED_REV, true ),
			'schemaVersion'     => (int) ( get_post_meta( $post->ID, Cpt::META_SCHEMA_VERSION, true ) ?: SCHEMA_VERSION ),
		);
	}

	private function meta_string( int $post_id, string $key ): ?string {
		$v = get_post_meta( $post_id, $key, true );
		return is_string( $v ) && '' !== $v ? $v : null;
	}

	private function user_name( int $post_id, string $key ): ?string {
		$id   = (int) get_post_meta( $post_id, $key, true );
		$user = $id ? get_userdata( $id ) : null;
		return $user ? $user->display_name : null;
	}

	/**
	 * Every image referenced anywhere in a route's published + draft content.
	 *
	 * @return array<int, array{route:string,section:string,field:string,state:string,image:array<string, mixed>}>
	 */
	public function referenced_images( string $route ): array {
		$out = array();
		foreach ( array( 'published' => $this->published( $route ), 'draft' => $this->draft( $route ) ) as $state => $content ) {
			if ( null === $content ) {
				continue;
			}
			foreach ( $content['sections'] as $section => $fields ) {
				if ( ! is_array( $fields ) ) {
					continue;
				}
				$schema = Schema::fields( $route, (string) $section ) ?? array();
				$this->collect_images( $schema, $fields, (string) $section, '', $state, $route, $out );
			}
		}
		return $out;
	}

	/**
	 * @param array<string, array<string, mixed>> $schema
	 * @param array<string, mixed>                $fields
	 * @param array<int, array<string, mixed>>    $out
	 */
	private function collect_images( array $schema, array $fields, string $section, string $prefix, string $state, string $route, array &$out ): void {
		foreach ( $schema as $key => $field ) {
			if ( ! is_array( $field ) ) {
				continue;
			}
			$type  = (string) ( $field['type'] ?? '' );
			$value = $fields[ $key ] ?? null;
			if ( 'image' === $type && is_array( $value ) && ! empty( $value['id'] ) ) {
				$alt_key = $key . 'Alt';
				$dec_key = $key . 'Decorative';
				$out[]   = array(
					'route'      => $route,
					'section'    => $section,
					'field'      => $prefix . $key,
					'state'      => $state,
					'image'      => $value,
					'alt'        => (string) ( $fields[ $alt_key ] ?? $fields['imageAlt'] ?? '' ),
					'decorative' => ! empty( $fields[ $dec_key ] ) || ! empty( $fields['decorative'] ),
				);
			}
			if ( in_array( $type, array( 'repeater', 'cards', 'testimonials' ), true ) && is_array( $value ) && is_array( $field['item'] ?? null ) ) {
				foreach ( $value as $i => $item ) {
					if ( is_array( $item ) ) {
						$this->collect_images( $field['item'], $item, $section, "{$prefix}{$key}.{$i}.", $state, $route, $out );
					}
				}
			}
		}
	}
}
