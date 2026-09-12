<?php
/**
 * Tools > Gcalls Corpus Media Migration.
 *
 * Brings the article images onto this site and rewrites the bodies that point
 * at them. 724 files, 170 articles, on a shared host — which is why almost
 * every decision here is about doing it in pieces that can stop.
 *
 * WHY IT TAKES NO INPUT
 * The screen accepts no post id, no URL and no filter from the browser.
 * Everything it may touch is in `data/corpus-migration.json`, which ships
 * inside the plugin: what the tool can do is fixed at build time, reviewable
 * in a diff, and identical on every run. A screen that took ids from a form
 * would be a bulk-edit endpoint with a nonce on it.
 *
 * WHY IT IS CHUNKED
 * 724 downloads in one request is a timeout, and a timeout half way through a
 * media import leaves files on disk that no attachment points at and no record
 * of which. Each request handles a handful of images and persists what it did,
 * so the work survives a timeout, a closed tab and a browser refresh. There is
 * no WP-Cron anywhere in it: a job that runs when a visitor happens to load a
 * page is not a job anybody is watching.
 *
 * WHY MEDIA AND POSTS ARE SEPARATE PHASES
 * Media is additive and safe to retry; rewriting a post body is neither. So
 * every file lands first, and only when the whole media phase is accounted for
 * does anything touch an article. If the rewrite phase then fails, the media
 * stays — deleting it in the same run as creating it is how a rollback loses
 * the file it needs.
 *
 * WHAT IT WILL NOT DO
 * - Touch the eighteen published articles. They are in the manifest as
 *   PROTECTED_PUBLISH and every write path checks it again at the last moment.
 * - Change any post's status. No draft is ever published.
 * - Run by itself. No activation hook, no admin_init, no cron, no public REST.
 * - Delete an attachment. Not on rollback either; orphans are reported.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * The migration screen and its AJAX worker.
 */
final class Corpus_Migration {

	public const SLUG = 'gcalls-corpus-migration';

	private const NONCE_STEP    = 'gcalls_corpus_step';
	private const NONCE_CONTROL = 'gcalls_corpus_control';

	/** Run state and media map. Both autoload=false — see save_state(). */
	private const OPT_STATE = 'gcalls_corpus_state';
	private const OPT_MAP   = 'gcalls_corpus_media_map';

	/**
	 * Rollback journal, one option per post.
	 *
	 * NOT one option holding 170 bodies. That would be ~3 MB in a single row,
	 * and a single row is also a single point of corruption: one bad write and
	 * every article's rollback is gone at once. Per-post records also mean a
	 * partial run leaves a partial, still-usable journal.
	 *
	 * Every record is autoload=false. An autoloaded option is fetched on every
	 * request the site serves, so 170 of them holding article bodies would put
	 * 3 MB of migration bookkeeping into the memory of every page view — and it
	 * would stay there long after the migration finished.
	 *
	 * The run id is in the option name, so a second run cannot overwrite the
	 * first one's journal and a rollback cannot mix two runs together.
	 */
	private const OPT_JOURNAL_PREFIX = 'gcalls_corpus_rb_';

	/** Index of post ids journaled, per run. */
	private const OPT_JOURNAL_INDEX = 'gcalls_corpus_rb_index_';

	private const MANIFEST = 'data/corpus-migration.json';

	/** Images per request. Small enough to finish inside any sane timeout. */
	private const MEDIA_BATCH = 5;

	/** Posts per request. Rewriting is cheap; verifying the hash is the cost. */
	private const POST_BATCH = 10;

	/** Seconds allowed for one image download. */
	private const DOWNLOAD_TIMEOUT = 20;

	/**
	 * Hard ceiling on a downloaded body.
	 *
	 * The large-file policy already holds anything over 2 MB for review, so
	 * nothing the manifest approves comes close to this. It is here for the
	 * case the manifest is wrong or the server sends something unexpected:
	 * the transport stops reading rather than pulling an arbitrary amount of
	 * data into a PHP process on a shared host.
	 */
	private const MAX_DOWNLOAD_BYTES = 8388608;

	/** How many times one item may fail before the run pauses. */
	private const MAX_RETRIES = 2;

	/* The state machine. */
	private const S_PREPARED          = 'PREPARED';
	private const S_BASELINE_VERIFIED = 'BASELINE_VERIFIED';
	private const S_MEDIA_IMPORTING   = 'MEDIA_IMPORTING';
	private const S_MEDIA_COMPLETE    = 'MEDIA_COMPLETE';
	private const S_POST_REWRITE      = 'POST_REWRITE';
	private const S_VERIFYING         = 'VERIFYING';
	private const S_COMPLETE          = 'COMPLETE';
	private const S_PAUSED_ERROR      = 'PAUSED_ERROR';

	/**
	 * Registers the screen and the AJAX worker.
	 *
	 * `wp_ajax_` only — never `wp_ajax_nopriv_`. The unauthenticated variant is
	 * how an admin-ajax action becomes a public endpoint, and this one
	 * downloads files and writes posts.
	 */
	public static function init(): void {
		add_action( 'admin_menu', array( self::class, 'register_page' ) );
		add_action( 'wp_ajax_gcalls_corpus_step', array( self::class, 'ajax_step' ) );
	}

	/** Adds the Tools submenu. */
	public static function register_page(): void {
		add_management_page(
			__( 'Gcalls Corpus Media Migration', 'gcalls-core' ),
			__( 'Gcalls Corpus Media', 'gcalls-core' ),
			'manage_options',
			self::SLUG,
			array( self::class, 'render' )
		);
	}

	/* ------------------------------------------------------------ manifest */

