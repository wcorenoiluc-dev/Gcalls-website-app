import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { DevStatusNote, PageShell } from '@/components/layout/PageShell'
import { ROUTES } from '@/config/navigation'

export function PricingPage() {
  return (
    <PageShell
      eyebrow="Chi phí"
      title="Bảng giá"
      intro="Thông tin gói dịch vụ tổng đài Gcalls. Liên hệ đội ngũ Gcalls để nhận báo giá phù hợp với quy mô và nhu cầu của doanh nghiệp."
      breadcrumb={[{ label: 'Bảng giá' }]}
    >
      <div className="flex flex-col gap-6">
        <DevStatusNote>
          Cấu hình giá chưa được đưa vào hệ thống. Trang này hiển thị hướng dẫn liên hệ
          thay vì con số tạm.
        </DevStatusNote>

        <div
          className="rounded-2xl px-6 py-8 sm:px-8"
          style={{ background: '#f6f3fc', border: '1px solid rgba(103,58,183,0.12)' }}
        >
          <p className="text-lg sm:text-xl font-bold" style={{ color: '#1e2026' }}>
            Liên hệ để nhận báo giá
          </p>
          <p className="mt-3 text-base leading-relaxed" style={{ color: '#5b5f6b' }}>
            Chi phí tổng đài phụ thuộc vào số lượng người dùng, giải pháp tích hợp và nhu
            cầu sử dụng thực tế. Bạn có thể ước tính trước bằng công cụ ước tính chi phí.
          </p>

          <Link
            to={ROUTES.costEstimator}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-7 rounded-xl text-base font-semibold transition-colors duration-150 hover:bg-[#5929a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
            style={{
              background: '#673ab7',
              color: '#ffffff',
              boxShadow: '0 2px 16px rgba(103,58,183,0.28)',
            }}
          >
            Ước tính chi phí
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
