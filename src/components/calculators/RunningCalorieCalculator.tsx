import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateRunningCalories,
  RUNNING_ELEVATION_UNITS,
  RUNNING_INTENSITIES,
  RUNNING_METHODS,
  RUNNING_TERRAINS,
  validateRunningValues,
  type ElevationUnit,
  type RunningIntensity,
  type RunningMethod,
  type RunningResult,
  type RunningTerrain,
  type RunningValues,
} from '../../lib/calculators/runningCalorie';
import {
  DISTANCE_UNITS,
  WEIGHT_UNITS,
  type DistanceUnit,
  type WeightUnit,
} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './RunningCalorieCalculator.module.css';

export type RunningCalorieCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: RunningValues = {
  method: '',
  weight: '',
  weightUnit: 'kg',
  gender: '',
  age: '',
  terrain: 'flat-road',
  intensity: 'moderate',
  elevation: '',
  elevationUnit: 'meters',
  distance: '',
  distanceUnit: 'km',
  paceMinutes: '',
  paceSeconds: '',
  paceUnit: 'min-per-km',
  dtDistance: '',
  dtDistanceUnit: 'km',
  timeHours: '',
  timeMinutes: '',
  timeSeconds: '',
  tpTimeHours: '',
  tpTimeMinutes: '',
  tpTimeSeconds: '',
  tpPaceMinutes: '',
  tpPaceSeconds: '',
  tpPaceUnit: 'min-per-km',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function RunningCalorieCalculator({
  shareEnvironment,
  onPrint,
}: RunningCalorieCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<RunningValues, RunningResult>({
    initialValues: INITIAL_VALUES,
    validate: validateRunningValues,
    calculate: calculateRunningCalories,
    getSharePayload: (result) => ({
      title: 'Running Calorie Calculator Results',
      text: `I burned ${result.calories} calories during my run! Calculate your running calories at Sports Tools Hub!`,
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
            Calculate Running Calories Burned
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Method"
            value={values.method}
            onValueChange={(value) =>
              calculator.setValue('method', value as RunningMethod)
            }
            options={RUNNING_METHODS}
            placeholder="Select calculation method"
            hint="Choose how you want to calculate your calories"
            error={errors.method}
            required
          />

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Personal Information</h3>

            <UnitField
              label="Weight"
              value={values.weight}
              onValueChange={(value) => calculator.setValue('weight', value)}
              unit={values.weightUnit}
              onUnitChange={(unit) =>
                calculator.setValue('weightUnit', unit as WeightUnit)
              }
              units={WEIGHT_UNITS}
              hint="Enter your body weight"
              error={errors.weight}
              placeholder="Enter your weight"
              required
              min={30}
              step={0.1}
            />

            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) => calculator.setValue('gender', value)}
              options={GENDER_OPTIONS as readonly ChoiceOption<
                'male' | 'female'
              >[]}
              error={errors.gender}
              required
            />

            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              hint="Enter your age"
              error={errors.age}
              placeholder="Enter your age"
              required
              min={13}
              max={100}
              step={1}
            />
          </div>

          {values.method === 'distance-pace' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Distance &amp; Pace</h3>

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
                  calculator.setValue('paceUnit', value as 'min-per-km' | 'min-per-mile')
                }
                options={[
                  {value: 'min-per-km', label: 'min/km'},
                  {value: 'min-per-mile', label: 'min/mile'},
                ]}
                required
              />
            </div>
          ) : null}

          {values.method === 'distance-time' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Distance &amp; Time</h3>

              <NumberField
                label="Distance"
                value={values.dtDistance}
                onValueChange={(value) =>
                  calculator.setValue('dtDistance', value)
                }
                hint="Enter the distance you ran"
                error={errors.dtDistance}
                placeholder="Enter distance"
                required
                min={0.1}
                step={0.01}
              />

              <SelectField
                label="Distance Unit"
                value={values.dtDistanceUnit}
                onValueChange={(value) =>
                  calculator.setValue('dtDistanceUnit', value as DistanceUnit)
                }
                options={DISTANCE_UNITS}
                required
              />

              <NumberField
                label="Hours"
                value={values.timeHours}
                onValueChange={(value) =>
                  calculator.setValue('timeHours', value)
                }
                hint="Enter your running time"
                error={errors.timeHours}
                placeholder="HH"
                min={0}
                max={23}
                step={1}
              />

              <NumberField
                label="Minutes"
                value={values.timeMinutes}
                onValueChange={(value) =>
                  calculator.setValue('timeMinutes', value)
                }
                hint="Enter your running time"
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Seconds"
                value={values.timeSeconds}
                onValueChange={(value) =>
                  calculator.setValue('timeSeconds', value)
                }
                hint="Enter your running time"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          {values.method === 'time-pace' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Time &amp; Pace</h3>

              <NumberField
                label="Hours"
                value={values.tpTimeHours}
                onValueChange={(value) =>
                  calculator.setValue('tpTimeHours', value)
                }
                hint="Enter your running time"
                error={errors.tpTimeHours}
                placeholder="HH"
                min={0}
                max={23}
                step={1}
              />

              <NumberField
                label="Minutes"
                value={values.tpTimeMinutes}
                onValueChange={(value) =>
                  calculator.setValue('tpTimeMinutes', value)
                }
                hint="Enter your running time"
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Seconds"
                value={values.tpTimeSeconds}
                onValueChange={(value) =>
                  calculator.setValue('tpTimeSeconds', value)
                }
                hint="Enter your running time"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Pace Minutes"
                value={values.tpPaceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('tpPaceMinutes', value)
                }
                hint="Minutes per mile/km"
                error={errors.tpPaceMinutes}
                placeholder="MM"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Pace Seconds"
                value={values.tpPaceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('tpPaceSeconds', value)
                }
                hint="Seconds per mile/km"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <SelectField
                label="Pace Unit"
                value={values.tpPaceUnit}
                onValueChange={(value) =>
                  calculator.setValue(
                    'tpPaceUnit',
                    value as 'min-per-km' | 'min-per-mile',
                  )
                }
                options={[
                  {value: 'min-per-km', label: 'min/km'},
                  {value: 'min-per-mile', label: 'min/mile'},
                ]}
                required
              />
            </div>
          ) : null}

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Terrain &amp; Intensity</h3>

            <SelectField
              label="Terrain"
              value={values.terrain}
              onValueChange={(value) =>
                calculator.setValue('terrain', value as RunningTerrain)
              }
              options={RUNNING_TERRAINS}
              required
            />

            <SelectField
              label="Training Intensity"
              value={values.intensity}
              onValueChange={(value) =>
                calculator.setValue('intensity', value as RunningIntensity)
              }
              options={RUNNING_INTENSITIES}
              required
            />

            <NumberField
              label="Elevation Gain"
              value={values.elevation}
              onValueChange={(value) =>
                calculator.setValue('elevation', value)
              }
              hint="Optional elevation gain (adds a terrain bonus)"
              error={errors.elevation}
              placeholder="0"
              min={0}
              step={1}
            />

            <SelectField
              label="Elevation Unit"
              value={values.elevationUnit}
              onValueChange={(value) =>
                calculator.setValue('elevationUnit', value as ElevationUnit)
              }
              options={RUNNING_ELEVATION_UNITS}
              required
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Calories
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
        title="Your Running Calorie Results"
        value={result ? `${result.calories} cal` : '--'}
        category={result ? 'Calories Burned' : '--'}
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
                <div className={styles.statLabel}>Distance</div>
                <div className={styles.statValue}>
                  {result.distanceKm.toFixed(2)} km
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Time</div>
                <div className={styles.statValue}>{result.time}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Pace</div>
                <div className={styles.statValue}>{result.pacePerKm}/km</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Speed</div>
                <div className={styles.statValue}>
                  {result.speedKmh} km/h
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Calories per km</div>
                <div className={styles.statValue}>{result.caloriesPerKm}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Calories per min</div>
                <div className={styles.statValue}>
                  {result.caloriesPerMinute}
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Calorie Burn Analysis</h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  Base Running Calories
                </div>
                <div className={styles.breakdownValue}>
                  {result.breakdown.baseCalories}
                </div>
                <div className={styles.breakdownPercent}>
                  {result.breakdown.basePercent}%
                </div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  Terrain/Elevation Bonus
                </div>
                <div className={styles.breakdownValue}>
                  {result.breakdown.elevationBonus}
                </div>
                <div className={styles.breakdownPercent}>
                  {result.breakdown.elevationPercent}%
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Activity Comparisons</h3>
            <div className={styles.comparisonGrid}>
              {result.comparisons.map((comparison) => (
                <div key={comparison.activity} className={styles.comparisonItem}>
                  <div className={styles.comparisonActivity}>
                    {comparison.activity}
                  </div>
                  <div className={styles.comparisonCalories}>
                    {comparison.calories} cal
                  </div>
                </div>
              ))}
            </div>

            <h3 className={sharedStyles.sectionTitle}>Recommendations</h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendation}
            </div>
          </>
        ) : (
          <>
            <ResultRow label="Calories Burned" value="--" />
            <p className={sharedStyles.empty}>
              Choose a calculation method, enter your details, then calculate
              to see your calories burned.
            </p>
          </>
        )}
      </ResultCard>
    </div>
  );
}
