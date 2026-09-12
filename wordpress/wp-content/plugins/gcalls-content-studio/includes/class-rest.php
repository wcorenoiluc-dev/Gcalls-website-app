<?php
/**
 * REST surface under /wp-json/gcalls/v1/. Every write endpoint re-checks
 * capability and nonce itself — it does not rely on the client having
 * already hidden the button, which is the "not solely client-side
 * permission checks" requirement.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Rest {

	private Store $store;

	public function __construct() {
		$this->store = new Store();
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes(): void {
		$route_param = array(
			'route' => array(
				'required'          => true,
				'validate_callback' => static fn( $value ) => Schema::route_exists( (string) $value ),
			),
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content',
			array(
				'methods'             => 'GET',
				'permission_callback' => array( $this, 'require_edit' ),
				'callback'            => array( $this, 'list_content' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)',
			array(
				'methods'             => 'GET',
				'permission_callback' => '__return_true', // Public: published content only, never draft.
				'args'                => $route_param,
				'callback'            => array( $this, 'get_content' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)/draft',
			array(
				'methods'             => 'POST',
				'permission_callback' => array( $this, 'require_edit' ),
				'args'                => $route_param,
				'callback'            => array( $this, 'save_draft' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)/publish',
			array(
				'methods'             => 'POST',
				'permission_callback' => array( $this, 'require_publish' ),
				'args'                => $route_param,
				'callback'            => array( $this, 'publish' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)/restore-defaults',
			array(
				'methods'             => 'POST',
				'permission_callback' => array( $this, 'require_publish' ),
				'args'                => $route_param,
				'callback'            => array( $this, 'restore_defaults' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)/revisions',
			array(
				'methods'             => 'GET',
				'permission_callback' => array( $this, 'require_edit' ),
				'args'                => $route_param,
				'callback'            => array( $this, 'revisions' ),
			)
		);

		register_rest_route(
			REST_NAMESPACE,
			'/content/(?P<route>[a-z0-9-]+)/restore/(?P<revision>\d+)',
			array(
				'methods'             => 'POST',
				'permission_callback' => array( $this, 'require_publish' ),
				'args'                => $route_param,
				'callback'            => array( $this, 'restore' ),
			)
		);
	}

	// ── Permission callbacks ────────────────────────────────────────────

	private function verified_nonce( \WP_REST_Request $request ): bool {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		return is_string( $nonce ) && false !== wp_verify_nonce( $nonce, 'wp_rest' );
	}

	public function require_edit( \WP_REST_Request $request ) {
		if ( ! is_user_logged_in() ) {
			return new \WP_Error( 'gcalls_cs_unauthorized', 'Login required.', array( 'status' => 401 ) );
		}
		if ( ! $this->verified_nonce( $request ) ) {
			return new \WP_Error( 'gcalls_cs_bad_nonce', 'Invalid or missing nonce.', array( 'status' => 403 ) );
		}
		if ( ! Capabilities::can_edit() ) {
			return new \WP_Error( 'gcalls_cs_forbidden', 'Missing edit_gcalls_content capability.', array( 'status' => 403 ) );
		}
		return true;
	}

	public function require_publish( \WP_REST_Request $request ) {
		$edit_check = $this->require_edit( $request );
		if ( true !== $edit_check ) {
			return $edit_check;
		}
		if ( ! Capabilities::can_publish() ) {
			return new \WP_Error( 'gcalls_cs_forbidden', 'Missing publish_gcalls_content capability.', array( 'status' => 403 ) );
		}
		return true;
	}

	// ── Callbacks ────────────────────────────────────────────────────────

	public function list_content(): \WP_REST_Response {
		$out = array();
		foreach ( array_keys( Schema::routes() ) as $route ) {
			$out[] = array_merge( array( 'route' => $route ), $this->store->meta( $route ) );
		}
		return new \WP_REST_Response( $out, 200 );
	}

	public function get_content( \WP_REST_Request $request ): \WP_REST_Response {
		$route     = (string) $request->get_param( 'route' );
		$published = $this->store->published( $route );

		$payload = array(
			'route'         => $route,
			'schemaVersion' => SCHEMA_VERSION,
			'sections'      => $published['sections'] ?? array(),
		);

		// Editors loading their own working screen additionally get the
		// unpublished draft and record metadata — gated by the same
		// nonce+capability check as every write endpoint, never by the
		// unauthenticated default path above.
		if ( 'edit' === $request->get_param( 'context' ) && true === $this->require_edit( $request ) ) {
			$draft              = $this->store->draft( $route );
			$payload['draft']   = $draft['sections'] ?? null;
			$payload['meta']    = $this->store->meta( $route );
		}

		return $this->no_cache_no_index( new \WP_REST_Response( $payload, 200 ) );
	}

	public function save_draft( \WP_REST_Request $request ) {
		$route   = (string) $request->get_param( 'route' );
		$body    = $request->get_json_params();
		$section = isset( $body['section'] ) ? sanitize_key( (string) $body['section'] ) : '';
		$fields  = is_array( $body['fields'] ?? null ) ? $body['fields'] : array();

		if ( ! Schema::section_exists( $route, $section ) ) {
			return new \WP_Error( 'gcalls_cs_unknown_section', 'Unknown route/section.', array( 'status' => 400 ) );
		}

		[$clean, $errors] = Schema::sanitize( $route, $section, $fields );
		// Draft saves tolerate "required" gaps (the editor is mid-edit) but
		// never tolerate a rejected URL scheme or an oversized field.
		$hard_errors = array_values(
			array_filter(
				$errors,
				static fn( string $e ) => ! str_starts_with( $e, 'required:' ) && ! str_starts_with( $e, 'missing:' )
			)
		);
		if ( ! empty( $hard_errors ) ) {
			return new \WP_Error( 'gcalls_cs_validation', 'Validation failed.', array( 'status' => 422, 'errors' => $hard_errors ) );
		}

		$this->store->save_draft( $route, $section, $clean, get_current_user_id() );
		return new \WP_REST_Response( array( 'saved' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	public function publish( \WP_REST_Request $request ) {
		$route            = (string) $request->get_param( 'route' );
		[$ok, $errors]    = $this->store->publish( $route, get_current_user_id() );
		if ( ! $ok ) {
			return new \WP_Error( 'gcalls_cs_publish_failed', 'Cannot publish.', array( 'status' => 422, 'errors' => $errors ) );
		}
		return new \WP_REST_Response( array( 'published' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	public function restore_defaults( \WP_REST_Request $request ) {
		$route   = (string) $request->get_param( 'route' );
		$body    = $request->get_json_params();
		$section = isset( $body['section'] ) ? sanitize_key( (string) $body['section'] ) : '';
		if ( ! Schema::section_exists( $route, $section ) ) {
			return new \WP_Error( 'gcalls_cs_unknown_section', 'Unknown route/section.', array( 'status' => 400 ) );
		}
		$this->store->restore_defaults( $route, $section, get_current_user_id() );
		return new \WP_REST_Response( array( 'restored' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	public function revisions( \WP_REST_Request $request ): \WP_REST_Response {
		$route = (string) $request->get_param( 'route' );
		return new \WP_REST_Response( $this->store->revisions( $route ), 200 );
	}

	public function restore( \WP_REST_Request $request ) {
		$route       = (string) $request->get_param( 'route' );
		$revision_id = absint( $request->get_param( 'revision' ) );
		$ok          = $this->store->restore_revision( $route, $revision_id, get_current_user_id() );
		if ( ! $ok ) {
			return new \WP_Error( 'gcalls_cs_restore_failed', 'Revision does not belong to this route.', array( 'status' => 400 ) );
		}
		return new \WP_REST_Response( array( 'restored' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	private function no_cache_no_index( \WP_REST_Response $response ): \WP_REST_Response {
		$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
		$response->header( 'X-Robots-Tag', 'noindex, nofollow' );
		return $response;
	}
}
