<?php
/**
 * Two dedicated capabilities, granted to administrator and editor on
 * activation. Every permission check in this plugin — REST, admin menu,
 * preview — goes through current_user_can() against these, never through a
 * role-name string comparison, so a site owner can later re-grant them to a
 * different role without touching code.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Capabilities {

	public function __construct() {
		// Re-grant on every plugin update too, in case a site owner runs an
		// older DB dump forward — cheap idempotent calls, no-op if present.
		add_action( 'admin_init', array( $this, 'grant_default_roles' ) );
	}

	public function grant_default_roles(): void {
		$administrator = get_role( 'administrator' );
		if ( $administrator && ! $administrator->has_cap( CAP_EDIT ) ) {
			$administrator->add_cap( CAP_EDIT );
			$administrator->add_cap( CAP_PUBLISH );
		}

		$editor = get_role( 'editor' );
		if ( $editor && ! $editor->has_cap( CAP_EDIT ) ) {
			$editor->add_cap( CAP_EDIT );
			$editor->add_cap( CAP_PUBLISH );
		}
		// Every other role: no access by default. Nothing to do — WordPress
		// roles start without these capabilities.
	}

	public static function can_edit(): bool {
		return current_user_can( CAP_EDIT );
	}

	public static function can_publish(): bool {
		return current_user_can( CAP_PUBLISH );
	}
}
