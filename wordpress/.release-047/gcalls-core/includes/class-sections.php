<?php
/**
 * Semantic section renderer — GCALLS-036B.
 *
 * WHAT WAS WRONG
 * The previous renderer put every section through one wrapper
 * (`.gcalls-product__section`, plus `--alt` on every other one) and one grid
 * (`.gcalls-product__grid`, `repeat(auto-fit, …)`). Measured against the React
 * reference on 2026-09-01 that produced, on /gcalls-plus-webphone/: 9 grids
 * where React has 22, zero SVG icons where React has 69, zero two-column
 * feature splits where React has three, six different vertical paddings down
 * one page, and empty 0px grid tracks on three sections. The words were right
 * and the page still read as raw, because fourteen different meanings were
 * being drawn with one component.
 *
 * WHAT DECIDES THE COMPONENT
 * The manifest has carried a semantic id per section all along — `source` on
 * product pages (`GP_WORKFLOW`, `CX_INBOX`, `QQ_SCORING`), `from` on content
 * pages. That id, and nothing else, chooses the component. Specifically NOT:
 * the heading text, the lead text, or the number of items on its own. Guessing
 * from copy is how a "Bảng giá" heading ends up styled as a pricing table on
 * one page and a card wall on the next.
 *
 * THE ID NEVER REACHES THE MARKUP
 * `source` is looked up in an allowlist (data/section-components.json) that
 * yields a fixed component name and a fixed class string. A source that is not
 * in the allowlist is UNMAPPED_SOURCE: it renders nothing and is recorded. It
 * does not fall back to a generic grid, because a silent fallback is exactly
 * how the card wall survived four checkpoints without anyone seeing it in a
 * diff.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Chooses and draws one page's sections.
 */
final class Sections {

	/**
	 * Cached contract, or null before the first read.
	 *
	 * @var array<string, mixed>|null
	 */
	private static ?array $contract = null;

	/**
	 * Sources seen at render time with no allowlist entry.
	 *
	 * @var array<int, string>
	 */
	private static array $unmapped = array();

	/**
	 * Sources whose manifest entry carried a heading and no body.
	 *
	 * @var array<int, string>
	 */
	private static array $empty = array();

	/**
	 * Loads the shared PHP/Node contract.
	 *
	 * @return array<string, mixed>
	 */
	public static function contract(): array {
		if ( null !== self::$contract ) {
			return self::$contract;
		}

		$file = GCALLS_CORE_DIR . 'data/section-components.json';

		if ( ! is_readable( $file ) ) {
			self::$contract = array(
				'product' => array(),
				'content' => array(),
			);

			return self::$contract;
		}

		$decoded = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Bundled plugin data file.

		self::$contract = is_array( $decoded ) ? $decoded : array(
			'product' => array(),
			'content' => array(),
		);

		return self::$contract;
	}

	/**
	 * Sources that had no mapping during this request.
	 *
	 * @return array<int, string>
	 */
	public static function unmapped(): array {
		return self::$unmapped;
	}

	/**
	 * Sources dropped this request for having no body content.
	 *
	 * @return array<int, string>
	 */
	public static function empty_sources(): array {
		return self::$empty;
	}

	/**
	 * Resolves one section's placement.
	 *
	 * @param string $source Semantic source id.
	 * @param string $family 'product' or 'content'.
	 * @return array<string, mixed>|null Null when unmapped.
	 */
	public static function resolve( string $source, string $family = 'product' ): ?array {
		$contract = self::contract();
		$table    = isset( $contract[ $family ] ) && is_array( $contract[ $family ] ) ? $contract[ $family ] : array();

		if ( '' === $source || ! isset( $table[ $source ] ) || ! is_array( $table[ $source ] ) ) {
			if ( '' !== $source && ! in_array( $source, self::$unmapped, true ) ) {
				self::$unmapped[] = $source;
			}

			return null;
		}

		return $table[ $source ];
	}

