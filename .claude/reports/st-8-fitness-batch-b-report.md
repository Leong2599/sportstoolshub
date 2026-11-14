# Implementation Report — ST-8 Fitness batch B (5 calculators)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-8)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-8 fitness tools end to end: golf handicap, sports injury risk, running pace,
running calories, and VO2 max. Each tool has a pure typed formula module with golden tests, a
kit-based React component, an MDX page carrying the source SEO prose, and a working `/tools/<slug>/`
route plus the `/tools/<slug>.html` legacy alias. Shared distance and pace conversions live in
`src/lib/calculators/units.ts` as the plan requires, so the later performance tools can reuse them.

## Tasks completed

- [x] Capture source formulas, thresholds, validation messages, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` + `script.js` (READ)
- [x] Extend shared unit helpers with distance/pace conversions → `src/lib/calculators/units.ts` (UPDATE)
- [x] Golf handicap port (handicap index, course handicap, net score) → `src/lib/calculators/golfHandicap.ts` (CREATE)
- [x] Injury risk port (5 weighted risk categories) → `src/lib/calculators/injuryRisk.ts` (CREATE)
- [x] Pace port (time→pace, pace→time, Riegel race prediction) → `src/lib/calculators/pace.ts` (CREATE)
- [x] Running calorie port (MET model, terrain/intensity/elevation) → `src/lib/calculators/runningCalorie.ts` (CREATE)
- [x] VO2 max port (4 test methods, age/gender ranges) → `src/lib/calculators/vo2max.ts` (CREATE)
- [x] Golden formula tests → `src/lib/calculators/{golfHandicap,injuryRisk,pace,runningCalorie,vo2max}.test.ts` (CREATE)
- [x] Kit-based components + per-tool CSS modules → `src/components/calculators/{GolfHandicapCalculator,InjuryRiskCalculator,PaceCalculator,RunningCalorieCalculator,Vo2MaxCalculator}.tsx` + `.module.css` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{golf-handicap-calculator,injury-risk-calculator,pace-calculator,running-calorie-calculator,vo2max-calculator}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 28 ports → `README.md` (UPDATE)

## Parity contracts

### Golf handicap

- Score differential `(score - rating) × 113 ÷ slope`, rounded to one decimal, exactly as the source.
- Best-N lookup preserved verbatim: 3→1, 4→1, 5→1, 6→1, 7→2, 8→2, 9→3, 10→3, 11→4, 12→4, 13→5,
  14→5, 15→6, 16→6, 17→7, 18→7, 19→8, 20→8, default 8.
- Handicap index `round(average × 0.96 × 10) / 10`, clamped to [-10, 54]; average is the mean of the best N.
- Course handicap `round(index × slope ÷ 113 + (rating − par))`; net score `gross − course handicap`.
- The source's four-step course-handicap breakdown, the "✓ / -" used-column, the six performance
  assessment bands, and the five handicap-index recommendation bands are reproduced verbatim.
- The source's `differentials.sort()` sorts **in place** and the breakdown then indexes that sorted
  array by the original score index. This quirk is preserved so the "Used?" markers and per-round
  differentials match the source byte for byte.

### Injury risk

- Five category scores preserved: personal (age/gender/experience), training (weekly hours, intensity,
  warm-up, cool-down), physical (flexibility, strength, balance, body weight), history (injury count,
  recovery time, current pain), lifestyle (sleep, stress, nutrition, hydration).
- Each category capped at 100; overall risk is the weighted sum (personal 0.15, training 0.25,
  physical 0.20, history 0.25, lifestyle 0.15) rounded to an integer.
- Risk bands, colors, the five risk-category bars, the "> 60 = high risk area" list, and the
  conditional prevention sentences are preserved verbatim.
- **The source uses `||` (not `??`) for every risk-table lookup**, so a table value of `0` falls through
  to the fallback. This is reproduced exactly (`|| 10`, `|| 5`, `|| 0`), because it changes real outputs:
  for example "normal" body weight contributes 5 points, not 0, and low stress contributes 10.

### Pace

- Three calculation types preserved: pace from time and distance, time from pace and distance, and
  Riegel race prediction with exponent 1.06 over 5K / 10K / Half Marathon / Marathon.
- Pace and speed use the source's distance conversions (km × 1000, miles × 1609.34, yards × 0.9144)
  and the fixed `0.621371` min/mile → min/km factor rather than the exact `1 / 1.60934`.
- Splits are cumulative kilometre splits; the source's `mm:ss` vs `hh:mm:ss` formatting switch is kept.
- The four training recommendations (marathon / half / 10K / 5K) and the Riegel caveat are verbatim.

### Running calorie

- MET table preserved exactly (6.0 below 6 km/h up to 18.0 at 18 km/h and above).
- Terrain multipliers (flat road 1.0 → sand 1.40), intensity multipliers (easy 0.9 → race 1.30),
  gender adjustment (male 1.0 / female 0.9), and age adjustment
  `max(0.8, 1 − (age − 25) × 0.005)` preserved.
- Elevation bonus `meters × 0.05 × weightKg`, added before the final round.
- The 85/15 breakdown, the five activity comparisons (walking/cycling/swimming/weight training/yoga),
  the four calorie-band recommendation sentences, and the recovery sentence are verbatim.
- The source's yard → kilometre conversion (0.0009144) and mile → kilometre conversion (1.60934) are
  used as in the source rather than the pace tool's metre-based constants.

### VO2 max

- Four methods preserved: resting heart rate (`15.3 × maxHR ÷ restingHR`), 1.5 mile run
  (`100.5 − 0.163w − 2.2t − 0.071age`), 12-minute run (Cooper `(metres − 504.9) ÷ 44.73`), and the
  Harvard step test (`111.33 − 0.42post + 0.234age + 0.845recovery − 2.9duration`).
- Female multiplier 0.85 applied to every method; the 12-minute run then applies the age factor
  `max(0.7, 1 − (age − 25) × 0.01)`, matching the source's ordering.
- Range table preserved: 60 / 50 / 40 / 30 / 0, scaled by 0.85 when age > 40 and again by 0.85 for
  females, with the source's category, color, and recommendation copy.

## Tests added

- `src/lib/calculators/pace.test.ts` — 6 cases: 5K/45min pace and speed, imperial conversion, pace→time
  finish time, Riegel predictions, race distance table, validation.
- `src/lib/calculators/runningCalorie.test.ts` — 6 cases: 10K MET golden value with breakdown and
  comparisons, terrain/elevation/gender adjustments, distance+time method, time+pace method, MET and
  multiplier tables, validation.
- `src/lib/calculators/vo2max.test.ts` — 6 cases: all four methods, age/gender range adjustment,
  validation.
- `src/lib/calculators/golfHandicap.test.ts` — 6 cases: handicap index with breakdown rows, score-count
  lookup, course handicap with breakdown steps, net score, performance bands, validation.
- `src/lib/calculators/injuryRisk.test.ts` — 4 cases: healthy profile category scores and weighted
  overall risk, high-risk profile with high-risk-area list, risk band and color tables, validation.
- `src/components/calculators/PaceCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/RunningCalorieCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/Vo2MaxCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/GolfHandicapCalculator.test.tsx` — 4 integration cases.
- `src/components/calculators/InjuryRiskCalculator.test.tsx` — 3 integration cases.
- Suite result: 36 test files, 184 tests passed (47 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (36 files, 184 tests), stable across three consecutive runs
- `npm run build` — PASS
  - `[legacy-aliases] emitted 14, missing 244, skipped 1, conflicts 0` (up from 9 at ST-7; the five new
    tool aliases now resolve)
  - Verified `/tools/<slug>/index.html` and `/tools/<slug>.html` exist for all five tools, each alias
    carrying the canonical link and meta refresh.
  - Verified each built page renders its `<h1>`, the calculator form, the catalog `seoDescription` as
    the meta description, and the source SEO prose headings.
  - Verified no `undefined` CSS-module class names in the built HTML.

## Deviations from the plan

- **The running-calorie source page has no `<main>` body at all** — only the nav, two footers, and the
  inline script. This is true in every commit of the read-only source repo (`97ca403`, `9eb8384`,
  `64a5def`) and on the live site, so there is no source form markup or SEO prose to extract. The
  calculator behavior was ported exactly from the inline script (which is complete and self-consistent),
  and the form fields were reconstructed from the element IDs the script reads (`calculation-method`,
  `distance`, `pace-minutes`, `dt-distance`, `tp-pace-*`, `terrain`, `intensity`, `elevation`, …).
  The MDX prose was written from the script's own algorithm and the page's meta description instead of
  being copied from a source body that does not exist. **This is a source defect worth fixing upstream.**
- Added one CSS module per tool (5 files) rather than growing the shared `ToolCalculator.module.css`.
  Each tool has a bespoke result shape (splits grid, macro/zone/comparison grids, risk bars, score
  table), so per-tool modules keep the shared file from accumulating one-off layouts. Shared chrome
  (`layout`, `card`, `sectionTitle`, `recommendation`) still comes from `ToolCalculator.module.css`.
- The plan's file estimate did not count these CSS modules; they are additive and do not change scope.
- `src/lib/calculators/units.ts` gained the shared distance/pace helpers the plan asked for
  (`distanceToMeters`, `distanceToKm`, `metersToKm`, `metersToMiles`, `paceSecondsPerKm`, plus
  `DISTANCE_UNITS`). This is the plan's explicit instruction for `pace-calculator`.
- The source's `alert()` validation is represented as accessible inline errors, consistent with the
  ST-5 kit. Source messages are preserved verbatim where the source defined them; the injury-risk
  messages for range violations had no source equivalent (the source relied on native HTML
  constraints), so they were written in the same voice.
- Golf handicap score inputs are rendered as a dynamic row per score (3/5/8/10/15/20) rather than a
  source-style `innerHTML` container, and the component tracks the score/rating/slope triples in one
  `values` object.

## Issues encountered

- **Source defect:** `running-calorie-calculator.html` has never contained a `<main>` section in any
  commit. Confirmed against the live site as well. Handled as described above; needs an upstream fix.
- The injury-risk source uses `||` for its risk-table lookups, so `0` values fall through to the
  fallback. I initially implemented `??` and my golden values disagreed with a faithful re-execution of
  the source script; the implementation was corrected to `||` and the golden values were re-derived from
  the source algorithm.
- The golf source sorts `differentials` in place and then indexes it by the original score index, which
  mis-pairs differentials with scores. The port reproduces this rather than "fixing" it, because the
  acceptance criterion is that computed values match the source.
- The injury-risk integration test initially timed out at the 5 s default under parallel load, and the
  aborted async user-event work then contaminated the next test in the same file (it produced 38 %
  instead of 44 %). Fixed by using `userEvent.setup({delay: null})` and an explicit 20 s timeout on the
  heavy tests. Verified stable across three full-suite runs.
- The MDX frontmatter `description` was initially the short catalog `description`; it now uses the
  catalog `seoDescription`, matching the ST-6/ST-7 pages and the SEO contract.

## Follow-ups for the reviewer

- The 5 tools are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- ST-9 onward should reuse `distanceToMeters` / `distanceToKm` / `paceSecondsPerKm` from
  `src/lib/calculators/units.ts` rather than re-deriving conversions, as the plan requires.
- The running-calorie source page should be repaired upstream so its form and prose can be verified
  against the live tool rather than reconstructed from the script.
