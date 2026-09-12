window.__A050 = (function () {
  const OPEN = '<!-- wp:freeform -->\n', CLOSE = '\n<!-- /wp:freeform -->';
  const DENY = new Set([324, ...Array.from({length:18},(_,i)=>100+i)]);
  const enc = new TextEncoder();
  const sha = async t => { const b = await crypto.subtle.digest('SHA-256', enc.encode(t));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('') };
  const nonce = () => wpApiSettings.nonce;
  const get = async (id) => {
    const r = await fetch(`/wp-json/wp/v2/posts/${id}?context=edit&_fields=id,status,content,featured_media`,
      {credentials:'same-origin', headers:{'X-WP-Nonce':nonce()}});
    if (r.status !== 200) throw new Error('GET ' + id + ' -> ' + r.status);
    return r.json();
  };
  // Replace a URL only where it is an IMAGE reference. Never a blanket replace:
  // the same string may appear in prose, and prose is out of scope this round.
  const swap = (html, from, to) => {
    let n = 0;
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const attrs = ['src','srcset','data-src','data-lazy-src','data-srcset','data-original','href'];
    for (const a of attrs) {
      const re = new RegExp(`(${a}=["'][^"']*?)${esc}`, 'g');
      html = html.replace(re, (m,p1) => { n++; return p1 + to });
    }
    return { html, n };
  };
  return async function apply(jobs, opts) {
    opts = opts || {}; const APPLY = opts.apply === true;
    const out = [];
    for (const j of jobs) {
      const rec = { id: j.postId, applied: false };
      try {
        if (DENY.has(j.postId)) { rec.skip = 'DENYLIST'; out.push(rec); continue; }
        const p = await get(j.postId);
        if (p.status !== 'draft') { rec.skip = 'NOT_DRAFT:' + p.status; out.push(rec); continue; }
        const before = p.content.raw;
        rec.beforeSha = await sha(before);
        if (j.expectSha && j.expectSha !== rec.beforeSha) { rec.skip = 'CONTENT_DRIFT'; out.push(rec); continue; }
        rec.beforeFeatured = p.featured_media;
        let body = before, swaps = 0;
        for (const [from, to] of Object.entries(j.urlMap || {})) {
          const r = swap(body, from, to); body = r.html; swaps += r.n;
        }
        rec.swaps = swaps;
        rec.wrapperIntact = body.startsWith(OPEN) === before.startsWith(OPEN);
        rec.afterSha = await sha(body);
        const wantFeat = j.featuredMediaId != null ? j.featuredMediaId : p.featured_media;
        rec.willSetFeatured = wantFeat;
        if (!APPLY) { rec.dryRun = true; out.push(rec); continue; }
        const payload = { featured_media: wantFeat };
        if (swaps > 0) payload.content = body;
        const w = await fetch(`/wp-json/wp/v2/posts/${j.postId}`, { method:'POST',
          credentials:'same-origin',
          headers:{'X-WP-Nonce':nonce(),'Content-Type':'application/json'},
          body: JSON.stringify(payload) });
        rec.http = w.status;
        if (w.status === 200) {
          const after = await w.json();
          rec.applied = true; rec.statusAfter = after.status; rec.featuredAfter = after.featured_media;
        } else { rec.error = (await w.text()).slice(0,180); }
      } catch (e) { rec.error = String(e).slice(0,180); }
      out.push(rec);
    }
    return out;
  };
})();
