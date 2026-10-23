export type SignalStatus = 'recorded' | 'partial' | 'pending'

export interface SignalObservation {
  horizon: '1h' | '24h'
  observedAt: string
  priceUsd: number
  liquidityUsd: number | null
  referenceUrl: string | null
}

export interface SignalRecord {
  id: string
  provenance: 'source-linked'
  caller: { id: string; name: string; portraitIndex: number }
  token: { name: string; symbol: string; mint: string | null }
  publishedAt: string
  summary: string
  source: { url: string; checkedAt: string } | null
  entry: {
    observedAt: string
    priceUsd: number
    referenceUrl: string | null
  } | null
  observations: SignalObservation[]
  note: string
}

export interface SignalFilters {
  callerId: string
  token: string
  from: string
  to: string
  status: 'all' | SignalStatus
  sort: 'newest' | 'oldest'
}
