# Sports Tools Hub

Docusaurus site for [sportstoolshub.com](https://sportstoolshub.com), migrating the legacy HTML site
to MDX content and typed calculator components.

## Requirements

- Node.js 22.22.2+ (the search-index test imports a TypeScript module from a script, and jsdom 30
  requires 22.22.2)

## Setup

```bash
npm install
```

## Local development

```bash
npm run start
```

## Validation

```bash
npm run typecheck
npm run test:run
npm run build
```

## Styling

- Brand tokens live in `src/css/tokens.css` and are mapped onto Infima variables in `src/css/custom.css`.
- Inter is self-hosted through `@fontsource/inter`; do not add Google Fonts links.
- Tool pages use the `sth-tool-page` wrapper, blog pages use `sth-blog-page`, and article prose uses
  `sth-prose`. Calculator internals use CSS Modules scoped under the page wrapper.
- Shared shell classes (`sth-container`, `sth-section`, `sth-card`, `sth-btn`) are defined in
  `src/css/shell.css` for the navbar, footer, home, and calculator kit.

## Tool catalog

`src/data/tools.ts` is the single source of truth for the 41 tools. Each entry carries `slug`, `title`,
`description`, `seoDescription`, `category`, `legacyPath`, `icon`, and `component`. The home grid, footer,
search index, related-tool links, and legacy map must all derive from this catalog - do not add
hand-maintained card lists.

- Categories are the fixed union `fitness`, `performance`, `nutrition`; `TOOL_CATEGORY_LABELS` and
  `toolCategorySections` provide one ordered, uniquely labelled section per category (preventing duplicate
  "Performance Trackers" headings).
- `description` is the short card/search copy. `seoDescription` preserves the longer tool-page meta copy for
  MDX frontmatter.
- `component` is the registry key that the calculator ports will use.
- Icons are deliberate lucide names. `src/data/icons.ts` maps every catalog icon name to its imported
  component; add new icons there so the tree-shaken bundle stays explicit.
- Helpers: `getToolBySlug`, `getToolsByCategory`, `getRelatedTools`, `getToolRoute`, `getToolByLegacyPath`,
  and `getLegacyTarget`.

The tests assert 41 unique slugs and component keys, agreement with the ST-3 legacy contract, real lucide
imports, category coverage, and clean extracted copy.

## Calculator kit

Shared calculator primitives live in `src/components/calculators/kit`; pure helpers live in
`src/lib/calculators`.

- `NumberField`, `UnitField`, `ChoiceField`, `SelectField`, `ResultCard`, `ResultRow`, `ShareButton`, and
  `PrintButton` are presentational. Formulas, thresholds, and messaging stay in per-tool modules under
  `src/lib/calculators`.
- `useCalculator` owns typed values, validation errors, the result, scroll-to-results, and share/print
  state. Its `getSharePayload` receives only the computed result, so raw health inputs are not shareable
  by default.
- `units.ts` owns the shared kg/lbs and cm/ft-in conversions. `validation.ts` provides typed numeric and
  selection validators that preserve per-tool messages.
- Calculator CSS is a CSS Module built from `sth-*` tokens. Keep selectors class-based and scoped; do not
  add global form or button element rules.
- `/calculator-kit-demo` is an internal, noindex harness proving the primitives, validation, unit
  round-trips, scroll, share privacy, and print behavior end to end.
- Component tests declare `// @vitest-environment jsdom`; `@vitejs/plugin-react` is used only by the
  Vitest transform.

## Calculator port pattern

The ST-6 parity tools (BMI, body fat, body type), the ST-7 fitness batch (one rep max, calorie,
heart rate, lean body mass, yoga calorie), the ST-8 fitness batch (golf handicap, injury risk, pace,
running calorie, VO2 max), the ST-9 performance batch (cycling power, swim pace, stride length
and cadence, cycling gear ratio, swimming stroke efficiency), the ST-10 sport-load batch (basketball
vertical jump, soccer match load, cricket bowling workload, tennis match energy, badminton rally
intensity), and the ST-11 planning and environment batch (training load, race strategy, heat
acclimatization, altitude adjustment, combat sports weight class), the ST-12 nutrition batch
(protein, TDEE, hydration, macro, BMR), the ST-13 nutrition batch (meal timing, micronutrient
checker, glycemic load, pre-workout nutrition, post-workout recovery), and the ST-14 planner batch
(intermittent fasting, refeed day, weight cut/gain) are the reference pattern for the remaining
ports:

- Add a pure module at `src/lib/calculators/<tool>.ts` containing typed inputs, formula, thresholds,
  formatting, exact validation messages, and result data. Add golden Vitest cases from the source page.
- Add a presentational component at `src/components/calculators/<Tool>.tsx` built from the kit. The
  component reads only from `useCalculator`; it must not contain formulas.
- Add `src/pages/tools/<slug>.mdx` with catalog-derived frontmatter, a `ToolPage` hero, the calculator
  component, and a `ToolInfo` card containing the source SEO prose. The file path creates
  `/tools/<slug>/`; ST-3 supplies `/tools/<slug>.html`.
- Put shared form/result layout in `ToolCalculator.module.css` and page chrome in
  `ToolPage.module.css`. A tool with its own result shape (zones, macro grid, rep-max table) gets a
  sibling `<Tool>.module.css` instead of growing the shared file.
- Share payloads receive only the computed result; validation messages and rounding stay identical to
  the source. Render share/print actions only when the source page has them, and use
  `scrollOnResult: false` when the source does not scroll to the result.
- Keep unit handling in `src/lib/calculators/units.ts`; every `UnitField` needs its `units` option list
  (the kit renders the unit `<select>` from it). Distance and pace conversions shared by several tools
  live there too (`distanceToMeters`, `distanceToKm`, `paceSecondsPerKm`).
- Copy the source page's quirks, not just its formulas. Several legacy pages use `||` lookups (so a `0`
  table value falls through to the fallback), sort an array in place before indexing it by the
  original order, and read fields that are never written to the result object (which throws at
  render time). Both change computed output and must be preserved.
