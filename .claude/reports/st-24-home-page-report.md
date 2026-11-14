# Implementation Report — ST-24 Home page (hero, search UI, catalog grid)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-24)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Rebuilt `/` as a React page: a hero with the source headline, subtitle and search field, followed by
the tool grid grouped by category from the catalog. All 41 tools render once, in the right category,
with a lucide icon, the catalog title and description, and a link to `/tools/<slug>`. The source's
mojibake emoji are gone. The search field filters the grid on the page as you type; ST-26 replaces
that with the site-wide index over tools and blog.

The anchor ids the navbar dropdown points at (`#tools`, `#fitness-calculators`,
`#performance-trackers`, `#nutrition-tools`) are kept, so the ST-23 chrome still lands on the right
section.

## Tasks completed

- [x] Extract the source hero, category sections, 41 cards and their styles (READ)
- [x] Port the per-tool card call to action into the catalog -> `src/data/tools.ts` (UPDATE)
- [x] Build the home components -> `src/components/home/*` (CREATE)
- [x] Rebuild the home page -> `src/pages/index.tsx`, `src/pages/index.module.css` (UPDATE/CREATE)
- [x] Make the Docusaurus theme components testable -> `vitest.config.mts`, `src/test/docusaurus-stubs/*` (UPDATE/CREATE)
- [x] Tests for the components, the search and the new catalog field (CREATE/UPDATE)
- [x] Build, serve and check desktop and mobile in a real browser (VERIFY)

## The catalog gained a `linkLabel`

Each source card ended with its own call to action ("Use Calculator", "Calculate 1RM", "Take Quiz",
"Plan Fasting", ...). That text was the one piece of card data the catalog did not hold, so the card
would have needed 41 hand-maintained strings in the component.

The labels were extracted from the source with a script that matched every card title against the
catalog title **in order** and refused to patch on a single mismatch, then written into
`src/data/tools.ts` as `linkLabel`. The card now renders `tool.linkLabel` and nothing else.

## The home page

`src/pages/index.tsx` is the composition root: it owns the query state, derives the visible sections
and renders the hero and the grid.

```
src/components/home/
  HomeHero.tsx / .module.css   hero, subtitle, search field, "Explore Tools"
  ToolGrid.tsx  / .module.css   the tools section, the category headings, the card grids
  ToolCard.tsx  / .module.css   icon, title, description, call to action
  toolSearch.ts                 the pure filter
  index.ts                      barrel
```

The filter is a separate pure module so it can be tested without a DOM: `filterToolSections()`
keeps the tools whose title or description contains the query and drops the categories that end up
empty, `countTools()` counts what is left.

### Source parity

| Source | Rebuild |
|---|---|
| `<h1>Comprehensive Sports Tools & Resources</h1>` | same text, same position |
| hero subtitle | same text |
| search field with the magnifier button | same placeholder, same position, lucide `Search` icon |
| "Explore Tools" button | same label, links to `#tools` |
| `<h2>Sports Tools by Category</h2>` | same text |
| `<h3>` per category with an emoji | same headings, lucide icons on the cards instead |
| 41 cards: icon, `<h4>`, `<p>`, call to action | same structure and copy |
| 4-column card grid, `minmax(220px, 1fr)` | same grid |
| dark hero with a 40% overlay over a photo | dark hero with the gradient the tool pages already use |

The source hero background image is `images/hero-1.jpg`, which is still an open question (D8) and
belongs to ST-25's asset work. The hero uses the same gradient the tool pages use until the image is
decided, so the page is not left with a broken asset.

## The search is a stub, but an honest one

The ticket allows a stub because ST-26 wires the real search. Shipping a dead input would be a lie
to the visitor, so the field filters the catalog that is already on the page: typing "pace" narrows
the grid to the three matching tools and reports "3 of 41 tools match "pace"".

This is **not** the site-wide search: it matches tool titles and descriptions only, never the blog.
ST-26 replaces the source of the matches with the build-time index; the filtering helper is
already isolated from the hero and the grid so that swap is one file.

## Verification

- **All 41 tools appear once, in the correct category.** Asserted in `ToolGrid.test.tsx` and
  confirmed in the built HTML: 41 card links, 41 distinct targets, 6 / 22 / 13 per category.
- **Links resolve.** Every card points at `/tools/<slug>`; `tools.test.ts` now asserts that
  `src/pages/tools/<slug>.mdx` exists for all 41.
- **Icons.** Each card renders the lucide icon the catalog maps to the tool (41 lucide SVGs plus
  the search icon in the built page).
