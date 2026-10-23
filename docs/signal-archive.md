# Signal source directory

The public archive uses `publishedSignals` in `src/lib/catalog.ts`. Every entry links to an original post and to a caller in the source rewards directory.

## Published record fields

| Field                 | Definition                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `id`                  | Stable unique ID used in the public route and saved items.                                               |
| `callerId`            | Existing ID in `markedCallers`.                                                                          |
| `symbol`, `tokenName` | Token identity as described by the source.                                                               |
| `mint`                | Exact Solana mint address from the original callout URL.                                                 |
| `sourceUrl`           | Original Pump.fun callout page.                                                                          |
| `indexedAt`           | Date this directory added the record, in `YYYY-MM-DD`.                                                   |
| `publishedAt`         | Independently established original timestamp or `null`. Never use the indexing date as publication time. |
| `description`         | An editorial source description without invented performance claims.                                     |

The two indexed sources are [cupsey / CSFUN](https://pump.fun/callouts/GPuN3s5PZTPcQV7cykNaTyX9cVesPSyz7111nsNKu4cv/4e8e7572-1dc4-4016-b2a0-a76b369bc4c2) and [jackduvalcalls / TikTok](https://pump.fun/callouts/89RAitwPJBEfLK4Gcg5iv7AjFABHWNvoD5rkvRkvpump/0cead5ef-5488-4d87-a065-88a7fe3f4503). Publicly indexed source titles establish the caller and symbol. Full publication timestamps and historical prices have not been independently established.

## Adding a record

Confirm the original post, caller attribution, symbol and mint before adding an entry. Retain the exact source URL and a stable ID. Set the indexing date to the date of the editorial addition. Keep publication time `null` when it is unconfirmed. Do not substitute self-reported P&L or present-day values for historical observations.

Run checks, tests and the production build after an update. Rebuilding regenerates the overview count, source cards, profile references and pre-rendered detail pages. Unknown profile or signal IDs display an explicit not-found state.

## Filters and saved items

Archive filters combine token search, caller and inclusive date-added bounds. Search accepts a symbol with or without `$`, a name, or a mint substring. The URL preserves these selections. Sorting uses the indexing date.

Saved records use `signal:<id>` identifiers in localStorage. IDs outside the published catalog are ignored during restoration. Saving a record does not connect a wallet, follow a social account or create a server account.

## Observation records

The typed observation format in `src/features/signal-archive/` remains available for future evidenced series. Its published dataset is empty. No historical price series is shown in the current source directory. A baseline, observation timestamps, provider, market, mint, fees and liquidity assumptions would need a separate reviewed methodology before performance could be presented.
