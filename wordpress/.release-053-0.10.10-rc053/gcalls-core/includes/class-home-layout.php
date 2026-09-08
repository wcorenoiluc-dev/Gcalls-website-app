<?php
/**
 * Applies the generated home-page layout to the front page.
 *
 * WHY THIS EXISTS RATHER THAN "IMPORT THE JSON IN ELEMENTOR"
 * The home page is Elementor data stored in `_elementor_data` on one page, so
 * uploading plugin and theme files cannot change it. The manual route — My
 * Templates → Import, then open the page and apply — has three failure modes
 * that a release cannot carry: the library import screen on this site answers
 * "This source does not support import"; applying a template can INSERT rather
 * than replace, which silently doubles the nineteen sections; and nothing in
 * the flow verifies which page was written to.
 *
 * This screen removes all three. It writes `_elementor_data` on one page id
 * wholesale, so there is no insert path and duplication is not expressible. It
 * refuses to run unless that page is the configured front page. And it keeps
 * the bytes it replaced, so the layout can be put back without a database
 * restore.
 *
 * WHAT IT WILL NOT DO
 * - It never runs by itself. No `admin_init`, no activation hook, no cron: the
 *   only path that writes is a POST with a valid nonce from a user who can
 *   `manage_options` and who ticked the confirmation box.
 * - It touches exactly one row of postmeta on exactly one page. No post, no
 *   other page, no taxonomy, no option that belongs to anything else.
 * - It is not the importer and shares no code with it.
 *
 * THE PRECONDITION HASH
 * The screen prints the SHA-256 of the layout currently on the page and stores
 * it with the rollback copy. Applying twice is therefore visible rather than
 * silent, and a rollback can say whether the page still holds what this screen
 * wrote or whether someone has edited it in Elementor since.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Tools > Gcalls Homepage Layout.
 */
final class Home_Layout {

	/** Menu slug. */
	public const SLUG = 'gcalls-home-layout';

	/** Nonce action for applying. */
	private const NONCE_APPLY = 'gcalls_home_layout_apply';

	/** Nonce action for rolling back. */
	private const NONCE_ROLLBACK = 'gcalls_home_layout_rollback';

	/** Where the replaced layout is kept. */
	private const OPTION_ROLLBACK = 'gcalls_home_layout_rollback';

	/** What this screen has already done, so a second run is a decision. */
	private const OPTION_APPLIED = 'gcalls_home_layout_applied';

	/** The layout the plugin ships, relative to the plugin directory. */
	private const SOURCE = 'data/homepage-elementor.json';

	/** Registers the screen. Nothing else hooks anything. */
	public static function init(): void {
		add_action( 'admin_menu', array( self::class, 'register_page' ) );
	}

	/** Adds the Tools submenu. */
	public static function register_page(): void {
		add_management_page(
			__( 'Gcalls Homepage Layout', 'gcalls-core' ),
			__( 'Gcalls Homepage Layout', 'gcalls-core' ),
			'manage_options',
			self::SLUG,
			array( self::class, 'render' )
		);
	}

	/**
	 * The page this screen is allowed to write to.
	 *
	 * Reading it from Settings > Reading rather than hardcoding 13 means the
	 * screen cannot write to a page that is not actually the front page — if
	 * someone has pointed the site at a different one, this returns that id and
	 * the checks below compare it against what the operator sees.
	 */
	private static function front_page_id(): int {
		return 'page' === get_option( 'show_on_front' ) ? (int) get_option( 'page_on_front' ) : 0;
	}

	/** Absolute path of the shipped layout. */
	private static function source_path(): string {
		return GCALLS_CORE_DIR . self::SOURCE;
	}