	/**
	 * Renders the body sections of a product page.
	 *
	 * The final CTA band is NOT rendered here. Every product page carries both
	 * a `*_FINAL_CTA` section and a separate `finalCta` object, and rendering
	 * both is what put the same CTA heading on the page twice — once with no
	 * buttons at all. The allowlist marks those sections `skip`; the caller
	 * draws `finalCta` once.
	 *
	 * @param array<string, mixed> $page Manifest page.
	 * @return string
	 */
	public static function render_product_sections( array $page ): string {
		$out      = '';
		$sections = isset( $page['sections'] ) && is_array( $page['sections'] ) ? $page['sections'] : array();
		$index    = 0;

		foreach ( $sections as $section ) {
			if ( ! is_array( $section ) ) {
				continue;
			}

			$source = isset( $section['source'] ) ? (string) $section['source'] : '';
			$plan   = self::resolve( $source, 'product' );

			if ( null === $plan ) {
				continue;
			}

			$component = isset( $plan['component'] ) ? (string) $plan['component'] : '';

			if ( 'skip' === $component ) {
				continue;
			}

			$markup = self::render_component( $component, $section, $plan, $index );

			if ( '' === $markup ) {
				continue;
			}

			$out .= $markup;
			++$index;
		}

		return $out;
	}

	/**
	 * Dispatches one section to its component.
	 *
	 * @param string               $component Component name.
	 * @param array<string, mixed> $section   Manifest section.
	 * @param array<string, mixed> $plan      Allowlist entry.
	 * @param int                  $index     Zero-based render index, for banding.
	 * @return string
	 */
	private static function render_component( string $component, array $section, array $plan, int $index ): string {
		$icon = isset( $plan['icon'] ) ? (string) $plan['icon'] : '';
		$mod  = isset( $plan['modifier'] ) ? (string) $plan['modifier'] : '';

		switch ( $component ) {
			case 'split':
				$body = self::split_body( $section, $plan, $icon );
				break;
			case 'steps':
				$body = self::steps( $section, $mod, $icon );
				break;
			case 'vendors':
				$body = self::vendors( $section, $icon );
				break;
			case 'trustbar':
				$body = self::trustbar( $section, $icon );
				break;
			case 'cta':
				$body = self::inline_cta( $section );
				break;
			case 'prose':
				$body = self::prose( $section );
				break;
			case 'comparison':
				$body = self::comparison( $section );
				break;
			case 'taglist':
				$body = self::taglist( $section, $icon );
				break;
			case 'related':
				$body = self::grid( $section, 'gc-related', $icon );
				break;
			case 'groups':
				$body = self::groups( $section, $icon );
				break;
			case 'decision':
				$body = self::decision( $section );
				break;
			case 'placeholder':
				$body = self::placeholder( $section );
				break;
			case 'diagram':
				$body = self::prose( $section );
				break;
			case 'grid':
			case 'usecases':
			default:
				$body = self::grid( $section, $mod, $icon );
				break;
		}

		/*
		 * Some sections carry a heading and a lead paragraph and no items at
		 * all — GP_INTEGRATION, GP_BOUNDARIES, GP_PRICING, GP_STORY and
		 * VB_HUMAN_AI among them. Leaving the lead in the section header makes
		 * the section read as a heading standing on its own with a caption
		 * under it. The lead IS the content in that case, so it is promoted to
		 * a prose block at reading width and the header drops it.
		 */
		$lead_only = false;

		if ( '' === $body ) {
			$lead = isset( $section['lead'] ) ? trim( (string) $section['lead'] ) : '';

			if ( '' !== $lead ) {
				$body      = '<div class="gc-prose"><p>' . esc_html( $lead ) . '</p></div>';
				$lead_only = true;
			}
		}

		/*
		 * Still nothing under the heading. Four sections are in this state —
		 * GP_BOUNDARIES, GP_STORY, CX_BOUNDARIES and QQ_BOUNDARIES — because
		 * the export never captured their bodies, not because the renderer
		 * lost them: React draws real cards there. Rendering the heading alone
		 * would produce exactly the orphan the acceptance list bans, and
		 * writing replacement copy here would be inventing content. So the
		 * section is dropped and the source is recorded for the exporter.
		 */
		if ( '' === $body && empty( $section['cta'] ) ) {
			$source = isset( $section['source'] ) ? (string) $section['source'] : '';

			if ( '' !== $source && ! in_array( $source, self::$empty, true ) ) {
				self::$empty[] = $source;
			}

			return '';
		}

		$body  .= self::section_cta( $section );
		$header = self::header( $section, 'split' === $component, $lead_only );

		if ( '' === $header && '' === $body ) {
			return '';
		}

		return self::shell( $header . $body, $component, $index );
	}

