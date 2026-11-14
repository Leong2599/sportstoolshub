import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateProtein,
  PROTEIN_ACTIVITIES,
  PROTEIN_DIETS,
  PROTEIN_GOALS,
  validateProteinValues,
  type ProteinActivity,
  type ProteinDiet,
  type ProteinGoal,
  type ProteinResult,
  type ProteinValues,
} from '../../lib/calculators/protein';
import {WEIGHT_UNITS} from '../../lib/calculators/units';
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
import styles from './NutritionBatch.module.css';

export type ProteinCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: ProteinValues = {
  weight: '',
  weightUnit: 'kg',
  gender: '',
  age: '',
  activityLevel: '',
  fitnessGoal: '',
  dietType: '',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function ProteinCalculator({
  shareEnvironment,
  onPrint,
}: ProteinCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<ProteinValues, ProteinResult>({
    initialValues: INITIAL_VALUES,
    validate: validateProteinValues,
    calculate: calculateProtein,
    getSharePayload: (result) => ({
      title: 'Protein Calculator Results',
      text: `My daily protein requirement is ${result.display}. Calculate yours at Sports Tools Hub!`,
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
            Calculate Your Daily Protein Needs
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

          <SelectField
            label="Activity Level"
            value={values.activityLevel}
            onValueChange={(value) =>
              calculator.setValue('activityLevel', value as ProteinActivity)
            }
            options={PROTEIN_ACTIVITIES}
            placeholder="Select your activity level"
            hint="Select your typical weekly activity level"
            error={errors.activityLevel}
            required
          />

          <SelectField
            label="Primary Fitness Goal"
            value={values.fitnessGoal}
            onValueChange={(value) =>
              calculator.setValue('fitnessGoal', value as ProteinGoal)
            }
            options={PROTEIN_GOALS}
            placeholder="Select your primary goal"
            hint="Choose your primary fitness goal"
            error={errors.fitnessGoal}
            required
          />

          <SelectField
            label="Diet Type"
            value={values.dietType}
            onValueChange={(value) =>
              calculator.setValue('dietType', value as ProteinDiet)
            }
            options={PROTEIN_DIETS}
            placeholder="Select your diet type"
            hint="This helps determine protein quality recommendations"
            error={errors.dietType}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Protein
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
        title="Your Protein Requirements"
        value={result ? result.display : '--'}
        category="grams per day"
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
        <h3 className={sharedStyles.sectionTitle}>Protein per Body Weight</h3>
        <div className={styles.highlight}>
          <span className={styles.highlightValue}>
            {result ? result.perKgDisplay : '--'}
          </span>
          <span className={styles.highlightLabel}>
            grams per kg body weight
          </span>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Meal Distribution</h3>
        <div className={styles.metricsGrid}>
          {(result?.meals ?? []).map((meal) => (
            <div className={styles.metricItem} key={meal.label}>
              <div className={styles.metricLabel}>{meal.label}</div>
              <div className={styles.metricValue}>{meal.display}</div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Protein Sources Recommendations
        </h3>
        <div className={styles.sourceGrid}>
          {(result?.sources ?? []).map((source) => (
            <div className={styles.sourceCard} key={source.title}>
              <h4 className={styles.sourceTitle}>{source.title}</h4>
              <ul className={styles.list}>
                {source.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Nutrition Recommendations</h3>
        <p className={sharedStyles.recommendation}>
          {result ? result.recommendations : ''}
        </p>
      </ResultCard>
    </div>
  );
}
