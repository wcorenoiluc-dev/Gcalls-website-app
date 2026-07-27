import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function POSIntegrationPage() {
  return (
    <PageShell
      eyebrow="Giải pháp"
      title="Tích hợp POS"
      intro="Kết nối tổng đài Gcalls với hệ thống POS để nhận diện khách hàng và xử lý đơn hàng ngay khi cuộc gọi đến."
      breadcrumb={[{ label: 'Giải pháp' }, { label: 'Tích hợp POS' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Tích hợp POS sẽ được xây dựng ở checkpoint tiếp theo.
      </DevStatusNote>
    </PageShell>
  )
}
