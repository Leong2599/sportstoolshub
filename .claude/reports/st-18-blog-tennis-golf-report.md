# Implementation Report — ST-18 Blog batch: tennis + golf

**Plan**: `docs/tickets/sportstools-migration.md` (ST-18)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the tennis and golf posts (30 posts) and reviewed the result. This batch
carries the D1 resolution for the missing `golf-equipment-guide.html`, which is verified end to end:
the article appears nowhere in the built site, the golf tag page lists 15 posts, and the built sitemap
lists 15 golf URLs against the source sitemap's 16. The batch also introduced two new content
shapes - ordered lists and `h5` headings - and prompted a refinement to the review script so a
heading-level skip that the *source* has is no longer reported as a conversion artifact.

## Tasks completed

- [x] Audit the tennis and golf source posts for edge cases → `blog/tennis/*.html`, `blog/golf/*.html` (READ)
- [x] Convert the 30 posts with the ST-15 pipeline → `blog/tennis/*.mdx` (15), `blog/golf/*.mdx` (15) (CREATE)
- [x] Verify the D1 golf resolution in the converter, the tag page, and the sitemap (VERIFY)
- [x] Make the review script's heading check source-aware → `scripts/review-blog.mjs` (UPDATE)
- [x] Add a heading-parity checker → `scripts/compare-headings.mjs` (CREATE)
- [x] Regression tests for the heading parity helpers → `src/test/blog-convert.test.ts` (UPDATE)
- [x] Raise the feed limit for the growing archive → `docusaurus.config.ts`, `README.md` (UPDATE)

## The D1 resolution for the missing golf article

`golf-equipment-guide.html` is a card in the source index with **no source file behind it**. Per the
D1 default - drop the dead card, do not invent the article - the resolution is verified at every
layer the plan asks for:

| Layer | Result |
| --- | --- |
| Converter | `DEAD_POST_FILES` lists it; the run reports `golf/golf-equipment-guide.html (source file missing (D1))` and writes no post |
| Built site | **0 occurrences** of `golf-equipment-guide` across every `.html` and `.xml` file in `build/` |
| Golf tag page | `/blog/tags/golf/` lists its posts and never mentions the article |
| Built sitemap | **15** golf blog URLs, not 16 |
| Source sitemap | 16 golf blog URLs - it still advertises the missing article |
| Legacy contract | The path is not in `src/data/legacy-urls.json`, so no alias is emitted for it |
| Post footers | Two golf posts link to it; both degrade to plain text, so no broken link |

The built sitemap now carries 375 URLs, of which 15 are golf and 15 are tennis. The gap against the
source's 259-source-URL sitemap is the expected consequence of dropping the dead card.

## Scope

30 posts: 15 tennis and 15 golf. Neither sport overlaps the ST-15 picks, so all 30 source files are
converted.

## Source shape of this batch

- **Both sports use the `<div class="blog-content">` wrapper with a `<footer class="blog-footer">`
  holding read-next links**, so all 30 posts have a Read Next section. Tennis has 30 live footer
  targets; golf has 28 live and 2 dead (`golf-equipment-guide.html`).
- **Two content shapes are new to the converted set**: tennis has 2 ordered lists and golf has 4,
  and golf has 19 `h5` headings. Both converted correctly.
- Tennis is the densest body in the source so far: 3,329 list items and 3,038 bold runs across 15
  posts, with 655 `h4` headings.
- Neither sport's bodies contain a link, and neither mentions a calculator or a tool page.
- **15 heading close mismatches** (`</h3>` closing an `<h2>`) across the two sports - the defect the
  ST-16 fix addresses. All 15 convert correctly.

## Review results

**95 posts reviewed, 0 artifacts**, and **95 posts compared, 0 heading mismatches.**

The first review pass reported one artifact: `golf-nutrition-performance.mdx` jumps from `h2` to
`h4`. Investigating it showed the jump is **in the source itself** - `golf-nutrition-performance.html`
has an `<h2>Sample Golf Nutrition Day</h3>` closed with the wrong tag, and the next heading in the
source is an `h4`. A browser closes the `h2` there and renders `h2` followed by `h4`, which is
exactly what the port produces. The port reproduces the source's full 52-heading sequence verbatim.

