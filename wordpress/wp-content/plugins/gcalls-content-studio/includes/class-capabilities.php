<?php
/**
 * Three dedicated capabilities. Every permission check in this plugin — REST,
 * admin menu, preview, settings — goes through current_user_can() against
 * these, never through a role-name comparison, so a site owner can re-grant
 * them to a different role without touching code.
 *
 * Pilot defaults: administrator gets all three; editor may edit drafts but
 * not publish; every other role has no access.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Capabilities {

	public function __construct() {
		add_action( 'admin_init', array( $this, 'grant_default_roles' ) );
	}

	public function grant_default_roles(): void {
		$administrator = get_role( 'administrator' );
		if ( $administrator ) {
			foreach ( array( CAP_EDIT, CAP_PUBLISH, CAP_MANAGE ) as $cap ) {
				if ( ! $administrator->has_cap( $cap ) ) {
					$administrator->add_cap( $cap );
				}
			}
		}

		$editor = get_role( 'editor' );
		if ( $editor ) {
			if ( ! $editor->has_cap( CAP_EDIT ) ) {
				$editor->add_cap( CAP_EDIT );
			}
			// Pilot: editors do not publish. A 0.1.0 install granted this;
			// revoke it so the pilot policy holds on upgraded sites too.
			if ( $editor->has_cap( CAP_PUBLISH ) ) {
				$editor->remove_cap( CAP_PUBLISH );
			}
			if ( $editor->has_cap( CAP_MANAGE ) ) {
				$editor->remove_cap( CAP_MANAGE );
			}
		}
	}

	public static function can_edit(): bool {
		return current_user_can( CAP_EDIT );
	}

	public static function can_publish(): bool {
		return current_user_can( CAP_PUBLISH );
	}

	public static function can_manage(): bool {
		return current_user_can( CAP_MANAGE );
	}
}