- Keep sport names, positions, surfaces, and unit conversions in the formula module's typed inputs and
  option tables, not in copy conditionals. Sport-specific trackers share the validation helpers in
  `src/lib/calculators/sportValidation.ts` so their wording stays consistent.
- Share an environmental helper only when the math is genuinely identical. `environmentAdjustment.ts`
  holds just the temperature, altitude, and acclimatization conversions the heat and altitude tools
  have in common; the heat index, WBGT, and VO2 max formulas stay in their own modules.
- MDX prose must escape a leading `<` (for example `<55%`); MDX reads it as a JSX tag and fails the
  build. Write `Under 55%` or `&lt;55%` instead.
- Run `npm run typecheck`, `npm run test:run`, and `npm run build`; the build should report the new tool
  aliases as emitted.

## Blog

Blog posts live in `blog/<sport>/<slug>.mdx` and build at `/blog/<sport>/<slug>/`. The 14 sports are
the primary tag pages; `blog/tags.yml` also carries the topic tags, and `blog/authors.yml` holds the
single "Sports Tools Hub" author.

The blog feed is capped at 500 items in `docusaurus.config.ts` to cover the full archive.

Posts are generated from the read-only source site, so do not hand-edit them - edit the converter and
re-run it:

```bash
npm run convert:blog -- --source="C:\path\to\sport_tools"
```

Options:

- `--sports=a,b` only convert those sports.
- `--posts=a.html,b` only convert those source files.
- `--dry-run` report what would be written without writing it.

The script is idempotent: running it twice produces byte-identical files.

### Conversion rules

- Metadata comes from the `blog/blog.html` index cards: title, description, date, sport, and topic
  tags. Dates are parsed from the source's `Month D, YYYY` and `Mon D, YYYY` forms and written as ISO.
- The body is read from the post's `blog-content` element. The source uses two interchangeable
  wrappers (`<div>` and `<article>`), and the converter matches whichever the post uses.
- Headings, paragraphs, bullet and ordered lists, bold runs, tables, and line breaks are converted.
  Tables become GFM tables. A `<br>` becomes a markdown hard break.
- MDX reads `<`, `{`, and `}` as syntax, so the source's literal angle brackets and braces are
  entity-encoded. The source has `<55% of FTP` in two cycling posts.
- Absolute `sportstoolshub.com` links become internal routes. Relative sibling links become
  `/blog/<sport>/<slug>`, and a link whose target is not on the built site is left as plain text so
  the build's `onBrokenLinks: 'throw'` check stays green.
- The post footer holds the source's "read next" cross-links. Those are kept as a `## Read Next`
  section rather than dropped, since they are the only cross-post navigation the source offers.
- The source never links a post to a calculator, so the converter adds a `## Related Tools` section
  from `src/data/blog-related-tools.json`. The map is per sport, and the test suite checks that every
  entry names a real catalog tool with the catalog's own title.
- A `{/* truncate */}` marker is inserted after the opening paragraph so the blog index shows a card
  excerpt instead of each post's full body.
- Five index cards link to source pages that were never written (`basketball-shooting-mastery`,
  `basketball-defense-guide`, `soccer-warm-up-guide`, `soccer-cooling-down-guide`,
  `golf-equipment-guide`). They are skipped and listed in the run output, matching the D1 decision to
  drop dead links rather than invent the articles.

### Tests

`src/test/blog-convert.test.ts` covers the date parser, index-card parser, link rewriter, MDX
escaping, tag registry, and the HTML-to-MDX conversion.

### Reviewing a batch

`scripts/review-blog.mjs` applies the review checklist mechanically, so a batch can be checked
without reading every post by eye:

```bash
npm run review:blog -- --source="C:\path\to\sport_tools"
```

It checks frontmatter shape, heading order and empty sections, list and table structure, leftover
HTML, MDX-hostile characters, encoding damage, and whether every internal link resolves. It exits
non-zero when it finds an artifact, so it can gate a batch.