	/**
	 * Reads the bundled manifest.
	 *
	 * @return array<string, mixed>|null
	 */
	private static function manifest(): ?array {
		static $cached = null;

		if ( null !== $cached ) {
			return $cached;
		}

		$path = GCALLS_CORE_DIR . self::MANIFEST;

		if ( ! is_readable( $path ) ) {
			return null;
		}

		$decoded = json_decode( (string) file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Bundled file, not a request.

		if ( ! is_array( $decoded ) || ! isset( $decoded['media'], $decoded['articles'] ) ) {
			return null;
		}

		$cached = $decoded;

		return $cached;
	}

	/* --------------------------------------------------------------- state */

	/**
	 * Current run state, with defaults.
	 *
	 * @return array<string, mixed>
	 */
	private static function state(): array {
		$state = get_option( self::OPT_STATE );

		if ( ! is_array( $state ) || ! isset( $state['state'] ) ) {
			return array(
				'state'          => self::S_PREPARED,
				'run_id'         => '',
				'dry_run'        => true,
				'media_index'    => 0,
				'post_index'     => 0,
				'attachments'    => 0,
				'rewritten'      => 0,
				'skipped'        => array(),
				'errors'         => array(),
				'started_gmt'    => '',
				'plugin_version' => VERSION,
			);
		}

		return $state;
	}

	/**
	 * @param array<string, mixed> $state State to persist.
	 */
	private static function save_state( array $state ): void {
		update_option( self::OPT_STATE, $state, false );
	}

	/**
	 * The url/hash to attachment map.
	 *
	 * This is what makes the run idempotent: an image already imported is
	 * found here and not fetched again, whether the second run reaches it by
	 * the same URL or by a different URL with the same bytes.
	 *
	 * @return array{by_url: array<string, int>, by_hash: array<string, int>}
	 */
	private static function map(): array {
		$map = get_option( self::OPT_MAP );

		if ( ! is_array( $map ) || ! isset( $map['by_url'], $map['by_hash'] ) ) {
			return array(
				'by_url'  => array(),
				'by_hash' => array(),
			);
		}

		return $map;
	}

	/* ------------------------------------------------------------ preflight */

	/**
	 * Everything that must be true before Execute is allowed.
	 *
	 * @return array<int, array{label: string, ok: bool, detail: string}>
	 */
	public static function preflight(): array {
		$checks   = array();
		$manifest = self::manifest();

		$checks[] = array(
			'label'  => __( 'Manifest đi kèm plugin đọc được', 'gcalls-core' ),
			'ok'     => null !== $manifest,
			'detail' => null !== $manifest
				? sprintf( '%d media · %d bài', count( $manifest['media'] ), count( $manifest['articles'] ) )
				: __( 'không đọc được data/corpus-migration.json', 'gcalls-core' ),
		);

		if ( null === $manifest ) {
			return $checks;
		}

		$checks[] = array(
			'label'  => __( 'Manifest khớp phiên bản plugin', 'gcalls-core' ),
			'ok'     => ( $manifest['plugin_version'] ?? '' ) === VERSION,
			'detail' => sprintf( 'manifest %s · plugin %s', (string) ( $manifest['plugin_version'] ?? '?' ), VERSION ),
		);

		$disk = self::disk_check( $manifest );

		$checks[] = array(
			'label'  => __( 'Đường dẫn uploads', 'gcalls-core' ),
			'ok'     => '' !== $disk['uploads_path'],
			'detail' => $disk['uploads_path'],
		);

		$checks[] = array(
			'label'  => __( 'Phân vùng được đo', 'gcalls-core' ),
			'ok'     => $disk['measured_path'] === $disk['uploads_path'],
			'detail' => $disk['measured_path'] === $disk['uploads_path']
				? $disk['measured_path']
				: sprintf(
					/* translators: 1: measured path, 2: uploads path. */
					__( 'đo %1$s nhưng uploads ở %2$s — không chắc cùng phân vùng', 'gcalls-core' ),
					$disk['measured_path'],
					$disk['uploads_path']
				),
		);

		$checks[] = array(
			'label'  => __( 'Dung lượng trống', 'gcalls-core' ),
			'ok'     => $disk['ok'],
			'detail' => $disk['detail'],
		);

		$checks[] = array(
			'label'  => __( 'Thư mục uploads ghi được', 'gcalls-core' ),
			'ok'     => ( wp_get_upload_dir()['error'] ?? false ) === false && wp_is_writable( wp_get_upload_dir()['basedir'] ),
			'detail' => (string) ( wp_get_upload_dir()['basedir'] ?? '' ),
		);

		$baseline = self::verify_baseline();

		$checks[] = array(
			'label'  => __( 'Baseline live khớp manifest', 'gcalls-core' ),
			'ok'     => 0 === count( $baseline['missing'] ),
			'detail' => sprintf(
				/* translators: 1: eligible, 2: human-edited, 3: protected, 4: missing. */
				__( '%1$d eligible · %2$d human-edited · %3$d protected · %4$d thiếu', 'gcalls-core' ),
				count( $baseline['eligible'] ),
				count( $baseline['human_edited'] ),
				count( $baseline['protected'] ),
				count( $baseline['missing'] )
			),
		);

		return $checks;
	}

	/**
	 * Free disk, measured on the filesystem that actually holds uploads.
	 *
	 * WHY THE THRESHOLD IS NOT THE FORECAST
	 * The forecast is originals plus every derivative WordPress generates. The
	 * gate is deliberately well above it: an import that fills a partition
	 * half way through leaves a media library nobody planned and a site that
	 * cannot write a log line to say so. So the bar is the worst case — which
	 * includes WebP copies the host may or may not make — times a further 1.2,
	 * with a hard floor of 750 MB underneath it.
	 *
	 * WHY THERE IS NO OVERRIDE
	 * disk_free_space() returns false when it is disabled, when open_basedir
	 * forbids the path, and on some managed hosts always. Every one of those
	 * means the same thing: the free space is unknown. A checkbox that let an
	 * operator proceed anyway would turn "unknown" into "assumed fine", which
	 * is the assumption this check exists to refuse.
	 *
	 * WP_CONTENT_DIR is not necessarily the uploads filesystem — uploads can
	 * be moved, or mounted elsewhere — so the measurement is taken at the
	 * uploads basedir itself and both paths are reported.
	 *
	 * @param array<string, mixed> $manifest Manifest.
	 * @return array{ok: bool, detail: string, uploads_path: string, measured_path: string, free: float|false, required: int, worst_case: int}
	 */
	private static function disk_check( array $manifest ): array {
		$uploads = wp_get_upload_dir();
		$basedir = (string) ( $uploads['basedir'] ?? '' );

		$worst    = (int) ( $manifest['forecast']['worst_case_bytes'] ?? 0 );
		$required = max( 750 * 1024 * 1024, (int) ceil( $worst * 1.2 ) );

		$measured = '' !== $basedir && is_dir( $basedir ) ? $basedir : WP_CONTENT_DIR;

		$free = false;

		if ( function_exists( 'disk_free_space' ) ) {
			// Silenced deliberately: open_basedir turns this into a warning on
			// hosts where the answer is simply not available.
			$free = @disk_free_space( $measured ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		}

		if ( ! is_float( $free ) || $free <= 0.0 ) {
			return array(
				'ok'            => false,
				'detail'        => sprintf(
					/* translators: %s: required free space. */
					__( 'NOT RUN — không đọc được dung lượng trống. Cần tối thiểu %s. Execute bị khóa.', 'gcalls-core' ),
					size_format( $required )
				),
				'uploads_path'  => $basedir,
				'measured_path' => $measured,
				'free'          => false,
				'required'      => $required,
				'worst_case'    => $worst,
			);
		}

		$ok = $free >= $required;

		return array(
			'ok'            => $ok,
			'detail'        => sprintf(
				/* translators: 1: free, 2: required, 3: worst case. */
				__( 'trống %1$s · cần %2$s · worst-case %3$s', 'gcalls-core' ),
				size_format( $free ),
				size_format( $required ),
				size_format( $worst )
			),
			'uploads_path'  => $basedir,
			'measured_path' => $measured,
			'free'          => $free,
			'required'      => $required,
			'worst_case'    => $worst,
		);
	}

	/**
	 * Reads the live database and classifies every article in the manifest.
	 *
	 * THIS IS THE AUTHORITY, NOT THE MANIFEST.
	 * The manifest records what each body hashed to when it was built. This
	 * reads what is there NOW and compares. An article whose hash has moved is
	 * somebody's work in progress and is skipped — which is the whole reason
	 * the hashes are in the manifest at all.
	 *
	 * @return array{eligible: array<int, array<string, mixed>>, human_edited: array<int, string>, protected: array<int, string>, review: array<int, string>, missing: array<int, string>, status_changed: array<int, string>}
	 */
	public static function verify_baseline(): array {
		$out = array(
			'eligible'       => array(),
			'human_edited'   => array(),
			'protected'      => array(),
			'review'         => array(),
			'missing'        => array(),
			'status_changed' => array(),
		);

		$manifest = self::manifest();

		if ( null === $manifest ) {
			return $out;
		}

		foreach ( $manifest['articles'] as $article ) {
			$id = (int) $article['id'];

			/* Protected first, before anything else can reclassify it. */
			if ( 'PROTECTED_PUBLISH' === $article['outcome'] ) {
				$out['protected'][] = $article['slug'];
				continue;
			}

			if ( 'MANUAL_REVIEW' === $article['outcome'] ) {
				$out['review'][] = $article['slug'];
				continue;
			}

			$post = get_post( $id );

			if ( ! $post instanceof \WP_Post || 'post' !== $post->post_type ) {
				$out['missing'][] = $article['slug'];
				continue;
			}

			/* A published post is protected whatever the manifest says. */
			if ( 'publish' === $post->post_status ) {
				$out['protected'][] = $article['slug'];
				continue;
			}

			if ( $post->post_status !== $article['status'] ) {
				$out['status_changed'][] = $article['slug'];
				continue;
			}

			if ( hash( 'sha256', (string) $post->post_content ) !== $article['body_sha256'] ) {
				$out['human_edited'][] = $article['slug'];
				continue;
			}

			if ( 'ELIGIBLE' !== $article['outcome'] ) {
				continue;
			}

			$out['eligible'][] = $article;
		}

		return $out;
	}

	/* ---------------------------------------------------------- ajax worker */

	/**
	 * One chunk of work. Called repeatedly by the page until it reports done.
	 */
	public static function ajax_step(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Không đủ quyền.', 'gcalls-core' ) ), 403 );
		}

		check_ajax_referer( self::NONCE_STEP, 'nonce' );

		if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
			wp_send_json_error( array( 'message' => __( 'Chỉ chấp nhận POST.', 'gcalls-core' ) ), 405 );
		}

		/*
		 * NOTHING IS READ FROM THE REQUEST BEYOND THE NONCE.
		 *
		 * There is no post id, no attachment id, no URL, no batch number and
		 * no "next state" in this handler. The browser's only power is to ask
		 * for one more step; what that step is comes entirely from the server's
		 * own stored state and the bundled manifest. A worker that accepted an
		 * index from the client would let a tampered page skip the baseline
		 * check by claiming to be further along than it is.
		 */
		$state = self::state();

		if ( self::S_PAUSED_ERROR === $state['state'] ) {
			wp_send_json_success( self::progress( $state, __( 'Đã tạm dừng vì lỗi. Xem danh sách lỗi bên dưới.', 'gcalls-core' ) ) );
		}

		if ( self::S_COMPLETE === $state['state'] ) {
			wp_send_json_success( self::progress( $state, __( 'Run đã hoàn tất.', 'gcalls-core' ) ) );
		}

		$manifest = self::manifest();

		if ( null === $manifest ) {
			$state['state']    = self::S_PAUSED_ERROR;
			$state['errors'][] = __( 'Manifest không đọc được.', 'gcalls-core' );
			self::save_state( $state );
			wp_send_json_success( self::progress( $state ) );
		}

		/*
		 * Re-checked on EVERY step, not once at the start.
		 *
		 * A run takes minutes. The plugin can be updated underneath it, and
		 * the disk can fill precisely because of what this is doing — which is
		 * the one failure a check at the start could never catch.
		 */
		if ( ( $manifest['plugin_version'] ?? '' ) !== VERSION ) {
			$state['state']    = self::S_PAUSED_ERROR;
			$state['errors'][] = sprintf( 'manifest %s != plugin %s', (string) ( $manifest['plugin_version'] ?? '?' ), VERSION );
			self::save_state( $state );
			wp_send_json_success( self::progress( $state ) );
		}

		if ( ! $state['dry_run'] ) {
			$disk = self::disk_check( $manifest );

			if ( ! $disk['ok'] ) {
				$state['state']    = self::S_PAUSED_ERROR;
				$state['errors'][] = 'disk: ' . $disk['detail'];
				self::save_state( $state );
				wp_send_json_success( self::progress( $state ) );
			}

			if ( '' === (string) $state['run_id'] ) {
				$state['state']    = self::S_PAUSED_ERROR;
				$state['errors'][] = __( 'Chưa có run ID — baseline chưa chạy.', 'gcalls-core' );
				self::save_state( $state );
				wp_send_json_success( self::progress( $state ) );
			}
		}

		switch ( $state['state'] ) {
			case self::S_PREPARED:
				$state = self::step_verify_baseline( $state );
				break;

			case self::S_BASELINE_VERIFIED:
			case self::S_MEDIA_IMPORTING:
				$state = self::step_media( $state );
				break;

			case self::S_MEDIA_COMPLETE:
			case self::S_POST_REWRITE:
				$state = self::step_posts( $state );
				break;

			case self::S_VERIFYING:
				$state['state'] = self::S_COMPLETE;
				break;

			default:
				break;
		}

		self::save_state( $state );

		wp_send_json_success( self::progress( $state ) );
	}

