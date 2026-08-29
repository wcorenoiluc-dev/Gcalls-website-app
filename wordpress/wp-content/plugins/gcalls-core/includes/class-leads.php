<?php
/**
 * Lead capture: private storage, a hardened submit endpoint, and notification.
 *
 * WHAT CHANGED AND WHY
 * --------------------
 * The form on this site has been deliberately fail-closed since launch. It
 * rendered `<fieldset disabled>` and said so in plain Vietnamese, because
 * `docs/LEAD_CAPTURE_ARCHITECTURE.md` recorded the honest position: there was
 * no destination, so a form that accepted a phone number and dropped it would
 * be worse than no form — the visitor believes they have been contacted and
 * waits.
 *
 * This module is the destination. WordPress itself is the store, so no external
 * credential is needed to stop losing leads.
 *
 * THE ORDER OF OPERATIONS IS THE WHOLE DESIGN
 * -------------------------------------------
 * Store first, notify second, and report success only if the STORE succeeded.
 * Email is the unreliable half of this system — shared hosting silently drops
 * mail all the time — so it must never be the thing that decides whether the
 * visitor is told their message got through. A lead that is saved but not
 * emailed is recoverable from wp-admin. A lead that was emailed into a black
 * hole and never saved is gone, and nobody finds out until the prospect
 * complains.
 *
 * So `wp_mail()` returning false does NOT fail the request; it records
 * `notification_status = failed` and raises an admin notice. And a storage
 * failure DOES fail the request, loudly, with no success state.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * ----------------------------------
 * No lead ever reaches a third party from here. There is no outbound HTTP of
 * any kind — no webhook, no CRM adapter, no analytics beacon carrying PII. If
 * one is ever added it belongs behind an explicit, separately reviewed setting,
 * not inside this file.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Lead storage, submission and notification.
 */
final class Leads {

	/** Private post type holding submitted leads. */
	public const POST_TYPE = 'gcalls_lead';

	/** admin-post action name, for both logged-in and anonymous visitors. */
	public const ACTION = 'gcalls_lead_submit';

	/** Option holding the notification recipient. */
	public const OPTION_RECIPIENT = 'gcalls_lead_recipient';

	/** Option holding the count of leads whose notification failed. */
	public const OPTION_FAILED = 'gcalls_lead_failed_notifications';

	/** Where notifications go when nothing is configured. */
	public const DEFAULT_RECIPIENT = 'sales@gcalls.co';

	/**
	 * Field length caps, mirroring `normalizeLeadPayload()` in
	 * src/lib/leads/normalize.ts so the two surfaces cannot drift.
	 */
	private const CAPS = array(
		'name'    => 200,
		'company' => 200,
		'email'   => 200,
		'phone'   => 40,
		'need'    => 120,
		'message' => 4000,
	);

	/**
	 * Total accepted body size.
	 *
	 * Generous next to the sum of the caps above, because the body also carries
	 * attribution and a nonce, and mean next to what an attacker would like to
	 * post. Checked before anything is parsed.
	 */
	private const MAX_BODY_BYTES = 16384;

	/**
	 * A human cannot read the form, type a name, a phone number and a sentence
	 * of free text in under this many seconds. A bot fills it instantly.
	 *
	 * Paired with, not replacing, the honeypot: a bot that sleeps defeats this
	 * one, and a bot that fills every field defeats that one.
	 */
	private const MIN_SECONDS = 4;

	/** A single visitor may submit this many leads per hour. */
	private const RATE_LIMIT = 5;

	/** Transient prefix for a parked form draft. */
	private const DRAFT_PREFIX = 'gcalls_lead_draft_';

	/** How long an idempotency token is remembered. */
	private const IDEMPOTENCY_TTL = 6 * HOUR_IN_SECONDS;

