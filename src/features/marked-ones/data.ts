import type { MarkedCaller } from './types'

// Transcribed from the source image, not independently audited on-chain.
export const leaderboardSource = {
  url: 'https://x.com/a1lon9/status/2108618810420846647',
  status: 'transcribed-from-source',
  checkedOn: '2026-10-12',
  selectionBasis: 'highest-callout-rewards',
  reportingPeriod: null,
  caveats: [
    'This is a rewards leaderboard, not a verified ranking of signal quality.',
    'The source excludes callouts over $500m from the last-100-callouts statistics.',
    'Dollar amounts are displayed as USD; the payout asset and reward period are not specified.',
    'KOL labels do not establish exact Twitter handles or endorsement of this project.',
  ],
} as const

// Top five in source order. Titles and pixel portraits will be assigned later.
const sourceRows = [
  {
    name: 'chairman',
    rewards: '291707',
    marketCap: '1208478',
    followers: 118253,
    median: 2.5,
    average: 5.4,
  },
  {
    name: 'slingoor',
    rewards: '281727',
    marketCap: '684639',
    followers: 168171,
    median: 2.4,
    average: 4.5,
  },
  {
    name: 'Dior',
    rewards: '268691',
    marketCap: '1462196',
    followers: 113463,
    median: 3.0,
    average: 6.9,
  },
  {
    name: 'cupsey',
    rewards: '259516',
    marketCap: '179027',
    followers: 120232,
    median: 3.5,
    average: 7.0,
  },
  {
    name: 'jackduvalcalls',
    rewards: '177989',
    marketCap: '264688',
    followers: 107578,
    median: 2.8,
    average: 4.5,
  },
]

export const markedCallers: MarkedCaller[] = sourceRows.map((row, index) => ({
  id: row.name.toLowerCase(),
  displayName: row.name,
  twitterHandle: null,
  sourceRank: index + 1,
  orderTitle: null,
  portraitPath: null,
  rewards: {
    amount: row.rewards,
    displayCurrency: 'USD',
    payoutCurrency: null,
    periodLabel: null,
    sourceUrl: leaderboardSource.url,
    transcribedOn: leaderboardSource.checkedOn,
  },
  sourceStatistics: {
    followers: row.followers,
    averageMarketCapLast100: row.marketCap,
    medianGainMultiple: row.median,
    averageGainMultiple: row.average,
  },
  calloutEvidenceUrls: [],
}))
