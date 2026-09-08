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
 * THE ZIP UPLOADER
 * That directory is unreachable from wp-admin: the Media Library rewrites the
 * path to `uploads/YYYY/MM/` and refuses `.json` outright, so on a host where
 * the operator has wp-admin but no SFTP there was no way to get a manifest in
 * at all. The uploader below accepts the packaged `.zip` and extracts it there
 * with WordPress' own `unzip_file()`.
 *
 * It is deliberately narrow. Only `.zip` is accepted, only into the one
 * directory, and every extracted entry is checked afterwards: an archive is a
 * list of paths an attacker chooses, and `unzip_file()` does not stop a member
 * named `../../../wp-config.php`. Anything outside the directory, or with an
 * extension not on the allowlist, is deleted and the upload is refused.
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

	/** Nonce action for the upload form. */
	private const NONCE_UPLOAD = 'gcalls_import_upload';

	/** Largest archive accepted, before extraction. */
	private const MAX_UPLOAD_BYTES = 32 * 1024 * 1024;

	/** Extensions an extracted archive member may have. */
	private const ALLOWED_MEMBER_EXTENSIONS = array( 'json', 'webp', 'png', 'jpg', 'jpeg', 'gif', 'txt', 'md' );

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
	 * One level of nesting is searched as well as the top level, because the
	 * packages extract to their own root directory — `gcalls-content/` and
	 * `gcalls-content-full-blog/` — and requiring the operator to flatten them
	 * by hand is exactly the manual step the uploader exists to remove.
	 *
	 * @return array<int, string> Paths relative to the import directory.
	 */
	private static function manifests(): array {
		$base  = self::directory();
		$found = array_merge(
			(array) glob( $base . '/*.json' ),
			(array) glob( $base . '/*/*.json' )
		);

		$relative = array();

		foreach ( array_filter( $found ) as $path ) {
			$relative[] = ltrim( str_replace( $base, '', $path ), '/\\' );
		}

		sort( $relative );

		return $relative;
	}

	/**
	 * Resolves a submitted relative path to a readable file inside the directory.
	 *
	 * The submitted value may now contain one directory segment, so basename()
	 * alone is no longer the guard. Each segment is sanitised individually — a
	 * `..` segment cannot survive `sanitize_file_name()` — and the assembled
	 * path is then confirmed with realpath() to still be inside the directory,
	 * which is what a symlink planted inside it cannot get past.
	 *
	 * @param string $name Submitted relative path.
	 * @return string Absolute path, or '' when the name does not resolve safely.
	 */
	private static function resolve( string $name ): string {
		$segments = array();

		foreach ( explode( '/', str_replace( '\\', '/', $name ) ) as $segment ) {
			$clean = sanitize_file_name( $segment );

			if ( '' === $clean || '.' === $clean || '..' === $clean ) {
				continue;
			}

			$segments[] = $clean;
		}

		if ( count( $segments ) < 1 || count( $segments ) > 2 ) {
			return '';
		}

		$real = realpath( self::directory() . '/' . implode( '/', $segments ) );
		$base = realpath( self::directory() );

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

		if ( isset( $_POST['gcalls_import_upload'] ) ) {
			check_admin_referer( self::NONCE_UPLOAD );

			self::handle_upload();
		}

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

		echo '<h2>' . esc_html__( 'Tải gói nội dung lên', 'gcalls-core' ) . '</h2>';
		echo '<form method="post" enctype="multipart/form-data">';
		wp_nonce_field( self::NONCE_UPLOAD );
		echo '<p>';
		echo '<input type="file" name="gcalls_package" accept=".zip">';
		echo '</p>';
		echo '<p class="description">' . sprintf(
			/* translators: %s: maximum size. */
			esc_html__( 'Chỉ nhận .zip, tối đa %s. Nội dung được giải nén vào thư mục import ở trên.', 'gcalls-core' ),
			esc_html( size_format( self::MAX_UPLOAD_BYTES ) )
		) . '</p>';
		submit_button( __( 'Tải lên và giải nén', 'gcalls-core' ), 'secondary', 'gcalls_import_upload' );
		echo '</form>';

		echo '<hr>';
		echo '<h2>' . esc_html__( 'Chạy import', 'gcalls-core' ) . '</h2>';
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
	 * Accepts a packaged .zip and extracts it into the import directory.
	 *
	 * WHY THE EXTRACTED FILES ARE RE-CHECKED
	 * A zip's member names are chosen by whoever built the archive, and
	 * `unzip_file()` will happily write a member called `../../../wp-config.php`
	 * relative to the destination. The capability check upstream means the
	 * uploader is already an administrator, so this is not the main line of
	 * defence — but "an administrator uploaded a file someone emailed them" is
	 * the ordinary way this goes wrong, and the check costs one pass over the
	 * extracted tree. Anything outside the directory, or carrying an extension
	 * that is not on the allowlist, is deleted and the whole upload refused.
	 */
	private static function handle_upload(): void {
		$notice = static function ( string $type, string $message ): void {
			echo '<div class="notice notice-' . esc_attr( $type ) . '"><p>' . esc_html( $message ) . '</p></div>';
		};

		if ( empty( $_FILES['gcalls_package']['name'] ) ) {
			$notice( 'error', __( 'Chưa chọn file nào.', 'gcalls-core' ) );
			return;
		}

		$file = $_FILES['gcalls_package']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Fields are individually validated below.

		if ( ! isset( $file['error'] ) || UPLOAD_ERR_OK !== (int) $file['error'] ) {
			$notice( 'error', __( 'Tải lên thất bại.', 'gcalls-core' ) );
			return;
		}

		if ( (int) $file['size'] > self::MAX_UPLOAD_BYTES ) {
			$notice( 'error', __( 'File vượt quá dung lượng cho phép.', 'gcalls-core' ) );
			return;
		}

		$name = sanitize_file_name( (string) $file['name'] );

		if ( 'zip' !== strtolower( (string) pathinfo( $name, PATHINFO_EXTENSION ) ) ) {
			$notice( 'error', __( 'Chỉ nhận file .zip.', 'gcalls-core' ) );
			return;
		}

		$tmp = (string) $file['tmp_name'];

		if ( ! is_uploaded_file( $tmp ) ) {
			$notice( 'error', __( 'Nguồn tải lên không hợp lệ.', 'gcalls-core' ) );
			return;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';

		global $wp_filesystem;

		if ( ! WP_Filesystem() ) {
			$notice( 'error', __( 'Không truy cập được hệ thống tập tin.', 'gcalls-core' ) );
			return;
		}

		$destination = self::directory();

		if ( ! wp_mkdir_p( $destination ) ) {
			$notice( 'error', __( 'Không tạo được thư mục import.', 'gcalls-core' ) );
			return;
		}

		$result = unzip_file( $tmp, $destination );

		if ( is_wp_error( $result ) ) {
			$notice( 'error', sprintf(
				/* translators: %s: error message. */
				__( 'Giải nén thất bại: %s', 'gcalls-core' ),
				$result->get_error_message()
			) );
			return;
		}

		$offenders = self::unsafe_members( $destination );

		if ( array() !== $offenders ) {
			foreach ( $offenders as $offender ) {
				$wp_filesystem->delete( $offender, true );
			}

			$notice( 'error', sprintf(
				/* translators: %d: number of rejected files. */
				__( 'Gói chứa %d tập tin không hợp lệ — đã xoá và huỷ lần tải lên này.', 'gcalls-core' ),
				count( $offenders )
			) );
			return;
		}

		$notice( 'success', sprintf(
			/* translators: 1: file name, 2: destination. */
			__( 'Đã giải nén %1$s vào %2$s.', 'gcalls-core' ),
			$name,
			$destination
		) );
	}

	/**
	 * Lists extracted paths that escape the directory or carry a disallowed type.
	 *
	 * @param string $root Directory the archive was extracted into.
	 * @return array<int, string> Absolute paths to delete.
	 */
	private static function unsafe_members( string $root ): array {
		$base = realpath( $root );

		if ( false === $base ) {
			return array();
		}

		$offenders = array();

		$iterator = new \RecursiveIteratorIterator(
			new \RecursiveDirectoryIterator( $base, \FilesystemIterator::SKIP_DOTS ),
			\RecursiveIteratorIterator::SELF_FIRST
		);

		foreach ( $iterator as $item ) {
			$real = $item->getRealPath();

			// A symlink or a traversing member resolves outside the directory.
			if ( false === $real || ! str_starts_with( $real, $base . DIRECTORY_SEPARATOR ) ) {
				$offenders[] = $item->getPathname();
				continue;
			}

			if ( $item->isDir() ) {
				continue;
			}

			$extension = strtolower( (string) pathinfo( $real, PATHINFO_EXTENSION ) );

			if ( ! in_array( $extension, self::ALLOWED_MEMBER_EXTENSIONS, true ) ) {
				$offenders[] = $real;
			}
		}

		return $offenders;
	}

	/**
	 * Validates the POST and runs the importer.
	 *
	 * @return array<string, mixed>|null Report, or null when the input was rejected.
	 */
	private static function handle_submission(): ?array {
		// NOT sanitize_file_name() here: it strips the directory separator, so
		// `gcalls-content/content-manifest.json` would arrive at resolve() as
		// `gcalls-contentcontent-manifest.json` and never match anything. The
		// value is sanitised per SEGMENT inside resolve(), which is the only
		// place that knows a segment is what it is dealing with.
		$name = isset( $_POST['manifest'] ) ? wp_unslash( (string) $_POST['manifest'] ) : '';
		$path = self::resolve( (string) $name );

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
				// Media ships beside the manifest inside the package, so the
				// base directory follows the manifest rather than being
				// configured separately and drifting from it.
				'media_base'       => dirname( $path ) . '/media',
				// The Elementor templates ship in a sibling directory, so the
				// importer is given the package root and finds them from there.
				'package_base'     => dirname( $path ),
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
