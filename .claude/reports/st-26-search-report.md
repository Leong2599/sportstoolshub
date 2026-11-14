# Implementation Report — ST-26 Search

**Plan**: `docs/tickets/sportstools-migration.md` (ST-26)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Shipped local search without a third-party service. Spike 4 evaluated
`@easyops-cn/docusaurus-search-local` and rejected it on hard evidence; the ticket's fallback path
was implemented instead: a search index generated at build time from the tool catalog and the blog
frontmatter, committed as `src/data/search-index.json`, and matched in the browser by a small
scoring function. The home hero search is now an index-backed dropdown scoped to the tools, `/search`
searches everything with a scope switch, and the blog offers "Search the blog" above every post list.
No page makes a runtime request for its index.

## Tasks completed

- [x] Spike 4: install and build the search plugin (SPIKE)
- [x] Record the spike evidence and fall back (DECIDE)
- [x] Generate the index from the catalog and the blog -> `scripts/build-search-index.mjs`, `src/data/search-index.json` (CREATE)
- [x] Query and ranking logic -> `src/data/search.ts` (CREATE)
- [x] Shared result list -> `src/components/search/*` (CREATE)
- [x] Home hero search, scoped to the tools -> `src/components/home/HomeHero.tsx` (UPDATE)
- [x] Site-wide search page with scopes -> `src/pages/search.tsx`, `src/pages/search.module.css` (CREATE)
- [x] Blog search entry point -> `src/theme/BlogPostItems/*` (CREATE)
- [x] Remove the ST-24 inline filter -> `src/components/home/toolSearch.ts` (DELETE)
- [x] Tests for the index, the queries, the page, the hero and the swizzle (CREATE/UPDATE)
- [x] Verify: no runtime requests, no broken links, browser checks (VERIFY)

## Spike 4: the plugin is rejected

The plugin installs and its options are accepted, but it cannot build this site:

- **`indexCategories` is not a real option.** The validation rejects it: `indexCategories` exists only
  in the fork's docs, not in `0.55.3`'s schema (`parseFrontMatter`/`searchResultLimits` are the real
  knobs).
- **The build fails without a docs plugin.** `SearchBar` calls `useActiveVersion()` from
  `@docusaurus/plugin-content-docs/client`; the site sets `docs: false`, so the build dies with
  `Docusaurus plugin global data not found for "docusaurus-plugin-content-docs" plugin with id "default"`.
  A `src/theme/SearchBar` swizzle returning `null` gets past it, but that is a workaround for a
  component the site cannot use anyway.
- **The generated payload is 9.79 MB.** With the swizzle in place the build writes
  `build/search-index.json` at **9,790,732 bytes**, and `dist/client/client/theme/worker.js` loads it
  with `fetch()` on the first keystroke. That is a 10 MB runtime request, which fails the ticket's
  "no network requests at runtime" criterion and would be unusable on a phone.

Decision: uninstall the plugin (`npm uninstall`), restore `package-lock.json` and `docusaurus.config.ts`,
remove `src/theme/`. `package.json` and both lock files are back to the pre-spike state.

## The fallback: a committed, build-time index

`scripts/build-search-index.mjs` builds the index from the two sources of truth:

- **Tools** come from `src/data/tools.ts`, imported dynamically so the script and the site share one
  catalog. These entries carry `title`, `description`, `url`, `category`, `categoryLabel`.
- **Articles** come from `blog/**/*.mdx`. The script parses the frontmatter with a small line reader
  (title, description, slug, date, tags) and resolves tag slugs to labels through `blog/tags.yml`.
  These entries carry `title`, `description`, `url`, `categoryLabel`, `tags`, `date`.

Output: `src/data/search-index.json`, **41 tools + 214 articles**, 95,308 bytes, one entry per line so
diffs stay readable. `npm run generate:search-index` regenerates it, and a test fails if the committed
file drifts from a fresh build, so the index cannot silently go stale.

The JSON is imported only by `src/data/search.ts`, which the hero and the search page use; the two
page chunks each carry it. Current cost: 115.8 KB raw / **25.7 KB gzipped** for the home chunk
(index included). See "Deviations" for the duplication note.

## Query behaviour

`searchSite(query, scope, limit)` normalises case and punctuation, splits the query into tokens, and
requires **every** token to match somewhere in the entry. Scoring favours, in order: exact title,
title prefix, title substring, metadata (tags + category label), description. Ties keep catalog
order, so the same query always returns the same ranking. The scope is `all`, `tools` or `articles`.
An empty query returns `[]` and the UI shows guidance instead of an error.

## The surfaces

- **Home hero** (`src/components/home/HomeHero.tsx`): typing opens a dropdown of up to 8 **tool**
  results, with a result count, a Clear button, an empty state, and a link to the full `/search`.
  `aria-controls`/`aria-live` wire the field to the panel.
- **Search page** (`/search`): reads `?q=` and `?scope=` so a search can be shared, has a scope
  switch (`Everything` / `Tools` / `Articles`) with `aria-pressed`, a live result count, the shared
  result list, a usable empty state and a fallback link to `/#tools`. It renders inside `<Layout>`,
  so the navbar, footer and head tags are present.
- **Blog**: a `@theme/BlogPostItems` swizzle wraps the original component and prepends a
  "Search the blog" link to `/search?scope=articles`. It appears on the blog index and on every tag
  page, and leaves the post rendering untouched.

The ST-24 inline grid filter (`toolSearch.ts`) is deleted: one search implementation now serves the
hero, the search page and the blog entry point.

## Verification

- **Spike evidence**: build failure log and the 9,790,732-byte index are described above; the plugin
  and its generated index are gone from the tree.
