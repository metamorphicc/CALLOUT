function publicUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && !url.username && !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

export const project = {
  name: 'The Callout Order',
  ticker: '$CALLOUT',
  links: {
    twitter: publicUrl(import.meta.env.VITE_PROJECT_TWITTER_URL),
    telegram: publicUrl(import.meta.env.VITE_PROJECT_TELEGRAM_URL),
    pump: publicUrl(import.meta.env.VITE_PROJECT_PUMP_URL),
  },
  token: {
    contractAddress:
      import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS?.trim() || null,
    tradeUrl: publicUrl(import.meta.env.VITE_TOKEN_TRADE_URL),
    chartUrl: publicUrl(import.meta.env.VITE_TOKEN_CHART_URL),
    supply: null,
    distribution: null,
  },
} as const
