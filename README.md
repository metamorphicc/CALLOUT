# The Callout Order

A community website for the Callout Order, built with React, TypeScript, Vite, and Motion. The visual direction follows the project's mint Twitter banner and 16-bit character art.

## Requirements

- Node.js 24.11.1 (see `.node-version`).
- npm. Dependency versions are recorded in `package-lock.json`.

## Local development

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

The development server runs at http://127.0.0.1:5173. Environment variables are optional until the project links and token contract are available. Do not overwrite an existing `.env.local` when restarting development.

## Validation and production build

```powershell
npm run check
npm test
npm run build
npm run preview
```

The build output is written to `dist/`. The preview server runs at http://127.0.0.1:4173.

## Project structure

- `src/config/project.ts`: project identity, public links, token information, and collection status.
- `src/features/sections.ts`: the seven section identifiers.
- `src/features/marked-ones/`: caller types, source metadata, and leaderboard snapshots.
- `src/features/signal-archive/`: signal records, demo fixtures, filters, observation dialogs, and archive styles.
- `src/styles/global.css` and `tokens.css`: layout styles and shared design tokens.
- `src/App.tsx`: the page entry point.
- `src/components/`: navigation, the pixel mark, avatars, and motion wrappers.
- `src/features/`: Hero, the rewards leaderboard, Signal Archive, Lore, token status, Genesis previews, and the nomination desk.
- `tests/nomination.test.mjs`: input validation and evidence-link tests using Node's test runner.
- `tests/signal-archive.test.mjs`: combined filtering, inclusive UTC dates, sorting, missing observations, and original-post link checks.
- `docs/signal-archive.md`: archive format, observation method, and replacing demo records with sourced callouts.
- `docs/artwork.md`: image generation prompt and asset provenance.
- `docs/verification.md`: validation results and known launch dependencies.

## Implemented experience

The site includes seven sections, five caller statistics dialogs, a mobile navigation menu, finite hero and scroll animations, and support for reduced-motion preferences. Fonts and the character atlas are hosted with the application. All website text and project documentation are in English.

The Signal Archive supports token search, caller and data-status filters, an inclusive UTC date range, sorting, filter reset, empty states, and individual observation dialogs. Six records demonstrate pending, incomplete, and recorded observations. They use fictional callers and tokens, synthetic dates and market values, visible Demo labels, and no original-post links. These fixtures were requested by the project owner; they do not describe the leaderboard callers. Replace them with sourced records using `docs/signal-archive.md`. No live feed, automatic ingestion, or return calculation is connected.

The nomination form validates the Twitter handle and up to five original callout links, then downloads a JSON draft to the visitor's device. It does not submit the nomination to a server. The form explicitly communicates that submissions are not open yet.

## Public configuration

Variables prefixed with `VITE_` are embedded in the browser bundle. Use them only for public links and addresses, never secrets or API keys. Leave unknown values empty. External links must use HTTPS. Unavailable token and community actions should display clear pending states.

The first five callers were transcribed from the image in [Alon's source post](https://x.com/a1lon9/status/2108618810420846647). This is a rewards leaderboard snapshot, not an independent audit of signal quality. Exact Twitter handles, the reward period, and the payout asset are unconfirmed. The source excludes callouts above $500 million from its last-100-callouts statistics. Order titles and illustrated avatars are creative elements of this project, separate from the source ranking.

Token supply, allocation, and contract address have not been provided. The Genesis Collection is Coming Soon. No wallet connection, token transactions, NFT mint, or ownership verification is implemented.

The HTML retains `noindex, nofollow` while the site is awaiting launch information. Set the official project links and contract values, add production canonical/share metadata, and review this directive before public launch.

## Git workflow

Each implementation milestone is committed locally. The project owner handles pushes to the remote repository. Do not push automatically.
