<?php
/**
 * Product mockups — the React home page visuals, ported.
 *
 * WHY THESE ARE MARKUP AND NOT SCREENSHOTS
 * Seven components on the React home page are interactive: they have tabs you
 * switch, lists you select from, a playback progress bar and a call timer. A
 * screenshot of one is a picture of a single frame, and a reviewer clicking it
 * learns that the demo is a picture. So they are rebuilt as semantic HTML with
 * real buttons — which also means they are keyboard operable, which a screenshot
 * never is.
 *
 * THE THREE EXCEPTIONS, AND WHY THEY ARE IMAGES
 * `*_showcase` at the foot of this file are images, and only ever heroes. The
 * argument above is about a panel a reader can reach and click; a hero is the
 * first screen, judged at a glance and usually not touched. What it has to do
 * is look like software, and a full application frame — sidebar, list, working
 * pane — is what does that. The markup panels are deliberately small and
 * single-purpose; stretched across a hero, one shows four rows and a lot of
 * white. So each of CX, Voicebot and QC leads with a drawn frame and keeps its
 * interactive panel further down the same page, where clicking it is possible
 * and therefore worth having. The images are generated, not photographed —
 * see wordpress/scripts/build-demo-imagery.mjs for the source and the rules.
 *
 * WHY THE DATA IS FAKE AND SAYS SO
 * The React source uses plausible Vietnamese personal names and company names.
 * Carrying those onto a public demo would put invented people beside a real
 * brand. Everything here is Khách hàng A/B/C, Công ty Demo, phone numbers masked
 * to the last two digits and example.com addresses, and every visual carries a
 * caption saying it is demo data. The numbers are shapes, not results: none of
 * them is presented as an achievement.
 *
 * WHAT THE MARKUP GUARANTEES
 * Every mockup reserves its own height through aspect-ratio or a min-height, so
 * nothing below it moves when the JavaScript wakes up. Without JavaScript each
 * one renders its first state and stays there — a still panel, not an empty box.
 *
 * @package Gcalls\Core
 */

declare( strict_types = 1 );

namespace Gcalls\Core;

defined( 'ABSPATH' ) || exit;

/**
 * `[gcalls_mockup id="…"]`
 */
final class Mockups {

	/** Registers the shortcode. */
	public static function init(): void {
		add_shortcode( 'gcalls_mockup', array( self::class, 'render' ) );
	}

	/** Demo contacts. Deliberately anonymous — see the file header. */
	private const CONTACTS = array(
		array( 'name' => 'Khách hàng A', 'org' => 'Công ty Demo 1', 'phone' => '090 *** **12', 'tag' => 'Khách hàng mới' ),
		array( 'name' => 'Khách hàng B', 'org' => 'Công ty Demo 2', 'phone' => '091 *** **34', 'tag' => 'VIP' ),
		array( 'name' => 'Khách hàng C', 'org' => 'Công ty Demo 3', 'phone' => '098 *** **56', 'tag' => '' ),
		array( 'name' => 'Khách hàng D', 'org' => 'Công ty Demo 4', 'phone' => '097 *** **78', 'tag' => '' ),
	);

	/** Demo agents. */
	private const AGENTS = array(
		array( 'name' => 'Nhân viên 1', 'state' => 'available', 'label' => 'Sẵn sàng' ),
		array( 'name' => 'Nhân viên 2', 'state' => 'in-call', 'label' => 'Đang gọi' ),
		array( 'name' => 'Nhân viên 3', 'state' => 'available', 'label' => 'Sẵn sàng' ),
		array( 'name' => 'Nhân viên 4', 'state' => 'away', 'label' => 'Vắng mặt' ),
		array( 'name' => 'Nhân viên 5', 'state' => 'offline', 'label' => 'Ngoại tuyến' ),
	);

	/** The caption every mockup carries. */
	private static function caption( string $text = '' ): string {
		$text = '' !== $text ? $text : __( 'Giao diện minh họa – dữ liệu demo', 'gcalls-core' );

		return '<p class="gcalls-mock__caption">' . esc_html( $text ) . '</p>';
	}

	/** A window chrome header, shared by every mockup. */
	private static function chrome( string $title ): string {
		return '<div class="gcalls-mock__bar"><span class="gcalls-mock__dot"></span><span class="gcalls-mock__dot"></span>'
			. '<span class="gcalls-mock__dot"></span><span class="gcalls-mock__title">' . esc_html( $title ) . '</span></div>';
	}

	/**
	 * Renders one mockup.
	 *
	 * @param array<string, string>|string $atts Shortcode attributes.
	 * @return string
	 */
	public static function render( $atts = array() ): string {
		$atts = shortcode_atts( array( 'id' => '' ), (array) $atts, 'gcalls_mockup' );
		$id   = sanitize_key( str_replace( '-', '_', (string) $atts['id'] ) );

		$method = 'mock_' . $id;

		if ( ! method_exists( self::class, $method ) ) {
			return '';
		}

		wp_enqueue_style( 'gcalls-mockups', GCALLS_CORE_URL . 'assets/css/mockups.css', array(), VERSION );
		wp_enqueue_script( 'gcalls-mockups', GCALLS_CORE_URL . 'assets/js/mockups.js', array(), VERSION, true );

		return '<div class="gcalls-mock" data-gcalls-mock="' . esc_attr( $id ) . '">' . self::$method() . '</div>';
	}

	/* -------------------------------------------------------------- 1. hero */

