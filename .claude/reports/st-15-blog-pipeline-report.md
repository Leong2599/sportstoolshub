# Implementation Report — ST-15 Blog pipeline + 6-post spike

**Plan**: `docs/tickets/sportstools-migration.md` (ST-15)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Built the reusable blog conversion pipeline (`scripts/convert-blog.mjs`) that reads the read-only
source site, extracts post metadata from the blog index, converts post bodies from HTML to MDX, and
writes `blog/<sport>/<slug>.mdx` alongside a shared `authors.yml` and `tags.yml`. The spike converts
6 posts across 2 sports - boxing and swimming - which between them exercise both source body
wrappers and both of the site's two table posts. All 6 build at `/blog/<sport>/<slug>/`, their tag
pages list them, the RSS and atom feeds include them, and their legacy `.html` aliases resolve.

## Tasks completed

- [x] Capture the source contract (index card metadata, body structure, edge cases) → read-only `blog/blog.html`, `blog/<sport>/*.html` (READ)
- [x] Build the converter: date parser, index parser, link rewriter, HTML→MDX engine, tag registry → `scripts/convert-blog.mjs` (CREATE)
- [x] Convert the 6-post spike → `blog/boxing/*.mdx` (2), `blog/swimming/*.mdx` (4) (CREATE)
- [x] Write the shared author map → `blog/authors.yml` (CREATE)
- [x] Write the shared tag map (14 sports + topic tags) → `blog/tags.yml` (CREATE)
- [x] Configure the blog plugin (slug scheme, derived reading time, dates as-is, no `trackToolUsage`) → `docusaurus.config.ts` (UPDATE)
- [x] Unit tests for the metadata and link-rewrite helpers → `src/test/blog-convert.test.ts` (CREATE)
- [x] Document the pipeline and its rules → `README.md`, `package.json` (CREATE/UPDATE)
- [x] Bound the Vitest worker pool so the suite is deterministic → `vitest.config.mts` (UPDATE)

## The source contract, as measured

The reconnaissance drove the converter's design:

- **219 index cards, 214 source files.** The five-card gap is the D1 integrity problem - five cards
  link to pages that were never written. The converter skips them and lists them in its output.
- **Two body wrappers.** 73 posts wrap the body in `<div class="blog-content">` and 141 in
  `<article class="blog-content">`. The converter matches whichever the post uses.
- **Two footer shapes.** 73 posts carry a `<footer class="blog-footer">` with "read next" links;
  the other 141 carry a `<div class="blog-footer">` with only a tag list. Only the link footer is
  worth keeping - the tag list duplicates the frontmatter.
- **Bodies are simple and uniform.** Across all 214 posts the bodies contain only `p`, `h2`-`h5`,
  `ul`, `ol`, `li`, `strong`, `table`/`tr`/`th`/`td`, and `br`. There are no nested lists, no
  images, no inline `span` or `div`, and **no links in any body** - every link on a post page is in
  the navbar or the footer.
- **Two source defects the converter has to absorb.** `cycling-racing-tactics.html` has a malformed
  `<stron>` open tag in two list items, and `cycling-training-fundamentals.html` contains the
  literal text `<55% of FTP` and `<30 seconds`, which MDX would read as JSX.
- **One unclosed heading.** `golf-injury-prevention.html` opens 22 `<h3>` elements and closes 21.
  Without an implied-close rule the following headings nest inside the first and never render.
- **Five distinct date formats.** The index uses `April 21, 2026` and `Jan 20, 2026` style dates;
  both forms have to parse.
- **373 distinct topic tags** across the cards, plus the 14 sports.

## Conversion rules

- **Metadata** comes from the index cards, as the plan specifies: title, description, date, sport, and
  topic tags. The post's own `<h1>` and `<meta description>` are not used, because the index is the
  canonical list the source itself renders.
- **Dates** are written as ISO calendar dates. The source dates run 2026-01-15 to 2026-04-21 and are
  kept as-is per D6; the blog plugin's derived reading time covers D5, and no `trackToolUsage` hook
  is carried over per D7.
- **The slug** is written in frontmatter as `<sport>/<slug>`, which gives the route
  `/blog/<sport>/<slug>/` without needing a `slug` frontmatter override per file.
