import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateHeartRateZones,
  HEART_RATE_FITNESS_LEVELS,
  HEART_RATE_METHODS,
  validateHeartRateValues,
  type HeartRateFitnessLevel,
  type HeartRateMethod,
  type HeartRateResult,
  type HeartRateValues,
} from '../../lib/calculators/heartRate';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './HeartRateCalculator.module.css';

export type HeartRateCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: HeartRateValues = {
  age: '',
  restingHeartRate: '',
  fitnessLevel: '',
  method: 'karvonen',
};

const FITNESS_LEVEL_OPTIONS: readonly {
  value: HeartRateFitnessLevel;
  label: string;
}[] = HEART_RATE_FITNESS_LEVELS;

const METHOD_OPTIONS: readonly {
  value: HeartRateMethod;
  label: string;
}[] = HEART_RATE_METHODS;

export function HeartRateCalculator({
  shareEnvironment,
  onPrint,
}: HeartRateCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<HeartRateValues, HeartRateResult>({
    initialValues: INITIAL_VALUES,
    validate: validateHeartRateValues,
    calculate: calculateHeartRateZones,
    getSharePayload: (result) => ({
      title: 'Heart Rate Calculator Results',
      text: `My maximum heart rate is ${result.maxHR} BPM. Calculate your heart rate zones at Sports Tools Hub!`,
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
            Calculate Your Heart Rate Zones
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

          <NumberField
            label="Resting Heart Rate (Optional)"
            value={values.restingHeartRate}
            onValueChange={(value) =>
              calculator.setValue('restingHeartRate', value)
            }
            hint="Measure your heart rate upon waking for best accuracy"
            error={errors.restingHeartRate}
            placeholder="Resting heart rate"
            min={40}
            max={100}
            step={1}
          />

          <SelectField
            label="Fitness Level"
            value={values.fitnessLevel}
            onValueChange={(value) =>
              calculator.setValue('fitnessLevel', value as HeartRateFitnessLevel)
            }
            options={FITNESS_LEVEL_OPTIONS}
            placeholder="Select your fitness level"
            hint="Select your current fitness level for more accurate zones"
            error={errors.fitnessLevel}
            required
          />

          <ChoiceField
            legend="Calculation Method"
            value={values.method}
            onValueChange={(value) =>
              calculator.setValue('method', value as HeartRateMethod)
            }
            options={METHOD_OPTIONS as readonly ChoiceOption<HeartRateMethod>[]}
            error={errors.method}
            required
            layout="list"
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Zones
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
        title="Your Heart Rate Zones"
        value={result ? result.maxHR : '--'}
        unit="BPM"
        category={result ? 'Maximum Heart Rate' : '--'}
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
        <h3 className={sharedStyles.sectionTitle}>Training Zones</h3>
        <div className={styles.zonesGrid}>
          {result?.zones.map((zone) => (
            <div key={zone.zone} className={styles.zone}>
              <div className={styles.zoneHeader}>
                <span className={styles.zoneName}>{zone.label}</span>
                <span className={styles.zoneIntensity}>{zone.intensity}</span>
              </div>
              <div className={styles.zoneRange}>
                <span className={styles.zoneBpm}>
                  {zone.min}-{zone.max} BPM
                </span>
                <span className={styles.zonePercentage}>{zone.percentage}</span>
              </div>
              <div className={styles.zoneDescription}>
                {zone.description}
              </div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Training Recommendations</h3>
        <div className={sharedStyles.recommendation}>
          {result ? result.recommendation : ''}
        </div>
      </ResultCard>
    </div>
  );
}
