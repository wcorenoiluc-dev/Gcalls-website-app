<?php
/**
 * Admin menu "Gcalls Content Studio": Website · Media Review · Revisions · Settings.
 *
 * Only the Website screen loads the editor script/styles (Workstream C owns
 * assets/); the other three are server-rendered tables. The localized
 * `GcallsContentStudio` object follows contract §7 exactly.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Admin {

	public const SLUG_WEBSITE   = 'gcalls-content-studio';
	public const SLUG_MEDIA     = 'gcalls-content-studio-media';
	public const SLUG_REVISIONS = 'gcalls-content-studio-revisions';
	public const SLUG_SETTINGS  = 'gcalls-content-studio-settings';

	private Store $store;
	private string $website_hook = '';

	public function __construct() {
		$this->store = new Store();
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_notices', array( $this, 'dependency_notice' ) );
	}

	public function register_menu(): void {
		add_menu_page(
			'Gcalls Content Studio',
			'Gcalls Content Studio',
			CAP_EDIT,
			self::SLUG_WEBSITE,
			array( $this, 'render_website_page' ),
			'dashicons-edit-page',
			58
		);
		$this->website_hook = (string) add_submenu_page( self::SLUG_WEBSITE, 'Website', 'Website', CAP_EDIT, self::SLUG_WEBSITE, array( $this, 'render_website_page' ) );
		add_submenu_page( self::SLUG_WEBSITE, 'Media Review', 'Media Review', CAP_EDIT, self::SLUG_MEDIA, array( $this, 'render_media_page' ) );
		add_submenu_page( self::SLUG_WEBSITE, 'Revisions', 'Revisions', CAP_EDIT, self::SLUG_REVISIONS, array( $this, 'render_revisions_page' ) );
		add_submenu_page( self::SLUG_WEBSITE, 'Settings', 'Settings', CAP_MANAGE, self::SLUG_SETTINGS, array( $this, 'render_settings_page' ) );
	}

	public function register_settings(): void {
		register_setting(
			'gcalls_cs_settings',
			OPTION_PUBLIC_URL,
			array(
				'type'              => 'string',
				'sanitize_callback' => static function ( $v ): string {
					$url = Schema::sanitize_url( (string) $v );
					return null !== $url && preg_match( '#^https?://#i', $url ) ? $url : '';
				},
				'default'           => '',
			)
		);
		register_setting(
			'gcalls_cs_settings',
			OPTION_PILOT_MODE,
			array(
				'type'              => 'string',
				'sanitize_callback' => static fn( $v ): string => 'production' === $v ? 'production' : 'pilot',
				'default'           => 'pilot',
			)
		);
	}

	public static function public_base_url(): string {
		$url = get_option( OPTION_PUBLIC_URL, '' );
		return is_string( $url ) ? $url : '';
	}

	public function dependency_notice(): void {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || false === strpos( (string) $screen->id, 'gcalls-content-studio' ) ) {
			return;
		}
		$error = Preview::dependency_error();
		if ( null !== $error ) {
			printf( '<div class="notice notice-error"><p><strong>Gcalls Content Studio:</strong> %s</p></div>', esc_html( $error ) );
		}
	}

	public function enqueue( string $hook ): void {
		if ( $hook !== $this->website_hook ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_style( 'gcalls-cs-admin', GCALLS_CS_URL . 'assets/css/admin.css', array(), VERSION );
		wp_enqueue_script( 'gcalls-cs-admin', GCALLS_CS_URL . 'assets/js/admin-editor.js', array( 'wp-api-fetch', 'jquery' ), VERSION, true );

		$preview_nonces = array();
		foreach ( array_keys( Manifest::pages() ) as $route ) {
			$preview_nonces[ $route ] = wp_create_nonce( Preview::nonce_action( $route ) );
		}
		$user = wp_get_current_user();

		wp_localize_script(
			'gcalls-cs-admin',
			'GcallsContentStudio',
			array(
				'restUrl'       => esc_url_raw( rest_url( REST_NAMESPACE ) ),
				'wpNonce'       => wp_create_nonce( 'wp_rest' ),
				'homeUrl'       => esc_url_raw( home_url( '/' ) ),
				'publicBaseUrl' => self::public_base_url(),
				'manifest'      => Manifest::for_admin(),
				'previewNonces' => $preview_nonces,
				'previewParam'  => PREVIEW_QUERY_VAR,
				'canPublish'    => Capabilities::can_publish(),
				'canManage'     => Capabilities::can_manage(),
				'currentUser'   => array( 'id' => (int) $user->ID, 'name' => (string) $user->display_name ),
				'viewports'     => array( 'desktop' => 1440, 'tablet' => 768, 'mobile' => 390 ),
				'reviewLabel'   => 'Đang kiểm tra giao diện',
				'pilotMode'     => pilot_mode(),
				'version'       => VERSION,
				'dependencyError' => Preview::dependency_error(),
				'i18n'          => array(
					'saveDraft'      => 'Lưu bản nháp',
					'publish'        => 'Cập nhật website',
					'revert'         => 'Hoàn tác',
					'confirmPublish' => 'Nội dung này sẽ được hiển thị ngay trên website.',
					'unsaved'        => 'Bạn có thay đổi chưa lưu.',
					'viewUpdated'    => 'Xem trang vừa cập nhật',
				),
			)
		);
	}

	private function guard( string $cap ): void {
		if ( ! current_user_can( $cap ) ) {
			wp_die( 'You do not have permission to access Gcalls Content Studio.' );
		}
	}

	public function render_website_page(): void {
		$this->guard( CAP_EDIT );
		echo '<div class="wrap gcalls-cs-wrap"><h1>Gcalls Content Studio — Website</h1>';
		if ( 'pilot' === pilot_mode() ) {
			echo '<p class="description">Chế độ pilot: chỉ các trang được đánh dấu "Có thể chỉnh sửa" nhận nội dung mới; các trang còn lại chỉ xem.</p>';
		}
		echo '<div id="gcalls-cs-root" class="gcalls-cs-root"><p>Đang tải trình chỉnh sửa…</p></div></div>';
	}

	public function render_media_page(): void {
		$this->guard( CAP_EDIT );
		echo '<div class="wrap"><h1>Gcalls Content Studio — Media Review</h1>';
		echo '<p class="description">Mọi ảnh đang được tham chiếu trong nội dung đã xuất bản hoặc bản nháp. Ảnh bị chặn (PII_BLOCKED) không bao giờ được xuất bản.</p>';
		echo '<table class="widefat striped"><thead><tr><th>Ảnh</th><th>Trang</th><th>Section / Field</th><th>Trạng thái</th><th>Tên file</th><th>Kích thước</th><th>Alt</th><th>Trang trí</th><th>Chặn</th></tr></thead><tbody>';
		$rows = 0;
		foreach ( array_keys( Manifest::pages() ) as $route ) {
			foreach ( $this->store->referenced_images( $route ) as $ref ) {
				$rows++;
				$image    = $ref['image'];
				$id       = (int) ( $image['id'] ?? 0 );
				$filename = (string) ( $image['filename'] ?? basename( (string) get_attached_file( $id ) ) );
				$blocked  = Schema::filename_blocked( $filename ) || ( $id && ! wp_attachment_is_image( $id ) );
				$thumb    = $id ? wp_get_attachment_image( $id, array( 80, 80 ), false, array( 'style' => 'max-width:80px;height:auto' ) ) : '';
				printf(
					'<tr><td>%s</td><td>%s</td><td>%s / %s</td><td>%s</td><td><code>%s</code></td><td>%d×%d</td><td>%s</td><td>%s</td><td>%s</td></tr>',
					$thumb ? $thumb : '—', // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_attachment_image() returns escaped HTML.
					esc_html( Manifest::route_label( $route ) ),
					esc_html( $ref['section'] ),
					esc_html( $ref['field'] ),
					'draft' === $ref['state'] ? '<span style="color:#673ab7">Bản nháp</span>' : 'Đã xuất bản',
					esc_html( $filename ),
					(int) ( $image['width'] ?? 0 ),
					(int) ( $image['height'] ?? 0 ),
					'' !== trim( (string) $ref['alt'] ) ? esc_html( (string) $ref['alt'] ) : '<span style="color:#d63638">thiếu</span>',
					$ref['decorative'] ? 'Có' : 'Không',
					$blocked ? '<strong style="color:#d63638">BLOCKED</strong>' : 'Không'
				);
			}
		}
		if ( 0 === $rows ) {
			echo '<tr><td colspan="9">Chưa có ảnh nào được tham chiếu trong nội dung.</td></tr>';
		}
		echo '</tbody></table></div>';
	}

	public function render_revisions_page(): void {
		$this->guard( CAP_EDIT );
		$pages = Manifest::pages();
		$route = isset( $_GET['route'] ) ? sanitize_key( wp_unslash( (string) $_GET['route'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $pages[ $route ] ) ) {
			$route = (string) ( array_key_first( $pages ) ?? '' );
		}

		echo '<div class="wrap"><h1>Gcalls Content Studio — Revisions</h1>';
		if ( '' === $route ) {
			echo '<p>Không có trang nào trong manifest.</p></div>';
			return;
		}
		echo '<form method="get"><input type="hidden" name="page" value="' . esc_attr( self::SLUG_REVISIONS ) . '" />';
		echo '<select name="route" onchange="this.form.submit()">';
		foreach ( $pages as $slug => $page ) {
			printf( '<option value="%s"%s>%s (%s)</option>', esc_attr( $slug ), selected( $slug, $route, false ), esc_html( (string) $page['label'] ), esc_html( (string) $page['path'] ) );
		}
		echo '</select></form><br />';

		$meta = $this->store->meta( $route );
		printf(
			'<p>Phiên bản bản ghi: <strong>%d</strong> · Đang xuất bản: revision <strong>#%d</strong> · Xuất bản lần cuối: %s bởi %s</p>',
			(int) $meta['version'],
			(int) $meta['publishedRevision'],
			esc_html( (string) ( $meta['publishedAt'] ?? '—' ) ),
			esc_html( (string) ( $meta['publishedBy'] ?? '—' ) )
		);

		echo '<table class="widefat striped"><thead><tr><th>Revision</th><th>Ngày (UTC)</th><th>Tác giả</th><th>Section thay đổi</th><th>Trạng thái</th><th></th></tr></thead><tbody>';
		$revisions = $this->store->revisions( $route );
		foreach ( $revisions as $revision ) {
			printf(
				'<tr><td>#%d</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td><a class="button button-small" href="%s" target="_blank" rel="noopener">Xem trước</a></td></tr>',
				(int) $revision['id'],
				esc_html( $revision['date'] ),
				esc_html( $revision['author'] ),
				esc_html( '' !== $revision['summary'] ? $revision['summary'] : '—' ),
				$revision['isPublished'] ? '<strong style="color:#673ab7">Đang xuất bản</strong>' : 'Lưu trữ',
				esc_url( Preview::url( $route, '', (int) $revision['id'] ) )
			);
		}
		if ( empty( $revisions ) ) {
			echo '<tr><td colspan="6">Trang này chưa có phiên bản nào (chưa từng "Cập nhật website").</td></tr>';
		}
		echo '</tbody></table>';
		echo '<p>Khôi phục một phiên bản trong màn hình Website, nút "Hoàn tác" — xem trước rồi mới xác nhận.</p></div>';
	}

	public function render_settings_page(): void {
		$this->guard( CAP_MANAGE );
		echo '<div class="wrap"><h1>Gcalls Content Studio — Settings</h1><form method="post" action="options.php">';
		settings_fields( 'gcalls_cs_settings' );
		echo '<table class="form-table">';
		echo '<tr><th scope="row"><label for="gcalls_cs_public_base_url">Public base URL</label></th><td>';
		printf(
			'<input type="url" id="gcalls_cs_public_base_url" name="%s" value="%s" class="regular-text" placeholder="https://gcalls.co" />',
			esc_attr( OPTION_PUBLIC_URL ),
			esc_attr( self::public_base_url() )
		);
		echo '<p class="description">Chỉ dùng cho link "Xem trang vừa cập nhật". Để trống để dùng địa chỉ site này.</p></td></tr>';
		echo '<tr><th scope="row">Chế độ</th><td>';
		$mode = pilot_mode();
		printf(
			'<label><input type="radio" name="%1$s" value="pilot"%2$s /> Pilot</label> &nbsp; <label><input type="radio" name="%1$s" value="production"%3$s /> Production</label>',
			esc_attr( OPTION_PILOT_MODE ),
			checked( 'pilot', $mode, false ),
			checked( 'production', $mode, false )
		);
		echo '<p class="description">Trong cả hai chế độ, website công khai chỉ dùng nội dung đã "Cập nhật website"; trang "Đang kiểm tra giao diện" luôn chỉ xem.</p></td></tr>';
		echo '</table>';

		echo '<h2>Gcalls React Shell</h2>';
		$error = Preview::dependency_error();
		if ( null === $error ) {
			$version = function_exists( 'gcalls_react_shell_version' ) ? gcalls_react_shell_version() : '?';
			$pages   = Manifest::pages();
			$editable = count( array_filter( $pages, static fn( $p ) => 'editable' === ( $p['status'] ?? '' ) ) );
			printf(
				'<p style="color:#008a20">✓ Gcalls React Shell %s hoạt động, manifest v%s: %d trang, %d trang có thể chỉnh sửa. Preview và nội dung xuất bản dùng trực tiếp build của React Shell.</p>',
				esc_html( (string) $version ),
				esc_html( (string) ( Manifest::schema_version() ?? '?' ) ),
				count( $pages ),
				$editable
			);
		} else {
			printf( '<p style="color:#d63638">✗ %s</p>', esc_html( $error ) );
		}

		echo '<h2>Quyền</h2><table class="widefat striped" style="max-width:640px"><thead><tr><th>Vai trò</th><th>Chỉnh sửa</th><th>Cập nhật website</th><th>Quản lý</th></tr></thead><tbody>';
		foreach ( array( 'administrator', 'editor', 'author', 'contributor', 'subscriber' ) as $role_name ) {
			$role = get_role( $role_name );
			if ( ! $role ) {
				continue;
			}
			printf(
				'<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
				esc_html( $role_name ),
				$role->has_cap( CAP_EDIT ) ? '✓' : '—',
				$role->has_cap( CAP_PUBLISH ) ? '✓' : '—',
				$role->has_cap( CAP_MANAGE ) ? '✓' : '—'
			);
		}
		echo '</tbody></table>';
		echo '<p class="description">Capabilities: <code>' . esc_html( CAP_EDIT ) . '</code>, <code>' . esc_html( CAP_PUBLISH ) . '</code>, <code>' . esc_html( CAP_MANAGE ) . '</code>. Content Studio ' . esc_html( VERSION ) . '.</p>';
		submit_button();
		echo '</form></div>';
	}
}
