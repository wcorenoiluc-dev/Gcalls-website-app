import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function CRMIntegrationPage() {
  return (
    <PageShell
      eyebrow="Giải pháp"
      title="Tích hợp CRM"
      intro="Kết nối tổng đài Gcalls với hệ thống CRM để đồng bộ danh bạ, lịch sử cuộc gọi và ghi chú ngay trong quy trình bán hàng."
      breadcrumb={[{ label: 'Giải pháp' }, { label: 'Tích hợp CRM' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Tích hợp CRM sẽ được xây dựng ở checkpoint tiếp theo.
      </DevStatusNote>
    </PageShell>
  )
}
