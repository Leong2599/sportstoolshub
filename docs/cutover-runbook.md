# Cutover runbook — Sports Tools Hub (ST-28)

The rebuild is a drop-in replacement for the legacy static site at
`C:\Users\user\Documents\Production\sport_tools`. Every legacy URL keeps
working through `.html` alias pages that canonicalize to the clean new route,
so the cutover is reversible: flipping DNS back to the legacy host immediately
restores the old site, and the aliases keep sending search engines to the new
pages once we flip forward again.

This document covers:

1. Pre-cutover verification (preview deploy → production parity)
2. The DNS / production switch
3. Rollback
4. Sign-off

## Prerequisites

- The legacy checkout is available read-only at
  `C:\Users\user\Documents\Production\sport_tools` (`PARITY_SOURCE_DIR`).
- `PAGES_DEPLOY_ENABLED` repository variable is unset until the production
  switch is authorized (the deploy workflow gates production behind it).
- `main` is clean and the latest `main` CI run is green (typecheck, tests,
  strict build, parity check against `localhost:3100`).

## 1. Pre-cutover verification

### 1.1 Preview deploy

1. Open the **Deploy to GitHub Pages** workflow, run it manually with
   `mode: preview`.
2. Confirm the preview URL, `https://<owner>.github.io/sportstools/`.
3. The job runs `npm run parity-check.mjs --dir=build --origin=<preview origin>
   --base-path=/sportstools/ --skip-content --preview`; it must be green
   (10 checks, 0 failures). It verifies every legacy URL alias, all 258
   canonical routes, the sitemap (676 URLs, no aliases), feeds, tag pages,
   internal links, CNAME deletion, and the robots allow policy.
4. Manually spot check `https://<owner>.github.io/sportstools/tools/bmi-calculator.html`
   (alias loads, redirects logically to `/sportstools/tools/bmi-calculator`)
   and `https://<owner>.github.io/sportstools/404` (branded 404 page).

### 1.2 Full parity run from the legacy checkout

From a machine with the legacy checkout:

```bash
PARITY_SOURCE_DIR="C:\Users\user\Documents\Production\sport_tools" \
  npm run parity:baseline   # only after an intentional content change
PARITY_SOURCE_DIR="C:\Users\user\Documents\Production\sport_tools" \
  npm run parity:check      # dir mode: 10/10 checks, 0 failures
```

`parity:check` verifies:

- all 258 legacy `.html` aliases answer with the right canonical + meta refresh
- all 258 targets answer 200 with exactly one `h1`, a title and the expected canonical
- sitemap lists every canonical route, zero aliases, no duplicates
- `robots.txt`, `CNAME`, RSS (214 items) and Atom, 379 tag pages
- no broken internal link across all 936 built pages
- titles/headings match the legacy source except for the 61 reviewed deltas in
  `scripts/parity/content-baseline.json` (emoji, frontmatter copy edits, and
  the site-wide title template)

Any new delta, changed baseline value, or stale baseline entry fails the check.

## 2. Production switch (cutover)

When the preview is green and the product owner signs off:

1. Set the repository variable `PAGES_DEPLOY_ENABLED` to `true`.
2. Push (or merge) to `main`. The deploy workflow builds at
   `https://sportstoolshub.com` (baseUrl `/`) and deploys to GitHub Pages.
3. Confirm `PAGES_DEPLOY_ENABLED == 'true'` is what let the production job run
   (the workflow refuses production otherwise).
4. After deploy, verify on the live domain:
   - `https://sportstoolshub.com/` loads, branded 404 at `/this-route-does-not-exist`
   - `https://sportstoolshub.com/tools/bmi-calculator.html` → alias, canonical
     `https://sportstoolshub.com/tools/bmi-calculator`
   - `https://sportstoolshub.com/sitemap.xml` and `/robots.txt` advertise the live sitemap
   - `https://sportstoolshub.com/CNAME` contains `sportstoolshub.com`
   - RSS at `/blog/rss.xml` has 214 items
5. Run CI once more against `main` — the CI parity step starts a local server
   and checks real HTTP status codes against the build.

### Sign-off

| Gate | Owner | Evidence | Status |
|------|-------|----------|--------|
| Preview deploy green (parity check) | Engineering | Workflow run URL | |
| Live parity check green (`localhost` + live domain) | Engineering | `.docusaurus/parity-report.json` | |
| DNS pointing at GitHub Pages custom domain | Product | CNAME / dig output | |
| Search Console coverage check scheduled post-cutover | Product | property link | |
| Cutover approved | Product owner | name / date | |

Sign-off is recorded in the cutover issue (ST-28) and linked from this document.

## 3. Rollback

Rollback is instant and needs no redeploy:

1. Unset `PAGES_DEPLOY_ENABLED` (or revert the DNS change at your registrar /
   Cloudflare to point back at the legacy host).
2. GitHub Pages immediately serves the previous deployment; the custom domain
   stops resolving to the rebuild.
3. If the DNS switch itself is the problem, change the CNAME record back to the
   legacy host's value and wait for TTL expiry.

The alias layer (`legacy-urls.json`, 258 entries) means search engines keep
finding content under both the legacy `.html` paths and the clean routes during
either direction of the switch. If a host with real redirects is needed later,
`legacy-urls.json` is the complete redirect table (source → target).

Do not roll back by editing `legacy-urls.json` — that file is the parity
contract, tested on every build.

## 4. Maintenance

- Any intentional title/heading change: run `npm run parity:baseline`, review
  the diff, commit `scripts/parity/content-baseline.json`.
- Any new tool or article: add it to `legacy-urls.json` (see
  `scripts/generate-legacy-urls.mjs`) so the alias layer and parity gate stay
  complete.
- `npm run parity:check` (dir mode, skips content without `--source-dir`) runs
  in CI on every push and in the deploy workflow for both preview and
  production lanes.
