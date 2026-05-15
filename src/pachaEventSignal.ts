import type { PachaEventRow } from './pachaEventsData'

export type PachaEventSignal = 'soldOut' | 'low'

function eventIdHash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

/** Availability badge for prototype (uses scraped soldOut when present). */
export function getEventSignal(ev: Pick<PachaEventRow, 'id' | 'soldOut'>): PachaEventSignal | null {
  if (ev.soldOut) return 'soldOut'
  const h = eventIdHash(ev.id)
  if (h % 11 === 0) return 'soldOut'
  if (h % 6 === 0) return 'low'
  return null
}

export function signalLabel(signal: PachaEventSignal): string {
  return signal === 'soldOut' ? 'Sold out' : 'Last tickets'
}
