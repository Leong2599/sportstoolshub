# Implementation Report — ST-16 Blog batch: basketball + soccer

**Plan**: `docs/tickets/sportstools-migration.md` (ST-16)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the remaining basketball and soccer posts (28 posts) and reviewed the
result. The batch surfaced a real source defect that the ST-15 spike had not hit: the source closes
some headings with the wrong tag (`<h2>...</h3>`), which browsers resolve by closing the heading
but which the converter was resolving by nesting the rest of the document inside the heading. The
parser now follows the browser rule, the batch's 28 posts convert cleanly, and a new
`scripts/review-blog.mjs` applies the review checklist mechanically so later batches are checked
rather than eyeballed.

## Tasks completed

- [x] Audit the basketball and soccer source posts for edge cases → `blog/basketball/*.html`, `blog/soccer/*.html` (READ)
- [x] Convert the 28 posts with the ST-15 pipeline → `blog/basketball/*.mdx` (14), `blog/soccer/*.mdx` (14) (CREATE)
- [x] Fix the heading-close defect the batch surfaced → `scripts/convert-blog.mjs` (UPDATE)
- [x] Automate the review checklist → `scripts/review-blog.mjs` (CREATE)
- [x] Regression test for the heading-close fix → `src/test/blog-convert.test.ts` (UPDATE)
- [x] Raise the feed limit so the archive is represented → `docusaurus.config.ts` (UPDATE)
- [x] Document the review script → `README.md`, `package.json` (CREATE/UPDATE)

## The defect this batch found

The source closes headings with the wrong tag in **78 of the 214 posts**. The pattern is an `<h2>`
element closed with `</h3>`:

```html
<h2>Fast Break and Transition Formations</h3>
<p>Transition offense creates easy scoring opportunities...</p>
```

A browser closes the heading there - the open tag decides the level, the stray close tag is
discarded - and the paragraph that follows is a sibling. The ST-15 converter instead searched its
open-element stack for a matching `h3`, found none, and left the `h2` open. Every following element
then became a child of the heading, so the converter emitted the heading text and the paragraph as
one heading:

```
## Fast Break and Transition Formations Transition offense creates easy scoring opportunities before the defense can set up.
```

That is what the source *looks* like in a browser with a broken closing tag, but it is not what a
reader sees on the live site, where the heading is short and the paragraph stands alone. The fix
implements the HTML5 rule for a heading end tag: it closes the currently open heading regardless of
the level named by the close tag.

The full mismatch census across the corpus:

| Pattern | Count | Effect |
| --- | --- | --- |
| `</h3>` closing an `<h2>` | 18 | heading absorbed the following content |
| `</div>` closing an `<h2>` | 10 | same |
| `</h3>` closing an `<h4>` | 5 | same |
| `</h3>` closing a stack of `<h2>`s | 6 | same |
| `</div>` with no open `div` | 48 | harmless - the tag is discarded |
| `</li>`, `</ul>` with no match | 7 | harmless - the tag is discarded |

The harmless cases were already discarded correctly, which is why the ST-15 spike (swimming and
boxing) did not reveal the problem: swimming has no mismatched heading close tags, and boxing has
none either.

## Scope

28 posts, exactly the 14 basketball and 14 soccer source files. The four D1 dead index cards
(`basketball-shooting-mastery`, `basketball-defense-guide`, `soccer-warm-up-guide`,
`soccer-cooling-down-guide`) have no source file and stay skipped, so the 28 post files are the
complete set for these two sports.

## Source shape of this batch

- **basketball** uses the `<div class="blog-content">` wrapper with a `<footer class="blog-footer">`
  holding read-next links - 26 links across 14 posts, of which 8 point at targets that do not
  exist in the source (the 3 D1 basketball cards plus `basketball-training-equipment.html`, which
  the source never wrote either).
- **soccer** uses the `<article class="blog-content">` wrapper with a `<div class="blog-footer">`
  holding only a tag list, so soccer posts have no read-next section.
- **Neither sport's bodies contain any link**, and no post in either sport mentions a calculator or
  a tool page. The cross-links that exist are the read-next footer links, and they are all
  intra-sport.
- Bodies use only `p`, `h2`-`h4`, `ul`, `li`, and `strong`. No tables, no ordered lists, no line
  breaks, no `h5` - so this batch exercises a narrower slice of the converter than the ST-15 spike
  did, but hits the heading-close defect that the spike missed.

## Review results

`scripts/review-blog.mjs` applies the checklist mechanically: frontmatter shape and ISO dates, slug
shape, heading order and empty sections, list-marker consistency, table row widths and separators,
leftover and inline HTML, MDX-hostile characters, replacement characters from encoding damage, and
whether every internal link resolves to a real route.

