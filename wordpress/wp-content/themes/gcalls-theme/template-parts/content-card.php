<?php
/**
 * Post card, as used by the blog index, archives and search results.
 *
 * The card must degrade cleanly with no featured image — the 18 Batch 1
 * articles have none yet, and a placeholder graphic shipped as if it were the
 * final asset is worse than a text card.
 *
 * @package Gcalls
 */

declare( strict_types = 1 );

defined( 'ABSPATH' ) || exit;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'gcalls-card' ); ?>>
	<?php if ( has_post_thumbnail() ) : ?>
		<a class="gcalls-card__media" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
			<?php gcalls_post_thumbnail( 'medium_large' ); ?>
		</a>
	<?php endif; ?>

	<div class="gcalls-card__body">
		<?php gcalls_post_terms(); ?>

		<h2 class="gcalls-card__title">
			<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
		</h2>

		<?php if ( has_excerpt() || get_the_excerpt() ) : ?>
			<p class="gcalls-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 32 ) ); ?></p>
		<?php endif; ?>

		<p class="gcalls-meta">
			<?php gcalls_posted_on(); ?>
		</p>
	</div>
</article>
