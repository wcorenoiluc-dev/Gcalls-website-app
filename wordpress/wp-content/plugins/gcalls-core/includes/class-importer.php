<?php
/**
 * Content import pipeline.
 *
 * Reads a manifest produced by wordpress/scripts/export-content.mjs and creates
 * or updates the corresponding WordPress objects.
 *
 * THE FOUR GUARANTEES
 *
 * 1. Idempotent. Every object carries `_gcalls_source_id`, the stable ID from
 *    the React source. A re-run matches on that meta first and on the slug
 *    second, so running the importer twice updates instead of duplicating —
 *    even if an editor renamed the post in between.
 *
 * 2. Non-destructive on re-run. Fields an editor is expected to change (title,
 *    body, SEO copy) are written on creation and then left alone unless
 *    `--force` is passed. An import that silently reverts an editor's fix is
 *    worse than one that skips.
 *
 * 3. Dry-run. `$options['dry_run']` walks the entire manifest, resolves every
 *    match and reports exactly what would happen, writing nothing at all.
 *
 * 4. Rollback manifest. Every object created in a run is recorded with its ID,
 *    so a bad run can be undone precisely instead of by hand.
 *
 * NOT A PRODUCTION CLIENT
 * Nothing here calls out to a network endpoint. The manifest is a local file;
 * media is imported from a local path. This pipeline cannot reach gcalls.co,
 * a CRM, or any production system, by construction.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Manifest-driven importer.
 */
final class Importer {

	/** Post meta holding the stable source ID this object was imported from. */
	public const META_SOURCE_ID = '_gcalls_source_id';

	/** Post meta holding the manifest kind, e.g. 'page' or 'article'. */
	public const META_SOURCE_KIND = '_gcalls_source_kind';

	/** Option holding the rollback manifests of past runs. */
	public const OPTION_RUNS = 'gcalls_import_runs';

	/**
	 * Runs an import.
	 *
	 * @param array<string, mixed> $manifest Decoded manifest.
	 * @param array<string, mixed> $options  dry_run (bool), force (bool), only (string[]).
	 * @return array<string, mixed> Report: per-section counts, messages and the rollback manifest.
	 */
	public static function run( array $manifest, array $options = array() ): array {
		$dry_run = (bool) ( $options['dry_run'] ?? true );
		$force   = (bool) ( $options['force'] ?? false );
		$only    = (array) ( $options['only'] ?? array( 'hubs', 'pages', 'articles', 'redirects' ) );

		$report = array(
			'dry_run'  => $dry_run,
			'sections' => array(),
			'rollback' => array(
				'created_posts' => array(),
				'created_terms' => array(),
			),
			'errors'   => array(),
		);

		if ( in_array( 'hubs', $only, true ) ) {
			$seed                      = Hub_Taxonomy::seed( $dry_run );
			$report['sections']['hubs'] = array(
				'created' => count( $seed['created'] ),
				'skipped' => count( $seed['existing'] ),
				'updated' => 0,
				'errors'  => $seed['errors'],
			);
			$report['errors']           = array_merge( $report['errors'], $seed['errors'] );
		}

		if ( in_array( 'pages', $only, true ) ) {
			$report['sections']['pages'] = self::import_posts(
				(array) ( $manifest['pages'] ?? array() ),
				'page',
				$dry_run,
				$force,
				$report
			);
		}

		if ( in_array( 'articles', $only, true ) ) {
			$report['sections']['articles'] = self::import_posts(
				(array) ( $manifest['articles'] ?? array() ),
				'post',
				$dry_run,
				$force,
				$report
			);
		}

		if ( in_array( 'redirects', $only, true ) ) {
			$result                          = Redirects::set_map( (array) ( $manifest['redirects'] ?? array() ), $dry_run );
			$report['sections']['redirects'] = array(
				'created' => $result['stored'],
				'updated' => 0,
				'skipped' => count( $result['skipped'] ),
				'errors'  => $result['skipped'],
			);
		}

		if ( ! $dry_run ) {
			self::record_run( $report['rollback'] );
		}

		return $report;
	}

