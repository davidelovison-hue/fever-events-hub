/** Resolve a file from `public/` with the Vite base path (GitHub Pages subpath-safe). */
export function publicAsset(path: string): string {
  const clean = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}

/** Official Pacha cherry mark (same asset as pacha.com header /favicon.svg). */
export const PACHA_CHERRY_SRC = publicAsset('pacha-favicon.svg')

/** Remote fallback if local asset is unavailable. */
export const PACHA_CHERRY_CDN = 'https://pacha.com/favicon.svg'

/** @deprecated Use PACHA_CHERRY_SRC for brand lockup. */
export const PACHA_LOGO_COLOR_SRC =
  'https://pacha-production.s3.eu-west-1.amazonaws.com/cb2b2f8c-1536-4986-b25a-7f1574f10659/d0ac00b9-2088-465a-a203-0da4c2e92e2a.svg'

export const PACHA_FAVICON_SRC = PACHA_CHERRY_SRC
