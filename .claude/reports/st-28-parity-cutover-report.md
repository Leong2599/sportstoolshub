# Implementation Report — ST-28 Full-site parity verification and cutover

**Plan**: `docs/tickets/sportstools-migration.md` (ST-28)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

ST-28 ships a scripted full-site parity gate plus the cutover runbook. The new `scripts/parity-check.mjs`
verifies, over every one of the 259 legacy URLs in `src/data/legacy-urls.json` (258 targets), that
each alias answers 200 with the right canonical and meta refresh, every canonical route answers 200
with exactly one `h1`, a title and its expected canonical, the sitemap (676 URLs) lists every target
and no alias, `robots.txt` allows crawling and advertises the sitemap, `CNAME` is `sportstoolshub.com`,
RSS (214 items) and Atom feeds resolve, all 379 tag pages resolve with one `h1`, and no internal link
on any built page is broken. Content parity against the legacy checkout is asserted field by field;
differences pass only when they are recorded in the committed snapshot
`scripts/parity/content-baseline.json` (61 reviewed deltas: emoji-stripped headings, frontmatter copy
from the blog conversion, catalog/static-page titles) plus 221 pages whose titles only differ in the
trailing site template (documented in the report notes, not baseline). New, changed or stale deltas
fail the check, so the baseline cannot drift silently. Two run modes: `--dir=build` (filesystem,
authoritative for CI) and `--base-url=http://...` (real HTTP status codes against a served build,
including a 404 probe for unknown routes).

