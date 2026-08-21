<?php
/**
 * Not found.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="gcalls-container gcalls-stack">
	<header class="gcalls-page-header">
		<h1 class="gcalls-page-header__title"><?php esc_html_e( 'Không tìm thấy trang', 'gcalls-theme' ); ?></h1>
		<p class="gcalls-page-header__intro">
			<?php esc_html_e( 'Đường dẫn này không tồn tại hoặc đã được chuyển đi. Thử tìm kiếm hoặc quay về trang chủ.', 'gcalls-theme' ); ?>
		</p>
	</header>

	<?php get_search_form(); ?>

	<p>
		<a class="gcalls-button" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( 'Về trang chủ', 'gcalls-theme' ); ?>
		</a>
	</p>
</div>

<?php
get_footer();
