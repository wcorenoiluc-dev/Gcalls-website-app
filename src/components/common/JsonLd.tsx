import { useEffect } from 'react'

/**
 * Injects a JSON-LD structured-data block for the current route and removes it
 * on unmount, so a page's schema never leaks into the next route.
 *
 * `id` must be unique per page.
 */
export function JsonLd({ id, data }: { id: string; data: unknown }) {
  useEffect(() => {
    const elementId = `jsonld-${id}`
    document.getElementById(elementId)?.remove()

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = elementId
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      document.getElementById(elementId)?.remove()
    }
  }, [id, data])

  return null
}
