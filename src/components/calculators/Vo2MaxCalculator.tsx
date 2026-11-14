import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateVo2Max,
  validateVo2MaxValues,
  VO2_MAX_DISTANCE_UNITS,
  VO2_MAX_METHODS,
  type Vo2MaxDistanceUnit,
  type Vo2MaxGender,
  type Vo2MaxMethod,
  type Vo2MaxResult,
  type Vo2MaxValues,
} from '../../lib/calculators/vo2max';
import {WEIGHT_UNITS, type WeightUnit} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './Vo2MaxCalculator.module.css';

export type Vo2MaxCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: Vo2MaxValues = {
  method: '',
  age: '',
  gender: '',
  weight: '',
  weightUnit: 'kg',
  restingHeartRate: '',
  runMinutes: '',
  runSeconds: '',
  distanceCovered: '',
  distanceUnit: 'km',
  stepDuration: '5',
  postExerciseHr: '',
  recoveryHr: '',
};

const GENDER_OPTIONS: readonly {value: Vo2MaxGender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function Vo2MaxCalculator({
  shareEnvironment,
  onPrint,
}: Vo2MaxCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<Vo2MaxValues, Vo2MaxResult>({
    initialValues: INITIAL_VALUES,
    validate: validateVo2MaxValues,
    calculate: calculateVo2Max,
    getSharePayload: (result) => ({
      title: 'VO2 Max Calculator Results',
      text: `My VO2 Max is ${result.display} (${result.category}). Calculate yours at Sports Tools Hub!`,
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
            Calculate Your VO2 Max
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Method"
            value={values.method}
            onValueChange={(value) =>
              calculator.setValue('method', value as Vo2MaxMethod)
            }
            options={VO2_MAX_METHODS}
            placeholder="Select calculation method"
            hint="Choose the test method you want to use"
            error={errors.method}
            required
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Enter your age in years"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={13}
            max={100}
            step={1}
          />

          <ChoiceField
            legend="Gender"
            value={values.gender}
            onValueChange={(value) => calculator.setValue('gender', value)}
            options={GENDER_OPTIONS as readonly ChoiceOption<Vo2MaxGender>[]}
            error={errors.gender}
            required
          />

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

          {values.method === 'resting-heart-rate' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Resting Heart Rate Test</h3>

              <NumberField
                label="Resting Heart Rate"
                value={values.restingHeartRate}
                onValueChange={(value) =>
                  calculator.setValue('restingHeartRate', value)
                }
                hint="Measure your heart rate immediately upon waking, before any activity"
                error={errors.restingHeartRate}
                placeholder="Enter RHR"
                required
                min={40}
                max={120}
                step={1}
              />
            </div>
          ) : null}

          {values.method === '1.5-mile-run' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>1.5 Mile Run Test</h3>

              <NumberField
                label="Run Minutes"
                value={values.runMinutes}
                onValueChange={(value) =>
                  calculator.setValue('runMinutes', value)
                }
                hint="Time to complete 1.5 miles (2.41 km) on a track or measured course"
                error={errors.runMinutes}
                placeholder="MM"
                required
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Run Seconds"
                value={values.runSeconds}
                onValueChange={(value) =>
                  calculator.setValue('runSeconds', value)
                }
                hint="Time to complete 1.5 miles (2.41 km) on a track or measured course"
                placeholder="SS"
                required
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          {values.method === '12-minute-run' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>12 Minute Run Test</h3>

              <NumberField
                label="Distance Covered"
                value={values.distanceCovered}
                onValueChange={(value) =>
                  calculator.setValue('distanceCovered', value)
                }
                hint="Maximum distance covered in 12 minutes"
                error={errors.distanceCovered}
                placeholder="Enter distance"
                required
                min={0.5}
                step={0.01}
              />

              <SelectField
                label="Distance Unit"
                value={values.distanceUnit}
                onValueChange={(value) =>
                  calculator.setValue('distanceUnit', value as Vo2MaxDistanceUnit)
                }
                options={VO2_MAX_DISTANCE_UNITS}
                required
              />
            </div>
          ) : null}

          {values.method === 'step-test' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Step Test</h3>

              <SelectField
                label="Step Test Duration"
                value={values.stepDuration}
                onValueChange={(value) =>
                  calculator.setValue('stepDuration', value)
                }
                options={[
                  {value: '3', label: '3 minutes'},
                  {value: '5', label: '5 minutes'},
                ]}
                required
              />

              <NumberField
                label="Post-Exercise Heart Rate"
                value={values.postExerciseHr}
                onValueChange={(value) =>
                  calculator.setValue('postExerciseHr', value)
                }
                hint="Heart rate measured immediately after stepping"
                error={errors.postExerciseHr}
                placeholder="Enter HR"
                required
                min={80}
                max={200}
                step={1}
              />

              <NumberField
                label="Recovery Heart Rate"
                value={values.recoveryHr}
                onValueChange={(value) =>
                  calculator.setValue('recoveryHr', value)
                }
                hint="Heart rate after 1 minute of rest"
                placeholder="Enter HR"
                required
                min={80}
                max={200}
                step={1}
              />
            </div>
          ) : null}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate VO2 Max
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
        title="Your VO2 Max Results"
        value={
          result ? (
            <span style={{color: result.color}}>{result.display}</span>
          ) : (
            '--'
          )
        }
        category={
          result ? (
            <span style={{color: result.color}}>{result.category}</span>
          ) : (
            '--'
          )
        }
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
        <h3 className={sharedStyles.sectionTitle}>VO2 Max Fitness Levels</h3>
        <div className={styles.ranges}>
          {result?.ranges.map((range) => (
            <div
              key={range.category}
              className={styles.rangeItem}
              style={{borderLeft: `4px solid ${range.color}`}}
            >
              <span>{range.category}</span>
              <span>&ge; {range.min.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Training Recommendations</h3>
        <div className={sharedStyles.recommendation}>
          {result ? result.recommendation : ''}
        </div>
      </ResultCard>
    </div>
  );
}
