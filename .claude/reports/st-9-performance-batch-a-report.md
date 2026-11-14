# Implementation Report — ST-9 Performance batch A (5 calculators)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-9)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-9 performance trackers end to end: cycling power, swim pace, stride length and
cadence, cycling gear ratio, and swimming stroke efficiency. Each tool has a pure typed formula
module with golden tests, a kit-based React component, an MDX page carrying the source SEO prose, and a
working `/tools/<slug>/` route plus the `/tools/<slug>.html` legacy alias. As the plan requires for
this batch, the result shapes stay bespoke per tool (no universal engine) while `UnitField`,
`ResultRow`, and the shared `ToolCalculator.module.css` chrome are reused wherever they are honest.

## Tasks completed

- [x] Capture source formulas, thresholds, validation messages, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` (READ)
- [x] Cycling power port (physics model, FTP, power-to-weight, 7 zones) → `src/lib/calculators/cyclingPower.ts` (CREATE)
- [x] Swim pace port (pace from time, time from pace, interval plan) → `src/lib/calculators/swimPace.ts` (CREATE)
- [x] Stride length and cadence port (4 input modes, efficiency model) → `src/lib/calculators/strideCadence.ts` (CREATE)
- [x] Cycling gear ratio port (bike setup database, gear analysis) → `src/lib/calculators/cyclingGearRatio.ts` (CREATE)
- [x] Swimming stroke efficiency port (SWOLF, efficiency index, performance level) → `src/lib/calculators/swimStrokeEfficiency.ts` (CREATE)
- [x] Golden formula tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + per-tool CSS modules → `src/components/calculators/{CyclingPowerCalculator,SwimPaceCalculator,StrideCadenceCalculator,CyclingGearRatioCalculator,SwimStrokeEfficiencyCalculator}.tsx` + `.module.css` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{cycling-power,swim-pace,stride-length-cadence-calculator,cycling-gear-ratio-calculator,swimming-stroke-efficiency-calculator}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 23 ports → `README.md` (UPDATE)

## Parity contracts

### Cycling power

- Physics model preserved exactly: `g = 9.81`, `CdA = 0.4`, `Crr = 0.005`, air density `1.225`, with
  climbing, rolling-resistance, and air-resistance terms summed and rounded to whole watts.
- Conversions preserved: mph → m/s `× 0.44704`, km/h → m/s `÷ 3.6`, lbs → kg `× 0.453592`. Slope and wind
  default to 0 when left blank, exactly as the source does.
- FTP multipliers preserved: 20 min `× 0.95`, 60 min `× 1.00`, 30 min `× 0.93`, 8 min `× 0.90`.
- The seven power zones and their watt ranges, and all three recommendation sets (power-from-speed,
  FTP, power-to-weight) with their exact band thresholds, are reproduced verbatim.

### Swim pace

- Pace per 100 m uses `floor` for minutes and seconds and `round` for hundredths; the `/50m` value is
  derived by halving the per-100 m value, exactly as the source does.
- Split times use the same `mm:ss.hh` formatting, and the pace→time mode hardcodes a 25 m pool for
  splits while the time→distance mode uses the selected pool size — both quirks preserved.
- Yard conversion `× 0.9144`, speed in km/h (`× 3.6`) and mph (`× 2.237`), and the four-band pace
  recommendation thresholds (`> 150`, `> 120`, `> 90`) are preserved.

### Stride length and cadence

- Stride length `100000 / (cadence × paceMinutes)`, cadence `stepsPerKm / paceMinutes`, and pace from
  cadence and stride `(100000 / strideLength) / cadence × 60` are reproduced exactly.
- The efficiency model is preserved: 100 points minus the cadence deviation penalty
  (`|Δ| / 20 × 50`), the stride deviation penalty against a 110 cm optimum (`× 30`), and the
  cadence–stride balance penalty against the source's ideal stride (`× 20`), clamped to 0–100.
- Optimal stride multipliers (0.43–0.47 by experience), optimal cadence table, distance adjustments
  (marathon/ultra +5, 5K +3), ground contact time, vertical oscillation, stride angle, and all
  recommendation and insight rules are preserved.

### Cycling gear ratio

- The full bike setup database (8 bike types with chainrings, cassettes, and tires) is ported verbatim.
- Cassette expansion preserved: cogs step by 1 up to 15 then by 2, capped at the maximum cog.
- Wheel circumference, gear ratio, meters per crank, speed at cadence, gear inches, and development
  are preserved, including the source's `gearInches = ratio × 27` approximation.
- Gears sorted by descending ratio; fastest/easiest, cruising (25/30/35 km/h target by fitness level),
  climbing (~18 km/h), and high-cadence gear selection rules and the speed-band chart are preserved.
- Cadence recommendations and all recommendation/insight rules are reproduced verbatim.

### Swimming stroke efficiency

- SWOLF `round(timePerLength + strokesPerLength)`, pace per 100 m, speed in km/h, stroke rate,
  distance per stroke, and strokes per length are preserved.
- Efficiency index `(distanceScore × 0.6 + rateEfficiency × 0.4) × 100 × strokeMultiplier` and
  technical efficiency `clamp((1 − (adjustedSWOLF − elite) / elite) × 100)` are preserved, including
  the per-stroke multipliers (freestyle 1.0 … breaststroke 0.8) and the experience adjustments.
- Performance level scoring (SWOLF 40%, stroke rate 30%, distance per stroke 30%) and the 85/70/55/40
  band thresholds are preserved, including the source's use of freestyle ranges for scoring.
- Optimal ranges per stroke and experience, improvement areas, training recommendations, and insights
  are reproduced.

## Tests added

- `src/lib/calculators/cyclingPower.test.ts` — 6 cases: physics golden value, imperial/gradient golden
  value, all four FTP durations, power-to-weight, the seven-zone table, validation.
- `src/lib/calculators/swimPace.test.ts` — 5 cases: pace and speed golden value with splits, yard
  conversion, predicted finish time, interval plan, validation.
- `src/lib/calculators/strideCadence.test.ts` — 7 cases: pace+cadence, pace+stride, cadence+stride,
  height-based estimate, distance adjustments, recommendations/insights, validation.
- `src/lib/calculators/cyclingGearRatio.test.ts` — 7 cases: chainring/cassette parsing, road setup gear
  analysis, optimal gear selection, single-ring mountain setup, cadence adjustments, recommendations
  and insights, validation.
- `src/lib/calculators/swimStrokeEfficiency.test.ts` — 5 cases: SWOLF golden value, yard conversion,
  optimal range tables, improvement areas and recommendations, validation.
- `src/components/calculators/CyclingPowerCalculator.test.tsx` — 5 integration cases.
- `src/components/calculators/SwimPaceCalculator.test.tsx` — 5 integration cases.
- `src/components/calculators/StrideCadenceCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/CyclingGearRatioCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/SwimStrokeEfficiencyCalculator.test.tsx` — 3 integration cases.
- Suite result: 46 test files, 234 tests passed (50 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (46 files, 234 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 19, missing 239, skipped 1, conflicts 0` (up from 14 at ST-8; the five new
    tool aliases now resolve)
  - Verified `/tools/<slug>/index.html` and `/tools/<slug>.html` exist for all five tools, each alias
    carrying the canonical link and meta refresh.
  - Verified each built page renders its `<h1>`, the calculator form, the catalog `seoDescription` as
    the meta description, and the source SEO prose headings.
  - Verified no `undefined` CSS-module class names in the built HTML.

