import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  ALTITUDE_ACTIVITY_TYPES,
  ALTITUDE_CALCULATION_TYPES,
  ALTITUDE_DURATION_UNITS,
  ALTITUDE_FITNESS_LEVELS,
  ALTITUDE_LENGTH_UNITS,
  calculateAltitudeAdjustments,
  validateAltitudeValues,
  type AltitudeActivityType,
  type AltitudeCalculationType,
  type AltitudeDurationUnit,
  type AltitudeFitnessLevel,
  type AltitudeLengthUnit,
  type AltitudeResult,
  type AltitudeValues,
} from '../../lib/calculators/altitudeAdjustment';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  PrintButton,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './PerformanceBatch.module.css';

export type AltitudeAdjustmentCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: AltitudeValues = {
  activityType: '',
  paceMinutes: '',
  paceSeconds: '',
  targetAltitude: '',
  altitudeUnit: 'meters',
  homeAltitude: '0',
  homeUnit: 'meters',
  acclimationDays: '0',
  fitnessLevel: '',
  duration: '',
  durationUnit: 'minutes',
  calculationType: '',
};

export function AltitudeAdjustmentCalculator({
  shareEnvironment,
  onPrint,
}: AltitudeAdjustmentCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<AltitudeValues, AltitudeResult>({
    initialValues: INITIAL_VALUES,
    validate: validateAltitudeValues,
    calculate: calculateAltitudeAdjustments,
    getSharePayload: (result) => ({
      title: 'Altitude Adjustment Calculator Results',
      text: `My altitude pace is ${result.adjustedPace} at ${result.targetAltitude}m with a ${result.performanceDecrease}% performance decrease. Plan for altitude at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Altitude Adjustment Calculator
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Activity Type"
            value={values.activityType}
            onValueChange={(value) =>
              calculator.setValue('activityType', value as AltitudeActivityType)
            }
            options={ALTITUDE_ACTIVITY_TYPES}
            placeholder="Select activity"
            hint="Select your primary activity type"
            error={errors.activityType}
            required
          />

          <NumberField
            label="Sea Level Pace Minutes (per km)"
            value={values.paceMinutes}
            onValueChange={(value) =>
              calculator.setValue('paceMinutes', value)
            }
            hint="Your normal pace at sea level (MM:SS per km)"
            error={errors.paceMinutes}
            placeholder="MM"
            min={0}
            max={20}
            step={1}
          />

          <NumberField
            label="Sea Level Pace Seconds (per km)"
            value={values.paceSeconds}
            onValueChange={(value) =>
              calculator.setValue('paceSeconds', value)
            }
            hint="Your normal pace at sea level (MM:SS per km)"
            placeholder="SS"
            min={0}
            max={59}
            step={1}
          />

          <UnitField
            label="Target Altitude"
            value={values.targetAltitude}
            onValueChange={(value) =>
              calculator.setValue('targetAltitude', value)
            }
            unit={values.altitudeUnit}
            onUnitChange={(unit) =>
              calculator.setValue('altitudeUnit', unit as AltitudeLengthUnit)
            }
            units={ALTITUDE_LENGTH_UNITS}
            hint="Altitude where you'll be training/racing"
            error={errors.targetAltitude}
            placeholder="Enter altitude"
            required
            min={0}
            max={8000}
            step={100}
          />

          <UnitField
            label="Home/Training Altitude"
            value={values.homeAltitude}
            onValueChange={(value) =>
              calculator.setValue('homeAltitude', value)
            }
            unit={values.homeUnit}
            onUnitChange={(unit) =>
              calculator.setValue('homeUnit', unit as AltitudeLengthUnit)
            }
            units={ALTITUDE_LENGTH_UNITS}
            hint="Altitude where you normally train (0 for sea level)"
            error={errors.homeAltitude}
            placeholder="Enter home altitude"
            required
            min={0}
            max={8000}
            step={100}
          />

          <NumberField
            label="Altitude Acclimation Days"
            value={values.acclimationDays}
            onValueChange={(value) =>
              calculator.setValue('acclimationDays', value)
            }
            hint="Days spent at target altitude (0 if just arriving)"
            error={errors.acclimationDays}
            placeholder="Enter acclimation days"
            required
            min={0}
            max={30}
            step={1}
          />

          <SelectField
            label="Fitness Level"
            value={values.fitnessLevel}
            onValueChange={(value) =>
              calculator.setValue('fitnessLevel', value as AltitudeFitnessLevel)
            }
            options={ALTITUDE_FITNESS_LEVELS}
            placeholder="Select fitness level"
            hint="Your overall fitness level affects altitude adaptation"
            error={errors.fitnessLevel}
            required
          />

          <UnitField
            label="Activity Duration"
            value={values.duration}
            onValueChange={(value) => calculator.setValue('duration', value)}
            unit={values.durationUnit}
            onUnitChange={(unit) =>
              calculator.setValue('durationUnit', unit as AltitudeDurationUnit)
            }
            units={ALTITUDE_DURATION_UNITS}
            hint="Expected duration of your activity"
            error={errors.duration}
            placeholder="Enter duration"
            required
            min={15}
            max={480}
            step={5}
          />

          <SelectField
            label="Calculation Type"
            value={values.calculationType}
            onValueChange={(value) =>
              calculator.setValue(
                'calculationType',
                value as AltitudeCalculationType,
              )
            }
            options={ALTITUDE_CALCULATION_TYPES}
            placeholder="Select calculation type"
            hint="Purpose of your altitude calculation"
            error={errors.calculationType}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Adjustments
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
        title="Altitude Impact Analysis"
        value={result ? result.adjustedPace : '--'}
        category={result ? 'Altitude pace' : '--'}
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
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Sea Level Pace</div>
                <div className={styles.metricValue}>{result.seaLevelPace}</div>
                <div className={styles.metricSublabel}>Normal conditions</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Altitude Pace</div>
                <div className={styles.metricValue}>{result.adjustedPace}</div>
                <div className={styles.metricSublabel}>
                  +{result.paceAdjustment}s/km ({result.paceAdjustmentPercent}%)
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Target Altitude</div>
                <div className={styles.metricValue}>{result.targetAltitude}m</div>
                <div className={styles.metricSublabel}>
                  {result.altitudeDifference}m above home
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>VO2 Max Impact</div>
                <div className={styles.metricValue}>
                  -{result.vo2MaxDecrease}%
                </div>
                <div className={styles.metricSublabel}>Oxygen capacity</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Decrease</div>
                <div className={styles.metricValue}>
                  -{result.performanceDecrease}%
                </div>
                <div className={styles.metricSublabel}>Overall impact</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Health Risk</div>
                <div className={styles.metricValue}>{result.healthRisks}</div>
                <div className={styles.metricSublabel}>Medical concern</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Acclimation</div>
                <div className={styles.metricValue}>
                  {result.acclimationDays} days
                </div>
                <div className={styles.metricSublabel}>Adaptation level</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Calculation Type</div>
                <div className={styles.metricValue}>
                  {result.calculationType}
                </div>
                <div className={styles.metricSublabel}>Analysis purpose</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Training Zones at Altitude
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Zone</th>
                    <th scope="col">Sea Level Pace</th>
                    <th scope="col">Altitude Pace</th>
                    <th scope="col">Adjustment</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trainingZones.map((zone) => (
                    <tr key={zone.name}>
                      <td>{zone.name}</td>
                      <td>{zone.seaLevelPace}</td>
                      <td>{zone.altitudePace}</td>
                      <td>
                        {zone.adjustmentPercent > 0 ? '+' : ''}
                        {zone.adjustmentPercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.altitudeBenefits.redBloodCellIncrease > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>
                  Altitude Training Benefits
                </h3>
                <ResultRow
                  label="Red Blood Cell Increase"
                  value={`+${result.altitudeBenefits.redBloodCellIncrease.toFixed(1)}%`}
                />
                <ResultRow
                  label="Hemoglobin Increase"
                  value={`+${result.altitudeBenefits.hemoglobinIncrease.toFixed(1)}%`}
                />
                <ResultRow
                  label="Potential VO2 Max Gain"
                  value={`+${result.altitudeBenefits.vo2MaxPotentialIncrease.toFixed(1)}%`}
                />
                <ResultRow
                  label="Performance Window"
                  value={result.altitudeBenefits.performanceTimeframe}
                />
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>
              Acclimatization Progress
            </h3>
            <ResultRow
              label="Adaptation Progress"
              value={`Day ${result.acclimationDays} of 14 for full acclimation (${result.acclimatizationPercent}% complete)`}
            />

            <h3 className={sharedStyles.sectionTitle}>Altitude Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this trip.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>Recommendations</h3>
            <ul className={styles.list}>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </>
        ) : (
          <ResultRow label="Altitude Pace" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
