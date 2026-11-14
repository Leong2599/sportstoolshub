# Implementation Report — ST-2 Brand CSS, typography, and scoped style foundation

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-2-brand-css`   **Status**: COMPLETE

## Summary

Established the shared design foundation for the migration: brand tokens, self-hosted Inter, Infima variable
mapping, global base styles, reusable shell classes, and scoped prose styles for tool and blog content.
Calculator internals remain untouched; ST-5 consumes the new tokens. The shell builds light-only with no
external font or image requests.

## Tasks completed

- Added brand palette, typography, spacing, radius, shadow, card, form, and result tokens → `src/css/tokens.css` (CREATE)
- Added global base styles: body, headings, links, selection, focus-visible, reduced motion, print → `src/css/base.css` (CREATE)
- Added shell classes for container, section, grid, card, icon, buttons, badges, and page wrappers → `src/css/shell.css` (CREATE)
- Added scoped `.sth-prose` styles for article/tool SEO copy, including tables and code → `src/css/prose.css` (CREATE)
- Self-hosted Inter weights 300–700 and mapped brand tokens onto Infima variables → `src/css/custom.css` (UPDATE)
- Applied shell classes to the placeholder home → `src/pages/index.tsx` (UPDATE)
- Added CSS foundation tests for tokens, font imports, Infima mapping, wrapper conventions, and absent global form rules → `src/test/styles.test.ts` (CREATE)
- Documented styling conventions and wrapper classes → `README.md` (UPDATE)
- Used a temporary `/style-check` MDX page to render prose, a card, and a bare form; removed it after validation.

## Tests added

- `src/test/styles.test.ts` — 7 cases:
  - primary palette and Inter font stack
  - calculator card/form/result tokens present
  - all five Inter weights imported
  - Infima variables mapped to brand tokens
  - no third-party font hosts
  - page-wrapper and prose conventions defined
  - no unscoped `input`/`select`/`textarea`/`button` rules in project CSS
- Result: 2 files, 10 tests passed (including the existing 3 site-config tests).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (2 files, 10 tests)
- `npm run build` — PASS
- Built-output checks:
  - 15 woff2 assets emitted; 35 `Inter` `@font-face` rules
  - no `fonts.googleapis.com`, `fonts.gstatic.com`, or remote hero-image references
  - brand token `--sth-color-primary:#3b82f6` present in the bundled CSS
  - only `/` and `/blog` routes in the final build; temporary style-check route removed
  - home renders with the new shell classes

## Deviations from the plan

- Tokens were split into `src/css/tokens.css` (explicitly allowed by the plan), with `base.css`, `shell.css`,
  and `prose.css` imported by `custom.css` to keep the foundation reviewable.
- Source class names (`.tool-card`, `.blog-card`, `.btn`) were not copied verbatim; equivalent `sth-*` shell
  classes were introduced to avoid collisions with Infima and legacy markup. Later theme tickets consume these.
- The legacy remote hero image and the blog's purple gradient were deliberately not ported. The architecture
  requires brand parity on the blue palette and local assets, so those belong to ST-24/ST-25.
- Calculator form/result internals were not ported, per the ticket boundary; only tokens are provided for ST-5.
- Fonts are imported through `custom.css` rather than a `Root` swizzle; this keeps the theme surface untouched
  and was verified to emit self-hosted woff2 assets.
- A temporary `/style-check` page was used to validate bare MDX prose and a native form, then deleted so the
  final route set stays clean.

## Issues encountered

- ST-1 was committed as `3ca2f5c` before this branch was cut, so `feature/st-2-brand-css` sits directly on the
  ST-1 commit (expected dependency stacking).
- There is no lint script in the repo; validation is typecheck, Vitest, and build.
- Fontsource emits 15 woff2 files for the five weights across subsets. This is fine for now; switching to
  latin-only imports is an optional size optimization.
