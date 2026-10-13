import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultSignalFilters,
  filterSignals,
  originalPostUrl,
  signalStatus,
} from '../src/features/signal-archive/filter.ts'

const record = (id, publishedAt, callerId = 'moss', symbol = 'SIGIL') => ({
  id,
  publishedAt,
  provenance: 'demo',
  caller: { id: callerId, name: callerId, portraitIndex: 0 },
  token: { name: symbol, symbol, mint: null },
  source: null,
  entry: null,
  observations: [],
  summary: '',
  note: '',
})
const filter = (records, changes = {}) =>
  filterSignals(records, { ...defaultSignalFilters, ...changes })

test('combines caller and token filters, normalizing symbol search', () => {
  const records = [
    record('a', '2026-10-10T12:00:00Z'),
    record('b', '2026-10-10T13:00:00Z', 'rook'),
    record('c', '2026-10-10T14:00:00Z', 'moss', 'MOSS'),
  ]
  assert.deepEqual(
    filter(records, { callerId: 'moss', token: ' $sigil ' }).records.map(
      (item) => item.id,
    ),
    ['a'],
  )
  assert.equal(filter(records, { token: 'missing' }).records.length, 0)
})

test('includes the entire end date in UTC and excludes the next day', () => {
  const records = [
    record('before', '2026-10-09T23:59:59Z'),
    record('start', '2026-10-10T00:00:00Z'),
    record('end', '2026-10-10T23:59:59.999Z'),
    record('after', '2026-10-11T00:00:00Z'),
  ]
  assert.deepEqual(
    filter(records, { from: '2026-10-10', to: '2026-10-10' }).records.map(
      (item) => item.id,
    ),
    ['end', 'start'],
  )
})

test('rejects reversed dates and impossible calendar dates', () => {
  for (const changes of [
    { from: '2026-10-11', to: '2026-10-10' },
    { from: '2026-02-30' },
    { to: 'invalid' },
  ]) {
    assert.ok(filter([], changes).error)
  }
})

test('sorts both ways without mutating the input and supports reset defaults', () => {
  const records = [
    record('old', '2026-10-09T12:00:00Z'),
    record('new', '2026-10-10T12:00:00Z'),
  ]
  assert.deepEqual(
    filter(records).records.map((item) => item.id),
    ['new', 'old'],
  )
  assert.deepEqual(
    filter(records, { sort: 'oldest' }).records.map((item) => item.id),
    ['old', 'new'],
  )
  assert.deepEqual(
    records.map((item) => item.id),
    ['old', 'new'],
  )
})

test('keeps missing observations incomplete instead of inferring a result', () => {
  const pending = record('pending', '2026-10-10T12:00:00Z')
  const partial = {
    ...pending,
    id: 'partial',
    observations: [{ horizon: '1h' }],
  }
  const complete = {
    ...pending,
    id: 'complete',
    entry: { priceUsd: 1 },
    observations: [{ horizon: '1h' }, { horizon: '24h' }],
  }
  assert.equal(signalStatus(pending), 'pending')
  assert.equal(signalStatus(partial), 'partial')
  assert.equal(signalStatus(complete), 'recorded')
  assert.equal(signalStatus({ ...complete, entry: null }), 'partial')
  assert.deepEqual(
    filter([pending, partial, complete], { status: 'partial' }).records.map(
      (item) => item.id,
    ),
    ['partial'],
  )
})

test('never presents demo links as real sources and rejects unsafe or non-post URLs', () => {
  const sourceRecord = {
    ...record('a', '2026-10-10T12:00:00Z'),
    provenance: 'source-linked',
    source: {
      url: 'https://x.com/caller/status/12345',
      checkedAt: '2026-10-12',
    },
  }
  assert.equal(originalPostUrl(sourceRecord), sourceRecord.source.url)
  assert.equal(originalPostUrl({ ...sourceRecord, provenance: 'demo' }), null)
  for (const url of [
    'javascript:alert(1)',
    'http://x.com/caller/status/12345',
    'https://x.com.evil.example/caller/status/12345',
    'https://user:password@x.com/caller/status/12345',
    'https://x.com/caller',
    'invalid',
  ]) {
    assert.equal(
      originalPostUrl({
        ...sourceRecord,
        source: { ...sourceRecord.source, url },
      }),
      null,
    )
  }
  assert.ok(
    originalPostUrl({
      ...sourceRecord,
      source: {
        ...sourceRecord.source,
        url: 'https://pump.fun/callouts/AbC123/0cead5ef-5488-4d87-a065-88a7fe3f4503',
      },
    }),
  )
})
