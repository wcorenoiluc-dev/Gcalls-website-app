<?php
/**
 * WP-CLI commands.
 *
 * Loaded only under WP-CLI (see gcalls-core.php), so nothing here runs on a
 * web request.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * `wp gcalls ...`
 */
final class Cli {

	/**
	 * Registers the command namespace.
	 */
	public static function init(): void {
		\WP_CLI::add_command( 'gcalls', self::class );
	}

	/**
	 * Imports content from a manifest file.
	 *
	 * The default is a dry run. Writing requires --execute, so a mistyped path
	 * or a stale manifest cannot change the database by accident.
	 *
	 * ## OPTIONS
	 *
	 * --manifest=<path>
	 * : Path to the JSON manifest produced by scripts/export-content.mjs.
	 *
	 * [--execute]
	 * : Actually write. Without this the command reports and changes nothing.
	 *
	 * [--force]
	 * : Overwrite title, body and SEO copy on objects that already exist.
	 *   Off by default so a re-run never reverts an editor's correction.
	 *
	 * [--only=<sections>]
	 * : Comma-separated subset of hubs,pages,articles,redirects.
	 *
	 * ## EXAMPLES
	 *
	 *     wp gcalls import --manifest=wordpress/imports/content-manifest.json
	 *     wp gcalls import --manifest=... --only=hubs,articles --execute
	 *
	 * @param array<int, string>    $args       Positional arguments.
	 * @param array<string, string> $assoc_args Flags.
	 */
	public function import( array $args, array $assoc_args ): void {
		$path = (string) ( $assoc_args['manifest'] ?? '' );

		if ( '' === $path || ! is_readable( $path ) ) {
			\WP_CLI::error( sprintf( 'Không đọc được manifest: %s', $path ) );
		}

		$raw      = (string) file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file read in a CLI context; WP_Filesystem is for the web request lifecycle.
		$manifest = json_decode( $raw, true );

		if ( ! is_array( $manifest ) ) {
			\WP_CLI::error( sprintf( 'Manifest không phải JSON hợp lệ: %s', json_last_error_msg() ) );
		}

		$dry_run = ! isset( $assoc_args['execute'] );

		$only = isset( $assoc_args['only'] )
			? array_filter( array_map( 'trim', explode( ',', (string) $assoc_args['only'] ) ) )
			: array( 'hubs', 'pages', 'articles', 'redirects' );

		$report = Importer::run(
			$manifest,
			array(
				'dry_run' => $dry_run,
				'force'   => isset( $assoc_args['force'] ),
				'only'    => $only,
			)
		);

		$rows = array();

		foreach ( $report['sections'] as $section => $counts ) {
			$rows[] = array(
				'section' => $section,
				'created' => $counts['created'],
				'updated' => $counts['updated'],
				'skipped' => $counts['skipped'],
				'errors'  => count( $counts['errors'] ),
			);
		}

		\WP_CLI\Utils\format_items( 'table', $rows, array( 'section', 'created', 'updated', 'skipped', 'errors' ) );

		foreach ( $report['sections'] as $section => $counts ) {
			foreach ( $counts['errors'] as $error ) {
				\WP_CLI::warning( $section . ': ' . $error );
			}
		}

		if ( $dry_run ) {
			\WP_CLI::success( 'Dry run — không ghi gì. Thêm --execute để thực thi.' );
			return;
		}

		\WP_CLI::success(
			sprintf(
				'Đã import. Có thể hoàn tác %d đối tượng vừa tạo bằng: wp gcalls rollback --execute',
				count( $report['rollback']['created_posts'] )
			)
		);
	}

	/**
	 * Undoes the objects created by the most recent import run.
	 *
	 * ## OPTIONS
	 *
	 * [--execute]
	 * : Actually delete. Without this the command reports and changes nothing.
	 *
	 * @param array<int, string>    $args       Positional arguments.
	 * @param array<string, string> $assoc_args Flags.
	 */
	public function rollback( array $args, array $assoc_args ): void {
		$dry_run = ! isset( $assoc_args['execute'] );
		$result  = Importer::rollback_last( $dry_run );

		\WP_CLI::log(
			sprintf(
				'%d đối tượng sẽ bị xoá, %d đã không còn tồn tại.',
				$result['deleted'],
				$result['missing']
			)
		);

		if ( $dry_run ) {
			\WP_CLI::success( 'Dry run — không xoá gì. Thêm --execute để thực thi.' );
			return;
		}

		\WP_CLI::success( 'Đã hoàn tác lần import gần nhất.' );
	}

	/**
	 * Reports the site's search-engine posture.
	 *
	 * The demo has to stay out of search on four independent layers. This
	 * command reports what is actually true on the running site, which is the
	 * only thing that counts.
	 *
	 * @param array<int, string>    $args       Positional arguments.
	 * @param array<string, string> $assoc_args Flags.
	 */
	public function robots( array $args, array $assoc_args ): void {
		$rows = array(
			array(
				'layer'    => 'blog_public',
				'expected' => '0 (discourage search engines)',
				'actual'   => (string) get_option( 'blog_public' ),
			),
			array(
				'layer'    => 'Rank Math',
				'expected' => 'active',
				'actual'   => Seo::rank_math_active() ? 'active' : 'inactive',
			),
			array(
				'layer'    => 'permalink_structure',
				'expected' => '/%postname%/',
				'actual'   => (string) get_option( 'permalink_structure' ),
			),
			array(
				'layer'    => 'home_url',
				'expected' => 'https://',
				'actual'   => home_url( '/' ),
			),
		);

		\WP_CLI\Utils\format_items( 'table', $rows, array( 'layer', 'expected', 'actual' ) );
	}
}