So the reviewer's check was too blunt: it reported a *source* quirk as a *conversion* artifact. Two
changes fixed that:

- `scripts/review-blog.mjs` now takes an optional `--source` path and suppresses a heading-level skip
  when the source has the same skip. Without the source it still reports every skip, so the check
  stays conservative by default.
- `scripts/compare-headings.mjs` proves heading parity directly: it extracts the heading sequence a
  browser produces from each source body and compares it with the converted post's heading sequence.
  Across all 95 posts there are 0 mismatches, and it reports the 1 source-faithful skip separately.

Both were validated against the seeded fixture, which still yields all 8 seeded artifacts and a
non-zero exit.

## Verification

- **Routes**: all 30 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 30 emit `/blog/<sport>/<slug>.html`. The build's alias count went from 107 to 137.
- **Legacy contract**: all 30 entries in `src/data/legacy-urls.json` map to exactly the route their
  post produces, and the post file exists for each.
- **Tags**: the registry grew to 221 tag pages, including `/blog/tags/tennis/` and
  `/blog/tags/golf/`.
- **Feeds**: `rss.xml` and `atom.xml` each carry all 95 posts.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 30 posts.

## Tests added

`src/test/blog-convert.test.ts` — 3 new cases covering the heading parity helpers: the heading
levels a browser produces from source markup, the case where a close tag names the wrong level, and
reading the heading levels of a converted body (excluding the converter's own `## Read Next`
section). The suite is now 37 cases in that file, 464 in total.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 464 tests)
- `npm run review:blog -- --source=<path>` — PASS (95 posts, 0 artifacts)
- `npm run review:blog:headings -- --source=<path>` — PASS (95 posts, 0 heading mismatches; 1 source-faithful skip reported)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 137, missing 121, skipped 1, conflicts 0` (up from 107 at ST-17)
  - Verified all 30 new post routes and all 30 new alias files exist.
  - Verified 0 occurrences of `golf-equipment-guide` anywhere in the built site.
  - Verified the built sitemap has 15 golf and 15 tennis blog URLs.
  - Verified 221 tag pages build.
  - Verified `rss.xml` contains 95 items and `atom.xml` contains 95 entries.

## Deviations from the plan

- **The review script now takes an optional source path.** The plan's checklist says to fix
  conversion artifacts, but a heading-level skip that the source already has is not an artifact -
  it is parity. Without the source path the reviewer cannot tell the two apart and would have
  reported a false positive on every batch containing a source quirk. The check stays strict by
  default and only relaxes when it can verify the source.
- **Added `scripts/compare-headings.mjs`.** Heading parity is the subtlest part of this migration
  because the source's malformed markup is ambiguous. Proving the port matches browser rendering
  mechanically is stronger evidence than spot-checking, and it is what let the golf finding be
  correctly classified as source-faithful rather than fixed.
- **Raised the feed limit from 50 to 100.** There are now 95 posts and 119 to come; at 50 the feed
  covered barely half the archive. The limit still needs one more raise when the last batches land,
  which the README records.
- **No `tags.yml` or `authors.yml` changes were needed.** The registry is built from all source cards,
  so the 55 new topic tags were already present from ST-15.

## Issues encountered

- The first review pass flagged the golf heading skip as an artifact. It was not: the source has the
  same skip. Resolving it correctly needed the source-aware check and the parity comparison, both of
  which are now part of the tooling.
- The first version of `compare-headings.mjs` double-counted headings, pushing each level on both
  open and close, which reported every post as a mismatch. The levels are now pushed on open only,
  and the converter's own `## Read Next` heading is excluded from the comparison.
- The heading-parity helper was written before its role was clear and initially used the wrong
  closing-tag rule. It now mirrors the converter's rule exactly, which is what makes the comparison
  meaningful.

## Follow-ups for the reviewer

- The 30 posts, the review tooling, the config change, the README notes, and this report are
  uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then
  `piv-review-pr`.
- ST-19 through ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>`, then
  `npm run review:blog -- --source=<path>` and `npm run review:blog:headings -- --source=<path>`,
  then the build.
- The feed limit must be raised once more when all 214 posts are converted.
- `golf-equipment-guide.html` stays dropped. ST-28's cutover notes should record the source sitemap
  advertising 16 golf URLs against the 15 that will exist, alongside the other D1 dead links.
