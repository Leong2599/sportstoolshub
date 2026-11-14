# Implementation Report — ST-20 Blog batch: wrestling + hockey

**Plan**: `docs/tickets/sportstools-migration.md` (ST-20)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the wrestling and hockey posts (31 posts) and reviewed the result against the
ticket's criterion - tables, numbered drill lists, and equipment sections convert cleanly. Neither sport
contains a table or an ordered list, so the criterion reduces to the equipment and drill sections, which
are headings followed by lists: all convert with exact level and item parity. The review also surfaced a
genuine source defect in `hockey-goaltending-guide.html` that silently swallowed four list items, which
is now fixed in the converter with a regression test.

## Tasks completed

- [x] Audit the wrestling and hockey source → `blog/wrestling/*.html`, `blog/hockey/*.html` (READ)
- [x] Verify the ST-20 criterion items: tables, ordered lists, equipment sections (VERIFY)
- [x] Convert the 31 posts with the ST-15 pipeline → `blog/wrestling/*.mdx` (16), `blog/hockey/*.mdx` (15) (CREATE)
- [x] Fix the source defect that swallowed a list → `scripts/convert-blog.mjs` (UPDATE)
- [x] Make the reviewer's empty-heading check source-aware → `scripts/review-blog.mjs` (UPDATE)
- [x] Regression tests for both fixes → `src/test/blog-convert.test.ts` (UPDATE)

## The ST-20 criterion

The ticket asks to "verify any tables, numbered drill lists, and equipment sections convert cleanly".
Measured against the source:

| Criterion | Source | Converted |
| --- | --- | --- |
| Tables | none in either sport | n/a |
| Numbered (ordered) drill lists | none in either sport | n/a |
| Equipment sections | 5 posts (2 wrestling, 3 hockey) | 10 headings, all with their lists intact |
| Drill sections | 13 posts | 78 headings, all with their lists intact |

The absence of tables and ordered lists is not a gap in the converter - it is a fact about the source.
The source's only two table posts (`boxing-nutrition-guide` and `swimming-strokes-guide`) were converted in
ST-19 and ST-15 and were verified as GFM tables there. The converter handles both.

Equipment and drill sections are the real test here, and they are the densest content in the batch:
`hockey-equipment-guide.html` carries 58 headings across 6 levels and 144 list items. The converted post
reproduces that structure exactly, heading for heading.

## Content parity

A structural comparison of every converted post against its source:

- **3625 source list items, 0 missing.**
- **Every source paragraph present in the converted output**, in all 31 posts.
- **0 heading mismatches** against the browser's rendering of the source, across all 155 posts on the site.

## The defect the review found

`hockey-goaltending-guide.html` contains a malformed heading:

```html
<h4>When to Use:</li>
    <li>Shots from angle</li>
    <li>Covering far post</li>
    <li>Shots along ice</li>
    <li>Rebound control</li>
</ul>
```

The heading is closed with `</li>`, and the `<ul>` that should hold those items was already closed by the
previous list. The browser ignores the mismatched tag, leaves the heading open, and nests the items inside
it - so the four items lose their list structure and end up rendered as heading text. The converter
reproduced that, folding "Shots from angle Covering far post Shots along ice Rebound control" into the
heading.

It is the only such defect in the corpus - a scan of all 214 source posts found exactly one heading closed
with a list or paragraph tag.

The converter now closes the heading at the mismatched tag and keeps the items as a list, so the port
reads:

```
#### When to Use:

- Shots from angle
- Covering far post
- Shots along ice
- Rebound control
```

This is a deliberate departure from the browser's rendering: the port preserves the *content* and the
*list structure* rather than reproducing the browser's nesting bug. Nothing is lost, and the four items are
readable.

## A second source quirk, correctly not "fixed"

`hockey-tactics-systems.html` has a genuinely empty heading - `<h4>Types of Breakouts:</h4>` is followed
immediately by another `<h4>`. That is empty in the source, and the port reproduces it faithfully. The
reviewer initially reported it as an artifact, so the check is now source-aware: a heading with no content
is only reported when the source does not have the same empty heading. The reviewer was re-validated against
a seeded fixture with a genuinely empty heading (still reported) and the original 8-artifact fixture (still
all reported).

