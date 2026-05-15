import type { PachaEventRow } from './pachaEventsData'
import { PACHA_EVENTS_SOURCE } from './pachaEventsData'
import { getPachaArtistPortrait } from './pachaArtistImages'
import { getEventSignal, type PachaEventSignal } from './pachaEventSignal'

export type PachaArtist = {
  id: string
  name: string
  /** DJ portrait from Pacha media when available. */
  image: string
  /** Event poster — used if portrait fails to load. */
  fallbackImage: string
  date: string
  eventId: string
  signal: PachaEventSignal | null
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function cleanArtistName(raw: string): string {
  return raw
    .trim()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractHeadliner(title: string): string | null {
  let t = title
  const presents = t.match(/^(.+?)\s+PRESENTS\b/i)
  if (presents) t = presents[1]
  t = t.split(/\s*[-|]\s*/)[0]?.trim() ?? ''
  t = t.replace(/\s*&\s*CO$/i, '').trim()
  if (t.length < 2 || t.length > 48) return null
  return cleanArtistName(t)
}

function parseLineup(lineup: string): string[] {
  return lineup
    .split('·')
    .map(cleanArtistName)
    .filter((n) => n.length >= 2)
}

function parseEventDate(date: string): number {
  const m = date.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i)
  if (!m) return 0
  const months: Record<string, number> = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dic: 11,
    jan: 0,
    apr: 3,
    aug: 7,
    dec: 11,
  }
  const mon = months[m[2].slice(0, 3).toLowerCase()] ?? 0
  return new Date(Number(m[3]), mon, Number(m[1])).getTime()
}

export function buildArtistsFromEvents(events: PachaEventRow[], limit = 24): PachaArtist[] {
  const byKey = new Map<string, PachaArtist & { sortKey: number }>()

  for (const ev of events) {
    const names = new Set<string>()
    if (ev.lineup) parseLineup(ev.lineup).forEach((n) => names.add(n))
    const headliner = extractHeadliner(ev.title)
    if (headliner) names.add(headliner)

    const sortKey = parseEventDate(ev.date)
    for (const name of names) {
      const portrait = getPachaArtistPortrait(name)
      if (!portrait) continue

      const key = name.toLowerCase()
      const existing = byKey.get(key)
      if (!existing || sortKey < existing.sortKey) {
        byKey.set(key, {
          id: slug(name),
          name,
          image: portrait,
          fallbackImage: ev.image,
          date: ev.date,
          eventId: ev.id,
          signal: getEventSignal(ev),
          sortKey,
        })
      }
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => a.sortKey - b.sortKey || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ sortKey: _, ...artist }) => artist)
}

/** Featured artists for the home carousel (chronological, deduped). */
export const PACHA_ARTISTS = buildArtistsFromEvents(PACHA_EVENTS_SOURCE, 24)
