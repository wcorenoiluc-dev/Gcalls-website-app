<?php
/**
 * Route interception and mounting.
 *
 * Hooks on `template_redirect`, the point at which WordPress has already
 * resolved admin/login/REST/AJAX/cron/feed requests to their own handlers, so
 * this class only ever sees a front-end page request — but every guard below
 * is still written explicitly rather than relied on implicitly, because a
 * misconfigured rewrite or a future WP core change should not silently start
 * routing wp-admin through here.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Gcalls_React_Shell {

	/** @var array<string,string>|null */
	private static $routes = null;

	public static function init() {
		add_action( 'template_redirect', array( __CLASS__, 'maybe_serve_shell' ), 0 );
	}

	/**
	 * @return array<string,string> path => label, keyed by normalized leading
	 * and trailing slash (e.g. "/", "/san-pham/").
	 */
	private static function get_routes() {
		if ( null !== self::$routes ) {
			return self::$routes;
		}

		$file = GCALLS_REACT_SHELL_DIR . 'routes.json';
		$raw  = file_exists( $file ) ? file_get_contents( $file ) : false; // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data = $raw ? json_decode( $raw, true ) : array();

		$routes = array();
		if ( is_array( $data ) ) {
			foreach ( $data as $entry ) {
				if ( ! empty( $entry['path'] ) ) {
					$routes[ self::normalize_path( $entry['path'] ) ] = $entry['key'] ?? $entry['path'];
				}
			}
		}

		self::$routes = $routes;
		return $routes;
	}

	private static function normalize_path( $path ) {
		$path = '/' . trim( (string) $path, '/' );
		return '/' === $path ? '/' : $path . '/';
	}

	/**
	 * Explicit exclusions. Each is checked independently — no single hook
	 * timing or condition is trusted to cover all of these by itself.
	 */
	private static function is_excluded_request() {
		if ( is_admin() ) {
			return true;
		}
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			return true;
		}
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return true;
		}
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return true;
		}
		if ( defined( 'DOING_CRON' ) && DOING_CRON ) {
			return true;
		}
		if ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST ) {
			return true;
		}
		if ( is_feed() ) {
			return true;
		}
		if ( is_preview() ) {
			return true;
		}
		if ( isset( $_GET['preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return true;
		}
		if ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() ) {
			return true;
		}

		$uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$uri = is_string( $uri ) ? $uri : '';

		$excluded_prefixes = array(
			'/wp-admin/',
			'/wp-login.php',
			'/wp-json/',
			'/wp-cron.php',
			'/xmlrpc.php',
			'/feed/',
			'/comments/feed/',
		);
		foreach ( $excluded_prefixes as $prefix ) {
			if ( 0 === strpos( $uri, $prefix ) ) {
				return true;
			}
		}

		$excluded_exact_suffixes = array(
			'sitemap.xml',
			'sitemap_index.xml',
			'wp-sitemap.xml',
		);
		foreach ( $excluded_exact_suffixes as $suffix ) {
			if ( $uri === '/' . $suffix || substr( $uri, -strlen( '/' . $suffix ) ) === '/' . $suffix ) {
				return true;
			}
		}

		if ( 0 === strpos( $uri, '/admin-ajax.php' ) || 0 === strpos( $uri, '/admin-post.php' ) ) {
			return true;
		}

		return false;
	}

	private static function route_allowed_for_scope( $path, $scope ) {
		if ( Gcalls_React_Shell_Settings::SCOPE_DISABLED === $scope ) {
			return false;
		}
		if ( Gcalls_React_Shell_Settings::SCOPE_HOMEPAGE === $scope ) {
			return '/' === $path;
		}
		if ( Gcalls_React_Shell_Settings::SCOPE_ALL === $scope ) {
			return true;
		}
		return false;
	}

	public static function maybe_serve_shell() {
		$scope = Gcalls_React_Shell_Settings::get_scope();
		if ( Gcalls_React_Shell_Settings::SCOPE_DISABLED === $scope ) {
			return;
		}

		if ( self::is_excluded_request() ) {
			return;
		}

		$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$path = self::normalize_path( is_string( $uri ) ? $uri : '/' );

		$routes = self::get_routes();
		if ( ! isset( $routes[ $path ] ) ) {
			return;
		}

		if ( ! self::route_allowed_for_scope( $path, $scope ) ) {
			return;
		}

		self::render_shell( $path, $routes[ $path ] );
		exit;
	}

	private static function render_shell( $path, $route_key ) {
		status_header( 200 );
		nocache_headers();

		$manifest = self::read_manifest();

		$config = array(
			'siteUrl'    => home_url( '/' ),
			'restUrl'    => esc_url_raw( rest_url() ),
			'restNonce'  => wp_create_nonce( 'wp_rest' ),
			'assetsUrl'  => GCALLS_REACT_SHELL_URL . 'dist/',
			'routeKey'   => $route_key,
			'routePath'  => $path,
			'pluginVersion' => GCALLS_REACT_SHELL_VERSION,
		);

		include GCALLS_REACT_SHELL_DIR . 'templates/react-shell.php';
	}

	/**
	 * Reads the Vite manifest, so entry/chunk URLs are never hand-guessed.
	 *
	 * @return array{entry:?string, css:string[]}
	 */
	private static function read_manifest() {
		$manifest_path = GCALLS_REACT_SHELL_DIR . 'dist/.vite/manifest.json';
		if ( ! file_exists( $manifest_path ) ) {
			$manifest_path = GCALLS_REACT_SHELL_DIR . 'dist/manifest.json';
		}
		if ( ! file_exists( $manifest_path ) ) {
			return array( 'entry' => null, 'css' => array() );
		}

		$raw  = file_get_contents( $manifest_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$data = json_decode( $raw, true );
		if ( ! is_array( $data ) ) {
			return array( 'entry' => null, 'css' => array() );
		}

		foreach ( $data as $entry ) {
			if ( ! empty( $entry['isEntry'] ) ) {
				return array(
					'entry' => $entry['file'] ?? null,
					'css'   => $entry['css'] ?? array(),
				);
			}
		}

		return array( 'entry' => null, 'css' => array() );
	}
}
