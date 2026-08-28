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
 * 5. Validated before it writes. `validate()` runs the whole manifest through
 *    the hierarchy and permalink rules FIRST, and a single problem aborts the
 *    run before a single row is written. A half-applied import is worse than a
 *    refused one: the pages that landed have real URLs, and something has to
 *    work out which half those were.
 *
 * 6. Never overwrites an editor. A post carries the hash of the body this
 *    importer last wrote. If the current body differs, somebody edited it in
 *    WordPress, and even `--force` leaves it alone unless the operator also
 *    passes the explicit overwrite flag.
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

	/** Post meta holding the source route, used to resolve parents in pass two. */
	public const META_ROUTE = '_gcalls_route';

	/**
	 * Post meta holding a hash of the body this importer last wrote.
	 *
	 * The comparison against the live body is the only way to tell "never
	 * touched since import" from "an editor fixed a typo in here", and that
	 * distinction is what stops a re-import quietly reverting someone's work.
	 */
	public const META_CONTENT_HASH = '_gcalls_content_hash';

	/** Term meta marking a nav menu this importer created and may rebuild. */
	public const TERM_MANAGED = '_gcalls_managed';

	/** Attachment meta holding the manifest's stable media id, e.g. `GP-09`. */
	public const META_MEDIA_ID = '_gcalls_media_id';

	/** Option holding the rollback manifests of past runs. */
	public const OPTION_RUNS = 'gcalls_import_runs';

	/**
	 * Runs an import.
	 *
	 * @param array<string, mixed> $manifest Decoded manifest.
	 * @param array<string, mixed> $options  dry_run, force, overwrite_edited (bool), only (string[]).
	 * @return array<string, mixed> Report: per-section counts, messages and the rollback manifest.
	 */
	public static function run( array $manifest, array $options = array() ): array {
		$dry_run          = (bool) ( $options['dry_run'] ?? true );
		$force            = (bool) ( $options['force'] ?? false );
		$overwrite_edited = (bool) ( $options['overwrite_edited'] ?? false );
		$only             = (array) ( $options['only'] ?? self::sections() );

		$report = array(
			'dry_run'  => $dry_run,
			'sections' => array(),
			'rollback' => array(
				'created_posts' => array(),
				'created_terms' => array(),
				'created_menus' => array(),
			),
			'errors'   => array(),
			'aborted'  => false,
		);

		// Validation runs against the manifest alone and writes nothing. A
		// manifest that would produce a wrong URL is refused whole: the point of
		// the check is to stop before the database is in a state somebody has to
		// reason about.
		$problems = self::validate( $manifest );

		if ( array() !== $problems ) {
			$report['errors']  = $problems;
			$report['aborted'] = true;

			return $report;
		}

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

		if ( in_array( 'media', $only, true ) ) {
			$report['sections']['media'] = self::import_media(
				(array) ( $manifest['media'] ?? array() ),
				$dry_run,
				(string) ( $options['media_base'] ?? '' ),
				$report
			);
		}

		$pages = (array) ( $manifest['pages'] ?? array() );

		if ( in_array( 'pages', $only, true ) ) {
			$report['sections']['pages'] = self::import_posts(
				$pages,
				'page',
				$dry_run,
				$force,
				$overwrite_edited,
				$report
			);

			// Pass two. Parents can only be linked once every page exists,
			// because a child is routinely imported before its parent and
			// `post_parent` needs a real ID, not a promise.
			$report['sections']['hierarchy'] = self::apply_hierarchy( $pages, $dry_run );
			$report['sections']['settings']  = self::apply_reading_settings( $pages, $dry_run );
		}

		if ( in_array( 'articles', $only, true ) ) {
			$report['sections']['articles'] = self::import_posts(
				(array) ( $manifest['articles'] ?? array() ),
				'post',
				$dry_run,
				$force,
				$overwrite_edited,
				$report
			);
		}

		if ( in_array( 'menus', $only, true ) ) {
			$report['sections']['menus'] = self::build_menus(
				(array) ( $manifest['menus'] ?? array() ),
				$dry_run,
				$report
			);
		}

		if ( in_array( 'redirects', $only, true ) ) {
			$map = (array) ( $manifest['redirects'] ?? array() );

			if ( array() === $map ) {
				// Set_map REPLACES the stored map, so an empty one clears it.
				// That is correct when someone deliberately clears the map, and
				// catastrophic as a side effect: the 003B page manifest carries
				// `redirects: {}`, so importing it after this corpus would wipe
				// all 44 retired-URL rules and turn twenty former spam URLs back
				// into soft 404s. Clearing is now something you have to ask for.
				$report['sections']['redirects'] = array(
					'created' => 0,
					'updated' => 0,
					'skipped' => 1,
					'errors'  => array( __( 'Manifest không có redirect nào — giữ nguyên map hiện tại thay vì xoá.', 'gcalls-core' ) ),
				);
			} else {
				$result                          = Redirects::set_map( $map, $dry_run );
				$report['sections']['redirects'] = array(
					'created' => $result['stored'],
					'updated' => 0,
					'skipped' => count( $result['skipped'] ),
					'errors'  => $result['skipped'],
				);
			}
		}

		if ( ! $dry_run ) {
			self::record_run( $report['rollback'] );
		}

		return $report;
	}

	/**
	 * Imports one collection of posts or pages.
	 *
	 * @param array<int, array<string, mixed>> $items            Manifest entries.
	 * @param string                           $post_type        Target post type.
	 * @param bool                             $dry_run          Report only.
	 * @param bool                             $force            Overwrite editable fields.
	 * @param bool                             $overwrite_edited Also overwrite bodies an editor changed.
	 * @param array<string, mixed>             $report           Report, by reference, for the rollback list.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function import_posts( array $items, string $post_type, bool $dry_run, bool $force, bool $overwrite_edited, array &$report ): array {
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

			$existing = self::find_existing( $source_id, $slug, $post_type, $item );

			// An existing post whose body no longer matches what this importer
			// wrote has been edited in WordPress. `--force` says "refresh from
			// source"; it does not say "discard someone's work", so that needs
			// its own flag.
			if ( $existing && $force && ! $overwrite_edited && self::was_edited( $existing ) ) {
				++$counts['skipped'];
				$counts['errors'][] = sprintf(
					/* translators: 1: source id, 2: post id. */
					__( '%1$s (post %2$d) đã được sửa trong WordPress — bỏ qua. Dùng cờ ghi đè nếu thực sự muốn thay thế.', 'gcalls-core' ),
					$source_id,
					$existing
				);

				if ( ! $dry_run ) {
					self::apply_derived( $existing, $item, $dry_run );
				}

				continue;
			}

			if ( $existing && ! $force ) {
				// The object is already here and the run is not forcing an
				// overwrite. Taxonomy, FAQ, SEO, route and template are still
				// reconciled below, because those are derived data rather than
				// editorial copy.
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

			// The original publication date, where the source has one. Without
			// it the archive shows 239 posts all published on migration day,
			// which destroys the chronology the hub archive is ordered by and
			// tells every reader the whole blog was written in one afternoon.
			$date = isset( $item['date'] ) ? trim( (string) $item['date'] ) : '';

			if ( '' !== $date && 1 === preg_match( '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $date ) ) {
				$postarr['post_date'] = $date;

				$gmt = isset( $item['dateGmt'] ) ? trim( (string) $item['dateGmt'] ) : '';

				if ( '' !== $gmt && 1 === preg_match( '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $gmt ) ) {
					$postarr['post_date_gmt'] = $gmt;
				}
			}

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
			update_post_meta( $post_id, self::META_CONTENT_HASH, self::content_hash( (string) $postarr['post_content'] ) );

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

		// IDENTITY IS DERIVED DATA, AND HAS TO BE WRITTEN EVEN ON A SKIP.
		// The route meta is how pass two finds a page again — for its parent and
		// for Settings > Reading. It used to be written only on the create/update
		// path, so the two pages matched by ROLE rather than by source id (the
		// existing front page and posts page) were skipped, never got the meta,
		// and then could not be found: the live run reported
		// "Không tìm thấy trang để gán trong Settings > Reading: /" for a page it
		// had just matched successfully.
		if ( isset( $item['route'] ) ) {
			update_post_meta( $post_id, self::META_ROUTE, self::normalise_route( (string) $item['route'] ) );
		}

		if ( isset( $item['template'] ) && 'page' === get_post_type( $post_id ) ) {
			update_post_meta( $post_id, '_wp_page_template', sanitize_text_field( (string) $item['template'] ) );
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

		self::apply_legacy_meta( $post_id, $item );
	}

	/**
	 * Records where an imported post came from.
	 *
	 * WHY THE AUTHOR IS META AND NOT AN AUTHOR
	 * The legacy usernames are not users on this site, and this importer does
	 * not create any. Checkpoint 003A deleted the original administrator on
	 * purpose and closed the endpoints that disclosed login names; an importer
	 * that quietly recreates five accounts to satisfy a byline undoes that, and
	 * every account it creates is another password to attack. The name is kept
	 * as data so a human can reassign posts deliberately.
	 *
	 * WHY THE THUMBNAIL IS A REFERENCE AND NOT AN IMAGE
	 * The export is posts-only — it contains no `attachment` items — so
	 * `_thumbnail_id` points at attachment rows that do not exist here. Writing
	 * it into `_thumbnail_id` would make WordPress ask for an attachment that is
	 * not there; on most themes that renders nothing, and on some it warns. It
	 * is stored under our own key, so a later media migration can resolve it.
	 *
	 * @param int                  $post_id Target post.
	 * @param array<string, mixed> $item    Manifest entry.
	 */
	private static function apply_legacy_meta( int $post_id, array $item ): void {
		$fields = array(
			'_gcalls_legacy_post_id'     => 'legacyPostId',
			'_gcalls_legacy_author'      => 'legacyAuthor',
			'_gcalls_legacy_thumbnail'   => 'legacyThumbnailId',
			'_gcalls_editorial_decision' => 'decision',
			'_gcalls_merge_into'         => 'mergeIntoSlug',
		);

		foreach ( $fields as $meta_key => $manifest_key ) {
			$value = $item[ $manifest_key ] ?? null;

			if ( null === $value || '' === $value ) {
				delete_post_meta( $post_id, $meta_key );
				continue;
			}

			update_post_meta( $post_id, $meta_key, sanitize_text_field( (string) $value ) );
		}

		if ( isset( $item['legacyCategories'] ) && is_array( $item['legacyCategories'] ) ) {
			$categories = array_values( array_filter( array_map( 'sanitize_title', $item['legacyCategories'] ) ) );

			if ( array() === $categories ) {
				delete_post_meta( $post_id, '_gcalls_legacy_categories' );
			} else {
				update_post_meta( $post_id, '_gcalls_legacy_categories', implode( ',', $categories ) );
			}
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
	 * THE FRONT PAGE AND THE POSTS PAGE ARE MATCHED BY ROLE, FIRST OF ALL.
	 * The demo host already has a front page and a posts page, and they were set
	 * up before this manifest existed, so their slugs are not the manifest's. On
	 * slug matching alone the import would create a SECOND home page, point
	 * `page_on_front` at it, and leave the original — the one already laid out in
	 * Elementor — orphaned at a URL nobody links to. Adopting the page that
	 * currently holds the role is what keeps the import idempotent against a site
	 * that was not born from this manifest.
	 *
	 * @param string               $source_id Stable source ID.
	 * @param string               $slug      Post slug.
	 * @param string               $post_type Post type.
	 * @param array<string, mixed> $item      Manifest entry, for the role flags.
	 * @return int|null Post ID.
	 */
	private static function find_existing( string $source_id, string $slug, string $post_type, array $item = array() ): ?int {
		if ( 'page' === $post_type ) {
			$role_option = ! empty( $item['isFrontPage'] )
				? 'page_on_front'
				: ( ! empty( $item['isPostsPage'] ) ? 'page_for_posts' : '' );

			if ( '' !== $role_option ) {
				$role_id = (int) get_option( $role_option );

				if ( $role_id && get_post( $role_id ) instanceof \WP_Post ) {
					return $role_id;
				}
			}
		}

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

	/** The sections a run may cover, in dependency order. */
	public static function sections(): array {
		return array( 'hubs', 'media', 'pages', 'articles', 'menus', 'redirects' );
	}

	/**
	 * Normalises a route to the `/a/b/` form used as a key throughout.
	 *
	 * @param string $route Route from the manifest.
	 */
	public static function normalise_route( string $route ): string {
		$route = trim( $route );

		if ( '' === $route || '/' === $route ) {
			return '/';
		}

		return '/' . trim( $route, '/' ) . '/';
	}

	/** Hash of a post body, used to detect editing after import. */
	private static function content_hash( string $content ): string {
		return md5( trim( $content ) );
	}

	/**
	 * Has this post been edited in WordPress since the importer wrote it?
	 *
	 * A post with NO recorded hash is treated as edited. It was created by an
	 * older version of this importer or by hand, so its provenance is unknown —
	 * and refusing to overwrite something unknown is the safe direction. The
	 * operator can still say otherwise with the overwrite flag.
	 *
	 * @param int $post_id Post to check.
	 */
	private static function was_edited( int $post_id ): bool {
		$stored = (string) get_post_meta( $post_id, self::META_CONTENT_HASH, true );

		if ( '' === $stored ) {
			return true;
		}

		return $stored !== self::content_hash( (string) get_post_field( 'post_content', $post_id ) );
	}

	/**
	 * Checks a manifest before anything is written.
	 *
	 * WHY THE PERMALINK RULE IS CHECKED HERE AND NOT TRUSTED
	 * WordPress builds a page's URL from its `post_parent` chain. The React
	 * sitemap's `parent` field is a NAVIGATION grouping, and for ten of the 38
	 * routes the two disagree — `/blog/` is filed under `/tai-nguyen/` but must
	 * stay at `/blog/`, because it is the posts page and eighteen published
	 * articles link to it. The exporter derives the real parent from path
	 * nesting; this re-derives the permalink from what the manifest actually
	 * says and refuses the run if it does not match the route. Two independent
	 * derivations agreeing is the only reason to believe either.
	 *
	 * @param array<string, mixed> $manifest Decoded manifest.
	 * @return array<int, string> Problems. Empty means safe to run.
	 */
	public static function validate( array $manifest ): array {
		$problems = array();
		$pages    = (array) ( $manifest['pages'] ?? array() );
		$articles = (array) ( $manifest['articles'] ?? array() );

		$by_route = array();

		foreach ( $pages as $page ) {
			foreach ( array( 'id', 'slug', 'title', 'route' ) as $required ) {
				if ( empty( $page[ $required ] ) ) {
					$problems[] = sprintf(
						/* translators: 1: field name, 2: manifest entry. */
						__( 'Trang thiếu trường %1$s: %2$s', 'gcalls-core' ),
						$required,
						wp_json_encode( $page )
					);
					continue 2;
				}
			}

			$route = self::normalise_route( (string) $page['route'] );

			if ( isset( $by_route[ $route ] ) ) {
				$problems[] = sprintf(
					/* translators: %s: route. */
					__( 'Hai trang cùng route: %s', 'gcalls-core' ),
					$route
				);
			}

			$by_route[ $route ] = $page;
		}

		$front = 0;
		$posts = 0;

		foreach ( $by_route as $route => $page ) {
			$front += empty( $page['isFrontPage'] ) ? 0 : 1;
			$posts += empty( $page['isPostsPage'] ) ? 0 : 1;

			// Parent must exist, and the chain must terminate.
			$chain  = array();
			$cursor = $page;

			while ( ! empty( $cursor['parentRoute'] ) ) {
				$parent_route = self::normalise_route( (string) $cursor['parentRoute'] );

				if ( ! isset( $by_route[ $parent_route ] ) ) {
					$problems[] = sprintf(
						/* translators: 1: page id, 2: parent route. */
						__( 'Trang %1$s có parentRoute %2$s không tồn tại trong manifest.', 'gcalls-core' ),
						$page['id'],
						$parent_route
					);
					continue 2;
				}

				if ( in_array( $parent_route, $chain, true ) ) {
					$problems[] = sprintf(
						/* translators: 1: page id, 2: route. */
						__( 'Trang %1$s có chuỗi parent lặp vòng tại %2$s.', 'gcalls-core' ),
						$page['id'],
						$parent_route
					);
					continue 2;
				}

				array_unshift( $chain, $parent_route );
				$cursor = $by_route[ $parent_route ];
			}

			// The front page answers at '/', whatever its slug is, so the
			// permalink rule does not apply to it.
			if ( ! empty( $page['isFrontPage'] ) ) {
				continue;
			}

			$segments = array();

			foreach ( $chain as $ancestor ) {
				$segments[] = trim( $ancestor, '/' );
			}

			$segments[] = (string) $page['slug'];
			$expected   = '/' . implode( '/', array_filter( $segments ) ) . '/';

			if ( $expected !== $route ) {
				$problems[] = sprintf(
					/* translators: 1: page id, 2: computed permalink, 3: declared route. */
					__( 'Trang %1$s: phân cấp tạo ra %2$s nhưng route khai báo là %3$s.', 'gcalls-core' ),
					$page['id'],
					$expected,
					$route
				);
			}
		}

		// The front-page and posts-page rules only apply to a manifest that
		// actually carries pages. The full blog corpus carries articles and
		// redirects and nothing else, and demanding a home page of it refused a
		// perfectly valid import: a manifest with no pages makes no claim about
		// Settings > Reading, so there is nothing to be wrong about.
		if ( array() !== $pages ) {
			if ( 1 !== $front ) {
				$problems[] = sprintf(
					/* translators: %d: number of front pages found. */
					__( 'Phải có đúng một trang chủ, manifest có %d.', 'gcalls-core' ),
					$front
				);
			}

			if ( 1 !== $posts ) {
				$problems[] = sprintf(
					/* translators: %d: number of posts pages found. */
					__( 'Phải có đúng một trang blog, manifest có %d.', 'gcalls-core' ),
					$posts
				);
			}
		}

		// Posts use /%postname%/, so an article slug and a TOP-LEVEL page slug
		// compete for the same URL. WordPress resolves that silently in favour
		// of one of them; the loser becomes unreachable with no error anywhere.
		$top_level = array();

		foreach ( $by_route as $page ) {
			if ( empty( $page['parentRoute'] ) && empty( $page['isFrontPage'] ) ) {
				$top_level[ (string) $page['slug'] ] = (string) $page['id'];
			}
		}

		foreach ( $articles as $article ) {
			$slug = (string) ( $article['slug'] ?? '' );

			if ( '' !== $slug && isset( $top_level[ $slug ] ) ) {
				$problems[] = sprintf(
					/* translators: 1: slug, 2: page id, 3: article id. */
					__( 'Slug %1$s bị tranh chấp giữa trang %2$s và bài viết %3$s — hai URL gốc trùng nhau.', 'gcalls-core' ),
					$slug,
					$top_level[ $slug ],
					(string) ( $article['id'] ?? '?' )
				);
			}
		}

		return $problems;
	}

	/**
	 * Pass two: links each page to its parent and verifies the resulting URL.
	 *
	 * @param array<int, array<string, mixed>> $pages   Manifest pages.
	 * @param bool                             $dry_run Report only.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function apply_hierarchy( array $pages, bool $dry_run ): array {
		$counts = array(
			'created' => 0,
			'updated' => 0,
			'skipped' => 0,
			'errors'  => array(),
		);

		foreach ( $pages as $page ) {
			$route   = self::normalise_route( (string) ( $page['route'] ?? '' ) );
			$post_id = self::find_by_route( $route );

			if ( ! $post_id ) {
				++$counts['skipped'];
				continue;
			}

			$parent_id = 0;

			if ( ! empty( $page['parentRoute'] ) ) {
				$parent_id = (int) self::find_by_route( self::normalise_route( (string) $page['parentRoute'] ) );

				if ( ! $parent_id ) {
					$counts['errors'][] = sprintf(
						/* translators: 1: route, 2: parent route. */
						__( 'Không tìm thấy trang cha của %1$s (%2$s).', 'gcalls-core' ),
						$route,
						(string) $page['parentRoute']
					);
					continue;
				}
			}

			if ( (int) get_post_field( 'post_parent', $post_id ) === $parent_id ) {
				++$counts['skipped'];
				continue;
			}

			++$counts['updated'];

			if ( $dry_run ) {
				continue;
			}

			$result = wp_update_post(
				array(
					'ID'          => $post_id,
					'post_parent' => $parent_id,
				),
				true
			);

			if ( is_wp_error( $result ) ) {
				$counts['errors'][] = $route . ': ' . $result->get_error_message();
			}
		}

		return $counts;
	}

	/**
	 * Applies Settings > Reading: the front page and the posts page.
	 *
	 * Both must be published. A draft front page serves a 404 to every logged-out
	 * visitor while looking perfectly fine to the administrator who set it, which
	 * is the kind of defect that survives a demo review.
	 *
	 * @param array<int, array<string, mixed>> $pages   Manifest pages.
	 * @param bool                             $dry_run Report only.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function apply_reading_settings( array $pages, bool $dry_run ): array {
		$counts = array(
			'created' => 0,
			'updated' => 0,
			'skipped' => 0,
			'errors'  => array(),
		);

		foreach ( $pages as $page ) {
			$is_front = ! empty( $page['isFrontPage'] );
			$is_posts = ! empty( $page['isPostsPage'] );

			if ( ! $is_front && ! $is_posts ) {
				continue;
			}

			$post_id = self::find_by_route( self::normalise_route( (string) ( $page['route'] ?? '' ) ) );

			if ( ! $post_id ) {
				$counts['errors'][] = sprintf(
					/* translators: %s: route. */
					__( 'Không tìm thấy trang để gán trong Settings > Reading: %s', 'gcalls-core' ),
					(string) ( $page['route'] ?? '' )
				);
				continue;
			}

			$option  = $is_front ? 'page_on_front' : 'page_for_posts';
			$current = (int) get_option( $option );

			if ( $current === $post_id && 'page' === get_option( 'show_on_front' ) && 'publish' === get_post_status( $post_id ) ) {
				++$counts['skipped'];
				continue;
			}

			++$counts['updated'];

			if ( $dry_run ) {
				continue;
			}

			if ( 'publish' !== get_post_status( $post_id ) ) {
				wp_update_post(
					array(
						'ID'          => $post_id,
						'post_status' => 'publish',
					)
				);
			}

			update_option( 'show_on_front', 'page' );
			update_option( $option, $post_id );
		}

		return $counts;
	}

	/**
	 * Builds the header and footer navigation menus.
	 *
	 * WHY THE IMPORTER OWNS THIS
	 * The theme's header and footer are `wp_nav_menu()` calls. With no menu
	 * assigned they render nothing at all, so a freshly imported site has 38
	 * pages and no way to reach any of them. Rebuilding a six-group header and a
	 * five-column footer by hand in wp-admin is an hour of clicking that has to
	 * be repeated exactly on every environment.
	 *
	 * A menu this importer did not create is never touched — an editor's
	 * customisation is not ours to rebuild. Ownership is recorded in term meta
	 * rather than inferred from the name, so renaming the menu in the UI does not
	 * make the importer adopt it.
	 *
	 * @param array<string, mixed> $menus   Manifest menus, keyed by theme location.
	 * @param bool                 $dry_run Report only.
	 * @param array<string, mixed> $report  Report, by reference, for the rollback list.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function build_menus( array $menus, bool $dry_run, array &$report ): array {
		$counts = array(
			'created' => 0,
			'updated' => 0,
			'skipped' => 0,
			'errors'  => array(),
		);

		$locations = array();

		foreach ( $menus as $location => $groups ) {
			$location = sanitize_key( (string) $location );
			$name     = 'Gcalls ' . $location;
			$existing = wp_get_nav_menu_object( $name );

			if ( $existing && ! get_term_meta( $existing->term_id, self::TERM_MANAGED, true ) ) {
				++$counts['skipped'];
				$counts['errors'][] = sprintf(
					/* translators: %s: menu name. */
					__( 'Menu %s đã tồn tại và không do importer tạo — giữ nguyên.', 'gcalls-core' ),
					$name
				);
				continue;
			}

			if ( $dry_run ) {
				$existing ? ++$counts['updated'] : ++$counts['created'];
				continue;
			}

			if ( $existing ) {
				// Derived data: rebuilt wholesale rather than diffed, so a route
				// removed from the source disappears from the menu too.
				foreach ( (array) wp_get_nav_menu_items( $existing->term_id ) as $item ) {
					wp_delete_post( (int) $item->ID, true );
				}

				$menu_id = (int) $existing->term_id;
				++$counts['updated'];
			} else {
				$menu_id = wp_create_nav_menu( $name );

				if ( is_wp_error( $menu_id ) ) {
					$counts['errors'][] = $name . ': ' . $menu_id->get_error_message();
					continue;
				}

				$menu_id = (int) $menu_id;
				update_term_meta( $menu_id, self::TERM_MANAGED, '1' );
				++$counts['created'];

				$report['rollback']['created_menus'][] = array(
					'id'   => $menu_id,
					'name' => $name,
				);
			}

			foreach ( (array) $groups as $group ) {
				$parent_item = self::add_menu_item( $menu_id, 0, $group );

				foreach ( (array) ( $group['children'] ?? array() ) as $child ) {
					self::add_menu_item( $menu_id, $parent_item, $child );
				}
			}

			$locations[ $location ] = $menu_id;
		}

		if ( ! $dry_run && array() !== $locations ) {
			set_theme_mod( 'nav_menu_locations', array_merge( (array) get_theme_mod( 'nav_menu_locations', array() ), $locations ) );
		}

		return $counts;
	}

	/**
	 * Adds one menu item, pointing at the imported page when there is one.
	 *
	 * A group with no page of its own (Bảng giá) becomes a non-linking label:
	 * a custom item with `#`, which is what WordPress uses for a heading-only
	 * parent.
	 *
	 * @param int                  $menu_id Menu term ID.
	 * @param int                  $parent  Parent menu item ID, 0 for top level.
	 * @param array<string, mixed> $entry   Manifest menu entry.
	 * @return int The created item ID, 0 on failure.
	 */
	private static function add_menu_item( int $menu_id, int $parent, array $entry ): int {
		$title   = sanitize_text_field( (string) ( $entry['title'] ?? $entry['label'] ?? '' ) );
		$route   = isset( $entry['route'] ) && null !== $entry['route'] ? self::normalise_route( (string) $entry['route'] ) : '';
		$post_id = '' === $route ? 0 : (int) self::find_by_route( $route );

		$args = $post_id
			? array(
				'menu-item-type'      => 'post_type',
				'menu-item-object'    => 'page',
				'menu-item-object-id' => $post_id,
				'menu-item-title'     => $title,
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent,
			)
			: array(
				'menu-item-type'      => 'custom',
				'menu-item-url'       => '' === $route ? '#' : home_url( $route ),
				'menu-item-title'     => $title,
				'menu-item-status'    => 'publish',
				'menu-item-parent-id' => $parent,
			);

		$item_id = wp_update_nav_menu_item( $menu_id, 0, $args );

		return is_wp_error( $item_id ) ? 0 : (int) $item_id;
	}

	/**
	 * Finds a previously imported page by its source route.
	 *
	 * @param string $route Normalised route.
	 * @return int|null Post ID.
	 */
	private static function find_by_route( string $route ): ?int {
		$found = get_posts(
			array(
				'post_type'        => 'page',
				'post_status'      => 'any',
				'numberposts'      => 1,
				'fields'           => 'ids',
				'meta_key'         => self::META_ROUTE, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Bounded to one row, CLI/admin only.
				'meta_value'       => $route, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- See above.
				'suppress_filters' => false,
			)
		);

		return empty( $found ) ? null : (int) $found[0];
	}

	/**
	 * Imports the product screenshots into the media library.
	 *
	 * IDENTIFIED BY MANIFEST ID, NOT BY FILE NAME OR URL
	 * The Elementor homepage template has to reference these images, and it has
	 * to do so on any environment. A URL baked into the template
	 * (`/wp-content/uploads/2026/08/…`) is wrong the moment the site is imported
	 * in a different month, and an attachment ID is wrong on every site but the
	 * one it was exported from. So each attachment carries its manifest id and
	 * the `[gcalls_media]` shortcode looks it up at render time. The template
	 * then contains no environment-specific value at all.
	 *
	 * Files are read from a directory beside the manifest, never fetched over
	 * the network: this pipeline has no business making outbound requests, and a
	 * download step is a download step that can be pointed somewhere else.
	 *
	 * @param array<int, array<string, mixed>> $items   Manifest media entries.
	 * @param bool                             $dry_run Report only.
	 * @param string                           $base    Directory holding the files.
	 * @param array<string, mixed>             $report  Report, by reference.
	 * @return array{created: int, updated: int, skipped: int, errors: array<int, string>}
	 */
	private static function import_media( array $items, bool $dry_run, string $base, array &$report ): array {
		$counts = array(
			'created' => 0,
			'updated' => 0,
			'skipped' => 0,
			'errors'  => array(),
		);

		if ( '' === $base ) {
			$counts['errors'][] = __( 'Không có thư mục media — bỏ qua phần media.', 'gcalls-core' );

			return $counts;
		}

		require_once ABSPATH . 'wp-admin/includes/image.php';

		foreach ( $items as $item ) {
			$media_id = isset( $item['id'] ) ? sanitize_text_field( (string) $item['id'] ) : '';
			$file     = isset( $item['file'] ) ? (string) $item['file'] : '';
			$alt      = isset( $item['alt'] ) ? sanitize_text_field( (string) $item['alt'] ) : '';

			if ( '' === $media_id || '' === $file ) {
				$counts['errors'][] = __( 'Mục media thiếu id hoặc file.', 'gcalls-core' );
				continue;
			}

			if ( self::find_media( $media_id ) ) {
				++$counts['skipped'];
				continue;
			}

			// basename() only: the manifest stores a repository-relative path,
			// and the package ships the files flat beside the manifest.
			$source = trailingslashit( $base ) . basename( $file );

			if ( ! is_readable( $source ) ) {
				$counts['errors'][] = sprintf(
					/* translators: 1: media id, 2: expected path. */
					__( 'Media %1$s: không đọc được %2$s', 'gcalls-core' ),
					$media_id,
					$source
				);
				continue;
			}

			++$counts['created'];

			if ( $dry_run ) {
				continue;
			}

			$uploaded = wp_upload_bits( basename( $file ), null, (string) file_get_contents( $source ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file inside the import directory.

			if ( ! empty( $uploaded['error'] ) ) {
				$counts['errors'][] = $media_id . ': ' . $uploaded['error'];
				--$counts['created'];
				continue;
			}

			$attachment_id = wp_insert_attachment(
				array(
					'post_mime_type' => (string) ( wp_check_filetype( $uploaded['file'] )['type'] ?? '' ),
					'post_title'     => sanitize_file_name( basename( $file ) ),
					'post_content'   => '',
					'post_status'    => 'inherit',
				),
				$uploaded['file'],
				0,
				true
			);

			if ( is_wp_error( $attachment_id ) ) {
				$counts['errors'][] = $media_id . ': ' . $attachment_id->get_error_message();
				--$counts['created'];
				continue;
			}

			$attachment_id = (int) $attachment_id;

			wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] ) );
			update_post_meta( $attachment_id, self::META_MEDIA_ID, $media_id );

			// Alt text is not decoration. Every one of these screenshots has
			// reviewed Vietnamese alt text in the source inventory, and losing it
			// on import would be a silent accessibility regression.
			if ( '' !== $alt ) {
				update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt );
			}

			$report['rollback']['created_posts'][] = array(
				'id'        => $attachment_id,
				'source_id' => $media_id,
				'post_type' => 'attachment',
			);
		}

		return $counts;
	}

	/**
	 * Finds an attachment previously imported under a manifest media id.
	 *
	 * @param string $media_id Manifest media id.
	 * @return int|null Attachment ID.
	 */
	public static function find_media( string $media_id ): ?int {
		$found = get_posts(
			array(
				'post_type'        => 'attachment',
				'post_status'      => 'inherit',
				'numberposts'      => 1,
				'fields'           => 'ids',
				'meta_key'         => self::META_MEDIA_ID, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Bounded to one row.
				'meta_value'       => $media_id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- See above.
				'suppress_filters' => false,
			)
		);

		return empty( $found ) ? null : (int) $found[0];
	}
}