	/**
	 * Section shell. The band is a full-bleed background, not a rounded panel:
	 * bands butt against each other so alternation reads as rhythm rather than
	 * as a stack of floating boxes.
	 *
	 * @param string $inner     Section contents.
	 * @param string $component Component name, for the modifier.
	 * @param int    $index     Render index.
	 * @return string
	 */
	private static function shell( string $inner, string $component, int $index ): string {
		$classes = 'gc-section gc-section--' . sanitize_html_class( $component );

		if ( 1 === $index % 2 ) {
			$classes .= ' gc-section--alt';
		}

		return sprintf(
			'<section class="%s"><div class="gc-container">%s</div></section>',
			esc_attr( $classes ),
			$inner
		);
	}

	/**
	 * Eyebrow / heading / description.
	 *
	 * @param array<string, mixed> $section  Manifest section.
	 * @param bool                 $bare      True inside a split, where the header
	 *                                        is one column rather than the page head.
	 * @param bool                 $drop_lead True when the lead has been promoted to
	 *                                        the section body instead.
	 * @return string
	 */
	private static function header( array $section, bool $bare = false, bool $drop_lead = false ): string {
		$eyebrow = isset( $section['eyebrow'] ) ? trim( (string) $section['eyebrow'] ) : '';
		$heading = isset( $section['heading'] ) ? trim( (string) $section['heading'] ) : '';
		$lead    = isset( $section['lead'] ) ? trim( (string) $section['lead'] ) : '';

		if ( '' === $heading ) {
			return '';
		}

		$out = '<div class="gc-head' . ( $bare ? ' gc-head--bare' : '' ) . '">';

		if ( '' !== $eyebrow ) {
			$out .= '<p class="gc-head__eyebrow">' . esc_html( $eyebrow ) . '</p>';
		}

		$out .= '<h2 class="gc-head__title">' . esc_html( $heading ) . '</h2>';

		if ( '' !== $lead && ! $drop_lead ) {
			$out .= '<p class="gc-head__desc">' . esc_html( $lead ) . '</p>';
		}

		return $out . '</div>';
	}

