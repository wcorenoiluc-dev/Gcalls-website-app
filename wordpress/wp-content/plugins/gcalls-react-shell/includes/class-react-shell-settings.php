<?php
/**
 * Settings: scope of routes the shell is allowed to take over.
 *
 * Stored as a single option so activation, deactivation and uninstall each
 * touch one known key. Nothing here writes to any other plugin's data.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Gcalls_React_Shell_Settings {

	const OPTION_KEY = 'gcalls_react_shell_scope';

	const SCOPE_DISABLED = 'disabled';
	const SCOPE_HOMEPAGE = 'homepage_only';
	const SCOPE_ALL      = 'all_marketing_routes';

	/** Activation must never change what a visitor sees. */
	public static function on_activate() {
		if ( false === get_option( self::OPTION_KEY, false ) ) {
			add_option( self::OPTION_KEY, self::SCOPE_DISABLED );
		}
	}

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_settings_page' ) );
		add_action( 'admin_init', array( __CLASS__, 'register_setting' ) );
	}

	public static function get_scope() {
		$scope = get_option( self::OPTION_KEY, self::SCOPE_DISABLED );
		if ( ! in_array( $scope, array( self::SCOPE_DISABLED, self::SCOPE_HOMEPAGE, self::SCOPE_ALL ), true ) ) {
			return self::SCOPE_DISABLED;
		}
		return $scope;
	}

	public static function register_settings_page() {
		add_options_page(
			__( 'Gcalls React Shell', 'gcalls-react-shell' ),
			__( 'Gcalls React Shell', 'gcalls-react-shell' ),
			'manage_options',
			'gcalls-react-shell',
			array( __CLASS__, 'render_settings_page' )
		);
	}

	public static function register_setting() {
		register_setting(
			'gcalls_react_shell',
			self::OPTION_KEY,
			array(
				'type'              => 'string',
				'sanitize_callback' => array( __CLASS__, 'sanitize_scope' ),
				'default'           => self::SCOPE_DISABLED,
			)
		);
	}

	public static function sanitize_scope( $value ) {
		$allowed = array( self::SCOPE_DISABLED, self::SCOPE_HOMEPAGE, self::SCOPE_ALL );
		return in_array( $value, $allowed, true ) ? $value : self::SCOPE_DISABLED;
	}

	public static function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$scope = self::get_scope();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Gcalls React Shell', 'gcalls-react-shell' ); ?></h1>
			<p><?php esc_html_e( 'Serves the built React site for an explicit route allowlist. Disabling this (or setting scope to Disabled) restores normal WordPress rendering immediately.', 'gcalls-react-shell' ); ?></p>
			<form method="post" action="options.php">
				<?php settings_fields( 'gcalls_react_shell' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Scope', 'gcalls-react-shell' ); ?></th>
						<td>
							<label>
								<input type="radio" name="<?php echo esc_attr( self::OPTION_KEY ); ?>" value="<?php echo esc_attr( self::SCOPE_DISABLED ); ?>" <?php checked( $scope, self::SCOPE_DISABLED ); ?> />
								<?php esc_html_e( 'Disabled — normal WordPress rendering for every route', 'gcalls-react-shell' ); ?>
							</label><br />
							<label>
								<input type="radio" name="<?php echo esc_attr( self::OPTION_KEY ); ?>" value="<?php echo esc_attr( self::SCOPE_HOMEPAGE ); ?>" <?php checked( $scope, self::SCOPE_HOMEPAGE ); ?> />
								<?php esc_html_e( 'Homepage only', 'gcalls-react-shell' ); ?>
							</label><br />
							<label>
								<input type="radio" name="<?php echo esc_attr( self::OPTION_KEY ); ?>" value="<?php echo esc_attr( self::SCOPE_ALL ); ?>" <?php checked( $scope, self::SCOPE_ALL ); ?> />
								<?php esc_html_e( 'All 38 marketing routes', 'gcalls-react-shell' ); ?>
							</label>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