- **Anchors.** `tools`, `fitness-calculators`, `performance-trackers`, `nutrition-tools` and
  `hero-title` each exist exactly once on the home page; no duplicate ids.
- **Internal links**: 681 distinct targets across the build, **0 broken**. The four `/#...` targets
  resolve as ids on `/`.
- **Build**: no broken-link and no broken-anchor warnings.
- **Legacy aliases**: unchanged at 258 emitted, 0 missing.
- **Browser (1280x900 and 390x844)**: hero, search, grid and footer render as designed; the search
  filters live; no console errors.
- **Title**: the page renders as "Complete Sports & Fitness Resource Directory | Sports Tools Hub";
  the meta description is the source's.

## Tests added

- `src/components/home/ToolCard.test.tsx` - 3 cases: title/description/call to action, the lucide
  icon, and the call to action of another tool.
- `src/components/home/ToolGrid.test.tsx` - 6 cases: every tool linked once, the category grouping
  (6/22/13), the anchor ids, the section heading, and the two empty states.
- `src/components/home/HomeHero.test.tsx` - 4 cases: the hero content, the controlled search field,
  and the two states of the result counter.
- `src/components/home/toolSearch.test.ts` - 7 cases: empty query, normalisation, title and
  description matching, dropping empty categories, the partial match, no match, and that filtering
  does not mutate the catalog.
- `src/data/tools.test.ts` - 2 new cases: every tool has a clean call to action (and four spot
  checks against the source), and every tool has a page file.

The suite is now 99 files / 508 tests (was 95 / 486).

## Validation results

- `npm run typecheck` - PASS
- `npm run test:run` - PASS (99 files, 508 tests)
- `npm run build` - PASS
  - `[legacy-aliases] emitted 258, missing 0, skipped 1, conflicts 0`
  - Verified 41 grid links, 41 distinct targets, the 4 anchor ids, and no duplicate ids.
  - Verified 681 internal link targets across the build, 0 broken.
- Browser check against `docusaurus serve` at 1280x900 and 390x844.

## Deviations from the plan

- **The components live in `src/components/home/`, not three top-level folders.** The estimate named
  `src/components/ToolGrid/*`, `src/components/ToolCard/*` and a hero component. The repo already
  groups components in a lowercase folder (`src/components/calculators/`), so the three home
  components share `src/components/home/` with a barrel `index.ts`, matching the calculator kit's
  layout.
- **The card call to action is a new catalog field (`linkLabel`) rather than a component constant.**
  The source cards each had their own label; keeping them in the catalog is what lets the grid stay
  catalog-driven.
- **The search filters the page instead of being inert.** The ticket permits a stub; a filter over
  the on-page catalog is the smallest honest version of one and is isolated in `toolSearch.ts` for
  ST-26 to replace.
- **The hero has no background image.** `images/hero-1.jpg` is ST-25's asset work and D8 is still
  open; the hero uses the gradient the tool pages already use.
- **`vitest.config.mts` gained two aliases.** Docusaurus resolves `@docusaurus/Link` and
  `@theme/Heading` through webpack aliases, so they cannot be imported in a test. The aliases point
  at two small stubs in `src/test/docusaurus-stubs/`. The production code ships the real Docusaurus
  components - the grid therefore keeps client-side routing and stays inside the build's
  broken-link check.

## Issues encountered

- The first attempt at the vitest config replaced the existing `vitest.config.mts` instead of
  extending it, which removed the React plugin and broke the JSX transform in every existing test
  file. The file was restored from git and the two aliases were added to the original config.
- The first version of the search test expected the query "protein" to match a single tool. It
  matches two: "Post-Workout Recovery Meal Builder" mentions protein ratios in its description. The
  test now uses a query that is genuinely unique, and the behaviour is correct - the filter searches
  titles **and** descriptions.
- The controlled search field reported only the last typed character in the first test, because the
  mock never fed the value back. The test now drives the component through a small stateful wrapper,
  which is what the page does.

## Follow-ups for the reviewer

- The work is uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- **ST-25**: the home hero has no background image yet. Once D8 is settled, `images/hero-1.jpg`
  belongs in `static/` and the hero gradient becomes a fallback.
- **ST-26**: `src/components/home/toolSearch.ts` is the seam for the real search. The hero's field
  and the grid's filtering stay as they are; only the source of the matches changes.
- The About page's "Explore Tools" button points at `#tools` on the home page, which now exists
  again as a real section.
