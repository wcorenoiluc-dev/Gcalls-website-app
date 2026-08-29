<?php
/**
 * Fixtures for gcalls_article_contents().
 *
 * HOW TO RUN THIS, AND WHY IT IS NOT RUN HERE
 * The build machine has no PHP binary, no Docker and no CI, so this file has
 * never been executed. It is written to run anywhere PHP exists — including on
 * the demo host itself:
 *
 *     wp eval-file wordpress/tests/test-article-contents.php
 *
 * or standalone, where the four WordPress functions it needs are stubbed at
 * the top:
 *
 *     php wordpress/tests/test-article-contents.php
 *
 * It asserts the properties the 013 review asks for, and each case exists
 * because it is a way the previous regex implementation could have been wrong:
 * a heading containing markup, two headings with the same words, Vietnamese
 * text, an id somebody has already shared, an article with no headings at all,
 * and legacy markup that is not well-formed.
 *
 * It does NOT test that the_content() runs once — that is a property of
 * single.php, not of this function, and qa-foundation asserts it statically.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

/* ------------------------------------------------------------------ *
 * Stubs, used only when this runs outside WordPress.
 * ------------------------------------------------------------------ */

if ( ! function_exists( 'sanitize_title' ) ) {
	/**
	 * Enough of sanitize_title() for these fixtures: transliterate Vietnamese,
	 * lowercase, and reduce to a-z0-9 with single hyphens.
	 *
	 * @param string $title Text to slug.
	 */
	function sanitize_title( string $title ): string {
		$from = array(
			'à','á','ạ','ả','ã','â','ầ','ấ','ậ','ẩ','ẫ','ă','ằ','ắ','ặ','ẳ','ẵ',
			'è','é','ẹ','ẻ','ẽ','ê','ề','ế','ệ','ể','ễ',
			'ì','í','ị','ỉ','ĩ',
			'ò','ó','ọ','ỏ','õ','ô','ồ','ố','ộ','ổ','ỗ','ơ','ờ','ớ','ợ','ở','ỡ',
			'ù','ú','ụ','ủ','ũ','ư','ừ','ứ','ự','ử','ữ',
			'ỳ','ý','ỵ','ỷ','ỹ','đ',
		);
		$to   = array(
			'a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a',
			'e','e','e','e','e','e','e','e','e','e','e',
			'i','i','i','i','i',
			'o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o',
			'u','u','u','u','u','u','u','u','u','u','u',
			'y','y','y','y','y','d',
		);

		$slug = str_replace( $from, $to, mb_strtolower( $title, 'UTF-8' ) );
		$slug = preg_replace( '/[^a-z0-9]+/', '-', $slug ) ?? '';

		return trim( $slug, '-' );
	}
}

