<?php
/**
 * Document head and site header.
 *
 * No <title> is printed here — `title-tag` theme support hands that to
 * WordPress, and two title elements is a real defect.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="gcalls-skip-link screen-reader-text" href="#gcalls-main">
	<?php esc_html_e( 'Bỏ qua và tới nội dung chính', 'gcalls-theme' ); ?>
</a>

<header id="gcalls-header" class="gcalls-header">
	<div class="gcalls-container gcalls-header__inner">
		<?php gcalls_site_branding(); ?>

		<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<button
				class="gcalls-header__toggle"
				type="button"
				aria-expanded="false"
				aria-controls="gcalls-primary-menu"
				data-gcalls-nav-toggle
			>
				<span class="gcalls-header__toggle-bar" aria-hidden="true"></span>
				<span class="screen-reader-text" data-gcalls-nav-label><?php esc_html_e( 'Mở menu', 'gcalls-theme' ); ?></span>
			</button>

			<nav
				id="gcalls-primary-menu"
				class="gcalls-nav"
				aria-label="<?php esc_attr_e( 'Menu chính', 'gcalls-theme' ); ?>"
			>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_class'     => 'gcalls-nav__list',
						'depth'          => 2,
						'fallback_cb'    => false,
					)
				);
				?>

				<?php
				/**
				 * The conversion button lives in the header, not in the menu.
				 *
				 * React renders `PRIMARY_CTA` beside the navigation rather than
				 * as a menu item, and the distinction is not cosmetic: a menu
				 * item is a link an editor can rename or drag into a submenu,
				 * while this is the site's single conversion surface and has to
				 * carry its attribution. It is inside the <nav> so the mobile
				 * panel gets it too — a CTA that disappears on phones is the
				 * half of the traffic that cannot convert.
				 */
				if ( shortcode_exists( 'gcalls_cta' ) ) {
					echo '<div class="gcalls-nav__cta">';
					echo do_shortcode( '[gcalls_cta label="Đăng ký tư vấn" intent="consultation" source="header"]' );
					echo '</div>';
				}
				?>
			</nav>
		<?php endif; ?>
	</div>
</header>

<main id="gcalls-main" class="gcalls-main">
