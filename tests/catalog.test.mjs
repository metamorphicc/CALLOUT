import test from 'node:test'
import assert from 'node:assert/strict'
import { URL } from 'node:url'
import {
  selectCallers,
  validSavedItems,
  publishedSignals,
  reviewUrl,
} from '../src/lib/catalog.ts'
import { markedCallers } from '../src/features/marked-ones/data.ts'

test('caller sorting changes order without mutating the source ranking', () => {
  const before = markedCallers.map((caller) => caller.id)
  assert.equal(selectCallers(markedCallers, '', 'median')[0].id, 'cupsey')
  assert.equal(selectCallers(markedCallers, '', 'followers')[0].id, 'slingoor')
  assert.deepEqual(
    selectCallers(markedCallers, ' @DIOR ', 'rank').map((caller) => caller.id),
    ['dior'],
  )
  assert.deepEqual(
    markedCallers.map((caller) => caller.id),
    before,
  )
})
test('saved items reject corrupted storage, unknown IDs and duplicates', () => {
  const allowed = ['caller:chairman', 'signal:cupsey-csfun']
  assert.deepEqual(validSavedItems('{broken', allowed), [])
  assert.deepEqual(validSavedItems('{"bad":true}', allowed), [])
  assert.deepEqual(
    validSavedItems(
      '["caller:chairman",null,"unknown","caller:chairman"]',
      allowed,
    ),
    ['caller:chairman'],
  )
})
test('published signals have original sources, real caller references and no invented publication times', () => {
  assert.equal(
    new Set(publishedSignals.map((item) => item.id)).size,
    publishedSignals.length,
  )
  for (const signal of publishedSignals) {
    assert.ok(markedCallers.some((caller) => caller.id === signal.callerId))
    assert.equal(new URL(signal.sourceUrl).hostname, 'pump.fun')
    assert.ok(signal.sourceUrl.includes(`/callouts/${signal.mint}/`))
    assert.equal(signal.publishedAt, null)
  }
})
test('nomination review preserves original evidence and requires a GitHub submission', () => {
  const url = new URL(reviewUrl('caller', ['https://x.com/caller/status/123']))
  assert.equal(
    url.origin + url.pathname,
    'https://github.com/metamorphicc/CALLOUT/issues/new',
  )
  assert.ok(
    url.searchParams.get('body').includes('https://x.com/caller/status/123'),
  )
})
