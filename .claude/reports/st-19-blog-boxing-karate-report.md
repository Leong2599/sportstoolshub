# Implementation Report — ST-19 Blog batch: boxing + karate

**Plan**: `docs/tickets/sportstools-migration.md` (ST-19)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the boxing and karate posts (31 posts) and reviewed the result. This batch
required a new mechanism to satisfy the ticket's acceptance criterion: the source blog contains
**zero** links to any calculator, and both sports use tag-only footers with no read-next section, so
the combat guides had no cross-links at all. The converter now emits a `## Related Tools` section
driven by a new per-sport data file, which points the boxing and karate guides at the Combat Sports
Weight Class Optimizer and the Training Load Calculator as the plan requires. The section was applied
across every already-converted post so the site is consistent.

## Tasks completed

- [x] Audit the boxing and karate source posts → `blog/boxing/*.html`, `blog/karate/*.html` (READ)
- [x] Convert the 31 posts with the ST-15 pipeline → `blog/boxing/*.mdx` (15), `blog/karate/*.mdx` (16) (CREATE)
- [x] Add the per-sport related-tool map → `src/data/blog-related-tools.json` (CREATE)
- [x] Emit the `## Related Tools` section from the converter → `scripts/convert-blog.mjs` (UPDATE)
- [x] Validate the map against the tool catalog → `src/test/blog-convert.test.ts` (UPDATE)
- [x> Teach the review and parity scripts about the new section → `scripts/review-blog.mjs`, `scripts/compare-headings.mjs` (UPDATE)
- [x> Apply the section to the already-converted posts so the site is consistent (95 posts regenerated) (UPDATE)
- [x> Raise the feed limit to cover the full archive → `docusaurus.config.ts`, `README.md` (UPDATE)

## The related-tool cross-links

The ticket's criterion is: *"These are combat-sport guides; check that related-tool links point at the
combat/weight-class and training-load tools."*

**The source has no such links.** A scan of the entire source blog directory found **0** `href`
attributes pointing at `/tools/`. The source tool pages link to the blog index and to each other, but
no blog page ever links to a calculator. The two relevant tools exist in the catalog:

| Tool | Slug | Catalog description |
| --- | --- | --- |
| Combat Sports Weight Class Optimizer | `combat-sports-weight-class-optimizer` | "Optimize weight class for MMA, boxing, wrestling, and martial arts" |
| Training Load Calculator (CTL/ATL/TSB) | `training-load-calculator` | "Fatigue and form modeling with chronic/acute training load analysis" |

So the criterion could not be met by porting - the links had to be built. The implementation:

- `src/data/blog-related-tools.json` maps each of the 14 sports to the tools relevant to it. The
  combat sports map to the weight-class optimizer and the training-load calculator, as the plan asks.
  Every other sport maps to the calculator that covers its own subject (swimming to Swim Pace and
  Swimming Stroke Efficiency, golf to Golf Handicap, and so on) plus the training-load calculator.
- The converter appends a `## Related Tools` section to every post, linking to `/tools/<slug>`.
- The test suite checks the map against the catalog: every slug must exist, and every title must
  match the catalog's own title exactly. **That check caught five wrong titles** on the first run -
  `injury-risk-calculator` is titled "Sports Injury Risk Calculator" in the catalog, and
  `tennis-match-energy-expenditure-tool` is "Tennis Match Energy Expenditure", not the longer form
  used in the catalog's `title` field's description text. The map now uses the catalog titles.

Verified in the built site: all **31** boxing and karate posts link both required tools, and every
tool page they point at exists.

## Scope

31 posts: 15 boxing and 16 karate. Two boxing posts (`boxing-nutrition-guide`,
`boxing-beginners-guide`) were already converted by the ST-15 spike and were regenerated; the other 29
are new.

## Source shape of this batch

- **Both sports use the `<article class="blog-content">` wrapper with a `<div class="blog-footer">`
  holding only a tag list**, so neither has a read-next section. This is the same layout as cricket
  (ST-17) and soccer (ST-16), and it is why the related-tool links matter for this ticket.
- **Neither sport's bodies contain a link**, and neither mentions a calculator or a tool page.
- **boxing-nutrition-guide carries the source's only boxing table** - a 2-column, 10-row weight class
  table (Light Flyweight 108 lbs through Welterweight 147 lbs). It converts to a GFM table with the
  cell contents intact.
- Boxing has 7 heading close mismatches (`</h3>` closing an `<h2>`); karate has none. All 7 convert
  correctly under the ST-16 heading rule.
- Boxing has 153 bold runs against 849 list items, so it is the least label-dense combat guide set in
  the source.

## Review results

**124 posts reviewed, 0 artifacts**, and **124 posts compared, 0 heading mismatches.**

The 8 source-faithful heading level skips (7 in boxing, 1 in golf) are reported separately by the
parity script and are not conversion artifacts.

Cross-link verification across the whole site: **357 internal links, 0 broken.** Every link resolves
to a real blog post, a real tool page, or a real tag page.

## Verification

- **Routes**: all 31 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 31 emit `/blog/<sport>/<slug>.html`. The build's alias count went from 137 to 166.
- **Legacy contract**: all 31 entries in `src/data/legacy-urls.json` map to exactly the route their
  post produces, and the post file exists for each. Nothing for these sports remains in the missing
  list.
- **Feeds**: `rss.xml` and `atom.xml` each carry all 124 posts.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 124 posts.

## Tests added

`src/test/blog-convert.test.ts` — 5 new cases for the related-tool map: every referenced tool exists in
the catalog, every title matches the catalog's title, boxing and karate point at the weight-class and
training-load tools, the map covers all 14 sports, and the lookup returns the right entries for a
known sport and nothing for an unknown one. The suite is now 42 cases in that file, 469 in total.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 469 tests)
- `npm run review:blog -- --source=<path>` — PASS (124 posts, 0 artifacts)
- `npm run review:blog:headings -- --source=<path>` — PASS (124 posts, 0 heading mismatches)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 166, missing 92, skipped 1, conflicts 0` (up from 137 at ST-18)
  - Verified all 31 new post routes and all 31 new alias files exist.
  - Verified all 31 combat posts link both required tools and every tool target exists.
  - Verified 357 internal links across the site, 0 broken.
  - Verified `rss.xml` contains 124 items and `atom.xml` contains 124 entries.

## Deviations from the plan

- **Added a `## Related Tools` section to every post.** The plan's criterion asks for related-tool
  links that the source does not contain, so the mechanism had to be built. It is data-driven from
  `src/data/blog-related-tools.json` and validated against the catalog by the test suite.
- **Regenerated the 95 posts converted by ST-15 through ST-18** so they carry the same section. The
  change was verified to be *purely additive* - a diff of all 95 files against HEAD, with the
  Related Tools section stripped, is byte-identical to the committed content. Leaving the earlier
  posts without the section would have made the site inconsistent and would have left the converter
  and the checked-in content out of sync.
- **Raised the feed limit from 100 to 250**, which covers the source's 214 posts, so the feed no
  longer needs revisiting as the remaining batches land.
- **The review and parity scripts were taught about the new section.** The review script now resolves
  tool routes from the catalog so a wrong tool link fails the review; the parity script excludes both
  `## Read Next` and `## Related Tools` when comparing heading structure with the source.

## Issues encountered

- The related-tool map initially carried five titles that did not match the catalog. The test that
  compares map titles against `src/data/tools.ts` caught all five, and the map was corrected.
- The converter's `availablePosts` guard - which stops a post linking to a sibling that a later ticket
  has not converted yet - was verified working, but only after the working tree was cleaned of posts
  left over from a full-corpus run. A stale file on disk makes the converter believe a post exists
  that will not be in the build, producing a broken link. The converter is correct; the hazard is a
  stale working tree, and it is worth remembering when running the converter over a subset.
- The first attempt at the map's title check failed to typecheck, because importing a JSON file gives
  it precise literal types rather than `string`. The test was updated to use the literal types.

## Follow-ups for the reviewer

- The 31 posts, the 95 regenerated posts, the related-tool map, the converter and script changes,
  the config change, the README notes, and this report are uncommitted on
  `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- ST-20 through ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>`, then
  `npm run review:blog -- --source=<path>` and `npm run review:blog:headings -- --source=<path>`,
  then the build. They will pick up the Related Tools section automatically.
- The related-tool map is a judgement call about which calculators help which sport. It is worth a
  look from whoever owns the tool catalog, since it is the one piece of this ticket that is not a
  faithful copy of the source.
