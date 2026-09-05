import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
const SRC = process.argv[2], OUT = process.argv[3], W = +(process.argv[4]||1400);
const files = readdirSync(SRC).filter(f=>/\.(png|jpe?g|webp)$/i.test(f)).sort();
for (const f of files) {
  const base = f.replace(/\.(png|jpe?g|webp)$/i,'');
  const out = join(OUT, base + '.jpg');
  await sharp(readFileSync(join(SRC,f))).resize({width:W}).jpeg({quality:78}).toFile(out);
}
console.log('previews:', files.length, '@', W+'px');