	/**
	 * HeroSection — the webphone dashboard.
	 *
	 * React drives a playback progress bar on an interval and a KPI strip. The
	 * KPI values are shapes, not measurements, and the caption says so.
	 */
	private static function mock_hero(): string {
		/*
		 * Four KPIs, because the reference's strip is a four-column grid and a
		 * three-column port reads as a different component.
		 *
		 * The reference also prints a delta beside each one (+12%, +4%, −0:18).
		 * Those are NOT reproduced. A value like "73%" under a caption saying
		 * the data is illustrative reads as a shape; "+12%" reads as an
		 * improvement this product delivered, and there is no measurement in
		 * this repository behind it. Same layout, one claim fewer.
		 */
		$kpis = array(
			array( 'Cuộc gọi hôm nay', '84' ),
			array( 'Tỷ lệ nghe máy', '73%' ),
			array( 'Thời gian TB', '5:24' ),
			array( 'Đã chốt deal', '11' ),
		);

		/* The dashboard, which is the stage's main card. */
		$main  = self::chrome( 'Gcalls Webphone — Dashboard' );
		$main .= '<div class="gcalls-mock__strip gcalls-mock__strip--in"><span class="gcalls-mock__pulse" aria-hidden="true"></span>';
		$main .= '<span><strong>Cuộc gọi đến</strong> · ' . esc_html( self::CONTACTS[0]['name'] ) . '</span>';
		$main .= '<span class="gcalls-mock__muted">' . esc_html( self::CONTACTS[0]['phone'] ) . '</span>';
		$main .= '<span class="gcalls-mock__badge">Đang đổ chuông</span></div>';

		$main .= '<div class="gcalls-mock__kpis">';
		foreach ( $kpis as $kpi ) {
			$main .= '<div class="gcalls-mock__kpi"><span>' . esc_html( $kpi[0] ) . '</span><strong>' . esc_html( $kpi[1] ) . '</strong></div>';
		}
		$main .= '</div>';

		/* A short call list, so the frame reads as a working screen. */
		$rows = array(
			array( 'A', 'Khách hàng A', 'Gọi đi · 3:42', '09:14', 'out' ),
			array( 'B', 'Khách hàng B', 'Gọi đến · 7:18', '09:31', 'in' ),
			array( 'C', 'Khách hàng C', 'Nhỡ', '09:52', 'missed' ),
		);

		$main .= '<ul class="gcalls-mock__list gcalls-mock__list--calls">';
		foreach ( $rows as $row ) {
			$main .= '<li><span class="gcalls-mock__avatar">' . esc_html( $row[0] ) . '</span>';
			$main .= '<span class="gcalls-mock__who"><strong>' . esc_html( $row[1] ) . '</strong>';
			$main .= '<small>' . esc_html( $row[2] ) . '</small></span>';
			$main .= '<span class="gcalls-mock__kind gcalls-mock__kind--' . esc_attr( $row[4] ) . '">' . esc_html( $row[3] ) . '</span></li>';
		}
		$main .= '</ul>';

		/*
		 * The recording card. This is the one float the reference keeps below
		 * `lg`; the other three are desktop-only because at 390px they overlap
		 * each other and clip their own contents.
		 */
		$wave = '';
		for ( $i = 0; $i < 34; $i++ ) {
			// Deterministic, not random: the reference had to stop re-rolling
			// these on every playback tick because the waveform visibly boiled.
			$h     = (int) max( 4, 10 + sin( $i * 0.7 ) * 6 + sin( $i * 1.3 ) * 8 );
			$wave .= '<span style="height:' . esc_attr( (string) $h ) . 'px"></span>';
		}

		$timeline  = '<div class="gcalls-mock__cardhead"><strong>' . esc_html__( 'Bản ghi cuộc gọi', 'gcalls-core' ) . '</strong>';
		$timeline .= '<span class="gcalls-mock__badge">Đã nghe</span></div>';
		$timeline .= '<div class="gcalls-mock__wave" aria-hidden="true">' . $wave . '</div>';
		$timeline .= '<div class="gcalls-mock__player"><button type="button" class="gcalls-mock__play" data-mock-play aria-pressed="false">';
		$timeline .= '<span class="screen-reader-text">Phát bản ghi minh họa</span><span aria-hidden="true">▶</span></button>';
		$timeline .= '<div class="gcalls-mock__track"><div class="gcalls-mock__fill" data-mock-progress style="width:38%"></div></div>';
		$timeline .= '<span class="gcalls-mock__time" data-mock-elapsed>0:38</span></div>';

		/* Weekly shape — bars only, no axis values. */
		$bars = '';
		foreach ( array( 46, 62, 78, 54, 88, 40, 28 ) as $pct ) {
			$bars .= '<span style="height:' . esc_attr( (string) $pct ) . '%"></span>';
		}

		$analytics  = '<div class="gcalls-mock__cardhead"><strong>' . esc_html__( 'Hiệu suất tuần', 'gcalls-core' ) . '</strong></div>';
		$analytics .= '<div class="gcalls-stage__bars" aria-hidden="true">' . $bars . '</div>';

		/* The identification moment, in miniature. */
		$popup  = '<div class="gcalls-mock__cardhead"><strong>' . esc_html__( 'Cuộc gọi đến', 'gcalls-core' ) . '</strong>';
		$popup .= '<span class="gcalls-mock__pulse" aria-hidden="true"></span></div>';
		$popup .= '<div class="gcalls-mock__who"><strong>' . esc_html( self::CONTACTS[0]['name'] ) . '</strong>';
		$popup .= '<small>' . esc_html( self::CONTACTS[0]['org'] ) . ' · ' . esc_html( self::CONTACTS[0]['phone'] ) . '</small></div>';

		/* Dialpad. */
		$keys = '';
		foreach ( array( '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#' ) as $key ) {
			$keys .= '<span>' . esc_html( $key ) . '</span>';
		}

		$dialpad  = '<div class="gcalls-mock__dialnum">090 *** **12</div>';
		$dialpad .= '<div class="gcalls-mock__keys" aria-hidden="true">' . $keys . '</div>';

		$float = static function ( string $name, string $body, bool $lg_only = false ): string {
			return '<div class="gcalls-stage__float gcalls-stage__float--' . esc_attr( $name )
				. ( $lg_only ? ' gcalls-stage__float--lg' : '' ) . '">' . $body . '</div>';
		};

		$out  = '<div class="gcalls-stage">';
		$out .= '<div class="gcalls-stage__main">' . $main . '</div>';
		$out .= $float( 'timeline', $timeline );
		$out .= $float( 'analytics', $analytics, true );
		$out .= $float( 'popup', $popup, true );
		$out .= $float( 'dialpad', $dialpad, true );
		$out .= '</div>';

		return $out . self::caption();
	}

	/* --------------------------------------------- approved image gallery */

	/**
	 * Gcalls Plus visual gallery.
	 *
	 * These six frames came from the approved demo-image pack. They are bundled
	 * with the plugin rather than stored as attachment ids, so an update remains
	 * reproducible on every WordPress environment. The first image is eager and
	 * the remaining states are lazy; JavaScript only switches the visible frame.
	 */
	private static function mock_plus_gallery(): string {
		$frames = array(
			'overview' => array( 'Tổng quan', 'webphone-overview.webp', 'Tổng quan hoạt động Gcalls Plus Webphone', 1600, 900 ),
			'profile'  => array( 'Khách hàng', 'customer-profile.webp', 'Hồ sơ khách hàng và thao tác gọi trực tiếp', 1448, 1086 ),
			'history'  => array( 'Lịch sử gọi', 'call-history.webp', 'Lịch sử tương tác và cuộc gọi', 1600, 900 ),
			'analytics'=> array( 'Thống kê', 'analytics-dashboard.webp', 'Dashboard thống kê hiệu suất cuộc gọi', 1600, 900 ),
			'agents'   => array( 'Hiệu suất', 'agent-performance.webp', 'Hiệu suất và trạng thái nhân viên', 1600, 900 ),
			'click'    => array( 'Click-to-Call', 'click-to-call.webp', 'Cấu hình Click-to-Call trên website và CRM', 1600, 900 ),
		);

		$out  = '<div class="gcalls-gallery__tabs" role="tablist" aria-label="Xem giao diện Gcalls Plus">';
		$first = true;
		foreach ( $frames as $key => $frame ) {
			$out .= '<button type="button" role="tab" data-gallery-tab="' . esc_attr( $key ) . '" aria-selected="' . ( $first ? 'true' : 'false' ) . '">' . esc_html( $frame[0] ) . '</button>';
			$first = false;
		}
		$out .= '</div><div class="gcalls-gallery__stage">';

		$first = true;
		foreach ( $frames as $key => $frame ) {
			$src  = GCALLS_CORE_URL . 'assets/images/product-gallery/' . $frame[1];
			$out .= '<figure data-gallery-panel="' . esc_attr( $key ) . '"' . ( $first ? '' : ' hidden' ) . '>';
			$out .= '<img src="' . esc_url( $src ) . '" width="' . esc_attr( (string) $frame[3] ) . '" height="' . esc_attr( (string) $frame[4] ) . '" alt="' . esc_attr( $frame[2] ) . '" ';
			$out .= $first ? 'fetchpriority="high" decoding="async">' : 'loading="lazy" decoding="async">';
			$out .= '<figcaption>' . esc_html( $frame[2] ) . '</figcaption></figure>';
			$first = false;
		}

		$out .= '</div>';

		return $out . self::caption( __( 'Hình minh họa giao diện – dữ liệu demo đã được ẩn danh', 'gcalls-core' ) );
	}

