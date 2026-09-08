<?php
/**
 * The HUB taxonomy.
 *
 * WHY NOT THE BUILT-IN CATEGORY
 * The editorial model has seven strategic hubs that carry a stable ID
 * (HUB-01 … HUB-09, with 04 and 05 unused) alongside a display name. Categories
 * would work for the display name, but they carry no stable identifier: an
 * editor renaming "Gcalls CX" breaks every mapping keyed on the name, and the
 * import pipeline needs a key that survives renaming. A dedicated taxonomy also
 * leaves `category` free for whatever editorial wants later without colliding
 * with the migration.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and seeds the `gcalls_hub` taxonomy.
 */
final class Hub_Taxonomy {

	public const TAXONOMY = 'gcalls_hub';

	/** Term meta key holding the stable hub ID, e.g. "HUB-01". */
	public const META_HUB_ID = '_gcalls_hub_id';

	/**
	 * The thirteen editorial hubs, transcribed from
	 * docs/content-review/blog/editorial-hub-summary.csv.
	 *
	 * WAS SEVEN UNTIL CHECKPOINT 004. Batch 1 only touched seven of them, so
	 * only seven were registered, and the comment here said HUB-04 and HUB-05
	 * had been retired. That was true of Batch 1 and false of the corpus: the
	 * full 239-post migration files 77 posts under HUB-04, 35 under HUB-05, 49
	 * under HUB-11 and 2 under HUB-10. Registered nowhere, those 163 posts would
	 * have imported with no hub at all — no archive, no breadcrumb trail, and
	 * nothing in the grouped blog index — and the import would have reported
	 * success.
	 *
	 * HUB-12 and HUB-13 carry no legacy content and are registered anyway, so
	 * the taxonomy matches the editorial model rather than the subset that
	 * happens to have posts today. An empty term costs nothing: the archive
	 * queries with `hide_empty`.
	 *
	 * @var array<string, array{slug: string, name: string}>
	 */
	private const HUBS = array(
		'HUB-01' => array( 'slug' => 'tong-dai-va-call-center', 'name' => 'Tổng đài và Call Center' ),
		'HUB-02' => array( 'slug' => 'gcalls-plus-webphone', 'name' => 'Gcalls Plus Webphone' ),
		'HUB-03' => array( 'slug' => 'crm-helpdesk-va-tich-hop', 'name' => 'CRM, Helpdesk và tích hợp' ),
		'HUB-04' => array( 'slug' => 'telesales-va-sales-operations', 'name' => 'Telesales và Sales Operations' ),
		'HUB-05' => array( 'slug' => 'customer-service-va-customer-experience', 'name' => 'Customer Service và Customer Experience' ),
		'HUB-06' => array( 'slug' => 'gcalls-cx', 'name' => 'Gcalls CX' ),
		'HUB-07' => array( 'slug' => 'qa-qc-va-quan-tri-chat-luong', 'name' => 'QA/QC và quản trị chất lượng' ),
		'HUB-08' => array( 'slug' => 'voicebot-ai-va-tu-dong-hoa', 'name' => 'Voicebot, AI và tự động hóa' ),
		'HUB-09' => array( 'slug' => 'tong-dai-quoc-te', 'name' => 'Tổng đài quốc tế' ),
		'HUB-10' => array( 'slug' => 'cloud-call-center-va-lam-viec-tu-xa', 'name' => 'Cloud Call Center và làm việc từ xa' ),
		'HUB-11' => array( 'slug' => 'van-hanh-doanh-nghiep', 'name' => 'Vận hành doanh nghiệp' ),
		'HUB-12' => array( 'slug' => 'huong-dan-su-dung-gcalls', 'name' => 'Hướng dẫn sử dụng Gcalls' ),
		'HUB-13' => array( 'slug' => 'case-study', 'name' => 'Case study' ),
	);

	/**
	 * Hooks the taxonomy registration.
	 */
	public static function init(): void {
		add_action( 'init', array( self::class, 'register' ) );
	}

	/**
	 * Registers the taxonomy.
	 *
	 * `show_in_rest` is on because posts are edited in the block editor, and a
	 * taxonomy invisible to REST is invisible in that editor.
	 */
	public static function register(): void {
		register_taxonomy(
			self::TAXONOMY,
			array( 'post' ),
			array(
				'labels'            => array(
					'name'          => __( 'HUB', 'gcalls-core' ),
					'singular_name' => __( 'HUB', 'gcalls-core' ),
					'menu_name'     => __( 'HUB', 'gcalls-core' ),
					'all_items'     => __( 'Tất cả HUB', 'gcalls-core' ),
					'edit_item'     => __( 'Sửa HUB', 'gcalls-core' ),
					'add_new_item'  => __( 'Thêm HUB', 'gcalls-core' ),
					'search_items'  => __( 'Tìm HUB', 'gcalls-core' ),
					'not_found'     => __( 'Không có HUB nào', 'gcalls-core' ),
				),
				'public'            => true,
				'hierarchical'      => true,
				'show_in_rest'      => true,
				'show_admin_column' => true,
				'rewrite'           => array(
					'slug'         => 'hub',
					'with_front'   => false,
					'hierarchical' => false,
				),
				'capabilities'      => array(
					'manage_terms' => 'manage_categories',
					'edit_terms'   => 'manage_categories',
					'delete_terms' => 'manage_categories',
					'assign_terms' => 'edit_posts',
				),
			)
		);
	}

	/**
	 * The canonical hub table.
	 *
	 * @return array<string, array{slug: string, name: string}>
	 */
	public static function hubs(): array {
		return self::HUBS;
	}

	/**
	 * Creates any missing hub terms and returns the resulting term IDs.
	 *
	 * Idempotent: a hub that already exists is looked up, not recreated, and its
	 * name is left alone so an editorial rename is never reverted by re-running
	 * the importer.
	 *
	 * @param bool $dry_run When true, nothing is written.
	 * @return array{created: array<int, string>, existing: array<int, string>, errors: array<int, string>}
	 */
	public static function seed( bool $dry_run = false ): array {
		$result = array(
			'created'  => array(),
			'existing' => array(),
			'errors'   => array(),
		);

		foreach ( self::HUBS as $hub_id => $hub ) {
			$term = get_term_by( 'slug', $hub['slug'], self::TAXONOMY );

			if ( $term instanceof \WP_Term ) {
				$result['existing'][] = $hub_id;
				continue;
			}

			if ( $dry_run ) {
				$result['created'][] = $hub_id;
				continue;
			}

			$created = wp_insert_term( $hub['name'], self::TAXONOMY, array( 'slug' => $hub['slug'] ) );

			if ( is_wp_error( $created ) ) {
				$result['errors'][] = $hub_id . ': ' . $created->get_error_message();
				continue;
			}

			update_term_meta( (int) $created['term_id'], self::META_HUB_ID, $hub_id );
			$result['created'][] = $hub_id;
		}

		return $result;
	}

	/**
	 * Resolves a hub ID such as "HUB-03" to its term ID.
	 *
	 * @param string $hub_id Stable hub identifier.
	 * @return int|null Term ID, or null when the hub is unknown or unseeded.
	 */
	public static function term_id_for( string $hub_id ): ?int {
		if ( ! isset( self::HUBS[ $hub_id ] ) ) {
			return null;
		}

		$term = get_term_by( 'slug', self::HUBS[ $hub_id ]['slug'], self::TAXONOMY );

		return $term instanceof \WP_Term ? (int) $term->term_id : null;
	}
}
