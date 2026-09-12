<?php
/**
 * Admin menu: "Gcalls Content" with four screens. Only the first screen
 * ("Trang & Section") loads the editor script/styles — the others are plain
 * server-rendered tables, so there is nothing heavy on pages that don't need
 * the iframe or the media picker.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Admin {

	private const SLUG_EDITOR    = 'gcalls-content';
	private const SLUG_DRAFTS    = 'gcalls-content-drafts';
	private const SLUG_REVISIONS = 'gcalls-content-revisions';
	private const SLUG_SETTINGS  = 'gcalls-content-settings';
	private const OPTION_PUBLIC_BASE_URL = 'gcalls_cs_public_base_url';

	private Store $store;
	private string $editor_hook = '';

	public function __construct() {
		$this->store = new Store();
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public function register_menu(): void {
		add_menu_page(
			'Gcalls Content',
			'Gcalls Content',
			CAP_EDIT,
			self::SLUG_EDITOR,
			array( $this, 'render_editor_page' ),
			'dashicons-edit-page',
			58
		);

		$this->editor_hook = add_submenu_page(
			self::SLUG_EDITOR,
			'Trang & Section',
			'Trang & Section',
			CAP_EDIT,
			self::SLUG_EDITOR,
			array( $this, 'render_editor_page' )
		);

		add_submenu_page(
			self::SLUG_EDITOR,
			'Bản nháp',
			'Bản nháp',
			CAP_EDIT,
			self::SLUG_DRAFTS,
			array( $this, 'render_drafts_page' )
		);

		add_submenu_page(
			self::SLUG_EDITOR,
			'Lịch sử phiên bản',
			'Lịch sử phiên bản',
			CAP_EDIT,
			self::SLUG_REVISIONS,
			array( $this, 'render_revisions_page' )
		);

		add_submenu_page(
			self::SLUG_EDITOR,
			'Cài đặt',
			'Cài đặt',
			'manage_options',
			self::SLUG_SETTINGS,
			array( $this, 'render_settings_page' )
		);
	}

	public function register_settings(): void {
		register_setting(
			'gcalls_cs_settings',
			self::OPTION_PUBLIC_BASE_URL,
			array(
				'type'              => 'string',
				'sanitize_callback' => static fn( $v ) => Schema::sanitize_url( (string) $v ) ?? '',
				'default'           => '',
			)
		);
	}

	public static function public_base_url(): string {
		$url = get_option( self::OPTION_PUBLIC_BASE_URL, '' );
		return is_string( $url ) ? $url : '';
	}

	public function enqueue( string $hook ): void {
		if ( $hook !== $this->editor_hook ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_style( 'gcalls-cs-admin', GCALLS_CS_URL . 'assets/css/admin.css', array(), VERSION );
		wp_enqueue_script( 'gcalls-cs-admin', GCALLS_CS_URL . 'assets/js/admin-editor.js', array( 'wp-api-fetch', 'jquery' ), VERSION, true );

		$routes = array();
		foreach ( Schema::routes() as $slug => $meta ) {
			$sections = array();
			foreach ( array_keys( $meta['sections'] ) as $section_slug ) {
				$sections[ $section_slug ] = array(
					'label'  => $meta['sections'][ $section_slug ],
					'fields' => Schema::fields( $slug, $section_slug ),
				);
			}
			$routes[ $slug ] = array(
				'label'        => $meta['label'],
				'path'         => $meta['path'],
				'sections'     => $sections,
				'previewNonce' => wp_create_nonce( Preview::nonce_action( $slug ) ),
			);
		}

		wp_localize_script(
			'gcalls-cs-admin',
			'GcallsContentStudio',
			array(
				'restUrl'       => esc_url_raw( rest_url( REST_NAMESPACE ) ),
				'wpNonce'       => wp_create_nonce( 'wp_rest' ),
				'previewUrl'    => esc_url_raw( home_url( '/' ) ),
				'publicBaseUrl' => self::public_base_url(),
				'routes'        => $routes,
				'canPublish'    => Capabilities::can_publish(),
				'viewports'     => array(
					'desktop' => 1440,
					'tablet'  => 768,
					'mobile'  => 390,
				),
				'i18n'          => array(
					'saveDraft'       => 'Lưu bản nháp',
					'publish'         => 'Xuất bản',
					'restorePrevious' => 'Khôi phục bản đang xuất bản',
					'restoreDefaults' => 'Khôi phục mặc định React',
					'preview'         => 'Xem trước',
					'confirmPublish'  => 'Xác nhận xuất bản',
				),
			)
		);
	}

	public function render_editor_page(): void {
		if ( ! Capabilities::can_edit() ) {
			wp_die( 'You do not have permission to access Gcalls Content.' );
		}
		echo '<div class="wrap gcalls-cs-wrap"><h1>Gcalls Content — Trang &amp; Section</h1>';

		$dependency_error = Preview::dependency_error();
		if ( null !== $dependency_error ) {
			printf(
				'<div class="notice notice-error"><p><strong>Live preview is unavailable:</strong> %s</p></div>',
				esc_html( $dependency_error )
			);
			echo '<p>Fields can still be edited and saved as a draft; the preview panel will work once this is resolved.</p>';
		}

		echo '<div id="gcalls-cs-root" class="gcalls-cs-root"><p>Loading editor…</p></div></div>';
	}

	public function render_drafts_page(): void {
		if ( ! Capabilities::can_edit() ) {
			wp_die( 'You do not have permission to access Gcalls Content.' );
		}
		echo '<div class="wrap"><h1>Gcalls Content — Bản nháp</h1><table class="widefat striped"><thead><tr>';
		echo '<th>Route</th><th>Section</th><th>Trạng thái</th><th>Sửa lần cuối</th><th>Người sửa</th></tr></thead><tbody>';
		foreach ( Schema::routes() as $slug => $meta ) {
			$draft     = $this->store->draft( $slug );
			$route_meta = $this->store->meta( $slug );
			foreach ( array_keys( $meta['sections'] ) as $section ) {
				$has_draft = isset( $draft['sections'][ $section ] );
				printf(
					'<tr><td>%s (%s)</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',
					esc_html( $meta['label'] ),
					esc_html( $meta['path'] ),
					esc_html( $meta['sections'][ $section ] ),
					$has_draft ? '<strong style="color:#673ab7">Bản nháp</strong>' : 'Đã xuất bản',
					esc_html( $route_meta['lastModified'] ?? '—' ),
					esc_html( $route_meta['lastEditor'] ?? '—' )
				);
			}
		}
		echo '</tbody></table></div>';
	}

	public function render_revisions_page(): void {
		if ( ! Capabilities::can_edit() ) {
			wp_die( 'You do not have permission to access Gcalls Content.' );
		}
		$route = isset( $_GET['route'] ) ? sanitize_key( wp_unslash( (string) $_GET['route'] ) ) : 'home'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! Schema::route_exists( $route ) ) {
			$route = 'home';
		}

		echo '<div class="wrap"><h1>Gcalls Content — Lịch sử phiên bản</h1>';
		echo '<form method="get"><input type="hidden" name="page" value="' . esc_attr( self::SLUG_REVISIONS ) . '" />';
		echo '<select name="route" onchange="this.form.submit()">';
		foreach ( Schema::routes() as $slug => $meta ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $slug ), selected( $slug, $route, false ), esc_html( $meta['label'] ) );
		}
		echo '</select></form><br />';

		echo '<table class="widefat striped"><thead><tr><th>Revision</th><th>Ngày</th><th>Tác giả</th><th>Trạng thái</th></tr></thead><tbody>';
		foreach ( $this->store->revisions( $route ) as $revision ) {
			printf(
				'<tr><td>#%d</td><td>%s</td><td>%s</td><td>%s</td></tr>',
				(int) $revision['id'],
				esc_html( $revision['date'] ),
				esc_html( $revision['author'] ),
				$revision['is_published'] ? '<strong style="color:#673ab7">Đang xuất bản</strong>' : 'Lưu trữ'
			);
		}
		echo '</tbody></table>';
		echo '<p>Khôi phục một phiên bản cũ trong màn hình "Trang &amp; Section", nút "' . esc_html( 'Khôi phục bản đang xuất bản' ) . '".</p></div>';
	}

	public function render_settings_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'You do not have permission to access this page.' );
		}
		echo '<div class="wrap"><h1>Gcalls Content — Cài đặt</h1><form method="post" action="options.php">';
		settings_fields( 'gcalls_cs_settings' );
		echo '<table class="form-table"><tr><th scope="row"><label for="gcalls_cs_public_base_url">React Shell public base URL</label></th><td>';
		printf(
			'<input type="url" id="gcalls_cs_public_base_url" name="%s" value="%s" class="regular-text" placeholder="https://gcalls.co" />',
			esc_attr( self::OPTION_PUBLIC_BASE_URL ),
			esc_attr( self::public_base_url() )
		);
		echo '<p class="description">Used only by the "Xem trang công khai" link. It does not need to be same-origin.</p></td></tr>';
		echo '</table>';

		$dependency_error = Preview::dependency_error();
		echo '<h2>Gcalls React Shell dependency</h2>';
		if ( null === $dependency_error ) {
			$version = function_exists( 'gcalls_react_shell_version' ) ? gcalls_react_shell_version() : '?';
			printf( '<p style="color:#008a20">✓ Gcalls React Shell %s is active with a valid build. Live preview and published content use its build directly — nothing to deploy here.</p>', esc_html( (string) $version ) );
		} else {
			printf( '<p style="color:#d63638">✗ %s</p>', esc_html( $dependency_error ) );
		}
		submit_button();
		echo '</form></div>';
	}
}
