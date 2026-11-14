import {useId, type ReactNode} from 'react';
import {
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  parseNumber,
  round,
  toKilograms,
  toMeters,
  type HeightUnit,
  type WeightUnit,
} from '../../../lib/calculators/units';
import {
  validateFields,
  validateNumber,
  validateSelection,
  type FieldErrors,
} from '../../../lib/calculators/validation';
import type {ShareEnvironment} from '../../../lib/calculators/share';
import {ChoiceField, type ChoiceOption} from './ChoiceField';
import {NumberField} from './NumberField';
import {PrintButton} from './PrintButton';
import {ResultCard} from './ResultCard';
import {ResultRow} from './ResultRow';
import {ShareButton} from './ShareButton';
import {UnitField} from './UnitField';
import {useCalculator} from './useCalculator';
import styles from './CalculatorKit.module.css';

export type DemoExperience = 'beginner' | 'regular' | 'advanced';

export type DemoValues = {
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  age: string;
  experience: DemoExperience;
};

export type DemoResult = {
  score: number;
  category: string;
};

export type CalculatorKitDemoProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: DemoValues = {
  weight: '70',
  weightUnit: 'kg',
  height: '175',
  heightUnit: 'cm',
  inches: '',
  age: '30',
  experience: 'regular',
};

const EXPERIENCE_OPTIONS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to structured training',
  },
  {
    value: 'regular',
    label: 'Regular',
    description: 'Training most weeks',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Structured performance work',
  },
] as const satisfies readonly ChoiceOption<DemoExperience>[];

export function validateDemoValues(
  values: DemoValues,
): FieldErrors<DemoValues> {
  return validateFields(values, {
    weight: (value) =>
      validateNumber(value, {label: 'Weight', min: 1, max: 500}),
    height: (value) =>
      values.heightUnit === 'cm'
        ? validateNumber(value, {label: 'Height', min: 50, max: 250})
        : validateNumber(value, {
            label: 'Height (feet)',
            min: 1,
            max: 8,
          }),
    inches: (value) =>
      values.heightUnit === 'ft'
        ? validateNumber(value, {
            label: 'Inches',
            required: false,
            min: 0,
            max: 11,
          })
        : undefined,
    age: (value) =>
      validateNumber(value, {label: 'Age', required: false, min: 1, max: 120}),
    experience: (value) =>
      validateSelection(value, {label: 'Training experience'}),
  });
}

export function calculateDemoResult(values: DemoValues): DemoResult {
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);

  if (weight === null || height === null) {
    throw new Error('Demo values must be numeric.');
  }

  const inches =
    values.heightUnit === 'ft' ? parseNumber(values.inches) ?? 0 : 0;
  const weightKg = toKilograms(weight, values.weightUnit);
  const heightM = toMeters(height, values.heightUnit, inches);

  if (heightM <= 0) {
    throw new Error('Height must be greater than zero.');
  }

  const score = round(weightKg / (heightM * heightM), 1);
  const category =
    score < 18.5
      ? 'Below range'
      : score < 25
        ? 'Balanced'
        : score < 30
          ? 'Above range'
          : 'High';

  return {score, category};
}

export function CalculatorKitDemo({
  shareEnvironment,
  onPrint,
}: CalculatorKitDemoProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<DemoValues, DemoResult>({
    initialValues: INITIAL_VALUES,
    validate: validateDemoValues,
    calculate: calculateDemoResult,
    getSharePayload: (result) => ({
      title: 'Calculator kit demo result',
      text: `Demo score: ${result.score} (${result.category}).`,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const usingFeet = values.heightUnit === 'ft';

  return (
    <div className={styles.demo}>
      <header className={styles.demoHeader}>
        <p className={styles.demoEyebrow}>Internal harness</p>
        <h1 className={styles.demoTitle}>Calculator kit demo</h1>
        <p className={styles.demoIntro}>
          A small end-to-end form proving each primitive renders, validates,
          normalizes units, scrolls to the result, and shares only the result.
        </p>
      </header>

      <div className={styles.demoGrid}>
        <section className={styles.card} aria-labelledby={formTitleId}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle} id={formTitleId}>
              Demo inputs
            </h2>
          </div>
          <form className={styles.form} onSubmit={calculator.submit} noValidate>
            <UnitField
              label="Weight"
              value={values.weight}
              onValueChange={(value) => calculator.setValue('weight', value)}
              unit={values.weightUnit}
              onUnitChange={(unit) =>
                calculator.setValue('weightUnit', unit)
              }
              units={WEIGHT_UNITS}
              error={errors.weight}
              hint="Used only for the demo calculation."
              placeholder="Enter weight"
              required
              min={1}
              max={500}
              step={0.1}
            />

            <UnitField
              label="Height"
              value={values.height}
              onValueChange={(value) => calculator.setValue('height', value)}
              unit={values.heightUnit}
              onUnitChange={(unit) =>
                calculator.setValue('heightUnit', unit)
              }
              units={HEIGHT_UNITS}
              error={errors.height}
              primaryLabel={usingFeet ? 'Feet' : 'Height'}
              placeholder={usingFeet ? 'ft' : 'cm'}
              required
              min={usingFeet ? 1 : 50}
              max={usingFeet ? 8 : 250}
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
                    }
                  : undefined
              }
            />

            <NumberField
              label="Age (optional)"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              error={errors.age}
              hint="Optional, and never included in shared text."
              min={1}
              max={120}
              step={1}
              placeholder="Enter age"
            />

            <ChoiceField
              legend="Training experience"
              value={values.experience}
              onValueChange={(value) =>
                calculator.setValue('experience', value)
              }
              options={EXPERIENCE_OPTIONS}
              error={errors.experience}
              required
            />

            <div className={styles.formActions}>
              <button className={`${styles.button} ${styles.buttonPrimary}`} type="submit">
                Calculate demo score
              </button>
              <button
                className={`${styles.button} ${styles.buttonSecondary}`}
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
          title="Your demo result"
          value={result ? result.score : '--'}
          unit={result ? 'kg/m²' : undefined}
          category={result?.category}
          description={result ? 'Calculated locally in your browser.' : undefined}
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
              />
            </>
          }
        >
          {result ? (
            <>
              <ResultRow label="Category" value={result.category} />
              <ResultRow label="Calculation" value="weight ÷ height²" />
              <ResultRow
                label="Shared data"
                value="Result only"
                strong
              />
            </>
          ) : (
            <p className={styles.empty}>
              Enter your details, then calculate to see the result card,
              sharing, and print behavior.
            </p>
          )}
        </ResultCard>
      </div>
    </div>
  );
}