The blog index (`/blog`) had no `h1` — the stock Docusaurus list page renders none — so it was fixed
via a faithful `BlogListPage` swizzle (`src/theme/BlogListPage/index.tsx` + `BlogIndexHeader`),
`blogTitle: 'Sports Blog Series'`, and `about.mdx` frontmatter `title: About` (was "About Sports
Tools Hub", producing a duplicated brand). ST-26's "Search the blog" link survived the swizzle.

`ci.yml` now serves the build and runs `node scripts/parity-check.mjs --base-url=http://localhost:3100 --skip-content` (content parity is skipped on CI because the legacy checkout is not part of this
repository); `deploy-pages.yml` runs dir-mode parity for both preview (`--origin`/`--base-path`/`--preview`) and production lanes before uploading the artifact. `README.md` gained a Parity checks section; `docs/cutover-runbook.md` documents preview verification, the DNS/production switch, the instant rollback (unset `PAGES_DEPLOY_ENABLED` / revert DNS; the alias layer is the escape hatch) and sign-off gates. Spike 5 (visual parity) was exercised by screenshotting the legacy site and the rebuild at 1366×900 and 390×844 for home, BMI, one article and the blog index: content area identical, only nav/footer chrome differs — accepted.

## Tasks completed

- [x] `scripts/parity-check.mjs` (CREATE, ~1250 lines): legacy alias / destination / sitemap / robots /
  CNAME / feed / tag / internal-link / key-page / content-parity checks; dir and HTTP modes;
  `--update-baseline` snapshot management; JSON report to `.docusaurus/parity-report.json`; CLI
  (`--dir`, `--base-url`, `--origin`, `--base-path`, `--legacy`, `--baseline`, `--json`,
  `--source-dir`, `--update-baseline`, `--skip-content`, `--preview`, `--verbose`, `--help`).
- [x] `scripts/parity/content-baseline.json` (CREATE): 61 reviewed title/h1 deltas with categories
  (`emoji-stripped`, `blog-frontmatter`, `catalog-frontmatter`, `static-page-frontmatter`,
  `source-missing`), exact source/built values, plus a categories glossary.
- [x] Blog index `h1`: `src/theme/BlogListPage/index.tsx` (CREATE), `src/components/blog/BlogIndexHeader.tsx` + `BlogIndexHeader.module.css` (CREATE), `docusaurus.config.ts` `blogTitle: 'Sports Blog Series'`, `src/pages/about.mdx` title `About` (UPDATE).
- [x] `src/components/blog/BlogIndexHeader.test.tsx` (CREATE, 2 cases).
- [x] `src/test/parity-check.test.ts` (CREATE, 32 cases: text/HTML extraction, route normalization,
  sitemap/RSS/tag parsing, robots groups, title comparison, delta classification, baseline diffing,
  arg parsing).
- [x] `src/test/workflows.test.ts` (UPDATE): CI gate order incl. the parity step; deploy parity step
  for both lanes.
- [x] npm scripts `parity:check` / `parity:baseline` → `package.json` (UPDATE).
- [x] CI parity step (serve build on 3100, poll with curl, run check, upload report artifact) → `.github/workflows/ci.yml` (UPDATE).
- [x] Deploy-workflow parity step for preview and production lanes → `.github/workflows/deploy-pages.yml` (UPDATE).
- [x] `docs/cutover-runbook.md` (CREATE): preview verification, production switch, rollback via
  `legacy-urls.json`/DNS, sign-off table, maintenance.
- [x] README parity section (UPDATE).
- [x] Spike 5 visual parity evidence: 16 screenshots under `.docusaurus/visual-parity/` (gitignored,
  not committed): legacy vs rebuilt at desktop + mobile for home, BMI tool, one article, blog index.

## The parity contract in numbers

| Item | Count |
|------|-------|
| Legacy URLs in `legacy-urls.json` | 259 |
| Legacy alias pages emitted | 258 |
| Skipped alias entries | 1 (`/` → `/`, the home page itself) |
| Canonical targets | 258 |
| Sitemap URLs | 676 (0 aliases, 0 duplicates, all targets listed) |
| Tag pages (`/blog/tags/<slug>`) | 379 (14 sports + topic tags) |
| RSS items | 214 (Atom matches) |
| Internal links crawled | 674 across 936 pages |
| Content deltas in baseline | 61 |
| Titles differing only in site suffix (accepted, counted) | 221 |
| Pages skipped from content parity | 2 (`/`, `/tools/about.html` — no source file) |

## Verification

- **Clean checkout**: `npm ci` on a wiped `node_modules` exits 0.
- `npm run typecheck` - PASS
- `npm run test:run` - PASS (107 files, 579 tests; was 105 / 544 at ST-27)
- `LEGACY_ALIASES_STRICT=1 npm run build` - PASS (`emitted 258, missing 0, skipped 1, conflicts 0`)
- `npm run parity:check` (dir mode, full content parity) - PASS 10/10 checks, 0 failures
- `node scripts/parity-check.mjs --base-url=http://localhost:3100 --skip-content` (HTTP mode) -
  PASS 11/11 checks, 0 failures (256 aliases redirected by the server to their expected target; the 2
  entries whose clean-URL rewrite goes elsewhere (`/blog/blog.html`, `/tools/about.html`) are counted as
  clean-URL redirects — static hosts serve the alias file itself, which dir mode verifies).
- Preview lane: `BASE_URL=/sportstools/ SITE_URL=https://leong2599.github.io npm run build` +
  `--preview` parity - PASS 10/10 (CNAME deleted by design; production-domain sitemap pointer not
  asserted on preview).
- Drift detection: tampering one baseline value or dropping an entry both fail the check with an
  explicit message (verified with throwaway baselines).
- Visual parity: legacy vs rebuilt screenshots at both widths — content identical, chrome differs only.

## Deviations from the plan

- **The blog index `h1` was added, not baselined.** The plan treated the parity check as verification
  only, but `/blog` having zero `h1`s is a genuine structural regression (source had "Sports Blog
  Series"), cheap to fix and worth fixing: a faithful `BlogListPage` swizzle with a `BlogIndexHeader`
  component, plus `blogTitle: 'Sports Blog Series'` so the heading matches the legacy one exactly.
- **Baseline granularity.** The plan mentioned "parity fixtures/snapshots"; the snapshot is per
  (`path`, `field`) with exact source/built strings plus `siteSuffixTitles` counts for the 221
  systematic title-template differences. This is more automated than a docs table and still fully
  documented.
- **CI skips content parity.** The legacy checkout is read-only input outside this repository, so CI
  runs `--skip-content`; the local full run (and the runbook) cover source comparison.
- **`--preview` relaxes production-only checks** (CNAME deleted on preview; robots sitemap pointer
  points at the custom domain by design on the preview lane).
- **`docusaurus serve` rewrites `.html` URLs to clean URLs** (301), unlike a static host which serves
  the alias file. HTTP mode accepts a redirect to the expected target, logs clean-URL rewrites as
  notes, and dir mode remains the authoritative alias check — this is why CI's HTTP gate passes while
  dir mode is the contract.
- **About page title changed to `About`.** Frontmatter was "About Sports Tools Hub", which renders
  "About Sports Tools Hub | Sports Tools Hub" (duplicated brand); source is "About - Sports Tools Hub".
  `About | Sports Tools Hub` matches the source head exactly — a minor, intentional improvement.
- **Scope drift within budget.** The plan estimated ~800–1200 lines for the parity script; the
  implemented file is ~1250 lines because it includes the pure-function test surface (extraction,
  normalization, baseline diffing) so CI can unit-test it without a server.

## Follow-ups for the reviewer

- **One-time repository setup**: Settings → Pages → Source → **GitHub Actions**; custom domain
  configured there; `static/CNAME` remains the domain record.
- **Set `PAGES_DEPLOY_ENABLED` to `true`** after reviewing the parity evidence, then the first push to
  `main` publishes to `https://sportstoolshub.com`. Optionally add a required reviewer on the
  `github-pages` environment for manual approvals.
- **Post-cutover**: confirm Search Console/Bing coverage on the new domain; keep the legacy checkout
  available (read-only) so `PARITY_SOURCE_DIR` parity runs stay possible.
- **`pnpm-lock.yaml` is stale** relative to the dev dependency tree in `package-lock.json` (carried
  over from ST-27; deliberately not resolved here).
- The work is uncommitted on `feature/st-3-legacy-urls` together with ST-26 and ST-27. Run
  `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
