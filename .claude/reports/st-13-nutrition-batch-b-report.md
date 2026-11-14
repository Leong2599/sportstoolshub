# Implementation Report — ST-13 Nutrition batch B (guidance tools)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-13)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-13 guidance tools end to end: meal timing planner, micronutrient intake checker,
glycemic load calculator, pre-workout nutrition planner, and post-workout recovery meal builder. Each
tool has a pure typed formula module with golden tests, a kit-based React component, an MDX page
carrying the source SEO prose, and a working `/tools/<slug>/` route plus the `/tools/<slug>.html` legacy
alias. These are guidance tools: the components own only computed recommendations, and the educational
copy lives in MDX.

## Tasks completed

- [x] Capture source formulas, thresholds, validation, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` and `script.js` (READ)
- [x] Meal timing port (wake/sleep window, meal interval, pre/post workout windows, goal guidelines) → `src/lib/calculators/mealTiming.ts` (CREATE)
- [x] Micronutrient port (19-nutrient RDA table, capped percentages, sufficiency score) → `src/lib/calculators/micronutrient.ts` (CREATE)
- [x] Glycemic load port (31-food GI/carbohydrate database, per-food and total GL) → `src/lib/calculators/glycemicLoad.ts` (CREATE)
- [x] Pre-workout nutrition port (type/intensity macro scaling, timeline, hydration) → `src/lib/calculators/preWorkoutNutrition.ts` (CREATE)
- [x] Post-workout recovery port (protein clamp, carb scaling, ratio, rehydration) → `src/lib/calculators/postWorkoutRecovery.ts` (CREATE)
- [x] Golden formula and validation tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + shared batch CSS module → `src/components/calculators/{MealTimingPlanner,MicronutrientChecker,GlycemicLoadCalculator,PreWorkoutNutritionPlanner,PostWorkoutRecoveryMealBuilder}.tsx` + `NutritionBatch.module.css` (UPDATE)
- [x] Time input primitive for the source's `type="time"` fields → `src/components/calculators/kit/TimeField.tsx` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{meal-timing,micronutrient-checker,glycemic-load-calculator,pre-workout-nutrition,post-workout-recovery}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 3 ports → `README.md` (UPDATE)

## Parity contracts

### Meal Timing Planner

- Awake window: bedtime at or before wake-up rolls forward 24 hours; meals are spaced across the awake window.
- Workout start is fixed per schedule bucket (06:00, 10:00, 13:00, 16:00, 19:00, 22:00) and duration per bucket (30/60/90/150 minutes).
- A meal is pre-workout inside the 60-180 minutes before start and post-workout inside the 60 minutes after end; both flags can be set at once.
- If no meal lands in the pre-workout window, one is added 90 minutes before start; if none lands post-workout, one is added 30 minutes after the end. Meals are sorted by clock time afterwards.
- Meal types come from the source's fixed name list (Breakfast → Evening Meal); focus copy switches on goal, and pre/post workout meals get their own focus strings.
- The source's time-formatting quirk is preserved: `formatMinutesToTime` rolls 60 minutes back to `00` without carrying into the hour.
- Goal guideline copy is preserved for the four source goals; `strength` and `general-health` had no source entry (the source falls back to a missing `general-health` key and throws), so the port uses a balanced general-health fallback instead of crashing.
- Share payload matches the source: `My meal timing plan for <goal> with <n> meals per day.`; print and share actions are the only tool in this batch that has them.

### Micronutrient Intake Checker

- Nineteen nutrients with separate male/female RDA tables, exactly as the source (vitamin A 900/700, iron 8/18, magnesium 400/310, zinc 11/8, vitamin K 120/90, and so on).
- Each entered nutrient scores `intake / RDA × 100`, capped at 200%; blank inputs are excluded from both the breakdown and the average.
- Status bands match the source: 80%+ adequate, 60-79% insufficient, below 60% deficient.
- Overall score is the rounded average of entered nutrients only; a fully blank form scores 0.
- Score descriptions and the four conditional recommendations (multivitamin, vitamin D, iron, excellent balance) are reproduced verbatim.
- The source alert allows ages 15-80 even though the input allows 100; the port keeps the 15-80 rule.

### Glycemic Load Calculator

- The 31-food database keeps the source GI and carbohydrate-per-100g values; per-food GL is `GI × carbs / 100` and per-food carbs are `carbsPer100g × amount / 100`.
- Total GL is the sum of food GL; average GI is carbohydrate-weighted, not a plain mean.
- Bands match the source: below 10 low, below 20 medium, otherwise high; the recommendation thresholds are `totalGL > 20`, `avgGI > 70`, and `totalGL < 10`.
- Displays keep the source rounding: one decimal for total GL and carbs, none for average GI, and one decimal in the per-food list.
- The meal builder keeps the source's add/clear flow and allows duplicate foods.

### Pre-Workout Nutrition Planner

- Base macros per kg are carbs 1.5 / protein 0.25, replaced by 3.0/0.2 (endurance), 2.0/0.3 (HIIT), and 1.0/0.4 (strength).
- Intensity multipliers are 0.8 (low), 1.0 (moderate), 1.2 (high), 1.4 (maximal) and scale both macros.
- Calories are `carbs × 4 + protein × 4`; the per-kg figure is shown to one decimal.
- The timeline is fixed, except that endurance swaps the 30-60 minute entry for `Quick fuel: 10-20% of total carbs`.
- Meal suggestions switch to a single plant-based card for vegan and vegetarian diets; the source's other dietary options keep the standard cards.

### Post-Workout Recovery Meal Builder

- Protein per kg is 0.25 base, 0.3 (strength), 0.2 (endurance), 0.35 (HIIT), scaled by `intensity / 5` and clamped to the 20-40g window.
- Carbs per kg is 1.0 base, 1.2 (endurance), 0.8 (strength), 1.0 (HIIT), multiplied by 1.2 for sessions over 90 minutes and 0.7 for sessions under 30.
- Ratio is `round(carbs / protein) : 1`; calories are `protein × 4 + carbs × 4`.
- Timing copy has three states: immediate, within 30 minutes, and delayed.
- Estimated fluid loss is `duration × 15 × (intensity / 5)` with a 150% immediate replacement target.
- Meal suggestions switch to a plant-based card only for vegan, matching the source; the source's non-vegan card embeds the computed grams.

## Tests added

- `src/lib/calculators/mealTiming.test.ts` — 6 cases: schedule build, no-meal window case, timeline/recommendations, goal fallback, time quirk, validation.
- `src/lib/calculators/micronutrient.test.ts` — 4 cases: partial average, 200% cap with female RDA, blank form, validation.
- `src/lib/calculators/glycemicLoad.test.ts` — 5 cases: single-food GL, multi-food totals and weighted GI, low/medium bands, per-food analysis, validation.
- `src/lib/calculators/preWorkoutNutrition.test.ts` — 4 cases: strength macros, endurance/intensity/vegan, default macros, validation.
- `src/lib/calculators/postWorkoutRecovery.test.ts` — 5 cases: base targets, endurance/intensity/vegan, protein clamp, delayed timing, validation.
- `src/components/calculators/MealTimingPlanner.test.tsx` — 3 integration cases.
- `src/components/calculators/MicronutrientChecker.test.tsx` — 3 integration cases.
- `src/components/calculators/GlycemicLoadCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/PreWorkoutNutritionPlanner.test.tsx` — 3 integration cases.
- `src/components/calculators/PostWorkoutRecoveryMealBuilder.test.tsx` — 3 integration cases.
- Suite result: 87 test files, 395 tests passed (39 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (87 files, 395 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 39, missing 219, skipped 1, conflicts 0` (up from 34 at ST-12; all five new tool aliases resolve)
  - Verified `/tools/{meal-timing,micronutrient-checker,glycemic-load-calculator,pre-workout-nutrition,post-workout-recovery}/index.html` exist.
  - Verified `/tools/{meal-timing,micronutrient-checker,glycemic-load-calculator,pre-workout-nutrition,post-workout-recovery}.html` alias files are emitted.

