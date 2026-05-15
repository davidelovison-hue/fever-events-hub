import { PACHA_ARTIST_IMAGE_ROWS } from './pachaArtistImages.generated'

const ALIAS_TO_SLUG: Record<string, string> = {
  'shimza and co': 'shimza',
  shimzaco: 'shimza',
  'shimza co': 'shimza',
  'blond ish': 'blondish',
  blondish: 'blondish',
  'chris stussy presents uss': 'chris-stussy',
  'chris stussy': 'chris-stussy',
  'marco carola': 'marco-carola',
  'marco carola presents music on': 'marco-carola',
  'music on': 'music-on',
  'sonny fodera': 'sonny-fodera',
  'robin schulz': 'robin-schulz',
  'franky rizardo': 'franky-rizardo',
  'franky rizardo presents flow': 'franky-rizardo',
  'vintage culture': 'vintage-culture',
  'damian lazarus': 'damian-lazarus',
  'mayan warrior': 'mayan-warrior',
  solomun: 'solomun',
  'solomun 1': 'solomun',
  gordo: 'gordo',
  'rampa me keinemusik': 'rampa',
  rampa: 'rampa',
  'me vs rampa keinemusik': 'rampa',
  'purple disco machine': 'purple-disco-machine',
  'mau p': 'mau-p',
}

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const byKey = new Map<string, string>()
const bySlug = new Map<string, string>()

for (const row of PACHA_ARTIST_IMAGE_ROWS) {
  byKey.set(normalizeKey(row.name), row.image)
  bySlug.set(row.slug, row.image)
}

function lookupPachaArtistPortrait(artistName: string): string | null {
  const key = normalizeKey(artistName)
  const direct = byKey.get(key)
  if (direct) return direct

  const aliasSlug = ALIAS_TO_SLUG[key]
  if (aliasSlug && bySlug.has(aliasSlug)) return bySlug.get(aliasSlug)!

  for (const [aliasKey, slug] of Object.entries(ALIAS_TO_SLUG)) {
    if (key.includes(aliasKey) || aliasKey.includes(key)) {
      const img = bySlug.get(slug)
      if (img) return img
    }
  }

  for (const [rowKey, url] of byKey) {
    if (rowKey.includes(key) || key.includes(rowKey)) return url
  }

  return null
}

/** Portrait URL when Pacha has one; otherwise null (no event-poster substitute). */
export function getPachaArtistPortrait(artistName: string): string | null {
  return lookupPachaArtistPortrait(artistName)
}

/** Portrait URL from Pacha media CDN, or event poster as fallback. */
export function resolvePachaArtistImage(
  artistName: string,
  fallbackEventImage: string,
): string {
  return lookupPachaArtistPortrait(artistName) ?? fallbackEventImage
}
