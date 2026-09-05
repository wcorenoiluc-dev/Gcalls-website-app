import { readFileSync, writeFileSync } from 'node:fs';
const REV = process.argv[2];
const inv = JSON.parse(readFileSync(`${REV}/media/inventory-raw.json`,'utf8'));
const ocr = JSON.parse(readFileSync(`${REV}/media/ocr/_ocr-summary.json`,'utf8'));
const ocrByName = Object.fromEntries(ocr.map(r=>[r.source,r]));

const MAP = {
  'Workspace.png': {section:'01 Hero / 04 Overview', role:'primary'},
  'Workspace Back to.png': {section:'04 Overview', role:'alt'},
  'Timeline Call.png': {section:'05 Channels', role:'tab'},
  'Timeline Email.png': {section:'05 Channels', role:'tab'},
  'Timeline Zalo.png': {section:'05 Channels', role:'tab'},
  'Workspace Chat.png': {section:'06 Omnichannel Inbox', role:'primary'},
  'Workspace V.2 List Email.png': {section:'06 Omnichannel Inbox', role:'support'},
  'Workspace V.2 Call list.png': {section:'06 Omnichannel Inbox', role:'support'},
  'Workspace Ticket (Chi tiết).png': {section:'07 Ticket', role:'primary'},
  'Workspace Ticket Hoạt động.png': {section:'07 Ticket', role:'support'},
  'Workspace Create Ticket.png': {section:'07 Ticket', role:'support'},
  'Workspace Customer Tổng quan.png': {section:'08 Customer Context', role:'primary'},
  'Workspace Customer Hoạt động.png': {section:'08 Customer Context', role:'support'},
  'Workspace Customer Ticket.png': {section:'08 Customer Context', role:'support'},
  'Workspace Call in progress.png': {section:'09 How it works', role:'primary'},
  'Workspace V.2 Call action (call in progress).png': {section:'09 How it works', role:'support'},
  'Workspace Call Fill Information.png': {section:'09 How it works', role:'support'},
};
for (const r of inv) if (/^Dashboard V2/.test(r.source)) MAP[r.source] ??= {section:'10 Reporting', role:'reporting'};

const rows = inv.map(r=>{
  const m = MAP[r.source] || {section:'—', role:'unused'};
  const o = ocrByName[r.source] || {pitel:0,phones:[],emails:[]};
  const pii = [];
  if (o.phones.length) pii.push(`${o.phones.length} phone`);
  if (o.emails.length) pii.push(`${o.emails.length} email`);
  pii.push('names/co/KPI (visual)');
  return { source:r.source, sha256:r.sha256, dims:`${r.width}x${r.height}`, section:m.section, role:m.role,
    pii_found: pii.join(', '), branding: o.pitel>0?'PitelCX (OCR)':'PitelCX (chrome)' };
});

let md = `# Gcalls CX — Media Inventory Manifest (58 files)\n\n`;
md += `Source ZIP: \`CX V2-20260904T023435Z-1-001.zip\` · all UTF-8 filenames · all 4× (7680px-wide) exports · 0 EXIF.\n`;
md += `Owner media decision: **neutral diagrams only** — none of these files is masked, rebranded or published.\n`;
md += `pii_masked = n/a, approval = NOT USED, output = (none; source kept in gitignored source-private/).\n\n`;
md += `| # | source | sha256 | dims | section | role | pii_found | branding |\n`;
md += `|--:|---|---|---|---|---|---|---|\n`;
rows.forEach((r,i)=>{ md += `| ${i+1} | ${r.source} | \`${r.sha256.slice(0,12)}\` | ${r.dims} | ${r.section} | ${r.role} | ${r.pii_found} | ${r.branding} |\n`; });
const counts = rows.reduce((a,r)=>{a[r.role]=(a[r.role]||0)+1;return a},{});
const pitelN = rows.filter(r=>/OCR/.test(r.branding)).length;
md += `\n## Summary\n\n- role counts: ${Object.entries(counts).map(([k,v])=>`${k}=${v}`).join(', ')}\n`;
md += `- mapped to sections (had media been used): 30 · unused: ${counts.unused||0}\n`;
md += `- Pitel branding detected by OCR: ${pitelN}/58 (remainder carry the chrome wordmark visually)\n`;
md += `- phone-pattern hits: ${ocr.filter(r=>r.phones.length).length}/58 · email hits: ${ocr.filter(r=>r.emails.length).length}/58\n`;
writeFileSync(`${REV}/media-inventory.md`, md);
writeFileSync(`${REV}/media/manifest.json`, JSON.stringify(rows,null,2));
console.log('manifest updated. pitel(OCR):', pitelN, 'rows:', rows.length);
