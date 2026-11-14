import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BODY_FAT_METHODS,
  CIRCUMFERENCE_UNITS,
  calculateBodyFat,
  validateBodyFatValues,
  type BodyFatGender,
  type BodyFatMethod,
  type BodyFatResult,
  type BodyFatValues,
} from '../../lib/calculators/bodyFat';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
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
import styles from './ToolCalculator.module.css';

export type BodyFatCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: BodyFatValues = {
  method: '',
  gender: '',
  age: '',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
  neck: '',
  neckUnit: 'cm',
  waist: '',
  waistUnit: 'cm',
  hip: '',
  hipUnit: 'cm',
  chest: '',
  abdominal: '',
  thigh: '',
  triceps: '',
  suprailiac: '',
};

const GENDER_OPTIONS = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const satisfies readonly ChoiceOption<BodyFatGender>[];

export function BodyFatCalculator({
  shareEnvironment,
  onPrint,
}: BodyFatCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<BodyFatValues, BodyFatResult>({
    initialValues: INITIAL_VALUES,
    validate: validateBodyFatValues,
    calculate: calculateBodyFat,
    getSharePayload: (result) => ({
      title: 'Body Fat Calculator Results',
      text: `My body fat percentage is ${result.display} (${result.category}). Calculate yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const usingFeet = values.heightUnit === 'ft';
  const showUsNavy = values.method === 'us-navy';
  const showSkinfold = values.method === 'skinfold';

  function setMethod(method: BodyFatMethod): void {
    calculator.setValues({...values, method});
  }

  function setGender(gender: BodyFatGender): void {
    calculator.setValues({...values, gender});
  }

  return (
    <div className={styles.layout}>
      <section className={styles.card} aria-labelledby={formTitleId}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} id={formTitleId}>
            Calculate Your Body Fat
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Method"
            value={values.method}
            onValueChange={setMethod}
            options={BODY_FAT_METHODS}
            placeholder="Select calculation method"
            hint="Choose your preferred calculation method"
            error={errors.method}
            required
          />

          <ChoiceField
            legend="Gender"
            value={values.gender}
            onValueChange={setGender}
            options={GENDER_OPTIONS}
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
            min={18}
            max={100}
            step={1}
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
                    step: 0.1,
                    required: true,
                  }
                : undefined
            }
          />

          {showUsNavy ? (
            <div className={styles.methodFields}>
              <h3 className={styles.methodTitle}>
                US Navy Method Measurements
              </h3>
              <UnitField
                label="Neck Circumference"
                value={values.neck}
                onValueChange={(value) =>
                  calculator.setValue('neck', value)
                }
                unit={values.neckUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('neckUnit', unit)
                }
                units={CIRCUMFERENCE_UNITS}
                hint="Measure at the narrowest point"
                error={errors.neck}
                placeholder="Neck circumference"
                required
                min={20}
                step={0.1}
              />
              <UnitField
                label="Waist Circumference"
                value={values.waist}
                onValueChange={(value) =>
                  calculator.setValue('waist', value)
                }
                unit={values.waistUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('waistUnit', unit)
                }
                units={CIRCUMFERENCE_UNITS}
                hint="Measure at the navel level"
                error={errors.waist}
                placeholder="Waist circumference"
                required
                min={50}
                step={0.1}
              />
              {values.gender === 'female' ? (
                <UnitField
                  label="Hip Circumference"
                  value={values.hip}
                  onValueChange={(value) =>
                    calculator.setValue('hip', value)
                  }
                  unit={values.hipUnit}
                  onUnitChange={(unit) =>
                    calculator.setValue('hipUnit', unit)
                  }
                  units={CIRCUMFERENCE_UNITS}
                  hint="Measure at the widest point"
                  error={errors.hip}
                  placeholder="Hip circumference"
                  required
                  min={70}
                  step={0.1}
                />
              ) : null}
            </div>
          ) : null}

          {showSkinfold ? (
            <div className={styles.methodFields}>
              <h3 className={styles.methodTitle}>
                Skinfold Measurements (mm)
              </h3>
              <p className={styles.methodDescription}>
                Use calipers to measure skinfold thickness in millimeters
              </p>

              {values.gender === 'male' ? (
                <>
                  <NumberField
                    label="Chest Skinfold"
                    value={values.chest}
                    onValueChange={(value) =>
                      calculator.setValue('chest', value)
                    }
                    error={errors.chest}
                    placeholder="Chest measurement in mm"
                    required
                    min={1}
                    max={50}
                    step={0.1}
                  />
                  <NumberField
                    label="Abdominal Skinfold"
                    value={values.abdominal}
                    onValueChange={(value) =>
                      calculator.setValue('abdominal', value)
                    }
                    error={errors.abdominal}
                    placeholder="Abdominal measurement in mm"
                    required
                    min={1}
                    max={50}
                    step={0.1}
                  />
                </>
              ) : null}

              {values.gender === 'female' ? (
                <>
                  <NumberField
                    label="Triceps Skinfold"
                    value={values.triceps}
                    onValueChange={(value) =>
                      calculator.setValue('triceps', value)
                    }
                    error={errors.triceps}
                    placeholder="Triceps measurement in mm"
                    required
                    min={1}
                    max={50}
                    step={0.1}
                  />
                  <NumberField
                    label="Suprailiac Skinfold"
                    value={values.suprailiac}
                    onValueChange={(value) =>
                      calculator.setValue('suprailiac', value)
                    }
                    error={errors.suprailiac}
                    placeholder="Suprailiac measurement in mm"
                    required
                    min={1}
                    max={50}
                    step={0.1}
                  />
                </>
              ) : null}

              <NumberField
                label="Thigh Skinfold"
                value={values.thigh}
                onValueChange={(value) =>
                  calculator.setValue('thigh', value)
                }
                error={errors.thigh}
                placeholder="Thigh measurement in mm"
                required
                min={1}
                max={50}
                step={0.1}
              />
            </div>
          ) : null}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Body Fat
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
        title="Your Body Fat Results"
        value={result ? result.display : '--'}
        category={result?.category ?? '--'}
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
        <h3 className={styles.sectionTitle}>Body Composition</h3>
        <div className={styles.compositionGrid}>
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Fat Mass</div>
            <div className={styles.compValue}>
              {result ? result.fatMassDisplay : '--'}
            </div>
          </div>
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Lean Mass</div>
            <div className={styles.compValue}>
              {result ? result.leanMassDisplay : '--'}
            </div>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Body Fat Categories</h3>
        {result ? (
          <div className={styles.ranges}>
            {result.ranges.map((range) => {
              const active =
                result.percentage >= range.min &&
                result.percentage < range.max;

              return (
                <div
                  key={range.name}
                  className={clsx(
                    styles.rangeItem,
                    active && styles.rangeActive,
                  )}
                  style={{background: range.color}}
                >
                  <span>{range.name}</span>
                  <span>
                    {range.min}
                    {range.max === 100 ? '+' : `-${range.max}`}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty}>
            Enter your measurements, then calculate to see your body fat
            category ranges.
          </p>
        )}

        <h3 className={styles.sectionTitle}>Recommendations</h3>
        {result ? (
          <div className={styles.recommendation}>{result.recommendation}</div>
        ) : (
          <p className={styles.empty}>
            Your recommendation appears after a successful calculation.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
