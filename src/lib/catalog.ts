import type { MarkedCaller } from '../features/marked-ones/types'

export interface PublishedSignal {
  id: string
  callerId: string
  symbol: string
  tokenName: string
  mint: string
  sourceUrl: string
  indexedAt: string
  publishedAt: string | null
  description: string
}

export const publishedSignals: PublishedSignal[] = [
  {
    id: 'cupsey-csfun',
    callerId: 'cupsey',
    symbol: 'CSFUN',
    tokenName: 'csfun',
    mint: 'GPuN3s5PZTPcQV7cykNaTyX9cVesPSyz7111nsNKu4cv',
    sourceUrl:
      'https://pump.fun/callouts/GPuN3s5PZTPcQV7cykNaTyX9cVesPSyz7111nsNKu4cv/4e8e7572-1dc4-4016-b2a0-a76b369bc4c2',
    indexedAt: '2026-10-23',
    publishedAt: null,
    description:
      'A CSFUN callout published under cupsey’s name on Pump.fun. The original record is available at the source.',
  },
  {
    id: 'jackduval-tiktok',
    callerId: 'jackduvalcalls',
    symbol: 'TikTok',
    tokenName: 'Tiktok Coin',
    mint: '89RAitwPJBEfLK4Gcg5iv7AjFABHWNvoD5rkvRkvpump',
    sourceUrl:
      'https://pump.fun/callouts/89RAitwPJBEfLK4Gcg5iv7AjFABHWNvoD5rkvRkvpump/0cead5ef-5488-4d87-a065-88a7fe3f4503',
    indexedAt: '2026-10-23',
    publishedAt: null,
    description:
      'A TikTok callout published under jackduvalcalls on Pump.fun. Read the original thread for the caller’s thesis and updates.',
  },
]

export type CallerSort = 'rank' | 'rewards' | 'followers' | 'median'
export function selectCallers(
  callers: readonly MarkedCaller[],
  query: string,
  sort: CallerSort,
) {
  const search = query.trim().toLowerCase().replace(/^@/, '')
  return callers
    .filter((caller) => caller.displayName.toLowerCase().includes(search))
    .sort((a, b) => {
      if (sort === 'rewards')
        return Number(b.rewards?.amount ?? 0) - Number(a.rewards?.amount ?? 0)
      if (sort === 'followers')
        return (
          (b.sourceStatistics?.followers ?? 0) -
          (a.sourceStatistics?.followers ?? 0)
        )
      if (sort === 'median')
        return (
          (b.sourceStatistics?.medianGainMultiple ?? 0) -
          (a.sourceStatistics?.medianGainMultiple ?? 0)
        )
      return a.sourceRank - b.sourceRank
    })
}

export function validSavedItems(
  raw: string | null,
  allowed: readonly string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]')
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === 'string' && allowed.includes(id),
            ),
          ),
        ]
      : []
  } catch {
    return []
  }
}

export const money = (amount: number | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount))
export const count = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
export const displayDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))

export function reviewUrl(handle: string, evidence: readonly string[]): string {
  const url = new URL('https://github.com/metamorphicc/CALLOUT/issues/new')
  url.searchParams.set('title', `Caller nomination: @${handle}`)
  url.searchParams.set(
    'body',
    `## Caller\n@${handle}\n\n## Original callouts\n${evidence.join('\n')}\n\n## Review\nPlease review attribution and supporting sources before listing.`,
  )
  return url.href
}
