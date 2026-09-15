<?php
/**
 * Serves the same-origin preview iframe's document.
 *
 * Never vendors its own copy of the React build: it calls Gcalls React
 * Shell's public integration contract so preview and production run the
 * exact same JS/CSS build from the exact same Vite manifest. React Shell
 * dequeues theme CSS and global styles itself for every shell render.
 *
 * Payload precedence: `revision` (read-only compare) → draft → published.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Preview {

	public function __construct() {
		add_action( 'init', array( $this, 'maybe_serve' ), 0 );
	}

	public static function nonce_action( string $route ): string {
		return 'gcalls_cs_preview_' . $route;
	}

	public static function url( string $route, string $section = '', ?int $revision = null ): string {
		$args = array(
			PREVIEW_QUERY_VAR => '1',
			'route'           => $route,
			'_wpnonce'        => wp_create_nonce( self::nonce_action( $route ) ),
		);
		if ( '' !== $section ) {
			$args['section'] = $section;
		}
		if ( $revision ) {
			$args['revision'] = (string) $revision;
		}
		// Served on the route's own path so the React router renders that route.
		$path = Manifest::route_path( $route );
		return add_query_arg( $args, home_url( '' === $path ? '/' : $path ) );
	}

	/**
	 * Checks the React Shell dependency without side effects, so the preview
	 * endpoint, the editor and Settings show the same diagnosis.
	 *
	 * @return string|null A human-readable problem, or null when everything checks out.
	 */
	public static function dependency_error(): ?string {
		if ( ! function_exists( 'gcalls_react_shell_version' ) ) {
			return 'Gcalls React Shell plugin is not active. Activate it under Plugins before Content Studio can work.';
		}
		$version = gcalls_react_shell_version();
		if ( false === $version ) {
			return 'Gcalls React Shell plugin is loaded but did not report a version. Reinstall it.';
		}
		if ( version_compare( (string) $version, MIN_SHELL_VERSION, '<' ) ) {
			return sprintf( 'Gcalls React Shell %s is active, but Content Studio %s needs %s or newer. Update Gcalls React Shell.', $version, VERSION, MIN_SHELL_VERSION );
		}
		if ( ! function_exists( 'gcalls_react_shell_has_valid_build' ) || ! gcalls_react_shell_has_valid_build() ) {
			return 'Gcalls React Shell has no valid build (its Vite manifest is missing or points at a file that does not exist).';
		}
		if ( ! function_exists( 'gcalls_react_shell_content_manifest' ) ) {
			return 'Gcalls React Shell does not expose a content manifest (gcalls_react_shell_content_manifest). Update Gcalls React Shell.';
		}
		if ( ! Manifest::available() ) {
			return 'Gcalls React Shell ships no content manifest, or it lists no pages. Rebuild React Shell (npm run build:wordpress).';
		}
		return null;
	}

	public function maybe_serve(): void {
		if ( ! isset( $_GET[ PREVIEW_QUERY_VAR ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- feature switch only; the nonce is verified below.
			return;
		}

		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow' );
		header( 'Content-Type: text/html; charset=UTF-8' );

		$route    = isset( $_GET['route'] ) ? sanitize_key( wp_unslash( (string) $_GET['route'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$section  = isset( $_GET['section'] ) ? sanitize_key( wp_unslash( (string) $_GET['section'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$nonce    = isset( $_GET['_wpnonce'] ) ? (string) wp_unslash( $_GET['_wpnonce'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$revision = isset( $_GET['revision'] ) ? absint( wp_unslash( $_GET['revision'] ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// Auth first, before anything about the route is revealed.
		if ( ! is_user_logged_in() || ! Capabilities::can_edit() ) {
			status_header( 403 );
			echo $this->error_page( 'Forbidden', 'Preview requires an authenticated Gcalls Content editor.' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			exit;
		}
		if ( '' === $route || ! Manifest::route_exists( $route ) || ( '' !== $section && ! Manifest::section_exists( $route, $section ) ) ) {
			status_header( 400 );
			echo $this->error_page( 'Bad request', 'Unknown route or section.' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			exit;
		}
		if ( false === wp_verify_nonce( $nonce, self::nonce_action( $route ) ) ) {
			status_header( 403 );
			echo $this->error_page( 'Forbidden', 'Invalid or expired preview link. Click "Refresh Preview" in the editor.' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			exit;
		}

		$dependency_error = self::dependency_error();
		if ( null !== $dependency_error ) {
			status_header( 503 );
			echo $this->error_page( 'React Shell unavailable', $dependency_error ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			exit;
		}

		echo $this->render( $route, $section, $revision ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- delegates to React Shell's own escaped template.
		exit;
	}

	private function render( string $route, string $section, int $revision ): string {
		$store = new Store();
		$meta  = $store->meta( $route );

		if ( $revision ) {
			$rev = $store->revision( $route, $revision );
			if ( null === $rev ) {
				status_header( 404 );
				return $this->error_page( 'Not found', 'Revision does not belong to this page.' );
			}
			$sections = $rev['sections'];
		} else {
			$draft     = $store->draft( $route );
			$published = $store->published( $route );
			$sections  = $draft['sections'] ?? $published['sections'];
		}

		$content = array(
			'restUrl'          => esc_url_raw( rest_url( REST_NAMESPACE ) ),
			'nonce'            => wp_create_nonce( 'wp_rest' ),
			'schemaVersion'    => SCHEMA_VERSION,
			'version'          => (int) $meta['version'],
			'publishedContent' => array( 'sections' => $sections ),
			'previewMode'      => true,
		);
		if ( '' !== $section ) {
			$content['previewSection'] = $section;
		}
		if ( $revision ) {
			$content['previewRevision'] = $revision;
		}
		$seo = ( new Seo() )->public_payload( $route );
		if ( null !== $seo ) {
			$content['seo'] = $seo;
		}

		$html = gcalls_react_shell_render_root( $route, array( 'gcallsContent' => $content ) );
		if ( false === $html ) {
			status_header( 500 );
			return $this->error_page( 'React Shell error', "React Shell does not recognise route key \"{$route}\". Its routes.json and the content manifest have drifted apart." );
		}
		return $html;
	}

	private function error_page( string $title, string $message ): string {
		return '<!doctype html><html><head><meta name="robots" content="noindex,nofollow"></head><body style="font:14px system-ui;padding:2rem;color:#5b5f6b">'
			. '<h1 style="color:#673ab7">' . esc_html( $title ) . '</h1>'
			. '<p>' . esc_html( $message ) . '</p>'
			. '</body></html>';
	}
}
