<?php
/**
 * Plugin Name: Gcalls React Shell
 * Description: Serves the built React marketing site for an explicit allowlist of routes, entirely separate from gcalls-core. Disabled by default; safe to activate.
 * Version: 0.3.2
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: Gcalls
 * License: GPL-2.0-or-later
 * Text Domain: gcalls-react-shell
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GCALLS_REACT_SHELL_VERSION', '0.3.2' );
define( 'GCALLS_REACT_SHELL_FILE', __FILE__ );
define( 'GCALLS_REACT_SHELL_DIR', plugin_dir_path( __FILE__ ) );
define( 'GCALLS_REACT_SHELL_URL', plugin_dir_url( __FILE__ ) );

require_once GCALLS_REACT_SHELL_DIR . 'includes/class-react-shell-settings.php';
require_once GCALLS_REACT_SHELL_DIR . 'includes/class-react-shell.php';
require_once GCALLS_REACT_SHELL_DIR . 'includes/functions-integration.php';

register_activation_hook( __FILE__, array( 'Gcalls_React_Shell_Settings', 'on_activate' ) );

add_action(
	'plugins_loaded',
	function () {
		Gcalls_React_Shell_Settings::init();
		Gcalls_React_Shell::init();
	}
);
