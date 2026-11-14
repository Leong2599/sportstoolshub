import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BIKE_SETUPS,
  BIKE_TYPES,
  calculateGearRatios,
  GEAR_FITNESS_LEVELS,
  GEAR_RIDER_TYPES,
  GEAR_TERRAINS,
  GEAR_WHEEL_SIZES,
  validateGearValues,
  type BikeType,
  type GearFitnessLevel,
  type GearTerrain,
  type GearValues,
  type GearWheelSize,
  type RiderType,
} from '../../lib/calculators/cyclingGearRatio';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  PrintButton,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './CyclingGearRatioCalculator.module.css';

export type CyclingGearRatioCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: GearValues = {
  bikeType: '',
  chainrings: '',
  cassette: '',
  wheelSize: '',
  tireSize: '',
  targetCadence: '',
  riderType: '',
  terrainType: '',
  fitnessLevel: '',
};

export function CyclingGearRatioCalculator({
  shareEnvironment,
  onPrint,
}: CyclingGearRatioCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<GearValues, ReturnType<
    typeof calculateGearRatios
  >>({
    initialValues: INITIAL_VALUES,
    validate: validateGearValues,
    calculate: calculateGearRatios,
    getSharePayload: () => ({
      title: 'Cycling Gear Ratio Calculator Results',
      text: 'Check out my cycling gear ratio analysis at Sports Tools Hub!',
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const setup = values.bikeType ? BIKE_SETUPS[values.bikeType] : undefined;

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Bike Gearing Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Bike Type"
            value={values.bikeType}
            onValueChange={(value) =>
              calculator.setValue('bikeType', value as BikeType)
            }
            options={BIKE_TYPES}
            placeholder="Select bike type"
            hint="Select your bike type for preset gear ranges"
            error={errors.bikeType}
            required
          />

          <SelectField
            label="Chainrings (teeth)"
            value={values.chainrings}
            onValueChange={(value) => calculator.setValue('chainrings', value)}
            options={setup?.chainrings ?? []}
            placeholder="Select chainring setup"
            hint="Front chainring teeth count"
            error={errors.chainrings}
            required
          />

          <SelectField
            label="Cassette (teeth)"
            value={values.cassette}
            onValueChange={(value) => calculator.setValue('cassette', value)}
            options={setup?.cassettes ?? []}
            placeholder="Select cassette range"
            hint="Rear cassette teeth range"
            error={errors.cassette}
            required
          />

          <SelectField
            label="Wheel Size"
            value={values.wheelSize}
            onValueChange={(value) =>
              calculator.setValue('wheelSize', value as GearWheelSize)
            }
            options={GEAR_WHEEL_SIZES}
            placeholder="Select wheel size"
            hint="Wheel and tire size affects gear ratio"
            error={errors.wheelSize}
            required
          />

          <SelectField
            label="Tire Size"
            value={values.tireSize}
            onValueChange={(value) => calculator.setValue('tireSize', value)}
            options={setup?.tires ?? []}
            placeholder="Select tire size"
            hint="Tire width affects overall wheel diameter"
            error={errors.tireSize}
            required
          />

          <NumberField
            label="Target Cadence (RPM)"
            value={values.targetCadence}
            onValueChange={(value) =>
              calculator.setValue('targetCadence', value)
            }
            hint="Your preferred pedaling cadence (revolutions per minute)"
            error={errors.targetCadence}
            placeholder="Enter target cadence"
            required
            min={60}
            max={120}
            step={5}
          />

          <SelectField
            label="Rider Type"
            value={values.riderType}
            onValueChange={(value) =>
              calculator.setValue('riderType', value as RiderType)
            }
            options={GEAR_RIDER_TYPES}
            placeholder="Select rider type"
            hint="Your riding style affects optimal gear selection"
            error={errors.riderType}
            required
          />

          <SelectField
            label="Primary Terrain"
            value={values.terrainType}
            onValueChange={(value) =>
              calculator.setValue('terrainType', value as GearTerrain)
            }
            options={GEAR_TERRAINS}
            placeholder="Select terrain type"
            hint="Primary riding terrain affects gear needs"
            error={errors.terrainType}
            required
          />

          <SelectField
            label="Fitness Level"
            value={values.fitnessLevel}
            onValueChange={(value) =>
              calculator.setValue('fitnessLevel', value as GearFitnessLevel)
            }
            options={GEAR_FITNESS_LEVELS}
            placeholder="Select fitness level"
            hint="Fitness affects sustainable power and cadence"
            error={errors.fitnessLevel}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Gear Ratios
            </button>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonSecondary)}
              type="button"
              onClick={calculator.reset}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <ResultCard
        ref={calculator.resultRef}
        title="Gear Ratio Analysis Results"
        value={result ? `Range ${result.gearRange.toFixed(1)}:1` : '--'}
        category={result ? 'Gear range' : '--'}
        actions={
          <>
            <ShareButton
              onClick={calculator.share}
              status={calculator.shareStatus}
              disabled={!calculator.hasResult}
            />
            <PrintButton
              onClick={calculator.print}
              disabled={!calculator.hasResult}
              label="Print Results"
            />
          </>
        }
      >
        {result ? (
          <>
            <h3 className={sharedStyles.sectionTitle}>Your Setup</h3>
            <ResultRow
              label="Bike Type"
              value={
                result.bikeType.charAt(0).toUpperCase() +
                result.bikeType.slice(1)
              }
            />
            <ResultRow label="Chainrings" value={`${result.chainrings}T`} />
            <ResultRow label="Cassette" value={`${result.cassette}T`} />
            <ResultRow
              label="Target Cadence"
              value={`${result.targetCadence} RPM`}
            />
            <ResultRow
              label="Recommended Cadence"
              value={`${result.recommendedCadence} RPM`}
            />

            <h3 className={sharedStyles.sectionTitle}>Optimal Gearing</h3>
            <ResultRow
              label="Fastest Gear"
              value={`${result.highestGear.chainring}T / ${result.highestGear.cog}T (${result.highestGear.speedAtTargetCadence} km/h)`}
            />
            <ResultRow
              label="Cruising Gear"
              value={
                result.cruisingGear
                  ? `${result.cruisingGear.chainring}T / ${result.cruisingGear.cog}T (${result.cruisingGear.speedAtTargetCadence} km/h)`
                  : '--'
              }
            />
            <ResultRow
              label="Climbing Gear"
              value={
                result.climbingGear
                  ? `${result.climbingGear.chainring}T / ${result.climbingGear.cog}T (${result.climbingGear.speedAtTargetCadence} km/h)`
                  : '--'
              }
            />
            <ResultRow
              label="Easiest Gear"
              value={`${result.lowestGear.chainring}T / ${result.lowestGear.cog}T (${result.lowestGear.speedAtTargetCadence} km/h)`}
            />

            <h3 className={sharedStyles.sectionTitle}>Gear Ratio Analysis</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Chainring</th>
                    <th scope="col">Cog</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Speed @ {result.targetCadence} RPM</th>
                    <th scope="col">Development</th>
                  </tr>
                </thead>
                <tbody>
                  {result.gears.map((gear) => (
                    <tr
                      key={`${gear.chainring}-${gear.cog}`}
                      className={
                        gear.chainring === result.cruisingGear?.chainring &&
                        gear.cog === result.cruisingGear?.cog
                          ? styles.optimalGear
                          : undefined
                      }
                    >
                      <td>{gear.chainring}T</td>
                      <td>{gear.cog}T</td>
                      <td>{gear.gearRatio}</td>
                      <td>{gear.speedAtTargetCadence} km/h</td>
                      <td>{gear.development} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Speed vs Cadence Chart
            </h3>
            <div className={styles.bandsGrid}>
              {result.speedBands.map((band) => (
                <div key={band.label} className={styles.bandItem}>
                  <div className={styles.bandLabel}>{band.label}</div>
                  <div className={styles.bandGears}>
                    {band.gears.length > 0
                      ? band.gears.join(', ')
                      : 'No gear at this speed'}
                  </div>
                </div>
              ))}
            </div>

            <h3 className={sharedStyles.sectionTitle}>Gearing Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this setup.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>Setup Recommendations</h3>
            {result.recommendations.length > 0 ? (
              <ul className={styles.list}>
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No specific recommendations for this setup.
              </p>
            )}
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Enter your bike setup, then calculate to see detailed gear ratio
            analysis.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
