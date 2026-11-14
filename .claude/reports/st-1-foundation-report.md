# Implementation Report — ST-1 Foundation, toolchain, and site configuration

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-1-foundation`   **Status**: COMPLETE

## Summary

Configured the Docusaurus scaffold for Sports Tools Hub and removed the template surface (tutorial docs,
sample blog posts, demo components, default images). Added the baseline toolchain for the migration:
Vitest with a smoke-tested site configuration, `lucide-react`, and `@fontsource/inter`. The shell now builds
light-only, fails on broken links, targets `https://sportstoolshub.com`, and has a placeholder home page.

## Tasks completed

- Site metadata, production URL, GitHub Pages org/project, `onBrokenLinks: 'throw'`, unset `trailingSlash` with rationale → `docusaurus.config.ts` (UPDATE)
- Light-only color mode (`defaultMode: 'light'`, switch disabled, pref ignored) → `docusaurus.config.ts`, `src/css/custom.css` (UPDATE)
- Disabled the template docs instance and removed its sidebar/content → `docusaurus.config.ts` (UPDATE), `sidebars.ts` (DELETE), `docs/intro.mdx`, `docs/tutorial-*` (DELETE)
- Removed template blog posts and sample authors/tags; kept the blog route ready → `blog/*` (DELETE), `blog/.gitkeep` (CREATE)
- Removed demo home component, markdown demo page, and default Docusaurus images → `src/components/HomepageFeatures/*`, `src/pages/markdown-page.mdx`, `src/pages/index.module.css`, `static/img/*` (DELETE)
- Added placeholder home preserving site title/tagline → `src/pages/index.tsx` (UPDATE)
- Replaced legacy green/dark Infima palette with brand blue tokens and Inter font stack → `src/css/custom.css` (UPDATE)
- Ported the legacy favicon so the build has a valid icon → `static/img/favicon.ico` (UPDATE)
- Added Vitest and test scripts; added site-config smoke test and UTC setup → `package.json`, `vitest.config.mts`, `src/test/setup.ts`, `src/test/site-config.test.ts` (CREATE/UPDATE)
- Added `lucide-react` and `@fontsource/inter` dependencies → `package.json`, `package-lock.json` (UPDATE)
- Rewrote project README with setup/validation commands → `README.md` (UPDATE)

## Tests added

- `src/test/site-config.test.ts` — 3 cases:
  - production URL and root base path
  - `onBrokenLinks === 'throw'`
  - light-only color mode configuration
- `src/test/setup.ts` — pins `TZ=UTC` for future parity/golden tests.
- Result: 3 passed / 3.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (1 file, 3 tests)
- `npm run build` — PASS (static output generated)
- Manual build checks:
  - only `/` and `/blog` routes emitted (no docs tutorial routes)
  - no template markers (`My Site`, `Docusaurus Tutorial`, `HomepageFeatures`, `undraw_*`, Google Fonts)
  - only `build/img/favicon.ico` emitted; no example images
  - no dark-mode toggle markup
  - sitemap contains only the two current canonical routes

## Deviations from the plan

- `vitest.config.ts` was renamed to `vitest.config.mts` to avoid Vite's CJS/ESM config-loader warning while
  keeping `package.json` free of `"type": "module"` (safer for Docusaurus config loading).
- The docs plugin is disabled entirely (`docs: false`) rather than keeping a docs instance with a disabled
  sidebar, because the target site has no docs surface.
- The plan artifact `docs/tickets/sportstools-migration.md` is retained; only the tutorial docs were removed.
- A legacy `favicon.ico` was copied into `static/img/` now so the build references a real brand icon. The full
  asset/favicon set remains ST-25 scope.
- Search plugin was not installed; adoption is deliberately deferred to ST-26.
- Added a minimal site-config smoke test so `npm run test:run` exercises the baseline instead of passing
  vacuously.

## Issues encountered

- `npm audit` reports 25 vulnerabilities in the existing dependency tree (15 critical). This is pre-existing
  transitive/tooling debt and was not addressed in ST-1; it should be triaged separately rather than via
  `audit fix --force`.
- Untracked `pnpm-lock.yaml` and `pnpm-workspace.yaml` appeared in the working directory during the session
  (not created by this task). They were left untouched; the plan's contract is npm (`npm ci`).
