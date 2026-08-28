<?php
/**
 * Shortcodes — the bridge between Elementor and behaviour that must not be
 * duplicated into widget trees.
 *
 * WHY THESE ARE NOT ELEMENTOR WIDGETS
 * Inserting an Elementor saved template COPIES its markup into the page. Nine
 * pages carrying a copy of the same CTA band is nine edits the next time a
 * price or a phone number changes, and nobody will find all nine. A shortcode
 * is one implementation, called from nine places.
 *
 * WHY THE CTA IS A SHORTCODE IN PARTICULAR
 * The React site builds every conversion link through `leadCtaHref()`, which
 * appends `intent`, `source`, `product` and `solution` to `/lien-he/`. There are
 * 77 such links. A button rebuilt in Elementor as a plain link to `/lien-he/`
 * looks identical, works, and silently destroys the attribution on that page —
 * the lead still arrives, with no record of what the reader was reading. Making
 * the CTA a shortcode means the query string cannot be forgotten, only
 * mis-typed, and a mis-typed one is visible in the page source.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the plugin's shortcodes.
 */
final class Shortcodes {

	/** The single conversion route. Every CTA converges here. */
	public const LEAD_ROUTE = '/lien-he/';

	/** Contact details shown while the lead pipeline has no destination. */
	public const CONTACT_EMAIL = 'sales@gcalls.co';
	public const CONTACT_PHONE = '028 7302 5469';
	public const CONTACT_TEL   = '+842873025469';

	/**
	 * Registers every shortcode.
	 */
	public static function init(): void {
		add_shortcode( 'gcalls_faq', array( self::class, 'faq' ) );
		add_shortcode( 'gcalls_cta', array( self::class, 'cta' ) );
		add_shortcode( 'gcalls_lead_form', array( self::class, 'lead_form' ) );
		add_shortcode( 'gcalls_media', array( self::class, 'media' ) );
	}

	/**
	 * `[gcalls_faq]` — the FAQ accordion for the current post.
	 *
	 * Reads `_gcalls_faq`, the same meta that feeds the FAQPage JSON-LD, so the
	 * questions a reader sees and the questions Google is told about cannot
	 * disagree. Rebuilding this as an Elementor accordion would produce a second
	 * copy of the questions and a second source of truth.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function faq( $atts = array() ): string {
		$atts = shortcode_atts( array( 'post_id' => 0 ), (array) $atts, 'gcalls_faq' );

		$post_id = (int) $atts['post_id'];
		$post_id = $post_id > 0 ? $post_id : (int) get_the_ID();

		if ( ! $post_id ) {
			return '';
		}

		ob_start();
		Faq::render( $post_id );

		return (string) ob_get_clean();
	}

	/**
	 * `[gcalls_cta]` — a conversion button that carries its attribution.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function cta( $atts = array() ): string {
		$atts = shortcode_atts(
			array(
				'label'    => __( 'Đăng ký tư vấn', 'gcalls-core' ),
				'intent'   => '',
				'source'   => '',
				'product'  => '',
				'solution' => '',
				'style'    => 'primary',
				'note'     => '',
			),
			(array) $atts,
			'gcalls_cta'
		);

		$classes = 'gcalls-cta gcalls-cta--' . ( 'secondary' === $atts['style'] ? 'secondary' : 'primary' );

		$markup  = '<div class="gcalls-cta-band">';
		$markup .= '<a class="' . esc_attr( $classes ) . '" href="' . esc_url( self::lead_href( $atts ) ) . '">';
		$markup .= esc_html( (string) $atts['label'] );
		$markup .= '</a>';

		if ( '' !== $atts['note'] ) {
			$markup .= '<p class="gcalls-cta-band__note">' . esc_html( (string) $atts['note'] ) . '</p>';
		}

		$markup .= '</div>';

		return $markup;
	}

	/**
	 * Builds the lead URL with its attribution, mirroring `leadCtaHref()`.
	 *
	 * Empty values are omitted rather than sent blank: `?intent=` is not the
	 * same signal as no intent at all, and the difference matters once these are
	 * counted.
	 *
	 * @param array<string, string> $atts Attribution attributes.
	 */
	public static function lead_href( array $atts ): string {
		$query = array();

		foreach ( array( 'intent', 'source', 'product', 'solution' ) as $key ) {
			$value = sanitize_text_field( (string) ( $atts[ $key ] ?? '' ) );

			if ( '' !== $value ) {
				$query[ $key ] = $value;
			}
		}

		$url = home_url( self::LEAD_ROUTE );

		return array() === $query ? $url : add_query_arg( $query, $url );
	}