Passing `--source` makes the heading check source-aware: the source skips heading levels in a few
posts, and the port reproduces what a browser renders from that markup. Without the source, any
level skip is reported. `SPORT_TOOLS_SOURCE` is used when the flag is omitted.

`scripts/compare-headings.mjs` proves heading parity directly - it compares each converted post's
heading sequence with the sequence a browser produces from the source HTML:

```bash
npm run review:blog:headings -- --source="C:\path\to\sport_tools"
```

## Legacy URLs

`src/data/legacy-urls.json` is the SEO contract: every legacy `.html` path maps to the canonical URL of
its Docusaurus route (`/tools/<slug>/`, trailing slash included). The `legacy-aliases` plugin runs after
the build, writes an instant meta-refresh alias at each legacy path with a canonical link, and records a
report in `.docusaurus/legacy-aliases-report.json`.

The trailing slash is not cosmetic. GitHub Pages resolves an extensionless path to `<path>.html` when
that file exists, and only falls back to `<path>/index.html` otherwise - so `/tools/<slug>` is the alias
file, and `/tools/<slug>/` is the page. An alias that pointed at the extensionless form of its own route
would refresh into itself forever, which is what the canonical URL has to avoid. The plugin checks that
for every alias it writes and reports the offenders as `broken`; the strict build fails on them.

Regenerate the contract from the read-only source site:

```bash
npm run generate:legacy-urls -- --source="C:\path\to\sport_tools"
```

Targets that do not exist yet are skipped during the content migration. Enable strict coverage checking for
the cutover build:

```bash
LEGACY_ALIASES_STRICT=1 npm run build
```

## Deployment

The production build is generated with `npm run build` and published from `build/` to GitHub Pages.

`url` and `baseUrl` in `docusaurus.config.ts` default to `https://sportstoolshub.com` and `/`, and
can be overridden for a preview build:

```bash
BASE_URL=/sportstools/ SITE_URL=https://leong2599.github.io npm run build
```

`headTags` do not receive `baseUrl` from Docusaurus, so the favicon links are built from it by hand.
The navbar logo, the social card, the favicon option and the legacy-alias canonicals follow the
configured `baseUrl`/`url` on their own.

### Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `.github/workflows/ci.yml` | every push and pull request | `npm ci` → `typecheck` → `test:run` → `build` with `LEGACY_ALIASES_STRICT=1`, then uploads `build/` as a 7-day artifact |
| `.github/workflows/deploy-pages.yml` | push to `main`, manual dispatch | builds and deploys the Pages artifact; two lanes: preview and production |

Both use Node 22 and the npm dependency cache (`actions/setup-node` with `cache: npm`), so
`package-lock.json` is the lock file CI trusts.

### Preview before cutover

One Pages site per repository, so the preview is the project path, not a per-branch URL:

1. Run **Deploy to GitHub Pages** manually (`workflow_dispatch`) with `mode: preview`.
2. The build uses `BASE_URL=/<repo>/` and `SITE_URL=https://<owner>.github.io`, and drops
   `build/CNAME` so the preview cannot claim the custom domain.
3. The preview serves at `https://<owner>.github.io/<repo>/`.

The same workflow also uploads on every CI run (`site-build-<sha>`), which is enough when you only
need to inspect the output locally: download the artifact and run `npm run serve` (or
`npx http-server build`).

### Production and the cutover gate

Production deploys are disabled until the repository variable **`PAGES_DEPLOY_ENABLED`** is set to
`true`. Until then:

- a push to `main` skips the deploy job;
- a manual `mode: production` run fails with an explanation.

ST-28 is the ticket that performs the cutover; it sets the variable after the parity check. A manual
production run additionally requires typing `deploy` in the `confirmation` input, and the deploy job
sits in the `github-pages` environment, where a required reviewer can be configured for approvals.

One-time repository setup (Settings → Pages): set **Source** to **GitHub Actions**. The custom domain
is configured there too; `static/CNAME` is kept as the record of the domain and ships with the
production artifact.

No secrets are used by either workflow; they authenticate with the short-lived `GITHUB_TOKEN` and the
Pages OIDC token (`id-token: write`).

### Parity checks

Before any deploy (preview or production), run:

```bash
npm run parity:check        # dir mode: aliases, routes, sitemap, robots, CNAME, feeds, tags, links
```

or against a served build:

```bash
npm run serve -- --port 3100 --no-open &
# wait for http://localhost:3100/ to answer 200
node scripts/parity-check.mjs --base-url=http://localhost:3100 --skip-content
```

Content parity against the legacy checkout (which is **not** part of this repository) is verified locally:

```bash
PARITY_SOURCE_DIR="C:\Users\user\Documents\Production\sport_tools" npm run parity:check
PARITY_SOURCE_DIR="C:\Users\user\Documents\Production\sport_tools" npm run parity:baseline   # only after an intentional change
```

Both checks run in CI (`ci.yml`) and in the deploy workflow (`deploy-pages.yml`, both lanes).
See `docs/cutover-runbook.md` for the full cutover procedure, rollback path and sign-off gates.

