# Implementation Report — ST-3 Legacy URL inventory and alias layer

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Created the SEO contract for the migration and a build-time alias emitter. `src/data/legacy-urls.json`
maps 259 legacy paths to 258 clean routes. The `legacy-aliases` post-build plugin writes a physical
`<old-path>.html` with an instant meta refresh, the target page's canonical URL and title, and no
`noindex` (D2). The current build emits the one alias whose clean route already exists,
`/blog/blog.html` -> `/blog`; the other 257 targets are recorded as missing until their content tickets
land. Strict coverage checking is available for the cutover build.

## Tasks completed

- Added a reproducible inventory generator that unions sitemap paths with the filesystem inventory, sorts
  the result, and applies the D1 drops -> `scripts/generate-legacy-urls.mjs` (CREATE)
- Generated the 259-entry contract -> `src/data/legacy-urls.json` (CREATE)
- Added the alias emitter with safe route guards, missing/conflict detection, strict mode, title/canonical
  extraction, entity decoding, and HTML escaping -> `plugins/legacy-aliases/index.ts` (CREATE)
- Registered the plugin and added `resolveJsonModule` -> `docusaurus.config.ts`, `tsconfig.json` (UPDATE)
- Added the regeneration script -> `package.json` (UPDATE)
- Added contract tests for counts, mappings, exclusions, and target shapes -> `src/data/legacy-urls.test.ts` (CREATE)
- Added fixture tests for alias output, self-map skipping, missing targets, conflicts, strict mode, and
  parsing helpers -> `src/test/legacy-aliases.test.ts` (CREATE)
- Documented regeneration and strict-mode usage -> `README.md` (UPDATE)

## Contract reconciliation

- 259 legacy paths; 258 unique targets.
- Duplicate target: `/about.html` and `/tools/about.html` both map to `/about`.
- Home `/` is a self-map and is skipped so the built `index.html` is never overwritten.
- `/index.html` is intentionally not in the map; the home route already serves it.
- `/blog/blog.html` maps to `/blog`; `/about.html` maps to `/about`.
- 41 tool pages and 214 blog posts map to their clean route by removing `.html`.
- D1 drops (explicitly excluded in the generator): the sitemap-only missing
  `/blog/golf/golf-equipment-guide.html` plus the four dead blog cards
  (`basketball-shooting-mastery`, `basketball-defense-guide`, `soccer-warm-up-guide`,
  `soccer-cooling-down-guide`). The architecture's five dead-card list includes the golf guide.

## Tests added

- `src/data/legacy-urls.test.ts` — 9 cases:
  - 259 paths / 258 unique targets
  - home self-map
  - both about spellings and the blog index
  - 41 tool routes and 214 sport-post routes across 14 sports
  - D1 exclusions
  - `/index.html` absent
  - safe target and legacy path shapes
- `src/test/legacy-aliases.test.ts` — 9 cases:
  - aliases emitted for existing targets, self-map skipped
  - title, canonical, meta refresh, and no `noindex`
  - canonical fallback to the target route
  - entity preservation without double escaping
  - missing targets reported without writing in non-strict mode
  - strict missing-target failure
  - conflict reporting without overwriting an existing route
  - strict conflict failure
  - unquoted Docusaurus tag parsing and HTML escaping
- Result: 4 files, 28 tests passed (18 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (4 files, 28 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 1, missing 257, skipped 1, conflicts 0`
  - `build/blog/blog.html` exists; `build/blog/index.html` still exists
  - alias contains `<title>Blog | Sports Tools Hub</title>`,
    `canonical=https://sportstoolshub.com/blog`, and
    `http-equiv="refresh" content="0; url=https://sportstoolshub.com/blog"`
  - alias contains no `noindex`
  - `build/sitemap.xml` still contains only `/` and `/blog`; no alias paths
  - `.docusaurus/legacy-aliases-report.json` records 1 emitted, 257 missing, 1 skipped, 0 conflicts
- `LEGACY_ALIASES_STRICT=1 npm run build` — expected FAIL with
  `Legacy alias validation failed: 257 missing target(s), 0 conflict(s)` (strict wiring verified)

## Deviations from the plan

- **Strict validation defaults off.** The ticket says the build fails when a target route is missing.
  Only two routes exist at this stage, so enforcing that now would break every intermediate build until
  ST-15–ST-23 land. Missing targets are reported in the build log and in
  `.docusaurus/legacy-aliases-report.json`; `LEGACY_ALIASES_STRICT=1` throws with the full missing list.
  ST-28 should run the cutover build with strict mode enabled.
- The plugin is registered as `plugins/legacy-aliases/index.ts` through
  `path.resolve(process.cwd(), ...)`. Docusaurus could not resolve the directory shorthand
  (`./plugins/legacy-aliases`) in this config.
- `/tools/about.html` and `/about.html` both target the clean `/about` route rather than chaining
  `/tools/about.html` -> `/about.html`, so no alias points at another alias.
- Title and canonical extraction decodes HTML entities before re-escaping, preventing `&amp;amp;` in
  aliases whose target title contains an ampersand.
- `/index.html` is not emitted; the home page is already the route. This matches the ticket.

## Issues encountered

- Docusaurus 3.10 would not resolve a local plugin directory or a path without the file extension; the
  explicit `index.ts` path fixed startup.
- The strict build intentionally fails today because 257 clean routes do not exist yet. The normal build
  remains green.
- There is no lint script in the repo; validation is typecheck, Vitest, and build.
