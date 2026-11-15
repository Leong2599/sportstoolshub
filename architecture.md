# Architecture — Sports Tools Hub: HTML site → Docusaurus

Status: accepted direction, pre-implementation
Date: 2026-11-11
Source: `C:\Users\user\Documents\Production\sport_tools` (live at https://sportstoolshub.com, GitHub Pages)
Target: this repo — Docusaurus 3.10.2 scaffold

---

## Problem & goals

Sports Tools Hub is 258 hand-coded HTML pages: a homepage, an about page, 41 client-side sports/fitness
calculators, a blog index, and 214 articles across 14 sports. Every page duplicates its own nav and footer,
calculator logic is split between ~560 KB of inline `<script>` and a 92 KB shared `script.js`, and content
authoring means editing raw HTML.

The goal is to move the site onto Docusaurus **without losing organic search position or the familiar look**,
and to leave a codebase that can grow (new tools, new articles, shared layout) without hand-copying markup.

Every decision below is judged against three things, in order:

1. **No SEO regression.** All 258 currently-indexed URLs keep resolving to the same content.
2. **Visual and behavioral parity.** A returning visitor sees the same site; a calculator returns the same numbers.
3. **A maintainable end state.** Content in MDX, calculations in typed, tested modules, one nav/footer/catalog.

Greenfield/brownfield: the target repo has no content yet, but the *product* is a live, indexed site. This is
treated as a **brownfield migration into a greenfield codebase** — we are not inventing a site, we are
re-housing one.

---

## Approaches considered

### A. Full Docusaurus-native rebuild
All 41 calculators rewritten as React/TypeScript components, all 214 articles converted to MDX, home/about/blog
rebuilt as Docusaurus pages. **Trade-off:** cleanest end state and best authoring experience, but the largest
effort and the highest risk of calculators silently returning different results.

### B. SEO-safe shell (wrap legacy calculators)
Docusaurus owns layout, nav, home, about and blog; each existing calculator page's markup and inline JS is
mounted inside a thin React wrapper. **Trade-off:** fastest and near-zero behavior risk, but leaves ~560 KB of
untested legacy JS in the tree and two styling systems, indefinitely.

### C. Static passthrough + incremental
Drop the current HTML into `static/` for immediate URL parity, rebuild pages one at a time.
**Trade-off:** zero risk and zero immediate value; the site stays split for months.

### Recommendation
**A, executed behind a legacy-URL alias layer and a formula-parity harness.** The user chose the full port
because the value of the migration is the clean end state — wrapping legacy JS would defer that value and
leave the hardest code untested. The two risks that make A dangerous are addressed directly rather than
avoided: URL risk by the alias layer (below), behavior risk by extracting formulas into pure functions with
golden tests captured *before* each port.

A staged rollout is part of the approach: build the whole site on a preview host, verify URL/content parity
against the live site, then cut DNS over.

---

## Recommended approach

The site becomes a Docusaurus app with four content surfaces, all driven by one tool catalog:

- **Home** (`/`) — hero, search over the catalog, tool grid by category. Rebuilt as a React page.
- **Tools** (`/tools/<slug>/`) — one MDX page per calculator (SEO prose + an embedded React calculator
  component), 41 in total.
- **Blog** (`/blog/<sport>/<slug>/`) — Docusaurus blog plugin, 214 MDX posts, 14 sports as tags.
- **About** (`/about/`) — MDX.

Every legacy URL is preserved by a build-time alias layer: after Docusaurus builds its clean routes, a
`postBuild` plugin emits a physical `<old-path>.html` file for each legacy URL containing an instant
meta-refresh plus a canonical link to the new route. Old links keep resolving on GitHub Pages; search engines
consolidate on the clean canonical.

Calculator code is split in two: **pure formula modules** (`src/lib/calculators/*`) with Vitest golden tests,
and **presentational components** (`src/components/calculators/*`) built on a shared kit. MDX owns the copy.

---

## Key decisions

### Stack & libraries
- **Docusaurus 3.10.2 + React 19 + TypeScript (strict)** — already installed; sibling `pruneseo/` runs the same
  stack and is the local convention to follow.
- **Vitest** for formula unit tests and golden parity cases. New dev dependency; nothing else in the repo tests
  today.
- **lucide-react** for icons — already a dependency in `pruneseo`, tree-shaken SVGs, replaces the mojibake emoji.
- **`@easyops-cn/docusaurus-search-local`** for site search (candidate). Replaces the current tools-only custom
  search with a build-time index covering tools *and* blog. Compatibility with this exact Docusaurus/React
  version is unverified — see Spike 4; the fallback is a generated JSON index plus the existing custom search
  logic.
- **`@fontsource/inter`** (or a self-hosted woff2) instead of the Google Fonts `<link>`, removing a third-party
  runtime dependency and the render-blocking request.
- *Discipline:* no state manager, no component library, no CSS framework. The kit and CSS Modules are enough.

### URL & routing strategy
- Canonical URLs are Docusaurus clean routes: `/tools/<slug>/`, `/blog/<sport>/<slug>/`, `/about/`, `/`.
- `trailingSlash: true`, so the canonical form is the one GitHub Pages serves from `<route>/index.html`.
  GitHub Pages resolves an extensionless path to `<path>.html` when that file exists and only falls back to
  `<path>/index.html` otherwise, so `/tools/x` is the legacy alias file and `/tools/x/` is the page. The
  alias layer writes those `<route>.html` files, which makes the trailing-slash form the only one that can
  serve the page itself. (Before this was settled, the alias pointed at the extensionless form of its own
  route: every tool and blog URL refreshed into itself, forever.)
- A generated `legacy-urls.json` (old path → canonical URL) is the contract. It is derived from the source
  `sitemap.xml` plus the page inventory, with two known-bad entries corrected. **The build fails if any legacy
  URL has no target.**
- A `postBuild` plugin reads that map and writes alias HTML at each legacy `.html` path: instant
  `<meta http-equiv="refresh">`, `<link rel="canonical">` to the new route, and the new `<title>`. No `noindex` —
  canonical is the consolidation signal, and meta-refresh is treated as a redirect.
- The plugin models the host's resolution rules and refuses to write an alias that points at itself or
  shadows the route it redirects to; those are reported as `broken` and fail the strict build.
- Home and blog index need no alias for `/index.html` (the built home *is* `build/index.html`); `/blog/blog.html`
  and `/about.html` do get aliases.
- Trade-off accepted: aliases return 200, not 301. This is softer than a hosting-level redirect. If search
  equity loss is observed after cutover, the escape hatch is moving to a host with real 301s (Cloudflare/
  Netlify) — the same `legacy-urls.json` drives a `_redirects` file. Recorded in Open Questions.

### Data model
At the shape level, four entities and one taxonomy:

- **Tool** — `slug`, `title`, `description`, `category` (`fitness` | `performance` | `nutrition`), `legacyPath`,
  `icon` (lucide name), `component` (registry key). Lives once in `src/data/tools.ts` and powers the home grid,
  footer columns, search, related-tools links, and the legacy map. It replaces 41 hand-maintained card blocks and
  a footer that currently duplicates every tool (and repeats the "Performance Trackers" heading).
- **Tool page** — an MDX file whose frontmatter mirrors the catalog entry and whose body is SEO prose
  (description, "About X", considerations, limitations). The calculator is a component island inside it. This
  keeps copy editable without touching logic.
- **Blog post** — MDX frontmatter: `title`, `description`, `date`, `slug: <sport>/<article>`, `tags`
  (`[<sport>, <topic>]`), `authors`. Dates, descriptions and tags already exist in `blog/blog.html` and are the
  extraction source. The 14 sports become tag pages, giving category browsing plus archive/RSS/reading time for
  free.
- **Category** — not a stored entity; tool categories are a fixed union, sport categories are blog tags.

Storage is the filesystem (MDX + TS data). No database, no CMS, no API. `static/` holds three images (logo,
hero, og), the favicon set, `CNAME`, `robots.txt`, `.nojekyll`.

### Calculator architecture
Two layers, strict separation:

- **`src/lib/calculators/<tool>.ts`** — pure functions: unit conversions, formula, thresholds/categorisation,
  rounding. No DOM, no React, no globals. Input and result are typed.
- **`src/components/calculators/<Tool>.tsx`** — form and results UI built from a small kit: `NumberField`,
  `UnitField` (kg/lbs, cm/ft-in), `ChoiceField`, `ResultCard`, `ResultRow`, `ShareButton`, `PrintButton`, and a
  `useCalculator` hook for validation/state. Components call the pure functions; they do not contain formulas.

Not a schema-driven universal engine. The 41 tools are too heterogeneous — quizzes, optimizers, planners and
trackers have bespoke result shapes — and a config DSL would become the hardest thing to maintain. The kit makes
the *common* cases cheap while letting odd tools stay odd.

Parity rules: same formulas, same rounding, same category thresholds, same validation bounds and messages, same
scroll-to-results and share/print behavior. Inputs are health data and **never leave the browser** — no
persistence beyond the existing theme preference, no network calls.

### Styling & design system
- Preserve the brand: Inter, the `#3b82f6` primary palette, the card/form/result layout.
- Map brand tokens onto Infima CSS variables in `src/css/custom.css`; port the calculator/tool styles as **CSS
  Modules scoped under a page wrapper class** so Infima's global element styles cannot bleed into the forms.
- Rebuild navbar and footer as Docusaurus theme components fed by the catalog — one nav, one footer, no
  duplication.
- **Disable dark mode in v1** (`colorMode.disableSwitch: true`, `respectPrefersColorScheme: false`). The source
  is light-only; shipping an auto dark theme would break visual parity. Dark mode becomes a follow-up.
- Icons come from lucide with a per-tool mapping, replacing corrupted emoji.

### Search
Replace the tools-only client search with a build-time index over tools and blog. The home hero search stays in
place visually but queries the index and scopes results to tools. Blog gets its own search entry point. If the
local-search plugin does not support this Docusaurus/React version, fall back to a JSON index generated from the
catalog plus blog metadata and keep the existing client search logic.

### Build & deploy
- GitHub Pages stays. The workflow changes from "upload the repo" to `npm ci` → `npm run build` → upload
  `build/`.
- `static/CNAME` = `sportstoolshub.com`; `static/.nojekyll` retained.
- `onBrokenLinks: 'throw'` in CI. Sitemap (generated by the classic preset) is verified against
  `legacy-urls.json`: every legacy URL resolves, every canonical page is listed, no alias appears in the sitemap.
- `robots.txt` is ported to `static/`, with its `Sitemap:` line pointing at the new generated sitemap.
- Staged cutover: full build deployed to a preview URL first; a scripted parity check (URL status, title,
  canonical, h1) runs against all 258 legacy URLs; only then is DNS/production switched.

### Boundaries & contracts
- **No backend.** No auth, no database, no secrets, no server functions. Everything is static output.
- **Privacy is a feature.** Health inputs are processed in-browser only. No analytics is installed today (the
  `gtag` calls are commented out) and none is added by this migration unless asked.
- **Third parties:** after fonts are self-hosted, there are none at runtime. Build-time dependencies only
  (npm, GitHub Actions).
- **Build-time contracts:** (1) complete legacy-URL coverage, (2) frontmatter schema valid for every tool and
  post, (3) no broken internal links, (4) golden tests green.
- **Content import boundary:** source HTML is read-only input; the migration does not modify `sport_tools`.

---

## Missing pieces

What has to exist that does not yet:

1. **Legacy URL inventory** — `legacy-urls.json` derived from the source sitemap and page inventory, with
   `/tools/about.html` corrected to `/about.html` and the missing `golf/golf-equipment-guide.html` resolved.
2. **Tool catalog** — 41 entries (title, description, category, icon, legacy path, component key), extracted
   from `index.html` and each tool page.
3. **Calculator kit** — the shared field/result/hook primitives described above.
4. **41 × three artifacts** — formula module, React component, MDX page.
5. **Blog conversion pipeline** — metadata extracted from `blog/blog.html` into frontmatter; 214 HTML bodies
   converted to MDX (rewrite absolute `sportstoolshub.com` links, strip the duplicated nav/footer, keep the
   logo-only `<img>` out of content); `authors.yml` and `tags.yml`; 2 posts contain tables and need review.
6. **Theme rebuild** — navbar, footer, home page (hero + catalog grid + search), about page, 404.
7. **Brand CSS integration** — tokens, scoped tool/blog styles, self-hosted Inter.
8. **Icon mapping** — 41 tools → lucide icons (the source emoji are corrupted).
9. **Search index** — plugin or generated JSON. *(done in ST-26: generated JSON, see Spike 4)*
10. **Deployment** — `CNAME`, updated workflow, preview environment, parity-check script.
11. **Integrity fixes carried into the migration** — 5 blog cards link to files that do not exist
    (`basketball-shooting-mastery`, `basketball-defense-guide`, `soccer-warm-up-guide`,
    `soccer-cooling-down-guide`, `golf-equipment-guide`); sitemap advertises `/tools/about.html` and the missing
    golf article; the footer repeats the "Performance Trackers" heading.

---

## Spikes & experiments

**1. Legacy alias emission on GitHub Pages**
- *Question:* can a Docusaurus build emit working `.html` legacy aliases on GH Pages without breaking clean
  routes or spawning duplicates?
- *Spike:* build a 3-page slice (home, one tool, one blog post) and deploy to a preview repo path. Request
  `/tools/x.html`, `/tools/x`, `/tools/x/`, `/blog/sport/x.html`.
- *Decision rule:* ship the alias layer if all four resolve with correct content and a consistent canonical;
  otherwise invert (make the `.html` copy canonical) or move to a redirect-capable host.
- *Outcome:* the alias layer shipped, but the spike's question was answered the other way round after the
  production cutover. GitHub Pages resolves `/tools/x` to `tools/x.html` — the alias file — before it tries
  `tools/x/index.html`, so the alias shadowed the route it pointed at and every extensionless URL refreshed
  into itself. The fix was to make the trailing-slash form canonical (`trailingSlash: true`), so the alias
  points at a page the host serves directly, and to teach the parity check the host's real resolution order
  so it fails if an alias shadows a route again.

**2. Calculator parity harness**
- *Question:* can the formulas be ported with bit-for-bit output parity?
- *Spike:* three archetypes — `bmi-calculator` (single form, unit toggles), `body-fat-calculator` (multi-method,
  27 KB inline JS), `body-type-quiz` (stateful quiz driven by shared JS). Capture golden inputs/outputs from the
  live pages, extract pure functions, write Vitest cases.
- *Decision rule:* scale the port if all three match exactly, including rounding and category text; if
  mismatches are systemic (locale, float rounding, unit edge cases), fix conventions in the kit and re-run
  before porting the remaining 38.

**3. Blog HTML → MDX conversion**
- *Question:* how mechanical is the conversion across 214 posts?
- *Spike:* convert 6 posts spanning 2 sports (include one of the 2 with tables). Check headings, lists, tables,
  links, frontmatter dates, and the legacy alias.
- *Decision rule:* script the batch if ≥95% render cleanly with no manual fixes; otherwise establish a
  per-post review cadence and budget accordingly.

**4. Local search plugin compatibility**
- *Question:* does the local-search plugin work with Docusaurus 3.10.2 + React 19?
- *Spike:* install, index 5 pages, query from the home search box.
- *Decision rule:* adopt if it builds and returns scoped results; otherwise generate a JSON index and keep the
  custom search UI.
- *Outcome (ST-26):* **fallback adopted.** `@easyops-cn/docusaurus-search-local@0.55.3` fails on a site with
  `docs: false` - its `SearchBar` calls `useActiveVersion()` from the docs plugin client - and its generated
  `search-index.json` is 9.79 MB, fetched at runtime on the first keystroke. Neither fits "no runtime network
  requests". Shipped instead: `scripts/build-search-index.mjs` writes a committed
  `src/data/search-index.json` (41 tools + 214 articles, 95 KB) scored in the browser by `src/data/search.ts`.

**5. Visual parity check**
- *Question:* how close is the rebuild to the live site?
- *Spike:* screenshot the live and rebuilt BMI tool page, blog index, one article, and home at desktop and
  mobile widths; diff.
- *Decision rule:* accept differences in nav/footer chrome; content area (form, result card, prose) must match
  layout and hierarchy before the port is considered done.

---

## Open questions

| Question | What settles it |
| --- | --- |
| Is there meaningful organic traffic? (No analytics on the site.) | Search Console / Bing export before cutover — defines rollback urgency and whether to insist on real 301s. |
| Do we need a redirect-capable host after all? | Spike 1 + post-cutover GSC coverage. `legacy-urls.json` makes a host switch cheap. |
| The 5 dead blog links + missing `golf-equipment-guide.html`: write, drop, or redirect to the sport category? | Product call; affects sitemap and blog index counts. |
| Should aliases carry `noindex` in addition to canonical? | Decide with the SEO owner; canonical alone is the default. |
| Dark mode in v1? (Recommended: no, ship light-only for parity.) | Design call. |
| Carry over the `pruneseo-site-verification` meta tag found in the source home page? | Confirm whether it is intentional for the sports domain. |
| Keep authored reading times, or let the blog plugin derive them? | Parity vs. accuracy; derived is recommended and cheap. |
| Blog posts are dated in 2026 with future dates relative to build order — keep dates as-is? | Confirm ordering/pagination expectations. |
| Do the stubbed `trackToolUsage` hooks matter? (Currently no-op.) | Drop unless an analytics plan exists. |
| Where do the remaining 3 images and favicon set live, and is the `images/hero-1.jpg` still used? | Asset audit during implementation. |
