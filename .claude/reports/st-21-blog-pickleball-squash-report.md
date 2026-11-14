# Implementation Report — ST-21 Blog batch: pickleball + squash

**Plan**: `docs/tickets/sportstools-migration.md` (ST-21)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the pickleball and squash posts (32 posts, the largest batch in the plan) and
reviewed the result. Both sports are the cleanest source content in the migration: no tables, no ordered
lists, no malformed markup, no mismatched heading close tags. The batch converted with no code changes
and no manual fixes, which is the outcome the ST-15 decision rule anticipated for the scripted path.

## Tasks completed

- [x] Audit the pickleball and squash source → `blog/pickleball/*.html`, `blog/squash/*.html` (READ)
- [x] Convert the 32 posts with the ST-15 pipeline → `blog/pickleball/*.mdx` (17), `blog/squash/*.mdx` (15) (CREATE)
- [x] Run the review checklist across the whole converted set (REUSE)
- [x] Verify content parity against the source - list items, paragraphs, headings (VERIFY)
- [x] Verify routes, aliases, tags, feeds, and sitemap counts (VERIFY)

## Source shape of this batch

Both sports use the `<article class="blog-content">` wrapper with a `<div class="blog-footer">` holding
only a tag list, so neither has a read-next section - the same layout as cricket, soccer, boxing, karate,
wrestling, and hockey.

| | pickleball | squash |
| --- | --- | --- |
| Posts | 17 | 15 |
| Paragraphs | 343 | 68 |
| `h2` / `h3` / `h4` | 171 / 336 / 11 | 93 / 149 / 25 |
| Lists / items | 291 / 1175 | 176 / 682 |
| Bold runs | 387 | 122 |

The two sports are the only ones in the corpus with **no** `h5` headings, no tables, no ordered lists, and
no `<br>` elements. There were also no malformed `<stron>` tags, no literal angle brackets in body text,
and **no mismatched heading close tags** - the defect class that affected 78 posts in earlier batches.
Pickleball is the most paragraph-heavy sport in the source (343 paragraphs across 17 posts); squash is the
most list-heavy relative to its size (682 list items across only 68 paragraphs).

## Content parity

A structural comparison of every converted post against its source:

- **1857 source list items, 0 missing.**
- **Every source paragraph present** in the converted output, in all 32 posts.
- **Every source heading present** at the same level, in all 32 posts.

## Review results

**187 posts reviewed, 0 artifacts**, and **187 posts compared, 0 heading mismatches.**

The 8 source-faithful heading level skips (7 in boxing, 1 in golf) are reported separately by the parity
script and are not conversion artifacts.

Cross-link verification across the whole site: **483 internal links, 0 broken.**

## Verification

- **Routes**: all 32 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 32 emit `/blog/<sport>/<slug>.html`. The build's alias count went from 197 to 229.
- **Legacy contract**: all 32 entries in `src/data/legacy-urls.json` map to exactly the route their post
  produces, and the post file exists for each. Nothing for these sports remains in the missing list.
- **Feeds**: `rss.xml` and `atom.xml` each carry all 187 posts.
- **Sitemap**: 605 URLs, with 343 tag pages built.
- **Related tools**: all 17 pickleball and 15 squash posts carry the `## Related Tools` section - pickleball
  points at the Injury Risk Calculator and the Training Load Calculator, squash at the same pair.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 187 posts.
- **No prior batch regressed**: re-running the converter changed **0** of the 155 already-converted posts.

## Tests added

None. This batch needed no converter or tooling change, and the defects it would have exercised were
already covered by the regression tests added in ST-20. The suite stays at 472 tests.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 472 tests)
- `npm run review:blog -- --source=<path>` — PASS (187 posts, 0 artifacts)
- `npm run review:blog:headings -- --source=<path>` — PASS (187 posts, 0 heading mismatches)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 229, missing 29, skipped 1, conflicts 0` (up from 197 at ST-20)
  - Verified all 32 new post routes and all 32 new alias files exist.
  - Verified 483 internal links across the site, 0 broken.
  - Verified `rss.xml` contains 187 items and `atom.xml` contains 187 entries.

## Deviations from the plan

None. The batch was scoped as planned, converted mechanically, and passed every gate without a code
change.

## Issues encountered

None.

## Follow-ups for the reviewer

- The 32 posts are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- ST-22 should run `npm run convert:blog -- --source=<path> --sports=table-tennis,swimming`, then
  `npm run review:blog -- --source=<path>` and `npm run review:blog:headings -- --source=<path>`, then
  the build. Swimming is the one sport with a partial conversion - 4 of its 15 posts were converted by the
  ST-15 spike, so ST-22 should convert the sport in full rather than only the missing posts.
- After ST-22 the blog migration is complete at 214 posts, and the feed limit of 250 covers it.
