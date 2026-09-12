import fs from 'node:fs'; import crypto from 'node:crypto'
const xml=fs.readFileSync(process.argv[2],'utf8')
const v=JSON.parse(fs.readFileSync('docs/content-review/gcalls-048/blog-verdicts-048.json','utf8'))
const want=new Map(v.articles.map(a=>[a.legacyId,a]))
const textOf=s=>s.replace(/<[^>]+>/g,' ').replace(/\[[^\]]*\]/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()
const out=[]
for(const b of xml.split('<item>').slice(1)){
  const m=b.match(/<wp:post_id>(\d+)<\/wp:post_id>/); if(!m) continue
  const id=Number(m[1]); if(!want.has(id)) continue
  const c=b.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/); if(!c) continue
  out.push({live:want.get(id).livePostId, t:crypto.createHash('sha256').update(textOf(c[1]),'utf8').digest('hex').slice(0,10)})
}
fs.writeFileSync('.media-050/wxr-text.json',JSON.stringify(out))
const ids=v.articles.map(a=>a.livePostId).slice(0,55), by=new Map(out.map(r=>[r.live,r.t]))
console.log(ids.map(i=>by.get(i)).join(','))
