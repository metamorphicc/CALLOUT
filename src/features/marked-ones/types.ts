// Rewards require a source; unknown reporting periods stay null.
// Order titles belong to this project's lore, not to the source leaderboard.
export type OrderTitle = 'Initiate' | 'Elder' | 'Grand Caller'

export interface RewardSnapshot {
  amount: string
  displayCurrency: 'USD' | 'USDC' | 'SOL'
  payoutCurrency: 'USDC' | 'SOL' | null
  periodLabel: string | null
  sourceUrl: string
  transcribedOn: string
}

export interface MarkedCaller {
  id: string
  displayName: string
  twitterHandle: string | null
  sourceRank: number
  orderTitle: OrderTitle | null
  portraitPath: string | null
  rewards: RewardSnapshot | null
  sourceStatistics: {
    followers: number
    averageMarketCapLast100: string
    medianGainMultiple: number
    averageGainMultiple: number
  } | null
  calloutEvidenceUrls: string[]
}