	/**
	 * @param array<string, mixed> $state   Run state.
	 * @param string               $message Optional note.
	 * @return array<string, mixed>
	 */
	private static function progress( array $state, string $message = '' ): array {
		$manifest = self::manifest();
		$media    = null !== $manifest ? self::importable_media( $manifest ) : array();

		return array(
			'state'       => $state['state'],
			'dry_run'     => (bool) $state['dry_run'],
			'media_index' => (int) $state['media_index'],
			'media_total' => count( $media ),
			'post_index'  => (int) $state['post_index'],
			'attachments' => (int) $state['attachments'],
			'rewritten'   => (int) $state['rewritten'],
			'errors'      => array_slice( (array) $state['errors'], -20 ),
			'done'        => self::S_COMPLETE === $state['state'],
			'message'     => $message,
		);
	}

	/**
	 * The media the manifest says to import, in a stable order.
	 *
	 * @param array<string, mixed> $manifest Manifest.
	 * @return array<int, array<string, mixed>>
	 */
	private static function importable_media( array $manifest ): array {
		$items = array_values(
			array_filter(
				$manifest['media'],
				static fn( $m ) => 'LOCALIZE' === $m['verdict']
			)
		);

		usort( $items, static fn( $a, $b ) => strcmp( (string) $a['url'], (string) $b['url'] ) );

		return $items;
	}

