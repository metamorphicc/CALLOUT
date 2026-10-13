import type { SignalFilters, SignalRecord, SignalStatus } from './types'

export const defaultSignalFilters: SignalFilters = {
  callerId: 'all',
  token: '',
  from: '',
  to: '',
  status: 'all',
  sort: 'newest',
}

export const signalStatusLabels: Record<SignalStatus, string> = {
  recorded: 'Observations recorded',
  partial: 'Incomplete data',
  pending: 'Awaiting observations',
}

export function signalStatus(record: SignalRecord): SignalStatus {
  if (!record.observations.length) return 'pending'
  return record.entry &&
    ['1h', '24h'].every((horizon) =>
      record.observations.some(
        (observation) => observation.horizon === horizon,
      ),
    )
    ? 'recorded'
    : 'partial'
}

function utcDay(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(parsed) &&
    new Date(parsed).toISOString().slice(0, 10) === value
    ? parsed
    : null
}

export function filterSignals(
  records: readonly SignalRecord[],
  filters: SignalFilters,
) {
  const from = filters.from ? utcDay(filters.from) : null
  const to = filters.to ? utcDay(filters.to) : null
  if ((filters.from && from === null) || (filters.to && to === null))
    return { records: [], error: 'Enter a valid date for each date filter.' }
  if (from !== null && to !== null && from > to)
    return {
      records: [],
      error: 'The end date must be on or after the start date.',
    }
  const query = filters.token.trim().toLowerCase().replace(/^\$/, '')
  const matches = records.filter((record) => {
    const timestamp = Date.parse(record.publishedAt)
    return (
      (filters.callerId === 'all' || record.caller.id === filters.callerId) &&
      (!query ||
        [record.token.symbol, record.token.name, record.token.mint ?? ''].some(
          (value) => value.toLowerCase().includes(query),
        )) &&
      (from === null || timestamp >= from) &&
      (to === null || timestamp < to + 86_400_000) &&
      (filters.status === 'all' || signalStatus(record) === filters.status)
    )
  })
  matches.sort((a, b) => {
    const difference = Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    return (
      (filters.sort === 'newest' ? difference : -difference) ||
      a.id.localeCompare(b.id)
    )
  })
  return { records: matches, error: null }
}

// Demo records never expose an original-post link, even if a fixture gains one.
export function originalPostUrl(record: SignalRecord): string | null {
  if (record.provenance === 'demo' || !record.source) return null
  try {
    const url = new URL(record.source.url)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    const twitterPost =
      ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(
        url.hostname,
      ) && /^\/[A-Za-z0-9_]+\/status\/\d+\/?$/.test(url.pathname)
    const pumpCallout =
      url.hostname === 'pump.fun' &&
      /^\/callouts\/[A-Za-z0-9]+\/[a-f0-9-]+\/?$/i.test(url.pathname)
    return twitterPost || pumpCallout ? url.href : null
  } catch {
    return null
  }
}
