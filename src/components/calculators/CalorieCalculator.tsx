import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateCalories,
  CALORIE_ACTIVITIES,
  CALORIE_GOALS,
  validateCalorieValues,
  type CalorieActivity,
  type CalorieGoal,
  type CalorieResult,
  type CalorieValues,
} from '../../lib/calculators/calorie';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
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
import styles from './CalorieCalculator.module.css';

export type CalorieCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: CalorieValues = {
  age: '',
  gender: '',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
  activityLevel: '',
  goal: '',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function CalorieCalculator({
  shareEnvironment,
  onPrint,
}: CalorieCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<CalorieValues, CalorieResult>({
    initialValues: INITIAL_VALUES,
    validate: validateCalorieValues,
    calculate: calculateCalories,
    getSharePayload: (result) => ({
      title: 'Calorie Calculator Results',
      text: `My recommended daily calories are ${Math.round(result.goalCalories)} (${result.goalDescription}). Calculate yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const usingFeet = values.heightUnit === 'ft';

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Calculate Your Daily Calories
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
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
            options={GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]}
            error={errors.gender}
            required
          />

          <UnitField
            label="Weight"
            value={values.weight}
            onValueChange={(value) => calculator.setValue('weight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) => calculator.setValue('weightUnit', unit)}
            units={WEIGHT_UNITS}
            hint="Enter your body weight"
            error={errors.weight}
            placeholder="Enter your weight"
            required
            min={30}
            step={0.1}
          />

          <UnitField
            label="Height"
            value={values.height}
            onValueChange={(value) => calculator.setValue('height', value)}
            unit={values.heightUnit}
            onUnitChange={(unit) => calculator.setValue('heightUnit', unit)}
            units={HEIGHT_UNITS}
            hint="Enter your height"
            error={errors.height}
            primaryLabel={usingFeet ? 'Feet' : 'Height'}
            placeholder={usingFeet ? 'ft' : 'cm'}
            required
            min={usingFeet ? 1 : 50}
            max={usingFeet ? 9 : 300}
            step={0.1}
            secondary={
              usingFeet
                ? {
                    label: 'Inches',
                    value: values.inches,
                    onValueChange: (value) =>
                      calculator.setValue('inches', value),
                    placeholder: 'in',
                    min: 0,
                    max: 11,
                    step: 1,
                    required: true,
                  }
                : undefined
            }
          />

          <SelectField
            label="Activity Level"
            value={values.activityLevel}
            onValueChange={(value) =>
              calculator.setValue('activityLevel', value as CalorieActivity)
            }
            options={CALORIE_ACTIVITIES as readonly {
              value: CalorieActivity;
              label: string;
            }[]}
            placeholder="Select activity level"
            hint="Select your typical weekly activity level"
            error={errors.activityLevel}
            required
          />

          <SelectField
            label="Fitness Goal"
            value={values.goal}
            onValueChange={(value) =>
              calculator.setValue('goal', value as CalorieGoal)
            }
            options={CALORIE_GOALS as readonly {
              value: CalorieGoal;
              label: string;
            }[]}
            placeholder="Select fitness goal"
            hint="Select your primary fitness goal"
            error={errors.goal}
            required
          />

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
        title="Your Calorie Results"
        value={
          result
            ? `${Math.round(result.goalCalories)} cal`
            : '--'
        }
        category={result ? result.goalDescription : '--'}
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
        <h3 className={sharedStyles.sectionTitle}>Basal Metabolic Rate (BMR)</h3>
        <ResultRow
          label="BMR"
          value={result ? `${Math.round(result.bmr)} cal` : '--'}
        />
        <p className={styles.small}>
          Calories your body burns at complete rest
        </p>

        <h3 className={sharedStyles.sectionTitle}>Total Daily Energy Expenditure (TDEE)</h3>
        <ResultRow
          label="TDEE"
          value={result ? `${Math.round(result.tdee)} cal` : '--'}
        />
        <p className={styles.small}>
          Calories burned with activity
        </p>

        <h3 className={sharedStyles.sectionTitle}>Recommended Daily Calories</h3>
        <ResultRow
          label="Goal calories"
          value={result ? `${Math.round(result.goalCalories)} cal` : '--'}
        />
        <p className={styles.small} id={result ? undefined : undefined}>
          {result ? result.goalDescription : 'Calories for your goal'}
        </p>

        <h3 className={sharedStyles.sectionTitle}>Macronutrient Breakdown</h3>
        <div className={styles.macroGrid}>
          <div className={styles.macroItem}>
            <div className={styles.macroLabel}>Protein</div>
            <div className={styles.macroGrams}>
              {result ? `${result.proteinGrams}g` : '--g'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `${Math.round(result.proteinCalories)} cal` : '-- cal'}
            </div>
          </div>
          <div className={styles.macroItem}>
            <div className={styles.macroLabel}>Carbs</div>
            <div className={styles.macroGrams}>
              {result ? `${result.carbsGrams}g` : '--g'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `${Math.round(result.carbsCalories)} cal` : '-- cal'}
            </div>
          </div>
          <div className={styles.macroItem}>
            <div className={styles.macroLabel}>Fats</div>
            <div className={styles.macroGrams}>
              {result ? `${result.fatsGrams}g` : '--g'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `${Math.round(result.fatsCalories)} cal` : '-- cal'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Recommendations</h3>
        <div className={sharedStyles.recommendation}>
          {result ? result.recommendations : ''}
        </div>
      </ResultCard>
    </div>
  );
}
