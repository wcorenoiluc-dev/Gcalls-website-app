import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function HelpdeskIntegrationPage() {
  return (
    <PageShell
      eyebrow="Giải pháp"
      title="Tích hợp Helpdesk"
      intro="Kết nối tổng đài Gcalls với hệ thống Helpdesk để gắn cuộc gọi vào ticket và theo dõi lịch sử hỗ trợ khách hàng."
      breadcrumb={[{ label: 'Giải pháp' }, { label: 'Tích hợp Helpdesk' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Tích hợp Helpdesk sẽ được xây dựng ở checkpoint tiếp
        theo.
      </DevStatusNote>
    </PageShell>
  )
}