## Deviations from the plan

- Added one CSS module per tool (5 files) rather than growing the shared `ToolCalculator.module.css`.
  This batch's result shapes are deliberately bespoke (per the plan, "architecture explicitly rejects a
  universal engine"), so each tool owns its grid/list/table styling while shared chrome (`layout`,
  `card`, `sectionTitle`, `recommendation`) still comes from `ToolCalculator.module.css`.
- The plan's file estimate did not count these CSS modules; they are additive and do not change scope.
- **Source bug fixed:** `stride-length-cadence-calculator.html` reads `results.optimalCadenceRange[0]`
  in its render template, but `displayResults` is never passed an `optimalCadenceRange` key. On the live
  page this throws a `TypeError` and the entire results panel fails to render. The port computes and
  passes the range, so the tool works. The displayed values are otherwise unchanged.
- Swim pace rest time is validated (10–120 s). The source relies on the native `min`/`max` attributes
  alone; the kit renders `noValidate` forms, so the same bounds are enforced in the validator with a
  matching message.
- The stride and gear-ratio pages drop the emoji prefixes the source `<h1>` and section headings carry
  (for example the running-man emoji on "Stride Length & Cadence Calculator"). Emoji prefixes were
  also dropped in ST-6/ST-7 and are not part of the catalog title or SEO copy.
- Catalog `seoDescription` is used for the MDX frontmatter `description` on the three pages whose
  catalog entry has no trailing period, matching the ST-6/ST-7 pages.

## Issues encountered

- MDX build failure: the source's `Zone 1 (Active Recovery): <55% of FTP` line is parsed as a JSX tag
  by MDX and fails the build. Rewritten as "Under 55% of FTP" and the lesson added to the README.
- The stride source's `calculateOptimalValues` mutates the shared `experienceMultipliers` object when
  applying a distance adjustment (`baseValues.cadence += 5`). Because the map is rebuilt on every call
  in the source too, the port reproduces the same per-call behavior without the shared mutation, which
  would otherwise leak the +5 between calls.
- The stride source's efficiency score is 0 for most realistic inputs because its ideal-stride term
  uses `(100000 / cadence) / 60` as the target stride. That formula is preserved exactly rather than
  "corrected", so the reported efficiency matches the source.
- Several of my first-pass golden expectations were wrong (gear cruising/climbing selections, the
  single-ring cassette length, the source's mph/stride-angle outputs). Each was re-derived by
  re-executing the source algorithm in Node and corrected against it rather than adjusted to fit the
  implementation.

## Follow-ups for the reviewer

- The 5 tools are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- The stride-length-cadence source page has a genuine render-time bug (see above). It should be fixed
  upstream in the legacy source so the two implementations can be compared directly.
- ST-10 onward should follow the same pattern: a pure module per tool, a bespoke component, and
  shared chrome from `ToolCalculator.module.css`.