	/* --------------------------------------------------- 2. call timeline */

	/** CallTimelineSection — filterable call log with a playback bar. */
	private static function mock_call_timeline(): string {
		$tabs  = array( 'all' => 'Tất cả', 'in' => 'Đến', 'out' => 'Đi', 'missed' => 'Nhỡ' );
		$calls = array(
			array( 0, 'in', 'Đến', '7:18' ),
			array( 1, 'out', 'Đi', '3:42' ),
			array( 2, 'missed', 'Nhỡ', '—' ),
			array( 3, 'in', 'Đến', '2:05' ),
		);

		$out  = self::chrome( 'Lịch sử cuộc gọi' );
		$out .= '<div class="gcalls-mock__tabs" role="tablist" aria-label="Lọc cuộc gọi">';
		$first = true;
		foreach ( $tabs as $key => $label ) {
			$out  .= '<button type="button" role="tab" data-mock-tab="' . esc_attr( $key ) . '" aria-selected="' . ( $first ? 'true' : 'false' ) . '">' . esc_html( $label ) . '</button>';
			$first = false;
		}
		$out .= '</div><ul class="gcalls-mock__list">';

		foreach ( $calls as $call ) {
			$contact = self::CONTACTS[ $call[0] ];
			$out    .= '<li data-mock-type="' . esc_attr( $call[1] ) . '"><span class="gcalls-mock__avatar" aria-hidden="true">' . esc_html( mb_substr( $contact['name'], -1 ) ) . '</span>';
			$out    .= '<span class="gcalls-mock__who"><strong>' . esc_html( $contact['name'] ) . '</strong><small>' . esc_html( $contact['phone'] ) . '</small></span>';
			$out    .= '<span class="gcalls-mock__kind gcalls-mock__kind--' . esc_attr( $call[1] ) . '">' . esc_html( $call[2] ) . '</span>';
			$out    .= '<span class="gcalls-mock__dur">' . esc_html( $call[3] ) . '</span></li>';
		}

		$out .= '</ul>';
		$out .= '<div class="gcalls-mock__player"><button type="button" class="gcalls-mock__play" data-mock-play aria-pressed="false">';
		$out .= '<span class="screen-reader-text">Phát bản ghi minh họa</span><span aria-hidden="true">▶</span></button>';
		$out .= '<div class="gcalls-mock__track"><div class="gcalls-mock__fill" data-mock-progress style="width:44%"></div></div>';
		$out .= '<span class="gcalls-mock__time" data-mock-elapsed>0:44</span></div>';

		return $out . self::caption();
	}

	/* ----------------------------------------------------------- 3. CRM */

	/** CRMSection — contact list beside the selected contact's record. */
	private static function mock_crm(): string {
		$out  = self::chrome( 'Hồ sơ khách hàng' );
		$out .= '<div class="gcalls-mock__split"><ul class="gcalls-mock__side" role="tablist" aria-label="Danh bạ">';

		foreach ( self::CONTACTS as $index => $contact ) {
			$out .= '<li><button type="button" role="tab" data-mock-select="' . esc_attr( (string) $index ) . '" aria-selected="' . ( 0 === $index ? 'true' : 'false' ) . '">';
			$out .= '<strong>' . esc_html( $contact['name'] ) . '</strong><small>' . esc_html( $contact['org'] ) . '</small></button></li>';
		}

		$out .= '</ul><div class="gcalls-mock__pane">';

		foreach ( self::CONTACTS as $index => $contact ) {
			$out .= '<div class="gcalls-mock__record" data-mock-panel="' . esc_attr( (string) $index ) . '"' . ( 0 === $index ? '' : ' hidden' ) . '>';
			$out .= '<p class="gcalls-mock__record-name">' . esc_html( $contact['name'] ) . '</p>';
			$out .= '<dl><dt>Điện thoại</dt><dd>' . esc_html( $contact['phone'] ) . '</dd>';
			$out .= '<dt>Email</dt><dd>' . esc_html( 'lienhe' . ( $index + 1 ) . '@example.com' ) . '</dd>';
			$out .= '<dt>Công ty</dt><dd>' . esc_html( $contact['org'] ) . '</dd></dl>';
			$out .= '<p class="gcalls-mock__note"><strong>Ghi chú:</strong> Đã trao đổi nhu cầu, gửi tài liệu tuần này.</p>';
			$out .= '<ul class="gcalls-mock__events"><li><span>Cuộc gọi đến</span><small>7:18 phút · Ghi âm có sẵn</small></li>';
			$out .= '<li><span>Cuộc gọi đi</span><small>3:42 phút · Đã nghe máy</small></li></ul>';
			$out .= '</div>';
		}

		return $out . '</div></div>' . self::caption();
	}

	/* ------------------------------------------------------- 4. analytics */