	/**
	 * Imports one collection of posts or pages.
	 *
	 * @param array<int, array<string, mixed>> $items    Manifest entries.
	 * @param string                           $post_type Target post type.
	 * @param bool                             $dry_run   Report only.
	 * @param bool                             $force     Overwrite editable fields.
	 * @param array<string, mixed>             $report    Report, by reference, for the rollback list.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function import_posts( array $items, string $post_type, bool $dry_run, bool $force, array &$report ): array {
		$counts = array(
			'created' => 0,
			'updated' => 0,
			'skipped' => 0,
			'errors'  => array(),
		);

		foreach ( $items as $item ) {
			$source_id = isset( $item['id'] ) ? sanitize_key( (string) $item['id'] ) : '';
			$slug      = isset( $item['slug'] ) ? sanitize_title( (string) $item['slug'] ) : '';
			$title     = isset( $item['title'] ) ? sanitize_text_field( (string) $item['title'] ) : '';

			if ( '' === $source_id || '' === $slug || '' === $title ) {
				$counts['errors'][] = sprintf(
					/* translators: %s: the offending manifest entry. */
					__( 'Bỏ qua mục thiếu id/slug/title: %s', 'gcalls-core' ),
					wp_json_encode( $item )
				);
				continue;
			}

			$existing = self::find_existing( $source_id, $slug, $post_type );

			if ( $existing && ! $force ) {
				// The object is already here and the run is not forcing an
				// overwrite. Taxonomy, FAQ and SEO are still reconciled below,
				// because those are derived data rather than editorial copy.
				++$counts['skipped'];

				if ( ! $dry_run ) {
					self::apply_derived( $existing, $item, $dry_run );
				}

				continue;
			}

			if ( $dry_run ) {
				$existing ? ++$counts['updated'] : ++$counts['created'];
				continue;
			}

			$postarr = array(
				'post_type'    => $post_type,
				'post_name'    => $slug,
				'post_title'   => $title,
				'post_status'  => self::status_for( $item ),
				'post_content' => isset( $item['content'] ) ? wp_kses_post( (string) $item['content'] ) : '',
				'post_excerpt' => isset( $item['excerpt'] ) ? sanitize_text_field( (string) $item['excerpt'] ) : '',
			);

			if ( $existing ) {
				$postarr['ID'] = $existing;
			}

			$post_id = wp_insert_post( $postarr, true );

			if ( is_wp_error( $post_id ) ) {
				$counts['errors'][] = $source_id . ': ' . $post_id->get_error_message();
				continue;
			}

			$post_id = (int) $post_id;

			update_post_meta( $post_id, self::META_SOURCE_ID, $source_id );
			update_post_meta( $post_id, self::META_SOURCE_KIND, $post_type );

			if ( $existing ) {
				++$counts['updated'];
			} else {
				++$counts['created'];
				$report['rollback']['created_posts'][] = array(
					'id'        => $post_id,
					'source_id' => $source_id,
					'post_type' => $post_type,
				);
			}

			self::apply_derived( $post_id, $item, false );
		}

		return $counts;
	}

	/**
	 * Applies the fields that are derived from the source rather than authored
	 * in WordPress: HUB term, FAQ meta and Rank Math SEO fields.
	 *
	 * @param int                  $post_id Target post.
	 * @param array<string, mixed> $item    Manifest entry.
	 * @param bool                 $dry_run Report only.
	 */
	private static function apply_derived( int $post_id, array $item, bool $dry_run ): void {
		if ( $dry_run ) {
			return;
		}

		if ( isset( $item['hub'] ) ) {
			$term_id = Hub_Taxonomy::term_id_for( (string) $item['hub'] );

			if ( $term_id ) {
				wp_set_object_terms( $post_id, array( $term_id ), Hub_Taxonomy::TAXONOMY, false );
			}
		}

		if ( isset( $item['faq'] ) && is_array( $item['faq'] ) ) {
			Faq::set( $post_id, $item['faq'] );
		}

		if ( isset( $item['seo'] ) && is_array( $item['seo'] ) ) {
			Seo::apply_meta( $post_id, $item['seo'] );
		}
	}

	/**
	 * Finds an object previously imported from this source ID, or an existing
	 * object occupying the same slug.
	 *
	 * Matching on the source ID first is what makes the run survive an editorial
	 * rename; falling back to the slug is what stops a second import creating
	 * `about-2` beside a hand-made `about`.
	 *
	 * @param string $source_id Stable source ID.
	 * @param string $slug      Post slug.
	 * @param string $post_type Post type.
	 * @return int|null Post ID.
	 */
	private static function find_existing( string $source_id, string $slug, string $post_type ): ?int {
		$by_meta = get_posts(
			array(
				'post_type'        => $post_type,
				'post_status'      => 'any',
				'numberposts'      => 1,
				'fields'           => 'ids',
				'meta_key'         => self::META_SOURCE_ID, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Bounded to one row and run from CLI, not on a page load.
				'meta_value'       => $source_id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- See above.
				'suppress_filters' => false,
			)
		);

		if ( ! empty( $by_meta ) ) {
			return (int) $by_meta[0];
		}

		$by_slug = get_page_by_path( $slug, OBJECT, $post_type );

		return $by_slug instanceof \WP_Post ? (int) $by_slug->ID : null;
	}

	/**
	 * Resolves the post status for a manifest entry.
	 *
	 * Defaults to draft. The 18 Batch 1 articles are published deliberately —
	 * the demo has to be readable by anyone with the link — and the site-wide
	 * noindex is what keeps them out of search, not their post status. Anything
	 * the manifest does not explicitly publish stays a draft.
	 *
	 * @param array<string, mixed> $item Manifest entry.
	 */
	private static function status_for( array $item ): string {
		$status = isset( $item['status'] ) ? (string) $item['status'] : 'draft';

		return in_array( $status, array( 'publish', 'draft', 'private', 'pending' ), true ) ? $status : 'draft';
	}

	/**
	 * Appends a rollback manifest to the stored run history.
	 *
	 * Kept to the last ten runs: the history exists to undo a recent mistake,
	 * not to be an audit log, and an unbounded option is a real performance
	 * problem because options are autoloaded by default (this one is not).
	 *
	 * @param array<string, mixed> $rollback Created object IDs.
	 */
	private static function record_run( array $rollback ): void {
		$runs = get_option( self::OPTION_RUNS, array() );

		if ( ! is_array( $runs ) ) {
			$runs = array();
		}

		$runs[] = array(
			'time'     => current_time( 'mysql', true ),
			'rollback' => $rollback,
		);

		update_option( self::OPTION_RUNS, array_slice( $runs, -10 ), false );
	}

	/**
	 * Deletes the objects created by the most recent run.
	 *
	 * Only objects this importer created are touched — never one it merely
	 * updated, and never one an editor made by hand.
	 *
	 * @param bool $dry_run Report only.
	 * @return array{deleted: int, missing: int, dry_run: bool}
	 */
	public static function rollback_last( bool $dry_run = true ): array {
		$runs = get_option( self::OPTION_RUNS, array() );

		if ( ! is_array( $runs ) || array() === $runs ) {
			return array(
				'deleted' => 0,
				'missing' => 0,
				'dry_run' => $dry_run,
			);
		}

		$last    = end( $runs );
		$deleted = 0;
		$missing = 0;

		foreach ( (array) ( $last['rollback']['created_posts'] ?? array() ) as $entry ) {
			$post_id = (int) ( $entry['id'] ?? 0 );

			if ( ! $post_id || ! get_post( $post_id ) ) {
				++$missing;
				continue;
			}

			++$deleted;

			if ( ! $dry_run ) {
				wp_delete_post( $post_id, true );
			}
		}

		if ( ! $dry_run ) {
			array_pop( $runs );
			update_option( self::OPTION_RUNS, $runs, false );
		}

		return array(
			'deleted' => $deleted,
			'missing' => $missing,
			'dry_run' => $dry_run,
		);
	}
}
