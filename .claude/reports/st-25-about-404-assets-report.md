# Implementation Report — ST-25 About, 404, and static assets

**Plan**: `docs/tickets/sportstools-migration.md` (ST-25)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Shipped the last piece of the theme rebuild: a branded 404 page, the production static assets
(favicon set, social card image, hero photo), `static/CNAME`, `static/robots.txt`, and the head tags
that expose them. The About page and its legacy alias were already delivered in ST-23 and are
re-verified here. The open question D8 - whether `images/hero-1.jpg` is still used - is answered: it
is, the source home hero uses it, and the rebuild now uses it too.

## Tasks completed

- [x] Audit the source assets, the D8 image question and the orphan files (READ)
- [x] Move the brand assets in -> `static/img/*`, `src/assets/hero-1.jpg` (CREATE)
- [x] Publish the domain and the crawler rules -> `static/CNAME`, `static/robots.txt` (CREATE)
- [x] Build the branded 404 page -> `src/pages/404.tsx`, `src/pages/404.module.css` (CREATE)
- [x] Wire the social card, the favicon set and the keywords -> `docusaurus.config.ts` (UPDATE)
- [x] Put the source hero photo behind the home hero -> `src/components/home/HomeHero.module.css` (UPDATE)
- [x] Tests for the 404 page and the static assets -> `src/pages/404.test.tsx`, `src/test/static-assets.test.ts` (CREATE)
- [x] Audit every referenced asset, the fonts and the legacy aliases (VERIFY)

## The D8 audit

The source site has three images and a set of icons. The audit found what each one is for:

| Source file | Used by the source | Decision |
|---|---|---|
| `images/logo.png` | the nav and the footer brand | `static/img/logo.png` (ST-23) |
| `images/hero-1.jpg` | the home hero background (`styles.css`) | **still used** - bundled from `src/assets/` |
| `images/og-image.jpg` | the `og:image` meta tag | `static/img/og-image.jpg` |
| `favicon.ico`, `favicon-16/32/96x96.png`, `apple-icon-180x180.png` | the icon links in `<head>` | `static/img/*` |
| `manifest.json`, `browserconfig.xml`, `android-icon-*.png`, `ms-icon-*.png` | **nothing** - no page references them | not carried over |

So `hero-1.jpg` was not dead: the source home page paints it behind the hero. The rebuild now paints
the same photo behind the home hero, which closes the follow-up ST-24 left open.

The `manifest.json` and `browserconfig.xml` of the source are orphans - the source HTML never links
them. The web manifest is a "nice to have" for an installed PWA, not something the source used, so
it is not carried over; the same for the Windows tile icons, whose role the favicon set and the
`apple-touch-icon` cover.

**Template leftovers**: nothing to remove. `static/` held only the Docusaurus favicon, and that file
turned out to be byte-identical to the source's own `favicon.ico`, so the brand favicon was already
in place. `src/img/` does not exist.

## The static assets

```
static/CNAME                      sportstoolshub.com
static/robots.txt                 ported from the source, Sitemap: https://sportstoolshub.com/sitemap.xml
static/.nojekyll                  already present (ST-1)
static/img/favicon.ico            already present, identical to the source
static/img/favicon-16x16.png      copied from the source
static/img/favicon-32x32.png      copied from the source
static/img/favicon-96x96.png      copied from the source
static/img/apple-icon-180x180.png copied from the source
static/img/logo.png               already present (ST-23)
static/img/og-image.jpg           copied from the source
src/assets/hero-1.jpg             copied from the source, bundled by the CSS module
```

Every copied file was checked against the source by SHA-256. Every file in `static/img/` is
referenced: the four icons by `<link>` tags, the logo by the navbar, the social image by `og:image`.

### The hero photo is bundled, not copied

A `url()` in a CSS module makes webpack resolve and bundle the file, and Docusaurus puts the static
directories in webpack's `resolve.roots` so that `url("/img/hero-1.jpg")` resolves. With the photo in
`static/`, the build shipped **two** copies of the 283 KB image: the bundled one and the static one
that nothing referenced. The photo therefore lives in `src/assets/` and is imported by the CSS
module, so the build ships it once, content-hashed and baseUrl-correct.

## The 404 page

`src/pages/404.tsx` renders inside `<Layout>`, so it carries the full chrome - navbar, footer and
head tags. It shows the brand logo, the 404 code, a short explanation, two calls to action (back to
home, browse the tools) and the three catalog categories, linked to their home page anchors. The
category links come from `buildCategories()`, so they follow the catalog.

The links it uses are ordinary Docusaurus links, so they are covered by the build's broken-link and
broken-anchor checks.

## Verification

