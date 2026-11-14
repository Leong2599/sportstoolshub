# Implementation Report — ST-22 Blog batch: table-tennis + swimming

**Plan**: `docs/tickets/sportstools-migration.md` (ST-22)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ran the ST-15 pipeline over the table-tennis and swimming posts (31 posts), completing the blog
migration: all 214 source posts are now converted, built, and aliased. The ticket's criterion - verify
the table-tennis metadata in `blog/blog.html` maps to correct slugs and descriptions - holds for all 16
table-tennis cards. A corpus-wide parity check run across the finished blog also uncovered two more
source defects that earlier batches had not surfaced, both now fixed in the converter with regression
tests.

## Tasks completed

- [x] Audit the table-tennis and swimming source → `blog/table-tennis/*.html`, `blog/swimming/*.html` (READ)
- [x] Verify the table-tennis index metadata maps to correct slugs and descriptions (VERIFY)
- [x] Convert the 31 posts with the ST-15 pipeline → `blog/table-tennis/*.mdx` (16), `blog/swimming/*.mdx` (15) (CREATE)
- [x] Run the review checklist and heading parity check across the finished blog (VERIFY)
- [x] Run a corpus-wide content parity check over all 214 posts (VERIFY)
- [x] Fix the orphaned `<strong>` source defect the corpus check found → `scripts/convert-blog.mjs` (UPDATE)
- [x] Regression tests for the repair → `src/test/blog-convert.test.ts` (UPDATE)

## The table-tennis metadata criterion

The ticket notes that table-tennis is the first sport in the source index, so its cards are the ones a
reader sees first. All 16 table-tennis cards were checked against the source pages:

- **16 cards, 16 source pages, 16 correct slugs.** Every card's `href` maps to an existing source file
  and to the route the converted post produces.
- **Every title matches** the post page's own `<h1>`.
- **Every description matches** the card's summary text.
- The dates run April 21 to April 6, 2026, matching the index ordering.

One card deserved a closer look: `table-tennis-ping-pong-vs-tennis.html` initially looked like a
metadata mismatch. It is not - the source page's `<head>` writes its meta description as
`<meta name="description" content>` with the opening quote of the `content` attribute missing. The
**index card** carries the correct description, and the converter reads metadata from the index, so the
converted post is correct. The malformed tag is a source-page defect that does not reach the migration;
it is recorded here because the same defect exists in `swimming/swimming-history-guide.html` (the only
two in the corpus), and because it would break any future tool that read the page head instead of the
index.

## Source shape of this batch

table-tennis uses the `<article class="blog-content">` wrapper with a tag-only footer, so its posts have
no read-next section. Swimming uses the `<div class="blog-content">` wrapper with a link footer, and
holds the source's other table post (`swimming-strokes-guide`), 10 `<br>` line breaks, and the 8
mismatched heading close tags that the ST-16 fix already handles.

Swimming was only partially converted before this ticket - 4 of its 15 posts came from the ST-15 spike.
Converting the sport in full, as this ticket does, upgraded the cross-links: the read-next links in the
4 previously converted swimming posts were plain text while their targets were unconverted, and are now
real links.

## Two more source defects, found by a corpus-wide parity check

With the blog complete, the content parity check was run over **all 214 posts** rather than one batch at
a time, comparing every source block against the converted output. That surfaced two defects that the
per-batch checks had not reached.

**1. Orphaned `<strong>` closing tags - 5 occurrences in 3 posts.** The source writes
`<strong>Label:</strong>` in a few places as `<strong>Label:strong>`, dropping the `<` from the closing
tag. The browser then treats the rest of the list item as bold and shows the literal text
`Lew Alcindor (Kareem Abdul-Jabbar):strong>`. The converter reproduced that faithfully, so the port
had a visible `:strong&gt;` in the middle of a sentence. The converter now restores the bracket, and the
port renders `- **Lew Alcindor (Kareem Abdul-Jabbar):** Dominant center with skyhook`.