## Scope

31 posts: 16 wrestling and 15 hockey. Neither sport overlaps an earlier batch.

Both sports use the `<article class="blog-content">` wrapper with a `<div class="blog-footer">` holding only
a tag list, so neither has a read-next section - the same layout as cricket, soccer, boxing, and karate.
Both carry the `## Related Tools` section from the ST-19 map: wrestling points at the Combat Sports Weight
Class Optimizer and the Training Load Calculator, hockey at the Injury Risk Calculator and the Training
Load Calculator.

## Review results

**155 posts reviewed, 0 artifacts**, and **155 posts compared, 0 heading mismatches.**

The 8 source-faithful heading level skips (7 in boxing, 1 in golf) are reported separately by the parity
script and are not conversion artifacts.

Cross-link verification across the whole site: **419 internal links, 0 broken.**

## Verification

- **Routes**: all 31 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 31 emit `/blog/<sport>/<slug>.html`. The build's alias count went from 166 to 197.
- **Legacy contract**: all 31 entries in `src/data/legacy-urls.json` map to exactly the route their post
  produces, and the post file exists for each. Nothing for these sports remains in the missing list.
- **Feeds**: `rss.xml` and `atom.xml` each carry all 155 posts.
- **Sitemap**: 539 URLs, with 316 tag pages built.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 155 posts.
- **No prior batch regressed**: re-running the converter changed **0** of the 124 already-converted posts.

## Tests added

`src/test/blog-convert.test.ts` — 4 new cases: list items survive a heading closed with a list tag; the
empty-heading helper matches a heading that is empty in the source; it returns false without a source; and
the heading-parity helpers behave as before. The suite is now 45 cases in that file, 472 in total.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 472 tests)
- `npm run review:blog -- --source=<path>` — PASS (155 posts, 0 artifacts)
- `npm run review:blog:headings -- --source=<path>` — PASS (155 posts, 0 heading mismatches)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 197, missing 61, skipped 1, conflicts 0` (up from 166 at ST-19)
  - Verified all 31 new post routes and all 31 new alias files exist.
  - Verified 419 internal links across the site, 0 broken.
  - Verified `rss.xml` contains 155 items and `atom.xml` contains 155 entries.

## Deviations from the plan

- **The converter does not reproduce the browser's nesting for the malformed heading.** The one heading
  closed with `</li>` is closed at that tag and its items stay a list. The port is deliberately more
  faithful to the *content* than to the browser's rendering of broken markup, and the deviation is
  documented here and covered by a regression test.
- **The reviewer gained a source-aware empty-heading check.** Without it, a heading that the source leaves
  empty is reported as a conversion artifact. The check still reports a heading that is empty only in the
  port, and it stays strict when no source is supplied.

## Issues encountered

- The first attempt at the malformed-heading fix closed the heading at *any* list or paragraph end tag,
  which would have closed a heading that a real `</li>` should have left alone. The fix now tries an exact
  match first, so a real `</li>` still closes its item, and only falls back to closing the heading when
  there is no match.
- The stray list items were emitted as separate blocks and so joined with a blank line, which made them
  separate paragraphs rather than one list. Consecutive list-item blocks are now merged at the join stage.
- The review script ran `main()` on import, which made it unusable from the test suite - it exited the
  process with code 1 and killed the test run. The CLI entry is now guarded by the same
  `import.meta.url` check the other scripts use, and the script sets `process.exitCode` instead of calling
  `process.exit`.

## Follow-ups for the reviewer

- The 31 posts, the converter and reviewer fixes, the tests, and this report are uncommitted on
  `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- ST-21 and ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>`, then
  `npm run review:blog -- --source=<path>` and `npm run review:blog:headings -- --source=<path>`, then
  the build.
- The source's one malformed heading could be fixed upstream in
  `blog/hockey/hockey-goaltending-guide.html`.
