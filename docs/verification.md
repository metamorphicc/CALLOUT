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
