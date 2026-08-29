<?php
/**
 * Post card, as used by the blog index, archives and search results.
 *
 * Every card carries a cover. None of the 250 articles has a featured image
 * and every inline image is hotlinked to a host this site does not control, so
 * "degrade to a text card" would have meant eighteen text cards — an archive
 * with no pictures at all. gcalls_post_cover() draws one from the article's
 * HUB instead, and steps aside the moment a real featured image exists.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-card' ); ?>>
	<a class="gcalls-card__media" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
		<?php gcalls_post_cover( 'medium_large' ); ?>
	</a>

	<div class="gcalls-card__body">
		<?php gcalls_post_terms(); ?>

		<h3 class="gcalls-card__title">
			<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
		</h3>

		<?php if ( has_excerpt() || get_the_excerpt() ) : ?>
			<p class="gcalls-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 32 ) ); ?></p>
		<?php endif; ?>

		<p class="gcalls-meta">
			<?php gcalls_posted_on(); ?>
		</p>

		<?php
		/*
		 * The read-more link is aria-hidden and out of the tab order on
		 * purpose: the title above is already a link to the same place, and a
		 * second one adds a stop that says "Đọc tiếp" without naming the
		 * article. It is here for the eye, not for the keyboard.
		 */
		?>
		<span class="gcalls-card__more" aria-hidden="true">
			<?php esc_html_e( 'Đọc tiếp', 'gcalls-theme' ); ?>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="m9 18 6-6-6-6"/></svg>
		</span>
	</div>
</article>
