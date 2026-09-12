<?php
/**
 * Theme supports, menus and translation loading.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

/**
 * Registers everything WordPress needs to know about this theme.
 *
 * Runs on `after_setup_theme` because several of these calls are read during
 * `init`, which fires later — registering them any later silently does nothing.
 */
function gcalls_theme_setup(): void {
	load_theme_textdomain( 'gcalls-theme', GCALLS_THEME_DIR . 'languages' );

	// Lets WordPress own the <title> element. header.php therefore prints no
	// <title> of its own; two of them is a real SEO defect, not a cosmetic one.
	add_theme_support( 'title-tag' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );

	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);

	add_theme_support(
		'custom-logo',
		array(
			'height'               => 40,
			'width'                => 160,
			'flex-height'          => true,
			'flex-width'           => true,
			'unlink-homepage-logo' => false,
		)
	);

	// The editor reads the same stylesheet the front end does, so a heading in
	// the editor is the heading the visitor sees.
	add_editor_style( 'assets/css/theme.css' );

	register_nav_menus(
		array(
			'primary'      => __( 'Menu chính', 'gcalls-theme' ),
			'footer-nav'   => __( 'Menu chân trang', 'gcalls-theme' ),
			'legal'        => __( 'Menu pháp lý', 'gcalls-theme' ),
		)
	);
}
add_action( 'after_setup_theme', 'gcalls_theme_setup' );

/**
 * Content width used by oEmbed and by images without an explicit size.
 *
 * 760px is the reading measure from the React source; the 1280px figure is the
 * outer container, which is wider than any single column of prose.
 */
function gcalls_theme_content_width(): void {
	$GLOBALS['content_width'] = apply_filters( 'gcalls_content_width', 760 );
}
add_action( 'after_setup_theme', 'gcalls_theme_content_width', 0 );

/**
 * Adds a body class naming the active layout so CSS can target Elementor pages
 * without sniffing for Elementor's own classes, which change between releases.
 *
 * @param array<int, string> $classes Body classes.
 * @return array<int, string>
 */
function gcalls_theme_body_classes( array $classes ): array {
	if ( gcalls_is_elementor_page() ) {
		$classes[] = 'gcalls-layout-elementor';
	} else {
		$classes[] = 'gcalls-layout-default';
	}

	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'gcalls-no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'gcalls_theme_body_classes' );

/**
 * Registers the single widget area used by the blog templates.
 */
function gcalls_theme_widgets_init(): void {
	register_sidebar(
		array(
			'name'          => __( 'Cột bên blog', 'gcalls-theme' ),
			'id'            => 'sidebar-1',
			'description'   => __( 'Hiển thị bên cạnh bài viết và trang lưu trữ blog.', 'gcalls-theme' ),
			'before_widget' => '<section id="%1$s" class="gcalls-widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="gcalls-widget__title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'gcalls_theme_widgets_init' );
