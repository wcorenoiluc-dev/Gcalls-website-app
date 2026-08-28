<?php
/**
 * The import screen.
 *
 * WHY THERE IS A SCREEN AT ALL
 * The pipeline was WP-CLI only, and the demo host is a shared 1Panel account
 * where the owner has wp-admin but not reliably a shell. A migration that can
 * only be run by someone with SSH is a migration only one person can run.
 *
 * WHAT THIS SCREEN IS NOT
 * It is not a place the importer can start on its own. Nothing here runs on
 * `admin_init`, on a schedule, or on activation: the only path that writes is a
 * POST carrying a valid nonce from a user who can `manage_options` and who
 * ticked the confirmation box. Rendering the screen reads; it never imports.
 *
 * MANIFESTS COME FROM ONE DIRECTORY, NOT FROM A TEXT FIELD
 * An admin-supplied absolute path would be an arbitrary file-read primitive:
 * point it at wp-config.php and the parse error prints the line it choked on.
 * Manifests are read from `uploads/gcalls-import/` and the resolved path is
 * checked to still be inside it, so `../../` buys nothing.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Tools > Gcalls Import.
 */
final class Admin {

	/** Menu slug. */
	public const SLUG = 'gcalls-import';

	/** Nonce action. */
	private const NONCE = 'gcalls_import_run';

	/** Directory under uploads/ that may hold manifests. */
	private const DIRECTORY = 'gcalls-import';

	/**
	 * Registers the screen.
	 *
	 * `admin_menu` only. There is deliberately no `admin_init` here: a hook that
	 * runs on every admin request is how an importer ends up running because
	 * somebody loaded the plugins list.
	 */
	public static function init(): void {
		add_action( 'admin_menu', array( self::class, 'register_page' ) );
	}

	/**
	 * Adds the Tools submenu.
	 */
	public static function register_page(): void {
		add_management_page(
			__( 'Gcalls Import', 'gcalls-core' ),
			__( 'Gcalls Import', 'gcalls-core' ),
			'manage_options',
			self::SLUG,
			array( self::class, 'render' )
		);
	}

	/**
	 * Absolute path of the manifest directory.
	 */
	private static function directory(): string {
		$uploads = wp_get_upload_dir();

		return trailingslashit( $uploads['basedir'] ) . self::DIRECTORY;
	}

	/**
	 * Lists the manifests available to import.
	 *
	 * @return array<int, string> File names, not paths.
	 */
	private static function manifests(): array {
		$found = glob( self::directory() . '/*.json' );

		if ( false === $found ) {
			return array();
		}

		return array_map( 'basename', $found );
	}

	/**
	 * Resolves a submitted file name to a readable path inside the directory.
	 *
	 * @param string $name Submitted file name.
	 * @return string Absolute path, or '' when the name does not resolve safely.
	 */
	private static function resolve( string $name ): string {
		// basename() first so a submitted `../../wp-config.php` cannot even be
		// assembled, and realpath() after so a symlink inside the directory
		// cannot point out of it either.
		$candidate = self::directory() . '/' . basename( $name );
		$real      = realpath( $candidate );
		$base      = realpath( self::directory() );

		if ( false === $real || false === $base || ! str_starts_with( $real, $base . DIRECTORY_SEPARATOR ) ) {
			return '';
		}

		return is_readable( $real ) && '.json' === strtolower( substr( $real, -5 ) ) ? $real : '';
	}

