import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateMicronutrient,
  MICRONUTRIENT_GENDERS,
  MICRONUTRIENT_INPUTS,
  validateMicronutrientValues,
  type MicronutrientGender,
  type MicronutrientResult,
  type MicronutrientValues,
} from '../../lib/calculators/micronutrient';
import {
  ChoiceField,
  NumberField,
  ResultCard,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

const VITAMIN_KEYS = new Set([
  'vitaminA',
  'vitaminC',
  'vitaminD',
  'vitaminE',
  'vitaminK',
  'thiamine',
  'riboflavin',
  'niacin',
  'vitaminB6',
  'folate',
  'vitaminB12',
]);

const INITIAL_VALUES: MicronutrientValues = {
  age: '',
  gender: '',
  vitaminA: '',
  vitaminC: '',
  vitaminD: '',
  vitaminE: '',
  vitaminK: '',
  thiamine: '',
  riboflavin: '',
  niacin: '',
  vitaminB6: '',
  folate: '',
  vitaminB12: '',
  calcium: '',
  iron: '',
  magnesium: '',
  phosphorus: '',
  potassium: '',
  sodium: '',
  zinc: '',
  selenium: '',
};

export function MicronutrientChecker(): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    MicronutrientValues,
    MicronutrientResult
  >({
    initialValues: INITIAL_VALUES,
    validate: validateMicronutrientValues,
    calculate: calculateMicronutrient,
    getSharePayload: (result) => ({
      title: 'Micronutrient Intake Checker Results',
      text: `My micronutrient sufficiency score is ${result.overallScore}%. Check yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
  });
  const {values, errors, result} = calculator;
  const vitamins = MICRONUTRIENT_INPUTS.filter((input) =>
    VITAMIN_KEYS.has(input.key),
  );
  const minerals = MICRONUTRIENT_INPUTS.filter(
    (input) => !VITAMIN_KEYS.has(input.key),
  );

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Enter Your Daily Intake
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Personal Information</h3>
            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              hint="Guide: 15-80 years"
              error={errors.age}
              placeholder="30"
              required
              min={15}
              max={100}
              step={1}
            />

            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) =>
                calculator.setValue('gender', value as MicronutrientGender)
              }
              options={
                MICRONUTRIENT_GENDERS as readonly ChoiceOption<'male' | 'female'>[]
              }
              error={errors.gender}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Vitamins</h3>
            <div className={styles.inputGrid}>
              {vitamins.map((input) => (
                <NumberField
                  key={input.key}
                  label={input.label}
                  value={values[input.key]}
                  onValueChange={(value) =>
                    calculator.setValue(input.key, value)
                  }
                  hint={input.hint}
                  placeholder={input.placeholder}
                  min={0}
                  step={input.step}
                />
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Minerals</h3>
            <div className={styles.inputGrid}>
              {minerals.map((input) => (
                <NumberField
                  key={input.key}
                  label={input.label}
                  value={values[input.key]}
                  onValueChange={(value) =>
                    calculator.setValue(input.key, value)
                  }
                  hint={input.hint}
                  placeholder={input.placeholder}
                  min={0}
                  step={input.step}
                />
              ))}
            </div>
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Micronutrient Score
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
        title="Your Micronutrient Analysis"
        value={result ? `${result.overallScore}%` : '--'}
        category="Overall Score"
        description={result ? result.scoreDescription : undefined}
      >
        <h3 className={sharedStyles.sectionTitle}>Nutrient Breakdown</h3>
        <div className={styles.nutrientGrid}>
          {(result?.breakdown ?? []).map((nutrient) => (
            <div
              className={clsx(
                styles.nutrientItem,
                nutrient.status === 'adequate' && styles.nutrientAdequate,
                nutrient.status === 'insufficient' &&
                  styles.nutrientInsufficient,
                nutrient.status === 'deficient' && styles.nutrientDeficient,
              )}
              key={nutrient.key}
            >
              <span className={styles.nutrientName}>{nutrient.label}</span>
              <span className={styles.nutrientPercentage}>
                {nutrient.display}
              </span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Recommendations</h3>
        <ul className={styles.list}>
          {(result?.recommendations ?? []).map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      </ResultCard>
    </div>
  );
}
