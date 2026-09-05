import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2];
const OUT = process.argv[3];
const files = readdirSync(SRC).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();
const rows = [];
for (const f of files) {
  const buf = readFileSync(join(SRC, f));
  const sha = createHash('sha256').update(buf).digest('hex');
  const meta = await sharp(buf).metadata();
  rows.push({ source: f, sha256: sha, width: meta.width, height: meta.height, bytes: buf.length, hasEXIF: !!meta.exif, format: meta.format });
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.log(`inventory: ${rows.length} files`);
console.log('dims range:', Math.min(...rows.map(r=>r.width)), '-', Math.max(...rows.map(r=>r.width)), 'wide');
console.log('with EXIF:', rows.filter(r=>r.hasEXIF).length);
