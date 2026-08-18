/**
 * The restricted Markdown subset used by blog article bodies.
 *
 * This is deliberately NOT a general Markdown implementation. It supports
 * exactly the structures the article standard (§E) calls for and nothing else,
 * which is what makes an article body machine-checkable: the verification
 * script can count words, assert one H1, find every internal link and confirm
 * a table or checklist exists, using the same grammar the renderer parses.
 *
 * Supported block grammar, blank-line separated:
 *
 *   ## Heading                      → H2 (id auto-generated, diacritics folded)
 *   ### Heading                     → H3
 *   - item                          → unordered list
 *   1. item                         → ordered list
 *   - [ ] item                      → checklist  (whole block must be checklist)
 *   | a | b |                       → table, second row must be the |---| rule
 *   > **Title.** text               → callout
 *   anything else                   → paragraph
 *
 * Supported inline grammar: `**bold**` and `[label](/internal-path/)`.
 *
 * H1 is NOT part of the grammar. The article page renders the single H1 from
 * the catalog title, so a body cannot introduce a second one.
 */

export interface InlineText {
  kind: 'text'
  text: string
}
export interface InlineStrong {
  kind: 'strong'
  text: string
}
export interface InlineLink {
  kind: 'link'
  text: string
  path: string
}
export type Inline = InlineText | InlineStrong | InlineLink

export interface HeadingBlock {
  kind: 'heading'
  level: 2 | 3
  id: string
  text: string
}
export interface ParagraphBlock {
  kind: 'paragraph'
  content: Inline[]
}
export interface ListBlock {
  kind: 'list'
  ordered: boolean
  items: Inline[][]
}
export interface ChecklistBlock {
  kind: 'checklist'
  items: Inline[][]
}
export interface TableBlock {
  kind: 'table'
  headers: string[]
  rows: Inline[][][]
}
export interface CalloutBlock {
  kind: 'callout'
  content: Inline[]
}
export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | ChecklistBlock
  | TableBlock
  | CalloutBlock

/* ------------------------------------------------------------------ *
 * Vietnamese-aware slugs
 * ------------------------------------------------------------------ */

/**
 * Anchor id for a heading.
 *
 * `NFD` + combining-mark strip handles every Vietnamese tone and vowel mark;
 * `đ`/`Đ` is the one letter that is not a decomposable diacritic, so it is
 * replaced explicitly. Without this, `#tổng-đài` would be encoded in the URL
 * bar and would not match a hand-written `href`.
 */
export function slugifyVi(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ------------------------------------------------------------------ *
 * Inline parsing
 * ------------------------------------------------------------------ */

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

export function parseInline(raw: string): Inline[] {
  const out: Inline[] = []

  for (const piece of raw.split(INLINE_PATTERN)) {
    if (!piece) continue

    if (piece.startsWith('**') && piece.endsWith('**')) {
      out.push({ kind: 'strong', text: piece.slice(2, -2) })
      continue
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(piece)
    if (link) {
      out.push({ kind: 'link', text: link[1], path: link[2] })
      continue
    }

    out.push({ kind: 'text', text: piece })
  }

  return out
}

/* ------------------------------------------------------------------ *
 * Block parsing
 * ------------------------------------------------------------------ */

function splitRow(line: string): string[] {
  return line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
}

export function parseBody(markdown: string): Block[] {
  const chunks = markdown
    .trim()
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  const blocks: Block[] = []

  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((line) => line.trim())
    const first = lines[0]

    const heading = /^(#{2,3})\s+(.*)$/.exec(first)
    if (heading) {
      const text = heading[2].trim()
      blocks.push({
        kind: 'heading',
        level: heading[1].length === 2 ? 2 : 3,
        id: slugifyVi(text),
        text,
      })
      continue
    }

    if (first.startsWith('> ')) {
      blocks.push({
        kind: 'callout',
        content: parseInline(lines.map((line) => line.replace(/^>\s?/, '')).join(' ')),
      })
      continue
    }

    if (first.startsWith('| ')) {
      const headers = splitRow(lines[0])
      const body = lines.slice(2).filter((line) => line.startsWith('|'))
      blocks.push({
        kind: 'table',
        headers,
        rows: body.map((line) => splitRow(line).map(parseInline)),
      })
      continue
    }

    if (/^- \[[ x]\] /.test(first)) {
      blocks.push({
        kind: 'checklist',
        items: lines
          .filter((line) => /^- \[[ x]\] /.test(line))
          .map((line) => parseInline(line.replace(/^- \[[ x]\] /, ''))),
      })
      continue
    }

    if (first.startsWith('- ')) {
      blocks.push({
        kind: 'list',
        ordered: false,
        items: lines
          .filter((line) => line.startsWith('- '))
          .map((line) => parseInline(line.slice(2))),
      })
      continue
    }

    if (/^\d+\.\s/.test(first)) {
      blocks.push({
        kind: 'list',
        ordered: true,
        items: lines
          .filter((line) => /^\d+\.\s/.test(line))
          .map((line) => parseInline(line.replace(/^\d+\.\s/, ''))),
      })
      continue
    }

    blocks.push({ kind: 'paragraph', content: parseInline(lines.join(' ')) })
  }

  return blocks
}

/** Table-of-contents entries, derived from the same blocks the page renders. */
export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

export function buildToc(blocks: Block[]): TocEntry[] {
  return blocks
    .filter((block): block is HeadingBlock => block.kind === 'heading')
    .map(({ id, text, level }) => ({ id, text, level }))
}
