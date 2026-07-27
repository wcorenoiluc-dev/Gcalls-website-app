import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
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

        <Link
          to={ROUTES.home}
          className="mt-8 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-7 rounded-xl text-base font-semibold transition-colors duration-150 hover:bg-[#5929a8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
          style={{
            background: '#673ab7',
            color: '#ffffff',
            boxShadow: '0 2px 16px rgba(103,58,183,0.28)',
          }}
        >
          Về trang chủ
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}