	/**
	 * Feature split: copy on one side, visual on the other.
	 *
	 * The visual is whatever the manifest already declares — a mockup drawn by
	 * Mockups::render, a diagram, or an approved screenshot. All eleven mockup
	 * ids the manifest references already have implementations; the previous
	 * renderer simply stacked them full-width under the copy instead of beside
	 * it, so this is a placement fix, not new artwork.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param array<string, mixed> $plan    Allowlist entry.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function split_body( array $section, array $plan, string $icon ): string {
		$visual = self::visual( $section, $plan );

		if ( '' === $visual ) {
			// No visual to sit beside: fall back to the checklist alone rather
			// than an empty second column.
			return self::checklist( $section, $icon );
		}

		$reverse = ! empty( $section['reverse'] ) ? ' gc-split--reverse' : '';

		return sprintf(
			'<div class="gc-split%s"><div class="gc-split__copy">%s</div><div class="gc-split__visual">%s</div></div>',
			esc_attr( $reverse ),
			self::checklist( $section, $icon ),
			$visual
		);
	}

	/**
	 * The visual half of a split, in the order the manifest prefers.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param array<string, mixed> $plan    Allowlist entry, which may carry a
	 *                                      substituted mockup for a section whose
	 *                                      screenshot is not approved.
	 * @return string
	 */
	private static function visual( array $section, array $plan = array() ): string {
		$mockup_id = ! empty( $section['mockup'] ) ? (string) $section['mockup'] : '';

		if ( '' === $mockup_id && ! empty( $plan['mockup'] ) && ! empty( $plan['mockupSubstituted'] ) ) {
			$mockup_id = (string) $plan['mockup'];
		}

		if ( '' !== $mockup_id && class_exists( __NAMESPACE__ . '\\Mockups' ) ) {
			$mockup = Mockups::render( array( 'id' => $mockup_id ) );

			if ( '' !== $mockup ) {
				return '<figure class="gc-diagram"><div class="gc-diagram__canvas">' . $mockup .
					'</div><figcaption class="gc-diagram__label">' .
					esc_html__( 'Giao diện minh hoạ', 'gcalls-core' ) . '</figcaption></figure>';
			}
		}

		if ( ! empty( $section['diagram'] ) ) {
			$diagram = Shortcodes::diagram( array( 'id' => (string) $section['diagram'] ) );

			if ( '' !== $diagram ) {
				return '<figure class="gc-diagram"><div class="gc-diagram__canvas">' . $diagram .
					'</div><figcaption class="gc-diagram__label">' .
					esc_html__( 'Giao diện minh hoạ', 'gcalls-core' ) . '</figcaption></figure>';
			}
		}

		$source = isset( $section['source'] ) ? (string) $section['source'] : '';

		if ( ! empty( $section['media'] ) && self::media_is_approved( (string) $section['media'], $source ) ) {
			$img = Shortcodes::media( array( 'id' => (string) $section['media'], 'size' => 'large' ) );

			if ( '' !== $img ) {
				return '<figure class="gc-shot">' . $img . '<figcaption>' .
					esc_html__( 'Giao diện Gcalls — dữ liệu đã được ẩn danh', 'gcalls-core' ) .
					'</figcaption></figure>';
			}
		}

		return '';
	}

	/**
	 * Media allowlist.
	 *
	 * Only screenshots that have cleared the PII gate may be rendered. Five
	 * `-v1` derivatives are known to leak and have `-v2` replacements waiting;
	 * seven more `-v1` files on the same page have never been through any gate
	 * at all and are treated as UNAPPROVED, not as safe-by-default. Until a
	 * media id is on this list the section falls back to its diagram, which is
	 * why the renderer is not blocked on the image audit.
	 *
	 * @param string $media_id Manifest media id.
	 * @return bool
	 */
	private static function media_is_approved( string $media_id, string $source = '' ): bool {
		$contract = self::contract();
		$list     = isset( $contract['approvedMedia']['approved'] ) && is_array( $contract['approvedMedia']['approved'] )
			? array_keys( $contract['approvedMedia']['approved'] )
			: array();

		/**
		 * Filters the approved screenshot ids.
		 *
		 * The default comes from the contract, so approving an image is a data
		 * change with a recorded reason rather than a code change. The filter
		 * exists to REVOKE quickly if something is found live; adding to it
		 * without adding to the contract leaves no audit trail.
		 *
		 * @param array<int, string> $list Media ids cleared for rendering.
		 */
		$approved = (array) apply_filters( 'gcalls_approved_media', $list );

		if ( ! in_array( $media_id, $approved, true ) ) {
			return false;
		}

		/*
		 * An approved image can still be the wrong image for THIS section.
		 * Two of the seven show an empty interface — an activity list with no
		 * activity, an integration table with no rows. Under a heading about
		 * getting started that is accurate; under "the functions your operation
		 * needs" it illustrates a capability claim with a picture of nothing.
		 */
		$empty = isset( $contract['approvedMedia']['emptyState'] ) && is_array( $contract['approvedMedia']['emptyState'] )
			? $contract['approvedMedia']['emptyState']
			: array();

		if ( isset( $empty[ $media_id ]['allowedSections'] ) && is_array( $empty[ $media_id ]['allowedSections'] ) ) {
			return '' !== $source && in_array( $source, $empty[ $media_id ]['allowedSections'], true );
		}

		return true;
	}

