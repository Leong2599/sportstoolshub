# Implementation Report — ST-11 Performance batch C (planning and environment)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-11)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-11 tools end to end: training load (CTL/ATL/TSB), race strategy planner, heat
acclimatization, altitude adjustment, and the combat sports weight class optimizer. Each tool has a
pure typed formula module with golden tests, a kit-based React component, an MDX page carrying the
source SEO prose, and a working `/tools/<slug>/` route plus the `/tools/<slug>.html` legacy alias. Per
the plan, the planners and optimizer keep their own bespoke result shapes (projection table, fueling
timeline, zone table, weight-class list) rather than being forced through a generic schema, and the
optimizer logic stays pure and separately testable.

## Tasks completed

- [x] Capture source formulas, thresholds, validation, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` (READ)
- [x] Shared environmental helpers (only where the math is identical) → `src/lib/calculators/environmentAdjustment.ts` (CREATE)
- [x] Training load port (CTL/ATL/TSB, 14-day projection, optimal ranges) → `src/lib/calculators/trainingLoad.ts` (CREATE)
- [x] Race strategy port (splits, fueling timeline, environmental adjustments) → `src/lib/calculators/raceStrategy.ts` (CREATE)
- [x] Heat acclimatization port (heat index, WBGT, pace/hydration adjustments) → `src/lib/calculators/heatAcclimatization.ts` (CREATE)
- [x] Altitude adjustment port (VO2 max decrease, training zones, health risk) → `src/lib/calculators/altitudeAdjustment.ts` (CREATE)
- [x] Combat sports weight class port (weight class database, suitability scoring) → `src/lib/calculators/combatWeightClass.ts` (CREATE)
- [x] Golden formula tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + shared batch CSS module → `src/components/calculators/{TrainingLoadCalculator,RaceStrategyPlanner,HeatAcclimatizationCalculator,AltitudeAdjustmentCalculator,CombatWeightClassOptimizer}.tsx` + `PerformanceBatch.module.css` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{training-load-calculator,race-strategy-planner,heat-acclimatization-calculator,altitude-adjustment-calculator,combat-sports-weight-class-optimizer}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 13 ports → `README.md` (UPDATE)

## Parity contracts

### Training load

- CTL `= current × 41/42 + tss × 1/42`, ATL `= current × 6/7 + tss × 1/7`, TSB `= CTL − ATL`.
- 14-day projection preserved including the source's week-two reduction (target TSS × 0.8 from day 8).
- Target TSS table (40/60/80/100 by experience) and goal multipliers (0.8/1.2/1.4/0.5/0.3/0.9) preserved.
- Optimal ranges, TSB status bands, insight rules, and recommendation rules (including the per-event
  target TSB table) preserved.
- Fitness, fatigue, and form change percentages keep the source's exact formulas, including the
  `Math.abs(currentTsb + 1)` denominator on the form-change calculation.

### Race strategy

- Race distance table preserved for all 13 event types, including triathlon swim distances.
- Triathlon pace split preserved (20% swim / 50% bike / 30% run) with the source's `/100m`, `km/h`,
  and `/km` formatting.
- All five pacing strategies preserved with their exact split percentages (48/52, 50/50, 52/48,
  26/48/26, 24/50/26).
- Fueling timeline preserved: 500 ml/h base fluid with temperature, humidity, and running
  adjustments; calorie and electrolyte lines only appear past the source's 90 and 60 minute marks.
- Environmental adjustments preserved (heat/humidity thresholds, ×1.2 for cycling, ×1.3 for running).

### Heat acclimatization

- Heat index preserved: the simplified formula below 27 °C, then the Rothfusz regression above 27 °C
  with 40% humidity.
- WBGT preserved: `0.7 × wetBulb + 0.2 × globeTemp + 0.1 × temp`.
- Pace adjustment preserved (8 s per degree above 25 °C, 4 above 20 °C, 2 above 15 °C; humidity
  penalties; activity and intensity multipliers; acclimatisation benefit capped at 40%).
- Hydration, performance impact, and health risk scoring preserved, including the acclimatisation
  downgrade applied at 14+ days.

### Altitude adjustment

- VO2 max decrease preserved: 3% per 300 m above 1500 m, measured relative to home altitude.
- Performance decrease preserved with the fitness multiplier (1.2/1.1/1.0/0.9) and the acclimatisation
  benefit capped at 80%.
- Training zone table preserved: the source defines zones for running and cycling only, and every other
  activity falls back to the running zones — reproduced rather than "improved".
- Altitude benefits, health risk, insights, and recommendations preserved.

### Combat sports weight class

- Full weight class database preserved for MMA (9), boxing (16), wrestling (10), and BJJ (8), with
  the source's sport mapping (Muay Thai and Karate use boxing classes, Judo uses wrestling).
- Optimal class selection preserved: 5% safe cut, 8% for advanced cut history, minimum 85% lean mass,
  ±5 lb tolerance window, suitability scoring, and descending suitability sort.
- Ideal weight, power-to-weight, reach advantage, cutting difficulty, performance impact, and health risk
  all preserved with the source's exact thresholds.

## Tests added

- `src/lib/calculators/trainingLoad.test.ts` — 5 cases: load projection, 14-day projection, the
  exponential moving average helpers, the week-two reduction, validation.
- `src/lib/calculators/raceStrategy.test.ts` — 6 cases: 10K strategy, fueling timeline, triathlon pace
  split, all split strategies, race details and formatters, validation.
- `src/lib/calculators/heatAcclimatization.test.ts` — 4 cases: hot humid run, heat index and WBGT helpers,
  pace adjustment with acclimatisation, validation.
- `src/lib/calculators/altitudeAdjustment.test.ts` — 4 cases: 2500 m target, VO2 max and performance
  decrease helpers, training zones and acclimatisation benefits, validation.
- `src/lib/calculators/combatWeightClass.test.ts` — 5 cases: MMA welterweight, BJJ heavyweight, weight
  class lookup and sport mapping, cutting difficulty bands, validation.
- `src/components/calculators/TrainingLoadCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/RaceStrategyPlanner.test.tsx` — 3 integration cases.
- `src/components/calculators/HeatAcclimatizationCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/AltitudeAdjustmentCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/CombatWeightClassOptimizer.test.tsx` — 3 integration cases.
- Suite result: 66 test files, 308 tests passed (39 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (66 files, 308 tests), stable across two consecutive runs
- `npm run build` — PASS
  - `[legacy-aliases] emitted 29, missing 229, skipped 1, conflicts 0` (up from 24 at ST-10; the five new
    tool aliases now resolve)
  - Verified `/tools/<slug>/index.html` and `/tools/<slug>.html` exist for all five tools, each alias
    carrying the canonical link and meta refresh.
  - Verified each built page renders its `<h1>`, the calculator form, the catalog `seoDescription` as
    the meta description, and the source SEO prose headings.
  - Verified no `undefined` CSS-module class names in the built HTML.

## Deviations from the plan

- Added `src/lib/calculators/environmentAdjustment.ts` with only the conversions the heat and altitude
  tools genuinely share (Fahrenheit→Celsius, feet→metres, pounds→kilograms, the 14-day acclimatisation
  progress bar, and whole-week recovery protection). The plan says to "extract shared helpers only if
  the math truly matches" — the heat index, WBGT, VO2 max decrease, and training zone models all differ,
  so they stay in their own modules.
- Added one shared CSS module (`PerformanceBatch.module.css`) for the five tools rather than five
  near-identical files, since they share the same metric-grid, table, list, and zone styles. The bespoke
  result shapes (projection table, fueling timeline, zone table, weight-class list) remain tool-specific
  markup.
- The combat sports source builds `weightNeeded` on its class objects but reads `weightRequired` when
  rendering, so the source page displays "undefined lbs" for the recommended weight. The port uses
  `weightRequired` consistently and shows the real class maximum. The underlying calculations are
  unchanged; only the source's undefined output is corrected.
- The altitude training zone table only defines running and cycling zones in the source; every other
  activity falls back to the running zones. Reproduced rather than extended.
- Source pages drop the emoji prefixes on several `<h1>` and section headings. Those prefixes were also
  dropped in ST-6 through ST-10 and are not part of the catalog title or SEO copy.

## Issues encountered

- Several of my first-pass golden expectations were transcription errors rather than implementation
  faults (for example the soccer-style midfielder load is 143.5, not 143.4375, and the altitude zone
  adjustment is 7.037037037037042). Each was re-derived by re-executing the source algorithm in Node
  and corrected against that, rather than adjusted to fit the implementation.
- The source's heat index produces a physiologically implausible 166.0 at 32 °C / 70% humidity because
  the simplified branch hands off to the full Rothfusz regression without the usual applicability
  limits. The value is reproduced exactly rather than clamped, since it is a computed result the source
  displays.
- The source's race time fields are optional and blank fields coerce to zero, which would produce an
  infinite pace. The port requires a non-zero total target time and treats blank hours/minutes/seconds
  as zero, matching the source's coercion.
- My first validation ranges for the heat and altitude duration, acclimatisation days, and altitude
  fields did not match the source's input bounds. Corrected to the source's own limits (duration
  15–480 minutes, acclimatisation 0–30 days, altitude 0–8000 m) after reading them from the source
  markup.
- The injury-risk test in ST-10 timed out under parallel load and contaminated the next test; the same
  fix (`userEvent.setup({delay: null})` plus explicit per-test timeouts) was applied here.

## Follow-ups for the reviewer

- The 5 tools are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- ST-12 onward should reuse `sportValidation.ts` and `environmentAdjustment.ts`, and should follow the
  same shared-batch CSS module pattern.
- The combat sports weight class page should be fixed upstream: it currently renders "undefined lbs"
  for the recommended weight.