**2. List items with no enclosing list - 12 items in 3 posts.** Three posts have `<li>` runs with no
opening `<ul>`, because the previous list was already closed. The browser still renders them as
bullets; the converter was flattening them into plain paragraphs, losing the list structure. This
showed up most visibly in `cycling-training-fundamentals.mdx`, where four training-period items lost their
markers. The converter now keeps them as a list.

Both fixes are covered by regression tests and change exactly 5 previously converted posts.

## Content parity

Across the finished blog:

- **214 posts, 31,083 source blocks, 0 missing** once the comparison accounts for MDX escaping
  (`&lt;55%`), hard line breaks from `<br>`, ordered-list markers, and bold runs.
- **0 heading mismatches** against the browser's rendering of the source, across all 214 posts.
- **0 artifacts** from the review checklist.
- The 8 source-faithful heading level skips (7 in boxing, 1 in golf) are reported separately by the
  parity script rather than as conversion artifacts.

## Review results

**214 posts reviewed, 0 artifacts.**

## Verification

- **Routes**: all 31 posts build at `/blog/<sport>/<slug>/`.
- **Aliases**: all 31 emit `/blog/<sport>/<slug>.html`. The build's alias count went from 229 to 256.
- **Legacy contract**: all 214 blog entries in `src/data/legacy-urls.json` map to exactly the route their
  post produces, and the post file exists for each. **The blog's legacy coverage is complete.**
- **Remaining missing aliases**: 2, both `/about.html` and `/tools/about.html` → `/about`, which is the
  ST-25 about-page ticket's scope, not the blog's.
- **Feeds**: `rss.xml` and `atom.xml` each carry all 214 posts.
- **Sitemap**: 673 URLs, with 379 tag pages built.
- **Internal links**: 560 across the site, **0 broken**.
- **Idempotency**: two consecutive conversions produce byte-identical files across all 214 posts.

## Tests added

`src/test/blog-convert.test.ts` — 2 new cases for the inline-tag repair: a closing tag that lost its
`<` is restored, and well-formed tags are left alone. The suite is now 47 cases in that file, 474 in
total.

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 474 tests)
- `npm run review:blog -- --source=<path>` — PASS (214 posts, 0 artifacts)
- `npm run review:blog:headings -- --source=<path>` — PASS (214 posts, 0 heading mismatches)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 256, missing 2, skipped 1, conflicts 0` (up from 229 at ST-21)
  - Verified all 31 new post routes and all 31 new alias files exist.
  - Verified all 214 blog legacy entries resolve to their posts.
  - Verified 560 internal links across the site, 0 broken.
  - Verified `rss.xml` contains 214 items and `atom.xml` contains 214 entries.

## Deviations from the plan

- **The converter repairs two source defects rather than reproducing them.** The orphaned `<strong>`
  closing tags and the list items with no enclosing list are both cases where the source markup is
  broken and the browser's rendering is degraded. As with the ST-20 heading fix, the port keeps the
  content and its structure rather than reproducing the rendering bug. Both changes are covered by
  regression tests, and each affects a handful of lines.
- **The corrupted-markup repair is applied to the whole corpus**, not just this batch, so the 3 posts
  affected in earlier batches are corrected too. This is why 5 previously converted posts changed.

## Issues encountered

- The first corpus-wide parity comparison reported ~94 missing blocks, all of which turned out to be
  artifacts of the comparison itself: it concatenated a heading with the paragraph that followed it, and
  it did not account for MDX escaping, hard line breaks, ordered-list markers, or bold runs. The
  comparison was rewritten to compare block by block with the same parser the converter uses, which
  brought the real defects - the two above - to the surface.

## Follow-ups for the reviewer

- The 31 new posts, the 5 repaired posts, the converter fix, the tests, and this report are uncommitted
  on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- **The blog migration is complete.** ST-23 onward can work on the theme, and ST-28's parity check
  should treat the 214 blog aliases as covered.
- Two source pages have a malformed meta description tag (`table-tennis-ping-pong-vs-tennis.html` and
  `swimming-history-guide.html`). They do not affect the migration, since the converter reads metadata
  from the index, but they could be fixed upstream.
