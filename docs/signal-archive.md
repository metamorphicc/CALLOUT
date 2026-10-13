# The Signal Archive

The archive is a browser-local section after The Marked Ones. Its dataset is bundled with the website; visitors cannot modify or submit archive records. Filters run locally and do not send queries to another service.

## Demo content

The project owner requested placeholders until original callout posts are available. `src/features/signal-archive/data.ts` contains six fictional records by Moss Keeper, Quiet Rook, and Glass Caller. Their token names, timestamps, prices, and liquidity values are illustrative. The characters reuse the site's pixel portraits.

The archive notice, each card, and each dialog identify demo content. Demo records never show original-post or observation-source links, even if a URL is accidentally attached. They are separate from the five callers in the source rewards table.

## Record format

`SignalRecord` in `types.ts` stores:

| Field          | Meaning                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | A stable, unique record identifier.                                                                                                                |
| `provenance`   | `demo` for fiction; `source-linked` for a record supported by an original callout link. Source linkage does not establish claim accuracy.          |
| `caller`       | Stable caller ID, display name, and portrait index. Use confirmed attribution when sourcing a real callout.                                        |
| `token`        | Token name, symbol, and mint address. A symbol alone does not identify an asset. This version displays Solana records.                             |
| `publishedAt`  | Exact original publication timestamp in ISO 8601, including a timezone.                                                                            |
| `summary`      | An editorial summary of the original thesis. Avoid implying an endorsement or adding claims absent from the source.                                |
| `source`       | Original HTTPS post URL and the date it was checked, or `null`. Supported original-post links are X/Twitter status URLs and Pump.fun callout URLs. |
| `entry`        | Publication-time USD price baseline, its actual timestamp, and its evidence reference, or `null`. It is not a trade entry or fill.                 |
| `observations` | Available `1h` / `24h` USD price snapshots with actual timestamps, optional USD liquidity, and evidence URLs.                                      |
| `note`         | Record-specific context, missing data, revisions, and limitations.                                                                                 |

`null` means unavailable. Do not use zero for missing prices or liquidity. Observation sources must be HTTPS links without embedded credentials.

## Observation method

For sourced records, use the following manual curation policy consistently:

1. Identify the token by mint and retain the original publication timestamp. Keep the original source URL; do not substitute a leaderboard or a later retrospective post.
2. Use the first valid historical USD price quote at or after publication, within 60 seconds, as the baseline. For the `1h` and `24h` observations, apply the same rule at publication plus the relevant interval. Store each actual observation timestamp. If a suitable quote is unavailable, leave the baseline or interval absent.
3. Record the provider, pool or market, token mint, timestamp, and quote in the evidence reference. Use a consistent historical quote source and market for all three snapshots. Explain exceptions in the note. Attach available liquidity from that observation; leave it `null` if unavailable.
4. Preserve unfavorable observations. Never replace fixed intervals with an all-time high, a convenient candle, or the caller's self-reported return.

The interface displays raw observations. It does not calculate P&L, rank signal quality, or establish executable returns. Fees, slippage, available liquidity, and achievable fills are not modeled. No provider adapter enforces this policy automatically; a maintainer must check sourced records before committing them.

## Data statuses

- **Awaiting observations:** no later price observations are attached.
- **Incomplete data:** some observations exist, but the baseline or one of the two intervals is missing.
- **Observations recorded:** a baseline and both intervals exist. This describes completeness, not verification or profitability; liquidity and evidence may still be missing.

## Replacing examples

Edit `data.ts` to remove demo fixtures and add source-linked records. Confirm the caller, source post, mint, and publication time. Include only observations that can be sourced, preserving gaps. Keep stable IDs and do not reuse a demo's synthetic market values. The caller selector and demo notice derive from the dataset automatically. An empty dataset shows an explanatory empty state.

The original-post link appears only for source-linked records with an accepted original-post URL. Other reference links are shown in the observation timeline. Review the rendered record to confirm it points to the correct caller and token.

## Interaction and layout

- Token searches match symbol, name, and mint; a leading `$` is optional.
- Caller, token, status, and date filters combine. Dates use publication time in UTC, including the entire end date.
- Invalid or reversed date ranges display a connected error message. Reset restores all controls and newest-first order.
- Native dialogs support Escape, a close button, and backdrop dismissal, with initial heading focus. Method links open the explanatory disclosure.
- Filters and cards use one column on narrow screens and two columns from 640 px. The filter toolbar and method notes expand at 960 px. Dialog height is capped at 85dvh.
- Record entrance and dialog entrance use existing animations. Reduced-motion preferences remove these transitions.

Run `npm run check`, `npm test`, and `npm run build` after editing records or behavior. Browser layout and interaction checks are a separate step; see the dated archive verification note in `docs/verification.md`.
