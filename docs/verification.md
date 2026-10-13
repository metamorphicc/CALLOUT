# Verification — October 12, 2026

## Automated checks

- TypeScript type checking, ESLint, Prettier, and the production build pass.
- Five Node test-runner tests cover valid nominations, normalization, duplicate receipts, missing evidence, invalid handles, insecure links, lookalike domains, credentials, and the five-post limit.
- No Cyrillic text remains in the website source or README.
- Git whitespace validation passes.

## Browser review

Reviewed in the Codex in-app browser at CSS widths of 320, 375, 414, 768, 1280, 1440, and 1920 pixels. No horizontal page overflow or overflowing content was detected. The hero's primary action and main illustration fit the 1280 × 800 laptop viewport.

- All five caller dialogs display the correct caller and source reward amount.
- Dialogs open at their top with visible initial focus. Escape and the close button dismiss them; focus returns to the originating card.
- The mobile navigation opens, closes with Escape, returns focus to its toggle, and closes after an anchor selection.
- Nomination validation focuses the invalid field and sets `aria-invalid`. A valid test draft was downloaded and its JSON content was checked on disk.
- Unavailable token actions are disabled. Unknown community URLs are shown as pending channels.
- Hero, leaderboard, Lore, token panel, Genesis art, nomination form, and footer were inspected visually.
- No browser error or warning logs were recorded during the final review.

When Motion was first introduced during development, a transient React hook error appeared during dependency re-optimization. The final Vite configuration explicitly prebundles Motion and deduplicates React. A forced dependency re-optimization, fresh browser reload, and caller-dialog interaction were subsequently checked without console errors.

Viewport screenshots are stored locally under `artifacts/qa/` and are excluded from Git. Full-page capture was unavailable in the browser; individual viewport captures were used.

## Contrast

WCAG contrast calculated from the OKLCH tokens:

| Pair                    | Ratio   |
| ----------------------- | ------- |
| Primary text / paper    | 17.92:1 |
| Secondary text / mint   | 6.46:1  |
| Accent text / paper     | 6.87:1  |
| Button text / accent    | 6.87:1  |
| Focus ring / background | 8.46:1  |
| Control border / paper  | 3.79:1  |
| Error text / paper      | 8.57:1  |

## Launch dependencies and verification limits

- Official Twitter, Telegram, Pump.fun, trade/chart URLs, the token contract, supply, and allocation are awaiting project-owner input.
- The contract-copy branch is implemented and type-checked; browser testing requires a supplied contract address.
- Nomination submission requires an actual destination or backend. Current behavior only saves a draft locally.
- The source leaderboard is a transcription, not an on-chain audit. Exact handles and reward periods are unconfirmed; source caveats remain available in the caller dialogs.
- Pixel avatars and Order titles are fictional project artwork and lore. NFT mint and ownership verification are outside this release.
- Reduced-motion fallbacks exist in both CSS and Motion. Media preference emulation was not available during this browser pass.
- No site deployment or Git push was performed.

## Signal Archive update — October 14, 2026

The browser review above predates the Signal Archive and does not verify the new section.

### Automated verification

- TypeScript, ESLint, Prettier, and the production build pass for the added archive.
- The Node suite now includes 11 tests. Archive coverage checks combined filters, UTC end-date boundaries, invalid dates, both sort orders without input mutation, missing observations, and original-post URL handling.
- The local preview and archive module return HTTP 200.
- Server-rendered markup checks pass for all six demo cards and detail records, archive navigation, visible demo notices, and original-post link handling. Demo records omit original-post actions; a source-linked test record renders the expected link with `noopener noreferrer`. These checks do not exercise a browser or confirm layout and focus behavior.
- The archive uses existing color and font tokens, native labeled controls, native dialogs, visible error messages, and reduced-motion fallbacks. These are source-level checks.

### Browser verification limit

The browser tool rejected binding the existing local preview tab under its URL security policy. No alternate browser path was used. Archive viewport screenshots, visual overflow checks, rendered contrast, live filter interactions, dialog dismissal/focus restoration, and reduced-motion emulation remain unverified in a browser.

The CSS uses single-column mobile layouts, constrained inputs, `minmax(0, 1fr)` grid tracks, and capped dialog dimensions. These declarations are not a substitute for a visual check. Review 320, 375, 414, 768, 960, 1280, and 1920 px before launch, including the expanded method, empty results, and a dialog with incomplete observations.

### Content status

Six owner-requested demo records contain fictional callers, tokens, dates, and market values. They are visibly labeled and have no real original-post links. Sourced signals, a live data feed, and automated observation collection are not supplied. Replacement instructions and the manual observation method are in `docs/signal-archive.md`.

The archive was committed locally. No deployment or Git push was performed.
