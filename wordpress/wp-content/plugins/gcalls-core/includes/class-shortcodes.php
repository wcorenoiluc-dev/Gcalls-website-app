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
		add_shortcode( 'gcalls_estimator', array( self::class, 'estimator' ) );
		add_shortcode( 'gcalls_loss_estimator', array( self::class, 'loss_estimator' ) );
		add_shortcode( 'gcalls_diagram', array( self::class, 'diagram' ) );
		add_shortcode( 'gcalls_product_page', array( self::class, 'product_page' ) );
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
		// h4, not h2. The panel sits inside a section that already has its own
		// heading, so an h2 here inserts a second top-level heading into that
		// section — on the home page it produced a forty-second heading React
		// does not have, out of order, directly under the section title it was
		// competing with. React labels the panel without promoting it.
		$markup .= '<h4 class="gcalls-lead__title">' . esc_html( (string) $atts['title'] ) . '</h4>';

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

	/**
	 * `[gcalls_estimator]` — the cost estimator, ported from React.
	 *
	 * IT DOES NOT PRICE ANYTHING.
	 * `src/lib/estimate.ts` gates every number behind `PRICING_CONFIGURED`,
	 * which is false because no rate table has been approved, and says in as
	 * many words that inventing one "would produce a number that looks
	 * authoritative and is not". The port carries that gate rather than the
	 * absence of it: the generated config records `pricingConfigured`, the
	 * front end has no arithmetic, and the result panel ends on the
	 * configuration state and a request to talk to Gcalls.
	 *
	 * The questionnaire is generated from the same source the React app reads —
	 * see wordpress/scripts/build-estimator-config.mjs — so a question added
	 * there appears here without anyone retyping it.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function estimator( $atts = array() ): string {
		unset( $atts );

		$config_file = GCALLS_CORE_DIR . 'data/estimator-config.json';

		if ( ! is_readable( $config_file ) ) {
			return '';
		}

		$raw    = (string) file_get_contents( $config_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Bundled plugin data file.
		$config = json_decode( $raw, true );

		if ( ! is_array( $config ) || empty( $config['solutions'] ) ) {
			return '';
		}

		// A last-line guard, independent of the build script's own check: if the
		// config ever claims pricing is configured, this port still has no rate
		// table, so it must not render as though it could produce a total.
		if ( ! empty( $config['pricingConfigured'] ) ) {
			return '<p>' . esc_html__( 'Công cụ ước tính đang được cập nhật.', 'gcalls-core' ) . '</p>';
		}

		wp_enqueue_style(
			'gcalls-estimator',
			GCALLS_CORE_URL . 'assets/css/estimator.css',
			array(),
			VERSION
		);
		wp_enqueue_script(
			'gcalls-estimator',
			GCALLS_CORE_URL . 'assets/js/estimator.js',
			array(),
			VERSION,
			true
		);

		$markup  = '<div class="gcalls-est" data-gcalls-estimator';
		$markup .= ' data-lead-url="' . esc_url( home_url( self::LEAD_ROUTE ) ) . '"';
		$markup .= " data-config='" . esc_attr( wp_json_encode( $config ) ) . "'>";

		// Without scripting the tool cannot work, so it says so and gives the
		// route that does — rather than rendering an inert set of controls.
		$markup .= '<noscript><div class="gcalls-est__noscript"><p>';
		$markup .= esc_html__( 'Công cụ ước tính cần JavaScript. Anh/chị có thể liên hệ trực tiếp để được tư vấn cấu hình.', 'gcalls-core' );
		$markup .= '</p><p><a class="gcalls-cta gcalls-cta--primary" href="';
		$markup .= esc_url( self::lead_href( array( 'intent' => 'quote', 'source' => 'cost-estimator' ) ) );
		$markup .= '">' . esc_html__( 'Nhận tư vấn cấu hình', 'gcalls-core' ) . '</a></p></div></noscript>';

		$markup .= '</div>';

		return $markup;
	}

	/**
	 * `[gcalls_loss_estimator]` — the homepage operational-loss estimator.
	 *
	 * WHY THIS IS NOT `[gcalls_estimator]`
	 * They answer different questions and must never be swapped. That one prices
	 * a Gcalls deployment and belongs on /uoc-tinh-chi-phi/; this one asks what
	 * disjointed operations might be costing the visitor TODAY, from numbers the
	 * visitor types about their own team. Nothing here is measured or
	 * benchmarked by Gcalls, so the disclaimer travels with every result and no
	 * wording around it may promise a saving or a payback period.
	 *
	 * The bounds, wording and disclaimer come from the same TypeScript module
	 * the React app uses, via build-loss-estimator-config.mjs.
	 *
	 * @param array<string, string>|string $atts Unused.
	 */
	public static function loss_estimator( $atts = array() ): string {
		unset( $atts );

		$config_file = GCALLS_CORE_DIR . 'data/loss-estimator-config.json';

		if ( ! is_readable( $config_file ) ) {
			return '';
		}

		$raw    = (string) file_get_contents( $config_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Bundled plugin data file.
		$config = json_decode( $raw, true );

		if ( ! is_array( $config ) || empty( $config['fields'] ) || empty( $config['disclaimer'] ) ) {
			return '';
		}

		wp_enqueue_style(
			'gcalls-loss-estimator',
			GCALLS_CORE_URL . 'assets/css/loss-estimator.css',
			array(),
			VERSION
		);
		wp_enqueue_script(
			'gcalls-loss-estimator',
			GCALLS_CORE_URL . 'assets/js/loss-estimator.js',
			array(),
			VERSION,
			true
		);

		$cta_href = self::lead_href(
			array(
				'intent' => 'consultation',
				'source' => 'consultation',
			)
		);

		$markup  = '<div class="gcalls-loss-root" data-gcalls-loss-estimator';
		$markup .= ' data-cta-url="' . esc_url( $cta_href ) . '"';
		$markup .= " data-config='" . esc_attr( wp_json_encode( $config ) ) . "'>";

		// Without scripting there is no calculator, so the fallback states the
		// disclaimer and offers the route that does work — rather than rendering
		// six inert sliders beside a figure that can never change.
		$markup .= '<noscript><div class="gcalls-loss__noscript">';
		$markup .= '<p>' . esc_html__( 'Công cụ ước tính cần JavaScript.', 'gcalls-core' ) . '</p>';
		$markup .= '<p>' . esc_html( (string) $config['disclaimer'] ) . '</p>';
		$markup .= '<p><a class="gcalls-cta gcalls-cta--primary" href="' . esc_url( $cta_href ) . '">';
		$markup .= esc_html__( 'Nhận tư vấn tối ưu vận hành', 'gcalls-core' ) . '</a></p>';
		$markup .= '</div></noscript>';

		$markup .= '</div>';

		return $markup;
	}

	/**
	 * `[gcalls_diagram id="…"]` — a brand diagram, drawn not photographed.
	 *
	 * WHY THESE EXIST
	 * Only Gcalls Plus has approved, masked product screenshots. Gcalls CX,
	 * Voicebot and QA/QC have none. Reusing a Gcalls Plus screenshot on those
	 * pages would show a reviewer a different product under the wrong name,
	 * which is worse than showing nothing — so these pages get diagrams of their
	 * own mechanism instead, labelled as illustrations.
	 *
	 * Inline SVG rather than image files: no upload step, no attachment id to go
	 * stale between environments, scales at every breakpoint, and it is text in
	 * the repository so a diff shows what changed.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function diagram( $atts = array() ): string {
		$atts = shortcode_atts( array( 'id' => '', 'caption' => '' ), (array) $atts, 'gcalls_diagram' );
		$id   = sanitize_key( (string) $atts['id'] );

		$brand = '#673ab7';
		$dark  = '#4a2391';
		$light = '#f5f1fc';
		$muted = '#5b5f6b';

		$node = static function ( float $x, float $y, float $w, string $label, bool $filled = false ) use ( $brand, $light, $dark ) {
			$fill   = $filled ? $brand : $light;
			$stroke = $filled ? $dark : $brand;
			$text   = $filled ? '#ffffff' : $dark;

			return sprintf(
				'<g><rect x="%1$s" y="%2$s" width="%3$s" height="46" rx="10" fill="%4$s" stroke="%5$s" stroke-width="1.5"/>' .
				'<text x="%6$s" y="%7$s" text-anchor="middle" font-family="Open Sans, sans-serif" font-size="13" fill="%8$s">%9$s</text></g>',
				$x,
				$y,
				$w,
				$fill,
				$stroke,
				$x + ( $w / 2 ),
				$y + 28,
				$text,
				esc_html( $label )
			);
		};

		$arrow = static function ( float $x1, float $y1, float $x2, float $y2 ) use ( $brand ) {
			return sprintf(
				'<line x1="%1$s" y1="%2$s" x2="%3$s" y2="%4$s" stroke="%5$s" stroke-width="1.5" marker-end="url(#gcallsArrow)"/>',
				$x1,
				$y1,
				$x2,
				$y2,
				$brand
			);
		};

		$body = '';

		switch ( $id ) {
			case 'omnichannel':
				$body  = $node( 10, 20, 150, 'Hotline' ) . $node( 10, 86, 150, 'Zalo OA' ) . $node( 10, 152, 150, 'Facebook' ) . $node( 10, 218, 150, 'Email' );
				$body .= $arrow( 165, 43, 245, 130 ) . $arrow( 165, 109, 245, 130 ) . $arrow( 165, 175, 245, 138 ) . $arrow( 165, 241, 245, 145 );
				$body .= $node( 250, 108, 200, 'Inbox hợp nhất', true );
				$body .= $arrow( 455, 131, 530, 88 ) . $arrow( 455, 131, 530, 178 );
				$body .= $node( 535, 65, 165, 'Ngữ cảnh khách hàng' ) . $node( 535, 155, 165, 'Ticket & SLA' );
				break;

			case 'flow':
				$steps = array( 'Tiếp nhận', 'Nhận diện', 'Xử lý', 'Ghi nhận', 'Báo cáo' );
				$x     = 12;
				foreach ( $steps as $index => $label ) {
					$body .= $node( $x, 110, 122, $label, 0 === $index );
					if ( $index < count( $steps ) - 1 ) {
						$body .= $arrow( $x + 124, 133, $x + 136, 133 );
					}
					$x += 138;
				}
				break;

			case 'handover':
				$body  = $node( 20, 110, 170, 'Voicebot xử lý', true );
				$body .= $arrow( 195, 133, 265, 133 );
				$body .= $node( 270, 110, 170, 'Điều kiện chuyển' );
				$body .= $arrow( 445, 122, 515, 78 ) . $arrow( 445, 145, 515, 188 );
				$body .= $node( 520, 55, 170, 'Nhân viên tiếp nhận' ) . $node( 520, 165, 170, 'Kết thúc & ghi nhận' );
				break;

			case 'scoring':
				$body  = $node( 15, 110, 150, 'Ghi âm cuộc gọi', true );
				$body .= $arrow( 170, 133, 200, 133 );
				$body .= $node( 205, 110, 150, 'Chuyển văn bản' );
				$body .= $arrow( 360, 133, 390, 133 );
				$body .= $node( 395, 110, 150, 'Chấm theo tiêu chí' );
				$body .= $arrow( 550, 133, 580, 133 );
				$body .= $node( 585, 110, 120, 'Tổng hợp' );
				break;

			default:
				return '';
		}

		$caption = '' !== $atts['caption'] ? (string) $atts['caption'] : __( 'Hình minh họa giải pháp', 'gcalls-core' );

		$markup  = '<figure class="gcalls-diagram">';
		$markup .= '<svg viewBox="0 0 715 275" role="img" aria-label="' . esc_attr( $caption ) . '" preserveAspectRatio="xMidYMid meet">';
		$markup .= '<defs><marker id="gcallsArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">';
		$markup .= '<path d="M 0 0 L 10 5 L 0 10 z" fill="' . esc_attr( $brand ) . '"/></marker></defs>';
		$markup .= $body;
		$markup .= '</svg>';
		$markup .= '<figcaption style="color:' . esc_attr( $muted ) . '">' . esc_html( $caption ) . '</figcaption>';
		$markup .= '</figure>';

		return $markup;
	}

	/**
	 * `[gcalls_product_page id="cx"]` — a full product page body.
	 *
	 * The sections, their order and every sentence come from the React source
	 * via wordpress/scripts/build-product-content.mjs. Rendering them from one
	 * generated file rather than pasting them into four WordPress pages means an
	 * editorial change in `src/data/*.ts` reaches the demo by rebuilding, and the
	 * four pages cannot drift apart from each other or from React.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function product_page( $atts = array() ): string {
		$atts = shortcode_atts( array( 'id' => '' ), (array) $atts, 'gcalls_product_page' );
		$id   = sanitize_key( str_replace( '-', '_', (string) $atts['id'] ) );
		$id   = str_replace( '_', '-', $id );

		$file = GCALLS_CORE_DIR . 'data/product-pages.json';

		if ( ! is_readable( $file ) ) {
			return '';
		}

		$data = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Bundled plugin data file.

		if ( ! is_array( $data ) || empty( $data['pages'][ $id ] ) ) {
			return '';
		}

		$page = $data['pages'][ $id ];
		$lead = (array) ( $page['lead'] ?? array() );

		wp_enqueue_style( 'gcalls-product', GCALLS_CORE_URL . 'assets/css/product.css', array(), VERSION );

		$out = '<div class="gcalls-product">';

		/* --- hero --- */
		$hero = (array) ( $page['hero'] ?? array() );

		if ( ! empty( $hero['heading'] ) ) {
			$out .= '<section class="gcalls-product__hero">';

			if ( ! empty( $hero['eyebrow'] ) ) {
				$out .= '<p class="gcalls-eyebrow">' . esc_html( $hero['eyebrow'] ) . '</p>';
			}

			$out .= '<p class="gcalls-product__hero-title">' . esc_html( $hero['heading'] ) . '</p>';

			if ( ! empty( $hero['lead'] ) ) {
				$out .= '<p class="gcalls-product__hero-lead">' . esc_html( $hero['lead'] ) . '</p>';
			}

			if ( ! empty( $hero['points'] ) ) {
				$out .= '<ul class="gcalls-product__points">';
				foreach ( (array) $hero['points'] as $point ) {
					$out .= '<li>' . esc_html( (string) $point ) . '</li>';
				}
				$out .= '</ul>';
			}

			$out .= self::cta(
				array(
					'label'    => __( 'Đăng ký tư vấn', 'gcalls-core' ),
					'intent'   => (string) ( $lead['intent'] ?? 'consultation' ),
					'source'   => (string) ( $lead['source'] ?? '' ),
					'product'  => (string) ( $lead['product'] ?? '' ),
					'solution' => '',
					'style'    => 'primary',
					'note'     => '',
				)
			);

			$out .= '</section>';
		}

		/* --- sections --- */
		foreach ( (array) ( $page['sections'] ?? array() ) as $index => $section ) {
			$alt  = 0 === $index % 2 ? '' : ' gcalls-product__section--alt';
			$out .= '<section class="gcalls-product__section' . $alt . '">';

			if ( ! empty( $section['eyebrow'] ) ) {
				$out .= '<p class="gcalls-eyebrow">' . esc_html( $section['eyebrow'] ) . '</p>';
			}
			if ( ! empty( $section['heading'] ) ) {
				$out .= '<h2 class="gcalls-product__heading">' . esc_html( $section['heading'] ) . '</h2>';
			}
			if ( ! empty( $section['lead'] ) ) {
				$out .= '<p class="gcalls-product__lead">' . esc_html( $section['lead'] ) . '</p>';
			}

			// A screenshot only where one was actually produced and approved for
			// THIS product; otherwise a diagram of the mechanism.
			if ( ! empty( $section['media'] ) ) {
				$out .= self::media( array( 'id' => (string) $section['media'], 'size' => 'large' ) );
			} elseif ( ! empty( $section['mockup'] ) ) {
				$out .= Mockups::render( array( 'id' => (string) $section['mockup'] ) );
			} elseif ( ! empty( $section['diagram'] ) ) {
				$out .= self::diagram( array( 'id' => (string) $section['diagram'] ) );
			}

			if ( ! empty( $section['items'] ) ) {
				$out .= '<div class="gcalls-product__grid">';
				foreach ( (array) $section['items'] as $item ) {
					$out .= '<article class="gcalls-product__card">';
					if ( ! empty( $item['label'] ) ) {
						$out .= '<span class="gcalls-badge">' . esc_html( (string) $item['label'] ) . '</span>';
					}
					if ( ! empty( $item['title'] ) ) {
						$out .= '<h3 class="gcalls-product__card-title">' . esc_html( (string) $item['title'] ) . '</h3>';
					}
					if ( ! empty( $item['body'] ) ) {
						$out .= '<p class="gcalls-product__card-body">' . esc_html( (string) $item['body'] ) . '</p>';
					}
					$out .= '</article>';
				}
				$out .= '</div>';
			}

			$out .= '</section>';
		}

		/* --- FAQ, then the ask --- */
		$out .= self::faq();

		$out .= '<section class="gcalls-product__final">';
		$out .= '<h2 class="gcalls-product__heading">' . esc_html__( 'Trao đổi cấu hình phù hợp với đội ngũ của bạn', 'gcalls-core' ) . '</h2>';
		$out .= self::cta(
			array(
				'label'    => __( 'Đăng ký tư vấn', 'gcalls-core' ),
				'intent'   => (string) ( $lead['intent'] ?? 'consultation' ),
				'source'   => (string) ( $lead['source'] ?? '' ),
				'product'  => (string) ( $lead['product'] ?? '' ),
				'solution' => '',
				'style'    => 'primary',
				'note'     => __( 'Gcalls trao đổi về quy mô, hệ thống đang dùng và quy trình vận hành trước khi đề xuất cấu hình.', 'gcalls-core' ),
			)
		);
		$out .= '</section>';

		$out .= '</div>';

		return $out;
	}
}
