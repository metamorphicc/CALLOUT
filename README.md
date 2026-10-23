# The Callout Order

A multi-page research directory for Callout Rewards, caller profiles and original signal sources. The interface pairs a mint workspace with the Order's pixel identity.

## Features

- Research overview with source-based reward totals and distribution.
- Searchable caller directory, sorting and comparisons of up to three callers.
- Individual caller profiles and original-source signal pages.
- Signal search by symbol, name, mint, caller and date added.
- Personal reading list stored in the visitor's browser, synchronized across tabs.
- A community review form that validates evidence and prepares a public GitHub issue for the visitor to review and submit.
- Source methodology, contextual attribution and explicit handling of unknown data.
- Responsive navigation, keyboard focus handling and reduced-motion support.
- Pre-rendered HTML for all 15 public routes, with client-side navigation.

## Stack

React 19, TypeScript, React Router, Vite, CSS custom properties, ESLint, Prettier, and Node's test runner. Fonts and illustrations are served locally. Production is a static deployment; no database or private credentials are required.

## Requirements

Node.js 24.11.1 (see `.node-version`) and npm. Exact dependency versions are in `package-lock.json`.

## Development

```powershell
npm ci
npm run dev -- --port 5187
```

Open http://127.0.0.1:5187. Vite requires the requested port to be free. Optional public project links can be set in `.env.local` using `.env.example`; preserve an existing local environment file.

## Validation

```powershell
npm run check
npm test
npm run build
npm run preview
```

The build generates `dist/`, including one HTML document per public route. `scripts/prerender.mjs` renders the actual React pages and rejects unpublished interface labels. The preview server uses http://127.0.0.1:4173.

## Routes

| Route                    | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `/`                      | Research overview                         |
| `/callers`               | Caller directory and comparison selection |
| `/callers/:id`           | Caller profile                            |
| `/compare?callers=id,id` | Shareable source comparison               |
| `/signals`               | Original-source archive                   |
| `/signals/:id`           | Signal evidence record                    |
| `/saved`                 | Browser-local reading list                |
| `/about`                 | Project identity and artwork              |
| `/community`             | Contributions and corrections             |
| `/methodology`           | Source definitions and limits             |

Search and filter state is stored in the page URL. Reading-list state uses the `callout.saved.v1` localStorage key; unsupported or blocked browser storage produces an explicit error instead of a false success.

## Data and sources

`src/features/marked-ones/data.ts` contains five rows transcribed from [Alon's source post](https://x.com/a1lon9/status/2108618810420846647). It is a historical rewards snapshot; the reporting period and payout asset are unspecified. Source gain statistics exclude callouts above $500 million and are not independently reproduced returns.

`src/lib/catalog.ts` contains the original-source signal directory. Each entry identifies a caller, token mint, original Pump.fun URL and indexing date. Exact publication times and historical market observations are not inferred. See `docs/signal-archive.md` before adding records.

The site is an independent community project. Listed names and illustrations do not imply affiliation or endorsement. Unconfigured social channels, token actions, and collection transactions are not rendered. An actual public contract is required before a token contract panel can appear.

## Contributions

The community form prepares a GitHub issue with a caller handle and original evidence links. Preparing a review does not submit it. The visitor reviews the prefilled issue, signs in to GitHub if necessary, and publishes it there. GitHub issues are public; there is no separate submission server or automatic public listing.

## Static hosting

Deploy `dist/` to a static host. Serve generated route directories as index documents and apply an SPA fallback for unknown paths. `public/_redirects` supplies the fallback for hosts that support that format. Configure equivalent rules on other hosts; do not redirect asset requests to an HTML document. Use HTTPS and the final domain's canonical/share configuration when connecting a public domain.

## Public configuration

`VITE_*` values are embedded in browser JavaScript and are exclusively for public URLs and token addresses. Never put API keys or secrets in them. The local app works without environment variables.

## Project structure

- `src/App.tsx`: route definitions, workspace shell and error boundary.
- `src/pages/`: public page implementations.
- `src/components/WorkspaceUI.tsx`: shared research tables, cards and controls.
- `src/components/SavedProvider.tsx`: persistent browser reading list.
- `src/lib/catalog.ts`: signal sources, selectors, formatting and contribution URLs.
- `src/styles/workspace.css` and `tokens.css`: interface styles and brand tokens.
- `scripts/prerender.mjs`: production HTML generation.
- `tests/`: source integrity, filtering, persistence input and evidence validation.
- `docs/verification.md`: dated verification report.

## Git workflow

Commit implementation milestones locally. The project owner pushes to the remote repository. Never push automatically.
