import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function QCPage() {
  return (
    <PageShell
      eyebrow="Sản phẩm"
      title="QA QC Center"
      supportingLabel="QC Bot AI"
      intro="Trung tâm đánh giá và kiểm soát chất lượng cuộc gọi cho đội Sales và CSKH."
      breadcrumb={[{ label: 'Sản phẩm' }, { label: 'QA QC Center' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang QA QC Center sẽ được xây dựng ở checkpoint tiếp theo.
      </DevStatusNote>
    </PageShell>
  )
}
