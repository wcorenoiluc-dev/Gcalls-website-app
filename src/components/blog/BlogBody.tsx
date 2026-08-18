import { Fragment } from 'react'
import { Check, Info } from 'lucide-react'
import { Link } from 'react-router'
import type { Block, Inline } from '@/lib/blog/markdown'
import { isRenderableLink } from './links'

/**
 * Renders a parsed article body.
 *
 * Presentation only — every string arrives from `src/data/blog/articles/*`.
 * Copy written inside a component is copy that escapes editorial review.
 *
 * Mobile-first: prose is a single column at 320–390px, tables scroll inside
 * their own container so the page body never scrolls horizontally, and every
 * inline link clears a 44px tap target through its line height.
 */

const PROSE = 'text-[16px] leading-[1.75] text-muted-foreground sm:text-[17px]'

function InlineRun({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((piece, index) => {
        if (piece.kind === 'strong') {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {piece.text}
            </strong>
          )
        }

        if (piece.kind === 'link') {
          // A target that does not exist in this build renders as plain text,
          // never as a broken anchor. See ./links.ts.
          if (!isRenderableLink(piece.path)) {
            return <Fragment key={index}>{piece.text}</Fragment>
          }

          if (piece.path.startsWith('#')) {
            return (
              <a
                key={index}
                href={piece.path}
                className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {piece.text}
              </a>
            )
          }

          return (
            <Link
              key={index}
              to={piece.path}
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {piece.text}
            </Link>
          )
        }

        return <Fragment key={index}>{piece.text}</Fragment>
      })}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'heading':
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="mt-12 scroll-mt-28 text-[24px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[30px]"
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={block.id}
          className="mt-8 scroll-mt-28 text-[19px] font-bold leading-snug text-foreground sm:text-[22px]"
        >
          {block.text}
        </h3>
      )

    case 'paragraph':
      return (
        <p className={`mt-5 ${PROSE}`}>
          <InlineRun content={block.content} />
        </p>
      )

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag
          className={`mt-5 flex flex-col gap-2.5 ${
            block.ordered ? 'list-decimal' : 'list-disc'
          } pl-5 ${PROSE}`}
        >
          {block.items.map((item, index) => (
            <li key={index} className="pl-1">
              <InlineRun content={item} />
            </li>
          ))}
        </Tag>
      )
    }

    case 'checklist':
      return (
        <ul className="mt-6 flex flex-col gap-2.5 rounded-[14px] border border-brand-border bg-surface-alt p-5">
          {block.items.map((item, index) => (
            <li key={index} className={`flex items-start gap-2.5 ${PROSE}`}>
              <Check
                size={18}
                aria-hidden="true"
                className="mt-1 shrink-0 text-brand"
              />
              <span>
                <InlineRun content={item} />
              </span>
            </li>
          ))}
        </ul>
      )

    case 'callout':
      return (
        <aside className="mt-6 flex items-start gap-3 rounded-[14px] border-l-4 border-brand bg-brand-light px-5 py-4">
          <Info size={18} aria-hidden="true" className="mt-1 shrink-0 text-brand" />
          <p className={PROSE}>
            <InlineRun content={block.content} />
          </p>
        </aside>
      )

    case 'table':
      return (
        // The scroll container is on the wrapper, not the page: a wide table
        // scrolls inside itself so the document never gains a horizontal
        // scrollbar at 320px.
        //
        // No negative-margin bleed here, deliberately. `-mx-5 px-5` looked
        // better on mobile but makes the wrapper 40px wider than its parent,
        // and once a vertical scrollbar narrows the client area that surplus
        // becomes real document overflow — 17px at 320px, measured. `max-w-full`
        // pins the scroll container to the content box instead.
        <div className="mt-6 max-w-full overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b-2 border-brand-border">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-3 align-bottom font-bold text-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-brand-border align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3 py-3 leading-relaxed text-muted-foreground"
                    >
                      <InlineRun content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}

export function BlogBody({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  )
}
