/**
 * Where the extracted Core 0.10.1 package data lives.
 *
 * This used to be an absolute path into a per-session scratchpad directory.
 * That path stopped existing the moment the session that made it ended, and
 * the two scripts that read it degraded in different ways: the preview
 * crashed, and the contract test silently checked nothing and still printed
 * "none". A verification script that cannot find its input must say so.
 *
 * Resolution order:
 *   1. $GCALLS_PKG            — explicit override, for CI
 *   2. <repo>/wordpress/.pkg  — the local default, gitignored
 *
 * Populate the default with `npm run pkg:extract` (see scripts/extract-pkg.mjs)
 * or by unzipping the 0.10.1 candidate's `gcalls-core/data/*.json` into it as
 * `content-pages-0.10.1.json` and `product-pages-0.10.1.json`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '../..')

export const PKG = process.env.GCALLS_PKG || path.join(WP, '.pkg')

/** True when the package data has actually been extracted. */
export const pkgPresent = (file) => fs.existsSync(path.join(PKG, file))

/** The message to print when it has not been. Never a silent pass. */
export const pkgMissingNote = (file) =>
  `package data not found: ${path.join(PKG, file)}\n` +
  `  set $GCALLS_PKG or extract gcalls-core-0.10.1.zip's data/ into wordpress/.pkg/`
