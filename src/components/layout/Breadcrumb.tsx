import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '@/config/navigation'

export interface Crumb {
  label: string
  path?: string
}

/**
 * Breadcrumb trail. Always starts at Home; the final crumb is the current
 * page and is not a link.
 */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  const crumbs: Crumb[] = [{ label: 'Trang chủ', path: ROUTES.home }, ...trail]

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol
        className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  style={{ color: '#5b5f6b', flexShrink: 0 }}
                />
              )}

              {isLast || !crumb.path ? (
                <span style={{ color: '#5b5f6b' }} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="rounded transition-colors duration-150 hover:text-[#673ab7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#673ab7]"
                  style={{ color: '#5b5f6b' }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