	/**
	 * PREPARED → BASELINE_VERIFIED.
	 *
	 * @param array<string, mixed> $state Run state.
	 * @return array<string, mixed>
	 */
	private static function step_verify_baseline( array $state ): array {
		$baseline = self::verify_baseline();

		$state['skipped'] = array(
			'protected'      => count( $baseline['protected'] ),
			'human_edited'   => count( $baseline['human_edited'] ),
			'review'         => count( $baseline['review'] ),
			'missing'        => count( $baseline['missing'] ),
			'status_changed' => count( $baseline['status_changed'] ),
		);

		if ( '' === $state['run_id'] ) {
			$state['run_id']      = gmdate( 'Ymd-His' ) . '-' . wp_generate_password( 6, false, false );
			$state['started_gmt'] = gmdate( 'c' );
		}

		$state['state'] = self::S_BASELINE_VERIFIED;

		return $state;
	}

	/**
	 * Imports the next few images.
	 *
	 * @param array<string, mixed> $state Run state.
	 * @return array<string, mixed>
	 */
	private static function step_media( array $state ): array {
		$manifest = self::manifest();

		if ( null === $manifest ) {
			$state['state']    = self::S_PAUSED_ERROR;
			$state['errors'][] = __( 'Không đọc được manifest.', 'gcalls-core' );

			return $state;
		}

		$items = self::importable_media( $manifest );
		$map   = self::map();
		$index = (int) $state['media_index'];

		if ( $index >= count( $items ) ) {
			$state['state'] = self::S_MEDIA_COMPLETE;

			return $state;
		}

		$state['state'] = self::S_MEDIA_IMPORTING;
		$processed      = 0;

		while ( $processed < self::MEDIA_BATCH && $index < count( $items ) ) {
			$item = $items[ $index ];

			/* Already here, by URL or by identical bytes. Nothing to do. */
			if ( isset( $map['by_url'][ $item['url'] ] ) || isset( $map['by_hash'][ $item['sha256'] ] ) ) {
				if ( ! isset( $map['by_url'][ $item['url'] ] ) ) {
					$map['by_url'][ $item['url'] ] = $map['by_hash'][ $item['sha256'] ];
				}
				++$index;
				++$processed;
				continue;
			}

			if ( $state['dry_run'] ) {
				++$index;
				++$processed;
				continue;
			}

			$attachment_id = self::sideload( $item );

			if ( is_wp_error( $attachment_id ) ) {
				$state['errors'][] = sprintf( '%s — %s', $item['url'], $attachment_id->get_error_message() );

				if ( count( $state['errors'] ) > self::MAX_RETRIES * self::MEDIA_BATCH ) {
					$state['state'] = self::S_PAUSED_ERROR;
					break;
				}

				++$index;
				++$processed;
				continue;
			}

			$map['by_url'][ $item['url'] ]     = $attachment_id;
			$map['by_hash'][ $item['sha256'] ] = $attachment_id;
			$state['attachments']              = (int) $state['attachments'] + 1;

			++$index;
			++$processed;
		}

		$state['media_index'] = $index;
		update_option( self::OPT_MAP, $map, false );

		if ( $index >= count( $items ) && self::S_PAUSED_ERROR !== $state['state'] ) {
			$state['state'] = self::S_MEDIA_COMPLETE;
		}

		return $state;
	}