	/** AnalyticsSection — the range-switchable bar chart. */
	private static function mock_analytics(): string {
		$series = array(
			'day'   => array( 4, 9, 14, 11, 16, 7, 3 ),
			'week'  => array( 12, 18, 24, 17, 26, 11, 6 ),
			'month' => array( 48, 61, 74, 66, 82, 39, 21 ),
		);
		$labels = array( 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN' );

		$out  = self::chrome( 'Gcalls Analytics' );
		$out .= '<div class="gcalls-mock__tabs" role="tablist" aria-label="Khoảng thời gian">';
		foreach ( array( 'day' => 'Ngày', 'week' => 'Tuần', 'month' => 'Tháng' ) as $key => $label ) {
			$out .= '<button type="button" role="tab" data-mock-range="' . esc_attr( $key ) . '" aria-selected="' . ( 'week' === $key ? 'true' : 'false' ) . '">' . esc_html( $label ) . '</button>';
		}
		$out .= '</div>';

		$out .= '<div class="gcalls-mock__chart" data-mock-series="' . esc_attr( (string) wp_json_encode( $series ) ) . '">';
		$out .= '<div class="gcalls-mock__bars" role="img" aria-label="Biểu đồ minh họa số cuộc gọi theo ngày trong tuần">';
		foreach ( $series['week'] as $index => $value ) {
			$height = (int) round( ( $value / 26 ) * 100 );
			$out   .= '<span class="gcalls-mock__bar" data-mock-bar style="height:' . esc_attr( (string) $height ) . '%"><em>' . esc_html( $labels[ $index ] ) . '</em></span>';
		}
		$out .= '</div></div>';

		$out .= '<div class="gcalls-mock__kpis">';
		foreach ( array( array( 'Tổng cuộc gọi', '114' ), array( 'Tỷ lệ bắt máy', '73%' ), array( 'TB thời lượng', '3:25' ) ) as $kpi ) {
			$out .= '<div class="gcalls-mock__kpi"><span>' . esc_html( $kpi[0] ) . '</span><strong>' . esc_html( $kpi[1] ) . '</strong></div>';
		}
		$out .= '</div>';

		return $out . self::caption( __( 'Giao diện minh họa – dữ liệu demo, không phải kết quả đo được của một doanh nghiệp cụ thể', 'gcalls-core' ) );
	}

	/* ----------------------------------------------------------- 5. cloud */

	/** CloudSection — the SIP / IVR / routing configuration tabs. */
	private static function mock_cloud(): string {
		$panels = array(
			'sip'     => array( 'SIP Extensions', array( 'Tài khoản SIP cho từng nhân viên, đa thiết bị', 'Đăng nhập trên trình duyệt hoặc softphone', 'Trạng thái đăng ký hiển thị theo thời gian thực' ) ),
			'ivr'     => array( 'IVR', array( 'Cây menu tự động nhiều cấp, cấu hình linh hoạt', 'Lời chào và nhánh phím theo giờ làm việc', 'Chuyển tiếp khi không có phím bấm' ) ),
			'routing' => array( 'Call Routing', array( 'Điều hướng theo bộ phận, chi nhánh hoặc người phụ trách', 'Ring Group khi cần nhiều người cùng nhận', 'Call Forwarding khi không có người nhận máy' ) ),
		);

		$out  = self::chrome( 'Cấu hình tổng đài Cloud' );
		$out .= '<div class="gcalls-mock__tabs" role="tablist" aria-label="Cấu hình">';
		foreach ( $panels as $key => $panel ) {
			$out .= '<button type="button" role="tab" data-mock-select="' . esc_attr( $key ) . '" aria-selected="' . ( 'sip' === $key ? 'true' : 'false' ) . '">' . esc_html( $panel[0] ) . '</button>';
		}
		$out .= '</div>';

		foreach ( $panels as $key => $panel ) {
			$out .= '<div class="gcalls-mock__record" data-mock-panel="' . esc_attr( $key ) . '"' . ( 'sip' === $key ? '' : ' hidden' ) . '><ul class="gcalls-mock__ticks">';
			foreach ( $panel[1] as $line ) {
				$out .= '<li>' . esc_html( $line ) . '</li>';
			}
			$out .= '</ul></div>';
		}

		return $out . self::caption();
	}

	/* ----------------------------------------------- 6. integrations/API */

	/** IntegrationsSection — the endpoint list and the incoming-call popup. */
	private static function mock_integrations(): string {
		$endpoints = array(
			array( 'GET', '/calls', 'Lấy danh sách cuộc gọi' ),
			array( 'POST', '/calls', 'Khởi tạo cuộc gọi đi' ),
			array( 'GET', '/contacts/{id}', 'Chi tiết khách hàng' ),
			array( 'PATCH', '/contacts/{id}', 'Cập nhật thông tin KH' ),
			array( 'POST', '/webhooks', 'Đăng ký webhook event' ),
		);

		$out  = self::chrome( 'Open API' );
		$out .= '<ul class="gcalls-mock__api" role="tablist" aria-label="Endpoint">';
		foreach ( $endpoints as $index => $endpoint ) {
			$out .= '<li><button type="button" role="tab" data-mock-select="' . esc_attr( (string) $index ) . '" aria-selected="' . ( 0 === $index ? 'true' : 'false' ) . '">';
			$out .= '<span class="gcalls-mock__verb gcalls-mock__verb--' . esc_attr( strtolower( $endpoint[0] ) ) . '">' . esc_html( $endpoint[0] ) . '</span>';
			$out .= '<code>' . esc_html( $endpoint[1] ) . '</code><small>' . esc_html( $endpoint[2] ) . '</small></button></li>';
		}
		$out .= '</ul>';

		foreach ( $endpoints as $index => $endpoint ) {
			$out .= '<pre class="gcalls-mock__code" data-mock-panel="' . esc_attr( (string) $index ) . '"' . ( 0 === $index ? '' : ' hidden' ) . '>';
			$out .= esc_html( $endpoint[0] . ' https://api.example.com/v1' . $endpoint[1] ) . "\n";
			$out .= esc_html( 'Authorization: Bearer <token>' );
			$out .= '</pre>';
		}

		return $out . self::caption();
	}

	/* --------------------------------------------- 7. work from anywhere */

	/** WorkFromAnywhereSection — agent status board with a live call timer. */
	private static function mock_work_anywhere(): string {
		$filters = array( 'all' => 'Tất cả', 'available' => 'Sẵn sàng', 'in-call' => 'Đang gọi', 'away' => 'Vắng mặt', 'offline' => 'Ngoại tuyến' );

		$out  = self::chrome( 'Trạng thái đội ngũ' );
		$out .= '<div class="gcalls-mock__tabs" role="tablist" aria-label="Lọc trạng thái">';
		$first = true;
		foreach ( $filters as $key => $label ) {
			$out  .= '<button type="button" role="tab" data-mock-tab="' . esc_attr( $key ) . '" aria-selected="' . ( $first ? 'true' : 'false' ) . '">' . esc_html( $label ) . '</button>';
			$first = false;
		}
		$out .= '</div><ul class="gcalls-mock__list">';

		foreach ( self::AGENTS as $agent ) {
			$out .= '<li data-mock-type="' . esc_attr( $agent['state'] ) . '">';
			$out .= '<span class="gcalls-mock__status gcalls-mock__status--' . esc_attr( $agent['state'] ) . '" aria-hidden="true"></span>';
			$out .= '<span class="gcalls-mock__who"><strong>' . esc_html( $agent['name'] ) . '</strong><small>' . esc_html( $agent['label'] ) . '</small></span>';
			$out .= 'in-call' === $agent['state']
				? '<span class="gcalls-mock__dur" data-mock-timer>00:42</span>'
				: '<span class="gcalls-mock__dur">—</span>';
			$out .= '</li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/* ------------------------------------------------- product demo visuals */

	/*
	 * Eleven surfaces, ported one-for-one from the React product pages.
	 *
	 * WHY ONE PER SECTION AND NOT ONE REUSED
	 * The port used to answer four CX sections with two panels and a pair of
	 * generic CRM/analytics mockups, which meant "báo cáo vận hành" and
	 * "hồ sơ khách hàng" showed the same picture with a different heading. A
	 * visual that does not depict its own section is worse than none: it tells
	 * the reader the screenshots are decorative. Each section now gets the
	 * component the reference gives it.
	 *
	 * IDENTIFIERS
	 * The reference already anonymises these — masked ids (KH #4821, #A-1042,
	 * LH-2481) and role labels (Agent 02), never a person or a company. That is
	 * carried across unchanged; nothing here needed inventing or scrubbing.
	 *
	 * THE NUMBERS
	 * Every figure is demo data under the caption each mockup prints. None is
	 * framed as a result: there is no percentage improvement, no saving and no
	 * outcome attributed to Gcalls anywhere in this block.
	 */

	/** The five verified Gcalls CX channels. Nothing outside this list. */
	private const CHANNELS = array(
		'voice'    => 'Voice',
		'zalo'     => 'Zalo',
		'facebook' => 'Facebook',
		'sms'      => 'SMS',
		'email'    => 'Email',
	);

	/** One channel pill. Colour comes from the class, never from markup. */
	private static function chan( string $key ): string {
		$label = self::CHANNELS[ $key ] ?? $key;

		return '<span class="gcalls-chan gcalls-chan--' . esc_attr( $key ) . '">' . esc_html( $label ) . '</span>';
	}

	/** A status pill: brand by default, amber when it needs attention. */
	private static function state( string $label, bool $warn = false ): string {
		return '<span class="gcalls-state' . ( $warn ? ' gcalls-state--warn' : '' ) . '">' . esc_html( $label ) . '</span>';
	}

	/** A two-up grid of figure tiles. */
	private static function tiles( array $items ): string {
		$out = '<ul class="gcalls-tiles">';
		foreach ( $items as $item ) {
			$out .= '<li class="gcalls-tile"><strong>' . esc_html( $item[1] ) . '</strong>'
				. '<span>' . esc_html( $item[0] ) . '</span></li>';
		}

		return $out . '</ul>';
	}

	/** A titled sub-panel. */
	private static function block( string $title, string $body ): string {
		return '<div class="gcalls-block"><p class="gcalls-block__t">' . esc_html( $title ) . '</p>' . $body . '</div>';
	}

	/* ---- Gcalls CX ---------------------------------------------------- */

	/** OmnichannelInboxMockup — conversations from the connected channels. */
	private static function mock_cx_inbox(): string {
		$rows = array(
			array( 'KH #4821', 'zalo', 'Đơn của mình khi nào giao?', 'Chờ xử lý', true ),
			array( 'KH #4817', 'voice', 'Cuộc gọi đến · 2:14', 'Đang xử lý', false ),
			array( 'KH #4813', 'facebook', 'Shop còn size M không ạ?', 'Đang xử lý', false ),
			array( 'KH #4809', 'email', 'Yêu cầu xuất hóa đơn', 'Đã xong', false ),
			array( 'KH #4804', 'sms', 'Xác nhận lịch hẹn', 'Đã xong', false ),
		);

		$out  = self::chrome( 'Omnichannel Inbox' );
		$out .= '<div class="gcalls-chanbar"><span class="gcalls-chanbar__all">Tất cả</span>';
		foreach ( array_keys( self::CHANNELS ) as $key ) {
			$out .= self::chan( $key );
		}
		$out .= '</div>';

		$out .= '<ul class="gcalls-rows">';
		foreach ( $rows as $row ) {
			$out .= '<li class="gcalls-row"><span class="gcalls-row__main">';
			$out .= '<span class="gcalls-row__head"><b>' . esc_html( $row[0] ) . '</b>' . self::chan( $row[1] ) . '</span>';
			$out .= '<small>' . esc_html( $row[2] ) . '</small></span>';
			$out .= self::state( $row[3], $row[4] ) . '</li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/** TicketPanelMockup — status, assignee and the handling history. */
	private static function mock_cx_ticket(): string {
		$history = array(
			array( '09:12', 'Tiếp nhận từ Zalo OA' ),
			array( '09:20', 'Phân công cho Agent 02' ),
			array( '10:05', 'Đã phản hồi khách hàng' ),
		);

		$out  = self::chrome( 'Ticket #T-2043' );
		$out .= '<div class="gcalls-pad">';
		$out .= '<div class="gcalls-row__head">' . self::state( 'Đang xử lý', true ) . self::chan( 'zalo' );
		$out .= '<span class="gcalls-row__by">Phụ trách: Agent 02</span></div>';
		$out .= '<p class="gcalls-lead"><b>Yêu cầu kiểm tra tình trạng đơn hàng</b></p>';
		$out .= '<p class="gcalls-sub">Khách hàng liên hệ qua Zalo OA và cần cập nhật thời gian giao dự kiến.</p>';

		$out .= '<ul class="gcalls-hist">';
		foreach ( $history as $item ) {
			$out .= '<li><span class="gcalls-hist__at">' . esc_html( $item[0] ) . '</span>'
				. '<span>' . esc_html( $item[1] ) . '</span></li>';
		}

		return $out . '</ul></div>' . self::caption();
	}

	/** CustomerContextMockup — one customer, every channel they used. */
	private static function mock_cx_context(): string {
		$recent = array(
			array( 'zalo', 'Hỏi tình trạng đơn hàng', 'Hôm nay' ),
			array( 'voice', 'Cuộc gọi đến · 2:14', 'Hôm qua' ),
			array( 'email', 'Yêu cầu xuất hóa đơn', '3 ngày trước' ),
		);

		$out  = self::chrome( 'Customer Context' );
		$out .= '<div class="gcalls-pad">';
		$out .= '<div class="gcalls-who"><span class="gcalls-mock__avatar">KH</span>';
		$out .= '<span class="gcalls-mock__who"><strong>KH #4821</strong>'
			. '<small>Khách hàng · 3 kênh đã tương tác</small></span></div>';

		$out .= '<div class="gcalls-chanrow">' . self::chan( 'zalo' ) . self::chan( 'voice' ) . self::chan( 'email' ) . '</div>';

		$out .= '<p class="gcalls-block__t">Tương tác gần đây</p><ul class="gcalls-recent">';
		foreach ( $recent as $item ) {
			$out .= '<li>' . self::chan( $item[0] ) . '<span>' . esc_html( $item[1] ) . '</span>'
				. '<i>' . esc_html( $item[2] ) . '</i></li>';
		}
		$out .= '</ul>';

		$out .= '<div class="gcalls-note"><p class="gcalls-block__t">Ticket liên quan</p>'
			. '<p>#T-2043 · Đang xử lý · Agent 02</p></div>';

		return $out . '</div>' . self::caption();
	}

	/** CxReportingMockup — workload, ticket status, channel distribution. */
	private static function mock_cx_report(): string {
		$statuses = array(
			array( 'Chờ xử lý', 12, 'warn' ),
			array( 'Đang xử lý', 21, 'brand' ),
			array( 'Đã xong', 14, 'ok' ),
		);
		$dist     = array(
			array( 'voice', 34 ),
			array( 'zalo', 28 ),
			array( 'facebook', 19 ),
			array( 'email', 12 ),
			array( 'sms', 7 ),
		);

		$max = 0;
		foreach ( $statuses as $status ) {
			$max = max( $max, $status[1] );
		}

		$out  = self::chrome( 'Báo cáo vận hành' );
		$out .= '<div class="gcalls-pad">';
		$out .= self::tiles(
			array(
				array( 'Hội thoại hôm nay', '312' ),
				array( 'Ticket đang mở', '47' ),
			)
		);

		$bars = '<ul class="gcalls-meters">';
		foreach ( $statuses as $status ) {
			$width = 0 === $max ? 0 : (int) round( ( $status[1] / $max ) * 100 );
			$bars .= '<li><span class="gcalls-meters__l">' . esc_html( $status[0] ) . '</span>';
			$bars .= '<span class="gcalls-meters__track"><span class="gcalls-meters__fill gcalls-meters__fill--'
				. esc_attr( $status[2] ) . '" style="width:' . esc_attr( (string) $width ) . '%"></span></span>';
			$bars .= '<b>' . esc_html( (string) $status[1] ) . '</b></li>';
		}
		$bars .= '</ul>';
		$out  .= self::block( 'Trạng thái ticket', $bars );

		$rows = '<ul class="gcalls-meters gcalls-meters--chan">';
		foreach ( $dist as $item ) {
			$rows .= '<li>' . self::chan( $item[0] );
			$rows .= '<span class="gcalls-meters__track"><span class="gcalls-meters__fill" style="width:'
				. esc_attr( (string) $item[1] ) . '%"></span></span>';
			$rows .= '<b>' . esc_html( (string) $item[1] ) . '%</b></li>';
		}
		$rows .= '</ul>';
		$out  .= self::block( 'Phân bổ theo kênh', $rows );

		return $out . '</div>' . self::caption();
	}

	/* ---- Voicebot AI --------------------------------------------------- */

	/** VoicebotCampaignMockup — the campaign console. */
	private static function mock_voicebot_builder(): string {
		$outcomes = array(
			array( 'Xác nhận lịch hẹn', 46, 'brand' ),
			array( 'Đề nghị gọi lại', 27, 'brand' ),
			array( 'Cần nhân viên hỗ trợ', 15, 'warn' ),
			array( 'Không kết nối', 12, 'muted' ),
		);
		$history  = array(
			array( 'LH-2481', '09:12', 'Đã xác nhận' ),
			array( 'LH-2479', '09:08', 'Chuyển nhân viên' ),
			array( 'LH-2476', '09:03', 'Hẹn gọi lại' ),
		);

		$out  = self::chrome( 'Voicebot · Chiến dịch nhắc lịch hẹn' );
		$out .= '<div class="gcalls-chanbar"><span class="gcalls-mock__pulse" aria-hidden="true"></span>';
		$out .= '<span class="gcalls-row__by">Chiến dịch đang chạy</span>';
		$out .= '<span class="gcalls-state">Minh họa</span></div>';

		$out .= '<div class="gcalls-pad">';
		$out .= self::tiles(
			array(
				array( 'Trong danh sách', '480' ),
				array( 'Đã gọi', '312' ),
				array( 'Đã kết nối', '198' ),
				array( 'Cần nhân viên', '24' ),
			)
		);

		$bars = '<ul class="gcalls-outcomes">';
		foreach ( $outcomes as $outcome ) {
			$bars .= '<li><span class="gcalls-outcomes__head"><span>' . esc_html( $outcome[0] ) . '</span>'
				. '<b>' . esc_html( (string) $outcome[1] ) . '%</b></span>';
			$bars .= '<span class="gcalls-meters__track"><span class="gcalls-meters__fill gcalls-meters__fill--'
				. esc_attr( $outcome[2] ) . '" style="width:' . esc_attr( (string) $outcome[1] ) . '%"></span></span></li>';
		}
		$bars .= '</ul>';
		$out  .= self::block( 'Kết quả phản hồi', $bars );

		$rows = '<ul class="gcalls-rows gcalls-rows--tight">';
		foreach ( $history as $item ) {
			$rows .= '<li class="gcalls-row"><b class="gcalls-row__id">' . esc_html( $item[0] ) . '</b>';
			$rows .= '<span class="gcalls-hist__at">' . esc_html( $item[1] ) . '</span>';
			$rows .= '<span class="gcalls-row__end">' . esc_html( $item[2] ) . '</span></li>';
		}
		$rows .= '</ul>';
		$out  .= self::block( 'Lịch sử tương tác', $rows );

		return $out . '</div>' . self::caption();
	}

	/** VoicebotHandoffMockup — the calls the bot routed to a person. */
	private static function mock_voicebot_handoff(): string {
		$rows = array(
			array( 'LH-2479', 'Khách hỏi ngoài kịch bản', 'Tư vấn' ),
			array( 'LH-2465', 'Đề nghị thương lượng điều khoản', 'Tư vấn' ),
			array( 'LH-2452', 'Phản hồi cần xử lý riêng', 'CSKH' ),
			array( 'LH-2440', 'Yêu cầu gặp nhân viên', 'CSKH' ),
		);

		$out  = self::chrome( 'Hàng đợi chuyển nhân viên' );
		$out .= '<ul class="gcalls-rows">';
		foreach ( $rows as $row ) {
			$out .= '<li class="gcalls-row"><b class="gcalls-row__id">' . esc_html( $row[0] ) . '</b>';
			$out .= '<span class="gcalls-row__main"><small>' . esc_html( $row[1] ) . '</small></span>';
			$out .= self::state( $row[2] ) . '</li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/* ---- QC Bot AI ----------------------------------------------------- */

	/** TranscriptMockup — speech-to-text output with one flagged keyword. */
	private static function mock_qc_transcript(): string {
		$turns = array(
			array( 'Nhân viên 01', '00:04', 'Dạ em nghe, em có thể hỗ trợ mình thông tin gì ạ?', '' ),
			array( 'Khách hàng A', '00:11', 'Tôi gọi lần thứ hai rồi mà vẫn chưa được xử lý.', 'lặp lại liên hệ' ),
			array( 'Nhân viên 01', '00:19', 'Em xin lỗi vì sự bất tiện này, em kiểm tra ngay giúp mình ạ.', '' ),
			array( 'Khách hàng A', '00:31', 'Vậy bao lâu thì tôi nhận được phản hồi?', '' ),
		);

		$out  = self::chrome( 'Transcript · Cuộc gọi #A-1042' );
		$out .= '<div class="gcalls-chanbar"><span class="gcalls-row__by">Tìm trong transcript…</span>';
		$out .= '<span class="gcalls-state">Demo</span></div>';

		$out .= '<ul class="gcalls-turns">';
		foreach ( $turns as $turn ) {
			$out .= '<li><span class="gcalls-hist__at">' . esc_html( $turn[1] ) . '</span><span>';
			$out .= '<b class="gcalls-turns__who">' . esc_html( $turn[0] ) . '</b>';
			$out .= '<span class="gcalls-turns__text">' . esc_html( $turn[2] ) . '</span>';
			if ( '' !== $turn[3] ) {
				$out .= '<span class="gcalls-state gcalls-state--warn">Từ khóa: ' . esc_html( $turn[3] ) . '</span>';
			}
			$out .= '</span></li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/** ScoreCardMockup — criteria, weights and a score awaiting a human. */
	private static function mock_qc_scorecard(): string {
		$criteria = array(
			array( 'Chào hỏi & xác minh', '20%', true ),
			array( 'Tuân thủ kịch bản', '30%', true ),
			array( 'Xử lý phản hồi', '30%', false ),
			array( 'Kết thúc cuộc gọi', '20%', true ),
		);

		$out  = self::chrome( 'QA Scoring' );
		$out .= '<div class="gcalls-pad">';
		// "Điểm đề xuất … chờ QA xác nhận" is the reference's framing and it
		// matters: the product proposes, a person decides. A bare score would
		// claim the machine grades the call.
		$out .= '<div class="gcalls-score"><span><b>Điểm đề xuất</b><small>Chờ QA xác nhận</small></span>';
		$out .= '<em>78</em></div>';

		$out .= '<ul class="gcalls-crit">';
		foreach ( $criteria as $item ) {
			$out .= '<li><span class="gcalls-crit__i gcalls-crit__i--' . ( $item[2] ? 'ok' : 'no' ) . '" aria-hidden="true">'
				. ( $item[2] ? '✓' : '!' ) . '</span>';
			$out .= '<span class="gcalls-crit__l">' . esc_html( $item[0] ) . '</span>';
			$out .= '<b>' . esc_html( $item[1] ) . '</b></li>';
		}

		return $out . '</ul></div>' . self::caption();
	}

	/** SignalsMockup — the flagged-call queue. */
	private static function mock_qc_signals(): string {
		$rows = array(
			array( '#A-1042', 'Lặp lại liên hệ', 'Tiêu cực', true ),
			array( '#A-1039', 'Yêu cầu hoàn tiền', 'Tiêu cực', true ),
			array( '#A-1035', 'Hỏi chính sách', 'Trung tính', false ),
			array( '#A-1028', 'Xác nhận đơn', 'Tích cực', false ),
		);

		$out  = self::chrome( 'Conversation Signals' );
		$out .= '<div class="gcalls-chanbar"><span class="gcalls-row__by">Cuộc gọi cần xem lại</span>';
		$out .= '<span class="gcalls-row__end">Dữ liệu mẫu</span></div>';

		$out .= '<ul class="gcalls-rows">';
		foreach ( $rows as $row ) {
			$out .= '<li class="gcalls-row"><b class="gcalls-row__id">' . esc_html( $row[0] ) . '</b>';
			$out .= '<span class="gcalls-row__main"><small>' . esc_html( $row[1] ) . '</small></span>';
			$out .= self::state( $row[2], $row[3] ) . '</li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/** QualityDashboardMockup — the aggregate view. */
	private static function mock_qc_dashboard(): string {
		$bars = array(
			array( 'T2', 62 ),
			array( 'T3', 74 ),
			array( 'T4', 58 ),
			array( 'T5', 88 ),
			array( 'T6', 79 ),
			array( 'T7', 41 ),
		);

		$out  = self::chrome( 'Quality Dashboard' );
		$out .= '<div class="gcalls-pad">';
		$out .= self::tiles(
			array(
				array( 'Cuộc gọi đã phân tích', '1.248' ),
				array( 'Cần xem lại', '86' ),
				array( 'Điểm QA trung bình', '81' ),
				array( 'Phiên review tuần này', '34' ),
			)
		);

		$trend = '<div class="gcalls-trend" aria-hidden="true">';
		foreach ( $bars as $bar ) {
			$trend .= '<span class="gcalls-trend__col"><span class="gcalls-trend__bar" style="height:'
				. esc_attr( (string) $bar[1] ) . '%"></span><small>' . esc_html( $bar[0] ) . '</small></span>';
		}
		$trend .= '</div>';
		$out   .= self::block( 'Xu hướng điểm QA', $trend );

		return $out . '</div>' . self::caption();
	}

	/** ReviewWorkspaceMockup — transcript beside the criteria. */
	private static function mock_qc_review(): string {
		$turns = array(
			array( 'Nhân viên 01', 'Dạ em nghe, em hỗ trợ mình ạ.' ),
			array( 'Khách hàng A', 'Tôi gọi lần thứ hai rồi.' ),
			array( 'Nhân viên 01', 'Em xin lỗi, em kiểm tra ngay ạ.' ),
		);
		$crit  = array(
			array( 'Chào hỏi', true ),
			array( 'Kịch bản', true ),
			array( 'Xử lý phản hồi', false ),
		);

		$out  = self::chrome( 'Conversation Review' );
		$out .= '<div class="gcalls-mock__split">';

		$out .= '<div class="gcalls-mock__pane"><p class="gcalls-block__t">Transcript</p><ul class="gcalls-turns">';
		foreach ( $turns as $turn ) {
			$out .= '<li><span><b class="gcalls-turns__who">' . esc_html( $turn[0] ) . '</b>'
				. '<span class="gcalls-turns__text">' . esc_html( $turn[1] ) . '</span></span></li>';
		}
		$out .= '</ul></div>';

		$out .= '<div class="gcalls-mock__pane"><p class="gcalls-block__t">Tiêu chí QA</p><ul class="gcalls-crit">';
		foreach ( $crit as $item ) {
			$out .= '<li><span class="gcalls-crit__i gcalls-crit__i--' . ( $item[1] ? 'ok' : 'no' ) . '" aria-hidden="true">'
				. ( $item[1] ? '✓' : '!' ) . '</span><span class="gcalls-crit__l">' . esc_html( $item[0] ) . '</span></li>';
		}
		$out .= '</ul><div class="gcalls-note"><p class="gcalls-block__t">Điểm đề xuất</p>'
			. '<p class="gcalls-note__big">78</p><small>Chờ QA xác nhận</small></div></div>';

		return $out . '</div>' . self::caption();
	}

	/* ------------------------------------- 9. customer popup / 10. widget */

	/**
	 * CustomerPopupSection — the screen pop when a call arrives.
	 *
	 * Ported from IntegrationsSection.tsx's CustomerPopupMockup, which is an
	 * interactive component: it opens ringing, and answering it switches the
	 * bar to "Đã kết nối". The port previously showed a static screenshot
	 * instead, which meant the one section whose whole argument is "this
	 * happens the moment a call arrives" could not demonstrate the moment.
	 *
	 * The reference's invented personal name and company are NOT carried over;
	 * this uses the anonymous demo contacts like every other mockup here. See
	 * the file header for why that rule exists.
	 */
	private static function mock_customer_popup(): string {
		$history = array(
			array( 'Gọi đi · 3:42', 'Hôm nay 09:14' ),
			array( 'Ghi chú: cần gửi báo giá', 'Hôm nay 09:35' ),
		);

		$out  = '<div class="gcalls-pop" data-mock-pop>';
		$out .= '<div class="gcalls-pop__bar">';
		$out .= '<span class="gcalls-pop__ring" aria-hidden="true"></span>';
		$out .= '<span class="gcalls-pop__state"><strong data-mock-pop-state>Cuộc gọi đến…</strong>';
		$out .= '<small>' . esc_html( self::CONTACTS[0]['phone'] ) . ' · Hotline demo</small></span>';
		$out .= '<span class="gcalls-pop__acts">';
		$out .= '<button type="button" class="gcalls-pop__btn gcalls-pop__btn--yes" data-mock-pop-answer>'
			. '<span class="screen-reader-text">' . esc_html__( 'Bắt máy', 'gcalls-core' ) . '</span><span aria-hidden="true">✆</span></button>';
		$out .= '<button type="button" class="gcalls-pop__btn gcalls-pop__btn--no" data-mock-pop-reject>'
			. '<span class="screen-reader-text">' . esc_html__( 'Từ chối cuộc gọi', 'gcalls-core' ) . '</span><span aria-hidden="true">✕</span></button>';
		$out .= '</span></div>';

		$out .= '<div class="gcalls-pop__body">';
		$out .= '<div class="gcalls-pop__who"><span class="gcalls-mock__avatar">A</span>';
		$out .= '<span class="gcalls-mock__who"><strong>' . esc_html( self::CONTACTS[0]['name'] ) . '</strong>';
		$out .= '<small>' . esc_html( self::CONTACTS[0]['org'] ) . '</small></span>';
		$out .= '<span class="gcalls-mock__badge">' . esc_html( self::CONTACTS[0]['tag'] ) . '</span></div>';

		$out .= '<div class="gcalls-pop__hist"><span class="gcalls-pop__histhead">Lịch sử gần nhất</span>';
		foreach ( $history as $item ) {
			$out .= '<span class="gcalls-pop__row"><em>' . esc_html( $item[0] ) . '</em><i>' . esc_html( $item[1] ) . '</i></span>';
		}
		$out .= '</div>';

		$out .= '<div class="gcalls-pop__quick">';
		foreach ( array( 'Ghi chú', 'Gắn tag', 'Xem hồ sơ' ) as $action ) {
			$out .= '<button type="button">' . esc_html( $action ) . '</button>';
		}
		$out .= '</div></div></div>';

		return $out . self::caption();
	}

	/**
	 * CallWidgetSection — the call button a visitor opens on a website.
	 *
	 * Ported from WidgetMockup, which opens and closes and takes a number.
	 * The port showed a configuration screenshot: correct subject, wrong
	 * argument — the section sells what the VISITOR sees, not what the admin
	 * configures.
	 */
	private static function mock_widget(): string {
		$out  = '<div class="gcalls-widget" data-mock-widget>';
		$out .= '<div class="gcalls-widget__page" aria-hidden="true">';
		$out .= '<span class="gcalls-widget__bar"></span><span class="gcalls-widget__line"></span>';
		$out .= '<span class="gcalls-widget__line gcalls-widget__line--short"></span>';
		$out .= '</div>';

		$out .= '<div class="gcalls-widget__panel" data-mock-widget-panel hidden>';
		$out .= '<div class="gcalls-widget__head"><strong>' . esc_html__( 'Gọi lại cho tôi', 'gcalls-core' ) . '</strong>';
		$out .= '<small>' . esc_html__( 'Để lại số điện thoại, đội ngũ sẽ liên hệ lại.', 'gcalls-core' ) . '</small></div>';
		// A demo field: it is deliberately not a form and posts nowhere, so no
		// visitor can believe they have submitted a number to anyone.
		$out .= '<div class="gcalls-widget__field" aria-hidden="true">090 *** **12</div>';
		$out .= '<span class="gcalls-widget__send">' . esc_html__( 'Yêu cầu gọi lại', 'gcalls-core' ) . '</span>';
		$out .= '</div>';

		$out .= '<button type="button" class="gcalls-widget__fab" data-mock-widget-toggle aria-expanded="false">';
		$out .= '<span aria-hidden="true">✆</span><span class="screen-reader-text">'
			. esc_html__( 'Mở khung gọi lại minh họa', 'gcalls-core' ) . '</span></button>';
		$out .= '</div>';

		return $out . self::caption();
	}

	/* ------------------------------------------------- product hero shots */

	/**
	 * One demo image, filling its own reserved box.
	 *
	 * These three are heroes, so the image is eager and high priority: it is
	 * the largest paint on the page and waiting for it is the page waiting.
	 * Width and height are attributes, not CSS alone, so the box is reserved
	 * before the bytes arrive and nothing below it moves.
	 *
	 * @param string $file Filename inside assets/images/product-gallery/.
	 * @param string $alt  Alt text — describes the interface, not the file.
	 */
	private static function showcase( string $file, string $alt ): string {
		$src = GCALLS_CORE_URL . 'assets/images/product-gallery/' . $file;

		return '<figure class="gcalls-shot">'
			. '<img src="' . esc_url( $src ) . '" width="1600" height="900" alt="' . esc_attr( $alt ) . '" fetchpriority="high" decoding="async">'
			. '</figure>'
			. self::caption( __( 'Hình minh họa giao diện – dữ liệu demo đã được ẩn danh', 'gcalls-core' ) );
	}

	/** Gcalls CX hero — the unified inbox, as a full application frame. */
	private static function mock_cx_showcase(): string {
		return self::showcase(
			'gcalls-cx-omnichannel-demo.webp',
			__( 'Giao diện demo Gcalls CX: hộp thư hợp nhất hotline, Zalo OA, Facebook và email trong một màn hình', 'gcalls-core' )
		);
	}

	/** Voicebot AI hero — the script builder canvas. */
	private static function mock_voicebot_showcase(): string {
		return self::showcase(
			'voicebot-flow-builder-demo.webp',
			__( 'Giao diện demo Gcalls Voicebot AI: trình dựng kịch bản với các khối lời chào, điều kiện rẽ nhánh và chuyển nhân viên', 'gcalls-core' )
		);
	}

	/** QC Bot AI hero — transcript beside the scorecard. */
	private static function mock_qc_showcase(): string {
		return self::showcase(
			'qc-scoring-dashboard-demo.webp',
			__( 'Giao diện demo Gcalls QC Bot AI: bản ghi hội thoại và bộ tiêu chí chấm điểm cuộc gọi', 'gcalls-core' )
		);
	}
}
