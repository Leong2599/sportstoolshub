# Implementation Report — ST-10 Performance batch B (sport load trackers)

**Plan**: `docs/tickets/sportstools-migration.md` (ST-10)   **Branch**: `feature/st-3-legacy-urls`   **Status**: COMPLETE

## Summary

Ported the five ST-10 sport-specific trackers end to end: basketball vertical jump, soccer match
load, cricket bowling workload, tennis match energy, and badminton rally intensity. Each tool has a pure
typed formula module with golden tests, a kit-based React component, an MDX page carrying the source
SEO prose, and a working `/tools/<slug>/` route plus the `/tools/<slug>.html` legacy alias. Per the
plan, sport names, positions, surfaces, and unit conversions live in each module's typed inputs and
option tables rather than in copy conditionals, and the batch shares the new
`src/lib/calculators/sportValidation.ts` helpers so validation wording stays consistent.

## Tasks completed

- [x] Capture source formulas, thresholds, validation, rounding, and copy for all 5 tools → read-only `tools/<slug>.html` (READ)
- [x] Shared validation helpers for the sport trackers → `src/lib/calculators/sportValidation.ts` (CREATE)
- [x] Basketball vertical jump port (power, force, percentile, rating) → `src/lib/calculators/basketballJump.ts` (CREATE)
- [x] Soccer match load port (load, efficiency, position-weighted score, fatigue) → `src/lib/calculators/soccerMatchLoad.ts` (CREATE)
- [x] Cricket bowling workload port (ACWR, injury risk, fatigue, readiness) → `src/lib/calculators/cricketBowlingWorkload.ts` (CREATE)
- [x] Tennis match energy port (MET model, hydration, glycogen, recovery) → `src/lib/calculators/tennisMatchEnergy.ts` (CREATE)
- [x] Badminton rally intensity port (intensity, tactical diversity, fatigue) → `src/lib/calculators/badmintonRallyIntensity.ts` (CREATE)
- [x] Golden formula tests → matching `*.test.ts` files (CREATE)
- [x] Kit-based components + per-tool CSS modules → `src/components/calculators/{BasketballJump,SoccerMatchLoad,CricketBowlingWorkload,TennisMatchEnergy,BadmintonRallyIntensity}Calculator.tsx` + `.module.css` (CREATE)
- [x] Component integration tests → matching `*.test.tsx` files (CREATE)
- [x] MDX routes with extracted source prose → `src/pages/tools/{basketball-vertical-jump-analyzer,soccer-match-load-calculator,cricket-bowling-workload-tracker,tennis-match-energy-expenditure-tool,badminton-rally-intensity-calculator}.mdx` (CREATE)
- [x] Document the batch pattern for the remaining 18 ports → `README.md` (UPDATE)

## Parity contracts

### Basketball vertical jump

- Power `= (weightKg × g × jumpHeightInches × 0.0254) / t`, where `t = √(2 × h × 0.0254 / 9.81)`.
- Force `= weightKg × (9.81 + √(2 × 9.81 × h × 0.0254) / 0.15)` with the source's 0.15 s push-off.
- Percentile uses the source's age-group table (`floor(age/5)×5+15`, capped at 30) per gender, scaled
  between average and excellent, clamped to 0–99.
- Jump rating bands (40/35/30/25/20 inches), approach bonus (`min(15, feet × 1.5)`), and all
  recommendation rules preserved.

### Soccer match load

- Load `= (distance×10 + highIntensity×30 + sprints×0.5) × (90/duration) × (rating/7.5)` with the
  source's heat (+20% above 25 °C) and cold (+10% below 5 °C) adjustments.
- Efficiency `(rating×10) / (distance×5 + highIntensity×20 + sprints×0.3) × 100`.
- Performance score uses the per-position weight table (dist/hi/sprint/rating) against the source's
  norms (11 km, 0.7 km, 25 sprints, 7.5 rating), capped at 100.
- Recovery-time bands, the cascading fatigue-risk thresholds, the position comparison percentages,
  and the position-specific recommendation list are preserved.

### Cricket bowling workload

- Workload score `(balls/duration)×60` × intensity multiplier (0.8/1.0/1.3/1.6) × bowling-type
  adjustment (fast 1.3 … spin-finger 0.8).
- ACWR falls back to `balls × 2.5` when no recent history is supplied, and to 1.0 when that estimate
  is also zero.
- Injury risk scoring (workload, ACWR, recovery, age, experience) with the 8/6/4/2 bands, fatigue
  level, performance readiness (fatigue + recovery + risk impacts, floored at 0), recovery
  recommendation, and the age-banded maximum-ball percentage with the type adjustment are preserved.

### Tennis match energy

- MET value `= base METs (casual 6 → professional 13) × style multiplier × rally multiplier ×
  surface multiplier × environmental factor`.
- Calories/minute `= (MET × weightKg × 3.5) / 200`, net calories subtract the resting-rate burn
  (`1 × weightKg × 3.5 / 200 × minutes`).
