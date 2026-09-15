<?php
/**
 * Generic, manifest-driven sanitization and validation.
 *
 * Nothing here knows what a "hero" is. Every decision — which routes exist,
 * which sections, which fields, what type each field is — comes from the
 * manifest (see Manifest). This class only knows how to clean a value of a
 * given manifest field type, so adding a section in React needs no PHP
 * change at all.
 *
 * @package Gcalls\ContentStudio
 */

declare( strict_types = 1 );

namespace Gcalls\ContentStudio;

defined( 'ABSPATH' ) || exit;

class Schema {

	private const TEXT_TYPES     = array( 'text', 'ctaLabel', 'imageAlt' );
	private const LIST_TYPES     = array( 'repeater', 'cards', 'testimonials' );
	private const ALLOWED_ABS    = array( 'http', 'https' );

	/** Rich text: the whole allowlist. No script, style, iframe, img, on* attributes. */
	private const RICHTEXT_KSES = array(
		'p'      => array(),
		'br'     => array(),
		'strong' => array(),
		'em'     => array(),
		'b'      => array(),
		'i'      => array(),
		'ul'     => array(),
		'ol'     => array(),
		'li'     => array(),
		'a'      => array(
			'href'   => true,
			'title'  => true,
			'rel'    => true,
			'target' => true,
		),
	);

	public static function route_exists( string $route ): bool {
		return Manifest::route_exists( $route );
	}

	public static function section_exists( string $route, string $section ): bool {
		return Manifest::section_exists( $route, $section );
	}

	/** @return array<string, array<string, mixed>>|null */
	public static function fields( string $route, string $section ): ?array {
		return Manifest::fields( $route, $section );
	}

	/**
	 * Sanitizes and validates a raw section payload. Unknown keys are dropped,
	 * never stored, never echoed back.
	 *
	 * @param array<string, mixed> $raw
	 * @return array{0: array<string, mixed>, 1: array<int, string>} [clean, errors]
	 */
	public static function sanitize( string $route, string $section, array $raw ): array {
		$schema = self::fields( $route, $section );
		if ( null === $schema ) {
			return array( array(), array( 'unknown_section' ) );
		}
		return self::sanitize_fields( $schema, $raw, '' );
	}