	/**
	 * Bulleted points beside a visual.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function checklist( array $section, string $icon ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$out = '<ul class="gc-checks">';

		foreach ( $items as $item ) {
			$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
			$body  = isset( $item['body'] ) ? trim( (string) $item['body'] ) : '';

			if ( '' === $title && '' === $body ) {
				continue;
			}

			$out .= '<li><span class="gc-iconbox gc-iconbox--round">' . Icons::render( 'check' ) . '</span><span>';

			if ( '' !== $title ) {
				$out .= '<strong>' . esc_html( $title ) . '</strong>';
			}

			if ( '' !== $body ) {
				$out .= ( '' !== $title ? ' ' : '' ) . esc_html( $body );
			}

			$out .= '</span></li>';
		}

		unset( $icon );

		return $out . '</ul>';
	}

	/**
	 * Typed card grid. The column count comes from the contract, which derived
	 * it from the React reference and the validated item count — never from
	 * `auto-fit`, which is what produced 0px empty tracks and put six cards
	 * into five columns.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $mod     Grid class from the contract.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function grid( array $section, string $mod, string $icon ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$out = '<div class="' . esc_attr( self::grid_class( $mod, count( $items ) ) ) . '">';

		foreach ( $items as $item ) {
			$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
			$body  = isset( $item['body'] ) ? trim( (string) $item['body'] ) : '';
			$label = isset( $item['label'] ) ? trim( (string) $item['label'] ) : '';
			$href  = isset( $item['href'] ) ? trim( (string) $item['href'] ) : '';

			$out .= '<article class="gc-card">';

			if ( '' !== $icon ) {
				$out .= '<span class="gc-iconbox">' . Icons::render( $icon ) . '</span>';
			}

			if ( '' !== $label ) {
				$out .= '<span class="gc-badge">' . esc_html( $label ) . '</span>';
			}

			/*
			 * A card that carries a destination must BE a link. The "Xem thêm"
			 * blocks on the hub pages are pure navigation — every card has an
			 * href and an empty body — and this renderer dropped the href, so
			 * the section rendered as a heading over five dead labels. Kept
			 * byte-for-byte in step with grid() in section-contract.mjs.
			 */
			if ( '' !== $title ) {
				$out .= '<h3 class="gc-card__title">';
				$out .= '' !== $href
					? '<a href="' . esc_url( $href ) . '">' . esc_html( $title ) . '</a>'
					: esc_html( $title );
				$out .= '</h3>';
			}

			if ( '' !== $body ) {
				$out .= '<p class="gc-card__body">' . esc_html( $body ) . '</p>';
			}