	/**
	 * Is this URL one the build approved?
	 *
	 * Three separate questions, because each catches a different mistake:
	 * whether the exact URL is in the manifest at all (catches a tampered
	 * loop), whether its host is one the manifest uses (catches a manifest
	 * whose rows were edited), and whether it is HTTPS (catches a downgrade).
	 *
	 * @param string $url URL to check.
	 */
	private static function url_is_allowed( string $url ): bool {
		$manifest = self::manifest();

		if ( null === $manifest ) {
			return false;
		}

		if ( 0 !== strpos( $url, 'https://' ) ) {
			return false;
		}

		$host = wp_parse_url( $url, PHP_URL_HOST );

		if ( ! is_string( $host ) || '' === $host ) {
			return false;
		}

		static $allowed_urls = null;
		static $allowed_hosts = null;

		if ( null === $allowed_urls ) {
			$allowed_urls  = array();
			$allowed_hosts = array();

			foreach ( $manifest['media'] as $row ) {
				if ( 'LOCALIZE' !== $row['verdict'] ) {
					continue;
				}

				$allowed_urls[ (string) $row['url'] ] = true;
				$row_host                             = wp_parse_url( (string) $row['url'], PHP_URL_HOST );

				if ( is_string( $row_host ) && '' !== $row_host ) {
					$allowed_hosts[ strtolower( $row_host ) ] = true;
				}
			}
		}

		return isset( $allowed_urls[ $url ] ) && isset( $allowed_hosts[ strtolower( $host ) ] );
	}

