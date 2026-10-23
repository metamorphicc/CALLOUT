import test from 'node:test'
import assert from 'node:assert/strict'
import { validateNomination } from '../src/features/nomination.ts'

test('accepts original Pump.fun callouts and rejects coin pages and lookalike hosts', () => {
  const url =
    'https://pump.fun/callouts/GPuN3s5PZTPcQV7cykNaTyX9cVesPSyz7111nsNKu4cv/4e8e7572-1dc4-4016-b2a0-a76b369bc4c2'
  assert.ok(validateNomination('Cupseyy', url).draft)
  assert.equal(
    validateNomination(
      'Cupseyy',
      url.replace('pump.fun/', 'pump.fun.evil.example/'),
    ).field,
    'evidence',
  )
  assert.equal(
    validateNomination(
      'Cupseyy',
      'https://pump.fun/coin/GPuN3s5PZTPcQV7cykNaTyX9cVesPSyz7111nsNKu4cv',
    ).field,
    'evidence',
  )
})

test('accepts an original HTTPS post and normalizes the handle', () => {
  const result = validateNomination(
    ' @sample_caller ',
    'https://x.com/sample_caller/status/12345',
  )
  assert.deepEqual(result.draft, {
    twitterHandle: 'sample_caller',
    calloutUrls: ['https://x.com/sample_caller/status/12345'],
    status: 'draft',
  })
})

test('deduplicates receipts and accepts the legacy Twitter domain', () => {
  const post = 'https://twitter.com/sample/status/12345'
  const result = validateNomination('sample', `${post}\n\n${post}`)
  assert.equal(result.draft?.calloutUrls.length, 1)
})

test('rejects empty and invalid handles with the correct field', () => {
  for (const handle of ['', '@', 'two names', 'a'.repeat(16)])
    assert.equal(
      validateNomination(handle, 'https://x.com/sample/status/12345').field,
      'handle',
    )
})

test('rejects non-post links, insecure URLs, lookalike domains and credentials', () => {
  for (const link of [
    'https://x.com/sample',
    'http://x.com/sample/status/12345',
    'https://x.com.evil.example/sample/status/12345',
    'https://user:password@x.com/sample/status/12345',
    'javascript:alert(1)',
    'https://x.com/sample/status/not-a-number',
  ]) {
    const result = validateNomination('sample', link)
    assert.equal(result.field, 'evidence')
    assert.equal(result.draft, undefined)
  }
})

test('requires evidence and caps a nomination at five unique posts', () => {
  assert.equal(validateNomination('sample', '').field, 'evidence')
  const posts = Array.from(
    { length: 6 },
    (_, index) => `https://x.com/sample/status/${100 + index}`,
  ).join('\n')
  assert.equal(validateNomination('sample', posts).field, 'evidence')
})
