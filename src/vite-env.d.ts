interface ImportMetaEnv {
  readonly VITE_PROJECT_TWITTER_URL?: string
  readonly VITE_PROJECT_TELEGRAM_URL?: string
  readonly VITE_PROJECT_PUMP_URL?: string
  readonly VITE_TOKEN_CONTRACT_ADDRESS?: string
  readonly VITE_TOKEN_TRADE_URL?: string
  readonly VITE_TOKEN_CHART_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
