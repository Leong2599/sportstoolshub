# Implementation Report — ST-27 GitHub Pages workflow and preview environment

**Plan**: `docs/tickets/sportstools-migration.md` (ST-27)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Replaced "publish the repo" with a real CI → build → Pages pipeline. `ci.yml` installs with `npm ci`,
runs the typecheck, the suite and a production-shaped build with strict legacy-alias coverage, and
keeps `build/` as a 7-day artifact. `deploy-pages.yml` owns the Pages site and has two lanes: a
preview built at the GitHub Pages project path (`/sportstools/`) and a production build at the custom
domain, the latter gated on the `PAGES_DEPLOY_ENABLED` repository variable so `main` cannot go live
before the ST-28 cutover. `docusaurus.config.ts` now takes `BASE_URL`/`SITE_URL` from the environment
so one codebase produces both lanes.

The ticket's acceptance criterion "workflow succeeds on a clean checkout" uncovered a real blocker:
`package-lock.json` was missing every dev dependency, so `npm ci` failed outright. The lock file is
now complete and `npm ci` passes.

## Tasks completed

- [x] Env-driven `url`/`baseUrl` and base-URL-aware head tags → `docusaurus.config.ts` (UPDATE)
- [x] Validate workflow (npm ci, typecheck, tests, strict build, artifact) → `.github/workflows/ci.yml` (CREATE)
- [x] Pages workflow with preview and gated production lanes → `.github/workflows/deploy-pages.yml` (CREATE)
- [x] Run and deploy notes: preview procedure, cutover gate, Pages setup → `README.md` (UPDATE)
- [x] Node floor raised to what the tree actually needs → `package.json` (`engines`), `README.md` (UPDATE)
- [x] Complete the npm lock file so `npm ci` works → `package-lock.json` (UPDATE)
- [x] Workflow and config tests → `src/test/workflows.test.ts`, `src/test/site-config.test.ts` (CREATE/UPDATE)
- [x] Prove both lanes build: preview at the project path, production at the domain (VERIFY)

## The two lanes

| | preview | production |
|---|---|---|
| Trigger | manual dispatch (`mode: preview`, the default) | push to `main` when `vars.PAGES_DEPLOY_ENABLED == 'true'`, or manual dispatch (`mode: production`) |
| `BASE_URL` / `SITE_URL` | `/sportstools/` / `https://leong2599.github.io` | `/` / `https://sportstoolshub.com` |
| `build/CNAME` | removed, so the preview cannot claim the domain | ships |
| Guard | none needed | repo variable + typing `deploy` into the `confirmation` input + the `github-pages` environment |

The repository name is read from `github.event.repository.name` rather than hardcoded, because the
remote is `Leong2599/sportstoolshub.gi` while `docusaurus.config.ts` still says `projectName:
'sportstools'`. Reading it from the event keeps the preview path correct whichever name is right.

Both lanes build with `LEGACY_ALIASES_STRICT=1`, so a run fails if any legacy URL loses its target or
collides with a real route. Both then assert `build/.nojekyll` survived.

## Verification

- **Clean checkout**: `npm ci` on a wiped `node_modules` exits 0; `typecheck`, `test:run` and `build`
  all pass afterwards (details below).
- **Production lane**: `npm run build` with no env → `url` = `https://sportstoolshub.com`, `baseUrl` =
  `/`, 258 aliases emitted, `build/CNAME` and `build/.nojekyll` present.
- **Preview lane**: `BASE_URL=/sportstools/ SITE_URL=https://leong2599.github.io LEGACY_ALIASES_STRICT=1
  npm run build` → every asset URL carries `/sportstools/`, canonical is
  `https://leong2599.github.io/sportstools/`, the favicon head tags carry the prefix, and the legacy
  alias canonicals point at the preview URL.
- **Preview serves**: served `build/` under a `/sportstools` prefix the way Pages does. `/sportstools/`,
  `/sportstools/tools/bmi-calculator`, `/sportstools/blog`, `/sportstools/tools/bmi-calculator.html`,
  `/sportstools/search`, `/sportstools/about` all return 200; every referenced asset resolves; in a
  browser the page hydrates, the logo loads from `/sportstools/img/logo.png`, no chunk fails, and the
  hero search returns results ("pace" → 3 tools).
- **YAML**: both workflow files parse; `deploy-pages.yml` resolves to jobs `build` + `deploy`, the job
  guard `github.event_name == 'workflow_dispatch' || vars.PAGES_DEPLOY_ENABLED == 'true'`, and the
  `github-pages` environment with its `page_url`.
- **No secrets**: neither workflow references `secrets.`; they use `GITHUB_TOKEN` + the Pages OIDC
  token (`id-token: write`).

## Tests added

