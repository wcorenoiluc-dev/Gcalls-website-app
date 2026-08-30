import { pathToFileURL, fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
const SRC = '/Users/macos/Desktop/Gcalls/App/Gcalls-website-app/src'
const tryFiles = (base) => {
  for (const c of [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c
  }
  return null
}
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const f = tryFiles(path.join(SRC, specifier.slice(2)))
    if (f) return next(pathToFileURL(f).href, context)
  }
  if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
    const f = tryFiles(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier))
    if (f) return next(pathToFileURL(f).href, context)
  }
  return next(specifier, context)
}
