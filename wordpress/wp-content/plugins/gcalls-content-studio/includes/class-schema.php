<?php
/**
 * The single source of truth for which routes/sections are editable, and how
 * each field is sanitized and validated. Nothing outside this class decides
 * what a field is allowed to contain — REST, the admin screen and the CPT
 * layer all defer to it.
 *
 * Adding a new section later means adding one entry to ROUTES() and one
 * field-schema method here. Nothing else in the plugin needs to change shape.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Schema {

	/**
	 * Route allowlist. Keys are the stable route slugs used everywhere in
	 * this plugin (post_name, REST path segment, preview query var); values
	 * carry the React path and human label. This is intentionally static —
	 * the REST layer refuses any route not listed here, which is the
	 * "strict route allowlist" requirement.
	 *
	 * @return array<string, array{path: string, label: string, sections: array<string, string>}>
	 */
	public static function routes(): array {
		return array(
			'home' => array(
				'path'     => '/',
				'label'    => 'Trang chủ',
				'sections' => array(
					'hero' => 'Hero',
				),
			),
		);
	}

	public static function route_exists( string $route ): bool {
		return isset( self::routes()[ $route ] );
	}

	public static function section_exists( string $route, string $section ): bool {
		return isset( self::routes()[ $route ]['sections'][ $section ] );
	}

	/**
	 * Field schema for one section. Each field declares a `type` the REST
	 * and admin layers both understand: text, textarea, url, list, image,
	 * bool. No field type here is "html" or "css" — that is deliberate, per
	 * the "no raw HTML/CSS controls" requirement.
	 *
	 * @return array<string, array{type: string, label: string, max_len?: int, max_items?: int, required?: bool}>|null
	 */
	public static function fields( string $route, string $section ): ?array {
		if ( 'home' === $route && 'hero' === $section ) {
			return self::hero_fields();
		}
		return null;
	}

	/** @return array<string, array{type: string, label: string, max_len?: int, max_items?: int, required?: bool}> */
	private static function hero_fields(): array {
		return array(
			'enabled'            => array( 'type' => 'bool', 'label' => 'Hiển thị section' ),
			'badgeText'          => array( 'type' => 'text', 'label' => 'Badge text', 'max_len' => 40 ),
			'heading'            => array( 'type' => 'text', 'label' => 'Main heading', 'max_len' => 160, 'required' => true ),
			'headingHighlight'   => array( 'type' => 'text', 'label' => 'Highlighted heading text', 'max_len' => 80 ),
			'description'        => array( 'type' => 'textarea', 'label' => 'Description', 'max_len' => 600 ),
			'primaryCtaLabel'    => array( 'type' => 'text', 'label' => 'Primary CTA label', 'max_len' => 60 ),
			'primaryCtaUrl'      => array( 'type' => 'url', 'label' => 'Primary CTA URL' ),
			'secondaryCtaLabel'  => array( 'type' => 'text', 'label' => 'Secondary CTA label', 'max_len' => 60 ),
			'secondaryCtaUrl'    => array( 'type' => 'url', 'label' => 'Secondary CTA URL' ),
			'checklist'          => array( 'type' => 'list', 'label' => 'Checklist items', 'max_items' => 6, 'max_len' => 100 ),
			'heroImage'          => array( 'type' => 'image', 'label' => 'Hero image' ),
			'heroImageAlt'       => array( 'type' => 'text', 'label' => 'Hero image alt text', 'max_len' => 160 ),
			'heroImageDecorative'=> array( 'type' => 'bool', 'label' => 'Hero image is decorative' ),
			'disclaimerText'     => array( 'type' => 'text', 'label' => 'Disclaimer text', 'max_len' => 220 ),
		);
	}

	/** URL schemes that may appear in a CTA URL. Nothing else, ever. */
	private const ALLOWED_URL_SCHEMES = array( 'http', 'https' );

	/**
	 * Sanitizes and validates a raw field payload against a section's
	 * schema. Unknown keys are dropped, not stored, not echoed back —
	 * "ignore unknown fields" is enforced at write time, not just on read.
	 *
	 * @param array<string, mixed> $raw
	 * @return array{0: array<string, mixed>, 1: array<int, string>} [sanitized, errors]
	 */
	public static function sanitize( string $route, string $section, array $raw ): array {
		$schema = self::fields( $route, $section );
		if ( null === $schema ) {
			return array( array(), array( 'unknown_section' ) );
		}

		$clean  = array();
		$errors = array();

		foreach ( $schema as $key => $field ) {
			if ( ! array_key_exists( $key, $raw ) ) {
				if ( ! empty( $field['required'] ) ) {
					$errors[] = "missing:{$key}";
				}
				continue;
			}

			$value = $raw[ $key ];

			switch ( $field['type'] ) {
				case 'bool':
					$clean[ $key ] = (bool) $value;
					break;

				case 'text':
					$text = sanitize_text_field( (string) $value );
					if ( isset( $field['max_len'] ) && mb_strlen( $text ) > $field['max_len'] ) {
						$errors[] = "too_long:{$key}";
						$text     = mb_substr( $text, 0, $field['max_len'] );
					}
					if ( ! empty( $field['required'] ) && '' === trim( $text ) ) {
						$errors[] = "required:{$key}";
					}
					$clean[ $key ] = $text;
					break;

				case 'textarea':
					// wp_kses_post only for fields that permit limited rich
					// text — this is prose, not markup, so it stays plain.
					$text = sanitize_textarea_field( (string) $value );
					if ( isset( $field['max_len'] ) && mb_strlen( $text ) > $field['max_len'] ) {
						$errors[] = "too_long:{$key}";
						$text     = mb_substr( $text, 0, $field['max_len'] );
					}
					$clean[ $key ] = $text;
					break;

				case 'url':
					$raw_url = trim( (string) $value );
					if ( '' === $raw_url ) {
						$clean[ $key ] = '';
						break;
					}
					$result = self::sanitize_url( $raw_url );
					if ( null === $result ) {
						$errors[] = "invalid_url:{$key}";
						$clean[ $key ] = '';
					} else {
						$clean[ $key ] = $result;
					}
					break;

				case 'list':
					if ( ! is_array( $value ) ) {
						$errors[] = "invalid_list:{$key}";
						$clean[ $key ] = array();
						break;
					}
					$items = array();
					foreach ( array_slice( $value, 0, $field['max_items'] ?? 20 ) as $item ) {
						$item_text = sanitize_text_field( (string) $item );
						if ( isset( $field['max_len'] ) ) {
							$item_text = mb_substr( $item_text, 0, $field['max_len'] );
						}
						if ( '' !== trim( $item_text ) ) {
							$items[] = $item_text;
						}
					}
					$clean[ $key ] = $items;
					break;

				case 'image':
					$clean[ $key ] = self::sanitize_image( $value );
					if ( null === $clean[ $key ] && ! empty( $value ) ) {
						$errors[] = "invalid_image:{$key}";
					}
					break;

				default:
					// Unknown field type in the schema itself is a plugin
					// bug, not user input — fail closed rather than store it.
					$errors[] = "unhandled_type:{$key}";
			}
		}

		// Cross-field rule: an image that is not marked decorative needs
		// meaningful alt text before it may be published. Draft saves are
		// allowed through (the editor is mid-edit); publish() re-checks this.
		return array( $clean, $errors );
	}

	/** Rejects javascript:, data: and any scheme outside the allowlist. */
	public static function sanitize_url( string $url ): ?string {
		$clean = esc_url_raw( $url, self::ALLOWED_URL_SCHEMES );
		if ( '' === $clean ) {
			return null;
		}
		// esc_url_raw() is lenient about relative/internal paths, which is
		// desired (a React route like /gcalls-plus-webphone/ is a valid CTA
		// target). What it must never let through is a scheme mismatch.
		$scheme = wp_parse_url( $clean, PHP_URL_SCHEME );
		if ( null !== $scheme && '' !== $scheme && ! in_array( strtolower( $scheme ), self::ALLOWED_URL_SCHEMES, true ) ) {
			return null;
		}
		return $clean;
	}

	/**
	 * @param mixed $value
	 * @return array{id: int, url: string, width: int, height: int}|null
	 */
	private static function sanitize_image( $value ): ?array {
		if ( empty( $value ) ) {
			return null;
		}
		if ( ! is_array( $value ) || empty( $value['id'] ) ) {
			return null;
		}
		$id = absint( $value['id'] );
		if ( 0 === $id || 'attachment' !== get_post_type( $id ) || ! wp_attachment_is_image( $id ) ) {
			return null;
		}
		$src = wp_get_attachment_image_src( $id, 'full' );
		if ( ! $src ) {
			return null;
		}
		return array(
			'id'     => $id,
			'url'    => esc_url_raw( $src[0] ),
			'width'  => (int) $src[1],
			'height' => (int) $src[2],
		);
	}

	/**
	 * Publish-time rule that draft saves don't need to satisfy: an image
	 * that isn't decorative must carry alt text.
	 *
	 * @param array<string, mixed> $content
	 * @return array<int, string> errors, empty when publishable
	 */
	public static function publish_errors( string $route, string $section, array $content ): array {
		$errors = array();
		$schema = self::fields( $route, $section );
		if ( null === $schema ) {
			return array( 'unknown_section' );
		}
		foreach ( $schema as $key => $field ) {
			if ( ! empty( $field['required'] ) && ( '' === trim( (string) ( $content[ $key ] ?? '' ) ) ) ) {
				$errors[] = "required:{$key}";
			}
		}
		if ( 'home' === $route && 'hero' === $section ) {
			$has_image   = ! empty( $content['heroImage'] );
			$decorative  = ! empty( $content['heroImageDecorative'] );
			$alt         = trim( (string) ( $content['heroImageAlt'] ?? '' ) );
			if ( $has_image && ! $decorative && '' === $alt ) {
				$errors[] = 'required:heroImageAlt';
			}
		}
		return $errors;
	}
}
