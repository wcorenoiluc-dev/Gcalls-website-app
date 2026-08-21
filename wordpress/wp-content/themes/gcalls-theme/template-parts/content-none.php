<?php
/**
 * Empty result set.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>

<section class="gcalls-empty">
	<h2 class="gcalls-empty__title"><?php esc_html_e( 'Chưa có nội dung', 'gcalls-theme' ); ?></h2>

	<?php if ( is_search() ) : ?>
		<p><?php esc_html_e( 'Không có kết quả nào khớp với từ khoá. Thử một từ khoá khác.', 'gcalls-theme' ); ?></p>
		<?php get_search_form(); ?>
	<?php else : ?>
		<p><?php esc_html_e( 'Chưa có bài viết nào trong mục này.', 'gcalls-theme' ); ?></p>
	<?php endif; ?>
</section>
