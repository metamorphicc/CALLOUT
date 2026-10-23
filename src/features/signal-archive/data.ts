import type { SignalRecord } from './types'

// Only publish fully sourced observation records in this dataset.
// The source directory in src/lib/catalog.ts retains callouts with unknown timestamps.
export const signalRecords: SignalRecord[] = []