	/**
	 * @param array<string, array<string, mixed>> $schema
	 * @param array<string, mixed>                $raw
	 * @param string                              $prefix Error-code prefix for nested items ("cards.2." etc.).
	 * @return array{0: array<string, mixed>, 1: array<int, string>}
	 */
	private static function sanitize_fields( array $schema, array $raw, string $prefix ): array {
		$clean  = array();
		$errors = array();

		foreach ( $schema as $key => $field ) {
			if ( ! is_array( $field ) ) {
				continue;
			}
			$type = (string) ( $field['type'] ?? 'text' );
			if ( ! array_key_exists( $key, $raw ) ) {
				if ( ! empty( $field['required'] ) ) {
					$errors[] = "missing:{$prefix}{$key}";
				}
				continue;
			}
			$value = $raw[ $key ];
			$code  = $prefix . $key;

			switch ( $type ) {
				case 'toggle':
				case 'decorative':
					$clean[ $key ] = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
					break;

				case 'text':
				case 'ctaLabel':
				case 'imageAlt':
					$text = sanitize_text_field( is_scalar( $value ) ? (string) $value : '' );
					$text = self::enforce_max_len( $text, $field, $code, $errors );
					if ( ! empty( $field['required'] ) && '' === trim( $text ) ) {
						$errors[] = "required:{$code}";
					}
					$clean[ $key ] = $text;
					break;

				case 'textarea':
					$text = sanitize_textarea_field( is_scalar( $value ) ? (string) $value : '' );
					$text = self::enforce_max_len( $text, $field, $code, $errors );
					if ( ! empty( $field['required'] ) && '' === trim( $text ) ) {
						$errors[] = "required:{$code}";
					}
					$clean[ $key ] = $text;
					break;

				case 'richtext':
					$html = wp_kses( is_scalar( $value ) ? (string) $value : '', self::RICHTEXT_KSES );
					$html = self::strip_unsafe_hrefs( $html );
					$html = self::enforce_max_len( $html, $field, $code, $errors );
					if ( ! empty( $field['required'] ) && '' === trim( wp_strip_all_tags( $html ) ) ) {
						$errors[] = "required:{$code}";
					}
					$clean[ $key ] = $html;
					break;

				case 'url':
					$raw_url = trim( is_scalar( $value ) ? (string) $value : '' );
					if ( '' === $raw_url ) {
						if ( ! empty( $field['required'] ) ) {
							$errors[] = "required:{$code}";
						}
						$clean[ $key ] = '';
						break;
					}
					$url = self::sanitize_url( $raw_url );
					if ( null === $url ) {
						$errors[]      = "invalid_url:{$code}";
						$clean[ $key ] = '';
					} else {
						$clean[ $key ] = self::enforce_max_len( $url, $field, $code, $errors );
					}
					break;

				case 'select':
					$options = array();
					foreach ( (array) ( $field['options'] ?? array() ) as $opt ) {
						if ( is_array( $opt ) && isset( $opt['value'] ) ) {
							$options[] = (string) $opt['value'];
						}
					}
					$choice = is_scalar( $value ) ? (string) $value : '';
					if ( ! in_array( $choice, $options, true ) ) {
						$errors[]      = "invalid_option:{$code}";
						$clean[ $key ] = $options[0] ?? '';
					} else {
						$clean[ $key ] = $choice;
					}
					break;

				case 'image':
					$image = self::sanitize_image( $value );
					if ( null === $image && ! empty( $value ) ) {
						$errors[] = self::is_blocked_image( $value ) ? "blocked_media:{$code}" : "invalid_image:{$code}";
					}
					$clean[ $key ] = $image;
					break;

				case 'checklist':
					if ( ! is_array( $value ) ) {
						$errors[]      = "invalid_list:{$code}";
						$clean[ $key ] = array();
						break;
					}
					$max   = (int) ( $field['maxItems'] ?? 20 );
					$items = array();
					foreach ( array_slice( array_values( $value ), 0, $max ) as $item ) {
						$item_text = sanitize_text_field( is_scalar( $item ) ? (string) $item : '' );
						if ( isset( $field['maxLen'] ) ) {
							$item_text = mb_substr( $item_text, 0, (int) $field['maxLen'] );
						}
						if ( '' !== trim( $item_text ) ) {
							$items[] = $item_text;
						}
					}
					if ( count( $value ) > $max ) {
						$errors[] = "too_many:{$code}";
					}
					$clean[ $key ] = $items;
					break;

				case 'repeater':
				case 'cards':
				case 'testimonials':
					$item_schema = is_array( $field['item'] ?? null ) ? $field['item'] : array();
					if ( ! is_array( $value ) ) {
						$errors[]      = "invalid_list:{$code}";
						$clean[ $key ] = array();
						break;
					}
					$max   = (int) ( $field['maxItems'] ?? 20 );
					$items = array();
					foreach ( array_slice( array_values( $value ), 0, $max ) as $i => $item ) {
						if ( ! is_array( $item ) ) {
							$errors[] = "invalid_item:{$code}.{$i}";
							continue;
						}
						// Nested repeaters are not part of the contract; a nested
						// list-typed field is dropped by sanitize_fields() below
						// only if declared, and the manifest never declares one.
						[ $clean_item, $item_errors ] = self::sanitize_fields( self::without_list_types( $item_schema ), $item, "{$code}.{$i}." );
						$errors                       = array_merge( $errors, $item_errors );
						$items[]                      = $clean_item;
					}
					if ( count( $value ) > $max ) {
						$errors[] = "too_many:{$code}";
					}
					$clean[ $key ] = $items;
					break;

				default:
					// Unknown field type in the manifest itself is a build
					// bug, not user input — fail closed rather than store it.
					$errors[] = "unhandled_type:{$code}";
			}
		}

		return array( $clean, $errors );
	}

	/** @param array<string, array<string, mixed>> $schema */
	private static function without_list_types( array $schema ): array {
		return array_filter( $schema, static fn( $f ) => ! is_array( $f ) || ! in_array( (string) ( $f['type'] ?? '' ), self::LIST_TYPES, true ) );
	}