if ( ! function_exists( 'wp_strip_all_tags' ) ) {
	/**
	 * @param string $text Text to strip.
	 */
	function wp_strip_all_tags( string $text ): string {
		return trim( (string) strip_tags( $text ) );
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	/**
	 * @param string $text Text to escape.
	 */
	function esc_attr( string $text ): string {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_html' ) ) {
	/**
	 * @param string $text Text to escape.
	 */
	function esc_html( string $text ): string {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_html__' ) ) {
	/**
	 * @param string $text   Text.
	 * @param string $domain Unused.
	 */
	function esc_html__( string $text, string $domain = '' ): string {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'gcalls_article_contents' ) ) {
	require_once __DIR__ . '/../wp-content/themes/gcalls-theme/inc/template-tags.php';
}

/* ------------------------------------------------------------------ *
 * Harness
 * ------------------------------------------------------------------ */

$passed = 0;
$failed = 0;

/**
 * @param string $label     What is being asserted.
 * @param bool   $condition Result.
 * @param string $detail    Shown on failure.
 */
function gcalls_assert( string $label, bool $condition, string $detail = '' ): void {
	global $passed, $failed;

	if ( $condition ) {
		++$passed;
		echo "  ok   {$label}\n";
		return;
	}

	++$failed;
	echo "  FAIL {$label}" . ( '' !== $detail ? " — {$detail}" : '' ) . "\n";
}

echo "gcalls_article_contents() fixtures\n\n";

/* 1 — a heading containing inline markup keeps that markup in the body and
 * contributes plain text to the contents list. The regex version put the tags
 * in the list, which rendered as escaped angle brackets. */
$result = gcalls_article_contents(
	'<h2>Đồng bộ <strong>hai chiều</strong> giữa hệ thống</h2><p>a</p>'
	. '<h2>Khi nào <em>không</em> nên đồng bộ</h2><p>b</p>'
	. '<h2>Checklist trước khi tích hợp</h2><p>c</p>'
);
gcalls_assert( 'heading markup survives in the body', str_contains( $result['body'], '<strong>hai chiều</strong>' ) );
gcalls_assert( 'contents list shows plain text', str_contains( $result['toc'], 'Đồng bộ hai chiều giữa hệ thống' ) );
gcalls_assert( 'contents list carries no inline tags', ! str_contains( $result['toc'], '<strong>' ) );

/* 2 — Vietnamese headings produce usable, ASCII, unique ids. */
gcalls_assert( 'Vietnamese heading gets a transliterated id', str_contains( $result['body'], 'id="dong-bo-hai-chieu-giua-he-thong"' ), $result['body'] );

/* 3 — two headings with identical text get distinct ids. */
$duplicates = gcalls_article_contents(
	'<h2>Tổng quan</h2><p>a</p><h2>Tổng quan</h2><p>b</p><h2>Tổng quan</h2><p>c</p>'
);
gcalls_assert( 'first duplicate keeps the base id', str_contains( $duplicates['body'], 'id="tong-quan"' ) );
gcalls_assert( 'second duplicate is suffixed', str_contains( $duplicates['body'], 'id="tong-quan-2"' ) );
gcalls_assert( 'third duplicate is suffixed', str_contains( $duplicates['body'], 'id="tong-quan-3"' ) );

/* 4 — an id somebody may have shared is never rewritten. */
$existing = gcalls_article_contents(
	'<h2 id="da-chia-se">Một</h2><p>a</p><h2>Hai</h2><p>b</p><h2>Ba</h2><p>c</p>'
);
gcalls_assert( 'an existing id is preserved', str_contains( $existing['body'], 'id="da-chia-se"' ) );
gcalls_assert( 'the preserved id is what the list links to', str_contains( $existing['toc'], 'href="#da-chia-se"' ) );

/* 5 — too few headings means no contents list, and the body comes back
 * untouched rather than round-tripped through a parser. */
$short = gcalls_article_contents( '<h2>Chỉ một</h2><p>a</p>' );
gcalls_assert( 'no contents list under the minimum', '' === $short['toc'] );
gcalls_assert( 'body is returned unchanged under the minimum', '<h2>Chỉ một</h2><p>a</p>' === $short['body'] );

/* 6 — an article with no headings at all. */
$none = gcalls_article_contents( '<p>Chỉ có đoạn văn.</p>' );
gcalls_assert( 'no headings produces no contents list', '' === $none['toc'] );
gcalls_assert( 'no headings leaves the body alone', '<p>Chỉ có đoạn văn.</p>' === $none['body'] );

/* 7 — legacy markup that is not well-formed must not be destroyed. An
 * unclosed <p> is the commonest thing in an imported body. */
$legacy = gcalls_article_contents(
	'<h2>Một</h2><p>chưa đóng<h2>Hai</h2><p>cũng chưa đóng<h2>Ba</h2><p>xong</p>'
);
gcalls_assert( 'legacy markup still yields a contents list', '' !== $legacy['toc'] );
gcalls_assert( 'legacy body keeps its text', str_contains( $legacy['body'], 'cũng chưa đóng' ) );

/* 8 — h3 is nested under h2 in the list. */
$levels = gcalls_article_contents(
	'<h2>Cha</h2><p>a</p><h3>Con</h3><p>b</p><h2>Cha hai</h2><p>c</p>'
);
gcalls_assert( 'h3 is marked as a sub-entry', str_contains( $levels['toc'], 'class="li--sub"' ) );

/* 9 — nothing in this function emits a shortcode or filters content, so a
 * shortcode left in the body arrives exactly once and unexpanded. */
$shortcode = gcalls_article_contents(
	'<h2>Một</h2><p>[gcalls_cta label="x"]</p><h2>Hai</h2><p>b</p><h2>Ba</h2><p>c</p>'
);
gcalls_assert(
	'a shortcode passes through exactly once',
	1 === substr_count( $shortcode['body'], '[gcalls_cta' ),
	(string) substr_count( $shortcode['body'], '[gcalls_cta' )
);

/* 10 — the fallback path agrees with the DOM path on the simple cases. */
$fallback = gcalls_article_contents_fallback(
	'<h2>Tổng quan</h2><p>a</p><h2>Tổng quan</h2><p>b</p><h2>Kết luận</h2><p>c</p>'
);
gcalls_assert( 'fallback suffixes duplicates too', str_contains( $fallback['body'], 'id="tong-quan-2"' ) );
gcalls_assert( 'fallback builds the same list shape', str_contains( $fallback['toc'], 'gcalls-toc__title' ) );

echo "\n{$passed} passed, {$failed} failed\n";

exit( $failed > 0 ? 1 : 0 );