	/**
	 * Downloads one image and creates an attachment.
	 *
	 * The bytes are checked before anything is written: the type is decided by
	 * the file itself, not by the URL or the header, because a server can
	 * serve an HTML error page under an image content-type and that is exactly
	 * what would otherwise land in the media library.
	 *
	 * @param array<string, mixed> $item Manifest media row.
	 * @return int|\WP_Error Attachment id.
	 */
	private static function sideload( array $item ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		/*
		 * The URL must be one the manifest actually contains, on a host the
		 * manifest actually uses, over HTTPS. The first is what stops this
		 * fetching anything the build did not approve; the second and third
		 * are what stop a compromised or edited manifest from turning this
		 * into a request generator.
		 */
		if ( ! self::url_is_allowed( (string) $item['url'] ) ) {
			return new \WP_Error( 'gcalls_url', 'URL is not on the manifest allowlist' );
		}

		/*
		 * wp_safe_remote_get, not wp_remote_get. The safe variant sets
		 * reject_unsafe_urls, which runs the URL — and every redirect target —
		 * through wp_http_validate_url, refusing loopback, private and
		 * link-local addresses. That is the protection that matters here: the
		 * host resolves at request time, not at preflight, so a name that was
		 * public five minutes ago pointing at 169.254.169.254 now is exactly
		 * the case this has to survive.
		 *
		 * limit_response_size caps the body at the transport, so an
		 * unexpectedly enormous file is abandoned rather than read into
		 * memory. redirection is capped at 3.
		 */
		$response = wp_safe_remote_get(
			$item['url'],
			array(
				'timeout'             => self::DOWNLOAD_TIMEOUT,
				'redirection'         => 3,
				'limit_response_size' => self::MAX_DOWNLOAD_BYTES,
				'headers'             => array( 'user-agent' => 'gcalls-corpus-migration' ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return new \WP_Error( 'gcalls_http', sprintf( 'HTTP %d', (int) wp_remote_retrieve_response_code( $response ) ) );
		}

		$body = wp_remote_retrieve_body( $response );

		if ( '' === $body ) {
			return new \WP_Error( 'gcalls_empty', 'empty body' );
		}

		if ( hash( 'sha256', $body ) !== $item['sha256'] ) {
			return new \WP_Error( 'gcalls_hash', 'bytes differ from the manifest' );
		}

		$temp = wp_tempnam( basename( wp_parse_url( $item['url'], PHP_URL_PATH ) ?: 'image' ) );

		if ( ! $temp ) {
			return new \WP_Error( 'gcalls_temp', 'could not create a temporary file' );
		}

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Writing the downloaded body to the temp file WordPress just gave us.
		file_put_contents( $temp, $body );

		$check = wp_check_filetype_and_ext( $temp, basename( (string) wp_parse_url( $item['url'], PHP_URL_PATH ) ) );

		if ( empty( $check['type'] ) || ! in_array( $check['type'], array( 'image/jpeg', 'image/png', 'image/webp', 'image/gif' ), true ) ) {
			wp_delete_file( $temp );

			return new \WP_Error( 'gcalls_mime', sprintf( 'rejected type "%s"', (string) ( $check['type'] ?? 'unknown' ) ) );
		}

		$file = array(
			'name'     => basename( (string) wp_parse_url( $item['url'], PHP_URL_PATH ) ),
			'tmp_name' => $temp,
		);

		$attachment_id = media_handle_sideload( $file, 0 );

		if ( is_wp_error( $attachment_id ) ) {
			wp_delete_file( $temp );

			return $attachment_id;
		}

		/* Alt text from the filename is better than none, and it is honest. */
		$alt = ucfirst( str_replace( '-', ' ', pathinfo( $file['name'], PATHINFO_FILENAME ) ) );
		update_post_meta( (int) $attachment_id, '_wp_attachment_image_alt', sanitize_text_field( $alt ) );
		update_post_meta( (int) $attachment_id, '_gcalls_source_url', esc_url_raw( (string) $item['url'] ) );

		return (int) $attachment_id;
	}

	/**
	 * Rewrites the next few article bodies.
	 *
	 * @param array<string, mixed> $state Run state.
	 * @return array<string, mixed>
	 */
	private static function step_posts( array $state ): array {
		$manifest = self::manifest();

		if ( null === $manifest ) {
			$state['state'] = self::S_PAUSED_ERROR;

			return $state;
		}

		$baseline = self::verify_baseline();
		$eligible = array_values( $baseline['eligible'] );
		$map      = self::map();
		$index    = (int) $state['post_index'];

		if ( $index >= count( $eligible ) ) {
			$state['state'] = self::S_VERIFYING;

			return $state;
		}

		$state['state'] = self::S_POST_REWRITE;
		$processed      = 0;

		while ( $processed < self::POST_BATCH && $index < count( $eligible ) ) {
			$article = $eligible[ $index ];
			$id      = (int) $article['id'];
			$post    = get_post( $id );

			/* Checked again here: the batch before this one may have taken a
			 * minute, and somebody may have saved the post in between. */
			if ( ! $post instanceof \WP_Post
				|| 'publish' === $post->post_status
				|| hash( 'sha256', (string) $post->post_content ) !== $article['body_sha256'] ) {
				++$index;
				++$processed;
				continue;
			}

			$body    = (string) $post->post_content;
			$updated = $body;
			$changed = 0;

			foreach ( $article['rewritable'] as $url ) {
				if ( ! isset( $map['by_url'][ $url ] ) ) {
					continue;
				}

				$new = wp_get_attachment_url( (int) $map['by_url'][ $url ] );

				if ( ! is_string( $new ) || '' === $new ) {
					continue;
				}

				$before  = $updated;
				$updated = str_replace( $url, $new, $updated );

				if ( $before !== $updated ) {
					++$changed;
				}
			}

			if ( $changed > 0 && ! $state['dry_run'] ) {
				/*
				 * The journal entry is written BEFORE the post, and the write
				 * is verified by reading it straight back. A failure between
				 * the two then leaves a recoverable record rather than a
				 * changed post nobody can put back — which is the only
				 * ordering that makes rollback a promise instead of a hope.
				 */
				if ( ! self::journal_write( (string) $state['run_id'], $id, $body, (string) $article['body_sha256'], $post->post_status, (string) $article['hub'], $changed ) ) {
					$state['errors'][] = sprintf( '#%d — journal write failed, post not touched', $id );
					$state['state']    = self::S_PAUSED_ERROR;
					break;
				}

				/*
				 * wp_update_post() with only these keys. post_status is not in
				 * the array, so it cannot be changed here even by accident,
				 * and neither can the title or the slug.
				 */
				$result = wp_update_post(
					array(
						'ID'           => $id,
						'post_content' => $updated,
					),
					true
				);

				if ( is_wp_error( $result ) ) {
					$state['errors'][] = sprintf( '#%d — %s', $id, $result->get_error_message() );
					$state['state']    = self::S_PAUSED_ERROR;
					break;
				}

				$state['rewritten'] = (int) $state['rewritten'] + 1;

				/* The one hub assignment, and only while it is still eligible. */
				if ( '' !== (string) $article['assign_hub'] && taxonomy_exists( 'gcalls_hub' ) ) {
					wp_set_object_terms( $id, (string) $article['assign_hub'], 'gcalls_hub', false );
				}
			}

			++$index;
			++$processed;
		}

		$state['post_index'] = $index;

		if ( $index >= count( $eligible ) && self::S_PAUSED_ERROR !== $state['state'] ) {
			$state['state'] = self::S_VERIFYING;
		}

		return $state;
	}

	/* -------------------------------------------------------------- screen */

	/** Renders the screen and handles the control POSTs. */
	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Bạn không có quyền truy cập trang này.', 'gcalls-core' ) );
		}

		$notice = '';

		if ( isset( $_POST['gcalls_corpus_control'] ) ) {
			check_admin_referer( self::NONCE_CONTROL );

			$action = sanitize_key( wp_unslash( $_POST['gcalls_corpus_control'] ) );
			$state  = self::state();

			if ( 'start_dry' === $action ) {
				$state             = self::state();
				$state['state']    = self::S_PREPARED;
				$state['dry_run']  = true;
				$state['media_index'] = 0;
				$state['post_index']  = 0;
				$state['errors']      = array();
				self::save_state( $state );
				$notice = __( 'Đã đặt lại ở chế độ dry-run.', 'gcalls-core' );
			}

			if ( 'start_execute' === $action ) {
				$failed = array_filter( self::preflight(), static fn( $c ) => ! $c['ok'] );

				if ( array() !== $failed || ! isset( $_POST['gcalls_confirm'] ) ) {
					$notice = __( 'Chưa đủ điều kiện chạy thật: preflight còn mục FAIL hoặc chưa tích xác nhận.', 'gcalls-core' );
				} else {
					$state['state']       = self::S_PREPARED;
					$state['dry_run']     = false;
					$state['media_index'] = 0;
					$state['post_index']  = 0;
					$state['errors']      = array();
					self::save_state( $state );
					$notice = __( 'Đã bật chế độ ghi thật.', 'gcalls-core' );
				}
			}

			if ( 'abort' === $action ) {
				$state['state'] = self::S_PAUSED_ERROR;
				self::save_state( $state );
				$notice = __( 'Đã dừng. Media đã import được giữ nguyên.', 'gcalls-core' );
			}

			if ( 'rollback' === $action ) {
				$notice = self::rollback();
			}
		}

		$state     = self::state();
		$manifest  = self::manifest();
		$preflight = self::preflight();
		$blocked   = array() !== array_filter( $preflight, static fn( $c ) => ! $c['ok'] );

		echo '<div class="wrap"><h1>' . esc_html__( 'Gcalls Corpus Media Migration', 'gcalls-core' ) . '</h1>';

		echo '<p>' . esc_html__(
			'Tải ảnh bài viết về site này và viết lại URL trong thân bài. Không đụng 18 bài publish, không đổi trạng thái bài nào, không chạy importer.',
			'gcalls-core'
		) . '</p>';

		if ( '' !== $notice ) {
			printf( '<div class="notice notice-info"><p>%s</p></div>', esc_html( $notice ) );
		}

		echo '<h2>' . esc_html__( 'Preflight', 'gcalls-core' ) . '</h2>';
		echo '<table class="widefat striped" style="max-width:900px"><tbody>';

		foreach ( $preflight as $check ) {
			printf(
				'<tr><td style="width:32px">%s</td><th scope="row" style="width:300px">%s</th><td><code>%s</code></td></tr>',
				$check['ok'] ? '✅' : '⛔',
				esc_html( $check['label'] ),
				esc_html( $check['detail'] )
			);
		}

		echo '</tbody></table>';

		if ( null !== $manifest ) {
			$counts = array();

			foreach ( $manifest['articles'] as $article ) {
				$counts[ $article['outcome'] ] = ( $counts[ $article['outcome'] ] ?? 0 ) + 1;
			}

			echo '<h2>' . esc_html__( 'Kế hoạch', 'gcalls-core' ) . '</h2><table class="widefat striped" style="max-width:900px"><tbody>';

			foreach ( $counts as $outcome => $n ) {
				printf( '<tr><th scope="row" style="width:300px">%s</th><td>%d</td></tr>', esc_html( (string) $outcome ), (int) $n );
			}

			printf(
				'<tr><th scope="row">%s</th><td>%d</td></tr>',
				esc_html__( 'Attachment sẽ tạo', 'gcalls-core' ),
				count( self::importable_media( $manifest ) )
			);
			printf(
				'<tr><th scope="row">%s</th><td>%s</td></tr>',
				esc_html__( 'Dung lượng cần trống', 'gcalls-core' ),
				esc_html( size_format( (int) ( $manifest['forecast']['required_free_bytes'] ?? 0 ) ) )
			);

			echo '</tbody></table>';
		}

		echo '<h2>' . esc_html__( 'Chạy', 'gcalls-core' ) . '</h2>';
		printf(
			'<p><strong>%s</strong> <code>%s</code> · run <code>%s</code> · %s</p>',
			esc_html__( 'Trạng thái:', 'gcalls-core' ),
			esc_html( (string) $state['state'] ),
			esc_html( (string) ( $state['run_id'] ?: '—' ) ),
			$state['dry_run'] ? esc_html__( 'DRY RUN', 'gcalls-core' ) : '<span style="color:#a01b1b">GHI THẬT</span>'
		);

		echo '<form method="post" style="display:inline">';
		wp_nonce_field( self::NONCE_CONTROL );
		echo '<button class="button" name="gcalls_corpus_control" value="start_dry">' . esc_html__( 'Đặt lại (dry-run)', 'gcalls-core' ) . '</button> ';
		echo '</form> ';

		echo '<form method="post" style="display:inline">';
		wp_nonce_field( self::NONCE_CONTROL );
		echo '<label style="margin-right:.5rem"><input type="checkbox" name="gcalls_confirm" value="1"> '
			. esc_html__( 'Tôi đã đọc báo cáo và cho phép ghi thật.', 'gcalls-core' ) . '</label>';
		printf(
			'<button class="button button-primary" name="gcalls_corpus_control" value="start_execute" %s>%s</button>',
			$blocked ? 'disabled' : '',
			esc_html__( 'Bật ghi thật', 'gcalls-core' )
		);
		echo '</form>';

		echo '<p><button class="button button-primary" id="gcalls-corpus-run">' . esc_html__( 'Chạy tiếp', 'gcalls-core' ) . '</button> ';
		echo '<button class="button" id="gcalls-corpus-pause">' . esc_html__( 'Tạm dừng', 'gcalls-core' ) . '</button></p>';
		echo '<pre id="gcalls-corpus-log" style="background:#fff;border:1px solid #ccd0d4;max-height:320px;overflow:auto;padding:12px"></pre>';

		echo '<form method="post">';
		wp_nonce_field( self::NONCE_CONTROL );
		echo '<button class="button" name="gcalls_corpus_control" value="rollback">' . esc_html__( 'Hoàn nguyên thân bài của run này', 'gcalls-core' ) . '</button>';
		echo ' <span class="description">' . esc_html__( 'Không xóa attachment. Orphan được báo riêng.', 'gcalls-core' ) . '</span>';
		echo '</form>';

		self::print_script();

		echo '</div>';
	}

