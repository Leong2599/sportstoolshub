# Implementation Report — ST-14 Nutrition batch C (planners)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-14)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the three ST-14 planner tools end to end: intermittent fasting planner, refeed day calculator,
and weight cut/gain planner. Each tool has a pure typed formula module with golden tests, a kit-based
React component, an MDX page carrying the source info-card prose, and a working `/tools/<slug>/` route
plus the `/tools/<slug>.html` legacy alias.

**The headline finding:** unlike every earlier batch, these three source pages ship **no JavaScript**.
`script.js` contains no handler for `intermittentFastingForm`, `refeedForm`, or `weightCutGainForm`,
and `git log -S` across the entire source repository history confirms no implementation ever existed.
The source pages are form shells: complete input markup, empty result containers, and educational info
cards. There was no source logic to port. The port therefore reconstructs each calculator from the
contract the source pages *do* define - the exact field set, option lists, min/max bounds, result
section headings, and info-card prose - and derives the formulas from standard sports-nutrition
practice, keeping every rate inside the band the source's own information card states. This is a
material deviation from the "port the source logic" pattern used in ST-6 through ST-13 and is detailed
under **Deviations**.

## Tasks completed

- [x] Capture the source contract for all 3 tools (fields, options, bounds, result sections, prose) → read-only `tools/<slug>.html` and `script.js` (READ)
- [x] Confirm the source has no calculator logic for these tools → `script.js` has no form handlers; `git log -S` across all history finds none (READ)
- [x] Intermittent fasting planner (method ladder, weekly windows, alignment, nutrition, tips) → `src/lib/calculators/intermittentFasting.ts` (CREATE)
- [x] Refeed day calculator (style bands, carb sensitivity, macros, timing, progression) → `src/lib/calculators/refeedDay.ts` (CREATE)
- [x] Weight cut/gain planner (rate bands, phase plan, risk scoring, success rate) → `src/lib/calculators/weightCutGain.ts` (CREATE)
- [x] Golden formula and validation tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + shared batch CSS module → `src/components/calculators/{IntermittentFastingPlanner,RefeedDayCalculator,WeightCutGainPlanner}.tsx` + `NutritionBatch.module.css` (CREATE/UPDATE)
- [x] Checkbox and date primitives the source forms need → `src/components/calculators/kit/{CheckboxGroup,DateField}.tsx` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source info-card prose → `src/pages/tools/{intermittent-fasting-planner,refeed-day-calculator,weight-cut-gain-planner}.mdx` (CREATE)
- [x] Document the batch pattern → `README.md` (UPDATE)

## Source contract captured

### Intermittent Fasting Planner

- Form: gender, age (18-80), current weight (40-200kg), target weight (40-200kg), fasting experience
  (5 levels), preferred IF method (16:8 / 18:6 / 20:4 / Eat-Stop-Eat / 5:2 / Custom), training days
  per week (2-7), primary training type (5), preferred training time (6), training intensity (4),
  seven training-day checkboxes, primary goal (6), lifestyle (5).
- Result sections: Recommended Fasting Method, Weekly Schedule, Training & Fasting Alignment, Nutrition
  Timing Guidelines, Adaptation & Success Tips.
- Info cards became the MDX prose verbatim.

### Refeed Day Calculator

- Form: gender, age (18-80), current weight (40-200kg), body fat (5-50, optional), maintenance calories
  (1200-5000), cutting calories (1200-5000), cutting protein (50-400g), cutting carbs (20-500g),
  cutting fats (20-200g), weeks dieting (0-52), training days/week (3-7), training intensity (4),
  primary training (5), weekly cardio (0-600, step 15), refeed frequency (6), refeed style (4
  including Custom), preferred refeed day (5), carb sensitivity (4).
- Result sections: Recommended Refeed Schedule, Refeed Day Macros, Best Refeed Foods, Refeed Timing
  Strategy, Post-Refeed Protocol, Refeed Progression.
- The style option labels carry the source's own percentage bands: conservative 20-30%, moderate
  30-50%, aggressive 50-75% above maintenance. Those bands drive the calculation.

