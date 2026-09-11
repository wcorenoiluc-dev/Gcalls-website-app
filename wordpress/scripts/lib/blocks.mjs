/**
 * Restricted Markdown -> WordPress block markup.
 *
 * WHY THIS REUSES THE APP'S PARSER
 * The article bodies are authored in the restricted grammar defined by
 * `src/lib/blog/markdown.ts`, and `scripts/verify-blog-batch-01.mjs` audits them
 * against that same grammar. A second parser written here would be a second
 * grammar: the day someone adds a block type to the app, the export would keep
 * emitting paragraphs and nobody would notice until the article was already on
 * the demo. So this module takes the parsed `Block[]` as input and only decides
 * how each block is SERIALISED for WordPress. Node 24 strips TypeScript types
 * natively, so the caller imports the real parser rather than a copy.
 *
 * WHY BLOCK MARKUP AND NOT PLAIN HTML
 * A post whose content is bare HTML opens in the editor as one "Classic" lump.
 * The handover editor then cannot move a section, change a heading level or fix
 * a table cell without editing HTML by hand. Emitting real block delimiters is
 * what makes the 18 imported articles editable the way anything typed into
 * WordPress is — which is the whole point of putting them in WordPress.
 *
 * The comment delimiters are load-bearing and their whitespace is part of the
 * format: the editor re-serialises a block on save, and markup that does not
 * match what it would have written is reported as "This block contains
 * unexpected or invalid content".
 */

/** HTML-escapes text destined for a text node. */
export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** HTML-escapes a value destined for a double-quoted attribute. */
export function escAttr(value) {
  return esc(value).replace(/"/g, '&quot;')
}

/**
 * Serialises one run of inline nodes.
 *
 * The three kinds come from the app parser: plain text, `**bold**` and
 * `[label](/path/)`. Anything else never reaches here, because the grammar
 * cannot produce it.
 */
export function inlineToHtml(nodes) {
  return nodes
    .map((node) => {
      if (node.kind === 'strong') return `<strong>${esc(node.text)}</strong>`
      if (node.kind === 'link') return `<a href="${escAttr(node.path)}">${esc(node.text)}</a>`
      return esc(node.text)
    })
    .join('')
}

/** Collects every link target in a parsed body, for cross-checking. */
export function collectLinks(blocks) {
  const links = []
  const walk = (nodes) => {
    for (const node of nodes ?? []) if (node.kind === 'link') links.push(node.path)
  }

  for (const block of blocks) {
    if (block.kind === 'paragraph' || block.kind === 'callout') walk(block.content)
    if (block.kind === 'list' || block.kind === 'checklist') block.items.forEach(walk)
    if (block.kind === 'table') block.rows.forEach((row) => row.forEach(walk))
  }

  return links
}

const paragraph = (html, attrs = '') =>
  `<!-- wp:paragraph${attrs} -->\n<p>${html}</p>\n<!-- /wp:paragraph -->`

/**
 * One parsed block -> one WordPress block.
 *
 * `checklist` has no core counterpart. It is emitted as a list carrying
 * `gcalls-checklist`, which the theme styles: inventing a custom block type
 * would need a plugin-registered block, and a post referencing a block type
 * that is not registered renders as a broken placeholder if the plugin is ever
 * deactivated. A list degrades to a list.
 */
export function blockToWp(block) {
  switch (block.kind) {
    case 'heading': {
      const attrs = block.level === 2
        ? `{"anchor":"${escAttr(block.id)}"}`
        : `{"level":3,"anchor":"${escAttr(block.id)}"}`
      const tag = `h${block.level}`
      return `<!-- wp:heading ${attrs} -->\n<${tag} class="wp-block-heading" id="${escAttr(block.id)}">${esc(block.text)}</${tag}>\n<!-- /wp:heading -->`
    }

    case 'paragraph':
      return paragraph(inlineToHtml(block.content))

    case 'list':
    case 'checklist': {
      const ordered = block.kind === 'list' && block.ordered
      const checklist = block.kind === 'checklist'
      const tag = ordered ? 'ol' : 'ul'
      const attrs = ordered
        ? ' {"ordered":true}'
        : checklist
          ? ' {"className":"gcalls-checklist"}'
          : ''
      const classes = checklist ? 'wp-block-list gcalls-checklist' : 'wp-block-list'
      const items = block.items
        .map((item) => `<!-- wp:list-item -->\n<li>${inlineToHtml(item)}</li>\n<!-- /wp:list-item -->`)
        .join('\n')
      return `<!-- wp:list${attrs} -->\n<${tag} class="${classes}">${items}</${tag}>\n<!-- /wp:list -->`
    }

    case 'table': {
      const head = `<thead><tr>${block.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>`
      const body = `<tbody>${block.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${inlineToHtml(cell)}</td>`).join('')}</tr>`)
        .join('')}</tbody>`
      return `<!-- wp:table -->\n<figure class="wp-block-table"><table>${head}${body}</table></figure>\n<!-- /wp:table -->`
    }

    case 'callout':
      return `<!-- wp:quote -->\n<blockquote class="wp-block-quote">${paragraph(inlineToHtml(block.content))}</blockquote>\n<!-- /wp:quote -->`

    default:
      throw new Error(`unhandled block kind: ${block.kind}`)
  }
}

/**
 * The direct-answer block, rendered above the body.
 *
 * The React article page shows this above the table of contents; keeping it
 * first in the post content preserves that reading order without needing the
 * theme to know about a separate field.
 */
export function directAnswerToWp(directAnswer) {
  if (!directAnswer?.question || !directAnswer?.answer) return ''

  return [
    `<!-- wp:quote {"className":"gcalls-direct-answer"} -->`,
    `<blockquote class="wp-block-quote gcalls-direct-answer">`,
    paragraph(`<strong>${esc(directAnswer.question)}</strong>`),
    paragraph(esc(directAnswer.answer)),
    `</blockquote>`,
    `<!-- /wp:quote -->`,
  ].join('\n')
}

/** Whole article body -> post_content. */
export function bodyToWp(blocks, directAnswer) {
  const parts = []
  const answer = directAnswerToWp(directAnswer)

  if (answer) parts.push(answer)
  for (const block of blocks) parts.push(blockToWp(block))

  return parts.join('\n\n')
}
