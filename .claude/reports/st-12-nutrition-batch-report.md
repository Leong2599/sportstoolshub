# Implementation Report — ST-12 Nutrition batch A (core macros)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-12)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-12 nutrition tools end to end: protein, TDEE, hydration, macro, and BMR. Each tool
has a pure typed formula module with golden tests, a kit-based React component, an MDX page carrying the
source SEO prose, and a working `/tools/<slug>/` route plus the `/tools/<slug>.html` legacy alias.
Shared nutrition math lives in `nutritionMetrics.ts`; the five result shapes stay tool-specific.

## Tasks completed

- [x] Capture source formulas, thresholds, validation, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` and `script.js` (READ)
- [x] Shared nutrition helpers (Mifflin-St Jeor, Harris-Benedict, activity factors, macro TDEE height quirk) → `src/lib/calculators/nutritionMetrics.ts` (CREATE)
- [x] BMR port (Mifflin-St Jeor) → `src/lib/calculators/bmr.ts` (CREATE)
- [x] TDEE port (Mifflin-St Jeor, six weight goals) → `src/lib/calculators/tdee.ts` (CREATE)
- [x] Protein port (activity/goal/age multipliers, diet adjustment, meal split) → `src/lib/calculators/protein.ts` (CREATE)
- [x] Hydration port (weight, activity, exercise, climate, health conditions, schedule) → `src/lib/calculators/hydration.ts` (CREATE)
- [x] Macro port (TDEE/manual calories, goal ratios, diet adjustments, custom ratios, meal plan) → `src/lib/calculators/macro.ts` (CREATE)
- [x] Golden formula and validation tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + shared batch CSS module → `src/components/calculators/{BMRCalculator,TDEECalculator,ProteinCalculator,HydrationCalculator,MacroCalculator}.tsx` + `NutritionBatch.module.css` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{bmr-calculator,tdee-calculator,protein-calculator,hydration-calculator,macro-calculator}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 8 ports → `README.md` (UPDATE)

## Parity contracts

### BMR and TDEE

- BMR uses Mifflin-St Jeor: men `10w + 6.25h - 5a + 5`; women `10w + 6.25h - 5a - 161`.
- TDEE multiplies BMR by the source activity factors: 1.2, 1.375, 1.55, 1.725, 1.9.
- TDEE weight goals preserve the six source offsets: 0, -250, -500, -1000, +250, +500 calories.
- Both tools keep the source's kg/lb and cm/ft-in conversions and validation limits.
- BMR and TDEE have no share/print actions, matching the source pages.

### Protein

- Base multiplier is activity × goal; age over 65 adds 10%; vegetarian/vegan add 10%.
- Daily protein is rounded, with the source meal split: 25% breakfast, 30% lunch, 30% dinner, remainder snacks.
- Diet-specific source lists and recommendation copy are preserved.
- Share payload matches the source: `My daily protein requirement is <grams>g.`

### Hydration

- Base water is `weightKg × 2.20462 × 0.5` ounces.
- Activity multipliers are 1.0/1.1/1.2/1.3/1.4/1.5; exercise adds 6/10/15 oz per 30 minutes by intensity.
- Climate adjustments are 0/0.2/0.4/-0.1/0.1/0.15; health conditions add -8 to +32 oz.
- Output preserves rounded ounces, liters to one decimal, 8-oz glasses, the six-item schedule, tips, and recommendations.
- Share payload matches the source: `My daily water intake recommendation is <oz>.`

### Macro

- TDEE mode uses the source Harris-Benedict formula, not Mifflin-St Jeor, because the source macro page does.
- The source macro feet/inches quirk is preserved: 5'11" is converted as 175.26 cm, not 180.34 cm.
- Goal ratios and the full diet-adjustment/clamp/normalisation table are reproduced.
- Manual calories are validated 800-5000; custom ratios require protein 5-50, carbs 5-70, fats 5-60, and a 100% total.
- Meal distribution stays 25% breakfast, 35% lunch, 30% dinner, remainder snacks.
- Share payload matches the source: `My daily macros are <cal>: P:<g>g, C:<g>g, F:<g>g.`

## Tests added

- `src/lib/calculators/nutritionMetrics.test.ts` — 4 cases: both BMR formulas, activity factors, macro height quirk.
- `src/lib/calculators/bmr.test.ts` — 5 cases: male/female golden values, imperial conversion, validation.
- `src/lib/calculators/tdee.test.ts` — 4 cases: TDEE and goals, sedentary/very-active, imperial, validation.
- `src/lib/calculators/protein.test.ts` — 6 cases: build-muscle, older vegan, meal split, diet sources, validation, rounding.
- `src/lib/calculators/hydration.test.ts` — 6 cases: base/activity, climate/health, blank duration, schedule/tips, recommendations, validation.
- `src/lib/calculators/macro.test.ts` — 8 cases: manual macros, TDEE path, feet quirk, custom/diet ratios, adjustment table, meal plan/sources, validation, TDEE-only validation.
- `src/components/calculators/BMRCalculator.test.tsx` — 2 integration cases.
- `src/components/calculators/TDEECalculator.test.tsx` — 2 integration cases.
- `src/components/calculators/ProteinCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/HydrationCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/MacroCalculator.test.tsx` — 4 integration cases.
- Suite result: 77 test files, 356 tests passed (48 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (77 files, 356 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 34, missing 224, skipped 1, conflicts 0` (up from 29 at ST-11; all five new tool aliases resolve)
  - Verified `/tools/{bmr,tdee,protein,hydration,macro}-calculator/index.html` exist.
  - Verified `/tools/{bmr,tdee,protein,hydration,macro}-calculator.html` alias files are emitted.
  - Verified all five aliases appear in `.docusaurus/legacy-aliases-report.json`.

