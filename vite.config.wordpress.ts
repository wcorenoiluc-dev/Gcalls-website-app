import { defineConfig } from 'vite'
import path from 'path'
import { cpSync, existsSync, renameSync, rmdirSync } from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Copies only the images actually referenced by root-absolute `/images/...`
 * paths (see src/data/productImages.ts) into the plugin's own dist/, so they
 * resolve under the plugin's runtime assetsUrl instead of the (nonexistent,
 * under a WP install) domain-root /images/ path. Nothing else under public/
 * is copied — see the publicDir: false note below.
 */
function copyShellImages() {
  return {
    name: 'gcalls-shell-copy-images',
    closeBundle() {
      const from = path.resolve(__dirname, 'public/images')
      const to = path.resolve(
        __dirname,
        'wordpress/wp-content/plugins/gcalls-react-shell/dist/images',
      )
      if (existsSync(from)) {
        cpSync(from, to, { recursive: true })
      }
    },
  }
}

/**
 * Dedicated build for the gcalls-react-shell WordPress plugin.
 *
 * Separate from vite.config.ts (the normal local/preview build) because this
 * output is served from wp-content/plugins/gcalls-react-shell/dist/, not from
 * a domain root — assets need a plugin-relative base, a manifest for the PHP
 * template to read real chunk filenames from, and no HTML entry (the plugin
 * supplies its own PHP template instead of index.html).
 */

/**
 * Vite writes the manifest to dist/.vite/manifest.json by default. The
 * packaging vet rejects dotfile/dot-directory segments outright (see
 * wordpress/scripts/lib/package.mjs FORBIDDEN_SEGMENTS) — a rule that exists
 * so a stray `.env` or `.git` never rides along in a shipped ZIP — so the
 * manifest is relocated to dist/manifest.json instead of carving out an
 * exception to that rule. class-react-shell.php checks both locations.
 */
function flattenManifest() {
  return {
    name: 'gcalls-shell-flatten-manifest',
    closeBundle() {
      const viteDir = path.resolve(OUT_DIR, '.vite')
      const from = path.join(viteDir, 'manifest.json')
      const to = path.resolve(OUT_DIR, 'manifest.json')
      if (existsSync(from)) {
        renameSync(from, to)
        rmdirSync(viteDir)
      }
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

const OUT_DIR = path.resolve(
  __dirname,
  'wordpress/wp-content/plugins/gcalls-react-shell/dist',
)

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss(), copyShellImages(), flattenManifest()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  base: './',
  // The root app's public/ holds domain-root files (robots.txt, _headers,
  // .htaccess) that make no sense copied into a WP plugin's dist/ and would
  // fail the packaging vet (forbidden dotfile / unrecognized extension). The
  // shell only needs the JS/CSS bundle.
  publicDir: false,
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    manifest: true,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
    },
  },
})