- **`/about/`** renders with the source copy (hero, mission, what we offer, tool categories, values,
  call to action) - `200`, `<h1>About Sports Tools Hub</h1>`.
- **`/about.html`** and **`/tools/about.html`** resolve through the ST-3 alias layer to `/about` with
  the canonical link `https://sportstoolshub.com/about` - `200`.
- **404**: `docusaurus serve` answers an unknown path with **404** and the branded page, navbar and
  footer included.
- **No 404s for referenced assets**: 719 local asset references across the built HTML and CSS; every
  one exists in the build. The only unresolved references are the four anchor-only links
  (`/#tools` and the three category anchors), which resolve as ids on `/`.
- **No third-party font request**: no `fonts.googleapis.com` or `fonts.gstatic` in the built HTML; the
  31 Inter woff/woff2 files are self-hosted under `/assets/fonts/`.
- **No third-party runtime request**: the only external URLs in the built HTML are XML namespaces and
  `sportstoolshub.com` itself. The source home page's "featured on" badge strip - eight badge images
  from findly.tools, dofollow.tools, twelve.tools, justsimple.tools, acidtools.com, firstlook.tools,
  startupbenchmarks.com and mylaunchstash.com - is not carried over, because the architecture asks
  for no third-party runtime requests. It was already absent from the ST-24 rebuild.
- **Head tags**: `<link rel="icon" ...>` for the three PNG sizes, `<link rel="apple-touch-icon">` for
  iOS, the `.ico` from the `favicon` option, `og:image` and `twitter:image` pointing at
  `https://sportstoolshub.com/img/og-image.jpg`, and the source's keyword list.
- **Browser (1280x900)**: the hero shows the source photo under the brand overlay; the 404 page
  renders with the chrome; no console errors.

## Tests added

- `src/pages/404.test.tsx` - 3 cases: the branded content and the logo, the two calls to action, and
  the three category links pointing at the home page anchors.
- `src/test/static-assets.test.ts` - 5 cases: the brand images exist, `static/img/` holds no unused
  file, the CNAME carries the production domain, `.nojekyll` is present, and `robots.txt` points at
  the generated sitemap.
- `src/test/site-config.test.ts` - 1 new case: the favicon set head tags and the social card image.

The suite is now 101 files / 517 tests (was 99 / 508).

## Validation results

- `npm run typecheck` - PASS
- `npm run test:run` - PASS (101 files, 517 tests)
- `npm run build` - PASS
  - `[legacy-aliases] emitted 258, missing 0, skipped 1, conflicts 0`
  - `build/` contains `CNAME`, `robots.txt`, `.nojekyll`, `404.html` and the seven brand images.
  - The hero photo appears exactly once in the build.
  - Verified 719 local asset references, 0 missing.

## Deviations from the plan

- **The About page was not touched.** ST-23 already ported `/about/` as MDX, because ST-23's own
  acceptance criteria needed the route to exist for the navbar (a link to a missing route fails the
  build under `onBrokenLinks: 'throw'`). This ticket re-verifies it and leaves the content alone.
- **The hero photo lives in `src/assets/`, not `static/`.** A `url()` in the CSS module makes webpack
  bundle the file; with the photo in `static/` the build shipped two copies of it. Importing it from
  `src/assets/` keeps one copy and a content-hashed, baseUrl-correct URL.
- **No web manifest.** The source's `manifest.json` is never referenced by the source pages, so
  "manifest if used" resolves to no. The same goes for the Windows tile icons and
  `browserconfig.xml`.
- **`vitest.config.mts` gained a third alias** (`@theme/Layout`) so the 404 page can be rendered in a
  test, next to the `Link` and `Heading` stubs ST-24 added.

## Issues encountered

- The first build shipped the hero photo twice: once bundled by webpack and once as a static copy.
  The asset audit found it by comparing the SHA-256 of the two build outputs; the photo was moved to
  `src/assets/` and the build now contains one copy.
- The source's favicon turned out to be identical to the Docusaurus template's, so "remove unused
  template images" had nothing left to remove. The favicon set was completed rather than cleaned.

## Follow-ups for the reviewer

- The work is uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- **The theme rebuild is complete.** Missing pieces 6 (theme rebuild) and 8 (icon mapping) are done,
  together with 7 (brand CSS) and 11 (the duplicated footer heading). The remaining missing pieces
  are the search index (9) and the deployment (10).
- **Deployment (missing piece #10)** is the next step that needs `static/CNAME` and `robots.txt`:
  the GitHub Pages workflow that publishes `build/` is not in the repo yet.
- The source's "featured on" badge strip is intentionally dropped. If the directory badges matter
  for traffic, they are a separate, deliberate decision - they would add eight third-party requests
  to every page.