	/**
	 * Reads and validates the shipped layout.
	 *
	 * Validation is not a formality: this writes straight into the meta key
	 * Elementor renders the front page from, and a malformed value there is a
	 * blank home page, not an error message.
	 *
	 * @return array{ok: bool, sections: array<int, mixed>, error: string}
	 */
	private static function load_source(): array {
		$fail = static function ( string $message ): array {
			return array(
				'ok'       => false,
				'sections' => array(),
				'error'    => $message,
			);
		};

		$path = self::source_path();

		if ( ! is_readable( $path ) ) {
			return $fail( __( 'Không đọc được tệp layout đi kèm plugin.', 'gcalls-core' ) );
		}

		$decoded = json_decode( (string) file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- A file inside the plugin, not a remote request.

		if ( ! is_array( $decoded ) ) {
			return $fail( __( 'Tệp layout không phải JSON hợp lệ.', 'gcalls-core' ) );
		}

		if ( ( $decoded['type'] ?? '' ) !== 'page' ) {
			return $fail( __( 'Envelope không phải type "page".', 'gcalls-core' ) );
		}

		$content = $decoded['content'] ?? null;

		if ( ! is_array( $content ) || array() === $content ) {
			return $fail( __( 'Layout không có section nào.', 'gcalls-core' ) );
		}

		foreach ( $content as $element ) {
			if ( ! is_array( $element ) || ( $element['elType'] ?? '' ) !== 'section' ) {
				return $fail( __( 'Có phần tử gốc không phải section.', 'gcalls-core' ) );
			}
		}

		return array(
			'ok'       => true,
			'sections' => $content,
			'error'    => '',
		);
	}

	/**
	 * SHA-256 of a page's stored layout, for comparison in the UI.
	 *
	 * @param int $page_id Page to read.
	 */
	private static function current_hash( int $page_id ): string {
		$raw = (string) get_post_meta( $page_id, '_elementor_data', true );

		return '' === $raw ? '' : hash( 'sha256', $raw );
	}

	/** How many top-level sections the page currently holds. */
	private static function current_sections( int $page_id ): int {
		$raw = (string) get_post_meta( $page_id, '_elementor_data', true );

		if ( '' === $raw ) {
			return 0;
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? count( $decoded ) : -1;
	}

	/**
	 * Clears the page's compiled Elementor CSS.
	 *
	 * Elementor caches per-page CSS in postmeta and in uploads/elementor/css.
	 * Without clearing it the new markup is served against the previous page's
	 * compiled stylesheet, which looks exactly like a half-applied deploy.
	 *
	 * @param int $page_id Page whose cache to drop.
	 */
	private static function flush_elementor_css( int $page_id ): void {
		delete_post_meta( $page_id, '_elementor_css' );

		// Elementor's own API when the plugin is active; the meta delete above
		// is what makes this safe to skip when it is not.
		if ( class_exists( '\Elementor\Plugin' ) ) {
			$elementor = \Elementor\Plugin::$instance;

			if ( isset( $elementor->files_manager ) && is_object( $elementor->files_manager ) ) {
				$elementor->files_manager->clear_cache();
			}
		}
	}

	/**
	 * Writes the shipped layout onto the front page.
	 *
	 * @return array{ok: bool, message: string}
	 */
	private static function apply(): array {
		$page_id = self::front_page_id();

		if ( $page_id <= 0 ) {
			return array(
				'ok'      => false,
				'message' => __( 'Settings > Reading chưa đặt một trang tĩnh làm trang chủ. Không ghi gì cả.', 'gcalls-core' ),
			);
		}

		$page = get_post( $page_id );

		if ( ! $page instanceof \WP_Post || 'page' !== $page->post_type ) {
			return array(
				'ok'      => false,
				'message' => __( 'Trang chủ đã cấu hình không tồn tại hoặc không phải là page.', 'gcalls-core' ),
			);
		}

		$source = self::load_source();

		if ( ! $source['ok'] ) {
			return array(
				'ok'      => false,
				'message' => $source['error'],
			);
		}

		$encoded = wp_json_encode( $source['sections'] );

		if ( ! is_string( $encoded ) || '' === $encoded ) {
			return array(
				'ok'      => false,
				'message' => __( 'Không mã hóa được layout.', 'gcalls-core' ),
			);
		}

		/*
		 * Keep what is there before replacing it. Stored as an option rather
		 * than a revision because Elementor data does not travel in revisions
		 * reliably, and this has to be restorable from this same screen.
		 *
		 * THE FIRST SNAPSHOT IS THE ONLY ONE THAT MATTERS, AND IT IS IMMUTABLE.
		 * This used to overwrite unconditionally. Press the button twice and
		 * the second run captured what the FIRST run had just written — so the
		 * site's original layout was gone, and "Hoàn tác" would have restored
		 * this release's layout while reporting success. A rollback that
		 * silently becomes a no-op is worse than no rollback, because nobody
		 * checks it until they need it.
		 *
		 * The snapshot is therefore written once per page and never again. A
		 * stored snapshot belonging to a DIFFERENT page is stale — the front
		 * page has been repointed since — and is replaced, because it can no
		 * longer restore anything.
		 */
		$previous = (string) get_post_meta( $page_id, '_elementor_data', true );
		$existing = get_option( self::OPTION_ROLLBACK );

		$have_original = is_array( $existing )
			&& (int) ( $existing['page_id'] ?? 0 ) === $page_id
			&& array_key_exists( 'previous_data', $existing );

		if ( $have_original ) {
			// Record the re-run for the audit trail, but do not touch the
			// bytes that rollback depends on.
			$existing['runs']               = (int) ( $existing['runs'] ?? 1 ) + 1;
			$existing['last_run_gmt']       = gmdate( 'c' );
			$existing['last_replaced_hash'] = '' === $previous ? '' : hash( 'sha256', $previous );

			update_option( self::OPTION_ROLLBACK, $existing, false );
		} else {
			update_option(
				self::OPTION_ROLLBACK,
				array(
					'page_id'        => $page_id,
					'saved_at_gmt'   => gmdate( 'c' ),
					'previous_data'  => $previous,
					'previous_hash'  => '' === $previous ? '' : hash( 'sha256', $previous ),
					'plugin_version' => VERSION,
					'runs'           => 1,
				),
				false
			);
		}

		update_post_meta( $page_id, '_elementor_data', wp_slash( $encoded ) );

		// Elementor only renders a page it considers built with the builder.
		update_post_meta( $page_id, '_elementor_edit_mode', 'builder' );

		self::flush_elementor_css( $page_id );

		update_option(
			self::OPTION_APPLIED,
			array(
				'page_id'        => $page_id,
				'applied_at_gmt' => gmdate( 'c' ),
				'written_hash'   => hash( 'sha256', $encoded ),
				'sections'       => count( $source['sections'] ),
				'plugin_version' => VERSION,
			),
			false
		);

		return array(
			'ok'      => true,
			/* translators: 1: number of sections, 2: page id. */
			'message' => sprintf(
				__( 'Đã ghi %1$d section vào trang chủ (page ID %2$d). Bản cũ đã được lưu để hoàn tác.', 'gcalls-core' ),
				count( $source['sections'] ),
				$page_id
			),
		);
	}

	/**
	 * Puts back the layout that was replaced.
	 *
	 * @return array{ok: bool, message: string}
	 */
	private static function rollback(): array {
		$saved = get_option( self::OPTION_ROLLBACK );

		if ( ! is_array( $saved ) || ! isset( $saved['page_id'] ) ) {
			return array(
				'ok'      => false,
				'message' => __( 'Không có bản lưu nào để hoàn tác.', 'gcalls-core' ),
			);
		}

		$page_id = (int) $saved['page_id'];

		if ( $page_id !== self::front_page_id() ) {
			return array(
				'ok'      => false,
				'message' => __( 'Trang chủ hiện tại khác với trang đã ghi. Không hoàn tác tự động.', 'gcalls-core' ),
			);
		}

		update_post_meta( $page_id, '_elementor_data', wp_slash( (string) $saved['previous_data'] ) );
		self::flush_elementor_css( $page_id );
		delete_option( self::OPTION_APPLIED );

		return array(
			'ok'      => true,
			/* translators: %d: page id. */
			'message' => sprintf( __( 'Đã khôi phục layout trước đó cho page ID %d.', 'gcalls-core' ), $page_id ),
		);
	}

	/**
	 * Renders the screen, and handles the two POSTs.
	 */
	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Bạn không có quyền truy cập trang này.', 'gcalls-core' ) );
		}

		$notice = array();

		if ( isset( $_POST['gcalls_home_layout_action'] ) ) {
			$action = sanitize_key( wp_unslash( $_POST['gcalls_home_layout_action'] ) );

			if ( 'apply' === $action ) {
				check_admin_referer( self::NONCE_APPLY );

				if ( ! isset( $_POST['gcalls_confirm'] ) ) {
					$notice = array(
						'ok'      => false,
						'message' => __( 'Cần tích vào ô xác nhận trước khi ghi.', 'gcalls-core' ),
					);
				} else {
					$notice = self::apply();
				}
			}

			if ( 'rollback' === $action ) {
				check_admin_referer( self::NONCE_ROLLBACK );
				$notice = self::rollback();
			}
		}

		$page_id  = self::front_page_id();
		$source   = self::load_source();
		$applied  = get_option( self::OPTION_APPLIED );
		$rollback = get_option( self::OPTION_ROLLBACK );

		echo '<div class="wrap"><h1>' . esc_html__( 'Gcalls Homepage Layout', 'gcalls-core' ) . '</h1>';

		echo '<p>' . esc_html__(
			'Ghi layout trang chủ do repository sinh ra vào đúng trang đang được đặt làm Front page. Thao tác này THAY THẾ toàn bộ nội dung Elementor của trang đó — không chèn thêm, nên không thể nhân đôi section.',
			'gcalls-core'
		) . '</p>';

		if ( array() !== $notice ) {
			printf(
				'<div class="notice notice-%s"><p>%s</p></div>',
				esc_attr( $notice['ok'] ? 'success' : 'error' ),
				esc_html( $notice['message'] )
			);
		}

		echo '<h2>' . esc_html__( 'Tình trạng', 'gcalls-core' ) . '</h2><table class="widefat striped" style="max-width:900px"><tbody>';

		$rows = array(
			array(
				__( 'Front page (Settings > Reading)', 'gcalls-core' ),
				$page_id > 0
					? sprintf( 'page ID %d — %s', $page_id, get_the_title( $page_id ) )
					: __( 'CHƯA đặt trang tĩnh — không thể ghi', 'gcalls-core' ),
			),
			array(
				__( 'Slug trang chủ', 'gcalls-core' ),
				$page_id > 0 ? (string) get_post_field( 'post_name', $page_id ) : '—',
			),
			array(
				__( 'Số section hiện có trên trang', 'gcalls-core' ),
				$page_id > 0 ? (string) self::current_sections( $page_id ) : '—',
			),
			array(
				__( 'SHA-256 layout hiện tại', 'gcalls-core' ),
				$page_id > 0 ? ( self::current_hash( $page_id ) ?: __( '(trống)', 'gcalls-core' ) ) : '—',
			),
			array(
				__( 'Layout đi kèm plugin', 'gcalls-core' ),
				$source['ok']
					/* translators: %d: number of sections. */
					? sprintf( __( 'hợp lệ — %d section', 'gcalls-core' ), count( $source['sections'] ) )
					: $source['error'],
			),
			array(
				__( 'Phiên bản plugin', 'gcalls-core' ),
				VERSION,
			),
			array(
				__( 'Đã áp dụng trước đó', 'gcalls-core' ),
				is_array( $applied )
					? sprintf(
						/* translators: 1: timestamp, 2: section count. */
						__( 'có — %1$s (%2$d section)', 'gcalls-core' ),
						(string) ( $applied['applied_at_gmt'] ?? '?' ),
						(int) ( $applied['sections'] ?? 0 )
					)
					: __( 'chưa', 'gcalls-core' ),
			),
			array(
				__( 'Có bản lưu để hoàn tác', 'gcalls-core' ),
				is_array( $rollback )
					? sprintf(
						/* translators: 1: timestamp, 2: page id, 3: number of runs. */
						__( '%1$s (page ID %2$d) — đã ghi %3$d lần, bản lưu vẫn là bản GỐC', 'gcalls-core' ),
						(string) ( $rollback['saved_at_gmt'] ?? '?' ),
						(int) ( $rollback['page_id'] ?? 0 ),
						(int) ( $rollback['runs'] ?? 1 )
					)
					: __( 'chưa có', 'gcalls-core' ),
			),
			array(
				__( 'SHA-256 bản lưu (sẽ khôi phục về)', 'gcalls-core' ),
				is_array( $rollback )
					? ( (string) ( $rollback['previous_hash'] ?? '' ) ?: __( '(trang trước đó trống)', 'gcalls-core' ) )
					: '—',
			),
		);

		foreach ( $rows as $row ) {
			echo '<tr><th scope="row" style="width:280px">' . esc_html( $row[0] ) . '</th>';
			echo '<td><code>' . esc_html( $row[1] ) . '</code></td></tr>';
		}

		echo '</tbody></table>';

		if ( $page_id > 0 && $source['ok'] ) {
			echo '<h2>' . esc_html__( 'Ghi layout', 'gcalls-core' ) . '</h2>';
			echo '<form method="post">';
			wp_nonce_field( self::NONCE_APPLY );
			echo '<input type="hidden" name="gcalls_home_layout_action" value="apply">';
			echo '<p><label><input type="checkbox" name="gcalls_confirm" value="1"> ';
			printf(
				/* translators: %d: page id. */
				esc_html__( 'Tôi hiểu thao tác này thay thế toàn bộ nội dung Elementor của page ID %d.', 'gcalls-core' ),
				(int) $page_id
			);
			echo '</label></p>';
			submit_button( __( 'Ghi layout vào trang chủ', 'gcalls-core' ), 'primary', 'submit', false );
			echo '</form>';
		}

		if ( is_array( $rollback ) ) {
			echo '<h2>' . esc_html__( 'Hoàn tác', 'gcalls-core' ) . '</h2>';
			echo '<form method="post">';
			wp_nonce_field( self::NONCE_ROLLBACK );
			echo '<input type="hidden" name="gcalls_home_layout_action" value="rollback">';
			submit_button( __( 'Khôi phục layout trước đó', 'gcalls-core' ), 'secondary', 'submit', false );
			echo '</form>';
		}

		echo '</div>';
	}
}
