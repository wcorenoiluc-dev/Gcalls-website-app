/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "true" in production at go-live to allow search indexing. */
  readonly VITE_ALLOW_INDEXING?: string
  /** Canonical origin, e.g. https://gcalls.co */
  readonly VITE_SITE_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
