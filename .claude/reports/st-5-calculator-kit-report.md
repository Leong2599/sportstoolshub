# Implementation Report — ST-5 Calculator kit

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Built the shared calculator kit with seven presentational primitives, a typed `useCalculator` hook, pure
validation and share helpers, scoped CSS Modules, and an end-to-end demo harness. The kit covers unit
normalization, accessible validation, scroll-to-results, native share with clipboard fallback, print, and
result-only sharing so raw health inputs are not exposed by default.

## Tasks completed

- [x] Added weight/height conversion and parsing helpers → `src/lib/calculators/units.ts` (previously created) and `units.test.ts`
- [x] Added typed numeric/selection validators and field-error aggregation → `src/lib/calculators/validation.ts` (CREATE) and tests
- [x] Added result-only share formatting, native-share cancellation handling, and clipboard fallback → `src/lib/calculators/share.ts` (CREATE) and tests
- [x] Added `NumberField`, `UnitField`, `ChoiceField`, `ResultCard`, `ResultRow`, `ShareButton`, and `PrintButton` → `src/components/calculators/kit/*` (CREATE)
- [x] Added typed calculator state, validation, scroll, share, print, and reset behavior → `useCalculator.ts` (CREATE)
- [x] Added class-only CSS Modules using the ST-2 brand tokens and no unscoped element selectors → `CalculatorKit.module.css` (CREATE)
- [x] Added a demo harness covering every primitive and end-to-end unit round-trips → `CalculatorKitDemo.tsx` (CREATE)
- [x] Added an internal noindex demo route → `src/pages/calculator-kit-demo.tsx` (CREATE)
- [x] Added jsdom integration tests and style-scoping tests → `CalculatorKitDemo.test.tsx`, `CalculatorKit.styles.test.ts` (CREATE)
- [x] Documented the kit boundaries, privacy behavior, demo route, and test environment → `README.md` (UPDATE)

## Kit contracts

- `NumberField` — labelled numeric input with hint/error IDs, `aria-invalid`, and required marker.
- `UnitField` — fieldset/legend group with a unit select, optional secondary input (feet/inches), and
  separate primary/secondary errors.
- `ChoiceField` — native radio group inside a fieldset, preserving keyboard behavior and selected styling.
- `ResultCard` — `forwardRef` result region with `aria-live="polite"`, `aria-atomic`, `tabIndex={-1}`, and
  slots for value, unit, category, description, rows, and actions.
- `ResultRow` — label/value row with an optional strong emphasis.
- `ShareButton` — status-aware label plus a screen-reader live region for shared/copied/cancelled/failed states.
- `PrintButton` — explicit print action.
- `useCalculator` — typed values and errors, validation-before-calculation, result ref and scroll/focus,
  share status, print, and reset.
- `getSharePayload(result)` receives only the computed result. This is the privacy boundary: a calculator
  cannot accidentally share its input values through the hook's share behavior.
- `units.ts` remains the single source for kg/lbs and cm/ft-in conversions; later calculators should extend
  it rather than duplicating factors.
- CSS Module selectors are class-based and token-driven. There are no `:global`, `composes`, or bare
  form/button element selectors.

## Tests added

- `src/lib/calculators/units.test.ts` — 7 cases covering parsing, rounding, weight conversions, and height conversions.
- `src/lib/calculators/validation.test.ts` — 9 cases covering required/optional values, non-numeric input,
  bounds, integer checks, custom messages, selection validation, and field aggregation.
- `src/lib/calculators/share.test.ts` — 7 cases covering URL formatting, abort detection, native share,
  cancellation, clipboard fallback, unsupported environments, and copy failure.
- `src/components/calculators/kit/CalculatorKit.styles.test.ts` — 3 cases covering scoped selectors and token reuse.
- `src/components/calculators/kit/CalculatorKitDemo.test.tsx` — 6 integration cases:
  - every primitive renders with accessible labels, and no legacy global classes leak
  - end-to-end calculation, scroll/focus, result rendering, and reset
  - validation error, `aria-invalid`, and `aria-describedby`
  - pounds plus feet/inches normalize to the expected score
  - native share payload contains only the computed result
  - clipboard fallback and default print behavior
- Result: 10 files, 67 tests passed (32 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (10 files, 67 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 1, missing 257, skipped 1, conflicts 0`
  - `/calculator-kit-demo/` builds as an internal noindex page
  - calculator styles are emitted as hashed CSS Module classes

## Deviations from the plan

- Added `@vitejs/plugin-react` as a dev dependency so Vitest can transform the `.tsx` tests and kit
  components. Docusaurus itself still builds through its normal SWC pipeline.
- Pinned `jsdom` to `^30.1.3`. The initially installed jsdom 31 requires Node `^22.22.2` (the environment
  is Node 22.18.0) and does not match Vitest 5.1's `^30.1.3` peer range.
- Added a small internal route rather than leaving the harness as a component only. It is marked
  `noindex,nofollow` and should be removed or folded into a dev-only mechanism before cutover if an extra
  production route is not acceptable.
- `ShareButton` replaces the legacy `alert()` with an accessible status label; clipboard fallback behavior
  otherwise matches the source (`text` plus URL when supplied).
- No formulas were added to production calculator modules. The demo uses a trivial score only to prove the
  kit end to end.

## Issues encountered

- Vitest's transform cache at `node_modules/.vitest-cache` held stale output after the dependency install,
  which produced misleading "runner" failures in existing suites. Clearing the cache restored all tests.
- pnpm reports `ERR_PNPM_IGNORED_BUILDS` for `@swc/core` and `core-js` on install. The ignored scripts were
  not needed for typecheck, tests, or the Docusaurus build.
- There is no lint script in the repo; validation is typecheck, Vitest, and build.
- The demo page is intentionally unlinked from navigation and excluded from indexing.
