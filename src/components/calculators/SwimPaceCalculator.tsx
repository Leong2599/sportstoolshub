import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateSwimPace,
  SWIM_CALCULATION_TYPES,
  SWIM_DISTANCE_UNITS,
  SWIM_INTERVAL_DISTANCES,
  SWIM_POOL_SIZES,
  validateSwimValues,
  type SwimCalculationType,
  type SwimDistanceUnit,
  type SwimResult,
  type SwimValues,
} from '../../lib/calculators/swimPace';
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
import styles from './SwimPaceCalculator.module.css';

export type SwimPaceCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: SwimValues = {
  calculationType: '',
  distance: '',
  distanceUnit: 'meters',
  minutes: '',
  seconds: '',
  hundredths: '',
  poolSize: '25',
  targetDistance: '',
  targetDistanceUnit: 'meters',
  paceMinutes: '',
  paceSeconds: '',
  intervalDistance: '50',
  intervalPaceMinutes: '',
  intervalPaceSeconds: '',
  restTime: '',
  numIntervals: '',
};

export function SwimPaceCalculator({
  shareEnvironment,
  onPrint,
}: SwimPaceCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<SwimValues, SwimResult>({
    initialValues: INITIAL_VALUES,
    validate: validateSwimValues,
    calculate: calculateSwimPace,
    getSharePayload: () => ({
      title: 'Swim Pace Calculator Results',
      text: 'Check out my swimming pace calculations at Sports Tools Hub!',
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
            Calculate Your Swimming Pace
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Type"
            value={values.calculationType}
            onValueChange={(value) =>
              calculator.setValue('calculationType', value as SwimCalculationType)
            }
            options={SWIM_CALCULATION_TYPES}
            placeholder="Select calculation type"
            error={errors.calculationType}
            required
          />

          {values.calculationType === 'time-distance' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Swim Details</h3>

              <NumberField
                label="Distance"
                value={values.distance}
                onValueChange={(value) => calculator.setValue('distance', value)}
                hint="Total distance you swam"
                error={errors.distance}
                placeholder="Enter distance"
                required
                min={50}
                step={50}
              />

              <SelectField
                label="Distance Unit"
                value={values.distanceUnit}
                onValueChange={(value) =>
                  calculator.setValue('distanceUnit', value as SwimDistanceUnit)
                }
                options={SWIM_DISTANCE_UNITS}
                required
              />

              <NumberField
                label="Minutes"
                value={values.minutes}
                onValueChange={(value) => calculator.setValue('minutes', value)}
                hint="Enter your swim time"
                error={errors.minutes}
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Seconds"
                value={values.seconds}
                onValueChange={(value) => calculator.setValue('seconds', value)}
                hint="Enter your swim time"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Hundredths"
                value={values.hundredths}
                onValueChange={(value) =>
                  calculator.setValue('hundredths', value)
                }
                hint="Enter your swim time"
                placeholder="HH"
                min={0}
                max={99}
                step={1}
              />

              <SelectField
                label="Pool Size"
                value={values.poolSize}
                onValueChange={(value) => calculator.setValue('poolSize', value)}
                options={SWIM_POOL_SIZES}
                required
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
                error={errors.targetDistance}
                placeholder="Enter distance"
                required
                min={50}
                step={50}
              />

              <SelectField
                label="Target Distance Unit"
                value={values.targetDistanceUnit}
                onValueChange={(value) =>
                  calculator.setValue(
                    'targetDistanceUnit',
                    value as SwimDistanceUnit,
                  )
                }
                options={SWIM_DISTANCE_UNITS}
                required
              />

              <NumberField
                label="Target Pace Minutes (per 100m)"
                value={values.paceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('paceMinutes', value)
                }
                error={errors.paceMinutes}
                placeholder="MM"
                min={0}
                max={2}
                step={1}
              />

              <NumberField
                label="Target Pace Seconds (per 100m)"
                value={values.paceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('paceSeconds', value)
                }
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          {values.calculationType === 'intervals' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Interval Training Setup</h3>

              <SelectField
                label="Interval Distance"
                value={values.intervalDistance}
                onValueChange={(value) =>
                  calculator.setValue('intervalDistance', value)
                }
                options={SWIM_INTERVAL_DISTANCES}
                required
              />

              <NumberField
                label="Interval Pace Minutes (per 100m)"
                value={values.intervalPaceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('intervalPaceMinutes', value)
                }
                error={errors.intervalPaceMinutes}
                placeholder="MM"
                min={0}
                max={2}
                step={1}
              />

              <NumberField
                label="Interval Pace Seconds (per 100m)"
                value={values.intervalPaceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('intervalPaceSeconds', value)
                }
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Rest Time (seconds)"
                value={values.restTime}
                onValueChange={(value) => calculator.setValue('restTime', value)}
                hint="Rest time between intervals"
                placeholder="Enter rest time between intervals"
                min={10}
                max={120}
                step={1}
              />

              <NumberField
                label="Number of Intervals"
                value={values.numIntervals}
                onValueChange={(value) =>
                  calculator.setValue('numIntervals', value)
                }
                error={errors.numIntervals}
                placeholder="Enter number of intervals"
                min={1}
                max={20}
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
        title="Your Swim Pace Results"
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
            {result.stats.map((stat, index) => (
              <ResultRow
                key={`${stat.label}-${index}`}
                label={stat.label}
                value={stat.value}
              />
            ))}

            {result.splits.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>Swim Splits</h3>
                <div className={styles.splitsGrid}>
                  {result.splits.map((split) => (
                    <div key={split.label} className={styles.splitItem}>
                      <div className={styles.splitLabel}>{split.label}</div>
                      <div className={styles.splitTime}>{split.time}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {result.intervals.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>
                  Interval Training Plan
                </h3>
                <div className={styles.splitsGrid}>
                  {result.intervals.map((interval) => (
                    <div key={interval.number} className={styles.splitItem}>
                      <div className={styles.splitLabel}>
                        #{interval.number} &middot; {interval.distance}
                      </div>
                      <div className={styles.splitTime}>{interval.time}</div>
                      <div className={styles.splitRest}>{interval.rest}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>Training Recommendations</h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendation}
            </div>
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Choose a calculation type, enter your swim details, then calculate to
            see your pace.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