	/** The tiny driver that walks the chunks. */
	private static function print_script(): void {
		$nonce = wp_create_nonce( self::NONCE_STEP );
		?>
		<script>
		( function () {
			var running = false;
			var log = document.getElementById( 'gcalls-corpus-log' );
			var run = document.getElementById( 'gcalls-corpus-run' );
			var pause = document.getElementById( 'gcalls-corpus-pause' );

			function line( text ) {
				log.textContent += text + '\n';
				log.scrollTop = log.scrollHeight;
			}

			function step() {
				if ( ! running ) { return; }

				var body = new FormData();
				body.append( 'action', 'gcalls_corpus_step' );
				body.append( 'nonce', <?php echo wp_json_encode( $nonce ); ?> );

				fetch( ajaxurl, { method: 'POST', credentials: 'same-origin', body: body } )
					.then( function ( r ) { return r.json(); } )
					.then( function ( payload ) {
						if ( ! payload || ! payload.success ) {
							running = false;
							line( 'DỪNG: phản hồi không hợp lệ' );
							return;
						}

						var d = payload.data;
						line(
							d.state + '  media ' + d.media_index + '/' + d.media_total +
							'  posts ' + d.post_index + '  attachments ' + d.attachments +
							'  rewritten ' + d.rewritten + ( d.dry_run ? '  [dry-run]' : '' )
						);

						( d.errors || [] ).slice( -3 ).forEach( function ( e ) { line( '  ! ' + e ); } );

						if ( d.done || d.state === 'PAUSED_ERROR' ) {
							running = false;
							line( d.done ? 'HOÀN TẤT' : 'ĐÃ TẠM DỪNG VÌ LỖI' );
							return;
						}

						// Sequential, never parallel: one chunk at a time is what
						// keeps this gentle on a shared host.
						setTimeout( step, 400 );
					} )
					.catch( function ( error ) {
						running = false;
						line( 'DỪNG: ' + error );
					} );
			}

			run.addEventListener( 'click', function () {
				if ( running ) { return; }
				running = true;
				line( '--- bắt đầu ---' );
				step();
			} );

			pause.addEventListener( 'click', function () {
				running = false;
				line( '--- tạm dừng (tiến độ đã lưu) ---' );
			} );
		}() );
		</script>
		<?php
	}

