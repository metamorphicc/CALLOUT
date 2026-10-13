import type { SignalRecord } from './types'

// Fictional fixtures requested by the project owner. No real caller attribution.
const moss = { id: 'moss-keeper', name: 'Moss Keeper', portraitIndex: 3 }
const rook = { id: 'quiet-rook', name: 'Quiet Rook', portraitIndex: 0 }
const glass = { id: 'glass-caller', name: 'Glass Caller', portraitIndex: 2 }

export const signalRecords: SignalRecord[] = [
  {
    id: 'demo-sigil-01',
    provenance: 'demo',
    caller: moss,
    token: { name: 'Sigil', symbol: 'SIGIL', mint: null },
    publishedAt: '2026-10-12T15:30:00Z',
    summary:
      'A new signal enters the archive. Follow the evidence as it arrives.',
    source: null,
    entry: null,
    observations: [],
    note: 'An illustrative pending record. No original post or market data is available.',
  },
  {
    id: 'demo-lantern-01',
    provenance: 'demo',
    caller: rook,
    token: { name: 'Lantern', symbol: 'LANTERN', mint: null },
    publishedAt: '2026-10-11T09:00:00Z',
    summary: 'A liquidity-first thesis, with observations at fixed intervals.',
    source: null,
    entry: {
      observedAt: '2026-10-11T09:00:00Z',
      priceUsd: 0.002,
      referenceUrl: null,
    },
    observations: [
      {
        horizon: '1h',
        observedAt: '2026-10-11T10:00:00Z',
        priceUsd: 0.0022,
        liquidityUsd: 48000,
        referenceUrl: null,
      },
      {
        horizon: '24h',
        observedAt: '2026-10-12T09:00:00Z',
        priceUsd: 0.0024,
        liquidityUsd: 51000,
        referenceUrl: null,
      },
    ],
    note: 'Synthetic prices and liquidity illustrate a complete observation timeline. They are not trading results.',
  },
  {
    id: 'demo-veil-01',
    provenance: 'demo',
    caller: glass,
    token: { name: 'Veil', symbol: 'VEIL', mint: null },
    publishedAt: '2026-10-10T18:00:00Z',
    summary:
      'One observation is available. The missing interval stays visible.',
    source: null,
    entry: {
      observedAt: '2026-10-10T18:00:00Z',
      priceUsd: 0.005,
      referenceUrl: null,
    },
    observations: [
      {
        horizon: '1h',
        observedAt: '2026-10-10T19:00:00Z',
        priceUsd: 0.0045,
        liquidityUsd: null,
        referenceUrl: null,
      },
    ],
    note: 'An illustrative incomplete record. The 24-hour observation and liquidity snapshot are missing; neither is estimated.',
  },
  {
    id: 'demo-moss-01',
    provenance: 'demo',
    caller: moss,
    token: { name: 'Moss', symbol: 'MOSS', mint: null },
    publishedAt: '2026-10-09T12:00:00Z',
    summary:
      'Preserve the original thesis even when later observations decline.',
    source: null,
    entry: {
      observedAt: '2026-10-09T12:00:00Z',
      priceUsd: 0.001,
      referenceUrl: null,
    },
    observations: [
      {
        horizon: '1h',
        observedAt: '2026-10-09T13:00:00Z',
        priceUsd: 0.0009,
        liquidityUsd: 32000,
        referenceUrl: null,
      },
      {
        horizon: '24h',
        observedAt: '2026-10-10T12:00:00Z',
        priceUsd: 0.0007,
        liquidityUsd: 24000,
        referenceUrl: null,
      },
    ],
    note: 'A fictional declining-price example. The archive keeps unfavorable observations alongside favorable ones.',
  },
  {
    id: 'demo-sigil-02',
    provenance: 'demo',
    caller: rook,
    token: { name: 'Sigil', symbol: 'SIGIL', mint: null },
    publishedAt: '2026-10-08T23:45:00Z',
    summary:
      'A separate thesis for the same token, kept as its own dated record.',
    source: null,
    entry: {
      observedAt: '2026-10-08T23:45:00Z',
      priceUsd: 0.003,
      referenceUrl: null,
    },
    observations: [
      {
        horizon: '1h',
        observedAt: '2026-10-09T00:45:00Z',
        priceUsd: 0.0031,
        liquidityUsd: 39000,
        referenceUrl: null,
      },
    ],
    note: 'A synthetic example of multiple callers covering one token. The mint address has not been supplied.',
  },
  {
    id: 'demo-rune-01',
    provenance: 'demo',
    caller: glass,
    token: { name: 'Rune', symbol: 'RUNE', mint: null },
    publishedAt: '2026-10-07T06:15:00Z',
    summary: 'An archived idea with no usable price observations attached.',
    source: null,
    entry: null,
    observations: [],
    note: 'A fictional placeholder. Missing evidence remains missing, regardless of how old a record is.',
  },
]