### Weight Cut / Weight-Gain Planner

- Form: gender, age (16-80), current weight (40-300kg), height (100-250cm), body fat (3-60, optional),
  activity level (5), goal type (4), target weight (40-300kg), target date, priority (4), sport type
  (8), competition schedule (5), weight class requirement (4), strength priority (4), medical
  conditions (6), medications (4), previous weight change experience (5), support system (5).
- Result sections: Recommended Approach, Weekly Targets (weight change, calorie deficit/surplus,
  timeline, success rate), Phase-Based Plan, Nutrition Strategy, Training Modifications, Monitoring &
  Adjustments, Risk Assessment.
- The info card states the sustainable bands used by the calculator: 0.5-1% of body weight per week
  for fat loss, 0.25-0.5% for muscle gain.

## Reconstructed formulas

### Intermittent fasting

- The recommendation ladder is `16:8 → 18:6 → 20:4`, indexed by experience (beginner/some = 16:8,
  regular = 18:6, experienced/advanced = 20:4), shifted by goal (fat loss +1, muscle gain and
  performance -1) and intensity (high and very high -1), then clamped so a beginner never lands
  above 16:8 and no level lands more than one step above its experience band.
- Advanced fasters with a fat-loss goal get Eat-Stop-Eat, matching the source info card's "advanced
  methods like Eat-Stop-Eat provide periodic metabolic benefits".
- Eating windows open 1 hour after high-intensity training and 2 hours after low/moderate training,
  matching the source cards' "train just before breaking your fast" and "low-to-moderate intensity
  training works well fasted"; rest days open at 12:00.
- Eat-Stop-Eat and 5:2 place their restricted day on the first rest day in the week.
- Protein is `weightKg × 1.6-2.2g` by goal, split across `round(eatHours / 3)` meals, minimum two.

### Refeed day

- Surplus percentage: conservative 25%, moderate 40%, aggressive 62% above maintenance, scaled by
  carb sensitivity (sensitive 0.8, normal 1.0, resistant 1.1, unknown 0.9).
- Refeed calories are `maintenance × (1 + surplus)`. Protein and fat carry over from the cutting
  macros; carbohydrates absorb the remaining calories, which is what makes the plan carb-led.
- Recommended frequency escalates for long cuts: never becomes weekly under 8 weeks and every 2 weeks
  at 8+ weeks; monthly becomes every 3 weeks past 12 weeks of dieting.
- Food portions scale with the computed carbohydrate target so the list always matches the macros.

### Weight cut / gain

- Weekly rate is a percentage of body weight: fat loss 1.0/0.75/0.5/0.5% and muscle gain
  0.5/0.35/0.25/0.25% for aggressive/moderate/conservative/performance priority. Every rate sits inside
  the source card's stated sustainable band.
- Calorie adjustment is `|weeklyKg × 7700| / 7` per day against a Mifflin-St Jeor TDEE (reusing
  `nutritionMetrics.ts`), floored at 1200 calories.
- Protein is 2.2g/kg on a cut, 1.8g/kg on a gain, 1.6g/kg otherwise; fat takes 30% of calories
  (25% on a gain) and carbs take the remainder.
- Timeline is `ceil(|target - current| / weeklyChange)`; maintenance and recomposition run a fixed
  12-week block because neither is a scale goal.
- Success rate starts at 90% and is adjusted for priority, achievable timeline, previous attempts,
  support system, medical conditions, medication, and competition proximity, clamped to 35-97%.
- Risk factors are scored into Low / Moderate / High / Very High, including a hard flag when the
  target date is unreachable at the planned rate.

## Tests added

- `src/lib/calculators/intermittentFasting.test.ts` — 8 cases: beginner recommendation, ladder
  shifts, weekly plan, high-intensity window, periodised protocols, custom schedule, clock
  formatting, validation.
- `src/lib/calculators/refeedDay.test.ts` — 6 cases: macro split, style and sensitivity bands,
  frequency escalation, section content, timing swap, validation.
- `src/lib/calculators/weightCutGain.test.ts` — 8 cases: moderate cut, rate bands, lean gain,
  maintenance and recomposition, success scoring, unreachable date, section content, validation.
