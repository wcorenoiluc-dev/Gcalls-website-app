import { Outlet } from 'react-router'
import { Header } from '@/components/navigation/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollManager, Seo } from '@/components/common/Seo'

/**
 * Shared chrome for every route: header, routed page, footer.
 *
 * Note there is deliberately no `overflow-x-hidden` here. The baseline used
 * it on the root element, which made the page *look* like it had no
 * horizontal overflow while silently clipping ~100 elements at 390px.
 * Overflow is now fixed at the source; if it reappears it should be visible.
 */
export function SiteLayout() {
  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col">
      <Seo />
      <ScrollManager />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:top-3 focus:left-3 focus:px-4 focus:py-3 focus:rounded-xl focus:text-base focus:font-semibold"
        style={{ background: '#673ab7', color: '#ffffff' }}
      >
        Bỏ qua để tới nội dung chính
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
