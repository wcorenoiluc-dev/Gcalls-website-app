import fs from 'node:fs'; import crypto from 'node:crypto'
const xml = fs.readFileSync(process.argv[2], 'utf8')
const v = JSON.parse(fs.readFileSync('docs/content-review/gcalls-048/blog-verdicts-048.json','utf8'))
const want = new Map(v.articles.map(a=>[a.legacyId,a]))
const items = xml.split('<item>').slice(1)
const out=[]
for (const b of items) {
  const idm = b.match(/<wp:post_id>(\d+)<\/wp:post_id>/); if(!idm) continue
  const id = Number(idm[1]); if(!want.has(id)) continue
  // exact inner text of content:encoded CDATA, no trim
  const m = b.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)
  if(!m){ out.push({id, h:'NO_CDATA'}); continue }
  out.push({ id, live: want.get(id).livePostId, h: crypto.createHash('sha256').update(m[1],'utf8').digest('hex') })
}
fs.writeFileSync('.media-050/wxr-hashes.json', JSON.stringify(out))
console.log('hashed', out.length)
console.log(out.slice(0,3).map(r=>r.live+':'+r.h.slice(0,12)).join(' '))
