<?php
/**
 * Site footer.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>
</main><!-- #gcalls-main -->

<footer id="gcalls-footer" class="gcalls-footer">
	<div class="gcalls-container gcalls-footer__inner">
		<?php
		/**
		 * Brand column.
		 *
		 * The footer was five link columns and a copyright line, which reads as
		 * a sitemap rather than the end of a page. React opens the footer with
		 * the brand, one sentence of what Gcalls is, and the two contact
		 * channels that actually work — which matters more than usual here,
		 * because the lead form is fail-closed until a destination is approved,
		 * so this email and this phone number ARE the conversion path.
		 */
		?>
		<div class="gcalls-footer__brand">
			<p class="gcalls-footer__brand-name"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
			<p class="gcalls-footer__brand-desc">
				<?php esc_html_e( 'Tổng đài ảo tích hợp CRM cho đội Sales và CSKH: gọi trên trình duyệt, lưu lịch sử và ghi âm, quản lý khách hàng và theo dõi hiệu suất.', 'gcalls-theme' ); ?>
			</p>
			<ul class="gcalls-footer__contact">
				<li><a href="mailto:sales@gcalls.co">sales@gcalls.co</a></li>
				<li><a href="tel:+842873025469">028 7302 5469</a></li>
			</ul>
		</div>

		<?php if ( has_nav_menu( 'footer-nav' ) ) : ?>
			<nav class="gcalls-footer__nav" aria-label="<?php esc_attr_e( 'Menu chân trang', 'gcalls-theme' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer-nav',
						'container'      => false,
						'menu_class'     => 'gcalls-footer__list',
						'depth'          => 2,
						'fallback_cb'    => false,
					)
				);
				?>
			</nav>
		<?php endif; ?>

		<div class="gcalls-footer__bottom">
			<p class="gcalls-footer__copyright">
				<?php
				printf(
					/* translators: 1: current year, 2: site name. */
					esc_html__( '© %1$s %2$s', 'gcalls-theme' ),
					esc_html( (string) wp_date( 'Y' ) ),
					esc_html( get_bloginfo( 'name' ) )
				);
				?>
			</p>

			<?php if ( has_nav_menu( 'legal' ) ) : ?>
				<nav class="gcalls-footer__legal" aria-label="<?php esc_attr_e( 'Menu pháp lý', 'gcalls-theme' ); ?>">
					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'legal',
							'container'      => false,
							'menu_class'     => 'gcalls-footer__legal-list',
							'depth'          => 1,
							'fallback_cb'    => false,
						)
					);
					?>
				</nav>
			<?php endif; ?>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
