import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateLbm,
  validateLbmValues,
  type LbmGender,
  type LbmResult,
  type LbmValues,
} from '../../lib/calculators/leanBodyMass';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  ResultCard,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './LeanBodyMassCalculator.module.css';

export type LeanBodyMassCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: LbmValues = {
  gender: 'male',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
};

const GENDER_OPTIONS: readonly {
  value: LbmGender;
  label: string;
}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function LeanBodyMassCalculator({
  shareEnvironment,
  onPrint,
}: LeanBodyMassCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<LbmValues, LbmResult>({
    initialValues: INITIAL_VALUES,
    validate: validateLbmValues,
    calculate: calculateLbm,
    getSharePayload: (result) => ({
      title: 'Lean Body Mass Calculator Results',
      text: `My lean body mass is ${result.lbmDisplay} kg and body fat percentage is ${result.bodyFatDisplay}%. Calculate yours at Sports Tools Hub!`,
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
            Calculate Your LBM
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <ChoiceField
            legend="Gender"
            value={values.gender}
            onValueChange={(value) => calculator.setValue('gender', value)}
            options={GENDER_OPTIONS as readonly ChoiceOption<LbmGender>[]}
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
            min={1}
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
            max={usingFeet ? 8 : 250}
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

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate LBM
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
        title="Your Estimated Results"
        value={result ? result.lbmDisplay : '--'}
        category={
          result ? 'Lean Body Mass (kg)' : '--'
        }
      >
        <div className={styles.compositionGrid}>
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Lean Body Mass</div>
            <div className={styles.compValue}>
              {result ? `${result.lbmDisplay} kg` : '-- kg'}
            </div>
          </div>
          <div className={styles.compItem}>
            <div className={styles.compLabel}>Body Fat Percentage</div>
            <div className={styles.compValue}>
              {result ? `${result.bodyFatDisplay}%` : '--%'}
            </div>
          </div>
        </div>
      </ResultCard>
    </div>
  );
}