- `src/components/calculators/IntermittentFastingPlanner.test.tsx` — 3 integration cases.
- `src/components/calculators/RefeedDayCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/WeightCutGainPlanner.test.tsx` — 4 integration cases.
- Suite result: 93 test files, 427 tests passed (32 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (93 files, 427 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 42, missing 216, skipped 1, conflicts 0` (up from 39 at ST-13; all three new tool aliases resolve)
  - Verified `/tools/{intermittent-fasting-planner,refeed-day-calculator,weight-cut-gain-planner}/index.html` exist.
  - Verified `/tools/{intermittent-fasting-planner,refeed-day-calculator,weight-cut-gain-planner}.html` alias files are emitted.
  - Verified all three aliases appear in `.docusaurus/legacy-aliases-report.json`.

## Deviations from the plan

- **The source has no calculator logic for these three tools.** `script.js` has no handler for
  `intermittentFastingForm`, `refeedForm`, or `weightCutGainForm`, and `git log -S` over the whole
  source repository history shows no implementation was ever committed. The pages are form shells with
  empty result containers. Rather than ship three non-functional calculators, the port reconstructs each
  one from the contract the pages do define: the exact input set, option lists, min/max bounds,
  result-section structure, and info-card prose. **The formulas are new and are derived from standard
  sports-nutrition practice, constrained to the bands the source's own info cards state** (0.5-1% of
  body weight per week for fat loss, 0.25-0.5% for muscle gain; 20-30/30-50/50-75% refeed surplus
  bands). These are not source-parity outputs and must be reviewed on their own merits.
- The plan describes these as "multi-step planners ... Validate the full planner flow (state
  transitions, unit toggles, result summary)". The source forms have no unit toggles and no wizard
  steps, so there is no multi-step flow to preserve. The one state transition in the source is the
  "Custom Schedule" method option, which the port implements by revealing fast-length and
  eating-window inputs (12-20h and 4-8h).
- The source's three planner pages have no share or print actions, so the components render no action
  buttons. The share payloads exist for consistency with the rest of the batch but are not surfaced.
- Added `CheckboxGroup` and `DateField` to the kit for the source's seven-day checkbox group and
  target-date input. Neither primitive existed.
- The weight cut/gain planner uses Mifflin-St Jeor (reusing `nutritionMetrics.ts`) for its TDEE. The
  source page never computes calories, so this is a reconstruction choice; it matches the BMR, TDEE,
  and hydration tools already in the site.
- The intermittent fasting planner treats the source's "Preferred IF Method" as a preference the plan
  may override. The result states both the planned method and the recommendation, and says so in the
  card when they differ. Eat-Stop-Eat, 5:2, and Custom are always honoured as explicit choices because
  they cannot be expressed as a daily window.

## Issues encountered

- The first weekly-rate implementation multiplied body weight by the percentage without dividing by
  100, producing a 60kg-per-week cut. The rate tables now express percentages correctly and the golden
  tests assert the resulting kilograms.
- The maintenance and recomposition timeline divided a weight difference by a rate that does not apply
  to them, producing a nonsensical one-week plan. They now run a fixed twelve-week planning block.
- Three golden expectations were written against the buggy first implementation (feeding rates,
  carbohydrate split, and a tipping title). Each was re-derived from the corrected formula rather than
  from the implementation output, and the corrected values are now asserted.

## Follow-ups for the reviewer

- **Review the reconstructed formulas on their own merits.** These are not source-parity outputs; the
  source pages had none. The bands used are stated in the source's own info cards, but the exact
  ladder, escalation rules, and success-rate weights are new and should be confirmed by whoever owns
  the nutrition content.
- The 5 tools, 2 kit primitives, CSS additions, README update, and this report are uncommitted on
  `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`, then `piv-review-pr`.
- The source site should either ship working calculators for these three pages or drop them from the
  catalog. Leaving them as dead form shells is what created the reconstruction gap in the first place.
- ST-15 onward should reuse `nutritionMetrics.ts` for any calorie maths and the `CheckboxGroup` and
  `DateField` primitives for form fields.
