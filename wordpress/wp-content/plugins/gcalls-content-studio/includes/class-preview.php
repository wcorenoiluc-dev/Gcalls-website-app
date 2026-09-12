<?php
/**
 * Serves the same-origin preview iframe's document.
 *
 * This never vendors or reads its own copy of the React build. It calls into
 * Gcalls React Shell's public integration contract
 * (`includes/functions-integration.php` in that plugin) so preview and
 * production always run the exact same JS/CSS build, read from the exact
 * same Vite manifest — no manually-deployed copy under uploads/ that can go
 * stale, and no way for preview to show an older build than the one
 * visitors get.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Preview {

	/**
	 * Oldest React Shell version whose `render_root_html()` signature and
	 * `window.__GCALLS_SHELL_CONFIG__` shape this class relies on. Bump this
	 * only alongside verifying against that version's actual contract.
	 */
	private const MIN_REACT_SHELL_VERSION = '0.3.0';

	public function __construct() {
		add_action( 'init', array( $this, 'maybe_serve' ), 0 );
	}

	public static function nonce_action( string $route ): string {
		return 'gcalls_cs_preview_' . $route;
	}

	/**
	 * Checks the React Shell dependency without side effects, so both the
	 * preview endpoint and the Settings screen can show the exact same
	 * diagnosis instead of two different guesses at the same problem.
	 *
	 * @return string|null A human-readable problem description, or null when everything checks out.
	 */
	public static function dependency_error(): ?string {
		if ( ! function_exists( 'gcalls_react_shell_version' ) ) {
			return 'Gcalls React Shell plugin is not active. Activate it under Plugins before live preview can work.';
		}

		$version = gcalls_react_shell_version();
		if ( false === $version ) {
			return 'Gcalls React Shell plugin is loaded but did not report a version. Reinstall it.';
		}

		if ( version_compare( (string) $version, self::MIN_REACT_SHELL_VERSION, '<' ) ) {
			return sprintf(
				'Gcalls React Shell %s is active, but Content Studio needs %s or newer. Update Gcalls React Shell.',
				$version,
				self::MIN_REACT_SHELL_VERSION
			);
		}

		if ( ! function_exists( 'gcalls_react_shell_has_valid_build' ) || ! gcalls_react_shell_has_valid_build() ) {
			return 'Gcalls React Shell has no valid build (its Vite manifest is missing or points at a file that does not exist). Run its build step and reactivate.';
		}

		return null;
	}

	public function maybe_serve(): void {
		if ( ! isset( $_GET[ PREVIEW_QUERY_VAR ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the nonce itself is verified below, this is only the feature switch.
			return;
		}

		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow' );
		header( 'Content-Type: text/html; charset=UTF-8' );

		$route   = isset( $_GET['route'] ) ? sanitize_key( wp_unslash( (string) $_GET['route'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$section = isset( $_GET['section'] ) ? sanitize_key( wp_unslash( (string) $_GET['section'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$nonce   = isset( $_GET['_wpnonce'] ) ? (string) wp_unslash( $_GET['_wpnonce'] ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// Auth first, before anything about the route or the dependency is
		// revealed — an unauthenticated request gets the same 403 whether
		// the route exists or not.
		if ( ! is_user_logged_in() || ! Capabilities::can_edit() ) {
			status_header( 403 );
			echo $this->error_page( 'Forbidden', 'Preview requires an authenticated Gcalls Content editor.' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			exit;
		}
		if ( '' === $route || ! Schema::route_exists( $route ) || ! Schema::section_exists( $route, $section ) ) {
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

		echo $this->render( $route, $section ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render() delegates to React Shell's own escaped template.
		exit;
	}

	private function render( string $route, string $section ): string {
		$store     = new Store();
		$draft     = $store->draft( $route );
		$published = $store->published( $route );
		$sections  = $draft['sections'] ?? $published['sections'] ?? array();

		$extra_config = array(
			'gcallsContent' => array(
				'restUrl'          => esc_url_raw( rest_url( REST_NAMESPACE ) ),
				'nonce'            => wp_create_nonce( 'wp_rest' ),
				'publishedContent' => array( 'sections' => $sections ),
				'previewMode'      => true,
				'previewSection'   => $section,
				'schemaVersion'    => SCHEMA_VERSION,
			),
		);

		// Content Studio route slugs are, by contract, the same keys React
		// Shell's routes.json uses (both name the homepage "home") — see
		// Schema::routes(). gcalls_react_shell_render_root() returns false
		// only if that contract is ever violated for a route Schema still
		// thinks exists, which dependency_error()'s checks above don't
		// catch, so it is handled once more here rather than assumed.
		$html = gcalls_react_shell_render_root( $route, $extra_config );
		if ( false === $html ) {
			status_header( 500 );
			return $this->error_page( 'React Shell error', "React Shell does not recognise route key \"{$route}\". Its routes.json and Content Studio's Schema.php have drifted apart." );
		}

		return $html;
	}

	private function error_page( string $title, string $message ): string {
		return '<!doctype html><html><body style="font:14px system-ui;padding:2rem;color:#5b5f6b">'
			. '<h1 style="color:#673ab7">' . esc_html( $title ) . '</h1>'
			. '<p>' . esc_html( $message ) . '</p>'
			. '</body></html>';
	}
}
