import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateTdee,
  TDEE_ACTIVITIES,
  validateTdeeValues,
  type TdeeActivity,
  type TdeeResult,
  type TdeeValues,
} from '../../lib/calculators/tdee';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  ResultCard,
  ResultRow,
  SelectField,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type TDEECalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: TdeeValues = {
  age: '',
  gender: 'male',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
  activityLevel: '',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function TDEECalculator({
  shareEnvironment,
  onPrint,
}: TDEECalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<TdeeValues, TdeeResult>({
    initialValues: INITIAL_VALUES,
    validate: validateTdeeValues,
    calculate: calculateTdee,
    getSharePayload: (result) => ({
      title: 'TDEE Calculator Results',
      text: `My total daily energy expenditure is ${result.display} calories per day. Calculate yours at Sports Tools Hub!`,
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
            Calculate Your TDEE
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
            max={80}
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
            min={1}
            step={0.1}
          />

          <SelectField
            label="Activity Level"
            value={values.activityLevel}
            onValueChange={(value) =>
              calculator.setValue('activityLevel', value as TdeeActivity)
            }
            options={TDEE_ACTIVITIES}
            placeholder="Select activity level"
            hint="Select your typical weekly activity level"
            error={errors.activityLevel}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate TDEE
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
        title="Your Estimated TDEE"
        value={result ? result.display : '--'}
        category="Calories/Day"
      >
        <h3 className={sharedStyles.sectionTitle}>Weight Goals</h3>
        {result ? (
          <div className={styles.goalList}>
            {result.goals.map((goal) => (
              <ResultRow key={goal.key} label={goal.label} value={goal.display} />
            ))}
          </div>
        ) : (
          <ResultRow label="Weight Goals" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
