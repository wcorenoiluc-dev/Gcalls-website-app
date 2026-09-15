<?php
/**
 * REST surface under /wp-json/gcalls/v1/ (contract §5).
 *
 * Every write endpoint re-checks login, nonce, capability, route/section
 * allowlist (from the manifest) and schema itself — it never relies on the
 * client having hidden a button. Errors carry the exact status/code the
 * contract names so the admin can react (409 conflict, 422 validation…).
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
		$route_arg = array(
			'route' => array(
				'required'          => true,
				'validate_callback' => static fn( $value ) => is_string( $value ) && Manifest::route_exists( $value ),
			),
		);
		$route_rev_args = $route_arg + array(
			'revision' => array(
				'required'          => true,
				'validate_callback' => static fn( $value ) => is_numeric( $value ) && (int) $value > 0,
			),
		);
		$r = '(?P<route>[a-zA-Z0-9_-]+)';

		$routes = array(
			array( 'GET', '/manifest', 'require_edit', 'get_manifest', array() ),
			array( 'GET', '/content', 'require_edit', 'list_content', array() ),
			array( 'GET', "/content/{$r}", '__return_true', 'get_content', $route_arg ),
			array( 'POST', "/content/{$r}/draft", 'require_edit', 'save_draft', $route_arg ),
			array( 'POST', "/content/{$r}/publish", 'require_publish', 'publish', $route_arg ),
			array( 'POST', "/content/{$r}/discard-draft", 'require_edit', 'discard_draft', $route_arg ),
			array( 'POST', "/content/{$r}/restore-defaults", 'require_publish', 'restore_defaults', $route_arg ),
			array( 'GET', "/content/{$r}/revisions", 'require_edit', 'revisions', $route_arg ),
			array( 'GET', "/content/{$r}/revisions/(?P<revision>\d+)", 'require_edit', 'get_revision', $route_rev_args ),
			array( 'POST', "/content/{$r}/restore/(?P<revision>\d+)", 'require_publish', 'restore', $route_rev_args ),
			array( 'GET', "/content/{$r}/seo", 'require_edit', 'get_seo', $route_arg ),
			array( 'POST', "/content/{$r}/seo", 'require_edit', 'save_seo', $route_arg ),
			array( 'GET', '/media/check', 'require_edit', 'media_check', array() ),
			array( 'GET', '/audit', 'require_edit', 'audit', array() ),
		);

		foreach ( $routes as [ $method, $path, $permission, $callback, $args ] ) {
			register_rest_route(
				REST_NAMESPACE,
				$path,
				array(
					'methods'             => $method,
					'permission_callback' => '__return_true' === $permission ? '__return_true' : array( $this, $permission ),
					'args'                => $args,
					'callback'            => array( $this, $callback ),
				)
			);
		}
	}

	// ── Permission callbacks ────────────────────────────────────────────

	private function verified_nonce( \WP_REST_Request $request ): bool {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		return is_string( $nonce ) && false !== wp_verify_nonce( $nonce, 'wp_rest' );
	}

	/** @return true|\WP_Error */
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

	/** @return true|\WP_Error */
	public function require_publish( \WP_REST_Request $request ) {
		$edit = $this->require_edit( $request );
		if ( true !== $edit ) {
			return $edit;
		}
		if ( ! Capabilities::can_publish() ) {
			return new \WP_Error( 'gcalls_cs_forbidden', 'Missing publish_gcalls_content capability.', array( 'status' => 403 ) );
		}
		return true;
	}

	// ── Helpers ─────────────────────────────────────────────────────────

	private function editable_or_error( string $route ): ?\WP_Error {
		if ( ! Manifest::route_editable( $route ) ) {
			return new \WP_Error( 'gcalls_cs_read_only', 'This page is read-only (Đang kiểm tra giao diện).', array( 'status' => 403 ) );
		}
		return null;
	}

	private function base_version( \WP_REST_Request $request ): ?int {
		$body = $request->get_json_params();
		if ( is_array( $body ) && array_key_exists( 'baseVersion', $body ) && is_numeric( $body['baseVersion'] ) ) {
			return (int) $body['baseVersion'];
		}
		$param = $request->get_param( 'baseVersion' );
		return is_numeric( $param ) ? (int) $param : null;
	}

	private function conflict( string $route ): \WP_Error {
		return new \WP_Error(
			'gcalls_cs_conflict',
			'Someone else updated this page. Reload to get the latest version.',
			array(
				'status' => 409,
				'meta'   => $this->store->meta( $route ),
			)
		);
	}

	/** @param array<int, string> $errors */
	private function validation( array $errors, string $message = 'Validation failed.' ): \WP_Error {
		return new \WP_Error( 'gcalls_cs_validation', $message, array( 'status' => 422, 'errors' => array_values( $errors ) ) );
	}

	private function no_cache_no_index( \WP_REST_Response $response ): \WP_REST_Response {
		$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
		$response->header( 'X-Robots-Tag', 'noindex, nofollow' );
		return $response;
	}

	// ── Callbacks ────────────────────────────────────────────────────────

	public function get_manifest(): \WP_REST_Response {
		return $this->no_cache_no_index( new \WP_REST_Response( Manifest::raw(), 200 ) );
	}

	public function list_content(): \WP_REST_Response {
		$out = array();
		foreach ( Manifest::pages() as $route => $page ) {
			$meta  = $this->store->meta( $route );
			$out[] = array(
				'route'             => $route,
				'path'              => (string) ( $page['path'] ?? '' ),
				'label'             => (string) ( $page['label'] ?? $route ),
				'status'            => (string) ( $page['status'] ?? 'review' ),
				'hasDraft'          => (bool) $meta['hasDraft'],
				'version'           => (int) $meta['version'],
				'updatedAt'         => $meta['updatedAt'],
				'updatedBy'         => $meta['updatedBy'],
				'publishedAt'       => $meta['publishedAt'],
				'publishedBy'       => $meta['publishedBy'],
				'publishedRevision' => (int) $meta['publishedRevision'],
			);
		}
		return $this->no_cache_no_index( new \WP_REST_Response( $out, 200 ) );
	}

	public function get_content( \WP_REST_Request $request ): \WP_REST_Response {
		$route     = (string) $request->get_param( 'route' );
		$published = $this->store->published( $route );
		$meta      = $this->store->meta( $route );

		$payload = array(
			'route'         => $route,
			'schemaVersion' => SCHEMA_VERSION,
			'version'       => (int) $meta['version'],
			'sections'      => $published['sections'],
		);

		// Editors loading their working screen additionally get the draft,
		// meta and SEO — gated by the same nonce+capability check as every
		// write, never by the unauthenticated default path.
		if ( 'edit' === $request->get_param( 'context' ) && true === $this->require_edit( $request ) ) {
			$draft            = $this->store->draft( $route );
			$payload['draft'] = $draft['sections'] ?? null;
			$payload['meta']  = $meta;
			$payload['seo']   = ( new Seo() )->get( $route );
		}

		return $this->no_cache_no_index( new \WP_REST_Response( $payload, 200 ) );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function save_draft( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		$body    = $request->get_json_params();
		$section = isset( $body['section'] ) ? sanitize_content_key( (string) $body['section'] ) : '';
		$fields  = is_array( $body['fields'] ?? null ) ? $body['fields'] : array();

		if ( ! Manifest::section_exists( $route, $section ) ) {
			return new \WP_Error( 'gcalls_cs_unknown_section', 'Unknown route/section.', array( 'status' => 400 ) );
		}

		[ $clean, $errors ] = Schema::sanitize( $route, $section, $fields );
		// Draft saves tolerate "required" gaps (the editor is mid-edit) but
		// never a rejected URL, blocked media, invalid option or oversize.
		$hard = array_values(
			array_filter(
				$errors,
				static fn( string $e ) => ! str_starts_with( $e, 'required:' ) && ! str_starts_with( $e, 'missing:' )
			)
		);
		if ( ! empty( $hard ) ) {
			return $this->validation( $hard );
		}

		[ $ok, $store_errors ] = $this->store->save_draft( $route, $section, $clean, get_current_user_id(), $this->base_version( $request ) );
		if ( ! $ok ) {
			return in_array( Store::ERR_CONFLICT, $store_errors, true ) ? $this->conflict( $route ) : $this->validation( $store_errors, 'Cannot save draft.' );
		}
		return new \WP_REST_Response( array( 'saved' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function publish( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		[ $ok, $errors ] = $this->store->publish( $route, get_current_user_id(), $this->base_version( $request ) );
		if ( ! $ok ) {
			if ( in_array( Store::ERR_CONFLICT, $errors, true ) ) {
				return $this->conflict( $route );
			}
			return new \WP_Error( 'gcalls_cs_publish_failed', 'Cannot publish.', array( 'status' => 422, 'errors' => array_values( $errors ) ) );
		}
		return new \WP_REST_Response(
			array(
				'published' => true,
				'meta'      => $this->store->meta( $route ),
				'publicUrl' => Cache::public_url( $route ),
			),
			200
		);
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function discard_draft( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		$this->store->discard_draft( $route, get_current_user_id() );
		return new \WP_REST_Response( array( 'discarded' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function restore_defaults( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		$body    = $request->get_json_params();
		$section = isset( $body['section'] ) ? sanitize_content_key( (string) $body['section'] ) : '';
		if ( ! Manifest::section_exists( $route, $section ) ) {
			return new \WP_Error( 'gcalls_cs_unknown_section', 'Unknown route/section.', array( 'status' => 400 ) );
		}
		$this->store->restore_defaults( $route, $section, get_current_user_id() );
		return new \WP_REST_Response( array( 'restored' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	public function revisions( \WP_REST_Request $request ): \WP_REST_Response {
		$route = (string) $request->get_param( 'route' );
		return $this->no_cache_no_index( new \WP_REST_Response( $this->store->revisions( $route ), 200 ) );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function get_revision( \WP_REST_Request $request ) {
		$route    = (string) $request->get_param( 'route' );
		$revision = $this->store->revision( $route, absint( $request->get_param( 'revision' ) ) );
		if ( null === $revision ) {
			return new \WP_Error( 'gcalls_cs_not_found', 'Revision does not belong to this route.', array( 'status' => 404 ) );
		}
		return $this->no_cache_no_index( new \WP_REST_Response( $revision, 200 ) );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function restore( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		[ $ok, $errors ] = $this->store->restore_revision( $route, absint( $request->get_param( 'revision' ) ), get_current_user_id(), $this->base_version( $request ) );
		if ( ! $ok ) {
			if ( in_array( Store::ERR_CONFLICT, $errors, true ) ) {
				return $this->conflict( $route );
			}
			return new \WP_Error( 'gcalls_cs_restore_failed', 'Revision does not belong to this route.', array( 'status' => 400, 'errors' => $errors ) );
		}
		return new \WP_REST_Response( array( 'restored' => true, 'meta' => $this->store->meta( $route ) ), 200 );
	}

	public function get_seo( \WP_REST_Request $request ): \WP_REST_Response {
		$route = (string) $request->get_param( 'route' );
		return $this->no_cache_no_index( new \WP_REST_Response( ( new Seo() )->get( $route ), 200 ) );
	}

	/** @return \WP_REST_Response|\WP_Error */
	public function save_seo( \WP_REST_Request $request ) {
		$route = (string) $request->get_param( 'route' );
		if ( $err = $this->editable_or_error( $route ) ) {
			return $err;
		}
		$body = $request->get_json_params();
		[ $ok, $errors ] = ( new Seo() )->save( $route, is_array( $body ) ? $body : array(), get_current_user_id() );
		if ( ! $ok ) {
			if ( in_array( 'forbidden:noindex', $errors, true ) ) {
				return new \WP_Error( 'gcalls_cs_forbidden', 'Only a content manager may change index/noindex.', array( 'status' => 403 ) );
			}
			return $this->validation( $errors );
		}
		return new \WP_REST_Response( array( 'saved' => true, 'seo' => ( new Seo() )->get( $route ) ), 200 );
	}

	public function media_check( \WP_REST_Request $request ): \WP_REST_Response {
		$ids = array_filter( array_map( 'absint', explode( ',', (string) $request->get_param( 'ids' ) ) ) );
		$out = array();
		foreach ( array_slice( array_unique( $ids ), 0, 100 ) as $id ) {
			$is_attachment = 'attachment' === get_post_type( $id ) && wp_attachment_is_image( $id );
			$filename      = $is_attachment ? basename( (string) get_attached_file( $id ) ) : '';
			$blocked       = '' !== $filename && Schema::filename_blocked( $filename );
			$src           = $is_attachment ? wp_get_attachment_image_src( $id, 'full' ) : false;
			$out[]         = array(
				'id'       => $id,
				'ok'       => $is_attachment && ! $blocked,
				'blocked'  => $blocked,
				'filename' => $filename,
				'alt'      => $is_attachment ? (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) : '',
				'url'      => $src ? esc_url_raw( (string) $src[0] ) : '',
				'width'    => $src ? (int) $src[1] : 0,
				'height'   => $src ? (int) $src[2] : 0,
			);
		}
		return $this->no_cache_no_index( new \WP_REST_Response( $out, 200 ) );
	}

	public function audit( \WP_REST_Request $request ): \WP_REST_Response {
		$route = sanitize_content_key( (string) $request->get_param( 'route' ) );
		$limit = (int) ( $request->get_param( 'limit' ) ?: 50 );
		return $this->no_cache_no_index( new \WP_REST_Response( Audit::query( $route, $limit ), 200 ) );
	}
}
