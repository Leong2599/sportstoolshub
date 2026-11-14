import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BMI_RANGES,
  calculateBmi,
  validateBmiValues,
  type BmiGender,
  type BmiResult,
  type BmiValues,
} from '../../lib/calculators/bmi';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  ShareButton,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import styles from './ToolCalculator.module.css';

export type BmiCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: BmiValues = {
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
  age: '',
  gender: '',
};

const GENDER_OPTIONS = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const satisfies readonly ChoiceOption<BmiGender>[];

export function BmiCalculator({
  shareEnvironment,
  onPrint,
}: BmiCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<BmiValues, BmiResult>({
    initialValues: INITIAL_VALUES,
    validate: validateBmiValues,
    calculate: calculateBmi,
    getSharePayload: (result) => ({
      title: 'BMI Calculator Results',
      text: `My BMI is ${result.display} (${result.category}). Calculate yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const usingFeet = values.heightUnit === 'ft';

  return (
    <div className={styles.layout}>
      <section className={styles.card} aria-labelledby={formTitleId}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} id={formTitleId}>
            Calculate Your BMI
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
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
            max={1000}
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
            min={usingFeet ? 2 : 50}
            max={usingFeet ? 8 : 300}
            step={0.1}
            secondary={
              usingFeet
                ? {
                    label: 'Inches',
                    value: values.inches,
                    onValueChange: (value) =>
                      calculator.setValue('inches', value),
                    error: errors.inches,
                    placeholder: 'in',
                    min: 0,
                    max: 11,
                    step: 0.1,
                    required: true,
                  }
                : undefined
            }
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Enter your age (optional but recommended)"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={1}
            max={120}
            step={1}
          />

          <ChoiceField
            legend="Gender"
            value={values.gender}
            onValueChange={(value) => calculator.setValue('gender', value)}
            options={GENDER_OPTIONS}
            error={errors.gender}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate BMI
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
        title="Your BMI Results"
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
        <h3 className={styles.sectionTitle}>BMI Categories</h3>
        <div className={styles.ranges}>
          {BMI_RANGES.map((range) => {
            const active =
              result !== null &&
              result.bmi >= range.min &&
              (range.max === null || result.bmi < range.max);

            return (
              <div
                key={range.category}
                className={clsx(
                  styles.rangeItem,
                  active && styles.rangeActive,
                )}
                style={{background: range.background, color: range.color}}
              >
                <span>{range.label}</span>
                <span>{range.display}</span>
              </div>
            );
          })}
        </div>

        <h3 className={styles.sectionTitle}>Recommendations</h3>
        {result ? (
          <div className={styles.recommendation}>{result.recommendation}</div>
        ) : (
          <p className={styles.empty}>
            Enter your details, then calculate to see your BMI category and
            recommendation.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
