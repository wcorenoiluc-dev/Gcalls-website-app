<?php
/**
 * Stable integration contract for other plugins (Gcalls Content Studio,
 * chiefly). Plain functions, not a class, so a caller can probe for them
 * with `function_exists()` alone — no `class_exists()` plus method-exists
 * dance, and no risk of a class name collision mattering to the contract.
 *
 * Every function here degrades safely when the plugin build is missing or
 * broken: `gcalls_react_shell_version()` still returns the version even
 * with a missing dist/, and `gcalls_react_shell_has_valid_build()` is the
 * one callers must check before trying to render anything.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'gcalls_react_shell_version' ) ) {
	/** @return string|false The active plugin version, or false if this plugin isn't loaded. */
	function gcalls_react_shell_version() {
		return defined( 'GCALLS_REACT_SHELL_VERSION' ) ? GCALLS_REACT_SHELL_VERSION : false;
	}
}

if ( ! function_exists( 'gcalls_react_shell_manifest' ) ) {
	/** @return array{entry:?string, css:string[]} */
	function gcalls_react_shell_manifest() {
		return class_exists( 'Gcalls_React_Shell' ) ? Gcalls_React_Shell::get_manifest() : array( 'entry' => null, 'css' => array() );
	}
}

if ( ! function_exists( 'gcalls_react_shell_has_valid_build' ) ) {
	/** @return bool Whether the manifest resolves to a build entry file that actually exists on disk. */
	function gcalls_react_shell_has_valid_build() {
		return class_exists( 'Gcalls_React_Shell' ) && Gcalls_React_Shell::has_valid_build();
	}
}

if ( ! function_exists( 'gcalls_react_shell_asset_url' ) ) {
	/** @param string $relative Path relative to the plugin's vendored dist/ directory. */
	function gcalls_react_shell_asset_url( $relative = '' ) {
		if ( ! defined( 'GCALLS_REACT_SHELL_URL' ) ) {
			return '';
		}
		return GCALLS_REACT_SHELL_URL . 'dist/' . ltrim( (string) $relative, '/' );
	}
}

if ( ! function_exists( 'gcalls_react_shell_routes' ) ) {
	/** @return array<string, string> route key => path, e.g. 'home' => '/'. */
	function gcalls_react_shell_routes() {
		return class_exists( 'Gcalls_React_Shell' ) ? Gcalls_React_Shell::get_routes_by_key() : array();
	}
}

if ( ! function_exists( 'gcalls_react_shell_render_root' ) ) {
	/**
	 * Renders the exact same document the public site serves for a route —
	 * same manifest, same template, same asset URLs — as an HTML string.
	 * Callers own their own HTTP headers and exit(); this never sends
	 * either, so it is safe to call from inside another plugin's own
	 * request (e.g. a same-origin preview endpoint).
	 *
	 * @param string               $route_key    A key from `gcalls_react_shell_routes()`.
	 * @param array<string, mixed> $extra_config Merged into `window.__GCALLS_SHELL_CONFIG__`.
	 * @return string|false HTML, or false if the plugin/build isn't available or the route key is unknown.
	 */
	function gcalls_react_shell_render_root( $route_key, array $extra_config = array() ) {
		if ( ! class_exists( 'Gcalls_React_Shell' ) || ! gcalls_react_shell_has_valid_build() ) {
			return false;
		}
		$routes = Gcalls_React_Shell::get_routes_by_key();
		if ( ! isset( $routes[ $route_key ] ) ) {
			return false;
		}
		return Gcalls_React_Shell::render_root_html( $routes[ $route_key ], $route_key, $extra_config );
	}
}