## Deviations from the plan

- Added `src/lib/calculators/nutritionMetrics.ts` for BMR, activity-factor, and macro TDEE height helpers shared by two or more tools. Tool-specific thresholds and result shapes remain in their own modules.
- Added one shared `NutritionBatch.module.css` for the five tools because they share metric grids, result cards, lists, schedules, and macro bars.
- Fixed the source macro activity bug: the select emits `very-active` while the source lookup uses `veryActive`, which produces `NaN`. The port maps `very-active` to 1.9 and documents the correction.
- The source hydration multi-select has no kit primitive. The port uses a local multiple `<select>` styled with the kit classes, preserving keyboard and Ctrl/Cmd multi-select behavior.
- The source macro macros use Harris-Benedict while BMR/TDEE use Mifflin-St Jeor. This inconsistency is preserved because changing it would change displayed results.
- Source hydration blank exercise duration coerces to zero; the port preserves that behavior while still limiting duration to 0-300 minutes.
- BMR/TDEE use the source's no-actions result cards; protein, hydration, and macro keep share/print.

## Issues encountered

- The first Harris-Benedict female golden expectation was wrong (`1673.603`); re-executing the source formula gave `1615.093`, and the shared helper test was corrected.
- The first BMR imperial expectation used rounded pounds and produced a different raw value. The test now checks the raw `1782.1252` conversion and the displayed rounded `1782`.
- The hydration recommendations test initially overlooked that selecting climate and breastfeeding changes the total from 126 to 175 oz. The expectation was corrected from the implemented copy, then checked against the source formula.
- Macro custom-ratio validation attaches the total error to the protein field so the form shows a single actionable message.

## Follow-ups for the reviewer

- The 5 tools and README update are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- ST-13 onward should reuse `nutritionMetrics.ts` for any remaining nutrition tools and keep the shared batch CSS pattern.
- The source macro page should be fixed upstream so its `very-active` activity key resolves to 1.9 instead of producing `NaN`.
