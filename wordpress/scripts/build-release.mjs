#!/usr/bin/env node
/**
 * Builds the 003B P0 deployment packages.
 *
 * FOUR ARTIFACTS, ONE INSTALL ORDER
 * The order matters and is not obvious, so it is generated into the checklist
 * rather than left to the operator to infer:
 *
 *   1. the plugin — it registers the HUB taxonomy, the shortcodes and the
 *      import screen, so nothing else can be installed usefully before it;
 *   2. the theme — the templates the imported pages render through;
 *   3. the content package — manifest plus the thirteen screenshots, imported
 *      from Tools > Gcalls Import, dry run first;
 *   4. the Elementor template — imported LAST, because it places images by
 *      manifest id and those attachments only exist after step 3.
 *
 * Everything is verified after it is built, not before: `unzip -t` on the real
 * archive, the entry list against the file list, JSON re-parsed from disk, and
 * a SHA-256 of the bytes that will actually be uploaded.
 *
 * Nothing here deploys. It writes files and prints digests.
 *
 * Usage: node wordpress/scripts/build-release.mjs [--out <dir>]
 */
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildZip, describe, verifyZip, vet, writeDigest, SECRET_PATTERNS } from './lib/package.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WP = path.resolve(HERE, '..')
const REPO = path.resolve(WP, '..')

const outArg = process.argv.indexOf('--out')
const OUT = outArg !== -1 && process.argv[outArg + 1]
  ? path.resolve(process.argv[outArg + 1])
  : path.join(process.env.HOME ?? '/tmp', 'Desktop')

const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8' }).trim()

const HEAD = git('rev-parse', 'HEAD')
const SHORT = HEAD.slice(0, 7)
const BRANCH = git('rev-parse', '--abbrev-ref', 'HEAD')

const problems = []
const artifacts = []

const note = (message) => console.log(`  ${message}`)

/* ------------------------------------------------------------------ *
 * Provenance — every artifact must be traceable to a commit
 * ------------------------------------------------------------------ */

const dirtyPaths = git('status', '--porcelain', '--', 'wordpress')

console.log(`build-release — ${BRANCH} @ ${SHORT}\n`)

if (dirtyPaths) {
  console.log('wordpress/ has uncommitted changes:')
  console.log(dirtyPaths.split('\n').map((line) => `  ${line}`).join('\n'))
  console.log('\nCommit them first — a deployable package must name the commit it came from.')
  process.exit(1)
}

await mkdir(OUT, { recursive: true })

/* ------------------------------------------------------------------ *
 * 1 + 2. Plugin and theme
 * ------------------------------------------------------------------ */

async function packageTracked({ label, sourceDir, rootName, outName, versionFile, versionPattern }) {
  const tracked = git('ls-files', '-z', '--', sourceDir)
    .split('\0')
    .filter(Boolean)
    .map((file) => path.relative(sourceDir, file))
    .sort()

  if (tracked.length === 0) {
    problems.push(`${label}: no tracked files under ${sourceDir}`)
    return
  }

  const root = path.join(REPO, sourceDir)
  const vetProblems = await vet(root, tracked)

  if (vetProblems.length) {
    problems.push(...vetProblems.map((problem) => `${label}: ${problem}`))
    return
  }

  const versionSource = await readFile(path.join(root, versionFile), 'utf8')
  const version = versionSource.match(versionPattern)?.[1]

  if (!version) {
    problems.push(`${label}: no version in ${versionFile}`)
    return
  }

  const outPath = path.join(OUT, outName)
  await buildZip({ root, relativePaths: tracked, rootName, outPath })

  const verifyProblems = await verifyZip(outPath, rootName, tracked)
  if (verifyProblems.length) {
    problems.push(...verifyProblems.map((problem) => `${label}: ${problem}`))
    return
  }

  const info = await describe(outPath)
  await writeDigest(outPath, info.sha256)

  artifacts.push({
    label,
    version,
    provenance: `${sourceDir} @ ${SHORT} (${tracked.length} tracked files)`,
    validation: `unzip -t OK · one root "${rootName}/" · entry list matches file list · secret scan clean`,
    ...info,
  })

  note(`${label} ${version} → ${path.basename(outPath)} (${info.files} files)`)
}

