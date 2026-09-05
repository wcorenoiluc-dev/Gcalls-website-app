import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..')
const tmp = '/tmp/res-audit'; fs.mkdirSync(tmp, { recursive: true })
const entry = path.join(tmp, 'e.mjs')
fs.writeFileSync(entry, "export * from '@/data/resources'\n")
const out = path.join(tmp, 'b.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', alias: { '@': path.join(ROOT, 'src') } })
const R = await import(`file://${out}?t=${Date.now()}`)

const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'src/data/resources', f))).digest('hex').slice(0, 16)
const count = (x) => Array.isArray(x) ? x.length : (x ? Object.keys(x).length : 0)

const report = {}

// BLOG — published articles vs editorial categories
const B = R.BLOG
report.blog = {
  source: 'blog.ts', hash: hash('blog.ts'),
  articles_published: count(B.articles ?? B.posts ?? []),
  categories: count(B.categories ?? B.topics ?? []),
  hasArticleCards: !!(B.articles?.length || B.posts?.length),
  status_field: B.status ?? B.state ?? null,
}

// GUIDES — paths + checkpoints
const G = R.GUIDES
const gpaths = G.paths?.items ?? []
report.guides = {
  source: 'guides.ts', hash: hash('guides.ts'),
  paths: gpaths.length,
  checkpoints_total: gpaths.reduce((n, p) => n + (p.checkpoints?.length ?? 0), 0),
  isDownloadable: JSON.stringify(G).match(/\.pdf|download|tải về|tải xuống/i) ? 'MENTIONS_DOWNLOAD' : 'web-only',
}

// CASE STUDIES — approved stories
const C = R.CASE_STUDIES
report.caseStudies = {
  source: 'caseStudies.ts', hash: hash('caseStudies.ts'),
  approved_stories: count(C.stories ?? C.cases ?? C.items ?? []),
  hasCustomerNames: JSON.stringify(C).match(/khách hàng:|customer:|"name"/i) ? 'CHECK' : 'none-visible',
}

// EBOOK — real files / download
const E = R.EBOOK
report.ebook = {
  source: 'ebook.ts', hash: hash('ebook.ts'),
  topics: count(E.topics?.items ?? E.topics ?? []),
  hasDownloadableFile: JSON.stringify(E).match(/\.pdf|\.epub|downloadUrl|fileUrl|href.*\.pdf/i) ? 'HAS_FILE' : 'none',
  hasDownloadButton: JSON.stringify(E).match(/tải xuống|tải về|download/i) ? 'CHECK' : 'none',
}

// GLOSSARY — groups + terms
const GL = R.GLOSSARY
const glGroups = GL.groups ?? []
report.glossary = {
  source: 'glossary.ts', hash: hash('glossary.ts'),
  groups: glGroups.length,
  terms_total: glGroups.reduce((n, g) => n + (g.terms?.length ?? g.items?.length ?? 0), 0),
}

// FAQ — groups + questions
const F = R.FAQ
const fGroups = F.groups ?? []
report.faq = {
  source: 'faq.ts', hash: hash('faq.ts'),
  groups: fGroups.length,
  questions_total: fGroups.reduce((n, g) => n + (g.items?.length ?? g.questions?.length ?? 0), 0),
}

console.log(JSON.stringify(report, null, 2))
fs.writeFileSync(path.join(ROOT, 'docs/content-review/gcalls-resources-hub-ui-v2/audit-counts.json'), JSON.stringify(report, null, 2))
