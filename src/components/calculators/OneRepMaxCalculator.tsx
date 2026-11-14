import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateOneRepMaxResult,
  ONE_REP_MAX_FORMULAS,
  validateOneRepMaxValues,
  type OneRepMaxFormula,
  type OneRepMaxResult,
  type OneRepMaxValues,
} from '../../lib/calculators/oneRepMax';
import {WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  ResultCard,
  SelectField,
  UnitField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './OneRepMaxCalculator.module.css';

export type OneRepMaxCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: OneRepMaxValues = {
  weight: '',
  weightUnit: 'kg',
  reps: '',
  formula: 'epley',
};

export function OneRepMaxCalculator({
  shareEnvironment,
  onPrint,
}: OneRepMaxCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<OneRepMaxValues, OneRepMaxResult>({
    initialValues: INITIAL_VALUES,
    validate: validateOneRepMaxValues,
    calculate: calculateOneRepMaxResult,
    getSharePayload: (result) => ({
      title: 'One Rep Max Calculator Results',
      text: `My estimated one rep max is ${result.display} ${result.unit}. Calculate yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
    scrollOnResult: false,
  });
  const {values, errors, result} = calculator;

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Calculate Your 1RM
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <UnitField
            label="Weight Lifted"
            value={values.weight}
            onValueChange={(value) => calculator.setValue('weight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) => calculator.setValue('weightUnit', unit)}
            units={WEIGHT_UNITS}
            hint="Enter the weight you lifted"
            error={errors.weight}
            placeholder="Enter weight"
            required
            min={1}
            step={0.1}
          />

          <NumberField
            label="Repetitions"
            value={values.reps}
            onValueChange={(value) => calculator.setValue('reps', value)}
            hint="Enter 1 to 15 repetitions"
            error={errors.reps}
            placeholder="Reps"
            required
            min={1}
            max={15}
            step={1}
          />

          <SelectField
            label="Formula"
            value={values.formula}
            onValueChange={(value) =>
              calculator.setValue('formula', value as OneRepMaxFormula)
            }
            options={ONE_REP_MAX_FORMULAS as readonly {
              value: OneRepMaxFormula;
              label: string;
            }[]}
            hint="Choose a one-rep max formula"
            error={errors.formula}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate 1RM
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
        title="Your Estimated One Rep Max"
        value={result ? result.display : '--'}
        unit={result ? result.unit : undefined}
      >
        <h3 className={sharedStyles.sectionTitle}>Rep Max Progression</h3>
        <ul className={styles.repMaxList}>
          {result?.repMaxTable.map((row) => (
            <li key={row.reps} className={styles.repMaxItem}>
              <span>{row.reps} Reps:</span>
              <span>{row.estimatedWeight} {result.unit}</span>
            </li>
          ))}
        </ul>
      </ResultCard>
    </div>
  );
}