	/**
	 * Renders the screen and handles a submitted run.
	 */
	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Bạn không có quyền chạy import.', 'gcalls-core' ) );
		}

		$report = null;

		if ( isset( $_POST['gcalls_import_submit'] ) ) {
			check_admin_referer( self::NONCE );

			$report = self::handle_submission();
		}

		$manifests = self::manifests();

		echo '<div class="wrap">';
		echo '<h1>' . esc_html__( 'Gcalls Import', 'gcalls-core' ) . '</h1>';

		echo '<p>' . sprintf(
			/* translators: %s: directory path. */
			esc_html__( 'Đặt file manifest .json vào %s rồi tải lại trang này.', 'gcalls-core' ),
			'<code>' . esc_html( self::directory() ) . '</code>'
		) . '</p>';

		if ( array() === $manifests ) {
			echo '<div class="notice notice-warning"><p>' . esc_html__( 'Chưa có manifest nào trong thư mục trên.', 'gcalls-core' ) . '</p></div>';
		}

		if ( is_array( $report ) ) {
			self::render_report( $report );
		}

		echo '<form method="post">';
		wp_nonce_field( self::NONCE );

		echo '<table class="form-table" role="presentation"><tbody>';

		echo '<tr><th scope="row"><label for="gcalls-manifest">' . esc_html__( 'Manifest', 'gcalls-core' ) . '</label></th><td>';
		echo '<select name="manifest" id="gcalls-manifest">';
		foreach ( $manifests as $manifest ) {
			echo '<option value="' . esc_attr( $manifest ) . '">' . esc_html( $manifest ) . '</option>';
		}
		echo '</select>';
		echo '</td></tr>';

		echo '<tr><th scope="row">' . esc_html__( 'Phạm vi', 'gcalls-core' ) . '</th><td>';
		foreach ( Importer::sections() as $section ) {
			echo '<label style="margin-right:1em"><input type="checkbox" name="only[]" value="' . esc_attr( $section ) . '" checked> ' . esc_html( $section ) . '</label>';
		}
		echo '</td></tr>';

		echo '<tr><th scope="row">' . esc_html__( 'Ghi đè', 'gcalls-core' ) . '</th><td>';
		echo '<label><input type="checkbox" name="force" value="1"> ' . esc_html__( 'Cập nhật lại tiêu đề, nội dung và SEO của đối tượng đã có (--force).', 'gcalls-core' ) . '</label><br>';
		echo '<label><input type="checkbox" name="overwrite_edited" value="1"> ' . esc_html__( 'Ghi đè cả nội dung đã được sửa trong WordPress. Thao tác này xoá công sức biên tập.', 'gcalls-core' ) . '</label>';
		echo '</td></tr>';

		echo '<tr><th scope="row">' . esc_html__( 'Xác nhận', 'gcalls-core' ) . '</th><td>';
		echo '<label><input type="checkbox" name="confirm" value="1"> ' . esc_html__( 'Tôi đã đọc kết quả dry-run và muốn ghi thật vào cơ sở dữ liệu.', 'gcalls-core' ) . '</label>';
		echo '<p class="description">' . esc_html__( 'Không tick: chạy thử, không ghi gì. Có tick: ghi thật.', 'gcalls-core' ) . '</p>';
		echo '</td></tr>';

		echo '</tbody></table>';

		submit_button( __( 'Chạy import', 'gcalls-core' ), 'primary', 'gcalls_import_submit' );
		echo '</form>';
		echo '</div>';
	}

	/**
	 * Validates the POST and runs the importer.
	 *
	 * @return array<string, mixed>|null Report, or null when the input was rejected.
	 */
	private static function handle_submission(): ?array {
		$name = isset( $_POST['manifest'] ) ? sanitize_file_name( wp_unslash( (string) $_POST['manifest'] ) ) : '';
		$path = self::resolve( $name );

		if ( '' === $path ) {
			echo '<div class="notice notice-error"><p>' . esc_html__( 'Không đọc được manifest đã chọn.', 'gcalls-core' ) . '</p></div>';
			return null;
		}

		$raw      = (string) file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file inside uploads, resolved and range-checked above.
		$manifest = json_decode( $raw, true );

		if ( ! is_array( $manifest ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html__( 'Manifest không phải JSON hợp lệ.', 'gcalls-core' ) . '</p></div>';
			return null;
		}

		$only = isset( $_POST['only'] ) ? array_map( 'sanitize_key', (array) wp_unslash( $_POST['only'] ) ) : array();

		return Importer::run(
			$manifest,
			array(
				// The confirmation box is the ONLY thing that turns writing on.
				// Everything else about this form is a dry run.
				'dry_run'          => empty( $_POST['confirm'] ),
				'force'            => ! empty( $_POST['force'] ),
				'overwrite_edited' => ! empty( $_POST['overwrite_edited'] ),
				'only'             => array_values( array_intersect( $only, Importer::sections() ) ),
			)
		);
	}

	/**
	 * Prints the run report.
	 *
	 * @param array<string, mixed> $report Report from Importer::run().
	 */
	private static function render_report( array $report ): void {
		if ( ! empty( $report['aborted'] ) ) {
			echo '<div class="notice notice-error"><p><strong>' . esc_html__( 'Import bị từ chối — manifest không hợp lệ. Không có gì được ghi.', 'gcalls-core' ) . '</strong></p><ul style="list-style:disc;margin-left:2em">';
			foreach ( (array) $report['errors'] as $error ) {
				echo '<li>' . esc_html( (string) $error ) . '</li>';
			}
			echo '</ul></div>';
			return;
		}

		$class = ! empty( $report['dry_run'] ) ? 'notice-info' : 'notice-success';

		echo '<div class="notice ' . esc_attr( $class ) . '"><p><strong>';
		echo ! empty( $report['dry_run'] )
			? esc_html__( 'Dry run — không ghi gì.', 'gcalls-core' )
			: esc_html__( 'Đã import.', 'gcalls-core' );
		echo '</strong></p></div>';

		echo '<table class="widefat striped"><thead><tr>';
		foreach ( array( 'Phần', 'Tạo mới', 'Cập nhật', 'Bỏ qua', 'Lỗi' ) as $heading ) {
			echo '<th>' . esc_html( $heading ) . '</th>';
		}
		echo '</tr></thead><tbody>';

		foreach ( (array) $report['sections'] as $section => $counts ) {
			echo '<tr>';
			echo '<td>' . esc_html( (string) $section ) . '</td>';
			echo '<td>' . esc_html( (string) ( $counts['created'] ?? 0 ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $counts['updated'] ?? 0 ) ) . '</td>';
			echo '<td>' . esc_html( (string) ( $counts['skipped'] ?? 0 ) ) . '</td>';
			echo '<td>' . esc_html( (string) count( (array) ( $counts['errors'] ?? array() ) ) ) . '</td>';
			echo '</tr>';
		}

		echo '</tbody></table>';

		foreach ( (array) $report['sections'] as $section => $counts ) {
			foreach ( (array) ( $counts['errors'] ?? array() ) as $error ) {
				echo '<p class="notice notice-warning" style="padding:.5em">' . esc_html( $section . ': ' . (string) $error ) . '</p>';
			}
		}
	}
}