## Deviations from the plan

- Added `src/components/calculators/kit/TimeField.tsx` for the three source `type="time"` inputs. The kit had no time primitive, and the alternative was hand-rolled time inputs in three components.
- Extended `NutritionBatch.module.css` with the batch's new result shapes (overview grid, timeline list, schedule rows, recommendation grid, nutrient grid, food list) instead of adding five sibling CSS modules; the five tools share these shapes.
- The source meal timing page throws for the `strength` and `general-health` goals because its recommendation table has no `general-health` key. The port substitutes a balanced general-health guideline set rather than reproducing the crash.
- The source micronutrient age check is 15-80 while its input allows up to 100; the port keeps the 15-80 rule and the source message.
- The source glycemic, micronutrient, pre-workout, and post-workout pages have no share or print actions, so those four components render no action buttons. Only meal timing keeps share and print, matching the source.
- The source post-workout page uses a range input for workout intensity; the port uses a bounded number field because the kit has no range primitive.
- The source pre-workout page collects a workout start time that never influences the output; the field is kept for parity, and the result is unchanged.
- The source post-workout page reads body fat, fitness level, primary goal, next-session details, and meal type without using them in the calculation; the port collects the same fields and keeps the calculation identical.

## Issues encountered

- Three initial golden expectations were wrong, not the implementation: 18.15 rounds to `18.1` (not `18.2`), a 07:00 meal after an early-morning workout is inside the post-workout window, and the female micronutrient case scores 153 (not 200) because vitamin C stays at 60%. The expectations were corrected against the source math.
- `input[type="time"]` has no ARIA role and typing `HH:MM` into it is unreliable under jsdom, so the component tests set the value with `fireEvent.change` and query the field by label.

## Follow-ups for the reviewer

- The 5 tools, the `TimeField` primitive, the CSS additions, the README update, and this report are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- ST-14 should reuse the `TimeField` primitive and the extended `NutritionBatch.module.css` for the three planner tools.
- The source meal timing page should be fixed upstream so the `strength` and `general-health` goals resolve to a recommendation set.
- The source micronutrient page should reconcile its 15-80 age alert with its 100-year input limit.