await packageTracked({
  label: 'gcalls-core plugin',
  sourceDir: 'wordpress/wp-content/plugins/gcalls-core',
  rootName: 'gcalls-core',
  outName: 'gcalls-core-003b-p0.zip',
  versionFile: 'gcalls-core.php',
  versionPattern: /^\s*\*\s*Version:\s*(\S+)\s*$/m,
})

await packageTracked({
  label: 'gcalls-theme',
  sourceDir: 'wordpress/wp-content/themes/gcalls-theme',
  rootName: 'gcalls-theme',
  outName: 'gcalls-theme-003b-p0.zip',
  versionFile: 'style.css',
  versionPattern: /^Version:\s*(\S+)\s*$/m,
})

/* ------------------------------------------------------------------ *
 * 3. Content package — manifest with bodies, plus the media files
 * ------------------------------------------------------------------ */

/**
 * The manifest shipped here carries the article bodies; the one committed to
 * the repository does not. That is deliberate: the bodies already live in
 * `src/data/blog/articles/*.ts` under review, and committing a 370KB derived
 * copy of thirty thousand words would double the prose in Git and let the two
 * drift. The package is rebuilt from the commit named above, and its SHA-256 is
 * what ties it back.
 */
const contentStage = path.join(REPO, 'wordpress/dist/content-stage')
await rm(contentStage, { recursive: true, force: true })
await mkdir(path.join(contentStage, 'media'), { recursive: true })

execFileSync(
  process.execPath,
  [path.join(HERE, 'export-content.mjs'), '--with-bodies', `--out=${path.join(contentStage, 'content-manifest.json')}`],
  { cwd: REPO, stdio: 'pipe' },
)

const manifest = JSON.parse(await readFile(path.join(contentStage, 'content-manifest.json'), 'utf8'))

for (const item of manifest.media) {
  await copyFile(path.join(REPO, item.file), path.join(contentStage, 'media', path.basename(item.file)))
}

const contentFiles = ['content-manifest.json', ...manifest.media.map((item) => `media/${path.basename(item.file)}`)]
const contentVetProblems = await vet(contentStage, contentFiles)

if (contentVetProblems.length) {
  problems.push(...contentVetProblems.map((problem) => `content: ${problem}`))
} else {
  const outPath = path.join(OUT, 'gcalls-content-003b-p0.zip')
  await buildZip({ root: contentStage, relativePaths: contentFiles, rootName: 'gcalls-content', outPath })

  const verifyProblems = await verifyZip(outPath, 'gcalls-content', contentFiles)
  if (verifyProblems.length) {
    problems.push(...verifyProblems.map((problem) => `content: ${problem}`))
  } else {
    const info = await describe(outPath)
    await writeDigest(outPath, info.sha256)

    artifacts.push({
      label: 'content package',
      version: manifest.checkpoint,
      provenance: `wordpress/scripts/export-content.mjs --with-bodies @ ${SHORT}`,
      validation:
        `unzip -t OK · one root "gcalls-content/" · ${manifest.counts.pages} pages, ` +
        `${manifest.counts.articles} articles, ${manifest.counts.media} media · JSON re-parsed from disk`,
      ...info,
    })

    note(`content package → ${path.basename(outPath)} (${info.files} files)`)
  }
}

/* ------------------------------------------------------------------ *
 * 4. Elementor home page template
 * ------------------------------------------------------------------ */

execFileSync(process.execPath, [path.join(HERE, 'build-homepage-template.mjs')], { cwd: REPO, stdio: 'pipe' })

const templateSource = path.join(WP, 'elementor-templates/gcalls-homepage.json')
const templateOut = path.join(OUT, 'gcalls-elementor-homepage-003b-p0.json')
await copyFile(templateSource, templateOut)

const templateRaw = await readFile(templateOut, 'utf8')
let template = null

try {
  template = JSON.parse(templateRaw)
} catch (error) {
  problems.push(`elementor template: invalid JSON — ${String(error)}`)
}

