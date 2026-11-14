# Implementation Report — ST-17 Blog batch: cycling + cricket

**Plan**: `docs/tickets/sportstools-migration.md` (ST-17)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the cycling and cricket posts (31 posts) and reviewed the result. This
batch is the first to exercise the ST-16 fixes against real content: it carries the source's two
malformed `<stron>` tags, its literal `<55% of FTP` text, and four mismatched heading close tags -
all of which convert correctly now. The batch needed no converter changes, and the new review script
reports zero artifacts across all 65 converted posts.

## Tasks completed

- [x] Audit the cycling and cricket source posts for edge cases → `blog/cycling/*.html`, `blog/cricket/*.html` (READ)
- [x] Convert the 31 posts with the ST-15 pipeline → `blog/cycling/*.mdx` (14), `blog/cricket/*.mdx` (17) (CREATE)
- [x] Run the review checklist across the whole converted set → `scripts/review-blog.mjs` (REUSE)
- [x] Verify the known cycling edge cases (the `<stron>` typo, the literal `<`, the heading close mismatches) (VERIFY)
- [x] Verify cross-links, routes, aliases, tags, and feeds (VERIFY)
- [x] Note the feed limit for the remaining batches → `README.md` (UPDATE)

## Scope

31 posts: 14 cycling and 17 cricket. Neither sport overlaps the ST-15 picks, so all 31 source files
are converted. No D1 dead card falls in these two sports - the five dead cards are all in basketball,
soccer, and golf.

## Source shape of this batch

- **cycling** uses the `<div class="blog-content">` wrapper with a `<footer class="blog-footer">`
  holding read-next links - 26 links across 14 posts, of which 2 point at source files that do not
  exist (`cycling-equipment-guide.html` and `cycling-conditioning-guide.html`; the real files are
  `cycling-equipment-gear-guide.html` and `cycling-conditioning.html`). Both degrade to plain text.
- **cricket** uses the `<article class="blog-content">` wrapper with a `<div class="blog-footer">`
  holding only a tag list, so cricket posts have no read-next section. Cricket is also the
  lightest-bodied sport in the source: 474 list items and only 65 bold runs, against cycling's 2,153
  list items and 2,031 bold runs.
- **Neither sport's bodies contain a link**, and neither mentions a calculator or a tool page.
- **No tables fall in this batch.** The source's only two table posts are
  `boxing-nutrition-guide` (ST-16) and `swimming-strokes-guide` (ST-15), both already converted and
  both verified as GFM tables then. The plan's conditional "if the table-containing post falls here"
  therefore does not apply.
- Bodies use only `p`, `h2`-`h4`, `ul`, `li`, and `strong`, plus the two malformed `<stron>` tags in
  `cycling-racing-tactics.html`.

## The known edge cases, verified

Cycling is the sport that carries every source defect the pipeline has to absorb, so this batch is
the real test of the ST-16 fixes:

| Source defect | Where | Result |
| --- | --- | --- |
| `<stron>` instead of `<strong>` (2 occurrences) | `cycling-racing-tactics.html` | Recovered as bold: `- **Recovery Position:** Find shelter after hard efforts` and `- **Effort Management:** Sustainable pace for chase` |
| Literal `<55% of FTP` and `<30 seconds` | `cycling-training-fundamentals.html` | Escaped to `- **Power:** &lt;55% of FTP`, which MDX renders as text rather than reading it as a JSX tag |
| `</h3>` closing an `<h2>` (4 occurrences) | `cycling-nutrition-hydration`, `cycling-positions-roles`, `cycling-racing-tactics`, `cycling-safety-road-rules` | Heading renders at its own level with its paragraph separate: `## Personalized Nutrition Strategy` followed by the paragraph as a sibling, then `### Testing and Adaptation` |

All three are covered by the existing regression tests, so the fixes are proven rather than
coincidental.

## Review results

**65 posts reviewed, 0 artifacts.** The review script found nothing in the 31 new posts and nothing in
the 34 already converted, which confirms the ST-16 heading fix did not regress anything.

Cross-link spot-check across all six converted sports:

- 51 internal links, **0 unresolved** - every one points at a route that exists.
- **0 cross-sport links** - the source's read-next links are all intra-sport, and the converter
  preserves that.
- Read Next presence matches the source's two footer layouts exactly: 14/14 cycling (link footer),
  0/17 cricket (tag-only footer), 14/14 basketball, 0/14 soccer, 4/4 swimming, 0/2 boxing.

## Verification

- **Routes**: all 31 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 31 emit `/blog/<sport>/<slug>.html` and appear in
  `.docusaurus/legacy-aliases-report.json`. The build's alias count went from 76 to 107.
- **Legacy contract**: all 31 entries in `src/data/legacy-urls.json` map to exactly the route their
  post produces, and the post file exists for each. Nothing for these two sports remains in the
  missing list.
- **Tags**: the registry grew to 135 tag pages, including `/blog/tags/cycling/` and
  `/blog/tags/cricket/`.
- **Feeds**: `rss.xml` and `atom.xml` each carry 50 items - the configured feed limit - and the
  cricket posts, being the most recent, appear in it.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 31 posts.

## Tests added

None. This batch needed no converter changes, and the three source defects it exercises are already
covered by the regression tests added in ST-15 and ST-16. The suite stays at 461 tests.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 461 tests)
- `npm run review:blog` — PASS (65 posts, 0 artifacts)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 107, missing 151, skipped 1, conflicts 0` (up from 76 at ST-16)
  - Verified all 31 new post routes and all 31 new alias files exist.
  - Verified 0 cycling/cricket entries remain in the missing list.
  - Verified 135 tag pages build.
  - Verified `rss.xml` contains 50 items and `atom.xml` contains 50 entries.

## Deviations from the plan

- **No `tags.yml` or `authors.yml` changes were needed.** The registry is built from all source
  cards rather than the converted batch, so the 55 new topic tags were already present from ST-15.
  This is the pipeline behaving as designed and not a deviation from the plan's "occasional
  `tags.yml`/`authors.yml` fixes" allowance.
- **The feed limit is now the only manual step left in the blog work.** It sits at 50 while there
  are 65 posts and 214 to come. The README records that it must be raised as the remaining batches
  land; raising it now would only hide the need to revisit it at the end.

## Issues encountered

None. The batch converted cleanly on the first run, with no converter change and no manual fix, which
is the result the ST-15 decision rule anticipated for the scripted path.

## Follow-ups for the reviewer

- The 31 posts and the README note are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`,
  then `piv-create-pr`, then `piv-review-pr`.
- ST-18 through ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>` followed by
  `npm run review:blog`, then the build.
- The feed limit must be raised above 50 once all 214 posts are converted, so the feed covers the
  archive.
- `cycling-equipment-guide.html` and `cycling-conditioning-guide.html` are dead links in the source
  footers, in addition to the five D1 index cards. They are dropped as plain-text links. ST-28's
  cutover notes should list them alongside the D1 cards.