- **Index coverage**: 41 tool entries (`41` unique `/tools/*` URLs) and 214 article entries
  (`214` unique `/blog/*` URLs). Every URL maps to an existing `src/pages/tools/*.mdx` or
  `blog/**/*.mdx` file (asserted in `src/data/search.test.ts`).
- **Freshness**: `src/test/search-index.test.ts` regenerates the index in-process and compares it
  byte-for-byte with the committed file.
- **Home search (browser)**: `swim pace` -> "1 tool" -> Swim Pace Calculator; `calculator` -> "8
  tools"; a query with no tool hits shows "No matching tools"; article URLs never appear.
- **Search page (browser)**: `/search?q=swimming&scope=articles` -> 15 results, all `/blog/*`,
  Articles pressed; switching to Everything -> 17 results mixing `/blog/*` and `/tools/*`;
  `/search?q=unicorn` -> "0 results" with the empty state and the tools fallback link.
- **Blog (browser)**: `/blog` and `/blog/tags/adult-swimming` both render "Search the blog" with
  `href="/search?scope=articles"`.
- **No runtime requests**: on `/` and `/search`, `performance.getEntriesByType('resource')` reports
  **0 external** URLs and **0** requests for `search-index`; the index ships inside the page bundle.
- **No broken links**: 936 built HTML files, 54,951 internal hrefs, **0 missing**.
- **Mobile (390x844)**: the hero dropdown stays inside the viewport (right edge 355 of 390).
- **Sitemap**: `/search` is listed; the sitemap holds 676 URLs.
- **Head tags**: `/search` renders `Search | Sports Tools Hub` and the search description.

## Tests added

- `src/data/search.test.ts` - 13 cases: index coverage and uniqueness, catalog parity, URLs map to
  real files, query normalisation, empty query, tool/article matching, ranking, all-tokens rule,
  scoping, limit, scope list.
- `src/test/search-index.test.ts` - 2 cases: the committed index matches a fresh build; it holds every
  tool and every post.
- `src/pages/search.test.tsx` - 5 cases: the pre-query state, combined search, the scope switch, URL
  parameters, the empty state.
- `src/theme/BlogPostItems/index.test.tsx` - 2 cases: the link renders above the list; the original
  list still renders.
- `src/components/home/HomeHero.test.tsx` - rewritten (6 cases) for the no-prop dropdown: content,
  open-on-focus, matching results, tools-only scoping, empty state, link to `/search`.
- `src/components/home/ToolGrid.test.tsx` - the query-filter cases replaced by the empty-catalog case.

The suite is now 104 files / 533 tests (was 101 / 517).

## Validation results

- `npm run typecheck` - PASS
- `npm run test:run` - PASS (104 files, 533 tests)
- `npm run build` - PASS
  - `[legacy-aliases] emitted 258, missing 0, skipped 1, conflicts 0`
  - 936 HTML files, 54,951 internal hrefs, 0 missing
- `npm run generate:search-index` - reproduces the committed file byte-for-byte, no warning.

## Deviations from the plan

- **The plugin is not used.** The ticket allowed either outcome; Spike 4 failed on a docs-plugin
  dependency and on a 9.79 MB runtime fetch, so the fallback shipped. The decision and the numbers
  are recorded above and in `architecture.md` (Spike 4 *Outcome*, and Missing piece #9).
- **The index is committed, not generated into `build/`.** This follows the `src/data/legacy-urls.json`
  precedent: a generated artifact that is checked in, with a staleness test. It keeps the build
  dependency-free and makes the index reviewable in a diff.
- **The home hero search changed shape.** ST-24 had an inline filter of the card grid; the hero now
  shows a dropdown of index hits scoped to tools. ST-24's report anticipated this handoff.
- **The blog entry point is a `BlogPostItems` swizzle**, not `BlogSidebar`/`BlogListPage`. Wrapping
  the original component is 19 lines instead of copying theme code, and it covers both the blog index
  and the tag pages in one place.
- **The index is duplicated across two page chunks** (home and `/search`), because Docusaurus does not
  hoist shared app modules between pages by default. Cost is 25.7 KB gzipped per page, and a
  `splitChunks` cache group could share it if the duplication ever matters.

## Issues encountered

- The first serialiser emitted a trailing comma before the closing brace, which broke JSON parsing in
  Vitest (`trailing comma at line 261`). Fixed by joining the sections instead of appending commas.
- `userEvent.type` focuses the element, so the "closed until focused" test had to set the value with
  `fireEvent.change` to keep the panel shut.
- `normalizeSearchText` left a trailing space after stripping trailing punctuation; it now trims.

## Follow-ups for the reviewer

- The work is uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then
  `piv-review-pr`.
- **`pnpm-lock.yaml` is out of date.** `npm install`/`npm uninstall` during the spike touched only
  `package-lock.json`. ST-27 plans to use `npm ci`, so `package-lock.json` is the CI lock file; the
  pnpm lock should be regenerated or removed when the toolchain is settled.
- **The source's search UI is replaced, not ported.** The legacy home page filtered the tool cards
  inline from `#searchInput`. The rebuild keeps the same input and placement but searches the index,
  so it also finds blog articles.
- **`/search?q=` now matches the source's own structured data.** The legacy home page declared a
  `SearchAction` targeting `https://sportstoolshub.com/search?q={search_term_string}`, a page the
  source site never had. The new `/search` page accepts exactly that parameter, so the schema is
  finally truthful. The `WebSite`/`SearchAction` JSON-LD block itself is not emitted by the rebuild
  yet - a separate, deliberate SEO change.
- **Missing piece #10 (deployment)** is the only one left; ST-27 targets it.