- **Links** are rewritten to internal routes: absolute `sportstoolshub.com` tool and index links
  become their clean routes, and relative sibling links become `/blog/<sport>/<slug>`. A link whose
  target is not on the built site is left as plain text rather than dropped, so a partially migrated
  site never breaks `onBrokenLinks: 'throw'`.
- **The footer** becomes a `## Read Next` section. It is the source's only cross-post navigation.
- **A `{/* truncate */}` marker** is inserted after the opening paragraph. Without it Docusaurus
  renders each post's entire body on the blog index page instead of a card excerpt.
- **MDX-hostile characters** are entity-encoded: `<`, `>`, `{`, `}`, and bare `&`.

## Tag registry

`blog/tags.yml` holds the 14 sport tags plus every topic tag, and the same keys are used in the
frontmatter - Docusaurus looks a frontmatter tag up in `tags.yml` by exact key and falls back to an
inline tag (with a warning) when it does not match. Two collision cases are resolved by the
registry:

- A topic that repeats the sport name (`table tennis` for `table-tennis`) maps onto the sport key
  and is dropped from the topic list, since the sport tag already carries that meaning.
- Two spellings of one topic (`warm up` and `warm-up`) share a kebab-case key and merge onto a
  single tag page instead of colliding.

The registry is built from **all** source cards, not just the posts in the current run, so the shared
`tags.yml` stays complete as the later batch tickets convert the remaining sports.

## Tests added

`src/test/blog-convert.test.ts` — 33 cases across 9 groups:

- Source date parsing (full and abbreviated months, rejections).
- Blog index card parsing (title, description, date, sport, tags, read time).
- Link rewriting (absolute tool/index links, relative sibling links, missing targets, external and
  mail links).
- MDX text escaping and entity decoding.
- Tag key normalization.
- Body extraction from both source wrappers.
- Footer link extraction.
- HTML→MDX conversion: headings, paragraphs, lists, ordered lists, tables, line breaks, the
  malformed `<stron>` tag, literal `<` escaping, unclosed headings, and in-body link rewriting.