	/**
	 * `[gcalls_lead_form]` — the conversion surface, deliberately fail-closed.
	 *
	 * THE FORM DOES NOT SUBMIT, AND THAT IS THE CORRECT BEHAVIOUR TODAY.
	 * `docs/LEAD_CAPTURE_ARCHITECTURE.md` records that no lead submitted through
	 * this website reaches Gcalls: there is no approved destination and no
	 * credential to reach one with. A form that accepts a name and a phone number
	 * and then drops them is worse than no form — the visitor believes they have
	 * been contacted and waits. So the fields render disabled, the reason is
	 * stated in plain Vietnamese, and the two channels that DO work are given.
	 *
	 * The attribution captured from the query string is preserved in a hidden
	 * field so that wiring a destination later is one change here, not a hunt
	 * through every page that links in.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function lead_form( $atts = array() ): string {
		$atts = shortcode_atts(
			array( 'title' => __( 'Đăng ký tư vấn', 'gcalls-core' ) ),
			(array) $atts,
			'gcalls_lead_form'
		);

		$attribution = array();

		foreach ( array( 'intent', 'source', 'product', 'solution' ) as $key ) {
			// Read-only use of a GET parameter for display and a hidden field.
			// No nonce applies: this is not an action, and the value is escaped
			// on the way out.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			if ( isset( $_GET[ $key ] ) ) {
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				$value = sanitize_text_field( wp_unslash( (string) $_GET[ $key ] ) );

				if ( '' !== $value ) {
					$attribution[ $key ] = $value;
				}
			}
		}

		$fields = array(
			'name'    => __( 'Họ và tên', 'gcalls-core' ),
			'company' => __( 'Công ty', 'gcalls-core' ),
			'email'   => __( 'Email', 'gcalls-core' ),
			'phone'   => __( 'Số điện thoại', 'gcalls-core' ),
		);

		$markup  = '<section class="gcalls-lead">';
		$markup .= '<h2 class="gcalls-lead__title">' . esc_html( (string) $atts['title'] ) . '</h2>';

		$markup .= '<div class="gcalls-lead__notice" role="status">';
		$markup .= '<p>' . esc_html__( 'Biểu mẫu hiện chưa được kết nối hệ thống tiếp nhận, nên chưa gửi được. Vui lòng liên hệ Gcalls qua email hoặc hotline — hai kênh này hoạt động bình thường.', 'gcalls-core' ) . '</p>';
		$markup .= '<p class="gcalls-lead__contact">';
		$markup .= '<a href="mailto:' . esc_attr( self::CONTACT_EMAIL ) . '">' . esc_html( self::CONTACT_EMAIL ) . '</a>';
		$markup .= ' · ';
		$markup .= '<a href="tel:' . esc_attr( self::CONTACT_TEL ) . '">' . esc_html( self::CONTACT_PHONE ) . '</a>';
		$markup .= '</p>';
		$markup .= '</div>';

		// No action and no method: there is nowhere to send this, and an empty
		// action would post the page back to itself, which looks like a failure.
		$markup .= '<form class="gcalls-lead__form" onsubmit="return false">';
		$markup .= '<fieldset disabled>';
		$markup .= '<legend class="screen-reader-text">' . esc_html__( 'Thông tin liên hệ', 'gcalls-core' ) . '</legend>';

		foreach ( $fields as $name => $label ) {
			$id      = 'gcalls-lead-' . $name;
			$type    = 'email' === $name ? 'email' : ( 'phone' === $name ? 'tel' : 'text' );
			$markup .= '<p class="gcalls-lead__field">';
			$markup .= '<label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label>';
			$markup .= '<input type="' . esc_attr( $type ) . '" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" autocomplete="off">';
			$markup .= '</p>';
		}

		$markup .= '<p class="gcalls-lead__field">';
		$markup .= '<label for="gcalls-lead-message">' . esc_html__( 'Nội dung cần tư vấn', 'gcalls-core' ) . '</label>';
		$markup .= '<textarea id="gcalls-lead-message" name="message" rows="4"></textarea>';
		$markup .= '</p>';

		foreach ( $attribution as $key => $value ) {
			$markup .= '<input type="hidden" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '">';
		}

		$markup .= '<p><button type="submit" class="gcalls-cta gcalls-cta--primary">' . esc_html__( 'Chưa thể gửi', 'gcalls-core' ) . '</button></p>';
		$markup .= '</fieldset>';
		$markup .= '</form>';
		$markup .= '</section>';

		return $markup;
	}

	/**
	 * `[gcalls_media id="GP-09"]` — a product screenshot, by manifest id.
	 *
	 * WHY NOT JUST PUT THE IMAGE IN THE ELEMENTOR TEMPLATE
	 * An Elementor image widget stores an attachment ID and a URL. Both are
	 * environment-specific: the ID belongs to the site the template was exported
	 * from, and the URL contains the year and month it was uploaded. Exported to
	 * Git and imported anywhere else, the widget renders a broken image or,
	 * worse, whatever attachment happens to hold that ID now. Resolving by the
	 * manifest id at render time makes the template portable, which is the whole
	 * reason the templates live in the repository.
	 *
	 * Renders NOTHING when the attachment is absent. A missing screenshot should
	 * leave a gap, never a broken-image icon on the home page.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function media( $atts = array() ): string {
		$atts = shortcode_atts(
			array(
				'id'    => '',
				'size'  => 'large',
				'class' => '',
			),
			(array) $atts,
			'gcalls_media'
		);

		$media_id = sanitize_text_field( (string) $atts['id'] );

		if ( '' === $media_id ) {
			return '';
		}

		$attachment_id = Importer::find_media( $media_id );

		if ( ! $attachment_id ) {
			return '';
		}

		$classes = trim( 'gcalls-media ' . sanitize_html_class( (string) $atts['class'] ) );

		return wp_get_attachment_image(
			$attachment_id,
			sanitize_text_field( (string) $atts['size'] ),
			false,
			array(
				'class'    => $classes,
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);
	}
}