if (template) {
  const flat = JSON.stringify(template)
  const widgetTypes = [...new Set([...flat.matchAll(/"widgetType":"([^"]+)"/g)].map((m) => m[1]))]
  const FREE = new Set(['heading', 'text-editor', 'button', 'icon-list', 'image', 'shortcode', 'html', 'divider', 'spacer'])
  const pro = widgetTypes.filter((type) => !FREE.has(type))

  if (template.type !== 'page') problems.push(`elementor template: type is ${template.type}, expected page`)
  if (!Array.isArray(template.content) || template.content.length === 0) problems.push('elementor template: no content')
  if (pro.length) problems.push(`elementor template: non-free widgets ${pro.join(', ')}`)
  if (/wp-content\/uploads/.test(flat)) problems.push('elementor template: hardcoded uploads URL')

  for (const { name, re } of SECRET_PATTERNS) {
    if (re.test(templateRaw)) problems.push(`elementor template: possible ${name}`)
  }

  const info = await describe(templateOut, { isZip: false })
  await writeDigest(templateOut, info.sha256)

  artifacts.push({
    label: 'Elementor home page template',
    version: '0.4 envelope',
    provenance: `wordpress/scripts/build-homepage-template.mjs @ ${SHORT} (deterministic — reruns are byte-identical)`,
    validation:
      `JSON re-parsed from disk · type "page" · ${template.content.length} sections · ` +
      `widgets: ${widgetTypes.join(', ')} · no Pro widget · no uploads URL · secret scan clean`,
    ...info,
  })

  note(`elementor template → ${path.basename(templateOut)} (${template.content.length} sections)`)
}

await rm(contentStage, { recursive: true, force: true })

/* ------------------------------------------------------------------ *
 * 5. The install checklist
 * ------------------------------------------------------------------ */

const checklistPath = path.join(OUT, 'GCALLS-003B-INSTALL-CHECKLIST.md')
const table = artifacts
  .map((a) => `| \`${path.basename(a.path)}\` | ${a.version} | ${a.bytes.toLocaleString('en-US')} | ${a.files} | \`${a.sha256}\` |`)
  .join('\n')

const provenance = artifacts
  .map((a) => `### ${path.basename(a.path)}\n\n- **Nguồn:** ${a.provenance}\n- **Kiểm tra:** ${a.validation}\n- **SHA-256:** \`${a.sha256}\``)
  .join('\n\n')

await writeFile(
  checklistPath,
  `# GCALLS-003B-P0 — INSTALL CHECKLIST

**Commit:** \`${HEAD}\` (\`${BRANCH}\`)
**Dựng lúc:** ${new Date().toISOString()}
**Không có bước nào trong tài liệu này được thực hiện tự động.** Mọi thao tác dưới đây cần người vận hành bấm trong wp-admin.

---

## 1. Gói

| File | Phiên bản | Bytes | Số file | SHA-256 |
| --- | --- | ---: | ---: | --- |
${table}

Kiểm tra trước khi upload:

\`\`\`
shasum -a 256 ~/Desktop/gcalls-*-003b-p0.* 
\`\`\`

---

## 2. Thứ tự cài — không đảo

Thứ tự này không tuỳ ý. Template Elementor đặt ảnh bằng \`[gcalls_media id="…"]\`,
và shortcode đó chỉ trả về ảnh sau khi bước 3 đã import media. Import template
trước bước 3 sẽ cho một trang chủ không có ảnh sản phẩm nào, và không có lỗi nào
báo ra.

### Bước 1 — Plugin \`gcalls-core\`

1. wp-admin → Plugins → Add New → Upload Plugin → \`gcalls-core-003b-p0.zip\`.
2. Chọn **Replace current with uploaded** nếu WordPress hỏi.
3. Activate.
4. Kiểm tra: Tools → **Gcalls Import** xuất hiện.

> Bản này giữ nguyên toàn bộ phần chặn author enumeration đã PASS ở 003A.
> Sau khi thay plugin, chạy lại \`npm run wp:live-verify\` để xác nhận 22/22.

### Bước 2 — Theme \`gcalls-theme\`

1. Appearance → Themes → Add New → Upload Theme → \`gcalls-theme-003b-p0.zip\`.
2. Replace current with uploaded → Activate (nếu chưa active).

### Bước 3 — Nội dung

1. Giải nén \`gcalls-content-003b-p0.zip\`.
2. Upload nội dung thư mục \`gcalls-content/\` lên host vào:
   \`wp-content/uploads/gcalls-import/\`
   Kết quả cần có:
   \`\`\`
   uploads/gcalls-import/content-manifest.json
   uploads/gcalls-import/media/<13 file .webp>
   \`\`\`
3. wp-admin → Tools → **Gcalls Import**.
4. Chọn \`content-manifest.json\`, để nguyên toàn bộ phạm vi, **không tick ô xác nhận**.
5. Bấm **Chạy import** → đây là **dry run**, không ghi gì. Đọc bảng kết quả.
6. Nếu bảng đúng như mong đợi: tick **"Tôi đã đọc kết quả dry-run và muốn ghi thật"** → **Chạy import**.

> Import từ chối chạy nếu manifest tạo ra URL sai. Nó không import một nửa.
> Chạy lại nhiều lần là an toàn: đối tượng đã có sẽ được bỏ qua, không nhân đôi.

### Bước 4 — Template Elementor trang chủ

1. Templates → Saved Templates → Import Templates → \`gcalls-elementor-homepage-003b-p0.json\`.
2. Mở trang chủ (page ID 13) bằng Elementor.
3. Thư viện (biểu tượng thư mục) → My Templates → **Gcalls — Trang chủ** → Insert.
4. Update.

---

## 3. Sau khi cài — kiểm tra bằng mắt

- [ ] \`/\` hiển thị trang chủ Elementor, đủ ${artifacts.find((a) => a.label.includes('Elementor')) ? 'các section' : 'section'}, ảnh sản phẩm hiện đúng.
- [ ] \`/blog/\` hiển thị **18 bài** gom theo **7 nhóm HUB**.
- [ ] Mở một bài bất kỳ: có breadcrumb, có FAQ ở cuối, không có ảnh đại diện giả.
- [ ] Menu header có 6 nhóm, menu footer có 5 cột.
- [ ] \`/tich-hop/hubspot/\` mở được (kiểm tra phân cấp).
- [ ] \`/gcalls-plus-webphone/\` mở được ở **cấp gốc**, không phải \`/san-pham/…\`.
- [ ] Nút CTA trên trang chủ dẫn tới \`/lien-he/?intent=…&source=…\`.
- [ ] Form liên hệ hiển thị thông báo chưa kết nối + email + hotline, các ô bị disable.
- [ ] \`npm run wp:live-verify\` vẫn 22/22.

---

## 4. Hoàn tác

\`\`\`
wp gcalls rollback              # thử, không xoá
wp gcalls rollback --execute    # xoá đúng những đối tượng lần import gần nhất tạo ra
\`\`\`

Rollback chỉ xoá thứ importer **tạo mới**, không đụng vào thứ nó chỉ cập nhật và
không đụng vào thứ người dùng tự tạo.

---

## 5. Provenance

${provenance}

---

## 6. Những gì gói này KHÔNG làm

- Không gửi lead đi đâu. Form fail-closed cho tới khi có destination được duyệt.
- Không tạo ảnh đại diện cho bài viết. 30 image brief vẫn chưa sản xuất.
- Không đổi tư thế noindex. Site vẫn \`noindex\` + \`Disallow: /\`.
- Không chạy import tự động. Không có hook nào khởi động nó.
- Không đụng tới cấu hình hosting, cron, wp-config hay user.
`,
)

const checklistInfo = await describe(checklistPath, { isZip: false })
await writeDigest(checklistPath, checklistInfo.sha256)
note(`checklist → ${path.basename(checklistPath)}`)

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

console.log('\nARTIFACTS\n')

for (const artifact of artifacts) {
  console.log(`  ${path.basename(artifact.path)}`)
  console.log(`    version   ${artifact.version}`)
  console.log(`    bytes     ${artifact.bytes}`)
  console.log(`    files     ${artifact.files}${artifact.directories ? ` (+${artifact.directories} dirs)` : ''}`)
  console.log(`    sha256    ${artifact.sha256}`)
  console.log(`    checked   ${artifact.validation}`)
  console.log('')
}

console.log(`  ${path.basename(checklistPath)}`)
console.log(`    bytes     ${checklistInfo.bytes}`)
console.log(`    sha256    ${checklistInfo.sha256}\n`)

if (problems.length) {
  console.log('PROBLEMS')
  for (const problem of problems) console.log(`  - ${problem}`)
  process.exit(1)
}

console.log(`build-release: OK — ${artifacts.length} artifacts + checklist in ${OUT}`)
