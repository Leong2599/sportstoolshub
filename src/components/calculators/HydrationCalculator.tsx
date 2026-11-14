import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateHydration,
  HYDRATION_ACTIVITIES,
  HYDRATION_CLIMATES,
  HYDRATION_CONDITIONS,
  HYDRATION_INTENSITIES,
  validateHydrationValues,
  type HydrationActivity,
  type HydrationClimate,
  type HydrationCondition,
  type HydrationIntensity,
  type HydrationResult,
  type HydrationValues,
} from '../../lib/calculators/hydration';
import {WEIGHT_UNITS} from '../../lib/calculators/units';
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
import styles from './NutritionBatch.module.css';

export type HydrationCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: HydrationValues = {
  weight: '',
  weightUnit: 'kg',
  age: '',
  gender: '',
  activityLevel: '',
  climate: '',
  exerciseDuration: '',
  exerciseIntensity: 'moderate',
  healthConditions: [],
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function HydrationCalculator({
  shareEnvironment,
  onPrint,
}: HydrationCalculatorProps): ReactNode {
  const formTitleId = useId();
  const conditionsId = useId();
  const calculator = useCalculator<HydrationValues, HydrationResult>({
    initialValues: INITIAL_VALUES,
    validate: validateHydrationValues,
    calculate: calculateHydration,
    getSharePayload: (result) => ({
      title: 'Hydration Calculator Results',
      text: `My daily water intake recommendation is ${result.ouncesDisplay}. Calculate yours at Sports Tools Hub!`,
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
            Calculate Your Daily Hydration Needs
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <UnitField
            label="Body Weight"
            value={values.weight}
            onValueChange={(value) => calculator.setValue('weight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) => calculator.setValue('weightUnit', unit)}
            units={WEIGHT_UNITS}
            hint="Enter your current body weight"
            error={errors.weight}
            placeholder="Enter your weight"
            required
            min={30}
            step={0.1}
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Enter your age in years"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={15}
            max={100}
            step={1}
          />

          <ChoiceField
            legend="Gender"
            value={values.gender}
            onValueChange={(value) => calculator.setValue('gender', value)}
            options={
              GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]
            }
            error={errors.gender}
            required
          />

          <SelectField
            label="Activity Level"
            value={values.activityLevel}
            onValueChange={(value) =>
              calculator.setValue('activityLevel', value as HydrationActivity)
            }
            options={HYDRATION_ACTIVITIES}
            placeholder="Select your activity level"
            hint="Select your typical weekly activity level"
            error={errors.activityLevel}
            required
          />

          <SelectField
            label="Climate/Environment"
            value={values.climate}
            onValueChange={(value) =>
              calculator.setValue('climate', value as HydrationClimate)
            }
            options={HYDRATION_CLIMATES}
            placeholder="Select your climate"
            hint="Climate affects hydration needs"
            error={errors.climate}
            required
          />

          <UnitField
            label="Daily Exercise Duration"
            value={values.exerciseDuration}
            onValueChange={(value) =>
              calculator.setValue('exerciseDuration', value)
            }
            unit={values.exerciseIntensity}
            onUnitChange={(unit) =>
              calculator.setValue(
                'exerciseIntensity',
                unit as HydrationIntensity,
              )
            }
            units={HYDRATION_INTENSITIES}
            hint="Average daily exercise duration and intensity"
            error={errors.exerciseDuration}
            placeholder="Minutes"
            primaryLabel="Daily Exercise Duration"
            unitSelectLabel="Exercise intensity"
            min={0}
            max={300}
            step={1}
          />

          <div className={kitStyles.field}>
            <label className={kitStyles.label} htmlFor={conditionsId}>
              Special Health Conditions
            </label>
            <select
              id={conditionsId}
              className={clsx(
                kitStyles.select,
                kitStyles.selectFull,
                styles.conditionSelect,
              )}
              multiple
              value={values.healthConditions as string[]}
              onChange={(event) => {
                const selected = Array.from(
                  event.currentTarget.selectedOptions,
                  (option) => option.value as HydrationCondition,
                );
                calculator.setValue('healthConditions', selected);
              }}
              aria-describedby={`${conditionsId}-hint`}
            >
              {HYDRATION_CONDITIONS.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
            <p className={kitStyles.hint} id={`${conditionsId}-hint`}>
              Hold Ctrl/Cmd to select multiple conditions
            </p>
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Hydration
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
        title="Your Hydration Results"
        value={result ? result.ouncesDisplay : '--'}
        category={
          result
            ? `${result.liters} liters • ${result.glasses} glasses`
            : '--'
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
        <h3 className={sharedStyles.sectionTitle}>Hydration Breakdown</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Base Needs</div>
            <div className={styles.metricValue}>
              {result ? `${Math.round(result.breakdown.base)} oz` : '--'}
            </div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Activity</div>
            <div className={styles.metricValue}>
              {result ? `+${Math.round(result.breakdown.activity)} oz` : '--'}
            </div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Climate</div>
            <div className={styles.metricValue}>
              {result ? `${Math.round(result.breakdown.climate)} oz` : '--'}
            </div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricLabel}>Health Factors</div>
            <div className={styles.metricValue}>
              {result ? `${Math.round(result.breakdown.health)} oz` : '--'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Recommended Hydration Schedule
        </h3>
        <div className={styles.scheduleGrid}>
          {(result?.schedule ?? []).map((item) => (
            <div className={styles.scheduleItem} key={item.time}>
              <div className={styles.scheduleTime}>{item.time}</div>
              <div className={styles.scheduleAmount}>{item.display}</div>
              <div className={styles.scheduleNote}>{item.note}</div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Hydration Tips &amp; Sources</h3>
        <div className={styles.tipsGrid}>
          {(result?.tips ?? []).map((tip) => (
            <div className={styles.tipCard} key={tip.title}>
              <h4 className={styles.tipTitle}>{tip.title}</h4>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Personalized Recommendations
        </h3>
        <p className={sharedStyles.recommendation}>
          {result ? result.recommendations : ''}
        </p>
      </ResultCard>
    </div>
  );
}
