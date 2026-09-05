import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const SRC = process.argv[2];
const OUTDIR = process.argv[3];
const LANGPATH = '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app'; // holds eng.traineddata
mkdirSync(OUTDIR, { recursive: true });
const files = readdirSync(SRC).filter(f=>/\.(png|jpe?g|webp)$/i.test(f)).sort();

const worker = await createWorker('eng', 1, { langPath: LANGPATH, gzip: false, cacheMethod: 'none' });
const phoneRe = /(\+?84|0)[\s.\-]?\d{2,3}[\s.\-]?\d{3}[\s.\-]?\d{3}/g;
const emailRe = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi;
const results = [];
for (const f of files) {
  const png = await sharp(readFileSync(join(SRC,f))).resize({width:2200}).grayscale().normalize().png().toBuffer();
  const { data } = await worker.recognize(png);
  const text = data.text || '';
  writeFileSync(join(OUTDIR, f.replace(/\.(png|jpe?g|webp)$/i,'.txt')), text);
  const low = text.toLowerCase();
  results.push({
    source: f,
    pitel: (low.match(/pitel/g)||[]).length,
    phones: [...new Set(text.match(phoneRe)||[])].slice(0,20),
    emails: [...new Set(text.match(emailRe)||[])].slice(0,20),
    chars: text.replace(/\s+/g,'').length,
  });
  console.log(`OCR ${f}: pitel=${results.at(-1).pitel} phones=${results.at(-1).phones.length} emails=${results.at(-1).emails.length}`);
}
await worker.terminate();
writeFileSync(join(OUTDIR, '_ocr-summary.json'), JSON.stringify(results, null, 2));
console.log('DONE ocr');