	/** @param array<string, mixed> $field */
	private static function enforce_max_len( string $text, array $field, string $code, array &$errors ): string {
		if ( isset( $field['maxLen'] ) && mb_strlen( $text ) > (int) $field['maxLen'] ) {
			$errors[] = "too_long:{$code}";
			return mb_substr( $text, 0, (int) $field['maxLen'] );
		}
		return $text;
	}

	/**
	 * Allows absolute http(s) URLs and site-relative `/path/`, `#hash`,
	 * `tel:` and `mailto:`. Rejects javascript:, data:, vbscript:, protocol-
	 * relative `//` and any other scheme.
	 */
	public static function sanitize_url( string $url ): ?string {
		$url = trim( $url );
		if ( '' === $url ) {
			return null;
		}
		$lower = strtolower( $url );
		if ( str_starts_with( $lower, '//' ) ) {
			return null;
		}
		if ( str_starts_with( $lower, 'tel:' ) ) {
			$number = preg_replace( '/[^0-9+*#.\-() ]/', '', substr( $url, 4 ) ) ?? '';
			return '' === trim( $number ) ? null : 'tel:' . trim( $number );
		}
		if ( str_starts_with( $lower, 'mailto:' ) ) {
			$email = sanitize_email( substr( $url, 7 ) );
			return '' === $email ? null : 'mailto:' . $email;
		}
		if ( str_starts_with( $url, '/' ) || str_starts_with( $url, '#' ) ) {
			// Site-relative: strip anything that could smuggle a scheme or
			// markup, keep path/query/fragment characters.
			$clean = preg_replace( '/[^A-Za-z0-9\-._~:\/?#\[\]@!$&\'()*+,;=%]/', '', $url ) ?? '';
			if ( preg_match( '/^[a-z][a-z0-9+.\-]*:/i', $clean ) ) {
				return null;
			}
			return $clean;
		}
		$scheme = wp_parse_url( $url, PHP_URL_SCHEME );
		if ( ! is_string( $scheme ) || ! in_array( strtolower( $scheme ), self::ALLOWED_ABS, true ) ) {
			return null;
		}
		$clean = esc_url_raw( $url, self::ALLOWED_ABS );
		return '' === $clean ? null : $clean;
	}

	/** wp_kses already drops javascript: hrefs, but a relative `/` or `#` path is fine and `data:` must never survive. */
	private static function strip_unsafe_hrefs( string $html ): string {
		return (string) preg_replace_callback(
			'/href\s*=\s*(["\'])(.*?)\1/i',
			static function ( array $m ): string {
				$url = self::sanitize_url( html_entity_decode( $m[2], ENT_QUOTES ) );
				return null === $url ? 'href=""' : 'href=' . $m[1] . esc_attr( $url ) . $m[1];
			},
			$html
		);
	}

	/**
	 * @param mixed $value
	 * @return array{id: int, url: string, width: int, height: int, filename: string}|null
	 */
	public static function sanitize_image( $value ): ?array {
		if ( empty( $value ) || ! is_array( $value ) || empty( $value['id'] ) ) {
			return null;
		}
		$id = absint( $value['id'] );
		if ( 0 === $id || 'attachment' !== get_post_type( $id ) || ! wp_attachment_is_image( $id ) ) {
			return null;
		}
		$filename = basename( (string) get_attached_file( $id ) );
		if ( self::filename_blocked( $filename ) ) {
			return null;
		}
		$src = wp_get_attachment_image_src( $id, 'full' );
		if ( ! $src ) {
			return null;
		}
		return array(
			'id'       => $id,
			'url'      => esc_url_raw( (string) $src[0] ),
			'width'    => (int) $src[1],
			'height'   => (int) $src[2],
			'filename' => $filename,
		);
	}

	/** @param mixed $value */
	private static function is_blocked_image( $value ): bool {
		if ( ! is_array( $value ) || empty( $value['id'] ) ) {
			return false;
		}
		$file = get_attached_file( absint( $value['id'] ) );
		return is_string( $file ) && self::filename_blocked( basename( $file ) );
	}

