import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function InternationalCallingPage() {
  return (
    <PageShell
      eyebrow="Giải pháp"
      title="Tổng đài quốc tế"
      intro="Giải pháp tổng đài cho doanh nghiệp có nhu cầu liên lạc quốc tế, với hạ tầng thoại đám mây và quản lý tập trung."
      breadcrumb={[{ label: 'Giải pháp' }, { label: 'Tổng đài quốc tế' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Tổng đài quốc tế sẽ được xây dựng ở checkpoint tiếp
        theo.
      </DevStatusNote>
    </PageShell>
  )
}