			$out .= '</article>';
		}

		return $out . '</div>';
	}

	/**
	 * Reconciles the contract's column count with the real item count, so a
	 * manifest edit cannot leave a row with one card stranded in a four-column
	 * grid.
	 *
	 * @param string $mod   Contract class, e.g. 'gc-grid gc-grid--3'.
	 * @param int    $count Item count.
	 * @return string
	 */
	private static function grid_class( string $mod, int $count ): string {
		$rules = self::rules();
		$table = isset( $rules['gridColumnsByCount'] ) && is_array( $rules['gridColumnsByCount'] )
			? $rules['gridColumnsByCount']
			: array();

		$cols = isset( $table[ (string) $count ] ) ? (int) $table[ (string) $count ] : 3;

		if ( preg_match( '/gc-grid--(\d)/', $mod, $m ) ) {
			// The contract's per-source count wins where it has one; the table
			// is the fallback and the clamp.
			$cols = (int) $m[1];

			if ( isset( $table[ (string) $count ] ) && $count <= 4 ) {
				$cols = (int) $table[ (string) $count ];
			}
		}

		if ( ! empty( $rules['clampColumnsToItemCount'] ) && $count > 0 && $count < $cols ) {
			$cols = $count;
		}

		return 'gc-grid gc-grid--' . max( 1, $cols );
	}

	/**
	 * Shared reconciliation rules.
	 *
	 * @return array<string, mixed>
	 */
	private static function rules(): array {
		$contract = self::contract();

		return isset( $contract['rules'] ) && is_array( $contract['rules'] ) ? $contract['rules'] : array();
	}

	/**
	 * Ordered process steps. An <ol> because the order is the content.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $mod     Contract class.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function steps( array $section, string $mod, string $icon ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$rules = self::rules();
		$cols  = 3;

		if ( preg_match( '/gc-steps--(\d)/', $mod, $m ) ) {
			$cols = (int) $m[1];
		}

		$max  = isset( $rules['stepsMaxColumns'] ) ? (int) $rules['stepsMaxColumns'] : 5;
		$cols = min( $cols, $max, max( 1, count( $items ) ) );
		$out  = '<ol class="gc-steps gc-steps--' . (int) $cols . '">';

		foreach ( $items as $item ) {
			$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
			$body  = isset( $item['body'] ) ? trim( (string) $item['body'] ) : '';

			$out .= '<li class="gc-steps__item">';

			if ( '' !== $title ) {
				$out .= '<h3 class="gc-card__title">' . esc_html( $title ) . '</h3>';
			}

			if ( '' !== $body ) {
				$out .= '<p class="gc-card__body">' . esc_html( $body ) . '</p>';
			}

			$out .= '</li>';
		}

		unset( $icon );

		return $out . '</ol>';
	}

	/**
	 * Integration / vendor grid.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function vendors( array $section, string $icon ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$out = '<div class="gc-vendors">';

		foreach ( $items as $item ) {
			$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';

			if ( '' === $title ) {
				continue;
			}

			$out .= '<div class="gc-vendors__item"><span class="gc-iconbox">' . Icons::render( $icon ) .
				'</span><span class="gc-vendors__name">' . esc_html( $title ) . '</span></div>';
		}

		return $out . '</div>';
	}

	/**
	 * Trust / context bar.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function trustbar( array $section, string $icon ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$out = '<div class="gc-trustbar">';

		foreach ( $items as $item ) {
			$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';

			if ( '' === $title ) {
				continue;
			}

			$out .= '<span class="gc-trustbar__item">' . Icons::render( $icon ) . esc_html( $title ) . '</span>';
		}

		return $out . '</div>';
	}

	/**
	 * A mid-page CTA band (pricing sections use this). It is NOT the page's
	 * final CTA and must not be counted as one: it carries its own class so the
	 * acceptance check can tell them apart.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function inline_cta( array $section ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		return self::grid( $section, 'gc-grid gc-grid--2', 'tag' );
	}

	/**
	 * A section's own calls to action.
	 *
	 * Only four section types carry one, because that is what React does: the
	 * pricing sections (estimator and price list), and the one mid-page ask
	 * each on CX and QA/QC. Rendering the same button under every heading is
	 * the failure this is written to avoid — a reader who sees "Đăng ký tư vấn"
	 * eleven times stops seeing it.
	 *
	 * A lead CTA goes through Shortcodes::lead_href(), which is the only place
	 * attribution is assembled and which accepts exactly four keys: intent,
	 * source, product, solution. A manifest therefore cannot add a query
	 * parameter, only fill one of those four. Anything else is a plain link and
	 * is escaped as a URL.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function section_cta( array $section ): string {
		$ctas = isset( $section['cta'] ) && is_array( $section['cta'] ) ? $section['cta'] : array();

		if ( empty( $ctas ) ) {
			return '';
		}

		$out   = '';
		$first = true;

		foreach ( $ctas as $cta ) {
			$label = isset( $cta['label'] ) ? trim( (string) $cta['label'] ) : '';

			if ( '' === $label ) {
				continue;
			}

			if ( isset( $cta['href'] ) && '' !== (string) $cta['href'] ) {
				$href = esc_url( (string) $cta['href'] );
			} else {
				$href = esc_url(
					Shortcodes::lead_href(
						array(
							'intent'   => (string) ( $cta['intent'] ?? '' ),
							'source'   => (string) ( $cta['source'] ?? '' ),
							'product'  => (string) ( $cta['product'] ?? '' ),
							'solution' => (string) ( $cta['solution'] ?? '' ),
						)
					)
				);
			}

			if ( '' === $href ) {
				continue;
			}

			$style = $first ? 'gc-btn--primary' : 'gc-btn--ghost';
			$out  .= '<a class="gc-btn ' . $style . '" href="' . $href . '">' . esc_html( $label ) . '</a>';
			$first = false;
		}

		return '' === $out ? '' : '<div class="gc-ctarow gc-ctarow--section">' . $out . '</div>';
	}

	/**
	 * Two labelled groups side by side.
	 *
	 * GP_BOUNDARIES is "who this suits" against "what to move to when you
	 * outgrow it". Flattening the two into one list loses the contrast that is
	 * the whole section, so they stay two lists.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function groups( array $section, string $icon ): string {
		$groups = isset( $section['groups'] ) && is_array( $section['groups'] ) ? $section['groups'] : array();

		if ( empty( $groups ) ) {
			return '';
		}

		$out = '<div class="gc-groups">';

		foreach ( $groups as $group ) {
			if ( empty( $group['items'] ) || ! is_array( $group['items'] ) ) {
				continue;
			}

			$out .= '<div class="gc-groups__col">';

			if ( ! empty( $group['label'] ) ) {
				$out .= '<p class="gc-groups__label">' . esc_html( (string) $group['label'] ) . '</p>';
			}

			$out .= '<ul class="gc-groups__list">';

			foreach ( $group['items'] as $item ) {
				$title = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
				$body  = isset( $item['body'] ) ? trim( (string) $item['body'] ) : '';
				$href  = isset( $item['href'] ) ? trim( (string) $item['href'] ) : '';

				if ( '' === $title && '' === $body ) {
					continue;
				}

				$out .= '<li><span class="gc-iconbox gc-iconbox--round">' . Icons::render( $icon ) . '</span><span>';
				$out .= '' !== $title ? '<strong>' . esc_html( $title ) . '</strong>' : '';

				if ( '' !== $body ) {
					$out .= '' !== $href
						? ' <a href="' . esc_url( $href ) . '">' . esc_html( $body ) . '</a>'
						: ' ' . esc_html( $body );
				}

				$out .= '</span></li>';
			}

			$out .= '</ul></div>';
		}

		return $out . '</div>';
	}

	/**
	 * A decision table: a need on the left, the product that answers it on the
	 * right, linked.
	 *
	 * These links are NAVIGATION, not lead capture. They carry no attribution
	 * parameters and the CTA inventory counts them apart from conversion CTAs,
	 * because turning them into contact links would put five more asks on a
	 * page whose job at that point is to send the reader somewhere better.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function decision( array $section ): string {
		$items = self::items( $section );

		if ( empty( $items ) ) {
			return '';
		}

		$out = '<ul class="gc-decision">';

		foreach ( $items as $item ) {
			$need    = isset( $item['title'] ) ? trim( (string) $item['title'] ) : '';
			$product = isset( $item['body'] ) ? trim( (string) $item['body'] ) : '';
			$href    = isset( $item['href'] ) ? trim( (string) $item['href'] ) : '';

			if ( '' === $need && '' === $product ) {
				continue;
			}

			$out .= '<li class="gc-decision__row"><span class="gc-decision__need">' . esc_html( $need ) . '</span>';
			$out .= '<span class="gc-decision__answer">' . Icons::render( 'arrow' );

			$out .= '' !== $href && '' !== $product
				? '<a href="' . esc_url( $href ) . '">' . esc_html( $product ) . '</a>'
				: esc_html( $product );

			$out .= '</span></li>';
		}

		return $out . '</ul>';
	}

	/**
	 * A section that is empty on purpose.
	 *
	 * GP_STORY has no customer story because none is approved for publication,
	 * and React says so on the page rather than hiding the section. Rendering
	 * an invented story here would be the exact failure the claim guard exists
	 * to prevent, and hiding the section would lose copy the reference shows.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function placeholder( array $section ): string {
		$text = isset( $section['placeholder'] ) ? trim( (string) $section['placeholder'] ) : '';

		if ( '' === $text ) {
			return '';
		}

		$out = '<div class="gc-placeholder"><p class="gc-placeholder__text">' . esc_html( $text ) . '</p>';

		if ( ! empty( $section['placeholderNote'] ) ) {
			$out .= '<p class="gc-placeholder__note">' . esc_html( (string) $section['placeholderNote'] ) . '</p>';
		}

		if ( ! empty( $section['link']['label'] ) && ! empty( $section['link']['href'] ) ) {
			$out .= '<p class="gc-placeholder__link"><a href="' . esc_url( (string) $section['link']['href'] ) . '">' .
				esc_html( (string) $section['link']['label'] ) . '</a></p>';
		}

		return $out . '</div>';
	}

	/**
	 * A prose block. Content pages carry their direct answer here with no
	 * heading at all, so this must render on `body` alone — dropping it because
	 * there is no heading is how the answer-engine paragraph disappears.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function prose( array $section ): string {
		$body = isset( $section['body'] ) ? trim( (string) $section['body'] ) : '';

		if ( '' === $body ) {
			return '';
		}

		return '<div class="gc-prose"><p>' . esc_html( $body ) . '</p></div>';
	}

	/**
	 * Before/after comparison. Two ordered lists side by side, because the
	 * point of the section is that one sequence is longer than the other.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return string
	 */
	private static function comparison( array $section ): string {
		$sides = array();

		foreach ( array( 'before', 'after' ) as $key ) {
			if ( empty( $section[ $key ] ) || ! is_array( $section[ $key ] ) ) {
				continue;
			}

			$side  = $section[ $key ];
			$steps = isset( $side['steps'] ) && is_array( $side['steps'] ) ? $side['steps'] : array();

			if ( empty( $steps ) ) {
				continue;
			}

			$html = '<div class="gc-flow gc-flow--' . sanitize_html_class( $key ) . '">';

			if ( ! empty( $side['label'] ) ) {
				$html .= '<p class="gc-flow__label">' . esc_html( (string) $side['label'] ) . '</p>';
			}

			$html .= '<ol class="gc-flow__steps">';

			foreach ( $steps as $step ) {
				$html .= '<li>' . esc_html( (string) $step ) . '</li>';
			}

			$sides[] = $html . '</ol></div>';
		}

		if ( empty( $sides ) ) {
			return '';
		}

		return '<div class="gc-compare-flow">' . implode( '', $sides ) . '</div>';
	}

	/**
	 * Tag pills. Short labels, so a card each would be mostly padding.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @param string               $icon    Icon key.
	 * @return string
	 */
	private static function taglist( array $section, string $icon ): string {
		$tags = isset( $section['tags'] ) && is_array( $section['tags'] ) ? $section['tags'] : array();

		if ( empty( $tags ) ) {
			return '';
		}

		$out = '<ul class="gc-taglist">';

		foreach ( $tags as $tag ) {
			$label = is_array( $tag ) ? (string) ( $tag['title'] ?? '' ) : (string) $tag;

			if ( '' === trim( $label ) ) {
				continue;
			}

			$out .= '<li class="gc-taglist__item">' . Icons::render( $icon ) . esc_html( $label ) . '</li>';
		}

		return $out . '</ul>';
	}

	/**
	 * Items, whichever key the manifest used.
	 *
	 * @param array<string, mixed> $section Manifest section.
	 * @return array<int, array<string, mixed>>
	 */
	private static function items( array $section ): array {
		foreach ( array( 'items', 'cards', 'steps', 'tags' ) as $key ) {
			if ( isset( $section[ $key ] ) && is_array( $section[ $key ] ) && ! empty( $section[ $key ] ) ) {
				$out = array();

				foreach ( $section[ $key ] as $item ) {
					if ( is_array( $item ) ) {
						$out[] = $item;
					} elseif ( is_string( $item ) ) {
						$out[] = array( 'title' => $item );
					}
				}

				if ( ! empty( $out ) ) {
					return $out;
				}
			}
		}

		return array();
	}
}