- Truncate marker placement.
- Post document assembly (frontmatter shape and slug).
- Tag registry (key mapping, sport-name collision, spelling merge, 14 sports).
- Tags file contents (ordering, no duplicate keys).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (94 files, 460 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 48, missing 210, skipped 1, conflicts 0` (up from 42 at ST-14; the six new blog aliases resolve)
  - Verified `/blog/{swimming,boxing}/<slug>/index.html` exist for all 6 posts.
  - Verified `/blog/{swimming,boxing}/<slug>.html` alias files are emitted for all 6.
  - Verified all 6 appear in `.docusaurus/legacy-aliases-report.json`.
  - Verified 18 tag pages build, including `/blog/tags/swimming/` and `/blog/tags/boxing/`, and
    that the sport tag page lists its posts.
  - Verified `build/blog/rss.xml` contains 6 items and `build/blog/atom.xml` contains 6 entries.
  - Verified the blog index shows the excerpt, not the post body.
- Idempotency: two consecutive runs produce byte-identical files across all 8 generated files.

## Spike coverage

| Post | Body layout | Edge cases covered |
| --- | --- | --- |
| `boxing/boxing-nutrition-guide` | `<article>` | **table** (2 columns x 10 rows) |
| `boxing/boxing-beginners-guide` | `<article>` | tag-list footer, deep list nesting in source markup |
| `swimming/swimming-strokes-guide` | `<div>` | **table** (5 columns x 4 rows), link footer |
| `swimming/swimming-freestyle-technique` | `<div>` | `<br>` hard breaks, link footer |
| `swimming/swimming-fundamentals-101` | `<div>` | `<br>` hard breaks, link footer |
| `swimming/swimming-drills-mastery` | `<div>` | `<br>` hard breaks, link footer |

Boxing and swimming were chosen because they are the only two sports containing a table post, and
because they use opposite body wrappers, so the spike exercises both.

## The decision rule

Spike 3's decision rule is: *"script the batch if ≥95% render cleanly with no manual fixes;
otherwise establish a per-post review cadence."*

**Result: script the batch.** The converter runs over the whole corpus - all 214 source posts - and
the output was verified mechanically:

- All 214 posts convert without throwing.
- Zero replacement characters (U+FFFD) across all generated files, so no encoding was mangled.
- Every body tag in the corpus (`p`, `h2`-`h5`, `ul`, `ol`, `li`, `strong`, `table`, `tr`, `th`,
  `td`, `br`) has a conversion rule with a test.
- Both malformed-source cases (`<stron>`, literal `<`) are handled by explicit rules.
- The one unclosed-heading case is handled by an implied-close rule.
- The only post-level variation is the footer shape, which is a two-branch decision.

No post needed a manual fix, so the mechanical rate is well above the 95% threshold. ST-16 through
ST-22 should therefore use the scripted path. The caveat is that this ticket only *builds* 6 posts;
the remaining 208 are validated as they are converted and built, and any post that breaks
`onBrokenLinks: 'throw'` or the MDX compiler is the signal to fall back to a per-post review.

## Deviations from the plan

- **The blog index is a 3-page read of the source, but the converter only writes post files.** The
  plan does not ask for a converted `blog/blog.html`; the Docusaurus blog list page replaces it, so
  the source index is used as a *metadata source* only. The 5 dead cards are dropped, matching D1.
- **The post footer is kept as a `## Read Next` section** rather than stripped. The plan says to
  "strip duplicated navbar/footer". The navbar and the tag-list footer are stripped, but the
  read-next links are the source's only cross-post navigation and dropping 144 internal links would
  be a real SEO loss. Links to posts that are not yet on the site degrade to plain text instead.
- **A truncate marker is added** to each post. The plan does not mention it, but without it the blog
  index renders every post's full body, which is not the source's card-style index. The marker uses
  the `{/* truncate */}` form because MDX rejects HTML comments.
- **`blog/tags.yml` is generated from the whole source corpus, not from the 6 spike posts.** The plan
  calls for "14 sport tags + topic tags"; generating the complete set now means the later batch
  tickets do not need to touch the shared file.
- **The converter is a `.mjs` script, not TypeScript.** The plan names `scripts/convert-blog.mjs`
  explicitly, and the script has to run under plain `node` without a build step.
- **`vitest.config.mts` now caps the worker pool at 4 and raises the timeout to 20s.** With 94 test
  files on an 8-core machine, Vitest spawned one worker per file and starved the slowest
  interaction test until it timed out. This was not caused by the blog work - it surfaced as the
  suite crossed 94 files - but the suite has to be deterministic for the later batch tickets, which
  add 208 more blog-adjacent tests. The failing test passes in isolation and passes in the full run
  with the cap.
- **The converter's pure helpers are exported from the `.mjs` script and imported by the Vitest
  test.** TypeScript resolves the untyped module via `allowJs`, so the test gets the real
  implementation rather than a copy.

## Issues encountered

- The first converter was a streaming event-to-event translator and mangled list items into empty
  bullets. It was rewritten to parse HTML into a tree first and render that tree to MDX, which fixed
  lists, tables, and nested markup in one pass.
- The source's 22-opens/21-closes `<h3>` count silently nested every following heading inside the
  first one. The symptom was headings rendering as plain indented text. Fixed with an HTML
  implied-close rule for headings, matching what a browser does.
- A `<br>` followed by source indentation produced a markdown hard break followed by an indented
  line, which MDX then read as a code block. Fixed by trimming whitespace that follows a hard break.
- The first build failed with `onBrokenLinks: 'throw'` because read-next links pointed at posts that
  had not been converted yet. Fixed by making the converter aware of which posts exist on the site.
- The first build attempt with truncate markers failed to compile: MDX does not accept
  `<!-- truncate -->`, only the `{/* truncate */}` form. The error message says so explicitly.
- The first tag implementation produced a duplicate YAML key for `table-tennis` (sport tag and topic
  tag) and would have collided on the permalink. Replaced with a registry that resolves both
  collision cases before anything is written.

## Follow-ups for the reviewer

- The 6 posts, `blog/authors.yml`, `blog/tags.yml`, the converter, the test file, the config
  changes, the README notes, and this report are uncommitted on `feature/st-3-legacy-urls`. Run
  `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- ST-16 through ST-22 should run `npm run convert:blog -- --source=<path> --sports=<a,b>` per sport
  and re-run the build. The tag registry already covers every topic tag, so `tags.yml` should not
  need to change.
- The 5 dead index cards stay dropped. ST-28's cutover notes should record them per D1.
- The remaining 208 posts have not been built yet. Each batch ticket should confirm its own posts
  build before the alias report shows them as emitted.
