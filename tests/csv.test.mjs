import test from 'node:test'
import assert from 'node:assert/strict'
import { toCsv } from '../src/lib/csv.ts'

test('CSV preserves commas, newlines, quotes and numeric values', () => {
  assert.equal(
    toCsv([
      ['caller', 'reward'],
      ['a,"b"\nc', 291707],
    ]),
    '"caller","reward"\r\n"a,""b""\nc","291707"',
  )
})
test('CSV neutralizes spreadsheet formulas in text without changing numbers', () => {
  assert.equal(
    toCsv([['=SUM(A1)', ' @caller', '+123', -2]]),
    '"\'=SUM(A1)","\' @caller","\'+123","-2"',
  )
})
