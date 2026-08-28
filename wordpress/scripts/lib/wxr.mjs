/**
 * A minimal reader for a WordPress eXtended RSS export.
 *
 * WHY NOT AN XML PARSER
 * The repository has no XML dependency and this checkpoint permits no network
 * install. More to the point, a WXR file is not general XML in practice: it is a
 * flat list of <item> elements whose interesting fields are all either plain
 * text or a single CDATA block. A twelve-megabyte DOM would be built to read
 * fifteen fields per item.
 *
 * WHAT THIS DOES CARE ABOUT
 * CDATA. Article bodies are full of `<`, `>` and `&`, and one of them contains
 * the literal string `</item>` inside a code sample sooner or later. So the
 * scanner tracks CDATA sections and only recognises element boundaries outside
 * them — a plain `indexOf('</item>')` would truncate that article's body and
 * silently swallow every article after it, which is exactly the "content loss"
 * this migration is supposed to prevent.
 *
 * Everything returned is raw. Sanitising, mapping and deciding belong to the
 * caller, not to a reader.
 */

/** Finds the next occurrence of `needle` that is NOT inside a CDATA section. */
function indexOfOutsideCdata(text, needle, from) {
  let i = from

  while (i < text.length) {
    const hit = text.indexOf(needle, i)
    if (hit === -1) return -1

    const cdataStart = text.lastIndexOf('<![CDATA[', hit)
    if (cdataStart === -1) return hit

    const cdataEnd = text.indexOf(']]>', cdataStart)
    // Inside an unterminated or enclosing CDATA block: skip past it.
    if (cdataEnd === -1 || cdataEnd > hit) {
      i = cdataEnd === -1 ? text.length : cdataEnd + 3
      continue
    }

    return hit
  }

  return -1
}

/** Unwraps a CDATA payload, or decodes the five XML entities. */
function decode(value) {
  const cdata = value.match(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/)
  if (cdata) return cdata[1]

  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

/** Reads one element's content out of an item block. */
function field(block, name) {
  const open = `<${name}`
  const start = block.indexOf(open)
  if (start === -1) return null

  const contentStart = block.indexOf('>', start)
  if (contentStart === -1) return null

  const end = indexOfOutsideCdata(block, `</${name}>`, contentStart)
  if (end === -1) return null

  return decode(block.slice(contentStart + 1, end))
}

/** Splits the file into item blocks, CDATA-aware. */
function items(xml) {
  const blocks = []
  let cursor = 0

  for (;;) {
    const start = indexOfOutsideCdata(xml, '<item>', cursor)
    if (start === -1) break

    const end = indexOfOutsideCdata(xml, '</item>', start)
    if (end === -1) break

    blocks.push(xml.slice(start + '<item>'.length, end))
    cursor = end + '</item>'.length
  }

  return blocks
}

/**
 * Parses a WXR document into plain objects.
 *
 * @param {string} xml Full file contents.
 * @returns {Array<object>} one entry per <item>.
 */
export function parseWxr(xml) {
  return items(xml).map((block) => {
    const categories = []

    for (const match of block.matchAll(/<category domain="([^"]+)" nicename="([^"]*)"><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)) {
      categories.push({ domain: match[1], slug: match[2], name: match[3] })
    }

    const meta = {}

    for (const match of block.matchAll(/<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/g)) {
      const key = field(match[1], 'wp:meta_key')
      const value = field(match[1], 'wp:meta_value')
      // A repeated key keeps its first value: WordPress treats later rows as
      // additional meta, and none of the keys read here are multi-valued.
      if (key && !(key in meta)) meta[key] = value ?? ''
    }

    return {
      postId: field(block, 'wp:post_id') ?? '',
      title: field(block, 'title') ?? '',
      link: field(block, 'link') ?? '',
      pubDate: field(block, 'pubDate') ?? '',
      creator: field(block, 'dc:creator') ?? '',
      slug: field(block, 'wp:post_name') ?? '',
      status: field(block, 'wp:status') ?? '',
      postType: field(block, 'wp:post_type') ?? '',
      postDate: field(block, 'wp:post_date') ?? '',
      postDateGmt: field(block, 'wp:post_date_gmt') ?? '',
      modified: field(block, 'wp:post_modified') ?? '',
      content: field(block, 'content:encoded') ?? '',
      excerpt: field(block, 'excerpt:encoded') ?? '',
      categories,
      meta,
    }
  })
}
