# CALLOUT release verification

Verified on October 23, 2026 against the production build served at `http://127.0.0.1:5189`.

## Deployment finding

The public deployment at `https://callout-xi.vercel.app` was inspected in the browser. It serves the earlier one-page site with a fictional archive and launch-status panels. The remote main branch resolved to `c49b8bb314d6c0d8e246e07a2861c00cd916c8ce`; the newer research workspace commits were still local. Updating that public deployment requires the owner's push and a new Vercel deployment. No push or publication was performed by the agent.

## Product checks

- Dashboard: recorded reward totals, distribution, caller directory, source-linked signals and an actionable personal shortlist.
- Caller directory: case-insensitive handle/name search, URL-persisted search after reload, follower sorting and two-caller selection.
- Comparison: opens with two populated columns; adding a third caller, changing the third selection and removing it returns to two columns. Comparison state is preserved in the URL.
- CSV: both comparison and shortlist downloads were completed through browser controls and the downloaded files were read. Caller values, token mints and original-source URLs match the records. The comparison export includes the historical snapshot date and gain sample definition.
- Copy controls: link and mint actions resolved with the browser Clipboard API and displayed their copied status. The embedded browser's separate host-clipboard reader returned an empty value, so a host clipboard read-back was not used as confirmation. A selectable manual-copy field is implemented for Clipboard API failures.
- Reading list: a caller and a signal were saved, appeared in another already-open tab, and remained after reload. Both test entries were removed afterward, restoring the initial empty list.
- Signal archive: token search and caller filters combine correctly. Native date keyboard changes apply to the URL; a reversed range shows an error, and clearing filters restores both records.
- Community: empty input triggers field validation. A valid handle and original Pump.fun source prepare the expected GitHub issue URL. The issue was not submitted. A contextual caller link names the intended record while leaving unverified X handles for the contributor to enter.
- Mobile navigation: open, Escape-to-close and returned focus were checked at 320 px.
- Browser production console: no warnings or errors during the route and functional checks.

## Layout and artifacts

- 15 routes checked at 320, 375, 414, 768 and 1440 CSS pixels: 75 cases, no document overflow, no visible horizontal overhang, one main heading per page and no unfinished-publication labels.
- Overview screenshots visually reviewed at the four mobile/tablet widths. Desktop dashboard and comparison screenshots reviewed separately. Temporary viewport overrides were reset.
- Each generated route has a unique title, description and canonical URL. All referenced local JS and CSS assets resolve. Sitemap contains all 15 public routes; the 1200 × 630 share image exists and was visually reviewed.
- Vercel configuration pins the framework, build command and output directory. Its fallback matches application paths and excludes missing asset paths with file extensions.
- The build rejects Demo, Coming Soon, Concept Art, fictional-example and inactive-launch labels in rendered public pages. It also requires the workspace shell and navigation on every route.
- Color-token contrast ratios: ink/paper 17.92:1; muted/paper 7.78:1; accent/surface 6.16:1; control border/paper 3.79:1.
- Visual system: shared mint tokens, Space Grotesk interface typography and Tiny5 wordmark. No page-sized promotional hero or inactive purchase panels. Page entrances and reward bars respect reduced-motion preferences.

Code checks: TypeScript, ESLint, Prettier, 18 tests and production build. Generated evidence is in ignored `artifacts/qa/launch/`: responsive checks, artifact checks, contrast checks, desktop/mobile overview screenshots and the comparison screenshot. The generated `/release.json` records the exact commit used by each build.
