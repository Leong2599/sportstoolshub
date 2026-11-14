import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculatePace,
  PACE_CALCULATION_TYPES,
  PACE_RACE_DISTANCES,
  PACE_UNITS,
  validatePaceValues,
  type PaceCalculationType,
  type PaceRaceDistance,
  type PaceResult,
  type PaceUnit,
  type PaceValues,
} from '../../lib/calculators/pace';
import {DISTANCE_UNITS, type DistanceUnit} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  ResultCard,
  SelectField,
  ShareButton,
  PrintButton,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './PaceCalculator.module.css';

export type PaceCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: PaceValues = {
  calculationType: '',
  distance: '',
  distanceUnit: 'km',
  hours: '',
  minutes: '',
  seconds: '',
  targetDistance: '',
  targetDistanceUnit: 'km',
  paceMinutes: '',
  paceSeconds: '',
  paceUnit: 'min-per-km',
  recentDistance: '',
  recentHours: '',
  recentMinutes: '',
  recentSeconds: '',
};

export function PaceCalculator({
  shareEnvironment,
  onPrint,
}: PaceCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<PaceValues, PaceResult>({
    initialValues: INITIAL_VALUES,
    validate: validatePaceValues,
    calculate: calculatePace,
    getSharePayload: (result) => ({
      title: 'Pace Calculator Results',
      text: `Check out my running pace calculations at Sports Tools Hub!`,
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
            Calculate Your Running Pace
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Type"
            value={values.calculationType}
            onValueChange={(value) =>
              calculator.setValue(
                'calculationType',
                value as PaceCalculationType,
              )
            }
            options={PACE_CALCULATION_TYPES}
            placeholder="Select calculation type"
            hint="Choose what you want to calculate"
            error={errors.calculationType}
            required
          />

          {values.calculationType === 'time-distance' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Race Details</h3>

              <NumberField
                label="Distance"
                value={values.distance}
                onValueChange={(value) =>
                  calculator.setValue('distance', value)
                }
                hint="Enter the distance you ran"
                error={errors.distance}
                placeholder="Enter distance"
                required
                min={0.1}
                step={0.01}
              />

              <SelectField
                label="Distance Unit"
                value={values.distanceUnit}
                onValueChange={(value) =>
                  calculator.setValue('distanceUnit', value as DistanceUnit)
                }
                options={DISTANCE_UNITS}
                required
              />

              <NumberField
                label="Hours"
                value={values.hours}
                onValueChange={(value) => calculator.setValue('hours', value)}
                hint="Enter your finishing time"
                error={errors.hours}
                placeholder="HH"
                min={0}
                max={23}
                step={1}
              />

              <NumberField
                label="Minutes"
                value={values.minutes}
                onValueChange={(value) =>
                  calculator.setValue('minutes', value)
                }
                hint="Enter your finishing time"
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Seconds"
                value={values.seconds}
                onValueChange={(value) =>
                  calculator.setValue('seconds', value)
                }
                hint="Enter your finishing time"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          {values.calculationType === 'pace-distance' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Target Pace</h3>

              <NumberField
                label="Target Distance"
                value={values.targetDistance}
                onValueChange={(value) =>
                  calculator.setValue('targetDistance', value)
                }
                hint="Enter your target distance"
                error={errors.targetDistance}
                placeholder="Enter distance"
                required
                min={0.1}
                step={0.01}
              />

              <SelectField
                label="Target Distance Unit"
                value={values.targetDistanceUnit}
                onValueChange={(value) =>
                  calculator.setValue(
                    'targetDistanceUnit',
                    value as DistanceUnit,
                  )
                }
                options={DISTANCE_UNITS}
                required
              />

              <NumberField
                label="Pace Minutes"
                value={values.paceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('paceMinutes', value)
                }
                hint="Minutes per mile/km"
                error={errors.paceMinutes}
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Pace Seconds"
                value={values.paceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('paceSeconds', value)
                }
                hint="Seconds per mile/km"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <SelectField
                label="Pace Unit"
                value={values.paceUnit}
                onValueChange={(value) =>
                  calculator.setValue('paceUnit', value as PaceUnit)
                }
                options={PACE_UNITS}
                required
              />
            </div>
          ) : null}

          {values.calculationType === 'race-prediction' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Recent Race Time</h3>

              <SelectField
                label="Recent Race Distance"
                value={values.recentDistance}
                onValueChange={(value) =>
                  calculator.setValue(
                    'recentDistance',
                    value as PaceRaceDistance,
                  )
                }
                options={PACE_RACE_DISTANCES}
                placeholder="Select race distance"
                error={errors.recentDistance}
                required
              />

              <NumberField
                label="Hours"
                value={values.recentHours}
                onValueChange={(value) =>
                  calculator.setValue('recentHours', value)
                }
                hint="Your recent race time"
                error={errors.recentHours}
                placeholder="HH"
                min={0}
                max={23}
                step={1}
              />

              <NumberField
                label="Minutes"
                value={values.recentMinutes}
                onValueChange={(value) =>
                  calculator.setValue('recentMinutes', value)
                }
                hint="Your recent race time"
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Seconds"
                value={values.recentSeconds}
                onValueChange={(value) =>
                  calculator.setValue('recentSeconds', value)
                }
                hint="Your recent race time"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate
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
        title="Your Pace Results"
        value={result ? result.headline : '--'}
        category={result ? result.headlineLabel : '--'}
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
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>{result.secondaryLabel}</div>
                <div className={styles.statValue}>{result.secondary}</div>
              </div>
              {result.speed ? (
                <>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Speed</div>
                    <div className={styles.statValue}>{result.speed}</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Speed</div>
                    <div className={styles.statValue}>{result.speedAlt}</div>
                  </div>
                </>
              ) : null}
            </div>

            {result.splits.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>Race Splits</h3>
                <div className={styles.splitsGrid}>
                  {result.splits.map((split) => (
                    <div key={split.label} className={styles.splitItem}>
                      <div className={styles.splitDistance}>{split.label}</div>
                      <div className={styles.splitTime}>{split.time}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {result.predictions.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>
                  Race Time Predictions
                </h3>
                <div className={styles.splitsGrid}>
                  {result.predictions.map((prediction) => (
                    <div
                      key={prediction.distance}
                      className={styles.splitItem}
                    >
                      <div className={styles.splitDistance}>
                        {prediction.distance}
                      </div>
                      <div className={styles.splitTime}>{prediction.time}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>
              Training Recommendations
            </h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendation}
            </div>
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Choose a calculation type, enter your details, then calculate to see
            your pace.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
