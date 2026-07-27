import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function GcallsPlusPage() {
  return (
    <PageShell
      eyebrow="Sản phẩm"
      title="Gcalls Plus Webphone"
      intro="Tổng đài chuyên nghiệp chạy trên trình duyệt, giúp đội Sales và CSKH nghe gọi, quản lý danh bạ, lịch sử tương tác, ghi chú và theo dõi hoạt động cuộc gọi."
      breadcrumb={[{ label: 'Sản phẩm' }, { label: 'Gcalls Plus Webphone' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Gcalls Plus Webphone sẽ được xây dựng ở checkpoint
        tiếp theo.
      </DevStatusNote>
    </PageShell>
  )
}