	/**
	 * Boots the module.
	 */
	public static function init(): void {
		add_action( 'init', array( self::class, 'register_post_type' ) );
		add_action( 'wp_enqueue_scripts', array( self::class, 'enqueue' ) );
		add_action( 'admin_init', array( self::class, 'grant_capabilities' ) );

		// Both are required: the first serves logged-out visitors, which is
		// almost everyone, and the second stops a logged-in editor testing the
		// form from getting a 400.
		add_action( 'admin_post_nopriv_' . self::ACTION, array( self::class, 'handle' ) );
		add_action( 'admin_post_' . self::ACTION, array( self::class, 'handle' ) );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( self::class, 'register_settings_page' ) );
			add_action( 'admin_init', array( self::class, 'register_settings' ) );
			add_action( 'admin_notices', array( self::class, 'failed_notification_notice' ) );
			add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( self::class, 'columns' ) );
			add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( self::class, 'column' ), 10, 2 );
			add_action( 'add_meta_boxes', array( self::class, 'register_meta_box' ) );
		}
	}

	/**
	 * Loads the form's stylesheet and enhancement script.
	 *
	 * Only on a request whose content actually contains the shortcode, so the
	 * other thirty-seven pages carry neither. The script is deferred and the
	 * form works without it.
	 */
	public static function enqueue(): void {
		if ( ! is_singular() ) {
			return;
		}

		$post = get_post();

		if ( ! $post instanceof \WP_Post ) {
			return;
		}

		// Elementor keeps the rendered layout in post meta, not post_content,
		// so checking the content alone misses every page built with it.
		$haystack = $post->post_content . (string) get_post_meta( $post->ID, '_elementor_data', true );

		if ( ! str_contains( $haystack, 'gcalls_lead_form' ) ) {
			return;
		}

		wp_enqueue_style( 'gcalls-lead-form', GCALLS_CORE_URL . 'assets/css/lead-form.css', array(), VERSION );
		wp_enqueue_script( 'gcalls-lead-form', GCALLS_CORE_URL . 'assets/js/lead-form.js', array(), VERSION, true );
	}

	/* ------------------------------------------------------------ storage */

	/**
	 * The lead post type.
	 *
	 * `public => false` is the important flag and every other visibility
	 * argument below follows from it, stated explicitly rather than left to
	 * defaults, because a future WordPress default flipping would silently
	 * publish this. There is no archive, no single template, no rewrite rule,
	 * no REST route and no sitemap entry: a lead must not be reachable by URL
	 * guessing, and `show_in_rest => false` keeps the collection off
	 * /wp-json/wp/v2/ entirely.
	 *
	 * CAPABILITIES: A CUSTOM TYPE, NOT A REMAP OF THE CORE ONES.
	 *
	 * 0.9.6 tried to restrict this by pointing the post type's `edit_post`,
	 * `read_post` and `delete_post` at `manage_options` while `map_meta_cap`
	 * was on. Those three are META capabilities — WordPress resolves them
	 * THROUGH map_meta_cap — so overriding them with a primitive corrupted the
	 * resolver, and on the live site an administrator lost Settings, the whole
	 * admin menu truncated after Tools, and every Gcalls screen 403'd. It was
	 * caught by bisect and rolled back the same session.
	 *
	 * The supported way is a custom `capability_type`, which only ever
	 * INTRODUCES new capability names — `edit_gcalls_leads` and friends — and
	 * therefore cannot alter how core caps resolve for anything else. The
	 * administrator role is granted them in `grant_capabilities()`, which is
	 * idempotent and also runs on admin_init so an existing install heals
	 * without a reactivation.
	 *
	 * `create_posts` is safe to override because it is primitive, not meta:
	 * leads are written by the form, never typed into wp-admin.
	 */
	public static function register_post_type(): void {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => __( 'Gcalls Leads', 'gcalls-core' ),
					'singular_name' => __( 'Lead', 'gcalls-core' ),
					'menu_name'     => __( 'Gcalls Leads', 'gcalls-core' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'has_archive'         => false,
				'rewrite'             => false,
				'query_var'           => false,
				'show_in_rest'        => false,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => false,
				'menu_icon'           => 'dashicons-email-alt',
				'menu_position'       => 26,
				'supports'            => array( 'title' ),
				'capability_type'     => array( 'gcalls_lead', 'gcalls_leads' ),
				'map_meta_cap'        => true,
				'capabilities'        => array( 'create_posts' => 'do_not_allow' ),
			)
		);
	}

	/**
	 * Gives the administrator role the lead capabilities.
	 *
	 * Idempotent, and cheap: it returns immediately once the role already has
	 * them, so running it on every admin request costs one role lookup. Doing
	 * it here rather than only on activation means an install that updated the
	 * plugin — which does not fire the activation hook — heals itself.
	 *
	 * Only `administrator` is granted. That is the whole access-control story
	 * for leads: no Editor, Author or Contributor can list or read one.
	 */
	public static function grant_capabilities(): void {
		$role = get_role( 'administrator' );

		if ( ! $role instanceof \WP_Role || $role->has_cap( 'edit_others_gcalls_leads' ) ) {
			return;
		}

		foreach (
			array(
				'edit_gcalls_lead',
				'read_gcalls_lead',
				'delete_gcalls_lead',
				'edit_gcalls_leads',
				'edit_others_gcalls_leads',
				'publish_gcalls_leads',
				'read_private_gcalls_leads',
				'delete_gcalls_leads',
				'delete_private_gcalls_leads',
				'delete_published_gcalls_leads',
				'delete_others_gcalls_leads',
				'edit_private_gcalls_leads',
				'edit_published_gcalls_leads',
			) as $cap
		) {
			$role->add_cap( $cap );
		}
	}

	/**
	 * Writes one lead.
	 *
	 * Meta is registered per key with `single => true` and no `show_in_rest`,
	 * and post meta does not autoload, so none of this is loaded on a front-end
	 * request that has nothing to do with leads.
	 *
	 * @param array<string, mixed> $lead Sanitized lead.
	 * @return int|\WP_Error Post id, or the failure.
	 */
	private static function store( array $lead ) {
		$title = sprintf(
			/* translators: 1: visitor name, 2: submission date. */
			__( '%1$s — %2$s', 'gcalls-core' ),
			'' !== $lead['name'] ? $lead['name'] : __( '(không tên)', 'gcalls-core' ),
			gmdate( 'Y-m-d H:i' )
		);

		$post_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'private',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		foreach ( $lead as $key => $value ) {
			update_post_meta( $post_id, '_gcalls_' . $key, $value );
		}

		return (int) $post_id;
	}

	/* --------------------------------------------------------- submission */

	/**
	 * Handles a submitted lead.
	 *
	 * Every rejection below returns the visitor to the form with a code in the
	 * query string and nothing else. The codes are deliberately coarse: a
	 * response that distinguished "this honeypot was filled" from "you were too
	 * fast" would be a tuning oracle for whoever is probing it.
	 */
	public static function handle(): void {
		if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
			self::reject( '', 'method' );
		}

		$length = (int) ( $_SERVER['CONTENT_LENGTH'] ?? 0 );

		if ( $length > self::MAX_BODY_BYTES ) {
			self::reject( '', 'too_large' );
		}

		// Same-origin. A cross-site POST has either no Origin this site owns or
		// a Referer from somewhere else; both are refused before any parsing.
		if ( ! self::same_origin() ) {
			self::reject( '', 'origin' );
		}

		// The nonce is bound to the session, not to a logged-in user, so it
		// works for anonymous visitors. It is a replay and CSRF control, not
		// authentication.
		$nonce = isset( $_POST['gcalls_lead_nonce'] )
			? sanitize_text_field( wp_unslash( (string) $_POST['gcalls_lead_nonce'] ) )
			: '';

		if ( ! wp_verify_nonce( $nonce, self::ACTION ) ) {
			self::reject( '', 'nonce' );
		}

		$return = self::return_url();

		// Honeypot. A real browser never fills a field it cannot see, so any
		// value here is a bot. Answer as though it worked: telling a bot it was
		// caught only tells its author which field to skip next time.
		$trap = isset( $_POST['gcalls_website'] )
			? trim( (string) wp_unslash( $_POST['gcalls_website'] ) )
			: '';

		if ( '' !== $trap ) {
			self::redirect_success( $return, 'TRAP' );
		}

		$started = isset( $_POST['gcalls_started'] ) ? (int) $_POST['gcalls_started'] : 0;
		$elapsed = time() - $started;

		if ( $started <= 0 || $elapsed < self::MIN_SECONDS ) {
			self::reject( $return, 'too_fast' );
		}

		if ( ! self::within_rate_limit() ) {
			self::reject( $return, 'rate_limited' );
		}

		$fields = self::read_fields();
		$errors = self::validate( $fields );

		if ( array() !== $errors ) {
			self::reject( $return, 'invalid', $errors, $fields );
		}

		/*
		 * Idempotency. A double-clicked button, a browser retry or a flaky
		 * connection all produce the same token, and the second arrival returns
		 * the FIRST lead's reference rather than writing a duplicate.
		 */
		$token = self::idempotency_token();
		$seen  = get_transient( 'gcalls_lead_idem_' . $token );

		if ( false !== $seen ) {
			self::redirect_success( $return, (string) $seen );
		}

		$lead = array_merge(
			$fields,
			self::attribution(),
			array(
				'idempotency_key'     => $token,
				'submitted_at_gmt'    => gmdate( 'c' ),
				'notification_status' => 'pending',
				// Set by the server from the payload's own content, never by
				// the client: a form that could post `is_test=0` would let a
				// script mark its traffic as real, and one that could post
				// `is_test=1` could hide a real lead from the pipeline.
				'is_test'             => self::looks_like_test( $fields ) ? 'test' : 'real',
				// Hashed, salted per-site and kept only for rate limiting. The
				// raw address is never written to the database.
				'requester_hash'      => self::requester_hash(),
			)
		);

		$post_id = self::store( $lead );

		if ( is_wp_error( $post_id ) ) {
			// No success state, no email, nothing invented. The visitor is told
			// it did not send, which is true.
			self::reject( $return, 'storage' );
		}

		$reference = self::reference( $post_id );

		set_transient( 'gcalls_lead_idem_' . $token, $reference, self::IDEMPOTENCY_TTL );
		update_post_meta( $post_id, '_gcalls_reference', $reference );

		self::count_submission();

		// Stored. From here the visitor's lead is safe whatever the mail server
		// decides to do.
		$sent = self::notify( $post_id, $lead, $reference );

		update_post_meta( $post_id, '_gcalls_notification_status', $sent ? 'sent' : 'failed' );

		if ( ! $sent ) {
			update_option( self::OPTION_FAILED, (int) get_option( self::OPTION_FAILED, 0 ) + 1, false );
		}

		self::redirect_success( $return, $reference );
	}

	/**
	 * Reads and normalizes the posted fields.
	 *
	 * @return array<string, string>
	 */
	private static function read_fields(): array {
		$read = static function ( string $key, int $cap, bool $multiline = false ): string {
			if ( ! isset( $_POST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
				return '';
			}

			$raw = (string) wp_unslash( $_POST[ $key ] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().

			$value = $multiline
				? sanitize_textarea_field( $raw )
				: sanitize_text_field( $raw );

			// Collapse runs of whitespace exactly as normalize.ts does, so a
			// name pasted with a double space matches one typed with a single.
			if ( ! $multiline ) {
				$value = trim( (string) preg_replace( '/\s+/u', ' ', $value ) );
			}

			return mb_substr( $value, 0, $cap );
		};

		return array(
			'name'    => $read( 'name', self::CAPS['name'] ),
			'company' => $read( 'company', self::CAPS['company'] ),
			'email'   => strtolower( $read( 'email', self::CAPS['email'] ) ),
			'phone'   => self::normalize_phone( $read( 'phone', self::CAPS['phone'] ) ),
			'need'    => $read( 'need', self::CAPS['need'] ),
			'message' => $read( 'message', self::CAPS['message'], true ),
			'consent' => isset( $_POST['consent'] ) ? 'yes' : 'no', // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
		);
	}

	/**
	 * Normalizes a phone number without rejecting international formats.
	 *
	 * Keeps digits and a single leading +, drops the spaces, dots, dashes and
	 * brackets people type. Deliberately does not force a Vietnamese shape:
	 * validation.ts is permissive for the same reason, and rejecting a
	 * legitimate foreign prospect is a worse failure than storing a number the
	 * sales team has to glance at.
	 *
	 * @param string $raw Raw input.
	 * @return string
	 */
	public static function normalize_phone( string $raw ): string {
		$plus   = str_starts_with( trim( $raw ), '+' );
		$digits = preg_replace( '/\D+/', '', $raw );

		if ( ! is_string( $digits ) || '' === $digits ) {
			return '';
		}

		return ( $plus ? '+' : '' ) . $digits;
	}

	/**
	 * Server-side validation. The browser's checks protect nobody.
	 *
	 * @param array<string, string> $fields Normalized fields.
	 * @return array<string, string> Field key => error code.
	 */
	public static function validate( array $fields ): array {
		$errors = array();

		if ( '' === $fields['name'] ) {
			$errors['name'] = 'required';
		}

		if ( '' === $fields['phone'] ) {
			$errors['phone'] = 'required';
		} elseif ( ! preg_match( '/^\+?\d{8,20}$/', $fields['phone'] ) ) {
			$errors['phone'] = 'format';
		}

		// Optional, but if given it has to be plausible.
		if ( '' !== $fields['email'] && ! is_email( $fields['email'] ) ) {
			$errors['email'] = 'format';
		}

		if ( '' === $fields['message'] ) {
			$errors['message'] = 'required';
		}

		if ( 'yes' !== $fields['consent'] ) {
			$errors['consent'] = 'required';
		}

		return $errors;
	}

	/* -------------------------------------------------------- attribution */

	/**
	 * Campaign and navigation context carried with the lead.
	 *
	 * Every value is categorical and arrives from the form's hidden inputs,
	 * which the CTA populated from the query string. An unknown `source` is
	 * stored as-is rather than rejected: the WordPress build emits values the
	 * React `LeadSource` union does not contain (`header`, `homepage-bridge`,
	 * `cost-estimator`), and dropping a lead over a taxonomy mismatch would be
	 * an absurd thing to do to a prospect.
	 *
	 * @return array<string, string>
	 */
	private static function attribution(): array {
		$keys = array(
			'intent',
			'source',
			'product',
			'solution',
			'origin_url',
			'referrer',
			'utm_source',
			'utm_medium',
			'utm_campaign',
			'utm_content',
			'utm_term',
		);

		$out = array();

		foreach ( $keys as $key ) {
			$value = isset( $_POST[ $key ] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
				? sanitize_text_field( wp_unslash( (string) $_POST[ $key ] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
				: '';

			// URLs are held to a stricter standard than the rest: they are the
			// only attribution values that could become an href in the
			// notification email.
			if ( in_array( $key, array( 'origin_url', 'referrer' ), true ) && '' !== $value ) {
				$value = esc_url_raw( $value );
			}

			$out[ $key ] = mb_substr( $value, 0, 300 );
		}

		return $out;
	}

	/* ------------------------------------------------------------ notify */

	/**
	 * The configured recipient.
	 *
	 * Read from an option an administrator sets, never from the request. A form
	 * that could name its own recipient is an open relay with extra steps.
	 */
	public static function recipient(): string {
		$configured = (string) get_option( self::OPTION_RECIPIENT, '' );

		return is_email( $configured ) ? $configured : self::DEFAULT_RECIPIENT;
	}

	/**
	 * Sends the notification.
	 *
	 * Body is plain text. There is no HTML mail here, which removes the whole
	 * class of injection that comes from interpolating visitor input into
	 * markup, and the values are stripped of the CR/LF that would otherwise let
	 * a crafted name inject a header.
	 *
	 * `wp_mail()` returning true means WordPress handed the message to the MTA.
	 * It is NOT proof of delivery, and nothing in this file claims otherwise.
	 *
	 * @param int                  $post_id   Stored lead.
	 * @param array<string, mixed> $lead      Lead data.
	 * @param string               $reference Visitor-facing reference.
	 * @return bool Whether wp_mail() accepted the message.
	 */
	private static function notify( int $post_id, array $lead, string $reference ): bool {
		$line = static function ( string $label, string $value ): string {
			$value = str_replace( array( "\r", "\n" ), ' ', $value );

			return '' === $value ? '' : $label . ': ' . $value . "\n";
		};

		$body  = __( 'Một khách hàng vừa gửi yêu cầu tư vấn từ website.', 'gcalls-core' ) . "\n\n";
		$body .= $line( __( 'Mã tham chiếu', 'gcalls-core' ), $reference );
		$body .= $line( __( 'Họ và tên', 'gcalls-core' ), (string) $lead['name'] );
		$body .= $line( __( 'Số điện thoại', 'gcalls-core' ), (string) $lead['phone'] );
		$body .= $line( __( 'Email', 'gcalls-core' ), (string) $lead['email'] );
		$body .= $line( __( 'Công ty', 'gcalls-core' ), (string) $lead['company'] );
		$body .= $line( __( 'Nhu cầu', 'gcalls-core' ), (string) $lead['need'] );
		$body .= "\n" . __( 'Nội dung:', 'gcalls-core' ) . "\n";
		$body .= trim( (string) $lead['message'] ) . "\n\n";

		$body .= __( '— Ngữ cảnh —', 'gcalls-core' ) . "\n";
		$body .= $line( 'Intent', (string) $lead['intent'] );
		$body .= $line( 'Source', (string) $lead['source'] );
		$body .= $line( 'Product', (string) $lead['product'] );
		$body .= $line( 'Solution', (string) $lead['solution'] );
		$body .= $line( __( 'Trang gửi', 'gcalls-core' ), (string) $lead['origin_url'] );
		$body .= $line( 'Referrer', (string) $lead['referrer'] );

		foreach ( array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term' ) as $utm ) {
			$body .= $line( $utm, (string) $lead[ $utm ] );
		}

		if ( 'test' === $lead['is_test'] ) {
			$body .= "\n" . __( '*** ĐÂY LÀ LEAD TEST — KHÔNG LIÊN HỆ ***', 'gcalls-core' ) . "\n";
		}

		$body .= "\n" . __( 'Mở trong wp-admin:', 'gcalls-core' ) . "\n";
		$body .= get_edit_post_link( $post_id, 'raw' ) . "\n";

		$subject = sprintf(
			/* translators: 1: test marker, 2: visitor name. */
			__( '%1$sLead mới từ website — %2$s', 'gcalls-core' ),
			'test' === $lead['is_test'] ? '[TEST] ' : '',
			str_replace( array( "\r", "\n" ), ' ', (string) $lead['name'] )
		);

		/*
		 * From must be a mailbox on a domain this server is allowed to send
		 * for. Using the visitor's address here is what gets a site's mail
		 * classified as spoofing and silently dropped by the recipient. The
		 * visitor's address goes in Reply-To instead, and only once validated.
		 */
		$host = wp_parse_url( home_url(), PHP_URL_HOST );
		$host = is_string( $host ) ? preg_replace( '/^www\./', '', $host ) : '';

		$headers = array( 'Content-Type: text/plain; charset=UTF-8' );

		if ( '' !== $host ) {
			$headers[] = 'From: Gcalls Website <wordpress@' . $host . '>';
		}

		if ( '' !== $lead['email'] && is_email( (string) $lead['email'] ) ) {
			$headers[] = 'Reply-To: ' . $lead['email'];
		}

		return (bool) wp_mail( self::recipient(), $subject, $body, $headers );
	}

	/* ------------------------------------------------------------- guards */

	/**
	 * Whether the POST came from this site.
	 *
	 * @return bool
	 */
	private static function same_origin(): bool {
		$home = wp_parse_url( home_url(), PHP_URL_HOST );

		if ( ! is_string( $home ) || '' === $home ) {
			return false;
		}

		$origin = isset( $_SERVER['HTTP_ORIGIN'] )
			? wp_parse_url( sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_ORIGIN'] ) ), PHP_URL_HOST )
			: null;

		if ( is_string( $origin ) && '' !== $origin ) {
			return strtolower( $origin ) === strtolower( $home );
		}

		// Some privacy tooling strips Origin on same-site form posts, so fall
		// back to Referer rather than refusing those visitors outright.
		$referer = isset( $_SERVER['HTTP_REFERER'] )
			? wp_parse_url( sanitize_text_field( wp_unslash( (string) $_SERVER['HTTP_REFERER'] ) ), PHP_URL_HOST )
			: null;

		return is_string( $referer ) && strtolower( $referer ) === strtolower( $home );
	}

	/**
	 * A salted, per-site hash of the requester.
	 *
	 * Used for rate limiting and stored on the lead so repeat submissions can
	 * be recognised. The raw IP is never persisted: it is personal data, it is
	 * not needed to answer a lead, and keeping it would mean keeping it safe.
	 *
	 * @return string
	 */
	private static function requester_hash(): string {
		$ip = isset( $_SERVER['REMOTE_ADDR'] )
			? sanitize_text_field( wp_unslash( (string) $_SERVER['REMOTE_ADDR'] ) )
			: '';

		return '' === $ip ? '' : substr( hash_hmac( 'sha256', $ip, wp_salt( 'nonce' ) ), 0, 32 );
	}

	/**
	 * Whether this requester is under the hourly cap.
	 *
	 * @return bool
	 */
	private static function within_rate_limit(): bool {
		$hash = self::requester_hash();

		if ( '' === $hash ) {
			return true;
		}

		return (int) get_transient( 'gcalls_lead_rate_' . $hash ) < self::RATE_LIMIT;
	}

	/**
	 * Records a submission against the hourly cap.
	 */
	private static function count_submission(): void {
		$hash = self::requester_hash();

		if ( '' === $hash ) {
			return;
		}

		$key = 'gcalls_lead_rate_' . $hash;

		set_transient( $key, (int) get_transient( $key ) + 1, HOUR_IN_SECONDS );
	}

	/**
	 * The submission's idempotency token.
	 *
	 * Taken from the form when present, and otherwise derived from the content
	 * so that a resubmitted identical payload still collapses.
	 *
	 * @return string
	 */
	private static function idempotency_token(): string {
		$posted = isset( $_POST['gcalls_idempotency'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
			? sanitize_text_field( wp_unslash( (string) $_POST['gcalls_idempotency'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
			: '';

		if ( preg_match( '/^[a-f0-9]{16,64}$/', $posted ) ) {
			return $posted;
		}

		$fields = self::read_fields();

		return hash( 'sha256', wp_json_encode( $fields ) . self::requester_hash() );
	}

	/**
	 * Whether the payload identifies itself as a test.
	 *
	 * Decided here, from the content, so the client cannot set the flag.
	 *
	 * @param array<string, string> $fields Normalized fields.
	 * @return bool
	 */
	private static function looks_like_test( array $fields ): bool {
		return false !== stripos( $fields['name'], 'GCALLS TEST' );
	}

	/**
	 * The visitor-facing reference for a stored lead.
	 *
	 * @param int $post_id Lead id.
	 * @return string
	 */
	private static function reference( int $post_id ): string {
		return sprintf( 'GC-%s-%04d', gmdate( 'ymd' ), $post_id % 10000 );
	}

	/* ---------------------------------------------------------- redirects */

	/**
	 * Where to send the visitor back to.
	 *
	 * The client proposes a return path and the server disposes: only a path on
	 * THIS host survives, so a crafted `_wp_http_referer` cannot turn the form
	 * into an open redirect. Anything else falls back to the contact route.
	 *
	 * @return string
	 */
	private static function return_url(): string {
		$posted = isset( $_POST['_wp_http_referer'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
			? sanitize_text_field( wp_unslash( (string) $_POST['_wp_http_referer'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified in handle().
			: '';

		$fallback = home_url( Shortcodes::LEAD_ROUTE );

		if ( '' === $posted ) {
			return $fallback;
		}

		// wp_validate_redirect() allows only hosts on the site's allowlist,
		// which by default is this host alone.
		$candidate = str_starts_with( $posted, 'http' ) ? $posted : home_url( $posted );

		return wp_validate_redirect( $candidate, $fallback );
	}

	/**
	 * Sends the visitor back with a success reference.
	 *
	 * @param string $return    Return URL.
	 * @param string $reference Lead reference.
	 */
	private static function redirect_success( string $return, string $reference ): void {
		$url = add_query_arg(
			array(
				'gcalls_lead' => 'ok',
				'ref'         => rawurlencode( $reference ),
			),
			'' !== $return ? $return : home_url( Shortcodes::LEAD_ROUTE )
		);

		wp_safe_redirect( $url, 303 );
		exit;
	}

	/**
	 * Sends the visitor back with an error, preserving what they typed.
	 *
	 * WHY THE VALUES DO NOT TRAVEL IN THE URL
	 * Bouncing a name, phone number and message back as query parameters would
	 * repopulate the form with no server state, and it is what a lot of plugins
	 * do. It also writes the visitor's personal data into the access log, the
	 * browser history, the Referer header of every asset the page then loads,
	 * and any proxy or CDN in between. So the values are parked in a short-lived
	 * transient under a random token and only the TOKEN goes in the URL — it
	 * identifies nobody and expires in fifteen minutes.
	 *
	 * @param string                $return URL to return to.
	 * @param string                $code   Coarse failure code.
	 * @param array<string, string> $errors Field errors.
	 * @param array<string, string> $values What the visitor typed.
	 */
	private static function reject( string $return, string $code, array $errors = array(), array $values = array() ): void {
		if ( '' === $return ) {
			$return = home_url( Shortcodes::LEAD_ROUTE );
		}

		$args = array(
			'gcalls_lead' => 'error',
			'code'        => $code,
		);

		if ( array() !== $errors ) {
			$args['fields'] = implode( ',', array_keys( $errors ) );
		}

		if ( array() !== $values ) {
			$token = wp_generate_password( 20, false, false );

			set_transient( self::DRAFT_PREFIX . $token, $values, 15 * MINUTE_IN_SECONDS );

			$args['draft'] = $token;
		}

		wp_safe_redirect( add_query_arg( $args, $return ), 303 );
		exit;
	}

	/**
	 * Returns and clears a parked draft.
	 *
	 * Read once: a refresh should not keep resurrecting an old attempt, and the
	 * data should not sit in the options table longer than it is useful.
	 *
	 * @param string $token Draft token.
	 * @return array<string, string>
	 */
	public static function take_draft( string $token ): array {
		if ( ! preg_match( '/^[A-Za-z0-9]{10,40}$/', $token ) ) {
			return array();
		}

		$draft = get_transient( self::DRAFT_PREFIX . $token );

		if ( ! is_array( $draft ) ) {
			return array();
		}

		delete_transient( self::DRAFT_PREFIX . $token );

		return array_map( 'strval', $draft );
	}

	/* ------------------------------------------------------------- admin */

	/**
	 * Settings page under the Leads menu.
	 */
	public static function register_settings_page(): void {
		add_submenu_page(
			'edit.php?post_type=' . self::POST_TYPE,
			__( 'Cấu hình nhận lead', 'gcalls-core' ),
			__( 'Cấu hình', 'gcalls-core' ),
			'manage_options',
			'gcalls-lead-settings',
			array( self::class, 'render_settings' )
		);
	}

	/**
	 * Registers the recipient setting.
	 */
	public static function register_settings(): void {
		register_setting(
			'gcalls_lead_settings',
			self::OPTION_RECIPIENT,
			array(
				'type'              => 'string',
				'sanitize_callback' => static function ( $value ): string {
					$value = sanitize_email( (string) $value );

					return is_email( $value ) ? $value : '';
				},
				'default'           => '',
				// Not exposed over REST, and not autoloaded.
				'show_in_rest'      => false,
			)
		);
	}

	/**
	 * Renders the settings screen.
	 */
	public static function render_settings(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		echo '<div class="wrap"><h1>' . esc_html__( 'Cấu hình nhận lead', 'gcalls-core' ) . '</h1>';
		echo '<form method="post" action="options.php">';

		settings_fields( 'gcalls_lead_settings' );

		echo '<table class="form-table"><tr>';
		echo '<th scope="row"><label for="gcalls-recipient">' . esc_html__( 'Email nhận thông báo', 'gcalls-core' ) . '</label></th>';
		echo '<td><input type="email" class="regular-text" id="gcalls-recipient" name="' . esc_attr( self::OPTION_RECIPIENT ) . '" value="' . esc_attr( (string) get_option( self::OPTION_RECIPIENT, '' ) ) . '">';
		echo '<p class="description">' . sprintf(
			/* translators: %s: default recipient address. */
			esc_html__( 'Để trống sẽ dùng mặc định: %s', 'gcalls-core' ),
			'<code>' . esc_html( self::DEFAULT_RECIPIENT ) . '</code>'
		) . '</p></td>';
		echo '</tr></table>';

		submit_button();

		echo '</form></div>';
	}

	/**
	 * Warns an administrator when notifications are failing.
	 *
	 * A silently failing mail server is the failure mode this whole module is
	 * arranged around: the leads are safe in the database, but nobody knows to
	 * go and read them.
	 */
	public static function failed_notification_notice(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$failed = (int) get_option( self::OPTION_FAILED, 0 );

		if ( $failed < 1 ) {
			return;
		}

		echo '<div class="notice notice-error"><p><strong>';
		echo esc_html__( 'Gcalls: có lead không gửi được email thông báo.', 'gcalls-core' );
		echo '</strong> ';
		printf(
			/* translators: %d: number of failed notifications. */
			esc_html__( '%d lead đã được lưu nhưng email báo về không gửi được. Lead KHÔNG bị mất — mở Gcalls Leads để xem.', 'gcalls-core' ),
			absint( $failed )
		);
		echo ' <a href="' . esc_url( admin_url( 'edit.php?post_type=' . self::POST_TYPE ) ) . '">';
		echo esc_html__( 'Xem lead', 'gcalls-core' ) . '</a></p></div>';
	}

	/**
	 * Adds useful columns to the lead list.
	 *
	 * @param array<string, string> $columns Existing columns.
	 * @return array<string, string>
	 */
	public static function columns( array $columns ): array {
		return array(
			'cb'        => $columns['cb'] ?? '',
			'title'     => __( 'Lead', 'gcalls-core' ),
			'gc_phone'  => __( 'Điện thoại', 'gcalls-core' ),
			'gc_source' => __( 'Nguồn', 'gcalls-core' ),
			'gc_notify' => __( 'Thông báo', 'gcalls-core' ),
			'date'      => $columns['date'] ?? __( 'Ngày', 'gcalls-core' ),
		);
	}

	/**
	 * Renders one custom column.
	 *
	 * @param string $column  Column key.
	 * @param int    $post_id Lead id.
	 */
	public static function column( string $column, int $post_id ): void {
		$get = static fn( string $key ): string => (string) get_post_meta( $post_id, '_gcalls_' . $key, true );

		if ( 'gc_phone' === $column ) {
			echo esc_html( $get( 'phone' ) );
		}

		if ( 'gc_source' === $column ) {
			$bits = array_filter( array( $get( 'intent' ), $get( 'source' ), $get( 'product' ), $get( 'solution' ) ) );
			echo esc_html( implode( ' · ', $bits ) );
		}

		if ( 'gc_notify' === $column ) {
			$status = $get( 'notification_status' );
			echo 'sent' === $status
				? '<span style="color:#1a7f37">' . esc_html__( 'đã gửi', 'gcalls-core' ) . '</span>'
				: '<strong style="color:#b32d2e">' . esc_html( $status ) . '</strong>';
		}
	}

	/**
	 * The lead detail box.
	 */
	public static function register_meta_box(): void {
		add_meta_box(
			'gcalls-lead-detail',
			__( 'Nội dung lead', 'gcalls-core' ),
			array( self::class, 'render_meta_box' ),
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * Renders the stored lead.
	 *
	 * @param \WP_Post $post Lead post.
	 */
	public static function render_meta_box( \WP_Post $post ): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$rows = array(
			'reference'           => __( 'Mã tham chiếu', 'gcalls-core' ),
			'name'                => __( 'Họ và tên', 'gcalls-core' ),
			'phone'               => __( 'Số điện thoại', 'gcalls-core' ),
			'email'               => __( 'Email', 'gcalls-core' ),
			'company'             => __( 'Công ty', 'gcalls-core' ),
			'need'                => __( 'Nhu cầu', 'gcalls-core' ),
			'message'             => __( 'Nội dung', 'gcalls-core' ),
			'consent'             => __( 'Đồng ý xử lý thông tin', 'gcalls-core' ),
			'intent'              => 'intent',
			'source'              => 'source',
			'product'             => 'product',
			'solution'            => 'solution',
			'origin_url'          => __( 'Trang gửi', 'gcalls-core' ),
			'referrer'            => 'referrer',
			'utm_source'          => 'utm_source',
			'utm_medium'          => 'utm_medium',
			'utm_campaign'        => 'utm_campaign',
			'utm_content'         => 'utm_content',
			'utm_term'            => 'utm_term',
			'submitted_at_gmt'    => __( 'Thời điểm gửi (GMT)', 'gcalls-core' ),
			'notification_status' => __( 'Trạng thái thông báo', 'gcalls-core' ),
			'is_test'             => __( 'Loại', 'gcalls-core' ),
			'idempotency_key'     => __( 'Idempotency key', 'gcalls-core' ),
		);

		echo '<table class="widefat striped">';

		foreach ( $rows as $key => $label ) {
			$value = (string) get_post_meta( $post->ID, '_gcalls_' . $key, true );

			if ( '' === $value ) {
				continue;
			}

			echo '<tr><th style="width:220px">' . esc_html( $label ) . '</th><td>';
			echo nl2br( esc_html( $value ) );
			echo '</td></tr>';
		}

		echo '</table>';
	}
}