- Distance covered, hydration needs, recovery window, glycogen depletion (60% of calories ÷ 4),
  electrolyte loss, and the 70/30 active-play split are preserved.

### Badminton rally intensity

- Intensity score sums rally-length (10–30), rally-frequency (5–25), smash-ratio (0–20), play-style
  (5–15), and format (10–15) contributions, capped at 100. The smash ratio uses the source's
  normalization `smashes / (avgShots × frequency × 60)`.
- Tactical diversity scores the smash/net/clear percentages against the source's ideal distribution
  (20/40/25) with weights (0.3/0.4/0.3), clamped to 0–100.
- Fatigue factor, performance rating (with the opponent-level multipliers), work rate, and all
  insight and recommendation rules are preserved.

## Tests added

- `src/lib/calculators/basketballJump.test.ts` — 5 cases: 24-inch golden metrics, 30-inch female
  golden metrics, cm/kg conversion, the power/force/rating helpers, validation.
- `src/lib/calculators/soccerMatchLoad.test.ts` — 4 cases: midfielder golden analysis, miles + heat
  conversion, the load/fatigue helpers, validation.
- `src/lib/calculators/cricketBowlingWorkload.test.ts` — 4 cases: fast bowler golden analysis,
  spinner golden analysis, the ACWR fallback, validation.
- `src/lib/calculators/tennisMatchEnergy.test.ts` — 4 cases: two-hour match golden metrics, hot
  aggressive clay match, hours/pounds conversion, validation.
- `src/lib/calculators/badmintonRallyIntensity.test.ts` — 4 cases: attacking singles golden analysis,
  long doubles golden analysis, validation.
- `src/components/calculators/BasketballJumpCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/SoccerMatchLoadCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/CricketBowlingWorkloadCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/TennisMatchEnergyCalculator.test.tsx` — 3 integration cases.
- `src/components/calculators/BadmintonRallyIntensityCalculator.test.tsx` — 3 integration cases.
- Suite result: 56 test files, 269 tests passed (35 new).

## Validation results

- `npm run typecheck` — PASS
- `npm run test:run` — PASS (56 files, 269 tests)
- `npm run build` — PASS
  - `[legacy-aliases] emitted 24, missing 234, skipped 1, conflicts 0` (up from 19 at ST-9; the five new
    tool aliases now resolve)
  - Verified `/tools/<slug>/index.html` and `/tools/<slug>.html` exist for all five tools, each alias
    carrying the canonical link and meta refresh.
  - Verified each built page renders its `<h1>`, the calculator form, the catalog `seoDescription` as
    the meta description, and the source SEO prose headings.
  - Verified no `undefined` CSS-module class names in the built HTML.

## Deviations from the plan

- Added one CSS module per tool (5 files) rather than growing the shared `ToolCalculator.module.css`.
  These tools each have a bespoke metric grid, comparison panel, or breakdown list, so per-tool modules
  keep the shared file stable; shared chrome still comes from `ToolCalculator.module.css`.
- The plan's file estimate did not count these CSS modules or the shared `sportValidation.ts` helper;
  they are additive and do not change scope.
- Added `src/lib/calculators/sportValidation.ts` to satisfy the plan's instruction to "ensure the
  shared validation messages are reused" across this batch. The five legacy pages had no per-field
  messages of their own (each used one blanket `alert()`), so the wording is ours but identical across
  all five tools.
- The cricket page's `ballsPerMinute` is computed by the source but never displayed. The port keeps it
  in the result object (and covers it in the formula test) but, like the source, does not render it.
- The source pages drop the emoji prefixes on several `<h1>` and section headings (for example the
  basketball and cricket titles). Those prefixes were also dropped in ST-6 through ST-9 and are not
  part of the catalog title or the SEO copy.

## Issues encountered

- Several of my first-pass golden expectations were transcription errors rather than implementation
  faults (for example the soccer midfielder load is 143.5, not 143.4375). Each was re-derived by
  re-executing the source algorithm in Node and corrected against that, rather than adjusted to fit
  the implementation.
- The cricket source's ACWR fallback reads `recentWorkload || currentBalls * 2.5`, so an empty recent
  workload yields a ratio of 0.4 rather than a neutral 1.0. This is preserved because it changes the
  reported number.
- The built cricket page renders the heading "Acute:Chronic Workload Ratio" with React's `<!-- -->`
  text-node separators in the raw HTML. That is standard SSR output, not a defect; the rendered text
  is correct.

## Follow-ups for the reviewer

- The 5 tools are uncommitted on `feature/st-3-legacy-urls`. Run `piv-commit`, then `piv-create-pr`,
  then `piv-review-pr`.
- ST-11 onward should reuse `sportValidation.ts` and follow the same per-tool CSS module pattern.
- The source pages in this batch are the first in the migration with per-page `<main>` bodies but no
  shared error handling; the port's per-field messages are a deliberate improvement, not a parity
  break, since the source produced a single browser alert.

