# Implementation Report — ST-4 Tool catalog and icon mapping

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Added the single typed source of truth for all 41 tools in `src/data/tools.ts`, with categories, legacy
paths, component registry keys, and deliberate lucide icon names. Added `src/data/icons.ts` to map every
catalog icon name to a real tree-shaken lucide import, plus helpers for category sections, slug lookup,
related tools, and legacy targets. Tests lock the catalog to the ST-3 legacy contract and verify icon
imports, category coverage, unique keys, and clean copy.

## Tasks completed

- [x] Added the 41-entry typed catalog with category labels and ordered category sections → `src/data/tools.ts` (CREATE)
- [x] Added the lucide icon registry and `ToolIconName` type → `src/data/icons.ts` (CREATE)
- [x] Extracted card titles/descriptions from `index.html` and tool-page meta descriptions from `tools/*.html`
- [x] Replaced the source's corrupted emoji with one deliberate lucide icon per tool (41 unique imports)
- [x] Encoded the footer duplication fix as data: `TOOL_CATEGORY_LABELS` and `toolCategorySections` expose one
      uniquely labelled section per category, including a single "Performance Trackers" heading
- [x] Added catalog tests for counts, uniqueness, ST-3 agreement, icon imports, copy, and helpers → `src/data/tools.test.ts` (CREATE)
- [x] Documented the catalog, icon registry, helpers, and no-hand-maintained-card-lists rule → `README.md` (UPDATE)

## Catalog shape

- 41 tools: 6 `fitness`, 22 `performance`, 13 `nutrition`.
- Every entry has `slug`, `title`, `description`, `seoDescription`, `category`, `legacyPath`, `icon`, and
  `component`.
- `description` is the short card/search copy from the home cards; `seoDescription` preserves the longer
  tool-page meta description for MDX frontmatter.
- `legacyPath` always matches `/tools/<slug>.html` and the ST-3 contract maps it to `/tools/<slug>`.
- `component` is a descriptive registry key (`BmiCalculator`, `Vo2MaxCalculator`, `TDEECalculator`,
  `MealTimingPlanner`, etc.).
- Helpers: `getToolBySlug`, `getToolsByCategory`, `getRelatedTools`, `getToolRoute`, `getToolByLegacyPath`,
  and `getLegacyTarget`.

## Tests added

- `src/data/tools.test.ts` — 7 cases:
  - 41 tools with unique slugs, legacy paths, and component keys
  - category partition with 6/22/13 counts and source order
  - one labelled section per category for shared home/footer rendering
  - every tool legacy path agrees with `legacy-urls.json`
  - every icon name is a real lucide import and the registry contains no unused icons
  - unique, trimmed, non-empty copy with no source emoji
  - slug lookup, related-tool grouping, route resolution, and legacy-path lookup
- Result: 5 files, 35 tests passed (7 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (5 files, 35 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 1, missing 257, skipped 1, conflicts 0`
  - route set is unchanged (catalog is data-only; tool pages arrive in later tickets)

## Deviations from the plan

- Added `seoDescription` alongside the required `description`. The card copy is the right length for home
  cards and search; the longer tool-page meta copy is preserved for the MDX frontmatter that later tickets
  will generate.
- Used the clean home-card titles rather than the tool-page `<h1>` for the 19 tools whose H1s contain emoji
  or decorative prefixes (for example `🏀 Basketball Vertical Jump Analyzer`). The lucide mapping replaces
  the corrupted emoji, as required.
- Component keys are descriptive PascalCase names rather than a mechanical transform of the slug
  (`MealTimingPlanner`, `TDEECalculator`, `BMRCalculator`, `Vo2MaxCalculator`).
- The actual footer/navbar markup is not rebuilt in this ticket. The duplication fix is recorded structurally
  through `TOOL_CATEGORY_LABELS` and `toolCategorySections`; the theme ticket consumes those sections.
- ST-4 was executed on the existing `feature/st-3-legacy-urls` branch because ST-3 was still uncommitted when
  work began and ST-4's contract test depends on it. ST-3 is now committed as `5c1b329`; cut or stack the
  ST-4 branch before opening the PR if strict one-ticket-per-branch hygiene is required.

## Issues encountered

- 19 of 41 tool-page H1s differ from the home-card titles, and 41 descriptions differ from the page meta
  descriptions. The catalog uses card copy for `description` and page meta copy for `seoDescription`, so
  neither source is lost.
- There is no lint script in the repo; validation is typecheck, Vitest, and build.
- The build still emits only `/` and `/blog`; the catalog is intentionally data-only and does not add routes.
