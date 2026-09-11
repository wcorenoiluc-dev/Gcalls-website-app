<?php
/**
 * FAQ storage and structured data.
 *
 * The 18 Batch 1 articles carry 97 FAQ questions between them. They are stored
 * as post meta rather than as blocks so that the same data can drive both the
 * rendered accordion and the FAQPage schema without one being parsed out of the
 * other — parsing answers back out of rendered HTML is how the two drift apart.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * FAQ meta and FAQPage JSON-LD.
 */
final class Faq {

	/** Post meta key holding the FAQ array. */
	public const META_KEY = '_gcalls_faq';

	/**
	 * Registers the meta and hooks the schema output.
	 */
	public static function init(): void {
		add_action( 'init', array( self::class, 'register_meta' ) );
		add_action( 'wp_footer', array( self::class, 'print_schema' ) );
	}

	/**
	 * Registers the FAQ meta for REST so the block editor can read it.
	 *
	 * `auth_callback` is explicit: without it, registered meta is editable by
	 * anyone who can edit the post's post type, which is broader than intended
	 * for a field that feeds structured data.
	 */
	public static function register_meta(): void {
		register_post_meta(
			'post',
			self::META_KEY,
			array(
				'type'              => 'array',
				'description'       => __( 'Câu hỏi thường gặp của bài viết', 'gcalls-core' ),
				'single'            => true,
				'show_in_rest'      => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type'       => 'object',
							'properties' => array(
								'question' => array( 'type' => 'string' ),
								'answer'   => array( 'type' => 'string' ),
							),
						),
					),
				),
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
			)
		);
	}

	/**
	 * Sanitizes a stored FAQ list.
	 *
	 * Questions are plain text. Answers keep the limited HTML that post content
	 * allows, because an answer legitimately contains links and lists — but
	 * `wp_kses_post` is what stops an import file from injecting a script.
	 *
	 * @param mixed $value Raw value.
	 * @return array<int, array{question: string, answer: string}>
	 */
	public static function sanitize( $value ): array {
		if ( ! is_array( $value ) ) {
			return array();
		}

		$clean = array();

		foreach ( $value as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$question = isset( $item['question'] ) ? sanitize_text_field( (string) $item['question'] ) : '';
			$answer   = isset( $item['answer'] ) ? wp_kses_post( (string) $item['answer'] ) : '';

			if ( '' === $question || '' === $answer ) {
				continue;
			}

			$clean[] = array(
				'question' => $question,
				'answer'   => $answer,
			);
		}

		return $clean;
	}

	/**
	 * Reads the FAQ list for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return array<int, array{question: string, answer: string}>
	 */
	public static function get( int $post_id ): array {
		$value = get_post_meta( $post_id, self::META_KEY, true );

		return is_array( $value ) ? self::sanitize( $value ) : array();
	}

	/**
	 * Stores the FAQ list for a post.
	 *
	 * @param int                                             $post_id Post ID.
	 * @param array<int, array{question: string, answer: string}> $faq   Items.
	 */
	public static function set( int $post_id, array $faq ): void {
		$clean = self::sanitize( $faq );

		if ( array() === $clean ) {
			delete_post_meta( $post_id, self::META_KEY );
			return;
		}

		update_post_meta( $post_id, self::META_KEY, $clean );
	}

	/**
	 * Prints FAQPage JSON-LD on a single post that has questions.
	 *
	 * Google's guidance is that the marked-up questions must be visible on the
	 * page. This prints nothing unless the theme rendered them, which it does
	 * from the same meta — see render().
	 */
	public static function print_schema(): void {
		if ( ! is_singular( 'post' ) ) {
			return;
		}

		$faq = self::get( (int) get_the_ID() );

		if ( array() === $faq ) {
			return;
		}

		$entities = array();

		foreach ( $faq as $item ) {
			$entities[] = array(
				'@type'          => 'Question',
				'name'           => $item['question'],
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => wp_strip_all_tags( $item['answer'] ),
				),
			);
		}

		Seo::print_json_ld(
			array(
				'@context'   => 'https://schema.org',
				'@type'      => 'FAQPage',
				'mainEntity' => $entities,
			)
		);
	}

	/**
	 * Renders the visible FAQ accordion.
	 *
	 * Uses <details>/<summary>, which is keyboard accessible and open to
	 * find-in-page without any JavaScript at all.
	 *
	 * @param int|null $post_id Defaults to the current post.
	 */
	/**
	 * @param int|null    $post_id Post to read the FAQ from.
	 * @param string|null $title   Heading to print. Null uses the default; an
	 *                             empty string prints none, for a page that has
	 *                             already headed the section itself.
	 */
	public static function render( ?int $post_id = null, ?string $title = null ): void {
		$post_id = $post_id ?? (int) get_the_ID();
		$faq     = self::get( $post_id );

		if ( array() === $faq ) {
			return;
		}

		$heading = null === $title ? __( 'Câu hỏi thường gặp', 'gcalls-core' ) : $title;

		echo '<section class="gcalls-faq">';

		// A page that has already headed this section gets no second heading.
		// /blog/ carried two: its own "Câu hỏi thường gặp — Blog" and this one.
		if ( '' !== $heading ) {
			echo '<h2 class="gcalls-faq__title">' . esc_html( $heading ) . '</h2>';
		}

		foreach ( $faq as $item ) {
			// `open`, and the question is a heading inside the summary.
			//
			// Collapsed by default, the answers were invisible to find-in-page
			// and absent from the document outline — on /uoc-tinh-chi-phi/ that
			// was six questions a visitor had arrived with, none of which the
			// page appeared to answer. <details> is kept so they can still be
			// folded away; it just does not start that way.
			echo '<details class="gcalls-faq__item" open>';
			echo '<summary class="gcalls-faq__question"><h3>' . esc_html( $item['question'] ) . '</h3></summary>';
			echo '<div class="gcalls-faq__answer">' . wp_kses_post( wpautop( $item['answer'] ) ) . '</div>';
			echo '</details>';
		}

		echo '</section>';
	}
}
