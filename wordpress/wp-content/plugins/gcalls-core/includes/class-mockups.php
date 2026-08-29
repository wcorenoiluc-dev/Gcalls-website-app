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
		$kpis = array(
			array( 'Cuộc gọi hôm nay', '128' ),
			array( 'Tỷ lệ nghe máy', '73%' ),
			array( 'Thời gian TB', '5:24' ),
		);

		$out = self::chrome( 'Gcalls Webphone — Dashboard' );

		$out .= '<div class="gcalls-mock__strip"><span class="gcalls-mock__pulse" aria-hidden="true"></span>';
		$out .= '<span><strong>Cuộc gọi đến</strong> · ' . esc_html( self::CONTACTS[0]['name'] ) . '</span>';
		$out .= '<span class="gcalls-mock__muted">' . esc_html( self::CONTACTS[0]['phone'] ) . '</span>';
		$out .= '<span class="gcalls-mock__badge">Đang đổ chuông</span></div>';

		$out .= '<div class="gcalls-mock__kpis">';
		foreach ( $kpis as $kpi ) {
			$out .= '<div class="gcalls-mock__kpi"><span>' . esc_html( $kpi[0] ) . '</span><strong>' . esc_html( $kpi[1] ) . '</strong></div>';
		}
		$out .= '</div>';

		// The progress bar the interval drives. Starts at the React value so the
		// no-JavaScript rendering is the same frame, not an empty track.
		$out .= '<div class="gcalls-mock__player"><button type="button" class="gcalls-mock__play" data-mock-play aria-pressed="false">';
		$out .= '<span class="screen-reader-text">Phát bản ghi minh họa</span><span aria-hidden="true">▶</span></button>';
		$out .= '<div class="gcalls-mock__track"><div class="gcalls-mock__fill" data-mock-progress style="width:38%"></div></div>';
		$out .= '<span class="gcalls-mock__time" data-mock-elapsed>0:38</span></div>';

		return $out . self::caption();
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

	/** Gcalls CX — omnichannel inbox. */
	private static function mock_cx_inbox(): string {
		$threads = array(
			array( 'Hotline', 'Khách hàng A', 'Cần hỗ trợ gia hạn dịch vụ', 'Mới' ),
			array( 'Zalo OA', 'Khách hàng B', 'Hỏi về thời gian xử lý', 'Đang xử lý' ),
			array( 'Facebook', 'Khách hàng C', 'Phản hồi sau khi dùng thử', 'Chờ phản hồi' ),
			array( 'Email', 'Khách hàng D', 'Yêu cầu báo giá cấu hình', 'Mới' ),
		);

		$out  = self::chrome( 'Gcalls CX — Inbox hợp nhất' );
		$out .= '<ul class="gcalls-mock__list gcalls-mock__list--threads">';
		foreach ( $threads as $thread ) {
			$out .= '<li><span class="gcalls-mock__chan">' . esc_html( $thread[0] ) . '</span>';
			$out .= '<span class="gcalls-mock__who"><strong>' . esc_html( $thread[1] ) . '</strong><small>' . esc_html( $thread[2] ) . '</small></span>';
			$out .= '<span class="gcalls-mock__badge">' . esc_html( $thread[3] ) . '</span></li>';
		}

		return $out . '</ul>' . self::caption();
	}

	/** Voicebot — the script builder. */
	private static function mock_voicebot_builder(): string {
		$steps = array(
			array( '01', 'Lời chào', 'Xin chào, đây là tổng đài Công ty Demo.' ),
			array( '02', 'Xác định nhu cầu', 'Anh/chị cần hỗ trợ về dịch vụ nào?' ),
			array( '03', 'Nhánh xử lý', 'Chuyển tới kịch bản tương ứng.' ),
			array( '04', 'Chuyển nhân viên', 'Điều kiện chuyển đạt — nối máy.' ),
		);

		$out  = self::chrome( 'Trình dựng kịch bản Voicebot' );
		$out .= '<ol class="gcalls-mock__steps">';
		foreach ( $steps as $step ) {
			$out .= '<li><span class="gcalls-mock__n">' . esc_html( $step[0] ) . '</span>';
			$out .= '<span class="gcalls-mock__who"><strong>' . esc_html( $step[1] ) . '</strong><small>' . esc_html( $step[2] ) . '</small></span></li>';
		}

		return $out . '</ol>' . self::caption();
	}

	/** QC Bot AI — transcript with scoring criteria. */
	private static function mock_qc_transcript(): string {
		$lines = array(
			array( 'Nhân viên', 'Dạ em chào anh/chị, em gọi từ Công ty Demo ạ.' ),
			array( 'Khách hàng', 'Vâng, em nói giúp anh về gói dịch vụ.' ),
			array( 'Nhân viên', 'Dạ em xin phép trao đổi về nhu cầu hiện tại của bên mình.' ),
		);
		$criteria = array(
			array( 'Chào hỏi đúng chuẩn', 'đạt' ),
			array( 'Xác nhận nhu cầu', 'đạt' ),
			array( 'Tóm tắt trước khi kết thúc', 'chưa đạt' ),
		);

		$out  = self::chrome( 'QC Bot AI — Transcript & chấm điểm' );
		$out .= '<div class="gcalls-mock__split"><div class="gcalls-mock__pane"><ul class="gcalls-mock__script">';
		foreach ( $lines as $line ) {
			$out .= '<li><span class="gcalls-mock__role">' . esc_html( $line[0] ) . '</span><span>' . esc_html( $line[1] ) . '</span></li>';
		}
		$out .= '</ul></div><ul class="gcalls-mock__criteria">';
		foreach ( $criteria as $item ) {
			$out .= '<li><span>' . esc_html( $item[0] ) . '</span><em class="gcalls-mock__mark gcalls-mock__mark--' . ( 'đạt' === $item[1] ? 'ok' : 'no' ) . '">' . esc_html( $item[1] ) . '</em></li>';
		}
		$out .= '</ul></div>';

		return $out . self::caption();
	}
}
