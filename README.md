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
npm run build
npm run preview
```

The build output is written to `dist/`. The preview server runs at http://127.0.0.1:4173.

## Project structure

- `src/config/project.ts`: project identity, public links, token information, and collection status.
- `src/features/sections.ts`: the six section identifiers.
- `src/features/marked-ones/`: caller types, source metadata, and leaderboard snapshots.
- `src/styles/global.css` and `tokens.css`: layout styles and shared design tokens.
- `src/App.tsx`: the page entry point.

## Public configuration

Variables prefixed with `VITE_` are embedded in the browser bundle. Use them only for public links and addresses, never secrets or API keys. Leave unknown values empty. External links must use HTTPS. Unavailable token and community actions should display clear pending states.

The first five callers were transcribed from the image in [Alon's source post](https://x.com/a1lon9/status/2108618810420846647). This is a rewards leaderboard snapshot, not an independent audit of signal quality. Exact Twitter handles, the reward period, and the payout asset are unconfirmed. The source excludes callouts above $500 million from its last-100-callouts statistics. Order titles and illustrated avatars are creative elements of this project, separate from the source ranking.

Token supply, allocation, and contract address have not been provided. The Genesis Collection is Coming Soon. No wallet connection, token transactions, NFT mint, or ownership verification is implemented.

## Git workflow

Each implementation milestone is committed locally. The project owner handles pushes to the remote repository. Do not push automatically.
