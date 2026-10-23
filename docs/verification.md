# Release verification — October 23, 2026

## Scope

Version 1.0.0 replaces the single-page presentation with a routed research workspace. The public interface uses five sourced caller rows and two original-source callout records. Unavailable token and social actions are omitted.

## Automated checks

- TypeScript, ESLint and Prettier pass.
- Sixteen Node tests cover source references, caller sort/filter behavior, saved-item restoration, contribution URLs, X/Twitter and Pump.fun evidence validation and observation-filter utilities.
- The production build generates 15 public HTML documents, including all five caller profiles and both signal pages.
- The pre-render step rejects unpublished interface labels in route markup.
- Git whitespace checks pass.

## Browser checks

The current in-app browser was used for the new interface. The earlier tab-binding failure did not recur when selecting the current tab by URL.

- Overview, caller directory, signal archive, the longest caller profile and community form were checked at 320, 375, 414, 768, 960, 1280 and 1920 CSS pixels: 35 route/viewport combinations.
- No horizontal document overflow or overflowing main-content elements were found in those combinations.
- Desktop overview, mobile comparison and narrow layouts were visually inspected.
- Caller search returned Dior with the correct source values. Sorting by median moved cupsey first.
- Saving Dior persisted after navigation and reload. Removing that test save cleared the reading list.
- Selecting chairman and cupsey produced the correct side-by-side source comparison and preserved selection in the URL.
- Signal search accepts `$tiktok` and displays the matching original-source record.
- The community form rejects an empty handle and prepares an encoded GitHub review URL for valid evidence. No issue was published during testing.
- Mobile navigation opens and closes, including Escape with focus returned to its toggle.
- A direct profile URL in the production preview renders the correct source values. Saving and restoring a profile works against the built bundle, with no production console warnings or errors.
- A fresh development reload after dependency optimization produces no new console warnings or errors. React Router is explicitly prebundled with React to avoid transient mismatched runtimes while dependencies are optimized.

## Content and infrastructure boundaries

Rewards are a source snapshot, not a live feed or audited return. Original publication timestamps and historical market prices remain unknown where not independently sourced. The interface preserves these distinctions and uses indexing dates explicitly.

Saved records are local to the browser. Contributions are reviewed through public GitHub issues; no private inbox or database submission endpoint is claimed. Public project links and financial actions require actual configuration before appearing.

Reduced-motion support is provided by the shared CSS media query. No account, wallet transaction, NFT mint, token deployment, public site deployment or Git push was performed.
