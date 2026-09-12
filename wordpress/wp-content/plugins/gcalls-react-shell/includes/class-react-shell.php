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

	/**
	 * Set the moment `render_root_html()` is about to call `wp_head()` for a
	 * route this plugin is serving — the signal `dequeue_theme_styles()`
	 * checks, since by the time `wp_enqueue_scripts` fires (WordPress hooks
	 * it to `wp_head` at priority 1) the route/scope decision has already
	 * been made and should not be re-derived.
	 */
	private static $serving_shell = false;

	public static function init() {
		add_action( 'template_redirect', array( __CLASS__, 'maybe_serve_shell' ), 0 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'dequeue_theme_styles' ), 20 );
	}

	/**
	 * React Shell renders its own header/footer/typography entirely and
	 * depends on none of gcalls-theme's front-end CSS. That CSS's bare
	 * `a { color }` / `a:hover` / `a:focus` rules (theme.css) are NOT inside
	 * any `@layer`, so per the CSS Cascade Layers spec they beat every
	 * Tailwind utility class (Tailwind's own output lives in `@layer
	 * utilities`) regardless of selector specificity or stylesheet order —
	 * which is why an `<a>` styled with Tailwind's `text-white` rendered in
	 * the theme's brand-purple link color instead. Reordering or adding
	 * higher-specificity Tailwind classes cannot win that fight; the only
	 * fixes are an equally-unlayered override (see buttons.css) or removing
	 * the competing rule from pages that do not need it. Both are applied:
	 * this dequeues the handle, buttons.css is the defence in depth.
	 */
	public static function dequeue_theme_styles() {
		if ( ! self::$serving_shell ) {
			return;
		}
		foreach ( array( 'gcalls-theme', 'gcalls-components' ) as $handle ) {
			wp_dequeue_style( $handle );
			wp_deregister_style( $handle );
		}
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

		status_header( 200 );
		nocache_headers();
		echo self::render_root_html( $path, $routes[ $path ] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_root_html() escapes every dynamic value itself; this is its own finished document.
		exit;
	}

	/**
	 * Renders the same document `maybe_serve_shell()` serves on the public
	 * site, as a string rather than direct output — the integration point
	 * other plugins (Content Studio's preview) call into, via
	 * `gcalls_react_shell_render_root()`, so preview and production always
	 * run the exact same template against the exact same build.
	 *
	 * @param array<string, mixed> $extra_config Merged into the `window.__GCALLS_SHELL_CONFIG__`
	 *   object after the standard keys — used by Content Studio to add a
	 *   `previewMode`/content payload without this plugin knowing anything
	 *   about drafts or sections.
	 */
	public static function render_root_html( $path, $route_key, array $extra_config = array() ) {
		$manifest = self::get_manifest();

		/**
		 * Filters the extra keys merged into `window.__GCALLS_SHELL_CONFIG__`.
		 * Lets another plugin (Content Studio) contribute content for a
		 * route without this plugin knowing anything about drafts, sections
		 * or capabilities — this plugin owns rendering the build; it never
		 * owns what content a filter callback decides to attach.
		 *
		 * @param array<string, mixed> $extra_config
		 * @param string               $route_key
		 * @param string               $path
		 */
		$extra_config = apply_filters( 'gcalls_react_shell_config', $extra_config, $route_key, $path );

		$config = array_merge(
			array(
				'siteUrl'       => home_url( '/' ),
				'restUrl'       => esc_url_raw( rest_url() ),
				'restNonce'     => wp_create_nonce( 'wp_rest' ),
				'assetsUrl'     => GCALLS_REACT_SHELL_URL . 'dist/',
				'routeKey'      => $route_key,
				'routePath'     => $path,
				'pluginVersion' => GCALLS_REACT_SHELL_VERSION,
			),
			$extra_config
		);

		self::$serving_shell = true;
		ob_start();
		include GCALLS_REACT_SHELL_DIR . 'templates/react-shell.php';
		return ob_get_clean();
	}

	/**
	 * Reads the Vite manifest, so entry/chunk URLs are never hand-guessed.
	 * Public: this is the `gcalls_react_shell_manifest()` integration point.
	 *
	 * @return array{entry:?string, css:string[]}
	 */
	public static function get_manifest() {
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

	/**
	 * True when the manifest points at a real, existing built entry file —
	 * the "assets are missing / manifest cannot be read" check other
	 * plugins should make before trying to embed this shell.
	 */
	public static function has_valid_build() {
		$manifest = self::get_manifest();
		if ( empty( $manifest['entry'] ) ) {
			return false;
		}
		return file_exists( GCALLS_REACT_SHELL_DIR . 'dist/' . $manifest['entry'] );
	}

	/** Public accessor for the route allowlist — `key => path`, not `path => key`, since callers think in route keys. */
	public static function get_routes_by_key() {
		$by_key = array();
		foreach ( self::get_routes() as $path => $key ) {
			$by_key[ $key ] = $path;
		}
		return $by_key;
	}
}