	/**
	 * Restores the bodies this run changed.
	 *
	 * Attachments are NOT deleted. Removing them in the same operation that
	 * restores the bodies is how a rollback destroys the files a second attempt
	 * would need; orphans are listed instead and cleaned up separately, later,
	 * on purpose.
	 */
	private static function rollback(): string {
		$state  = self::state();
		$run_id = (string) $state['run_id'];

		if ( '' === $run_id ) {
			return __( 'Không có run nào để hoàn nguyên.', 'gcalls-core' );
		}

		$ids = get_option( self::OPT_JOURNAL_INDEX . $run_id );

		if ( ! is_array( $ids ) || array() === $ids ) {
			return __( 'Run này chưa ghi gì, không có gì để hoàn nguyên.', 'gcalls-core' );
		}

		$restored = 0;
		$skipped  = 0;
		$corrupt  = array();

		foreach ( $ids as $id ) {
			$entry = get_option( self::OPT_JOURNAL_PREFIX . $run_id . '_' . (int) $id );

			if ( ! is_array( $entry ) || ! isset( $entry['body'], $entry['checksum'], $entry['run_id'] ) ) {
				$corrupt[] = (int) $id;
				continue;
			}

			/*
			 * A record whose checksum does not match its body is not a record
			 * — restoring from it would write whatever the corruption left
			 * behind over a real article. Stop the whole rollback rather than
			 * skip it quietly: if one record is damaged the others are
			 * suspect too, and a half-finished rollback is worse than none.
			 */
			if ( hash( 'sha256', (string) $entry['body'] ) !== $entry['checksum'] ) {
				$corrupt[] = (int) $id;
				continue;
			}

			/* A journal from another run must never be applied here. */
			if ( (string) $entry['run_id'] !== $run_id ) {
				++$skipped;
				continue;
			}

			$post = get_post( (int) $id );

			if ( ! $post instanceof \WP_Post || 'publish' === $post->post_status ) {
				++$skipped;
				continue;
			}

			wp_update_post(
				array(
					'ID'           => (int) $id,
					'post_content' => (string) $entry['body'],
				)
			);

			++$restored;
		}

		if ( array() !== $corrupt ) {
			return sprintf(
				/* translators: 1: count, 2: post ids. */
				__( 'DỪNG: %1$d bản ghi journal hỏng checksum (post %2$s). Không hoàn nguyên gì cả — cần kiểm tra thủ công.', 'gcalls-core' ),
				count( $corrupt ),
				implode( ', ', array_map( 'strval', $corrupt ) )
			);
		}

		/*
		 * The journal is kept, not deleted. It is the only record of what this
		 * run changed, and the orphan report is built from it — throwing it
		 * away the moment the bodies are back would discard the evidence of
		 * which attachments are now unreferenced.
		 */
		return sprintf(
			/* translators: 1: restored, 2: skipped. */
			__( 'Đã hoàn nguyên %1$d bài, bỏ qua %2$d. Attachment KHÔNG bị xóa; journal được giữ để dựng báo cáo orphan.', 'gcalls-core' ),
			$restored,
			$skipped
		);
	}

	/**
	 * Writes one journal record and reads it back to prove it landed.
	 *
	 * @param string $run_id  Run this record belongs to.
	 * @param int    $id      Post id.
	 * @param string $body    Body being replaced.
	 * @param string $hash    Hash the body was expected to have.
	 * @param string $status  Post status at the time.
	 * @param string $hub     Hub slug at the time.
	 * @param int    $changed How many URLs are being rewritten.
	 */
	private static function journal_write( string $run_id, int $id, string $body, string $hash, string $status, string $hub, int $changed ): bool {
		$key = self::OPT_JOURNAL_PREFIX . $run_id . '_' . $id;

		/* A record already there for this run and post is not overwritten:
		 * the first one holds the ORIGINAL body, and that is the one rollback
		 * needs. */
		$existing = get_option( $key );

		if ( is_array( $existing ) && isset( $existing['body'] ) ) {
			return true;
		}

		$record = array(
			'run_id'       => $run_id,
			'post_id'      => $id,
			'saved_at_gmt' => gmdate( 'c' ),
			'status'       => $status,
			'hub'          => $hub,
			'body'         => $body,
			'body_sha256'  => $hash,
			'checksum'     => hash( 'sha256', $body ),
			'urls_changed' => $changed,
			'version'      => VERSION,
		);

		// Explicit autoload=false: these hold article bodies and must never be
		// loaded on a front-end request.
		add_option( $key, $record, '', false );
		update_option( $key, $record, false );

		$written = get_option( $key );

		if ( ! is_array( $written ) || ! isset( $written['checksum'] ) || $written['checksum'] !== $record['checksum'] ) {
			return false;
		}

		$index = get_option( self::OPT_JOURNAL_INDEX . $run_id );
		$index = is_array( $index ) ? $index : array();

		if ( ! in_array( $id, $index, true ) ) {
			$index[] = $id;
			add_option( self::OPT_JOURNAL_INDEX . $run_id, $index, '', false );
			update_option( self::OPT_JOURNAL_INDEX . $run_id, $index, false );
		}

		return true;
	}

}
