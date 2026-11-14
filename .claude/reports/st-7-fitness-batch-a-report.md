# Implementation Report — ST-7 Fitness batch A (5 calculators)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-7)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-7 fitness tools end to end: one rep max, calorie calculator, heart rate zones,
lean body mass, and yoga calorie burn. Each tool has a pure typed formula module with golden tests, a
kit-based React component, an MDX page carrying the source SEO prose, and a working `/tools/<slug>/`
route plus the `/tools/<slug>.html` legacy alias. All five follow the frozen ST-5/ST-6 pattern: formulas
live in `src/lib/calculators/`, components only read from `useCalculator`, and share payloads carry
computed results only.

## Tasks completed

- [x] Capture source formulas, thresholds, validation messages, rounding, and copy → `src/lib/calculators/oneRepMax.ts`, `calorie.ts`, `heartRate.ts`, `leanBodyMass.ts`, `yoga.ts` (CREATE)
- [x] One rep max port (7 formulas, 12-row rep max table) → `src/components/calculators/OneRepMaxCalculator.tsx` + `.module.css` (CREATE)
- [x] Calorie calculator port (Mifflin-St Jeor BMR, activity multipliers, goal offsets, macro split) → `src/components/calculators/CalorieCalculator.tsx` + `.module.css` (CREATE)
- [x] Heart rate zones port (Karvonen + age-predicted, fitness-level recommendations) → `src/components/calculators/HeartRateCalculator.tsx` + `.module.css` (CREATE)
- [x] Lean body mass port (Boer formula for men and women, body fat percentage) → `src/components/calculators/LeanBodyMassCalculator.tsx` + `.module.css` (CREATE)
- [x] Yoga calorie port (11 styles × 4 intensities MET table, 8 adjustment factors, breakdown, style comparison) → `src/components/calculators/YogaCalorieCalculator.tsx` + `.module.css` (CREATE)
- [x] Golden formula tests → `src/lib/calculators/{oneRepMax,calorie,heartRate,leanBodyMass,yoga}.test.ts` (CREATE)
- [x] Component integration tests → `src/components/calculators/{OneRepMax,Calorie,HeartRate,LeanBodyMass,Yoga}*.test.tsx` (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{one-rep-max-calculator,calorie-calculator,heart-rate-calculator,lean-body-mass-calculator,yoga-calorie-calculator}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 33 ports → `README.md` (UPDATE)

## Parity contracts

### One rep max

- Formulas preserved exactly: Epley `w(1+r/30)`, Brzycki `w/(1.0278-0.0278r)`, Lander and McGlothin
  `100w/(101.3-2.671r)`, Lombardi `w·r^0.10`, O'Kane `w(1+0.025r)`, Wathan `100w/(48.8+53.8e^-0.075r)`.
- Result uses `toFixed(1)`; weight is **not** converted between kg and lbs, matching the source, which
  applies the formula to the entered number and labels the result with the selected unit.
- Rep max progression reproduces the source: 12 rows, Lombardi percentage `100·i^-0.10`, estimated
  weight `toFixed(1)` with the selected unit.
- Validation: weight > 0 and reps 1–15, with the source's single combined message.
- No share/print actions and no auto-scroll: the source page has neither.

### Calorie calculator

- Mifflin-St Jeor BMR (`10w + 6.25h - 5a + 5` / `-161`), activity multipliers 1.2 / 1.375 / 1.55 /
  1.725 / 1.9 / 2.0, and the six goal offsets (±1000, ±500, ±250, 0) with the source descriptions and
  recommendation copy.
- Macro split 30% protein / 40% carbs / 30% fat, grams rounded from 4/4/9 kcal per gram.
- Displayed BMR, TDEE, and goal calories are `Math.round`ed exactly like the source.
- Share text: `My recommended daily calories are <n> (<goal>). Calculate yours at Sports Tools Hub!` — result only.

### Heart rate

- Max HR `220 - age`; five zones at the source's 50–60 / 60–70 / 70–80 / 80–90 / 90–100 boundaries.
- Karvonen zones use heart rate reserve (`resting + HRR × factor`) and are only applied when a resting
  heart rate above 0 is supplied; otherwise the age-predicted zones are used, exactly as in the source.
- Zone labels, intensity names, percentage captions, descriptions, the four fitness-level
  recommendations, and the method-specific advice sentence are preserved verbatim.
- Share text: `My maximum heart rate is <n> BPM. Calculate your heart rate zones at Sports Tools Hub!`.

### Lean body mass

- Boer formula preserved for both genders; body fat percentage derived as `(weightKg - lbm) / weightKg × 100`.
- Both values display with `toFixed(1)`; weight converts to kg and height ft/in converts to cm before the
  formula, matching the source's own conversion.
- Gender defaults to male, matching the source's pre-checked radio.

### Yoga calorie

- MET table preserved for all 11 styles × 4 intensities, plus the source's eight multipliers: experience,
  gender, age, temperature, heart rate, body composition, flexibility, and breathing.
- Calories `Math.round`ed; calories/minute `Math.round(x*10)/10`; calories/hour `Math.round(x*60)`;
  walking equivalent `Math.round(calories/4)`.
- Breakdown split 70/20 with the remainder assigned to personal factors, percentages to one decimal.
- Style comparisons use the source's moderate MET values and the 70 kg reference weight, with the signed
  difference string.
- Recommendation copy, including the four intensity bands and the closing advice, is preserved verbatim.
- Share text: `I burned <n> calories during my yoga practice! Calculate your yoga calories at Sports Tools Hub!`.

## Tests added

- `src/lib/calculators/oneRepMax.test.ts` — 4 cases: Epley golden value and rep-max table, all seven
  formula outputs, unit preservation, validation message and bounds.
- `src/lib/calculators/leanBodyMass.test.ts` — 4 cases: male golden value, female golden value, imperial
  conversion, validation bounds and messages.
- `src/lib/calculators/heartRate.test.ts` — 3 cases: Karvonen zones, age-predicted zones, validation.
- `src/lib/calculators/calorie.test.ts` — 4 cases: metric golden value, imperial conversion, goal offset,
  validation.
- `src/lib/calculators/yoga.test.ts` — 4 cases: MET golden value and breakdown, style comparisons, style
  list, validation.
- `src/components/calculators/OneRepMaxCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/CalorieCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/HeartRateCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/LeanBodyMassCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/YogaCalorieCalculator.test.tsx` — 3 integration cases.
- Suite result: 26 test files, 137 tests passed (26 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (26 files, 137 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 9, missing 249, skipped 1, conflicts 0` (up from 4 emitted at ST-6; the five
    new tool aliases now resolve)
  - Verified `/tools/<slug>/index.html` and `/tools/<slug>.html` exist for all five tools, each alias
    carrying the canonical link and meta refresh.
  - Verified each built page renders its `<h1>`, the calculator form, the catalog meta description, and
    the source SEO prose headings.
  - Verified no `undefined` CSS-module class names in the built HTML.

## Deviations from the plan

- Added one CSS module per tool (`<Tool>.module.css`) instead of extending the shared `ToolCalculator.module.css`.
  Reason: each tool has a bespoke result shape (rep-max list, macro grid, zone grid, composition pair,
  yoga stats/breakdown/comparison), and per-tool modules keep the shared file from growing with one-off
  layouts. Shared chrome (`layout`, `card`, `sectionTitle`, `recommendation`) still comes from
  `ToolCalculator.module.css`.
- The plan did not count the CSS modules in its file estimate; they are additive and do not change scope.
- Yoga temperature and heart rate are optional. The source silently coerces an empty value to 20 °C / 0 bpm
  and relies on HTML `min`/`max` attributes for bounds. The port keeps the empty-means-default behavior in
  the formula module and additionally reports an inline error for out-of-range values, since the kit renders
  `noValidate` forms and the browser attribute check would not fire.
- One rep max and lean body mass expose no share/print buttons and no auto-scroll, matching the source
  pages, even though the ST-6 pattern usually includes them.
- Yoga's share payload intentionally omits style, duration, and body weight; only the calorie total is shared.

## Issues encountered

- MDX/JSX formatting: an early draft of the yoga component lost its `<NumberField label="Session Duration">`
  opening tag during an edit; caught by `npm run typecheck` and fixed.
- The first test run failed on `getByLabelText` for native `<select>` elements in jsdom. Switched the tests
  to `getByRole('combobox', {name})`, which matches the rendered accessibility tree.
- The kit's `UnitField` requires a `units` prop; the yoga temperature field needed a new
  `YOGA_TEMPERATURE_UNITS` list (°C / °F) exported from the yoga formula module.
- A pre-existing ST-6 test (`BodyFatCalculator > computes the source US Navy example end-to-end`) timed out
  once at 5 s under parallel load. It passed on re-run and on every subsequent run; it is unrelated to this
  ticket and no ST-7 change touches that component.

## Follow-ups for the reviewer

- The 5 tools are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then
  `piv-review-pr`.
- `README.md` now documents the port pattern for the remaining 33 tools; ST-8 onward should follow it and
  reuse the existing `src/lib/calculators/units.ts` helpers rather than adding new conversion logic.
