import { DevStatusNote, PageShell } from '@/components/layout/PageShell'

export function GcallsCXPage() {
  return (
    <PageShell
      eyebrow="Sản phẩm"
      title="Gcalls CX"
      intro="Giải pháp tập trung vào trải nghiệm khách hàng trên hành trình tương tác qua kênh thoại."
      breadcrumb={[{ label: 'Sản phẩm' }, { label: 'Gcalls CX' }]}
    >
      <DevStatusNote>
        Nội dung chi tiết của trang Gcalls CX sẽ được xây dựng ở checkpoint tiếp theo.
      </DevStatusNote>
    </PageShell>
  )
}