	public static function filename_blocked( string $filename ): bool {
		$name = strtolower( basename( $filename ) );
		if ( '' === $name ) {
			return false;
		}
		foreach ( Manifest::blocked_media() as $blocked ) {
			if ( $name === $blocked ) {
				return true;
			}
			// WordPress may rename an upload on collision (foo-1.webp) or
			// generate sized variants (foo-300x200.webp); block those too.
			$stem = preg_replace( '/\.[a-z0-9]+$/', '', $blocked ) ?? $blocked;
			if ( preg_match( '/^' . preg_quote( $stem, '/' ) . '(-\d+|-\d+x\d+)?\.[a-z0-9]+$/', $name ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Publish-time rules that draft saves do not need to satisfy: required
	 * fields present and non-empty, and every image carrying alt text
	 * unless its sibling decorative toggle is on.
	 *
	 * @param array<string, mixed> $content
	 * @return array<int, string>
	 */
	public static function publish_errors( string $route, string $section, array $content ): array {
		$schema = self::fields( $route, $section );
		if ( null === $schema ) {
			return array( 'unknown_section' );
		}
		return self::publish_errors_for( $schema, $content, '' );
	}

	/**
	 * @param array<string, array<string, mixed>> $schema
	 * @param array<string, mixed>                $content
	 * @return array<int, string>
	 */
	private static function publish_errors_for( array $schema, array $content, string $prefix ): array {
		$errors = array();
		foreach ( $schema as $key => $field ) {
			if ( ! is_array( $field ) ) {
				continue;
			}
			$type  = (string) ( $field['type'] ?? 'text' );
			$value = $content[ $key ] ?? null;

			if ( ! empty( $field['required'] ) ) {
				$empty = in_array( $type, self::LIST_TYPES, true ) || 'checklist' === $type
					? empty( $value )
					: ( 'image' === $type ? empty( $value ) : '' === trim( (string) ( is_scalar( $value ) ? $value : '' ) ) );
				if ( $empty ) {
					$errors[] = "required:{$prefix}{$key}";
				}
			}

			if ( 'image' === $type && ! empty( $value ) ) {
				if ( is_array( $value ) && self::filename_blocked( (string) ( $value['filename'] ?? '' ) ) ) {
					$errors[] = "blocked_media:{$prefix}{$key}";
				}
				if ( ! self::image_has_alt_or_decorative( $schema, $content, $key ) ) {
					$errors[] = "required:{$prefix}{$key}Alt";
				}
			}

			if ( in_array( $type, self::LIST_TYPES, true ) && is_array( $value ) && is_array( $field['item'] ?? null ) ) {
				foreach ( $value as $i => $item ) {
					if ( is_array( $item ) ) {
						$errors = array_merge( $errors, self::publish_errors_for( $field['item'], $item, "{$prefix}{$key}.{$i}." ) );
					}
				}
			}
		}
		return $errors;
	}

	/**
	 * Sibling detection by naming: `<field>Alt` / `<field>Decorative`, or a
	 * generic `imageAlt` / `decorative` (or any `decorative`-typed) field in
	 * the same section.
	 *
	 * @param array<string, array<string, mixed>> $schema
	 * @param array<string, mixed>                $content
	 */
	private static function image_has_alt_or_decorative( array $schema, array $content, string $image_key ): bool {
		$decorative_keys = array( $image_key . 'Decorative', 'decorative' );
		foreach ( $schema as $k => $f ) {
			if ( is_array( $f ) && 'decorative' === ( $f['type'] ?? '' ) ) {
				$decorative_keys[] = $k;
			}
		}
		foreach ( array_unique( $decorative_keys ) as $k ) {
			if ( ! empty( $content[ $k ] ) ) {
				return true;
			}
		}
		$alt_keys = array( $image_key . 'Alt', 'imageAlt' );
		foreach ( $schema as $k => $f ) {
			if ( is_array( $f ) && 'imageAlt' === ( $f['type'] ?? '' ) ) {
				$alt_keys[] = $k;
			}
		}
		foreach ( array_unique( $alt_keys ) as $k ) {
			if ( isset( $content[ $k ] ) && '' !== trim( (string) $content[ $k ] ) ) {
				return true;
			}
		}
		return false;
	}
}
