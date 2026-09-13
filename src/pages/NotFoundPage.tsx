import { ArrowRight } from 'lucide-react'
import { CtaLink } from '@/components/common/Button'
import { ROUTES } from '@/config/navigation'

export function NotFoundPage() {
  return (
    <section
      className="w-full pt-28 pb-20 sm:pt-32"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#673ab7' }}>
          404
        </p>
        <h1
          className="mt-3 text-[28px] leading-tight sm:text-4xl font-extrabold tracking-tight"
          style={{ color: '#1e2026' }}
        >
          Không tìm thấy trang
        </h1>
        <p
          className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed"
          style={{ color: '#5b5f6b' }}
        >
          Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.
        </p>

        <CtaLink variant="primary" size="lg" fullWidth className="mt-8" to={ROUTES.home}>
          Về trang chủ
          <ArrowRight size={18} />
        </CtaLink>
      </div>
    </section>
  )
}