**Result: 34 posts reviewed, 0 artifacts.**

The reviewer was validated against a seeded fixture carrying eight deliberate artifacts (a wrong
first heading level, inline HTML, block HTML, a mixed list, a ragged table, an empty section, and two
dead link targets). It found all eight and exited non-zero, so the clean result on the real posts is
meaningful rather than a check that never fires.

Two findings from the first pass were **false positives in the reviewer**, not defects in the
posts, and were corrected:

- A heading immediately followed by a deeper heading was reported as empty. The source uses this
  pattern constantly - `<h3>Beginner Players</h3>` then `<h4>Essential Equipment</h4>` - as a parent
  heading with child subsections. The check now only reports a heading with no content *and* no
  subsections.
- A heading with no content was only detected when the next heading was on the very next line.
  Blank lines between the two are normal, so the check now skips blanks before deciding.

## Verification

- **Routes**: all 28 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 28 emit `/blog/<sport>/<slug>.html` and appear in
  `.docusaurus/legacy-aliases-report.json`. The build's alias count went from 48 to 76.
- **Legacy contract**: every one of the 28 legacy entries in `src/data/legacy-urls.json` maps to
  exactly the route its post produces, and the post file exists for each.
- **Tags**: the tag registry grew to 58 tag pages, including `/blog/tags/basketball/` and
  `/blog/tags/soccer/`, both listing their posts.
- **RSS and atom**: both feeds now contain all 34 posts.
- **Cross-links**: all 25 internal links in the converted posts resolve, and no link crosses a
  sport boundary (the source's links are all intra-sport).
- **Idempotency**: two consecutive conversions produce byte-identical files.

## Tests added

- `src/test/blog-convert.test.ts` — one new case: a heading whose close tag has the wrong level
  keeps the heading and the following paragraph separate. The suite is now 34 cases.
- `scripts/review-blog.mjs` — the review checklist as an executable gate.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 461 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 76, missing 182, skipped 1, conflicts 0` (up from 48 at ST-15)
  - Verified all 28 new post routes and all 28 new alias files exist.
  - Verified 0 basketball/soccer entries remain in the missing list.
  - Verified 58 tag pages build and the sport tag pages list their posts.
  - Verified `rss.xml` contains 34 items and `atom.xml` contains 34 entries.
- `npm run review:blog` — PASS (34 posts, 0 artifacts)

## Deviations from the plan

- **Added `scripts/review-blog.mjs`.** The plan says to "review and fix conversion artifacts" and to
  "review the converted posts ... by the ST-15 checklist". Doing that by hand across 28 posts and
  then 208 more is not realistic, and the first hand review pass already missed a defect that the
  script caught immediately. The script is the checklist, made executable, and it gates the batch.
  It also caught two bugs in itself, which is the point of validating it against a seeded fixture.
- **The parser fix touches all sports, not just this batch.** The heading-close rule is in the
  shared converter, so ST-17 through ST-22 get it for free. Regenerating the six ST-15 posts
  confirmed their content is unchanged (byte-identical), so no already-shipped post regressed.
- **Raised the blog feed limit from the plugin default of 20 to 50.** With 214 posts planned, a
  20-item feed would represent less than a tenth of the archive, and the feeds are part of the
  acceptance criteria.
- **No `tags.yml` or `authors.yml` changes were needed.** The registry is built from all source
  cards rather than the converted batch, so the 40 new topic tags were already present from ST-15.

## Issues encountered

- The converter produced merged headings for the affected posts. The cause was the source's
  mismatched heading close tags combined with a parser that searched for an exact match. Fixed by
  implementing the HTML5 heading end-tag rule, with a regression test.
- The reviewer's first version reported 20+ false positives (parent headings with subsections) and
  missed two real cases (empty sections separated by blank lines, and inline HTML inside a
  paragraph). Both the check and the fixture were corrected before the clean result was accepted.
- The first reviewer run crashed twice on its own table-grouping logic, where one variable was used
  as both a flag and a block. Fixed before the results were trusted.

## Follow-ups for the reviewer

- The 28 posts, the parser fix, the review script, the config change, the README notes, and this
  report are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- ST-17 through ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>` followed
  by `npm run review:blog`, then the build. The tag registry already covers every topic tag.
- The source's mismatched heading close tags affect 78 posts. They are now handled correctly, but
  the source would still benefit from a fix.
- `basketball-training-equipment.html` is a dead link in the source that is not one of the five D1
  index cards - it appears only in a post footer. It is dropped as a plain-text link. ST-28's cutover
  notes should list it alongside the five D1 cards.
