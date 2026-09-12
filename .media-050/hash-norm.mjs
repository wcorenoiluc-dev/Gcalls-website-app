import fs from 'node:fs'; import crypto from 'node:crypto'
const xml = fs.readFileSync(process.argv[2],'utf8')
const v = JSON.parse(fs.readFileSync('docs/content-review/gcalls-048/blog-verdicts-048.json','utf8'))
const want = new Map(v.articles.map(a=>[a.legacyId,a]))
const norm = s => s.replace(/\r\n/g,'\n').replace(/\s+/g,' ').trim()
const out=[]
for (const b of xml.split('<item>').slice(1)) {
  const idm=b.match(/<wp:post_id>(\d+)<\/wp:post_id>/); if(!idm) continue
  const id=Number(idm[1]); if(!want.has(id)) continue
  const m=b.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/); if(!m) continue
  out.push({ live: want.get(id).livePostId,
    n: crypto.createHash('sha256').update(norm(m[1]),'utf8').digest('hex') })
}
fs.writeFileSync('.media-050/wxr-norm.json', JSON.stringify(out))
const ids=v.articles.map(a=>a.livePostId), by=new Map(out.map(r=>[r.live,r.n]))
const s=ids.map(i=>(by.get(i)||'?').slice(0,10))
for(let i=0;i<3;i++) console.log('N'+i+'='+s.slice(i*55,(i+1)*55).join(','))