- `src/test/workflows.test.ts` - 10 cases: CI file exists and triggers on push/PR; `npm ci` →
  typecheck → test → build run in that order; strict aliases; Node 22 + npm cache keyed on
  `package-lock.json`; the build artifact is uploaded and nothing is deployed; Pages permissions and
  the `pages` concurrency group; build → configure → upload → deploy order and the `github-pages`
  environment; the cutover variable gates both entry points and production needs confirmation;
  preview builds at `/${repo}/` and drops `CNAME` while asserting `.nojekyll`; no `secrets.` anywhere.
- `src/test/site-config.test.ts` - 1 new case: with `BASE_URL`/`SITE_URL` set, the config reports the
  preview URL and every favicon head tag carries the prefix (the other six cases still assert the
  production defaults).

The suite is now 105 files / 544 tests (was 104 / 533).

## Validation results

- `npm ci` (after deleting `node_modules`) - PASS, exit 0
- `npm run typecheck` - PASS
- `npm run test:run` - PASS (105 files, 544 tests)
- `LEGACY_ALIASES_STRICT=1 npm run build` - PASS
  - `[legacy-aliases] emitted 258, missing 0, skipped 1, conflicts 0`
  - `build/CNAME` and `build/.nojekyll` present

## Deviations from the plan

- **CI runs Node 22, not 20.** Two things force it: the search-index test imports `src/data/tools.ts`
  from a script and needs native TypeScript stripping (Node 22.6+), and `jsdom@30` declares
  `^22.22.2 || ^24.15.0 || >=26`. `engines` and the README now say `>=22.22.2` instead of `>=20.0`.
  The workflow asks for `22.x`, i.e. the newest 22 release, which satisfies both.
- **Preview is the Pages project path, not a per-branch URL.** GitHub Pages allows one site per
  repository, so a per-branch preview would need a second host (out of scope: the architecture keeps
  GitHub Pages and rules out third parties). The preview lane is therefore a manual dispatch that
  builds with the project `baseUrl` and removes `CNAME`, plus a downloadable artifact on every CI run.
- **Production needs a repository variable, not just a branch.** `PAGES_DEPLOY_ENABLED` is unset until
  ST-28 performs the cutover. A push to `main` then skips the deploy job; a manual production run
  fails with an explicit message. Production also requires `confirmation: deploy`.
- **`package-lock.json` was incomplete and is now fixed.** `npm ci` refused to run: the lock had no
  dev dependencies at all (`@testing-library/*`, `vitest`, `jsdom`, `@vitejs/plugin-react`,
  `@types/react`, …). `npm install --package-lock-only` added 720 lines; `npm ci` then passed. Without
  this, every CI run would have failed at the install step. `package.json` dependency ranges are
  unchanged - only the lock gained the missing tree.
- **The deploy workflow does not re-run the test suite.** It typechecks and builds; CI is the test
  gate. This keeps a deploy of an already-green `main` short, and a manual preview deploy is harmless
  by construction (it cannot reach the custom domain).
- **`docusaurus serve` cannot verify a subpath build** (it serves the output at `/` regardless of
  `baseUrl`), so the preview was verified with a small static server that mounts `build/` at
  `/sportstools`, which is exactly what Pages does for a project site.

## Issues encountered

- The lock-file gap above. It surfaced only because ST-27 exercises `npm ci`; local development had
  been using an already-populated `node_modules`.
- `npm install --package-lock-only --dry-run` reports "up to date" even when `npm ci` disagrees, so
  the lock was verified with a real `npm ci`, not a dry run.
- `docusaurus serve` 404s every path except `/` for a base-URL build, which looks like a broken
  preview until you remember it does not mount the base URL.

## Follow-ups for the reviewer

- **One-time repository setup**: Settings → Pages → Source → **GitHub Actions**. The custom domain is
  also configured there; `static/CNAME` remains the record of it.
- **ST-28 flips the switch**: set the `PAGES_DEPLOY_ENABLED` repository variable to `true` after the
  parity check, then the first push to `main` publishes to the custom domain. Optionally add a
  required reviewer on the `github-pages` environment for a manual approval step.
- **`pnpm-lock.yaml` is stale and now demonstrably wrong** (it predates the dev dependency tree that
  `package-lock.json` just gained). CI trusts `package-lock.json`, so the pnpm files should either be
  regenerated or removed - a one-line decision for the reviewer, deliberately not taken here.
- **`projectName: 'sportstools'` and the remote `Leong2599/sportstoolshub.gi` disagree.** The
  workflows sidestep it by reading the repository name from the event, but the config field should be
  aligned once the repository name is confirmed.
- The work is uncommitted on `feature/st-3-legacy-urls` together with ST-26. Run `piv-commit`, then
  `piv-create-pr`, then `piv-review-pr`.
