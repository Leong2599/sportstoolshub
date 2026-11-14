# Implementation Report — ST-6 Calculator parity proof

**Plan**: `docs/tickets/sportstools-migration.md`   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the three ST-6 archetypes end to end: BMI (single form and unit toggles), body fat
(multi-method, large inline script), and body type (stateful quiz). Each tool now has a pure typed
formula module with golden tests, a kit-based React component, an MDX page with the source SEO prose,
and a working `/tools/<slug>/` route plus `/tools/<slug>.html` alias.

## Tasks completed

- [x] Captured source formulas, thresholds, validation messages, rounding, category text, and share copy from the read-only legacy pages
- [x] Added pure BMI module and golden tests → `src/lib/calculators/bmi.ts`, `bmi.test.ts`
- [x] Added pure body fat module and golden tests → `src/lib/calculators/bodyFat.ts`, `bodyFat.test.ts`
- [x] Added pure body type quiz module and golden tests → `src/lib/calculators/bodyType.ts`, `bodyType.test.ts`
- [x] Added BMI component and integration tests → `src/components/calculators/BmiCalculator.tsx`, `BmiCalculator.test.tsx`
- [x] Added body fat component and integration tests → `src/components/calculators/BodyFatCalculator.tsx`, `BodyFatCalculator.test.tsx`
- [x] Added body type quiz component and integration tests → `src/components/calculators/BodyTypeQuiz.tsx`, `BodyTypeQuiz.test.tsx`
- [x] Added shared page and calculator layouts → `ToolPage.tsx`, `ToolPage.module.css`, `ToolCalculator.module.css`
- [x] Added small kit adjustments: `SelectField`, `ChoiceField` list layout, and `useCalculator` scroll toggle
- [x] Added MDX routes with extracted source prose → `src/pages/tools/bmi-calculator.mdx`, `body-fat-calculator.mdx`, `body-type-quiz.mdx`
- [x] Documented the reusable port pattern in `README.md`
- [x] Verified routes, legacy aliases, typecheck, tests, and production build

## Parity contracts

### BMI

- Formula: `weightKg / heightM²`; display uses `toFixed(1)`.
- Source category thresholds: `<18.5`, `<25`, `<30`, otherwise obese.
- Source category names, colors, chart ranges, and recommendation copy preserved.
- Metric and lbs/ft-in conversions use the ST-5 `units.ts` factors.
- Validation messages and bounds match the source custom validity checks; age and gender remain required as in the source form even though they do not affect the formula.
- Share text: `My BMI is <value> (<category>). Calculate yours at Sports Tools Hub!`; share payload contains only the result and current URL.

### Body fat

- Methods preserved: US Navy, BMI-based, and Jackson-Pollock 3-site skinfold.
- Source formulas, coefficients, and unit handling preserved, including the body fat calculator's own feet/inches and circumference conversions.
- Percentage uses `toFixed(1) + '%'`; fat and lean mass use `toFixed(1) + ' kg'` after kg normalization.
- Gender-specific male/female category thresholds, range chart colors, and recommendations preserved.
- Method-specific fields and required states are conditional; female US Navy adds hip, male skinfold adds chest/abdominal, female skinfold adds triceps/suprailiac.
- Source validation messages and HTML bounds preserved; impossible measurements map the source general alert to the method field.
- Share text: `My body fat percentage is <value> (<category>). Calculate yours at Sports Tools Hub!`; no raw health inputs are shared.

### Body type quiz

- Five source questions, options, scoring, and tie rule preserved.
- Ties between positive scores produce `Mixed Body Type`; a later strictly higher score remains dominant, matching the source loop.
- Result title, description, training/nutrition recommendations, and undetermined fallback copy preserved.
- Missing answers produce the source message on every unanswered question.
- No share/print actions and no auto-scroll, matching the source quiz; reset clears answers and result.

## Kit and layout changes

- Added `SelectField` for source-shaped method dropdowns.
- Added `ChoiceField` `layout="list"` so quiz radio options stack like the source.
- Added `useCalculator({scrollOnResult: false})` for the source quiz's no-scroll behavior.
- Added shared `ToolPage`/`ToolInfo` page chrome and `ToolCalculator.module.css` so the remaining 38 ports have one layout pattern.
- Kept formulas out of components. All result formatting and threshold data live in `src/lib/calculators`.

## Tests added

- `src/lib/calculators/bmi.test.ts` — 6 cases covering metric and imperial golden values, category boundaries, chart copy, and validation messages.
- `src/lib/calculators/bodyFat.test.ts` — 10 cases covering all three methods for both genders, category thresholds, composition, ranges, validation bounds/messages, and the general error.
- `src/lib/calculators/bodyType.test.ts` — 6 cases covering required answers, dominant scoring, tie behavior, source copy, fallback, and incomplete-quiz rejection.
- `src/components/calculators/BmiCalculator.test.tsx` — 3 integration cases: end-to-end result, validation, result-only share and print.
- `src/components/calculators/BodyFatCalculator.test.tsx` — 4 integration cases: end-to-end result, method/gender field visibility, validation, result-only share and print.
- `src/components/calculators/BodyTypeQuiz.test.tsx` — 4 integration cases: dominant result and no share/print/scroll, mixed tie, required answers, reset.
- Result: 16 files, 99 tests passed (32 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (16 files, 99 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 4, missing 254, skipped 1, conflicts 0`
  - `/tools/bmi-calculator/`, `/tools/body-fat-calculator/`, and `/tools/body-type-quiz/` built
  - `/tools/bmi-calculator.html`, `/tools/body-fat-calculator.html`, and `/tools/body-type-quiz.html` emitted with canonical meta-refresh aliases
  - built pages include the source `<h1>`, meta description, and SEO prose

## Deviations from the plan

- Added `SelectField`, `ChoiceField` layout support, and the `scrollOnResult` hook option as small ST-5 kit adjustments discovered by the ports.
- Added shared `ToolPage`/`ToolInfo` chrome, which the plan allowed as a small kit/layout adjustment and which the remaining 38 ports need.
- Source `alert()` validation is represented as accessible inline errors, consistent with the ST-5 kit. Messages are preserved where the source defined them; native HTML bounds are also enforced explicitly.
- The body fat source general alert is attached to the method field because the kit has typed field errors rather than a form-level alert channel.
- Body type deliberately uses no share/print and no scroll effect because the source quiz has none.

## Issues encountered

- MDX initially parsed indented closing tags after a Markdown list as part of the list. Unindenting `</ToolInfo>` and `</ToolPage>` fixed the build; Markdown children inside `ToolInfo` still compile correctly.
- No lint script exists in the repository; validation remains typecheck, Vitest, and build.
- This work remains uncommitted, ready for the follow-up `piv-commit` step.
